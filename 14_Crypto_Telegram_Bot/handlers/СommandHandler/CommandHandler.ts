import { Context, InlineKeyboard } from "grammy";
import { formatInTimeZone } from 'date-fns-tz';
import { CurrencyModel } from "./types/currency-model";
import { CurrencyFetcherService } from "./types/currency-fetcher-service";
import FollowingCurrencyModel from "./types/following-currency-model";
import { UserModel } from "./types/user-model";
import { DrizzleQueryError } from "drizzle-orm";
import TimePoint from "./types/time-point";

class CommandsHandler {
    constructor(
        private readonly currencyFetcherService: CurrencyFetcherService,
        private readonly currencyModel: CurrencyModel,
        private readonly userModel: UserModel,
        private readonly followingCurrencyModel: FollowingCurrencyModel
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
            console.log(e);
            if(e instanceof Error)
                console.log(e.message);
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
            const keyboard = new InlineKeyboard()
                .text('Add to following', `add-${currencyName}`)
                .text('Remove from following', `remove-${currencyName}`);
            ctx.reply(answer, {
                reply_markup: keyboard
            });
        } catch(e) {
            if(e instanceof Error)
                console.log(e.message);
        }
    }

    async handleListFavourite(ctx: Context): Promise<void> {
        try {
            const tgUserId = ctx.from?.id

            if(!tgUserId) {
                await ctx.reply('Sorry, i can\'t get info about you. Please try again later');
                return;
            }

            const currencies = await this
                .followingCurrencyModel
                .getCurrencyNamesByUserId(tgUserId);

            if(currencies.length === 0) {
                await ctx.reply('You don\'t have favourite currencies');
                return;
            }

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
            if(e instanceof Error)
                console.log(e.message);
        }
    }

    async handleAddToFavourite(c: Context): Promise<void> {
        try {
            const contextData = await this.resolveContextDataForAddRemove(c);

            if(!contextData) return;

            await this
                .followingCurrencyModel
                .insertFollowingCurrency(
                    contextData.currencyId,
                    contextData.dbUserId
                );

            c.reply('Currency successfully added to the following');
        } catch(e) {
            if(e instanceof DrizzleQueryError) {
                const code: number = (e as any)?.cause.errno;

                if(code === 1062)
                    c.reply('You already have this currency in the following');
                else
                    c.reply('Something went wrong. Please, try again later');
            }
        }
    }

    async handlDeleteFavourite(ctx: Context): Promise<void> {
        try {
            const contextData = await this.resolveContextDataForAddRemove(ctx);

            if(!contextData) return;

            const affectedRows = await this
                .followingCurrencyModel
                .deleteFollowingCurrencyByCurrencyUserIds(
                    contextData.currencyId,
                    contextData.dbUserId
                );
            if(affectedRows === 1)
                ctx.reply('Currency successfully removed from the following');
            else
                ctx.reply('You did not have this currency in your following list');
        } catch(e) {
            if(e instanceof Error)
                ctx.reply('Something went wrong. Please, try again later');
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
        const timePointsOffsets: Record<TimePoint, number> = {
            '30 minutes ago': minInMs * 30,
            '1 hour ago': hourInMs,
            '3 hours ago': hourInMs * 3,
            '6 hours ago': hourInMs * 6,
            '12 hours ago': hourInMs * 12,
            '24 hours ago': hourInMs * 24,
        };
        let answer = `${currencyName} price history\n\n`

        for(let timePoint in timePointsOffsets) {
            const key = timePoint as keyof typeof timePointsOffsets;
            const timeInMs = currentDate.getTime() - timePointsOffsets[key];
            const timePointDate = new Date(timeInMs);
            const timestamp = formatInTimeZone(timePointDate, 'UTC', "yyyy-MM-dd'T'HH:mm:ss'Z'");
            const response = await this.
                currencyFetcherService
                .getCurrencyRecordByDate(currencyName, timestamp);
            const formattedPrice = await this.formatPrice(response[0].priceInUsd);
            const answerPart = `${timePoint} - ${formattedPrice} USD\n`;
            answer += answerPart;
        }
        
        return answer;
    }

    private async resolveContextDataForAddRemove(c: Context): Promise<{
        currencyId: number,
        dbUserId: number,
    } | null> {
        const msgText = c.message?.text;

        if(!msgText) {
            c.reply('Sorry, i can\'t handle your message. Please, try again');
            return null;
        }

        const spaceIndex = msgText.indexOf(' ');
        const currencyName = msgText.slice(spaceIndex + 1);
        const currency = await this.currencyModel.getCurrencyByName(currencyName);

        if(!currency) {
            c.reply('Sorry, i can\'t handle your message. Please, try again');
            return null;
        }

        const tgUserId = c.from?.id;

        if(!tgUserId) {
            c.reply('Sorry, i can\'t get info about you. Please try again later');
            return null;
        }
        
        const user = await this.userModel.getUserByTgUserId(tgUserId);
        let dbUserId = user?.id as number;

        if(!user)
            dbUserId = await this.userModel.insertUser(tgUserId);

        return {
            currencyId: currency.id,
            dbUserId
        };
    }
}

export default CommandsHandler;