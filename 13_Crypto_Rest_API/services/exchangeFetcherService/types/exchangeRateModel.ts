import Currency from "./currency";

interface ExchangeRateModel {
    insertExchangeRate(
        currencyId: number,
        marketId: number,
        priceInUsd: string,
        receivingTimestampId: number
    ): Promise<boolean>
}

export default ExchangeRateModel;