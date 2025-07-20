import bcrypt from 'bcrypt';
import { SignUpRequestDto, SignUpResponseDto } from "./dto/signUp.dto";
import { signUpSchema } from "./auth.schema";
import UserModel from '../user/user.model';
import JwtService from '../jwt/jwt.service';

class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userModel: UserModel,
    ) {}

    async signUp(body: SignUpRequestDto): Promise<SignUpResponseDto> {
        const { email, password } = await signUpSchema.parseAsync(body);
        const passwordHash: string = await bcrypt.hash(password, 10);
        const userId: string = await this.userModel.createUser(email, passwordHash);
        const tokens: SignUpResponseDto = await this.jwtService.createAuthTokens(userId);
        
        return tokens;
    }
}

export default AuthService;