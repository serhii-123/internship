import { Hono } from "hono";
import { serve } from "@hono/node-server";
import ExchangeController from "./controllers/exhcange/exchangeController";
import ExchangeService from "./services/exchageService/exchangeService";
import ExchangeRateModel from "./models/exchangeRateModel/exchangeRateModel";
import { connectDB } from "./db";
import { DB_URL } from "./config/env";
import CurrencyModel from "./models/currencyModel/currencyModel";
import MarketModel from "./models/marketModel/marketModel";

async function start() {
    const hono = new Hono();
    
    const db = await connectDB(DB_URL);

    const exchangeRateModel = new ExchangeRateModel(db);
    const currencyModel = new CurrencyModel(db);
    const marketModel = new MarketModel(db);

    const exchangeService = new ExchangeService(exchangeRateModel, currencyModel, marketModel);

    const exchangeController = new ExchangeController(exchangeService);

    hono.get('/currency', async c => await exchangeController.sendRate(c));

    serve({
        fetch: hono.fetch,
        hostname: '0.0.0.0',
        port: 3000
    });
}

start();