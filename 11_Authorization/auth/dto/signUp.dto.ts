import z from "zod";
import { signUpSchema } from "../auth.schema";

export type SignUpRequestDto = z.infer<typeof signUpSchema>;

export type SignUpResponseDto = {
    access_token: string,
    refresh_token: string
};