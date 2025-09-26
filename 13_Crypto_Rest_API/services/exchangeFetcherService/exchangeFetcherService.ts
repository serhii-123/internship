import axios from 'axios';
import { format } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz'
import ExchangeRateModel from "./types/exchangeRateModel";
import CurrencyModel from './types/currencyModel';
import MarketModel from './types/marketModel';
import ReceivingTimestampModel from './types/receivingTimestampModel';
import Currency from './types/currency';
import Market from './types/market';

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
        const timestamp = formatInTimeZone(new Date(), 'UTC', 'yyyy-MM-dd HH:mm:ss');
        const timestampId = await this.receivingTimestampModel.insertReceivingTimestamp(timestamp)
        
        await this.fetchFromCoinMarketCap(coinMarketApiKey, timestampId);
        await this.fetchFromCoinStats(coinStatsApiKey, timestampId);
        await this.fetchFromCoinPaprika(timestampId);
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

        await this.processCryptoData(cryptoData, market, timestampId);
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
        
        await this.processCryptoData(cryptoData, market, timestampId);
    }

    private async fetchFromCoinPaprika(timestampId: number) {
        const marketName = 'coinpaprika';
        const url = 'https://api.coinpaprika.com/v1/tickers';
        const market = await this.marketModel.getMarketByName(marketName);

        if(!market) throw new Error('No market found by given name');

        const res = await axios.get(url);
        const cryptoData = res.data;

        await this.processCryptoData(cryptoData, market, timestampId);
    }

    private async processCryptoData(data: any, market: Market, timestampId: number): Promise<void> {
        for(let o of data) {
            const currency = await this.findCurrency(o);

            if(!currency) continue;

            const priceInUsd: string = await this.getPriceInUsd(o, market.name);

            await this.saveExchangeRate(currency.id, market.id, priceInUsd, timestampId);
        }
    }

    private async getPriceInUsd(o: any, market: string): Promise<string> {
        switch(market.toLowerCase()) {
            case 'coinmarketcap':
                return o.quote.USD.price.toString();
            case 'coinstats':
                return o.price.toString();
            case 'coinpaprika':
                return o.quotes.USD.price;
            default:
                return '';
        }
    }

    private async saveExchangeRate(currencyId: number, marketId: number, priceInUsd: string, timestampId: number) {
        try {
            await this.exchangeRateModel.insertExchangeRate(
                currencyId, marketId, priceInUsd, timestampId
            );
        } catch(e) {}
    }

    private async findCurrency(o: { symbol: string }): Promise<Currency | null> {
        const symbol: string = o.symbol;
        const currency = await this.currencyModel.getCurrencyByName(symbol);

        return currency;
    }
}

export default ExchangeFetcherService;