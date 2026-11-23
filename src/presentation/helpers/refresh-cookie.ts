import type { CookieOptions } from 'express';
import { envs } from '../../config/envs';

export const REFRESH_TOKEN_COOKIE_NAME = 'refreshToken';

export const refreshTokenCookieOptions: CookieOptions = {
    httpOnly: true,
    secure: envs.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/api/auth', 
};