interface ExchangeRateModel {
    getExchangeRateData(currencyId: number, period?: string): Promise<any>,
    getExchangeRateData(currencyId: number, marketId: number, period?: string): Promise<any>
}

export default ExchangeRateModel;