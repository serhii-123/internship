import { relations } from "drizzle-orm/relations";
import { currencies, exchangeRates, markets } from "./schema";

export const exchangeRatesRelations = relations(exchangeRates, ({one}) => ({
	currency: one(currencies, {
		fields: [exchangeRates.currencyId],
		references: [currencies.id]
	}),
	market: one(markets, {
		fields: [exchangeRates.marketId],
		references: [markets.id]
	}),
}));

export const currenciesRelations = relations(currencies, ({many}) => ({
	exchangeRates: many(exchangeRates),
}));

export const marketsRelations = relations(markets, ({many}) => ({
	exchangeRates: many(exchangeRates),
}));