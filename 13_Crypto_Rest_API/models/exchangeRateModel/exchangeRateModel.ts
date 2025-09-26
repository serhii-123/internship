import { MySql2Database } from "drizzle-orm/mysql2";
import { currencies, exchangeRates, markets, receivingTimestamps } from "../../db/schema";
import { and, eq, gte, desc, avg, asc } from "drizzle-orm";

class ExchangeRateModel {
    constructor(
        private readonly db: MySql2Database
    ) {}
    
    getExchangeRateData(currencyId: number, period?: string): Promise<any>;
    getExchangeRateData(currencyId: number, marketId: number, period?: string): Promise<any>;
    async getExchangeRateData(currencyId: number, marketIdOrPeriod?: number | string, maybePeriod?: string) {
        if(typeof marketIdOrPeriod === 'number')
            return await this.getExchangeRateDataForMarket(currencyId, marketIdOrPeriod, maybePeriod);
        else
            return await this.getExchangeRateDataWithAveragePrice(currencyId, marketIdOrPeriod);
    }

    async getFirstRowAfterDate(
        currencyId: number,
        date: string
    ): Promise<any> {
        const result = await this.db
            .select({
                priceInUsd: avg(exchangeRates.priceInUsd),
                receivedAt: receivingTimestamps.timestamp
            }).from(exchangeRates)
            .innerJoin(currencies, eq(exchangeRates.currencyId, currencies.id))
            .innerJoin(receivingTimestamps, eq(exchangeRates.receivingTimestampId, receivingTimestamps.id))
            .where(
                and(
                    eq(currencies.id, currencyId),
                    gte(receivingTimestamps.timestamp, date)
                )
            ).groupBy(currencies.name, receivingTimestamps.timestamp)
            .orderBy(asc(receivingTimestamps.timestamp))
            .limit(1);

        return result;
    }

    async insertExchangeRate(
        currencyId: number,
        marketId: number,
        priceInUsd: string,
        receivingTimestampId: number,
    ): Promise<boolean> {
        await this.db.insert(exchangeRates).values({currencyId, marketId, priceInUsd, receivingTimestampId});

        return true;
    }

    private async getExchangeRateDataWithAveragePrice(currencyId: number, period?: string): Promise<any> {
        const query = this.db
            .select({
                priceInUsd: avg(exchangeRates.priceInUsd),
                receivedAt: receivingTimestamps.timestamp
            }).from(exchangeRates)
            .innerJoin(
                currencies,
                eq(exchangeRates.currencyId, currencies.id)
            ).innerJoin(
                receivingTimestamps,
                eq(exchangeRates.receivingTimestampId, receivingTimestamps.id)
            ).where(
                and(
                    eq(currencies.id, currencyId),
                    period ? gte(receivingTimestamps.timestamp, period) : undefined
                )
            ).groupBy(currencies.name, receivingTimestamps.timestamp)
            .orderBy(desc(receivingTimestamps.timestamp));
        
        if(!period)
            query.limit(1);
        
        const result = await query;

        return result;
    }
    
    private async getExchangeRateDataForMarket(currencyId: number, marketId: number, period?: string): Promise<any> {
        let query = this.db
            .select({
                priceInUsd: exchangeRates.priceInUsd,
                receivedAt: receivingTimestamps.timestamp
            }).from(exchangeRates)
            .innerJoin(currencies, eq(exchangeRates.currencyId, currencies.id))
            .innerJoin(markets, eq(exchangeRates.marketId, markets.id))
            .innerJoin(receivingTimestamps, eq(exchangeRates.receivingTimestampId, receivingTimestamps.id))
            .where(
                and(
                    eq(exchangeRates.currencyId, currencyId),
                    eq(markets.id, marketId),
                    period ? gte(receivingTimestamps.timestamp, period) : undefined
                )
            ).orderBy(desc(exchangeRates.id));

        if(!period)
            query.limit(1);
        
        const result = await query;

        return result;
    }
}

export default ExchangeRateModel;