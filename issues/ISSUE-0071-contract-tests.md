# ISSUE-0071: Contract Tests (OpenAPI)

## Meta

- **Status**: backlog
- **Type**: story
- **Priority**: high
- **Sprint**: backlog
- **Assigned agent**: qa
- **Epic**: ISSUE-0007
- **Milestone**: m3

## Description

Validate all service responses against their OpenAPI specs. Catch schema drift early.

## Acceptance criteria

- [ ] Contract test suite per OpenAPI spec in `contracts/openapi/`
- [ ] Validates response status codes, body schema, required fields
- [ ] Runs in CI on every PR
- [ ] Failures report: endpoint, expected schema, actual response
