import { Router, Request, Response } from 'express';
import pool from '../../shared/utils/db';
import { authenticate, requireRole } from '../../shared/middleware/auth';
import { publishEvent } from '../../shared/utils/kafka';
import { VALID_STATUS_TRANSITIONS, TaskStatus } from '../../shared/types';

export const taskRouter = Router();

taskRouter.use(authenticate);

taskRouter.get('/', async (req: Request, res: Response) => {
  try {
    const projectId = req.query.project_id as string;
    if (!projectId) {
      res.status(400).json({ error: 'project_id query param is required' });
      return;
    }

    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
    const offset = (page - 1) * limit;

    const conditions: string[] = ['t.project_id = $1'];
    const params: unknown[] = [projectId];
    let idx = 2;

    if (req.query.status) { conditions.push(`t.status = $${idx++}`); params.push(req.query.status); }
    if (req.query.priority) { conditions.push(`t.priority = $${idx++}`); params.push(req.query.priority); }
    if (req.query.assignee_id) {
      conditions.push(`EXISTS (SELECT 1 FROM tasks.task_assignees ta WHERE ta.task_id = t.id AND ta.user_id = $${idx++})`);
      params.push(req.query.assignee_id);
    }
    if (req.query.q) {
      conditions.push(`to_tsvector('english', coalesce(t.title,'') || ' ' || coalesce(t.description,'')) @@ plainto_tsquery('english', $${idx++})`);
      params.push(req.query.q);
    }

    const where = conditions.join(' AND ');
    params.push(limit, offset);

    const [{ rows: data }, { rows: [{ count }] }] = await Promise.all([
      pool.query(
        `SELECT t.*, array_agg(ta.user_id) FILTER (WHERE ta.user_id IS NOT NULL) AS assignee_ids
         FROM tasks.tasks t
         LEFT JOIN tasks.task_assignees ta ON ta.task_id = t.id
         WHERE ${where}
         GROUP BY t.id
         ORDER BY t.created_at DESC
         LIMIT $${idx++} OFFSET $${idx}`,
        params
      ),
      pool.query(`SELECT count(*) FROM tasks.tasks t WHERE ${where}`, params.slice(0, -2)),
    ]);

    res.json({ data, total: parseInt(count) });
  } catch (err) {
    console.error('List tasks error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

taskRouter.post('/', requireRole('member'), async (req: Request, res: Response) => {
  try {
    const { project_id, title, description, priority } = req.body;
    if (!project_id || !title) {
      res.status(400).json({ error: 'project_id and title are required' });
      return;
    }

    if (title.length > 100) {
      res.status(400).json({ error: 'Title cannot exceed 100 characters' });
      return;
    }

    const { rows: [task] } = await pool.query(
      `INSERT INTO tasks.tasks (project_id, title, description, priority, created_by)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [project_id, title, description || null, priority || 'medium', req.user!.userId]
    );

    publishEvent('tasksphere.task.created', {
      task_id: task.id,
      project_id: task.project_id,
      created_by: req.user!.userId,
    }).catch(() => {});

    res.status(201).json(task);
  } catch (err) {
    console.error('Create task error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

taskRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const { rows } = await pool.query(
      `SELECT t.*, array_agg(ta.user_id) FILTER (WHERE ta.user_id IS NOT NULL) AS assignee_ids
       FROM tasks.tasks t
       LEFT JOIN tasks.task_assignees ta ON ta.task_id = t.id
       WHERE t.id = $1
       GROUP BY t.id`,
      [req.params.id]
    );

    if (rows.length === 0) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('Get task error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

taskRouter.patch('/:id', requireRole('member'), async (req: Request, res: Response) => {
  try {
    const updates: string[] = [];
    const values: unknown[] = [];
    let idx = 1;

    if (req.body.title !== undefined) {
      if (req.body.title.length > 100) {
        res.status(400).json({ error: 'Title cannot exceed 100 characters' });
        return;
      }
      updates.push(`title = $${idx++}`); values.push(req.body.title);
    }
    if (req.body.description !== undefined) { updates.push(`description = $${idx++}`); values.push(req.body.description); }
    if (req.body.priority !== undefined) { updates.push(`priority = $${idx++}`); values.push(req.body.priority); }

    if (updates.length === 0) {
      res.status(400).json({ error: 'No fields to update' });
      return;
    }

    updates.push(`updated_at = now()`);
    values.push(req.params.id);

    const { rows } = await pool.query(
      `UPDATE tasks.tasks SET ${updates.join(', ')} WHERE id = $${idx} RETURNING *`,
      values
    );

    if (rows.length === 0) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    publishEvent('tasksphere.task.updated', {
      task_id: rows[0].id,
      project_id: rows[0].project_id,
      updated_by: req.user!.userId,
    }).catch(() => {});

    res.json(rows[0]);
  } catch (err) {
    console.error('Update task error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

taskRouter.patch('/:id/status', requireRole('member'), async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    if (!status) {
      res.status(400).json({ error: 'status is required' });
      return;
    }

    const { rows: current } = await pool.query('SELECT status FROM tasks.tasks WHERE id = $1', [req.params.id]);
    if (current.length === 0) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    const currentStatus = current[0].status as TaskStatus;
    const allowed = VALID_STATUS_TRANSITIONS[currentStatus];
    if (!allowed.includes(status as TaskStatus)) {
      res.status(422).json({
        error: `Invalid transition from '${currentStatus}' to '${status}'. Allowed: ${allowed.join(', ')}`,
      });
      return;
    }

    const { rows: [task] } = await pool.query(
      `UPDATE tasks.tasks SET status = $1, updated_at = now() WHERE id = $2 RETURNING *`,
      [status, req.params.id]
    );

    publishEvent('tasksphere.task.status_changed', {
      task_id: task.id,
      project_id: task.project_id,
      from: currentStatus,
      to: status,
      changed_by: req.user!.userId,
    }).catch(() => {});

    res.json(task);
  } catch (err) {
    console.error('Status change error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

taskRouter.post('/:id/assignees', requireRole('member'), async (req: Request, res: Response) => {
  try {
    const { user_id } = req.body;
    if (!user_id) {
      res.status(400).json({ error: 'user_id is required' });
      return;
    }

    const { rows: [assignment] } = await pool.query(
      `INSERT INTO tasks.task_assignees (task_id, user_id)
       VALUES ($1, $2) ON CONFLICT (task_id, user_id) DO NOTHING RETURNING *`,
      [req.params.id, user_id]
    );

    publishEvent('tasksphere.task.assigned', {
      task_id: req.params.id,
      user_id,
      assigned_by: req.user!.userId,
    }).catch(() => {});

    res.status(201).json(assignment || { task_id: req.params.id, user_id });
  } catch (err) {
    console.error('Assign task error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

taskRouter.delete('/:id/assignees/:userId', requireRole('member'), async (req: Request, res: Response) => {
  try {
    await pool.query(
      'DELETE FROM tasks.task_assignees WHERE task_id = $1 AND user_id = $2',
      [req.params.id, req.params.userId]
    );
    res.status(204).send();
  } catch (err) {
    console.error('Remove assignee error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

taskRouter.delete('/:id', requireRole('project_manager'), async (req: Request, res: Response) => {
  try {
    const { rowCount } = await pool.query('DELETE FROM tasks.tasks WHERE id = $1', [req.params.id]);
    if (rowCount === 0) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }
    res.status(204).send();
  } catch (err) {
    console.error('Delete task error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
