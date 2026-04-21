# ISSUE-0020: Project CRUD API

## Meta

- **Status**: backlog
- **Type**: story
- **Priority**: high
- **Sprint**: backlog
- **Assigned agent**: developer
- **Epic**: ISSUE-0002
- **Milestone**: m1

## Description

REST API for creating, reading, updating, and deleting projects. Only Project Manager+ roles can create/delete (SRS §3.1).

## Acceptance criteria

- [ ] POST /projects — create project (PM+ role)
- [ ] GET /projects — list projects visible to current user
- [ ] GET /projects/:id — project detail with member list
- [ ] PATCH /projects/:id — update name, description (PM+ role)
- [ ] DELETE /projects/:id — soft delete (Admin only)
- [ ] Unit tests for all CRUD + RBAC enforcement
