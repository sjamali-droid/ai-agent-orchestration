# ISSUE-0073: Load Tests (k6)

## Meta

- **Status**: backlog
- **Type**: story
- **Priority**: medium
- **Sprint**: backlog
- **Assigned agent**: qa
- **Epic**: ISSUE-0007
- **Milestone**: m3

## Description

k6 load tests validating the <500ms task update SLA (SRS §5) under concurrent load.

## Acceptance criteria

- [ ] Scenario: 100 concurrent users performing task CRUD
- [ ] Threshold: task update P95 < 500ms
- [ ] Threshold: error rate < 1%
- [ ] Ramp-up: 10 → 50 → 100 users over 5 minutes
- [ ] Results output: summary + detailed CSV for analysis
- [ ] Run against staging environment
