# ISSUE-0006: Security, Observability & Deployment

## Meta

- **Status**: backlog
- **Type**: epic
- **Priority**: high
- **Sprint**: backlog
- **Assigned agent**: devsecops
- **Epic**: —
- **Milestone**: m3

## Description

Harden the platform for beta launch: sidecar security, Kafka ACLs, ELK observability pipeline, image scanning, K8s manifests with Helm, Kyverno policies, and CI/CD gates (SRS §5).

## Acceptance criteria

- [ ] Dapr mTLS + component scopes configured
- [ ] Kafka ACLs per service
- [ ] ELK pipeline: Fluent Bit sidecar → Logstash → Elasticsearch, Kibana dashboards
- [ ] Trivy image scan in CI (block on critical CVEs)
- [ ] SBOM generated per image
- [ ] Helm charts for all services
- [ ] Kyverno policies (require labels, disallow latest tag, restrict hostpath)
- [ ] CI/CD pipeline: lint → test → scan → build → push → deploy-dev

## Dependencies

- Blocked by: ISSUE-0001 (services must exist to secure)
- Blocks: ISSUE-0007 (QA needs deployed environment)

## Linked artifacts

- ADR: Dapr sidecar security model
- ADR: ELK pipeline architecture
