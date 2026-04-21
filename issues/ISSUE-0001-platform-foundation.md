# ISSUE-0001: Platform Foundation & Architecture

## Meta

- **Status**: ready
- **Type**: epic
- **Priority**: critical
- **Sprint**: S1
- **Assigned agent**: software_architect
- **Epic**: —
- **Milestone**: m1

## Description

Establish the platform's architectural foundation: service boundaries, database schemas, authentication, RBAC, Dapr components, and local development environment. This epic must complete before any feature work begins.

## Acceptance criteria

- [ ] Architecture design documented (C4 diagrams, ADRs, OpenAPI stubs)
- [ ] JWT authentication working end-to-end (register, login, refresh)
- [ ] RBAC middleware enforcing 4 roles (Admin, PM, Member, Guest)
- [ ] User management CRUD operational
- [ ] PostgreSQL schema with migrations
- [ ] Local dev environment running (Docker Compose + Dapr)
- [ ] CI/CD pipeline skeleton in place

## Dependencies

- Blocked by: none (first epic)
- Blocks: ISSUE-0002, ISSUE-0003, ISSUE-0004, ISSUE-0005

## Linked artifacts

- ADR: (to be created by Architect)
- Contract: `contracts/openapi/auth-service.openapi.yaml`
- Branch: `orchestration/epic/platform-foundation`
