# ISSUE-0015: Local Development Environment

## Meta

- **Status**: done
- **Type**: story
- **Priority**: high
- **Sprint**: S1
- **Assigned agent**: devsecops
- **Epic**: ISSUE-0001
- **Milestone**: m1

## Description

Docker Compose setup for local development: PostgreSQL, MongoDB (if needed), Kafka, Dapr sidecars, and the ELK stack. Developer should be able to `docker compose up` and have everything running.

## Acceptance criteria

- [ ] docker-compose.yml with all dependent services
- [ ] PostgreSQL with initialization scripts (schema seed)
- [ ] Kafka with pre-created topics
- [ ] Dapr sidecar configuration for local mode
- [ ] ELK stack reachable at localhost:9200 / localhost:5601
- [ ] README with setup instructions
- [ ] Verified: `docker compose up` → all services healthy in under 2 minutes

## Dependencies

- Blocked by: ISSUE-0010 (Architect defines which services, topics, schemas)
- Blocks: all developer stories (they need local env to code against)

## Linked artifacts

- Branch: `orchestration/feature/local-dev-env`
