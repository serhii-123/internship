import { Context } from "hono";
import { AxiosError } from 'axios';
import { ZodError } from "zod";
import createShortUrlBodySchema
from "./schemas/create-short-url-body-schema";
import UrlMatchService from "./types/url-match-service";
import redirectToOriginalUrlSchema from "./schemas/redirect-to-original-url-path-schema";
import { DrizzleError } from "drizzle-orm";

class MainController {
    constructor(
        private readonly urlMatchService: UrlMatchService
    ) {}

    async redirectToOriginalUrl(c: Context) {
        try {
            const rawPath = c.req.path;
            const path = rawPath.slice(1);
            const validatedPath = await redirectToOriginalUrlSchema.parseAsync(path)
            const url = await this.urlMatchService.getOriginalUrlByShortPath(validatedPath);

            if(!url)
                return c.json({ message: 'Invalid URL' });

            return c.redirect(url, 301);
        } catch(e) {
            console.log(e);
            if(e instanceof ZodError || e instanceof DrizzleError)
                return c.json({ message: 'Invalid URL' }, 400)
        }
    }
    
    async createShortUrl(c: Context) {
        try {
            const body = await c.req.json();
            const { url: originalUrl} = await createShortUrlBodySchema
                .parseAsync(body);
            const shortPath = await this.urlMatchService.saveUrlMatch(originalUrl);
            const hostUrl = await this.getHostUrl(c.req.url);
            const shortUrl = `${hostUrl}/${shortPath}`;

            return c.json({ shortUrl });
        } catch(e) {
            if(e instanceof ZodError || e instanceof AxiosError)
                return c.json({ message: 'Invalid given URL' }, 400)
        }
    }

    private async getHostUrl(url: string): Promise<string> {
        const { protocol, host } = new URL(url);
        const hostUrl = `${protocol}//${host}`;
        
        return hostUrl;
    }
}

export default MainController;