import Currency from "./currency";

interface ExchangeRateModel {
    insertExchangeRate(
        currencyId: number,
        marketId: number,
        priceInUsd: number,
        receivedAt: Date
    ): Promise<boolean>
}

export default ExchangeRateModel;