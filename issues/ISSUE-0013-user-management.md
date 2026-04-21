# ISSUE-0013: User Management CRUD

## Meta

- **Status**: done
- **Type**: story
- **Priority**: high
- **Sprint**: S1
- **Assigned agent**: developer
- **Epic**: ISSUE-0001
- **Milestone**: m1

## Description

Admin-level user management: list users, view profile, update roles, deactivate accounts.

## Acceptance criteria

- [ ] GET /users — list all users (Admin only, paginated)
- [ ] GET /users/:id — view user profile
- [ ] PATCH /users/:id/role — assign role (Admin only)
- [ ] DELETE /users/:id — deactivate user (Admin only, soft delete)
- [ ] Users can update own profile (name, email, password)
- [ ] Unit tests

## Dependencies

- Blocked by: ISSUE-0012 (RBAC gates admin endpoints)
- Blocks: ISSUE-0022 (project membership uses user list)

## Linked artifacts

- Contract: `contracts/openapi/auth-service.openapi.yaml`
- Branch: `orchestration/feature/user-management`
