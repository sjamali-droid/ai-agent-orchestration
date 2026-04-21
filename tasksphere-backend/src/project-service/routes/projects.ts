import { Router, Request, Response } from 'express';
import pool from '../../shared/utils/db';
import { authenticate, requireRole } from '../../shared/middleware/auth';
import { publishEvent } from '../../shared/utils/kafka';

export const projectRouter = Router();

projectRouter.use(authenticate);

projectRouter.get('/', async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const isAdmin = req.user!.role === 'admin';
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
    const offset = (page - 1) * limit;

    let query: string;
    let countQuery: string;
    const params: unknown[] = [];

    if (isAdmin) {
      query = `SELECT p.* FROM projects.projects p ORDER BY p.created_at DESC LIMIT $1 OFFSET $2`;
      countQuery = `SELECT count(*) FROM projects.projects`;
      params.push(limit, offset);
    } else {
      query = `
        SELECT DISTINCT p.* FROM projects.projects p
        LEFT JOIN projects.project_members pm ON pm.project_id = p.id
        WHERE p.is_private = false OR p.owner_id = $1 OR pm.user_id = $1
        ORDER BY p.created_at DESC LIMIT $2 OFFSET $3`;
      countQuery = `
        SELECT count(DISTINCT p.id) FROM projects.projects p
        LEFT JOIN projects.project_members pm ON pm.project_id = p.id
        WHERE p.is_private = false OR p.owner_id = $1 OR pm.user_id = $1`;
      params.push(userId, limit, offset);
    }

    const [{ rows: data }, { rows: [{ count }] }] = await Promise.all([
      pool.query(query, params),
      pool.query(countQuery, isAdmin ? [] : [userId]),
    ]);

    res.json({ data, total: parseInt(count) });
  } catch (err) {
    console.error('List projects error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

projectRouter.post('/', requireRole('project_manager'), async (req: Request, res: Response) => {
  try {
    const { name, description, is_private } = req.body;
    if (!name) {
      res.status(400).json({ error: 'Project name is required' });
      return;
    }

    const { rows: [project] } = await pool.query(
      `INSERT INTO projects.projects (name, description, is_private, owner_id)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, description || null, is_private || false, req.user!.userId]
    );

    await pool.query(
      `INSERT INTO projects.project_members (project_id, user_id, role) VALUES ($1, $2, 'project_manager')`,
      [project.id, req.user!.userId]
    );

    publishEvent('tasksphere.project.created', {
      project_id: project.id,
      owner_id: req.user!.userId,
    }).catch(() => {});

    res.status(201).json(project);
  } catch (err) {
    console.error('Create project error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

projectRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const { rows } = await pool.query('SELECT * FROM projects.projects WHERE id = $1', [req.params.id]);
    if (rows.length === 0) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    const project = rows[0];
    if (project.is_private) {
      const { rows: membership } = await pool.query(
        'SELECT 1 FROM projects.project_members WHERE project_id = $1 AND user_id = $2',
        [project.id, req.user!.userId]
      );
      if (membership.length === 0 && project.owner_id !== req.user!.userId && req.user!.role !== 'admin') {
        res.status(403).json({ error: 'Not a member of this private project' });
        return;
      }
    }

    res.json(project);
  } catch (err) {
    console.error('Get project error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

projectRouter.patch('/:id', async (req: Request, res: Response) => {
  try {
    const { rows: existing } = await pool.query('SELECT * FROM projects.projects WHERE id = $1', [req.params.id]);
    if (existing.length === 0) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    const isOwner = existing[0].owner_id === req.user!.userId;
    const isAdmin = req.user!.role === 'admin';
    if (!isOwner && !isAdmin) {
      res.status(403).json({ error: 'Only the project owner or admin can update' });
      return;
    }

    const updates: string[] = [];
    const values: unknown[] = [];
    let idx = 1;

    if (req.body.name !== undefined) { updates.push(`name = $${idx++}`); values.push(req.body.name); }
    if (req.body.description !== undefined) { updates.push(`description = $${idx++}`); values.push(req.body.description); }
    if (req.body.is_private !== undefined) { updates.push(`is_private = $${idx++}`); values.push(req.body.is_private); }

    if (updates.length === 0) {
      res.status(400).json({ error: 'No fields to update' });
      return;
    }

    updates.push(`updated_at = now()`);
    values.push(req.params.id);

    const { rows: [updated] } = await pool.query(
      `UPDATE projects.projects SET ${updates.join(', ')} WHERE id = $${idx} RETURNING *`,
      values
    );

    res.json(updated);
  } catch (err) {
    console.error('Update project error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

projectRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { rows } = await pool.query('SELECT owner_id FROM projects.projects WHERE id = $1', [req.params.id]);
    if (rows.length === 0) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    if (rows[0].owner_id !== req.user!.userId && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Only the project owner or admin can delete' });
      return;
    }

    await pool.query('DELETE FROM projects.projects WHERE id = $1', [req.params.id]);
    res.status(204).send();
  } catch (err) {
    console.error('Delete project error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

projectRouter.post('/:id/members', requireRole('project_manager'), async (req: Request, res: Response) => {
  try {
    const { user_id, role } = req.body;
    if (!user_id) {
      res.status(400).json({ error: 'user_id is required' });
      return;
    }

    const validRoles = ['project_manager', 'member', 'guest'];
    const memberRole = validRoles.includes(role) ? role : 'member';

    const { rows: [membership] } = await pool.query(
      `INSERT INTO projects.project_members (project_id, user_id, role)
       VALUES ($1, $2, $3)
       ON CONFLICT (project_id, user_id) DO UPDATE SET role = $3
       RETURNING *`,
      [req.params.id, user_id, memberRole]
    );

    publishEvent('tasksphere.project.member.added', {
      project_id: req.params.id,
      user_id,
      role: memberRole,
    }).catch(() => {});

    res.status(201).json(membership);
  } catch (err) {
    console.error('Add member error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

projectRouter.delete('/:id/members/:userId', requireRole('project_manager'), async (req: Request, res: Response) => {
  try {
    const { rowCount } = await pool.query(
      'DELETE FROM projects.project_members WHERE project_id = $1 AND user_id = $2',
      [req.params.id, req.params.userId]
    );

    if (rowCount === 0) {
      res.status(404).json({ error: 'Member not found in project' });
      return;
    }

    publishEvent('tasksphere.project.member.removed', {
      project_id: req.params.id,
      user_id: req.params.userId,
    }).catch(() => {});

    res.status(204).send();
  } catch (err) {
    console.error('Remove member error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
