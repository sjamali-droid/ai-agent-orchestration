# TaskSphere Pro — Dapr Components & Kafka Topic Design

> Produced by Software Architect for ISSUE-0010

## Kafka topic naming convention

```
tasksphere.<domain>.<event>
```

## Topic list

| Topic | Producer | Consumers | Partitions | Retention |
|-------|----------|-----------|------------|-----------|
| `tasksphere.task.created` | task-service | notification-service | 3 | 7d |
| `tasksphere.task.updated` | task-service | notification-service | 3 | 7d |
| `tasksphere.task.status.changed` | task-service | notification-service | 3 | 7d |
| `tasksphere.task.assigned` | task-service | notification-service | 3 | 7d |
| `tasksphere.task.unassigned` | task-service | notification-service | 3 | 7d |
| `tasksphere.comment.created` | task-service | notification-service | 3 | 7d |
| `tasksphere.project.created` | project-service | notification-service | 3 | 7d |
| `tasksphere.project.member.added` | project-service | notification-service | 3 | 7d |
| `tasksphere.project.member.removed` | project-service | notification-service | 3 | 7d |
| `tasksphere.dlq` | any (dead letter) | ops/monitoring | 1 | 30d |

## Dapr component: pub/sub (Kafka)

```yaml
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: tasksphere-pubsub
  namespace: tasksphere-dev
spec:
  type: pubsub.kafka
  version: v1
  metadata:
    - name: brokers
      value: "kafka:9092"
    - name: consumerGroup
      value: "{appid}-group"
    - name: authType
      value: "none"
  scopes:
    - auth-service
    - project-service
    - task-service
    - notification-service
```

## Dapr component: state store (PostgreSQL)

```yaml
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: tasksphere-statestore
  namespace: tasksphere-dev
spec:
  type: state.postgresql
  version: v1
  metadata:
    - name: connectionString
      secretKeyRef:
        name: postgres-secret
        key: connection-string
    - name: tableName
      value: "dapr_state"
  scopes:
    - auth-service
    - project-service
    - task-service
    - notification-service
```

## Dapr component: secret store (Kubernetes)

```yaml
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: tasksphere-secrets
  namespace: tasksphere-dev
spec:
  type: secretstores.kubernetes
  version: v1
  metadata: []
  scopes:
    - auth-service
    - project-service
    - task-service
    - file-service
    - notification-service
```

## Service Dapr annotations (pod template)

```yaml
annotations:
  dapr.io/enabled: "true"
  dapr.io/app-id: "<service-name>"
  dapr.io/app-port: "<service-port>"
  dapr.io/enable-mtls: "true"
  dapr.io/log-level: "info"
  dapr.io/sidecar-cpu-request: "100m"
  dapr.io/sidecar-memory-request: "128Mi"
```

| Service | app-id | app-port |
|---------|--------|----------|
| auth-service | auth-service | 3001 |
| project-service | project-service | 3002 |
| task-service | task-service | 3003 |
| file-service | file-service | 3004 |
| notification-service | notification-service | 3005 |
