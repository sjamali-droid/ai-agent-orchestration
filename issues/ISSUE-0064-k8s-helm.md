# ISSUE-0064: K8s Manifests & Helm Charts

## Meta

- **Status**: backlog
- **Type**: story
- **Priority**: high
- **Sprint**: backlog
- **Assigned agent**: devsecops
- **Epic**: ISSUE-0006
- **Milestone**: m3

## Description

Helm charts for all services: Deployments, Services, ConfigMaps, Secrets refs, HPA, Dapr annotations. Values files per environment (dev, staging, prod).

## Acceptance criteria

- [ ] Helm chart per service (auth, project, task, notification, file, frontend)
- [ ] Dapr annotations in pod templates
- [ ] Resource requests/limits set
- [ ] HPA configured (min 2, max 10 replicas)
- [ ] Values files: values-dev.yaml, values-staging.yaml, values-prod.yaml
- [ ] helm template renders cleanly with no errors
