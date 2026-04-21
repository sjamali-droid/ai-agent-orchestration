# ISSUE-0050: Auth Pages (Frontend)

## Meta

- **Status**: backlog
- **Type**: story
- **Priority**: high
- **Sprint**: backlog
- **Assigned agent**: developer
- **Epic**: ISSUE-0005
- **Milestone**: m2

## Description

Next.js auth pages: login, register, forgot password. JWT token storage and refresh logic.

## Acceptance criteria

- [ ] Login page with email/password form
- [ ] Register page with name, email, password, confirm password
- [ ] Forgot password flow (email reset link)
- [ ] JWT stored in httpOnly cookie or secure storage
- [ ] Auto-refresh token before expiry
- [ ] Protected route wrapper (redirect to login if unauthenticated)
- [ ] Tailwind CSS styled, mobile-responsive
