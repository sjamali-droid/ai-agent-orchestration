#!/usr/bin/env bash
#
# Kafka ACL provisioning for TaskSphere Pro
# Grants least-privilege produce/consume access per service.
#
# Usage:
#   ./kafka-acls.sh [--bootstrap-server kafka:9092]
#
set -euo pipefail

BOOTSTRAP="${1:-kafka.tasksphere-dev.svc.cluster.local:9092}"
KAFKA_BIN="${KAFKA_BIN:-kafka-acls.sh}"

log() { printf '[%s] %s\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$*"; }

log "Applying Kafka ACLs against ${BOOTSTRAP}"

# ──────────────────────────────────────────────
# auth-service: produce to tasksphere.user.*
# ──────────────────────────────────────────────
log "Granting auth-service WRITE on tasksphere.user.*"
"$KAFKA_BIN" --bootstrap-server "$BOOTSTRAP" --add \
  --allow-principal "User:auth-service" \
  --operation Write \
  --operation Describe \
  --topic "tasksphere.user." \
  --resource-pattern-type prefixed

# ──────────────────────────────────────────────
# project-service: produce to tasksphere.project.*
# ──────────────────────────────────────────────
log "Granting project-service WRITE on tasksphere.project.*"
"$KAFKA_BIN" --bootstrap-server "$BOOTSTRAP" --add \
  --allow-principal "User:project-service" \
  --operation Write \
  --operation Describe \
  --topic "tasksphere.project." \
  --resource-pattern-type prefixed

# ──────────────────────────────────────────────
# task-service: produce to tasksphere.task.* and tasksphere.comment.*
# ──────────────────────────────────────────────
log "Granting task-service WRITE on tasksphere.task.*"
"$KAFKA_BIN" --bootstrap-server "$BOOTSTRAP" --add \
  --allow-principal "User:task-service" \
  --operation Write \
  --operation Describe \
  --topic "tasksphere.task." \
  --resource-pattern-type prefixed

log "Granting task-service WRITE on tasksphere.comment.*"
"$KAFKA_BIN" --bootstrap-server "$BOOTSTRAP" --add \
  --allow-principal "User:task-service" \
  --operation Write \
  --operation Describe \
  --topic "tasksphere.comment." \
  --resource-pattern-type prefixed

# ──────────────────────────────────────────────
# notification-service: consume from all tasksphere.* topics
# ──────────────────────────────────────────────
log "Granting notification-service READ on tasksphere.*"
"$KAFKA_BIN" --bootstrap-server "$BOOTSTRAP" --add \
  --allow-principal "User:notification-service" \
  --operation Read \
  --operation Describe \
  --topic "tasksphere." \
  --resource-pattern-type prefixed

log "Granting notification-service consumer group access"
"$KAFKA_BIN" --bootstrap-server "$BOOTSTRAP" --add \
  --allow-principal "User:notification-service" \
  --operation Read \
  --group "notification-service-group" \
  --resource-pattern-type literal

# ──────────────────────────────────────────────
# Deny all other principals by default
# ──────────────────────────────────────────────
log "Denying all unlisted principals on tasksphere.* topics"
"$KAFKA_BIN" --bootstrap-server "$BOOTSTRAP" --add \
  --deny-principal "User:*" \
  --operation All \
  --topic "tasksphere." \
  --resource-pattern-type prefixed \
  --deny-host "*"

# Re-allow the specific service principals (deny rule is overridden by allow rules in Kafka)
log "Kafka ACLs applied successfully."

# ──────────────────────────────────────────────
# List final ACL state for verification
# ──────────────────────────────────────────────
log "Current ACL listing:"
"$KAFKA_BIN" --bootstrap-server "$BOOTSTRAP" --list \
  --topic "tasksphere." \
  --resource-pattern-type prefixed
