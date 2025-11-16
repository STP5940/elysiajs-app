// /controllers/auth.controller.js

import Users from "../models/users.js";

import { generateTokens, verifyRefreshToken } from '../utils/auth.js'

const usersModel = new Users()

export const login = async ({ body, set, accessJwt, refreshJwt }) => {
    try {
        const { email, password } = body;

        const user = await usersModel.getByEmail(email);

        if (!user) {
            set.status = 401;
            return { status: "error", response: "Invalid email or password" };
        }

        const isPasswordValid = await Bun.password.verify(password, user.password);
        if (!isPasswordValid) {
            set.status = 401;
            return { status: "error", response: "Invalid email or password" };
        }

        const tokens = await generateTokens(accessJwt, refreshJwt, user.id);

        set.cookie = {
            refreshToken: {
                value: tokens.refreshToken,
                httpOnly: true,
                path: '/',
                maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
                secure: true,
                sameSite: 'Strict'
            }
        }

        set.status = 200;
        return {
            status: "success",
            accessToken: tokens.accessToken,
            response: {
                id: user.id,
                name: user.name,
                email: user.email,
            }
        };
    } catch (e) {
        console.error(e.message);

        set.status = 500;
        return { status: "error", response: "Internal server error" };
    }
}

export const refresh = async ({ cookie, set, accessJwt, refreshJwt }) => {
    try {
        const token = cookie?.refreshToken.value;

        if (!token) {
            set.status = 401;
            return { status: "error", response: "No refresh token provided" };
        }

        const payload = await verifyRefreshToken({ refreshJwt }, token);

        if (!payload) {
            set.status = 403;
            return { status: "error", response: "Invalid or expired refresh token" };
        }

        const tokens = await generateTokens(accessJwt, refreshJwt, payload.userId);

        set.cookie = {
            refreshToken: {
                value: tokens.refreshToken,
                httpOnly: true,
                path: '/',
                maxAge: 7 * 24 * 60 * 60,
                secure: true,
                sameSite: 'Strict'
            }
        }

        set.status = 200;
        return { status: "success", accessToken: tokens.accessToken };
    } catch (e) {
        console.error(e.message);

        set.status = 500;
        return { status: "error", response: "Internal server error" };
    }
}

export const logout = async ({ set }) => {
    try {
        set.cookie = {
            refreshToken: {
                value: '',
                httpOnly: true,
                path: '/',
                maxAge: 0,
                secure: true,
                sameSite: 'Strict'
            }
        }

        set.status = 200;
        return { status: "success", response: "Logged out successfully" };
    } catch (e) {
        console.error(e.message);

        set.status = 500;
        return { status: "error", response: "Internal server error" };
    }
}

export const register = async ({ body, set }) => {
    try {
        const { name, email, password } = body;

        const existing = await usersModel.getByEmail(email)
        if (existing) {
            set.status = 409
            return { status: "error", response: "User with this email already exists" };
        }

        const user = await usersModel.create(name, email, password)

        set.status = 200;
        return { status: "success", response: user };
    } catch (e) {
        console.error(e.message);

        set.status = 500;
        return { status: "error", response: "Internal server error" };
    }
}
