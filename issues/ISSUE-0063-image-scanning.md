# ISSUE-0063: Image Scanning & SBOM

## Meta

- **Status**: backlog
- **Type**: story
- **Priority**: high
- **Sprint**: backlog
- **Assigned agent**: devsecops
- **Epic**: ISSUE-0006
- **Milestone**: m3

## Description

Add Trivy image scanning to CI pipeline. Generate SBOM for each container image. Block merge on critical CVEs.

## Acceptance criteria

- [ ] Trivy scan step in CI pipeline (backend + frontend images)
- [ ] Pipeline fails on CRITICAL severity vulnerabilities
- [ ] HIGH severity logged as warnings
- [ ] SBOM generated in CycloneDX format per image
- [ ] SBOM stored as build artifact
- [ ] .trivyignore for accepted risks (requires PM ADR)
