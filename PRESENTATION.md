---
marp: true
theme: default
paginate: true
header: "AI Agent Orchestration"
footer: "Confidential"
---

# AI Agent Orchestration

### Multi-Project, Multi-Agent Development System

---

# The Problem

- Software projects involve **many disciplines**: PM, architecture, coding, security, QA
- Each discipline has different **reasoning needs** and **tools**
- Manual coordination between roles creates **bottlenecks and drift**
- Context switching between tools wastes **time and tokens**

**Goal**: A reusable orchestration framework where specialized AI agents collaborate through structured markdown files, each running on the best model for its role.

---

# How It Works

```
                    ┌─────────────────────┐
                    │   Project Manager   │
                    │   (Claude Opus 4)   │
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
    ┌─────────▼──────┐  ┌─────▼──────┐  ┌──────▼─────────┐
    │   Architect    │  │  Developer │  │   DevSecOps    │
    │     (o3)       │  │ (Sonnet 4) │  │   (o4-mini)    │
    └─────────┬──────┘  └─────┬──────┘  └──────┬─────────┘
              │               │                │
              └───────────────┼────────────────┘
                              │
                    ┌─────────▼─────────┐
                    │        QA         │
                    │ (Gemini 2.5 Flash)│
                    └───────────────────┘
```

---

# Key Design Decisions

| Decision | Choice | Why |
|----------|--------|-----|
| Config format | Markdown + YAML | Low token cost, version-friendly, human-readable |
| Issue tracking | Local markdown files | No external dependencies, maps 1:1 to Jira/GitHub later |
| Model access | Cursor IDE | No API keys to manage, all models in one place |
| Git workflow | Agent commits locally, user pushes | Safety — human controls what goes to remote |
| Context docs | User-provided, per-technology | Precise, up-to-date, token-efficient |
| Observability | Local ELK via Docker | Free, open source, full stack |

---

# The 5 Agents

---

# Agent 1: Project Manager

**Model**: Claude Opus 4

**Why Opus**: Strongest long-context reasoning for coordinating the full project state

**Owns**:
- Requirements decomposition into epics/stories
- Sprint planning, backlog ordering
- Risk register, milestone tracking
- Conflict resolution between agents
- Release readiness decisions

**Outputs**: `issues/BACKLOG.md`, `state/STATE.md`, sprint goals, risk register

---

# Agent 2: Software Architect

**Model**: o3 (OpenAI reasoning)

**Why o3**: Deep chain-of-thought for design trade-offs where mistakes cascade across services

**Owns**:
- Service boundaries, data ownership maps
- C4 + Mermaid diagrams
- Dapr component design, K8s baseline manifests
- OpenAPI / AsyncAPI contracts
- Architecture Decision Records (ADRs)
- Non-functional requirements (SLOs, latency, retention)

**Outputs**: `contracts/`, `adr/`, diagrams, topic/schema contracts

---

# Agent 3: Developer

**Model**: Claude Sonnet 4

**Why Sonnet**: Best speed-to-quality ratio for high-volume coding across Express, Next.js, SQL, Mongo

**Owns**:
- Feature implementation guided by Architect contracts
- Unit tests for every feature
- Contract updates when API surface changes
- Dapr SDK integration, Kafka producers

**Outputs**: Code, tests, PRs with handoff blocks

---

# Agent 4: DevSecOps

**Model**: o4-mini (OpenAI reasoning)

**Why o4-mini**: Reasoning for security analysis at lower cost — catches subtle misconfigurations

**Owns**:
- Sidecar security patterns, Kafka ACLs
- ELK ingest pipelines, log shipping config
- CI/CD pipeline authoring
- SBOM, image scanning (Trivy), policy-as-code (Kyverno)
- Secrets hygiene enforcement
- **Release gate**: blocks on critical CVEs

**Outputs**: Manifests, CI pipelines, security scan reports, gate verdicts

---

# Agent 5: QA

**Model**: Gemini 2.5 Flash

**Why Flash**: Fast, cheap, 1M token context for analyzing large log sets and test results

**Owns**:
- Integration tests across services + sidecars
- Contract tests against OpenAPI/AsyncAPI
- Load testing (k6)
- E2E browser tests (Playwright)
- Trace-based debugging via ELK

**Outputs**: Test reports, bug issues with repro steps + ELK queries

---

# Model Selection Rationale

| Criterion | High Priority | Lower Priority |
|-----------|--------------|----------------|
| Reasoning depth | PM, Architect | Developer, QA |
| Speed / throughput | Developer, QA | PM, Architect |
| Cost efficiency | Developer, QA (bulk work) | PM, Architect (fewer calls) |
| Context window | QA (1M for logs), PM | DevSecOps |

**Fallback**: Claude Sonnet 4 if any model is unavailable

---

# Tech Stack (Non-Negotiable)

| Layer | Choice |
|-------|--------|
| Backend | Express.js (Node) |
| Frontend | Next.js |
| Relational DB | PostgreSQL |
| NoSQL | MongoDB |
| Architecture | Microservices, one container each |
| Orchestration | Kubernetes |
| Sidecars | Security + Log shipping |
| Messaging | Kafka (or managed Pub/Sub) |
| Observability | ELK (local Docker for dev) |
| App Runtime | Dapr (state, pub/sub, bindings, secrets) |

---

# Workflow Pipeline

```
 Intake        Architecture    Impl Plan     Development
 ──────► PM ──────► Arch ──────► PM+Arch ──────► Dev
                                                  │
                                                  ▼
 Release       QA              Platform        Dev PR
 ◄────── PM ◄────── QA ◄────── DevSecOps ◄──────┘
```

Every stage has **entry criteria** and **exit criteria**.

Every cross-agent handoff uses a **structured YAML block**.

**Definition of Done**: merged PR, tests green, contracts updated, observability checklist satisfied.

---

# File Structure

```
orchestration/
  MASTER_AGENT_ORCHESTRATION.md    ← single source of truth
  profile/
    project.yaml                   ← project config (models, K8s, bus)
    project.md                     ← human summary
  state/STATE.md                   ← live sprint/WIP/blockers
  agents/                          ← 5 agent identity files
  issues/                          ← markdown-based issue tracking
    BACKLOG.md                     ← ordered backlog board
  contracts/
    openapi/                       ← per-service HTTP APIs
    asyncapi/                      ← event schemas
  context/                         ← 22 tech reference docs
  adr/                             ← architecture decision records
  elk/docker-compose.yml           ← local ELK stack
```

---

# How To Use (3 Steps)

### Step 1: Install prerequisites
Run `./scripts/check-prereqs.sh` to verify Node, Docker, Git, etc.

### Step 2: Fill project details
Edit `profile/project.yaml` with your project name, repos, milestones

### Step 3: Provide requirements
Paste your SRS/PRD into `profile/project.md`
The PM agent decomposes it into issues and starts the pipeline

---

# What Makes This Reusable

- **Clone once, configure per project** via `project.yaml`
- **No API keys** — runs entirely through Cursor
- **No external services** — issues are local markdown, ELK is local Docker
- **Tech-stack-aware** — agents already know Express, Next.js, K8s, Dapr, Kafka, ELK
- **22 context files** pre-loaded with third-party API documentation
- **Upgradeable** — swap `local-markdown` for Jira MCP, add CI/CD push later

---

# Safety Built In

- **Tool allowlists**: each agent can only use its permitted tools
- **Human-in-the-loop gates**: architecture changes, prod deploys, scope changes
- **Git**: agents commit locally, user pushes manually
- **DevSecOps gate**: no release with critical CVEs unless PM accepts risk via ADR
- **Contract-first**: no code without linked OpenAPI/AsyncAPI
- **Fallback model**: automatic with logged event if a model is unavailable

---

# Next Steps

1. Install prerequisites (see checklist)
2. Fill `profile/project.yaml` with project details
3. Paste requirements into `profile/project.md`
4. PM agent begins: requirements → epics → stories → sprint
5. Architect designs → Developer builds → DevSecOps hardens → QA validates

**The orchestration is ready. Just add your project.**

---

# Thank You

Questions?

---
