import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import pool from '../../shared/utils/db';
import { signAccessToken, signRefreshToken, verifyToken } from '../../shared/utils/jwt';
import { authenticate } from '../../shared/middleware/auth';
import { publishEvent } from '../../shared/utils/kafka';

export const authRouter = Router();

authRouter.post('/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password || password.length < 8) {
      res.status(400).json({ error: 'Name, email, and password (min 8 chars) are required' });
      return;
    }

    const existing = await pool.query('SELECT id FROM auth.users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      res.status(409).json({ error: 'Email already registered' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const { rows: [user] } = await pool.query(
      `INSERT INTO auth.users (name, email, password_hash)
       VALUES ($1, $2, $3) RETURNING id, email, role`,
      [name, email, passwordHash]
    );

    const accessToken = signAccessToken({ userId: user.id, email: user.email, role: user.role });
    const refreshToken = signRefreshToken({ userId: user.id });

    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    await pool.query(
      `INSERT INTO auth.refresh_tokens (user_id, token_hash, expires_at)
       VALUES ($1, $2, now() + interval '7 days')`,
      [user.id, tokenHash]
    );

    await pool.query(
      `INSERT INTO notifications.user_preferences (user_id) VALUES ($1)`,
      [user.id]
    );

    publishEvent('tasksphere.user.registered', { user_id: user.id, email: user.email }).catch(() => {});

    res.status(201).json({ access_token: accessToken, refresh_token: refreshToken, expires_in: 900 });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

authRouter.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    const { rows } = await pool.query(
      'SELECT id, email, password_hash, role, is_active FROM auth.users WHERE email = $1',
      [email]
    );

    if (rows.length === 0) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const user = rows[0];
    if (!user.is_active) {
      res.status(401).json({ error: 'Account deactivated' });
      return;
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const accessToken = signAccessToken({ userId: user.id, email: user.email, role: user.role });
    const refreshToken = signRefreshToken({ userId: user.id });

    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    await pool.query(
      `INSERT INTO auth.refresh_tokens (user_id, token_hash, expires_at)
       VALUES ($1, $2, now() + interval '7 days')`,
      [user.id, tokenHash]
    );

    res.json({ access_token: accessToken, refresh_token: refreshToken, expires_in: 900 });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

authRouter.post('/refresh', async (req: Request, res: Response) => {
  try {
    const { refresh_token } = req.body;
    if (!refresh_token) {
      res.status(400).json({ error: 'Refresh token required' });
      return;
    }

    const decoded = verifyToken(refresh_token) as { userId: string };
    const tokenHash = crypto.createHash('sha256').update(refresh_token).digest('hex');

    const { rows } = await pool.query(
      `SELECT rt.id FROM auth.refresh_tokens rt
       JOIN auth.users u ON u.id = rt.user_id
       WHERE rt.user_id = $1 AND rt.token_hash = $2 AND rt.expires_at > now() AND u.is_active = true`,
      [decoded.userId, tokenHash]
    );

    if (rows.length === 0) {
      res.status(401).json({ error: 'Invalid or expired refresh token' });
      return;
    }

    await pool.query('DELETE FROM auth.refresh_tokens WHERE id = $1', [rows[0].id]);

    const { rows: [user] } = await pool.query(
      'SELECT id, email, role FROM auth.users WHERE id = $1',
      [decoded.userId]
    );

    const newAccess = signAccessToken({ userId: user.id, email: user.email, role: user.role });
    const newRefresh = signRefreshToken({ userId: user.id });
    const newHash = crypto.createHash('sha256').update(newRefresh).digest('hex');

    await pool.query(
      `INSERT INTO auth.refresh_tokens (user_id, token_hash, expires_at)
       VALUES ($1, $2, now() + interval '7 days')`,
      [user.id, newHash]
    );

    res.json({ access_token: newAccess, refresh_token: newRefresh, expires_in: 900 });
  } catch {
    res.status(401).json({ error: 'Invalid or expired refresh token' });
  }
});

authRouter.post('/logout', authenticate, async (req: Request, res: Response) => {
  try {
    await pool.query('DELETE FROM auth.refresh_tokens WHERE user_id = $1', [req.user!.userId]);
    res.status(204).send();
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
