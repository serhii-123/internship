import { MySql2Database } from "drizzle-orm/mysql2";
import { currencies, exchangeRates, markets } from "../../db/schema";
import { and, eq, gte } from "drizzle-orm";

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
            .select()
            .from(exchangeRates)
            .innerJoin(
                currencies,
                eq(currencies.id, exchangeRates.currencyId)
            ).where(
                and(
                    eq(exchangeRates.currencyId, currencyId),
                    marketId ? eq(markets.id, marketId) : undefined,
                    period ? gte(exchangeRates.receivedAt, period) : undefined
                )
            );

        return result;
    }
}

export default ExchangeRateModel;