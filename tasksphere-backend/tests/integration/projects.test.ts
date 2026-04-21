import pool from '../../src/shared/utils/db';

const AUTH_BASE = 'http://localhost:3001';
const PROJECT_BASE = 'http://localhost:3002';

interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

const OWNER = {
  name: 'Project Owner',
  email: `proj-owner-${Date.now()}@example.com`,
  password: 'Str0ngP@ssword!',
};

const OUTSIDER = {
  name: 'Outsider User',
  email: `proj-outsider-${Date.now()}@example.com`,
  password: 'Str0ngP@ssword!',
};

async function registerAndLogin(user: typeof OWNER): Promise<AuthTokens & { userId: string }> {
  const regRes = await fetch(`${AUTH_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });

  if (regRes.status === 409) {
    const loginRes = await fetch(`${AUTH_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: user.email, password: user.password }),
    });
    const body = await loginRes.json();
    const payload = JSON.parse(
      Buffer.from(body.access_token.split('.')[1], 'base64').toString(),
    );
    return { ...body, userId: payload.userId ?? payload.sub };
  }

  const body = await regRes.json();
  const payload = JSON.parse(
    Buffer.from(body.access_token.split('.')[1], 'base64').toString(),
  );
  return { ...body, userId: payload.userId ?? payload.sub };
}

function authHeaders(token: string) {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

describe('project-service integration', () => {
  let ownerAuth: AuthTokens & { userId: string };
  let outsiderAuth: AuthTokens & { userId: string };
  let projectId: string;

  beforeAll(async () => {
    ownerAuth = await registerAndLogin(OWNER);
    outsiderAuth = await registerAndLogin(OUTSIDER);
  });

  afterAll(async () => {
    if (projectId) {
      await pool.query('DELETE FROM project_members WHERE project_id = $1', [projectId]);
      await pool.query('DELETE FROM projects WHERE id = $1', [projectId]);
    }
    await pool.query('DELETE FROM users WHERE email = ANY($1)', [
      [OWNER.email, OUTSIDER.email],
    ]);
    await pool.end();
  });

  // ── CRUD ──────────────────────────────────────────────────

  describe('CRUD', () => {
    it('should create a project', async () => {
      const res = await fetch(`${PROJECT_BASE}/projects`, {
        method: 'POST',
        headers: authHeaders(ownerAuth.access_token),
        body: JSON.stringify({
          name: 'Integration Test Project',
          description: 'Created by integration test',
          is_private: false,
        }),
      });

      expect(res.status).toBe(201);
      const body = await res.json();
      expect(body).toHaveProperty('id');
      expect(body.name).toBe('Integration Test Project');
      projectId = body.id;
    });

    it('should list projects containing the new project', async () => {
      const res = await fetch(`${PROJECT_BASE}/projects`, {
        headers: authHeaders(ownerAuth.access_token),
      });

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body).toHaveProperty('data');
      expect(body.data.some((p: any) => p.id === projectId)).toBe(true);
    });

    it('should get project by id', async () => {
      const res = await fetch(`${PROJECT_BASE}/projects/${projectId}`, {
        headers: authHeaders(ownerAuth.access_token),
      });

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.id).toBe(projectId);
    });

    it('should update the project', async () => {
      const res = await fetch(`${PROJECT_BASE}/projects/${projectId}`, {
        method: 'PATCH',
        headers: authHeaders(ownerAuth.access_token),
        body: JSON.stringify({ name: 'Updated Project Name' }),
      });

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.name).toBe('Updated Project Name');
    });
  });

  // ── Membership ────────────────────────────────────────────

  describe('Membership', () => {
    it('should add a member to the project', async () => {
      const res = await fetch(`${PROJECT_BASE}/projects/${projectId}/members`, {
        method: 'POST',
        headers: authHeaders(ownerAuth.access_token),
        body: JSON.stringify({
          user_id: outsiderAuth.userId,
          role: 'member',
        }),
      });

      expect(res.status).toBe(201);
      const body = await res.json();
      expect(body.user_id).toBe(outsiderAuth.userId);
    });

    it('should list members including the new member', async () => {
      const res = await fetch(`${PROJECT_BASE}/projects/${projectId}/members`, {
        headers: authHeaders(ownerAuth.access_token),
      });

      expect(res.status).toBe(200);
      const members = await res.json();
      expect(Array.isArray(members)).toBe(true);
      expect(members.some((m: any) => m.user_id === outsiderAuth.userId)).toBe(true);
    });

    it('should remove the member', async () => {
      const res = await fetch(
        `${PROJECT_BASE}/projects/${projectId}/members/${outsiderAuth.userId}`,
        {
          method: 'DELETE',
          headers: authHeaders(ownerAuth.access_token),
        },
      );

      expect(res.status).toBe(204);
    });
  });

  // ── Privacy ───────────────────────────────────────────────

  describe('Privacy', () => {
    it('should hide a private project from non-members', async () => {
      await fetch(`${PROJECT_BASE}/projects/${projectId}`, {
        method: 'PATCH',
        headers: authHeaders(ownerAuth.access_token),
        body: JSON.stringify({ is_private: true }),
      });

      const res = await fetch(`${PROJECT_BASE}/projects/${projectId}`, {
        headers: authHeaders(outsiderAuth.access_token),
      });

      expect([403, 404]).toContain(res.status);
    });
  });

  // ── Delete ────────────────────────────────────────────────

  describe('Delete', () => {
    it('should delete the project', async () => {
      await fetch(`${PROJECT_BASE}/projects/${projectId}`, {
        method: 'PATCH',
        headers: authHeaders(ownerAuth.access_token),
        body: JSON.stringify({ is_private: false }),
      });

      const res = await fetch(`${PROJECT_BASE}/projects/${projectId}`, {
        method: 'DELETE',
        headers: authHeaders(ownerAuth.access_token),
      });

      expect(res.status).toBe(204);
      projectId = ''; // prevent afterAll double-delete
    });
  });
});
