import pool from '../src/shared/utils/db';
import bcrypt from 'bcryptjs';

async function seed() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const adminHash = await bcrypt.hash('admin123456', 10);
    const pmHash = await bcrypt.hash('pm123456789', 10);
    const memberHash = await bcrypt.hash('member12345', 10);
    const guestHash = await bcrypt.hash('guest123456', 10);

    const { rows: [admin] } = await client.query(
      `INSERT INTO auth.users (name, email, password_hash, role)
       VALUES ('Admin User', 'admin@tasksphere.local', $1, 'admin')
       RETURNING id`,
      [adminHash]
    );

    const { rows: [pm] } = await client.query(
      `INSERT INTO auth.users (name, email, password_hash, role)
       VALUES ('PM User', 'pm@tasksphere.local', $1, 'project_manager')
       RETURNING id`,
      [pmHash]
    );

    const { rows: [member] } = await client.query(
      `INSERT INTO auth.users (name, email, password_hash, role)
       VALUES ('Dev Member', 'member@tasksphere.local', $1, 'member')
       RETURNING id`,
      [memberHash]
    );

    await client.query(
      `INSERT INTO auth.users (name, email, password_hash, role)
       VALUES ('Guest Viewer', 'guest@tasksphere.local', $1, 'guest')`,
      [guestHash]
    );

    const { rows: [project] } = await client.query(
      `INSERT INTO projects.projects (name, description, owner_id)
       VALUES ('Sample Project', 'A seed project for development testing', $1)
       RETURNING id`,
      [pm.id]
    );

    await client.query(
      `INSERT INTO projects.project_members (project_id, user_id, role) VALUES
       ($1, $2, 'project_manager'),
       ($1, $3, 'member')`,
      [project.id, pm.id, member.id]
    );

    const statuses = ['backlog', 'in_progress', 'review', 'done'];
    const priorities = ['low', 'medium', 'high', 'urgent'];
    for (let i = 0; i < 8; i++) {
      await client.query(
        `INSERT INTO tasks.tasks (project_id, title, description, status, priority, created_by)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          project.id,
          `Sample Task ${i + 1}`,
          `Markdown description for task **${i + 1}**`,
          statuses[i % 4],
          priorities[i % 4],
          member.id,
        ]
      );
    }

    await client.query(
      `INSERT INTO notifications.user_preferences (user_id) VALUES ($1), ($2), ($3)`,
      [admin.id, pm.id, member.id]
    );

    await client.query('COMMIT');
    console.log('Seed complete: 4 users, 1 project, 8 tasks');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Seed failed:', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
