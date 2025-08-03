import { Context } from "hono";
import { ZodError } from "zod";
import requestSchema from "./schemas/requestSchema";
import ExchangeService from "./types/exchangeService";

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
            const { currency, market, period } = await requestSchema.parseAsync(queries);
            const responseData = await this.exhcangeService.getCurrencyData(currency, market, period);
            
            return c.json(responseData);
        } catch(e) {
            console.log(e);
            if(e instanceof ZodError)
                return c.body('Bad request', 401);
            if(e instanceof Error)
                return c.body(e.message, 400);
        }
    }
}

export default ExchangeController;