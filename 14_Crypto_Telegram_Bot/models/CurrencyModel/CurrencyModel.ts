import { MySql2Database } from "drizzle-orm/mysql2";
import { currencies } from "../../db/schema";
import Currency from "./types/currency";

class CurrencyModel {
    constructor(
        private readonly db: MySql2Database
    )  {}

    async getCurrencies(): Promise<Currency[]> {
        const result = await this.db
            .select({
                id: currencies.id,
                name: currencies.name
            }).from(currencies);

        return result;
    }
}

export default CurrencyModel;