import z from "zod";

const signUpSchema = z.object({
    email: z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
    password: z.string().min(8)
});

export {
    signUpSchema
};