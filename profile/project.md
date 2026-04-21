# Project Summary

> Human-readable companion to `project.yaml`. Keep in sync.

## Overview

TaskSphere Pro is a collaborative task management engine designed for organizations requiring strict data silos and role-based access. The system organizes work into Projects, where tasks carry rich metadata including markdown descriptions, image attachments, and state-machine-driven statuses (Backlog, In Progress, Review, Done).

**Project name**: TaskSphere Pro

**Description**: Professional-grade To-Do list application with granular RBAC, multi-tenancy project structures, and assignment workflows.

## Repositories

| Repo | Type | URL |
|------|------|-----|
| tasksphere-backend | backend | https://github.com/org/tasksphere-backend |
| tasksphere-frontend | frontend | https://github.com/org/tasksphere-frontend |

## Tech stack

See `MASTER_AGENT_ORCHESTRATION.md` §3 for the non-negotiable stack. Project-specific additions:

- **Message bus**: Kafka (for activity feeds and audit logging)
- **Log shipper**: Fluent-bit (sidecar pattern)
- **Storage**: AWS S3 (for task image attachments)
- **Database**: PostgreSQL (handling relational RBAC and task linking)

## Milestones

| ID | Name | Due date |
|----|------|----------|
| m1 | Core RBAC & Project Architecture | 2026-06-01 |
| m2 | Task Workflow & Media Uploads | 2026-07-15 |
| m3 | Beta Team Launch | 2026-08-30 |

## Key contacts

| Role | Name | Handle |
|------|------|--------|
| Product owner | User | @owner_handle |
| Tech lead | Orchestrator Agent | @architect_agent |

## Requirements document

Path: `docs/requirements.md` 
*(Note: Contains SRS details: RBAC definitions, Task Status Workflows, and Image Upload specifications)*