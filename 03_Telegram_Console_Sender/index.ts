import { program } from "commander";
import { Telegraf } from "telegraf";

const token = "";
const bot = new Telegraf(token);

program
    .command('message')
    .argument('<string>')
    .action(str => {
        console.log('Some ' + str);
        bot.telegram.sendMessage('', str);
    });

program.parse();