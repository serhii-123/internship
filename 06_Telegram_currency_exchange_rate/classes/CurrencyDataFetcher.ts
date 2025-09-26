import axios, { AxiosError } from "axios";
import CurrencyError from "./CurrencyError";
import { CurrencyData, CurrencyResponse } from "../types";

class CurrencyDataFetcher {
    private static monobankApiIUrl: string = 'https://api.monobank.ua/bank/currency';
    private static privatbankApiUrl: string = 'https://api.privatbank.ua/p24api/pubinfo?exchange&json&coursid=11';

    static async getUSDData(): Promise<CurrencyData> {
        try {
            const { response, bank } = await this.getData();

            if(bank === 'monobank') {
                const currencyCode: number = 840;
                const { rateBuy, rateSell } = response.find(o => o.currencyCodeA === currencyCode);
                const currData = await this.getCurrencyData('USD', rateBuy, rateSell, bank);

                return currData;
            } else {
                const { buy, sale } = response.find(o => o.ccy === 'USD');
                const currData = await this.getCurrencyData('USD', buy, sale, 'privatbank');

                return currData;
            }
        } catch(e) {
            throw e;
        }
    }

    static async getEURData() {
        try {
            const { response, bank } = await this.getData();

            if(bank === 'monobank') {
                const currencyCode: number = 978;
                const { rateBuy, rateSell } = response.find(o => o.currencyCodeA === currencyCode);
                const currData = await this.getCurrencyData('EUR', rateBuy, rateSell, 'monobank');

                return currData;
            } else {
                const { buy, sale } = response.find(o => o.ccy === 'EUR');
                const currData = await this.getCurrencyData('EUR', buy, sale, 'privatbank');

                return currData;
            }
        } catch(e) {
            throw e;
        }
    }

    private static async getCurrencyData(
        currency: 'USD' | 'EUR',
        rateBuy: string,
        rateSell: string,
        bank: 'monobank' | 'privatbank'
    ): Promise<CurrencyData> {
        const currObj: CurrencyData = {
            currency,
            rateBuy,
            rateSell,
            bank
        };

        return currObj;
    }

    private static async getData(): Promise<CurrencyResponse> {
        let response = await this.getMonobankData();

        if(response !== undefined) return { response, bank: 'monobank' };

        response = await this.getPrivatbankData();
        
        if(response !== undefined) return { response, bank: 'privatbank' }

        throw new CurrencyError(`Can't get any currency data`);
    }

    private static async getMonobankData() {
        try {
            const res = await axios.get(this.monobankApiIUrl);
            const data = res.data;

            return data;
        } catch {
            return undefined;
        }
    }

    private static async getPrivatbankData() {
        try {
            const res = await axios.get(this.privatbankApiUrl);
            const data = res.data;

            return data;
        } catch {
            return undefined;
        }
    }
}

export default CurrencyDataFetcher;