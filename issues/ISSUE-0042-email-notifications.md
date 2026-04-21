# ISSUE-0042: Email Notifications

## Meta

- **Status**: backlog
- **Type**: story
- **Priority**: low
- **Sprint**: backlog
- **Assigned agent**: developer
- **Epic**: ISSUE-0004
- **Milestone**: m2

## Description

Email alerts for assignment and status changes. Users can toggle email notifications on/off in their profile (SRS §3.3).

## Acceptance criteria

- [ ] Email sent on: task assigned to user, task status changed on owned task
- [ ] User preference: email_notifications on/off (PATCH /users/:id/preferences)
- [ ] Email template with task title, project name, link back to app
- [ ] Use transactional email service (SendGrid, SES, or SMTP)
- [ ] Kafka consumer (same notification events, separate handler)
- [ ] Unit tests + integration test with email mock
