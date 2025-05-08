// index.js

import { Elysia } from 'elysia';
import { cors } from "@elysiajs/cors";
import { swagger } from '@elysiajs/swagger';

// import crypto from 'crypto';
import logger from 'logixlysia';
import { rateLimit } from "elysia-rate-limit";

import { userRoutes } from './routes/user.routes.js';

const app = new Elysia()
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
                // {
                //     name: "Test Connection",
                //     description: "Not Connected to Database",
                // },
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
            // generator: async (req, server, { ip }) => {
            //     const ipToHash = ip || 'fallback-ip'; // กันกรณี ip เป็น undefined
            //     crypto.createHash('sha256').update(JSON.stringify(ipToHash)).digest('hex').toString()
            // }
            generator: async (req, server, { ip }) =>
                Bun.hash(JSON.stringify(ip)).toString()
        })
    )
    .get('/', () => 'Hello World!', {
        detail: {
            tags: ['hidden']
        }
    })
    .use(logger())
    .use(cors({ origin: true }));

// Create v1 group for API routes
app.group('/v1', (app) => {
    userRoutes(app);
    return app
});

app.listen({ port: process.env.PORT });
console.log(`Server running at http://localhost:${process.env.PORT}\n`);