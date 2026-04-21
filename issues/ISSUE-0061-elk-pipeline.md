# ISSUE-0061: ELK Observability Pipeline

## Meta

- **Status**: backlog
- **Type**: story
- **Priority**: high
- **Sprint**: backlog
- **Assigned agent**: devsecops
- **Epic**: ISSUE-0006
- **Milestone**: m3

## Description

Production-grade ELK pipeline: Fluent Bit sidecars shipping structured JSON logs → Logstash → Elasticsearch. Kibana dashboards for service health and error rates.

## Acceptance criteria

- [ ] Fluent Bit sidecar config per service pod
- [ ] Structured JSON log format (timestamp, service, level, trace_id, message)
- [ ] Logstash pipeline with index routing (logs vs traces)
- [ ] Index templates with proper mappings
- [ ] ILM policy: 30d hot, 90d warm, delete after
- [ ] Kibana dashboard: error rate, request latency, top errors by service
