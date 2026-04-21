# ISSUE-0014: CI/CD Pipeline Setup

## Meta

- **Status**: done
- **Type**: story
- **Priority**: high
- **Sprint**: S1
- **Assigned agent**: devsecops
- **Epic**: ISSUE-0001
- **Milestone**: m1

## Description

Set up GitHub Actions CI/CD pipeline skeleton for both repos: lint, test, build Docker image, push to registry. Security scanning added in ISSUE-0006 epic.

## Acceptance criteria

- [ ] Backend pipeline: lint → test → build image → push
- [ ] Frontend pipeline: lint → test → build → push
- [ ] Pipeline triggers on PR to main and on merge
- [ ] Docker multi-stage builds for both services
- [ ] Environment variables via GitHub secrets (no hardcoded values)
- [ ] Pipeline runs in under 5 minutes

## Dependencies

- Blocked by: ISSUE-0010 (needs Dockerfiles from architecture design)
- Blocks: ISSUE-0006 (security scanning adds to this pipeline)

## Linked artifacts

- Branch: `orchestration/feature/cicd-setup`
