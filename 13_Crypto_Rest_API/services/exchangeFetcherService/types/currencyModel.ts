import Currency from "./currency";

interface CurrencyModel {
    getCurrencyByName: (name: string) => Promise<Currency | null>
}

export default CurrencyModel;