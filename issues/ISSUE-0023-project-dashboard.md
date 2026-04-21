# ISSUE-0023: Project Dashboard API

## Meta

- **Status**: backlog
- **Type**: story
- **Priority**: medium
- **Sprint**: backlog
- **Assigned agent**: developer
- **Epic**: ISSUE-0002
- **Milestone**: m1

## Description

API endpoint returning aggregated project progress (percentage of tasks in Done status) for the dashboard view (SRS §3.1).

## Acceptance criteria

- [ ] GET /projects/:id/stats — returns task count by status + progress %
- [ ] GET /projects/dashboard — returns summary stats for all user's projects
- [ ] Efficient query (single SQL, not N+1)
- [ ] Unit tests
