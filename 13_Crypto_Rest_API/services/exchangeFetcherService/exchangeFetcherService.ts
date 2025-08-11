import axios from 'axios';
import { format } from 'date-fns';
import ExchangeRateModel from "./types/exchangeRateModel";
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

        const res = await axios.get(url, {
            params: { 'CMC_PRO_API_KEY': apiKey }
        });

        const cryptoData = res.data.data;

        for(let o of cryptoData) {
            const symbol: string = o.symbol;
            const currency = await this.currencyModel.getCurrencyByName(symbol);
            const timestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss');

            if(!currency) continue;

            const priceInUsd: string = o.quote.USD.price.toString();

            await this.exchangeRateModel.insertExchangeRate(
                currency.id,
                market.id,
                priceInUsd,
                timestamp
            );
        }
    }
}

export default ExchangeFetcherService;