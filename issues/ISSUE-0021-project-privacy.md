# ISSUE-0021: Project Privacy Toggle

## Meta

- **Status**: backlog
- **Type**: story
- **Priority**: medium
- **Sprint**: backlog
- **Assigned agent**: developer
- **Epic**: ISSUE-0002
- **Milestone**: m1

## Description

Projects can be toggled between Public (visible to all org users) and Private (visible only to members). SRS §3.1.

## Acceptance criteria

- [ ] PATCH /projects/:id/privacy — toggle public/private (PM+ role)
- [ ] Private projects excluded from listing for non-members
- [ ] Guest role only sees assigned private projects
- [ ] Unit tests
