import { config } from "dotenv";
import path from "path";
import z from "zod";

config({ path: path.resolve(__dirname, '../.env') });

const envSchema = z.object({
    DB_URL: z.string('Failed to get DB_URL from the .env file'),
    COINMARKETCAP_API_KEY: z.string('Failed to get COINMARKETCAP_API_KEY from the .env file'),
    COINSTATS_API_KEY: z.string('Failed to get COINSTATS_API_KEY from the .env file')
});

const env = envSchema.parse(process.env);

export const DB_URL = env.DB_URL;
export const COINMARKETCAP_API_KEY = env.COINMARKETCAP_API_KEY;
export const COINSTATS_API_KEY = env.COINSTATS_API_KEY;