# ISSUE-0004: Collaboration

## Meta

- **Status**: backlog
- **Type**: epic
- **Priority**: medium
- **Sprint**: backlog
- **Assigned agent**: developer
- **Epic**: —
- **Milestone**: m2

## Description

Enable team collaboration on tasks: threaded comments, in-app notifications, and email alerts for assignment or status changes (SRS §3.3).

## Acceptance criteria

- [ ] Threaded comments on tasks (create, edit, delete own)
- [ ] In-app notification system (bell icon, unread count)
- [ ] Notifications fired on: task assignment, status change, new comment
- [ ] Email notifications (configurable per user: on/off)
- [ ] Kafka events for all notification triggers

## Dependencies

- Blocked by: ISSUE-0003 (tasks must exist for comments/notifications)
- Blocks: none

## Linked artifacts

- Contract: `contracts/asyncapi/notification-events.asyncapi.yaml`
