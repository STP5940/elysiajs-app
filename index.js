// index.js

import { t, Elysia } from 'elysia';
import { cors } from "@elysiajs/cors";
import { swagger } from '@elysiajs/swagger';

// import logger from 'logixlysia';
import logixlysia from 'logixlysia';
import { rateLimit } from "elysia-rate-limit";

import { authRoutes } from './routes/auth.route.js';
import { userRoutes } from './routes/user.routes.js';

const app = new Elysia()
    // ตรวจสอบว่ามี Error จากการ Validate หรือไม่
    .onError(({ code, error, set }) => {
        if (code === "VALIDATION") {
            set.status = 422;

            const errors = error.all.filter(err => 'path' in err).map(err => ({
                path: err.path,
                message: err.message,
            }));

            return {
                status: "error",
                message: 'Validation failed',
                errors,
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
            responseMessage: { status: "error", response: "rate-limit reached" },
            generator: async (req, server, { ip }) =>
                Bun.hash(JSON.stringify(ip)).toString()
        })
    )
    .get('/', () => 'Hello World!', {
        detail: {
            tags: ['hidden']
        }
    })
    .derive(async ({ cookie: { refreshToken }, jwt }) => {
        return {
            profile: await jwt.verify(refreshToken.value)
        };
    })
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
                    '🦊 {now} {level} {duration} {method} {pathname} {status} {message} {ip} {epoch}',
                logFilter: {
                    level: ['ERROR', 'WARNING', 'INFO'],
                    method: ['GET', 'POST', 'PUT', 'DELETE']
                }
            },
        }
    ))
    .use(cors({ origin: true }));

// Create v1 group for API routes
app.group('/v1', (app) => {
    authRoutes(app);

    // ใช้ guard เพื่อตรวจสอบ authentication ก่อนเข้าถึง Routes
    app.guard({
        beforeHandle: ({ profile, set }) => {
            if (!profile) {
                set.status = 401;
                return { status: "error", response: "Unauthorized" };
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