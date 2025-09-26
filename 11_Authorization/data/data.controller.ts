import { Context } from "hono";
import JwtService from "../jwt/jwt.service";
import { accessTokenSchema, mePath } from "./data.schema";
import { ZodError } from "zod";
import { JsonWebTokenError } from "jsonwebtoken";

class DataController {
    constructor(
        private readonly jwtService: JwtService
    ) {}

    async getMe(c: Context) {
        try {
            const authHeader = c.req.header('Authorization');
            const token = authHeader?.split(' ')[1];
            const path = c.req.path;
            
            const validatedToken = await accessTokenSchema.parseAsync(token);
            
            await mePath.parseAsync(path);
            
            const num = path.replace('/me', '');

            await this
                .jwtService
                .verifyAccessToken(validatedToken);

            const { email } = await this
                .jwtService
                .getAccessTokenPayload(validatedToken);
            const responseBody = {
                request_num: num,
                data: {
                    username: email
                }
            };

            return c.json(responseBody);
        } catch(e) {
            return await this.handleError(e, c);
        }
    }

    private async handleError(e: any, c: Context) {
        if(e instanceof ZodError) {
            const { message } = e.issues[0];

            if(message === 'Not found')
                return c.json({ message }, 404);
            
            return c.json({ message }, 400);
        }

        if(e instanceof JsonWebTokenError)
            return c.json({ message: 'Token error' }, 401);

        return c.json({ message: 'Server error' }, 500);
    }
}

export default DataController;