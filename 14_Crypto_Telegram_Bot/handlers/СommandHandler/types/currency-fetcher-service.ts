export type CurrencyData = {
    priceInUsd: string,
    receivedAt: string,
}

export interface CurrencyFetcherService {
    getCurrencyData: (name: string, period?: string) => Promise<CurrencyData[]>
    getCurrencyRecordByDate: (name: string, date: string) => Promise<CurrencyData[]>
}