# Dapr (Distributed Application Runtime)

> **Used by**: Developer, Architect, DevSecOps
> **What to paste**: JS/Node SDK API (pub/sub, state, bindings, secrets, service invocation), component YAML schemas, sidecar config, mTLS scopes, Dapr CLI commands.
> **Source**: https://docs.dapr.io/

<!-- PASTE CONTEXT BELOW THIS LINE -->


# Dapr

Dapr (Distributed Application Runtime) is a portable, event-driven runtime that simplifies building resilient, stateless, and stateful applications that run on cloud and edge environments. It provides APIs for communication, state management, pub/sub messaging, workflow orchestration, actors, secrets management, configuration, and AI conversations, allowing developers to focus on business logic while Dapr handles the complexities of distributed systems infrastructure.

Dapr runs as a sidecar alongside your application, exposing building block APIs via HTTP and gRPC. It works with any programming language and integrates with various infrastructure components like Redis, Kafka, Azure services, AWS, and GCP through pluggable component configurations. This architecture decouples application code from underlying infrastructure, ensuring flexibility, portability, and consistent behavior across development and production environments.

## State Management API

The State Management API provides a consistent way to store and retrieve application state using pluggable state stores like Redis, PostgreSQL, MongoDB, and more. It supports transactions, optimistic concurrency with ETags, and TTL for automatic expiration.

```bash
# Save state to a state store
curl -X POST http://localhost:3500/v1.0/state/statestore \
  -H "Content-Type: application/json" \
  -d '[
        {
          "key": "order-123",
          "value": {
            "orderId": "123",
            "customer": "john-doe",
            "items": ["item1", "item2"],
            "total": 99.99
          }
        }
      ]'

# Get state by key
curl http://localhost:3500/v1.0/state/statestore/order-123
# Response: {"orderId":"123","customer":"john-doe","items":["item1","item2"],"total":99.99}

# Get bulk state
curl -X POST http://localhost:3500/v1.0/state/statestore/bulk \
  -H "Content-Type: application/json" \
  -d '{
        "keys": ["order-123", "order-456"],
        "parallelism": 10
      }'

# Delete state
curl -X DELETE http://localhost:3500/v1.0/state/statestore/order-123

# State transaction (atomic upsert and delete)
curl -X POST http://localhost:3500/v1.0/state/statestore/transaction \
  -H "Content-Type: application/json" \
  -d '{
        "operations": [
          {
            "operation": "upsert",
            "request": {
              "key": "order-123",
              "value": {"status": "completed"}
            }
          },
          {
            "operation": "delete",
            "request": {
              "key": "order-temp"
            }
          }
        ]
      }'

# Save state with TTL (expires in 3600 seconds)
curl -X POST "http://localhost:3500/v1.0/state/statestore?metadata.ttlInSeconds=3600" \
  -H "Content-Type: application/json" \
  -d '[{"key": "session-abc", "value": {"userId": "user1"}}]'

# Query state (alpha API)
curl -X POST http://localhost:3500/v1.0-alpha1/state/statestore/query \
  -H "Content-Type: application/json" \
  -d '{
        "filter": {
          "EQ": { "customer": "john-doe" }
        },
        "sort": [{"key": "orderId", "order": "DESC"}],
        "page": {"limit": 10}
      }'
```

## Service Invocation API

The Service Invocation API enables direct method calls between Dapr-enabled applications with automatic service discovery, load balancing, mTLS encryption, and built-in resiliency. It supports both HTTP and gRPC protocols.

```bash
# Invoke a method on another Dapr app
curl -X POST http://localhost:3500/v1.0/invoke/orderservice/method/orders \
  -H "Content-Type: application/json" \
  -d '{
        "customerId": "cust-123",
        "items": [
          {"productId": "prod-1", "quantity": 2},
          {"productId": "prod-2", "quantity": 1}
        ]
      }'

# GET request to another service
curl http://localhost:3500/v1.0/invoke/inventoryservice/method/products/prod-123

# Invoke service in another namespace (Kubernetes)
curl http://localhost:3500/v1.0/invoke/orderservice.production/method/orders

# Invoke nested path on remote service
curl -X POST http://localhost:3500/v1.0/invoke/apigateway/method/api/v1/users/register \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "secret"}'

# Invoke non-Dapr endpoint via HTTPEndpoint resource
curl -X POST http://localhost:3500/v1.0/invoke/external-api/method/webhook \
  -H "Content-Type: application/json" \
  -d '{"event": "order.created", "data": {"orderId": "123"}}'
```

## Pub/Sub Messaging API

The Pub/Sub API provides at-least-once message delivery using CloudEvents format. It supports message routing, bulk publishing, and integrates with message brokers like Kafka, RabbitMQ, Azure Event Hubs, and more.

```bash
# Publish a message to a topic
curl -X POST http://localhost:3500/v1.0/publish/pubsub/orders \
  -H "Content-Type: application/json" \
  -d '{
        "orderId": "order-123",
        "status": "created",
        "timestamp": "2024-01-15T10:30:00Z"
      }'

# Publish with TTL (message expires in 60 seconds)
curl -X POST "http://localhost:3500/v1.0/publish/pubsub/notifications?metadata.ttlInSeconds=60" \
  -H "Content-Type: application/json" \
  -d '{"message": "Order ready for pickup"}'

# Publish raw payload (without CloudEvent wrapper)
curl -X POST "http://localhost:3500/v1.0/publish/pubsub/raw-events?metadata.rawPayload=true" \
  -H "Content-Type: application/json" \
  -d '{"raw": "data"}'

# Bulk publish multiple messages
curl -X POST http://localhost:3500/v1.0/publish/bulk/pubsub/events \
  -H "Content-Type: application/json" \
  -d '[
        {
          "entryId": "msg-1",
          "event": {"type": "order.created", "orderId": "123"},
          "contentType": "application/json"
        },
        {
          "entryId": "msg-2",
          "event": {"type": "order.updated", "orderId": "456"},
          "contentType": "application/json"
        }
      ]'
```

Subscribe to topics by implementing an HTTP endpoint in your application:

```python
# Python Flask subscriber example
from flask import Flask, request, jsonify
app = Flask(__name__)

# Dapr calls this endpoint to discover subscriptions
@app.route('/dapr/subscribe', methods=['GET'])
def subscribe():
    return jsonify([
        {
            'pubsubname': 'pubsub',
            'topic': 'orders',
            'route': '/orders'
        }
    ])

# Receive messages on this route
@app.route('/orders', methods=['POST'])
def handle_order():
    event = request.json
    print(f"Received order: {event['data']}")
    return jsonify({'status': 'SUCCESS'})
```

## Actors API

The Actors API provides a virtual actor pattern implementation for building stateful, single-threaded objects with automatic state persistence, reminders, and timers. Actors are ideal for scenarios requiring turn-based concurrency.

```bash
# Invoke an actor method
curl -X POST http://localhost:3500/v1.0/actors/OrderActor/order-123/method/process \
  -H "Content-Type: application/json" \
  -d '{"action": "approve"}'

# Get actor state
curl http://localhost:3500/v1.0/actors/OrderActor/order-123/state/status

# Save actor state (transactional)
curl -X POST http://localhost:3500/v1.0/actors/OrderActor/order-123/state \
  -H "Content-Type: application/json" \
  -d '[
        {
          "operation": "upsert",
          "request": {
            "key": "status",
            "value": "processing"
          }
        },
        {
          "operation": "upsert",
          "request": {
            "key": "lastUpdated",
            "value": "2024-01-15T10:30:00Z"
          }
        }
      ]'

# Create a reminder (persistent, survives actor restarts)
curl -X POST http://localhost:3500/v1.0/actors/OrderActor/order-123/reminders/checkStatus \
  -H "Content-Type: application/json" \
  -d '{
        "dueTime": "5m",
        "period": "1h",
        "data": "check order fulfillment status"
      }'

# Create a timer (non-persistent)
curl -X POST http://localhost:3500/v1.0/actors/OrderActor/order-123/timers/timeout \
  -H "Content-Type: application/json" \
  -d '{
        "dueTime": "30m",
        "data": "order timeout check",
        "callback": "onTimeout"
      }'

# Delete a reminder
curl -X DELETE http://localhost:3500/v1.0/actors/OrderActor/order-123/reminders/checkStatus

# Delete a timer
curl -X DELETE http://localhost:3500/v1.0/actors/OrderActor/order-123/timers/timeout
```

## Workflow API

The Workflow API enables orchestrating long-running, stateful business processes with automatic checkpointing and recovery. Workflows can coordinate multiple services, handle failures gracefully, and maintain execution state.

```bash
# Start a workflow instance
curl -X POST "http://localhost:3500/v1.0/workflows/dapr/OrderProcessingWorkflow/start?instanceID=order-wf-123" \
  -H "Content-Type: application/json" \
  -d '{
        "orderId": "order-123",
        "items": ["item1", "item2"],
        "customerEmail": "customer@example.com"
      }'
# Response: {"instanceID": "order-wf-123"}

# Get workflow status
curl http://localhost:3500/v1.0/workflows/dapr/order-wf-123
# Response: {
#   "instanceID": "order-wf-123",
#   "runtimeStatus": "RUNNING",
#   "createdAt": "2024-01-15T10:30:00Z",
#   "lastUpdatedAt": "2024-01-15T10:35:00Z"
# }

# Raise an event to a running workflow
curl -X POST http://localhost:3500/v1.0/workflows/dapr/order-wf-123/raiseEvent/PaymentReceived \
  -H "Content-Type: application/json" \
  -d '{"paymentId": "pay-456", "amount": 99.99}'

# Pause a workflow
curl -X POST http://localhost:3500/v1.0/workflows/dapr/order-wf-123/pause

# Resume a paused workflow
curl -X POST http://localhost:3500/v1.0/workflows/dapr/order-wf-123/resume

# Terminate a workflow
curl -X POST http://localhost:3500/v1.0/workflows/dapr/order-wf-123/terminate

# Purge workflow state (only for completed/failed/terminated workflows)
curl -X POST http://localhost:3500/v1.0/workflows/dapr/order-wf-123/purge
```

## Secrets API

The Secrets API provides a uniform interface to access secrets from various secret stores like HashiCorp Vault, Azure Key Vault, AWS Secrets Manager, Kubernetes Secrets, and environment variables.

```bash
# Get a specific secret
curl http://localhost:3500/v1.0/secrets/vault/database-credentials
# Response: {"username": "dbuser", "password": "secret123"}

# Get a secret with version (supported by some stores)
curl "http://localhost:3500/v1.0/secrets/awsSecretStore/api-key?metadata.version_id=15"

# Get all secrets from a store (bulk)
curl http://localhost:3500/v1.0/secrets/kubernetes/bulk
# Response: {
#   "db-secret": {"username": "admin", "password": "secret"},
#   "api-secret": {"key": "api-key-value"}
# }
```

## Bindings API

The Bindings API enables interaction with external systems through input (trigger) and output (invoke) bindings. It supports services like databases, queues, cloud storage, email, and more.

```bash
# Invoke an output binding (send to external system)
curl -X POST http://localhost:3500/v1.0/bindings/kafka-output \
  -H "Content-Type: application/json" \
  -d '{
        "data": {
          "orderId": "order-123",
          "event": "order.shipped"
        },
        "metadata": {
          "key": "order-123"
        },
        "operation": "create"
      }'

# Send email via SMTP binding
curl -X POST http://localhost:3500/v1.0/bindings/smtp \
  -H "Content-Type: application/json" \
  -d '{
        "data": "Your order has been shipped!",
        "metadata": {
          "emailTo": "customer@example.com",
          "subject": "Order Shipped"
        },
        "operation": "create"
      }'

# Store file in Azure Blob Storage
curl -X POST http://localhost:3500/v1.0/bindings/azure-blobstorage \
  -H "Content-Type: application/json" \
  -d '{
        "data": "file content here",
        "metadata": {
          "blobName": "reports/monthly-report.txt"
        },
        "operation": "create"
      }'
```

Input bindings trigger your application via HTTP POST when events occur:

```python
# Python Flask input binding handler
from flask import Flask, request
app = Flask(__name__)

@app.route('/kafka-input', methods=['POST'])
def handle_kafka_message():
    message = request.json
    print(f"Received from Kafka: {message}")
    return '', 200
```

## Configuration API

The Configuration API allows applications to read and subscribe to configuration changes from external configuration stores like Redis, Azure App Configuration, and PostgreSQL.

```bash
# Get configuration items
curl "http://localhost:3500/v1.0/configuration/configstore?key=feature-flags&key=app-settings"
# Response: {
#   "feature-flags": {"value": "{\"darkMode\": true}"},
#   "app-settings": {"value": "{\"maxRetries\": 3}"}
# }

# Get all configuration items
curl http://localhost:3500/v1.0/configuration/configstore

# Subscribe to configuration changes
curl http://localhost:3500/v1.0/configuration/configstore/subscribe?key=feature-flags
# Response: {"id": "subscription-uuid"}

# Unsubscribe from configuration changes
curl http://localhost:3500/v1.0/configuration/configstore/subscription-uuid/unsubscribe
```

## Jobs API

The Jobs API (alpha) enables scheduling tasks for future execution with support for cron expressions, one-time jobs, and recurring schedules.

```bash
# Schedule a recurring job
curl -X POST http://localhost:3500/v1.0-alpha1/jobs/daily-report \
  -H "Content-Type: application/json" \
  -d '{
        "data": {"reportType": "sales", "format": "pdf"},
        "schedule": "@daily",
        "repeats": 30
      }'

# Schedule a one-time job
curl -X POST http://localhost:3500/v1.0-alpha1/jobs/send-reminder \
  -H "Content-Type: application/json" \
  -d '{
        "data": {"userId": "user-123", "message": "Complete your order"},
        "dueTime": "2024-01-15T14:00:00Z"
      }'

# Schedule with cron expression (every hour at minute 30)
curl -X POST http://localhost:3500/v1.0-alpha1/jobs/hourly-sync \
  -H "Content-Type: application/json" \
  -d '{
        "data": {"action": "sync-inventory"},
        "schedule": "0 30 * * * *"
      }'

# Get job details
curl http://localhost:3500/v1.0-alpha1/jobs/daily-report

# Delete a job
curl -X DELETE http://localhost:3500/v1.0-alpha1/jobs/daily-report
```

## Distributed Lock API

The Distributed Lock API (alpha) provides mutual exclusion for coordinating access to shared resources across distributed systems.

```bash
# Acquire a lock
curl -X POST http://localhost:3500/v1.0-alpha1/lock/redisStore \
  -H "Content-Type: application/json" \
  -d '{
        "resourceId": "inventory-item-123",
        "lockOwner": "service-instance-1",
        "expiryInSeconds": 60
      }'
# Response: {"success": true}

# Release a lock
curl -X POST http://localhost:3500/v1.0-alpha1/unlock/redisStore \
  -H "Content-Type: application/json" \
  -d '{
        "resourceId": "inventory-item-123",
        "lockOwner": "service-instance-1"
      }'
# Response: {"status": 0}  // 0=success, 1=not found, 2=wrong owner, 3=error
```

## Conversation API

The Conversation API (alpha) provides a unified interface for interacting with Large Language Models (LLMs) including OpenAI, Anthropic, and others, with support for tool calling, PII scrubbing, and prompt caching.

```bash
# Basic conversation
curl -X POST http://localhost:3500/v1.0-alpha2/conversation/openai/converse \
  -H "Content-Type: application/json" \
  -d '{
        "inputs": [{
          "messages": [{
            "ofUser": {
              "content": [{"text": "What is Dapr?"}]
            }
          }]
        }],
        "temperature": 0.7
      }'

# Conversation with tool calling
curl -X POST http://localhost:3500/v1.0-alpha2/conversation/openai/converse \
  -H "Content-Type: application/json" \
  -d '{
        "inputs": [{
          "messages": [{
            "ofUser": {
              "content": [{"text": "What is the weather in San Francisco?"}]
            }
          }]
        }],
        "tools": [{
          "function": {
            "name": "get_weather",
            "description": "Get current weather for a location",
            "parameters": {
              "type": "object",
              "properties": {
                "location": {"type": "string", "description": "City and state"},
                "unit": {"type": "string", "enum": ["celsius", "fahrenheit"]}
              },
              "required": ["location"]
            }
          }
        }],
        "toolChoice": "auto"
      }'
```

## Cryptography API

The Cryptography API (alpha) provides encryption and decryption capabilities using keys stored in secure key vaults like Azure Key Vault or local storage.

```bash
# Encrypt data
curl -X PUT http://localhost:3500/v1.0-alpha1/crypto/azureKeyVault/encrypt \
  -H "dapr-key-name: my-encryption-key" \
  -H "dapr-key-wrap-algorithm: RSA-OAEP-256" \
  -H "Content-Type: application/octet-stream" \
  --data-binary "sensitive data to encrypt"

# Decrypt data
curl -X PUT http://localhost:3500/v1.0-alpha1/crypto/azureKeyVault/decrypt \
  -H "dapr-key-name: my-encryption-key" \
  -H "Content-Type: application/octet-stream" \
  --data-binary "<encrypted-data>"
```

## Component Configuration

Dapr components are configured via YAML files that define connections to external infrastructure. Components are pluggable and can be swapped without code changes.

```yaml
# State store component (Redis)
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: statestore
spec:
  type: state.redis
  version: v1
  metadata:
  - name: redisHost
    value: localhost:6379
  - name: redisPassword
    secretKeyRef:
      name: redis-secret
      key: password
  - name: actorStateStore
    value: "true"
---
# Pub/Sub component (Kafka)
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: pubsub
spec:
  type: pubsub.kafka
  version: v1
  metadata:
  - name: brokers
    value: "kafka:9092"
  - name: consumerGroup
    value: "order-processor"
  - name: authType
    value: "none"
---
# Secret store component (Kubernetes)
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: kubernetes-secrets
spec:
  type: secretstores.kubernetes
  version: v1
```

## Dapr CLI

The Dapr CLI provides commands for running applications with Dapr sidecars locally and managing Dapr installations.

```bash
# Run application with Dapr sidecar
dapr run --app-id myapp --app-port 3000 -- node app.js

# Run with custom resources path
dapr run --app-id myapp --resources-path ./components -- python app.py

# Run gRPC application
dapr run --app-id myapp --app-port 50051 --app-protocol grpc -- go run main.go

# Run with API logging enabled
dapr run --app-id myapp --enable-api-logging -- dotnet run

# Run multiple apps with Multi-App Run
dapr run -f dapr.yaml

# Multi-App Run template (dapr.yaml)
# version: 1
# common:
#   resourcesPath: ./components/
# apps:
#   - appID: order-processor
#     appDirPath: ./order-processor/
#     command: ["python", "app.py"]
#   - appID: checkout
#     appDirPath: ./checkout/
#     appPort: 3000
#     command: ["node", "app.js"]
```

## SDK Usage Examples

Dapr provides SDKs for multiple languages that simplify API interactions.

```python
# Python SDK example
from dapr.clients import DaprClient

with DaprClient() as client:
    # State management
    client.save_state("statestore", "order-123", '{"status": "pending"}')
    state = client.get_state("statestore", "order-123")
    client.delete_state("statestore", "order-123")

    # Pub/Sub
    client.publish_event("pubsub", "orders", '{"orderId": "123"}')

    # Service invocation
    response = client.invoke_method("orderservice", "orders", '{"item": "book"}')

    # Secrets
    secret = client.get_secret("vault", "api-key")
```

```javascript
// JavaScript SDK example
const { DaprClient } = require("@dapr/dapr");
const client = new DaprClient();

// State management
await client.state.save("statestore", [{ key: "order-123", value: { status: "pending" } }]);
const state = await client.state.get("statestore", "order-123");
await client.state.delete("statestore", "order-123");

// Pub/Sub
await client.pubsub.publish("pubsub", "orders", { orderId: "123" });

// Service invocation
const response = await client.invoker.invoke("orderservice", "orders", "POST", { item: "book" });
```

Dapr is ideal for building microservices architectures, event-driven systems, and distributed applications that require reliable state management, service communication, and integration with diverse infrastructure. Its sidecar architecture ensures that applications remain portable across cloud providers and deployment environments while benefiting from built-in security through mTLS, observability via distributed tracing, and resiliency through configurable retry policies and circuit breakers.

Common integration patterns include using Dapr for saga orchestration with workflows, implementing CQRS with pub/sub and state stores, building event sourcing systems with bindings and actors, and creating serverless-style applications with jobs and input bindings. The pluggable component model allows teams to start with simple infrastructure locally and scale to production-grade systems by simply swapping component configurations without modifying application code.
