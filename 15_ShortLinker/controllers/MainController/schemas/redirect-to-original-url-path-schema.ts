import z from "zod";

const redirectToOriginalUrlSchema = z.string().length(6);

export default redirectToOriginalUrlSchema;