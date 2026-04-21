# GitHub Actions

> **Used by**: DevSecOps
> **What to paste**: workflow syntax (on, jobs, steps), reusable workflows, matrix strategy, secrets/env usage, common actions (checkout, setup-node, docker/build-push-action), caching.
> **Source**: https://docs.github.com/en/actions

<!-- PASTE CONTEXT BELOW THIS LINE -->


### Install Go Dependencies with go get

Source: https://docs.github.com/en/actions/tutorials/build-and-test-code/go

Demonstrates how to install Go project dependencies using the go get command in a GitHub Actions workflow. Includes checking out code, setting up Go 1.21.x, and installing dependencies from the current module and external packages with specific versions.

```YAML
    steps:
      - uses: actions/checkout@v5
      - name: Setup Go
        uses: actions/setup-go@v5
        with:
          go-version: '1.21.x'
      - name: Install dependencies
        run: |
          go get .
          go get example.com/octo-examplemodule
          go get example.com/octo-examplemodule@v1.3.4
```

--------------------------------

### Install dependencies using npm in GitHub Actions

Source: https://docs.github.com/en/actions/tutorials/build-and-test-code/nodejs

Demonstrates how to install Node.js dependencies using either 'npm ci' for clean, automated environments or 'npm install' for standard installations. Both examples use the actions/setup-node action to specify the Node.js version.

```yaml
steps:
- uses: actions/checkout@v5
- name: Use Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '20.x'
- name: Install dependencies
  run: npm ci
```

```yaml
steps:
- uses: actions/checkout@v5
- name: Use Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '20.x'
- name: Install dependencies
  run: npm install
```

--------------------------------

### Setup Node.js with actions/setup-node

Source: https://docs.github.com/en/actions/tutorials/creating-an-example-workflow

Install a specific version of Node.js and add both `node` and `npm` commands to the runner's PATH. Use the `with` keyword to specify the Node.js version.

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: '20'
```

--------------------------------

### Setup Specific Go Version in GitHub Actions

Source: https://docs.github.com/en/actions/tutorials/build-and-test-code/go

Configures a GitHub Actions job to use a specific Go version using semantic versioning syntax. This example uses Go 1.21.x to automatically get the latest patch release. The setup-go action manages version installation and PATH configuration.

```YAML
      - name: Setup Go 1.21.x
        uses: actions/setup-go@v5
        with:
          # Semantic version range syntax or exact version of Go
          go-version: '1.21.x'
```

--------------------------------

### Configure Ruby Setup with GitHub Actions Workflow

Source: https://docs.github.com/en/actions/tutorials/build-and-test-code/ruby

Sets up a Ruby environment using the ruby/setup-ruby action, installs dependencies with bundle install, and runs rake tasks. The workflow checks out code, configures the specified Ruby version, and executes build commands. Requires a valid Ruby version or .ruby-version file.

```yaml
steps:
- uses: actions/checkout@v5
- uses: ruby/setup-ruby@ec02537da5712d66d4d50a0f33b7eb52773b5ed1
  with:
    ruby-version: '3.1' # Not needed with a .ruby-version file
- run: bundle install
- run: bundle exec rake
```

--------------------------------

### Build and test Node.js applications

Source: https://docs.github.com/en/actions/tutorials/migrate-to-github-actions/manual-migrations/migrate-from-travis-ci

A comparison of Node.js build workflows. The GitHub Actions example includes checking out the repository, setting up the Node.js version, and running install, build, and test scripts.

```yaml
install:
  - npm install
script:
  - npm run build
  - npm test
```

```yaml
name: Node.js CI
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - name: Use Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '16.x'
      - run: npm install
      - run: npm run build
      - run: npm test
```

--------------------------------

### Example kubectl pod status output

Source: https://docs.github.com/en/actions/hosting-your-own-runners/managing-self-hosted-runners-with-actions-runner-controller/quickstart-for-actions-runner-controller

Demonstrates the expected Running status for the controller and listener pods after a successful installation.

```text
NAME                                                   READY   STATUS    RESTARTS   AGE
arc-gha-runner-scale-set-controller-594cdc976f-m7cjs   1/1     Running   0          64s
arc-runner-set-754b578d-listener                       1/1     Running   0          12s
```

--------------------------------

### Start GitHub Actions Self-Hosted Runner Service

Source: https://docs.github.com/en/actions/how-tos/manage-runners/self-hosted-runners/configure-the-application

This snippet provides commands to start the self-hosted runner application service after it has been installed. Commands vary by operating system, using `svc.sh` for Unix-like systems and PowerShell for Windows.

```shell
sudo ./svc.sh start
```

```powershell
Start-Service "actions.runner.*"
```

```shell
./svc.sh start
```

--------------------------------

### Example Dockerfile for Custom Runner Image

Source: https://docs.github.com/en/actions/hosting-your-own-runners/managing-self-hosted-runners-with-actions-runner-controller/about-actions-runner-controller

This Dockerfile sets up a custom runner image. It installs necessary packages, downloads runner binaries and container hooks, and configures user permissions. Ensure you replace placeholder versions with the latest releases.

```docker
FROM mcr.microsoft.com/dotnet/runtime-deps:6.0 as build

# Replace value with the latest runner release version
# source: https://github.com/actions/runner/releases
# ex: 2.303.0
ARG RUNNER_VERSION ""
ARG RUNNER_ARCH="x64"
# Replace value with the latest runner-container-hooks release version
# source: https://github.com/actions/runner-container-hooks/releases
# ex: 0.3.1
ARG RUNNER_CONTAINER_HOOKS_VERSION ""

ENV DEBIAN_FRONTEND=noninteractive
ENV RUNNER_MANUALLY_TRAP_SIG=1
ENV ACTIONS_RUNNER_PRINT_LOG_TO_STDOUT=1

RUN apt update -y && apt install curl unzip -y

RUN adduser --disabled-password --gecos "" --uid 1001 runner \
    && groupadd docker --gid 123 \
    && usermod -aG sudo runner \
    && usermod -aG docker runner \
    && echo "%sudo ALL=(ALL:ALL) NOPASSWD:ALL" > /etc/sudoers \
    && echo "Defaults env_keep += \"DEBIAN_FRONTEND\"" >> /etc/sudoers

WORKDIR /home/runner

RUN curl -f -L -o runner.tar.gz https://github.com/actions/runner/releases/download/v${RUNNER_VERSION}/actions-runner-linux-${RUNNER_ARCH}-${RUNNER_VERSION}.tar.gz \
    && tar xzf ./runner.tar.gz \
    && rm runner.tar.gz

RUN curl -f -L -o runner-container-hooks.zip https://github.com/actions/runner-container-hooks/releases/download/v${RUNNER_CONTAINER_HOOKS_VERSION}/actions-runner-hooks-k8s-${RUNNER_CONTAINER_HOOKS_VERSION}.zip \
    && unzip ./runner-container-hooks.zip -d ./k8s \
    && rm runner-container-hooks.zip

USER runner

```

--------------------------------

### Example journalctl output showing runner startup and job execution

Source: https://docs.github.com/en/actions/hosting-your-own-runners/managing-self-hosted-runners/monitoring-and-troubleshooting-self-hosted-runners

Sample output from journalctl showing a runner starting, connecting to GitHub, receiving a job, and completing execution.

```bash
Feb 11 14:57:07 runner01 runsvc.sh[962]: Starting Runner listener with startup type: service
Feb 11 14:57:07 runner01 runsvc.sh[962]: Started listener process
Feb 11 14:57:07 runner01 runsvc.sh[962]: Started running service
Feb 11 14:57:16 runner01 runsvc.sh[962]: √ Connected to GitHub
Feb 11 14:57:17 runner01 runsvc.sh[962]: 2020-02-11 14:57:17Z: Listening for Jobs
Feb 11 16:06:54 runner01 runsvc.sh[962]: 2020-02-11 16:06:54Z: Running job: testAction
Feb 11 16:07:10 runner01 runsvc.sh[962]: 2020-02-11 16:07:10Z: Job testAction completed with result: Succeeded
```

--------------------------------

### Example README.md for GitHub Action

Source: https://docs.github.com/en/actions/creating-actions/creating-a-docker-container-action

This `README.md` provides essential documentation for the action, including its purpose, inputs, outputs, and an example usage in a workflow.

```Markdown
# Hello world docker action

This action prints "Hello World" or "Hello" + the name of a person to greet to the log.

## Inputs

## `who-to-greet`

**Required** The name of the person to greet. Default `"World"`.

## Outputs

## `time`

The time we greeted you.

## Example usage

uses: actions/hello-world-docker-action@v2
with:
  who-to-greet: 'Mona the Octocat'

```

--------------------------------

### Install Python Dependencies with pip in GitHub Actions

Source: https://docs.github.com/en/actions/tutorials/build-and-test-code/python

Sets up Python 3.x on a GitHub-hosted runner and installs or upgrades pip, setuptools, and wheel packages. This is the foundational step for preparing the environment before installing project dependencies. The workflow uses the setup-python action to configure the Python environment.

```yaml
steps:
- uses: actions/checkout@v5
- name: Set up Python
  uses: actions/setup-python@v5
  with:
    python-version: '3.x'
- name: Install dependencies
  run: python -m pip install --upgrade pip setuptools wheel
```

--------------------------------

### Install self-hosted runner service on Linux

Source: https://docs.github.com/en/actions/hosting-your-own-runners/managing-self-hosted-runners/configuring-the-self-hosted-runner-application-as-a-service

Install the runner service with optional user argument. Run with sudo or as the desired user.

```bash
sudo ./svc.sh install
```

```bash
./svc.sh install USERNAME
```

--------------------------------

### Install npm package globally with run

Source: https://docs.github.com/en/actions/tutorials/creating-an-example-workflow

Execute shell commands on the runner using the `run` keyword. This example installs the `bats` software testing package globally via npm.

```yaml
- run: npm install -g bats
```

--------------------------------

### Build and test Go code in GitHub Actions

Source: https://docs.github.com/en/actions/tutorials/build-and-test-code/go

A complete workflow example that checks out the repository, sets up the Go environment, installs dependencies, and runs build and test commands. It uses standard Go CLI tools like go build and go test.

```yaml
name: Go
on: [push]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v
```

--------------------------------

### Verify GitHub Actions Importer installation and view help

Source: https://docs.github.com/en/actions/tutorials/migrate-to-github-actions/automated-migrations/use-github-actions-importer

Display help information and available commands after installation. Shows all subcommands including update, version, configure, audit, forecast, dry-run, and migrate.

```bash
$ gh actions-importer -h
Options:
  -?, -h, --help  Show help and usage information

Commands:
  update     Update to the latest version of GitHub Actions Importer.
  version    Display the version of GitHub Actions Importer.
  configure  Start an interactive prompt to configure credentials used to authenticate with your CI server(s).
  audit      Plan your CI/CD migration by analyzing your current CI/CD footprint.
  forecast   Forecast GitHub Actions usage from historical pipeline utilization.
  dry-run    Convert a pipeline to a GitHub Actions workflow and output its yaml file.
  migrate    Convert a pipeline to a GitHub Actions workflow and open a pull request with the changes.
```

--------------------------------

### Configure Specific Python Version with Semantic Versioning

Source: https://docs.github.com/en/actions/tutorials/build-and-test-code/python

Sets up a specific Python version in a GitHub Actions workflow using semantic version syntax. This example uses Python 3.x to get the latest minor release, and includes optional architecture specification. The setup-python action handles version resolution and installation on the runner.

```yaml
name: Python package

on: [push]

jobs:
  build:

    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v5
      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.x'
          architecture: 'x64'
      - name: Display Python version
        run: python -c "import sys; print(sys.version)"
```

--------------------------------

### Execute npm Command in GitHub Actions Workflow

Source: https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/add-scripts

Demonstrates how to use the `run` keyword to execute a single npm command on the runner. This example installs the bats testing framework globally, which is a common pattern for setting up dependencies in workflows.

```yaml
jobs:
  example-job:
    runs-on: ubuntu-latest
    steps:
      - run: npm install -g bats
```

--------------------------------

### Install apt package on Ubuntu runner

Source: https://docs.github.com/en/actions/how-tos/manage-runners/github-hosted-runners/customize-runners

GitHub Actions workflow that installs an apt package (jq) on an Ubuntu-latest runner. The example demonstrates best practices by running sudo apt-get update before installation to ensure the package index is current and prevent installation failures.

```yaml
name: Build on Ubuntu
on: push

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Check out repository code
        uses: actions/checkout@v5
      - name: Install jq tool
        run: |
          sudo apt-get update
          sudo apt-get install jq
```

--------------------------------

### Install GitHub Actions Importer CLI extension

Source: https://docs.github.com/en/actions/tutorials/migrate-to-github-actions/automated-migrations/use-github-actions-importer

Install the GitHub Actions Importer extension for GitHub CLI. Required as the first setup step before using any importer commands.

```bash
gh extension install github/gh-actions-importer
```

--------------------------------

### Install GitHub Actions Self-Hosted Runner Service

Source: https://docs.github.com/en/actions/how-tos/manage-runners/self-hosted-runners/configure-the-application

This snippet demonstrates how to install the self-hosted runner application as a system service. On Linux and macOS, it uses the `svc.sh` script. Windows installation is part of the initial configuration process and does not have a separate command here.

```shell
sudo ./svc.sh install
```

```shell
./svc.sh install USERNAME
```

```shell
./svc.sh install
```

--------------------------------

### Install self-hosted runner service on macOS

Source: https://docs.github.com/en/actions/hosting-your-own-runners/managing-self-hosted-runners/configuring-the-self-hosted-runner-application-as-a-service

Install the runner service on macOS systems.

```bash
./svc.sh install
```

--------------------------------

### Start self-hosted runner service on Linux

Source: https://docs.github.com/en/actions/hosting-your-own-runners/managing-self-hosted-runners/configuring-the-self-hosted-runner-application-as-a-service

Start the runner service using svc.sh with sudo privileges.

```bash
sudo ./svc.sh start
```

--------------------------------

### Start self-hosted runner service on macOS

Source: https://docs.github.com/en/actions/hosting-your-own-runners/managing-self-hosted-runners/configuring-the-self-hosted-runner-application-as-a-service

Start the runner service on macOS systems.

```bash
./svc.sh start
```

--------------------------------

### Build and Test Swift Project with GitHub Actions

Source: https://docs.github.com/en/actions/tutorials/build-and-test-code/swift

A GitHub Actions workflow step sequence that initializes the workspace, installs Swift version 5.3.3 using a third-party action, and executes 'swift build' and 'swift test' commands. This setup ensures consistent build environments across CI runs.

```yaml
steps:
  - uses: actions/checkout@v5
  - uses: swift-actions/setup-swift@65540b95f51493d65f5e59e97dcef9629ddf11bf
    with:
      swift-version: "5.3.3"
  - name: Build
    run: swift build
  - name: Run tests
    run: swift test
```

--------------------------------

### Example Repository File Structure for Local Actions

Source: https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax

This snippet illustrates the recommended file structure for a repository containing a workflow and a local action.

```shell
|-- hello-world (repository)
|   |__ .github
|       └── workflows
|           └── my-first-workflow.yml
|       └── actions
|           |__ hello-world-action
|               └── action.yml
```

--------------------------------

### Install self-hosted runner service on Linux

Source: https://docs.github.com/en/actions/how-tos/manage-runners/self-hosted-runners/configure-the-application?platform=mac

Installs the self-hosted runner as a systemd service. Use the optional USERNAME argument to install as a different user.

```bash
sudo ./svc.sh install

```

```bash
./svc.sh install USERNAME

```

--------------------------------

### Configure and Access Service Containers in GitHub Actions

Source: https://docs.github.com/en/actions/automating-your-workflow-with-github-actions/workflow-syntax-for-github-actions

This example demonstrates setting up `nginx` and `redis` service containers. It shows how to map ports and access services via `localhost` using the `job.services` context.

```YAML
services:
  nginx:
    image: nginx
    # Map port 8080 on the Docker host to port 80 on the nginx container
    ports:
      - 8080:80
  redis:
    image: redis
    # Map random free TCP port on Docker host to port 6379 on redis container
    ports:
      - 6379/tcp
steps:
  - run: |
      echo "Redis available on 127.0.0.1:${{ job.services.redis.ports['6379'] }}"
      echo "Nginx available on 127.0.0.1:${{ job.services.nginx.ports['80'] }}"

```

--------------------------------

### Workflow steps for multiline environment variables

Source: https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-commands?tool=bash

Examples using EOF or dynamic GUID delimiters to capture multiline command output like curl responses. This method allows complex strings to be persisted across steps.

```yaml
steps:
  - name: Set the value in bash
    id: step_one
    run: |
      {
        echo 'JSON_RESPONSE<<EOF'
        curl https://example.com
        echo EOF
      } >> "$GITHUB_ENV"

```

```yaml
steps:
  - name: Set the value in bash
    id: step_one
    run: |
      {
        echo 'JSON_RESPONSE<<EOF'
        curl https://example.com
        echo EOF
      } >> "$GITHUB_ENV"

```

```yaml
steps:
  - name: Set the value in pwsh
    id: step_one
    run: |
      $EOF = (New-Guid).Guid
      "JSON_RESPONSE<<$EOF" >> $env:GITHUB_ENV
      (Invoke-WebRequest -Uri "https://example.com").Content >> $env:GITHUB_ENV
      "$EOF" >> $env:GITHUB_ENV
    shell: pwsh

```

```yaml
steps:
  - name: Set the value in pwsh
    id: step_one
    run: |
      $EOF = (New-Guid).Guid
      "JSON_RESPONSE<<$EOF" >> $env:GITHUB_ENV
      (Invoke-WebRequest -Uri "https://example.com").Content >> $env:GITHUB_ENV
      "$EOF" >> $env:GITHUB_ENV
    shell: pwsh

```

--------------------------------

### Install Homebrew packages and casks on macOS runner

Source: https://docs.github.com/en/actions/how-tos/manage-runners/github-hosted-runners/customize-runners

GitHub Actions workflow that installs Homebrew packages and casks on a macOS-latest runner. The example shows installation of GitHub CLI and Microsoft Edge browser, demonstrating both standard package and cask installation methods.

```yaml
name: Build on macOS
on: push

jobs:
  build:
    runs-on: macos-latest
    steps:
      - name: Check out repository code
        uses: actions/checkout@v5
      - name: Install GitHub CLI
        run: |
          brew update
          brew install gh
      - name: Install Microsoft Edge
        run: |
          brew update
          brew install --cask microsoft-edge
```

--------------------------------

### Install Chocolatey package on Windows runner

Source: https://docs.github.com/en/actions/how-tos/manage-runners/github-hosted-runners/customize-runners

GitHub Actions workflow that uses Chocolatey package manager to install software on a Windows-latest runner. The example demonstrates installing GitHub CLI and verifying the installation with a version check command.

```yaml
name: Build on Windows
on: push
jobs:
  build:
    runs-on: windows-latest
    steps:
      - run: choco install gh
      - run: gh version
```

--------------------------------

### Install the self-hosted runner service

Source: https://docs.github.com/en/actions/how-tos/manage-runners/self-hosted-runners/configure-the-application?platform=windows

Registers the runner application as a system service. Run these commands from the directory where the runner is installed.

```shell
sudo ./svc.sh install


```

```shell
./svc.sh install USERNAME


```

```shell
./svc.sh install


```

--------------------------------

### Project Directory Structure Example

Source: https://docs.github.com/en/actions/writing-workflows/choosing-what-your-workflow-does/storing-and-sharing-data-from-a-workflow

A visual representation of a sample project layout containing source, distribution, and test output directories.

```text
|-- hello-world (repository)
|   └── dist
|   └── tests
|   └── src
|       └── sass/app.scss
|       └── app.ts
|   └── output
|       └── test
|

```

--------------------------------

### Install Ruby Dependencies using Bundler in GitHub Actions

Source: https://docs.github.com/en/actions/tutorials/build-and-test-code/ruby

This snippet demonstrates how to install Ruby dependencies using Bundler within a GitHub Actions workflow. It checks out the repository, sets up Ruby version '3.1' using 'ruby/setup-ruby', and then executes 'bundle install' to resolve and install project dependencies. The 'setup-ruby' action automatically handles Bundler installation.

```yaml
# This workflow uses actions that are not certified by GitHub.
# They are provided by a third-party and are governed by
# separate terms of service, privacy policy, and support
# documentation.
steps:
- uses: actions/checkout@v5
- uses: ruby/setup-ruby@ec02537da5712d66d4d50a0f33b7eb52773b5ed1
  with:
    ruby-version: '3.1'
- run: bundle install
```

--------------------------------

### Production Migration Command Output Example

Source: https://docs.github.com/en/actions/tutorials/migrate-to-github-actions/automated-migrations/jenkins-migration

Example output from a successful migrate command execution showing the log file location and the generated pull request URL that contains the converted workflow for review and merging.

```shell
$ gh actions-importer migrate jenkins --target-url https://github.com/octo-org/octo-repo --output-dir tmp/migrate --source-url http://localhost:8080/job/monas_dev_work/job/monas_freestyle
[2022-08-20 22:08:20] Logs: 'tmp/migrate/log/actions-importer-20220916-014033.log'
[2022-08-20 22:08:20] Pull request: 'https://github.com/octo-org/octo-repo/pull/1'
```

--------------------------------

### Example Repository File Structure for Local Actions

Source: https://docs.github.com/en/actions/learn-github-actions/finding-and-customizing-actions

This snippet illustrates the recommended file structure for defining and using a local action within the same repository as your workflow.

```text
|-- hello-world (repository)
|   |__ .github
|       └── workflows
|           └── my-first-workflow.yml
|       └── actions
|           |__ hello-world-action
|               └── action.yml
```

--------------------------------

### Multiline environment variable workflow examples

Source: https://docs.github.com/en/actions/using-workflows/workflow-commands-for-github-actions

Examples of setting multiline variables from command outputs like curl or Invoke-WebRequest. Using a GUID as a delimiter in PowerShell helps avoid collisions with arbitrary content.

```yaml
steps:
  - name: Set the value in bash
    id: step_one
    run: |
      {
        echo 'JSON_RESPONSE<<EOF'
        curl https://example.com
        echo EOF
      } >> "$GITHUB_ENV"


```

```yaml
steps:
  - name: Set the value in bash
    id: step_one
    run: |
      {
        echo 'JSON_RESPONSE<<EOF'
        curl https://example.com
        echo EOF
      } >> "$GITHUB_ENV"


```

```yaml
steps:
  - name: Set the value in pwsh
    id: step_one
    run: |
      $EOF = (New-Guid).Guid
      "JSON_RESPONSE<<$EOF" >> $env:GITHUB_ENV
      (Invoke-WebRequest -Uri "https://example.com").Content >> $env:GITHUB_ENV
      "$EOF" >> $env:GITHUB_ENV
    shell: pwsh


```

```yaml
steps:
  - name: Set the value in pwsh
    id: step_one
    run: |
      $EOF = (New-Guid).Guid
      "JSON_RESPONSE<<$EOF" >> $env:GITHUB_ENV
      (Invoke-WebRequest -Uri "https://example.com").Content >> $env:GITHUB_ENV
      "$EOF" >> $env:GITHUB_ENV
    shell: pwsh


```

--------------------------------

### Feature flags output example

Source: https://docs.github.com/en/actions/migrating-to-github-actions/automated-migrations/supplemental-arguments-and-settings

Sample output showing available feature flags with their status, descriptions, and GitHub Enterprise Server version requirements.

```shell
Available feature flags:

actions/cache (disabled):
        Control usage of actions/cache inside of workflows. Outputs a comment if not enabled.
        GitHub Enterprise Server >= ghes-3.5 required.

composite-actions (enabled):
        Minimizes resulting workflow complexity through the use of composite actions. See https://docs.github.com/en/actions/creating-actions/creating-a-composite-action for more information.
        GitHub Enterprise Server >= ghes-3.4 required.

reusable-workflows (disabled):
        Avoid duplication by re-using existing workflows. See https://docs.github.com/en/actions/using-workflows/reusing-workflows for more information.
        GitHub Enterprise Server >= ghes-3.4 required.

workflow-concurrency-option-allowed (enabled):
        Allows the use of the `concurrency` option in workflows. See https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions#concurrency for more information.
        GitHub Enterprise Server >= ghes-3.2 required.

Enable features by passing --enable-features feature-1 feature-2
Disable features by passing --disable-features feature-1 feature-2
```

--------------------------------

### Start self-hosted runner service on Windows

Source: https://docs.github.com/en/actions/hosting-your-own-runners/managing-self-hosted-runners/configuring-the-self-hosted-runner-application-as-a-service

Start the runner service using PowerShell Start-Service command.

```powershell
Start-Service "actions.runner.*"
```

--------------------------------

### Stopping and starting workflow commands on Ubuntu

Source: https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-commands?tool=bash

Example of toggling workflow command processing in a Linux environment.

```yaml
jobs:
  workflow-command-job:
    runs-on: ubuntu-latest
    steps:
      - name: Disable workflow commands
        run: |
          echo '::warning:: This is a warning message, to demonstrate that commands are being processed.'
          stopMarker=$(uuidgen)
          echo "::stop-commands::$stopMarker"
          echo '::warning:: This will NOT be rendered as a warning, because stop-commands has been invoked.'
          echo "::$stopMarker::"
          echo '::warning:: This is a warning again, because stop-commands has been turned off.'

```

```yaml
jobs:
  workflow-command-job:
    runs-on: ubuntu-latest
    steps:
      - name: Disable workflow commands
        run: |
          echo '::warning:: This is a warning message, to demonstrate that commands are being processed.'
          stopMarker=$(uuidgen)
          echo "::stop-commands::$stopMarker"
          echo '::warning:: This will NOT be rendered as a warning, because stop-commands has been invoked.'
          echo "::$stopMarker::"
          echo '::warning:: This is a warning again, because stop-commands has been turned off.'

```

--------------------------------

### Example entrypoint.sh shell script

Source: https://docs.github.com/en/actions/creating-actions/dockerfile-support-for-github-actions

A POSIX-compliant shell script that receives and prints arguments passed from the action metadata file. Must have execute permissions to run.

```shell
#!/bin/sh

# `$#` expands to the number of arguments and `$@` expands to the supplied `args`
printf '%d args:' "$#"
printf " '%s'" "$@"
printf '\n'
```

--------------------------------

### Check Docker Engine Installation Path with which Command

Source: https://docs.github.com/en/actions/how-tos/manage-runners/self-hosted-runners/monitor-and-troubleshoot?platform=linux

Use the `which` command to verify the Docker engine installation method. If the output shows `/snap/bin/docker`, the engine was installed via snap and may not properly handle environment variables with dashes.

```bash
$ which docker
/snap/bin/docker
```

--------------------------------

### Start self-hosted runner service on Linux

Source: https://docs.github.com/en/actions/how-tos/manage-runners/self-hosted-runners/configure-the-application?platform=mac

Starts the self-hosted runner service. This command is used on Linux systems.

```bash
sudo ./svc.sh start

```

```bash
./svc.sh start

```

--------------------------------

### Example Workflow Using the runner Context

Source: https://docs.github.com/en/actions/learn-github-actions/contexts

Demonstrates how to use `runner.temp` to manage temporary files and upload logs as artifacts on workflow failure.

```yaml
name: Build
on: push

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - name: Build with logs
        run: |
          mkdir ${{ runner.temp }}/build_logs
          echo "Logs from building" > ${{ runner.temp }}/build_logs/build.logs
          exit 1
      - name: Upload logs on fail
        if: ${{ failure() }}
        uses: actions/upload-artifact@v4
        with:
          name: Build failure logs
          path: ${{ runner.temp }}/build_logs

```

--------------------------------

### Example output of a successful CircleCI migration

Source: https://docs.github.com/en/actions/tutorials/migrate-to-github-actions/automated-migrations/circleci-migration

This example shows the expected output after successfully running the `migrate` command, including the path to logs and the URL of the created pull request.

```shell
$ gh actions-importer migrate circle-ci --target-url https://github.com/octo-org/octo-repo --output-dir tmp/migrate --circle-ci-project my-circle-ci-project
[2022-08-20 22:08:20] Logs: 'tmp/migrate/log/actions-importer-20220916-014033.log'
[2022-08-20 22:08:20] Pull request: 'https://github.com/octo-org/octo-repo/pull/1'
```

--------------------------------

### Example Interactive Configuration for CircleCI

Source: https://docs.github.com/en/actions/tutorials/migrate-to-github-actions/automated-migrations/circleci-migration

Shows an example of the interactive prompts and responses when configuring GitHub Actions Importer for CircleCI, including token and organization name inputs.

```shell
$ gh actions-importer configure
✔ Which CI providers are you configuring?: CircleCI
Enter the following values (leave empty to omit):
✔ Personal access token for GitHub: ***************
✔ Base url of the GitHub instance: https://github.com
✔ Personal access token for CircleCI: ********************
✔ Base url of the CircleCI instance: https://circleci.com
✔ CircleCI organization name: mycircleciorganization
Environment variables successfully updated.
```

--------------------------------

### Install GitHub Actions toolkit dependencies

Source: https://docs.github.com/en/actions/creating-actions/creating-a-javascript-action

Install the core and github packages to access workflow commands and GitHub context.

```shell
npm install @actions/core @actions/github
```

--------------------------------

### Stopping and starting workflow commands on Windows

Source: https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-commands?tool=bash

Example of toggling workflow command processing in a Windows environment using PowerShell.

```yaml
jobs:
  workflow-command-job:
    runs-on: windows-latest
    steps:
      - name: Disable workflow commands
        run: |
          Write-Output '::warning:: This is a warning message, to demonstrate that commands are being processed.'
          $stopMarker = New-Guid
          Write-Output "::stop-commands::$stopMarker"
          Write-Output '::warning:: This will NOT be rendered as a warning, because stop-commands has been invoked.'
          Write-Output ":::$stopMarker::"
          Write-Output '::warning:: This is a warning again, because stop-commands has been turned off.'

```

```yaml
jobs:
  workflow-command-job:
    runs-on: windows-latest
    steps:
      - name: Disable workflow commands
        run: |
          Write-Output '::warning:: This is a warning message, to demonstrate that commands are being processed.'
          $stopMarker = New-Guid
          Write-Output "::stop-commands::$stopMarker"
          Write-Output '::warning:: This will NOT be rendered as a warning, because stop-commands has been invoked.'
          Write-Output ":::$stopMarker::"
          Write-Output '::warning:: This is a warning again, because stop-commands has been turned off.'

```

--------------------------------

### Example Input for run_script_step Command (JSON)

Source: https://docs.github.com/en/actions/hosting-your-own-runners/managing-self-hosted-runners/customizing-the-containers-used-by-jobs

This JSON object demonstrates the structure and arguments for the `run_script_step` command, specifying container details, environment variables, and script execution parameters.

```json
{
  "command": "run_script_step",
  "responseFile": null,
  "state": {
    "network": "example_network_53269bd575972817b43f7733536b200c",
    "jobContainer": "82e8219701fe096a35941d869cf3d71af1d943b5d8bdd718857fb87ac3042480",
    "serviceContainers": {
      "redis": "60972d9aa486605e66b0dad4abb678dc3d9116f536579e418176eedb8abb9105"
    }
  },
  "args": {
    "entryPointArgs": ["-e", "/runner/temp/example.sh"],
    "entryPoint": "bash",
    "environmentVariables": {
      "NODE_ENV": "development"
    },
    "prependPath": ["/foo/bar", "bar/foo"],
    "workingDirectory": "/__w/octocat-test2/octocat-test2"
  }
}
```

```json
{
  "command": "run_script_step",
  "responseFile": null,
  "state": {
    "network": "example_network_53269bd575972817b43f7733536b200c",
    "jobContainer": "82e8219701fe096a35941d869cf3d71af1d943b5d8bdd718857fb87ac3042480",
    "serviceContainers": {
      "redis": "60972d9aa486605e66b0dad4abb678dc3d9116f536579e418176eedb8abb9105"
    }
  },
  "args": {
    "entryPointArgs": ["-e", "/runner/temp/example.sh"],
    "entryPoint": "bash",
    "environmentVariables": {
      "NODE_ENV": "development"
    },
    "prependPath": ["/foo/bar", "bar/foo"],
    "workingDirectory": "/__w/octocat-test2/octocat-test2"
  }
}
```

--------------------------------

### Configure PostgreSQL Service Container in GitHub Actions Workflow

Source: https://docs.github.com/en/actions/tutorials/use-containerized-services/create-postgresql-service-containers

Complete GitHub Actions workflow example that sets up a PostgreSQL service container with health checks and connects from a Node.js container job. The workflow checks out repository code, installs dependencies, and runs a script that connects to PostgreSQL, creates a table, and populates it with data. Requires Ubuntu runner and Docker support.

```yaml
name: PostgreSQL service example
on: push

jobs:
  # Label of the container job
  container-job:
    # Containers must run in Linux based operating systems
    runs-on: ubuntu-latest
    # Docker Hub image that `container-job` executes in
    container: node:20-bookworm-slim

    # Service containers to run with `container-job`
    services:
      # Label used to access the service container
      postgres:
        # Docker Hub image
        image: postgres
        # Provide the password for postgres
        env:
          POSTGRES_PASSWORD: postgres
        # Set health checks to wait until postgres has started
        options: >
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      # Downloads a copy of the code in your repository before running CI tests
      - name: Check out repository code
        uses: actions/checkout@v5

      # Performs a clean installation of all dependencies in the `package.json` file
      # For more information, see https://docs.npmjs.com/cli/ci.html
      - name: Install dependencies
        run: npm ci

      - name: Connect to PostgreSQL
        # Runs a script that creates a PostgreSQL table, populates
        # the table with data, and then retrieves the data.
        run: node client.js
        # Environment variables used by the `client.js` script to create a new PostgreSQL table.
        env:
          # The hostname used to communicate with the PostgreSQL service container
          POSTGRES_HOST: postgres
          # The default PostgreSQL port
          POSTGRES_PORT: 5432
```

--------------------------------

### POST /examples/parameter-file-paths

Source: https://docs.github.com/en/actions/tutorials/migrate-to-github-actions/automated-migrations/azure-devops-migration

Demonstrates how to use parameters for dynamic file paths and iterative steps in YAML templates.

```APIDOC
## POST /examples/parameter-file-paths

### Description
Provides YAML examples for dynamic and iterative file path resolution using parameters within the GitHub Actions Importer context.

### Method
POST

### Endpoint
/examples/parameter-file-paths

### Request Body
- **parameters** (array) - Required - List of parameter definitions including name, type, and default values.
- **steps** (array) - Required - List of steps or templates utilizing the defined parameters.

### Request Example
{
  "parameters": [
    {
      "name": "steps",
      "type": "object",
      "default": ["build_step", "release_step"]
    }
  ],
  "steps": [
    {
      "each": "step in parameters.steps",
      "template": "$-variables.yml"
    }
  ]
}

### Response
#### Success Response (200)
- **status** (string) - Confirmation of the serialized template structure.

#### Response Example
{
  "status": "serialized as standalone workflow"
}
```

--------------------------------

### Install the self-hosted runner service

Source: https://docs.github.com/en/actions/how-tos/manage-runners/self-hosted-runners/configure-the-application?platform=linux

Registers the runner application as a system service. On Linux, you can optionally specify a user for the service installation.

```shell
sudo ./svc.sh install

```

```shell
./svc.sh install USERNAME

```

```shell
./svc.sh install

```

--------------------------------

### Install Brew packages and casks on macOS GitHub-hosted runner

Source: https://docs.github.com/en/actions/using-github-hosted-runners/customizing-github-hosted-runners

Use this workflow to install Homebrew packages and casks on a macOS GitHub-hosted runner, demonstrating installation of `gh` and `microsoft-edge`.

```yaml
name: Build on macOS
on: push

jobs:
  build:
    runs-on: macos-latest
    steps:
      - name: Check out repository code
        uses: actions/checkout@v5
      - name: Install GitHub CLI
        run: |
          brew update
          brew install gh
      - name: Install Microsoft Edge
        run: |
          brew update
          brew install --cask microsoft-edge

```

--------------------------------

### Matrix combinations output example

Source: https://docs.github.com/en/actions/automating-your-workflow-with-github-actions/workflow-syntax-for-github-actions

Shows the resulting job combinations when using object arrays in matrix configuration. Each combination includes all properties from the objects.

```yaml
- matrix.os: ubuntu-latest
  matrix.node.version: 14
- matrix.os: ubuntu-latest
  matrix.node.version: 20
  matrix.node.env: NODE_OPTIONS=--openssl-legacy-provider
- matrix.os: macos-latest
  matrix.node.version: 14
- matrix.os: macos-latest
  matrix.node.version: 20
  matrix.node.env: NODE_OPTIONS=--openssl-legacy-provider
```

--------------------------------

### Initialize the action project directory

Source: https://docs.github.com/en/actions/tutorials/create-actions/create-a-javascript-action

Commands to navigate into the project folder and initialize a new npm package to generate a package.json file.

```shell
cd hello-world-javascript-action
npm init -y
```

--------------------------------

### HOOK /prepare_job.json

Source: https://docs.github.com/en/actions/how-tos/manage-runners/self-hosted-runners/customize-containers

Triggered when a job starts to initialize the environment, pull necessary images, and start job/service containers.

```APIDOC
## HOOK /prepare_job.json

### Description
Called when a job is started. GitHub Actions passes in any job or service containers the job has. This command is responsible for environment preparation, container pulling, and starting the primary job container and any sidecar services.

### Method
HOOK

### Endpoint
prepare_job.json

### Parameters
#### Request Body
- **job** (object) - Optional - Configuration for the main job container.
- **services** (array) - Optional - List of service container configurations.

### Request Example
{
  "job": {
    "image": "node:16-alpine"
  },
  "services": [
    {
      "image": "redis",
      "ports": ["6379:6379"]
    }
  ]
}

### Response
#### Success Response (0)
- **isAlpine** (boolean) - Required - Indicates if the container is an Alpine Linux-based image.
- **context** (object) - Optional - Key-value pairs to be added to the GitHub Actions job context.

#### Response Example
{
  "isAlpine": true,
  "context": {
    "custom_metadata": "container-initialized"
  }
}
```

--------------------------------

### Example line-delimited repository list for --include-from

Source: https://docs.github.com/en/actions/tutorials/migrate-to-github-actions/automated-migrations/circleci-migration

This text file format specifies a line-delimited list of repositories to be included in the audit.

```text
repository_one
repository_two
repository_three
```

--------------------------------

### Start a just-in-time runner with a configuration

Source: https://docs.github.com/en/actions/reference/security/secure-use

After obtaining the encoded JIT configuration from the REST API, use this command to start the self-hosted runner. The runner will perform a single job and then be automatically removed.

```shell
./run.sh --jitconfig ${encoded_jit_config}
```

--------------------------------

### Configure pre, main, and post scripts for JavaScript action

Source: https://docs.github.com/en/actions/creating-actions/metadata-syntax-for-github-actions

Set up a JavaScript action with pre-execution setup script, main action code, and post-execution cleanup script. All scripts use the same runtime specified in using.

```yaml
runs:
  using: 'node24'
  pre: 'setup.js'
  main: 'index.js'
  post: 'cleanup.js'
```

--------------------------------

### Workflow examples for environment variables

Source: https://docs.github.com/en/actions/using-workflows/workflow-commands-for-github-actions

Demonstrates how to set a variable in one step and access it in another. The step that defines the variable does not have access to the new value.

```yaml
steps:
  - name: Set the value
    id: step_one
    run: |
      echo "action_state=yellow" >> "$GITHUB_ENV"
  - name: Use the value
    id: step_two
    run: |
      printf '%s\n' "$action_state" # This will output 'yellow'


```

```yaml
steps:
  - name: Set the value
    id: step_one
    run: |
      echo "action_state=yellow" >> "$GITHUB_ENV"
  - name: Use the value
    id: step_two
    run: |
      printf '%s\n' "$action_state" # This will output 'yellow'


```

```yaml
steps:
  - name: Set the value
    id: step_one
    run: |
      "action_state=yellow" >> $env:GITHUB_ENV
  - name: Use the value
    id: step_two
    run: |
      Write-Output "$env:action_state" # This will output 'yellow'


```

```yaml
steps:
  - name: Set the value
    id: step_one
    run: |
      "action_state=yellow" >> $env:GITHUB_ENV
  - name: Use the value
    id: step_two
    run: |
      Write-Output "$env:action_state" # This will output 'yellow'


```

--------------------------------

### Basic workflow_run Trigger Example

Source: https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows

Simple example of configuring a workflow to run after another workflow completes. This demonstrates the basic syntax for the workflow_run event.

```APIDOC
## Basic workflow_run Configuration

### Description
Configure a workflow to run after a separate workflow completes.

### Configuration Example
```yaml
on:
  workflow_run:
    workflows: [Run Tests]
    types:
      - completed
```

### Explanation
- **workflows**: Specifies the "Run Tests" workflow as the trigger
- **types**: Limits triggering to the "completed" activity type only
```

--------------------------------

### Verify GitHub Actions Importer installation

Source: https://docs.github.com/en/actions/tutorials/migrate-to-github-actions/automated-migrations/circleci-migration

Display help information to verify the GitHub Actions Importer extension is installed and show available commands including audit, dry-run, and migrate.

```bash
$ gh actions-importer -h
Options:
  -?, -h, --help  Show help and usage information

Commands:
  update     Update to the latest version of GitHub Actions Importer.
  version    Display the version of GitHub Actions Importer.
  configure  Start an interactive prompt to configure credentials used to authenticate with your CI server(s).
  audit      Plan your CI/CD migration by analyzing your current CI/CD footprint.
  forecast   Forecast GitHub Actions usage from historical pipeline utilization.
  dry-run    Convert a pipeline to a GitHub Actions workflow and output its yaml file.
  migrate    Convert a pipeline to a GitHub Actions workflow and open a pull request with the changes.
```

--------------------------------

### Initialize the npm project

Source: https://docs.github.com/en/actions/creating-actions/creating-a-javascript-action

Generate a package.json file with default settings to manage the action's dependencies.

```shell
npm init -y
```

--------------------------------

### Example caller workflow with inputs and secrets

Source: https://docs.github.com/en/actions/using-workflows/reusing-workflows

A complete workflow example that calls two separate workflows, passing specific inputs and secrets to the second one.

```yaml
name: Call a reusable workflow

on:
  pull_request:
    branches:
      - main

jobs:
  call-workflow:
    uses: octo-org/example-repo/.github/workflows/workflow-A.yml@v1

  call-workflow-passing-data:
    permissions:
      contents: read
      pull-requests: write
    uses: octo-org/example-repo/.github/workflows/workflow-B.yml@main
    with:
      config-path: .github/labeler.yml
    secrets:
      token: ${{ secrets.GITHUB_TOKEN }}
```

```yaml
name: Call a reusable workflow

on:
  pull_request:
    branches:
      - main

jobs:
  call-workflow:
    uses: octo-org/example-repo/.github/workflows/workflow-A.yml@v1

  call-workflow-passing-data:
    permissions:
      contents: read
      pull-requests: write
    uses: octo-org/example-repo/.github/workflows/workflow-B.yml@main
    with:
      config-path: .github/labeler.yml
    secrets:
      token: ${{ secrets.GITHUB_TOKEN }}
```

--------------------------------

### Install Python Dependencies from requirements.txt in GitHub Actions

Source: https://docs.github.com/en/actions/tutorials/build-and-test-code/python

Checks out code, sets up Python, upgrades pip, and installs dependencies from a requirements.txt file. This is a standard workflow for projects that manage dependencies through a requirements file. The pip install command reads the requirements file and installs all specified packages.

```yaml
steps:
- uses: actions/checkout@v5
- name: Set up Python
  uses: actions/setup-python@v5
  with:
    python-version: '3.x'
- name: Install dependencies
  run: |
    python -m pip install --upgrade pip
    pip install -r requirements.txt
```

--------------------------------

### Start self-hosted runner service on Windows

Source: https://docs.github.com/en/actions/how-tos/manage-runners/self-hosted-runners/configure-the-application?platform=mac

Starts the self-hosted runner service on Windows using PowerShell. The wildcard "actions.runner.*" ensures all runner services are started.

```powershell
Start-Service "actions.runner.*"

```

--------------------------------

### Example of a Derived Cache Key

Source: https://docs.github.com/en/actions/reference/dependency-caching-reference

This shows an example of a cache key after GitHub Actions evaluates the `hashFiles` expression.

```text
npm-d5ea0750
```

--------------------------------

### HOOK prepare_job

Source: https://docs.github.com/en/actions/hosting-your-own-runners/managing-self-hosted-runners/customizing-the-containers-used-by-jobs

Called when a job is started to initialize the environment, pull containers, and start job/service containers.

```APIDOC
## HOOK prepare_job

### Description
Called when a job is started. GitHub Actions passes in any job or service containers the job has. This command is used to prune previous jobs, create networks, pull containers, and start them.

### Method
HOOK

### Endpoint
prepare_job.json

### Parameters
#### Request Body
- **job** (object) - Required - Information about the job container.
- **services** (array) - Required - List of service containers.

### Response
#### Success Response (0)
- **isAlpine** (boolean) - Required - State whether the container is an alpine linux container.
- **context** (object) - Optional - Any context fields you want to set on the job context.

#### Response Example
{
  "isAlpine": true,
  "context": {}
}
```

--------------------------------

### Manual Gem Caching using actions/cache

Source: https://docs.github.com/en/actions/tutorials/build-and-test-code/ruby

This example illustrates how to manually cache Ruby gems using the 'actions/cache' action for more granular control. It caches the 'vendor/bundle' directory, generating a cache key based on the operating system and a hash of 'Gemfile.lock'. After restoring the cache, it configures Bundler to use the cached path and installs dependencies.

```yaml
steps:
- uses: actions/cache@v4
  with:
    path: vendor/bundle
    key: ${{ runner.os }}-gems-${{ hashFiles('**/Gemfile.lock') }}
    restore-keys: |
      ${{ runner.os }}-gems-
- name: Bundle install
  run: |
    bundle config path vendor/bundle
    bundle install --jobs 4 --retry 3
```

--------------------------------

### Example `gha-runner-scale-set` Helm Chart `values.yaml`

Source: https://docs.github.com/en/actions/hosting-your-own-runners/managing-self-hosted-runners-with-actions-runner-controller/deploying-runner-scale-sets-with-actions-runner-controller

A sample `values.yaml` demonstrating general configuration options for the `gha-runner-scale-set` Helm chart, including GitHub URL, secret, and runner scaling parameters.

```yaml
## githubConfigUrl is the GitHub url for where you want to configure runners
## ex: https://github.com/myorg/myrepo or https://github.com/myorg
githubConfigUrl: "https://github.com/actions/actions-runner-controller"

## githubConfigSecret is the k8s secrets to use when auth with GitHub API.
## You can choose to use GitHub App or a PAT token
githubConfigSecret: my-super-safe-secret

## maxRunners is the max number of runners the autoscaling runner set will scale up to.
maxRunners: 5

## minRunners is the min number of idle runners. The target number of runners created will be
## calculated as a sum of minRunners and the number of jobs assigned to the scale set.
minRunners: 0

runnerGroup: "my-custom-runner-group"

## name of the runner scale set to create. Defaults to the helm release name
runnerScaleSetName: "my-awesome-scale-set"

## template is the PodSpec for each runner Pod
```

--------------------------------

### Install dependencies with npm install in GitHub Actions

Source: https://docs.github.com/en/actions/automating-builds-and-tests/building-and-testing-nodejs

Uses npm install to install dependencies defined in package.json. Allows updates to lock files based on version constraints.

```YAML
steps:
- uses: actions/checkout@v5
- name: Use Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '20.x'
- name: Install dependencies
  run: npm install
```

--------------------------------

### Example Output for Attestation Bundle Download

Source: https://docs.github.com/en/actions/security-guides/verifying-attestations-offline

This output shows the successful download of an attestation bundle, indicating the file name where the attestations and trusted metadata are saved.

```Plaintext
Wrote attestations to file sha256:ae57936def59bc4c75edd3a837d89bcefc6d3a5e31d55a6fa7a71624f92c3c3b.jsonl.
Any previous content has been overwritten

The trusted metadata is now available at sha256:ae57936def59bc4c75edd3a837d89bcefc6d3a5e31d55a6fa7a71624f92c3c3b.jsonl
```

--------------------------------

### Retrieve Step Outputs in Subsequent Steps

Source: https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-commands

Example of setting an output parameter in one step and retrieving it in another step using the steps context and environment variables.

```yaml
- name: Set color
  id: color-selector
  run: echo "SELECTED_COLOR=green" >> "$GITHUB_OUTPUT"
- name: Get color
  env:
    SELECTED_COLOR: ${{ steps.color-selector.outputs.SELECTED_COLOR }}
  run: echo "The selected color is $SELECTED_COLOR"
```

```yaml
- name: Set color
  id: color-selector
  run: |
      "SELECTED_COLOR=green" >> $env:GITHUB_OUTPUT
- name: Get color
  env:
    SELECTED_COLOR: ${{ steps.color-selector.outputs.SELECTED_COLOR }}
  run: Write-Output "The selected color is $env:SELECTED_COLOR"
```

--------------------------------

### Install PowerShell Modules from PSGallery

Source: https://docs.github.com/en/actions/tutorials/build-and-test-code/powershell

Configures a GitHub Action job to install specific PowerShell modules like SqlServer and PSScriptAnalyzer. It explicitly sets the PSGallery repository to Trusted to allow non-interactive installation.

```yaml
jobs:
  install-dependencies:
    name: Install dependencies
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - name: Install from PSGallery
        shell: pwsh
        run: |
          Set-PSRepository PSGallery -InstallationPolicy Trusted
          Install-Module SqlServer, PSScriptAnalyzer
```

--------------------------------

### Generate an installation access token for GitHub App

Source: https://docs.github.com/en/actions/deployment/protecting-deployments/creating-custom-deployment-protection-rules

Use this curl command to generate an installation access token, authenticating as a GitHub App. This token is required for subsequent API calls to approve or reject deployments.

```bash
curl --request POST \
--url "https://api.github.com/app/installations/INSTALLATION_ID/ACCESS_TOKENS" \
--header "Accept: application/vnd.github+json" \
--header "Authorization: Bearer {jwt}" \
--header "Content-Type: application/json" \
--data \
'{ \
   "repository_ids": [321], \
   "permissions": { \
      "deployments": "write" \
   } \
}'
```

--------------------------------

### Setup CLI Action using JavaScript and Actions Toolkit

Source: https://docs.github.com/en/actions/how-tos/create-and-publish-actions/create-a-cli-action

This JavaScript snippet utilizes @actions/core and @actions/tool-cache to download a tool from a URL, extract its contents, and add the resulting directory to the runner's PATH environment variable.

```javascript
const core = require('@actions/core');
const tc = require('@actions/tool-cache');

async function setup() {
  // Get version of tool to be installed
  const version = core.getInput('version');

  // Download the specific version of the tool, e.g. as a tarball
  const pathToTarball = await tc.downloadTool(getDownloadURL());

  // Extract the tarball onto the runner
  const pathToCLI = await tc.extractTar(pathToTarball);

  // Expose the tool by adding it to the PATH
  core.addPath(pathToCLI)
}

module.exports = setup
```

--------------------------------

### Install dependencies with npm ci in GitHub Actions

Source: https://docs.github.com/en/actions/automating-builds-and-tests/building-and-testing-nodejs

Uses npm ci to install exact versions from package-lock.json or npm-shrinkwrap.json, preventing lock file updates. Generally faster than npm install.

```YAML
steps:
- uses: actions/checkout@v5
- name: Use Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '20.x'
- name: Install dependencies
  run: npm ci
```

--------------------------------

### Run command using Windows Cmd in GitHub Actions

Source: https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax

This example shows how to use the `cmd` shell for a step, typically for executing commands on Windows runners.

```yaml
steps:
  - name: Display the path
    shell: cmd
    run: echo %PATH%
```

--------------------------------

### Complete reusable workflow example

Source: https://docs.github.com/en/actions/using-workflows/reusing-workflows

Full example of a reusable workflow file (`workflow-B.yml`) that accepts an input string and a secret, then uses them in an action. This demonstrates the complete pattern for creating a reusable workflow.

```YAML
name: Reusable workflow example

on:
  workflow_call:
    inputs:
      config-path:
        required: true
        type: string
    secrets:
      token:
        required: true

jobs:
  triage:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/labeler@v6
      with:
        repo-token: ${{ secrets.token }}
        configuration-path: ${{ inputs.config-path }}
```

--------------------------------

### Apply conditional logic to lifecycle scripts in YAML

Source: https://docs.github.com/en/actions/reference/workflows-and-actions/metadata-syntax

Demonstrates the use of pre-if and post-if to conditionally execute setup or cleanup scripts based on the runner's operating system environment.

```yaml
pre: 'cleanup.js'
pre-if: runner.os == 'linux'
post: 'cleanup.js'
post-if: runner.os == 'linux'
```

--------------------------------

### Install GitHub Actions Importer CLI extension

Source: https://docs.github.com/en/actions/tutorials/migrate-to-github-actions/automated-migrations/circleci-migration

Install the GitHub Actions Importer CLI extension using GitHub CLI. Required as the first step to enable migration commands.

```bash
gh extension install github/gh-actions-importer
```

--------------------------------

### Cache Key Example with Hash Value

Source: https://docs.github.com/en/actions/using-workflows/caching-dependencies-to-speed-up-workflows

This shows an example of a generated cache key after GitHub Actions evaluates the hashFiles expression for package-lock.json.

```text
npm-d5ea0750

```

--------------------------------

### Define Workflow Steps for Containerized Jobs

Source: https://docs.github.com/en/actions/tutorials/use-containerized-services/create-postgresql-service-containers

This snippet outlines the steps to check out code, install Node.js dependencies using npm, and execute a script that connects to a PostgreSQL service. It demonstrates passing host and port environment variables to allow the application to communicate with the service container.

```yaml
steps:
  # Downloads a copy of the code in your repository before running CI tests
  - name: Check out repository code
    uses: actions/checkout@v5

  # Performs a clean installation of all dependencies in the `package.json` file
  # For more information, see https://docs.npmjs.com/cli/ci.html
  - name: Install dependencies
    run: npm ci

  - name: Connect to PostgreSQL
    # Runs a script that creates a PostgreSQL table, populates
    # the table with data, and then retrieves the data.
    run: node client.js
    # Environment variable used by the `client.js` script to create
    # a new PostgreSQL client.
    env:
      # The hostname used to communicate with the PostgreSQL service container
      POSTGRES_HOST: postgres
      # The default PostgreSQL port
      POSTGRES_PORT: 5432
```

--------------------------------

### Single version Node.js CI workflow

Source: https://docs.github.com/en/actions/automating-builds-and-tests/building-and-testing-nodejs

Define a workflow that runs on a single Node.js version without a matrix. This configuration includes standard steps for checkout, setup, dependency installation, and testing.

```yaml
name: Node.js CI

on: [push]

jobs:
  build:

    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v5
      - name: Use Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20.x'
      - run: npm ci
      - run: npm run build --if-present
      - run: npm test
```

```yaml
name: Node.js CI

on: [push]

jobs:
  build:

    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v5
      - name: Use Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20.x'
      - run: npm ci
      - run: npm run build --if-present
      - run: npm test
```

--------------------------------

### Install apt package on Ubuntu GitHub-hosted runner

Source: https://docs.github.com/en/actions/using-github-hosted-runners/customizing-github-hosted-runners

Use this workflow to install `apt` packages on an Ubuntu GitHub-hosted runner. Ensure `sudo apt-get update` runs first to refresh package indexes.

```yaml
name: Build on Ubuntu
on: push

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Check out repository code
        uses: actions/checkout@v5
      - name: Install jq tool
        run: |
          sudo apt-get update
          sudo apt-get install jq

```

--------------------------------

### Filter pull_request_target by target branch pattern

Source: https://docs.github.com/en/actions/writing-workflows/choosing-when-your-workflow-runs/events-that-trigger-workflows

Run the workflow only when a pull request targets branches matching a specific pattern. This example triggers on opened pull requests that target branches starting with releases/.

```yaml
on:
  pull_request_target:
    types:
      - opened
    branches:
      - 'releases/**'
```

--------------------------------

### Setup specific Swift version for GitHub Actions

Source: https://docs.github.com/en/actions/tutorials/build-and-test-code/swift

Demonstrates how to use the swift-actions/setup-swift action to specify a single, exact version of Swift (e.g., 5.3.3) for a workflow job. This ensures that the build environment remains consistent regardless of runner updates.

```yaml
steps:
  - uses: swift-actions/setup-swift@65540b95f51493d65f5e59e97dcef9629ddf11bf
    with:
      swift-version: "5.3.3"
  - name: Get swift version
    run: swift --version # Swift 5.3.3
```

--------------------------------

### POST /app/installations/{installation_id}/access_tokens

Source: https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/create-custom-protection-rules

Generate an installation access token for a GitHub App using the installation ID from the deployment protection rule webhook payload. This token is required to authenticate subsequent API requests for approving or rejecting deployments.

```APIDOC
## POST /app/installations/{installation_id}/access_tokens

### Description
Generates an installation access token for a GitHub App. This token is used to authenticate API requests for managing deployment protection rules.

### Method
POST

### Endpoint
https://api.github.com/app/installations/{installation_id}/access_tokens

### Parameters
#### Path Parameters
- **installation_id** (integer) - Required - The ID of the GitHub App installation

#### Request Body
- **repository_ids** (array of integers) - Optional - Array of repository IDs to scope the token to
- **permissions** (object) - Optional - Permissions object specifying access levels
  - **deployments** (string) - Optional - Set to "write" to allow deployment management

### Request Example
```json
{
  "repository_ids": [321],
  "permissions": {
    "deployments": "write"
  }
}
```

### Response
#### Success Response (201)
- **token** (string) - The generated access token
- **expires_at** (string) - ISO 8601 timestamp when the token expires
- **permissions** (object) - The permissions granted to this token
- **repository_selection** (string) - Either "all" or "selected"

### Headers
- **Accept**: application/vnd.github+json
- **Authorization**: Bearer {jwt}
- **Content-Type**: application/json
```

--------------------------------

### Add 'Hello World' Job Summary (Bash)

Source: https://docs.github.com/en/actions/using-workflows/workflow-commands-for-github-actions

Add a 'Hello world!' Markdown heading to the job summary. Use `echo` to write to the `$GITHUB_STEP_SUMMARY` environment file.

```Bash
echo "### Hello world! :rocket:" >> $GITHUB_STEP_SUMMARY

```

```Bash
echo "### Hello world! :rocket:" >> $GITHUB_STEP_SUMMARY

```

--------------------------------

### Example `inputs` Context JSON Structure

Source: https://docs.github.com/en/actions/learn-github-actions/contexts

Illustrates the JSON structure of the `inputs` context for a workflow defining `build_id`, `deploy_target`, and `perform_deploy`.

```json
{
  "build_id": 123456768,
  "deploy_target": "deployment_sys_1a",
  "perform_deploy": true
}
```

--------------------------------

### Generated .npmrc file content

Source: https://docs.github.com/en/actions/tutorials/publish-packages/publish-nodejs-packages

Example of the .npmrc file created by the setup-node action on the runner. It includes the registry URL, authentication token reference, and scope prefix.

```shell
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
@octocat:registry=https://npm.pkg.github.com
always-auth=true
```

--------------------------------

### Cron operator examples for workflow scheduling

Source: https://docs.github.com/en/actions/automating-your-workflow-with-github-actions/workflow-syntax-for-github-actions

Examples of using wildcards, lists, ranges, and step values to define complex execution intervals.

```cron
15 * * * *
```

```cron
2,10 4,5 * * *
```

```cron
30 4-6 * * *
```

```cron
20/15 * * * *
```

--------------------------------

### Example Helm List Output

Source: https://docs.github.com/en/actions/hosting-your-own-runners/managing-self-hosted-runners-with-actions-runner-controller/deploying-runner-scale-sets-with-actions-runner-controller

This output shows the deployed Helm charts, including the controller and the runner scale set, with their status and versions.

```text
NAME            NAMESPACE       REVISION        UPDATED                                 STATUS          CHART                                       APP VERSION
arc             arc-systems     1               2023-04-12 11:45:59.152090536 +0000 UTC deployed        gha-runner-scale-set-controller-0.4.0       0.4.0
arc-runner-set  arc-systems     1               2023-04-12 11:46:13.451041354 +0000 UTC deployed        gha-runner-scale-set-0.4.0                  0.4.0
```

--------------------------------

### Specify Java 11 for x64 in GitHub Actions

Source: https://docs.github.com/en/actions/automating-builds-and-tests/building-and-testing-java-with-maven

Use the `setup-java` action to configure a specific JDK version, distribution, and architecture for your workflow. This example sets up Adoptium JDK 11 for x64.

```yaml
steps:
  - uses: actions/checkout@v5
  - name: Set up JDK 11 for x64
    uses: actions/setup-java@v4
    with:
      java-version: '11'
      distribution: 'temurin'
      architecture: x64

```

```yaml
steps:
  - uses: actions/checkout@v5
  - name: Set up JDK 11 for x64
    uses: actions/setup-java@v4
    with:
      java-version: '11'
      distribution: 'temurin'
      architecture: x64

```

--------------------------------

### Job Context Example

Source: https://docs.github.com/en/actions/reference/workflows-and-actions/contexts

Example of a job context object with a PostgreSQL service container. Shows the structure when containers and service containers are used in a job.

```APIDOC
## Job Context Example

### Description
Example contents of the `job` context using a PostgreSQL service container with mapped ports. If there are no containers or service containers used in a job, the `job` context only contains the `status` and `check_run_id` properties.

### Example Response
```json
{
  "status": "success",
  "check_run_id": 51725241954,
  "container": {
    "network": "github_network_53269bd575974817b43f4733536b200c"
  },
  "services": {
    "postgres": {
      "id": "60972d9aa486605e66b0dad4abb638dc3d9116f566579e418166eedb8abb9105",
      "ports": {
        "5432": "49153"
      },
      "network": "github_network_53269bd575974817b43f4733536b200c"
    }
  }
}
```
```

--------------------------------

### Generated .npmrc file for private registry

Source: https://docs.github.com/en/actions/automating-builds-and-tests/building-and-testing-nodejs

Example output of .npmrc file created by setup-node action with registry URL, authentication token reference, and scope configuration.

```text
//registry.npmjs.org/:_authToken=${NODE_AUTH_TOKEN}
@octocat:registry=https://registry.npmjs.org/
always-auth=true
```

--------------------------------

### Install ARC runner scale set with Helm

Source: https://docs.github.com/en/actions/hosting-your-own-runners/managing-self-hosted-runners-with-actions-runner-controller/quickstart-for-actions-runner-controller

Deploys a runner scale set using the specified installation name, namespace, and GitHub configuration URL. Ensure the GITHUB_PAT has appropriate scopes for repository or organization access.

```bash
INSTALLATION_NAME="arc-runner-set"
NAMESPACE="arc-runners"
GITHUB_CONFIG_URL="https://github.com/<your_enterprise/org/repo>"
GITHUB_PAT="<PAT>"
helm install "${INSTALLATION_NAME}" \
    --namespace "${NAMESPACE}" \
    --create-namespace \
    --set githubConfigUrl="${GITHUB_CONFIG_URL}" \
    --set githubConfigSecret.github_token="${GITHUB_PAT}" \
    oci://ghcr.io/actions/actions-runner-controller-charts/gha-runner-scale-set
```

```text
INSTALLATION_NAME="arc-runner-set"
NAMESPACE="arc-runners"
GITHUB_CONFIG_URL="https://github.com/<your_enterprise/org/repo>"
GITHUB_PAT="<PAT>"
helm install "${INSTALLATION_NAME}" \
    --namespace "${NAMESPACE}" \
    --create-namespace \
    --set githubConfigUrl="${GITHUB_CONFIG_URL}" \
    --set githubConfigSecret.github_token="${GITHUB_PAT}" \
    oci://ghcr.io/actions/actions-runner-controller-charts/gha-runner-scale-set
```

--------------------------------

### Example config.yml for specifying composite action target repository

Source: https://docs.github.com/en/actions/tutorials/migrate-to-github-actions/automated-migrations/circleci-migration

This YAML format shows how to specify the target repository and ref for a converted composite action in the config.yml file.

```yaml
composite_actions:
  - name: my-composite-action.yml
    target_url: https://github.com/octo-org/octo-repo
    ref: main
```

--------------------------------

### Filter Pattern Syntax - Branches, Tags, and Paths

Source: https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions

Reference guide for filter pattern syntax used in GitHub Actions workflows for matching branches, tags, and paths. Includes special characters, wildcards, and pattern matching rules with examples.

```APIDOC
## Filter Pattern Cheat Sheet

### Description
Special characters and patterns used in path, branch, and tag filters for GitHub Actions workflows.

### Special Characters
- **`*`** - Matches zero or more characters, but does not match the `/` character. Example: `Octo*` matches `Octocat`
- **`**`** - Matches zero or more of any character, including `/`
- **`?`** - Matches zero or one of the preceding character
- **`+`** - Matches one or more of the preceding character
- **`[]`** - Matches one alphanumeric character listed in brackets or included in ranges. Ranges: `a-z`, `A-Z`, `0-9`. Example: `[CB]at` matches `Cat` or `Bat`
- **`!`** - At the start of a pattern, negates previous positive patterns. No special meaning if not first character

### YAML Quoting Rules
The characters `*`, `[`, and `!` are special in YAML. If starting a pattern with these characters, enclose the pattern in quotes.

### Valid Examples
```yaml
paths:
  - '**/README.md'

branches: [ main, 'release/v[0-9].[0-9]' ]
```

### Invalid Examples
```yaml
# Invalid - creates parse error
paths:
  - **/README.md

# Invalid - creates parse error
branches: [ main, release/v[0-9].[0-9] ]
```

### Pattern Examples

| Pattern | Description | Example Matches |
|---------|-------------|------------------|
| `feature/*` | Matches any character except slash | `feature/my-branch`, `feature/your-branch` |
| `feature/**` | Matches any character including slash | `feature/beta-a/my-branch`, `feature/mona/the/octocat` |
| `main` | Exact branch or tag name | `main` |
| `releases/mona-the-octocat` | Exact branch or tag name | `releases/mona-the-octocat` |
| `'*'` | All branch and tag names without slash | `main`, `releases` |
| `'**'` | All branch and tag names (default behavior) | `all/the/branches`, `every/tag` |
| `'*feature'` | Ends with 'feature' | `mona-feature`, `feature`, `ver-10-feature` |
| `v2*` | Starts with 'v2' | `v2`, `v2.0`, `v2.9` |
| `v[12].[0-9]+.[0-9]+` | Semantic versioning with major version 1 or 2 | `v1.10.1`, `v2.0.0` |
```

--------------------------------

### GitHub Actions Workflow to Install Apple Certificate and Provisioning Profile

Source: https://docs.github.com/en/actions/how-tos/deploy/deploy-to-third-party-platforms/sign-xcode-applications

This GitHub Actions workflow demonstrates how to checkout a repository and then install an Apple signing certificate and provisioning profile on a macOS runner. It decodes Base64 secrets, creates a temporary keychain, imports the certificate, and copies the provisioning profile for Xcode app signing.

```yaml
name: App build
on: push

jobs:
  build_with_signing:
    runs-on: macos-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v5
      - name: Install the Apple certificate and provisioning profile
        env:
          BUILD_CERTIFICATE_BASE64: ${{ secrets.BUILD_CERTIFICATE_BASE64 }}
          P12_PASSWORD: ${{ secrets.P12_PASSWORD }}
          BUILD_PROVISION_PROFILE_BASE64: ${{ secrets.BUILD_PROVISION_PROFILE_BASE64 }}
          KEYCHAIN_PASSWORD: ${{ secrets.KEYCHAIN_PASSWORD }}
        run: |
          # create variables
          CERTIFICATE_PATH=$RUNNER_TEMP/build_certificate.p12
          PP_PATH=$RUNNER_TEMP/build_pp.mobileprovision
          KEYCHAIN_PATH=$RUNNER_TEMP/app-signing.keychain-db

          # import certificate and provisioning profile from secrets
          echo -n "$BUILD_CERTIFICATE_BASE64" | base64 --decode -o $CERTIFICATE_PATH
          echo -n "$BUILD_PROVISION_PROFILE_BASE64" | base64 --decode -o $PP_PATH

          # create temporary keychain
          security create-keychain -p "$KEYCHAIN_PASSWORD" $KEYCHAIN_PATH
          security set-keychain-settings -lut 21600 $KEYCHAIN_PATH
          security unlock-keychain -p "$KEYCHAIN_PASSWORD" $KEYCHAIN_PATH

          # import certificate to keychain
          security import $CERTIFICATE_PATH -P "$P12_PASSWORD" -A -t cert -f pkcs12 -k $KEYCHAIN_PATH
          security set-key-partition-list -S apple-tool:,apple: -k "$KEYCHAIN_PASSWORD" $KEYCHAIN_PATH
          security list-keychain -d user -s $KEYCHAIN_PATH

          # apply provisioning profile
          mkdir -p ~/Library/MobileDevice/Provisioning\ Profiles
          cp $PP_PATH ~/Library/MobileDevice/Provisioning\ Profiles
      - name: Build app
          # ...
```

--------------------------------

### Start the self-hosted runner service

Source: https://docs.github.com/en/actions/how-tos/manage-runners/self-hosted-runners/configure-the-application?platform=linux

Initiates the runner service to begin processing jobs. Use sudo on Linux or PowerShell on Windows.

```shell
sudo ./svc.sh start

```

```powershell
Start-Service "actions.runner.*"

```

```shell
./svc.sh start

```

--------------------------------

### Install Kustomize CLI for Kubernetes Customization

Source: https://docs.github.com/en/actions/how-tos/deploy/deploy-to-third-party-platforms/google-kubernetes-engine

Downloads the Kustomize CLI tool from its GitHub releases and makes it executable. Kustomize is used for declarative customization of Kubernetes object configurations, enabling environment-specific adjustments.

```bash
curl -sfLo kustomize https://github.com/kubernetes-sigs/kustomize/releases/download/v3.1.0/kustomize_3.1.0_linux_amd64
        chmod u+x ./kustomize
```

--------------------------------

### Install Sigstore Policy Controller Helm Chart

Source: https://docs.github.com/en/actions/how-tos/security-for-github-actions/using-artifact-attestations/enforcing-artifact-attestations-with-a-kubernetes-admission-controller

Installs the Sigstore Policy Controller into the 'artifact-attestations' namespace using a Helm chart. Ensure Helm 3.0+ and a Kubernetes cluster version 1.27+ are prerequisites.

```bash
helm upgrade policy-controller --install --atomic \
  --create-namespace --namespace artifact-attestations \
  oci://ghcr.io/sigstore/helm-charts/policy-controller \
  --version 0.10.5
```

```bash
helm upgrade policy-controller --install --atomic \
  --create-namespace --namespace artifact-attestations \
  oci://ghcr.io/sigstore/helm-charts/policy-controller \
  --version 0.10.5
```

--------------------------------

### Inline permission scope examples

Source: https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax

Examples of specific permission scopes for security events and commit statuses as used in workflow configurations.

```yaml
security-events: read
```

```yaml
security-events: write
```

```yaml
statuses:read
```

--------------------------------

### Example steps Context Object Structure

Source: https://docs.github.com/en/actions/reference/accessing-contextual-information-about-workflow-runs

This JSON object illustrates the structure and content of the `steps` context, showing outputs, outcome, and conclusion for two previous steps.

```json
{
  "checkout": {
    "outputs": {},
    "outcome": "success",
    "conclusion": "success"
  },
  "generate_number": {
    "outputs": {
      "random_number": "1"
    },
    "outcome": "success",
    "conclusion": "success"
  }
}
```

--------------------------------

### Check Docker Installation Path with Bash

Source: https://docs.github.com/en/actions/hosting-your-own-runners/managing-self-hosted-runners/monitoring-and-troubleshooting-self-hosted-runners

Run this command on a self-hosted runner to verify if Docker was installed via snap, which can cause input mapping issues.

```bash
$ which docker
/snap/bin/docker

```

--------------------------------

### Basic Gradle Build Workflow

Source: https://docs.github.com/en/actions/automating-builds-and-tests/building-and-testing-java-with-gradle

Sets up a GitHub Actions workflow to checkout code, configure Java and Gradle, and execute a Gradle build using a specific Gradle file.

```yaml
# This workflow uses actions that are not certified by GitHub.
# They are provided by a third-party and are governed by
# separate terms of service, privacy policy, and support
# documentation.
steps:
  - uses: actions/checkout@v5
  - uses: actions/setup-java@v4
    with:
      java-version: '17'
      distribution: 'temurin'

  - name: Setup Gradle
    uses: gradle/actions/setup-gradle@017a9effdb900e5b5b2fddfb590a105619dca3c3 # v4.4.2

  - name: Build with Gradle
    run: ./gradlew -b ci.gradle package

```

--------------------------------

### GitHub Actions Conditional Job Execution with Repository Check

Source: https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/control-jobs-with-conditions

This YAML workflow demonstrates using the `if` conditional to control job execution based on repository name and organization. The `production-deploy` job only runs when the repository matches 'octo-org/octo-repo-prod', otherwise it is skipped. The workflow includes checkout and Node.js setup steps with npm installation.

```yaml
name: example-workflow
on: [push]
jobs:
  production-deploy:
    if: ${{ github.repository == 'octo-org/octo-repo-prod' }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - uses: actions/setup-node@v4
        with:
          node-version: '14'
      - run: npm install -g bats
```

--------------------------------

### Example Dockerfile for Docker container action

Source: https://docs.github.com/en/actions/creating-actions/dockerfile-support-for-github-actions

A minimal Dockerfile that copies an entrypoint.sh script and uses it as the ENTRYPOINT. This pattern allows passing args from the action metadata file to the shell script.

```dockerfile
# Container image that runs your code
FROM debian:9.5-slim

# Copies your code file from your action repository to the filesystem path `/` of the container
COPY entrypoint.sh /entrypoint.sh

# Executes `entrypoint.sh` when the Docker container starts up
ENTRYPOINT ["/entrypoint.sh"]
```

--------------------------------

### Build .NET with Multiple SDK Versions using Matrix Strategy

Source: https://docs.github.com/en/actions/tutorials/build-and-test-code/net

This workflow uses a matrix strategy to run jobs across multiple versions of the .NET SDK. It utilizes the setup-dotnet action to dynamically provision the specified versions on GitHub-hosted runners.

```yaml
name: dotnet package

on: [push]

jobs:
  build:

    runs-on: ubuntu-latest
    strategy:
      matrix:
        dotnet-version: [ '3.1.x', '6.0.x' ]

    steps:
      - uses: actions/checkout@v5
      - name: Setup dotnet ${{ matrix.dotnet-version }}
        uses: actions/setup-dotnet@v4
        with:
          dotnet-version: ${{ matrix.dotnet-version }}
      # You can test your matrix by printing the current dotnet version
      - name: Display dotnet version
        run: dotnet --
```

--------------------------------

### Define runs.args for Docker Actions

Source: https://docs.github.com/en/actions/creating-actions/metadata-syntax-for-github-actions

This example shows how to pass arguments to a Docker action, including dynamic inputs from the workflow. Arguments are passed to the container's `ENTRYPOINT` and can substitute for the `CMD` instruction.

```YAML
runs:
  using: 'docker'
  image: 'Dockerfile'
  args:
    - ${{ inputs.greeting }}
    - 'foo'
    - 'bar'

```

--------------------------------

### Install Chocolatey packages on Windows GitHub-hosted runner

Source: https://docs.github.com/en/actions/using-github-hosted-runners/customizing-github-hosted-runners

Use this workflow to install Chocolatey packages, such as the GitHub CLI, on a Windows GitHub-hosted runner.

```yaml
name: Build on Windows
on: push
jobs:
  build:
    runs-on: windows-latest
    steps:
      - run: choco install gh
      - run: gh version

```

--------------------------------

### Cache Key and Restore Keys Search Priority Example

Source: https://docs.github.com/en/actions/reference/dependency-caching-reference

Demonstrates the cache lookup order when both a specific key and multiple restore keys are defined. The action searches the current branch first, then the default branch.

```yaml
key:
  npm-feature-d5ea0750
restore-keys: |
  npm-feature-
  npm-
```

--------------------------------

### Run a GitHub Actions job regardless of dependency success

Source: https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/use-jobs

This YAML example shows how to configure a job to run even if its dependent jobs fail or are skipped, by using the `always()` conditional expression with the `if` keyword. This is useful for cleanup tasks or reporting jobs that should execute irrespective of upstream job outcomes. The job will still wait for its dependencies to complete before starting.

```yaml
jobs:
  job1:
  job2:
    needs: job1
  job3:
    if: ${{ always() }}
    needs: [job1, job2]
```

--------------------------------

### Configuration Property: runs.pre

Source: https://docs.github.com/en/actions/creating-actions/metadata-syntax-for-github-actions

Specifies a script to run at the start of a job, before the main action. This property is optional and not supported for local actions.

```APIDOC
## Configuration Property: runs.pre

### Description
Allows you to run a script at the start of a job, before the `main:` action begins. For example, you can use `pre:` to run a prerequisite setup script. The runtime specified with the `using` syntax will execute this file. The `pre:` action always runs by default but you can override this using `runs.pre-if`. This property is optional and not supported for local actions.

### Property Path
`runs.pre`

### Request Body (Fields)
- **pre** (string) - Optional - The path to the script to run before the main action.

### Configuration Example
```yaml
runs:
  using: 'node24'
  pre: 'setup.js'
  main: 'index.js'
  post: 'cleanup.js'
```
```

--------------------------------

### Example `config.yml` for specifying reusable workflow target repository

Source: https://docs.github.com/en/actions/tutorials/migrate-to-github-actions/automated-migrations/gitlab-migration

This YAML snippet illustrates the format of `config.yml` for specifying the target repository and ref for converted reusable workflows.

```yaml
reusable_workflows:
  - name: my-reusable-workflow.yml
    target_url: https://github.com/octo-org/octo-repo
    ref: main
```

--------------------------------

### Set up JDK 11 for x64 with Temurin distribution

Source: https://docs.github.com/en/actions/automating-builds-and-tests/building-and-testing-java-with-gradle

Configure the setup-java action to use JDK 11 from Adoptium (Temurin) on x64 architecture. Use this when you need a specific Java version different from the default OpenJDK 8.

```YAML
steps:
  - uses: actions/checkout@v5
  - name: Set up JDK 11 for x64
    uses: actions/setup-java@v4
    with:
      java-version: '11'
      distribution: 'temurin'
      architecture: x64
```

--------------------------------

### Define Docker Container Inputs with jobs.<job_id>.steps[*].with.args

Source: https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions

Use `args` to pass inputs to a Docker container's `ENTRYPOINT`. This string value is passed directly to the container when it starts.

```yaml
steps:
  - name: Explain why this job ran
    uses: octo-org/action-name@main
    with:
      entrypoint: /bin/echo
      args: The ${{ github.event_name }} event triggered this step.

```

--------------------------------

### Conditionally Start a Service Container in GitHub Actions

Source: https://docs.github.com/en/actions/automating-your-workflow-with-github-actions/workflow-syntax-for-github-actions

This snippet shows how to conditionally start a service by setting its `image` to an empty string based on a workflow option.

```YAML
services:
  nginx:
    image: ${{ options.nginx == true && 'nginx' || '' }}

```

--------------------------------

### Basic GitHub Actions Demo Workflow

Source: https://docs.github.com/en/actions/quickstart

A starter workflow file that triggers on push events and runs multiple steps to display repository context, check out code, and list files. Save this as `github-actions-demo.yml` in the `.github/workflows` directory.

```yaml
name: GitHub Actions Demo
run-name: ${{ github.actor }} is testing out GitHub Actions 🚀
on: [push]
jobs:
  Explore-GitHub-Actions:
    runs-on: ubuntu-latest
    steps:
      - run: echo "🎉 The job was automatically triggered by a ${{ github.event_name }} event."
      - run: echo "🐧 This job is now running on a ${{ runner.os }} server hosted by GitHub!"
      - run: echo "🔎 The name of your branch is ${{ github.ref }} and your repository is ${{ github.repository }}."
      - name: Check out repository code
        uses: actions/checkout@v5
      - run: echo "💡 The ${{ github.repository }} repository has been cloned to the runner."
      - run: echo "🖥️ The workflow is now ready to test your code on the runner."
      - name: List files in the repository
        run: |
          ls ${{ github.workspace }}
      - run: echo "🍏 This job's status is ${{ job.status }}."
```

--------------------------------

### Install Bats Testing Framework in GitHub Actions

Source: https://docs.github.com/en/actions/tutorials/create-an-example-workflow

This snippet demonstrates how to use the `run` keyword in a GitHub Actions workflow to execute a shell command. It installs the `bats` software testing package globally using `npm` on the runner.

```yaml
- run: npm install -g bats
```

--------------------------------

### Define a basic GitHub Actions workflow in YAML

Source: https://docs.github.com/en/actions/tutorials/create-an-example-workflow

This YAML configuration creates a GitHub Actions workflow named 'learn-github-actions'. It triggers on every push to the repository, sets up a job to run on 'ubuntu-latest', checks out the code, installs Node.js v20, globally installs the 'bats' testing framework, and then runs 'bats -v' to verify its installation.

```yaml
name: learn-github-actions
run-name: ${{ github.actor }} is learning GitHub Actions
on: [push]
jobs:
  check-bats-version:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm install -g bats
      - run: bats -v
```

--------------------------------

### Example Caller Workflow Passing Inputs and Secrets

Source: https://docs.github.com/en/actions/how-tos/sharing-automations/reuse-workflows

This example shows a caller workflow that invokes two reusable workflows, one without inputs and another passing an input ('config-path') and a secret ('token').

```yaml
name: Call a reusable workflow

on:
  pull_request:
    branches:
      - main

jobs:
  call-workflow:
    uses: octo-org/example-repo/.github/workflows/workflow-A.yml@v1

  call-workflow-passing-data:
    permissions:
      contents: read
      pull-requests: write
    uses: octo-org/example-repo/.github/workflows/workflow-B.yml@main
    with:
      config-path: .github/labeler.yml
    secrets:
      token: ${{ secrets.GITHUB_TOKEN }}
```

--------------------------------

### Matrix context contents example

Source: https://docs.github.com/en/actions/reference/workflows-and-actions/contexts

Shows the structure of the matrix context for a job running on ubuntu-latest with Node.js 16.

```json
{
  "os": "ubuntu-latest",
  "node": 16
}
```

--------------------------------

### Example Kubernetes Runner Pod Status Output

Source: https://docs.github.com/en/actions/hosting-your-own-runners/managing-self-hosted-runners-with-actions-runner-controller/quickstart-for-actions-runner-controller

Illustrates the expected output when monitoring runner pods, showing a running runner instance.

```text
NAMESPACE     NAME                                                  READY   STATUS    RESTARTS      AGE
arc-runners   arc-runner-set-rmrgw-runner-p9p5n                     1/1     Running   0             21s

```

--------------------------------

### Build npm Packages for Container Hook Scripts

Source: https://docs.github.com/en/actions/hosting-your-own-runners/managing-self-hosted-runners/customizing-the-containers-used-by-jobs

Run these commands to install dependencies and build the Docker and Kubernetes packages, generating the `index.js` files required for customization.

```bash
npm install && npm run bootstrap && npm run build-all
```

--------------------------------

### Specify multiple source files with --source-file-path using pattern matching

Source: https://docs.github.com/en/actions/tutorials/migrate-to-github-actions/automated-migrations/circleci-migration

This example demonstrates using pattern matching to supply multiple source files to the forecast subcommand.

```shell
gh forecast --source-file-path ./tmp/previous_forecast/jobs/*.json
```

--------------------------------

### GitHub Actions Runner Installation Error Messages

Source: https://docs.github.com/en/actions/tutorials/use-actions-runner-controller/troubleshoot

Bash error output showing ARC installation failures due to resource name length constraints. The installation name must not exceed 45 characters and namespace must not exceed 63 characters, as ARC uses these names as labels for other resources.

```bash
Error: INSTALLATION FAILED: execution error at (gha-runner-scale-set/templates/autoscalingrunnerset.yaml:5:5): Name must have up to 45 characters

Error: INSTALLATION FAILED: execution error at (gha-runner-scale-set/templates/autoscalingrunnerset.yaml:8:5): Namespace must have up to 63 characters
```

--------------------------------

### Start the self-hosted runner service

Source: https://docs.github.com/en/actions/how-tos/manage-runners/self-hosted-runners/configure-the-application?platform=windows

Initiates the runner service to begin processing workflow jobs.

```shell
sudo ./svc.sh start


```

```powershell
Start-Service "actions.runner.*"


```

```shell
./svc.sh start


```

--------------------------------

### Configure GitHub Actions Importer credentials interactively

Source: https://docs.github.com/en/actions/tutorials/migrate-to-github-actions/automated-migrations/use-github-actions-importer

Start an interactive prompt to configure credentials for authenticating with GitHub and your CI server. Credentials can alternatively be set via environment variables or .env.local file.

```bash
gh actions-importer configure
```

--------------------------------

### Run command with parameters

Source: https://docs.github.com/en/actions/tutorials/creating-an-example-workflow

Execute a command with parameters on the runner. This example runs the `bats` command with the `-v` flag to output the software version.

```yaml
- run: bats -v
```

--------------------------------

### Create a README.md for the JavaScript action

Source: https://docs.github.com/en/actions/creating-actions/creating-a-javascript-action

Provides a template for documenting the action's inputs, outputs, and a YAML example for workflow integration.

```markdown
# Hello world JavaScript action

This action prints "Hello World" or "Hello" + the name of a person to greet to the log.

## Inputs

### `who-to-greet`

**Required** The name of the person to greet. Default `"World"`.

## Outputs

### `time`

The time we greeted you.

## Example usage

```yaml
uses: actions/hello-world-javascript-action@e76147da8e5c81eaf017dede5645551d4b94427b
with:
  who-to-greet: Mona the Octocat
```

```

```markdown
# Hello world JavaScript action

This action prints "Hello World" or "Hello" + the name of a person to greet to the log.

## Inputs

### `who-to-greet`

**Required** The name of the person to greet. Default `"World"`.

## Outputs

### `time`

The time we greeted you.

## Example usage

```yaml
uses: actions/hello-world-javascript-action@e76147da8e5c81eaf017dede5645551d4b94427b
with:
  who-to-greet: Mona the Octocat
```

```

--------------------------------

### Add 'Hello World' Job Summary (PowerShell)

Source: https://docs.github.com/en/actions/using-workflows/workflow-commands-for-github-actions

Add a 'Hello world!' Markdown heading to the job summary. Use PowerShell syntax to write to the `$env:GITHUB_STEP_SUMMARY` environment file.

```PowerShell
"### Hello world! :rocket:" >> $env:GITHUB_STEP_SUMMARY

```

```PowerShell
"### Hello world! :rocket:" >> $env:GITHUB_STEP_SUMMARY

```

--------------------------------

### Create Azure Web App with PHP Runtime

Source: https://docs.github.com/en/actions/how-tos/deploy/deploy-to-third-party-platforms/php-to-azure-app-service

Command to initialize a web app on Azure with a specified PHP 7.4 runtime version and service plan.

```bash
az webapp create \
    --name MY_WEBAPP_NAME \
    --plan MY_APP_SERVICE_PLAN \
    --resource-group MY_RESOURCE_GROUP \
    --runtime "php|7.4"
```

--------------------------------

### Install Rollup and Plugins for JavaScript Action

Source: https://docs.github.com/en/actions/creating-actions/creating-a-javascript-action

Install development dependencies for bundling a JavaScript action using npm. This command adds Rollup and its necessary plugins to your project.

```bash
npm install --save-dev rollup @rollup/plugin-commonjs @rollup/plugin-node-resolve
```

--------------------------------

### Build with Node.js in Travis CI

Source: https://docs.github.com/en/actions/migrating-to-github-actions/manually-migrating-to-github-actions/migrating-from-travis-ci-to-github-actions

Use the install and script phases to manage dependencies and execute build or test commands.

```yaml
install:
  - npm install
script:
  - npm run build
  - npm test
```

--------------------------------

### Troubleshoot Docker installation and permission errors

Source: https://docs.github.com/en/actions/how-tos/manage-runners/self-hosted-runners/monitor-and-troubleshoot?platform=mac

Common error messages encountered when Docker is missing from the runner or when the service account lacks socket permissions.

```text
[2020-02-13 16:56:10Z INFO DockerCommandManager] Which: 'docker'
[2020-02-13 16:56:10Z INFO DockerCommandManager] Not found.
[2020-02-13 16:56:10Z ERR  StepsRunner] Caught exception from step: System.IO.FileNotFoundException: File not found: 'docker'

```

```text
dial unix /var/run/docker.sock: connect: permission denied

```

--------------------------------

### Example Helm list output

Source: https://docs.github.com/en/actions/hosting-your-own-runners/managing-self-hosted-runners-with-actions-runner-controller/quickstart-for-actions-runner-controller

Shows the expected output format and status for the gha-runner-scale-set-controller and gha-runner-scale-set charts.

```text
NAME            NAMESPACE       REVISION        UPDATED                                 STATUS          CHART                                       APP VERSION
arc             arc-systems     1               2023-04-12 11:45:59.152090536 +0000 UTC deployed        gha-runner-scale-set-controller-0.4.0       0.4.0
arc-runner-set  arc-runners     1               2023-04-12 11:46:13.451041354 +0000 UTC deployed        gha-runner-scale-set-0.4.0                  0.4.0
```

--------------------------------

### Basic CI Workflow Template

Source: https://docs.github.com/en/actions/reference/workflows-and-actions/reusing-workflow-configurations

This example demonstrates a basic CI workflow template named `octo-organization-ci.yml` for a GitHub Actions workflow.

```yaml
name: Octo Organization CI
on:
  push:
    branches: [ $default-branch ]
  pull_request:
    branches: [ $default-branch ]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - name: Run a one-line script
        run: echo Hello from Octo Organization
```

--------------------------------

### Example contents of the needs context

Source: https://docs.github.com/en/actions/reference/accessing-contextual-information-about-workflow-runs

This JSON object illustrates the structure and content of the needs context, showing results and outputs for dependent jobs. It provides an example of how job outputs and results are exposed.

```JSON
{
  "build": {
    "result": "success",
    "outputs": {
      "build_id": "123456"
    }
  },
  "deploy": {
    "result": "failure",
    "outputs": {}
  }
}
```

--------------------------------

### Example: Setting a Multiline Environment Variable in Bash (YAML)

Source: https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-commands?tool=powershell

This YAML example demonstrates how to set a multiline environment variable, such as a JSON response from a curl command, using a custom delimiter in Bash.

```YAML
steps:
  - name: Set the value in bash
    id: step_one
    run: |
      {
        echo 'JSON_RESPONSE<<EOF'
        curl https://example.com
        echo EOF
      } >> "$GITHUB_ENV"
```

--------------------------------

### Lint Ruby Code with RuboCop using GitHub Actions

Source: https://docs.github.com/en/actions/tutorials/build-and-test-code/ruby

This GitHub Actions workflow installs RuboCop and runs it against all files in the repository. It uses the `ruby/setup-ruby` action to set up the Ruby environment and outputs linting errors in GitHub's annotation format for inline display in pull requests.

```yaml
# This workflow uses actions that are not certified by GitHub.
# They are provided by a third-party and are governed by
# separate terms of service, privacy policy, and support
# documentation.

# GitHub recommends pinning actions to a commit SHA.
# To get a newer version, you will need to update the SHA.
# You can also reference a tag or branch, but the action may change without warning.

name: Linting

on: [push]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - uses: ruby/setup-ruby@ec02537da5712d66d4d50a0f33b7ed52773b5ed1
        with:
          ruby-version: '2.6'
      - run: bundle install
      - name: Rubocop
        run: rubocop -f github
```

--------------------------------

### Example: Setting a Multiline Environment Variable in PowerShell (YAML)

Source: https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-commands?tool=powershell

This YAML example shows how to set a multiline environment variable in PowerShell, using a dynamically generated delimiter to capture a web request's content.

```YAML
steps:
  - name: Set the value in pwsh
    id: step_one
    run: |
      $EOF = (New-Guid).Guid
      "JSON_RESPONSE<<$EOF" >> $env:GITHUB_ENV
      (Invoke-WebRequest -Uri "https://example.com").Content >> $env:GITHUB_ENV
      "$EOF" >> $env:GITHUB_ENV
    shell: pwsh
```

--------------------------------

### Log output of unsuccessful script injection

Source: https://docs.github.com/en/actions/reference/security/secure-use

Example log showing how an injection attempt is safely handled when using environment variables.

```shell
   env:
     TITLE: a"; ls $GITHUB_WORKSPACE"
PR title did not start with 'octocat'
```

--------------------------------

### Using inputs Context in Reusable Workflows

Source: https://docs.github.com/en/actions/reference/workflows-and-actions/contexts

Example demonstrating how to use the inputs context in a reusable workflow. Shows how to define input parameters in the workflow_call event configuration and access them within workflow steps.

```APIDOC
## Reusable Workflow with inputs Context

### Description
Example reusable workflow that uses the `inputs` context to access input values passed from a caller workflow.

### Workflow Configuration

```yaml
name: Reusable deploy workflow
on:
  workflow_call:
    inputs:
      build_id:
        required: true
        type: number
      deploy_target:
        required: true
        type: string
      perform_deploy:
        required: true
        type: boolean

jobs:
  deploy:
    runs-on: ubuntu-latest
    if: ${{ inputs.perform_deploy }}
    steps:
      - name: Deploy build to target
        run: echo "Deploying build:${{ inputs.build_id }} to target:${{ inputs.deploy_target }}"
```

### Input Parameters
- **build_id** (number) - Required - Build identifier to deploy
- **deploy_target** (string) - Required - Target deployment system
- **perform_deploy** (boolean) - Required - Flag to control deployment execution

### Usage
Caller workflows pass input values via `jobs.<job_id>.with` when calling this reusable workflow.
```

--------------------------------

### Define Inputs and Outputs in action.yml

Source: https://docs.github.com/en/actions/learn-github-actions/finding-and-customizing-actions

Illustrates how to define required inputs with default values and declare outputs for a custom GitHub Action in its `action.yml` file. This example shows a `file-path` input and a `results-file` output.

```YAML
name: "Example"
description: "Receives file and generates output"
inputs:
  file-path: # id of input
    description: "Path to test script"
    required: true
    default: "test-file.js"
outputs:
  results-file: # id of output
    description: "Path to results file"
```

--------------------------------

### Complete Reusable Workflow Example

Source: https://docs.github.com/en/actions/how-tos/reuse-automations/reuse-workflows

A full example of a reusable workflow file (workflow-B.yml) that accepts a string input and a required secret from the caller workflow, then uses them in the actions/labeler action for automated issue and pull request labeling based on configuration.

```yaml
name: Reusable workflow example

on:
  workflow_call:
    inputs:
      config-path:
        required: true
        type: string
    secrets:
      token:
        required: true

jobs:
  triage:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/labeler@v6
      with:
        repo-token: ${{ secrets.token }}
        configuration-path: ${{ inputs.config-path }}
```

--------------------------------

### Example contents of the runner context

Source: https://docs.github.com/en/actions/reference/accessing-contextual-information-about-workflow-runs

This JSON object represents the runner context for a Linux GitHub-hosted runner.

```json
{
  "os": "Linux",
  "arch": "X64",
  "name": "GitHub Actions 2",
  "tool_cache": "/opt/hostedtoolcache",
  "temp": "/home/runner/work/_temp"
}
```

--------------------------------

### Specify GitHub-hosted Operating System

Source: https://docs.github.com/en/actions/using-jobs/choosing-the-runner-for-a-job

Use `runs-on` to select a GitHub-hosted runner based on its operating system. This example targets the latest Ubuntu version.

```yaml
runs-on: ubuntu-latest

```

--------------------------------

### Configure PostgreSQL Service Container in GitHub Actions Workflow

Source: https://docs.github.com/en/actions/tutorials/use-containerized-services/create-postgresql-service-containers

Complete GitHub Actions workflow that sets up a PostgreSQL service container on an Ubuntu runner, configures health checks, maps port 5432, installs dependencies, and connects to PostgreSQL. The workflow includes checkout, npm installation, and a Node.js script execution step that communicates with the PostgreSQL service using localhost.

```yaml
name: PostgreSQL Service Example
on: push

jobs:
  runner-job:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres
        env:
          POSTGRES_PASSWORD: postgres
        options: >
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
    steps:
      - name: Check out repository code
        uses: actions/checkout@v5
      - name: Install dependencies
        run: npm ci
      - name: Connect to PostgreSQL
        run: node client.js
        env:
          POSTGRES_HOST: localhost
          POSTGRES_PORT: 5432
```

--------------------------------

### Configure GitHub Actions Importer for Bitbucket

Source: https://docs.github.com/en/actions/tutorials/migrate-to-github-actions/automated-migrations/bitbucket-pipelines-migration

Initializes the CLI tool by prompting for GitHub and Bitbucket personal access tokens and instance URLs. This command sets up the environment variables required for subsequent migration tasks.

```shell
gh actions-importer configure
```

```shell
$ gh actions-importer configure
✔ Which CI providers are you configuring?: Bitbucket
Enter the following values (leave empty to omit):
✔ Personal access token for GitHub: ***************
✔ Base url of the GitHub instance: https://github.com
✔ Personal access token for Bitbucket: ********************
✔ Base url of the Bitbucket instance: https://bitbucket.example.com
Environment variables successfully updated.
```

--------------------------------

### Setup Google Cloud CLI in GitHub Actions

Source: https://docs.github.com/en/actions/how-tos/deploy/deploy-to-third-party-platforms/google-kubernetes-engine

Configures the gcloud CLI using `google-github-actions/setup-gcloud`. It authenticates with a service account key and sets the project ID for Google Cloud operations, enabling interaction with GCP services.

```yaml
- uses: google-github-actions/setup-gcloud@1bee7de035d65ec5da40a31f8589e240eba8fde5
      with:
        service_account_key: ${{ secrets.GKE_SA_KEY }}
        project_id: ${{ secrets.GKE_PROJECT }}
```

--------------------------------

### Example contents of the secrets context

Source: https://docs.github.com/en/actions/reference/accessing-contextual-information-about-workflow-runs

Shows the secrets context containing the GITHUB_TOKEN and other available secrets.

```json
{
  "github_token": "***",
  "NPM_TOKEN": "***",
  "SUPERSECRET": "***"
}
```

--------------------------------

### GitHub Actions Workflow - JFrog CLI Setup with OIDC

Source: https://docs.github.com/en/actions/how-tos/secure-your-work/security-harden-deployments/oidc-in-jfrog

YAML workflow configuration for setting up JFrog CLI with OpenID Connect authentication. Includes required permissions (id-token write and contents read), uses the jfrog/setup-jfrog-cli action with OIDC provider configuration, and demonstrates uploading artifacts to JFrog repository without storing credentials.

```yaml
# This workflow uses actions that are not certified by GitHub.
# They are provided by a third-party and are governed by
# separate terms of service, privacy policy, and support
# documentation.
permissions:
  id-token: write
  contents: read

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Set up JFrog CLI with OIDC
        id: setup-jfrog-cli
        uses: jfrog/setup-jfrog-cli@29fa5190a4123350e81e2a2e8d803b2a27fed15e
        with:
          JF_URL: ${{ env.JF_URL }}
          oidc-provider-name: 'YOUR_PROVIDER_NAME'
          oidc-audience: 'YOUR_AUDIENCE' # This is optional

      - name: Upload artifact
        run: jf rt upload "dist/*.zip" my-repo/
```

--------------------------------

### Example YAML configuration file for auditing CircleCI

Source: https://docs.github.com/en/actions/tutorials/migrate-to-github-actions/automated-migrations/circleci-migration

This YAML format specifies multiple source files for auditing, where each repository_slug must be unique.

```yaml
source_files:
  - repository_slug: circle-org-name/circle-project-name
    path: path/to/.circleci/config.yml
  - repository_slug: circle-org-name/some-other-circle-project-name
    path: path/to/.circleci/config.yml
```

--------------------------------

### Example successful migration command output

Source: https://docs.github.com/en/actions/tutorials/migrate-to-github-actions/automated-migrations/gitlab-migration

Shows the output format of a successful `migrate` command execution, including the log file location and the pull request URL created in the target repository.

```shell
$ gh actions-importer migrate gitlab --target-url https://github.com/octo-org/octo-repo --output-dir tmp/migrate --namespace octo-org --project monas-project
[2022-08-20 22:08:20] Logs: 'tmp/migrate/log/actions-importer-20220916-014033.log'
[2022-08-20 22:08:20] Pull request: 'https://github.com/octo-org/octo-repo/pull/1'
```

--------------------------------

### Generate Cache Key with npm Hash

Source: https://docs.github.com/en/actions/using-workflows/caching-dependencies-to-speed-up-workflows

This example demonstrates how to create a cache key using an expression that calculates the SHA-256 hash of the npm package-lock.json file. This ensures a new cache is created when dependencies change.

```yaml
npm-${{ hashFiles('package-lock.json') }}

```

--------------------------------

### Run Maven Verify Phase in GitHub Actions

Source: https://docs.github.com/en/actions/automating-builds-and-tests/building-and-testing-java-with-maven

Specify custom Maven commands or targets to build and test your project. This example runs the `verify` target, which is useful for projects with specific build configurations like `pom-ci.xml`.

```yaml
steps:
  - uses: actions/checkout@v5
  - uses: actions/setup-java@v4
    with:
      java-version: '17'
      distribution: 'temurin'
  - name: Run the Maven verify phase
    run: mvn --batch-mode --update-snapshots verify

```

```yaml
steps:
  - uses: actions/checkout@v5
  - uses: actions/setup-java@v4
    with:
      java-version: '17'
      distribution: 'temurin'
  - name: Run the Maven verify phase
    run: mvn --batch-mode --update-snapshots verify

```

--------------------------------

### Annotated Workflow Structure

Source: https://docs.github.com/en/actions/tutorials/creating-an-example-workflow

A comprehensive example showing the hierarchical structure of a GitHub Actions workflow file with comments.

```yaml
# Optional - The name of the workflow as it will appear in the "Actions" tab of the GitHub repository. If this field is omitted, the name of the workflow file will be used instead.
name: learn-github-actions

# Optional - The name for workflow runs generated from the workflow, which will appear in the list of workflow runs on your repository's "Actions" tab. This example uses an expression with the `github` context to display the username of the actor that triggered the workflow run. For more information, see [AUTOTITLE](/actions/using-workflows/workflow-syntax-for-github-actions#run-name).
run-name: ${{ github.actor }} is learning GitHub Actions

# Specifies the trigger for this workflow. This example uses the `push` event, so a workflow run is triggered every time someone pushes a change to the repository or merges a pull request. This is triggered by a push to every branch; for examples of syntax that runs only on pushes to specific branches, paths, or tags, see [AUTOTITLE](/actions/reference/workflow-syntax-for-github-actions#onpushpull_requestpull_request_targetpathspaths-ignore).
on: [push]

# Groups together all the jobs that run in the `learn-github-actions` workflow.
jobs:

# Defines a job named `check-bats-version`. The child keys will define properties of the job.
  check-bats-version:

# Configures the job to run on the latest version of an Ubuntu Linux runner. This means that the job will execute on a fresh virtual machine hosted by GitHub. For syntax examples using other runners, see [AUTOTITLE](/actions/reference/workflow-syntax-for-github-actions#jobsjob_idruns-on)
    runs-on: ubuntu-latest

# Groups together all the steps that run in the `check-bats-version` job. Each item nested under this section is a separate action or shell script.
    steps:
```

--------------------------------

### Pass Inputs to Reusable Workflows in GitHub Actions

Source: https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions

This example demonstrates how to use the `with` keyword to provide a map of inputs to a called reusable workflow from a job.

```yaml
jobs:
  call-workflow:
    uses: octo-org/example-repo/.github/workflows/called-workflow.yml@main
    with:
      username: mona

```

--------------------------------

### Example `repository_dispatch` Event Payload

Source: https://docs.github.com/en/actions/how-tos/writing-workflows/choosing-what-your-workflow-does/running-variations-of-jobs-in-a-workflow

This JSON payload demonstrates the structure for a `repository_dispatch` event. It includes a `client_payload` with a `versions` array that can be used to dynamically build a matrix.

```json
{
  "event_type": "test",
  "client_payload": {
    "versions": [12, 14, 16]
  }
}
```

--------------------------------

### Install dependencies with Yarn in GitHub Actions

Source: https://docs.github.com/en/actions/automating-builds-and-tests/building-and-testing-nodejs

Uses yarn to install dependencies defined in package.json. Allows updates to yarn.lock based on version constraints.

```YAML
steps:
- uses: actions/checkout@v5
- name: Use Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '20.x'
- name: Install dependencies
  run: yarn
```

--------------------------------

### Configure private npm registry with authentication in GitHub Actions

Source: https://docs.github.com/en/actions/automating-builds-and-tests/building-and-testing-nodejs

Uses setup-node action to create .npmrc file with private registry configuration and authentication token. Requires NODE_AUTH_TOKEN environment variable set from a repository secret.

```YAML
steps:
- uses: actions/checkout@v5
- name: Use Node.js
  uses: actions/setup-node@v4
  with:
    always-auth: true
    node-version: '20.x'
    registry-url: https://registry.npmjs.org
    scope: '@octocat'
- name: Install dependencies
  run: npm ci
  env:
    NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

--------------------------------

### Override Docker Entrypoint for Services in GitHub Actions

Source: https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions

This example demonstrates how to replace the default Docker image's `ENTRYPOINT` for a service, defining a custom executable to run.

```yaml
services:
  etcd:
    image: quay.io/coreos/etcd:v3.5.17
    entrypoint: etcd
    command: >-
      --listen-client-urls http://0.0.0.0:2379
      --advertise-client-urls http://0.0.0.0:2379
    ports:
      - 2379:2379

```

--------------------------------

### Example matrix context object

Source: https://docs.github.com/en/actions/reference/accessing-contextual-information-about-workflow-runs

This JSON object illustrates the `matrix` context for a job executing a specific combination of `os` and `node` properties defined in the workflow's matrix.

```JSON
{
  "os": "ubuntu-latest",
  "node": 16
}

```

--------------------------------

### Passing Inputs to an Action in GitHub Actions Composite Steps

Source: https://docs.github.com/en/actions/creating-actions/metadata-syntax-for-github-actions

This example shows how to pass input parameters to an action using the 'with' keyword within a composite step, defining key/value pairs for the action's inputs.

```yaml
runs:
  using: "composite"
  steps:
    - name: My first step
      uses: actions/hello_world@main
      with:
        first_name: Mona
        middle_name: The
        last_name: Octocat
```

--------------------------------

### Example: Setting and Using an Environment Variable in Bash (YAML)

Source: https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-commands?tool=powershell

This YAML workflow step demonstrates how to set an environment variable using Bash and then access its value in a subsequent step within the same job.

```YAML
steps:
  - name: Set the value
    id: step_one
    run: |
      echo "action_state=yellow" >> "$GITHUB_ENV"
  - name: Use the value
    id: step_two
    run: |
      printf '%s\n' "$action_state" # This will output 'yellow'
```

--------------------------------

### startsWith() Function

Source: https://docs.github.com/en/actions/writing-workflows/choosing-what-your-workflow-does/evaluate-expressions-in-workflows-and-actions

Built-in function to check if a string starts with a specified value. Case-insensitive matching with automatic string casting.

```APIDOC
## startsWith() Function

### Description
Returns `true` when `searchString` starts with `searchValue`. This function is case-insensitive and casts values to strings.

### Syntax
```
startsWith( searchString, searchValue )
```

### Parameters
- **searchString** (string) - Required - The string to search within
- **searchValue** (string) - Required - The value to match at the start

### Example
```
startsWith('Hello world', 'He')
```
**Result**: `true`

### Notes
- Function is not case sensitive
- Values are cast to strings for comparison
```

--------------------------------

### Using inputs Context in Manually Triggered Workflows

Source: https://docs.github.com/en/actions/reference/workflows-and-actions/contexts

Example demonstrating how to use the inputs context in a workflow triggered by the workflow_dispatch event. Shows how to define input parameters and access them within workflow steps.

```APIDOC
## Manually Triggered Workflow with inputs Context

### Description
Example workflow triggered by `workflow_dispatch` event that uses the `inputs` context to access manually provided input values.

### Workflow Configuration

```yaml
on:
  workflow_dispatch:
    inputs:
      build_id:
        required: true
        type: string
      deploy_target:
        required: true
        type: string
      perform_deploy:
        required: true
        type: boolean

jobs:
  deploy:
    runs-on: ubuntu-latest
    if: ${{ inputs.perform_deploy }}
    steps:
      - name: Deploy build to target
        run: echo "Deploying build:${{ inputs.build_id }} to target:${{ inputs.deploy_target }}"
```

### Input Parameters
- **build_id** (string) - Required - Build identifier provided manually
- **deploy_target** (string) - Required - Target deployment system provided manually
- **perform_deploy** (boolean) - Required - Flag to control deployment execution

### Usage
Inputs are provided through the GitHub Actions UI when manually triggering the workflow.
```

--------------------------------

### Example `github` context object

Source: https://docs.github.com/en/actions/reference/accessing-contextual-information-about-workflow-runs

This object shows the structure and typical properties of the `github` context for a `push` event. The contents vary based on the workflow and trigger event.

```json
{
  "token": "***",
  "job": "dump_contexts_to_log",
  "ref": "refs/heads/my_branch",
  "sha": "c27d339ee6075c1f744c5d4b200f7901aad2c369",
  "repository": "octocat/hello-world",
  "repository_owner": "octocat",
  "repositoryUrl": "git://github.com/octocat/hello-world.git",
  "run_id": "1536140711",
  "run_number": "314",
  "retention_days": "90",
  "run_attempt": "1",
  "actor": "octocat",
  "workflow": "Context testing",
  "head_ref": "",
  "base_ref": "",
  "event_name": "push",
  "event": {
    ...
  },
  "server_url": "https://github.com",
  "api_url": "https://api.github.com",
  "graphql_url": "https://api.github.com/graphql",
  "ref_name": "my_branch",
  "ref_protected": false,
  "ref_type": "branch",
  "secret_source": "Actions",
  "workspace": "/home/runner/work/hello-world/hello-world",
  "action": "github_step",
  "event_path": "/home/runner/work/_temp/_github_workflow/event.json",
  "action_repository": "",
  "action_ref": "",
  "path": "/home/runner/work/_temp/_runner_file_commands/add_path_b037e7b5-1c88-48e2-bf78-eaaab5e02602",
  "env": "/home/runner/work/_temp/_runner_file_commands/set_env_b037e7b5-1c88-48e2-bf78-eaaab5e02602"
}
```

--------------------------------

### Install Actions Runner Controller Helm chart

Source: https://docs.github.com/en/actions/hosting-your-own-runners/managing-self-hosted-runners-with-actions-runner-controller/quickstart-for-actions-runner-controller

Installs the latest version of the ARC Helm chart into a specified namespace. Set NAMESPACE to your desired location for operator pods; the namespace must have access to the Kubernetes API server. Use the --version argument to install a specific chart version instead of the latest.

```bash
NAMESPACE="arc-systems"
helm install arc \
    --namespace "${NAMESPACE}" \
    --create-namespace \
    oci://ghcr.io/actions/actions-runner-controller-charts/gha-runner-scale-set-controller
```

--------------------------------

### Make entrypoint.sh executable

Source: https://docs.github.com/en/actions/creating-actions/dockerfile-support-for-github-actions

Grant execute permissions to the entrypoint.sh file so it can be run by the Docker container.

```shell
chmod +x entrypoint.sh
```

--------------------------------

### Define container image using shorthand syntax

Source: https://docs.github.com/en/actions/how-tos/write-workflows/choose-where-workflows-run/run-jobs-in-a-container

Demonstrates the simplified syntax for specifying a container image when additional configuration options like environment variables or volumes are not required.

```yaml
jobs:
  container-test-job:
    runs-on: ubuntu-latest
    container: node:18
```

--------------------------------

### Example: Stop and Resume Workflow Commands (Ubuntu)

Source: https://docs.github.com/en/actions/writing-workflows/choosing-what-your-workflow-does/workflow-commands-for-github-actions

This YAML workflow demonstrates how to stop and resume workflow command processing on an Ubuntu runner, preventing specific log lines from being interpreted as commands.

```yaml
jobs:
  workflow-command-job:
    runs-on: ubuntu-latest
    steps:
      - name: Disable workflow commands
        run: |
          echo '::warning:: This is a warning message, to demonstrate that commands are being processed.'
          stopMarker=$(uuidgen)
          echo "::stop-commands::$stopMarker"
          echo '::warning:: This will NOT be rendered as a warning, because stop-commands has been invoked.'
          echo "::$stopMarker::"
          echo '::warning:: This is a warning again, because stop-commands has been turned off.'
```

--------------------------------

### Configure Go dependency caching with setup-go

Source: https://docs.github.com/en/actions/tutorials/build-and-test-code/go

Configures the setup-go action to cache dependencies using a custom path for the go.sum file. This is useful when dependency files are located in subdirectories or when multiple files are present.

```yaml
      - name: Setup Go
        uses: actions/setup-go@v5
        with:
          go-version: '1.17'
          cache-dependency-path: subdir/go.sum
```

--------------------------------

### Install dependencies with Yarn frozen lockfile in GitHub Actions

Source: https://docs.github.com/en/actions/automating-builds-and-tests/building-and-testing-nodejs

Uses yarn --frozen-lockfile to install exact versions from yarn.lock and prevent lock file updates.

```YAML
steps:
- uses: actions/checkout@v5
- name: Use Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '20.x'
- name: Install dependencies
  run: yarn --frozen-lockfile
```

--------------------------------

### jobs.<job_id>.steps[*].with.args - Docker Container Arguments

Source: https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax

Define input arguments for Docker container actions. Arguments are passed to the container's ENTRYPOINT when the container starts. Must be a single string; arrays are not supported.

```APIDOC
## jobs.<job_id>.steps[*].with.args

### Description
Defines the inputs for a Docker container. GitHub passes the args to the container's ENTRYPOINT when the container starts up.

### Type
`string` - Single argument string (arrays are not supported)

### Parameters
- **args** (string) - Required - Arguments passed to container ENTRYPOINT. Arguments with spaces must be surrounded by double quotes.

### Syntax
```yaml
with:
  args: <argument_string>
```

### Example
```yaml
steps:
  - name: Explain why this job ran
    uses: octo-org/action-name@main
    with:
      entrypoint: /bin/echo
      args: The ${{ github.event_name }} event triggered this step.
```

### Dockerfile CMD Guidelines
If you use CMD in your Dockerfile, follow these guidelines in order of preference:

1. Document required arguments in the action's README and omit them from the CMD instruction.
2. Use defaults that allow using the action without specifying any args.
3. If the action exposes a --help flag or similar, use that as the default to make your action self-documenting.

### Notes
- Array of strings is not supported
- Arguments with spaces must use double quotes
- Args replace the CMD instruction in Dockerfile
```

--------------------------------

### Add 'Hello World' Markdown to Job Summary

Source: https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-commands?tool=powershell

Provides a simple example of adding a 'Hello world!' message with a rocket emoji to the job summary using Markdown.

```Bash
echo "### Hello world! :rocket:" >> $GITHUB_STEP_SUMMARY
```

```PowerShell
"### Hello world! :rocket:" >> $env:GITHUB_STEP_SUMMARY
```

--------------------------------

### Example `env` context object

Source: https://docs.github.com/en/actions/reference/accessing-contextual-information-about-workflow-runs

This object illustrates the structure of the `env` context, mapping variable names to their values. The contents are dynamic and depend on where it's accessed in the workflow.

```json
{
  "first_name": "Mona",
  "super_duper_var": "totally_awesome"
}
```

--------------------------------

### Expand matrix configurations with include

Source: https://docs.github.com/en/actions/automating-your-workflow-with-github-actions/workflow-syntax-for-github-actions

Use `include` to add variables to specific matrix combinations without overwriting original values. In this example, npm version 6 is added only to the windows-latest/node-16 combination.

```yaml
jobs:
  example_matrix:
    strategy:
      matrix:
        os: [windows-latest, ubuntu-latest]
        node: [14, 16]
        include:
          - os: windows-latest
            node: 16
            npm: 6
    runs-on: ${{ matrix.os }}
    steps:
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node }}
      - if: ${{ matrix.npm }}
        run: npm install -g npm@${{ matrix.npm }}
      - run: npm --version
```

--------------------------------

### Example Output of Actions Importer Update Command

Source: https://docs.github.com/en/actions/tutorials/migrate-to-github-actions/automated-migrations/circleci-migration

Illustrates the expected output when the GitHub Actions Importer update command successfully checks for and confirms the latest container image.

```shell
Updating ghcr.io/actions-importer/cli:latest...
ghcr.io/actions-importer/cli:latest up-to-date
```

--------------------------------

### Example `config.yml` format for auditing source files

Source: https://docs.github.com/en/actions/tutorials/migrate-to-github-actions/automated-migrations/gitlab-migration

This YAML snippet shows the required format for a configuration file used with `--config-file-path` for auditing, specifying source files and their repository slugs.

```yaml
source_files:
  - repository_slug: namespace/project-name
    path: path/to/.gitlab-ci.yml
  - repository_slug: namespace/some-other-project-name
    path: path/to/.gitlab-ci.yml
```

--------------------------------

### Build and Test Node.js with npm in GitHub Actions

Source: https://docs.github.com/en/actions/tutorials/build-and-test-code/nodejs

Defines a standard CI workflow using npm to install dependencies, build the project, and run tests. It utilizes the actions/setup-node action to specify the Node.js version environment.

```yaml
steps:
- uses: actions/checkout@v5
- name: Use Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '20.x'
- run: npm install
- run: npm run build --if-present
- run: npm test
```

--------------------------------

### Multiple Workflows Trigger Example

Source: https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows

Configure a workflow to trigger when any of multiple specified workflows complete. Demonstrates how to chain multiple workflows together.

```APIDOC
## Multiple Workflows Trigger

### Description
A workflow run is triggered when any one of multiple specified workflows completes. Only one of the workflows needs to run to trigger the event.

### Configuration Example
```yaml
on:
  workflow_run:
    workflows: [Staging, Lab]
    types:
      - completed
```

### Explanation
- **workflows**: Lists multiple workflows ("Staging" and "Lab")
- The configured workflow runs when either "Staging" OR "Lab" completes
- Only one workflow needs to complete to trigger the event
```

--------------------------------

### Configure WireGuard in GitHub Actions Workflow

Source: https://docs.github.com/en/actions/how-tos/manage-runners/github-hosted-runners/connect-to-a-private-network/connect-with-wireguard

This GitHub Actions workflow demonstrates how to configure WireGuard on an 'ubuntu-latest' runner to establish a connection to a private service. It involves installing WireGuard, securely using a private key from GitHub Secrets, setting up the WireGuard interface ('wg0') with an overlay IP, configuring the peer with its public key and endpoint, and bringing the interface up. Finally, it attempts to curl the private service's overlay IP.

```yaml
name: WireGuard example

on:
  workflow_dispatch:

jobs:
  wireguard_example:
    runs-on: ubuntu-latest
    steps:
      - run: sudo apt install wireguard

      - run: echo "${{ secrets.WIREGUARD_PRIVATE_KEY }}" > privatekey

      - run: sudo ip link add dev wg0 type wireguard

      - run: sudo ip address add dev wg0 192.168.1.2 peer 192.168.1.1

      - run: sudo wg set wg0 listen-port 48123 private-key privatekey peer examplepubkey1234... allowed-ips 0.0.0.0/0 endpoint 1.2.3.4:56789

      - run: sudo ip link set up dev wg0

      - run: curl -vvv http://192.168.1.1
```

--------------------------------

### Test composite action in a workflow file

Source: https://docs.github.com/en/actions/creating-actions/creating-a-composite-action

Example workflow configuration to call the composite action using a specific SHA and handle its outputs.

```yaml
on: [push]

jobs:
  hello_world_job:
    runs-on: ubuntu-latest
    name: A job to say hello
    steps:
      - uses: actions/checkout@v5
      - id: foo
        uses: OWNER/hello-world-composite-action@SHA
        with:
          who-to-greet: 'Mona the Octocat'
      - run: echo random-number "$RANDOM_NUMBER"
        shell: bash
        env:
          RANDOM_NUMBER: ${{ steps.foo.outputs.random-number }}

```

```yaml
on: [push]

jobs:
  hello_world_job:
    runs-on: ubuntu-latest
    name: A job to say hello
    steps:
      - uses: actions/checkout@v5
      - id: foo
        uses: OWNER/hello-world-composite-action@SHA
        with:
          who-to-greet: 'Mona the Octocat'
      - run: echo random-number "$RANDOM_NUMBER"
        shell: bash
        env:
          RANDOM_NUMBER: ${{ steps.foo.outputs.random-number }}

```

--------------------------------

### Shell Script Argument Expansion

Source: https://docs.github.com/en/actions/reference/workflows-and-actions/dockerfile-support

A shell script example for an entrypoint that utilizes $# to count arguments and $@ to iterate through provided argument values.

```shell
# `$#` expands to the number of arguments and `$@` expands to the supplied `args`\nprintf '%d args:' "$#"\nprintf " '%s'" "$@"\nprintf '\n'
```

--------------------------------

### Example OIDC Token with Custom Properties

Source: https://docs.github.com/en/actions/reference/security/oidc

This example shows an OIDC token payload including custom 'business_unit' and 'workspace_id' properties. These properties can be used in cloud provider trust policies.

```json
{
  "sub": "repo:my-org/my-repo:ref:refs/heads/main",
  "aud": "https://github.com/my-org",
  "repository": "my-org/my-repo",
  "repo_property_business_unit": "payments",
  "repo_property_workspace_id": "ws-abc123"
}
```

--------------------------------

### Make entrypoint.sh Executable with Git

Source: https://docs.github.com/en/actions/creating-actions/creating-a-docker-container-action

Use these Git commands to add the `entrypoint.sh` file and set its executable permission. This ensures the script can run within the Docker container.

```Shell
git add entrypoint.sh
git update-index --chmod=+x entrypoint.sh

```

--------------------------------

### Configure GitHub Actions Importer Credentials File (YAML)

Source: https://docs.github.com/en/actions/migrating-to-github-actions/automated-migrations/supplemental-arguments-and-settings

Example of a YAML credentials file for GitHub Actions Importer, specifying access tokens for different GitHub instances and a Jenkins server, with URL-specific token matching.

```yaml
- url: https://github.com
  access_token: ghp_mygeneraltoken
- url: https://github.com/specific_org/
  access_token: ghp_myorgspecifictoken
- url: https://jenkins.org
  access_token: abc123
  username: marty_mcfly
```

--------------------------------

### Dynamic Runner Selection with Workflow Inputs

Source: https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions

Shows how to use workflow dispatch inputs to dynamically select the runner environment at workflow execution time. This example allows users to choose between Ubuntu and macOS runners.

```APIDOC
## Dynamic Runner Selection

### Description
Use workflow dispatch inputs to dynamically select the runner environment when manually triggering a workflow.

### Configuration
```yaml
on:
  workflow_dispatch:
    inputs:
      chosen-os:
        required: true
        type: choice
        options:
        - Ubuntu
        - macOS

jobs:
  test:
    runs-on: [self-hosted, "${{ inputs.chosen-os }}"]
    steps:
    - run: echo Hello world!
```

### Key Properties
- **workflow_dispatch** - Enables manual workflow triggering
- **inputs** - Defines input parameters for the workflow
- **chosen-os** - Input variable with choice type
- **required: true** - Makes the input mandatory
- **options** - Available choices for the input
- **runs-on** - Uses the selected input value in runner selection

### Behavior
When the workflow is manually triggered, the user selects an OS option which is then used to determine the runner environment.
```

--------------------------------

### Example OIDC Token Structure

Source: https://docs.github.com/en/actions/concepts/security/openid-connect

This YAML represents an example OIDC token, showing its header and payload claims, including the subject ("sub") which identifies the repository and environment.

```yaml
{
  "typ": "JWT",
  "alg": "RS256",
  "x5t": "example-thumbprint",
  "kid": "example-key-id"
}
{
  "jti": "example-id",
  "sub": "repo:octo-org/octo-repo:environment:prod",
  "environment": "prod",
  "aud": "https://github.com/octo-org",
  "ref": "refs/heads/main",
  "sha": "example-sha",
  "repository": "octo-org/octo-repo",
  "repository_owner": "octo-org",
  "actor_id": "12",
  "repository_visibility": "private",
  "repository_id": "74",
  "repository_owner_id": "65",
  "run_id": "example-run-id",
  "run_number": "10",
  "run_attempt": "2",
  "runner_environment": "github-hosted",
  "actor": "octocat",
  "workflow": "example-workflow",
  "head_ref": "",
  "base_ref": "",
  "event_name": "workflow_dispatch",
  "repo_property_workspace_id": "ws-abc123",
  "ref_type": "branch",
  "job_workflow_ref": "octo-org/octo-automation/.github/workflows/oidc.yml@refs/heads/main",
  "iss": "https://token.actions.githubusercontent.com",
  "nbf": 1632492967,
  "exp": 1632493867,
  "iat": 1632493567
}
```

--------------------------------

### Workflow steps for environment variables

Source: https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-commands?tool=bash

Demonstrates setting a variable in one step and accessing it in a subsequent step. Note that default variables starting with GITHUB_ or RUNNER_ cannot be overwritten.

```yaml
steps:
  - name: Set the value
    id: step_one
    run: |
      echo "action_state=yellow" >> "$GITHUB_ENV"
  - name: Use the value
    id: step_two
    run: |
      printf '%s\n' "$action_state" # This will output 'yellow'

```

```yaml
steps:
  - name: Set the value
    id: step_one
    run: |
      echo "action_state=yellow" >> "$GITHUB_ENV"
  - name: Use the value
    id: step_two
    run: |
      printf '%s\n' "$action_state" # This will output 'yellow'

```

```yaml
steps:
  - name: Set the value
    id: step_one
    run: |
      "action_state=yellow" >> $env:GITHUB_ENV
  - name: Use the value
    id: step_two
    run: |
      Write-Output "$env:action_state" # This will output 'yellow'

```

```yaml
steps:
  - name: Set the value
    id: step_one
    run: |
      "action_state=yellow" >> $env:GITHUB_ENV
  - name: Use the value
    id: step_two
    run: |
      Write-Output "$env:action_state" # This will output 'yellow'

```

--------------------------------

### Example strategy context object

Source: https://docs.github.com/en/actions/reference/accessing-contextual-information-about-workflow-runs

This JSON object shows the structure and values of the `strategy` context for a job in a matrix with four jobs, specifically from the final job. Note the zero-based `job-index` and non-zero-based `job-total`.

```JSON
{
  "fail-fast": true,
  "job-index": 3,
  "job-total": 4,
  "max-parallel": 4
}

```

--------------------------------

### Shell Script Entrypoint with POSIX Shebang

Source: https://docs.github.com/en/actions/reference/workflows-and-actions/dockerfile-support

Example entrypoint.sh shell script for use with GitHub Actions Docker containers. Includes the POSIX-compliant shebang (#!/bin/sh) at the top to explicitly specify the system shell. This script receives arguments from the action's metadata file and can properly handle environment variable substitution.

```shell
#!/bin/sh
```

--------------------------------

### Format String with Placeholders

Source: https://docs.github.com/en/actions/learn-github-actions/expressions

Demonstrates how to use the 'format' function for string interpolation with multiple arguments.

```Expression
format('Hello {0} {1} {2}', 'Mona', 'the', 'Octocat')
```

--------------------------------

### Define and Use Job Outputs in GitHub Actions YAML

Source: https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax

This example shows how to define outputs for a job and then access those outputs in a dependent job using the `needs` context.

```yaml
jobs:
  job1:
    runs-on: ubuntu-latest
    # Map a step output to a job output
    outputs:
      output1: ${{ steps.step1.outputs.test }}
      output2: ${{ steps.step2.outputs.test }}
    steps:
      - id: step1
        run: echo "test=hello" >> "$GITHUB_OUTPUT"
      - id: step2
        run: echo "test=world" >> "$GITHUB_OUTPUT"
  job2:
    runs-on: ubuntu-latest
    needs: job1
    steps:
      - env:
          OUTPUT1: ${{needs.job1.outputs.output1}}
          OUTPUT2: ${{needs.job1.outputs.output2}}
        run: echo "$OUTPUT1 $OUTPUT2"
```

--------------------------------

### Basic GitHub Actions Workflow with Node.js and Bats

Source: https://docs.github.com/en/actions/tutorials/creating-an-example-workflow

A complete workflow file that triggers on push events, sets up Node.js 20, installs bats globally, and runs bats version check. Store this as `.github/workflows/learn-github-actions.yml` in your repository.

```YAML
name: learn-github-actions
run-name: ${{ github.actor }} is learning GitHub Actions
on: [push]
jobs:
  check-bats-version:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm install -g bats
      - run: bats -v
```

--------------------------------

### Build and Test .NET Code with GitHub Actions

Source: https://docs.github.com/en/actions/tutorials/build-and-test-code/net

This GitHub Actions workflow shows how to build and test a .NET project. It uses `dotnet restore` to install dependencies, `dotnet build` to compile the project without restoring again, and `dotnet test` to run unit tests without rebuilding.

```yaml
steps:
- uses: actions/checkout@v5
- name: Setup dotnet
  uses: actions/setup-dotnet@v4
  with:
    dotnet-version: '6.0.x'
- name: Install dependencies
  run: dotnet restore
- name: Build
  run: dotnet build --no-restore
- name: Test with the dotnet CLI
  run: dotnet test --no-build
```

--------------------------------

### Install ARC runner scale set using Helm

Source: https://docs.github.com/en/actions/hosting-your-own-runners/managing-self-hosted-runners-with-actions-runner-controller/using-actions-runner-controller-runners-in-a-workflow

Deploy a runner scale set using a Personal Access Token (PAT) for authentication. Ensure the INSTALLATION_NAME matches the target in your workflow file.

```bash
# Using a Personal Access Token (PAT)
INSTALLATION_NAME="arc-runner-set"
NAMESPACE="arc-runners"
GITHUB_CONFIG_URL="https://github.com/<your_enterprise/org/repo>"
GITHUB_PAT="<PAT>"
helm install "${INSTALLATION_NAME}" \
    --namespace "${NAMESPACE}" \
    --create-namespace \
    --set githubConfigUrl="${GITHUB_CONFIG_URL}" \
    --set githubConfigSecret.github_token="${GITHUB_PAT}" \
    oci://ghcr.io/actions/actions-runner-controller-charts/gha-runner-scale-set

```

--------------------------------

### prepare_job Response Output JSON

Source: https://docs.github.com/en/actions/hosting-your-own-runners/managing-self-hosted-runners/customizing-the-containers-used-by-jobs

Example output structure returned by prepare_job command containing network state, container IDs, service containers, and execution context including container network configuration and Alpine detection.

```json
{
  "state": {
    "network": "example_network_53269bd575972817b43f7733536b200c",
    "jobContainer": "82e8219701fe096a35941d869cf3d71af1d943b5d8bdd718857fb87ac3042480",
    "serviceContainers": {
      "redis": "60972d9aa486605e66b0dad4abb678dc3d9116f536579e418176eedb8abb9105"
    }
  },
  "context": {
    "container": {
      "id": "82e8219701fe096a35941d869cf3d71af1d943b5d8bdd718857fb87ac3042480",
      "network": "example_network_53269bd575972817b43f7733536b200c"
    },
    "services": {
      "redis": {
        "id": "60972d9aa486605e66b0dad4abb678dc3d9116f536579e418176eedb8abb9105",
        "ports": {
          "8080": "8080"
        },
        "network": "example_network_53269bd575972817b43f7733536b200c"
      }
    },
    "isAlpine": true
  }
}
```

```json
{
  "state": {
    "network": "example_network_53269bd575972817b43f7733536b200c",
    "jobContainer": "82e8219701fe096a35941d869cf3d71af1d943b5d8bdd718857fb87ac3042480",
    "serviceContainers": {
      "redis": "60972d9aa486605e66b0dad4abb678dc3d9116f536579e418176eedb8abb9105"
    }
  },
  "context": {
    "container": {
      "id": "82e8219701fe096a35941d869cf3d71af1d943b5d8bdd718857fb87ac3042480",
      "network": "example_network_53269bd575972817b43f7733536b200c"
    },
    "services": {
      "redis": {
        "id": "60972d9aa486605e66b0dad4abb678dc3d9116f536579e418176eedb8abb9105",
        "ports": {
          "8080": "8080"
        },
        "network": "example_network_53269bd575972817b43f7733536b200c"
      }
    },
    "isAlpine": true
  }
}
```

--------------------------------

### Setting default run step options for a job in YAML

Source: https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax

This example demonstrates how to define default `shell` and `working-directory` for all `run` steps within a specific job in a GitHub Actions workflow.

```yaml
jobs:
  job1:
    runs-on: ubuntu-latest
    defaults:
      run:
        shell: bash
        working-directory: ./scripts
```

--------------------------------

### POST prepare_job - Initialize Job Container

Source: https://docs.github.com/en/actions/how-tos/manage-runners/self-hosted-runners/customize-containers

Prepares and initializes a job container with networking, volumes, environment variables, and service containers. This command sets up the complete execution environment for a GitHub Actions job including the primary job container and any dependent service containers.

```APIDOC
## POST prepare_job

### Description
Initializes a job container environment with networking, volume mounts, environment variables, and service containers. Returns container IDs and network configuration for use in subsequent commands.

### Method
POST

### Parameters

#### Request Body
- **command** (string) - Required - Must be "prepare_job"
- **responseFile** (string) - Required - File path where response will be written (e.g., "/users/octocat/runner/_work/{guid}.json")
- **state** (object) - Required - Current state object (typically empty for initial preparation)
- **args** (object) - Required - Job configuration arguments
  - **jobContainer** (object) - Required - Primary job container configuration
    - **image** (string) - Required - Docker image URI (e.g., "node:18")
    - **workingDirectory** (string) - Required - Container working directory path
    - **createOptions** (string) - Optional - Docker create options (e.g., "--cpus 1")
    - **environmentVariables** (object) - Optional - Environment variables as key-value pairs
    - **userMountVolumes** (array) - Optional - User-defined volume mounts
      - **sourceVolumePath** (string) - Required - Source volume path
      - **targetVolumePath** (string) - Required - Target mount path in container
      - **readOnly** (boolean) - Required - Whether volume is read-only
    - **systemMountVolumes** (array) - Optional - System volume mounts
      - **sourceVolumePath** (string) - Required - Source volume path
      - **targetVolumePath** (string) - Required - Target mount path in container
      - **readOnly** (boolean) - Required - Whether volume is read-only
    - **registry** (object) - Optional - Docker registry credentials
      - **username** (string) - Required - Registry username
      - **password** (string) - Required - Registry password
      - **serverUrl** (string) - Required - Registry server URL
    - **portMappings** (object) - Optional - Port mappings (source: target)
  - **services** (array) - Optional - Service containers configuration
    - **contextName** (string) - Required - Service context name
    - **image** (string) - Required - Docker image URI
    - **createOptions** (string) - Optional - Docker create options
    - **environmentVariables** (object) - Optional - Environment variables
    - **userMountVolumes** (array) - Optional - Volume mounts
    - **portMappings** (object) - Optional - Port mappings
    - **registry** (object) - Optional - Registry credentials

### Request Example
```json
{
  "command": "prepare_job",
  "responseFile": "/users/octocat/runner/_work/{guid}.json",
  "state": {},
  "args": {
    "jobContainer": {
      "image": "node:18",
      "workingDirectory": "/__w/octocat-test2/octocat-test2",
      "createOptions": "--cpus 1",
      "environmentVariables": {
        "NODE_ENV": "development"
      },
      "userMountVolumes": [
        {
          "sourceVolumePath": "my_docker_volume",
          "targetVolumePath": "/volume_mount",
          "readOnly": false
        }
      ],
      "systemMountVolumes": [
        {
          "sourceVolumePath": "/home/octocat/git/runner/_layout/_work",
          "targetVolumePath": "/__w",
          "readOnly": false
        },
        {
          "sourceVolumePath": "/home/octocat/git/runner/_layout/externals",
          "targetVolumePath": "/__e",
          "readOnly": true
        },
        {
          "sourceVolumePath": "/home/octocat/git/runner/_layout/_work/_temp",
          "targetVolumePath": "/__w/_temp",
          "readOnly": false
        },
        {
          "sourceVolumePath": "/home/octocat/git/runner/_layout/_work/_actions",
          "targetVolumePath": "/__w/_actions",
          "readOnly": false
        },
        {
          "sourceVolumePath": "/home/octocat/git/runner/_layout/_work/_tool",
          "targetVolumePath": "/__w/_tool",
          "readOnly": false
        },
        {
          "sourceVolumePath": "/home/octocat/git/runner/_layout/_work/_temp/_github_home",
          "targetVolumePath": "/github/home",
          "readOnly": false
        },
        {
          "sourceVolumePath": "/home/octocat/git/runner/_layout/_work/_temp/_github_workflow",
          "targetVolumePath": "/github/workflow",
          "readOnly": false
        }
      ],
      "registry": {
        "username": "octocat",
        "password": "examplePassword",
        "serverUrl": "https://index.docker.io/v1"
      },
      "portMappings": { "80": "801" }
    },
    "services": [
      {
        "contextName": "redis",
        "image": "redis",
        "createOptions": "--cpus 1",
        "environmentVariables": {},
        "userMountVolumes": [],
        "portMappings": { "80": "801" },
        "registry": {
          "username": "octocat",
          "password": "examplePassword",
          "serverUrl": "https://index.docker.io/v1"
        }
      }
    ]
  }
}
```

### Response

#### Success Response (200)
Response is written to the file specified in responseFile parameter.

- **state** (object) - Container and network state information
  - **network** (string) - Network identifier
  - **jobContainer** (string) - Job container ID
  - **serviceContainers** (object) - Service container IDs by context name
- **context** (object) - Runtime context information
  - **container** (object) - Job container context
    - **id** (string) - Container ID
    - **network** (string) - Network identifier
  - **services** (object) - Service container contexts by name
    - **id** (string) - Service container ID
    - **ports** (object) - Port mappings
    - **network** (string) - Network identifier
  - **isAlpine** (boolean) - Whether container is Alpine Linux

#### Response Example
```json
{
  "state": {
    "network": "example_network_53269bd575972817b43f7733536b200c",
    "jobContainer": "82e8219701fe096a35941d869cf3d71af1d943b5d8bdd718857fb87ac3042480",
    "serviceContainers": {
      "redis": "60972d9aa486605e66b0dad4abb678dc3d9116f536579e418176eedb8abb9105"
    }
  },
  "context": {
    "container": {
      "id": "82e8219701fe096a35941d869cf3d71af1d943b5d8bdd718857fb87ac3042480",
      "network": "example_network_53269bd575972817b43f7733536b200c"
    },
    "services": {
      "redis": {
        "id": "60972d9aa486605e66b0dad4abb678dc3d9116f536579e418176eedb8abb9105",
        "ports": {
          "8080": "8080"
        },
        "network": "example_network_53269bd575972817b43f7733536b200c"
      }
    },
    "isAlpine": true
  }
}
```
```

--------------------------------

### GitHub Actions Job Dependencies

Source: https://docs.github.com/en/actions/migrating-to-github-actions/manually-migrating-to-github-actions/migrating-from-azure-pipelines-to-github-actions

This example demonstrates how to define job dependencies using the 'needs' key in GitHub Actions to ensure jobs run in a specific sequence.

```yaml
jobs:
  initial:
    runs-on: ubuntu-latest
    steps:
      - run: echo "This job will be run first."
  fanout1:
    runs-on: ubuntu-latest
    needs: initial
    steps:
      - run: echo "This job will run after the initial job, in parallel with fanout2."
  fanout2:
    runs-on: ubuntu-latest
    needs: initial
    steps:
      - run: echo "This job will run after the initial job, in parallel with fanout1."
  fanin:
    runs-on: ubuntu-latest
    needs: [fanout1, fanout2]
    steps:
      - run: echo "This job will run after fanout1 and fanout2 have finished."
```

--------------------------------

### Example: Setting and Using an Environment Variable in PowerShell (YAML)

Source: https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-commands?tool=powershell

This YAML workflow step shows how to set an environment variable using PowerShell and then retrieve its value in a later step within the same job.

```YAML
steps:
  - name: Set the value
    id: step_one
    run: |
      "action_state=yellow" >> $env:GITHUB_ENV
  - name: Use the value
    id: step_two
    run: |
      Write-Output "$env:action_state" # This will output 'yellow'
```

--------------------------------

### Example: Stop and Resume Workflow Commands (Windows)

Source: https://docs.github.com/en/actions/writing-workflows/choosing-what-your-workflow-does/workflow-commands-for-github-actions

This YAML workflow demonstrates how to stop and resume workflow command processing on a Windows runner, preventing specific log lines from being interpreted as commands.

```yaml
jobs:
  workflow-command-job:
    runs-on: windows-latest
    steps:
      - name: Disable workflow commands
        run: |
          Write-Output '::warning:: This is a warning message, to demonstrate that commands are being processed.'
          $stopMarker = New-Guid
          Write-Output "::stop-commands::$stopMarker"
          Write-Output '::warning:: This will NOT be rendered as a warning, because stop-commands has been invoked.'
          Write-Output "::$stopMarker::"
          Write-Output '::warning:: This is a warning again, because stop-commands has been turned off.'
```

--------------------------------

### Example jobs context from a reusable workflow

Source: https://docs.github.com/en/actions/reference/accessing-contextual-information-about-workflow-runs

This JSON object shows the structure of the jobs context, containing the result and outputs of a job named example_job from a reusable workflow.

```json
{
  "example_job": {
    "result": "success",
    "outputs": {
      "output1": "hello",
      "output2": "world"
    }
  }
}
```

--------------------------------

### Override etcd entrypoint and command in GitHub Actions

Source: https://docs.github.com/en/actions/using-containerized-services/about-service-containers

Combine entrypoint and command keys to redefine the service's startup behavior and provide multi-line arguments.

```yaml
services:
  etcd:
    image: quay.io/coreos/etcd:v3.5.17
    entrypoint: etcd
    command: >-
      --listen-client-urls http://0.0.0.0:2379
      --advertise-client-urls http://0.0.0.0:2379
    ports:
      - 2379:2379

```

```yaml
services:
  etcd:
    image: quay.io/coreos/etcd:v3.5.17
    entrypoint: etcd
    command: >-
      --listen-client-urls http://0.0.0.0:2379
      --advertise-client-urls http://0.0.0.0:2379
    ports:
      - 2379:2379

```

--------------------------------

### Configure workflow steps for service interaction in YAML

Source: https://docs.github.com/en/actions/using-containerized-services/creating-redis-service-containers

Defines steps to check out code, install dependencies, and execute a script that connects to a Redis service via environment variables.

```yaml
steps:
  # Downloads a copy of the code in your repository before running CI tests
  - name: Check out repository code
    uses: actions/checkout@v5

  # Performs a clean installation of all dependencies in the `package.json` file
  # For more information, see https://docs.npmjs.com/cli/ci.html
  - name: Install dependencies
    run: npm ci

  - name: Connect to Redis
    # Runs a script that creates a Redis client, populates
    # the client with data, and retrieves data
    run: node client.js
    # Environment variable used by the `client.js` script to create a new Redis client.
    env:
      # The hostname used to communicate with the Redis service container
      REDIS_HOST: redis
      # The default Redis port
      REDIS_PORT: 6379
```

```yaml
steps:
  # Downloads a copy of the code in your repository before running CI tests
  - name: Check out repository code
    uses: actions/checkout@v5

  # Performs a clean installation of all dependencies in the `package.json` file
  # For more information, see https://docs.npmjs.com/cli/ci.html
  - name: Install dependencies
    run: npm ci

  - name: Connect to Redis
    # Runs a script that creates a Redis client, populates
    # the client with data, and retrieves data
    run: node client.js
    # Environment variable used by the `client.js` script to create a new Redis client.
    env:
      # The hostname used to communicate with the Redis service container
      REDIS_HOST: redis
      # The default Redis port
      REDIS_PORT: 6379
```

--------------------------------

### Scale Set values.yml with Certificate Volume

Source: https://docs.github.com/en/actions/hosting-your-own-runners/managing-self-hosted-runners-with-actions-runner-controller/authenticating-to-the-github-api

Example scale set values.yml configuration showing how to mount the certificate volume to the listener container at /akv path for vault authentication.

```yaml
listenerTemplate:
  spec:
    containers:
      - name: listener
        volumeMounts:
          - name: cert-volume
            mountPath: /akv
            readOnly: true
    volumes:
      - name: cert-volume
        secret:
          secretName: my-cert-secret
```

--------------------------------

### Using a Docker Public Registry Action

Source: https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions

Explains how to use a Docker image from any public Docker registry, exemplified with Google Container Registry.

```APIDOC
## Configuration: Using a Docker Public Registry Action

### Description
This section explains how to use a Docker image from any public Docker registry as an action, providing an example with the Google Container Registry (`gcr.io`).

### Method
Configuration

### Endpoint
`uses: docker://{host}/{image}:{tag}`

### Parameters
#### Request Body
- **host** (string) - Required - The host of the public Docker registry (e.g., `gcr.io`).
- **image** (string) - Required - The name of the Docker image.
- **tag** (string) - Optional - The specific tag of the Docker image to use.

### Request Example
```yaml
jobs:
  my_first_job:
    steps:
      - name: My first step
        uses: docker://gcr.io/cloud-builders/gradle
```
```

--------------------------------

### Verify SBOM attestation in SPDX format with GitHub CLI

Source: https://docs.github.com/en/actions/security-guides/using-artifact-attestations-to-establish-provenance-for-builds

Verify SBOM attestations by specifying the predicate type. This example uses the SPDX v2.3 predicate type for SBOM verification.

```Bash
gh attestation verify PATH/TO/YOUR/BUILD/ARTIFACT-BINARY \
  -R ORGANIZATION_NAME/REPOSITORY_NAME \
  --predicate-type https://spdx.dev/Document/v2.3
```

--------------------------------

### Verify Bats Version in GitHub Actions

Source: https://docs.github.com/en/actions/tutorials/create-an-example-workflow

This snippet shows another use of the `run` keyword within a GitHub Actions workflow. It executes the `bats` command with the `-v` parameter to output its installed version, confirming successful installation.

```yaml
- run: bats -v
```

--------------------------------

### Generate build provenance for binaries

Source: https://docs.github.com/en/actions/how-tos/security-for-github-actions/using-artifact-attestations/using-artifact-attestations-to-establish-provenance-for-builds

Configure the required permissions and add the attest action step. Set subject-path to the location of the binary.

```yaml
permissions:
  id-token: write
  contents: read
  attestations: write

```

```yaml
- name: Generate artifact attestation
  uses: actions/attest@v4
  with:
    subject-path: 'PATH/TO/ARTIFACT'

```

--------------------------------

### Secrets Context - GitHub CLI Example

Source: https://docs.github.com/en/actions/reference/accessing-contextual-information-about-workflow-runs

Demonstrates how to use the secrets context to access the GITHUB_TOKEN for GitHub CLI operations. This example shows a workflow that creates a new issue using the gh command with authentication provided through the GH_TOKEN environment variable.

```APIDOC
## Secrets Context Usage

### Description
Access sensitive data stored in GitHub repository secrets within workflow steps.

### Context Properties
- **secrets.GITHUB_TOKEN** (string) - Required - Automatically generated token for authenticating GitHub CLI and API calls
- **secrets.<secret_name>** (string) - Optional - Custom secrets defined in repository settings

### Example Workflow
```yaml
name: Open new issue
on: workflow_dispatch

jobs:
  open-issue:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      issues: write
    steps:
      - run: |
          gh issue --repo ${{ github.repository }} \
            create --title "Issue title" --body "Issue body"
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### Usage Notes
- The GITHUB_TOKEN is automatically created for each workflow run
- Access secrets using the syntax `${{ secrets.SECRET_NAME }}`
- Secrets are masked in workflow logs for security
- Requires appropriate permissions (e.g., `issues: write` for issue creation)
```

--------------------------------

### Print GitHub Event Context to Console

Source: https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/trigger-a-workflow

This example shows how to serialize the entire `github.event` context to JSON and print it to the console, which is useful for debugging and understanding the available event properties for a specific trigger.

```yaml
jobs:
  print_context:
    runs-on: ubuntu-latest
    steps:
      - env:
          EVENT_CONTEXT: ${{ toJSON(github.event) }}
        run: |
          echo $EVENT_CONTEXT
```

--------------------------------

### Specify a working directory for a workflow step (YAML)

Source: https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax

This example demonstrates how to set a specific working directory for a 'run' command within a workflow step using the 'working-directory' keyword.

```yaml
- name: Clean temp directory
  run: rm -rf *
  working-directory: ./temp
```

--------------------------------

### Run GitHub Actions job in a Docker container

Source: https://docs.github.com/en/actions/how-tos/write-workflows/choose-where-workflows-run/run-jobs-in-a-container

A comprehensive example showing how to define a container for a job, including image selection, environment variables, port mapping, and volume mounting.

```yaml
name: CI
on:
  push:
    branches: [ main ]
jobs:
  container-test-job:
    runs-on: ubuntu-latest
    container:
      image: node:18
      env:
        NODE_ENV: development
      ports:
        - 80
      volumes:
        - my_docker_volume:/volume_mount
      options: --cpus 1
    steps:
      - name: Check for dockerenv file
        run: (ls /.dockerenv && echo Found dockerenv) || (echo No dockerenv)
```

--------------------------------

### Create Kubernetes Secret for GitHub App Credentials

Source: https://docs.github.com/en/actions/how-tos/manage-runners/use-actions-runner-controller/authenticate-to-the-api

Creates a Kubernetes secret containing GitHub App authentication credentials (app ID, installation ID, and private key) required for Actions Runner Controller. The secret is created in the specified namespace and referenced in the Helm values configuration. This command must be executed in the same namespace where the gha-runner-scale-set chart is installed.

```bash
kubectl create secret generic pre-defined-secret \
   --namespace=arc-runners \
   --from-literal=github_app_id=123456 \
   --from-literal=github_app_installation_id=654321 \
   --from-literal=github_app_private_key='-----BEGIN RSA PRIVATE KEY-----********'
```

--------------------------------

### Use Matrix Strategy with Reusable Workflow

Source: https://docs.github.com/en/actions/how-tos/sharing-automations/reuse-workflows

This example demonstrates calling a reusable workflow within a job that uses a matrix strategy, passing a matrix variable ('target') as an input.

```yaml
jobs:
  ReusableMatrixJobForDeployment:
    strategy:
      matrix:
        target: [dev, stage, prod]
    uses: octocat/octo-repo/.github/workflows/deployment.yml@main
    with:
      target: ${{ matrix.target }}
```

--------------------------------

### Configure and run a job within a Docker container

Source: https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax

These examples demonstrate how to define a job that runs inside a Docker container. The first snippet provides a full configuration with environment variables, ports, volumes, and Docker options, while the second shows the shorthand for specifying only the container image.

```yaml
name: CI
on:
  push:
    branches: [ main ]
jobs:
  container-test-job:
    runs-on: ubuntu-latest
    container:
      image: node:18
      env:
        NODE_ENV: development
      ports:
        - 80
      volumes:
        - my_docker_volume:/volume_mount
      options: --cpus 1
    steps:
      - name: Check for dockerenv file
        run: (ls /.dockerenv && echo Found dockerenv) || (echo No dockerenv)
```

```yaml
jobs:
  container-test-job:
    runs-on: ubuntu-latest
    container: node:18
```

--------------------------------

### JSON structure of the inputs context

Source: https://docs.github.com/en/actions/reference/accessing-contextual-information-about-workflow-runs

Example of how input values are represented within the inputs context object.

```json
{
  "build_id": 123456768,
  "deploy_target": "deployment_sys_1a",
  "perform_deploy": true
}

```

--------------------------------

### Mount volumes in a GitHub Actions container

Source: https://docs.github.com/en/actions/how-tos/write-workflows/choose-where-workflows-run/run-jobs-in-a-container

Examples of mounting named volumes, anonymous volumes, and host bind mounts to share data between the host and the container.

```yaml
volumes:
  - my_docker_volume:/volume_mount
  - /data/my_data
  - /source/directory:/destination/directory
```

--------------------------------

### YAML Anchors and Aliases Expanded Form

Source: https://docs.github.com/en/actions/reference/reusable-workflows-reference

Equivalent expanded form of the anchors and aliases example without using YAML anchors. Shows what the workflow looks like when environment variables are duplicated across jobs.

```yaml
jobs:
  job1:
    env:
      NODE_ENV: production
      DATABASE_URL: ${{ secrets.DATABASE_URL }}
    steps:
      - run: echo "Using production settings"

  job2:
    env:
      NODE_ENV: production
      DATABASE_URL: ${{ secrets.DATABASE_URL }}
    steps:
      - run: echo "Same environment variables here"
```

--------------------------------

### Define and use inputs for workflow_dispatch in GitHub Actions

Source: https://docs.github.com/en/actions/writing-workflows/choosing-when-your-workflow-runs/triggering-a-workflow

This example shows how to define various input types (choice, boolean, string, environment) for a manually triggered workflow. It also demonstrates how to access these inputs within a job using the `inputs` context.

```yaml
on:
  workflow_dispatch:
    inputs:
      logLevel:
        description: 'Log level'
        required: true
        default: 'warning'
        type: choice
        options:
          - info
          - warning
          - debug
      print_tags:
        description: 'True to print to STDOUT'
        required: true
        type: boolean
      tags:
        description: 'Test scenario tags'
        required: true
        type: string
      environment:
        description: 'Environment to run tests against'
        type: environment
        required: true

jobs:
  print-tag:
    runs-on: ubuntu-latest
    if: ${{ inputs.print_tags }} 
    steps:
      - name: Print the input tag to STDOUT
        run: echo  The tags are ${{ inputs.tags }} 

```

--------------------------------

### GET github context

Source: https://docs.github.com/en/actions/reference/workflows-and-actions/contexts

Access information about the workflow run and the event that triggered it through the github context object.

```APIDOC
## GET github context

### Description
Access information about the workflow run and the event that triggered it.

### Method
GET (Context Access)

### Endpoint
github

### Parameters
#### Context Properties
- **github.action_status** (string) - For a composite action, the current result of the composite action.
- **github.actor** (string) - The username of the user that triggered the initial workflow run. If the workflow run is a re-run, this value may differ from github.triggering_actor.
- **github.actor_id** (string) - The account ID of the person or app that triggered the initial workflow run. For example, 1234567.
- **github.api_url** (string) - The URL of the GitHub REST API.

### Response
#### Success Response (200)
- **github.action_status** (string) - Result of the composite action
- **github.actor** (string) - Triggering username
- **github.actor_id** (string) - Triggering account ID
- **github.api_url** (string) - GitHub REST API URL
```

--------------------------------

### Azure Pipelines Syntax for Script Steps

Source: https://docs.github.com/en/actions/migrating-to-github-actions/manually-migrating-to-github-actions/migrating-from-azure-pipelines-to-github-actions

Illustrates how to define script steps in Azure Pipelines using 'script', 'bash', 'pwsh', or the PowerShell task.

```yaml
jobs:
  - job: scripts
    pool:
      vmImage: 'windows-latest'
    steps:
      - script: echo "This step runs in the default shell"
      - bash: echo "This step runs in bash"
      - pwsh: Write-Host "This step runs in PowerShell Core"
      - task: PowerShell@2
        inputs:
          script: Write-Host "This step runs in PowerShell"
```

--------------------------------

### Route job to Ubuntu runner with labels key

Source: https://docs.github.com/en/actions/how-tos/manage-runners/larger-runners/use-larger-runners?platform=windows

Use the `labels` key under `runs-on` to send a job to any available runner with the specified label. This example targets the `ubuntu-24.04-16core` label.

```yaml
name: learn-github-actions
on: [push]
jobs:
  check-bats-version:
    runs-on:
      labels: ubuntu-24.04-16core
    steps:
      - uses: actions/checkout@v5
      - uses: actions/setup-node@v4
        with:
          node-version: '14'
      - run: npm install -g bats
      - run: bats -v
```

--------------------------------

### Example Configuration File for Migrating Reusable Workflows and Composite Actions

Source: https://docs.github.com/en/actions/tutorials/migrate-to-github-actions/automated-migrations/azure-devops-migration

This YAML configuration file, generated by an initial audit, specifies how reusable workflows and composite actions should be migrated. It defines the 'name', 'target_url', and 'ref' for each item, allowing customization of their destination in GitHub.

```yaml
reusable_workflows:
  - name: my-reusable-workflow.yml
    target_url: https://github.com/octo-org/octo-repo
    ref: main

composite_actions:
  - name: my-composite-action.yml
    target_url: https://github.com/octo-org/octo-repo
    ref: main
```

--------------------------------

### Public Action Workflow with Input and Output

Source: https://docs.github.com/en/actions/creating-actions/creating-a-docker-container-action

Use a public action from a repository by specifying the action path and version. Pass inputs via the `with` keyword and access outputs using `steps.<step-id>.outputs.<output-name>` syntax.

```YAML
on: [push]

jobs:
  hello_world_job:
    runs-on: ubuntu-latest
    name: A job to say hello
    steps:
      - name: Hello world action step
        id: hello
        uses: actions/hello-world-docker-action@v2
        with:
          who-to-greet: 'Mona the Octocat'
      # Use the output from the `hello` step
      - name: Get the output time
        run: echo "The time was ${{ steps.hello.outputs.time }}"
```

--------------------------------

### cleanup_job Command Input JSON

Source: https://docs.github.com/en/actions/hosting-your-own-runners/managing-self-hosted-runners/customizing-the-containers-used-by-jobs

Example input structure for cleanup_job command containing the command name, state with network and container IDs to be cleaned up, and empty args object.

```json
{
  "command": "cleanup_job",
  "responseFile": null,
  "state": {
    "network": "example_network_53269bd575972817b43f7733536b200c",
    "jobContainer": "82e8219701fe096a35941d869cf3d71af1d943b5d8bdd718857fb87ac3042480",
    "serviceContainers": {
      "redis": "60972d9aa486605e66b0dad4abb678dc3d9116f536579e418176eedb8abb9105"
    }
  },
  "args": {}
}
```

```json
{
  "command": "cleanup_job",
  "responseFile": null,
  "state": {
    "network": "example_network_53269bd575972817b43f7733536b200c",
    "jobContainer": "82e8219701fe096a35941d869cf3d71af1d943b5d8bdd718857fb87ac3042480",
    "serviceContainers": {
      "redis": "60972d9aa486605e66b0dad4abb678dc3d9116f536579e418176eedb8abb9105"
    }
  },
  "args": {}
}
```

--------------------------------

### GET jobs.<job_id>

Source: https://docs.github.com/en/actions/reference/workflows-and-actions/contexts

The jobs context is used in reusable workflows to access the status and outputs of specific jobs.

```APIDOC
## GET jobs.<job_id>

### Description
Retrieves the result and outputs of a job within a reusable workflow.

### Method
GET

### Endpoint
jobs.<job_id>

### Parameters
#### Path Parameters
- **job_id** (string) - Required - The ID of the job in the reusable workflow.

### Response
#### Success Response (200)
- **result** (string) - The result of a job. Possible values: success, failure, cancelled, or skipped.
- **outputs** (object) - The set of outputs of a job.
- **outputs.<output_name>** (string) - The value of a specific output.

### Response Example
{
  "example_job": {
    "result": "success",
    "outputs": {
      "output1": "hello",
      "output2": "world"
    }
  }
}
```

--------------------------------

### Configure GitHub Actions Steps for Redis Container Job

Source: https://docs.github.com/en/actions/tutorials/use-containerized-services/create-redis-service-containers

Defines the sequence of steps to checkout code, install dependencies via npm, and execute a Node.js script that connects to a Redis service container using the service label as the hostname.

```yaml
steps:
  # Downloads a copy of the code in your repository before running CI tests
  - name: Check out repository code
    uses: actions/checkout@v5

  # Performs a clean installation of all dependencies in the `package.json` file
  # For more information, see https://docs.npmjs.com/cli/ci.html
  - name: Install dependencies
    run: npm ci

  - name: Connect to Redis
    # Runs a script that creates a Redis client, populates
    # the client with data, and retrieves data
    run: node client.js
    # Environment variable used by the `client.js` script to create a new Redis client.
    env:
      # The hostname used to communicate with the Redis service container
      REDIS_HOST: redis
      # The default Redis port
      REDIS_PORT: 6379
```

--------------------------------

### GET /contexts/needs

Source: https://docs.github.com/en/actions/reference/accessing-contextual-information-about-workflow-runs

The needs context contains outputs and results from all jobs that are defined as a direct dependency of the current job.

```APIDOC
## GET /contexts/needs

### Description
Access outputs and execution results from jobs defined as direct dependencies in the workflow.

### Method
GET

### Endpoint
needs

### Parameters
#### Context Properties
- **needs.<job_id>** (object) - Required - A single job that the current job depends on.
- **needs.<job_id>.outputs** (object) - Required - The set of outputs of a job that the current job depends on.
- **needs.<job_id>.outputs.<output_name>** (string) - Required - The value of a specific output.
- **needs.<job_id>.result** (string) - Required - The result of a job. Possible values: success, failure, cancelled, or skipped.

### Request Example
```yaml
jobs:
  deploy:
    needs: build
```

### Response
#### Success Response (200)
- **result** (string) - The final status of the dependent job.
- **outputs** (object) - Key-value pairs of job outputs.

#### Response Example
{
  "build": {
    "result": "success",
    "outputs": {
      "build_id": "123456"
    }
  }
}
```

--------------------------------

### Install trust-policies Helm chart with image matching patterns

Source: https://docs.github.com/en/actions/how-tos/security-for-github-actions/using-artifact-attestations/enforcing-artifact-attestations-with-a-kubernetes-admission-controller

Configure attestation enforcement for specific images using glob patterns. Use policy.images to specify which images require attestations and policy.exemptImages to exclude images from enforcement. Patterns must use fully-qualified image names including domain.

```bash
helm upgrade trust-policies --install --atomic \
 --namespace artifact-attestations \
 oci://ghcr.io/github/artifact-attestations-helm-charts/trust-policies \
 --version v0.7.0 \
 --set policy.enabled=true \
 --set policy.organization=MY-ORGANIZATION \
 --set-json 'policy.exemptImages=["index.docker.io/library/busybox**"]' \
 --set-json 'policy.images=["ghcr.io/MY-ORGANIZATION/**"]'
```

--------------------------------

### GET /runner/environment-variables

Source: https://docs.github.com/en/actions/reference/workflows-and-actions/variables

Access environment variables provided by the GitHub Actions runner to determine execution context and architecture.

```APIDOC
## GET /runner/environment-variables

### Description
Provides metadata about the runner executing the job, including architecture, debug status, and environment type.

### Method
GET

### Endpoint
/runner/environment-variables

### Parameters
#### Environment Variables
- **RUNNER_ARCH** (string) - The architecture of the runner executing the job. Possible values are X86, X64, ARM, or ARM64.
- **RUNNER_DEBUG** (string) - Set only if debug logging is enabled; always has the value of 1.
- **RUNNER_ENVIRONMENT** (string) - The environment of the runner. Possible values: github-hosted or self-hosted.
- **RUNNER_NAME** (string) - The name of the runner executing the job.

### Request Example
{
  "context": "runner_metadata"
}

### Response
#### Success Response (200)
- **RUNNER_ARCH** (string) - The architecture of the runner.
- **RUNNER_DEBUG** (string) - Debug indicator.
- **RUNNER_ENVIRONMENT** (string) - Hosting environment type.
- **RUNNER_NAME** (string) - Name of the runner.

### Response Example
{
  "RUNNER_ARCH": "X64",
  "RUNNER_DEBUG": "1",
  "RUNNER_ENVIRONMENT": "github-hosted",
  "RUNNER_NAME": "Hosted Agent"
}
```

--------------------------------

### Route job to Windows runner with labels key

Source: https://docs.github.com/en/actions/how-tos/manage-runners/larger-runners/use-larger-runners?platform=windows

Use the `labels` key under `runs-on` to send a job to any available runner with the specified label. This example targets the `windows-2022-16core` label.

```yaml
name: learn-github-actions
on: [push]
jobs:
  check-bats-version:
    runs-on:
      labels: windows-2022-16core
    steps:
      - uses: actions/checkout@v5
      - uses: actions/setup-node@v4
        with:
          node-version: '14'
      - run: npm install -g bats
      - run: bats -v
```

--------------------------------

### Expand Matrix Configurations with 'include' in GitHub Actions

Source: https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions

Use 'include' to add key-value pairs to specific matrix combinations. This example adds an 'npm' variable to the job running on 'windows-latest' with Node.js version 16.

```yaml
jobs:
  example_matrix:
    strategy:
      matrix:
        os: [windows-latest, ubuntu-latest]
        node: [14, 16]
        include:
          - os: windows-latest
            node: 16
            npm: 6
    runs-on: ${{ matrix.os }}
    steps:
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node }}
      - if: ${{ matrix.npm }}
        run: npm install -g npm@${{ matrix.npm }}
      - run: npm --version

```

--------------------------------

### Configure Node.js Matrix Strategy with Multiple Versions

Source: https://docs.github.com/en/actions/tutorials/build-and-test-code/nodejs

Sets up a GitHub Actions workflow using a matrix strategy to build and test code across multiple Node.js versions. The setup-node action configures each specified version on the runner, and the matrix context provides version values to each job. This ensures consistent behavior across different Node.js versions.

```YAML
strategy:
  matrix:
    node-version: ['18.x', '20.x']

steps:
- uses: actions/checkout@v5
- name: Use Node.js ${{ matrix.node-version }}
  uses: actions/setup-node@v4
  with:
    node-version: ${{ matrix.node-version }}
```

--------------------------------

### View policy-controller Helm chart configuration options

Source: https://docs.github.com/en/actions/how-tos/security-for-github-actions/using-artifact-attestations/enforcing-artifact-attestations-with-a-kubernetes-admission-controller

Display all available configuration values for the Sigstore policy-controller Helm chart to see the full set of customizable options.

```bash
helm show values oci://ghcr.io/sigstore/helm-charts/policy-controller --version 0.10.5
```

--------------------------------

### Use expressions in if conditionals

Source: https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax

Wrap expressions starting with reserved characters like ! in ${{ }} syntax to avoid YAML parsing errors.

```yaml
if: ${{ ! startsWith(github.ref, 'refs/tags/') }}
```

--------------------------------

### GitHub Actions Workflow Steps for Redis Connection

Source: https://docs.github.com/en/actions/using-containerized-services/creating-redis-service-containers

Defines workflow steps to check out code, install npm dependencies, and connect to a Redis service container. Sets REDIS_HOST and REDIS_PORT environment variables for the client script to use.

```yaml
steps:
  # Downloads a copy of the code in your repository before running CI tests
  - name: Check out repository code
    uses: actions/checkout@v5

  # Performs a clean installation of all dependencies in the `package.json` file
  # For more information, see https://docs.npmjs.com/cli/ci.html
  - name: Install dependencies
    run: npm ci

  - name: Connect to Redis
    # Runs a script that creates a Redis client, populates
    # the client with data, and retrieves data
    run: node client.js
    # Environment variable used by the `client.js` script to create
    # a new Redis client.
    env:
      # The hostname used to communicate with the Redis service container
      REDIS_HOST: localhost
      # The default Redis port
      REDIS_PORT: 6379
```

--------------------------------

### Example of Matrix Expansion with Object Variables

Source: https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions

This snippet illustrates the resulting job configurations when a matrix variable is defined as an array of objects. Each entry represents a unique job with its specific 'os' and 'node' properties.

```yaml
- matrix.os: ubuntu-latest
  matrix.node.version: 14
- matrix.os: ubuntu-latest
  matrix.node.version: 20
  matrix.node.env: NODE_OPTIONS=--openssl-legacy-provider
- matrix.os: macos-latest
  matrix.node.version: 14
- matrix.os: macos-latest
  matrix.node.version: 20
  matrix.node.env: NODE_OPTIONS=--openssl-legacy-provider

```

--------------------------------

### Multi-select custom property JSON representation

Source: https://docs.github.com/en/actions/reference/security/oidc

Example of a multi-select property with multiple values joined by commas in the OIDC token.

```json
{
  "repo_property_regions": "us-east-1,eu-west-1"
}
```

--------------------------------

### GET github

Source: https://docs.github.com/en/actions/reference/contexts-reference

Access metadata about the current workflow run, repository details, and authentication tokens through the github context object.

```APIDOC
## GET github

### Description
The github context contains information about the workflow run and the event that triggered the run. Most of these properties are available at any point in the workflow, though some (like token) are restricted to specific execution steps.

### Method
GET

### Endpoint
github

### Parameters
#### Context Properties
- **path** (string) - Path on the runner to the file that sets system PATH variables.
- **ref** (string) - The fully-formed ref of the branch or tag that triggered the workflow run.
- **ref_name** (string) - The short ref name of the branch or tag (e.g., feature-branch-1).
- **ref_protected** (boolean) - True if branch protections or rulesets are configured for the ref.
- **ref_type** (string) - The type of ref that triggered the run (branch or tag).
- **repository** (string) - The owner and repository name (e.g., octocat/Hello-World).
- **repository_id** (string) - The unique ID of the repository.
- **repository_owner** (string) - The repository owner's username.
- **repository_owner_id** (string) - The repository owner's account ID.
- **repositoryUrl** (string) - The Git URL to the repository.
- **retention_days** (string) - The number of days workflow run logs and artifacts are kept.
- **run_id** (string) - A unique number for each workflow run within a repository.
- **run_number** (string) - A unique number for each run of a particular workflow.
- **run_attempt** (string) - A unique number for each attempt of a particular workflow run.
- **secret_source** (string) - The source of a secret (None, Actions, Codespaces, or Dependabot).
- **server_url** (string) - The URL of the GitHub server (e.g., https://github.com).
- **sha** (string) - The commit SHA that triggered the workflow.
- **token** (string) - A token to authenticate on behalf of the GitHub App; only available within execution steps.
- **triggering_actor** (string) - The username of the user that initiated the workflow run.
- **workflow** (string) - The name of the workflow or the full path of the workflow file.
- **workflow_ref** (string) - The ref path to the workflow file.
- **workflow_sha** (string) - The commit SHA for the workflow file.
- **workspace** (string) - The default working directory on the runner for steps.

### Response
#### Success Response (200)
- **github** (object) - The context object containing all workflow metadata.

### Response Example
{
  "github": {
    "repository": "octocat/Hello-World",
    "ref": "refs/heads/main",
    "sha": "ffac537e6cbbf934b08745a378932722df287a53",
    "run_id": "123456789",
    "workflow": "CI Pipeline"
  }
}
```

--------------------------------

### Configure GitHub Actions Importer for Travis CI

Source: https://docs.github.com/en/actions/tutorials/migrate-to-github-actions/automated-migrations/travis-ci-migration

Run this command to interactively set GitHub and Travis CI tokens and instance URLs.

```shell
gh actions-importer configure

```

```shell
$ gh actions-importer configure
✔ Which CI providers are you configuring?: Travis CI
Enter the following values (leave empty to omit):
✔ Personal access token for GitHub: ***************
✔ Base url of the GitHub instance: https://github.com
✔ Personal access token for Travis CI: ***************
✔ Base url of the Travis CI instance: https://travis-ci.com
✔ Travis CI organization name: actions-importer-labs
Environment variables successfully updated.

```

--------------------------------

### GET strategy context

Source: https://docs.github.com/en/actions/reference/workflows-and-actions/contexts

Accesses information about the matrix execution strategy for the current job, including indexing and parallelization settings.

```APIDOC
## GET strategy

### Description
For workflows with a matrix, the strategy context contains information about the matrix execution strategy for the current job. This context changes for each job in a workflow run.

### Method
GET

### Endpoint
strategy

### Parameters
#### Response Body
- **fail-fast** (boolean) - Required - When this evaluates to true, all in-progress jobs are canceled if any job in a matrix fails.
- **job-index** (number) - Required - The zero-based index of the current job in the matrix.
- **job-total** (number) - Required - The total number of jobs in the matrix.
- **max-parallel** (number) - Required - The maximum number of jobs that can run simultaneously when using a matrix job strategy.

### Response Example
{
  "fail-fast": true,
  "job-index": 3,
  "job-total": 4,
  "max-parallel": 4
}

### Success Response (200)
- **strategy** (object) - The root strategy context object.
```

--------------------------------

### GET /contexts/inputs

Source: https://docs.github.com/en/actions/reference/accessing-contextual-information-about-workflow-runs

The inputs context contains input properties passed to an action, a reusable workflow, or a manually triggered workflow.

```APIDOC
## GET /contexts/inputs

### Description
Retrieves input parameters passed via workflow_dispatch or workflow_call events.

### Method
GET

### Endpoint
inputs

### Parameters
#### Context Properties
- **inputs.<name>** (string|number|boolean|choice) - Required - Each input value passed from an external workflow or manual trigger.

### Response
#### Success Response (200)
- **inputs** (object) - An object containing all input keys and their corresponding values.

#### Response Example
{
  "logLevel": "debug",
  "deploy_env": "production"
}
```

--------------------------------

### Configure workflow steps for container job with PostgreSQL connection

Source: https://docs.github.com/en/actions/using-containerized-services/creating-postgresql-service-containers

Defines workflow steps that check out the repository, install npm dependencies, and connect to a PostgreSQL service container. Environment variables POSTGRES_HOST and POSTGRES_PORT are passed to the client script to establish the database connection.

```YAML
steps:
  # Downloads a copy of the code in your repository before running CI tests
  - name: Check out repository code
    uses: actions/checkout@v5

  # Performs a clean installation of all dependencies in the `package.json` file
  # For more information, see https://docs.npmjs.com/cli/ci.html
  - name: Install dependencies
    run: npm ci

  - name: Connect to PostgreSQL
    # Runs a script that creates a PostgreSQL table, populates
    # the table with data, and then retrieves the data.
    run: node client.js
    # Environment variable used by the `client.js` script to create
    # a new PostgreSQL client.
    env:
      # The hostname used to communicate with the PostgreSQL service container
      POSTGRES_HOST: postgres
      # The default PostgreSQL port
      POSTGRES_PORT: 5432
```

--------------------------------

### GET /mapping/template-parameters

Source: https://docs.github.com/en/actions/tutorials/migrate-to-github-actions/automated-migrations/azure-devops-migration

Retrieves the mapping status and conversion logic for Azure Pipelines parameter types to GitHub Actions equivalents.

```APIDOC
## GET /mapping/template-parameters

### Description
Maps Azure Pipelines template parameters to GitHub Actions equivalents. This includes support status for various types like strings, numbers, and complex objects.

### Method
GET

### Endpoint
/mapping/template-parameters

### Parameters
#### Query Parameters
- **source_type** (string) - Optional - The Azure Pipelines parameter type (e.g., string, object, stepList).

### Request Example
{
  "source_type": "object"
}

### Response
#### Success Response (200)
- **azure_pipelines_type** (string) - The source parameter type.
- **github_actions_mapping** (string) - The resulting GitHub Actions syntax.
- **status** (string) - Support level: Supported or Partially supported.

#### Response Example
{
  "azure_pipelines_type": "object",
  "github_actions_mapping": "inputs.string with fromJSON expression",
  "status": "Partially supported"
}
```

--------------------------------

### Perform an initial audit to generate composite action configuration

Source: https://docs.github.com/en/actions/tutorials/migrate-to-github-actions/automated-migrations/circleci-migration

Run this command to generate a config.yml file containing a list of converted composite actions, which can then be modified.

```bash
gh actions-importer audit circle-ci --output-dir ./output/
```

--------------------------------

### Cache NuGet Dependencies in GitHub Actions for .NET

Source: https://docs.github.com/en/actions/tutorials/build-and-test-code/net

This workflow step demonstrates how to cache NuGet dependencies using `actions/setup-dotnet` with the `cache: true` option. It then installs a specific NuGet package, leveraging the cached global-packages folder for faster subsequent runs. An optional `cache-dependency-path` can be used for more granular control.

```yaml
steps:
- uses: actions/checkout@v5
- name: Setup dotnet
  uses: actions/setup-dotnet@v4
  with:
    dotnet-version: '6.x'
    cache: true
- name: Install dependencies
  run: dotnet add package Newtonsoft.Json --version 12.0.1
```

--------------------------------

### Stopping and starting workflow commands syntax

Source: https://docs.github.com/en/actions/using-workflows/workflow-commands-for-github-actions

Syntax for pausing and resuming the processing of workflow commands using a unique end token.

```text
::stop-commands::{endtoken}
```

```text
::stop-commands::{endtoken}
```

```text
::{endtoken}::
```

```text
::{endtoken}::
```

--------------------------------

### Configure Ruby CI Workflow with Matrix Strategy

Source: https://docs.github.com/en/actions/tutorials/build-and-test-code/ruby

This GitHub Actions workflow sets up a Continuous Integration pipeline for Ruby projects. It uses a matrix strategy to test the application against multiple Ruby versions (3.1, 3.0, 2.7) on 'ubuntu-latest'. The workflow checks out the code, sets up the specified Ruby version using 'ruby/setup-ruby', installs dependencies with Bundler, and runs Rake tests.

```yaml
name: Ruby CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:

    runs-on: ubuntu-latest

    strategy:
      matrix:
        ruby-version: ['3.1', '3.0', '2.7']

    steps:
      - uses: actions/checkout@v5
      - name: Set up Ruby ${{ matrix.ruby-version }}
        uses: ruby/setup-ruby@ec02537da5712d66d4d50a0f33b7eb52773b5ed1
        with:
          ruby-version: ${{ matrix.ruby-version }}
      - name: Install dependencies
        run: bundle install
      - name: Run tests
        run: bundle exec rake
```

--------------------------------

### Configure credentials for GitLab and GitHub

Source: https://docs.github.com/en/actions/tutorials/migrate-to-github-actions/automated-migrations/gitlab-migration

Run this command to set required credentials and options. It prompts for GitHub and GitLab personal access tokens and instance URLs.

```shell
gh actions-importer configure
```

```shell
$ gh actions-importer configure
✔ Which CI providers are you configuring?: GitLab
Enter the following values (leave empty to omit):
✔ Personal access token for GitHub: ***************
✔ Base url of the GitHub instance: https://github.com
✔ Private token for GitLab: ***************
✔ Base url of the GitLab instance: http://localhost
Environment variables successfully updated.
```

--------------------------------

### Require successful dependent jobs

Source: https://docs.github.com/en/actions/automating-your-workflow-with-github-actions/workflow-syntax-for-github-actions

Use the needs key to identify jobs that must complete successfully before the current job can start.

```yaml
jobs:
  job1:
  job2:
    needs: job1
  job3:
    needs: [job1, job2]

```

--------------------------------

### Add Basic Markdown to GitHub Actions Job Summary

Source: https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-commands

This snippet demonstrates how to add single-line Markdown content to a GitHub Actions job summary. It shows both a generic placeholder and a specific 'Hello world!' example, appending content to the `GITHUB_STEP_SUMMARY` environment file.

```bash
echo "{markdown content}" >> $GITHUB_STEP_SUMMARY
```

```powershell
"{markdown content}" >> $env:GITHUB_STEP_SUMMARY
```

```bash
echo "### Hello world! :rocket:" >> $GITHUB_STEP_SUMMARY
```

```powershell
"### Hello world! :rocket:" >> $env:GITHUB_STEP_SUMMARY
```

--------------------------------

### Run a workflow with inputs using GitHub CLI

Source: https://docs.github.com/en/actions/managing-workflow-runs/manually-running-a-workflow

Pass inputs using key-value pairs or read from a file. Use -f for strings and -F for file contents.

```bash
gh workflow run greet.yml -f name=mona -f greeting=hello -F data=@myfile.txt

```

--------------------------------

### jobs.<job_id>.steps[*].with.args

Source: https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions

Defines command-line arguments for a Docker container action. These arguments are passed to the container's `ENTRYPOINT`. Only a single string is supported, and arguments with spaces must be double-quoted.

```APIDOC
## `jobs.<job_id>.steps[*].with.args`

### Description
Defines command-line arguments for a Docker container action. These arguments are passed to the container's `ENTRYPOINT`. Only a single string is supported, and arguments with spaces must be double-quoted.

### Configuration Path
`jobs.<job_id>.steps[*].with.args`

### Parameters
#### Request Body
- **args** (string) - Required - Arguments to pass to the container's ENTRYPOINT.

### Request Example
```yaml
steps:
  - name: Explain why this job ran
    uses: octo-org/action-name@main
    with:
      entrypoint: /bin/echo
      args: The ${{ github.event_name }} event triggered this step.
```
```

--------------------------------

### Example usage of the needs context in a workflow

Source: https://docs.github.com/en/actions/reference/accessing-contextual-information-about-workflow-runs

This workflow demonstrates how to define job dependencies and access outputs from a preceding job using the needs context. It includes jobs for building, deploying, and debugging on failure.

```YAML
name: Build and deploy
on: push

jobs:
  build:
    runs-on: ubuntu-latest
    outputs:
      build_id: ${{ steps.build_step.outputs.build_id }}
    steps:
      - name: Build
        id: build_step
        run: echo "build_id=$RANDOM" >> $GITHUB_OUTPUT
  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - run: echo "Deploying build ${{ needs.build.outputs.build_id }}"
  debug:
    needs: [build, deploy]
    runs-on: ubuntu-latest
    if: ${{ failure() }}
    steps:
      - run: echo "Failed to build and deploy"
```

--------------------------------

### Configure Custom Shell with Template String

Source: https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax

Use a custom shell by specifying a template string with `command [options] {0} [more_options]`, where {0} is replaced with the temporary script filename. The command must be installed on the runner.

```yaml
steps:
  - name: Display the environment variables and their values
    shell: perl {0}
    run: |
      print %ENV
```

--------------------------------

### Build with multiple operating systems in GitHub Actions

Source: https://docs.github.com/en/actions/migrating-to-github-actions/manually-migrating-to-github-actions/migrating-from-jenkins-to-github-actions

GitHub Actions workflow using matrix strategy to run tests on macOS and Ubuntu. Sets up Node.js 20, installs bats globally, and runs tests in the scripts/myapp directory.

```yaml
name: demo-workflow
on:
  push:
jobs:
  test:
    runs-on: ${{ matrix.os }}
    strategy:
      fail-fast: false
      matrix:
        os: [macos-latest, ubuntu-latest]
    steps:
      - uses: actions/checkout@v5
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm install -g bats
      - run: bats tests
        working-directory: ./scripts/myapp
```

--------------------------------

### Example of on.workflow_dispatch.inputs

Source: https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions

Use this YAML configuration to define various input types (choice, boolean, string, environment) for a manually triggered workflow, including their descriptions, default values, and whether they are required. The workflow then uses one of these inputs in a job.

```yaml
on:
  workflow_dispatch:
    inputs:
      logLevel:
        description: 'Log level'
        required: true
        default: 'warning'
        type: choice
        options:
          - info
          - warning
          - debug
      print_tags:
        description: 'True to print to STDOUT'
        required: true
        type: boolean
      tags:
        description: 'Test scenario tags'
        required: true
        type: string
      environment:
        description: 'Environment to run tests against'
        type: environment
        required: true

jobs:
  print-tag:
    runs-on: ubuntu-latest
    if: ${{ inputs.print_tags }} 
    steps:
      - name: Print the input tag to STDOUT
        run: echo  The tags are ${{ inputs.tags }}
```

--------------------------------

### Example job context with PostgreSQL service

Source: https://docs.github.com/en/actions/reference/accessing-contextual-information-about-workflow-runs

This JSON object illustrates the structure of the job context when a PostgreSQL service container with mapped ports is used. If no containers are used, only status and check_run_id are present.

```json
{
  "status": "success",
  "check_run_id": 51725241954,
  "container": {
    "network": "github_network_53269bd575974817b43f4733536b200c"
  },
  "services": {
    "postgres": {
      "id": "60972d9aa486605e66b0dad4abb638dc3d9116f566579e418166eedb8abb9105",
      "ports": {
        "5432": "49153"
      },
      "network": "github_network_53269bd575974817b43f4733536b200c"
    }
  }
}
```

--------------------------------

### Add new matrix combinations with include

Source: https://docs.github.com/en/actions/automating-your-workflow-with-github-actions/workflow-syntax-for-github-actions

Use `include` to add entirely new combinations beyond the base matrix. This example adds a windows-latest/version-17 job to a 3x3 matrix, resulting in 10 total jobs.

```yaml
jobs:
  example_matrix:
    strategy:
      matrix:
        os: [macos-latest, windows-latest, ubuntu-latest]
        version: [12, 14, 16]
        include:
          - os: windows-latest
            version: 17
```

--------------------------------

### Workflow with environment-based manual approval

Source: https://docs.github.com/en/actions/writing-workflows/choosing-when-your-workflow-runs/triggering-a-workflow

Reference an environment name using the environment key to ensure a job only runs after reviewers approve it. The publish job in this example depends on the build job and production environment rules.

```yaml
on:
  push:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: build
        run: |
          echo 'building'

  publish:
    needs: [build]
    runs-on: ubuntu-latest
    environment: production
    steps:
      - name: publish
        run: |
          echo 'publishing'

```

--------------------------------

### GitHub Actions Workflow to Test Public Action

Source: https://docs.github.com/en/actions/creating-actions/creating-a-javascript-action

Example workflow YAML to trigger a public GitHub Action on push and retrieve its output. This demonstrates how to use a custom action from an external repository.

```yaml
on:
  push:
    branches:
      - main

jobs:
  hello_world_job:
    name: A job to say hello
    runs-on: ubuntu-latest

    steps:
      - name: Hello world action step
        id: hello
        uses: octocat/hello-world-javascript-action@1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b
        with:
          who-to-greet: Mona the Octocat

      # Use the output from the `hello` step
      - name: Get the output time
        run: echo "The time was ${{ steps.hello.outputs.time }}"
```

```yaml
on:
  push:
    branches:
      - main

jobs:
  hello_world_job:
    name: A job to say hello
    runs-on: ubuntu-latest

    steps:
      - name: Hello world action step
        id: hello
        uses: octocat/hello-world-javascript-action@1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b
        with:
          who-to-greet: Mona the Octocat

      # Use the output from the `hello` step
      - name: Get the output time
        run: echo "The time was ${{ steps.hello.outputs.time }}"
```

--------------------------------

### GET secrets

Source: https://docs.github.com/en/actions/reference/contexts-reference

The secrets context contains the names and values of secrets available to a workflow run, including the automatically generated GITHUB_TOKEN.

```APIDOC
## GET secrets\n\n### Description\nThe secrets context contains the names and values of secrets that are available to a workflow run. Note that this context is not available for composite actions.\n\n### Method\nGET\n\n### Endpoint\nsecrets\n\n### Parameters\n#### Response Body\n- **GITHUB_TOKEN** (string) - Automatically created token for each workflow run.\n- **<secret_name>** (string) - The value of a specific secret defined in the repository or organization.\n\n### Response\n#### Success Response (200)\n- **secrets** (object) - Object containing key-value pairs of secrets.\n\n### Response Example\n{\n  "github_token": "***",\n  "NPM_TOKEN": "***",\n  "SUPERSECRET": "***"\n}
```

--------------------------------

### Configure runs.pre-entrypoint for Docker Actions

Source: https://docs.github.com/en/actions/creating-actions/metadata-syntax-for-github-actions

Use `pre-entrypoint` to specify a script that runs before the main `entrypoint` of a Docker action, typically for prerequisite setup. The runtime state is separate from the main `entrypoint` container.

```YAML
runs:
  using: 'docker'
  image: 'Dockerfile'
  args:
    - 'bzz'
  pre-entrypoint: 'setup.sh'
  entrypoint: 'main.sh'

```

--------------------------------

### Configure GitHub Actions Importer for Bamboo

Source: https://docs.github.com/en/actions/tutorials/migrate-to-github-actions/automated-migrations/bamboo-migration

This command initializes the GitHub Actions Importer CLI for use with Bamboo. It prompts the user for necessary credentials, including GitHub and Bamboo personal access tokens, and the base URLs for both instances. This setup is crucial for the importer to authenticate and interact with your CI/CD environments.

```shell
gh actions-importer configure
✔ Which CI providers are you configuring?: Bamboo
Enter the following values (leave empty to omit):
✔ Personal access token for GitHub: ***************
✔ Base url of the GitHub instance: https://github.com
✔ Personal access token for Bamboo: ********************
✔ Base url of the Bamboo instance: https://bamboo.example.com
Environment variables successfully updated.
```

--------------------------------

### Configure Go Workflow with Multiple Versions

Source: https://docs.github.com/en/actions/tutorials/build-and-test-code/go

Sets up a GitHub Actions workflow to build and test a Go project across multiple Go versions (1.19, 1.20, 1.21.x) using a matrix strategy. The workflow checks out code, sets up each Go version, and displays the current Go version. This ensures compatibility across different Go releases.

```YAML
name: Go

on: [push]

jobs:
  build:

    runs-on: ubuntu-latest
    strategy:
      matrix:
        go-version: [ '1.19', '1.20', '1.21.x' ]

    steps:
      - uses: actions/checkout@v5
      - name: Setup Go ${{ matrix.go-version }}
        uses: actions/setup-go@v5
        with:
          go-version: ${{ matrix.go-version }}
      # You can test your matrix by printing the current Go version
      - name: Display Go version
        run: go version
```

--------------------------------

### GET matrix context

Source: https://docs.github.com/en/actions/reference/workflows-and-actions/contexts

Retrieves the specific matrix properties and values defined in the workflow file that apply to the current job execution.

```APIDOC
## GET matrix

### Description
Contains the matrix properties defined in the workflow file that apply to the current job. This context is only available for jobs in a matrix.

### Method
GET

### Endpoint
matrix

### Parameters
#### Response Body
- **<property_name>** (string) - Required - The value of a matrix property defined in the workflow (e.g., os, node).

### Response Example
{
  "os": "ubuntu-latest",
  "node": 16
}

### Success Response (200)
- **matrix** (object) - Object containing dynamic keys based on the workflow matrix configuration.
```

--------------------------------

### Verify Helm installation status

Source: https://docs.github.com/en/actions/hosting-your-own-runners/managing-self-hosted-runners-with-actions-runner-controller/quickstart-for-actions-runner-controller

Lists all Helm releases across all namespaces to confirm the runner scale set and controller are successfully deployed.

```bash
helm list -A
```

```text
helm list -A
```

--------------------------------

### Configure `run_container_step` with Dockerfile in GitHub Actions

Source: https://docs.github.com/en/actions/hosting-your-own-runners/managing-self-hosted-runners/customizing-the-containers-used-by-jobs

This JSON input demonstrates how to define container execution parameters for a GitHub Actions step, including specifying a Dockerfile path, entry point arguments, environment variables, and volume mounts.

```json
{
  "command": "run_container_step",
  "responseFile": null,
  "state": {
    "network": "example_network_53269bd575972817b43f7733536b200c",
    "jobContainer": "82e8219701fe096a35941d869cf3d71af1d943b5d8bdd718857fb87ac3042480",
    "services": {
      "redis": "60972d9aa486605e66b0dad4abb678dc3d9116f536579e418176eedb8abb9105"
    }
  },
  "args": {
    "image": null,
    "dockerfile": "/__w/_actions/foo/dockerfile",
    "entryPointArgs": ["hello world"],
    "entryPoint": "echo",
    "workingDirectory": "/__w/octocat-test2/octocat-test2",
    "createOptions": "--cpus 1",
    "environmentVariables": {
      "NODE_ENV": "development"
    },
    "prependPath": ["/foo/bar", "bar/foo"],
    "userMountVolumes": [
      {
        "sourceVolumePath": "my_docker_volume",
        "targetVolumePath": "/volume_mount",
        "readOnly": false
      }
    ],
    "systemMountVolumes": [
      {
        "sourceVolumePath": "/home/octocat/git/runner/_layout/_work",
        "targetVolumePath": "/__w",
        "readOnly": false
      },
      {
        "sourceVolumePath": "/home/octocat/git/runner/_layout/externals",
        "targetVolumePath": "/__e",
        "readOnly": true
      },
      {
        "sourceVolumePath": "/home/octocat/git/runner/_layout/_work/_temp",
        "targetVolumePath": "/__w/_temp",
        "readOnly": false
      },
      {
        "sourceVolumePath": "/home/octocat/git/runner/_layout/_work/_actions",
        "targetVolumePath": "/__w/_actions",
        "readOnly": false
      },
      {
        "sourceVolumePath": "/home/octocat/git/runner/_layout/_work/_tool",
        "targetVolumePath": "/__w/_tool",
        "readOnly": false
      },
      {
        "sourceVolumePath": "/home/octocat/git/runner/_layout/_work/_temp/_github_home",
        "targetVolumePath": "/github/home",
        "readOnly": false
      },
      {
        "sourceVolumePath": "/home/octocat/git/runner/_layout/_work/_temp/_github_workflow",
        "targetVolumePath": "/github/workflow",
        "readOnly": false
      }
    ],
    "registry": null,
    "portMappings": { "80": "801" }
  }
}
```

```json
{
  "command": "run_container_step",
  "responseFile": null,
  "state": {
    "network": "example_network_53269bd575972817b43f7733536b200c",
    "jobContainer": "82e8219701fe096a35941d869cf3d71af1d943b5d8bdd718857fb87ac3042480",
    "services": {
      "redis": "60972d9aa486605e66b0dad4abb678dc3d9116f536579e418176eedb8abb9105"
    }
  },
  "args": {
    "image": null,
    "dockerfile": "/__w/_actions/foo/dockerfile",
    "entryPointArgs": ["hello world"],
    "entryPoint": "echo",
    "workingDirectory": "/__w/octocat-test2/octocat-test2",
    "createOptions": "--cpus 1",
    "environmentVariables": {
      "NODE_ENV": "development"
    },
    "prependPath": ["/foo/bar", "bar/foo"],
    "userMountVolumes": [
      {
        "sourceVolumePath": "my_docker_volume",
        "targetVolumePath": "/volume_mount",
        "readOnly": false
      }
    ],
    "systemMountVolumes": [
      {
        "sourceVolumePath": "/home/octocat/git/runner/_layout/_work",
        "targetVolumePath": "/__w",
        "readOnly": false
      },
      {
        "sourceVolumePath": "/home/octocat/git/runner/_layout/externals",
        "targetVolumePath": "/__e",
        "readOnly": true
      },
      {
        "sourceVolumePath": "/home/octocat/git/runner/_layout/_work/_temp",
        "targetVolumePath": "/__w/_temp",
        "readOnly": false
      },
      {
        "sourceVolumePath": "/home/octocat/git/runner/_layout/_work/_actions",
        "targetVolumePath": "/__w/_actions",
        "readOnly": false
      },
      {
        "sourceVolumePath": "/home/octocat/git/runner/_layout/_work/_tool",
        "targetVolumePath": "/__w/_tool",
        "readOnly": false
      },
      {
        "sourceVolumePath": "/home/octocat/git/runner/_layout/_work/_temp/_github_home",
        "targetVolumePath": "/github/home",
        "readOnly": false
      },
      {
        "sourceVolumePath": "/home/octocat/git/runner/_layout/_work/_temp/_github_workflow",
        "targetVolumePath": "/github/workflow",
        "readOnly": false
      }
    ],
    "registry": null,
    "portMappings": { "80": "801" }
  }
}
```

--------------------------------

### Set conditional Docker images for service containers

Source: https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax

Assign an empty string to the image property to conditionally prevent a service container from starting.

```yaml
services:
  nginx:
    image: ${{ options.nginx == true && 'nginx' || '' }}
```

--------------------------------

### Build and Test Node.js Code in GitHub Actions

Source: https://docs.github.com/en/actions/automating-builds-and-tests/building-and-testing-nodejs

Run standard npm build and test commands within a GitHub Actions workflow. This snippet sets up Node.js, installs dependencies, builds the project, and executes tests.

```YAML
steps:
- uses: actions/checkout@v5
- name: Use Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '20.x'
- run: npm install
- run: npm run build --if-present
- run: npm test
```

```YAML
steps:
- uses: actions/checkout@v5
- name: Use Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '20.x'
- run: npm install
- run: npm run build --if-present
- run: npm test
```

--------------------------------

### Configure WireGuard in GitHub Actions Workflow

Source: https://docs.github.com/en/actions/using-github-hosted-runners/connecting-to-a-private-network/using-wireguard-to-create-a-network-overlay

Complete workflow that installs WireGuard, configures network interfaces, and establishes a connection to a private service using stored secrets for the private key. Requires WIREGUARD_PRIVATE_KEY secret to be configured.

```yaml
name: WireGuard example

on:
  workflow_dispatch:

jobs:
  wireguard_example:
    runs-on: ubuntu-latest
    steps:
      - run: sudo apt install wireguard

      - run: echo "${{ secrets.WIREGUARD_PRIVATE_KEY }}" > privatekey

      - run: sudo ip link add dev wg0 type wireguard

      - run: sudo ip address add dev wg0 192.168.1.2 peer 192.168.1.1

      - run: sudo wg set wg0 listen-port 48123 private-key privatekey peer examplepubkey1234... allowed-ips 0.0.0.0/0 endpoint 1.2.3.4:56789

      - run: sudo ip link set up dev wg0

      - run: curl -vvv http://192.168.1.1
```

--------------------------------

### CLI gh actions-importer configure

Source: https://docs.github.com/en/actions/tutorials/migrate-to-github-actions/automated-migrations/bitbucket-pipelines-migration

Sets up the necessary environment variables and credentials for both GitHub and Bitbucket instances to enable migration tasks.

```APIDOC
## CLI gh actions-importer configure

### Description
Sets required credentials and options for GitHub Actions Importer when working with Bitbucket Pipelines and GitHub.

### Method
CLI

### Endpoint
gh actions-importer configure

### Parameters
#### Interactive Prompts
- **CI Provider** (string) - Required - The CI provider to configure (select 'Bitbucket').
- **GitHub PAT** (string) - Required - Personal access token (classic) with 'workflow' scope.
- **GitHub Base URL** (string) - Optional - Base URL of the GitHub instance (default: https://github.com).
- **Bitbucket Token** (string) - Required - Workspace Access Token with 'read' scope for pipelines, projects, and repositories.
- **Bitbucket Base URL** (string) - Required - The URL for your Bitbucket instance.

### Request Example
gh actions-importer configure

### Response
#### Success Response
- **Status** (string) - Environment variables successfully updated.
```

--------------------------------

### Create repository_dispatch event via API

Source: https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows

Example request body for the GitHub API to trigger a repository_dispatch event with custom data in the client_payload.

```json
{
  "event_type": "test_result",
  "client_payload": {
    "passed": false,
    "message": "Error: timeout"
  }
}
```

--------------------------------

### Change directory to the action repository

Source: https://docs.github.com/en/actions/creating-actions/creating-a-javascript-action

Navigate into the local directory of the newly created GitHub repository.

```shell
cd hello-world-javascript-action
```

--------------------------------

### Download Attestation Bundle with GitHub CLI

Source: https://docs.github.com/en/actions/how-tos/secure-your-work/use-artifact-attestations/verify-attestations-offline

Downloads an artifact attestation bundle from the attestation API using the GitHub CLI. Requires an online machine and outputs a JSONL file containing the attestations. The command takes the path to the build artifact and repository information as parameters.

```bash
gh attestation download PATH/TO/YOUR/BUILD/ARTIFACT-BINARY -R ORGANIZATION_NAME/REPOSITORY_NAME
```

--------------------------------

### Example output of a successful GitHub Actions Importer production migration

Source: https://docs.github.com/en/actions/tutorials/migrate-to-github-actions/automated-migrations/azure-devops-migration

This snippet shows the expected output after successfully running the `gh actions-importer migrate` command. It includes the log file path and the URL of the newly created pull request in the target GitHub repository.

```shell
$ gh actions-importer migrate azure-devops pipeline --target-url https://github.com/octo-org/octo-repo --output-dir tmp/migrate --azure-devops-project my-azure-devops-project
[2022-08-20 22:08:20] Logs: 'tmp/migrate/log/actions-importer-20220916-014033.log'
[2022-08-20 22:08:20] Pull request: 'https://github.com/octo-org/octo-repo/pull/1'
```

--------------------------------

### Run specific Ant targets in GitHub Actions

Source: https://docs.github.com/en/actions/tutorials/build-and-test-code/java-with-ant

Demonstrates how to execute a specific Ant target using a custom build file. This snippet includes the checkout and Java setup steps required before running the Ant command.

```yaml
steps:
  - uses: actions/checkout@v5
  - uses: actions/setup-java@v4
    with:
      java-version: '17'
      distribution: 'temurin'
  - name: Run the Ant jar target
    run: ant -noinput -buildfile build-ci.xml jar
```

--------------------------------

### Output of Object Filter `vegetables.*.ediblePortions`

Source: https://docs.github.com/en/actions/writing-workflows/choosing-what-your-workflow-does/evaluate-expressions-in-workflows-and-actions

The resulting array after applying the `vegetables.*.ediblePortions` filter to the example `vegetables` object. Order is not guaranteed.

```json
[
  ["roots", "stalks"],
  ["hearts", "stems", "leaves"],
  ["roots", "stems", "leaves"]
]
```

--------------------------------

### Using Strategy Context in GitHub Actions Workflow

Source: https://docs.github.com/en/actions/reference/workflows-and-actions/contexts

Example workflow that uses `strategy.job-index` to create unique log file names for each job in a matrix. Demonstrates accessing strategy context properties in workflow steps and passing them to actions.

```yaml
name: Test strategy
on: push

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        test-group: [1, 2]
        node: [14, 16]
    steps:
      - run: echo "Mock test logs" > test-job-${{ strategy.job-index }}.txt
      - name: Upload logs
        uses: actions/upload-artifact@v4
        with:
          name: Build log for job ${{ strategy.job-index }}
          path: test-job-${{ strategy.job-index }}.txt
```

--------------------------------

### Publish .NET Package to GitHub Packages with GitHub Actions

Source: https://docs.github.com/en/actions/tutorials/build-and-test-code/net

This GitHub Actions workflow publishes a .NET package to GitHub Packages upon release creation. It configures `setup-dotnet` with a specific SDK version, a custom source URL for GitHub Packages, and authenticates using `NUGET_AUTH_TOKEN` from repository secrets. The workflow then builds, packs, and pushes the NuGet package.

```yaml
name: Upload dotnet package

on:
  release:
    types: [created]

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      packages: write
      contents: read
    steps:
      - uses: actions/checkout@v5
      - uses: actions/setup-dotnet@v4
        with:
          dotnet-version: '6.0.x' # SDK Version to use.
          source-url: https://nuget.pkg.github.com/<owner>/index.json
        env:
          NUGET_AUTH_TOKEN: ${{secrets.GITHUB_TOKEN}}
      - run: dotnet build --configuration Release <my project>
      - name: Create the package
        run: dotnet pack --configuration Release <my project>
      - name: Publish the package to GPR
        run: dotnet nuget push <my project>/bin/Release/*.nupkg
```

--------------------------------

### Disabling workflow commands on Ubuntu and Windows

Source: https://docs.github.com/en/actions/using-workflows/workflow-commands-for-github-actions

Examples of generating a unique token to wrap log output and prevent it from being interpreted as workflow commands.

```yaml
jobs:
  workflow-command-job:
    runs-on: ubuntu-latest
    steps:
      - name: Disable workflow commands
        run: |
          echo '::warning:: This is a warning message, to demonstrate that commands are being processed.'
          stopMarker=$(uuidgen)
          echo "::stop-commands::$stopMarker"
          echo '::warning:: This will NOT be rendered as a warning, because stop-commands has been invoked.'
          echo "::$stopMarker::"
          echo '::warning:: This is a warning again, because stop-commands has been turned off.'
```

```yaml
jobs:
  workflow-command-job:
    runs-on: ubuntu-latest
    steps:
      - name: Disable workflow commands
        run: |
          echo '::warning:: This is a warning message, to demonstrate that commands are being processed.'
          stopMarker=$(uuidgen)
          echo "::stop-commands::$stopMarker"
          echo '::warning:: This will NOT be rendered as a warning, because stop-commands has been invoked.'
          echo "::$stopMarker::"
          echo '::warning:: This is a warning again, because stop-commands has been turned off.'
```

```yaml
jobs:
  workflow-command-job:
    runs-on: windows-latest
    steps:
      - name: Disable workflow commands
        run: |
          Write-Output '::warning:: This is a warning message, to demonstrate that commands are being processed.'
          $stopMarker = New-Guid
          Write-Output "::stop-commands::$stopMarker"
          Write-Output '::warning:: This will NOT be rendered as a warning, because stop-commands has been invoked.'
          Write-Output "::$stopMarker::"
          Write-Output '::warning:: This is a warning again, because stop-commands has been turned off.'
```

```yaml
jobs:
  workflow-command-job:
    runs-on: windows-latest
    steps:
      - name: Disable workflow commands
        run: |
          Write-Output '::warning:: This is a warning message, to demonstrate that commands are being processed.'
          $stopMarker = New-Guid
          Write-Output "::stop-commands::$stopMarker"
          Write-Output '::warning:: This will NOT be rendered as a warning, because stop-commands has been invoked.'
          Write-Output "::$stopMarker::"
          Write-Output '::warning:: This is a warning again, because stop-commands has been turned off.'
```

--------------------------------

### Evaluated restore keys with hash resolution

Source: https://docs.github.com/en/actions/reference/workflows-and-actions/dependency-caching

Example output showing how GitHub Actions evaluates restore key expressions containing hashFiles() functions. Each restore key is resolved to its final value, demonstrating the progression from specific hash-based keys to general prefix-based fallbacks.

```yaml
restore-keys: |
  npm-feature-d5ea0750
  npm-feature-
  npm-
```

--------------------------------

### GitHub Actions Demo Workflow Configuration

Source: https://docs.github.com/en/actions/get-started/quickstart

A basic GitHub Actions workflow file that demonstrates core workflow concepts. This YAML configuration defines a job that runs on Ubuntu, executes echo commands with GitHub context variables, checks out repository code, lists files, and reports job status. The workflow is triggered on push events and serves as a starting point for understanding GitHub Actions syntax.

```yaml
name: GitHub Actions Demo
run-name: ${{ github.actor }} is testing out GitHub Actions 🚀
on: [push]
jobs:
  Explore-GitHub-Actions:
    runs-on: ubuntu-latest
    steps:
      - run: echo "🎉 The job was automatically triggered by a ${{ github.event_name }} event."
      - run: echo "🐧 This job is now running on a ${{ runner.os }} server hosted by GitHub!"
      - run: echo "🔎 The name of your branch is ${{ github.ref }} and your repository is ${{ github.repository }}."
      - name: Check out repository code
        uses: actions/checkout@v5
      - run: echo "💡 The ${{ github.repository }} repository has been cloned to the runner."
      - run: echo "🖥️ The workflow is now ready to test your code on the runner."
      - name: List files in the repository
        run: |
          ls ${{ github.workspace }}
      - run: echo "🍏 This job's status is ${{ job.status }}."
```

--------------------------------

### Define a Composite GitHub Action in YAML

Source: https://docs.github.com/en/actions/tutorials/create-actions/create-a-composite-action?platform=linux

This YAML defines a composite action named 'Hello World' with an input `who-to-greet`, an output `random-number`, and several steps including setting a greeting, generating a random number, and running a script.

```YAML
name: 'Hello World'
description: 'Greet someone'
inputs:
  who-to-greet:  # id of input
    description: 'Who to greet'
    required: true
    default: 'World'
outputs:
  random-number:
    description: "Random number"
    value: ${{ steps.random-number-generator.outputs.random-number }}
runs:
  using: "composite"
  steps:
    - name: Set Greeting
      run: echo "Hello $INPUT_WHO_TO_GREET."
      shell: bash
      env:
        INPUT_WHO_TO_GREET: ${{ inputs.who-to-greet }}

    - name: Random Number Generator
      id: random-number-generator
      run: echo "random-number=$(echo $RANDOM)" >> $GITHUB_OUTPUT
      shell: bash

    - name: Set GitHub Path
      run: echo "$GITHUB_ACTION_PATH" >> $GITHUB_PATH
      shell: bash
      env:
        GITHUB_ACTION_PATH: ${{ github.action_path }}

    - name: Run goodbye.sh
      run: goodbye.sh
      shell: bash
```

```YAML
name: 'Hello World'
description: 'Greet someone'
inputs:
  who-to-greet:  # id of input
    description: 'Who to greet'
    required: true
    default: 'World'
outputs:
  random-number:
    description: "Random number"
    value: ${{ steps.random-number-generator.outputs.random-number }}
runs:
  using: "composite"
  steps:
    - name: Set Greeting
      run: echo "Hello $INPUT_WHO_TO_GREET."
      shell: bash
      env:
        INPUT_WHO_TO_GREET: ${{ inputs.who-to-greet }}

    - name: Random Number Generator
      id: random-number-generator
      run: echo "random-number=$(echo $RANDOM)" >> $GITHUB_OUTPUT
      shell: bash

    - name: Set GitHub Path
      run: echo "$GITHUB_ACTION_PATH" >> $GITHUB_PATH
      shell: bash
      env:
        GITHUB_ACTION_PATH: ${{ github.action_path }}

    - name: Run goodbye.sh
      run: goodbye.sh
      shell: bash
```

--------------------------------

### Set a debug message in shell

Source: https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-commands?tool=bash

Examples of sending a debug message using Bash and PowerShell. These messages are only visible when debug logging is enabled.

```Bash
echo "::debug::Set the Octocat variable"
```

```Bash
echo "::debug::Set the Octocat variable"
```

```PowerShell
Write-Output "::debug::Set the Octocat variable"
```

```PowerShell
Write-Output "::debug::Set the Octocat variable"
```

--------------------------------

### jobs.<job_id>.steps

Source: https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions

Defines the sequence of tasks (steps) that comprise a job. Each step can run commands, setup tasks, or actions from repositories or Docker registries. Steps execute in their own process with access to the workspace and filesystem.

```APIDOC
## jobs.<job_id>.steps

### Description
A job contains a sequence of tasks called steps. Steps can run commands, run setup tasks, or run an action in your repository, a public repository, or an action published in a Docker registry.

### Characteristics
- Each step runs in its own process in the runner environment
- Each step has access to the workspace and filesystem
- Changes to environment variables are not preserved between steps
- GitHub provides built-in steps to set up and complete a job
- GitHub displays the first 1,000 checks; unlimited steps can run within workflow usage limits

### Example Configuration
```yaml
name: Greeting from Mona

on: push

jobs:
  my-job:
    name: My Job
    runs-on: ubuntu-latest
    steps:
      - name: Print a greeting
        env:
          MY_VAR: Hi there! My name is
          FIRST_NAME: Mona
          MIDDLE_NAME: The
          LAST_NAME: Octocat
        run: |
          echo $MY_VAR $FIRST_NAME $MIDDLE_NAME $LAST_NAME.
```
```

--------------------------------

### Create and Test Redis Client in Node.js

Source: https://docs.github.com/en/actions/tutorials/use-containerized-services/create-redis-service-containers

This script initializes a Redis client using environment variables for the host and port. It performs basic operations including setting string values and hash fields, then retrieves and logs all keys from a specific hash to verify the connection.

```javascript
const redis = require("redis");

// Creates a new Redis client
// If REDIS_HOST is not set, the default host is localhost
// If REDIS_PORT is not set, the default port is 6379
const redisClient = redis.createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
});

redisClient.on("error", (err) => console.log("Error", err));

(async () => {
  await redisClient.connect();

  // Sets the key "octocat" to a value of "Mona the octocat"
  const setKeyReply = await redisClient.set("octocat", "Mona the Octocat");
  console.log("Reply: " + setKeyReply);
  // Sets a key to "species", field to "octocat", and "value" to "Cat and Octopus"
  const SetFieldOctocatReply = await redisClient.hSet("species", "octocat", "Cat and Octopus");
  console.log("Reply: " + SetFieldOctocatReply);
  // Sets a key to "species", field to "dinotocat", and "value" to "Dinosaur and Octopus"
  const SetFieldDinotocatReply = await redisClient.hSet("species", "dinotocat", "Dinosaur and Octopus");
  console.log("Reply: " + SetFieldDinotocatReply);
  // Sets a key to "species", field to "robotocat", and "value" to "Cat and Robot"
  const SetFieldRobotocatReply = await redisClient.hSet("species", "robotocat", "Cat and Robot");
  console.log("Reply: " + SetFieldRobotocatReply);

  try {
    // Gets all fields in "species" key
    const replies = await redisClient.hKeys("species");
    console.log(replies.length + " replies:");
    replies.forEach((reply, i) => {
        console.log("    " + i + ": " + reply);
    });
    await redisClient.quit();
  }
  catch (err) {
    // statements to handle any exceptions
  }
})();
```

--------------------------------

### Convert Value to Pretty-Print JSON

Source: https://docs.github.com/en/actions/learn-github-actions/expressions

Example of 'toJSON' function to serialize a value (like a job object) into a human-readable JSON string for debugging.

```Expression
toJSON(job)
```

--------------------------------

### Run GitHub Actions Importer Configure Command

Source: https://docs.github.com/en/actions/tutorials/migrate-to-github-actions/automated-migrations/circleci-migration

Initiates the interactive configuration process for GitHub Actions Importer, prompting for CI provider details and credentials.

```shell
gh actions-importer configure
```

--------------------------------

### GET runner

Source: https://docs.github.com/en/actions/reference/contexts-reference

The runner context contains information about the runner that is executing the current job, including OS, architecture, and temporary directory paths.

```APIDOC
## GET runner\n\n### Description\nThe runner context contains information about the runner that is executing the current job. This context changes for each job in a workflow run.\n\n### Method\nGET\n\n### Endpoint\nrunner\n\n### Parameters\n#### Response Body\n- **name** (string) - The name of the runner executing the job.\n- **os** (string) - The operating system of the runner executing the job (Linux, Windows, or macOS).\n- **arch** (string) - The architecture of the runner executing the job (X86, X64, ARM, or ARM64).\n- **temp** (string) - The path to a temporary directory on the runner.\n- **tool_cache** (string) - The path to the directory containing preinstalled tools for GitHub-hosted runners.\n- **debug** (string) - Set to 1 if debug logging is enabled.\n- **environment** (string) - The environment of the runner (github-hosted or self-hosted).\n\n### Response\n#### Success Response (200)\n- **runner** (object) - Object containing runner environment details.\n\n### Response Example\n{\n  "os": "Linux",\n  "arch": "X64",\n  "name": "GitHub Actions 2",\n  "tool_cache": "/opt/hostedtoolcache",\n  "temp": "/home/runner/work/_temp"\n}
```

--------------------------------

### startsWith() Function - String Prefix Matching

Source: https://docs.github.com/en/actions/reference/workflows-and-actions/expressions

Checks if a string starts with a specified substring. Case-insensitive comparison. Returns true if the searchString begins with searchValue, false otherwise. Useful for validating string prefixes in workflow conditions.

```GitHub Actions Expression
startsWith('Hello world', 'He')
```

--------------------------------

### Executing Shell Commands with the run Keyword

Source: https://docs.github.com/en/actions/tutorials/creating-an-example-workflow

The run keyword executes commands on the runner's shell. Use it to install dependencies or run tests.

```yaml
      - run: npm install -g bats
```

```yaml
      - run: bats -v
```

```yaml
      - run: npm install -g bats
```

```yaml
      - run: bats -v
```

--------------------------------

### Configure self-hosted runner with labels in YAML

Source: https://docs.github.com/en/actions/how-tos/write-workflows/choose-where-workflows-run/choose-the-runner-for-a-job

Use `runs-on` with an array starting with `self-hosted` followed by additional labels (e.g., `linux`) to target specific self-hosted runners. The `self-hosted` label must be listed first.

```yaml
runs-on: [self-hosted, linux]
```

--------------------------------

### Basic Runner Scale Set Configuration for Kubernetes Legacy Versions

Source: https://docs.github.com/en/actions/how-tos/manage-runners/use-actions-runner-controller/deploy-runner-scale-sets

Provides essential configuration parameters for a GitHub Actions runner scale set, including the GitHub URL, authentication secrets, and scaling limits. This example is specifically noted for compatibility with Kubernetes versions prior to v1.29.

```yaml
githubConfigUrl: "https://github.com/actions/actions-runner-controller"

githubConfigSecret: my-super-safe-secret

maxRunners: 5

minRunners: 0

runnerGroup: "my-custom-runner-group"

runnerScaleSetName: "my-awesome-scale-set"

template:
```

--------------------------------

### Trigger push workflow on specific tags

Source: https://docs.github.com/en/actions/writing-workflows/choosing-when-your-workflow-runs/events-that-trigger-workflows

This workflow runs when a tag starting with `v1.` is pushed. Use the `tags` filter to specify tag patterns.

```yaml
on:
  push:
    tags:
      - v1.**
```

--------------------------------

### Example usage of the matrix context in GitHub Actions

Source: https://docs.github.com/en/actions/reference/accessing-contextual-information-about-workflow-runs

This workflow demonstrates how to use the matrix context to define multiple job configurations based on os and node versions. It sets the runner type and Node.js version dynamically for each job.

```YAML
name: Test matrix
on: push

jobs:
  build:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest]
        node: [14, 16]
    steps:
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node }}
      - name: Output node version
        run: node --version
```

--------------------------------

### Expand Matrix Configurations with `include`

Source: https://docs.github.com/en/actions/how-tos/writing-workflows/choosing-what-your-workflow-does/running-variations-of-jobs-in-a-workflow

Use `include` to add new configurations or expand existing matrix combinations. Each `include` entry is a list of objects that modifies or adds to the matrix.

```yaml
strategy:
  matrix:
    fruit: [apple, pear]
    animal: [cat, dog]
    include:
      - color: green
      - color: pink
        animal: cat
      - fruit: apple
        shape: circle
      - fruit: banana
      - fruit: banana
        animal: cat
```

--------------------------------

### Use conditional expressions for jobs

Source: https://docs.github.com/en/actions/automating-your-workflow-with-github-actions/workflow-syntax-for-github-actions

Apply the if conditional to prevent a job from running unless a condition is met. Expressions starting with ! must use the ${{ }} syntax.

```yaml
if: ${{ ! startsWith(github.ref, 'refs/tags/') }}

```

--------------------------------

### Action Metadata README - Markdown

Source: https://docs.github.com/en/actions/tutorials/create-actions/create-a-javascript-action

README documentation template for a GitHub Action that describes the action's purpose, specifies required and optional inputs, defines outputs, and provides usage examples. This file helps users understand how to use the action in their workflows and is essential for publicly shared actions.

```markdown
# Hello world JavaScript action

This action prints "Hello World" or "Hello" + the name of a person to greet to the log.

## Inputs

### `who-to-greet`

**Required** The name of the person to greet. Default `"World"`.

## Outputs

### `time`

The time we greeted you.

## Example usage

```yaml
uses: actions/hello-world-javascript-action@e76147da8e5c81eaf017dede5645551d4b94427b
with:
  who-to-greet: Mona the Octocat
```
```

--------------------------------

### Debugging Context Information

Source: https://docs.github.com/en/actions/reference/workflows-and-actions/contexts

Example workflow demonstrating how to print GitHub Actions context information to logs for debugging purposes using the toJSON function.

```APIDOC
## Debugging Context Information

### Description
Print context information to workflow logs for debugging. The toJSON function is required to pretty-print JSON objects.

### Warning
When using the whole github context, be mindful that it includes sensitive information such as github.token. GitHub masks secrets when printed to the console, but exercise caution when exporting or printing the context.

### Example Workflow

```yaml
name: Context testing
on: push

jobs:
  dump_contexts_to_log:
    runs-on: ubuntu-latest
    steps:
      - name: Dump GitHub context
        env:
          GITHUB_CONTEXT: ${{ toJson(github) }}
        run: echo "$GITHUB_CONTEXT"
      - name: Dump job context
        env:
          JOB_CONTEXT: ${{ toJson(job) }}
        run: echo "$JOB_CONTEXT"
      - name: Dump steps context
        env:
          STEPS_CONTEXT: ${{ toJson(steps) }}
        run: echo "$STEPS_CONTEXT"
      - name: Dump runner context
        env:
          RUNNER_CONTEXT: ${{ toJson(runner) }}
        run: echo "$RUNNER_CONTEXT"
      - name: Dump strategy context
        env:
          STRATEGY_CONTEXT: ${{ toJson(strategy) }}
        run: echo "$STRATEGY_CONTEXT"
      - name: Dump matrix context
        env:
          MATRIX_CONTEXT: ${{ toJson(matrix) }}
        run: echo "$MATRIX_CONTEXT"
```

### Available Contexts for Debugging
- **github**: GitHub event and workflow information
- **job**: Current job execution details
- **steps**: Step outputs and results
- **runner**: Runner environment information
- **strategy**: Strategy matrix configuration
- **matrix**: Matrix variable values
```

--------------------------------

### Migrate Azure DevOps Release Pipeline with Project Specification

Source: https://docs.github.com/en/actions/tutorials/migrate-to-github-actions/automated-migrations/azure-devops-migration

This example shows how to migrate a release pipeline by specifying the Azure DevOps project name. The output demonstrates the log file location and the pull request URL generated upon successful migration.

```shell
$ gh actions-importer migrate azure-devops release --target-url https://github.com/octo
```

--------------------------------

### Build and Deploy PHP Application to Azure Web App using GitHub Actions

Source: https://docs.github.com/en/actions/how-tos/deploy/deploy-to-third-party-platforms/php-to-azure-app-service

This GitHub Actions workflow automates the build and deployment of a PHP application to an Azure Web App. It includes steps for setting up PHP, managing Composer dependencies with caching, creating a build artifact, and finally deploying the artifact to Azure using a publish profile.

```yaml
name: Build and deploy PHP app to Azure Web App

env:
  AZURE_WEBAPP_NAME: MY_WEBAPP_NAME   # set this to your application's name
  AZURE_WEBAPP_PACKAGE_PATH: '.'      # set this to the path to your web app project, defaults to the repository root
  PHP_VERSION: '8.x'                  # set this to the PHP version to use

on:
  push:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v5

      - name: Setup PHP
        uses: shivammathur/setup-php@1f2e3d4c5b6a7f8e9d0c1b2a3e4f5d6c7b8a9e0f
        with:
          php-version: ${{ env.PHP_VERSION }}

      - name: Check if composer.json exists
        id: check_files
        uses: andstor/file-existence-action@2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b
        with:
          files: 'composer.json'

      - name: Get Composer Cache Directory
        id: composer-cache
        if: steps.check_files.outputs.files_exists == 'true'
        run: |
          echo "dir=$(composer config cache-files-dir)" >> $GITHUB_OUTPUT

      - name: Set up dependency caching for faster installs
        uses: actions/cache@v4
        if: steps.check_files.outputs.files_exists == 'true'
        with:
          path: ${{ steps.composer-cache.outputs.dir }}
          key: ${{ runner.os }}-composer-${{ hashFiles('**/composer.lock') }}
          restore-keys: |
            ${{ runner.os }}-composer-

      - name: Run composer install if composer.json exists
        if: steps.check_files.outputs.files_exists == 'true'
        run: composer validate --no-check-publish && composer install --prefer-dist --no-progress

      - name: Upload artifact for deployment job
        uses: actions/upload-artifact@v4
        with:
          name: php-app
          path: .

  deploy:
    runs-on: ubuntu-latest
    needs: build
    environment:
      name: 'production'
      url: ${{ steps.deploy-to-webapp.outputs.webapp-url }}

    steps:
      - name: Download artifact from build job
        uses: actions/download-artifact@v5
        with:
          name: php-app

      - name: 'Deploy to Azure Web App'
        id: deploy-to-webapp
        uses: azure/webapps-deploy@85270a1854658d167ab239bce43949edb336fa7c
        with:
          app-name: ${{ env.AZURE_WEBAPP_NAME }}
          publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
          package: .
```

--------------------------------

### Create the goodbye shell script

Source: https://docs.github.com/en/actions/tutorials/create-actions/create-a-composite-action?platform=windows

Initialize a script file that will be executed as part of the composite action's logic.

```shell
echo "echo Goodbye" > goodbye.sh


```

```shell
echo "echo Goodbye" > goodbye.sh


```

--------------------------------

### Custom property and OIDC claim name mapping

Source: https://docs.github.com/en/actions/reference/security/oidc

Examples of how custom property names are mapped to OIDC claim names using the repo_property_ prefix.

```text
business_unit
```

```text
repo_property_business_unit
```

```text
workspace_id
```

```text
repo_property_workspace_id
```

```text
data_classification
```

```text
repo_property_data_classification
```

--------------------------------

### Add GitHub TrustRoot and ClusterImagePolicy

Source: https://docs.github.com/en/actions/how-tos/security-for-github-actions/using-artifact-attestations/enforcing-artifact-attestations-with-a-kubernetes-admission-controller

Installs the GitHub trust root and an artifact attestation policy into your cluster using a Helm chart. Replace 'MY-ORGANIZATION' with your GitHub organization's name. This policy rejects artifacts not originating from your organization.

```bash
helm upgrade trust-policies --install --atomic \
 --namespace artifact-attestations \
 oci://ghcr.io/github/artifact-attestations-helm-charts/trust-policies \
 --version v0.7.0 \
 --set policy.enabled=true \
 --set policy.organization=MY-ORGANIZATION
```

```bash
helm upgrade trust-policies --install --atomic \
 --namespace artifact-attestations \
 oci://ghcr.io/github/artifact-attestations-helm-charts/trust-policies \
 --version v0.7.0 \
 --set policy.enabled=true \
 --set policy.organization=MY-ORGANIZATION
```

--------------------------------

### Run GitHub Actions Job with Redis Service on Runner Host

Source: https://docs.github.com/en/actions/tutorials/use-containerized-services/create-redis-service-containers

A complete workflow example that runs a job on the runner machine, mapping the Redis service container port to the host's localhost. It includes health checks to ensure the Redis service is ready before the job steps execute.

```yaml
name: Redis runner example
on: push

jobs:
  # Label of the runner job
  runner-job:
    # You must use a Linux environment when using service containers or container jobs
    runs-on: ubuntu-latest

    # Service containers to run with `runner-job`
    services:
      # Label used to access the service container
      redis:
        # Docker Hub image
        image: redis
        # Set health checks to wait until redis has started
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          # Maps port 6379 on service container to the host
          - 6379:6379

    steps:
      # Downloads a copy of the code in your repository before running CI tests
      - name: Check out repository code
        uses: actions/checkout@v5

      # Performs a clean installation of all dependencies in the `package.json` file
      # For more information, see https://docs.npmjs.com/cli/ci.html
      - name: Install dependencies
        run: npm ci

      - name: Connect to Redis
        # Runs a script that creates a Redis client, populates
        # the client with data, and retrieves data
        run: node client.js
        # Environment variable used by the `client.js` script to create
        # a new Redis client.
        env:
          # The hostname used to communicate with the Redis service container
          REDIS_HOST: localhost
          # The default Redis port
          REDIS_PORT: 6379
```

--------------------------------

### Azure Pipelines Job Dependencies

Source: https://docs.github.com/en/actions/migrating-to-github-actions/manually-migrating-to-github-actions/migrating-from-azure-pipelines-to-github-actions

This example illustrates how to define job dependencies using the 'dependsOn' key in Azure Pipelines to control execution order.

```yaml
jobs:
  - job: initial
    pool:
      vmImage: 'ubuntu-latest'
    steps:
      - script: echo "This job will be run first."
  - job: fanout1
    pool:
      vmImage: 'ubuntu-latest'
    dependsOn: initial
    steps:
      - script: echo "This job will run after the initial job, in parallel with fanout2."
  - job: fanout2
    pool:
      vmImage: 'ubuntu-latest'
    dependsOn: initial
    steps:
      - script: echo "This job will run after the initial job, in parallel with fanout1."
  - job: fanin
    pool:
      vmImage: 'ubuntu-latest'
    dependsOn: [fanout1, fanout2]
    steps:
      - script: echo "This job will run after fanout1 and fanout2 have finished."
```

--------------------------------

### Using Predefined Actions

Source: https://docs.github.com/en/actions/tutorials/creating-an-example-workflow

The uses keyword allows the workflow to run community or official actions like checking out code or setting up environments.

```yaml
      - uses: actions/checkout@v5
```

```yaml
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
```

--------------------------------

### Publish package to Maven Central via GitHub Actions

Source: https://docs.github.com/en/actions/tutorials/publish-packages/publish-java-packages-with-maven

Automate the deployment process when a new release is created. The workflow uses the setup-java action to configure credentials and runs the mvn deploy command.

```yaml
name: Publish package to the Maven Central Repository
on:
  release:
    types: [created]
jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - name: Set up Maven Central Repository
        uses: actions/setup-java@v4
        with:
          java-version: '11'
          distribution: 'temurin'
          server-id: ossrh
          server-username: MAVEN_USERNAME
          server-password: MAVEN_PASSWORD
      - name: Publish package
        run: mvn --batch-mode deploy
        env:
          MAVEN_USERNAME: ${{ secrets.OSSRH_USERNAME }}
          MAVEN_PASSWORD: ${{ secrets.OSSRH_TOKEN }}
```

--------------------------------

### Complete Node.js CI Workflow with Single Version

Source: https://docs.github.com/en/actions/tutorials/build-and-test-code/nodejs

A complete GitHub Actions workflow that checks out code, sets up Node.js 20.x, installs dependencies with npm ci, builds the project, and runs tests. This is a minimal single-version configuration suitable for projects that don't require multi-version testing.

```YAML
name: Node.js CI

on: [push]

jobs:
  build:

    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v5
      - name: Use Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20.x'
      - run: npm ci
      - run: npm run build --if-present
      - run: npm test
```

--------------------------------

### Create Azure App Service Web App with .NET Runtime

Source: https://docs.github.com/en/actions/how-tos/deploy/deploy-to-third-party-platforms/net-to-azure-app-service

Creates a new Azure App Service web app with .NET 5.0 runtime using the Azure CLI. Replace MY_WEBAPP_NAME with your desired web app name, MY_APP_SERVICE_PLAN with the plan created in the previous step, and MY_RESOURCE_GROUP with your resource group. The --runtime parameter specifies the .NET version to use.

```bash
az webapp create \
    --name MY_WEBAPP_NAME \
    --plan MY_APP_SERVICE_PLAN \
    --resource-group MY_RESOURCE_GROUP \
    --runtime "DOTNET|5.0"
```

--------------------------------

### Monitor runner automatic update logs

Source: https://docs.github.com/en/actions/how-tos/manage-runners/self-hosted-runners/monitor-and-troubleshoot?platform=mac

Example log entry from the Runner_ log files indicating that a self-hosted runner application update is available.

```text
[Feb 12 12:37:07 INFO SelfUpdater] An update is available.

```

--------------------------------

### GET /contexts/matrix

Source: https://docs.github.com/en/actions/reference/accessing-contextual-information-about-workflow-runs

The matrix context contains the properties defined in the strategy matrix for the current job. It allows you to access variables for parallel job execution.

```APIDOC
## GET /contexts/matrix

### Description
The matrix context is used to access variables defined in a strategy matrix for a job, enabling multi-environment testing.

### Method
GET

### Endpoint
matrix

### Parameters
#### Context Properties
- **matrix.<property_name>** (string|number) - Required - The value of a specific property defined in the strategy matrix.

### Request Example
```yaml
strategy:
  matrix:
    os: [ubuntu-latest, windows-latest]
    node: [14, 16]
```

### Response
#### Success Response (200)
- **matrix.os** (string) - The operating system for the current job instance.
- **matrix.node** (number) - The Node.js version for the current job instance.

#### Response Example
{
  "os": "ubuntu-latest",
  "node": 16
}
```

--------------------------------

### Configure Action Inputs with jobs.<job_id>.steps[*].with

Source: https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions

This snippet demonstrates how to pass input parameters to a GitHub Action using the `with` keyword. These parameters are exposed as environment variables prefixed with `INPUT_` to the action.

```yaml
jobs:
  my_first_job:
    steps:
      - name: My first step
        uses: actions/hello_world@main
        with:
          first_name: Mona
          middle_name: The
          last_name: Octocat

```

--------------------------------

### jobs.<job_id>.container

Source: https://docs.github.com/en/actions/automating-your-workflow-with-github-actions/workflow-syntax-for-github-actions

Defines a Docker container to run all steps within a job that do not explicitly specify their own container. Requires a Linux runner with Docker installed.

```APIDOC
## jobs.<job_id>.container

### Description
Use `jobs.<job_id>.container` to create a container to run any steps in a job that don't already specify a container. If you have steps that use both script and container actions, the container actions will run as sibling containers on the same network with the same volume mounts. Requires a Linux runner with Docker installed.

### Parameters
#### Request Body
- **image** (string) - Required - The Docker image to use. Can be a Docker Hub image name or a registry name.
- **env** (object) - Optional - A map of environment variables to set in the container.
- **ports** (array of integers) - Optional - A list of ports to expose from the container.
- **volumes** (array of strings) - Optional - A list of volumes to mount into the container.
- **options** (string) - Optional - Additional Docker run options.

### Request Example
```yaml
name: CI
on:
  push:
    branches: [ main ]
jobs:
  container-test-job:
    runs-on: ubuntu-latest
    container:
      image: node:18
      env:
        NODE_ENV: development
      ports:
        - 80
      volumes:
        - my_docker_volume:/volume_mount
      options: --cpus 1
    steps:
      - name: Check for dockerenv file
        run: (ls /.dockerenv && echo Found dockerenv) || (echo No dockerenv)

```
```

--------------------------------

### Resource naming and namespace character limit errors

Source: https://docs.github.com/en/actions/hosting-your-own-runners/managing-self-hosted-runners-with-actions-runner-controller/troubleshooting-actions-runner-controller-errors

Errors occurring when the installation name or namespace exceeds ARC's character limits for resource labels.

```text
Error: INSTALLATION FAILED: execution error at (gha-runner-scale-set/templates/autoscalingrunnerset.yaml:5:5): Name must have up to 45 characters

Error: INSTALLATION FAILED: execution error at (gha-runner-scale-set/templates/autoscalingrunnerset.yaml:8:5): Namespace must have up to 63 characters

```

--------------------------------

### Build Swift across multiple versions and OS using Matrix

Source: https://docs.github.com/en/actions/tutorials/build-and-test-code/swift

Configures a GitHub Actions workflow to test a Swift package on both Ubuntu and macOS using multiple Swift versions (5.2 and 5.3). It uses a strategy matrix to parallelize jobs and ensure cross-platform compatibility.

```yaml
name: Swift

on: [push]

jobs:
  build:
    name: Swift ${{ matrix.swift }} on ${{ matrix.os }}
    strategy:
      matrix:
        os: [ubuntu-latest, macos-latest]
        swift: ["5.2", "5.3"]
    runs-on: ${{ matrix.os }}
    steps:
      - uses: swift-actions/setup-swift@65540b95f51493d65f5e59e97dcef9629ddf11bf
        with:
          swift-version: ${{ matrix.swift }}
      - uses: actions/checkout@v5
      - name: Build
        run: swift build
      - name: Run tests
        run: swift test
```

--------------------------------

### Cache Python Dependencies with setup-python in GitHub Actions

Source: https://docs.github.com/en/actions/tutorials/build-and-test-code/python

Caches pip dependencies using the setup-python action to speed up workflow execution. The action automatically detects and caches requirements.txt files. This reduces installation time on subsequent workflow runs by reusing cached packages.

```yaml
steps:
- uses: actions/checkout@v5
- uses: actions/setup-python@v5
  with:
    python-version: '3.12'
    cache: 'pip'
- run: pip install -r requirements.txt
- run: pip test
```

--------------------------------

### Control Workflow Command Processing with Stop and Start Tokens

Source: https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-commands

Syntax for pausing and resuming the execution of GitHub Actions workflow commands using a unique token.

```text
::stop-commands::{endtoken}
::{endtoken}::
```

--------------------------------

### Generate SBOM attestation for a binary

Source: https://docs.github.com/en/actions/security-guides/using-artifact-attestations-to-establish-provenance-for-builds

Add this step after building the binary and generating its SBOM to create an SBOM attestation. Set `subject-path` to the binary's path and `sbom-path` to the SBOM file's path.

```yaml
- name: Generate SBOM attestation
  uses: actions/attest@v4
  with:
    subject-path: 'PATH/TO/ARTIFACT'
    sbom-path: 'PATH/TO/SBOM'

```

--------------------------------

### Disable Workflow Commands in Windows

Source: https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-commands?tool=powershell

This example shows how to disable and re-enable workflow commands in a Windows environment using `New-Guid` to generate a unique stop marker.

```yaml
jobs:
  workflow-command-job:
    runs-on: windows-latest
    steps:
      - name: Disable workflow commands
        run: |
          Write-Output '::warning:: This is a warning message, to demonstrate that commands are being processed.'
          $stopMarker = New-Guid
          Write-Output "::stop-commands::$stopMarker"
          Write-Output '::warning:: This will NOT be rendered as a warning, because stop-commands has been invoked.'
          Write-Output "::$stopMarker::"
          Write-Output '::warning:: This is a warning again, because stop-commands has been turned off.'

```

--------------------------------

### Disable Workflow Commands in Linux

Source: https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-commands?tool=powershell

This example demonstrates disabling and re-enabling workflow commands in a Linux environment using `uuidgen` to generate a unique stop marker.

```yaml
jobs:
  workflow-command-job:
    runs-on: ubuntu-latest
    steps:
      - name: Disable workflow commands
        run: |
          echo '::warning:: This is a warning message, to demonstrate that commands are being processed.'
          stopMarker=$(uuidgen)
          echo "::stop-commands::$stopMarker"
          echo '::warning:: This will NOT be rendered as a warning, because stop-commands has been invoked.'
          echo "::$stopMarker::"
          echo '::warning:: This is a warning again, because stop-commands has been turned off.'

```

--------------------------------

### Define the Dockerfile for the action

Source: https://docs.github.com/en/actions/creating-actions/creating-a-docker-container-action

Specifies the base image and entry point for the container. Ensure the filename is 'Dockerfile' with a capital 'D'.

```Dockerfile
# Container image that runs your code
FROM alpine:3.10

# Copies your code file from your action repository to the filesystem path `/` of the container
COPY entrypoint.sh /entrypoint.sh

# Code file to execute when the docker container starts up (`entrypoint.sh`)
ENTRYPOINT ["/entrypoint.sh"]

```

```Dockerfile
# Container image that runs your code
FROM alpine:3.10

# Copies your code file from your action repository to the filesystem path `/` of the container
COPY entrypoint.sh /entrypoint.sh

# Code file to execute when the docker container starts up (`entrypoint.sh`)
ENTRYPOINT ["/entrypoint.sh"]

```

--------------------------------

### Set Multiline Environment Variables

Source: https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-commands

Syntax and examples for setting environment variables that contain multiple lines of text using a unique delimiter to prevent truncation.

```text
{name}<<{delimiter}
{value}
{delimiter}
```

```yaml
steps:
  - name: Set the value in bash
    id: step_one
    run: |
      {
        echo 'JSON_RESPONSE<<EOF'
        curl https://example.com
        echo EOF
      } >> "$GITHUB_ENV"
```

```yaml
steps:
  - name: Set the value in pwsh
    id: step_one
    run: |
      $EOF = (New-Guid).Guid
      "JSON_RESPONSE<<$EOF" >> $env:GITHUB_ENV
      (Invoke-WebRequest -Uri "https://example.com").Content >> $env:GITHUB_ENV
      "$EOF" >> $env:GITHUB_ENV
    shell: pwsh
```

--------------------------------

### Audit Jenkins Instance using --config-file-path

Source: https://docs.github.com/en/actions/tutorials/migrate-to-github-actions/automated-migrations/jenkins-migration

This example illustrates how to perform an audit of a Jenkins instance using the GitHub Actions Importer's `audit` subcommand. The `--config-file-path` argument points to a YAML configuration file that defines the Jenkins jobs to be audited, with results directed to a specified output directory.

```shell
gh actions-importer audit jenkins --output-dir path/to/output/ --config-file-path path/to/jenkins/config.yml
```

--------------------------------

### OIDC token claim examples for supported property types

Source: https://docs.github.com/en/actions/reference/security/oidc

Representation of String, Single select, Multi select, and Boolean custom properties in the OIDC token.

```json
"repo_property_team": "platform-eng"
```

```json
"repo_property_env_tier": "production"
```

```json
"repo_property_regions": "us-east-1,eu-west-1"
```

```json
"repo_property_pci_compliant": "true"
```

--------------------------------

### Cache npm Dependencies in GitHub Actions

Source: https://docs.github.com/en/actions/automating-builds-and-tests/building-and-testing-nodejs

Use `setup-node` with `cache: 'npm'` to cache Node.js dependencies managed by npm, speeding up subsequent workflow runs. This snippet checks out the repository, sets up Node.js, installs, and tests npm packages.

```YAML
steps:
- uses: actions/checkout@v5
- uses: actions/setup-node@v4
  with:
    node-version: '20'
    cache: 'npm'
- run: npm install
- run: npm test
```

```YAML
steps:
- uses: actions/checkout@v5
- uses: actions/setup-node@v4
  with:
    node-version: '20'
    cache: 'npm'
- run: npm install
- run: npm test
```

--------------------------------

### Example Workflow Template with Default Branch Placeholder

Source: https://docs.github.com/en/actions/reference/reusable-workflows-reference

This YAML defines a basic CI workflow template for an organization. It demonstrates the use of the `$default-branch` placeholder, which is automatically replaced with the repository's default branch name when the workflow is created from this template.

```YAML
name: Octo Organization CI
on:
  push:
    branches: [ $default-branch ]
  pull_request:
    branches: [ $default-branch ]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - name: Run a one-line script
        run: echo Hello from Octo Organization
```

```YAML
name: Octo Organization CI
on:
  push:
    branches: [ $default-branch ]
  pull_request:
    branches: [ $default-branch ]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - name: Run a one-line script
        run: echo Hello from Octo Organization
```

--------------------------------

### Cache Maven Dependencies with setup-java in GitHub Actions

Source: https://docs.github.com/en/actions/automating-builds-and-tests/building-and-testing-java-with-maven

Use the `setup-java` action to automatically cache Maven dependencies, which speeds up subsequent workflow runs. The cache key is derived from the `pom.xml` file.

```YAML
steps:
  - uses: actions/checkout@v5
  - name: Set up JDK 17
    uses: actions/setup-java@v4
    with:
      java-version: '17'
      distribution: 'temurin'
      cache: maven
  - name: Build with Maven
    run: mvn --batch-mode --update-snapshots verify
```

--------------------------------

### YAML jobs.<job_id>.steps

Source: https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax

Defines a sequence of tasks for a job. Steps can run commands, setup tasks, or actions in various repositories or Docker registries.

```APIDOC
## YAML jobs.<job_id>.steps

### Description
A job contains a sequence of tasks called steps. Each step runs in its own process in the runner environment and has access to the workspace and filesystem.

### Method
YAML Configuration

### Endpoint
jobs.<job_id>.steps

### Parameters
#### Request Body
- **id** (string) - Optional - A unique identifier for the step to reference it in contexts.
- **if** (string) - Optional - A conditional expression to prevent the step from running unless conditions are met.
- **name** (string) - Optional - A name for the step to display on the GitHub UI.
- **run** (string) - Optional - The command to run in the runner's shell.
- **uses** (string) - Optional - Selects an action to run as part of a step.
- **env** (object) - Optional - Sets environment variables for the step.

### Request Example
```yaml
jobs:
  my-job:
    runs-on: ubuntu-latest
    steps:
      - name: Print a greeting
        env:
          MY_VAR: Hi there!
        run: echo $MY_VAR
```

### Response
#### Success Response (200)
- **step_status** (string) - The execution result of the individual step (success, failure, or skipped).
```

--------------------------------

### Run initial audit to generate `config.yml` for reusable workflows

Source: https://docs.github.com/en/actions/tutorials/migrate-to-github-actions/automated-migrations/gitlab-migration

This snippet shows how to run an initial audit without `--config-file-path` to generate a `config.yml` file containing converted composite actions.

```shell
gh actions-importer audit gitlab --output-dir ./output/
```

--------------------------------

### Docker Not Found Error Message

Source: https://docs.github.com/en/actions/hosting-your-own-runners/managing-self-hosted-runners/monitoring-and-troubleshooting-self-hosted-runners

This error message indicates that the 'docker' executable was not found on the self-hosted runner. This typically means Docker is not installed or not in the system's PATH.

```Log
[2020-02-13 16:56:10Z INFO DockerCommandManager] Which: 'docker'
[2020-02-13 16:56:10Z INFO DockerCommandManager] Not found.
[2020-02-13 16:56:10Z ERR  StepsRunner] Caught exception from step: System.IO.FileNotFoundException: File not found: 'docker'
```

--------------------------------

### Detect Runner Operating System using runner.os in GitHub Actions

Source: https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/use-variables

This example shows how to use the runner.os context property to implement conditional logic for different operating systems. This allows a single workflow to handle platform-specific shell syntax (like PowerShell vs Bash) without changing the workflow structure.

```yaml
on: workflow_dispatch

jobs:
  if-Windows-else:
    runs-on: macos-latest
    steps:
      - name: condition 1
        if: runner.os == 'Windows'
        run: echo "The operating system on the runner is $env:RUNNER_OS."
      - name: condition 2
        if: runner.os != 'Windows'
        run: echo "The operating system on the runner is not Windows, it's $RUNNER_OS."
```

--------------------------------

### Define GitHub Action Entrypoint Script (Shell)

Source: https://docs.github.com/en/actions/tutorials/use-containerized-services/create-a-docker-container-action

This shell script serves as the entrypoint for a Docker-based GitHub Action. It takes an input variable, prints a greeting, and sets the current time as an output variable for subsequent steps in a workflow. Output variables are written to the $GITHUB_OUTPUT environment file.

```shell
#!/bin/sh -l

echo "Hello $1"
time=$(date)
echo "time=$time" >> $GITHUB_OUTPUT
```

--------------------------------

### Define GitHub Actions Workflow for Runner Scale Set

Source: https://docs.github.com/en/actions/hosting-your-own-runners/managing-self-hosted-runners-with-actions-runner-controller/quickstart-for-actions-runner-controller

Configure a GitHub Actions workflow to utilize a runner scale set by setting 'runs-on' to the installation name.

```yaml
name: Actions Runner Controller Demo
on:
  workflow_dispatch:

jobs:
  Explore-GitHub-Actions:
    # You need to use the INSTALLATION_NAME from the previous step
    runs-on: arc-runner-set
    steps:
    - run: echo "🎉 This job uses runner scale set runners!"

```

--------------------------------

### Conditionally set service container image

Source: https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions

Use a conditional expression to set the service image based on workflow options. An empty string prevents the service from starting.

```yaml
services:
  nginx:
    image: ${{ options.nginx == true && 'nginx' || '' }}
```

--------------------------------

### Filter patterns with special characters in YAML

Source: https://docs.github.com/en/actions/automating-your-workflow-with-github-actions/workflow-syntax-for-github-actions

When starting a pattern with `*`, `[`, or `!`, enclose it in quotes to avoid YAML parse errors. Flow sequences containing `[` or `]` must also be quoted.

```yaml
# Valid
paths:
  - '**/README.md'

# Invalid - creates a parse error that
# prevents your workflow from running.
paths:
  - **/README.md

# Valid
branches: [ main, 'release/v[0-9].[0-9]' ]

# Invalid - creates a parse error
branches: [ main, release/v[0-9].[0-9] ]
```

--------------------------------

### Conditional 'if' with '!' in GitHub Actions YAML

Source: https://docs.github.com/en/actions/creating-actions/metadata-syntax-for-github-actions

Use this conditional to prevent a step from running unless a condition is met, especially when the expression starts with '!' which requires explicit '${{ }}' or escaping.

```yaml
if: ${{ ! startsWith(github.ref, 'refs/tags/') }}
```

--------------------------------

### jobs.<job_id>.steps[*].with

Source: https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions

Configures input parameters for an action. These parameters are exposed as environment variables prefixed with `INPUT_` and uppercase. For Docker actions, `args` should be used instead.

```APIDOC
## `jobs.<job_id>.steps[*].with`

### Description
Configures input parameters for an action. These parameters are exposed as environment variables prefixed with `INPUT_` and uppercase. For Docker actions, `args` should be used instead.

### Configuration Path
`jobs.<job_id>.steps[*].with`

### Parameters
#### Request Body
- **first_name** (string) - Required - The first name input for the action.
- **middle_name** (string) - Optional - The middle name input for the action.
- **last_name** (string) - Required - The last name input for the action.

### Request Example
```yaml
jobs:
  my_first_job:
    steps:
      - name: My first step
        uses: actions/hello_world@main
        with:
          first_name: Mona
          middle_name: The
          last_name: Octocat
```
```

--------------------------------

### Example Repository Dispatch Event Payload

Source: https://docs.github.com/en/actions/writing-workflows/choosing-when-your-workflow-runs/events-that-trigger-workflows

This JSON payload demonstrates how to structure a request body for triggering a `repository_dispatch` event. It includes a custom `event_type` and `client_payload` data.

```JSON
{
  "event_type": "test_result",
  "client_payload": {
    "passed": false,
    "message": "Error: timeout"
  }
}

```

--------------------------------

### Configure Docker Container Arguments (runs.args)

Source: https://docs.github.com/en/actions/reference/workflows-and-actions/metadata-syntax

This section details the `runs.args` property, which allows defining inputs for a Docker container within a GitHub Action workflow. These arguments are passed to the container's `ENTRYPOINT` upon startup, serving a similar purpose to the `CMD` instruction in a `Dockerfile`.

```APIDOC
## CONFIGURATION runs.args

### Description
An array of strings that define the inputs for a Docker container. Inputs can include hardcoded strings. GitHub passes the `args` to the container's `ENTRYPOINT` when the container starts up.

The `args` are used in place of the `CMD` instruction in a `Dockerfile`. If you use `CMD` in your `Dockerfile`, use the guidelines ordered by preference:
1. Document required arguments in the action's README and omit them from the `CMD` instruction.
2. Use defaults that allow using the action without specifying any `args`.
3. If the action exposes a `--help` flag, or something similar, use that to make your action self-documenting.

If you need to pass environment variables into an action, make sure your action runs a command shell to perform variable substitution. For example, if the `entrypoint` attribute is set to "sh -c", `args` will be run in a command shell. Alternatively, if your `Dockerfile` uses an `ENTRYPOINT` to run the same command ("sh -c"), `args` will execute in a command shell.

### Method
N/A (Configuration Property)

### Endpoint
N/A (Configuration Property)

### Parameters
#### Request Body
- **args** (array of string) - Optional - An array of strings that define the inputs for a Docker container.

### Request Example
```yaml
runs:
  using: 'docker'
  image: 'Dockerfile'
  args:
    - ${{ inputs.greeting }}
    - 'foo'
    - 'bar'
```

### Response
N/A (Configuration, no direct response)
```

--------------------------------

### GitHub Actions After-Script Pattern with always() and steps Conclusion

Source: https://docs.github.com/en/actions/tutorials/migrate-to-github-actions/automated-migrations/bitbucket-pipelines-migration

YAML workflow example demonstrating how to replicate Bitbucket Pipelines after-scripts using GitHub Actions. Uses the always() function combined with steps.<step_id>.conclusion to conditionally execute steps after previous steps complete, regardless of success or failure.

```yaml
- name: After Script 1
  run: |-
    echo "I'm after the script ran!"
    echo "We should be grouped!"
  id: after-script-1
  if: "${{ always() }}"
- name: After Script 2
  run: |-
    echo "this is really the end"
    echo "goodbye, for now!"
  id: after-script-2
  if: "${{ steps.after-script-1.conclusion == 'success' && always() }}"
```

--------------------------------

### Prepare Job Hook Input and Output JSON

Source: https://docs.github.com/en/actions/how-tos/manage-runners/self-hosted-runners/customize-containers

This snippet demonstrates the input and output JSON for the prepare_job command. The input specifies container images, volumes, and services, while the output provides the resulting state and context for the runner.

```json
{
  "command": "prepare_job",
  "responseFile": "/users/octocat/runner/_work/{guid}.json",
  "state": {},
  "args": {
    "jobContainer": {
      "image": "node:18",
      "workingDirectory": "/__w/octocat-test2/octocat-test2",
      "createOptions": "--cpus 1",
      "environmentVariables": {
        "NODE_ENV": "development"
      },
      "userMountVolumes": [
        {
          "sourceVolumePath": "my_docker_volume",
          "targetVolumePath": "/volume_mount",
          "readOnly": false
        }
      ],
      "systemMountVolumes": [
        {
          "sourceVolumePath": "/home/octocat/git/runner/_layout/_work",
          "targetVolumePath": "/__w",
          "readOnly": false
        },
        {
          "sourceVolumePath": "/home/octocat/git/runner/_layout/externals",
          "targetVolumePath": "/__e",
          "readOnly": true
        },
        {
          "sourceVolumePath": "/home/octocat/git/runner/_layout/_work/_temp",
          "targetVolumePath": "/__w/_temp",
          "readOnly": false
        },
        {
          "sourceVolumePath": "/home/octocat/git/runner/_layout/_work/_actions",
          "targetVolumePath": "/__w/_actions",
          "readOnly": false
        },
        {
          "sourceVolumePath": "/home/octocat/git/runner/_layout/_work/_tool",
          "targetVolumePath": "/__w/_tool",
          "readOnly": false
        },
        {
          "sourceVolumePath": "/home/octocat/git/runner/_layout/_work/_temp/_github_home",
          "targetVolumePath": "/github/home",
          "readOnly": false
        },
        {
          "sourceVolumePath": "/home/octocat/git/runner/_layout/_work/_temp/_github_workflow",
          "targetVolumePath": "/github/workflow",
          "readOnly": false
        }
      ],
      "registry": {
        "username": "octocat",
        "password": "examplePassword",
        "serverUrl": "https://index.docker.io/v1"
      },
      "portMappings": { "80": "801" }
    },
    "services": [
      {
        "contextName": "redis",
        "image": "redis",
        "createOptions": "--cpus 1",
        "environmentVariables": {},
        "userMountVolumes": [],
        "portMappings": { "80": "801" },
        "registry": {
          "username": "octocat",
          "password": "examplePassword",
          "serverUrl": "https://index.docker.io/v1"
        }
      }
    ]
  }
}
```

```json
{
  "state": {
    "network": "example_network_53269bd575972817b43f7733536b200c",
    "jobContainer": "82e8219701fe096a35941d869cf3d71af1d943b5d8bdd718857fb87ac3042480",
    "serviceContainers": {
      "redis": "60972d9aa486605e66b0dad4abb678dc3d9116f536579e418176eedb8abb9105"
    }
  },
  "context": {
    "container": {
      "id": "82e8219701fe096a35941d869cf3d71af1d943b5d8bdd718857fb87ac3042480",
      "network": "example_network_53269bd575972817b43f7733536b200c"
    },
    "services": {
      "redis": {
        "id": "60972d9aa486605e66b0dad4abb678dc3d9116f536579e418176eedb8abb9105",
        "ports": {
          "8080": "8080"
        },
        "network": "example_network_53269bd575972817b43f7733536b200c"
      }
    },
    "isAlpine": true
  }
}
```

--------------------------------

### Configure JavaScript action with Node.js v24

Source: https://docs.github.com/en/actions/creating-actions/metadata-syntax-for-github-actions

Set up a JavaScript action to run with Node.js v24 runtime, specifying the main entry point file. Use node20 or node24 for the using field.

```yaml
runs:
  using: 'node24'
  main: 'main.js'
```

--------------------------------

### CircleCI Cache Restore Syntax in YAML

Source: https://docs.github.com/en/actions/tutorials/migrate-to-github-actions/manual-migrations/migrate-from-circleci

Demonstrates CircleCI's cache restoration syntax using checksum-based cache keys. This example shows how to restore npm dependencies from cache with fallback keys, using the package-lock.json file checksum for cache validation. When migrating to GitHub Actions, similar caching can be achieved using the actions/cache action.

```yaml
- restore_cache:
    keys:
      - v1-npm-deps-{{ checksum "package-lock.json" }}
      - v1-npm-deps-
```

--------------------------------

### Configure Image Generation with String Syntax

Source: https://docs.github.com/en/actions/how-tos/manage-runners/larger-runners/use-custom-images

Use string syntax to define a simple image name. This creates a new image or adds a version to an existing image with the same name; version numbers cannot be specified with this syntax.

```yaml
jobs: 
  build:
    runs-on: my-image-generation-runner
    snapshot: my-custom-image
    steps:
      # Add any steps to download and setup any dependencies here
```

--------------------------------

### Using `github.ref` context and `GITHUB_REF` variable in a workflow

Source: https://docs.github.com/en/actions/reference/accessing-contextual-information-about-workflow-runs

This example demonstrates how to use the `github.ref` context in an `if` condition for pre-execution checks and access the `$GITHUB_REF` environment variable on the runner.

```yaml
name: CI
on: push
jobs:
  prod-check:
    if: ${{ github.ref == 'refs/heads/main' }}
    runs-on: ubuntu-latest
    steps:
      - run: echo "Deploying to production server on branch $GITHUB_REF"
```

--------------------------------

### GitHub Actions Workflow for Octopus Deploy OIDC Authentication

Source: https://docs.github.com/en/actions/how-tos/secure-your-work/security-harden-deployments/oidc-in-octopus-deploy

This example demonstrates a GitHub Actions workflow that uses the `OctopusDeploy/login` action. It exchanges a GitHub OIDC ID token for an Octopus Deploy access token, enabling secure authentication to Octopus Deploy resources. Users must configure `server` and `service_account_id` specific to their Octopus Deploy instance.

```yaml
# This workflow uses actions that are not certified by GitHub.
# They are provided by a third-party and are governed by
# separate terms of service, privacy policy, and support
```

--------------------------------

### Download Attestation Bundle

Source: https://docs.github.com/en/actions/security-guides/verifying-attestations-offline

Use this command from an online machine to download the attestation bundle for your build artifact, specifying its path and repository.

```Bash
gh attestation download PATH/TO/YOUR/BUILD/ARTIFACT-BINARY -R ORGANIZATION_NAME/REPOSITORY_NAME
```

--------------------------------

### Set Job-Level GITHUB_TOKEN Permissions

Source: https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions

Define permissions for a specific job to grant write access only to issues and pull-requests while all other permissions are none. This example uses the actions/stale action.

```yaml
jobs:
  stale:
    runs-on: ubuntu-latest

    permissions:
      issues: write
      pull-requests: write

    steps:
      - uses: actions/stale@v10
```

--------------------------------

### Connect to PostgreSQL and manage student table with Node.js

Source: https://docs.github.com/en/actions/using-containerized-services/creating-postgresql-service-containers

Node.js script using the pg module to connect to a PostgreSQL service via environment variables, create a student table, insert sample data, and retrieve results. Uses callback-based queries and prints table contents to console.

```JavaScript
const { Client } = require('pg');

const pgclient = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: 'postgres',
    password: 'postgres',
    database: 'postgres'
});

pgclient.connect();

const table = 'CREATE TABLE student(id SERIAL PRIMARY KEY, firstName VARCHAR(40) NOT NULL, lastName VARCHAR(40) NOT NULL, age INT, address VARCHAR(80), email VARCHAR(40))'
const text = 'INSERT INTO student(firstname, lastname, age, address, email) VALUES($1, $2, $3, $4, $5) RETURNING *'
const values = ['Mona the', 'Octocat', 9, '88 Colin P Kelly Jr St, San Francisco, CA 94107, United States', 'octocat@github.com']

pgclient.query(table, (err, res) => {
    if (err) throw err
});

pgclient.query(text, values, (err, res) => {
    if (err) throw err
});

pgclient.query('SELECT * FROM student', (err, res) => {
    if (err) throw err
    console.log(err, res.rows) // Print the data in student table
    pgclient.end()
});
```

--------------------------------

### Define Outputs in a Reusable GitHub Actions Workflow

Source: https://docs.github.com/en/actions/how-tos/reuse-automations/reuse-workflows

This YAML snippet defines a reusable GitHub Actions workflow that generates and exposes outputs. It demonstrates how to map step-level outputs to job-level outputs, and then expose those as workflow-level outputs ("firstword", "secondword") for consumption by caller workflows. The workflow sets two example outputs: 'hello' and 'world'.

```yaml
name: Reusable workflow

on:
  workflow_call:
    # Map the workflow outputs to job outputs
    outputs:
      firstword:
        description: "The first output string"
        value: ${{ jobs.example_job.outputs.output1 }}
      secondword:
        description: "The second output string"
        value: ${{ jobs.example_job.outputs.output2 }}

jobs:
  example_job:
    name: Generate output
    runs-on: ubuntu-latest
    # Map the job outputs to step outputs
    outputs:
      output1: ${{ steps.step1.outputs.firstword }}
      output2: ${{ steps.step2.outputs.secondword }}
    steps:
      - id: step1
        run: echo "firstword=hello" >> $GITHUB_OUTPUT
      - id: step2
        run: echo "secondword=world" >> $GITHUB_OUTPUT
```

--------------------------------

### Define Action Logic in entrypoint.sh

Source: https://docs.github.com/en/actions/creating-actions/creating-a-docker-container-action

This script defines the core logic for the Docker action. It prints a greeting and sets an output variable for the current time.

```Shell
#!/bin/sh -l

echo "Hello $1"
time=$(date)
echo "time=$time" >> $GITHUB_OUTPUT

```

--------------------------------

### Migrate with a configuration file for composite actions

Source: https://docs.github.com/en/actions/tutorials/migrate-to-github-actions/automated-migrations/circleci-migration

Use this command with a config.yml file to migrate and open pull requests for composite actions to their specified target repositories.

```bash
gh actions-importer migrate circle-ci --circle-ci-project my-project-name --output-dir output/ --config-file-path config.yml --target-url https://github.com/my-org/my-repo
```

--------------------------------

### Object filter with array of objects

Source: https://docs.github.com/en/actions/learn-github-actions/expressions

Uses * syntax to extract a specific property from all objects in an array. Example shows filtering fruit names from an array of fruit objects.

```json
[
  { "name": "apple", "quantity": 1 },
  { "name": "orange", "quantity": 2 },
  { "name": "pear", "quantity": 1 }
]
```

--------------------------------

### Configure Python Environment in GitHub Actions

Source: https://docs.github.com/en/actions/tutorials/migrate-to-github-actions/manual-migrations/migrate-from-azure-pipelines

GitHub Actions workflow configuration for setting up Python 3.7 with x64 architecture on Ubuntu. Uses the actions/setup-python action with version and architecture inputs, followed by running a Python script with the run command.

```yaml
jobs:
  run_python:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/setup-python@v5
        with:
          python-version: '3.7'
          architecture: 'x64'
      - run: python script.py
```

--------------------------------

### GET job.services.<service_id>.ports

Source: https://docs.github.com/en/actions/reference/workflows-and-actions/contexts

The job context provides information about the currently running job, specifically useful for accessing dynamically assigned ports in service containers.

```APIDOC
## GET job.services.<service_id>.ports

### Description
Accesses the host port mapping for a service container defined within a job.

### Method
GET

### Endpoint
job.services.<service_id>.ports[<port>]

### Parameters
#### Path Parameters
- **service_id** (string) - Required - The ID of the service defined in the workflow.
- **port** (number) - Required - The container port to look up.

### Request Example
${{ job.services.postgres.ports[5432] }}

### Response
#### Success Response (200)
- **host_port** (string) - The port number assigned on the host machine.
```

--------------------------------

### Set and Get Output Parameter in GitHub Actions

Source: https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-commands?tool=powershell

Demonstrates how to set an output parameter from a step and retrieve its value in a subsequent step within a GitHub Actions workflow.

```YAML
      - name: Set color
        id: color-selector
        run: echo "SELECTED_COLOR=green" >> "$GITHUB_OUTPUT"
      - name: Get color
        env:
          SELECTED_COLOR: ${{ steps.color-selector.outputs.SELECTED_COLOR }}
        run: echo "The selected color is $SELECTED_COLOR"
```

```YAML
      - name: Set color
        id: color-selector
        run: |
            "SELECTED_COLOR=green" >> $env:GITHUB_OUTPUT
      - name: Get color
        env:
          SELECTED_COLOR: ${{ steps.color-selector.outputs.SELECTED_COLOR }}
        run: Write-Output "The selected color is $env:SELECTED_COLOR"
```

--------------------------------

### Target ARC runner scale set by name

Source: https://docs.github.com/en/actions/hosting-your-own-runners/managing-self-hosted-runners-with-actions-runner-controller/using-actions-runner-controller-runners-in-a-workflow

Assign a job to a specific runner scale set by setting the runs-on key to the scale set's installation name.

```yaml
jobs:
  job_name:
    runs-on: arc-runner-set

```

--------------------------------

### Triggering workflows on completion of other workflows

Source: https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows

Use the workflow_run event to start a workflow when one or more specified workflows complete. This event only triggers if the workflow file exists on the default branch.

```yaml
on:
  workflow_run:
    workflows: [Run Tests]
    types:
      - completed
```

```yaml
on:
  workflow_run:
    workflows: [Staging, Lab]
    types:
      - completed
```

--------------------------------

### Trigger push workflow on specific branches

Source: https://docs.github.com/en/actions/writing-workflows/choosing-when-your-workflow-runs/events-that-trigger-workflows

This workflow runs only when a push occurs to the `main` branch or any branch starting with `releases/`. Use the `branches` filter to specify target branches.

```yaml
on:
  push:
    branches:
      - 'main'
      - 'releases/**'
```

--------------------------------

### Filter jobs using github.event_name context

Source: https://docs.github.com/en/actions/learn-github-actions/contexts

Use the github.event_name property to run a job only when the workflow is triggered by a specific event. This example restricts the pull_request_ci job to pull_request events.

```yaml
name: Run CI
on: [push, pull_request]

jobs:
  normal_ci:
    runs-on: ubuntu-latest
    steps:
      - name: Run normal CI
        run: echo "Running normal CI"

  pull_request_ci:
    runs-on: ubuntu-latest
    if: ${{ github.event_name == 'pull_request' }}
    steps:
      - name: Run PR CI
        run: echo "Running PR only CI"

```

```yaml
name: Run CI
on: [push, pull_request]

jobs:
  normal_ci:
    runs-on: ubuntu-latest
    steps:
      - name: Run normal CI
        run: echo "Running normal CI"

  pull_request_ci:
    runs-on: ubuntu-latest
    if: ${{ github.event_name == 'pull_request' }}
    steps:
      - name: Run PR CI
        run: echo "Running PR only CI"

```

--------------------------------

### Compare Travis CI phases and GitHub Actions steps

Source: https://docs.github.com/en/actions/migrating-to-github-actions/manually-migrating-to-github-actions/migrating-from-travis-ci-to-github-actions

Travis CI uses phases to run scripts, while GitHub Actions uses steps to execute actions or shell commands.

```yaml
language: python
python:
  - "3.7"

script:
  - python script.py
```

```yaml
jobs:
  run_python:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/setup-python@v5
        with:
          python-version: '3.7'
          architecture: 'x64'
      - run: python script.py
```

--------------------------------

### GitHub Actions Syntax for Script Steps

Source: https://docs.github.com/en/actions/migrating-to-github-actions/manually-migrating-to-github-actions/migrating-from-azure-pipelines-to-github-actions

Shows the equivalent syntax for defining script steps in GitHub Actions using the 'run' key and optionally specifying the 'shell'.

```yaml
jobs:
  scripts:
    runs-on: windows-latest
    steps:
      - run: echo "This step runs in the default shell"
      - run: echo "This step runs in bash"
        shell: bash
      - run: Write-Host "This step runs in PowerShell Core"
        shell: pwsh
      - run: Write-Host "This step runs in PowerShell"
        shell: powershell
```

--------------------------------

### Define Environment with Dynamic Name from Expression in GitHub Actions

Source: https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions

This snippet demonstrates using an expression to set the environment name dynamically, for example, based on the Git reference name.

```yaml
environment:
  name: ${{ github.ref_name }}
```

--------------------------------

### Verify artifact attestation for binaries

Source: https://docs.github.com/en/actions/how-tos/security-for-github-actions/using-artifact-attestations/using-artifact-attestations-to-establish-provenance-for-builds

Use the GitHub CLI to verify the attestation of a local binary file against a specific repository.

```bash
gh attestation verify PATH/TO/YOUR/BUILD/ARTIFACT-BINARY -R ORGANIZATION_NAME/REPOSITORY_NAME

```

```bash
gh attestation verify PATH/TO/YOUR/BUILD/ARTIFACT-BINARY -R ORGANIZATION_NAME/REPOSITORY_NAME

```

--------------------------------

### Add to GITHUB_PATH using PowerShell Core

Source: https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-commands?tool=powershell

This example shows how to append a path to `GITHUB_PATH` using PowerShell Core (version 6 or higher), which uses UTF-8 encoding by default.

```YAML
jobs:
  powershell-core-example:
    runs-on: windows-latest
    steps:
      - shell: pwsh
        run: |
          "mypath" >> $env:GITHUB_PATH
```

```YAML
jobs:
  powershell-core-example:
    runs-on: windows-latest
    steps:
      - shell: pwsh
        run: |
          "mypath" >> $env:GITHUB_PATH
```

--------------------------------

### USES jobs.<job_id>.steps[*].uses

Source: https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions

References an action to be executed in a step. Supports local paths, Docker Hub, GitHub Packages, and private repositories.

```APIDOC
## USES jobs.<job_id>.steps[*].uses

### Description
Specifies the action to run as part of a step. This can be a local path within the repository, a Docker image, or a reference to a public or private repository.

### Method
YAML KEYWORD

### Endpoint
jobs.<job_id>.steps[*].uses

### Parameters
#### Request Body
- **uses** (string) - Required - The location of the action. Examples: `./.github/actions/my-action`, `docker://alpine:3.8`, or `actions/checkout@v5`.

### Request Example
{
  "uses": "./.github/actions/hello-world-action"
}

### Response
#### Success Response (200)
- **status** (string) - The specified action is pulled and executed.
```

--------------------------------

### Add to GITHUB_PATH using PowerShell 5.1 (UTF-8)

Source: https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-commands?tool=powershell

This example demonstrates how to append a path to `GITHUB_PATH` using PowerShell version 5.1 or below, explicitly specifying UTF-8 encoding for compatibility.

```YAML
jobs:
  legacy-powershell-example:
    runs-on: windows-latest
    steps:
      - shell: powershell
        run: |
          "mypath" | Out-File -FilePath $env:GITHUB_PATH -Encoding utf8 -Append
```

```YAML
jobs:
  legacy-powershell-example:
    runs-on: windows-latest
    steps:
      - shell: powershell
        run: |
          "mypath" | Out-File -FilePath $env:GITHUB_PATH -Encoding utf8 -Append
```

--------------------------------

### Migrate with `--config-file-path` for reusable workflows

Source: https://docs.github.com/en/actions/tutorials/migrate-to-github-actions/automated-migrations/gitlab-migration

This snippet demonstrates using the `migrate` command with `--config-file-path` to apply the reusable workflow configuration, opening pull requests for each defined repository.

```shell
gh actions-importer migrate gitlab --project my-project-name --output-dir output/ --config-file-path config.yml --target-url https://github.com/my-org/my-repo
```

--------------------------------

### Custom Action with Secret Parameter

Source: https://docs.github.com/en/actions/concepts/security/compromised-runners

Example of passing a secret to a custom action via the 'with' parameter. Secrets passed this way are accessible to the action and can be stolen by a compromised runner.

```yaml
uses: fakeaction/publish@v3
with:
    key: ${{ secrets.PUBLISH_KEY }}
```

--------------------------------

### Workflow Badge with Branch Parameter

Source: https://docs.github.com/en/actions/monitoring-and-troubleshooting-workflows/adding-a-workflow-status-badge

Display the status badge for a specific branch by adding the branch query parameter to the badge URL. This example shows the status for the feature-1 branch.

```markdown
![example branch parameter](https://github.com/github/docs/actions/workflows/main.yml/badge.svg?branch=feature-1)
```

--------------------------------

### Embed Workflow Status Badge in README

Source: https://docs.github.com/en/actions/monitoring-and-troubleshooting-workflows/adding-a-workflow-status-badge

Markdown syntax to display a workflow status badge as an image in your README.md file. This example uses the main.yml workflow from the github/docs repository.

```markdown
![example workflow](https://github.com/github/docs/actions/workflows/main.yml/badge.svg)
```

--------------------------------

### Set ACTIONS_RUNNER_CONTAINER_HOOKS Environment Variable

Source: https://docs.github.com/en/actions/hosting-your-own-runners/managing-self-hosted-runners/customizing-the-containers-used-by-jobs

This example shows how to set the `ACTIONS_RUNNER_CONTAINER_HOOKS` environment variable in a `.env` file to specify the absolute path to the custom script that will be triggered before each container-based job.

```bash
ACTIONS_RUNNER_CONTAINER_HOOKS=/Users/octocat/runner/index.js
```

--------------------------------

### Configure HTTP and HTTPS proxies

Source: https://docs.github.com/en/actions/reference/github-actions-importer/supplemental-arguments-and-settings

Set environment variables to route traffic through a proxy for GitHub and other servers.

```shell
export OCTOKIT_PROXY=https://proxy.example.com:8443
export HTTPS_PROXY=$OCTOKIT_PROXY
```

--------------------------------

### Change to repository directory

Source: https://docs.github.com/en/actions/creating-actions/creating-a-composite-action

Navigate into the newly created repository directory from the terminal.

```shell
cd hello-world-composite-action
```

--------------------------------

### Configure HTTP proxy environment variables

Source: https://docs.github.com/en/actions/migrating-to-github-actions/automated-migrations/supplemental-arguments-and-settings

Set OCTOKIT_PROXY for GitHub servers and HTTP_PROXY or HTTPS_PROXY for other servers to route requests through a proxy.

```shell
export OCTOKIT_PROXY=https://proxy.example.com:8443
export HTTPS_PROXY=$OCTOKIT_PROXY
```

--------------------------------

### Cache Node Modules with npm

Source: https://docs.github.com/en/actions/using-workflows/caching-dependencies-to-speed-up-workflows

This workflow caches npm modules based on the runner's OS and a hash of the package-lock.json file. It restores the cache if available, otherwise it proceeds with installation.

```yaml
name: Caching with npm
on: push
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5

      - name: Cache node modules
        id: cache-npm
        uses: actions/cache@v4
        env:
          cache-name: cache-node-modules
        with:
          # npm cache files are stored in `~/.npm` on Linux/macOS
          path: ~/.npm
          key: ${{ runner.os }}-build-${{ env.cache-name }}-${{ hashFiles('**/package-lock.json') }}
          restore-keys: |
            ${{ runner.os }}-build-${{ env.cache-name }}-
            ${{ runner.os }}-build-
            ${{ runner.os }}-

      - if: ${{ steps.cache-npm.outputs.cache-hit != 'true' }}
        name: List the state of node modules
        continue-on-error: true
        run: npm list

      - name: Install dependencies
        run: npm install

      - name: Build
        run: npm run build

      - name: Test
        run: npm test

```

--------------------------------

### Trigger workflow when repository is starred

Source: https://docs.github.com/en/actions/writing-workflows/choosing-when-your-workflow-runs/events-that-trigger-workflows

Runs a workflow when someone stars the repository. Only the `started` activity type is supported for the watch event. The workflow file must exist on the default branch.

```yaml
on:
  watch:
    types: [started]
```

--------------------------------

### GROUP and ENDGROUP Workflow Commands

Source: https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-commands?tool=powershell

Creates a collapsible group in the workflow log. Use the group command to start a group and endgroup to end it. Equivalent to core.startGroup() and core.endGroup() toolkit functions.

```APIDOC
## GROUP and ENDGROUP Workflow Commands

### Description
Creates a collapsible group in the workflow log. Equivalent to core.startGroup() and core.endGroup() toolkit functions.

### Syntax
```
::group::{title}
[log content]
::endgroup::
```

### Parameters
- **title** (string) - Required - The title of the collapsible group

### Bash Example
```bash
echo "::group::Build Steps"
echo "Compiling source code..."
echo "::endgroup::"
```
```

--------------------------------

### Job Identifier (`jobs.<job_id>`)

Source: https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions

Provides a unique identifier for a job within a workflow. The `job_id` must be a string starting with a letter or underscore, containing alphanumeric characters, hyphens, or underscores.

```APIDOC
## Configuration: jobs.<job_id>

### Description
Provides a unique identifier for a job within a workflow. The `<job_id>` must be a string that is unique to the `jobs` object, start with a letter or `_`, and contain only alphanumeric characters, `-`, or `_`.

### Parameters
#### Configuration Fields
- **<job_id>** (string) - Required - A unique identifier for the job. Its value is a map of the job's configuration data.

### Example
```yaml
jobs:
  my_job_id:
    name: My Job Name
```
```

--------------------------------

### Configure proxy environment variables on Linux and macOS

Source: https://docs.github.com/en/actions/how-tos/manage-runners/self-hosted-runners/use-proxy-servers

Set the proxy variables in the shell before starting the runner application. Use lowercase variable names to ensure compatibility on Linux and macOS.

```shell
export https_proxy=http://proxy.local:8080
export http_proxy=http://proxy.local:8080
export no_proxy=example.com,localhost,127.0.0.1

```

```shell
export https_proxy=http://proxy.local:8080
export http_proxy=http://proxy.local:8080
export no_proxy=example.com,localhost,127.0.0.1

```

--------------------------------

### Expanding configurations with include

Source: https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax

Add additional variables to specific existing matrix combinations using the include keyword.

```yaml
jobs:
  example_matrix:
    strategy:
      matrix:
        os: [windows-latest, ubuntu-latest]
        node: [14, 16]
        include:
          - os: windows-latest
            node: 16
            npm: 6
    runs-on: ${{ matrix.os }}
    steps:
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node }}
      - if: ${{ matrix.npm }}
        run: npm install -g npm@${{ matrix.npm }}
      - run: npm --version
```

--------------------------------

### Configure Maven distribution management in pom.xml

Source: https://docs.github.com/en/actions/tutorials/publish-packages/publish-java-packages-with-maven

Define the repository ID and URL in your pom.xml to specify where Maven should deploy the package. This example uses the OSSRH hosting project ID 'ossrh'.

```xml
<project ...>
  ...
  <distributionManagement>
    <repository>
      <id>ossrh</id>
      <name>Central Repository OSSRH</name>
      <url>https://oss.sonatype.org/service/local/staging/deploy/maven2/</url>
    </repository>
  </distributionManagement>
</project>
```

--------------------------------

### Build and test Rust code with Cargo

Source: https://docs.github.com/en/actions/tutorials/build-and-test-code/rust

Execute cargo build and cargo test commands within a workflow job. This example uses a matrix strategy to define build profiles.

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        BUILD_TARGET: [release] # refers to a cargo profile
    outputs:
      release_built: ${{ steps.set-output.outputs.release_built }}
    steps:
      - uses: actions/checkout@v5
      - name: Build binaries in "${{ matrix.BUILD_TARGET }}" mode
        run: cargo build --profile ${{ matrix.BUILD_TARGET }}
      - name: Run tests in "${{ matrix.BUILD_TARGET }}" mode
        run: cargo test --profile ${{ matrix.BUILD_TARGET }}
```

--------------------------------

### Define Dockerfile for GitHub Action

Source: https://docs.github.com/en/actions/tutorials/use-containerized-services/create-a-docker-container-action

This Dockerfile specifies the base image as Alpine 3.10, copies the entrypoint script into the container's root directory, and sets it as the executable entrypoint for the action.

```dockerfile
# Container image that runs your code
FROM alpine:3.10

# Copies your code file from your action repository to the filesystem path `/` of the container
COPY entrypoint.sh /entrypoint.sh

# Code file to execute when the docker container starts up (`entrypoint.sh`)
ENTRYPOINT ["/entrypoint.sh"]
```

--------------------------------

### Conditional Step Execution Using Contexts

Source: https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions

Steps can be conditionally executed using the if keyword with context expressions. This example demonstrates running a step only when a pull request event has the unassigned action.

```APIDOC
## Conditional Execution: Using Contexts

### Description
Run a step conditionally based on GitHub event context values.

### Syntax
```yaml
if: ${{ condition }}
```

### Example: Pull Request Unassigned Event

This step only runs when the event type is a `pull_request` and the event action is `unassigned`.

```yaml
steps:
  - name: My first step
    if: ${{ github.event_name == 'pull_request' && github.event.action == 'unassigned' }}
    run: echo This event is a pull request that had an assignee removed.
```

### Context Variables
- `github.event_name` - The name of the event that triggered the workflow
- `github.event.action` - The action that triggered the workflow

### Related Documentation
For more information, see Contexts reference and Evaluate expressions in workflows and actions.
```

--------------------------------

### Verify SPDX SBOM Attestation using GitHub CLI

Source: https://docs.github.com/en/actions/how-tos/secure-your-work/use-artifact-attestations/use-artifact-attestations

This command verifies an SBOM attestation in SPDX format using the GitHub CLI. It requires specifying the `--predicate-type` flag with the SPDX predicate URL. Replace `PATH/TO/YOUR/BUILD/ARTIFACT-BINARY` and `ORGANIZATION_NAME/REPOSITORY_NAME` with your specific details.

```bash
gh attestation verify PATH/TO/YOUR/BUILD/ARTIFACT-BINARY \
  -R ORGANIZATION_NAME/REPOSITORY_NAME \
  --predicate-type https://spdx.dev/Document/v2.3
```

--------------------------------

### Trigger Workflow Excluding Specific Branches with on.workflow_run.branches-ignore (YAML)

Source: https://docs.github.com/en/actions/automating-your-workflow-with-github-actions/workflow-syntax-for-github-actions

This example demonstrates how to trigger a workflow when a specified workflow (`Build`) runs on any branch *except* `canary`. It uses the `branches-ignore` filter.

```yaml
on:
  workflow_run:
    workflows: ["Build"]
    types: [requested]
    branches-ignore:
      - "canary"
```

--------------------------------

### Download artifacts and create GitHub Release

Source: https://docs.github.com/en/actions/tutorials/build-and-test-code/rust

Retrieves previously uploaded artifacts and uses the GitHub CLI to create a release. Ensure workflows have appropriate repository permissions.

```yaml
      - uses: actions/checkout@v5
      - name: Download release artifact
        uses: actions/download-artifact@v5
        with:
          name: <my-app>
          path: ./<my-app>
      - name: Publish built binary to GitHub releases
      - run: |
          gh release create --generate-notes ./<my-app>/<my-project>#<my-app>
```

--------------------------------

### GitHub Actions Workflow to Publish Java/Gradle Package

Source: https://docs.github.com/en/actions/tutorials/publish-packages/publish-java-packages-with-gradle

This workflow is triggered on release creation. It checks out the repository, sets up Java and Gradle, and then publishes the package using the Gradle `publish` task, leveraging secrets for authentication to Maven Central and GitHub Packages.

```yaml
name: Publish package to the Maven Central Repository and GitHub Packages
on:
  release:
    types: [created]
jobs:
  publish:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    steps:
      - uses: actions/checkout@v5
      - name: Set up Java
        uses: actions/setup-java@v4
        with:
          java-version: '11'
          distribution: 'temurin'
      - name: Setup Gradle
        uses: gradle/actions/setup-gradle@017a9effdb900e5b5b2fddfb590a105619dca3c3 # v4.4.2

      - name: Publish package
        run: ./gradlew publish
        env: 
          MAVEN_USERNAME: ${{ secrets.OSSRH_USERNAME }}
          MAVEN_PASSWORD: ${{ secrets.OSSRH_TOKEN }}
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

--------------------------------

### Get Self-Hosted Runner Service Name with PowerShell

Source: https://docs.github.com/en/actions/hosting-your-own-runners/managing-self-hosted-runners/monitoring-and-troubleshooting-self-hosted-runners

Use this command to read the content of the .service file in the runner directory, which contains the exact service name for a Windows self-hosted runner.

```PowerShell
PS C:\actions-runner> Get-Content .service
actions.runner.octo-org-octo-repo.runner01.service
```

--------------------------------

### Build Docker Image for GKE Deployment

Source: https://docs.github.com/en/actions/how-tos/deploy/deploy-to-third-party-platforms/google-kubernetes-engine

Builds a Docker image from the current directory, tagging it with the Google Container Registry (GCR) path, project ID, image name, and the GitHub commit SHA. It also passes the SHA and Git reference as build arguments for versioning.

```bash
docker build \
          --tag "gcr.io/$PROJECT_ID/$IMAGE:$GITHUB_SHA" \
          --build-arg GITHUB_SHA="$GITHUB_SHA" \
          --build-arg GITHUB_REF="$GITHUB_REF" \
          .
```

--------------------------------

### Caching Node.js Dependencies with actions/cache

Source: https://docs.github.com/en/actions/reference/dependency-caching-reference

This workflow caches Node.js modules based on the `package-lock.json` file and the runner's operating system. It checks for a cache hit and installs dependencies if no cache is found.

```yaml
name: Caching with npm
on: push
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5

      - name: Cache node modules
        id: cache-npm
        uses: actions/cache@v4
        env:
          cache-name: cache-node-modules
        with:
          # npm cache files are stored in `~/.npm` on Linux/macOS
          path: ~/.npm
          key: ${{ runner.os }}-build-${{ env.cache-name }}-${{ hashFiles('**/package-lock.json') }}
          restore-keys: |
            ${{ runner.os }}-build-${{ env.cache-name }}-
            ${{ runner.os }}-build-
            ${{ runner.os }}-

      - if: ${{ steps.cache-npm.outputs.cache-hit != 'true' }}
        name: List the state of node modules
        continue-on-error: true
        run: npm list

      - name: Install dependencies
        run: npm install

      - name: Build
        run: npm run build

      - name: Test
        run: npm test
```

--------------------------------

### Generate build provenance for container images

Source: https://docs.github.com/en/actions/how-tos/security-for-github-actions/using-artifact-attestations/using-artifact-attestations-to-establish-provenance-for-builds

Include packages: write permission for registry access. Use subject-name and subject-digest to identify the image.

```yaml
permissions:
  id-token: write
  contents: read
  attestations: write
  packages: write

```

```yaml
- name: Generate artifact attestation
  uses: actions/attest@v4
  with:
    subject-name: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
    subject-digest: 'sha256:fedcba0...'
    push-to-registry: true

```

--------------------------------

### Interactively configure feature flags

Source: https://docs.github.com/en/actions/reference/github-actions-importer/supplemental-arguments-and-settings

Use the configure command to select features and automatically write them to your environment.

```shell
$ gh actions-importer configure --features

✔ Which features would you like to configure?: actions/cache, reusable-workflows
✔ actions/cache (disabled): Enable
? reusable-workflows (disabled):
› Enable
  Disable
```

--------------------------------

### Exclude branches from workflow_run trigger in GitHub Actions

Source: https://docs.github.com/en/actions/writing-workflows/choosing-when-your-workflow-runs/triggering-a-workflow

This example demonstrates how to prevent a workflow from running when a specified upstream workflow runs on a particular branch. It uses the `branches-ignore` filter with the `workflow_run` event.

```yaml
on:
  workflow_run:
    workflows: ["Build"]
    types: [requested]
    branches-ignore:
      - "canary"

```

--------------------------------

### Using a GitHub Packages Container Registry Action

Source: https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions

Shows how to use a public Docker image hosted in the GitHub Packages Container registry as an action.

```APIDOC
## Configuration: Using a GitHub Packages Container Registry Action

### Description
This section demonstrates how to use a public Docker image hosted in the GitHub Packages Container registry as an action within a workflow.

### Method
Configuration

### Endpoint
`uses: docker://{host}/{image}:{tag}`

### Parameters
#### Request Body
- **host** (string) - Required - The host for the GitHub Packages Container registry (e.g., `ghcr.io`).
- **image** (string) - Required - The name of the image, typically including the owner (e.g., `OWNER/IMAGE_NAME`).
- **tag** (string) - Optional - The specific tag of the Docker image to use.

### Request Example
```yaml
jobs:
  my_first_job:
    steps:
      - name: My first step
        uses: docker://ghcr.io/OWNER/IMAGE_NAME
```
```

--------------------------------

### Set up Multiple Python Versions with Matrix Strategy

Source: https://docs.github.com/en/actions/tutorials/build-and-test-code/python

Configures a GitHub Actions workflow to test code against multiple Python versions simultaneously using a matrix strategy. The workflow checks out code, sets up each Python version from the matrix, and displays the current Python version. This approach is useful for ensuring compatibility across different Python releases including PyPy.

```yaml
name: Python package

on: [push]

jobs:
  build:

    runs-on: ubuntu-latest
    strategy:
      matrix:
        python-version: ["pypy3.10", "3.9", "3.10", "3.11", "3.12", "3.13"]

    steps:
      - uses: actions/checkout@v5
      - name: Set up Python ${{ matrix.python-version }}
        uses: actions/setup-python@v5
        with:
          python-version: ${{ matrix.python-version }}
      - name: Display Python version
        run: python -c "import sys; print(sys.version)"
```

--------------------------------

### Pass dynamic matrix using fromJSON

Source: https://docs.github.com/en/actions/writing-workflows/choosing-what-your-workflow-does/evaluate-expressions-in-workflows-and-actions

Converts a JSON string into an object to define a job matrix dynamically. This example demonstrates passing a matrix from one job to another via outputs.

```yaml
name: build
on: push
jobs:
  job1:
    runs-on: ubuntu-latest
    outputs:
      matrix: ${{ steps.set-matrix.outputs.matrix }}
    steps:
      - id: set-matrix
        run: echo "matrix={\"include\":[{\"project\":\"foo\",\"config\":\"Debug\"},{\"project\":\"bar\",\"config\":\"Release\"}]}" >> $GITHUB_OUTPUT
  job2:
    needs: job1
    runs-on: ubuntu-latest
    strategy:
      matrix: ${{ fromJSON(needs.job1.outputs.matrix) }}
    steps:
      - run: echo "Matrix - Project ${{ matrix.project }}, Config ${{ matrix.config }}"

```

```yaml
name: build
on: push
jobs:
  job1:
    runs-on: ubuntu-latest
    outputs:
      matrix: ${{ steps.set-matrix.outputs.matrix }}
    steps:
      - id: set-matrix
        run: echo "matrix={\"include\":[{\"project\":\"foo\",\"config\":\"Debug\"},{\"project\":\"bar\",\"config\":\"Release\"}]}" >> $GITHUB_OUTPUT
  job2:
    needs: job1
    runs-on: ubuntu-latest
    strategy:
      matrix: ${{ fromJSON(needs.job1.outputs.matrix) }}
    steps:
      - run: echo "Matrix - Project ${{ matrix.project }}, Config ${{ matrix.config }}"

```

--------------------------------

### Configuration Section: runs (General)

Source: https://docs.github.com/en/actions/creating-actions/metadata-syntax-for-github-actions

Specifies the type of action (JavaScript, composite, or Docker container) and how it is executed.

```APIDOC
## Configuration Section: runs (General)

### Description
Specifies whether this is a JavaScript action, a composite action, or a Docker container action and how the action is executed. This property is required.

### Property Path
`runs`

### Request Body (Fields)
- **using** (string) - Required - Specifies the runtime or action type.
- **main** (string) - Required (for JavaScript) - The file containing the action code.
- **pre** (string) - Optional (for JavaScript) - A script to run before the main action.
- **pre-if** (string) - Optional (for JavaScript) - Conditions for `pre` script execution.
- **post** (string) - Optional (for JavaScript) - A script to run after the main action.
- **post-if** (string) - Optional (for JavaScript) - Conditions for `post` script execution.
- **steps** (array) - Required (for composite) - The steps to run in the composite action.

### Configuration Example
```yaml
runs:
  using: 'node24'
  main: 'main.js'
```
```

--------------------------------

### Perform an audit using a configuration file

Source: https://docs.github.com/en/actions/tutorials/migrate-to-github-actions/automated-migrations/gitlab-migration

This snippet demonstrates performing an audit using a specified YAML configuration file with the `--config-file-path` argument.

```shell
gh actions-importer audit gitlab --output-dir path/to/output/ --namespace my-gitlab-namespace --config-file-path path/to/gitlab/config.yml
```

--------------------------------

### YAML Anchors and Aliases for Environment Variables

Source: https://docs.github.com/en/actions/reference/workflows-and-actions/reusing-workflow-configurations

Use anchors (&) and aliases (*) to reuse environment variable blocks across multiple jobs. The second example shows the equivalent expanded YAML structure.

```yaml
jobs:
  job1:
    env: &env_vars # Define the anchor on first use
      NODE_ENV: production
      DATABASE_URL: ${{ secrets.DATABASE_URL }}
    steps:
      - run: echo "Using production settings"

  job2:
    env: *env_vars # Reuse the environment variables
    steps:
      - run: echo "Same environment variables here"
```

```yaml
jobs:
  job1:
    env:
      NODE_ENV: production
      DATABASE_URL: ${{ secrets.DATABASE_URL }}
    steps:
      - run: echo "Using production settings"

  job2:
    env:
      NODE_ENV: production
      DATABASE_URL: ${{ secrets.DATABASE_URL }}
    steps:
      - run: echo "Same environment variables here"
```

--------------------------------

### Dockerfile and entrypoint script for Docker actions

Source: https://docs.github.com/en/actions/reference/dockerfile-support-for-github-actions

Use a shell script to handle arguments passed from the action's metadata file and ensure the script is copied to the container root.

```dockerfile
# Container image that runs your code
FROM debian:9.5-slim

# Copies your code file from your action repository to the filesystem path `/` of the container
COPY entrypoint.sh /entrypoint.sh

# Executes `entrypoint.sh` when the Docker container starts up
ENTRYPOINT ["/entrypoint.sh"]
```

```sh
#!/bin/sh

# `$#` expands to the number of arguments and `$@` expands to the supplied `args`
printf '%d args:' "$#"
printf " '%s'" "$@"
printf '\n'
```

--------------------------------

### Run workflow with inputs using GitHub CLI

Source: https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows

This snippet demonstrates how to trigger a workflow and pass input values using the GitHub CLI's `-f` flag.

```shell
gh workflow run run-tests.yml -f logLevel=warning -f tags=false -f environment=staging
```

--------------------------------

### Run a workflow with JSON inputs using GitHub CLI

Source: https://docs.github.com/en/actions/managing-workflow-runs/manually-running-a-workflow

Pass inputs as a JSON object via standard input using the --json flag.

```bash
echo '{"name":"mona", "greeting":"hello"}' | gh workflow run greet.yml --json

```

--------------------------------

### Workflow Badge with Event Parameter

Source: https://docs.github.com/en/actions/monitoring-and-troubleshooting-workflows/adding-a-workflow-status-badge

Display the status of workflow runs triggered by a specific event using the event query parameter. This example shows the status for runs triggered by the push event.

```markdown
![example event parameter](https://github.com/github/docs/actions/workflows/main.yml/badge.svg?event=push)
```

--------------------------------

### Download Trusted Roots

Source: https://docs.github.com/en/actions/security-guides/verifying-attestations-offline

Execute this command to retrieve the key material from the Sigstore trusted roots and save it to a trusted_root.jsonl file.

```Bash
gh attestation trusted-root > trusted_root.jsonl
```

--------------------------------

### Define Container Registry Credentials in GitHub Actions

Source: https://docs.github.com/en/actions/automating-your-workflow-with-github-actions/workflow-syntax-for-github-actions

Use `credentials` to provide authentication for pulling container images from a private registry. This example uses GitHub context variables for dynamic credentials.

```YAML
container:
  image: ghcr.io/owner/image
  credentials:
     username: ${{ github.actor }}
     password: ${{ secrets.github_token }}

```

--------------------------------

### Using a Docker Hub Action

Source: https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions

Illustrates how to integrate a Docker image published on Docker Hub as an action within a GitHub Actions workflow.

```APIDOC
## Configuration: Using a Docker Hub Action

### Description
This section illustrates how to integrate a Docker image published on Docker Hub as an action within a GitHub Actions workflow.

### Method
Configuration

### Endpoint
`uses: docker://{image}:{tag}`

### Parameters
#### Request Body
- **image** (string) - Required - The name of the Docker image on Docker Hub.
- **tag** (string) - Required - The specific tag of the Docker image to use.

### Request Example
```yaml
jobs:
  my_first_job:
    steps:
      - name: My first step
        uses: docker://alpine:3.8
```
```

--------------------------------

### Node.js PostgreSQL Client Script

Source: https://docs.github.com/en/actions/tutorials/use-containerized-services/create-postgresql-service-containers

This Node.js script demonstrates connecting to a PostgreSQL database using the 'pg' npm module. It retrieves connection details from 'POSTGRES_HOST' and 'POSTGRES_PORT' environment variables, creates a 'student' table, inserts sample data, and then queries and logs the table contents to the console. This script is designed to be run within a GitHub Actions workflow to test database connectivity and operations.

```javascript
const { Client } = require('pg');

const pgclient = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: 'postgres',
    password: 'postgres',
    database: 'postgres'
});

pgclient.connect();

const table = 'CREATE TABLE student(id SERIAL PRIMARY KEY, firstName VARCHAR(40) NOT NULL, lastName VARCHAR(40) NOT NULL, age INT, address VARCHAR(80), email VARCHAR(40))'
const text = 'INSERT INTO student(firstname, lastname, age, address, email) VALUES($1, $2, $3, $4, $5) RETURNING *'
const values = ['Mona the', 'Octocat', 9, '88 Colin P Kelly Jr St, San Francisco, CA 94107, United States', 'octocat@github.com']

pgclient.query(table, (err, res) => {
    if (err) throw err
});

pgclient.query(text, values, (err, res) => {
    if (err) throw err
});

pgclient.query('SELECT * FROM student', (err, res) => {
    if (err) throw err
    console.log(err, res.rows) // Print the data in student table
    pgclient.end()
});
```

--------------------------------

### View audit subcommand options and supported platforms

Source: https://docs.github.com/en/actions/tutorials/migrate-to-github-actions/automated-migrations/use-github-actions-importer

Display help for the audit subcommand, which lists available CI platforms (azure-devops, bamboo, circle-ci, gitlab, jenkins, travis-ci) for analyzing your CI/CD footprint.

```bash
$ gh actions-importer audit -h
Description:
  Plan your CI/CD migration by analyzing your current CI/CD footprint.

[...]

Commands:
  azure-devops  An audit will output a list of data used in an Azure DevOps instance.
  bamboo        An audit will output a list of data used in a Bamboo instance.
  circle-ci     An audit will output a list of data used in a CircleCI instance.
  gitlab        An audit will output a list of data used in a GitLab instance.
  jenkins       An audit will output a list of data used in a Jenkins instance.
  travis-ci     An audit will output a list of data used in a Travis CI instance.
```

--------------------------------

### View workflow run logs with GitHub CLI

Source: https://docs.github.com/en/actions/monitoring-and-troubleshooting-workflows/using-workflow-run-logs

GitHub CLI command to view logs for a specific run. Omit RUN_ID to get an interactive menu for selecting a recent run and job.

```shell
gh run view RUN_ID --log
```

--------------------------------

### Verify artifact attestation for container images

Source: https://docs.github.com/en/actions/how-tos/security-for-github-actions/using-artifact-attestations/using-artifact-attestations-to-establish-provenance-for-builds

Authenticate with the registry and use the oci:// prefix to verify the attestation of a container image.

```bash
docker login ghcr.io

gh attestation verify oci://ghcr.io/ORGANIZATION_NAME/IMAGE_NAME:test -R ORGANIZATION_NAME/REPOSITORY_NAME

```

```bash
docker login ghcr.io

gh attestation verify oci://ghcr.io/ORGANIZATION_NAME/IMAGE_NAME:test -R ORGANIZATION_NAME/REPOSITORY_NAME

```

--------------------------------

### Cache PowerShell Dependencies in Workflows

Source: https://docs.github.com/en/actions/tutorials/build-and-test-code/powershell

Demonstrates how to use the actions/cache action to persist PowerShell modules across workflow runs. This snippet includes a conditional installation step that only runs if a cache hit is not found.

```yaml
steps:
  - uses: actions/checkout@v5
  - name: Setup PowerShell module cache
    id: cacher
    uses: actions/cache@v4
    with:
      path: "~/.local/share/powershell/Modules"
      key: ${{ runner.os }}-SqlServer-PSScriptAnalyzer
  - name: Install required PowerShell modules
    if: steps.cacher.outputs.cache-hit != 'true'
    shell: pwsh
    run: |
      Set-PSRepository PSGallery -InstallationPolicy Trusted
      Install-Module SqlServer, PSScriptAnalyzer -ErrorAction Stop
```

--------------------------------

### Set Step Output Parameters

Source: https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-commands

Commands to set output parameters for a specific step by writing to the GITHUB_OUTPUT file, allowing data to be shared via the steps context.

```bash
echo "{name}={value}" >> "$GITHUB_OUTPUT"
```

```powershell
"{name}=value" >> $env:GITHUB_OUTPUT
```

--------------------------------

### Pass arguments to Docker container with jobs.<job_id>.steps[*].with.args

Source: https://docs.github.com/en/actions/automating-your-workflow-with-github-actions/workflow-syntax-for-github-actions

Define inputs for a Docker container as a single string passed to the container's ENTRYPOINT. Arguments with spaces must be surrounded by double quotes. Array format is not supported.

```yaml
steps:
  - name: Explain why this job ran
    uses: octo-org/action-name@main
    with:
      entrypoint: /bin/echo
      args: The ${{ github.event_name }} event triggered this step.
```

--------------------------------

### Trigger push workflow on specific branch and file changes

Source: https://docs.github.com/en/actions/writing-workflows/choosing-when-your-workflow-runs/events-that-trigger-workflows

This workflow runs when a push includes changes to a JavaScript file (`.js`) on a branch starting with `releases/`. Both `branches` and `paths` filters must be satisfied.

```yaml
on:
  push:
    branches:
      - 'releases/**'
    paths:
      - '**.js'
```

--------------------------------

### Publish Docker images to Docker Hub workflow template

Source: https://docs.github.com/en/actions/tutorials/publish-packages/publish-docker-images

Use this template to start a workflow for publishing images to Docker Hub. It includes standard boilerplate for third-party action usage and security recommendations.

```yaml
# This workflow uses actions that are not certified by GitHub.
# They are provided by a third-party and are governed by
# separate terms of service, privacy policy, and support
# documentation.

# GitHub recommends pinning actions to a commit SHA.
# To get a newer version, you will need to update the SHA.
```

--------------------------------

### Tag and release the action

Source: https://docs.github.com/en/actions/creating-actions/creating-a-composite-action

Create an annotated tag to version the action and push the tag to the remote repository.

```shell
git tag -a -m "Description of this release" v1
git push --follow-tags

```

```shell
git tag -a -m "Description of this release" v1
git push --follow-tags

```

--------------------------------

### jobs.<job_id>.steps[*].if

Source: https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions

Applies conditional logic to prevent a step from running unless specified conditions are met. Supports any context and expression, with special handling for expressions starting with the negation operator.

```APIDOC
## jobs.<job_id>.steps[*].if

### Description
You can use the if conditional to prevent a step from running unless a condition is met. You can use any supported context and expression to create a conditional.

### Expression Syntax
- GitHub Actions automatically evaluates the if conditional as an expression
- The `${{ }}` expression syntax can be omitted in most cases
- Exception: Always use `${{ }}` syntax or escape with `''`, `""`, or `()` when the expression starts with `!`
- The `!` character is reserved notation in YAML format

### Example: Negation Expression
```yaml
if: ${{ ! startsWith(github.ref, 'refs/tags/') }}
```

### Notes
- For more information on supported contexts, see Contexts reference
- For more information on expressions, see Evaluate expressions in workflows and actions
```

--------------------------------

### Supply multiple source files for forecast using pattern matching

Source: https://docs.github.com/en/actions/tutorials/migrate-to-github-actions/automated-migrations/gitlab-migration

This snippet shows how to use pattern matching with `--source-file-path` when running the `forecast` subcommand to supply multiple source files.

```shell
gh actions-importer forecast gitlab --output-dir output/ --namespace my-gitlab-namespace --project my-gitlab-project --source-file-path ./tmp/previous_forecast/jobs/*.json
```

--------------------------------

### Configure private registry authentication for npm

Source: https://docs.github.com/en/actions/tutorials/build-and-test-code/nodejs

Configures the setup-node action to create a local .npmrc file with registry and scope settings. It uses a secret token passed through the NODE_AUTH_TOKEN environment variable for secure authentication.

```yaml
steps:
- uses: actions/checkout@v5
- name: Use Node.js
  uses: actions/setup-node@v4
  with:
    always-auth: true
    node-version: '20.x'
    registry-url: https://registry.npmjs.org
    scope: '@octocat'
- name: Install dependencies
  run: npm ci
  env:
    NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

```shell
//registry.npmjs.org/:_authToken=${NODE_AUTH_TOKEN}
@octocat:registry=https://registry.npmjs.org/
always-auth=true
```

--------------------------------

### Workflow Trigger on Pull Request Approval

Source: https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows

Example workflow configuration that triggers when a pull request review is submitted and conditionally runs jobs based on the review approval state using github.event.review.state property.

```APIDOC
## Running a Workflow When a Pull Request is Approved

### Description
Trigger your workflow with the `submitted` type of `pull_request_review` event, then check the review state with the `github.event.review.state` property to conditionally execute jobs.

### Workflow Configuration
```yaml
on:
  pull_request_review:
    types: [submitted]

jobs:
  approved:
    if: github.event.review.state == 'approved'
    runs-on: ubuntu-latest
    steps:
      - run: echo "This PR was approved"
```

### Conditional Logic
- **Condition**: `github.event.review.state == 'approved'`
- **Behavior**: The `approved` job only runs if the submitted review is an approving review

### Available Review States
- `approved` - The review approves the pull request
- `changes_requested` - The review requests changes
- `commented` - The review is a comment
```

--------------------------------

### Action from private repository with personal access token

Source: https://docs.github.com/en/actions/automating-your-workflow-with-github-actions/workflow-syntax-for-github-actions

Checkout a private repository and reference its action locally. Requires a personal access token stored as a secret for authentication.

```yaml
jobs:
  my_first_job:
    steps:
      - name: Check out repository
        uses: actions/checkout@v5
        with:
          repository: octocat/my-private-repo
          ref: v1.0
          token: ${{ secrets.PERSONAL_ACCESS_TOKEN }}
          path: ./.github/actions/my-private-repo
      - name: Run my action
        uses: ./.github/actions/my-private-repo/my-action
```

--------------------------------

### Filter pull_request_target by branch and file paths

Source: https://docs.github.com/en/actions/writing-workflows/choosing-when-your-workflow-runs/events-that-trigger-workflows

Combine branches and paths filters to run the workflow only when both conditions are met. This example runs when a JavaScript file is changed in a pull request targeting a releases/ branch.

```yaml
on:
  pull_request_target:
    types:
      - opened
    branches:
      - 'releases/**'
    paths:
      - '**.js'
```

--------------------------------

### CONFIG /runs

Source: https://docs.github.com/en/actions/creating-actions/metadata-syntax-for-github-actions

Defines the Docker container execution environment for the action, including the image, entrypoint, and arguments.

```APIDOC
## CONFIG /runs

### Description
Specifies the execution environment for a Docker-based action. It defines the image to use, the entrypoint script, and any arguments or environment variables required by the container.

### Method
YAML

### Endpoint
runs

### Parameters
#### Request Body
- **using** (string) - Required - Must be set to 'docker'.
- **image** (string) - Required - The Docker image to use (base image name, local Dockerfile, or public image).
- **pre-entrypoint** (string) - Optional - Script to run before the main entrypoint action begins.
- **entrypoint** (string) - Optional - Overrides the Docker ENTRYPOINT instruction.
- **post-entrypoint** (string) - Optional - Cleanup script to run after the entrypoint action completes.
- **args** (array) - Optional - An array of strings defining inputs passed to the container's ENTRYPOINT.
- **env** (object) - Optional - Key/value map of environment variables to set in the container.

### Request Example
{
  "runs": {
    "using": "docker",
    "image": "Dockerfile",
    "args": ["${{ inputs.greeting }}", "foo"],
    "pre-entrypoint": "setup.sh",
    "entrypoint": "main.sh",
    "post-entrypoint": "cleanup.sh"
  }
}

### Response
#### Success Response (200)
- **status** (string) - Configuration applied successfully.
```

--------------------------------

### Expression Literals and Data Types

Source: https://docs.github.com/en/actions/writing-workflows/choosing-what-your-workflow-does/evaluate-expressions-in-workflows-and-actions

Defines the supported literal values and data types that can be used in GitHub Actions expressions. Includes examples of boolean, null, number, and string literals with proper syntax.

```APIDOC
## Expression Literals

### Description
GitHub Actions expressions support four primary data types: boolean, null, number, and string. These literals can be used directly in expressions within workflow files.

### Supported Data Types

#### Boolean
- **Values**: `true` or `false`
- **Usage**: Used in conditionals and logical operations

#### Null
- **Value**: `null`
- **Coercion**: Evaluates as `false` in conditionals

#### Number
- **Formats**: Any number format supported by JSON
- **Examples**: integers, floats, hexadecimal, exponential notation

#### String
- **Syntax**: Can be used with or without `${{ }}` wrapper
- **Quoting**: Must use single quotes (`'`) when wrapped in `${{ }}`
- **Escaping**: Escape single quotes by doubling them (`''`)
- **Note**: Double quotes will throw an error

### Truthiness and Falsiness

#### Falsy Values
The following values are coerced to `false` in conditionals:
- `false`
- `0`
- `-0`
- `""` (empty string)
- `''` (empty string with single quotes)
- `null`

#### Truthy Values
- `true`
- All other non-falsy values

### Example
```yaml
env:
  myNull: ${{ null }}
  myBoolean: ${{ false }}
  myIntegerNumber: ${{ 711 }}
  myFloatNumber: ${{ -9.2 }}
  myHexNumber: ${{ 0xff }}
  myExponentialNumber: ${{ -2.99e-2 }}
  myString: Mona the Octocat
  myStringInBraces: ${{ 'It''s open source!' }}
```
```

--------------------------------

### Filter Paths to Include Specific File Types (YAML)

Source: https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/trigger-a-workflow

This workflow runs only when a push event includes changes to files matching the specified path patterns. In this example, it triggers for any JavaScript file (`.js`).

```yaml
on:
  push:
    paths:
      - '**.js'
```

--------------------------------

### Define a Redis Service Container in a GitHub Actions Workflow

Source: https://docs.github.com/en/actions/tutorials/use-containerized-services/use-docker-service-containers

This example demonstrates how to define a `redis` service container for a job running in a Docker container. The service is accessible by its label `redis` within the `container-job`.

```yaml
name: Redis container example
on: push

jobs:
  # Label of the container job
  container-job:
    # Containers must run in Linux based operating systems
    runs-on: ubuntu-latest
    # Docker Hub image that `container-job` executes in
    container: node:16-bullseye

    # Service containers to run with `container-job`
    services:
      # Label used to access the service container
      redis:
        # Docker Hub image
        image: redis
```

--------------------------------

### Call GitHub REST API with GITHUB_TOKEN

Source: https://docs.github.com/en/actions/tutorials/authenticate-with-github_token

This example workflow uses the GITHUB_TOKEN to make authenticated API calls to the GitHub REST API. It demonstrates creating an issue directly via a curl command.

```yaml
name: Create issue on commit

on: [ push ]

jobs:
  create_issue:
    runs-on: ubuntu-latest
    permissions:
      issues: write
    steps:
      - name: Create issue using REST API
        run: |
          curl --request POST \
          --url https://api.github.com/repos/${{ github.repository }}/issues \
          --header 'authorization: Bearer ${{ secrets.GITHUB_TOKEN }}' \
          --header 'content-type: application/json' \
          --data '{
            "title": "Automated issue for commit: ${{ github.sha }}",
            "body": "This issue was automatically created by the GitHub Action workflow **${{ github.workflow }}**. \n\n The commit hash was: _${{ github.sha }}_."
            }' \
          --fail
```

--------------------------------

### Create Azure Web App for Node.js with Azure CLI

Source: https://docs.github.com/en/actions/deployment/deploying-to-your-cloud-provider/deploying-to-azure/deploying-nodejs-to-azure-app-service

Use this command to create an Azure App Service web app with a Node.js runtime. Replace parameters with your own values, where `MY_WEBAPP_NAME` is a new name for the web app.

```Bash
az webapp create \
    --name MY_WEBAPP_NAME \
    --plan MY_APP_SERVICE_PLAN \
    --resource-group MY_RESOURCE_GROUP \
    --runtime "NODE|14-lts"
```

--------------------------------

### Perform a dry run using a configuration file

Source: https://docs.github.com/en/actions/tutorials/migrate-to-github-actions/automated-migrations/gitlab-migration

This snippet demonstrates performing a dry run using a specified YAML configuration file as the source, matching the pipeline via `repository_slug`.

```shell
gh actions-importer dry-run gitlab --namespace my-gitlab-namespace --project my-gitlab-project-name --output-dir ./output/ --config-file-path ./path/to/gitlab/config.yml
```

--------------------------------

### Mount Volumes in a GitHub Actions Container

Source: https://docs.github.com/en/actions/automating-your-workflow-with-github-actions/workflow-syntax-for-github-actions

Configure `volumes` to share data between services or steps. This example shows different ways to specify source and destination paths for Docker volumes and bind mounts.

```YAML
volumes:
  - my_docker_volume:/volume_mount
  - /data/my_data
  - /source/directory:/destination/directory

```

--------------------------------

### Checkout repository with actions/checkout

Source: https://docs.github.com/en/actions/tutorials/creating-an-example-workflow

Use the checkout action to clone your repository onto the runner so your workflow can access and run scripts against your code. This is typically the first step in most workflows.

```yaml
- uses: actions/checkout@v5
```

--------------------------------

### Job and Runner Configuration

Source: https://docs.github.com/en/actions/tutorials/creating-an-example-workflow

The jobs, runs-on, and steps keywords define the execution environment and sequence of tasks.

```yaml
jobs:
```

```yaml
  check-bats-version:
```

```yaml
    runs-on: ubuntu-latest
```

```yaml
    steps:
```

--------------------------------

### Pass Secrets to Reusable Workflows and Actions with on.workflow_call.secrets (YAML)

Source: https://docs.github.com/en/actions/automating-your-workflow-with-github-actions/workflow-syntax-for-github-actions

This example shows how to declare secrets for a reusable workflow and then pass them to an action or a nested reusable workflow. Secrets are accessed via the `secrets` context.

```yaml
on:
  workflow_call:
    secrets:
      access-token:
        description: 'A token passed from the caller workflow'
        required: false

jobs:

  pass-secret-to-action:
    runs-on: ubuntu-latest
    steps:
    # passing the secret to an action
      - name: Pass the received secret to an action
        uses: ./.github/actions/my-action
        with:
          token: ${{ secrets.access-token }}

  # passing the secret to a nested reusable workflow
  pass-secret-to-workflow:
    uses: ./.github/workflows/my-workflow
    secrets:
       token: ${{ secrets.access-token }}
```

--------------------------------

### View trust-policies Helm chart configuration options

Source: https://docs.github.com/en/actions/how-tos/security-for-github-actions/using-artifact-attestations/enforcing-artifact-attestations-with-a-kubernetes-admission-controller

Display all available configuration values for the trust-policies Helm chart to see the full set of customizable options.

```bash
helm show values oci://ghcr.io/github/artifact-attestations-helm-charts/trust-policies --version v0.7.0
```

--------------------------------

### GET /repos/{owner}/{repo}/actions/runs/{run_id}/approvals

Source: https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/create-custom-protection-rules

Retrieve the review history and approval status for a workflow run. Use this endpoint to check the current state of deployment protection rule reviews.

```APIDOC
## GET /repos/{owner}/{repo}/actions/runs/{run_id}/approvals

### Description
Retrieves the approval and review history for a workflow run, including the status of all deployment protection rule reviews.

### Method
GET

### Endpoint
https://api.github.com/repos/{owner}/{repo}/actions/runs/{run_id}/approvals

### Parameters
#### Path Parameters
- **owner** (string) - Required - The account owner of the repository
- **repo** (string) - Required - The name of the repository
- **run_id** (integer) - Required - The ID of the workflow run

### Response
#### Success Response (200)
- **total_count** (integer) - Total number of approvals/reviews
- **approvals** (array) - Array of approval objects
  - **id** (integer) - The approval ID
  - **node_id** (string) - The GraphQL node ID
  - **reviewer** (object) - Reviewer information
  - **state** (string) - The approval state: "approved", "rejected", or "pending"
  - **comment** (string) - Associated comment
  - **environments** (array) - Affected environments
  - **created_at** (string) - ISO 8601 timestamp
  - **updated_at** (string) - ISO 8601 timestamp of last update

### Response Example
```json
{
  "total_count": 2,
  "approvals": [
    {
      "id": 1,
      "node_id": "MDExOkRlcGxveW1lbnRQcm90ZWN0aW9uUnVsZVJldmlldw==",
      "reviewer": {
        "login": "octocat",
        "id": 1
      },
      "state": "approved",
      "comment": "Approved for production",
      "environments": ["production"],
      "created_at": "2023-01-01T00:00:00Z",
      "updated_at": "2023-01-01T00:05:00Z"
    }
  ]
}
```
```

--------------------------------

### Configure Maven Publish Plugin in build.gradle

Source: https://docs.github.com/en/actions/tutorials/publish-packages/publish-java-packages-with-gradle

Define the Maven repository and authentication credentials using environment variables. This setup is required for the gradle publish command to interact with external registries like OSSRH.

```groovy
plugins {
  ...
  id 'maven-publish'
}

publishing {
  ...

  repositories {
    maven {
      name = "OSSRH"
      url = "https://oss.sonatype.org/service/local/staging/deploy/maven2/"
      credentials {
        username = System.getenv("MAVEN_USERNAME")
        password = System.getenv("MAVEN_PASSWORD")
      }
    }
  }
}
```

--------------------------------

### Configure Step Shell (`jobs.<job_id>.steps[*].shell`)

Source: https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions

Details on how to specify the shell for a step in a GitHub Actions job, including supported platforms, shell parameters, and internal command execution.

```APIDOC
## Configuration: `jobs.<job_id>.steps[*].shell`

### Description
This configuration property allows you to override the default shell settings for individual steps within a GitHub Actions job. You can specify built-in shell keywords or define custom shell options. The shell command internally executes a temporary file containing the commands specified in the `run` keyword.

### Property Path
`jobs.<job_id>.steps[*].shell`

### Parameters
#### Configuration Property
- **shell** (string) - Required - Specifies the shell to use for the step.
  - **Built-in options**: `bash`, `pwsh`, `python`, `sh`, `cmd`, `powershell`.
  - **Custom option**: A template string `command [options] {0} [more_options]`, where `{0}` is replaced by the temporary script file name. The command must be installed on the runner.

### Supported Shells and Internal Commands
| Supported platform | `shell` parameter | Description | Command run internally |
|---|---|---|---|
| Linux / macOS | unspecified | The default shell on non-Windows platforms. If `bash` is not found, treated as `sh`. | `bash -e {0}` |
| All | `bash` | Default on non-Windows with `sh` fallback. Uses Git for Windows bash on Windows. | `bash --noprofile --norc -eo pipefail {0}` |
| All | `pwsh` | PowerShell Core. GitHub appends `.ps1` to script name. | `pwsh -command ". '{0}'"` |
| All | `python` | Executes the python command. | `python {0}` |
| Linux / macOS | `sh` | Fallback for non-Windows if no shell provided and `bash` not found. | `sh -e {0}` |
| Windows | `cmd` | GitHub appends `.cmd` to script name. | `%ComSpec% /D /E:ON /V:OFF /S /C "CALL "{0}""` |
| Windows | `pwsh` | Default on Windows. PowerShell Core. Appends `.ps1`. Uses PowerShell Desktop if Core not installed. | `pwsh -command ". '{0}'"` |
| Windows | `powershell` | PowerShell Desktop. Appends `.ps1` to script name. | `powershell -command ". '{0}'"` |

### Configuration Examples (YAML)

#### Example: Running a command using Bash
```yaml
steps:
  - name: Display the path
    shell: bash
    run: echo $PATH
```

#### Example: Running a command using Windows `cmd`
```yaml
steps:
  - name: Display the path
    shell: cmd
    run: echo %PATH%
```

#### Example: Running a command using PowerShell Core
```yaml
steps:
  - name: Display the path
    shell: pwsh
    run: echo ${env:PATH}
```

#### Example: Using PowerShell Desktop to run a command
```yaml
steps:
  - name: Display the path
    shell: powershell
    run: echo ${env:PATH}
```

#### Example: Running an inline Python script
```yaml
steps:
  - name: Display the path
    shell: python
    run: |
      import os
      print(os.environ['PATH'])
```

#### Example: Custom shell (Perl)
```yaml
steps:
  - name: Display the environment variables and their values
    shell: perl {0}
    run: |
      print %ENV
```

### Response
N/A (This is a workflow configuration property, not an API endpoint that returns a direct response.)
```

--------------------------------

### Create Azure App Service Plan with Azure CLI

Source: https://docs.github.com/en/actions/deployment/deploying-to-your-cloud-provider/deploying-to-azure/deploying-nodejs-to-azure-app-service

Use this command to create a new Azure App Service plan. Replace `MY_RESOURCE_GROUP` with your pre-existing Azure Resource Group, and `MY_APP_SERVICE_PLAN` with a new name for the App Service plan.

```Bash
az appservice plan create \
   --resource-group MY_RESOURCE_GROUP \
   --name MY_APP_SERVICE_PLAN \
   --is-linux
```

--------------------------------

### Configure Rollup for JavaScript Action Bundling

Source: https://docs.github.com/en/actions/creating-actions/creating-a-javascript-action

Define the Rollup configuration to bundle a JavaScript action. This setup specifies the input file, output format, and includes commonjs and node-resolve plugins for dependency handling.

```javascript
import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";

const config = {
  input: "src/index.js",
  output: {
    esModule: true,
    file: "dist/index.js",
    format: "es",
    sourcemap: true,
  },
  plugins: [commonjs(), nodeResolve({ preferBuiltins: true })],
};

export default config;
```

```javascript
import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";

const config = {
  input: "src/index.js",
  output: {
    esModule: true,
    file: "dist/index.js",
    format: "es",
    sourcemap: true,
  },
  plugins: [commonjs(), nodeResolve({ preferBuiltins: true })],
};

export default config;
```

--------------------------------

### Deploy Container Image to GKE with Kustomize and kubectl

Source: https://docs.github.com/en/actions/how-tos/deploy/deploy-to-third-party-platforms/google-kubernetes-engine

Deploys the container image to the GKE cluster. It uses Kustomize to update the image tag in the Kubernetes manifests, applies the changes with `kubectl`, waits for the deployment rollout to complete, and then lists the deployed services.

```bash
./kustomize edit set image gcr.io/PROJECT_ID/IMAGE:TAG=gcr.io/$PROJECT_ID/$IMAGE:$GITHUB_SHA
        ./kustomize build . | kubectl apply -f -
        kubectl rollout status deployment/$DEPLOYMENT_NAME
        kubectl get services -o wide
```

--------------------------------

### Set default shell and working directory using defaults.run

Source: https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax

Configures default execution settings for all run steps. Specific job settings will override these workflow-level defaults.

```yaml
defaults:
  run:
    shell: bash
    working-directory: ./scripts
```