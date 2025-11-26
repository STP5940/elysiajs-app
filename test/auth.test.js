// test/auth.test.js

import { describe, expect, it, beforeEach } from 'bun:test'
import { Elysia } from 'elysia'
import { authRoutes } from '../routes/auth.routes'

describe('Auth Routes', () => {
  let app

  beforeEach(() => {
    app = new Elysia()
      .group('/v1', (app) => {
        authRoutes(app)
        return app
      })
  })

  describe('POST /v1/auth/login', () => {
    it('should return 422 when email is missing', async () => {
      const response = await app.handle(
        new Request('http://localhost/v1/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: '',
            password: 'password123'
          })
        })
      )

      expect(response.status).toBe(422)
      const body = await response.json()

      expect(body).toHaveProperty('errors')
      expect(body.errors[0].path).toBe('/email')
      expect(body.errors[0].message).toContain("Expected string to match 'email' format")
    })

    it('should return 422 when password is incorrect', async () => {
      const response = await app.handle(
        new Request('http://localhost/v1/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: 'user@example.com',
            password: ''
          })
        })
      )

      expect(response.status).toBe(422)
      const body = await response.json()

      expect(body).toHaveProperty('errors')
      expect(body.errors[0].path).toBe('/password')
      expect(body.errors[0].message).toContain('Expected string length greater or equal to 6')
    })

    it('should return 200 with tokens when credentials are valid', async () => {
      const response = await app.handle(
        new Request('http://localhost/v1/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: 'user@example.com',
            password: 'password123'
          })
        })
      )

      // ตรวจสอบว่า status ต้องเป็น 200
      expect(response.status).toBe(200)

      // ถ้า status เป็น 200 ถึงจะตรวจสอบ body ต่อ
      const body = await response.json()

      expect(body).toHaveProperty('status', 'success')
      expect(body).toHaveProperty('accessToken')
      expect(typeof body.accessToken).toBe('string')
      expect(body).toHaveProperty('message', 'Login successful')
      expect(body).toHaveProperty('data')
      expect(body.data).toEqual({
        id: expect.any(Number),
        name: expect.any(String),
        email: expect.any(String),
      })
    })
  })
})