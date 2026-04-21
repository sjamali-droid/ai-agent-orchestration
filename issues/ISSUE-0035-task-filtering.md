# ISSUE-0035: Task Filtering & Search

## Meta

- **Status**: backlog
- **Type**: story
- **Priority**: medium
- **Sprint**: backlog
- **Assigned agent**: developer
- **Epic**: ISSUE-0003
- **Milestone**: m2

## Description

Filter tasks by status, priority, assignee. Search by title and description text.

## Acceptance criteria

- [ ] GET /projects/:id/tasks?status=in_progress&priority=high&assignee=userId
- [ ] GET /projects/:id/tasks?search=keyword (searches title + description)
- [ ] Filters combinable (AND logic)
- [ ] Pagination maintained with filters
- [ ] SQL indexes support filter performance
- [ ] Unit tests
