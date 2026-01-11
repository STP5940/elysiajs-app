// index.js

import { Elysia } from 'elysia';
import { cors } from "@elysiajs/cors";
import { bearer } from '@elysiajs/bearer'
import { swagger } from '@elysiajs/swagger';

import logixlysia from 'logixlysia';
import { rateLimit } from "elysia-rate-limit";

import { authRoutes } from './routes/auth.routes.js';
import { userRoutes } from './routes/user.routes.js';

const app = new Elysia()
    // ตรวจสอบว่ามี Error จากการ Validate หรือไม่
    .onError(({ code, error, set }) => {
        switch (code) {
            case 'VALIDATION':
                const errors = error.all.filter(err => 'path' in err).map(err => ({
                    path: err.path,
                    message: err.message,
                }));

                set.status = 422;
                return {
                    status: "error",
                    message: 'Validation failed',
                    errors,
                };
            default:
                set.status = 500;
                // console.error(error);
                return {
                    status: "error",
                    message: "Internal server error",
                };
        }
    })
    .use(swagger({
        exclude: ["/swagger", "/"],
        autoDarkMode: true,
        documentation: {
            info: {
                title: `🦊 Elysia REST API [${process.env.NODE_ENV.toUpperCase()}]`,
                description: "Simple MC (Model-Controller) pattern for ElysiaJS",
                version: "1.0.0",
                license: {
                    name: "MIT",
                    url: "https://opensource.org/license/mit/",
                },
                contact: {
                    name: "PunGrumpy",
                    url: "https://pungrumpy.com",
                },
            },
            components: {
                securitySchemes: {

                    DatabaseName: {
                        type: 'apiKey',
                        in: 'header',
                        name: 'x-database-name',
                        value: 'Enter Target Database',
                        description: 'Database Connection',
                    },
                    ApiKeyAuth: {
                        type: 'apiKey',
                        in: 'header',
                        name: 'x-api-key',
                        value: 'Enter Production API key',
                        description: 'Secure Key Authentication',
                    },
                    accessToken: {
                        type: 'http',
                        scheme: 'bearer',
                        bearerFormat: 'JWT'
                    }
                }
            },
            security: [{
                DatabaseName: [],
                ApiKeyAuth: [],
                accessToken: []
            }],
            tags: [
                {
                    name: "Authentication",
                    description: "Users authentication",
                },
                {
                    name: "Users",
                    description: "Users management",
                },
            ],
        },
    }))
    .use(
        rateLimit({
            scoping: "local",
            duration: 60 * 1000, // 1 minute in milliseconds
            max: 500, // 500 requests per minute
            responseCode: 429,
            responseMessage: { status: "error", message: "rate-limit reached" },
            generator: async (req, server, { ip }) =>
                Bun.hash(JSON.stringify(ip)).toString()
        })
    )
    .use(logixlysia(
        {
            // เพิ่มระบบ logging
            config: {
                showStartupMessage: true,
                startupMessageFormat: 'banner',
                timestamp: {
                    translateTime: 'yyyy-mm-dd HH:MM:ss'
                },
                ip: true,
                logFilePath: `./logs/information.log`,
                customLogFormat:
                    '🦊 {now} {level} {duration} {method} {pathname} {status} {message} {ip}',
                logFilter: {
                    level: ['ERROR', 'WARNING', 'INFO'],
                    method: ['GET', 'POST', 'PUT', 'DELETE']
                }
            },
        }
    ))
    .use(cors({ origin: true }))
    .get('/', () => `Hello From Worker ${process.pid}`, {
        detail: {
            tags: ['hidden']
        }
    })
    .use(bearer())
    .derive(async ({ accessJwt, bearer }) => {
        return {
            profile: await accessJwt.verify(bearer),
        };
    });

// Create v1 group for API routes
app.group('/v1', (app) => {
    authRoutes(app);

    // ใช้ guard เพื่อตรวจสอบ authentication ก่อนเข้าถึง Routes
    app.guard({
        beforeHandle: ({ bearer, profile, set }) => {
            if (!bearer || !profile) {
                set.status = 401;
                return { status: "error", message: "Unauthorized" };
            }
        }
    }, (app) => {
        // รายการ Routes ที่ต้อง Authen
        userRoutes(app);
        return app;
    });

    return app;
});

const serverPort = process.env.PORT || 3000;
app.listen({ port: serverPort });
console.log(`Server running at http://localhost:${serverPort}\n`);