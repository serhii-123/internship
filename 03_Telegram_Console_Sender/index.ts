import fs from 'fs';
import { program } from "commander";
import { Telegraf } from "telegraf";

const token: string = "7648991639:AAFZfo3zs3tsIcSpyULn_stQO3PDdPiQdxA";
const chatId: number = 487039484;
const bot = new Telegraf(token);

bot.on('message', ctx => {
    console.log(ctx.chat.id);
});

program
    .command('message')
    .argument('<string>')
    .description('Sends a text')
    .action(str => {
        bot.telegram.sendMessage(chatId, str);
    });

program
    .command('picture')
    .argument('<string>')
    .description('Sends a picture')
    .action(str => {
        bot.telegram.sendPhoto(chatId, {
            source: fs.createReadStream(str)
        });
    });

program.parse();