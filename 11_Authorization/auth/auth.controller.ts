import { Context } from "hono";
import { SignUpResponseDto } from "./dto/signUp.dto";
import AuthService from "./auth.service";
import { MongoServerError } from "mongodb";
import { LoginResponseDto } from "./dto/login.dto";
import AuthError from "../errors/AuthError";
import { loginSchema, refreshTokenSchema, signUpSchema } from "./auth.schema";
import { ZodError } from "zod";
import InvalidJwtTokenError from "../errors/InvalidJwtTokenError";
import SessionNotFoundError from "../errors/SessionNotFoundError";
import { JsonWebTokenError } from "jsonwebtoken";

class AuthController {
    constructor(
        private readonly authService: AuthService
    ) {}

    async signUp(c: Context) {
        try {
            const body = await c.req.json().catch(() => null);

            if(!body) 
                return c.json({ message: 'Bad request' }, 400);

            const { email, password } = await signUpSchema.parseAsync(body);
            const keys: SignUpResponseDto = await this.authService.signUp(email, password);

            return c.json(keys);
        } catch(e) {
            if(e instanceof ZodError)
                return c.json({ message: 'Bad request' }, 400);

            if(e instanceof MongoServerError)
                if(e.code === 11000)
                    return c.json({ message: `A user with the specified email already exists` }, 409);
                else
                    return c.json({ message: 'Server error. Please, try again later' }, 500);

            return c.json({ message: 'Server error' }, 500);
        }
    }

    async login(c: Context) {
        try {
            const queries = {
                email: c.req.query('email'),
                password: c.req.query('password')
            };
            const { email, password } = await loginSchema.parseAsync(queries);
            const keys: LoginResponseDto = await this.authService.login(email, password);

            return c.json(keys);
        } catch(e) {
            if(e instanceof ZodError)
                return c.json({ message: 'Bad request' }, 400);

            if(e instanceof AuthError)
                return c.json({ message: 'Invalid email and/or password' }, 401);

            return c.json({ message: 'Server error' }, 500);
        }
    }

    async refresh(c: Context) {
        try {
            const authHeader = c.req.header('Authorization');

            if(!authHeader)
                return c.json({ message: 'No token provided' }, 401);

            const refreshToken = authHeader?.split(' ')[1];
            const validatedToken = await refreshTokenSchema.parseAsync(refreshToken);
            const access_token = await this.authService.refresh(validatedToken);

            return c.json({ access_token });
        } catch(e) {
            if(e instanceof ZodError)
                return c.json({ message: 'Invalid token' }, 401);

            if(
                e instanceof SessionNotFoundError
                || e instanceof InvalidJwtTokenError
                || e instanceof JsonWebTokenError
            )
                return c.json({ message: 'Unauthorized' }, 401);
            
            return c.json({ message: 'Server error' }, 500);
        }
    }
}

export default AuthController;