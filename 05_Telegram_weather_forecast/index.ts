import { config } from 'dotenv';
import axios from 'axios';
import { Bot, InlineKeyboard } from 'grammy';
import getDefaultReply from './getDefaultReply';
import getReplyWithInterval from './getReplyWithInterval';

config();

const botToken: string = process.env.BOT_TOKEN as string;
const weatherToken: string = process.env.WEATHER_TOKEN as string;
const bot: Bot = new Bot(botToken);
const weatherURL: string = 'https://api.openweathermap.org/data/2.5/weather';
const forecastURL: string = 'https://api.openweathermap.org/data/2.5/forecast';

bot.command('start', c => {
    const kb = new InlineKeyboard()
        .text('Weather forecast in Zhytomyr', 'default_weather')
        .row()
        .text('With a 3 hour interval', 'weather_3_hour_interval')
        .text('With a 6 hour interval', 'weather_6_hour_interval');

    c.reply('Choose an option', {
        reply_markup: kb
    });
});

bot.callbackQuery('default_weather', async c => {
    const res = await axios.get(weatherURL, {
        params: {
            q: 'Zhytomyr',
            units: 'metric',
            appid: weatherToken,
            lang: 'uk'
        }
    });
    const data = res.data;
    const reply: string = await getDefaultReply(data);

    c.reply(reply);
});

bot.callbackQuery('weather_3_hour_interval', async c => {
    const res = await axios.get(forecastURL, {
        params: {
            q: 'Zhytomyr',
            units: 'metric',
            appid: weatherToken,
            lang: 'uk'
        }
    });
    const data = res.data;
    const reply: string = await getReplyWithInterval(data, 3);
    c.reply(reply);
});

bot.callbackQuery('weather_6_hour_interval', async c => {
    const res = await axios.get(forecastURL, {
        params: {
            q: 'Zhytomyr',
            units: 'metric',
            appid: weatherToken,
            lang: 'uk'
        }
    });
    const data = res.data;
    const reply: string = await getReplyWithInterval(data, 6);
    c.reply(reply);
});

bot.start();