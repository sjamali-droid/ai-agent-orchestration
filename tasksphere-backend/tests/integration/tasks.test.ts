import pool from '../../src/shared/utils/db';
import { VALID_STATUS_TRANSITIONS } from '../../src/shared/types';

const AUTH_BASE = 'http://localhost:3001';
const PROJECT_BASE = 'http://localhost:3002';
const TASK_BASE = 'http://localhost:3003';

interface AuthTokens { access_token: string; refresh_token: string }

const USER_A = {
  name: 'Task User A',
  email: `task-a-${Date.now()}@example.com`,
  password: 'Str0ngP@ssword!',
};

const USER_B = {
  name: 'Task User B',
  email: `task-b-${Date.now()}@example.com`,
  password: 'Str0ngP@ssword!',
};

async function registerAndLogin(
  user: typeof USER_A,
): Promise<AuthTokens & { userId: string }> {
  const regRes = await fetch(`${AUTH_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });

  const body =
    regRes.status === 409
      ? await (
          await fetch(`${AUTH_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: user.email, password: user.password }),
          })
        ).json()
      : await regRes.json();

  const payload = JSON.parse(
    Buffer.from(body.access_token.split('.')[1], 'base64').toString(),
  );
  return { ...body, userId: payload.userId ?? payload.sub };
}

function headers(token: string) {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
}

describe('task-service integration', () => {
  let authA: AuthTokens & { userId: string };
  let authB: AuthTokens & { userId: string };
  let projectId: string;
  let taskId: string;
  let commentId: string;

  beforeAll(async () => {
    authA = await registerAndLogin(USER_A);
    authB = await registerAndLogin(USER_B);

    const projRes = await fetch(`${PROJECT_BASE}/projects`, {
      method: 'POST',
      headers: headers(authA.access_token),
      body: JSON.stringify({ name: 'Task Test Project', description: 'temp' }),
    });
    const proj = await projRes.json();
    projectId = proj.id;

    await fetch(`${PROJECT_BASE}/projects/${projectId}/members`, {
      method: 'POST',
      headers: headers(authA.access_token),
      body: JSON.stringify({ user_id: authB.userId, role: 'member' }),
    });
  });

  afterAll(async () => {
    await pool.query('DELETE FROM comments WHERE task_id = $1', [taskId]).catch(() => {});
    await pool.query('DELETE FROM task_assignees WHERE task_id = $1', [taskId]).catch(() => {});
    await pool.query('DELETE FROM tasks WHERE project_id = $1', [projectId]).catch(() => {});
    await pool.query('DELETE FROM project_members WHERE project_id = $1', [projectId]).catch(() => {});
    await pool.query('DELETE FROM projects WHERE id = $1', [projectId]).catch(() => {});
    await pool.query('DELETE FROM users WHERE email = ANY($1)', [
      [USER_A.email, USER_B.email],
    ]);
    await pool.end();
  });

  // ── CRUD ──────────────────────────────────────────────────

  describe('CRUD', () => {
    it('should create a task', async () => {
      const res = await fetch(`${TASK_BASE}/projects/${projectId}/tasks`, {
        method: 'POST',
        headers: headers(authA.access_token),
        body: JSON.stringify({
          title: 'Integration test task',
          description: 'Created by integration suite',
          priority: 'high',
        }),
      });

      expect(res.status).toBe(201);
      const body = await res.json();
      expect(body).toHaveProperty('id');
      expect(body.status).toBe('backlog');
      taskId = body.id;
    });

    it('should list tasks in the project', async () => {
      const res = await fetch(`${TASK_BASE}/projects/${projectId}/tasks`, {
        headers: headers(authA.access_token),
      });

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.data.length).toBeGreaterThanOrEqual(1);
    });

    it('should get task by id', async () => {
      const res = await fetch(`${TASK_BASE}/tasks/${taskId}`, {
        headers: headers(authA.access_token),
      });

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.id).toBe(taskId);
    });

    it('should update the task', async () => {
      const res = await fetch(`${TASK_BASE}/tasks/${taskId}`, {
        method: 'PATCH',
        headers: headers(authA.access_token),
        body: JSON.stringify({ title: 'Updated title', priority: 'urgent' }),
      });

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.title).toBe('Updated title');
      expect(body.priority).toBe('urgent');
    });
  });

  // ── Status transitions ────────────────────────────────────

  describe('Status transitions', () => {
    it('should transition backlog → in_progress', async () => {
      const res = await fetch(`${TASK_BASE}/tasks/${taskId}/status`, {
        method: 'PATCH',
        headers: headers(authA.access_token),
        body: JSON.stringify({ status: 'in_progress' }),
      });

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.status).toBe('in_progress');
    });

    it('should transition in_progress → review', async () => {
      const res = await fetch(`${TASK_BASE}/tasks/${taskId}/status`, {
        method: 'PATCH',
        headers: headers(authA.access_token),
        body: JSON.stringify({ status: 'review' }),
      });

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.status).toBe('review');
    });

    it('should reject invalid transition review → backlog', async () => {
      const res = await fetch(`${TASK_BASE}/tasks/${taskId}/status`, {
        method: 'PATCH',
        headers: headers(authA.access_token),
        body: JSON.stringify({ status: 'backlog' }),
      });

      expect(res.status).toBe(400);
    });

    it('should transition review → done', async () => {
      const res = await fetch(`${TASK_BASE}/tasks/${taskId}/status`, {
        method: 'PATCH',
        headers: headers(authA.access_token),
        body: JSON.stringify({ status: 'done' }),
      });

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.status).toBe('done');
    });

    it('should allow done → backlog (re-open)', async () => {
      const res = await fetch(`${TASK_BASE}/tasks/${taskId}/status`, {
        method: 'PATCH',
        headers: headers(authA.access_token),
        body: JSON.stringify({ status: 'backlog' }),
      });

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.status).toBe('backlog');
    });
  });

  // ── Assignment ────────────────────────────────────────────

  describe('Assignment', () => {
    it('should assign user B to the task', async () => {
      const res = await fetch(`${TASK_BASE}/tasks/${taskId}/assignees`, {
        method: 'POST',
        headers: headers(authA.access_token),
        body: JSON.stringify({ user_ids: [authB.userId] }),
      });

      expect(res.status).toBe(201);
    });

    it('should list assignees including user B', async () => {
      const res = await fetch(`${TASK_BASE}/tasks/${taskId}/assignees`, {
        headers: headers(authA.access_token),
      });

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.some((a: any) => a.user_id === authB.userId)).toBe(true);
    });

    it('should unassign user B', async () => {
      const res = await fetch(
        `${TASK_BASE}/tasks/${taskId}/assignees/${authB.userId}`,
        { method: 'DELETE', headers: headers(authA.access_token) },
      );

      expect(res.status).toBe(204);
    });
  });

  // ── Comments ──────────────────────────────────────────────

  describe('Comments', () => {
    it('should add a comment', async () => {
      const res = await fetch(`${TASK_BASE}/tasks/${taskId}/comments`, {
        method: 'POST',
        headers: headers(authA.access_token),
        body: JSON.stringify({ body: 'Test comment from integration suite' }),
      });

      expect(res.status).toBe(201);
      const body = await res.json();
      expect(body).toHaveProperty('id');
      commentId = body.id;
    });

    it('should list comments on the task', async () => {
      const res = await fetch(`${TASK_BASE}/tasks/${taskId}/comments`, {
        headers: headers(authA.access_token),
      });

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.some((c: any) => c.id === commentId)).toBe(true);
    });

    it('should edit the comment', async () => {
      const res = await fetch(`${TASK_BASE}/comments/${commentId}`, {
        method: 'PATCH',
        headers: headers(authA.access_token),
        body: JSON.stringify({ body: 'Updated comment body' }),
      });

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.body).toBe('Updated comment body');
    });

    it('should delete the comment', async () => {
      const res = await fetch(`${TASK_BASE}/comments/${commentId}`, {
        method: 'DELETE',
        headers: headers(authA.access_token),
      });

      expect(res.status).toBe(204);
    });
  });

  // ── Full-text search ──────────────────────────────────────

  describe('Search', () => {
    it('should find tasks by keyword', async () => {
      await fetch(`${TASK_BASE}/tasks/${taskId}`, {
        method: 'PATCH',
        headers: headers(authA.access_token),
        body: JSON.stringify({ title: 'Searchable unique keyword xylophone' }),
      });

      const res = await fetch(
        `${TASK_BASE}/projects/${projectId}/tasks?search=xylophone`,
        { headers: headers(authA.access_token) },
      );

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.data.length).toBeGreaterThanOrEqual(1);
      expect(body.data[0].title).toContain('xylophone');
    });
  });

  // ── Delete task ───────────────────────────────────────────

  describe('Delete', () => {
    it('should soft-delete the task', async () => {
      const res = await fetch(`${TASK_BASE}/tasks/${taskId}`, {
        method: 'DELETE',
        headers: headers(authA.access_token),
      });

      expect(res.status).toBe(204);
    });
  });
});
