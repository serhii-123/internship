import { Bot } from 'grammy';
import {
    BOT_TOKEN, DB_URL, START_TEXT, HELP_TEXT, BASE_API_URL
} from './config/env';
import { connectDB } from './db';
import CurrencyFetcherService from './services/CurrencyFetcherService/CurrencyFetcherService';
import CurrencyModel from './models/CurrencyModel/CurrencyModel';
import CommandsHandler from './handlers/СommandHandler/CommandHandler';

async function start() {
    const bot = new Bot(BOT_TOKEN);

    const db = await connectDB(DB_URL);

    const currencyModel = new CurrencyModel(db);

    const currencyFetcherService = new CurrencyFetcherService(BASE_API_URL);
    const commandHandler = new CommandsHandler(currencyFetcherService, currencyModel);

    bot.command('start', async ctx => ctx.reply(START_TEXT));
    bot.command('help', async ctx => ctx.reply(HELP_TEXT));
    bot.command('list_recent', async ctx => commandHandler.handleListRecent(ctx));
    bot.hears(/^\/[A-Za-z]{3,5}$/, async ctx => commandHandler.handleSpecificCurrency(ctx));

    bot.start();
}

start();