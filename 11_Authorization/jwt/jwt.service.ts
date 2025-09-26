import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import _ from 'lodash'
import { REFRESH_SECRET, ACCESS_SECRET } from '../config/env';
import SessionModel from '../session/session.model';
import SessionNotFoundError from '../errors/SessionNotFoundError';
import InvalidJwtTokenError from '../errors/InvalidJwtTokenError';
import { AccessTokenPayload } from './jwt.type';

class JwtService {
    constructor(
        private readonly sessionModel: SessionModel
    ) {}
    
    async createAuthTokens(email: string, userId: string): Promise<{refresh_token: string, access_token: string}> {
        const originalRefreshToken: string = await this.createRefreshToken(email);
        const refreshTokenHash: string = await bcrypt.hash(originalRefreshToken, 10);
        const sessionId = await this.createTokenSession(refreshTokenHash, userId);

        const access_token = await this.createAccessToken(email, sessionId);
        const refresh_token: string = sessionId + '.' + originalRefreshToken;
        
        return {
            refresh_token,
            access_token
        };
    }

    async createAccessTokenByRefreshToken(refreshToken: string): Promise<string> {
        const dotIndex = refreshToken.indexOf('.');
        const sessionId = refreshToken.slice(0, dotIndex);
        const originalToken = refreshToken.slice(dotIndex + 1);
        const session = await this.sessionModel.getSessionById(sessionId);
        
        if(!session)
            throw new SessionNotFoundError();

        const { tokenHash } = session;
        const tokenIsSame = await bcrypt.compare(originalToken, tokenHash);

        if(!tokenIsSame)
            throw new InvalidJwtTokenError('refresh');

        const { email } = jwt.verify(originalToken, REFRESH_SECRET) as AccessTokenPayload;

        const accessToken = await this.createAccessToken(email, sessionId);

        return accessToken;
    }

    async verifyAccessToken(token: string): Promise<boolean> {
        jwt.verify(token, ACCESS_SECRET);

        return true;
    }

    async getAccessTokenPayload(token: string): Promise<AccessTokenPayload> {
        const payload = jwt.decode(token) as AccessTokenPayload;

        return payload;
    }

    private async createAccessToken(email: string, sessionId: string): Promise<string> {
        const accessTokenPayload = { email, sessionId };
        const accessTokenExpiresInTime = _.random(30, 60);
        const accessToken: string = jwt.sign(
            accessTokenPayload,
            ACCESS_SECRET,
            { expiresIn: `${accessTokenExpiresInTime}s` }
        );

        return accessToken;
    }

    private async createRefreshToken(email: string): Promise<string> {
        const payload = { email };
        const token: string = jwt.sign(
            payload,
            REFRESH_SECRET,
            { expiresIn: '7d' }
        );

        return token;
    }

    private async createTokenSession(tokenHash: string, userId: string): Promise<string> {
        const createdAt: Date = new Date();
        const refreshTokenLifeTimeInMs: number = 1000 * 60 * 60 * 24 * 7;
        const expiresIn: Date = new Date(Date.now() + refreshTokenLifeTimeInMs);
        const sessionId = await this
            .sessionModel
            .createSession(tokenHash, userId, createdAt, expiresIn);

        return sessionId;
    }
}

export default JwtService;