import z from "zod";

const sendShortenLinkBodySchema = z.object({
    url: z.string().min(7)
});

export default sendShortenLinkBodySchema;