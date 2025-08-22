import { Context } from "grammy";
import { formatInTimeZone } from 'date-fns-tz';
import { CurrencyModel } from "./types/currency-model";
import { CurrencyFetcherService } from "./types/currency-fetcher-service";

class CommandsHandler {
    constructor(
        private readonly currencyFetcherService: CurrencyFetcherService,
        private readonly currencyModel: CurrencyModel,
    ) {}

    async handleListRecent(ctx: Context): Promise<void> {
        try {
            const currencies = await this.currencyModel.getCurrencies();
            let answer = '';

            for(let currency of currencies) {
                const fetchedCurrencyData = await this
                    .currencyFetcherService
                    .getCurrencyData(currency.name);
                const fetchedCurrencyObj = fetchedCurrencyData[0];
                const formattedPrice = await this.formatPrice(fetchedCurrencyObj.priceInUsd);
                const answerPart = `/${currency.name} ${formattedPrice} USD\n`;

                answer += answerPart;
            }

            ctx.reply(answer);   
        } catch(e) {
            if(e instanceof Error) {
                console.log(e.message);
            }
        }
    }

    async handleSpecificCurrency(ctx: Context): Promise<void> {
        try {
            const msgText = ctx.message?.text as string;
            const currencyName = msgText.slice(1);
            const currencyObj = await this
                .currencyModel
                .getCurrencyByName(currencyName);

            if(!currencyObj) {
                ctx.reply('Sorry, i can\'t get information about given currency :(');
                return;
            }
            
            const answer = await this.getAnswerForSpecificCurrency(currencyName);

            ctx.reply(answer);
        } catch(e) {
            if(e instanceof Error) {
                console.log(e.message);
            }
        }
    }

    private async formatPrice(rawPrice: string): Promise<string> {
        const price = parseFloat(rawPrice);

        if(price >= 1) return price.toFixed(2);
        if(price >= 0.01) return price.toFixed(4);
        
        return price.toFixed(8);
    }

    private async getAnswerForSpecificCurrency(currencyName: string): Promise<string> {
        const minInMs = 1000 * 60;
        const hourInMs = minInMs * 60;
        const currentDate = new Date();
        const timePointsOffsets = {
            '30 minutes ago': minInMs * 30,
            '1 hour ago': hourInMs,
            '3 hours ago': hourInMs * 3,
            '6 hours ago': hourInMs * 6,
            '12 hours ago': hourInMs * 12,
            '24 hours ago': hourInMs * 24,
        };
        let answer = `${currencyName} price history\n\n`

        for(let timePoint in timePointsOffsets) {
            const timeInMs = currentDate.getTime() - timePointsOffsets[timePoint];
            const timePointDate = new Date(timeInMs);
            const timestamp = formatInTimeZone(timePointDate, 'UTC', "yyyy-MM-dd'T'HH:mm:ss'Z'");
            const response = await this.currencyFetcherService.getCurrencyRecordByDate(currencyName, timestamp);
            const formattedPrice = await this.formatPrice(response[0].priceInUsd);
            const answerPart = `${timePoint} - ${formattedPrice} USD\n`;
            answer += answerPart;
        }
        
        return answer;
    }
}

export default CommandsHandler;