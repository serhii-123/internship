import { MySql2Database } from "drizzle-orm/mysql2";

class FollowingCurrencyModel {
    constructor(
        private readonly db: MySql2Database
    ) {}
}

export default FollowingCurrencyModel;