import z from "zod";

const currencyByDateRequestSchema = z.object({
    currency: z.string().min(3),
    date: z.string().regex(/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z)/)
});

export default currencyByDateRequestSchema;