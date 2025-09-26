import { MySql2Database } from "drizzle-orm/mysql2";
import { receivingTimestamps } from "../../db/schema";

class ReceivingTimestampModel {
    constructor(
        private readonly db: MySql2Database
    ) {}

    async insertReceivingTimestamp(timestamp: string): Promise<number> {
        const result = await this.db
            .insert(receivingTimestamps)
            .values({ timestamp });
        const id = result[0].insertId;

        return id;
    }
}

export default ReceivingTimestampModel;