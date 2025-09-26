import { confirm } from "@inquirer/prompts";
import axios from "axios";

class TinyUrlUtils {
    private static createUrl: string = 'https://api.tinyurl.com/create';

    static async askForShortneLink(): Promise<boolean> {
        const message: string = 'Would you like to shorten you link?';
        const shortify: boolean = await confirm({ message });

        return shortify;
    }

    static async shortenLink(token: string, fileUrl: string): Promise<string> {
        const reqUrl: string = `${this.createUrl}?url=${fileUrl}`
        
        try {
            const res = await axios.post(reqUrl, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            });
            const shortUrl = res.data.data.tiny_url;

            return shortUrl;
        } catch(e) {
            if(e instanceof Error)
                throw new Error('Error shorten file: ' + e.message);
            else
                throw new Error('Error shorten file');
        }
    }
}

export default TinyUrlUtils;