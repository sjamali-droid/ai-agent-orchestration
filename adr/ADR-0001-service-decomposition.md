# ADR-0001: Service Decomposition

## Status

ACCEPTED

## Date

2026-04-20

## Context

TaskSphere Pro requires RBAC, project/task management, file uploads, real-time notifications, and audit logging. We need to decide how to split these capabilities into microservices that align with domain boundaries, team ownership, and independent deployability.

## Decision

Five microservices, each in its own container with a Dapr sidecar:

| Service | Domain | Responsibilities |
|---------|--------|-----------------|
| **auth-service** | Identity & access | Registration, login, JWT issuance/refresh, user CRUD, RBAC role management |
| **project-service** | Project domain | Project CRUD, privacy toggle, membership management, project dashboard stats |
| **task-service** | Task domain | Task CRUD (markdown), status workflow state machine, assignment, priority, filtering/search, comments, attachment metadata |
| **file-service** | Binary storage | Presigned URL generation for S3 uploads/downloads, file validation (type, size), attachment record management |
| **notification-service** | Alerts & delivery | Kafka consumer for domain events, in-app notification storage, email dispatch, user notification preferences |

A **Next.js frontend** serves as the single client, calling services through an API gateway or direct Dapr service invocation.

### Boundaries

- **auth-service** is the sole issuer and verifier of JWTs. Other services validate tokens via middleware using a shared public key.
- **task-service** owns comments because comments are tightly coupled to tasks (same bounded context). Separating them adds network hops with no meaningful independent scaling benefit.
- **file-service** is separate because binary I/O has different scaling characteristics (CPU-light, I/O-heavy) and can be independently throttled.
- **notification-service** is separate because it is a pure consumer of domain events with its own delivery concerns (email rate limiting, retry logic, user preferences). It never blocks the critical path.

### Communication

- **Synchronous**: Dapr service invocation (HTTP) for request-response (e.g. auth validation, file URL generation).
- **Asynchronous**: Kafka via Dapr pub/sub for domain events (task created, status changed, comment added, member assigned). Notification-service and audit logging consume these events.

## Consequences

### Positive

- Clear domain ownership per service
- Independent scaling (file-service can scale separately under upload load)
- Notification logic isolated — no impact on task latency
- Kafka events enable future consumers (analytics, audit) without modifying producers

### Negative

- 5 services + frontend = 6 deployables to maintain
- Cross-service queries (e.g. "tasks assigned to user") require either denormalization or API composition
- Distributed transactions for operations spanning services (mitigated by eventual consistency via Kafka)

### Risks

- Service-to-service latency if Dapr sidecar adds overhead (mitigated: Dapr sidecar is in-process mesh, typically <2ms)

## Agents affected

- [x] Project Manager — backlog reflects this decomposition
- [x] Software Architect — this ADR defines the architecture
- [x] Developer — implements 5 services + frontend
- [x] DevSecOps — deploys, secures, and monitors 5 services
- [x] QA — tests across service boundaries

## Related

- Issue: ISSUE-0010
- Supersedes: none
