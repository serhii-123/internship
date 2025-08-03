interface ExchangeService {
    getCurrencyData: (
        currency: string,
        market?: string,
        period?: string
    ) => Promise<any>
}

export default ExchangeService;