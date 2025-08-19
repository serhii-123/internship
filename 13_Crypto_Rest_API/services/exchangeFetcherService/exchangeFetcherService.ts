import axios from 'axios';
import { format } from 'date-fns';
import ExchangeRateModel from "./types/exchangeRateModel";
import CurrencyModel from './types/currencyModel';
import MarketModel from './types/marketModel';
import ReceivingTimestampModel from './types/receivingTimestampModel';

class ExchangeFetcherService {
    constructor(
        private readonly marketModel: MarketModel,
        private readonly currencyModel: CurrencyModel,
        private readonly receivingTimestampModel: ReceivingTimestampModel,
        private readonly exchangeRateModel: ExchangeRateModel,
    ) {}

    async fetchData(
        coinMarketApiKey: string,
        coinStatsApiKey: string
    ) {
        const timestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
        const timestampId = await this.receivingTimestampModel.insertReceivingTimestamp(timestamp)
        
        await this.fetchFromCoinMarketCap(coinMarketApiKey, timestampId);
        await this.fetchFromCoinStats(coinStatsApiKey, timestampId);
    }

    private async fetchFromCoinMarketCap(
        apiKey: string,
        timestampId: number
    ): Promise<void> {
        const marketName = "coinmarketcap";
        const url = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest';
        const market = await this.marketModel.getMarketByName(marketName);

        if(!market) throw new Error('No market found by given name');

        const res = await axios.get(url, {
            params: { 'CMC_PRO_API_KEY': apiKey }
        });
        const cryptoData = res.data.data;

        for(let o of cryptoData) {
            const symbol: string = o.symbol;
            const currency = await this.currencyModel.getCurrencyByName(symbol);

            if(!currency) continue;

            const priceInUsd: string = o.quote.USD.price.toString();

            await this.exchangeRateModel.insertExchangeRate(
                currency.id, market.id, priceInUsd, timestampId
            );
        }
    }

    private async fetchFromCoinStats(apiKey: string, timestampId: number): Promise<void> {
        const marketName = 'coinstats';
        const url = 'https://openapiv1.coinstats.app/coins';
        const market = await this.marketModel.getMarketByName(marketName);

        if(!market) throw new Error('No market found by given name');

        const res = await axios.get(url, {
            headers: { 'X-API-KEY': apiKey }
        });
        const cryptoData = res.data.result;

        for(let o of cryptoData) {
            const symbol: string = o.symbol;
            const currency = await this.currencyModel.getCurrencyByName(symbol);

            if(!currency) continue;

            const priceInUsd: string = await o.price;

            await this.exchangeRateModel.insertExchangeRate(
                currency.id, market.id, priceInUsd, timestampId
            );
        }
    }
}

export default ExchangeFetcherService;