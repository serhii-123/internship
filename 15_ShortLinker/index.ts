import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import MainController from './controllers/MainController/MainController';
import UrlMatchService from './services/UrlMatchService/UrlMatchService';
import { connectDB } from './db';
import { DB_URL } from './config/env';
import UrlMatchModel from './models/UrlMatchModel/UrlMatchModel';

async function start() {
    const hono = new Hono();

    const db = await connectDB(DB_URL);

    const urlMatchModel = new UrlMatchModel(db);
    const urlMatchService = new UrlMatchService(urlMatchModel);
    const mainController = new MainController(urlMatchService);

    hono.get('/:path*', c => mainController.redirectToOriginalUrl(c));
    hono.post('/create', c => mainController.createShortUrl(c));

    serve({
        fetch: hono.fetch,
        hostname: '0.0.0.0',
        port: 3000
    });
}

start();