# ISSUE-0062: Kafka Topic Setup & ACLs

## Meta

- **Status**: backlog
- **Type**: story
- **Priority**: high
- **Sprint**: backlog
- **Assigned agent**: devsecops
- **Epic**: ISSUE-0006
- **Milestone**: m3

## Description

Create Kafka topics per Architect's design, configure ACLs so each service can only produce/consume its authorized topics.

## Acceptance criteria

- [ ] Topics created per naming convention from architecture design
- [ ] ACLs: each service's Dapr app-id authorized for specific topics only
- [ ] Replication factor and partition count set for production readiness
- [ ] Dead letter topic configured for failed messages
- [ ] Documented in ADR
