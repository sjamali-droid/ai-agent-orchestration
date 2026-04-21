# ISSUE-0005: Frontend Application

## Meta

- **Status**: backlog
- **Type**: epic
- **Priority**: high
- **Sprint**: backlog
- **Assigned agent**: developer
- **Epic**: —
- **Milestone**: m2

## Description

Next.js frontend with Tailwind CSS: authentication pages, project dashboard, Kanban task board, task detail view with comments/attachments, and admin panel for user/role management (SRS §4).

## Acceptance criteria

- [ ] Auth pages: login, register, forgot password
- [ ] Project list with progress dashboard
- [ ] Kanban-style task board (drag-drop between status columns)
- [ ] Task detail modal/page with markdown preview, comments, attachments
- [ ] Admin panel: user list, role assignment, org settings
- [ ] Mobile-responsive layout (Tailwind breakpoints)
- [ ] JWT token handling (refresh, logout, protected routes)

## Dependencies

- Blocked by: ISSUE-0001 (auth API), ISSUE-0002 (project API), ISSUE-0003 (task API)
- Blocks: ISSUE-0007 (E2E tests need UI)

## Linked artifacts

- Branch: `orchestration/epic/frontend`
