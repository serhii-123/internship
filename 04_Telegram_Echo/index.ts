import { Bot } from 'grammy';
import { config } from 'dotenv';
config();

const token: string = process.env.TOKEN as string;
const bot = new Bot(token);

bot.hears('photo', c => {
    const url = `https://picsum.photos/200/300?random=${Date.now()}`;

    console.log(
        'Користувач ' + c.chat.first_name
        + (c.chat.last_name ? c.chat.last_name : '')
        + ' запросив зображення'
    );
    c.replyWithPhoto(url);
});

bot.on('message:text', c => {
    console.log(
        'Користувач ' + c.chat.first_name
        + (c.chat.last_name ? c.chat.last_name : '')
        +' написав ' + c.message.text
    );
    c.reply(`Ви написали: '${c.message.text}'`);
});

bot.start();