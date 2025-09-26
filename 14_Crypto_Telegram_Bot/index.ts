import { Bot } from 'grammy';
import {
    BOT_TOKEN, DB_URL, START_TEXT, HELP_TEXT, BASE_API_URL
} from './config/env';
import { connectDB } from './db';
import CurrencyFetcherService from './services/CurrencyFetcherService/CurrencyFetcherService';
import CurrencyModel from './models/CurrencyModel/CurrencyModel';
import CommandsHandler from './handlers/СommandHandler/CommandHandler';
import CallbackQueryHandler from './handlers/CallbackQueryHandler/CallbackQueryHandler';
import UserModel from './models/UserModel/UserModel';
import FollowingCurrencyModel from './models/FollowingCurrencyModel/FollowingCurrencyModel';

async function start() {
    const bot = new Bot(BOT_TOKEN);

    const db = await connectDB(DB_URL);

    const currencyModel = new CurrencyModel(db);
    const userModel = new UserModel(db);
    const followingCurrencyModel = new FollowingCurrencyModel(db);

    const currencyFetcherService = new CurrencyFetcherService(BASE_API_URL);

    const commandHandler = new CommandsHandler(currencyFetcherService, currencyModel, userModel, followingCurrencyModel);
    const callbackQueryHandler = new CallbackQueryHandler(currencyModel, userModel, followingCurrencyModel);

    bot.command('start', async c => c.reply(START_TEXT));
    bot.command('help', async c => c.reply(HELP_TEXT));
    bot.command('listRecent', async c => commandHandler.handleListRecent(c));
    bot.command('listFavourite', async c => commandHandler.handleListFavourite(c));

    bot.callbackQuery(/^add-[A-Za-z]{3,5}$/, async c => callbackQueryHandler.handleAddToFollowing(c));
    bot.callbackQuery(/^remove-[A-Za-z]{3,5}$/, async c => callbackQueryHandler.handleRemoveFromFollowing(c));
    
    bot.hears(/^\/[A-Za-z]{3,5}$/, async c => commandHandler.handleSpecificCurrency(c));
    bot.hears(/^\/addToFavourite [A-Za-z]{3,5}$/, async c => commandHandler.handleAddToFavourite(c));
    bot.hears(/^\/deleteFavourite [A-Za-z]{3,5}$/, async c => commandHandler.handlDeleteFavourite(c));

    bot.catch(err => {
        console.error('Error occurred:', err);
    });

    bot.start();
}

start();