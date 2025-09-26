import z from "zod";

const currencyRequestSchema = z.object({
    currency: z.string().min(3),
    market: z.string('Invalid market name').min(5, 'Invalid market name').optional(),
    period: z.string().regex(/^(15m|1h|4h|24h)$/, 'Invalid period').optional()
});

export default currencyRequestSchema;