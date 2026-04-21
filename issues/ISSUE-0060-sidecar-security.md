# ISSUE-0060: Sidecar Security & Dapr mTLS

## Meta

- **Status**: backlog
- **Type**: story
- **Priority**: high
- **Sprint**: backlog
- **Assigned agent**: devsecops
- **Epic**: ISSUE-0006
- **Milestone**: m3

## Description

Configure Dapr mTLS between services, component scopes (each service only accesses its own state/pubsub), and network policies restricting pod-to-pod traffic.

## Acceptance criteria

- [ ] Dapr mTLS enabled in cluster
- [ ] Component scopes: each service limited to its own state store and allowed topics
- [ ] K8s NetworkPolicy: deny-all default, allow only required service-to-service paths
- [ ] Tested: service A cannot access service B's state store
