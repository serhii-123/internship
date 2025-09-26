import { config } from "dotenv";
import path from "path";
import z from "zod";

config({ path: path.resolve(__dirname, '../.env') });

const envSchema = z.object({
    DB_URL: z.string('Failed to get DB_URL from the .env file')
});

const env = envSchema.parse(process.env);

export const DB_URL = env.DB_URL;