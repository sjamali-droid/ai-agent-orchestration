# Docker / Docker Compose

> **Used by**: DevSecOps, Developer
> **What to paste**: Dockerfile best practices (multi-stage builds, layer caching), docker-compose.yml service/volume/network syntax, healthchecks, build args.
> **Source**: https://docs.docker.com/

<!-- PASTE CONTEXT BELOW THIS LINE -->


# Docker Documentation

Docker is an open platform for developing, shipping, and running applications in isolated environments called containers. It enables developers to separate applications from infrastructure, delivering software quickly by packaging applications with all dependencies into portable, lightweight containers that can run anywhere. Docker uses a client-server architecture where the Docker client communicates with the Docker daemon via a RESTful API, managing images, containers, networks, and volumes across local machines, data centers, or cloud providers.

This repository contains the official Docker documentation source for docs.docker.com, built with Hugo. It covers Docker Desktop, Docker Engine, Docker Compose, Docker Hub, Docker Scout, and the complete Docker ecosystem. The documentation includes getting started guides, product manuals, API references, CLI references, and the Compose file specification, providing comprehensive resources for containerizing applications from development through production deployment.

## Docker Engine Installation on Ubuntu

Install Docker Engine on Ubuntu using the official apt repository for the latest stable version with automatic updates.

```bash
# Set up Docker's official GPG key and repository
sudo apt update
sudo apt install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Add the repository to apt sources
sudo tee /etc/apt/sources.list.d/docker.sources <<EOF
Types: deb
URIs: https://download.docker.com/linux/ubuntu
Suites: $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}")
Components: stable
Architectures: $(dpkg --print-architecture)
Signed-By: /etc/apt/keyrings/docker.asc
EOF

sudo apt update

# Install Docker packages
sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Verify installation
sudo docker run hello-world
```

## Docker Run Command

Create and run a new container from an image with full control over networking, storage, environment, and resource constraints.

```console
# Run an interactive Ubuntu container
$ docker run -i -t ubuntu /bin/bash

# Run a detached nginx container with port mapping
$ docker run -d -p 8080:80 --name webserver nginx

# Run with environment variables and volume mount
$ docker run -d \
  --name myapp \
  -e DATABASE_URL=postgres://db:5432/app \
  -v /host/data:/container/data \
  -p 3000:3000 \
  myapp:latest

# Run with resource constraints
$ docker run -d \
  --memory="512m" \
  --cpus="1.5" \
  --restart=unless-stopped \
  myapp:latest

# Run with custom network
$ docker run -d --network mynetwork --name api api:v2
```

## Docker Build Command

Build a Docker image from a Dockerfile in the specified build context directory.

```console
# Build image from current directory
$ docker build -t myapp:latest .

# Build with specific Dockerfile
$ docker build -f Dockerfile.production -t myapp:prod .

# Build with build arguments
$ docker build --build-arg VERSION=1.2.3 -t myapp:1.2.3 .

# Multi-platform build
$ docker buildx build --platform linux/amd64,linux/arm64 -t myapp:latest --push .
```

## Docker Compose File Specification

Define multi-container applications with services, networks, volumes, and dependencies in a declarative YAML configuration.

```yaml
# compose.yaml - Complete application stack
services:
  web:
    build: .
    ports:
      - "8000:5000"
    environment:
      - REDIS_HOST=redis
      - REDIS_PORT=6379
    depends_on:
      redis:
        condition: service_healthy
    develop:
      watch:
        - action: sync+restart
          path: .
          target: /code
        - action: rebuild
          path: requirements.txt

  redis:
    image: redis:alpine
    volumes:
      - redis-data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 3s
      retries: 5
      start_period: 10s

volumes:
  redis-data:
```

## Docker Compose Commands

Manage multi-container applications defined in compose.yaml with lifecycle commands for building, starting, and monitoring services.

```console
# Start all services in detached mode
$ docker compose up -d

# Start with live code sync (Compose Watch)
$ docker compose up --watch

# View resolved configuration with variable substitution
$ docker compose config

# Stream logs from all services
$ docker compose logs -f

# Stream logs from specific service
$ docker compose logs -f web

# Execute command in running container
$ docker compose exec web env | grep REDIS
$ docker compose exec redis redis-cli GET hits

# Stop and remove containers
$ docker compose down

# Stop and remove containers with volumes
$ docker compose down -v

# Build or rebuild services
$ docker compose build

# List running containers
$ docker compose ps
```

## Docker Engine API - Run a Container

The Docker Engine API is a RESTful API for programmatic container management, accessible via HTTP client, Go SDK, or Python SDK.

```go
// Go SDK - Run a container
package main

import (
	"context"
	"io"
	"log"
	"os"

	"github.com/moby/moby/api/pkg/stdcopy"
	"github.com/moby/moby/api/types/container"
	"github.com/moby/moby/client"
)

func main() {
	ctx := context.Background()
	apiClient, err := client.New(client.FromEnv, client.WithUserAgent("my-application/1.0.0"))
	if err != nil {
		log.Fatal(err)
	}
	defer apiClient.Close()

	reader, err := apiClient.ImagePull(ctx, "docker.io/library/alpine", client.ImagePullOptions{})
	if err != nil {
		log.Fatal(err)
	}
	defer reader.Close()
	io.Copy(os.Stdout, reader)

	resp, err := apiClient.ContainerCreate(ctx, client.ContainerCreateOptions{
		Config: &container.Config{
			Cmd: []string{"echo", "hello world"},
			Tty: false,
		},
		Image: "alpine",
	})
	if err != nil {
		log.Fatal(err)
	}

	if _, err := apiClient.ContainerStart(ctx, resp.ID, client.ContainerStartOptions{}); err != nil {
		log.Fatal(err)
	}

	wait := apiClient.ContainerWait(ctx, resp.ID, client.ContainerWaitOptions{})
	select {
	case err := <-wait.Error:
		if err != nil {
			log.Fatal(err)
		}
	case <-wait.Result:
	}

	out, err := apiClient.ContainerLogs(ctx, resp.ID, client.ContainerLogsOptions{ShowStdout: true})
	if err != nil {
		log.Fatal(err)
	}
	stdcopy.StdCopy(os.Stdout, os.Stderr, out)
}
```

```python
# Python SDK - Run a container
import docker
client = docker.from_env()
print(client.containers.run("alpine", ["echo", "hello", "world"]))
```

```console
# HTTP API via curl
$ curl --unix-socket /var/run/docker.sock -H "Content-Type: application/json" \
  -d '{"Image": "alpine", "Cmd": ["echo", "hello world"]}' \
  -X POST http://localhost/v1.54/containers/create
{"Id":"1c6594faf5","Warnings":null}

$ curl --unix-socket /var/run/docker.sock -X POST http://localhost/v1.54/containers/1c6594faf5/start

$ curl --unix-socket /var/run/docker.sock -X POST http://localhost/v1.54/containers/1c6594faf5/wait
{"StatusCode":0}

$ curl --unix-socket /var/run/docker.sock "http://localhost/v1.54/containers/1c6594faf5/logs?stdout=1"
hello world
```

## Docker Engine API - List and Manage Containers

List running containers and perform operations like stopping, removing, or inspecting container state.

```go
// Go SDK - List containers
package main

import (
	"context"
	"fmt"
	"log"

	"github.com/moby/moby/client"
)

func main() {
	ctx := context.Background()
	apiClient, err := client.New(client.FromEnv, client.WithUserAgent("my-application/1.0.0"))
	if err != nil {
		log.Fatal(err)
	}
	defer apiClient.Close()

	containers, err := apiClient.ContainerList(ctx, client.ContainerListOptions{})
	if err != nil {
		log.Fatal(err)
	}

	for _, container := range containers.Items {
		fmt.Println(container.ID)
	}
}
```

```python
# Python SDK - List and stop containers
import docker
client = docker.from_env()

# List containers
for container in client.containers.list():
    print(container.id)

# Stop a container
container = client.containers.get('container_id')
container.stop()

# Get container logs
print(container.logs())
```

```console
# HTTP API - List containers
$ curl --unix-socket /var/run/docker.sock http://localhost/v1.54/containers/json
[{
  "Id":"ae63e8b89a26f01f6b4b2c9a7817c31a1b6196acf560f66586fbc8809ffcd772",
  "Names":["/tender_wing"],
  "Image":"nginx",
  ...
}]

# Stop a container
$ curl --unix-socket /var/run/docker.sock \
  -X POST http://localhost/v1.54/containers/ae63e8b89a26/stop
```

## Docker Engine API - Image Operations

Pull, list, and manage Docker images through the API with optional authentication for private registries.

```go
// Go SDK - Pull an image with authentication
package main

import (
	"context"
	"io"
	"log"
	"os"

	"github.com/moby/moby/api/pkg/authconfig"
	"github.com/moby/moby/api/types/registry"
	"github.com/moby/moby/client"
)

func main() {
	ctx := context.Background()
	apiClient, err := client.New(client.FromEnv, client.WithUserAgent("my-application/1.0.0"))
	if err != nil {
		log.Fatal(err)
	}
	defer apiClient.Close()

	authStr, err := authconfig.Encode(registry.AuthConfig{
		Username: "username",
		Password: "password",
	})
	if err != nil {
		log.Fatal(err)
	}

	out, err := apiClient.ImagePull(ctx, "alpine", client.ImagePullOptions{RegistryAuth: authStr})
	if err != nil {
		log.Fatal(err)
	}
	defer out.Close()
	io.Copy(os.Stdout, out)
}
```

```python
# Python SDK - Image operations
import docker
client = docker.from_env()

# Pull an image
image = client.images.pull("alpine")
print(image.id)

# List images
for image in client.images.list():
    print(image.id)
```

```console
# HTTP API - Pull and list images
$ curl --unix-socket /var/run/docker.sock \
  -X POST "http://localhost/v1.54/images/create?fromImage=alpine"

$ curl --unix-socket /var/run/docker.sock http://localhost/v1.54/images/json
```

## Docker Compose Service Configuration

Configure services with health checks, resource limits, restart policies, and dependency ordering.

```yaml
services:
  api:
    image: myapi:latest
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
      DATABASE_URL: postgres://db:5432/mydb
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
        reservations:
          cpus: '0.25'
          memory: 256M
    restart: unless-stopped
    depends_on:
      db:
        condition: service_healthy

  db:
    image: postgres:16
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: mydb
    volumes:
      - db-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U user -d mydb"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  db-data:
```

## Docker Compose Multi-File Configuration

Split complex applications into modular Compose files using the include directive for better organization and reusability.

```yaml
# compose.yaml - Main application
include:
  - path: ./infra.yaml

services:
  web:
    build: .
    ports:
      - "${APP_PORT}:5000"
    environment:
      - REDIS_HOST=${REDIS_HOST}
      - REDIS_PORT=${REDIS_PORT}
    depends_on:
      redis:
        condition: service_healthy
```

```yaml
# infra.yaml - Infrastructure services
services:
  redis:
    image: redis:alpine
    volumes:
      - redis-data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 3s
      retries: 5
      start_period: 10s

volumes:
  redis-data:
```

```text
# .env - Environment configuration
APP_PORT=8000
REDIS_HOST=redis
REDIS_PORT=6379
```

## Docker Container Networking

Configure container networking with custom networks, DNS, and service discovery for multi-container applications.

```yaml
# compose.yaml with custom network configuration
services:
  frontend:
    image: nginx
    networks:
      - frontend-net
    ports:
      - "80:80"

  api:
    image: myapi:latest
    networks:
      - frontend-net
      - backend-net

  db:
    image: postgres:16
    networks:
      - backend-net
    volumes:
      - db-data:/var/lib/postgresql/data

networks:
  frontend-net:
    driver: bridge
  backend-net:
    driver: bridge
    internal: true

volumes:
  db-data:
```

```console
# Create and manage networks via CLI
$ docker network create mynetwork
$ docker network ls
$ docker network inspect mynetwork
$ docker run -d --network mynetwork --name container1 nginx
$ docker network connect mynetwork container2
```

## Docker Volume Management

Persist data using named volumes and bind mounts for databases, configuration files, and application data.

```yaml
services:
  db:
    image: postgres:16
    volumes:
      # Named volume for data persistence
      - db-data:/var/lib/postgresql/data
      # Bind mount for configuration
      - type: bind
        source: ./postgres.conf
        target: /etc/postgresql/postgresql.conf
        read_only: true
      # Bind mount for initialization scripts
      - ./init-scripts:/docker-entrypoint-initdb.d

  app:
    image: myapp:latest
    volumes:
      # Named volume shared between containers
      - shared-data:/app/uploads
      # tmpfs for temporary files
      - type: tmpfs
        target: /app/tmp
        tmpfs:
          size: 100m

volumes:
  db-data:
    driver: local
  shared-data:
```

```console
# Volume management commands
$ docker volume create myvolume
$ docker volume ls
$ docker volume inspect myvolume
$ docker volume rm myvolume
$ docker volume prune  # Remove unused volumes
```

## Local Development Setup

Set up the Docker documentation repository locally for development and testing using Docker Compose.

```console
# Clone and set up the repository
$ git clone https://github.com/docker/docs
$ cd docs

# Start local development server with hot reload
$ docker compose watch

# The site is served at http://localhost:1313

# Run validation tests before submitting changes
$ docker buildx bake validate

# Stop the development server
$ docker compose down
```

## Hugo Front Matter for Documentation Pages

Configure documentation pages with required and optional front matter fields for titles, descriptions, navigation, and SEO.

```yaml
---
title: Install Docker Engine on Ubuntu
linkTitle: Ubuntu
description: Instructions for installing Docker Engine on Ubuntu
keywords: docker, install, ubuntu, linux, engine
weight: 10
aliases:
  - /engine/installation/linux/ubuntu/
  - /install/linux/ubuntu/
toc_max: 4
params:
  sidebar:
    badge:
      color: blue
      text: Beta
---
```

## Hugo Shortcodes for Documentation

Use built-in shortcodes for tabs, accordions, callouts, and other interactive documentation components.

```markdown
<!-- Platform-specific tabs -->
{{</* tabs */>}}
{{</* tab name="Linux" */>}}
```console
$ docker run hello-world
```
{{</* /tab */>}}
{{</* tab name="macOS" */>}}
```console
$ docker run hello-world
```
{{</* /tab */>}}
{{</* tab name="Windows" */>}}
```powershell
docker run hello-world
```
{{</* /tab */>}}
{{</* /tabs */>}}

<!-- Synchronized tab groups -->
{{</* tabs group="os" */>}}
{{</* tab name="Linux" */>}}
Linux-specific content
{{</* /tab */>}}
{{</* /tabs */>}}

<!-- Collapsible content -->
{{</* accordion title="Advanced configuration" */>}}
Configuration details here
{{</* /accordion */>}}

<!-- Reusable content includes -->
{{</* include "install-prerequisites.md" */>}}

<!-- Badges for feature status -->
{{</* badge color=blue text="Beta" */>}}
{{</* badge color=violet text="Experimental" */>}}
{{</* badge color=green text="New" */>}}

<!-- Callouts for important information -->
> [!NOTE]
> Helpful context for users.

> [!WARNING]
> Potential issues or consequences.

> [!IMPORTANT]
> Critical information users must understand.
```

Docker documentation serves as the comprehensive resource for containerizing applications across all stages of development. The documentation covers installation on multiple platforms (Ubuntu, Debian, Fedora, CentOS, macOS, Windows), Docker Compose for multi-container orchestration, the Docker Engine API for programmatic container management, and Docker Desktop for local development environments. Primary use cases include local development with hot reload using Compose Watch, CI/CD pipelines with automated image building and testing, microservices deployment with health checks and service discovery, and production deployments with resource constraints and monitoring.

Integration patterns in Docker documentation emphasize declarative configuration through compose.yaml files, API-driven automation using the REST API or SDKs (Go, Python), and modular application architecture with multi-file Compose configurations. The documentation supports both imperative CLI workflows for quick operations and declarative Infrastructure-as-Code approaches for reproducible environments. Whether building a single-container application or a complex microservices architecture, the documentation provides complete examples with proper error handling, health checks, volume persistence, and networking configuration.
