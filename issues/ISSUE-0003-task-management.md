# ISSUE-0003: Task Management

## Meta

- **Status**: backlog
- **Type**: epic
- **Priority**: high
- **Sprint**: backlog
- **Assigned agent**: developer
- **Epic**: —
- **Milestone**: m2

## Description

Core task engine: CRUD with markdown, status workflow state machine, multi-member assignment, priority flags, file attachments (S3), and filtering/search (SRS §3.2).

## Acceptance criteria

- [ ] Task CRUD with markdown body rendering
- [ ] Status workflow: Backlog → In Progress → Review → Done (state machine, no skipping)
- [ ] Multi-member assignment with notification triggers
- [ ] Priority flags: Low, Medium, High, Urgent
- [ ] Image/attachment upload to S3 (PNG, JPG, PDF; max 5 MB)
- [ ] Task filtering by status, priority, assignee, project
- [ ] Task search by title/description

## Dependencies

- Blocked by: ISSUE-0002 (tasks belong to projects)
- Blocks: ISSUE-0004 (comments on tasks), ISSUE-0007 (QA needs tasks to test)

## Linked artifacts

- Contract: `contracts/openapi/task-service.openapi.yaml`
- Contract: `contracts/asyncapi/task-events.asyncapi.yaml`
