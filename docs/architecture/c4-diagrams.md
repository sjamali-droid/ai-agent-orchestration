# TaskSphere Pro — C4 Architecture Diagrams

> Produced by Software Architect for ISSUE-0010

## C4 Level 1: System Context

```mermaid
graph TB
    User["User\n(Admin/PM/Member/Guest)"]
    TaskSphere["TaskSphere Pro\n(Task Management Platform)"]
    Email["Email Service\n(SendGrid / SES)"]
    S3["S3-Compatible Storage\n(AWS S3 / MinIO)"]

    User -->|"HTTPS"| TaskSphere
    TaskSphere -->|"SMTP/API"| Email
    TaskSphere -->|"S3 API"| S3
```

## C4 Level 2: Container Diagram

```mermaid
graph TB
    subgraph client [Client]
        Frontend["Next.js Frontend\n(Tailwind CSS)\nPort 3000"]
    end

    subgraph gateway [API Layer]
        Dapr["Dapr Sidecar Mesh\n(mTLS, service invocation)"]
    end

    subgraph services [Microservices]
        Auth["auth-service\nExpress.js + TypeScript\nPort 3001"]
        Project["project-service\nExpress.js + TypeScript\nPort 3002"]
        Task["task-service\nExpress.js + TypeScript\nPort 3003"]
        File["file-service\nExpress.js + TypeScript\nPort 3004"]
        Notify["notification-service\nExpress.js + TypeScript\nPort 3005"]
    end

    subgraph data [Data Stores]
        PG_Auth["PostgreSQL\nauth schema"]
        PG_Project["PostgreSQL\nprojects schema"]
        PG_Task["PostgreSQL\ntasks schema"]
        PG_Notify["PostgreSQL\nnotifications schema"]
        Kafka["Apache Kafka\n(Dapr pub/sub)"]
    end

    subgraph external [External]
        S3["S3 / MinIO"]
        Email["Email Provider"]
    end

    Frontend -->|"HTTP/REST"| Dapr
    Dapr --> Auth
    Dapr --> Project
    Dapr --> Task
    Dapr --> File
    Dapr --> Notify

    Auth --> PG_Auth
    Project --> PG_Project
    Task --> PG_Task
    Notify --> PG_Notify

    Task -->|"publish events"| Kafka
    Project -->|"publish events"| Kafka
    Auth -->|"publish events"| Kafka
    Notify -->|"consume events"| Kafka

    File --> S3
    Notify --> Email
```

## C4 Level 3: Component — task-service

```mermaid
graph TB
    subgraph taskService [task-service]
        Router["Express Router"]
        AuthMW["JWT Auth Middleware"]
        RBAC["RBAC Middleware"]
        TaskCtrl["Task Controller"]
        StatusMachine["Status Workflow\nState Machine"]
        CommentCtrl["Comment Controller"]
        AssignCtrl["Assignment Controller"]
        SearchCtrl["Search/Filter Controller"]
        TaskRepo["Task Repository\n(PostgreSQL)"]
        EventPub["Kafka Event Publisher\n(via Dapr pub/sub)"]
    end

    Router --> AuthMW --> RBAC
    RBAC --> TaskCtrl
    RBAC --> CommentCtrl
    RBAC --> AssignCtrl
    RBAC --> SearchCtrl
    TaskCtrl --> StatusMachine
    TaskCtrl --> TaskRepo
    TaskCtrl --> EventPub
    CommentCtrl --> TaskRepo
    CommentCtrl --> EventPub
    AssignCtrl --> TaskRepo
    AssignCtrl --> EventPub
    SearchCtrl --> TaskRepo
```

## Service Communication Map

```mermaid
sequenceDiagram
    participant FE as Frontend
    participant Auth as auth-service
    participant Proj as project-service
    participant Task as task-service
    participant File as file-service
    participant Kafka as Kafka
    participant Notif as notification-service
    participant Email as Email Provider

    FE->>Auth: POST /auth/login
    Auth-->>FE: JWT (access + refresh)

    FE->>Proj: POST /projects (JWT)
    Proj->>Kafka: project.created event

    FE->>Task: POST /projects/:id/tasks (JWT)
    Task->>Kafka: task.created event

    FE->>Task: PATCH /tasks/:id/status (JWT)
    Task->>Kafka: task.status.changed event

    FE->>Task: POST /tasks/:id/assignees (JWT)
    Task->>Kafka: task.assigned event

    FE->>File: POST /tasks/:id/attachments (JWT)
    File-->>FE: presigned upload URL

    Kafka->>Notif: task.assigned event
    Notif->>Notif: store in-app notification
    Notif->>Email: send email (if user preference on)
```
