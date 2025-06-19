import { Bot } from 'grammy';

const token = '';
const bot = new Bot(token);

bot.on('message:text', c => {
    console.log(
        'Користувач' + c.chat.first_name
        + (c.chat.last_name ? c.chat.last_name : '')
        +' написав ' + c.message.text
    );
    c.reply(`Ви написали: '${c.message.text}'`);
});

bot.start();