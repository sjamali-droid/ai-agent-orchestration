# AsyncAPI 3.0 Specification

> **Used by**: Architect
> **What to paste**: spec structure (info, channels, operations, components), message format, channel bindings (Kafka), payload schemas, server definitions.
> **Source**: https://www.asyncapi.com/docs/reference/specification/v3.0.0

<!-- PASTE CONTEXT BELOW THIS LINE -->


### Message Example Object Example

Source: https://github.com/asyncapi/spec/blob/master/spec/asyncapi.md

Demonstrates a complete Message Example Object with headers and payload for a user signup scenario.

```json
{
  "name": "SimpleSignup",
  "summary": "A simple UserSignup example message",
  "headers": {
    "correlationId": "my-correlation-id",
    "applicationInstanceId": "myInstanceId"
  },
  "payload": {
    "user": {
      "someUserKey": "someUserValue"
    },
    "signup": {
      "someSignupKey": "someSignupValue"
    }
  }
}
```

```yaml
name: SimpleSignup
summary: A simple UserSignup example message
headers:
  correlationId: my-correlation-id
  applicationInstanceId: myInstanceId
payload:
  user:
    someUserKey: someUserValue
  signup:
    someSignupKey: someSignupValue
```

--------------------------------

### Schema with Examples

Source: https://github.com/asyncapi/spec/blob/master/spec/asyncapi.md

Demonstrates schema definition with example values and required fields.

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "integer",
      "format": "int64"
    },
    "name": {
      "type": "string"
    }
  },
  "required": [
    "name"
  ],
  "examples": [
    {
      "name": "Puma",
      "id": 1
    }
  ]
}
```

```yaml
type: object
properties:
  id:
    type: integer
    format: int64
  name:
    type: string
required:
- name
examples:
- name: Puma
  id: 1
```

--------------------------------

### Message Object Example in YAML format

Source: https://github.com/asyncapi/spec/blob/master/spec/asyncapi.md

A complete example of a UserSignup message object in YAML format, showing all available fields including headers, payload, correlation ID, traits, and examples.

```yaml
name: UserSignup
title: User signup
summary: Action to sign a user up.
description: A longer description
contentType: application/json
tags:
  - name: user
  - name: signup
  - name: register
headers:
  type: object
  properties:
    correlationId:
      description: Correlation ID set by application
      type: string
    applicationInstanceId:
      description: Unique identifier for a given instance of the publishing application
      type: string
payload:
  type: object
  properties:
    user:
      $ref: '#/components/schemas/userCreate'
    signup:
      $ref: '#/components/schemas/signup'
correlationId:
  description: Default Correlation ID
  location: $message.header#/correlationId
traits:
  - $ref: '#/components/messageTraits/commonHeaders'
examples:
  - name: SimpleSignup
    summary: A simple UserSignup example message
    headers:
      correlationId: my-correlation-id
      applicationInstanceId: myInstanceId
    payload:
      user:
        someUserKey: someUserValue
      signup:
        someSignupKey: someSignupValue
```

--------------------------------

### Message Object Example in JSON format

Source: https://github.com/asyncapi/spec/blob/master/spec/asyncapi.md

A complete example of a UserSignup message object in JSON format, showing all available fields including headers, payload, correlation ID, traits, and examples.

```json
{
  "name": "UserSignup",
  "title": "User signup",
  "summary": "Action to sign a user up.",
  "description": "A longer description",
  "contentType": "application/json",
  "tags": [
    { "name": "user" },
    { "name": "signup" },
    { "name": "register" }
  ],
  "headers": {
    "type": "object",
    "properties": {
      "correlationId": {
        "description": "Correlation ID set by application",
        "type": "string"
      },
      "applicationInstanceId": {
        "description": "Unique identifier for a given instance of the publishing application",
        "type": "string"
      }
    }
  },
  "payload": {
    "type": "object",
    "properties": {
      "user": {
        "$ref": "#/components/schemas/userCreate"
      },
      "signup": {
        "$ref": "#/components/schemas/signup"
      }
    }
  },
  "correlationId": {
    "description": "Default Correlation ID",
    "location": "$message.header#/correlationId"
  },
  "traits": [
    { "$ref": "#/components/messageTraits/commonHeaders" }
  ],
  "examples": [
    {
      "name": "SimpleSignup",
      "summary": "A simple UserSignup example message",
      "headers": {
        "correlationId": "my-correlation-id",
        "applicationInstanceId": "myInstanceId"
      },
      "payload": {
        "user": {
          "someUserKey": "someUserValue"
        },
        "signup": {
          "someSignupKey": "someSignupValue"
        }
      }
    }
  ]
}
```

--------------------------------

### Operation Object Example in YAML

Source: https://github.com/asyncapi/spec/blob/master/spec/asyncapi.md

YAML representation of the Operation Object example showing user signup configuration with all available fields.

```yaml
title: User sign up
summary: Action to sign a user up.
description: A longer description
channel:
  $ref: '#/channels/userSignup'
action: send
security:
  - type: oauth2
    description: The oauth security descriptions
    flows:
      clientCredentials:
        tokenUrl: 'https://example.com/api/oauth/dialog'
        availableScopes:
          'subscribe:auth_revocations': Scope required for authorization revocation topic
    scopes:
      - 'subscribe:auth_revocations'
    petstore_auth:
      - 'write:pets'
      - 'read:pets'
tags:
  - name: user
  - name: signup
  - name: register
bindings:
  amqp:
    ack: false
traits:
  - $ref: '#/components/operationTraits/kafka'
messages:
  - $ref: '#/channels/userSignup/messages/userSignedUp'
reply:
  address:
    location: '$message.header#/replyTo'
  channel:
    $ref: '#/channels/userSignupReply'
  messages:
    - $ref: '#/channels/userSignupReply/messages/userSignedUpReply'
```

--------------------------------

### Reference Object Example

Source: https://github.com/asyncapi/spec/blob/master/spec/asyncapi.md

Example of a Reference Object using JSON Reference to point to a Pet schema component.

```json
{
  "$ref": "#/components/schemas/Pet"
}
```

```yaml
$ref: '#/components/schemas/Pet'
```

--------------------------------

### External Documentation Object Example

Source: https://github.com/asyncapi/spec/blob/master/spec/asyncapi.md

Example of an External Documentation Object for referencing additional documentation.

```json
{
  "description": "Find more info here",
  "url": "https://example.com"
}
```

```yaml
description: Find more info here
url: https://example.com
```

--------------------------------

### Operation Object Example in JSON

Source: https://github.com/asyncapi/spec/blob/master/spec/asyncapi.md

Example showing the structure of an Operation Object for a user signup action with security, tags, bindings, traits, messages and reply configuration.

```json
{
  "title": "User sign up",
  "summary": "Action to sign a user up.",
  "description": "A longer description",
  "channel": {
    "$ref": "#/channels/userSignup"
  },
  "action": "send",
  "security": [
    {
      "type": "oauth2",
      "description": "The oauth security descriptions",
      "flows": {
        "clientCredentials": {
          "tokenUrl": "https://example.com/api/oauth/dialog",
          "availableScopes": {
            "subscribe:auth_revocations": "Scope required for authorization revocation topic"
          }
        }
      },
      "scopes": [
        "subscribe:auth_revocations"
      ],
     "petstore_auth": [
       "write:pets",
       "read:pets"
     ]
    }
  ],
  "tags": [
    { "name": "user" },
    { "name": "signup" },
    { "name": "register" }
  ],
  "bindings": {
    "amqp": {
      "ack": false
    }
  },
  "traits": [
    { "$ref": "#/components/operationTraits/kafka" }
  ],
  "messages": [
    { "$ref": "#/channels/userSignup/messages/userSignedUp" }
  ],
  "reply": {
    "address": {
      "location": "$message.header#/replyTo"
    },
    "channel": {
      "$ref": "#/channels/userSignupReply"
    },
    "messages": [
      { "$ref": "#/channels/userSignupReply/messages/userSignedUpReply" }
    ]
  }
}
```

--------------------------------

### AsyncAPI Info Object Example in JSON

Source: https://github.com/asyncapi/spec/blob/master/spec/asyncapi.md

Complete example of the Info Object in JSON format, demonstrating all available fields including title, version, description, contact information, license, external documentation, and tags.

```json
{
  "title": "AsyncAPI Sample App",
  "version": "1.0.1",
  "description": "This is a sample app.",
  "termsOfService": "https://asyncapi.org/terms/",
  "contact": {
    "name": "API Support",
    "url": "https://www.asyncapi.org/support",
    "email": "support@asyncapi.org"
  },
  "license": {
    "name": "Apache 2.0",
    "url": "https://www.apache.org/licenses/LICENSE-2.0.html"
  },
  "externalDocs": {
    "description": "Find more info here",
    "url": "https://www.asyncapi.org"
  },
  "tags": [
    {
      "name": "e-commerce"
    }
  ]
}
```

--------------------------------

### AsyncAPI Info Object Example in YAML

Source: https://github.com/asyncapi/spec/blob/master/spec/asyncapi.md

Complete example of the Info Object in YAML format, demonstrating all available fields including title, version, description, contact information, license, external documentation, and tags.

```yaml
title: AsyncAPI Sample App
version: 1.0.1
description: This is a sample app.
termsOfService: https://asyncapi.org/terms/
contact:
  name: API Support
  url: https://www.asyncapi.org/support
  email: support@asyncapi.org
license:
  name: Apache 2.0
  url: https://www.apache.org/licenses/LICENSE-2.0.html
externalDocs:
  description: Find more info here
  url: https://www.asyncapi.org
tags:
  - name: e-commerce
```

--------------------------------

### Operation Trait Object Example in YAML

Source: https://github.com/asyncapi/spec/blob/master/spec/asyncapi.md

YAML representation of the Operation Trait Object example with AMQP binding settings.

```yaml
bindings:
  amqp:
    ack: false
```

--------------------------------

### Operation Trait Object Example in JSON

Source: https://github.com/asyncapi/spec/blob/master/spec/asyncapi.md

Example of an Operation Trait Object showing AMQP binding configuration.

```json
{
  "bindings": {
    "amqp": {
      "ack": false
    }
  }
}
```

--------------------------------

### AsyncAPI Security Scheme Examples

Source: https://github.com/asyncapi/spec/blob/master/spec/asyncapi.md

Collection of security scheme examples including user/password, API key, X.509, encryption, HTTP basic auth, and JWT bearer authentication implementations.

```json
{
  "type": "userPassword"
}
```

```json
{
  "type": "apiKey",
  "in": "user"
}
```

```json
{
  "type": "X509"
}
```

```json
{
  "type": "symmetricEncryption"
}
```

```json
{
  "type": "http",
  "scheme": "basic"
}
```

```json
{
  "type": "httpApiKey",
  "name": "api_key",
  "in": "header"
}
```

```json
{
  "type": "http",
  "scheme": "bearer",
  "bearerFormat": "JWT"
}
```

--------------------------------

### Tag Object Example

Source: https://github.com/asyncapi/spec/blob/master/spec/asyncapi.md

Example of a Tag Object used for categorizing and describing message types.

```json
{
 "name": "user",
 "description": "User-related messages"
}
```

```yaml
name: user
description: User-related messages
```

--------------------------------

### Defining Components Object in AsyncAPI Using YAML

Source: https://github.com/asyncapi/spec/blob/master/spec/asyncapi.md

Example of a Components Object in YAML format, showing the same structures as the JSON example but with YAML syntax. Includes definitions for schemas, servers, channels, messages, and other reusable components.

```yaml
components:
  schemas:
    Category:
      type: object
      properties:
        id:
          type: integer
          format: int64
        name:
          type: string
    Tag:
      type: object
      properties:
        id:
          type: integer
          format: int64
        name:
          type: string
    AvroExample:
      schemaFormat: 'application/vnd.apache.avro+json;version=1.9.0'
      schema:
        $ref: './user-create.avsc'
  servers:
    development:
      host: '{stage}.in.mycompany.com:{port}'
      description: RabbitMQ broker
      protocol: amqp
      protocolVersion: 0-9-1
      variables:
        stage:
          $ref: '#/components/serverVariables/stage'
        port:
          $ref: '#/components/serverVariables/port'
  serverVariables:
    stage:
      default: demo
      description: |
        This value is assigned by the service provider, in this example
        `mycompany.com`
    port:
      enum:
        - '5671'
        - '5672'
      default: '5672'
  channels:
    user/signedup:
      subscribe:
        message:
          $ref: '#/components/messages/userSignUp'
  messages:
    userSignUp:
      summary: Action to sign a user up.
      description: |
        Multiline description of what this action does.
        Here you have another line.
      tags:
        - name: user
        - name: signup
      headers:
        type: object
        properties:
          applicationInstanceId:
            description: |
              Unique identifier for a given instance of the publishing
              application
            type: string
      payload:
        type: object
        properties:
          user:
            $ref: '#/components/schemas/userCreate'
          signup:
            $ref: '#/components/schemas/signup'
  parameters:
    userId:
      description: Id of the user.
  correlationIds:
    default:
      description: Default Correlation ID
      location: '$message.header#/correlationId'
  messageTraits:
    commonHeaders:
      headers:
        type: object
        properties:
          my-app-header:
            type: integer
            minimum: 0
            maximum: 100
```

--------------------------------

### AsyncAPI Contact Object Example in YAML

Source: https://github.com/asyncapi/spec/blob/master/spec/asyncapi.md

Example of the Contact Object in YAML format, showing the name, URL, and email fields for API support contact information.

```yaml
name: API Support
url: https://www.example.com/support
email: support@example.com
```

--------------------------------

### Channel Parameters Object Example in JSON

Source: https://github.com/asyncapi/spec/blob/master/spec/asyncapi.md

Shows how to define channel parameters with a user ID parameter including its description and address pattern.

```json
{
  "address": "user/{userId}/signedup",
  "parameters": {
    "userId": {
      "description": "Id of the user."
    }
  }
}
```

--------------------------------

### AsyncAPI Identifier Example in YAML

Source: https://github.com/asyncapi/spec/blob/master/spec/asyncapi.md

Example of a valid identifier for an AsyncAPI application in YAML format using URN notation.

```yaml
id: 'urn:example:com:smartylighting:streetlights:server'
```

--------------------------------

### AsyncAPI Contact Object Example in JSON

Source: https://github.com/asyncapi/spec/blob/master/spec/asyncapi.md

Example of the Contact Object in JSON format, showing the name, URL, and email fields for API support contact information.

```json
{
  "name": "API Support",
  "url": "https://www.example.com/support",
  "email": "support@example.com"
}
```

--------------------------------

### Channel Parameter Object with Location Example in JSON

Source: https://github.com/asyncapi/spec/blob/master/spec/asyncapi.md

Demonstrates a channel parameter definition that includes both description and location fields using runtime expressions.

```json
{
  "address": "user/{userId}/signedup",
  "parameters": {
    "userId": {
      "description": "Id of the user.",
      "location": "$message.payload#/user/id"
    }
  }
}
```

--------------------------------

### Message Trait Object Example

Source: https://github.com/asyncapi/spec/blob/master/spec/asyncapi.md

Example of a Message Trait Object showing content type specification.

```json
{
  "contentType": "application/json"
}
```

```yaml
contentType: application/json
```

--------------------------------

### Example Operation Reply Address Object in YAML

Source: https://github.com/asyncapi/spec/blob/master/spec/asyncapi.md

YAML representation of an operation reply address specification with description and location fields.

```yaml
description: Consumer Inbox
location: $message.header#/replyTo
```

--------------------------------

### AsyncAPI Identifier Example in JSON

Source: https://github.com/asyncapi/spec/blob/master/spec/asyncapi.md

Examples of valid identifiers for AsyncAPI applications using URN format to globally and uniquely identify applications.

```json
{
  "id": "urn:example:com:smartylighting:streetlights:server"
}
```

--------------------------------

### Channel Parameter Object with Location Example in YAML

Source: https://github.com/asyncapi/spec/blob/master/spec/asyncapi.md

YAML representation of a channel parameter with description and location specifications using runtime expressions.

```yaml
address: user/{userId}/signedup
parameters:
  userId:
    description: Id of the user.
    location: $message.payload#/user/id
```

--------------------------------

### Example Operation Reply Address Object in JSON

Source: https://github.com/asyncapi/spec/blob/master/spec/asyncapi.md

Demonstrates how to specify a reply address for an operation using a runtime expression that points to a header field. Includes an optional description field and required location field.

```json
{
  "description": "Consumer inbox",
  "location": "$message.header#/replyTo"
}
```

--------------------------------

### Valid Field Name Examples in AsyncAPI Components

Source: https://github.com/asyncapi/spec/blob/master/spec/asyncapi.md

Examples of valid field names that match the required regular expression pattern ^[a-zA-Z0-9\.\-_]+$ for Components Object keys.

```text
User
User_1
User_Name
user-name
my.org.User
```

--------------------------------

### AsyncAPI HTTP Identifier Example in YAML

Source: https://github.com/asyncapi/spec/blob/master/spec/asyncapi.md

Example of using an HTTP URL as an identifier for an AsyncAPI application in YAML format.

```yaml
id: 'https://github.com/smartylighting/streetlights-server'
```

--------------------------------

### Defining Map/Dictionary Schema

Source: https://github.com/asyncapi/spec/blob/master/spec/asyncapi.md

Examples of schemas with additional properties for string-to-string and string-to-model mappings.

```json
{
  "type": "object",
  "additionalProperties": {
    "type": "string"
  }
}
```

```yaml
type: object
additionalProperties:
  type: string
```

--------------------------------

### Channel Parameters Object Example in YAML

Source: https://github.com/asyncapi/spec/blob/master/spec/asyncapi.md

YAML version of channel parameters definition showing user ID parameter structure.

```yaml
address: user/{userId}/signedup
parameters:
  userId:
    description: Id of the user.
```

--------------------------------

### AsyncAPI HTTP Identifier Example in JSON

Source: https://github.com/asyncapi/spec/blob/master/spec/asyncapi.md

Example of using an HTTP URL as an identifier for an AsyncAPI application in JSON format.

```json
{
  "id": "https://github.com/smartylighting/streetlights-server"
}
```

--------------------------------

### Defining License Object in AsyncAPI Specification (JSON)

Source: https://github.com/asyncapi/spec/blob/master/spec/asyncapi.md

Example of a License Object that provides licensing information for an API. It includes the required name property and an optional URL pointing to the license.

```json
{
  "name": "Apache 2.0",
  "url": "https://www.apache.org/licenses/LICENSE-2.0.html"
}
```

--------------------------------

### Linting AsyncAPI Specification Markdown with Docker

Source: https://github.com/asyncapi/spec/blob/master/CONTRIBUTING.md

This command uses a Docker container to run markdownlint-cli and check the AsyncAPI specification markdown file for errors. It mounts the current directory to the container and targets the specific markdown file.

```bash
docker run -v $PWD:/workdir ghcr.io/igorshubovych/markdownlint-cli:v0.35.0 "spec/asyncapi.md"
```

--------------------------------

### Update AsyncAPI Schema MIME Types Example

Source: https://github.com/asyncapi/spec/blob/master/RELEASE_PROCESS.md

Code location in parser-js repository showing where version updates are needed in the getMimeTypes function of asyncapiSchemaFormatParser.js

```markdown
lib/asyncapiSchemaFormatParser.js
```

--------------------------------

### Defining Servers Object in AsyncAPI Specification (JSON)

Source: https://github.com/asyncapi/spec/blob/master/spec/asyncapi.md

Example of a Servers Object that defines multiple server environments (development, staging, production) for an application. Each server includes host information, protocol details, and environment-specific tags.

```json
{
  "development": {
    "host": "localhost:5672",
    "description": "Development AMQP broker.",
    "protocol": "amqp",
    "protocolVersion": "0-9-1",
    "tags": [
      { 
        "name": "env:development",
        "description": "This environment is meant for developers to run their own tests."
      }
    ]
  },
  "staging": {
    "host": "rabbitmq-staging.in.mycompany.com:5672",
    "description": "RabbitMQ broker for the staging environment.",
    "protocol": "amqp",
    "protocolVersion": "0-9-1",
    "tags": [
      { 
        "name": "env:staging",
        "description": "This environment is a replica of the production environment."
      }
    ]
  },
  "production": {
    "host": "rabbitmq.in.mycompany.com:5672",
    "description": "RabbitMQ broker for the production environment.",
    "protocol": "amqp",
    "protocolVersion": "0-9-1",
    "tags": [
      { 
        "name": "env:production",
        "description": "This environment is the live environment available for final users."
      }
    ]
  }
}
```

--------------------------------

### Message Object with Avro Schema in YAML format

Source: https://github.com/asyncapi/spec/blob/master/spec/asyncapi.md

An example of a UserSignup message object using Avro schema for the payload definition in YAML format. This shows how to reference an external Avro schema file.

```yaml
name: UserSignup
title: User signup
summary: Action to sign a user up.
description: A longer description
tags:
  - name: user
  - name: signup
  - name: register
payload:
  schemaFormat: 'application/vnd.apache.avro+yaml;version=1.9.0'
  schema:
    $ref: './user-create.avsc'
```

--------------------------------

### Defining Server Object with Variable Object in AsyncAPI Specification (JSON)

Source: https://github.com/asyncapi/spec/blob/master/spec/asyncapi.md

Example of a Server Object that includes variable substitution. It defines an 'env' variable that can be used in the pathname to dynamically select between production and staging environments.

```json
{
  "host": "rabbitmq.in.mycompany.com:5672",
  "pathname": "/{env}",
  "protocol": "amqp",
  "description": "RabbitMQ broker. Use the `env` variable to point to either `production` or `staging`.",
  "variables": {
    "env": {
      "description": "Environment to connect to. It can be either `production` or `staging`.",
      "enum": [
        "production",
        "staging"
      ]
    }
  }
}
```

--------------------------------

### Defining Components Object in AsyncAPI Using JSON

Source: https://github.com/asyncapi/spec/blob/master/spec/asyncapi.md

Example of a Components Object in JSON format, defining schemas, servers, channels, messages, parameters, correlation IDs, and message traits. This demonstrates how to organize reusable components in an AsyncAPI specification.

```json
{
  "components": {
    "schemas": {
      "Category": {
        "type": "object",
        "properties": {
          "id": {
            "type": "integer",
            "format": "int64"
          },
          "name": {
            "type": "string"
          }
        }
      },
      "Tag": {
        "type": "object",
        "properties": {
          "id": {
            "type": "integer",
            "format": "int64"
          },
          "name": {
            "type": "string"
          }
        }
      },
      "AvroExample": {
        "schemaFormat": "application/vnd.apache.avro+json;version=1.9.0",
        "schema": {
          "$ref": "./user-create.avsc"
        }
      }
    },
    "servers": {
      "development": {
        "host": "{stage}.in.mycompany.com:{port}",
        "description": "RabbitMQ broker",
        "protocol": "amqp",
        "protocolVersion": "0-9-1",
        "variables": {
          "stage": {
            "$ref": "#/components/serverVariables/stage"
          },
          "port": {
            "$ref": "#/components/serverVariables/port"
          }
        }
      }
    },
    "serverVariables": {
      "stage": {
        "default": "demo",
        "description": "This value is assigned by the service provider, in this example `mycompany.com`"
      },
      "port": {
        "enum": ["5671", "5672"],
        "default": "5672"
      }
    },
    "channels": {
      "user/signedup": {
        "subscribe": {
          "message": {
            "$ref": "#/components/messages/userSignUp"
          }
        }
      }
    },
    "messages": {
      "userSignUp": {
        "summary": "Action to sign a user up.",
        "description": "Multiline description of what this action does.\nHere you have another line.\n",
        "tags": [
          {
            "name": "user"
          },
          {
            "name": "signup"
          }
        ],
        "headers": {
          "type": "object",
          "properties": {
            "applicationInstanceId": {
              "description": "Unique identifier for a given instance of the publishing application",
              "type": "string"
            }
          }
        },
        "payload": {
          "type": "object",
          "properties": {
            "user": {
              "$ref": "#/components/schemas/userCreate"
            },
            "signup": {
              "$ref": "#/components/schemas/signup"
            }
          }
        }
      }
    },
    "parameters": {
      "userId": {
        "description": "Id of the user."
      }
    },
    "correlationIds": {
      "default": {
        "description": "Default Correlation ID",
        "location": "$message.header#/correlationId"
      }
    },
    "messageTraits": {
      "commonHeaders": {
        "headers": {
          "type": "object",
          "properties": {
            "my-app-header": {
              "type": "integer",
              "minimum": 0,
              "maximum": 100
            }
          }
        }
      }
    }
  }
}
```

--------------------------------

### Defining Server Object with Pathname in AsyncAPI Specification (JSON)

Source: https://github.com/asyncapi/spec/blob/master/spec/asyncapi.md

Example of a Server Object that includes a pathname property for the RabbitMQ broker. This demonstrates how to specify a path to a specific resource on the server.

```json
{
  "host": "rabbitmq.in.mycompany.com:5672",
  "pathname": "/production",
  "protocol": "amqp",
  "description": "Production RabbitMQ broker (uses the `production` vhost)."
}
```

--------------------------------

### Message Object with Avro Schema in JSON format

Source: https://github.com/asyncapi/spec/blob/master/spec/asyncapi.md

An example of a UserSignup message object using Avro schema for the payload definition in JSON format. This shows how to reference an external Avro schema file.

```json
{
  "name": "UserSignup",
  "title": "User signup",
  "summary": "Action to sign a user up.",
  "description": "A longer description",
  "tags": [
    { "name": "user" },
    { "name": "signup" },
    { "name": "register" }
  ],
  "payload": {
    "schemaFormat": "application/vnd.apache.avro+json;version=1.9.0",
    "schema": {
      "$ref": "./user-create.avsc"
    }
  }
}
```

--------------------------------

### Defining Server Object in AsyncAPI Specification (JSON)

Source: https://github.com/asyncapi/spec/blob/master/spec/asyncapi.md

Example of a Server Object that represents a Kafka message broker. It includes required fields like host and protocol, along with the protocol version.

```json
{
  "host": "kafka.in.mycompany.com:9092",
  "description": "Production Kafka broker.",
  "protocol": "kafka",
  "protocolVersion": "3.2"
}
```

--------------------------------

### Invalid Operation Conversion Example

Source: https://github.com/asyncapi/spec/blob/master/spec/asyncapi.md

Demonstrates an incorrect conversion of a receive operation to a send operation, highlighting why direct conversion between sender and receiver specifications is not recommended.

```yaml
operations:
  onUserSignedUp: # <-- This doesn't make sense now. Should be something like sendUserSignedUp.
    summary: On user signed up. # <-- This doesn't make sense now. Should say something like "Sends a user signed up event".
    description: Event received when a user signed up on the product. # <-- This doesn't make sense now. Should speak about sending an event, not receiving it.
    action: send
    channel:
      $ref: '#/channels/userSignedUp'
```

--------------------------------

### Defining Multi Format Schema Object with Avro in AsyncAPI

Source: https://github.com/asyncapi/spec/blob/master/spec/asyncapi.md

Example of using the Multi Format Schema Object with Apache Avro schema format in an AsyncAPI specification. Shows how to define a message payload using Avro schema format within a channel definition.

```yaml
channels:
  example:
    messages:
      myMessage:
        payload:
          schemaFormat: 'application/vnd.apache.avro;version=1.9.0'
          schema:
            type: record
            name: User
            namespace: com.company
            doc: User information
            fields:
              - name: displayName
                type: string
              - name: age
                type: int
```

--------------------------------

### Basic AsyncAPI Channel and Operation Definition

Source: https://github.com/asyncapi/spec/blob/master/spec/asyncapi.md

Demonstrates the basic structure for defining a channel and operation in AsyncAPI, showing how to specify a receive operation on a channel.

```yaml
channels:
  userSignedUp:
    # ...(redacted for brevity)
operations:
  onUserSignedUp:
    action: receive
    channel:
      $ref: '#/channels/userSignedUp'
```

--------------------------------

### Schema with Composition

Source: https://github.com/asyncapi/spec/blob/master/spec/asyncapi.md

Demonstrates schema composition using allOf to extend base models with additional properties.

```json
{
  "schemas": {
    "ErrorModel": {
      "type": "object",
      "required": [
        "message",
        "code"
      ],
      "properties": {
        "message": {
          "type": "string"
        },
        "code": {
          "type": "integer",
          "minimum": 100,
          "maximum": 600
        }
      }
    },
    "ExtendedErrorModel": {
      "allOf": [
        {
          "$ref": "#/components/schemas/ErrorModel"
        },
        {
          "type": "object",
          "required": [
            "rootCause"
          ],
          "properties": {
            "rootCause": {
              "type": "string"
            }
          }
        }
      ]
    }
  }
}
```

```yaml
schemas:
  ErrorModel:
    type: object
    required:
    - message
    - code
    properties:
      message:
        type: string
      code:
        type: integer
        minimum: 100
        maximum: 600
  ExtendedErrorModel:
    allOf:
    - $ref: '#/components/schemas/ErrorModel'
    - type: object
      required:
      - rootCause
      properties:
        rootCause:
          type: string
```

--------------------------------

### AsyncAPI Operation Definition with Metadata

Source: https://github.com/asyncapi/spec/blob/master/spec/asyncapi.md

Shows a more detailed operation definition including summary, description, and channel reference for receiving messages.

```yaml
operations:
  onUserSignedUp:
    summary: On user signed up.
    description: Event received when a user signed up on the product.
    action: receive
    channel:
      $ref: '#/channels/userSignedUp'
```

--------------------------------

### Defining Polymorphic Schema Models in AsyncAPI

Source: https://github.com/asyncapi/spec/blob/master/spec/asyncapi.md

Demonstrates how to define polymorphic models using discriminator pattern with a base Pet class and derived Cat, Dog, and StickInsect classes. Shows implementation in both JSON and YAML formats.

```json
{
  "schemas": {
    "Pet": {
      "type": "object",
      "discriminator": "petType",
      "properties": {
        "name": {
          "type": "string"
        },
        "petType": {
          "type": "string"
        }
      },
      "required": [
        "name",
        "petType"
      ]
    },
    "Cat": {
      "description": "A representation of a cat. Note that `Cat` will be used as the discriminator value.",
      "allOf": [
        {
          "$ref": "#/components/schemas/Pet"
        },
        {
          "type": "object",
          "properties": {
            "huntingSkill": {
              "type": "string",
              "description": "The measured skill for hunting",
              "enum": [
                "clueless",
                "lazy",
                "adventurous",
                "aggressive"
              ]
            }
          },
          "required": [
            "huntingSkill"
          ]
        }
      ]
    },
    "Dog": {
      "description": "A representation of a dog. Note that `Dog` will be used as the discriminator value.",
      "allOf": [
        {
          "$ref": "#/components/schemas/Pet"
        },
        {
          "type": "object",
          "properties": {
            "packSize": {
              "type": "integer",
              "format": "int32",
              "description": "the size of the pack the dog is from",
              "minimum": 0
            }
          },
          "required": [
            "packSize"
          ]
        }
      ]
    },
    "StickInsect": {
      "description": "A representation of an Australian walking stick. Note that `StickBug` will be used as the discriminator value.",
      "allOf": [
        {
          "$ref": "#/components/schemas/Pet"
        },
        {
          "type": "object",
          "properties": {
            "petType": {
              "const": "StickBug"
            },
            "color": {
              "type": "string"
            }
          },
          "required": [
            "color"
          ]
        }
      ]
    }
  }
}
```

```yaml
schemas:
  Pet:
    type: object
    discriminator: petType
    properties:
      name:
        type: string
      petType:
        type: string
    required:
    - name
    - petType
  Cat:
    description: A representation of a cat
    allOf:
    - $ref: '#/components/schemas/Pet'
    - type: object
      properties:
        huntingSkill:
          type: string
          description: The measured skill for hunting
          enum:
          - clueless
          - lazy
          - adventurous
          - aggressive
      required:
      - huntingSkill
  Dog:
    description: A representation of a dog
    allOf:
    - $ref: '#/components/schemas/Pet'
    - type: object
      properties:
        packSize:
          type: integer
          format: int32
          description: the size of the pack the dog is from
          minimum: 0
      required:
      - packSize
  StickInsect:
    description: A representation of an Australian walking stick
    allOf:
    - $ref: '#/components/schemas/Pet'
    - type: object
      properties:
        petType:
          const: StickBug
        color:
          type: string
      required:
      - color
```

--------------------------------

### Server Bindings Object Field Definitions in AsyncAPI

Source: https://github.com/asyncapi/spec/blob/master/spec/asyncapi.md

Table defining the protocol-specific bindings available for server objects in AsyncAPI, including supported messaging protocols and links to their detailed specifications.

```markdown
Field Name | Type | Description
---|:---:|---
`http` | [HTTP Server Binding](https://github.com/asyncapi/bindings/blob/master/http#server) | Protocol-specific information for an HTTP server.
`ws` | [WebSockets Server Binding](https://github.com/asyncapi/bindings/blob/master/websockets#server) | Protocol-specific information for a WebSockets server.
`kafka` | [Kafka Server Binding](https://github.com/asyncapi/bindings/blob/master/kafka#server) | Protocol-specific information for a Kafka server.
```

--------------------------------

### Channel Bindings Object Field Definitions in AsyncAPI

Source: https://github.com/asyncapi/spec/blob/master/spec/asyncapi.md

Table defining the protocol-specific bindings available for channel objects in AsyncAPI, including supported messaging protocols and links to their detailed specifications.

```markdown
Field Name | Type | Description
---|:---:|---
`http` | [HTTP Channel Binding](https://github.com/asyncapi/bindings/blob/master/http/README.md#channel) | Protocol-specific information for an HTTP channel.
`ws` | [WebSockets Channel Binding](https://github.com/asyncapi/bindings/blob/master/websockets/README.md#channel) | Protocol-specific information for a WebSockets channel.
`kafka` | [Kafka Channel Binding](https://github.com/asyncapi/bindings/blob/master/kafka/README.md#channel) | Protocol-specific information for a Kafka channel.
```

--------------------------------

### Defining a Channel Object in AsyncAPI

Source: https://github.com/asyncapi/spec/blob/master/spec/asyncapi.md

Illustrates the structure of a Channel Object in AsyncAPI. It includes properties such as address, title, description, messages, parameters, servers, bindings, tags, and external documentation.

```json
{
  "address": "users.{userId}",
  "title": "Users channel",
  "description": "This channel is used to exchange messages about user events.",
  "messages": {
    "userSignedUp": {
      "$ref": "#/components/messages/userSignedUp"
    },
    "userCompletedOrder": {
      "$ref": "#/components/messages/userCompletedOrder"
    }
  },
  "parameters": {
    "userId": {
      "$ref": "#/components/parameters/userId"
    }
  },
  "servers": [
    { "$ref": "#/servers/rabbitmqInProd" },
    { "$ref": "#/servers/rabbitmqInStaging" }
  ],
  "bindings": {
    "amqp": {
      "is": "queue",
      "queue": {
        "exclusive": true
      }
    }
  },
  "tags": [{
    "name": "user",
    "description": "User-related messages"
  }],
  "externalDocs": {
    "description": "Find more info here",
    "url": "https://example.com"
  }
}
```

```yaml
address: 'users.{userId}'
title: Users channel
description: This channel is used to exchange messages about user events.
messages:
  userSignedUp:
    $ref: '#/components/messages/userSignedUp'
  userCompletedOrder:
    $ref: '#/components/messages/userCompletedOrder'
parameters:
  userId:
    $ref: '#/components/parameters/userId'
servers:
  - $ref: '#/servers/rabbitmqInProd'
  - $ref: '#/servers/rabbitmqInStaging'
bindings:
  amqp:
    is: queue
    queue:
      exclusive: true
tags:
  - name: user
    description: User-related messages
externalDocs:
  description: 'Find more info here'
  url: 'https://example.com'
```

--------------------------------

### Defining Email Schema with JSON and YAML

Source: https://github.com/asyncapi/spec/blob/master/spec/asyncapi.md

Demonstrates a primitive schema definition for an email format string type.

```json
{
  "type": "string",
  "format": "email"
}
```

```yaml
type: string
format: email
```

--------------------------------

### Defining Servers Object in AsyncAPI Specification (YAML)

Source: https://github.com/asyncapi/spec/blob/master/spec/asyncapi.md

YAML representation of a Servers Object that defines multiple server environments (development, staging, production) for an application. Each server includes host information, protocol details, and environment-specific tags.

```yaml
development:
  host: localhost:5672
  description: Development AMQP broker.
  protocol: amqp
  protocolVersion: 0-9-1
  tags:
    - name: 'env:development'
      description: 'This environment is meant for developers to run their own tests.'
staging:
  host: rabbitmq-staging.in.mycompany.com:5672
  description: RabbitMQ broker for the staging environment.
  protocol: amqp
  protocolVersion: 0-9-1
  tags:
    - name: 'env:staging'
      description: 'This environment is a replica of the production environment.'
production:
  host: rabbitmq.in.mycompany.com:5672
  description: RabbitMQ broker for the production environment.
  protocol: amqp
  protocolVersion: 0-9-1
  tags:
    - name: 'env:production'
      description: 'This environment is the live environment available for final users.'
```

--------------------------------

### Defining Person Object Schema

Source: https://github.com/asyncapi/spec/blob/master/spec/asyncapi.md

Shows a simple model schema with required fields, properties including a reference to another schema, and validation constraints.

```json
{
  "type": "object",
  "required": [
    "name"
  ],
  "properties": {
    "name": {
      "type": "string"
    },
    "address": {
      "$ref": "#/components/schemas/Address"
    },
    "age": {
      "type": "integer",
      "format": "int32",
      "minimum": 0
    }
  }
}
```

```yaml
type: object
required:
- name
properties:
  name:
    type: string
  address:
    $ref: '#/components/schemas/Address'
  age:
    type: integer
    format: int32
    minimum: 0
```

--------------------------------

### Defining Server Object with Variable Object in AsyncAPI Specification (YAML)

Source: https://github.com/asyncapi/spec/blob/master/spec/asyncapi.md

YAML representation of a Server Object that includes variable substitution. It defines an 'env' variable that can be used in the pathname to dynamically select between production and staging environments.

```yaml
host: 'rabbitmq.in.mycompany.com:5672'
pathname: '/{env}'
protocol: amqp
description: RabbitMQ broker. Use the `env` variable to point to either `production` or `staging`.
variables:
  env:
    description: Environment to connect to. It can be either `production` or `staging`.
    enum:
      - production
      - staging
```

--------------------------------

### Defining License Object in AsyncAPI Specification (YAML)

Source: https://github.com/asyncapi/spec/blob/master/spec/asyncapi.md

YAML representation of a License Object that provides licensing information for an API. It includes the required name property and an optional URL pointing to the license.

```yaml
name: Apache 2.0
url: https://www.apache.org/licenses/LICENSE-2.0.html
```

--------------------------------

### Defining Client Credentials OAuth Flow in YAML

Source: https://github.com/asyncapi/spec/blob/master/spec/asyncapi.md

This snippet shows how to define a client credentials OAuth flow object in YAML format. It includes the token URL and available scopes.

```yaml
tokenUrl: https://example.com/api/oauth/token
availableScopes:
  write:pets: modify pets in your account
  read:pets: read your pets
```

--------------------------------

### Defining Server Object with Pathname in AsyncAPI Specification (YAML)

Source: https://github.com/asyncapi/spec/blob/master/spec/asyncapi.md

YAML representation of a Server Object that includes a pathname property for the RabbitMQ broker. This demonstrates how to specify a path to a specific resource on the server.

```yaml
host: rabbitmq.in.mycompany.com:5672
pathname: /production
protocol: amqp
description: Production RabbitMQ broker (uses the `production` vhost).
```

--------------------------------

### Defining SASL Security Scheme in YAML

Source: https://github.com/asyncapi/spec/blob/master/spec/asyncapi.md

This snippet shows how to define a SASL security scheme using SCRAM-SHA-512 in YAML format.

```yaml
type: scramSha512
```

--------------------------------

### Basic YAML Field Representation in AsyncAPI

Source: https://github.com/asyncapi/spec/blob/master/spec/asyncapi.md

Demonstrates how fields with array values are represented in YAML format within AsyncAPI Specification files.

```yaml
{
   "field" : [...]
}
```

--------------------------------

### Defining Channels in AsyncAPI

Source: https://github.com/asyncapi/spec/blob/master/spec/asyncapi.md

Shows how to define channels in an AsyncAPI document. Channels represent shared communication paths and can include messages and references to message definitions.

```json
{
  "userSignedUp": {
    "address": "user.signedup",
    "messages": {
      "userSignedUp": {
        "$ref": "#/components/messages/userSignedUp"
      }
    }
  }
}
```

```yaml
userSignedUp:
  address: 'user.signedup'
  messages:
    userSignedUp:
      $ref: '#/components/messages/userSignedUp'
```

--------------------------------

### Defining Operations in AsyncAPI

Source: https://github.com/asyncapi/spec/blob/master/spec/asyncapi.md

Demonstrates how to define operations in an AsyncAPI document. Operations represent actions that an application must implement, such as sending or receiving messages on specific channels.

```json
{
  "onUserSignUp": {
    "title": "User sign up",
    "summary": "Action to sign a user up.",
    "description": "A longer description",
    "channel": {
      "$ref": "#/channels/userSignup"
    },
    "action": "send",
    "tags": [
      { "name": "user" },
      { "name": "signup" },
      { "name": "register" }
    ],
    "bindings": {
      "amqp": {
        "ack": false
      }
    },
    "traits": [
      { "$ref": "#/components/operationTraits/kafka" }
    ]
  }
}
```

```yaml
onUserSignUp:
  title: User sign up
  summary: Action to sign a user up.
  description: A longer description
  channel:
    $ref: '#/channels/userSignup'
  action: send
  tags:
    - name: user
    - name: signup
    - name: register
  bindings:
    amqp:
      ack: false
  traits:
    - $ref: '#/components/operationTraits/kafka'
```

--------------------------------

### HTML Table Cells for Project Contributors

Source: https://github.com/asyncapi/spec/blob/master/README.md

This HTML code defines multiple table data cells (`<td>`) within a table row (`<tr>`), each representing a contributor. It includes an image link to the contributor's avatar, a link to their profile, their name, and a series of links/emojis indicating their types of contributions to the project.

```HTML
      <td align="center" valign="top" width="11.11%"><a href="http://antoniogarrote.wordpress.com"><img src="https://avatars1.githubusercontent.com/u/8277?v=4?s=100" width="100px;" alt="Antonio Garrote"/><br /><sub><b>Antonio Garrote</b></sub></a><br /><a href="#ideas-antoniogarrote" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/asyncapi/spec/pulls?q=is%3Apr+reviewed-by%3Aantoniogarrote" title="Reviewed Pull Requests">👀</a> <a href="https://github.com/asyncapi/spec/commits?author=antoniogarrote" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="11.11%"><a href="https://ramses.tech"><img src="https://avatars0.githubusercontent.com/u/9660342?v=4?s=100" width="100px;" alt="Jonathan Stoikovitch"/><br /><sub><b>Jonathan Stoikovitch</b></sub></a><br /><a href="#example-jstoiko" title="Examples">💡</a> <a href="#ideas-jstoiko" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/asyncapi/spec/pulls?q=is%3Apr+reviewed-by%3Ajstoiko" title="Reviewed Pull Requests">👀</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="11.11%"><a href="https://github.com/jonaslagoni"><img src="https://avatars1.githubusercontent.com/u/13396189?v=4?s=100" width="100px;" alt="Jonas Lagoni"/><br /><sub><b>Jonas Lagoni</b></sub></a><br /><a href="https://github.com/asyncapi/spec/issues?q=author%3Ajonaslagoni" title="Bug reports">🐛</a> <a href="https://github.com/asyncapi/spec/commits?author=jonaslagoni" title="Documentation">📖</a> <a href="#ideas-jonaslagoni" title="Ideas, Planning, & Feedback">🤔</a> <a href="#question-jonaslagoni" title="Answering Questions">💬</a> <a href="https://github.com/asyncapi/spec/pulls?q=is%3Apr+reviewed-by%3Ajonaslagoni" title="Reviewed Pull Requests">👀</a> <a href="#example-jonaslagoni" title="Examples">💡</a></td>
      <td align="center" valign="top" width="11.11%"><a href="https://waleedashraf.me/"><img src="https://avatars0.githubusercontent.com/u/8335457?v=4?s=100" width="100px;" alt="Waleed Ashraf"/><br /><sub><b>Waleed Ashraf</b></sub></a><br /><a href="#talk-WaleedAshraf" title="Talks">📢</a> <a href="#ideas-WaleedAshraf" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/asyncapi/spec/commits?author=WaleedAshraf" title="Documentation">📖</a> <a href="#example-WaleedAshraf" title="Examples">💡</a></td>
      <td align="center" valign="top" width="11.11%"><a href="https://github.com/jerzyn"><img src="https://avatars0.githubusercontent.com/u/1447151?v=4?s=100" width="100px;" alt="Andrzej Jarzyna"/><br /><sub><b>Andrzej Jarzyna</b></sub></a><br /><a href="#talk-jerzyn" title="Talks">📢</a></td>
      <td align="center" valign="top" width="11.11%"><a href="https://linkedin.com/in/emmelyn"><img src="https://avatars1.githubusercontent.com/u/4294106?v=4?s=100" width="100px;" alt="Emmelyn Wang"/><br /><sub><b>Emmelyn Wang</b></sub></a><br /><a href="#blog-lifewingmate" title="Blogposts">📝</a> <a href="#ideas-lifewingmate" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/asyncapi/spec/commits?author=lifewingmate" title="Documentation">📖</a> <a href="#talk-lifewingmate" title="Talks">📢</a></td>
      <td align="center" valign="top" width="11.11%"><a href="https://marcd.dev"><img src="https://avatars0.githubusercontent.com/u/1815312?v=4?s=100" width="100px;" alt="Marc DiPasquale"/><br /><sub><b>Marc DiPasquale</b></sub></a><br /><a href="#blog-Mrc0113" title="Blogposts">📝</a> <a href="#talk-Mrc0113" title="Talks">📢</a> <a href="https://github.com/asyncapi/spec/pulls?q=is%3Apr+reviewed-by%3AMrc0113" title="Reviewed Pull Requests">👀</a> <a href="https://github.com/asyncapi/spec/issues?q=author%3AMrc0113" title="Bug reports">🐛</a> <a href="#ideas-Mrc0113" title="Ideas, Planning, & Feedback">🤔</a> <a href="#video-Mrc0113" title="Videos">📹</a></td>
      <td align="center" valign="top" width="11.11%"><a href="http://www.gerald-loeffler.net/"><img src="https://avatars.githubusercontent.com/u/1985716?v=4?s=100" width="100px;" alt="Gerald Loeffler"/><br /><sub><b>Gerald Loeffler</b></sub></a><br /><a href="https://github.com/asyncapi/spec/commits?author=GeraldLoeffler" title="Documentation">📖</a> <a href="https://github.com/asyncapi/spec/issues?q=author%3AGeraldLoeffler" title="Bug reports">🐛</a> <a href="#ideas-GeraldLoeffler" title="Ideas, Planning, & Feedback">🤔</a></td>
      <td align="center" valign="top" width="11.11%"><a href="http://dalelane.co.uk/"><img src="https://avatars.githubusercontent.com/u/1444788?v=4?s=100" width="100px;" alt="Dale Lane"/><br /><sub><b>Dale Lane</b></sub></a><br /><a href="#blog-dalelane" title="Blogposts">📝</a> <a href="#ideas-dalelane" title="Ideas, Planning, & Feedback">🤔</a> <a href="#video-dalelane" title="Videos">📹</a> <a href="#talk-dalelane" title="Talks">📢</a> <a href="#tutorial-dalelane" title="Tutorials">✅</a> <a href="https://github.com/asyncapi/spec/commits?author=dalelane" title="Documentation">📖</a></td>
```

--------------------------------

### Defining Client Credentials OAuth Flow in JSON

Source: https://github.com/asyncapi/spec/blob/master/spec/asyncapi.md

This snippet demonstrates how to define a client credentials OAuth flow object in JSON format. It includes the token URL and available scopes.

```json
{
  "tokenUrl": "https://example.com/api/oauth/token",
  "availableScopes": {
    "write:pets": "modify pets in your account",
    "read:pets": "read your pets"
  }
}
```

--------------------------------

### Defining Implicit OAuth2 Security Scheme in YAML

Source: https://github.com/asyncapi/spec/blob/master/spec/asyncapi.md

This snippet shows how to define an implicit OAuth2 security scheme in YAML format. It includes the authorization URL and available scopes.

```yaml
type: oauth2
flows:
  implicit:
    authorizationUrl: https://example.com/api/oauth/dialog
    availableScopes:
      write:pets: modify pets in your account
      read:pets: read your pets
scopes:
  - 'write:pets'
```

--------------------------------

### Defining Implicit OAuth2 Security Scheme in JSON

Source: https://github.com/asyncapi/spec/blob/master/spec/asyncapi.md

This snippet demonstrates how to define an implicit OAuth2 security scheme in JSON format. It includes the authorization URL and available scopes.

```json
{
  "type": "oauth2",
  "flows": {
    "implicit": {
      "authorizationUrl": "https://example.com/api/oauth/dialog",
      "availableScopes": {
        "write:pets": "modify pets in your account",
        "read:pets": "read your pets"
      }
    }
  },
  "scopes": [
    "write:pets"
  ]
}
```

--------------------------------

### Schema with Boolean Values

Source: https://github.com/asyncapi/spec/blob/master/spec/asyncapi.md

Shows schema using boolean values to define validation patterns.

```json
{
  "type": "object",
  "required": [
    "anySchema"
  ],
  "properties": {
    "anySchema": true,
    "cannotBeDefined": false
  }
}
```

```yaml
type: object
required:
- anySchema
properties:
  anySchema: true
  cannotBeDefined: false
```

--------------------------------

### Defining SASL Security Scheme in JSON

Source: https://github.com/asyncapi/spec/blob/master/spec/asyncapi.md

This snippet demonstrates how to define a SASL security scheme using SCRAM-SHA-512 in JSON format.

```json
{
  "type": "scramSha512"
}
```

--------------------------------

### Defining Messages in AsyncAPI

Source: https://github.com/asyncapi/spec/blob/master/spec/asyncapi.md

Shows how to define messages within a channel in AsyncAPI. Messages are typically referenced from a components section.

```json
{
  "userSignedUp": {
    "$ref": "#/components/messages/userSignedUp"
  },
  "userCompletedOrder": {
    "$ref": "#/components/messages/userCompletedOrder"
  }
}
```

```yaml
userSignedUp:
  $ref: '#/components/messages/userSignedUp'
userCompletedOrder:
  $ref: '#/components/messages/userCompletedOrder'
```

--------------------------------

### Defining Server Object in AsyncAPI Specification (YAML)

Source: https://github.com/asyncapi/spec/blob/master/spec/asyncapi.md

YAML representation of a Server Object that represents a Kafka message broker. It includes required fields like host and protocol, along with the protocol version.

```yaml
host: kafka.in.mycompany.com:9092
description: Production Kafka broker.
protocol: kafka
protocolVersion: '3.2'
```

--------------------------------

### Defining Correlation ID Object in YAML

Source: https://github.com/asyncapi/spec/blob/master/spec/asyncapi.md

This snippet shows how to define a correlation ID object in YAML format. It includes a description and location using a runtime expression.

```yaml
description: Default Correlation ID
location: $message.header#/correlationId
```

--------------------------------

### Defining Correlation ID Object in JSON

Source: https://github.com/asyncapi/spec/blob/master/spec/asyncapi.md

This snippet demonstrates how to define a correlation ID object in JSON format. It includes a description and location using a runtime expression.

```json
{
  "description": "Default Correlation ID",
  "location": "$message.header#/correlationId"
}
```

--------------------------------

### Defining Default Content Type in AsyncAPI

Source: https://github.com/asyncapi/spec/blob/master/spec/asyncapi.md

Demonstrates how to specify the default content type for an AsyncAPI document at the root level. This sets the default content type for all messages in the API.

```json
{
  "defaultContentType": "application/json"
}
```

```yaml
defaultContentType: application/json
```

--------------------------------

### Complex Model Mapping Schema

Source: https://github.com/asyncapi/spec/blob/master/spec/asyncapi.md

Schema definition for object with complex model references as additional properties.

```json
{
  "type": "object",
  "additionalProperties": {
    "$ref": "#/components/schemas/ComplexModel"
  }
}
```

```yaml
type: object
additionalProperties:
  $ref: '#/components/schemas/ComplexModel'
```

=== COMPLETE CONTENT === This response contains all available snippets from this library. No additional content exists. Do not make further requests.