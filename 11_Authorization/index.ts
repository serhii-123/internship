import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import * as env from './config/env';
import UserModel from './user/user.model';
import { connectDB } from './db';
import AuthController from './auth/auth.controller';
import SessionModel from './session/session.model';
import AuthService from './auth/auth.service';
import JwtService from './jwt/jwt.service';
import initDatabase from './db/initDatabase';
import DataController from './data/data.controller';

async function start() {
    const db = await connectDB();

    await initDatabase(db);
    
    const userModel = new UserModel(db);
    const sessionModel = new SessionModel(db);

    const jwtService: JwtService = new JwtService(sessionModel);
    const authService: AuthService = new AuthService(jwtService, userModel);
    
    const authController = new AuthController(authService);
    const dataController = new DataController(jwtService);

    const app = new Hono();

    app.post('/sign_up', c => authController.signUp(c));
    app.post('/login', c => authController.login(c));
    app.post('/refresh', c => authController.refresh(c));
    app.get('/me*', c => dataController.getMe(c));
    
    serve({
        fetch: app.fetch,
        hostname: '0.0.0.0',
        port: 3000
    }); 
}

start();