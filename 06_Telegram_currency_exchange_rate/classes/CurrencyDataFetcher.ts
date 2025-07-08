import axios from "axios";

class CurrencyDataFetcher {
    private static apiUrl: string = 'https://api.monobank.ua/bank/currency';

    static async getUSDData() {
        const res = await axios.get(this.apiUrl);
        const data = res.data;
        const currencyCode: number = 840;
        const currencyObj = data.find(o => o.currencyCodeA === currencyCode);

        return currencyObj;
    }

    static async getEURData() {
        const res = await axios.get(this.apiUrl);
        const data = res.data;
        const currencyCode: number = 978;
        const currencyObj = data.find(o => o.currencyCodeA === currencyCode);

        return currencyObj;
    }
}

export default CurrencyDataFetcher;
