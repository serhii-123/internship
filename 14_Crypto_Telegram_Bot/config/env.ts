import { config } from "dotenv";
import path from 'path';
import z from "zod";

config({ path: path.resolve(__dirname, '../.env') });

const envSchema = z.object({
    BOT_TOKEN: z.string('Failed to get BOT_TOKEN from the .env file'),
    DB_URL: z.string('Failed to get DB_URL from the .env file'),
    START_TEXT: z.string('Failed to get START_TEXT from the .env file'),
    HELP_TEXT: z.string('Failed to get HELP_TEXT from the .env file'),
    BASE_API_URL: z.string('Failed to get BASE_API_URL from the .env file')
});

const env = envSchema.parse(process.env);

export const BOT_TOKEN = env.BOT_TOKEN;
export const DB_URL = env.DB_URL;
export const START_TEXT = env.START_TEXT;
export const HELP_TEXT = env.HELP_TEXT;
export const BASE_API_URL = env.BASE_API_URL;