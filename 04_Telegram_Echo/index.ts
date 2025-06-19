import { Bot } from 'grammy';

const token = '7648991639:AAFZfo3zs3tsIcSpyULn_stQO3PDdPiQdxA';
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