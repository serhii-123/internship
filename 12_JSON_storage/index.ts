import { Hono } from 'hono'
import { serve } from '@hono/node-server';
import * as env from './config/env';
import { connectDB } from './db/index';
import initDatabase from './db/initDatabase';
import Model from './model';
import Controller from './controller';

async function start() {
    const db = await connectDB(env.DB_CONNECTION_STRING);

    await initDatabase(db);

    const model = new Model(db);
    const controller = new Controller(model)

    const app = new Hono();

    app.post('/:doc*', c => controller.postDoc(c));
    app.get('/:doc*', c => controller.getDoc(c));

    serve({
        fetch: app.fetch,
        hostname: '0.0.0.0',
        port: 3000
    });
}

start();