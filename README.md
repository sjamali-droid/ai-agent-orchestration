# Agentic project orchestration framework






This repository is a **markdown-first orchestration framework** you use inside **Cursor** (or any editor that can follow the same files). You **do not** run a single “orchestration server.” You **provide your project’s requirements and profile**, then drive specialized **agents** (project manager, architect, developer, DevSecOps, QA) according to one master specification. Together they break down the work, produce contracts and ADRs, implement code in **your** repos, and move the project toward completion in a repeatable, reviewable way.

**TaskSphere** in this repo is only a **reference sample** (example SRS-aligned layout and a demo stack). Using that sample app is **optional**; the framework is meant to work for **any** project once `profile/` and the issue backlog reflect **your** system.

---

## What you get

| Piece | Role |
|--------|------|
| `MASTER_AGENT_ORCHESTRATION.md` | Single source of truth: agent roles, stack rules, workflow, approvals, and pointers to other files. |
| `profile/project.yaml` | Machine-readable project profile (repos, bus, K8s, models, git rules). **Agents read this first.** |
| `profile/project.md` | Human-readable summary; keep it in sync with `project.yaml`. |
| `agents/*.md` | Playbooks / identities for each role (what they may do, outputs they produce). |
| `issues/` | Canonical backlog: `BACKLOG.md` plus one markdown file per issue. |
| `contracts/` | OpenAPI / AsyncAPI — **contracts before code** where the spec applies. |
| `adr/` | Architecture Decision Records for meaningful choices. |
| `state/STATE.md` | Optional volatile state (sprint, WIP, owners, blockers) when you add it. |

Orchestration is **human-in-the-loop**: you (or a lead) point agents at the right issue, review outputs, and approve risky steps as described in the master spec.

---

## Getting started (any new project)

### 1. Clone and check tooling

```bash
git clone <your-fork-or-upstream-url>
cd preparation
chmod +x scripts/check-prereqs.sh  # if needed
./scripts/check-prereqs.sh
```

Core tools (Node, npm, Git, Docker, Compose) support the **expected stack** in the master doc (Express, Next.js, Postgres, Mongo, K8s, Dapr, ELK, etc.) when agents generate or run local stacks. Optional tools in the script help for deploy, security scans, load tests, and presentations.

### 2. Put your SRS and project definition in `profile/`

1. **Software Requirements Specification (SRS)**  
   Keep the authoritative SRS where your team prefers (for example `docs/requirements.md` at your repo root, or a path you reference from `profile/project.md`). The important part is that **`profile/project.md` clearly points to it** and summarizes scope, priorities, and constraints so agents do not hunt blindly.

2. **`profile/project.yaml`**  
   Fill or replace the template so it describes **your** project: `project_id`, `name`, `description`, `repos` (backend / frontend / libs you want agents to touch), `default_message_bus`, Kubernetes namespaces, Dapr flags, milestones, and model preferences. Remove or edit TaskSphere-specific values unless you are studying the sample.

3. **`profile/project.md`**  
   Rewrite the narrative for **your** product (overview, repos table, stack notes, milestones, contacts, and a **Requirements document** link to the SRS path).

Agents are instructed to treat **`profile/project.yaml` + `profile/project.md` + linked SRS** as the definition of **what** to build; `MASTER_AGENT_ORCHESTRATION.md` defines **how** they collaborate and which stack rules apply unless you document an exception with an ADR.

### 3. Open the master spec and start orchestration in Cursor

1. Read **`MASTER_AGENT_ORCHESTRATION.md`** end-to-end once (global principles, model roster, stack rules, workflow).
2. Ensure **`issues/BACKLOG.md`** reflects your first milestones; add issue files from **`issues/ISSUE-TEMPLATE.md`** (or equivalent) as needed.
3. In Cursor, use **`agents/project_manager.md`** (and other agent files) as the basis for chats or custom modes: e.g. “You are the PM agent; read `MASTER_AGENT_ORCHESTRATION.md` §X and `profile/project.yaml`; propose the next three issues for milestone m1.”
4. Enforce **contracts before code**: architect / PM paths should produce or update **`contracts/openapi/`** and **`contracts/asyncapi/`** and **`adr/`** before implementation work that depends on them.

Progress is **visible in git**: issues updated, contracts added, branches and commits created per your `profile/project.yaml` → `git` settings (often agent-managed branches, human push).

---

## Repository layout

```text
MASTER_AGENT_ORCHESTRATION.md   # Master behavioral + technical spec
profile/                        # YOUR project: SRS pointers + project.yaml + project.md
agents/                         # Per-role agent instructions
issues/                         # Backlog + per-issue markdown
contracts/                      # OpenAPI / AsyncAPI
adr/                            # Architecture decisions
state/                          # Optional STATE.md for volatile coordination
context/                        # Optional snippets for agents (see context/README.md)
tasksphere-* /                  # Optional reference sample only
elk/                            # Optional local ELK compose for observability work
scripts/check-prereqs.sh        # Tooling check
```

The **`ai-agent-orchestration/`** folder is a small stub; the **authoritative** framework description is **`MASTER_AGENT_ORCHESTRATION.md`**.

---

## Security

Do **not** commit real API keys or production secrets. Root **`.gitignore`** excludes common env and credential patterns; use **`.env.example`** (or similar) only as non-secret templates in repos agents create or modify.

---

## Reference sample: TaskSphere (optional)

The `tasksphere-backend/` and `tasksphere-frontend/` trees exist so you can **see a fully wired example** of repos, compose files, and k8s layout aligned with the master spec. You **do not** need to run them to use the framework for another product. If you do run the sample for learning, see `tasksphere-backend/docker-compose.yml` and `tasksphere-backend/.env.example`; watch for port overlap with `elk/docker-compose.yml` (Elasticsearch/Kibana).

---

## Documentation map

| Document | Purpose |
|----------|---------|
| `MASTER_AGENT_ORCHESTRATION.md` | Orchestrator rules, agents, stack, workflow |
| `profile/project.yaml` | Machine-readable project + tool config for agents |
| `profile/project.md` | Human summary + link to SRS |
| `context/README.md` | How to use extra context files for agents |

If this README and the master spec disagree, **trust `MASTER_AGENT_ORCHESTRATION.md`** and update this file in the same change.
