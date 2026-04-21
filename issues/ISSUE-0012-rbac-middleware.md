# ISSUE-0012: RBAC Middleware & Permission Enforcement

## Meta

- **Status**: done
- **Type**: story
- **Priority**: critical
- **Sprint**: S1
- **Assigned agent**: developer
- **Epic**: ISSUE-0001
- **Milestone**: m1

## Description

Build Express middleware that extracts role from JWT and enforces permissions per endpoint. Four roles: Admin, Project Manager, Member, Guest (SRS §2).

## Acceptance criteria

- [ ] Middleware extracts and validates JWT on protected routes
- [ ] Role hierarchy: Admin > Project Manager > Member > Guest
- [ ] Permission matrix implemented (which role can hit which endpoint)
- [ ] 403 Forbidden returned for insufficient permissions
- [ ] Guest role: read-only on assigned projects only
- [ ] Unit tests for each role against protected endpoints

## Dependencies

- Blocked by: ISSUE-0011 (JWT must exist)
- Blocks: ISSUE-0013, ISSUE-0020 (all CRUD needs RBAC)

## Linked artifacts

- Contract: `contracts/openapi/auth-service.openapi.yaml`
- Branch: `orchestration/feature/rbac-middleware`
