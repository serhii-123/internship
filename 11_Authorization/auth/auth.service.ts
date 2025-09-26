import bcrypt from 'bcrypt';
import { SignUpResponseDto } from "./dto/signUp.dto";
import UserModel from '../user/user.model';
import JwtService from '../jwt/jwt.service';
import { LoginResponseDto } from './dto/login.dto';
import AuthError from '../errors/AuthError';

class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userModel: UserModel,
    ) {}

    async signUp(email: string, password: string): Promise<SignUpResponseDto> {
        const passwordHash = await bcrypt.hash(password, 10);
        const userId = await this.userModel.createUser(email, passwordHash);
        const tokens = await this.jwtService.createAuthTokens(email, userId);
        
        return tokens;
    }

    async login(email: string, password: string): Promise<LoginResponseDto> {
        const user = await this.userModel.getUserByEmail(email);
        
        if(!user) throw new AuthError('user_not_found');

        const { id, passwordHash } = user;
        const passwordIsMatch = await bcrypt.compare(password, passwordHash);

        if(!passwordIsMatch)
            throw new AuthError('ivalid_password');
        
        const tokens = await this.jwtService.createAuthTokens(email, id);

        return tokens;
    }

    async refresh(refreshToken: string): Promise<string> {
        const access_token = await this.jwtService.createAccessTokenByRefreshToken(refreshToken);
        
        return access_token;
    }
}

export default AuthService;