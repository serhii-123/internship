import { config } from "dotenv";
import { defineConfig } from 'drizzle-kit';

config();

export default defineConfig({
    out: './db',
    schema: './db/schema.ts',
    dialect: 'mysql',
    dbCredentials: {
        url: process.env.DB_URL!,
    }
});