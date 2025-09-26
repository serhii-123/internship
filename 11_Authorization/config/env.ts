import z from 'zod';
import { config } from 'dotenv';
import path from 'path';

config({ path: path.resolve(__dirname, '../.env')});

const envSchema = z.object({
    DB_CONNECTION_STRING: z.string("Failed to get DB_CONNECTION_STRING from the .env file"),
    REFRESH_SECRET: z.string('Failed to get REFRESH_SECRET from the .env file'),
    ACCESS_SECRET: z.string('Failed to get ACCESS_SECRET from the .env file')
});

const env = envSchema.parse(process.env);

export const DB_CONNECTION_STRING = env.DB_CONNECTION_STRING;
export const REFRESH_SECRET = env.REFRESH_SECRET;
export const ACCESS_SECRET = env.ACCESS_SECRET;