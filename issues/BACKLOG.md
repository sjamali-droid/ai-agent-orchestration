# Backlog — TaskSphere Pro

> Maintained by **Project Manager**. Top = highest priority. Updated: 2026-04-20

## Epics

| ID | Title | Status | Milestone | Stories |
|----|-------|--------|-----------|---------|
| ISSUE-0001 | Platform Foundation & Architecture | ready | m1 | 0010-0016 |
| ISSUE-0002 | Project Management | backlog | m1 | 0020-0023 |
| ISSUE-0003 | Task Management | backlog | m2 | 0030-0035 |
| ISSUE-0004 | Collaboration | backlog | m2 | 0040-0042 |
| ISSUE-0005 | Frontend Application | backlog | m2 | 0050-0054 |
| ISSUE-0006 | Security, Observability & Deployment | backlog | m3 | 0060-0065 |
| ISSUE-0007 | Quality Assurance | backlog | m3 | 0070-0073 |

## Sprint S1 — "Architecture & Foundation" (2026-04-21 → 2026-05-09)

| ID | Title | Type | Agent | Priority | Status |
|----|-------|------|-------|----------|--------|
| ISSUE-0010 | Architecture Design Spike | spike | software_architect | critical | ready |
| ISSUE-0016 | Database Schema & Migrations | story | developer | critical | ready |
| ISSUE-0011 | JWT Authentication Service | story | developer | critical | ready |
| ISSUE-0012 | RBAC Middleware | story | developer | critical | ready |
| ISSUE-0013 | User Management CRUD | story | developer | high | ready |
| ISSUE-0014 | CI/CD Pipeline Setup | story | devsecops | high | ready |
| ISSUE-0015 | Local Dev Environment | story | devsecops | high | ready |

## Ready (Sprint S2 candidates — m1 completion)

| ID | Title | Type | Agent | Priority | Blocked by |
|----|-------|------|-------|----------|------------|
| ISSUE-0020 | Project CRUD API | story | developer | high | ISSUE-0001 |
| ISSUE-0021 | Project Privacy Toggle | story | developer | medium | ISSUE-0020 |
| ISSUE-0022 | Project Membership | story | developer | high | ISSUE-0020 |
| ISSUE-0023 | Project Dashboard API | story | developer | medium | ISSUE-0020 |

## Backlog (Sprint S3+ — m2)

| ID | Title | Type | Agent | Priority | Blocked by |
|----|-------|------|-------|----------|------------|
| ISSUE-0030 | Task CRUD + Markdown | story | developer | high | ISSUE-0002 |
| ISSUE-0031 | Task Status Workflow | story | developer | high | ISSUE-0030 |
| ISSUE-0032 | Task Assignment | story | developer | high | ISSUE-0030 |
| ISSUE-0033 | Task Prioritization | story | developer | medium | ISSUE-0030 |
| ISSUE-0034 | Attachment Upload (S3) | story | developer | high | ISSUE-0030 |
| ISSUE-0035 | Task Filtering & Search | story | developer | medium | ISSUE-0030 |
| ISSUE-0040 | Threaded Comments | story | developer | medium | ISSUE-0003 |
| ISSUE-0041 | In-App Notifications | story | developer | medium | ISSUE-0003 |
| ISSUE-0042 | Email Notifications | story | developer | low | ISSUE-0041 |
| ISSUE-0050 | Auth Pages (Frontend) | story | developer | high | ISSUE-0001 |
| ISSUE-0051 | Project Dashboard UI | story | developer | high | ISSUE-0002 |
| ISSUE-0052 | Task Board (Kanban) | story | developer | high | ISSUE-0003 |
| ISSUE-0053 | Task Detail View | story | developer | high | ISSUE-0003 |
| ISSUE-0054 | Admin Panel UI | story | developer | medium | ISSUE-0001 |

## Backlog (Sprint S5+ — m3)

| ID | Title | Type | Agent | Priority | Blocked by |
|----|-------|------|-------|----------|------------|
| ISSUE-0060 | Sidecar Security & mTLS | story | devsecops | high | ISSUE-0001 |
| ISSUE-0061 | ELK Pipeline | story | devsecops | high | ISSUE-0001 |
| ISSUE-0062 | Kafka Setup & ACLs | story | devsecops | high | ISSUE-0010 |
| ISSUE-0063 | Image Scanning & SBOM | story | devsecops | high | ISSUE-0014 |
| ISSUE-0064 | K8s Manifests & Helm | story | devsecops | high | ISSUE-0010 |
| ISSUE-0065 | Kyverno Policies | story | devsecops | medium | ISSUE-0064 |
| ISSUE-0070 | API Integration Tests | story | qa | high | ISSUE-0003 |
| ISSUE-0071 | Contract Tests (OpenAPI) | story | qa | high | ISSUE-0010 |
| ISSUE-0072 | E2E Tests (Playwright) | story | qa | high | ISSUE-0005 |
| ISSUE-0073 | Load Tests (k6) | story | qa | medium | ISSUE-0006 |
