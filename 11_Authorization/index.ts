import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import * as env from './config/env';
import UserModel from './user/user.model';
import { connectDB } from './db';
import AuthController from './auth/auth.controller';
import RefreshTokenModel from './refreshToken/refreshToken.model';
import AuthService from './auth/auth.service';
import JwtService from './jwt/jwt.service';
import initDatabase from './db/initDatabase';

async function start() {
    const db = await connectDB();

    await initDatabase(db);
    
    const userModel = new UserModel(db);
    const refreshTokenModel = new RefreshTokenModel(db);

    const jwtService: JwtService = new JwtService(refreshTokenModel);
    const authService: AuthService = new AuthService(jwtService, userModel);
    
    const authController = new AuthController(authService);

    const app = new Hono();

    app.post('/sign_up', c => authController.signUp(c));
    app.get('/login');
    app.get('/refresh');
    app.get('/me[0-9]');

    serve({
        fetch: app.fetch,
        hostname: '0.0.0.0',
        port: 3000
    }); 
}

start();