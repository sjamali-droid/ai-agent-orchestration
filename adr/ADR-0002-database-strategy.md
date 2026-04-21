# ADR-0002: Database Strategy — PostgreSQL Only

## Status

ACCEPTED

## Date

2026-04-20

## Context

The SRS requires relational data (users, roles, projects, tasks with foreign keys) and document-like data (markdown task descriptions, threaded comments, notification payloads). We evaluated PostgreSQL-only vs PostgreSQL + MongoDB.

## Decision

**PostgreSQL only** for all persistent data.

### Rationale

- All core entities (users, projects, tasks, comments, attachments, notifications) have strong relational links (foreign keys, ownership chains, RBAC joins).
- PostgreSQL `text` columns handle markdown storage natively.
- PostgreSQL `jsonb` columns handle semi-structured data (notification payloads, user preferences) without needing a separate document store.
- Threaded comments use a `parent_comment_id` self-referential FK — a relational pattern, not a document pattern.
- One database engine simplifies operations: single backup strategy, single migration tool, single connection pool pattern, single monitoring target.

### Per-service database isolation

Each service owns its own **logical database** (or schema) within the same PostgreSQL cluster for dev/staging. Production may use separate clusters per service if scaling demands it.

| Service | Database / Schema | Key tables |
|---------|------------------|------------|
| auth-service | `auth` | users, roles, refresh_tokens |
| project-service | `projects` | projects, project_members |
| task-service | `tasks` | tasks, task_assignees, comments, attachment_metadata |
| file-service | `files` | (stateless — metadata stored in task-service; file-service only manages S3 interaction) |
| notification-service | `notifications` | notifications, user_preferences |

### Indexing strategy (SRS §5 — thousands of tasks per project)

- `tasks.project_id` — B-tree index (filter by project)
- `tasks.status` — B-tree index (Kanban column queries)
- `tasks.priority` — B-tree index (sort/filter)
- `task_assignees.user_id` — B-tree index ("my tasks" queries)
- `comments.task_id` — B-tree index (load comments for task)
- `notifications.user_id, notifications.read` — composite index (unread count)
- Full-text search: `tasks.title, tasks.description` — GIN index with `tsvector`

## Consequences

### Positive

- Single database technology: simpler ops, backups, monitoring, migrations
- Strong consistency for RBAC and ownership chains
- PostgreSQL jsonb covers any semi-structured needs
- Well-understood tooling (node-postgres, Prisma, pg-migrate)

### Negative

- If notification volume becomes extreme (millions/day), may need to revisit with a purpose-built store (but that is well beyond MVP)
- Full-text search is basic compared to Elasticsearch (acceptable for task search; ELK handles log search)

## Alternatives considered

| Option | Pros | Cons |
|--------|------|------|
| PostgreSQL + MongoDB | Document flexibility for comments/notifications | Two engines to operate, no real need for document model |
| PostgreSQL + Redis (caching) | Fast reads for dashboards/counts | Added complexity; premature for MVP |

## Agents affected

- [x] Software Architect — schema design follows this decision
- [x] Developer — uses PostgreSQL client only, no Mongoose
- [x] DevSecOps — single DB to backup/monitor/secure

## Related

- Issue: ISSUE-0010
- ADR: ADR-0001 (service decomposition defines which service owns which tables)
