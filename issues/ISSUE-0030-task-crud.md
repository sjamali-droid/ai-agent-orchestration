# ISSUE-0030: Task CRUD with Markdown Support

## Meta

- **Status**: backlog
- **Type**: story
- **Priority**: high
- **Sprint**: backlog
- **Assigned agent**: developer
- **Epic**: ISSUE-0003
- **Milestone**: m2

## Description

REST API for task create/read/update/delete. Task details field supports markdown. Title max 100 chars (SRS §3.2).

## Acceptance criteria

- [ ] POST /projects/:id/tasks — create task (Member+ role)
- [ ] GET /projects/:id/tasks — list tasks (paginated, filterable)
- [ ] GET /tasks/:id — task detail with rendered markdown preview
- [ ] PATCH /tasks/:id — update task fields
- [ ] DELETE /tasks/:id — soft delete (PM+ role)
- [ ] Title validated: required, max 100 characters
- [ ] Markdown stored raw, rendered on read
- [ ] Kafka event on task create/update/delete
- [ ] Unit tests
