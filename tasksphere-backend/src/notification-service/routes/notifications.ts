import { Router, Request, Response } from 'express';
import pool from '../../shared/utils/db';
import { authenticate } from '../../shared/middleware/auth';

export const notificationRouter = Router();

notificationRouter.use(authenticate);

notificationRouter.get('/', async (req: Request, res: Response) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
    const offset = (page - 1) * limit;

    const [{ rows: data }, { rows: [{ count }] }] = await Promise.all([
      pool.query(
        `SELECT id, type, title, message, link, is_read, created_at
         FROM notifications.notifications
         WHERE user_id = $1
         ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
        [req.user!.userId, limit, offset]
      ),
      pool.query(
        'SELECT count(*) FROM notifications.notifications WHERE user_id = $1',
        [req.user!.userId]
      ),
    ]);

    res.json({ data, total: parseInt(count) });
  } catch (err) {
    console.error('List notifications error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

notificationRouter.patch('/read', async (req: Request, res: Response) => {
  try {
    const { notification_ids } = req.body;
    if (!notification_ids || !Array.isArray(notification_ids) || notification_ids.length === 0) {
      res.status(400).json({ error: 'notification_ids array is required' });
      return;
    }

    await pool.query(
      `UPDATE notifications.notifications SET is_read = true
       WHERE id = ANY($1) AND user_id = $2`,
      [notification_ids, req.user!.userId]
    );

    res.json({ marked: notification_ids.length });
  } catch (err) {
    console.error('Mark read error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

notificationRouter.get('/preferences', async (req: Request, res: Response) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM notifications.user_preferences WHERE user_id = $1',
      [req.user!.userId]
    );

    if (rows.length === 0) {
      res.json({ email_notifications: true });
      return;
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('Get preferences error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

notificationRouter.patch('/preferences', async (req: Request, res: Response) => {
  try {
    const { email_notifications } = req.body;

    const { rows: [prefs] } = await pool.query(
      `INSERT INTO notifications.user_preferences (user_id, email_notifications, updated_at)
       VALUES ($1, $2, now())
       ON CONFLICT (user_id) DO UPDATE SET email_notifications = $2, updated_at = now()
       RETURNING *`,
      [req.user!.userId, email_notifications ?? true]
    );

    res.json(prefs);
  } catch (err) {
    console.error('Update preferences error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
