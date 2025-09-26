import axios, { AxiosError } from "axios";
import WeatherError from "./WeatherError";

class WeatherDataFetcher {
    private apiUrl: string = 'https://api.openweathermap.org/data/2.5';
    private readonly units: string = 'metric';
    private readonly lang: string = 'uk';
    private readonly token!: string;

    constructor(token: string) {
        this.token = token; 
    }

    async getData(city: string, type: 'forecast' | 'weather') {
        try {
            const url: string = `${this.apiUrl}/${type}`;
            const params = {
                units: this.units,
                lang: this.lang,
                appid: this.token,
                q: city
            };
            const res = await axios.get(url, {
                params
            });
            const data = res.data;

            return data;
        } catch(e) {
            if(e instanceof AxiosError)
                throw new WeatherError(e.message);
            else if(e instanceof Error)
                throw new Error(e.message);
            else
                throw new Error('Unknown error');
        }
    }
}

export default WeatherDataFetcher;