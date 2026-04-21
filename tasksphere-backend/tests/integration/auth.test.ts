import pool from '../../src/shared/utils/db';

const BASE = 'http://localhost:3001';

const TEST_USER = {
  name: 'Auth Test User',
  email: `auth-test-${Date.now()}@example.com`,
  password: 'Str0ngP@ssword!',
};

async function cleanupUser(email: string): Promise<void> {
  await pool.query('DELETE FROM users WHERE email = $1', [email]);
}

describe('auth-service integration', () => {
  let accessToken: string;
  let refreshToken: string;
  let userId: string;

  afterAll(async () => {
    await cleanupUser(TEST_USER.email);
    await pool.end();
  });

  // ── Register ──────────────────────────────────────────────

  describe('POST /auth/register', () => {
    it('should register a new user and return tokens', async () => {
      const res = await fetch(`${BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(TEST_USER),
      });

      expect(res.status).toBe(201);
      const body = await res.json();
      expect(body).toHaveProperty('access_token');
      expect(body).toHaveProperty('refresh_token');
      expect(body).toHaveProperty('expires_in');

      accessToken = body.access_token;
      refreshToken = body.refresh_token;
    });

    it('should reject duplicate email with 409', async () => {
      const res = await fetch(`${BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(TEST_USER),
      });

      expect(res.status).toBe(409);
    });

    it('should reject weak password', async () => {
      const res = await fetch(`${BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Weak Pwd',
          email: 'weak@example.com',
          password: '123',
        }),
      });

      expect([400, 422]).toContain(res.status);
    });
  });

  // ── Login ─────────────────────────────────────────────────

  describe('POST /auth/login', () => {
    it('should log in with valid credentials', async () => {
      const res = await fetch(`${BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: TEST_USER.email,
          password: TEST_USER.password,
        }),
      });

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body).toHaveProperty('access_token');
      expect(body).toHaveProperty('refresh_token');

      accessToken = body.access_token;
      refreshToken = body.refresh_token;
    });

    it('should reject wrong password with 401', async () => {
      const res = await fetch(`${BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: TEST_USER.email,
          password: 'WrongPassword!',
        }),
      });

      expect(res.status).toBe(401);
    });

    it('should reject deactivated user', async () => {
      await pool.query(
        "UPDATE users SET is_active = false WHERE email = $1 RETURNING id",
        [TEST_USER.email],
      );

      const res = await fetch(`${BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: TEST_USER.email,
          password: TEST_USER.password,
        }),
      });

      expect([401, 403]).toContain(res.status);

      await pool.query(
        "UPDATE users SET is_active = true WHERE email = $1",
        [TEST_USER.email],
      );
    });
  });

  // ── Refresh Token ─────────────────────────────────────────

  describe('POST /auth/refresh', () => {
    it('should issue new tokens from a valid refresh token', async () => {
      const loginRes = await fetch(`${BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: TEST_USER.email,
          password: TEST_USER.password,
        }),
      });
      const loginBody = await loginRes.json();
      refreshToken = loginBody.refresh_token;

      const res = await fetch(`${BASE}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body).toHaveProperty('access_token');
      expect(body).toHaveProperty('refresh_token');

      accessToken = body.access_token;
      refreshToken = body.refresh_token;
    });

    it('should reject an invalid refresh token with 401', async () => {
      const res = await fetch(`${BASE}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: 'invalid-token-value' }),
      });

      expect(res.status).toBe(401);
    });
  });

  // ── Logout ────────────────────────────────────────────────

  describe('POST /auth/logout', () => {
    it('should invalidate the session and return 204', async () => {
      const res = await fetch(`${BASE}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      expect(res.status).toBe(204);
    });

    it('should reject requests without a token', async () => {
      const res = await fetch(`${BASE}/auth/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      expect(res.status).toBe(401);
    });
  });
});
