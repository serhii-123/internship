import axios from 'axios';
import ExchangeRateModel from "./types/exchangeRateModel";
import Currency from './types/currency';
import CurrencyModel from './types/currencyModel';
import MarketModel from './types/marketModel';

class ExchangeFetcherService {
    constructor(
        private readonly marketModel: MarketModel,
        private readonly currencyModel: CurrencyModel,
        private readonly exchangeRateModel: ExchangeRateModel,
    ) {}

    async fetchFromCoinMarketCap(
        marketName: string,
        url: string,
        apiKey: string,
    ): Promise<void> {
        const market = await this.marketModel.getMarketByName(marketName);

        if(!market) throw new Error('No market found by given name');

        const currencies = await this.currencyModel.getCurrencies();

        if(!currencies) throw new Error('No currencies in DB');

        const res = await axios.get(url, {
            headers: {
                'CMC_PRO_API_KEY': apiKey
            }
        });

        const cryptoData = res.data.data;

        for(let o of cryptoData) {
            const symbol: string = o.symbol;
            const currencyExistsInDb = await this.checkIsCurrencyExists(currencies, symbol);

            if(!currencyExistsInDb) continue;

            const price: number = o.quote.USD.price;

        }
    }

    private async checkIsCurrencyExists(
        currencies: Currency[],
        currency: string
    ): Promise<boolean> {
        const currencyObj = currencies.find(
            (el) => el.name.toLowerCase() === currency.toLowerCase()
        );

        return !!currencyObj;
    }
}

export default ExchangeFetcherService;