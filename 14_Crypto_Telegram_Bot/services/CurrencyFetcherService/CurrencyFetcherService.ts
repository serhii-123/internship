import axios from "axios";
import { CurrencyData } from "./types/currency-data";

class CurrencyFetcherService {
    constructor(
        private readonly baseUrl: string  
    ) {}

    async getCurrencyData(name: string, period?: string): Promise<CurrencyData[]> {
        let url = `${this.baseUrl}/currency?currency=${name}`;

        if(period)
            url = `${url}&period=${period}`;

        const res = await axios.get(url);
        const result = res.data.rateData as CurrencyData[];

        return result;
    }

    async getCurrencyRecordByDate(name: string, date: string) {
        const url = `${this.baseUrl}/currency/by-date?currency=${name}&date=${date}`;
        const res = await axios.get(url);
        const result = res.data;

        return result;
    }
}

export default CurrencyFetcherService;