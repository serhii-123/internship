import { Context } from "hono";
import { SignUpRequestDto, SignUpResponseDto } from "./dto/signUp.dto";
import AuthService from "./auth.service";
import { MongoServerError } from "mongodb";

class AuthController {
    constructor(
        private readonly authService: AuthService
    ) {}

    async signUp(c: Context) {
        try {
            const body: SignUpRequestDto = await c.req.json();
            const keys: SignUpResponseDto = await this.authService.signUp(body);

            return c.json(keys);
        } catch(e) {
            if(e instanceof MongoServerError) {
                if(e.code === 11000) {
                    c.status(409);

                    return c.body(`A user with the specified email already exists`);
                } else {
                    c.status(500);
                    
                    return c.body('Server error. Please, try again later');
                }
            }
        }
    }
}

export default AuthController;