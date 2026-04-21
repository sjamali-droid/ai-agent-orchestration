# ISSUE-0065: Kyverno Policies

## Meta

- **Status**: backlog
- **Type**: story
- **Priority**: medium
- **Sprint**: backlog
- **Assigned agent**: devsecops
- **Epic**: ISSUE-0006
- **Milestone**: m3

## Description

Kubernetes admission policies via Kyverno: enforce labels, disallow latest tag, restrict host paths, require resource limits.

## Acceptance criteria

- [ ] Policy: require app, version, team labels on all pods
- [ ] Policy: disallow :latest image tag
- [ ] Policy: restrict hostPath volumes
- [ ] Policy: require resource requests and limits
- [ ] Policy: disallow privileged containers
- [ ] All policies tested with dry-run before enforce mode
