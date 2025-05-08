// /routes/auth.route.js

import { authSetup } from '../utils/auth.js'
import { login, refresh, logout, register } from '../controllers/auth.controller.js'
import { t } from 'elysia'

export const authRoutes = (app) => {
    app.use(authSetup);
    app.post('/auth/login', async ({ body, set, jwt, refreshJwt }) => {
        return await login({ body, set, jwt, refreshJwt })
    }, {
        detail: {
            operationId: 'login',
            summary: "/auth/login",
            description: "Authenticate user with email and password to receive access token",
            tags: ["Authentication"],
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
            422: t.Object({
                status: t.String({ default: "fail" }),
                message: t.String({ default: "Validation error" }),
                errors: t.Optional(t.Array(t.Object({
                    field: t.String(),
                    message: t.String(),
                }))),
            }),
            500: t.Object({
                status: t.String({ default: "error" }),
                response: t.String({ default: "Internal server error" }),
            }),
        },
    });

    app.post('/auth/refresh', async ({ cookie, set, refreshJwt, jwt }) => {
        return await refresh({ cookie, set, refreshJwt, jwt })
    }, {
        detail: {
            operationId: 'refreshToken',
            summary: "/auth/refresh",
            description: "Get new access token using refresh token",
            tags: ["Authentication"],
            security: [{
                cookieAuth: []
            }],
        },
        response: {
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
        },
        response: {
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
            500: t.Object({
                status: t.String({ default: "error" }),
                response: t.String({ default: "Internal server error" }),
            }),
        },
    });
}