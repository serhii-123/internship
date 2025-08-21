import { Context } from "hono";
import { ZodError } from "zod";
import currencyRequestSchema from "./schemas/currency-request-schema";
import ExchangeService from "./types/exchangeService";
import currencyByDateRequestSchema from "./schemas/currency-by-date-request-schema";

class ExchangeController {
    constructor(
        private readonly exhcangeService: ExchangeService
    ) {}

    async sendRate(c: Context) {
        try {
            const queries = {
                currency: c.req.query('currency'),
                market: c.req.query('market'),
                period: c.req.query('period')
            };
            const { currency, market, period } = await currencyRequestSchema.parseAsync(queries);
            const responseData = await this.exhcangeService.getCurrencyData(currency, market, period);
            
            return c.json(responseData);
        } catch(e) {
            console.log(e);
            if(e instanceof ZodError)
                return c.body('Bad request', 401);
            if(e instanceof Error)
                return c.body('Something went wrong', 400);
        }
    }

    async sendRateByDate(c: Context) {
        try {
            const queries = {
                currency: c.req.query('currency'),
                date: c.req.query('date')
            };
            const { currency, date } = await currencyByDateRequestSchema.parseAsync(queries);
            const responseData = await this.exhcangeService.getCurrencyRecordByDate(currency, date);

            return c.json(responseData);
        } catch(e) {
            if(e instanceof ZodError)
                return c.body('Bad request', 400);
            if(e instanceof Error)
                return c.body('Something went wrong', 400);
        }
    }
}

export default ExchangeController;