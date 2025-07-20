import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { REFRESH_SECRET, ACCESS_SECRET } from '../config/env';
import RefreshTokenModel from '../refreshToken/refreshToken.model';

class JwtService {
    constructor(
        private readonly refreshTokenModel: RefreshTokenModel
    ) {}
    
    async createAuthTokens(userId: string): Promise<{refresh_token: string, access_token: string}> {
        const payload = { userId };
        const refresh_token: string = await jwt.sign(payload, REFRESH_SECRET, { expiresIn: '7d' });
        const access_token: string = await jwt.sign(payload, ACCESS_SECRET, { expiresIn: '15m' });

        const refreshTokenHash: string = await bcrypt.hash(refresh_token, 10);
        const createdAt: Date = new Date();
        const refreshTokenLifeTimeInMs: number = 1000 * 60 * 60 * 24 * 7;
        const expiresIn: Date = new Date(Date.now() + refreshTokenLifeTimeInMs);
        
        await this.refreshTokenModel.createRefreshToken(refreshTokenHash, createdAt, expiresIn, userId);
        
        return {
            refresh_token,
            access_token
        };
    }
}

export default JwtService;