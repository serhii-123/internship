export type Currency = {
    id: number,
    name: string;
}

export interface CurrencyModel {
    getCurrencies(): Promise<Currency[]>
    getCurrencyByName(name: string): Promise<Currency | null>
}