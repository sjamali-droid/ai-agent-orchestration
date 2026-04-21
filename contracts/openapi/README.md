# OpenAPI Contracts

Place one YAML file per service HTTP API in this directory.

## Naming convention

```
<service-name>.openapi.yaml
```

Example: `user-service.openapi.yaml`, `order-service.openapi.yaml`

## Ownership

- **Authored by**: Software Architect
- **Updated by**: Developer (when implementation changes API surface)
- **Breaking changes**: require Architect approval before merge

## Minimum template

```yaml
openapi: "3.1.0"
info:
  title: "<Service Name> API"
  version: "0.1.0"
  description: "<one sentence>"
paths: {}
components:
  schemas: {}
```
