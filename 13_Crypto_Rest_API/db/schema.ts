import { mysqlTable, mysqlSchema, AnyMySqlColumn, primaryKey, unique, int, varchar, index, foreignKey, decimal } from "drizzle-orm/mysql-core"
import { sql } from "drizzle-orm"

export const currencies = mysqlTable("currencies", {
	id: int().autoincrement().notNull(),
	name: varchar({ length: 45 }).notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "currencies_id"}),
	unique("id_UNIQUE").on(table.id),
	unique("name_UNIQUE").on(table.name),
]);

export const exchangeRates = mysqlTable("exchange_rates", {
	id: int().autoincrement().notNull(),
	currencyId: int("currency_id").notNull().references(() => currencies.id),
	marketId: int("market_id").notNull().references(() => markets.id),
	priceInUsd: decimal("price_in_usd", { precision: 18, scale: 8 }).notNull(),
	receivingTimestampId: int("receiving_timestamp_id").notNull().references(() => receivingTimestamps.id),
},
(table) => [
	index("fk_exchange_rates_currencies_currency_id_idx").on(table.currencyId),
	index("fk_exchange_rates_markets_market_id_idx").on(table.marketId),
	index("exchange_rates_receiving_timestamps_receiving_timestamp_id_idx").on(table.receivingTimestampId),
	primaryKey({ columns: [table.id], name: "exchange_rates_id"}),
	unique("id_UNIQUE").on(table.id),
]);

export const markets = mysqlTable("markets", {
	id: int().autoincrement().notNull(),
	name: varchar({ length: 255 }).notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "markets_id"}),
	unique("id_UNIQUE").on(table.id),
	unique("name_UNIQUE").on(table.name),
]);

export const receivingTimestamps = mysqlTable("receiving_timestamps", {
	id: int().autoincrement().notNull(),
	timestamp: varchar({ length: 45 }).notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "receiving_timestamps_id"}),
	unique("id_UNIQUE").on(table.id),
	unique("timestamp_UNIQUE").on(table.timestamp),
]);
