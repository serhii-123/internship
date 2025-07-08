import { config } from 'dotenv';
import { Bot, Keyboard } from 'grammy';
import WeatherMsgBuilder from './classes/WeatherMsgBuilder';
import CurrencyMsgBuilder from './classes/CurrencyMsgBuilder';
import CurrencyDataFetcher from './classes/CurrencyDataFetcher';
import WeatherDataFetcher from './classes/WeatherDataFetcher';

config();

async function start() {
    const botToken: string = process.env.BOT_TOKEN as string;
    const weatherToken: string = process.env.WEATHER_TOKEN as string;
    const bot: Bot = new Bot(botToken);
    const wdf: WeatherDataFetcher = new WeatherDataFetcher(weatherToken, 'Zhytomyr');

    bot.command('start', async c => {
        try {
            const kb = new Keyboard()
                .text('Погода')
                .row()
                .text('Курс валют');
            
            c.reply('...', {
                reply_markup: kb
            });
        } catch(e) {
            await handleBotHandlerError(e);
        }
    });

    bot.hears('Погода', async c => {
        try {
            const kb = new Keyboard()
                .text('Кожні 3 години')
                .text('Кожні 6 годин')
                .row()
                .text('Вітер')
                .row()
                .text('Попереднє меню');
            
            c.reply('...', {
                reply_markup: kb
            });
        } catch(e) {
            await handleBotHandlerError(e);
        }
    });

    bot.hears('Курс валют', async c => {
        try {
            const kb = new Keyboard()
                .text('USD')
                .text('EUR')
                .row()
                .text('Попереднє меню');

            c.reply('...', {
                reply_markup: kb
            });
        } catch(e) {
            await handleBotHandlerError(e);
        }
    });

    bot.hears('Попереднє меню', async c => {
        try {
            const kb = new Keyboard()
                .text('Погода')
                .row()
                .text('Курс валют');
            
            c.reply('...', {
                reply_markup: kb
            });
        } catch(e) {
            await handleBotHandlerError(e);
        }
    });

    bot.hears('Вітер', async c => {
        try {
            const data = await wdf.getData('weather');
            const msg: string = await WeatherMsgBuilder.getWindReply(data);

            c.reply(msg);
        } catch(e) {
            await handleBotHandlerError(e);
        }
    });

    bot.hears('Кожні 3 години', async c => {
        try { 
            const data = await wdf.getData('forecast');
            const msg: string = await WeatherMsgBuilder.getReplyWithInterval(data, 3);
            c.reply(msg);
        } catch(e) {
            await handleBotHandlerError(e);
        }
    });

    bot.hears('Кожні 6 годин', async c => {
        try {
            const data = await wdf.getData('forecast');
            const msg: string = await WeatherMsgBuilder.getReplyWithInterval(data, 6);
            c.reply(msg);
        } catch(e) {
            await handleBotHandlerError(e);
        }
    });

    bot.hears('USD', async c => {
        try {
            const currencyObj = await CurrencyDataFetcher.getUSDData(); 
            const msg: string = await CurrencyMsgBuilder.getMessage(currencyObj, 'USD');

            c.reply(msg);
        } catch(e) {
            await handleBotHandlerError(e);
        }
    });

    bot.hears('EUR', async c => {
        try {
            const currencyObj = await CurrencyDataFetcher.getEURData();
            const msg: string = await CurrencyMsgBuilder.getMessage(currencyObj, 'EUR');

            c.reply(msg);
        } catch(e) {
            await handleBotHandlerError(e);
        }
    });

    bot.catch((e) => {
        console.log(e.message);
    });

    async function handleBotHandlerError(e) {
        if(e instanceof Error)
            throw new Error(e.message);
        else
            throw new Error('Some error');
    }

    bot.start();
}

start();
