# ISSUE-0007: Quality Assurance

## Meta

- **Status**: backlog
- **Type**: epic
- **Priority**: high
- **Sprint**: backlog
- **Assigned agent**: qa
- **Epic**: —
- **Milestone**: m3

## Description

Comprehensive testing for beta readiness: API integration tests, OpenAPI contract tests, Playwright E2E flows, and k6 load testing against the task update <500ms SLA (SRS §5).

## Acceptance criteria

- [ ] API integration tests covering auth, project, task, comment endpoints
- [ ] Contract tests validating all OpenAPI specs
- [ ] Playwright E2E: login → create project → create task → move through workflow → comment
- [ ] k6 load test: 100 concurrent users, task update P95 < 500ms
- [ ] Test reports generated as artifacts with trace IDs for failures
- [ ] All critical paths have regression coverage

## Dependencies

- Blocked by: ISSUE-0003 (task API), ISSUE-0005 (frontend for E2E), ISSUE-0006 (deployed env)
- Blocks: Beta release

## Linked artifacts

- Contract: all `contracts/openapi/*.openapi.yaml`
