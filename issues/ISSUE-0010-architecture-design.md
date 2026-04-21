# ISSUE-0010: Architecture Design Spike

## Meta

- **Status**: done
- **Type**: spike
- **Priority**: critical
- **Sprint**: S1
- **Assigned agent**: software_architect
- **Epic**: ISSUE-0001
- **Milestone**: m1

## Description

Design the full system architecture for TaskSphere Pro. Produce C4 diagrams, database schemas, service boundaries, Dapr component layouts, Kafka topic design, and OpenAPI/AsyncAPI contract stubs. All subsequent development depends on this.

## Acceptance criteria

- [ ] C4 Context + Container diagrams (Mermaid)
- [ ] Service boundary map: auth-service, project-service, task-service, notification-service, file-service
- [ ] PostgreSQL schema design (users, roles, projects, tasks, comments, attachments)
- [ ] Dapr component YAML templates (state store, pub/sub, bindings)
- [ ] Kafka topic naming convention + topic list
- [ ] OpenAPI stubs for each service in `contracts/openapi/`
- [ ] AsyncAPI stubs for event channels in `contracts/asyncapi/`
- [ ] ADR-0001: Service decomposition rationale
- [ ] ADR-0002: Database strategy (Postgres for relational, Mongo if needed)
- [ ] K8s namespace + deployment baseline
- [ ] NFRs documented: <500ms task update, indexing strategy

## Dependencies

- Blocked by: none
- Blocks: ISSUE-0011, ISSUE-0012, ISSUE-0013, ISSUE-0016 (all dev needs contracts)

## Linked artifacts

- ADR: `adr/ADR-0001-service-decomposition.md`
- ADR: `adr/ADR-0002-database-strategy.md`
- Diagrams: `docs/architecture/c4-diagrams.md`
- Schema: `docs/architecture/database-schema.md`
- Dapr/Kafka: `docs/architecture/dapr-components.md`
- Contract: `contracts/openapi/auth-service.openapi.yaml`
- Contract: `contracts/openapi/project-service.openapi.yaml`
- Contract: `contracts/openapi/task-service.openapi.yaml`
- Contract: `contracts/openapi/file-service.openapi.yaml`
- Contract: `contracts/openapi/notification-service.openapi.yaml`
- Contract: `contracts/asyncapi/task-events.asyncapi.yaml`
