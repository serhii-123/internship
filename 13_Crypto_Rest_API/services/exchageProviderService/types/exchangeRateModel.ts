interface ExchangeRateModel {
    getExchangeRateData: (
        currencyId: number,
        marketId?: number,
        period?: string
    ) => Promise<any>
}

export default ExchangeRateModel;