import { config } from 'dotenv';
import axios from 'axios';
import { Bot, InlineKeyboard } from 'grammy';

config();

const botToken: string = process.env.BOT_TOKEN as string;
const weatherToken: string = process.env.WEATHER_TOKEN as string;
const bot: Bot = new Bot(botToken);
const baseUrl: string = 'https://api.openweathermap.org/data/2.5/weather';

bot.command('weather', c => {
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
    const res = await axios.get(baseUrl, {
        params: {
            q: 'Zhytomyr',
            units: 'metric',
            appid: weatherToken
        }
    });
    res.data;

    c.reply('Default weather');
});

bot.callbackQuery('weather_3_hour_interval', c => {
    c.reply('Weather 3 hour interval');
});

bot.callbackQuery('weather_6_hour_interval', c => {
    c.reply('Weather 6 hour interval');
});

bot.start();