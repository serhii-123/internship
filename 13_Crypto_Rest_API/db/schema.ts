import { mysqlTable, primaryKey, unique, int, varchar, index, decimal, timestamp } from "drizzle-orm/mysql-core"

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
	receivedAt: timestamp("received_at", { mode: 'string' }).notNull(),
},
(table) => [
	index("fk_exchange_rates_currencies_currency_id_idx").on(table.currencyId),
	index("fk_exchange_rates_markets_market_id_idx").on(table.marketId),
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
