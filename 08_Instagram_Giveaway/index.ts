import { config } from "dotenv";
import Analyser from "./Analyser";

config();

const DIR: string = process.env.DIR as string;

async function start(dir: string) {
    const t0 = performance.now();
    const uniqueUsernamesCount: number = await Analyser.countUniqueUsernames(dir);
    const t1 = performance.now();
    const usernamesAtleast10TimesCount: number = await Analyser.countUsernamesAtleast10Times(dir);
    const t2 = performance.now();
    const commonUsernamesCount: number = await Analyser.countCommonUsernames(dir);
    const t3 = performance.now();  

    console.log(
        `Number of unique usernames: ${uniqueUsernamesCount}. Execution time: ${t1 - t0}ms\n`
        + `Number of usernames found in at least 10 files: ${usernamesAtleast10TimesCount}. Execution time: ${t2 - t1}ms\n`
        + `Number of usernames found in all files: ${commonUsernamesCount}. Execution time: ${t3 - t2}ms\n`
        + `Common execution time: ${t3 - t0}ms`
    );
}

start(DIR);