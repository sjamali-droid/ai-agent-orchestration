# ISSUE-0032: Task Assignment (Multi-Member)

## Meta

- **Status**: backlog
- **Type**: story
- **Priority**: high
- **Sprint**: backlog
- **Assigned agent**: developer
- **Epic**: ISSUE-0003
- **Milestone**: m2

## Description

Tasks can be assigned to one or more project members. Assignment triggers notification events (SRS §3.2).

## Acceptance criteria

- [ ] POST /tasks/:id/assignees — assign members (PM or task creator)
- [ ] DELETE /tasks/:id/assignees/:userId — unassign
- [ ] GET /tasks/:id/assignees — list assignees
- [ ] Only project members can be assigned
- [ ] Kafka event on assign/unassign (consumed by notification service)
- [ ] Unit tests
