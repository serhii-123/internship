import { config } from 'dotenv';
import { program } from "commander";
import { Bot, InputFile } from 'grammy';

config();

const token: string = process.env.TOKEN as string;
const chatId: string = process.env.CHAT_ID as string;
const bot = new Bot(token);

bot.on('message', ctx => {
    console.log(ctx.chat.id);
});

program
    .command('message')
    .argument('<string>')
    .description('Sends a text')
    .action(str => {
        bot.api.sendMessage(chatId, str);
    });

program
    .command('picture')
    .argument('<string>')
    .description('Sends a picture')
    .action(str => {
        bot.api.sendPhoto(chatId, new InputFile(str));
    });

program.parse();