import z from "zod";

const sendShortenLinkBodySchema = z.object({
    url: z.string().min(7, 'URL is too short').max(2048, 'URL is too long')
});

export default sendShortenLinkBodySchema;