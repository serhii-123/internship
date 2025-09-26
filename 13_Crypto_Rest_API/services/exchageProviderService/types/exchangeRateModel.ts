interface ExchangeRateModel {
    getExchangeRateData(currencyId: number, period?: string): Promise<any>,
    getExchangeRateData(currencyId: number, marketId: number, period?: string): Promise<any>,
    getFirstRowAfterDate(currencyId: number, date: string): Promise<any>
}

export default ExchangeRateModel;