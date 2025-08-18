import { ExchangeRateModel, CurrencyModel, MarketModel, Market } from './types';
import { format } from 'date-fns';

class ExchangeService {
    constructor(
        private readonly exchangeRateModel: ExchangeRateModel,
        private readonly currencyModel: CurrencyModel,
        private readonly marketModel: MarketModel,
    ) {}

    async getCurrencyData(
        currency: string,
        market?: string,
        period?: string
    ): Promise<any> {
        const currencyObj = await this
            .currencyModel
            .getCurrencyByName(currency.toLowerCase());
        let marketObj: Market | null = null;
        let periodDate: string | undefined = undefined;
        let exchangeRateData: any;

        if(!currencyObj) throw new Error('Cannot find currency');

        if(period)
            periodDate = await this.getPeriodDate(period);

        if(market) {
            marketObj = await this
                .marketModel
                .getMarketByName(market);

            if(!marketObj) throw new Error('Cannot find market');
            
            exchangeRateData = await this
                .exchangeRateModel
                .getExchangeRateData(currencyObj.id, marketObj.id, periodDate);
        } else
            exchangeRateData = await this
                .exchangeRateModel
                .getExchangeRateData(currencyObj.id, periodDate);

        return exchangeRateData;
    }

    private async getPeriodDate(period: string): Promise<string> {
        const lastIndex = period.length - 1;
        const unit = period[lastIndex];
        const numberStr = period.slice(0, lastIndex);
        const number = parseFloat(numberStr);
        let periodInMs: number;

        if(unit === 'm')
            periodInMs = 1000 * 60 * number;
        else
            periodInMs = 1000 * 60 * 60 * number;
        
        const periodDate = new Date(Date.now() - periodInMs);
        const periodStr = format(periodDate, 'yyyy-MM-dd HH:mm:ss');

        return periodStr;
    }
}

export default ExchangeService;