import { Response } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';

const ACCESS_EXPIRATION = '15m';
const REFRESH_EXPIRATION = '7d';

const isProduction = process.env.NODE_ENV === 'production';

export const generateAccessToken = (payload: object) => {
    const ACCESS_SECRET = config.jwtAccessSecret;
    return jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRATION });
};

export const generateRefreshToken = (payload: object) => {
    const REFRESH_SECRET = config.jwtRefreshSecret;
    return jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRATION });
};

export const verifyAccessToken = (token: string) => {
    const ACCESS_SECRET = config.jwtAccessSecret;
    return jwt.verify(token, ACCESS_SECRET);
};

export const verifyRefreshToken = (token: string) => {
    const REFRESH_SECRET = config.jwtRefreshSecret;
    return jwt.verify(token, REFRESH_SECRET);
};

export const setAuthCookies = (res: Response, accessToken: string, refreshToken: string) => {
    res.cookie('access_token', accessToken, {
        httpOnly: true,
        secure: isProduction,            // true em produção (HTTPS), false em dev (HTTP)
        sameSite: isProduction ? 'none' : 'lax', // 'none' em produção, 'lax' em dev
        maxAge: 15 * 60 * 1000,
    });
    res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
};

export const clearAuthCookies = (res: Response) => {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
};