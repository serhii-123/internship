export type Currency = {
    id: number,
    name: string;
}

export interface CurrencyModel {
    getCurrencyByName(name: string): Promise<Currency | null>
}