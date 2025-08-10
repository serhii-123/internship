import Currency from "./currency";

interface CurrencyModel {
    getCurrencies: () => Promise<Currency[] | null>
}

export default CurrencyModel;