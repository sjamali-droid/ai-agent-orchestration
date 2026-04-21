#!/usr/bin/env bash
set -euo pipefail

PASS=0
FAIL=0
WARN=0

pass()  { PASS=$((PASS+1)); printf "  ✓  %-22s %s\n" "$1" "$2"; }
fail()  { FAIL=$((FAIL+1)); printf "  ✗  %-22s %s\n" "$1" "$2"; }
warn()  { WARN=$((WARN+1)); printf "  !  %-22s %s\n" "$1" "$2"; }

check_cmd() {
  local name="$1" cmd="$2" install_hint="$3" required="${4:-true}"
  if command -v "$cmd" &>/dev/null; then
    local ver
    ver=$("$cmd" --version 2>&1 | head -1) || ver="(version unknown)"
    pass "$name" "$ver"
  elif [ "$required" = "true" ]; then
    fail "$name" "NOT FOUND — $install_hint"
  else
    warn "$name" "NOT FOUND (optional) — $install_hint"
  fi
}

echo ""
echo "═══════════════════════════════════════════════════════"
echo "  AI Agent Orchestration — Prerequisites Check"
echo "═══════════════════════════════════════════════════════"
echo ""

echo "── Core (required) ──────────────────────────────────"
check_cmd "Node.js (>=18)"       node      "https://nodejs.org or: brew install node"
check_cmd "npm"                  npm       "comes with Node.js"
check_cmd "Git"                  git       "https://git-scm.com or: brew install git"
check_cmd "Docker"               docker    "https://docs.docker.com/get-docker/"
check_cmd "Docker Compose"       docker    "included with Docker Desktop"

if command -v docker &>/dev/null; then
  if docker compose version &>/dev/null 2>&1; then
    pass "Compose plugin" "$(docker compose version 2>&1 | head -1)"
  elif command -v docker-compose &>/dev/null; then
    pass "docker-compose" "$(docker-compose --version 2>&1 | head -1)"
  else
    fail "Compose plugin" "docker compose not available — update Docker Desktop"
  fi
fi

echo ""
echo "── Cursor IDE ───────────────────────────────────────"
if command -v cursor &>/dev/null; then
  pass "Cursor CLI" "$(cursor --version 2>&1 | head -1)"
else
  warn "Cursor CLI" "not in PATH (ok if using Cursor GUI directly)"
fi

echo ""
echo "── Kubernetes & Dapr (needed for deployment) ────────"
check_cmd "kubectl"              kubectl   "https://kubernetes.io/docs/tasks/tools/" false
check_cmd "Helm"                 helm      "https://helm.sh/docs/intro/install/" false
check_cmd "Dapr CLI"             dapr      "https://docs.dapr.io/getting-started/install-dapr-cli/" false

echo ""
echo "── Security scanning (DevSecOps agent) ──────────────"
check_cmd "Trivy"                trivy     "brew install trivy  or  https://aquasecurity.github.io/trivy/" false

echo ""
echo "── Testing tools (QA agent) ─────────────────────────"
check_cmd "k6"                   k6        "brew install k6  or  https://grafana.com/docs/k6/latest/" false

if command -v npx &>/dev/null; then
  pass "npx (Playwright)" "Playwright installs via: npx playwright install"
else
  warn "npx" "not found — needed for Playwright install"
fi

echo ""
echo "── Presentation (optional) ──────────────────────────"
check_cmd "Marp CLI"             marp      "npm install -g @marp-team/marp-cli" false

echo ""
echo "── ELK stack check ─────────────────────────────────"
if command -v docker &>/dev/null && docker info &>/dev/null 2>&1; then
  pass "Docker running" "ELK can start via: docker compose -f elk/docker-compose.yml up -d"
else
  warn "Docker daemon" "not running — start Docker Desktop first"
fi

echo ""
echo "═══════════════════════════════════════════════════════"
printf "  Results:  %d passed   %d failed   %d warnings\n" "$PASS" "$FAIL" "$WARN"
echo "═══════════════════════════════════════════════════════"

if [ "$FAIL" -gt 0 ]; then
  echo ""
  echo "  Fix the ✗ items above before starting the orchestration."
  echo ""
  exit 1
else
  echo ""
  echo "  Ready! Fill profile/project.yaml and profile/project.md,"
  echo "  then provide your project requirements."
  echo ""
  exit 0
fi
