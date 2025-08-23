import { Context } from "grammy";
import { CurrencyModel } from "./types/currency-model";
import { UserModel } from "./types/user-model";
import { DrizzleQueryError } from "drizzle-orm";
import FollowingCurrencyModel from "./types/following-currency-model";

class CallbackQueryHandler {
    constructor(
        private readonly currencyModel: CurrencyModel,
        private readonly userModel: UserModel,
        private readonly followingCurrencyModel: FollowingCurrencyModel
    ) {}
    async handleAddToFollowing(ctx: Context): Promise<void> {
        try {
            const currencyName = ctx.callbackQuery?.data;

            if(!currencyName) {
                ctx.reply('Sorry, i can\'t handle your message. Please, try again');
                return;
            }

            const currency = await this.currencyModel.getCurrencyByName(currencyName);

            if(!currency) {
                ctx.reply('Sorry, i can\'t handle your message. Please, try again');
                return;
            }

            const tgUserId = ctx.from?.id;

            if(!tgUserId) {
                ctx.reply('Sorry, i can\'t get info about you. Please try again later');
                return;
            }
            
            const user = await this.userModel.getUserByUserId(tgUserId);
            let dbUserId = user?.id as number;

            if(!user)
                dbUserId = await this.userModel.insertUser(tgUserId);
            
            await this.followingCurrencyModel.insertFollowingCurrency(currency.id, dbUserId);
            
            ctx.reply('Currency successfully added to the following');
        } catch(e) {
            console.log(e);
        }
    }
}

export default CallbackQueryHandler