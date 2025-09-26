interface ExchangeService {
    getCurrencyData: (
        currency: string,
        market?: string,
        period?: string
    ) => Promise<any>
    getCurrencyRecordByDate: (
        currency: string,
        date: string
    ) => Promise<any>
}

export default ExchangeService;