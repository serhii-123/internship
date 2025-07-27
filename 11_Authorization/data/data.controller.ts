import { Context } from "hono";
import JwtService from "../jwt/jwt.service";
import { accessTokenSchema } from "./data.schema";
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
            const validatedToken = await accessTokenSchema.parseAsync(token);
            const { url } = c.req;
            const num = url[url.length - 1];

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
            c.status(400);

            return c.body('Ivalid data');
        }

        if(e instanceof JsonWebTokenError) {
            c.status(401);

            return c.body('Token error');
        }

        c.status(500);

        return c.body('Server error');
    }
}

export default DataController;