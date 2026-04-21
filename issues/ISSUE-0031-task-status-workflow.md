# ISSUE-0031: Task Status Workflow State Machine

## Meta

- **Status**: backlog
- **Type**: story
- **Priority**: high
- **Sprint**: backlog
- **Assigned agent**: developer
- **Epic**: ISSUE-0003
- **Milestone**: m2

## Description

Enforce task status transitions: Backlog → In Progress → Review → Done. Invalid transitions rejected (SRS §3.2).

## Acceptance criteria

- [ ] PATCH /tasks/:id/status — transition status
- [ ] Valid transitions enforced (no skipping: Backlog cannot go directly to Done)
- [ ] Allowed transitions: Backlog→InProgress, InProgress→Review, Review→Done, Review→InProgress (reject), Done→Backlog (reopen)
- [ ] Kafka event emitted on every status change (includes old + new status)
- [ ] 400 Bad Request on invalid transition with clear message
- [ ] Unit tests for all valid/invalid transitions
