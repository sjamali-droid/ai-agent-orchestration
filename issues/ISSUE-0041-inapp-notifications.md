# ISSUE-0041: In-App Notification System

## Meta

- **Status**: backlog
- **Type**: story
- **Priority**: medium
- **Sprint**: backlog
- **Assigned agent**: developer
- **Epic**: ISSUE-0004
- **Milestone**: m2

## Description

In-app notifications for task assignment, status changes, and new comments. Bell icon with unread count (SRS §3.3).

## Acceptance criteria

- [ ] Notification service consumes Kafka events (assignment, status change, comment)
- [ ] GET /notifications — list user's notifications (paginated)
- [ ] PATCH /notifications/:id/read — mark as read
- [ ] PATCH /notifications/read-all — mark all as read
- [ ] GET /notifications/unread-count — for badge display
- [ ] Notifications stored in DB with type, message, link, read flag
- [ ] Unit tests
