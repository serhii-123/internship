import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { CronJob } from 'cron';
import ExchangeController from "./controllers/exchange/exchangeController";
import ExchangeProviderService from "./services/exchageProviderService/exchangeProviderService";
import ExchangeRateModel from "./models/exchangeRateModel/exchangeRateModel";
import { connectDB } from "./db";
import {
    DB_URL,
    COINMARKETCAP_API_KEY,
    COINSTATS_API_KEY
} from "./config/env";
import CurrencyModel from "./models/currencyModel/currencyModel";
import MarketModel from "./models/marketModel/marketModel";
import ExchangeFetcherService from "./services/exchangeFetcherService/exchangeFetcherService";
import ReceivingTimestampModel from "./models/receivingTimestampModel/receivingTimestampModel";

async function start() {
    const hono = new Hono();
    
    const db = await connectDB(DB_URL);

    const exchangeRateModel = new ExchangeRateModel(db);
    const currencyModel = new CurrencyModel(db);
    const marketModel = new MarketModel(db);
    const receivingTimestampModel = new ReceivingTimestampModel(db);

    const exchangeProviderService = new ExchangeProviderService(exchangeRateModel, currencyModel, marketModel);
    const exchangeFetcherService = new ExchangeFetcherService(marketModel, currencyModel, receivingTimestampModel, exchangeRateModel);

    const exchangeController = new ExchangeController(exchangeProviderService);

    hono.get('/currency', async c => await exchangeController.sendRate(c));
    hono.get('/currency/by-date', async c => await exchangeController.sendRateByDate(c));

    serve({
        fetch: hono.fetch,
        hostname: '0.0.0.0',
        port: 3000
    });

    new CronJob(
        '0 */5 * * * *',
        async () => {
            console.log('Cron started');
            await exchangeFetcherService.fetchData(
                COINMARKETCAP_API_KEY,
                COINSTATS_API_KEY
            );
        },
        null,
        true,
        'Europe/Kyiv',
        null,
        true
    );
}

start();