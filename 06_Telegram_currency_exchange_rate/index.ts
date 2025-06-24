import { config } from 'dotenv';
import axios from 'axios';
import { Bot, Keyboard } from 'grammy';
import Weather from './Weather';
import Currency from './Currency';

config();

const botToken: string = process.env.BOT_TOKEN as string;
const weatherToken: string = process.env.WEATHER_TOKEN as string;
const bot: Bot = new Bot(botToken);
const weatherURL: string = 'https://api.openweathermap.org/data/2.5/weather';
const forecastURL: string = 'https://api.openweathermap.org/data/2.5/forecast';
const currencyURL: string = 'https://api.monobank.ua/bank/currency';

bot.command('start', async c => {
    const kb = new Keyboard()
        .text('Погода')
        .row()
        .text('Курс валют');
    
    c.reply('...', {
        reply_markup: kb
    });
});

bot.hears('Погода', async c => {
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
});

bot.hears('Курс валют', async c => {
    const kb = new Keyboard()
        .text('USD')
        .text('EUR')
        .row()
        .text('Попереднє меню');

    c.reply('...', {
        reply_markup: kb
    });
});

bot.hears('Попереднє меню', async c => {
    const kb = new Keyboard()
        .text('Погода')
        .row()
        .text('Курс валют');
    
    c.reply('...', {
        reply_markup: kb
    });
});

bot.hears('Вітер', async c => {
    const res = await axios.get(weatherURL, {
        params: {
            q: 'Zhytomyr',
            units: 'metric',
            appid: weatherToken,
            lang: 'uk'
        }
    });
    const data = res.data;
    const reply: string = await Weather.getWindReply(data);

    c.reply(reply);
});

bot.hears('Кожні 3 години', async c => {
    const res = await axios.get(forecastURL, {
        params: {
            q: 'Zhytomyr',
            units: 'metric',
            appid: weatherToken,
            lang: 'uk'
        }
    });
    const data = res.data;
    const reply: string = await Weather.getReplyWithInterval(data, 3);
    c.reply(reply);
});

bot.hears('Кожні 6 годин', async c => {
    const res = await axios.get(forecastURL, {
        params: {
            q: 'Zhytomyr',
            units: 'metric',
            appid: weatherToken,
            lang: 'uk'
        }
    });
    const data = res.data;
    const reply: string = await Weather.getReplyWithInterval(data, 6);
    c.reply(reply);
});

bot.hears('USD', async c => {
    const res = await axios.get(currencyURL);
    const data = res.data;
    const currencyObj = data.find(o => o.currencyCodeA === 840);
    const reply = await Currency.getReply(currencyObj, 'USD');

    c.reply(reply);
});

bot.hears('EUR', async c => {
    const res = await axios.get(currencyURL);
    const data = res.data;
    const currencyObj = data.find(o => o.currencyCodeA === 978);
    const reply = await Currency.getReply(currencyObj, 'EUR');

    c.reply(reply);
});

bot.start();