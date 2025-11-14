// src/index.ts
import { Elysia } from 'elysia';

const app = new Elysia()
    .get('/', () => 'Hello Vercel Function');

export default app;
