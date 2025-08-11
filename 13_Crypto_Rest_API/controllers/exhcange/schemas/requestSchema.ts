import z from "zod";

const requestSchema = z.object({
    currency: z.string().min(3),
    market: z.string().min(5).optional(),
    period: z.string().regex(/^([5-9]|[1-5][0-9]|60)m$|^([1-9]|1[0-9]|2[0-4])h$/).optional()
});

export default requestSchema;