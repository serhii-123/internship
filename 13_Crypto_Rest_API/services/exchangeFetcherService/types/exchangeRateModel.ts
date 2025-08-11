import Currency from "./currency";

interface ExchangeRateModel {
    insertExchangeRate(
        currencyId: number,
        marketId: number,
        priceInUsd: string,
        receivedAt: string
    ): Promise<boolean>
}

export default ExchangeRateModel;