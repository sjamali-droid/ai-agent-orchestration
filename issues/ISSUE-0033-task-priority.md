# ISSUE-0033: Task Prioritization

## Meta

- **Status**: backlog
- **Type**: story
- **Priority**: medium
- **Sprint**: backlog
- **Assigned agent**: developer
- **Epic**: ISSUE-0003
- **Milestone**: m2

## Description

Tasks carry a priority flag: Low, Medium, High, Urgent. Default is Medium (SRS §3.2).

## Acceptance criteria

- [ ] Priority field on task (enum: low, medium, high, urgent)
- [ ] Default priority: medium on create
- [ ] PATCH /tasks/:id — update priority
- [ ] Tasks filterable/sortable by priority
- [ ] Unit tests
