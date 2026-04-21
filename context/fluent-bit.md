# Fluent Bit

> **Used by**: DevSecOps
> **What to paste**: input/filter/output plugin config, sidecar deployment pattern, parsers, multiline handling, Elasticsearch output config.
> **Source**: https://docs.fluentbit.io/

<!-- PASTE CONTEXT BELOW THIS LINE -->


# Fluent Bit Documentation

Fluent Bit is a high-performance, lightweight telemetry agent for logs, metrics, and traces designed for Linux, macOS, Windows, and BSD operating systems. As a CNCF graduated project under the Fluentd umbrella, it provides efficient collection, processing, and routing of telemetry data with minimal resource consumption. The agent supports a pluggable architecture with inputs, parsers, filters, processors, and outputs that can be configured via YAML or classic configuration files.

Fluent Bit excels at handling complex data pipelines through its flexible routing system, supporting tag-based and conditional routing, multiple output destinations, and built-in buffering for reliability. It natively supports OpenTelemetry (OTLP) ingestion and delivery, Prometheus metrics integration, and provides enterprise-ready features like TLS/SSL support, backpressure handling, and comprehensive monitoring through an HTTP server exposing JSON and Prometheus-format metrics.

## Configuration Format

Fluent Bit supports YAML configuration (recommended for v3.2+) with sections for service, pipeline, parsers, and more.

```yaml
# fluent-bit.yaml - Complete configuration example
service:
  flush: 1
  log_level: info
  http_server: on
  http_listen: 0.0.0.0
  http_port: 2020
  parsers_file: parsers.yaml

pipeline:
  inputs:
    - name: tail
      tag: app.logs
      path: /var/log/app/*.log
      parser: json
      db: /var/log/flb_app.db
      read_from_head: true

  filters:
    - name: grep
      match: 'app.*'
      regex: level error

  outputs:
    - name: stdout
      match: '*'
```

## Tail Input Plugin

The Tail input plugin monitors text files similar to `tail -f`, reading new lines and optionally tracking file positions with a SQLite database for persistence across restarts.

```yaml
# Monitor container logs with multiline support and state tracking
pipeline:
  inputs:
    - name: tail
      tag: kube.*
      path: /var/log/containers/*.log
      multiline.parser: docker, cri
      db: /var/log/flb_kube.db
      db.sync: normal
      buffer_chunk_size: 32k
      buffer_max_size: 256k
      skip_long_lines: on
      refresh_interval: 10
      read_from_head: false
      mem_buf_limit: 50MB

  outputs:
    - name: stdout
      match: '*'
```

## Forward Input Plugin

The Forward input plugin receives data using the Fluentd forward protocol, enabling log aggregation from multiple Fluent Bit or Fluentd instances.

```yaml
# Secure forward receiver with authentication
pipeline:
  inputs:
    - name: forward
      listen: 0.0.0.0
      port: 24224
      buffer_chunk_size: 1M
      buffer_max_size: 6M
      shared_key: mysecretkey
      self_hostname: aggregator.local
      security.users: fluentbit changeme

  outputs:
    - name: stdout
      match: '*'
```

## HTTP Input Plugin

The HTTP input plugin opens an HTTP endpoint for receiving JSON data via POST requests, supporting dynamic tagging based on URL path.

```yaml
# HTTP endpoint with OAuth2 JWT validation
pipeline:
  inputs:
    - name: http
      listen: 0.0.0.0
      port: 8888
      buffer_max_size: 4M
      successful_response_code: 201

  outputs:
    - name: stdout
      match: '*'
```

```bash
# Send data to HTTP input with dynamic tag
curl -d '{"key1":"value1","key2":"value2"}' \
     -XPOST -H "content-type: application/json" \
     http://localhost:8888/app.log

# Expected output: [0] app.log: [timestamp, {"key1"=>"value1", "key2"=>"value2"}]
```

## Syslog Input Plugin

The Syslog input plugin collects syslog messages through Unix sockets or network connections using UDP or TCP protocols.

```yaml
# TCP syslog receiver for rsyslog integration
service:
  flush: 1
  parsers_file: parsers.yaml

pipeline:
  inputs:
    - name: syslog
      parser: syslog-rfc3164
      listen: 0.0.0.0
      port: 5140
      mode: tcp
      receive_buffer_size: 512000

  outputs:
    - name: stdout
      match: '*'
```

```bash
# Configure rsyslog to forward to Fluent Bit (/etc/rsyslog.d/60-fluent-bit.conf)
# action(type="omfwd" Target="127.0.0.1" Port="5140" Protocol="tcp")
```

## Elasticsearch Output Plugin

The Elasticsearch output plugin sends records to Elasticsearch or Amazon OpenSearch Service with support for Logstash format indexing and AWS IAM authentication.

```yaml
# Elasticsearch with Logstash format and AWS OpenSearch
pipeline:
  inputs:
    - name: cpu
      tag: cpu

  outputs:
    - name: es
      match: '*'
      host: 192.168.2.3
      port: 9200
      index: my_index
      logstash_format: on
      logstash_prefix: fluent-bit
      logstash_dateformat: '%Y.%m.%d'
      generate_id: on
      suppress_type_name: on

    # Amazon OpenSearch Service configuration
    - name: es
      match: 'aws.*'
      host: vpc-domain.us-west-2.es.amazonaws.com
      port: 443
      index: aws-logs
      aws_auth: on
      aws_region: us-west-2
      tls: on
```

## Amazon CloudWatch Output Plugin

The CloudWatch output plugin sends logs and metrics to Amazon CloudWatch Logs with support for dynamic log group/stream naming using record accessor syntax.

```yaml
# CloudWatch with Kubernetes metadata templating
pipeline:
  inputs:
    - name: tail
      tag: kube.*
      path: /var/log/containers/*.log

  filters:
    - name: kubernetes
      match: 'kube.*'

  outputs:
    - name: cloudwatch_logs
      match: '*'
      region: us-east-1
      log_group_name: fallback-group
      log_stream_prefix: fallback-stream
      log_group_template: application-logs-$kubernetes['host'].$kubernetes['namespace_name']
      log_stream_template: $kubernetes['pod_name'].$kubernetes['container_name']
      auto_create_group: on
      log_retention_days: 30
```

## Amazon S3 Output Plugin

The S3 output plugin uploads log records to Amazon S3 using multipart upload API for efficient handling of large files with configurable key formats.

```yaml
# S3 with custom key format and compression
pipeline:
  inputs:
    - name: tail
      tag: app.logs
      path: /var/log/app/*.log

  outputs:
    - name: s3
      match: '*'
      bucket: my-logs-bucket
      region: us-west-2
      total_file_size: 100M
      upload_timeout: 10m
      store_dir: /tmp/fluent-bit/s3
      s3_key_format: '/$TAG[0]/%Y/%m/%d/%H/%M/%S/$UUID.gz'
      s3_key_format_tag_delimiters: '.-'
      compression: gzip
      use_put_object: off
```

## Kubernetes Filter Plugin

The Kubernetes filter enriches log records with pod metadata by querying the Kubernetes API server or Kubelet, supporting annotation-based parser suggestions and log exclusion.

```yaml
# Kubernetes filter with Kubelet API and namespace metadata
pipeline:
  inputs:
    - name: tail
      tag: kube.*
      path: /var/log/containers/*.log
      multiline.parser: docker, cri

  filters:
    - name: kubernetes
      match: 'kube.*'
      kube_url: https://kubernetes.default.svc:443
      kube_ca_file: /var/run/secrets/kubernetes.io/serviceaccount/ca.crt
      kube_token_file: /var/run/secrets/kubernetes.io/serviceaccount/token
      kube_tag_prefix: kube.var.log.containers.
      merge_log: on
      merge_log_key: log_processed
      k8s-logging.parser: on
      k8s-logging.exclude: on
      labels: on
      annotations: on
      use_kubelet: true
      kubelet_port: 10250

  outputs:
    - name: stdout
      match: '*'
```

## Grep Filter Plugin

The Grep filter selects or excludes records based on regular expression patterns matching field values, including support for nested fields.

```yaml
# Filter logs by severity and exclude specific namespaces
pipeline:
  inputs:
    - name: tail
      path: /var/log/app/*.log
      parser: json

  filters:
    - name: grep
      match: '*'
      regex: level (error|warn|fatal)

    - name: grep
      match: '*'
      exclude: $kubernetes['namespace_name'] kube-system

    # Multiple conditions with logical operator
    - name: grep
      match: '*'
      logical_op: or
      regex:
        - message error
        - message exception

  outputs:
    - name: stdout
      match: '*'
```

## Modify Filter Plugin

The Modify filter transforms records using operations like add, set, rename, remove, and copy with conditional execution based on key existence or value matching.

```yaml
# Modify records with conditions
pipeline:
  inputs:
    - name: mem
      tag: mem.local

  filters:
    - name: modify
      match: 'mem.*'
      condition:
        - Key_Does_Not_Exist service_name
        - Key_Exists Mem.used
      set: service_name memory-monitor
      rename:
        - Mem.free memory_free
        - Mem.used memory_used
      remove_wildcard: Swap

    - name: modify
      match: 'mem.*'
      condition: Key_Value_Equals environment production
      add: alert_enabled true

  outputs:
    - name: stdout
      match: '*'
```

## JSON Parser

The JSON parser converts JSON-formatted log lines to structured records with automatic timestamp extraction and format conversion.

```yaml
# Custom JSON parser with timestamp handling
parsers:
  - name: docker
    format: json
    time_key: time
    time_format: '%Y-%m-%dT%H:%M:%S.%L'
    time_keep: on

  - name: app_json
    format: json
    time_key: timestamp
    time_format: '%Y-%m-%dT%H:%M:%S.%LZ'

pipeline:
  inputs:
    - name: tail
      path: /var/log/app.log
      parser: app_json

  outputs:
    - name: stdout
      match: '*'
```

## Tag-Based Routing

Routing uses tags assigned to records at input and match rules on outputs to direct data flow, supporting wildcards and regular expressions.

```yaml
# Route different data sources to appropriate destinations
pipeline:
  inputs:
    - name: cpu
      tag: metrics.cpu

    - name: mem
      tag: metrics.mem

    - name: tail
      tag: logs.app
      path: /var/log/app.log

  outputs:
    # All metrics to Prometheus
    - name: prometheus_exporter
      match: 'metrics.*'
      port: 2021

    # Only CPU metrics to stdout
    - name: stdout
      match: metrics.cpu

    # Logs to Elasticsearch
    - name: es
      match: 'logs.*'
      host: elasticsearch.local

    # Catch-all with regex
    - name: file
      match_regex: '.*'
      path: /var/log/fluent-bit/all
```

## Conditional Routing

Conditional routing (v4.2+) enables per-record routing decisions based on field values, allowing fine-grained control over data flow.

```yaml
# Route logs by severity level to different outputs
pipeline:
  inputs:
    - name: tail
      path: /var/log/app/*.log
      tag: app.logs
      routes:
        logs:
          - name: error_logs
            condition:
              op: or
              rules:
                - field: "$level"
                  op: eq
                  value: "error"
                - field: "$level"
                  op: eq
                  value: "fatal"
            to:
              outputs:
                - error_destination

          - name: high_latency
            condition:
              op: and
              rules:
                - field: "$environment"
                  op: eq
                  value: "production"
                - field: "$response_time"
                  op: gt
                  value: 5000
            to:
              outputs:
                - alerting_output
                - elasticsearch_output

          - name: default_logs
            condition:
              default: true
            to:
              outputs:
                - default_destination

  outputs:
    - name: elasticsearch
      alias: error_destination
      host: errors.example.com
      index: error-logs

    - name: http
      alias: alerting_output
      host: alerts.example.com

    - name: elasticsearch
      alias: elasticsearch_output
      host: logs.example.com

    - name: stdout
      alias: default_destination
```

## HTTP Monitoring Server

The built-in HTTP server exposes internal metrics in JSON and Prometheus formats for pipeline monitoring, health checks, and integration with observability platforms.

```yaml
# Enable monitoring with health checks
service:
  http_server: on
  http_listen: 0.0.0.0
  http_port: 2020
  health_check: on
  hc_errors_count: 5
  hc_retry_failure_count: 5
  hc_period: 60

pipeline:
  inputs:
    - name: cpu
      alias: server_cpu

  outputs:
    - name: stdout
      alias: console_output
      match: '*'
```

```bash
# Query metrics in Prometheus format
curl -s http://127.0.0.1:2020/api/v2/metrics/prometheus

# Example output:
# fluentbit_input_records_total{name="server_cpu"} 57
# fluentbit_input_bytes_total{name="server_cpu"} 18069
# fluentbit_output_proc_records_total{name="console_output"} 54
# fluentbit_output_retries_total{name="console_output"} 0
# fluentbit_uptime{hostname="myhost"} 3600

# Health check endpoint
curl -s http://127.0.0.1:2020/api/v2/health
# Returns: {"status":"ok"} with HTTP 200, or {"status":"error"} with HTTP 500

# Get storage metrics
curl -s http://127.0.0.1:2020/api/v1/storage | jq
```

## Configuration Validation

Use the `--dry-run` flag to validate configuration files without starting Fluent Bit, catching syntax errors and unknown properties.

```bash
# Validate YAML configuration
fluent-bit --dry-run -c /path/to/fluent-bit.yaml

# Successful validation output:
# configuration test is successful

# Error example:
# [error] [config] dummy: unknown configuration property 'invalid_property'
```

## Command Line Usage

Fluent Bit can be configured entirely via command line for quick testing and simple deployments.

```bash
# Basic tail to stdout
fluent-bit -i tail -p path=/var/log/syslog -o stdout

# CPU metrics to Elasticsearch with parameters
fluent-bit -i cpu -t cpu -o es://192.168.2.3:9200/my_index/my_type -o stdout -m '*'

# Forward receiver to CloudWatch
fluent-bit -i forward -p port=24224 \
           -o cloudwatch_logs \
           -p log_group_name=my-group \
           -p log_stream_name=my-stream \
           -p region=us-east-1 \
           -m '*'

# HTTP input with filter
fluent-bit -i http -p port=8888 \
           -F grep -p 'regex=level error' -m '*' \
           -o stdout
```

## Summary

Fluent Bit serves as a versatile telemetry agent suitable for edge deployments, container environments, and centralized log aggregation architectures. Its primary use cases include Kubernetes log collection with metadata enrichment, cloud-native observability pipelines to AWS CloudWatch/S3, Elasticsearch/OpenSearch, and Splunk, real-time log filtering and transformation, and multi-destination routing based on content or tags. The agent integrates seamlessly with container runtimes, systemd, and traditional syslog infrastructures.

Integration patterns typically involve deploying Fluent Bit as a DaemonSet in Kubernetes for node-level log collection, as a sidecar container for application-specific logging, or as a standalone aggregator receiving forwarded data from multiple sources. The YAML configuration format enables complex pipelines with processors attached to inputs/outputs, conditional routing for fine-grained control, and the built-in HTTP server provides Prometheus-compatible metrics for monitoring pipeline health and performance in production environments.
