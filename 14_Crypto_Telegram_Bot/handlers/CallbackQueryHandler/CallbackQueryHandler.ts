import { Context } from "grammy";
import { DrizzleQueryError } from "drizzle-orm";
import { CurrencyModel } from "./types/currency-model";
import { UserModel } from "./types/user-model";
import FollowingCurrencyModel from "./types/following-currency-model";

class CallbackQueryHandler {
    constructor(
        private readonly currencyModel: CurrencyModel,
        private readonly userModel: UserModel,
        private readonly followingCurrencyModel: FollowingCurrencyModel
    ) {}

    async handleAddToFollowing(ctx: Context): Promise<void> {
        try {
            const contextData = await this.resolveContextData(ctx);

            if(!contextData) return;
            
            await this
                .followingCurrencyModel
                .insertFollowingCurrency(
                    contextData.currencyId,
                    contextData.dbUserId
                );
            
            ctx.reply('Currency successfully added to the following');
        } catch(e) {
            if(e instanceof DrizzleQueryError) {
                const code: number = (e as any)?.cause.errno;

                if(code === 1062)
                    ctx.reply('You already have this currency in the following');
                else
                    ctx.reply('Something went wrong. Please, try again later');
            }
        }
    }

    async handleRemoveFromFollowing(ctx: Context): Promise<void> {
        try {
            const contextData = await this.resolveContextData(ctx);

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

    private async resolveContextData(ctx: Context): Promise<{
        currencyId: number,
        dbUserId: number,
    } | null> {
        const callbackData = ctx.callbackQuery?.data;

        if(!callbackData) {
            ctx.reply('Sorry, i can\'t handle your message. Please, try again');
            return null;
        }

        const hyphenIndex = callbackData.indexOf('-');
        const currencyName = callbackData.slice(hyphenIndex + 1);
        const currency = await this.currencyModel.getCurrencyByName(currencyName);

        if(!currency) {
            ctx.reply('Sorry, i can\'t handle your message. Please, try again');
            return null;
        }

        const tgUserId = ctx.from?.id;

        if(!tgUserId) {
            ctx.reply('Sorry, i can\'t get info about you. Please try again later');
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

export default CallbackQueryHandler