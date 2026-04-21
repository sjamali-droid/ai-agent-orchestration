import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import pool from '../src/shared/utils/db';

const MIGRATIONS_DIR = join(__dirname, '..', 'migrations');

async function getAppliedVersions(): Promise<number[]> {
  try {
    const { rows } = await pool.query('SELECT version FROM public.schema_migrations ORDER BY version');
    return rows.map((r) => r.version);
  } catch {
    return [];
  }
}

async function up() {
  const applied = await getAppliedVersions();
  const files = readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith('.sql'))
    .sort();

  for (const file of files) {
    const version = parseInt(file.split('_')[0]);
    if (applied.includes(version)) {
      console.log(`  skip  ${file} (already applied)`);
      continue;
    }

    console.log(`  apply ${file}`);
    const sql = readFileSync(join(MIGRATIONS_DIR, file), 'utf-8');
    await pool.query(sql);
    console.log(`  done  ${file}`);
  }

  console.log('All migrations applied.');
}

async function down() {
  console.log('Rollback not implemented — add DOWN migrations to each file.');
}

const command = process.argv[2];
if (command === 'up') {
  up().then(() => pool.end());
} else if (command === 'down') {
  down().then(() => pool.end());
} else {
  console.log('Usage: ts-node scripts/migrate.ts [up|down]');
  pool.end();
}
