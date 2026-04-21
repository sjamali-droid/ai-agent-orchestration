import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import pool from '../../shared/utils/db';
import { authenticate, requireRole } from '../../shared/middleware/auth';

export const usersRouter = Router();

usersRouter.use(authenticate);

usersRouter.get('/', requireRole('admin'), async (req: Request, res: Response) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
    const offset = (page - 1) * limit;

    const { rows: data } = await pool.query(
      `SELECT id, name, email, role, is_active, created_at
       FROM auth.users ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    const { rows: [{ count }] } = await pool.query('SELECT count(*) FROM auth.users');

    res.json({ data, total: parseInt(count) });
  } catch (err) {
    console.error('List users error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

usersRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, name, email, role, is_active, created_at FROM auth.users WHERE id = $1',
      [req.params.id]
    );

    if (rows.length === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('Get user error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

usersRouter.patch('/:id', async (req: Request, res: Response) => {
  try {
    const targetId = req.params.id;
    const isOwnProfile = req.user!.userId === targetId;
    const isAdmin = req.user!.role === 'admin';

    if (!isOwnProfile && !isAdmin) {
      res.status(403).json({ error: 'Can only update own profile or must be admin' });
      return;
    }

    const updates: string[] = [];
    const values: unknown[] = [];
    let idx = 1;

    if (req.body.name) {
      updates.push(`name = $${idx++}`);
      values.push(req.body.name);
    }
    if (req.body.email) {
      updates.push(`email = $${idx++}`);
      values.push(req.body.email);
    }
    if (req.body.password) {
      updates.push(`password_hash = $${idx++}`);
      values.push(await bcrypt.hash(req.body.password, 10));
    }
    if (req.body.role && isAdmin) {
      updates.push(`role = $${idx++}`);
      values.push(req.body.role);
    }

    if (updates.length === 0) {
      res.status(400).json({ error: 'No valid fields to update' });
      return;
    }

    updates.push(`updated_at = now()`);
    values.push(targetId);

    const { rows } = await pool.query(
      `UPDATE auth.users SET ${updates.join(', ')} WHERE id = $${idx}
       RETURNING id, name, email, role, is_active, created_at, updated_at`,
      values
    );

    if (rows.length === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('Update user error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

usersRouter.delete('/:id', requireRole('admin'), async (req: Request, res: Response) => {
  try {
    const { rowCount } = await pool.query(
      'UPDATE auth.users SET is_active = false, updated_at = now() WHERE id = $1 AND is_active = true',
      [req.params.id]
    );

    if (rowCount === 0) {
      res.status(404).json({ error: 'User not found or already deactivated' });
      return;
    }

    await pool.query('DELETE FROM auth.refresh_tokens WHERE user_id = $1', [req.params.id]);

    res.status(204).send();
  } catch (err) {
    console.error('Delete user error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
