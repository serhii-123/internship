import { Context } from "grammy";
import { CurrencyModel } from "./types/currency-model";
import { CurrencyFetcherService } from "./types/currency-fetcher-service";

class CommandsHandler {
    constructor(
        private readonly currencyFetcherService: CurrencyFetcherService,
        private readonly currencyModel: CurrencyModel,
    ) {}

    async handleListRecent(ctx: Context): Promise<void> {
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
    }

    async formatPrice(rawPrice: string): Promise<string> {
        const price = parseFloat(rawPrice);

        if(price >= 1) return price.toFixed(2);
        if(price >= 0.01) return price.toFixed(4);
        
        return price.toFixed(8);
    }
}

export default CommandsHandler;