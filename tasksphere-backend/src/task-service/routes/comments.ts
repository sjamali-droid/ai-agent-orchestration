import { Router, Request, Response } from 'express';
import pool from '../../shared/utils/db';
import { authenticate, requireRole } from '../../shared/middleware/auth';
import { publishEvent } from '../../shared/utils/kafka';

export const commentRouter = Router();

commentRouter.use(authenticate);

commentRouter.get('/:taskId', async (req: Request, res: Response) => {
  try {
    const { rows } = await pool.query(
      `SELECT c.*, u.name AS author_name
       FROM tasks.comments c
       JOIN auth.users u ON u.id = c.author_id
       WHERE c.task_id = $1
       ORDER BY c.created_at ASC`,
      [req.params.taskId]
    );
    res.json(rows);
  } catch (err) {
    console.error('List comments error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

commentRouter.post('/:taskId', requireRole('member'), async (req: Request, res: Response) => {
  try {
    const { body, parent_comment_id } = req.body;
    if (!body || !body.trim()) {
      res.status(400).json({ error: 'Comment body is required' });
      return;
    }

    const taskExists = await pool.query('SELECT id, project_id FROM tasks.tasks WHERE id = $1', [req.params.taskId]);
    if (taskExists.rows.length === 0) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    if (parent_comment_id) {
      const parentExists = await pool.query(
        'SELECT id FROM tasks.comments WHERE id = $1 AND task_id = $2',
        [parent_comment_id, req.params.taskId]
      );
      if (parentExists.rows.length === 0) {
        res.status(400).json({ error: 'Parent comment not found on this task' });
        return;
      }
    }

    const { rows: [comment] } = await pool.query(
      `INSERT INTO tasks.comments (task_id, author_id, parent_comment_id, body)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [req.params.taskId, req.user!.userId, parent_comment_id || null, body]
    );

    publishEvent('tasksphere.comment.created', {
      comment_id: comment.id,
      task_id: req.params.taskId,
      project_id: taskExists.rows[0].project_id,
      author_id: req.user!.userId,
    }).catch(() => {});

    res.status(201).json(comment);
  } catch (err) {
    console.error('Create comment error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

commentRouter.patch('/:taskId/:commentId', async (req: Request, res: Response) => {
  try {
    const { body } = req.body;
    if (!body || !body.trim()) {
      res.status(400).json({ error: 'Comment body is required' });
      return;
    }

    const { rows } = await pool.query(
      `UPDATE tasks.comments SET body = $1, updated_at = now()
       WHERE id = $2 AND task_id = $3 AND author_id = $4
       RETURNING *`,
      [body, req.params.commentId, req.params.taskId, req.user!.userId]
    );

    if (rows.length === 0) {
      res.status(404).json({ error: 'Comment not found or not authorized' });
      return;
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('Update comment error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

commentRouter.delete('/:taskId/:commentId', async (req: Request, res: Response) => {
  try {
    const isAdmin = req.user!.role === 'admin';
    const conditions = isAdmin
      ? 'id = $1 AND task_id = $2'
      : 'id = $1 AND task_id = $2 AND author_id = $3';
    const params = isAdmin
      ? [req.params.commentId, req.params.taskId]
      : [req.params.commentId, req.params.taskId, req.user!.userId];

    const { rowCount } = await pool.query(`DELETE FROM tasks.comments WHERE ${conditions}`, params);

    if (rowCount === 0) {
      res.status(404).json({ error: 'Comment not found or not authorized' });
      return;
    }

    res.status(204).send();
  } catch (err) {
    console.error('Delete comment error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
