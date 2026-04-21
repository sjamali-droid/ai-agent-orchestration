# ISSUE-0040: Threaded Comments on Tasks

## Meta

- **Status**: backlog
- **Type**: story
- **Priority**: medium
- **Sprint**: backlog
- **Assigned agent**: developer
- **Epic**: ISSUE-0004
- **Milestone**: m2

## Description

Threaded comment system on tasks: create, edit own, delete own. Comments support markdown (SRS §3.3).

## Acceptance criteria

- [ ] POST /tasks/:id/comments — create comment (Member+ role)
- [ ] PATCH /comments/:id — edit own comment
- [ ] DELETE /comments/:id — delete own comment (or PM+ can delete any)
- [ ] GET /tasks/:id/comments — list comments (threaded, paginated)
- [ ] Reply-to support (parent_comment_id)
- [ ] Kafka event on new comment (triggers notification)
- [ ] Unit tests
