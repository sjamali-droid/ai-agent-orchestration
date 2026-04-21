# ISSUE-0022: Project Membership & Invitation

## Meta

- **Status**: backlog
- **Type**: story
- **Priority**: high
- **Sprint**: backlog
- **Assigned agent**: developer
- **Epic**: ISSUE-0002
- **Milestone**: m1

## Description

Manage project members: invite users, remove members, list members with roles.

## Acceptance criteria

- [ ] POST /projects/:id/members — invite user (PM+ role)
- [ ] DELETE /projects/:id/members/:userId — remove member (PM+ role)
- [ ] GET /projects/:id/members — list members with roles
- [ ] Members cannot remove themselves if they are the sole PM
- [ ] Kafka event emitted on member add/remove
- [ ] Unit tests
