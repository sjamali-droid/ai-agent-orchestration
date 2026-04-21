# Context Files

Each file holds third-party API docs, usage patterns, or reference material that agents consume instead of calling Context7 directly. The user fills these manually.

## How to fill

Paste the **relevant sections** from official docs — not entire doc sites. Focus on:
- API surface (functions, methods, config options)
- Common patterns / quick-start examples
- Configuration schemas
- Known gotchas

Keep each file under ~50 KB to stay token-friendly.

## File index

| File | Tech | Used by |
|------|------|---------|
| `expressjs.md` | Express.js | Developer |
| `nextjs.md` | Next.js | Developer |
| `postgresql.md` | PostgreSQL | Developer, Architect |
| `mongodb.md` | MongoDB | Developer, Architect |
| `dapr.md` | Dapr SDK + Components | Developer, Architect, DevSecOps |
| `kafkajs.md` | KafkaJS (Node client) | Developer, Architect |
| `kubernetes.md` | Kubernetes API / manifests | Architect, DevSecOps |
| `helm.md` | Helm charts | DevSecOps |
| `docker.md` | Docker / Compose | DevSecOps, Developer |
| `fluent-bit.md` | Fluent Bit (log shipper) | DevSecOps |
| `elasticsearch.md` | Elasticsearch queries + index API | DevSecOps, QA |
| `kibana.md` | Kibana saved objects / dashboards | QA, DevSecOps |
| `playwright.md` | Playwright test API | QA |
| `k6.md` | k6 load testing | QA |
| `trivy.md` | Trivy container scanning | DevSecOps |
| `kyverno.md` | Kyverno policies | DevSecOps |
| `openapi-spec.md` | OpenAPI 3.1 spec format | Architect |
| `asyncapi-spec.md` | AsyncAPI 3.0 spec format | Architect |
| `jest.md` | Jest / Vitest testing | Developer, QA |
| `eslint-prettier.md` | ESLint + Prettier config | Developer |
| `github-actions.md` | GitHub Actions CI/CD | DevSecOps |
| `mermaid.md` | Mermaid diagram syntax | Architect |
