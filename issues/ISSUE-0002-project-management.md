# ISSUE-0002: Project Management

## Meta

- **Status**: backlog
- **Type**: epic
- **Priority**: high
- **Sprint**: backlog
- **Assigned agent**: developer
- **Epic**: —
- **Milestone**: m1

## Description

Implement project CRUD, privacy controls, membership management, and the project dashboard showing progress. Every task in the system must belong to a parent project (SRS §3.1).

## Acceptance criteria

- [ ] Projects can be created, read, updated, deleted
- [ ] Public/Private toggle enforced at API and UI level
- [ ] Members can be invited/removed from projects
- [ ] Dashboard shows aggregated progress percentage per project
- [ ] RBAC enforced: only PM+ roles can create/delete projects

## Dependencies

- Blocked by: ISSUE-0001 (auth + RBAC must exist)
- Blocks: ISSUE-0003 (tasks belong to projects)

## Linked artifacts

- Contract: `contracts/openapi/project-service.openapi.yaml`
