export type CurrencyData = {
    priceInUsd: string,
    receivedAt: string,
}

export interface CurrencyFetcherService {
    getCurrencyData: (name: string, period?: string) => Promise<CurrencyData[]>
}