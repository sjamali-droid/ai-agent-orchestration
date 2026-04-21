# ISSUE-0011: JWT Authentication Service

## Meta

- **Status**: done
- **Type**: story
- **Priority**: critical
- **Sprint**: S1
- **Assigned agent**: developer
- **Epic**: ISSUE-0001
- **Milestone**: m1

## Description

Implement JWT-based authentication: user registration, login, token refresh, and logout. Tokens must include role claims for RBAC (SRS §4).

## Acceptance criteria

- [ ] POST /auth/register — create user with hashed password (bcrypt)
- [ ] POST /auth/login — return access token (15min) + refresh token (7d)
- [ ] POST /auth/refresh — issue new access token from valid refresh token
- [ ] POST /auth/logout — invalidate refresh token
- [ ] JWT payload includes: userId, email, role
- [ ] Passwords never stored in plaintext
- [ ] Rate limiting on login endpoint
- [ ] Unit tests for all auth flows

## Dependencies

- Blocked by: ISSUE-0010 (needs API contract from Architect)
- Blocks: ISSUE-0012 (RBAC uses JWT claims)

## Linked artifacts

- Contract: `contracts/openapi/auth-service.openapi.yaml`
- Branch: `orchestration/feature/jwt-auth`
