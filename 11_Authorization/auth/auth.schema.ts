import z from "zod";

const authBaseSchema = z.object({
    email: z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
    password: z.string().min(8)
});

const refreshTokenSchema = z.string().refine(s => (s.match(/\./g) || []).length === 3);

const signUpSchema = authBaseSchema;
const loginSchema = authBaseSchema;

export {
    signUpSchema,
    loginSchema,
    refreshTokenSchema,
};