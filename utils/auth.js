// /utils/auth.js

import { jwt as elysiaJwt } from '@elysiajs/jwt'
import { cookie } from '@elysiajs/cookie'

// Configuration
const JWT_SECRET = process.env.JWT_SECRET || 'your-very-secure-secret'
const ACCESS_TOKEN_EXPIRES_IN = '15m' // 15 minutes
const REFRESH_TOKEN_EXPIRES_IN = '7d' // 7 days

// JWT setup
export const authSetup = (app) => {
    const accessJwt = elysiaJwt({
        name: 'accessJwt',
        secret: JWT_SECRET,
        exp: ACCESS_TOKEN_EXPIRES_IN
    })

    const refreshJwt = elysiaJwt({
        name: 'refreshJwt',
        secret: JWT_SECRET,
        exp: REFRESH_TOKEN_EXPIRES_IN
    })

    return app
        .use(cookie())
        .use(accessJwt)
        .use(refreshJwt);
}

// Generate tokens
export const generateTokens = async (accessJwt, refreshJwt, userId) => {
    try {
        const accessToken = await accessJwt.sign({ userId });
        const refreshToken = await refreshJwt.sign({ userId });
        return { accessToken, refreshToken }
    } catch (error) {
        console.error('Error generating tokens:', error);
        throw new Error('Failed to generate tokens');
    }
}

// Verify refresh token
export const verifyRefreshToken = async ({ refreshJwt }, token) => {
    try {
        return await refreshJwt.verify(token);
    } catch (error) {
        console.error('Error verifying refresh token:', error);
        return null
    }
}