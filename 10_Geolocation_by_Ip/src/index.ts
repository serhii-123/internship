import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { getConnInfo } from '@hono/node-server/conninfo';
import { config } from 'dotenv';
import IPService from './IPService';
import ipScheme from './schemes';

config({ path: '../.env' });

const IP_FILE_NAME: string = process.env.IP_FILE_NAME as string;
const PORT: number = parseInt(process.env.PORT as string);

async function start(ipFileName: string, port: number = 3000) {
    const app: Hono = new Hono();
    const ipService: IPService = new IPService();

    await ipService.init(ipFileName);

    app.get('/country', async c => {
        const info = getConnInfo(c);
        const rawHeader = c.req.header('x-forwarded-for');
        const ip: string = rawHeader?.split(',')[0].trim()
            || info.remote.address as string;

        try {
            await ipScheme.parseAsync(ip);
        } catch {
            c.status(400)
            
            return c.text(`Failed to obtain IP address or it is invalid`);
        }   

        const country = await ipService.getCountryByIP(ip);

        if(!country) {
            c.status(204);
            
            return c.text('There\'s no country for this IP')
        }

        const responseJson = { country, ip }
        
        return c.json(responseJson);
    });

    serve({
        fetch: app.fetch,
        hostname: '0.0.0.0',
        port
    });
}

start(IP_FILE_NAME, PORT);