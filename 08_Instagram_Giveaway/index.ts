import { config } from "dotenv";
import fs from 'fs/promises';

config();

const DIR: string = process.env.DIR as string;

async function start(dir: string) {
    const usernamesSet: Set<string> = new Set();
    const usernameDuplicates: Set<string> = new Set();
    const fileNames: string[] = await fs.readdir(__dirname + '/' + dir);
    let uniqueUsernamesCount = 0;
    
    for(let fileName of fileNames) {
        const filePath: string = __dirname + `/${dir}/${fileName}`;
        const fileContent: string = await fs.readFile(filePath, 'utf-8');
        const usernamesArr: string[] = fileContent.split('\n');

        for(let username of usernamesArr) {
            if(usernamesSet.has(username)) {
                if(!usernameDuplicates.has(username)) {
                    uniqueUsernamesCount--;
                    usernameDuplicates.add(username);

                    //console.log(uniqueUsernamesCount);

                }

                continue;
            }

            uniqueUsernamesCount++;
            usernamesSet.add(username);
        }
    }

    console.log(uniqueUsernamesCount);
}

start(DIR);