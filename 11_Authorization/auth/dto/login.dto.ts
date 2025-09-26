import z from 'zod';
import { loginSchema } from '../auth.schema';

export type LoginRequestDto = z.infer<typeof loginSchema>

export type LoginResponseDto = {
    access_token: string,
    refresh_token: string,
}