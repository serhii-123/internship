import { drizzle, MySql2Database } from 'drizzle-orm/mysql2';

let db: MySql2Database;

export async function connectDB(connectionString: string)
    : Promise<MySql2Database> {
    if(db) return db;

    try {
        db = drizzle(connectionString);

        return db;
    } catch(e) {
        if(e.message)
            console.error('Failed to connect to DB: ', e);
            
        process.exit(1);
    }
}