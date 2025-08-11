import { MySql2Database } from "drizzle-orm/mysql2";
import { currencies, exchangeRates, markets } from "../../db/schema";
import { and, eq, gte, desc } from "drizzle-orm";

class ExchangeRateModel {
    constructor(
        private readonly db: MySql2Database
    ) {}

    async getExchangeRateData(
        currencyId: number,
        marketId?: number,
        period?: string
    ): Promise<any> {
        let result = await this.db
            .select({
                priceInUsd: exchangeRates.priceInUsd,
                receivedAt: exchangeRates.receivedAt
            })
            .from(exchangeRates)
            .innerJoin(
                currencies,
                eq(currencies.id, exchangeRates.currencyId)
            )
            .innerJoin(
                markets,
                eq(markets.id, exchangeRates.marketId)
            ).where(
                and(
                    eq(exchangeRates.currencyId, currencyId),
                    marketId ? eq(markets.id, marketId) : undefined,
                    period ? gte(exchangeRates.receivedAt, period) : undefined
                )
            ).orderBy(desc(exchangeRates.id));

        return result;
    }

    async insertExchangeRate(
        currencyId: number,
        marketId: number,
        priceInUsd: string,
        receivedAt: string,
    ): Promise<boolean> {
        await this.db.insert(exchangeRates).values({currencyId, marketId, priceInUsd, receivedAt});

        return true;
    }
}

export default ExchangeRateModel;