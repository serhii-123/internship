import axios from "axios";
import { DrizzleError } from 'drizzle-orm'
import PathGenerator from "../../utils/PathGenerator";
import UrlMatchModel from "./types/url-match-model";

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
        await axios.get(originalUrl);
                    
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
}

export default UrlMatchService;