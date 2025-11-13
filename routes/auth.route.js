// /routes/auth.route.js

import { t } from 'elysia'
import { authSetup } from '../utils/auth.js'
import {
    login, refresh,
    logout, register
} from '../controllers/auth.controller.js'

export const authRoutes = (app) => {
    app.use(authSetup);
    app.post('/auth/login', async ({ body, set, accessJwt, refreshJwt }) => {
        return await login({ body, set, accessJwt, refreshJwt })
    }, {
        detail: {
            operationId: 'login',
            summary: "/auth/login",
            description: "Authenticate user with email and password to receive access token",
            tags: ["Authentication"],
            security: [],
        },
        body: t.Object({
            email: t.String({
                format: 'email',
                default: 'user@example.com'
            }),
            password: t.String({
                minLength: 6,
                default: 'password123'
            })
        }),
        response: {
            200: t.Object({
                status: t.String({ default: "success" }),
                accessToken: t.String(),
                response: t.Object({
                    id: t.Number(),
                    name: t.String(),
                    email: t.String()
                })
            }),
            422: t.Object({
                status: t.String({ default: "error" }),
                response: t.String({ default: "Validation failed" }),
                errors: t.Optional(t.Array(t.Object({
                    path: t.String(),
                    message: t.String(),
                }))),
            }),
            500: t.Object({
                status: t.String({ default: "error" }),
                response: t.String({ default: "Internal server error" }),
            }),
        },
    });

    app.post('/auth/refresh', async ({ cookie, set, accessJwt, refreshJwt }) => {
        return await refresh({ cookie, set, accessJwt, refreshJwt })
    }, {
        detail: {
            operationId: 'refreshToken',
            summary: "/auth/refresh",
            description: "Get new access token using refresh token",
            tags: ["Authentication"],
            security: [],
        },
        response: {
            200: t.Object({
                status: t.String({ default: "success" }),
                accessToken: t.String({ default: "eyJhbGciOiJIUzI1NiJ9..." }),
            }),
            401: t.Object({
                status: t.String({ default: "error" }),
                response: t.String({ default: "No refresh token provided" }),
            }),
            500: t.Object({
                status: t.String({ default: "error" }),
                response: t.String({ default: "Internal server error" }),
            }),
        },
    });

    app.post('/auth/logout', async ({ set }) => {
        return await logout({ set })
    }, {
        detail: {
            operationId: 'logout',
            summary: "/auth/logout",
            description: "Invalidate refresh token cookie",
            tags: ["Authentication"],
            security: [],
        },
        response: {
            200: t.Object({
                status: t.String({ default: "success" }),
                response: t.String({ default: "Logged out successfully" }),
            }),
            500: t.Object({
                status: t.String({ default: "error" }),
                response: t.String({ default: "Internal server error" }),
            }),
        },
    });

    app.post('/auth/register', async ({ body, set }) => {
        return await register({ body, set })
    }, {
        detail: {
            operationId: 'register',
            summary: "/auth/register",
            description: "Create a new user account",
            tags: ["Authentication"],
            security: [],
        },
        body: t.Object({
            name: t.String({
                minLength: 3,
                default: "John Doe"
            }),
            email: t.String({
                format: 'email',
                default: 'user@example.com'
            }),
            password: t.String({
                minLength: 6,
                default: 'password123'
            })
        }),
        response: {
            200: t.Object({
                status: t.String({ default: "success" }),
                response: t.Object({
                    id: t.Number(),
                    name: t.String(),
                    email: t.String()
                })
            }),
            409: t.Object({
                status: t.String({ default: "error" }),
                response: t.String({ default: "User with this email already exists" }),
            }),
            500: t.Object({
                status: t.String({ default: "error" }),
                response: t.String({ default: "Internal server error" }),
            }),
        },
    });
}