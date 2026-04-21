# AsyncAPI Contracts

Place one YAML file per async channel / event domain in this directory.

## Naming convention

```
<domain>.asyncapi.yaml
```

Example: `orders.asyncapi.yaml`, `notifications.asyncapi.yaml`

## Ownership

- **Authored by**: Software Architect
- **Updated by**: Developer (when event schema changes)
- **Breaking changes**: require Architect approval before merge

## Minimum template

```yaml
asyncapi: "3.0.0"
info:
  title: "<Domain> Events"
  version: "0.1.0"
  description: "<one sentence>"
channels: {}
components:
  schemas: {}
```
