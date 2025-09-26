import axios, { AxiosError } from "axios";
import { DrizzleError } from 'drizzle-orm'
import PathGenerator from "../../utils/PathGenerator";
import UrlMatchModel from "./types/url-match-model";
import UrlNotAvailableError from "../../errors/UrlNotAvailableError";

class UrlMatchService {
    constructor(
        private readonly urlMatchModel: UrlMatchModel
    ) {}

    async getOriginalUrlByShortPath(shortPath: string): Promise<string | undefined> {
        const result = await this.urlMatchModel.getOriginalUrlByShortPath(shortPath);

        if(!result.length)
            return undefined;
        
        const originalUrl = result[0].originalUrl;

        return originalUrl;
    }

    async saveUrlMatch(originalUrl: string): Promise<string> {
        const urlIsAccessible = await this.checkUrlAccessible(originalUrl);

        if(!urlIsAccessible) throw new UrlNotAvailableError('Given URL is not accessible');

        const existedUrlMatch = await this.urlMatchModel.getShortPathByOriginalUrl(originalUrl);

        if(existedUrlMatch.length)
            return existedUrlMatch[0].shortPath;
                    
        const pathLength = 6;
        const path = await PathGenerator.generate(pathLength);

        while(true) {
            try {
                await this.urlMatchModel.insertUrlMatch(originalUrl, path);

                break;
            } catch(e) {
                if(e instanceof DrizzleError)
                    if((e as any).cause?.code === 1062)
                        continue;
                    else throw e;
            }         
        }

        return path;
    }

    private async checkUrlAccessible(url: string): Promise<boolean> {
        try {
            await axios.get(url);
            return true;
        } catch(e) {
            if(e instanceof AxiosError) {
                const notAllowedStatuses = [400, 404, 406, 451];
                const status = e.response?.status;

                if(status)
                    if(notAllowedStatuses.includes(status))
                        return false;
                    else return true;
                else return false;
            } else throw e;
        }
    }
}

export default UrlMatchService;