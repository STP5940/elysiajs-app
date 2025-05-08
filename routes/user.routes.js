// routes/user.routes.js

import { t } from 'elysia';
import {
    getUsers, getUserById,
    createUser, updateUser,
    deleteUser
} from '../controllers/user.controller.js';

export const userRoutes = (app) => {
    app.get('/users', getUsers, {
        detail: {
            operationId: 'getAllUsers',
            summary: "/users",
            description: "Get Users All",
            tags: ["Users"],
        },
        response: {
            200: t.Object({
                status: t.String({ default: "success" }),
                response: t.Array(
                    t.Object({
                        id: t.Number(),
                        name: t.String(),
                        email: t.String(),
                    })
                ),
            }),
            404: t.Object({
                status: t.String({ default: "error" }),
                response: t.String({ default: "User not found" }),
            }),
            500: t.Object({
                status: t.String({ default: "error" }),
                response: t.String({ default: "Internal server error" }),
            }),
        },
    });

    app.get('/users/:id', getUserById, {
        detail: {
            operationId: 'getUserById',
            summary: "/users/:id",
            description: "Get User by ID",
            tags: ["Users"],
        },
        params: t.Object({
            id: t.String()
        }),
        response: {
            200: t.Object({
                status: t.String({ default: "success" }),
                response: t.Object({
                    id: t.Number(),
                    name: t.String(),
                    email: t.String(),
                }),
            }),
            404: t.Object({
                status: t.String({ default: "error" }),
                response: t.String({ default: "User not found" }),
            }),
            500: t.Object({
                status: t.String({ default: "error" }),
                response: t.String({ default: "Internal server error" }),
            }),
        },
    });

    app.post('/users', async ({ body, set }) => {
        return await createUser({ body, set })
    }, {
        detail: {
            operationId: 'createUser',
            summary: "/users",
            description: "Create User",
            tags: ["Users"],
        },
        body: t.Object({
            name: t.Optional(t.String()),
            email: t.String(),
            password: t.String(),
        }),
        response: {
            200: t.Object({
                status: t.String({ default: "success" }),
                response: t.Object({
                    id: t.Number(),
                    name: t.String(),
                    email: t.String()
                }),
            }),
            409: t.Object({
                status: t.String({ default: "error" }),
                response: t.String({ default: "Email already exists" }),
            }),
            422: t.Object({
                status: t.String({ default: "error" }),
                response: t.String({ default: "Required fields: name and email" }),
            }),
            500: t.Object({
                status: t.String({ default: "error" }),
                response: t.String({ default: "Internal server error" }),
            }),
        },
    });

    app.put('/users/:id', updateUser, {
        detail: {
            operationId: 'updateUser',
            summary: "/users/:id",
            description: "Update User",
            tags: ["Users"],
        },
        params: t.Object({
            id: t.String()
        }),
        body: t.Object({
            name: t.Optional(t.String()),
            email: t.String()
        }),
        response: {
            200: t.Object({
                status: t.String({ default: "success" }),
                response: t.Object({
                    id: t.Number(),
                    name: t.String(),
                    email: t.String(),
                }),
            }),
            404: t.Object({
                status: t.String({ default: "error" }),
                response: t.String({ default: "User not found" }),
            }),
            422: t.Object({
                status: t.String({ default: "error" }),
                response: t.String({ default: "Required fields: name and email" }),
            }),
            500: t.Object({
                status: t.String({ default: "error" }),
                response: t.String({ default: "Internal server error" }),
            }),
        },
    });

    app.delete('/users/:id', deleteUser, {
        detail: {
            operationId: 'deleteUser',
            summary: "/users/:id",
            description: "Delete User",
            tags: ["Users"],
        },
        params: t.Object({
            id: t.String()
        }),
        response: {
            200: t.Object({
                status: t.String({ default: "success" }),
                response: t.String({ default: "User deleted" }),
            }),
            404: t.Object({
                status: t.String({ default: "error" }),
                response: t.String({ default: "User not found" }),
            }),
            500: t.Object({
                status: t.String({ default: "error" }),
                response: t.String({ default: "Internal server error" }),
            }),
        },
    });
}