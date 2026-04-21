# Trivy (Container Security Scanner)

> **Used by**: DevSecOps
> **What to paste**: CLI usage (image scan, fs scan, config scan), severity levels, .trivyignore format, CI integration patterns, SBOM output.
> **Source**: https://aquasecurity.github.io/trivy/

<!-- PASTE CONTEXT BELOW THIS LINE -->


# Trivy Security Scanner

Trivy is a comprehensive and versatile security scanner developed by Aqua Security. It provides automated vulnerability scanning, misconfiguration detection, secret scanning, and license compliance checking across multiple targets including container images, filesystems, git repositories, virtual machine images, and Kubernetes clusters. Trivy detects known vulnerabilities (CVEs) in OS packages and language-specific dependencies, identifies exposed secrets like API keys and passwords, and finds Infrastructure as Code (IaC) misconfigurations in Terraform, CloudFormation, Kubernetes manifests, Dockerfiles, and Helm charts.

The scanner supports most popular programming languages (Python, Node.js, Java, Go, Ruby, Rust, PHP, .NET, and more) and operating systems (Alpine, Debian, Ubuntu, RHEL/CentOS, Amazon Linux, etc.). Trivy automatically fetches and maintains vulnerability databases, making it easy to integrate into CI/CD pipelines and DevSecOps workflows. It outputs results in multiple formats including table, JSON, SARIF, CycloneDX SBOM, and SPDX SBOM for integration with various security tools and platforms.

## Container Image Scanning

Scan container images from Docker, containerd, Podman, or container registries for vulnerabilities, secrets, and misconfigurations. Trivy automatically detects the OS and installed packages, then matches them against vulnerability databases.

```bash
# Basic image scan (vulnerability and secret scanning enabled by default)
trivy image python:3.4-alpine

# Scan with specific scanners enabled
trivy image --scanners vuln,secret,misconfig alpine:3.15

# Scan only for vulnerabilities
trivy image --scanners vuln nginx:latest

# Scan and filter by severity
trivy image --severity HIGH,CRITICAL python:3.9

# Scan image from tar file
docker save ruby:3.1-alpine -o ruby-3.1.tar
trivy image --input ruby-3.1.tar

# Scan image for specific platform
trivy image --platform linux/arm64 alpine:3.16.1

# Scan image config for misconfigurations (Dockerfile best practices)
trivy image --image-config-scanners misconfig alpine:3.17

# Scan image config for secrets in environment variables
trivy image --image-config-scanners secret myapp:latest

# Limit image size to prevent scanning oversized images
trivy image --max-image-size=10GB myapp:latest

# Output JSON format
trivy image --format json --output results.json alpine:latest

# Ignore unfixed vulnerabilities
trivy image --ignore-unfixed debian:11
```

## Filesystem Scanning

Scan local project directories for vulnerabilities in dependencies, misconfigurations in IaC files, and exposed secrets. Trivy detects lock files like package-lock.json, Gemfile.lock, and requirements.txt to identify vulnerable packages.

```bash
# Basic filesystem scan
trivy fs /path/to/project

# Scan single file
trivy fs ~/src/myproject/Pipfile.lock

# Enable all scanners
trivy fs --scanners vuln,misconfig,secret /path/to/project

# Scan for misconfigurations only
trivy fs --scanners misconfig /path/to/terraform/

# Scan with severity filter
trivy fs --severity HIGH,CRITICAL /path/to/project

# Enable license scanning
trivy fs --scanners license /path/to/project

# Show dependency tree for vulnerability origins
trivy fs --dependency-tree --severity HIGH,CRITICAL /path/to/node_project

# Skip specific directories
trivy fs --skip-dirs node_modules,vendor /path/to/project

# Use cache for git repositories
trivy fs --cache-backend fs /path/to/git/repo

# Output in JSON format
trivy fs --format json --output results.json /path/to/project
```

## Git Repository Scanning

Scan local or remote git repositories for vulnerabilities, secrets, misconfigurations, and license issues. Supports private repositories with GitHub and GitLab authentication tokens.

```bash
# Scan local repository
trivy repo ./

# Scan single file in repository
trivy repo ./myproject/Pipfile.lock

# Scan remote repository
trivy repo https://github.com/aquasecurity/trivy-ci-test

# Scan specific branch
trivy repo --branch develop https://github.com/org/repo

# Scan up to specific commit
trivy repo --commit abc123def https://github.com/org/repo

# Scan specific tag
trivy repo --tag v1.0.0 https://github.com/org/repo

# Scan private GitHub repository
export GITHUB_TOKEN="your_private_github_token"
trivy repo https://github.com/org/private-repo

# Scan private GitLab repository
export GITLAB_TOKEN="your_private_gitlab_token"
trivy repo https://gitlab.com/org/private-repo

# Enable misconfiguration scanning
trivy repo --scanners misconfig https://github.com/org/repo

# Output JSON with git metadata
trivy repo --format json https://github.com/org/repo
```

## Kubernetes Cluster Scanning

Scan Kubernetes clusters for vulnerabilities in container images, misconfigurations in resource definitions, and exposed secrets. Supports compliance scanning against CIS benchmarks and Pod Security Standards.

```bash
# Scan cluster with summary report
trivy k8s --report summary

# Scan cluster with detailed report
trivy k8s --report all

# Use specific kubeconfig
trivy k8s --kubeconfig ~/.kube/config2

# Filter by severity
trivy k8s --severity CRITICAL --report all

# Scan specific scanners only
trivy k8s --scanners secret --report summary
trivy k8s --scanners misconfig --report summary
trivy k8s --scanners vuln --report all

# Exclude specific resource kinds
trivy k8s --report summary --exclude-kinds node,pod

# Exclude specific namespaces
trivy k8s --report summary --exclude-namespaces dev-system,staging-system

# Skip image scanning (only scan resource definitions)
trivy k8s --report summary --skip-images

# Disable node collector
trivy k8s --report summary --disable-node-collector

# Add tolerations for tainted nodes
trivy k8s --report summary --tolerations key1=value1:NoExecute

# Exclude nodes by label
trivy k8s --report summary --exclude-nodes kubernetes.io/arch:arm64

# CIS Kubernetes benchmark compliance
trivy k8s --compliance k8s-cis-1.23 --report all

# Pod Security Standards compliance
trivy k8s --compliance k8s-pss-baseline --report summary

# NSA/CISA Kubernetes Hardening
trivy k8s --compliance k8s-nsa-1.0 --report summary

# Output JSON format
trivy k8s --format json -o results.json cluster

# Generate KBOM (Kubernetes Bill of Materials)
trivy k8s --format cyclonedx --output mykbom.cdx.json
```

## Infrastructure as Code (IaC) Scanning

Scan IaC configurations for misconfigurations and security issues. Trivy automatically detects config types including Terraform, CloudFormation, Kubernetes YAML, Helm charts, and Dockerfiles.

```bash
# Scan IaC directory
trivy config /path/to/iac/

# Scan with severity filter
trivy config --severity HIGH,CRITICAL ./iac

# Scan Dockerfile
trivy config ./build/Dockerfile

# Scan Terraform files
trivy config ./terraform/

# Scan Kubernetes manifests
trivy config ./k8s/

# Scan Helm chart
trivy config ./charts/myapp/

# Scan mixed IaC directory (auto-detects types)
trivy config ./infrastructure/

# Enable via other subcommands
trivy image --scanners misconfig myimage:latest
trivy fs --scanners misconfig /path/to/project

# Combined vulnerability and misconfiguration scan
trivy fs --scanners vuln,misconfig,secret --severity HIGH,CRITICAL myapp/

# Use custom checks
trivy config --config-check /path/to/custom-checks ./iac

# Raw Terraform scanning with custom checks
trivy config main.tf \
  --check-namespaces user \
  --config-check ./custom-checks.rego \
  --misconfig-scanners terraform \
  --raw-config-scanners terraform
```

## Secret Scanning

Detect exposed secrets like API keys, passwords, tokens, and private keys in files. Secret scanning is enabled by default and uses built-in rules for AWS, GCP, GitHub, GitLab, Slack, and many more.

```bash
# Secret scanning is enabled by default
trivy image myimage:1.0.0
trivy fs /path/to/project
trivy repo https://github.com/org/repo

# Disable secret scanning
trivy image --scanners vuln alpine:3.15

# Skip specific directories for faster scanning
trivy fs --skip-dirs logs,tmp,node_modules /path/to/project

# Skip specific files
trivy fs --skip-files config.sample.json /path/to/project

# Use custom secret config
trivy fs --secret-config ./trivy-secret.yaml /path/to/project
```

Custom secret configuration file (`trivy-secret.yaml`):

```yaml
# Custom secret scanning rules
rules:
  - id: custom-api-key
    category: general
    title: Custom API Key
    severity: HIGH
    regex: (?i)(?P<key>(custom_api_key))(=|:).{0,5}['"](?P<secret>[0-9a-zA-Z\-_=]{8,64})['"]
    keywords:
      - custom_api_key

# Global allow rules to reduce false positives
allow-rules:
  - id: test-data
    description: skip test data files
    path: .*test.*

# Enable only specific built-in rules
enable-builtin-rules:
  - aws-access-key-id
  - aws-secret-access-key
  - github-pat

# Disable specific rules
disable-rules:
  - slack-access-token
  - slack-web-hook

# Disable allow rules (e.g., to scan markdown files)
disable-allow-rules:
  - markdown
```

## SBOM Generation and Scanning

Generate Software Bill of Materials (SBOM) in CycloneDX or SPDX formats. Trivy can also scan existing SBOMs for vulnerabilities.

```bash
# Generate CycloneDX SBOM
trivy image --format cyclonedx --output result.cdx.json alpine:3.15

# Generate CycloneDX SBOM with vulnerabilities
trivy image --scanners vuln --format cyclonedx --output result.cdx.json alpine:3.15

# Generate SPDX SBOM (tag-value format)
trivy image --format spdx --output result.spdx alpine:3.15

# Generate SPDX SBOM (JSON format)
trivy image --format spdx-json --output result.spdx.json alpine:3.15

# Generate SBOM for filesystem
trivy fs --format cyclonedx --output result.cdx.json /app/myproject

# Scan existing SBOM for vulnerabilities
trivy sbom result.cdx.json
trivy sbom result.spdx.json

# Generate Kubernetes BOM (KBOM)
trivy k8s --format cyclonedx --output kbom.cdx.json

# Scan KBOM for vulnerabilities
trivy sbom kbom.cdx.json

# Use SBOM from OCI registry for faster scanning
trivy image --sbom-sources oci ghcr.io/org/image:latest
```

## Output Formats and Reporting

Trivy supports multiple output formats for integration with various tools and platforms.

```bash
# Table format (default)
trivy image alpine:latest

# JSON format
trivy image --format json --output results.json alpine:latest

# SARIF format (for GitHub Code Scanning, SonarQube)
trivy image --format sarif --output report.sarif golang:1.12-alpine

# GitHub dependency snapshot
trivy image --format github --output report.gsbom alpine

# JUnit XML template
trivy image --format template --template "@contrib/junit.tpl" -o junit-report.xml golang:1.12-alpine

# HTML report
trivy image --format template --template "@contrib/html.tpl" -o report.html golang:1.12-alpine

# Custom template
trivy image --format template --template "{{ range . }} {{ .Target }} {{ end }}" golang:1.12-alpine

# Load template from file
trivy image --format template --template "@/path/to/template.tpl" alpine:latest

# Convert JSON to other formats
trivy image --format json -o result.json debian:11
trivy convert --format cyclonedx --output result.cdx result.json
trivy convert --format table --severity CRITICAL result.json

# Show dependency tree in table output
trivy fs --dependency-tree --severity HIGH,CRITICAL /path/to/project
```

## Filtering and Ignoring Vulnerabilities

Control which vulnerabilities are reported using severity filters, ignore files, and VEX documents.

```bash
# Filter by severity
trivy image --severity CRITICAL alpine:latest
trivy image --severity HIGH,CRITICAL debian:11

# Ignore unfixed vulnerabilities
trivy image --ignore-unfixed debian:11

# Use .trivyignore file
echo "CVE-2021-44228" > .trivyignore
trivy image myimage:latest

# Ignore by ID in .trivyignore
cat > .trivyignore << EOF
# Ignored CVEs
CVE-2021-44228
CVE-2022-22965

# Ignore specific package
pkg:npm/lodash@4.17.20
EOF

# Filter by package types
trivy image --pkg-types os ruby:2.4.0
trivy image --pkg-types library python:3.9

# Filter by package relationships
trivy repo --pkg-relationships root,direct /path/to/project

# Detection priority (precise vs comprehensive)
trivy image --detection-priority precise alpine:3.15
trivy image --detection-priority comprehensive alpine:3.15
```

## Docker and Container Runtime Integration

Use Trivy as a Docker container for scanning without installation.

```bash
# Run Trivy as Docker container
docker run -v /var/run/docker.sock:/var/run/docker.sock \
  -v $HOME/.cache:/root/.cache/ \
  aquasec/trivy:latest image python:3.4-alpine

# Scan local image with Docker socket
docker run -v /var/run/docker.sock:/var/run/docker.sock \
  aquasec/trivy:latest image mylocal:image

# Scan filesystem with volume mount
docker run -v /path/to/project:/project \
  aquasec/trivy:latest fs /project

# Use custom cache directory
docker run -v /var/run/docker.sock:/var/run/docker.sock \
  -v /my/cache:/root/.cache/ \
  aquasec/trivy:latest image alpine:latest

# Configure Docker daemon socket
trivy image --docker-host tcp://127.0.0.1:2375 myimage:latest

# Configure Podman socket
trivy image --podman-host /run/user/1000/podman/podman.sock myimage:latest

# Specify image source priority
trivy image --image-src podman,containerd alpine:3.7.3
```

## CI/CD Integration Examples

Integrate Trivy into continuous integration pipelines for automated security scanning.

```bash
# Exit with error on HIGH/CRITICAL vulnerabilities
trivy image --exit-code 1 --severity HIGH,CRITICAL myapp:latest

# GitHub Actions compatible output
trivy image --format sarif --output trivy-results.sarif myapp:latest

# GitLab CI compatible output
trivy image --format template --template "@contrib/gitlab.tpl" myapp:latest

# GitLab Code Quality report
trivy image --format template --template "@contrib/gitlab-codequality.tpl" myapp:latest

# AWS Security Hub (ASFF format)
trivy image --format template --template "@contrib/asff.tpl" myapp:latest

# Fail if vulnerabilities found (for CI gates)
trivy image --exit-code 1 --ignore-unfixed --severity CRITICAL myapp:latest

# Cache database for faster CI runs
trivy image --cache-dir /ci-cache/.trivy myapp:latest

# Skip database update (use cached)
trivy image --skip-db-update myapp:latest

# Download database only
trivy image --download-db-only
```

## Summary

Trivy serves as a comprehensive security solution for modern DevSecOps workflows, enabling teams to detect vulnerabilities, misconfigurations, secrets, and license issues across the entire software supply chain. Its primary use cases include container image scanning in CI/CD pipelines to catch vulnerabilities before deployment, Infrastructure as Code validation to ensure secure cloud configurations, and Kubernetes cluster security assessment for runtime protection. The tool integrates seamlessly with popular platforms like GitHub Actions, GitLab CI, Jenkins, and various container registries.

Common integration patterns include embedding Trivy scans in Docker build pipelines with exit codes to gate deployments, generating SBOM documents for software supply chain transparency, producing SARIF reports for GitHub Security tab integration, and running compliance checks against CIS benchmarks for regulatory requirements. Organizations typically configure Trivy with severity thresholds to focus on critical issues, use .trivyignore files to manage false positives, and leverage the JSON output format for custom processing and dashboarding. For Kubernetes environments, the Trivy Operator provides continuous scanning capabilities, while the standalone CLI serves well for one-time assessments and CI/CD integration.
