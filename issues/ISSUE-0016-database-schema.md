# ISSUE-0016: Database Schema & Migrations

## Meta

- **Status**: done
- **Type**: story
- **Priority**: critical
- **Sprint**: S1
- **Assigned agent**: developer
- **Epic**: ISSUE-0001
- **Milestone**: m1

## Description

Implement the PostgreSQL schema designed by the Architect: users, roles, projects, project_members, tasks, comments, attachments. Use a migration tool (e.g. node-pg-migrate or Prisma).

## Acceptance criteria

- [ ] Migration files for all tables
- [ ] Indexes on: tasks.project_id, tasks.status, tasks.assignee, projects.owner_id
- [ ] Foreign key constraints enforcing data integrity
- [ ] Seed script for development data (sample users, project, tasks)
- [ ] Migrations run idempotently (safe to re-run)
- [ ] Schema supports thousands of tasks per project (SRS §5)

## Dependencies

- Blocked by: ISSUE-0010 (Architect provides schema design)
- Blocks: ISSUE-0011 (auth needs users table)

## Linked artifacts

- ADR: `adr/ADR-0002-database-strategy.md`
- Branch: `orchestration/feature/database-schema`
