# ISSUE-0070: API Integration Tests

## Meta

- **Status**: backlog
- **Type**: story
- **Priority**: high
- **Sprint**: backlog
- **Assigned agent**: qa
- **Epic**: ISSUE-0007
- **Milestone**: m3

## Description

Integration tests for all API endpoints: auth, user, project, task, comment, notification, attachment flows.

## Acceptance criteria

- [ ] Auth flow: register → login → refresh → protected endpoint → logout
- [ ] RBAC: test each role against each endpoint
- [ ] Project CRUD + membership + privacy
- [ ] Task CRUD + status workflow + assignment + priority
- [ ] Comment CRUD + threading
- [ ] Attachment upload/download/delete
- [ ] All tests run against dev environment
- [ ] Test reports with trace IDs for failures
