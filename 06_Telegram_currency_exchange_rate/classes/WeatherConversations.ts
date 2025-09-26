import { Context, Keyboard } from 'grammy';
import { MyContext, MyConversation } from '../types';
import { WeatherMsgBuilder, WeatherDataFetcher, KeyboardBuilder } from './index'

class WeatherConversations {
    static async windConversation(
        conversation: MyConversation,
        ctx0: Context,
        token: string,
    ) {
        const wdf: WeatherDataFetcher = new WeatherDataFetcher(token);

        try {
            let city: string = await conversation.external((ctx) => ctx.session.city);
            
            if(!city) {
                await ctx0.reply('Будь ласка, введіть місто');

                const ctx1 = await conversation.waitFor('message:text');
                city = ctx1.message.text;
            }

            const weatherData: string = await conversation.external(
                () => wdf.getData(city, 'weather')
            );
            const message: string = await conversation.external(
                () => WeatherMsgBuilder.getWindReply(weatherData)
            );

            await conversation.external((ctx) => { ctx.session.city = city });

            const kb: Keyboard = await KeyboardBuilder.getWeatherKeyboard(city);

            await ctx0.reply(message, { reply_markup: kb });
        } catch(e) {
            const kb = await KeyboardBuilder.getWeatherKeyboard();

            if(e instanceof Error)
                console.log(e.message);
            
            await conversation.external(c => { c.session.city = '' });
            await ctx0.reply(
                'Не вдалося отримати дані для вашого міста. Будь ласка, спробуйте ще раз',
                { reply_markup: kb }
            );
        }
    }
    static async weatherWithIntervalConversation(
        conversation: MyConversation,
        ctx0: Context,
        token: string,
        interval: 3 | 6
    ) {
        const wdf: WeatherDataFetcher = new WeatherDataFetcher(token);
        
        try {
            let city: string = await conversation.external((ctx) => ctx.session.city);
            
            if(!city) {
                await ctx0.reply('Будь ласка, введіть місто');

                const ctx1 = await conversation.waitFor('message:text');
                city = ctx1.message.text;
            }

            const weatherData: string = await conversation.external(
                () => wdf.getData(city, 'forecast')
            );
            const message: string = await conversation.external(
                () => WeatherMsgBuilder.getReplyWithInterval(weatherData, city, interval)
            );

            await conversation.external((ctx) => { ctx.session.city = city });
            
            const kb: Keyboard = await KeyboardBuilder.getWeatherKeyboard(city);

            await ctx0.reply(message, { reply_markup: kb });
        } catch(e) {
            const kb = await KeyboardBuilder.getWeatherKeyboard();

            if(e instanceof Error)
                console.log(e.message);

            await conversation.external(c => { c.session.city = '' });
            await ctx0.reply(
                'Не вдалося отримати дані для вашого міста. Будь ласка, спробуйте ще раз',
                {reply_markup: kb}
            );
        }
    }
    static async changeCityConversation(
        conversation: MyConversation,
        ctx0: Context,
    ) {
        await ctx0.reply('Будь ласка, введіть нове місто');

        const ctx1 = await conversation.waitFor('message:text');
        const city = ctx1.message.text;

        await conversation.external(c => { c.session.city = city });

        ctx0.reply('Нове місто задано');
    }
}

export default WeatherConversations;