# Kyverno (Kubernetes Policy Engine)

> **Used by**: DevSecOps
> **What to paste**: ClusterPolicy / Policy CRD schema, rule types (validate, mutate, generate), match/exclude syntax, common policies (disallow-latest-tag, require-labels, restrict-hostpath).
> **Source**: https://kyverno.io/docs/

<!-- PASTE CONTEXT BELOW THIS LINE -->


### Enable Reports Server with Helm

Source: https://kyverno.io/docs/installation/installation

Installs Kyverno with the optional Reports Server enabled. This deploys the Reports Server as a subchart, configures Kyverno to use it, and includes readiness checks to ensure the Reports Server is operational before Kyverno starts.

```bash
helm install kyverno kyverno/kyverno -n kyverno --create-namespace --set reportsServer.enabled=true
```

--------------------------------

### Install Kyverno using Tagged Release YAML

Source: https://kyverno.io/docs/installation/installation

Installs Kyverno from a specific tagged release using a single YAML manifest. This method is an alternative to Helm, though Helm is recommended for production installations.

```bash
kubectl create -f https://github.com/kyverno/kyverno/releases/download/v1.16.2/install.yaml
```

--------------------------------

### Install Pre-Release Kyverno Versions using Helm

Source: https://kyverno.io/docs/installation/installation

Installs pre-release versions of Kyverno (alpha, beta, release candidates) by adding the `--devel` flag to the Helm install command. This allows testing of upcoming features.

```bash
helm install kyverno kyverno/kyverno -n kyverno --create-namespace --devel
```

--------------------------------

### Example: Testing Subresources (YAML)

Source: https://kyverno.io/docs/subprojects/kyverno-cli

An example demonstrating how to test subresources using Kyverno. This configuration specifies a 'deployments/scale' subresource and its parent 'Deployment' resource, including their respective kinds, groups, and versions.

```yaml
apiVersion: cli.kyverno.io/v1alpha1
kind: Values
metadata:
  name: values
subresources:
  - subresource:
      name: 'deployments/scale'
      kind: 'Scale'
      group: 'autoscaling'
      version: 'v1'
    parentResource:
      name: 'deployments'
      kind: 'Deployment'
      group: 'apps'
      version: 'v1'

```

--------------------------------

### Install Latest Kyverno Development Code using YAML

Source: https://kyverno.io/docs/installation/installation

Installs the latest unreleased Kyverno code from the main development branch using an experimental YAML manifest. This is useful for testing the current state of the codebase.

```bash
kubectl create -f https://github.com/kyverno/kyverno/raw/main/config/install-latest-testing.yaml
```

--------------------------------

### Kyverno Apply Command Output Example

Source: https://kyverno.io/docs/subprojects/kyverno-cli

Example output from the 'kyverno apply' command when a policy is applied with an exception. It shows the number of policies, resources, and exceptions processed, along with the outcome counts.

```text
Applying 3 policy rule(s) to 1 resource(s) with 1 exception(s)...


pass: 0, fail: 0, warn: 0, error: 0, skip: 1

```

--------------------------------

### Install Kyverno with High Availability using Helm

Source: https://kyverno.io/docs/installation/installation

Installs Kyverno using Helm in a highly-available configuration by setting replica counts for admission, background, cleanup, and reports controllers. This ensures resilience by running multiple instances of each controller.

```bash
helm install kyverno kyverno/kyverno -n kyverno --create-namespace \
--set admissionController.replicas=3 \
--set backgroundController.replicas=2 \
--set cleanupController.replicas=2 \
--set reportsController.replicas=2
```

--------------------------------

### Kyverno foreach with Data Source Example

Source: https://kyverno.io/docs/policy-types/cluster-policy/generate

An example of a 'foreach' declaration using a data source to create NetworkPolicies for a list of namespaces stored in a ConfigMap. It demonstrates the use of 'list', 'context', 'preconditions', and the generated resource definition.

```yaml
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: foreach-generate-data
spec:
  rules:
    - match:
        any:
          - resources:
              kinds:
                - ConfigMap
      name: k-kafka-address
      generate:
        generateExisting: false
        synchronize: true
        orphanDownstreamOnPolicyDelete: false
        foreach:
          - list: request.object.data.namespaces | split(@, ',')
            context:
              - name: ns
                variable:
                  jmesPath: element
            preconditions:
              any:
                - key: '{{ ns }}'
                  operator: AnyIn
                  value:
                    - foreach-ns-1
            apiVersion: networking.k8s.io/v1
            kind: NetworkPolicy
            name: my-networkpolicy-{{element}}-{{ elementIndex }}
            namespace: '{{ element }}'
            data:
              metadata:
                labels:
                  request.namespace: '{{ request.object.metadata.name }}'
                  element: '{{ element }}'
                  elementIndex: '{{ elementIndex }}'
              spec:
                podSelector: {}
                policyTypes:
                  - Ingress
                  - Egress
```

--------------------------------

### Install Kyverno using Helm (Non-Production)

Source: https://kyverno.io/docs/installation/installation

Installs Kyverno in a non-production environment using the Helm package manager. This involves adding the Kyverno Helm repository, updating it, and then installing the Kyverno chart into a newly created namespace.

```bash
helm repo add kyverno https://kyverno.github.io/kyverno/
helm repo update
helm install kyverno kyverno/kyverno -n kyverno --create-namespace
```

--------------------------------

### Kyverno foreach with Clone Source Example

Source: https://kyverno.io/docs/policy-types/cluster-policy/generate

An example of a 'foreach' declaration using a clone source to copy a Secret to multiple namespaces. It shows how to iterate over a list of namespaces from a ConfigMap and clone the source Secret with dynamic naming.

```yaml
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: foreach-clone
spec:
  rules:
    - match:
        any:
          - resources:
              kinds:
                - ConfigMap
      name: k-kafka-address
      context:
        - name: configmapns
          variable:
            jmesPath: request.object.metadata.namespace
      preconditions:
        any:
          - key: '{{configmapns}}'
            operator: Equals
            value: 'default'
      generate:
        generateExisting: false
        synchronize: true
        foreach:
          - list: request.object.data.namespaces | split(@, ',')
            context:
              - name: ns
                variable:
                  jmesPath: element
            preconditions:
              any:
                - key: '{{ ns }}'
                  operator: AnyIn
                  value:
                    - foreach-ns-1
            apiVersion: v1
            kind: Secret
            name: cloned-secret-{{ elementIndex }}-{{ ns }}
            namespace: '{{ ns }}'
            clone:
              namespace: default
              name: source-secret
```

--------------------------------

### Kubernetes ValidatingWebhookConfiguration Example

Source: https://kyverno.io/docs/guides/admission-controllers

An example of a ValidatingWebhookConfiguration resource in Kubernetes. This configuration instructs the API server to send creation requests for 'deployments' to a specific service ('kyverno-svc') for validation, with a defined timeout and failure policy.

```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingWebhookConfiguration
metadata:
  name: kyverno-resource-validating-webhook-cfg
webhooks:
  - name: validate.kyverno.svc-fail ## The name of this webhook
    rules: ## What resources should be sent
      - apiGroups:
          - apps
        apiVersions:
          - v1
        operations:
          - CREATE
        resources:
          - deployments
    clientConfig: ## Where the resources should be sent
      caBundle: LS0t<snip>0tLS0K
      service:
        name: kyverno-svc
        namespace: kyverno
        path: /validate/fail
        port: 443
    timeoutSeconds: 10 ## How long should the API server wait
    failurePolicy: Fail ## What should happen after the wait is over

```

--------------------------------

### Install Kyverno Policies Pod Security Standards using Helm

Source: https://kyverno.io/docs/installation/installation

Installs the Kyverno Pod Security Standard policies as an optional Helm chart. This deploys a set of policies that implement the Kubernetes Pod Security Standards.

```bash
helm install kyverno-policies kyverno/kyverno-policies -n kyverno
```

--------------------------------

### MutatingPolicy - Basic Example

Source: https://kyverno.io/docs/policy-types/mutating-policy

This example demonstrates a basic MutatingPolicy that adds a label to pods during creation.

```APIDOC
## POST /apis/policies.kyverno.io/v1/mutatingpolicies

### Description
Creates a new MutatingPolicy resource in the cluster. This policy will mutate resources based on the defined rules.

### Method
POST

### Endpoint
/apis/policies.kyverno.io/v1/mutatingpolicies

### Parameters
#### Query Parameters
- **pretty** (string) - Optional - If 'true', then the output is pretty printed and paginated.

#### Request Body
- **apiVersion** (string) - Required - The API version for the MutatingPolicy (e.g., "policies.kyverno.io/v1").
- **kind** (string) - Required - The kind of the resource, which is "MutatingPolicy".
- **metadata** (object) - Required - Standard Kubernetes metadata for the policy.
  - **name** (string) - Required - The name of the MutatingPolicy.
- **spec** (object) - Required - The specification for the MutatingPolicy.
  - **matchConstraints** (object) - Optional - Defines the resources the policy applies to.
    - **resourceRules** (array) - Optional - A list of rules to match resources.
      - **apiGroups** (array) - Optional - API groups to match.
      - **apiVersions** (array) - Optional - API versions to match.
      - **operations** (array) - Optional - Operations to match (e.g., CREATE, UPDATE).
      - **resources** (array) - Optional - Resources to match (e.g., pods).
  - **mutations** (array) - Required - A list of mutation operations to perform.
    - **patchType** (string) - Required - The type of patch (e.g., "ApplyConfiguration").
    - **applyConfiguration** (object) - Required - The configuration for the mutation.
      - **expression** (string) - Required - A CEL expression defining the mutation.

### Request Example
```json
{
  "apiVersion": "policies.kyverno.io/v1",
  "kind": "MutatingPolicy",
  "metadata": {
    "name": "add-label"
  },
  "spec": {
    "matchConstraints": {
      "resourceRules": [
        {
          "apiGroups": [""],
          "apiVersions": ["v1"],
          "operations": ["CREATE"],
          "resources": ["pods"]
        }
      ]
    },
    "mutations": [
      {
        "patchType": "ApplyConfiguration",
        "applyConfiguration": {
          "expression": "Object{metadata: Object.metadata{labels: Object.metadata.labels{foo: \"bar\"}}}"
        }
      }
    ]
  }
}
```

### Response
#### Success Response (201 Created)
- **apiVersion** (string) - The API version of the created resource.
- **kind** (string) - The kind of the created resource.
- **metadata** (object) - Metadata of the created MutatingPolicy.
- **spec** (object) - The specification of the created MutatingPolicy.

#### Response Example
```json
{
  "apiVersion": "policies.kyverno.io/v1",
  "kind": "MutatingPolicy",
  "metadata": {
    "name": "add-label",
    "creationTimestamp": "2023-10-27T10:00:00Z",
    "uid": "a1b2c3d4-e5f6-7890-1234-567890abcdef"
  },
  "spec": {
    "matchConstraints": {
      "resourceRules": [
        {
          "apiGroups": [""],
          "apiVersions": ["v1"],
          "operations": ["CREATE"],
          "resources": ["pods"]
        }
      ]
    },
    "mutations": [
      {
        "patchType": "ApplyConfiguration",
        "applyConfiguration": {
          "expression": "Object{metadata: Object.metadata{labels: Object.metadata.labels{foo: \"bar\"}}}"
        }
      }
    ]
  }
}
```
```

--------------------------------

### Example Deployment Manifest (Skipped)

Source: https://kyverno.io/docs/subprojects/kyverno-cli

This is an example of a Kubernetes Deployment manifest. In the context of Kyverno testing, deployments like this might be marked to be skipped based on specific policy rules or test configurations.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: skipped-deployment-2
  namespace: staging
spec:
  replicas: 1
  selector:
    matchLabels:
      app: busybox
  template:
    metadata:
      labels:
        app: busybox
    spec:
      containers:
        - name: busybox
          image: busybox:latest

```

--------------------------------

### Complete ArgoCD Application Example for Kyverno

Source: https://kyverno.io/docs/installation/platform-notes

This is a comprehensive example of an ArgoCD Application manifest for deploying Kyverno. It includes annotations for ServerSideDiff, destination and source configurations, and sync policy settings like prune, self-heal, CreateNamespace, and ServerSideApply.

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: kyverno
  namespace: argocd
  annotations:
    argocd.argoproj.io/compare-options: ServerSideDiff=true,IncludeMutationWebhook=true
spec:
  destination:
    namespace: kyverno
    server: https://kubernetes.default.svc
  project: default
  source:
    chart: kyverno
    repoURL: https://kyverno.github.io/kyverno
    targetRevision: <my.target.version>
    helm:
      values: |
        webhookLabels:
          app.kubernetes.io/managed-by: argocd
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
    syncOptions:
      - CreateNamespace=true
      - ServerSideApply=true

```

--------------------------------

### Install Kyverno with Tracing Enabled (Helm)

Source: https://kyverno.io/docs/guides/tracing

Deploys Kyverno using Helm, enabling tracing and configuring it to point to a Tempo backend. This command installs Kyverno with specific configurations for its admission controller, background controller, cleanup controller, and reports controller to send traces to the specified Tempo address and port.

```bash
helm install kyverno --namespace kyverno --create-namespace --wait \
  --repo https://kyverno.github.io/kyverno kyverno \
  --values - <<EOF
admissionController:
  tracing:
    # enable tracing
    enabled: true
    # tempo backend url
    address: tempo.monitoring
    # tempo backend port for opentelemetry traces
    port: 4317


backgroundController:
  tracing:
    # enable tracing
    enabled: true
    # tempo backend url
    address: tempo.monitoring
    # tempo backend port for opentelemetry traces
    port: 4317


cleanupController:
  tracing:
    # enable tracing
    enabled: true
    # tempo backend url
    address: tempo.monitoring
    # tempo backend port for opentelemetry traces
    port: 4317


reportsController:
  tracing:
    # enable tracing
    enabled: true
    # tempo backend url
    address: tempo.monitoring
    # tempo backend port for opentelemetry traces
    port: 4317
EOF

```

--------------------------------

### Kubernetes Deployment Manifest Example

Source: https://kyverno.io/docs/policy-types/cluster-policy/preconditions

A sample Kubernetes Deployment manifest used to illustrate label matching in Kyverno policies. This manifest includes various labels that can be targeted by 'any' and 'all' conditions.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: busybox
  labels:
    app: busybox
    color: red
    animal: cow
    food: pizza
    car: jeep
    env: qa
spec:
  replicas: 1
  selector:
    matchLabels:
      app: busybox
  template:
    metadata:
      labels:
        app: busybox
    spec:
      containers:
        - image: busybox:1.28
          name: busybox
          command: ['sleep', '9999']

```

--------------------------------

### Kyverno Policy Example with Conditional Logic

Source: https://kyverno.io/docs/guides/reports

Demonstrates a Kyverno policy using conditional logic with anchors for container configurations. This example illustrates how specific conditions within a policy can lead to 'skip' or 'pass' results based on resource matching.

```yaml
spec:
  =(initContainers):
    - (name): '!istio-init'
      =(securityContext):
        =(runAsUser): '>0'
  =(containers):
    - =(securityContext):
        =(runAsUser): '>0'
```

--------------------------------

### Kubernetes Resource Manifest Example (Deployment)

Source: https://kyverno.io/docs/subprojects/kyverno-cli

An example Kubernetes Deployment manifest that includes a 'color: blue' label, which would be exempted by the 'container-exception' policy if it violates the 'max-containers' policy.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: three-containers-deployment
  labels:
    app: my-app
    color: blue
spec:
  replicas: 3
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
        color: blue
    spec:
      containers:
        - name: nginx-container
          image: nginx:latest
          ports:
            - containerPort: 80
        - name: redis-container
          image: redis:latest
          ports:
            - containerPort: 6379
        - name: busybox-container
          image: busybox:latest
          command:
            [
              '/bin/sh',
              '-c',
              "while true; do echo 'Hello from BusyBox'; sleep 10; done",
            ]

```

--------------------------------

### Install Tempo Tracing Backend with Helm

Source: https://kyverno.io/docs/guides/tracing

This Helm command deploys the Tempo tracing backend to the 'monitoring' namespace. It enables search functionality within Tempo, allowing for easier retrieval and analysis of traces.

```bash
helm install tempo --namespace monitoring --create-namespace --wait \
  --repo https://grafana.github.io/helm-charts tempo \
  --values - <<EOF
tempo:
  searchEnabled: true
EOF

```

--------------------------------

### Example: Test Kyverno Tests from a Local Folder

Source: https://kyverno.io/docs/kyverno-cli/reference/kyverno_test

Shows how to execute Kyverno tests located in the current local directory. This is convenient for testing changes to policies or test cases locally.

```bash
# Test a local folder containing test cases memungkinkan test .
```

--------------------------------

### Example PolicyReport Output

Source: https://kyverno.io/docs/guides/reports

This is an example of a PolicyReport generated in the 'staging' namespace. It details the results of the 'check-deployment-replicas' policy, indicating a 'fail' for 'deployment-3' due to exceeding the replica limit and a 'pass' for 'deployment-4'.

```yaml
apiVersion: v1
items:
- apiVersion: wgpolicyk8s.io/v1alpha2
  kind: PolicyReport
  metadata:
    creationTimestamp: "2024-01-25T11:55:33Z"
    generation: 1
    labels:
      app.kubernetes.io/managed-by: kyverno
    name: 0b2d730e-cbc3-4eab-8f3b-ad106ea5d559
    namespace: staging-ns
    ownerReferences:
    - apiVersion: apps/v1
      kind: Deployment
      name: deployment-3
      uid: 0b2d730e-cbc3-4eab-8f3b-ad106ea5d559
    resourceVersion: "83693"
    uid: 90ab79b4-fc0b-41bc-b8d0-da021c02ee9d
  results:
  - message: 'failed expression: object.spec.replicas <= 5'
    policy: check-deployment-replicas
    properties:
      binding: check-deployment-replicas-binding
    result: fail
    source: ValidatingAdmissionPolicy
    timestamp:
      nanos: 0
      seconds: 1706183723
  scope:
    apiVersion: apps/v1
    kind: Deployment
    name: deployment-3
    namespace: staging-ns
    uid: 0b2d730e-cbc3-4eab-8f3b-ad106ea5d559
  summary:
    error: 0
    fail: 1
    pass: 0
    skip: 0
    warn: 0
- apiVersion: wgpolicyk8s.io/v1alpha2
  kind: PolicyReport
  metadata:
    creationTimestamp: "2024-01-25T11:55:33Z"
    generation: 1
    labels:
      app.kubernetes.io/managed-by: kyverno
    name: c1e28ad7-b5c9-4f5c-9b77-8d4278df9fc4
    namespace: staging-ns
    ownerReferences:
    - apiVersion: apps/v1
      kind: Deployment
      name: deployment-4
      uid: c1e28ad7-b5c9-4f5c-9b77-8d4278df9fc4
    resourceVersion: "83694"
    uid: 8e19960d-969d-4e4c-a7d7-480fff15df6d
  results:
  - policy: check-deployment-replicas
    properties:
      binding: check-deployment-replicas-binding
    result: pass
    source: ValidatingAdmissionPolicy
    timestamp:
      nanos: 0
      seconds: 1706183723
  scope:
    apiVersion: apps/v1
    kind: Deployment
    name: deployment-4
    namespace: staging-ns
    uid: c1e28ad7-b5c9-4f5c-9b77-8d4278df9fc4
  summary:
    error: 0
    fail: 0
    pass: 1
    skip: 0
    warn: 0
kind: List
metadata:
  resourceVersion: ""

```

--------------------------------

### Advanced Resource Matching with Subjects and Roles (Kyverno YAML)

Source: https://kyverno.io/docs/policy-types/cluster-policy/match-exclude

This advanced example shows a comprehensive `match` statement combining resource selection (kinds, names, operations, namespaces, selector) with subject matching (users, service accounts) and cluster role matching. It highlights the AND logic between different match elements.

```yaml
spec:
  # Each policy has a list of rules applied in declaration order
  rules:
    # Rules must have a unique name
    - name: check-pod-controller-labels
      # Each rule matches specific resource described by "match" field.
      match:
        any:
          - resources:
              kinds: # Required, list of kinds
                - Deployment
              # Optional resource names. Supports wildcards (* and ?)
              names:
                - 'mongo*'
              # Optional list of namespaces. Supports wildcards (* and ?)
              operations:
                - CREATE
                - UPDATE
              namespaces:
                - 'dev*'
                - test
              # Optional label selectors. Values support wildcards (* and ?)
              selector:
                matchLabels:
                  app: mongodb
                matchExpressions:
                  - { key: tier, operator: In, values: [database] }
            # Optional users or service accounts to be matched
            subjects:
              - kind: User
                name: mary@somecorp.com
            # Optional clusterroles to be matched
            clusterRoles:
              - cluster-admin

```

--------------------------------

### Example PolicyException for Deployment

Source: https://kyverno.io/docs/guides/exceptions

This example shows a PolicyException that allows the creation of a Deployment with the label 'app: busybox', even if it would normally violate a policy rule. It uses a 'match' condition to identify the specific resource.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: important-tool
  namespace: delta
  labels:
    app: busybox
spec:
  replicas: 1
  selector:
    matchLabels:
      app: busybox
  template:
    metadata:
      labels:
        app: busybox
    spec:
      hostIPC: true
      containers:
        - image: busybox:1.35
          name: busybox
          command: ['sleep', '1d']
```

--------------------------------

### Deploy Jaeger All-in-One with Helm

Source: https://kyverno.io/docs/guides/tracing

Installs the all-in-one version of Jaeger using Helm, configured to use in-memory storage. This setup is suitable for testing and development environments.

```bash
helm install jaeger --namespace monitoring --create-namespace --wait \
  --repo https://jaegertracing.github.io/helm-charts jaeger \
  --values - <<EOF
storage:
  type: none
provisionDataStore:
  cassandra: false
agent:
  enabled: false
collector:
  enabled: false
query:
  enabled: false
allInOne:
  enabled: true
  ingress:
    enabled: true
    hosts:
      - localhost
EOF
```

--------------------------------

### Install Kyverno and Prometheus Stack with Helm

Source: https://kyverno.io/docs/guides/monitoring

Installs the Kyverno and kube-prometheus-stack Helm charts into their respective namespaces. This deploys Kyverno and the Prometheus monitoring system.

```shell
helm install kyverno kyverno/kyverno --namespace kyverno --create-namespace
helm install monitoring prometheus-community/kube-prometheus-stack -n monitoring --create-namespace
```

--------------------------------

### Example AdmissionReview Request (Kubernetes)

Source: https://kyverno.io/docs/policy-types/cluster-policy/jmespath

This snippet shows a typical AdmissionReview request sent to Kyverno by the Kubernetes API server. It includes details about the requested operation, the user, and the object being admitted, such as a Pod.

```json
{
  "kind": "AdmissionReview",
  "apiVersion": "admission.k8s.io/v1",
  "request": {
    "uid": "3d4fc6c1-7906-47d9-b7da-fc2b22353643",
    "kind": {
      "group": "",
      "version": "v1",
      "kind": "Pod"
    },
    "resource": {
      "group": "",
      "version": "v1",
      "resource": "pods"
    },
    "requestKind": {
      "group": "",
      "version": "v1",
      "kind": "Pod"
    },
    "requestResource": {
      "group": "",
      "version": "v1",
      "resource": "pods"
    },
    "name": "mypod",
    "namespace": "foo",
    "operation": "CREATE",
    "userInfo": {
      "username": "thomas",
      "uid": "404d34c4-47ff-4d40-b25b-4ec4197cdf63"
    },
    "object": {
      "kind": "Pod",
      "apiVersion": "v1",
      "metadata": {
        "name": "mypod",
        "creationTimestamp": null
      },
      "spec": {
        "containers": [
          {
            "name": "busybox",
            "image": "busybox",
            "resources": {}
          }
        ]
      },
      "status": {}
    },
    "oldObject": null,
    "dryRun": false,
    "options": {
      "kind": "CreateOptions",
      "apiVersion": "meta.k8s.io/v1"
    }
  }
}
```

--------------------------------

### Install Grafana with Helm

Source: https://kyverno.io/docs/guides/tracing

This Helm command installs Grafana into the 'monitoring' namespace. It configures Grafana with an admin password, enables unique filenames for sidecar dashboards, and sets up ingress for accessing Grafana at the '/grafana' path.

```bash
helm install grafana --namespace monitoring --create-namespace --wait \
  --repo https://grafana.github.io/helm-charts grafana \
  --values - <<EOF
adminPassword: admin
sidecar:
  enableUniqueFilenames: true
  dashboards:
    enabled: true
    searchNamespace: ALL
    provider:
      foldersFromFilesStructure: true
  datasources:
    enabled: true
    searchNamespace: ALL
grafana.ini:
  server:
    root_url: "% (protocol)s://% (domain)s:% (http_port)s/grafana"
    serve_from_sub_path: true
ingress:
  enabled: true
  path: /grafana
  hosts: []
EOF

```

--------------------------------

### Configure Kyverno High Availability Replicas in Helm Values

Source: https://kyverno.io/docs/installation/installation

Defines the desired number of replicas for each Kyverno controller to achieve high availability. These values are typically used within a Helm values file to customize the installation.

```yaml
admissionController:
  replicas: 3
backgroundController:
  replicas: 3
cleanupController:
  replicas: 3
reportsController:
  replicas: 3
```

--------------------------------

### Kyverno anyPattern for Pod Security Context Validation

Source: https://kyverno.io/docs/policy-types/cluster-policy/validate

This example demonstrates using anyPattern to validate that pods are not running as root. It checks if either the pod-level security context or container-level security contexts enforce `runAsNonRoot: true`. This rule requires Kyverno to be installed and the policy to be applied.

```yaml
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: require-run-as-non-root
spec:
  background: true
  rules:
    - name: check-containers
      match:
        any:
          - resources:
              kinds:
                - Pod
      validate:
        failureAction: Enforce
        message: >-
          Running as root is not allowed. The fields spec.securityContext.runAsNonRoot,
          spec.containers[*].securityContext.runAsNonRoot, and
          spec.initContainers[*].securityContext.runAsNonRoot must be `true`.
        anyPattern:
          # spec.securityContext.runAsNonRoot must be set to true. If containers and/or initContainers exist which declare a securityContext field, those must have runAsNonRoot also set to true.
          - spec:
              securityContext:
                runAsNonRoot: true
              containers:
                - =(securityContext):
                    =(runAsNonRoot): true
              =(initContainers):
                - =(securityContext):
                    =(runAsNonRoot): true
          # All containers and initContainers must define (not optional) runAsNonRoot=true.
          - spec:
              containers:
                - securityContext:
                    runAsNonRoot: true
              =(initContainers):
                - securityContext:
                    runAsNonRoot: true

```

--------------------------------

### Example: Filter Specific Kyverno Test Cases

Source: https://kyverno.io/docs/kyverno-cli/reference/kyverno_test

Illustrates how to run only specific test cases from a local folder by using a selector. This allows for targeted testing of particular policies, rules, or resources.

```bash
# Test some specific test cases out of many test cases in a local folder memungkinkan test . --test-case-selector "policy=disallow-latest-tag, rule=require-image-tag, resource=test-require-image-tag-pass"
```

--------------------------------

### Example ConfigMap with HCL Data

Source: https://kyverno.io/docs/policy-types/cluster-policy/variables

An example ConfigMap containing HCL syntax data, intended to be patched by a Kyverno policy. The 'config' field includes placeholder HCL content.

```yaml
apiVersion: v1
data:
  config: |-
    from_string
    {{ some hcl tempalte }}
kind: ConfigMap
metadata:
  annotations:
  labels:
    argocd.development.cpl.<removed>.co.at/app: corp-tech-ap-team-ping-ep
  name: vault-injector-config-http-echo
  namespace: corp-tech-ap-team-ping-ep

```

--------------------------------

### Create a Compliant Pod with Required Label

Source: https://kyverno.io/docs/introduction/quick-start

This command creates a Kubernetes Pod named 'nginx' with the necessary 'team: backend' label. This action should be permitted by the 'require-labels' Kyverno policy, showcasing a successful validation.

```bash
kubectl run nginx --image nginx --labels team=backend
```

--------------------------------

### NamespacedMutatingPolicy Example

Source: https://kyverno.io/docs/policy-types/mutating-policy

This example demonstrates a `NamespacedMutatingPolicy` which applies to resources within a specific namespace. It adds labels to pods during creation or update.

```yaml
apiVersion: policies.kyverno.io/v1
kind: NamespacedMutatingPolicy
metadata:
  name: add-labels
  namespace: production
spec:
  matchConstraints:
    resourceRules:
      - apiGroups: ['']
        apiVersions: ['v1']
        operations: ['CREATE', 'UPDATE']
        resources: ['pods']
  mutations:
    - patchType: ApplyConfiguration
      applyConfiguration:
        expression: >
          Object{
            metadata: Object.metadata{
              labels: Object.metadata.labels{
                environment: "production",
                managed: "true"
              }
            }
          }

```

--------------------------------

### Kyverno Resource Matching Policy Example

Source: https://kyverno.io/docs/guides/reports

Provides a Kubernetes resource manifest that is evaluated against a Kyverno policy. This example is used in conjunction with the policy definition to show how a resource can result in a 'pass' even if parts of the policy are skipped due to unmet conditions.

```yaml
spec:
  initContainers:
    - name: istio-init
      securityContext:
        runAsUser: 0
  containers:
    - name: nginx
      image: nginx
```

--------------------------------

### Install Ingress NGINX Controller

Source: https://kyverno.io/docs/guides/tracing

Deploys the ingress-nginx controller using a manifest from a GitHub repository. It then waits for the controller to become ready, ensuring network access to services.

```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/kind/deploy.yaml
sleep 15
kubectl wait --namespace ingress-nginx --for=condition=ready pod --selector=app.kubernetes.io/component=controller --timeout=90s
```

--------------------------------

### Namespace Manifest Example

Source: https://kyverno.io/docs/policy-types/cluster-policy/jmespath

This is an example Kubernetes Namespace manifest named 'foobar' with two labels: 'team' set to 'apple' and 'organization' set to 'banana'. This manifest is used in conjunction with the Kyverno policy to demonstrate how Namespace labels are extracted.

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: foobar
  labels:
    team: apple
    organization: banana

```

--------------------------------

### Install Kyverno with Tracing Enabled via Helm

Source: https://kyverno.io/docs/guides/tracing

Installs Kyverno using Helm, enabling tracing and configuring it to send traces to the Jaeger collector. This allows for monitoring Kyverno's admission control activities.

```bash
helm install kyverno --namespace kyverno --create-namespace --wait \
  --repo https://kyverno.github.io/kyverno kyverno \
  --values - <<EOF
admissionController:
  tracing:
    # enable tracing
    enabled: true
    # jaeger backend url
    address: jaeger-collector.monitoring
    # jaeger backend port for opentelemetry traces
    port: 4317


backgroundController:
  tracing:
    # enable tracing
    enabled: true
    # jaeger backend url
    address: jaeger-collector.monitoring
    # jaeger backend port for opentelemetry traces
    port: 4317


cleanupController:
  tracing:
    # enable tracing
    enabled: true
    # jaeger backend url
    address: jaeger-collector.monitoring
    # jaeger backend port for opentelemetry traces
    port: 4317


reportsController:
  tracing:
    # enable tracing
    enabled: true
    # jaeger backend url
    address: jaeger-collector.monitoring
    # jaeger backend port for opentelemetry traces
    port: 4317
EOF
```

--------------------------------

### Example: Test Kyverno Tests from a Git Repository

Source: https://kyverno.io/docs/kyverno-cli/reference/kyverno_test

Demonstrates how to run Kyverno tests from a specified branch within a remote Git repository. This is useful for testing policies defined in a shared repository.

```bash
# Test a git repository containing Kyverno test cases memungkinkan test https://github.com/kyverno/policies/pod-security --git-branch main
```

--------------------------------

### Install Pod Security Standard Policies with Helm

Source: https://kyverno.io/docs/guides/pod-security

Installs Pod Security Standards (PSS) policies via the Kyverno Helm chart. This involves adding the Kyverno Helm repository, updating it, and then installing the `kyverno-policies` chart with the `policyGroups` set to `pod-security`. Policies are installed into a specified namespace.

```bash
helm repo add kyverno https://kyverno.github.io/kyverno/
helm repo update
helm install kyverno-pss kyverno/kyverno-policies \
  --namespace kyverno-policies --create-namespace \
  --set policyGroups=pod-security
```

--------------------------------

### Kyverno Values File with Precedence Example

Source: https://kyverno.io/docs/subprojects/kyverno-cli

A values file demonstrating variable precedence. The 'request.mode' for 'test-global-prod' is set to 'prod' (resource-specific), overriding the global 'request.mode' set to 'dev'.

```yaml
apiVersion: cli.kyverno.io/v1alpha1
kind: Values
metadata:
  name: values
policies:
  - name: cm-globalval-example
    resources:
      - name: test-global-prod
        values:
          request.mode: prod
globalValues:
  request.mode: dev
```

--------------------------------

### Kyverno Policy Manifest Example

Source: https://kyverno.io/docs/subprojects/kyverno-cli

An example of a Kyverno ClusterPolicy manifest that validates the maximum number of containers in a Pod. It defines a rule to deny if more than 2 containers are present.

```yaml
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: max-containers
spec:
  background: false
  rules:
    - name: max-two-containers
      match:
        any:
          - resources:
              kinds:
                - Pod
      validate:
        failureAction: Enforce
        message: 'A maximum of 2 containers are allowed inside a Pod.'
        deny:
          conditions:
            any:
              - key: '{{request.object.spec.containers[] | length(@)}}'
                operator: GreaterThan
                value: 2

```

--------------------------------

### Uninstall Kyverno using Helm

Source: https://kyverno.io/docs/installation/uninstallation

This Helm command uninstalls Kyverno and its associated resources. You need to know the namespace and release name used during installation. The example assumes default settings.

```bash
helm uninstall kyverno kyverno/kyverno -n kyverno
```

--------------------------------

### Test Kyverno Policy by Creating a Non-Compliant Deployment

Source: https://kyverno.io/docs/introduction/quick-start

This command attempts to create a Kubernetes Deployment named 'nginx' without the required 'team' label. It is expected to fail due to the 'require-labels' Kyverno policy, demonstrating the validation mechanism.

```bash
kubectl create deployment nginx --image=nginx
```

--------------------------------

### Kyverno Policy Exception Manifest Example

Source: https://kyverno.io/docs/subprojects/kyverno-cli

An example of a Kyverno PolicyException manifest. It specifies which policies and rules can be exempted for certain resources based on match criteria and conditions, such as a 'color: blue' label.

```yaml
apiVersion: kyverno.io/v2
kind: PolicyException
metadata:
  name: container-exception
spec:
  exceptions:
    - policyName: max-containers
      ruleNames:
        - max-two-containers
        - autogen-max-two-containers
  match:
    any:
      - resources:
          kinds:
            - Pod
            - Deployment
  conditions:
    any:
      - key: "{{ request.object.metadata.labels.color || '' }}"
        operator: Equals
        value: blue

```

--------------------------------

### Items Filter Example (JSON Input)

Source: https://kyverno.io/docs/policy-types/cluster-policy/jmespath

This example shows the input JSON data structure for the `items()` JMESPath function. It's an array of objects, each with a 'key' and a 'value' object. The `items()` function is used to transform this into a key-value pair structure suitable for policy application.

```json
[
  {
    "key": 0,
    "value": {
      "team": "apple"
    }
  },
  {
    "key": 1,
    "value": {
      "organization": "banana"
    }
  }
]

```

--------------------------------

### Install Prometheus using kubectl

Source: https://kyverno.io/docs/guides/monitoring

This command applies a Prometheus configuration from a remote Git repository. It's a quick way to set up Prometheus for collecting metrics within a Kubernetes cluster. Ensure you have kubectl configured to interact with your cluster.

```bash
kubectl apply -k github.com/kyverno/grafana-dashboard/examples/prometheus

```

--------------------------------

### Install Pod Security Standard Policies with Kustomize

Source: https://kyverno.io/docs/guides/pod-security

Applies all Pod Security Standard policies using Kustomize. This method requires Kyverno and Kustomize to be installed. It fetches policies from a GitHub repository and applies them to the Kubernetes cluster.

```bash
kustomize build https://github.com/kyverno/policies/pod-security | kubectl apply -f -
```

--------------------------------

### Kyverno Assertion Tree Example for Policy Testing

Source: https://kyverno.io/docs/subprojects/kyverno-cli

This example showcases the use of assertion trees in Kyverno's `test` command for more flexible policy testing. It defines a check that matches a specific resource and policy, asserting a 'pass' status and ensuring an error condition is not met.

```yaml
checks:
  - match:
      resource:
        kind: Namespace
        metadata:
          name: hello-world-namespace
      policy:
        kind: ClusterPolicy
        metadata:
          name: sync-secret
      rule:
        name: sync-my-secret
    assert:
      status: pass
    error:
      (status != 'pass'): true

```

--------------------------------

### Create Test Namespace (kubectl)

Source: https://kyverno.io/docs/introduction/quick-start

Creates a new Kubernetes namespace named 'mytestns'. This action triggers the 'sync-secrets' Kyverno policy, which should then generate the 'regcred' secret within this new namespace.

```bash
kubectl create ns mytestns
```

--------------------------------

### Create a Pod with an existing label for testing Kyverno exclusion

Source: https://kyverno.io/docs/introduction/quick-start

This command creates a new Pod named 'newredis' with the image 'redis' and explicitly sets the label 'team=alpha'. This is used to test if the Kyverno policy correctly *does not* add the 'team: bravo' label when a 'team' label already exists.

```bash
kubectl run newredis --image redis -l team=alpha

```

--------------------------------

### Test Mutate Policy with Kyverno CLI

Source: https://kyverno.io/docs/subprojects/kyverno-cli

Demonstrates testing a Kyverno `mutate` policy using the `kyverno test` command. This example involves a policy that adds default resource requests to Pod containers and tests it against multiple resources, including the use of a `variables` manifest to specify runtime values.

```yaml
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: add-default-resources
spec:
  background: false
  rules:
    - name: add-default-requests
      match:
        any:
          - resources:
              kinds:
                - Pod
      preconditions:
        any:
          - key: '{{request.operation}}'
            operator: AnyIn
            value:
              - CREATE
              - UPDATE
      mutate:
        patchStrategicMerge:
          spec:
            containers:
              - (name): '*'
                resources:
                  requests:
                    +(memory): '100Mi'
                    +(cpu): '100m'

```

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx-demo1
spec:
  containers:
    - name: nginx
      image: nginx:1.14.2
---
apiVersion: v1
kind: Pod
metadata:
  name: nginx-demo2
spec:
  containers:
    - name: nginx
      image: nginx:latest
      resources:
        requests:
          memory: '200Mi'
          cpu: '200m'

```

```yaml
apiVersion: cli.kyverno.io/v1alpha1
kind: Values
metadata:
  name: values
policies:
  - name: add-default-resources
    resources:
      - name: nginx-demo1
        values:
          request.operation: CREATE
      - name: nginx-demo2
        values:
          request.operation: UPDATE

```

```yaml
apiVersion: cli.kyverno.io/v1alpha1
kind: Test
metadata:
  name: add-default-resources
policies:
  - add-default-resources.yaml
resources:
  - resource.yaml
variables: values.yaml
results:
  - policy: add-default-resources
    rule: add-default-requests
    resources:
      - nginx-demo1
    patchedResources: patchedResource1.yaml
    kind: Pod
    result: pass
  - policy: add-default-resources
    rule: add-default-requests
    resources:
      - nginx-demo2
    patchedResources: patchedResource2.yaml
    kind: Pod
    result: skip

```

```bash
$ kyverno test .

Executing add-default-resources...
applying 1 policy to 2 resources...


```

--------------------------------

### Retrieve Kyverno Policy Reports

Source: https://kyverno.io/docs/introduction/quick-start

This command retrieves all Policy Reports generated by Kyverno in a wide format, displaying key information such as the report name, associated resource kind and name, and the number of passes, failures, warnings, errors, and skips.

```bash
kubectl get policyreport -o wide
```

--------------------------------

### Kyverno CLI: Apply Policy with Values File

Source: https://kyverno.io/docs/subprojects/kyverno-cli

Command to apply a Kyverno policy to a resource using a values file. This example uses the `-f` flag to specify the path to the YAML file containing policy variables.

```bash
kyverno apply /path/to/add_network_policy.yaml --resource /path/to/required_default_network_policy.yaml -f /path/to/value.yaml
```

--------------------------------

### Example of a 'Good' Pod (YAML)

Source: https://kyverno.io/docs/policy-types/cluster-policy/external-data-sources

A sample Pod configuration that complies with the `no-root-images` policy, demonstrating an allowed resource.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: goodpod
spec:
  containers:
    - name: kyverno
      image: ghcr.io/kyverno/kyverno:latest

```

--------------------------------

### Verify labels on a Pod after Kyverno mutation

Source: https://kyverno.io/docs/introduction/quick-start

This command retrieves the Pod named 'redis' and displays its labels. It is used to confirm whether the Kyverno policy successfully added the 'team: bravo' label to the Pod.

```bash
kubectl get pod redis --show-labels

```

--------------------------------

### Apply ValidatingPolicy with Context Path for External Resources

Source: https://kyverno.io/docs/subprojects/kyverno-cli

This example demonstrates testing a Kyverno `ValidatingPolicy` that requires external resource lookups using `resource.Get()`. The `--context-path` flag provides necessary resources, like ConfigMaps, for the policy evaluation when running `kyverno apply` locally.

```yaml
apiVersion: policies.kyverno.io/v1alpha1
kind: ValidatingPolicy
metadata:
  name: check-pod-name-from-configmap
spec:
  matchConstraints:
    resourceRules:
      - apiGroups: ['']
        apiVersions: ['v1']
        operations: ['CREATE', 'UPDATE']
        resources: ['pods']
  variables:
    - name: cm
      expression: >-
        resource.Get("v1", "configmaps", object.metadata.namespace, "policy-cm")
  validations:
    - expression: >-
        object.metadata.name == variables.cm.data.name

```

```yaml
apiVersion: v1
kind: Pod

```

--------------------------------

### Test Kubernetes Policies with Kyverno CLI

Source: https://kyverno.io/docs/subprojects/kyverno-cli

Demonstrates the usage of the 'kyverno test' command to load and apply policies to resources. It shows the command execution and the expected output format for test results, including policy, rule, resource, and outcome.

```bash
kyverno test .

Loading test  ( .kyverno-test/kyverno-test.yaml ) ...
  Loading values/variables ...
  Loading policies ...
  Loading resources ...
  Loading exceptions ...
  Applying 1 policy to 2 resources with 1 exception ...
  Checking results ...


│────│──────────────────────────│─────────────────│───────────────────────────│────────│────────│
│ ID │ POLICY                   │ RULE            │ RESOURCE                  │ RESULT │ REASON │
│────│──────────────────────────│─────────────────│───────────────────────────│────────│────────│
│ 1  │ disallow-host-namespaces │ host-namespaces │ Deployment/important-tool │ Pass   │ Ok     │
│ 2  │ disallow-host-namespaces │ host-namespaces │ Deployment/not-important  │ Pass   │ Ok     │
│────│──────────────────────────│─────────────────│───────────────────────────│────────│────────│


Test Summary: 2 tests passed and 0 tests failed

```

--------------------------------

### Create a new Pod for testing Kyverno label mutation

Source: https://kyverno.io/docs/introduction/quick-start

This command creates a new Pod named 'redis' using the 'redis' image. This is used to test if the Kyverno policy correctly adds the 'team: bravo' label when it's not initially present.

```bash
kubectl run redis --image redis

```

--------------------------------

### Install Jaeger Operator

Source: https://kyverno.io/docs/guides/monitoring

These commands install the Jaeger Operator in the 'observability' namespace. The operator simplifies the deployment and management of Jaeger instances. It first creates the namespace, then applies the operator's YAML definition, and finally waits for the operator deployment to become available.

```bash
kubectl create namespace observability
kubectl create -n observability -f https://github.com/jaegertracing/jaeger-operator/releases/download/v1.33.0/jaeger-operator.yaml
kubectl wait --for=condition=Available deployment --timeout=2m -n observability --all

```

--------------------------------

### Querying Object from Lists with kyverno jp

Source: https://kyverno.io/docs/policy-types/cluster-policy/jmespath

This example demonstrates using the `kyverno jp query` command to extract and transform data using the `object_from_lists()` filter. It converts an array of environment variables from a Pod definition into a map.

```bash
$ kyverno jp query -i pod.yaml "object_from_lists(spec.containers[].env[].name,spec.containers[].env[].value)"
```

--------------------------------

### Kubernetes Pod Definition Example

Source: https://kyverno.io/docs/guides/admission-controllers

A basic YAML definition for a Kubernetes Pod. This is the input a user might provide when creating a Pod.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  containers:
    - name: busybox
      image: busybox
      args:
        - sleep
        - infinity
      resources:
        limits:
          memory: 64Mi
          cpu: 100m

```

--------------------------------

### AWS S3 Bucket Manifest Example

Source: https://kyverno.io/docs/policy-types/cluster-policy/jmespath

This is an example AWS S3 Bucket resource manifest from Crossplane. It defines various configurations for the bucket, including its name, access control, region, versioning, notifications, and importantly, its initial tagging configuration. This manifest serves as the target resource for the Kyverno policy.

```yaml
apiVersion: s3.aws.crossplane.io/v1beta1
kind: Bucket
metadata:
  name: lambda-bucket
spec:
  forProvider:
    acl: private
    locationConstraint: eu-central-1
    accelerateConfiguration:
      status: Enabled
    versioningConfiguration:
      status: Enabled
    notificationConfiguration:
      lambdaFunctionConfigurations:
        - events: ['s3:ObjectCreated:*']
          lambdaFunctionArn: arn:aws:lambda:eu-central-1:255932642927:function:lambda
    paymentConfiguration:
      payer: BucketOwner
    tagging:
      tagSet:
        - key: s3-bucket
          value: lambda-bucket
    objectLockEnabledForBucket: false
  providerConfigRef:
    name: default

```

--------------------------------

### Calculate Time Difference Between Two Timestamps (Kyverno Policy)

Source: https://kyverno.io/docs/policy-types/cluster-policy/jmespath

The `time_diff()` filter calculates the duration between a start and end timestamp, both in RFC 3339 format. The output is a string representing the duration, which can be negative. This example shows its application in a Kyverno policy to ensure a vulnerability scan is recent.

```yaml
apiVersion: kyverno.io/v2beta1
kind: ClusterPolicy
metadata:
  name: require-vulnerability-scan
spec:
  webhookConfiguration:
    failurePolicy: Fail
    timeoutSeconds: 20
  rules:
    - name: scan-not-older-than-one-day
      match:
        any:
          - resources:
              kinds:
                - Pod
      verifyImages:
        - imageReferences:
            - 'ghcr.io/myorg/myrepo:*'
          failureAction: Enforce
          attestations:
            - predicateType: cosign.sigstore.dev/attestation/vuln/v1
              attestors:
                - entries:
                    - keyless:
                        subject: 'https://github.com/myorg/myrepo/.github/workflows/*'
                        issuer: 'https://token.actions.githubusercontent.com'
                        rekor:
                          url: https://rekor.sigstore.dev
              conditions:
                - all:
                    - key: "{{ time_diff('{{metadata.scanFinishedOn}}','{{ time_now_utc() }}') }}"
                      operator: LessThanOrEquals
                      value: '24h'

```

--------------------------------

### Example PolicyReport Kubernetes Custom Resource

Source: https://kyverno.io/docs/guides/reports

This snippet shows an example of a `PolicyReport` Kubernetes Custom Resource. It details the results of applying policies to a specific resource, including passing and failing rules, their categories, severities, and messages. This format is standardized across Kubernetes policy tools.

```yaml
apiVersion: wgpolicyk8s.io/v1alpha2
kind: PolicyReport
metadata:
  creationTimestamp: '2023-12-06T13:19:03Z'
  generation: 2
  labels:
    app.kubernetes.io/managed-by: kyverno
  name: 487df031-11d8-4ab4-b089-dfc0db1e533e
  namespace: kube-system
  ownerReferences:
    - apiVersion: v1
      kind: Pod
      name: kube-apiserver-kind-control-plane
      uid: 487df031-11d8-4ab4-b089-dfc0db1e533e
  resourceVersion: '720507'
  uid: 0ec04a57-4c3d-492d-9278-951cd1929fe3
results:
  - category: Pod Security Standards (Baseline)
    message: validation rule 'adding-capabilities' passed.
    policy: disallow-capabilities
    result: pass
    rule: adding-capabilities
    scored: true
    severity: medium
    source: kyverno
    timestamp:
      nanos: 0
      seconds: 1701868762
  - category: Pod Security Standards (Baseline)
    message:
      'validation error: Sharing the host namespaces is disallowed. The fields
      spec.hostNetwork, spec.hostIPC, and spec.hostPID must be unset or set to `false`.
      rule host-namespaces failed at path /spec/hostNetwork/'
    policy: disallow-host-namespaces
    result: fail
    rule: host-namespaces
    scored: true
    severity: medium
    source: kyverno
    timestamp:
      nanos: 0
      seconds: 1701868762

```

--------------------------------

### Basic ApplyConfiguration Mutation Policy

Source: https://kyverno.io/docs/policy-types/mutating-policy

This example shows a `MutatingPolicy` using `ApplyConfiguration` to add a label to pods during creation. This method is intuitive for simple merge-style mutations.

```yaml
apiVersion: policies.kyverno.io/v1
kind: MutatingPolicy
metadata:
  name: add-service-account
spec:
  matchConstraints:
    resourceRules:
      - apiGroups: ['']
        apiVersions: ['v1']
        resources: ['pods']
        operations: ['CREATE']
  mutations:
    - patchType: ApplyConfiguration
      applyConfiguration:
        expression: >
          Object{
            metadata: Object.metadata{
              labels: Object.metadata.labels{
                foo: "bar"
              }
            }
          }

```

--------------------------------

### Kyverno ValidatingPolicy Expression Example

Source: https://kyverno.io/docs/guides/migration-to-cel

This example shows a ValidatingPolicy using a CEL expression to ensure that a Pod has both 'app' and 'version' labels. If these labels are missing, a specific message is displayed.

```yaml
validations:
  - expression: >
      ['app', 'version'].all(label,
        object.metadata.?labels[label].orValue('') != ''
      )
    message: "Pod must have an 'app' and 'version' labels"

```

--------------------------------

### NamespacedGeneratingPolicy Example

Source: https://kyverno.io/docs/policy-types/generating-policy

An example of a `NamespacedGeneratingPolicy` which is a namespace-scoped policy. It demonstrates how to match resources, define variables, and generate new resources based on a clone source. This policy type allows namespace owners to manage generation policies without cluster-admin privileges.

```yaml
apiVersion: policies.kyverno.io/v1
kind: NamespacedGeneratingPolicy
metadata:
  name: clone-secret
  namespace: production
spec:
  matchConstraints:
    resourceRules:
      - apiGroups: ['']
        apiVersions: ['v1']
        operations: ['CREATE']
        resources: ['pods']
  variables:
    - name: nsName
      expression: 'object.metadata.namespace'
    - name: source
      expression: resource.Get("v1", "secrets", "production", "regcred")
  generate:
    - expression: generator.Apply(variables.nsName, [variables.source])

```

--------------------------------

### Check if Time is Between Two Timestamps (Kyverno Policy)

Source: https://kyverno.io/docs/policy-types/cluster-policy/jmespath

The `time_between()` filter evaluates if a given timestamp falls within a specified start and end time. It requires all timestamps to be in RFC 3339 format. This example demonstrates its use in a Kyverno policy to enforce a label presence within a specific date range.

```yaml
apiVersion: kyverno.io/v2beta1
kind: ClusterPolicy
metadata:
  name: expiration
spec:
  background: false
  rules:
    - name: expire-jan-31
      match:
        any:
          - resources:
              kinds:
                - ConfigMap
      preconditions:
        all:
          - key: "{{ time_between('{{ time_now_utc() }}','2023-01-01T00:00:00Z','2023-01-31T23:59:59Z') }}"
            operator: Equals
            value: true
      validate:
        failureAction: Enforce
        message: 'The foo label must be set.'
        pattern:
          metadata:
            labels:
              foo: '?*'

```

--------------------------------

### Generate Policy Test with Generated Resource

Source: https://kyverno.io/docs/subprojects/kyverno-cli

This example demonstrates testing a 'generate' policy rule. It requires the addition of a `generatedResource` field in the `results[]` array to test against the resource generated by the policy.

```yaml
apiVersion: cli.kyverno.io/v1alpha1
kind: Test
metadata:
  name: 5-test-with-selection/kyverno-test.yaml
policies:
  - policy.yaml
resources:
  - resource.yaml
results:
  - generatedResource: generated-resource.yaml
    policy: generate-policy
    resources:
      - existing-resource
    result: pass
    rule: generate-new-resource

```

--------------------------------

### Apply ValidatingPolicy to Local Deployments

Source: https://kyverno.io/docs/subprojects/kyverno-cli

This example shows how to apply a Kyverno `ValidatingPolicy` to local `Deployment` manifests. The policy enforces a maximum replica count. The command tests a compliant and a non-compliant deployment, outputting a policy report.

```yaml
apiVersion: policies.kyverno.io/v1alpha1
kind: ValidatingPolicy
metadata:
  name: check-deployment-replicas
spec:
  matchConstraints:
    resourceRules:
      - apiGroups: ['apps']
        apiVersions: ['v1']
        operations: ['CREATE', 'UPDATE']
        resources: ['deployments']
  validations:
    - expression: 'object.spec.replicas <= 2'
      message: 'Deployment replicas must be less than or equal to 2'

```

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: good-deployment
  labels:
    app: nginx
spec:
  replicas: 2
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
        - name: nginx
          image: nginx:latest
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: bad-deployment
  labels:
    app: nginx
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
        - name: nginx
          image: nginx:latest

```

```bash
kyverno apply /path/to/check-deployment-replicas.yaml --resource /path/to/deployments.yaml --policy-report

```

```yaml
apiVersion: openreports.io/v1alpha1
kind: ClusterReport
metadata:
  creationTimestamp: null
  name: merged
results:
- message: Deployment replicas must be less than or equal 2
  policy: check-deployment-replicas
  properties:
    process: background scan
  resources:
  - apiVersion: apps/v1
    kind: Deployment
    name: bad-deployment
    namespace: default
  result: fail
  scored: true
  source: KyvernoValidatingPolicy
  timestamp:
    nanos: 0
    seconds: 1752755472
- message: success
  policy: check-deployment-replicas
  properties:
    process: background scan
  resources:
  - apiVersion: apps/v1
    kind: Deployment
    name: good-deployment
    namespace: default
  result: pass
  scored: true
  source: KyvernoValidatingPolicy
  timestamp:
    nanos: 0
    seconds: 1752755472
source: ""
summary:
  error: 0
  fail: 1
  pass: 1
  skip: 0
  warn: 0

```

--------------------------------

### Test Combined JMESPath Filters

Source: https://kyverno.io/docs/subprojects/kyverno-cli

Demonstrates testing a combination of custom and upstream JMESPath filters. The example pipes the output of the `split` filter into the `length` filter to count the elements in the resulting array.

```bash
$ kyverno jp query -i foo.json "split(bar, '-') | length(@)"
# split(bar, '-') | length(@)
5


```

--------------------------------

### Kyverno Deny Rule Example

Source: https://kyverno.io/docs/policy-types/cluster-policy/validate

An example of a Kyverno deny rule that blocks a request if either the 'team' is 'eng' or the 'unit' is 'green'. This demonstrates the use of 'any' conditions within a deny block.

```yaml
validate:
  message: Main message is here.
  deny:
    conditions:
      any:
        - key: '{{ request.object.data.team }}'
          operator: Equals
          value: eng
          message: The expression team = eng failed.
        - key: '{{ request.object.data.unit }}'
          operator: Equals
          value: green
          message: The expression unit = green failed.
```

--------------------------------

### Kyverno ValidatingPolicy CEL Deny Logic Inversion Example

Source: https://kyverno.io/docs/guides/migration-to-cel

This example demonstrates how to convert a 'deny' rule from a ClusterPolicy into a CEL expression for a ValidatingPolicy. The logic is inverted to allow replicas less than or equal to 10.

```yaml
validate:
  cel:
    expressions:
      - expression: 'object.spec.replicas <= 10'
        message: 'Replica count cannot exceed 10'

```

--------------------------------

### MutatingPolicy - Evaluation Configuration

Source: https://kyverno.io/docs/policy-types/mutating-policy

This example shows how to configure the evaluation behavior of a MutatingPolicy, controlling admission and background mutation.

```APIDOC
## MutatingPolicy Spec: Evaluation Field

### Description
The `spec.evaluation` field allows fine-grained control over when and how a MutatingPolicy is applied. It can enable or disable processing during admission requests and for existing resources via background processing.

### Method
N/A (This describes a field within the MutatingPolicy spec)

### Endpoint
N/A

### Parameters
#### Request Body (within MutatingPolicy spec)
- **spec.evaluation** (object) - Defines the evaluation behavior of the policy.
  - **admission** (object) - Controls policy application during admission requests.
    - **enabled** (boolean) - Required - If `true`, the policy is applied during admission requests (CREATE, UPDATE operations). Defaults to `true` if not specified.
  - **mutateExisting** (object) - Controls policy application to existing resources.
    - **enabled** (boolean) - Required - If `true`, the policy is applied to existing resources via background processing. Defaults to `false` if not specified.

### Request Example (Partial Spec)
```json
{
  "apiVersion": "policies.kyverno.io/v1",
  "kind": "MutatingPolicy",
  "metadata": {
    "name": "sample-evaluation"
  },
  "spec": {
    "evaluation": {
      "admission": {
        "enabled": true
      },
      "mutateExisting": {
        "enabled": false
      }
    },
    "mutations": [
      // ... mutation rules ...
    ]
  }
}
```

### Response
N/A (This describes a configuration field within the policy resource)
```

--------------------------------

### Kyverno ClusterPolicy Validate Pattern Example

Source: https://kyverno.io/docs/guides/migration-to-cel

This example demonstrates how to define a validation rule using the 'pattern' keyword in a Kyverno ClusterPolicy. It specifies that container images should not be the 'latest' tag.

```yaml
validate:
  pattern:
    spec:
      containers:
        - name: '*'
          image: '!*:latest'

```

--------------------------------

### Kyverno Values File for Policy Variables

Source: https://kyverno.io/docs/subprojects/kyverno-cli

A YAML file defining values for a Kyverno policy. This example specifies values for the 'add-networkpolicy' policy, targeting the 'devtest' resource with 'request.namespace' set to 'devtest'.

```yaml
apiVersion: cli.kyverno.io/v1alpha1
kind: Values
metadata:
  name: values
policies:
  - name: add-networkpolicy
    resources:
      - name: devtest
        values:
          request.namespace: devtest
```

--------------------------------

### Verify Kyverno Release Artifacts using Cosign

Source: https://kyverno.io/docs/guides/security

These commands demonstrate how to verify the integrity and authenticity of Kyverno container images, Kubernetes install manifests, and Helm charts using Cosign. It assumes Cosign is installed and the COSIGN_REPOSITORY is configured. The output is formatted using 'jq' for readability.

```bash
# Verify an image
COSIGN_EXPERIMENTAL=1 cosign verify ghcr.io/kyverno/kyverno:<release_tag> | jq

# Verify the kubernetes install manifest
COSIGN_EXPERIMENTAL=1 cosign verify ghcr.io/kyverno/manifests/kyverno:<release_tag> | jq

# Verify the kyverno helm chart
COSIGN_EXPERIMENTAL=1 cosign verify ghcr.io/kyverno/charts/kyverno:<release_tag> | jq
```

--------------------------------

### Verify Kyverno Kubernetes Install Manifest with Cosign

Source: https://kyverno.io/docs/guides/security

Verifies the signature of the Kyverno Kubernetes installation manifest. Similar to image verification, this command uses cosign with specific identity and issuer parameters, piping the output to `jq` for analysis.

```bash
cosign verify ghcr.io/kyverno/manifests/kyverno:<release_tag> \
  --certificate-identity-regexp="https://github.com/kyverno/kyverno/.github/workflows/release.yaml@refs/tags/*" \
  --certificate-oidc-issuer="https://token.actions.githubusercontent.com" | jq
```

--------------------------------

### Match Requests Without Service Account using NotEquals

Source: https://kyverno.io/docs/policy-types/cluster-policy/preconditions

This example uses the 'NotEquals' operator in a precondition to ensure a rule is only applied to requests that do not originate from a ServiceAccount (i.e., when the 'serviceAccountName' variable is empty). It matches on Namespace resources. The input is the 'serviceAccountName' variable, and the output is a boolean.

```yaml
- name: generate-owner-role
  match:
    any:
      - resources:
          kinds:
            - Namespace
  preconditions:
    any:
      - key: '{{serviceAccountName}}'
        operator: NotEquals
        value: ''

```

--------------------------------

### Policy Definition Variable Lookup with Operators

Source: https://kyverno.io/docs/policy-types/cluster-policy/variables

Illustrates using operators with relative path-based variable lookups in Kyverno policy definitions. This example checks if the livenessProbe port is less than the readinessProbe port.

```yaml
- livenessProbe:
    tcpSocket:
      port: '$(<./../../../readinessProbe/tcpSocket/port)'
  readinessProbe:
    tcpSocket:
      port: '3000'
```

--------------------------------

### Kyverno Policy Denial Output Example

Source: https://kyverno.io/docs/policy-types/cluster-policy/external-data-sources

This is an example of the error message received when attempting to create a Deployment that violates the Kyverno policy. It indicates that the 'super-user' role is not in the allowed list defined in the ConfigMap.

```text
Error from server: error when creating "deploy.yaml": admission webhook "validate.kyverno.svc" denied the request:

resource Deployment/default/busybox was blocked due to the following policies

cm-array-example:
  validate-role-annotation: 'The role super-user is not in the allowed list of roles: ["cluster-admin", "cluster-operator", "tenant-admin"].'
```

--------------------------------

### Match Service Resources by Name or Namespace (YAML)

Source: https://kyverno.io/docs/policy-types/cluster-policy/match-exclude

This example demonstrates a match statement that filters for Kubernetes Services. It applies to Services named 'staging' or Services created in the 'prod' namespace, specifically for CREATE operations. The 'any' expression allows for an OR condition between the two resource filters.

```yaml
match:
  any:
    - resources:
        kinds:
          - Service
        names:
          - staging
        operations:
          - CREATE
    - resources:
        kinds:
          - Service
        namespaces:
          - prod
        operations:
          - CREATE
```

--------------------------------

### Select Pods in Namespaces with Label Expressions (Kyverno YAML)

Source: https://kyverno.io/docs/policy-types/cluster-policy/match-exclude

This example shows how to select Pods in Namespaces where a specific label, 'namespacekind', does not equal 'platform' or 'ci'. It uses `namespaceSelector` with `matchExpressions` for more complex selection logic, including the `NotIn` operator.

```yaml
match:
  any:
    - resources:
        kinds:
          - Pod
        namespaceSelector:
          matchExpressions:
            - key: namespacekind
              operator: NotIn
              values:
                - platform
                - ci

```

--------------------------------

### Kyverno ClusterPolicy Validate Deny Example

Source: https://kyverno.io/docs/guides/migration-to-cel

This example illustrates a ClusterPolicy with a 'deny' rule that prevents the creation of resources where the replica count exceeds 10. It includes a custom message for policy violations.

```yaml
validate:
  deny:
    conditions:
      all:
        - key: '{{ request.object.spec.replicas }}'
          operator: GreaterThan
          value: 10
  message: 'Replica count cannot exceed 10'

```

--------------------------------

### Example NamespacedDeletingPolicy for Cleanup

Source: https://kyverno.io/docs/policy-types/deleting-policy

An example of a NamespacedDeletingPolicy that cleans up completed jobs in the 'production' namespace daily at 2 AM. It uses resource rules to target 'batch/v1' jobs and a CEL condition to check for completion status.

```yaml
apiVersion: policies.kyverno.io/v1
kind: NamespacedDeletingPolicy
metadata:
  name: cleanup-jobs
  namespace: production
spec:
  schedule: '0 2 * * *' # Daily at 2 AM
  matchConstraints:
    resourceRules:
      - apiGroups: ['batch']
        apiVersions: ['v1']
        resources: ['jobs']
  conditions:
    - name: 'completed-jobs'
      expression: "object.status.conditions.exists(c, c.type == 'Complete' && c.status == 'True')"
```

--------------------------------

### Create Deployments for Testing

Source: https://kyverno.io/docs/guides/reports

This section provides commands to create four Kubernetes Deployments with varying replica counts and in different namespaces ('default' and 'staging'). These deployments are used to test the behavior of the ValidatingAdmissionPolicy.

```bash
kubectl create deployment deployment-1 --image=nginx --replicas=7
kubectl create deployment deployment-2 --image=nginx --replicas=3
kubectl create deployment deployment-3 --image=nginx --replicas=7 -n staging
kubectl create deployment deployment-4 --image=nginx --replicas=3 -n staging

```

--------------------------------

### Deploy Kyverno Policies with Helm

Source: https://kyverno.io/docs/guides/tracing

Installs the 'kyverno-policies' Helm chart with the 'Baseline' profile of PSS. It sets the validation failure action to 'Enforce' to ensure immediate policy enforcement.

```bash
helm install kyverno-policies --namespace kyverno --create-namespace --wait \
  --repo https://kyverno.github.io/kyverno kyverno-policies \
  --values - <<EOF
validationFailureAction: Enforce
EOF
```

--------------------------------

### Kyverno CLI: Apply Policy with Direct Variable

Source: https://kyverno.io/docs/subprojects/kyverno-cli

Command to apply a Kyverno policy to a resource, passing a variable directly using the `--set` flag. This example sets the 'request.object.metadata.name' variable to 'devtest'.

```bash
kyverno apply /path/to/add_network_policy.yaml --resource /path/to/required_default_network_policy.yaml -s request.object.metadata.name=devtest
```

--------------------------------

### Verify labels on a Pod with an existing label after Kyverno mutation attempt

Source: https://kyverno.io/docs/introduction/quick-start

This command retrieves the Pod named 'newredis' and displays its labels. It is used to confirm that the Kyverno policy did not overwrite or add the 'team: bravo' label because a 'team' label ('team=alpha') was already present.

```bash
kubectl get pod newredis --show-labels

```

--------------------------------

### Create Docker Registry Secret (kubectl)

Source: https://kyverno.io/docs/introduction/quick-start

Creates a Kubernetes Secret of type 'docker-registry' to simulate an image pull secret. This secret stores credentials for an internal container registry.

```bash
kubectl -n default create secret docker-registry regcred \
  --docker-server=myinternalreg.corp.com \
  --docker-username=john.doe \
  --docker-password=Passw0rd123! \
  --docker-email=john.doe@corp.com
```

--------------------------------

### Pod Failing Baseline Security Check (Example Pod)

Source: https://kyverno.io/docs/policy-types/cluster-policy/validate

An example of a Pod manifest that would fail the Pod Security baseline profile due to `hostIPC: true`. This demonstrates a violation that Kyverno's `podSecurity` subrule would detect.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: badpod01
spec:
  hostIPC: true
  containers:
    - name: container01
      image: dummyimagename

```

--------------------------------

### GitHub Actions Workflow for Kyverno Policy Testing

Source: https://kyverno.io/docs/guides/testing-policies

This workflow automates the testing of Kyverno policies against resources and predefined test cases. It checks out the repository, installs the Kyverno CLI, and then runs apply and test commands. The workflow triggers on pull requests and manual dispatch, providing feedback on policy compliance.

```yaml
name: kyverno-policy-test
on:
  - pull_request
  - workflow_dispatch
jobs:
  test:
    runs-on: ubuntu-latest
    permissions:
      contents: read
    steps:
      - name: Checkout repo
        uses: actions/checkout@v4
      - name: Install Kyverno CLI
        uses: kyverno/action-install-cli@v0.2.0
        with:
          release: 'v1.11.0'
      - name: Check install
        run: kyverno version
      - name: Test new resources against existing policies
        run: kyverno apply policies/ -r resources/
      - name: Test pre-defined cases
        run: kyverno test tests/
```

--------------------------------

### Fetching Resource Collections with GET

Source: https://kyverno.io/docs/policy-types/cluster-policy/external-data-sources

This section details how to use Kyverno's `apiCall` to perform GET requests to the Kubernetes API server. It demonstrates fetching a collection of resources (like Pods) within a namespace and applying JMESPath expressions to process the results.

```APIDOC
## GET /api/v1/namespaces/{namespace}/pods

### Description
Fetches a list of Pods within a specified namespace and allows for JMESPath processing of the results.

### Method
GET

### Endpoint
/api/v1/namespaces/{{request.namespace}}/pods

### Parameters
#### Query Parameters
None

#### Request Body
None

### Request Example
```yaml
context:
  - name: podCount
    apiCall:
      urlPath: '/api/v1/namespaces/{{request.namespace}}/pods'
      jmesPath: 'items | length(@)'
```

### Response
#### Success Response (200)
- **podCount** (integer) - The result of the JMESPath query, in this case, the number of Pods in the namespace.

#### Response Example
```json
{
  "podCount": 5
}
```
```

--------------------------------

### Match Specific NetworkPolicy Version (YAML)

Source: https://kyverno.io/docs/policy-types/cluster-policy/match-exclude

This example demonstrates how to precisely match a specific version of a Kubernetes resource kind. It targets NetworkPolicy resources belonging to the 'networking.k8s.io' group and the 'v1' version. This ensures the rule only applies to NetworkPolicies of that exact version.

```yaml
match:
  any:
    - resources:
        kinds:
          - networking.k8s.io/v1/NetworkPolicy
```

--------------------------------

### Kyverno ClusterPolicy Example

Source: https://kyverno.io/docs/guides/exceptions

This YAML defines a Kyverno ClusterPolicy that enforces a rule against Pods using host namespaces. It's an example of a policy that might have exceptions created for it.

```yaml
apiVersion: kyverno.io/v2beta1
kind: ClusterPolicy
metadata:
  name: disallow-host-namespaces
spec:
  background: false
  rules:
    - name: host-namespaces
      match:
        any:
          - resources:
              kinds:
                - Pod
      validate:
        failureAction: Enforce
        message: >-
          Sharing the host namespaces is disallowed. The fields spec.hostNetwork,
          spec.hostIPC, and spec.hostPID must be unset or set to `false`.
        pattern:
          spec:
            =(hostPID): 'false'
            =(hostIPC): 'false'
            =(hostNetwork): 'false'
```

--------------------------------

### Test Validate Policy with Kyverno CLI

Source: https://kyverno.io/docs/subprojects/kyverno-cli

Demonstrates testing a Kyverno `validate` policy against a Kubernetes resource using the `kyverno test` command. This example shows a policy that disallows the 'latest' tag for container images and verifies that a resource with a specific tag passes the policy.

```yaml
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: disallow-latest-tag
spec:
  rules:
    - name: require-image-tag
      match:
        any:
          - resources:
              kinds:
                - Pod
      validate:
        failureAction: Audit
        message: 'An image tag is required.'
        pattern:
          spec:
            containers:
              - image: '*:*'
    - name: validate-image-tag
      match:
        any:
          - resources:
              kinds:
                - Pod
      validate:
        failureAction: Audit
        message: "Using a mutable image tag e.g. 'latest' is not allowed."
        pattern:
          spec:
            containers:
              - image: '!*:latest'

```

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: myapp-pod
  labels:
    app: myapp
spec:
  containers:
    - name: nginx
      image: nginx:1.12

```

```yaml
apiVersion: cli.kyverno.io/v1alpha1
kind: Test
metadata:
  name: disallow_latest_tag
policies:
  - disallow_latest-tag.yaml
resources:
  - resource.yaml
results:
  - policy: disallow-latest-tag
    rule: require-image-tag
    resources:
      - myapp-pod
    kind: Pod
    result: pass
  - policy: disallow-latest-tag
    rule: validate-image-tag
    resources:
      - myapp-pod
    kind: Pod
    result: pass

```

```bash
$ kyverno test .

Loading test  ( kyverno-test.yaml ) ...
  Loading values/variables ...
  Loading policies ...
  Loading resources ...
  Loading exceptions ...
  Applying 1 policy to 1 resource ...
  Checking results ...


│────│─────────────────────│────────────────────│───────────────│────────│────────│
│ ID │ POLICY              │ RULE               │ RESOURCE      │ RESULT │ REASON │
│────│─────────────────────│────────────────────│───────────────│────────│────────│
│ 1  │ disallow-latest-tag │ require-image-tag  │ Pod/myapp-pod │ Pass   │ Ok     │
│ 2  │ disallow-latest-tag │ validate-image-tag │ Pod/myapp-pod │ Pass   │ Ok     │
│────│─────────────────────│────────────────────│───────────────│────────│────────│


Test Summary: 2 tests passed and 0 tests failed


```

--------------------------------

### Kyverno: Generate ConfigMap with Templated Data

Source: https://kyverno.io/docs/policy-types/cluster-policy/generate

This example demonstrates how to use `generate.data` in a Kyverno ClusterPolicy to create a ConfigMap with dynamic Zookeeper and Kafka connection strings. The `synchronize: true` setting ensures that modifications to the `data` object will update downstream resources. This policy applies to all Namespaces except system ones.

```yaml
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: zk-kafka-address
spec:
  rules:
    - name: k-kafka-address
      match:
        any:
          - resources:
              kinds:
                - Namespace
      exclude:
        any:
          - resources:
              namespaces:
                - kube-system
                - default
                - kube-public
                - kyverno
      generate:
        synchronize: true
        apiVersion: v1
        kind: ConfigMap
        name: zk-kafka-address
        # generate the resource in the new namespace
        namespace: '{{request.object.metadata.name}}'
        data:
          kind: ConfigMap
          metadata:
            labels:
              somekey: somevalue
          data:
            ZK_ADDRESS: '192.168.10.10:2181,192.168.10.11:2181,192.168.10.12:2181'
            KAFKA_ADDRESS: '192.168.10.13:9092,192.168.10.14:9092,192.168.10.15:9092'
```

--------------------------------

### Example: Clone Image Pull Secret using GeneratingPolicy

Source: https://kyverno.io/docs/policy-types/generating-policy

This example demonstrates how to use GeneratingPolicy to automatically clone an image pull secret from the 'default' namespace into any newly created Namespace. It utilizes CEL expressions for variable definition and resource generation.

```yaml
apiVersion: policies.kyverno.io/v1
kind: GeneratingPolicy
metadata:
  name: clone-image-pull-secret
spec:
  matchConstraints:
    resourceRules:
      - apiGroups: ['']
        apiVersions: ['v1']
        operations: ['CREATE']
        resources: ['namespaces']
  variables:
    - name: targetNs
      expression: 'object.metadata.name'
    - name: sourceSecret
      expression: resource.Get("v1", "secrets", "default", "regcred")
  generate:
    - expression: generator.Apply(variables.targetNs, [variables.sourceSecret])

```

--------------------------------

### Dry Run Server with Signed Image (Shell)

Source: https://kyverno.io/docs/policy-types/cluster-policy/verify-images/notary

This command demonstrates a server-side dry run of creating a Pod with a signed image. It shows how Kyverno would process the request without actually creating the Pod, verifying the image signature as part of the admission control process.

```shell
kubectl run test --image=ghcr.io/kyverno/test-verify-image:signed --dry-run=server
```

--------------------------------

### Conditional ApplyConfiguration Mutation Policy

Source: https://kyverno.io/docs/policy-types/mutating-policy

This example demonstrates a `MutatingPolicy` using `ApplyConfiguration` with a conditional expression. It adds labels to pods based on the existence of specific labels.

```yaml
apiVersion: policies.kyverno.io/v1
kind: MutatingPolicy
metadata:
  name: conditional-labels
spec:
  matchConstraints:
    resourceRules:
      - apiGroups: ['']
        apiVersions: ['v1']
        resources: ['pods']
        operations: ['CREATE', 'UPDATE']
  mutations:
    - patchType: ApplyConfiguration
      applyConfiguration:
        expression: |
          has(object.metadata.labels) && has(object.metadata.labels.environment) ?
          Object{
            metadata: Object.metadata{
              labels: {"managed": "true"}
            }
          } :
          Object{
            metadata: Object.metadata{
              labels: {"environment": "dev", "managed": "true"}
            }
          }

```

--------------------------------

### MutatingPolicy - Autogen Configuration

Source: https://kyverno.io/docs/policy-types/mutating-policy

This example demonstrates how to configure `spec.autogen` to automatically generate policies for pod controllers and `MutatingAdmissionPolicy` types.

```APIDOC
## MutatingPolicy Spec: Autogen Field

### Description
The `spec.autogen` field enables automatic generation of policies. It can be used to generate policies for various pod controllers and to create `MutatingAdmissionPolicy` types for Kubernetes API server execution, offering benefits like faster and more resilient admission control.

### Method
N/A (This describes a field within the MutatingPolicy spec)

### Endpoint
N/A

### Parameters
#### Request Body (within MutatingPolicy spec)
- **spec.autogen** (object) - Defines auto-generation behaviors.
  - **mutatingAdmissionPolicy** (object) - Configuration for generating `MutatingAdmissionPolicy` types.
    - **enabled** (boolean) - Required - If `true`, a `MutatingAdmissionPolicy` will be generated from this `MutatingPolicy`.
  - **podControllers** (object) - Configuration for generating policies for pod controllers.
    - **controllers** (array) - Required - A list of pod controller types for which to generate policies (e.g., "deployments", "jobs", "cronjobs", "statefulsets").

### Request Example (Partial Spec)
```json
{
  "apiVersion": "policies.kyverno.io/v1",
  "kind": "MutatingPolicy",
  "metadata": {
    "name": "add-default-labels-autogen"
  },
  "spec": {
    "autogen": {
      "mutatingAdmissionPolicy": {
        "enabled": true
      },
      "podControllers": {
        "controllers": [
          "deployments",
          "jobs",
          "cronjobs",
          "statefulsets"
        ]
      }
    },
    "mutations": [
      // ... mutation rules ...
    ]
  }
}
```

### Response
N/A (This describes a configuration field within the policy resource)
```

--------------------------------

### Generated ValidatingAdmissionPolicy Example

Source: https://kyverno.io/docs/policy-types/cluster-policy/validate

An example of a Kubernetes ValidatingAdmissionPolicy that is generated by Kyverno based on a Kyverno policy. This policy enforces constraints directly within the Kubernetes API server using CEL.

```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingAdmissionPolicy
metadata:
  labels:
    app.kubernetes.io/managed-by: kyverno
  name: disallow-host-path
  ownerReferences:
    - apiVersion: kyverno.io/v1
      kind: ClusterPolicy
      name: disallow-host-path
spec:
  failurePolicy: Fail
  matchConstraints:
    matchPolicy: Equivalent
    namespaceSelector: {}
    objectSelector: {}
    resourceRules:
      - apiGroups:
          - apps
        apiVersions:

```

--------------------------------

### Verify Generated Secret (kubectl)

Source: https://kyverno.io/docs/introduction/quick-start

Retrieves and displays the secrets present in the 'mytestns' namespace. This command is used to verify that the 'regcred' secret has been successfully generated by the Kyverno policy.

```bash
kubectl -n mytestns get secret
```

--------------------------------

### Apply Policies with Variables from Values File and UserInfo

Source: https://kyverno.io/docs/subprojects/kyverno-cli

Applies multiple policies to multiple resources, providing variable values from a YAML file (`--values-file`) and optional admission request data from a `user_info.yaml` file.

```bash
kyverno apply /path/to/policy1.yaml /path/to/policy2.yaml --resource /path/to/resource1.yaml --resource /path/to/resource2.yaml -f /path/to/value.yaml --userinfo /path/to/user_info.yaml
```

--------------------------------

### Create Local Kubernetes Cluster with Kind

Source: https://kyverno.io/docs/guides/tracing

Command to create a local Kubernetes cluster using 'kind'. This setup includes specific configurations for the control-plane node, such as ingress readiness labels and port mappings for HTTP and HTTPS, which are necessary for certain deployments like the ingress-nginx controller.

```bash
kind create cluster --config - <<EOF
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
nodes:
  - role: control-plane
    kubeadmConfigPatches:
      - |-
        kind: InitConfiguration
        nodeRegistration:
          kubeletExtraArgs:
            node-labels: "ingress-ready=true"
    extraPortMappings:
      - containerPort: 80
        hostPort: 80
        protocol: TCP
      - containerPort: 443
        hostPort: 443
        protocol: TCP
  - role: worker
EOF

```

--------------------------------

### List Available Kyverno JP Functions

Source: https://kyverno.io/docs/kyverno-cli/reference/kyverno_jp

Demonstrates how to list all available custom functions provided by the kyverno jp tool. This is useful for understanding the extended capabilities beyond standard JMESPath.

```bash
kyverno jp function
```

--------------------------------

### Verify Monitoring Stack Pods

Source: https://kyverno.io/docs/guides/monitoring

Lists the pods in the 'monitoring' namespace that are part of the Helm release. This helps verify that the kube-prometheus-stack was installed correctly.

```shell
kubectl -n monitoring get po -l "release"
```

--------------------------------

### Install Jaeger Backend

Source: https://kyverno.io/docs/guides/monitoring

This command applies the Jaeger custom resource definition to your Kubernetes cluster, instructing the Jaeger Operator to provision a Jaeger instance. Ensure the 'jaeger.yaml' file is in your current directory or provide the correct path.

```bash
kubectl create -f jaeger.yaml

```

--------------------------------

### MutatingPolicy - Webhook Configuration

Source: https://kyverno.io/docs/policy-types/mutating-policy

This example illustrates configuring the webhook timeout for a MutatingPolicy.

```APIDOC
## MutatingPolicy Spec: WebhookConfiguration Field

### Description
The `spec.webhookConfiguration` field allows customization of the Kyverno admission controller webhook settings, such as the timeout for policy evaluation.

### Method
N/A (This describes a field within the MutatingPolicy spec)

### Endpoint
N/A

### Parameters
#### Request Body (within MutatingPolicy spec)
- **spec.webhookConfiguration** (object) - Defines webhook properties.
  - **timeoutSeconds** (integer) - Optional - The duration in seconds the admission request waits for policy evaluation. Allowed range is 1 to 30. Defaults to 10 seconds.

### Request Example (Partial Spec)
```json
{
  "apiVersion": "policies.kyverno.io/v1",
  "kind": "MutatingPolicy",
  "metadata": {
    "name": "add-labels-with-timeout"
  },
  "spec": {
    "webhookConfiguration": {
      "timeoutSeconds": 15
    },
    "mutations": [
      // ... mutation rules ...
    ]
  }
}
```

### Response
N/A (This describes a configuration field within the policy resource)
```

--------------------------------

### Kyverno Equality Anchor Example

Source: https://kyverno.io/docs/policy-types/cluster-policy/validate

Illustrates the use of equality anchors `=` in a Kyverno ClusterPolicy. This rule ensures that if a hostPath volume is defined, its path cannot be '/var/run/docker.sock'.

```yaml
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: equality-anchor-no-dockersock
spec:
  background: false
  rules:
    - name: equality-anchor-no-dockersock
      match:
        any:
          - resources:
              kinds:
                - Pod
      validate:
        failureAction: Enforce
        message: 'If a hostPath volume exists, it must not be set to `/var/run/docker.sock`.'
        pattern:
          =(spec):
            =(volumes):
              - =(hostPath):
                  path: '!/var/run/docker.sock'

```

--------------------------------

### Querying Multiple Container Arrays with JMESPath

Source: https://kyverno.io/docs/policy-types/cluster-policy/jmespath

This example demonstrates querying both 'initContainers[]' and 'containers[]' arrays in a Pod spec using a multi-select list in JMESPath. It returns an array of arrays, with each inner array containing containers from a specific location.

```bash
$ kyverno jp query -i pod.yaml "spec.[initContainers, containers]"
[
  [
    {
      "image": "redis",
      "name": "redis"
    }
  ],
  [
    {
      "image": "busybox",
      "name": "busybox"
    },
    {
      "image": "nginx",
      "name": "nginx"
    }
  ]
]
```

--------------------------------

### Compare Resource Quantities with LessThan Operator

Source: https://kyverno.io/docs/policy-types/cluster-policy/preconditions

This example demonstrates using the 'LessThan' operator to compare Kubernetes resource quantities, specifically memory requests for Pods. It requires the Kyverno API version and kind definitions. The input is a Pod's memory request, and the output is a boolean indicating if the request is less than 1Gi.

```yaml
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: resource-quantities
spec:
  background: false
  rules:
    - name: memory-limit
      match:
        any:
          - resources:
              kinds:
                - Pod
      preconditions:
        any:
          - key: '{{request.object.spec.containers[0].resources.requests.memory}}'
            operator: LessThan
            value: 1Gi

```

--------------------------------

### Mutate Policy Test with Patched Resources

Source: https://kyverno.io/docs/subprojects/kyverno-cli

This example shows how the Kyverno CLI checks results against the `patchedResources` file when no specific entry is provided in the `resources` field of the test results. It matches all trigger and target resources involved in the test.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: dictionary-1
  namespace: staging
---
apiVersion: v1
kind: Secret
metadata:
  labels:
    foo: bar
  name: secret-1
  namespace: staging
---

```

--------------------------------

### Create Kyverno Test Manifest

Source: https://kyverno.io/docs/subprojects/kyverno-cli

Creates a `kyverno-test.yaml` file that defines a test case for Kyverno policies. It links policies, resources, and expected results, referencing an external `context.yaml` for mock data.

```yaml
apiVersion: cli.kyverno.io/v1alpha1
kind: Test
metadata:
  name: kyverno-test.yaml
policies:
  - policy.yaml
resources:
  - pod1.yaml
  - pod2.yaml
results:
  - isValidatingPolicy: true
    kind: Pod
    policy: disallow-host-path
    resources:
      - bad-pod
    result: fail
  - isValidatingPolicy: true
    kind: Pod
    policy: disallow-host-path
    resources:
      - good-pod
    result: pass
context: context.yaml

```

--------------------------------

### Test JMESPath Filter with Stdin Input

Source: https://kyverno.io/docs/subprojects/kyverno-cli

Tests a custom JMESPath filter by piping JSON data to the `kyverno jp query` command via standard input. The example demonstrates the `to_lower` filter.

```bash
$ echo '{"foo": "BAR"}' | kyverno jp query 'to_lower(foo)'
Reading from terminal input.
Enter input object and hit Ctrl+D.
# to_lower(foo)
"bar"


```

--------------------------------

### Example of a 'Bad' Pod (YAML)

Source: https://kyverno.io/docs/policy-types/cluster-policy/external-data-sources

A sample Pod configuration that violates the `no-root-images` policy, demonstrating a blocked resource.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: badpod
spec:
  containers:
    - name: ubuntu
      image: ubuntu:latest

```

--------------------------------

### Example Pod Allowed by Baseline PSA with Nginx Capabilities Exemption (FOO)

Source: https://kyverno.io/docs/policy-types/cluster-policy/validate

This Nginx Pod is allowed because it adds the 'FOO' capability, which is explicitly exempted in the policy for nginx images.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx
spec:
  containers:
    - name: nginx
      image: nginx:latest
      securityContext:
        capabilities:
          add:
            - FOO

```

--------------------------------

### Kyverno Info

Source: https://kyverno.io/docs/reference/metrics

This section details the `kyverno_info` metric, which provides information about the Kyverno deployment, such as its version. It includes metric value, labels, use cases, and an example query.

```APIDOC
## Kyverno Info

### Description
Provides information about the Kyverno deployment, including its version.

### Metric Name(s)
* `kyverno_info`

### Metric Value
Gauge - A constant value of 1 with labels to include relevant information.

### Metric Labels
| Label | Allowed Values | Description |
|---|---|---|
| version | | Current version of Kyverno being used |

### Use Cases
* The cluster admin wants to see information related to Kyverno such as its version.

### Useful Queries
* `kyverno_info`
```

--------------------------------

### Attempting to Run Unsigned Image (Shell)

Source: https://kyverno.io/docs/policy-types/cluster-policy/verify-images/notary

This command attempts to create a Pod using an unsigned image. The output shows the error message received from the Kubernetes API server, indicating that the admission webhook (Kyverno) denied the request due to a failed image signature verification.

```shell
kubectl run test --image=ghcr.io/kyverno/test-verify-image:unsigned --dry-run=server
```

--------------------------------

### Command to Apply Deployment Manifest

Source: https://kyverno.io/docs/policy-types/cluster-policy/external-data-sources

This command applies the example Deployment manifest to the Kubernetes cluster. It is used to test the Kyverno policy's ability to block Deployments with unauthorized role annotations.

```bash
kubectl create -f deploy.yaml
```

--------------------------------

### Inspect Image Configuration using Crane CLI

Source: https://kyverno.io/docs/policy-types/cluster-policy/external-data-sources

This command-line example shows how to use the `crane config` tool to retrieve the configuration details of a container image, piping the output to `jq` for pretty-printing. This is useful for inspecting image metadata like labels, entrypoint, and user.

```bash
$ crane config ghcr.io/kyverno/kyverno:latest | jq
```

--------------------------------

### Deployment Request Denied by Policy

Source: https://kyverno.io/docs/policy-types/cluster-policy/validate

An example of a Deployment resource that would be denied by the 'disallow-host-path' ValidatingAdmissionPolicy due to the presence of a HostPath volume.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx
spec:
  replicas: 2
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
        - name: nginx-server
          image: nginx
          volumeMounts:
            - name: udev
              mountPath: /data
      volumes:
        - name: udev
          hostPath:
            path: /etc/udev

```

--------------------------------

### Kyverno CLI: Apply Policy with Values File and Precedence

Source: https://kyverno.io/docs/subprojects/kyverno-cli

Command to apply a Kyverno policy using a values file, illustrating variable precedence. This command applies the 'cm-globalval-example' policy to the pods defined in 'dev_prod_pod.yaml' using the specified values file.

```bash
kyverno apply /path/to/add_dev_pod.yaml --resource /path/to/dev_prod_pod.yaml -f /path/to/value.yaml
```

--------------------------------

### Enable ValidatingAdmissionPolicy in Minikube

Source: https://kyverno.io/docs/policy-types/cluster-policy/validate

Command to start Minikube with the ValidatingAdmissionPolicy feature gate enabled and the admissionregistration.k8s.io/v1beta1 API enabled. This is a prerequisite for using ValidatingAdmissionPolicies.

```bash
minikube start --extra-config=apiserver.runtime-config=admissionregistration.k8s.io/v1beta1 --feature-gates='ValidatingAdmissionPolicy=true'
```

--------------------------------

### Add Label to ConfigMap on Deployment Create/Update

Source: https://kyverno.io/docs/policy-types/cluster-policy/mutate

This policy adds a label 'modified-by-kyverno: "true"' to a specific ConfigMap ('example' in the 'example' namespace) when a Deployment is created or updated. It uses `patchesJson6902` for the mutation operation.

```yaml
apiVersion: kyverno.io/v1
kind: Policy
metadata:
  name: mutate-configmap-on-undefined-deployment-operation
spec:
  background: false
  rules:
    - name: mutate-configmap-on-undefined-deployment-operation
      match:
        all:
          - resources:
              kinds:
                - Deployment
      mutate:
        targets:
          - apiVersion: v1
            kind: ConfigMap
            name: example
            namespace: example
        patchesJson6902: |-
          - path: "/metadata/labels/modified-by-kyverno"
            op: add
            value: "true"

```

--------------------------------

### Configure Kyverno Metrics Histogram Bucket Boundaries

Source: https://kyverno.io/docs/guides/monitoring

This section demonstrates how to configure the bucket boundaries for all Histogram metrics. The provided list defines the default boundaries, which can be overridden for specific metrics as shown in other examples.

```yaml
metricsConfig:
  # Configures the bucket boundaries for all Histogram metrics, the value below is the default.
  bucketBoundaries:
    [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10, 15, 20, 25, 30]
```

--------------------------------

### Apply Policy with Variable Substitution using --set

Source: https://kyverno.io/docs/subprojects/kyverno-cli

Applies a policy that contains variables, providing their values directly on the command line using the `--set` flag. Variables starting with `{{request.object}}` are typically inferred from the resource.

```bash
kyverno apply /path/to/policy.yaml --resource /path/to/resource.yaml --set <variable1>=<value1>,<variable2>=<value2>
```

--------------------------------

### Generate NetworkPolicy with Kyverno

Source: https://kyverno.io/docs/subprojects/kyverno-cli

This example shows a Kyverno ClusterPolicy that automatically generates a NetworkPolicy for new Namespaces. The generated NetworkPolicy denies all ingress and egress traffic by default. It uses the `generate` rule to create the NetworkPolicy based on the namespace name.

```yaml
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: add-networkpolicy
spec:
  rules:
    - name: default-deny
      match:
        any:
          - resources:
              kinds:
                - Namespace
      generate:
        apiVersion: networking.k8s.io/v1
        kind: NetworkPolicy
        name: default-deny
        namespace: '{{request.object.metadata.name}}'
        synchronize: true
        data:
          spec:
            podSelector: {}
            policyTypes:
              - Ingress
              - Egress

```

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: hello-world-namespace

```

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny
  namespace: hello-world-namespace
spec:
  podSelector: {}
  policyTypes:
    - Ingress
    - Egress

```

```yaml
apiVersion: cli.kyverno.io/v1alpha1
kind: Test
metadata:
  name: deny-all-traffic
policies:
  - add_network_policy.yaml
resources:
  - resource.yaml
results:
  - policy: add-networkpolicy
    rule: default-deny
    resources:
      - hello-world-namespace
    generatedResource: generatedResource.yaml
    kind: Namespace
    result: pass

```

--------------------------------

### Clone a Single Resource with Kyverno Policy

Source: https://kyverno.io/docs/policy-types/cluster-policy/generate

This example demonstrates cloning a single Secret resource named 'regcred' from the 'default' namespace to the namespace of the triggering resource. Synchronization is enabled, meaning downstream resources will be updated if the source 'regcred' Secret is modified. This policy requires no external dependencies and uses the 'generate.clone' object.

```yaml
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: sync-secrets
spec:
  rules:
    - name: sync-image-pull-secret
      match:
        any:
          - resources:
              kinds:
                - Namespace
      generate:
        apiVersion: v1
        kind: Secret
        name: regcred
        namespace: '{{request.object.metadata.name}}'
        synchronize: true
        clone:
          namespace: default
          name: regcred

```

--------------------------------

### Apply Policy Manifest to Multiple Resource Manifests

Source: https://kyverno.io/docs/subprojects/kyverno-cli

Applies a Kyverno policy defined in 'policy.yaml' to multiple resource files, 'resource1.yaml' and 'resource2.yaml', and generates a policy report. This is useful for testing policies against specific resource configurations.

```bash
kyverno apply policy.yaml -r resource1.yaml -r resource2.yaml --policy-report
```

--------------------------------

### Add Label to ConfigMap on Deployment Delete

Source: https://kyverno.io/docs/policy-types/cluster-policy/mutate

This policy adds a label 'modified-by-kyverno: "true"' to a specific ConfigMap ('example' in the 'example' namespace) when a Deployment is deleted. It explicitly includes the `DELETE` operation in the match criteria.

```yaml
apiVersion: kyverno.io/v1
kind: Policy
metadata:
  name: mutate-configmap-on-undefined-deployment-operation
spec:
  background: false
  rules:
    - name: mutate-configmap-on-undefined-deployment-operation
      match:
        all:
          - resources:
              kinds:
                - Deployment
              operations:
                # add other operations if needed
                - DELETE
      mutate:
        targets:
          - apiVersion: v1
            kind: ConfigMap
            name: example
            namespace: example
        patchesJson6902: |-
          - path: "/metadata/labels/modified-by-kyverno"
            op: add
            value: "true"

```

--------------------------------

### Example Namespaces for Kyverno Policy Testing

Source: https://kyverno.io/docs/guides/exceptions

These Kubernetes Namespace manifests are used to demonstrate the behavior of the GeneratingPolicy and PolicyException. When these namespaces are created, Kyverno processes them according to the defined policies and exceptions.

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: testing
---
apiVersion: v1
kind: Namespace
metadata:
  name: production
---
apiVersion: v1
kind: Namespace
metadata:
  name: staging

```

--------------------------------

### Mutate Policy Test with Target Resources

Source: https://kyverno.io/docs/subprojects/kyverno-cli

This example demonstrates testing a mutate policy that adds a label to Secrets based on requests made on a particular ConfigMap. It highlights the use of the `targetResources` field in the test manifest.

```yaml
apiVersion: cli.kyverno.io/v1alpha1
kind: Test
metadata:
  name: kyverno-test.yaml
policies:
  - policy.yaml
resources:
  - trigger-cm.yaml
targetResources:
  - raw-secret.yaml
results:
  - patchedResources: mutated-secret.yaml
    policy: mutate-existing-secret
    resources:
      - secret-1
    result: pass
    rule: mutate-secret-on-configmap-create

```

```yaml
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: mutate-existing-secret
spec:
  rules:
    - match:
        any:
          - resources:
              kinds:
                - ConfigMap
              names:
                - dictionary-1
              namespaces:
                - staging
      mutate:
        mutateExistingOnPolicyUpdate: false
        patchStrategicMerge:
          metadata:
            labels:
              foo: bar
        targets:
          - apiVersion: v1
            kind: Secret
            name: '*'
            namespace: staging
      name: mutate-secret-on-configmap-create

```

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: dictionary-1
  namespace: staging

```

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: secret-1
  namespace: staging

```

```yaml
apiVersion: v1
kind: Secret
metadata:
  labels:
    foo: bar
  name: secret-1
  namespace: staging

```

--------------------------------

### Example Container Image Data Structure

Source: https://kyverno.io/docs/policy-types/cluster-policy/variables

This JSON structure represents the data extracted from container images by Kyverno, including details like registry, path, name, digest, and various reference formats. It demonstrates the organization for both 'containers' and 'initContainers'.

```json
{
  "containers": {
    "nginx": {
      "registry": "https://docker.io",
      "path": "library/nginx",
      "name": "nginx",
      "digest": "sha256:5f44022eab9198d75939d9eaa5341bc077eca16fa51d4ef32d33f1bd4c8cbe7d",
      "reference": "https://docker.io/library/nginx@sha256:5f44022eab9198d75939d9eaa5341bc077eca16fa51d4ef32d33f1bd4c8cbe7d",
      "referenceWithTag": "https://docker.io/library/nginx:"
    }
  },
  "initContainers": {
    "vault": {
      "registry": "https://ghcr.io",
      "path": "vault",
      "name": "vault",
      "tag": "v3",
      "reference": "https://ghcr.io/vault:v3",
      "referenceWithTag": "https://ghcr.io/vault:v3"
    }
  }
}
```

--------------------------------

### Match Deployments or StatefulSets with Specific Labels (Kyverno YAML)

Source: https://kyverno.io/docs/policy-types/cluster-policy/match-exclude

This snippet illustrates how to match either a Deployment or a StatefulSet that has the label `app=critical`. It demonstrates the use of `kinds` for OR logic within resource types and `selector` for label matching.

```yaml
match:
  any:
    # AND across kinds and namespaceSelector
    - resources:
        # OR inside list of kinds
        kinds:
          - Deployment
          - StatefulSet
        operations:
          - CREATE
          - UPDATE
        selector:
          matchLabels:
            app: critical

```

--------------------------------

### Validate Pods with Policy Exceptions in Kyverno

Source: https://kyverno.io/docs/subprojects/kyverno-cli

This example demonstrates a Kyverno policy that prevents Pods from sharing host namespaces. It includes a PolicyException to exempt specific Deployments and Pods in the 'delta' namespace from this rule. The test manifest shows how to apply these exceptions.

```yaml
apiVersion: kyverno.io/v2beta1
kind: ClusterPolicy
metadata:
  name: disallow-host-namespaces
spec:
  background: false
  rules:
    - name: host-namespaces
      match:
        any:
          - resources:
              kinds:
                - Pod
      validate:
        failureAction: Enforce
        message: >-
          Sharing the host namespaces is disallowed. The fields spec.hostNetwork,
          spec.hostIPC, and spec.hostPID must be unset or set to `false`.
        pattern:
          spec:
            =(hostPID): 'false'
            =(hostIPC): 'false'
            =(hostNetwork): 'false'

```

```yaml
apiVersion: kyverno.io/v2
kind: PolicyException
metadata:
  name: delta-exception
  namespace: delta
spec:
  exceptions:
    - policyName: disallow-host-namespaces
      ruleNames:
        - host-namespaces
        - autogen-host-namespaces
  match:
    any:
      - resources:
          kinds:
            - Pod
            - Deployment
          namespaces:
            - delta
          names:
            - important-tool*

```

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: important-tool
  namespace: delta
  labels:
    app: busybox
spec:
  replicas: 1
  selector:
    matchLabels:
      app: busybox
  template:
    metadata:
      labels:
        app: busybox
    spec:
      hostIPC: true
      containers:
        - image: busybox:1.35
          name: busybox
          command: ['sleep', '1d']
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: not-important
  namespace: gamma
  labels:
    app: busybox
spec:
  replicas: 1
  selector:
    matchLabels:
      app: busybox
  template:
    metadata:
      labels:
        app: busybox
    spec:
      hostIPC: true
      containers:
        - image: busybox:1.35
          name: busybox
          command: ['sleep', '1d']

```

```yaml
apiVersion: cli.kyverno.io/v1alpha1
kind: Test
metadata:
  name: disallow-host-namespaces-test-exception
policies:
  - disallow-host-namespace.yaml
resources:
  - resource.yaml
exceptions:
  - delta-exception.yaml
results:
  - kind: Deployment
    policy: disallow-host-namespaces
    resources:
      - important-tool
    rule: host-namespaces
    result: skip
  - kind: Deployment
    policy: disallow-host-namespaces
    resources:

```

--------------------------------

### Kyverno Test Manifest - Desired Results

Source: https://kyverno.io/docs/subprojects/kyverno-cli

This example illustrates how to define desired results within a 'kyverno-test.yaml' file. It shows the four possible outcomes ('pass', 'skip', 'fail', 'warn') that can be declared for a test case. The command compares these declared results against the actual execution results to determine if the test passes.

```yaml
apiVersion: kyverno.io/v1
kind: Test
metadata:
  name: example-test
resources:
  - policy: "my-policy"
    resources: ["pod.yaml"]
    results:
      - pass
      - skip
      - fail
      - warn
```

--------------------------------

### Example Pod Allowed by Restricted PSA with Seccomp Exclusion

Source: https://kyverno.io/docs/policy-types/cluster-policy/validate

This Pod is allowed even though it uses 'Unconfined' seccomp, because the Kyverno policy excludes the Seccomp control for all images.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: goodpod01
spec:
  securityContext:
    seccompProfile:
      type: Unconfined
  containers:
    - name: container01
      image: busybox:1.28
      securityContext:
        allowPrivilegeEscalation: false
        runAsNonRoot: true
        capabilities:
          drop: [
            "ALL"
          ]

```

--------------------------------

### Sequential Mutations within a Single Policy (YAML)

Source: https://kyverno.io/docs/policy-types/mutating-policy

This example demonstrates how to apply multiple mutations sequentially within a single Kyverno policy. Mutations are processed in the order they appear, allowing for dependent operations. Ensure the order reflects the dependencies.

```yaml
apiVersion: policies.kyverno.io/v1
kind: MutatingPolicy
metadata:
  name: simple-database-policy
spec:
  matchConstraints:
    resourceRules:
      - apiGroups: ['']
        apiVersions: ['v1']
        resources: ['pods']
        operations: ['CREATE']
  mutations:
    # First mutation
    - patchType: ApplyConfiguration
      applyConfiguration:
        expression: |
          object.spec.containers.exists(c, c.image.contains("cassandra") || c.image.contains("mongo")) ?
          Object{
            metadata: Object.metadata{
              labels: Object.metadata.labels{
                type: "database"
              }
            }
          } : Object{}


    # Second mutation
    - patchType: ApplyConfiguration
      applyConfiguration:
        expression: |
          object.metadata.labels.type == "database" ?
          Object{
            metadata: Object.metadata{
              labels: Object.metadata.labels{
                backup: "yes"
              }
            }
          } : Object{}
```

--------------------------------

### Configure Cosign Repository for Kyverno Artifact Verification

Source: https://kyverno.io/docs/guides/security

This command configures the COSIGN_REPOSITORY environment variable to point to the Kyverno signature repository. This is a prerequisite for verifying Kyverno container images, install manifests, and Helm charts using Cosign.

```bash
export COSIGN_REPOSITORY=ghcr.io/kyverno/signatures
```

--------------------------------

### Basic JSONPatch Mutation Policy

Source: https://kyverno.io/docs/policy-types/mutating-policy

This example shows a `MutatingPolicy` using RFC 6902 JSON Patch operations to add labels to pods. It handles cases where labels might not exist.

```yaml
apiVersion: policies.kyverno.io/v1
kind: MutatingPolicy
metadata:
  name: add-labels-jsonpatch
spec:
  matchConstraints:
    resourceRules:
      - apiGroups:
          - ''
        apiVersions:
          - v1
        resources:
          - pods
        operations:
          - CREATE
  mutations:
    - patchType: JSONPatch
      jsonPatch:
        expression: |
          has(object.metadata.labels) ?
          [
              JSONPatch{
                  op: "add",
                  path: "/metadata/labels/managed",
                  value: "true"
              }
          ] :
          [
              JSONPatch{
                  op: "add",
                  path: "/metadata/labels",
                  value: {"managed": "true"}
              }
          ]

```

--------------------------------

### Match Service Resources with Name Wildcards and Subject (YAML)

Source: https://kyverno.io/docs/policy-types/cluster-policy/match-exclude

This snippet shows advanced matching for Service resources. It includes wildcard matching for service names ('prod-*' or 'staging') and also matches any Service created by the user 'dave'. The 'any' key combines these conditions with an OR logic.

```yaml
match:
  any:
    - resources:
        names:
          - 'prod-*'
          - 'staging'
        kinds:
          - Service
        operations:
          - CREATE
    - resources:
        kinds:
          - Service
        operations:
          - CREATE
      subjects:
        - kind: User
          name: dave
```

--------------------------------

### Kyverno Conditional Anchor Example

Source: https://kyverno.io/docs/policy-types/cluster-policy/validate

Demonstrates the use of a conditional anchor `()` in a Kyverno ClusterPolicy. This rule enforces that if a hostPath volume exists with the path '/var/run/docker.sock', then the 'allow-docker' label must be set to 'true'.

```yaml
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: conditional-anchor-dockersock
spec:
  background: false
  rules:
    - name: conditional-anchor-dockersock
      match:
        any:
          - resources:
              kinds:
                - Pod
      validate:
        failureAction: Enforce
        message: 'If a hostPath volume exists and is set to `/var/run/docker.sock`, the label `allow-docker` must equal `true`.'
        pattern:
          metadata:
            labels:
              allow-docker: 'true'
          (spec):
            (volumes):
              - (hostPath):
                  path: '/var/run/docker.sock'

```

--------------------------------

### Extracting Container Images with Flattened JMESPath

Source: https://kyverno.io/docs/policy-types/cluster-policy/jmespath

This example shows how to extract only the 'image' field from all containers after flattening the arrays using JMESPath. This results in a simple array of image names, making it easier to check for specific images.

```bash
$ kyverno jp query -i pod.yaml "spec.[initContainers, containers][].image"
[
  "redis",
  "busybox",
  "nginx"
]
```

--------------------------------

### Create Compliant Pod and Inspect PolicyReport

Source: https://kyverno.io/docs/guides/reports

This section demonstrates creating a Pod ('busybox') that complies with the 'secrets-not-from-env-vars' policy. It then uses `kubectl` commands to verify the Pod's creation and inspect the generated PolicyReport, which should show a 'PASS' status for the Pod.

```bash
$ kubectl run busybox --image busybox:1.28 -- sleep 9999
pod/busybox created


$ kubectl get po
NAME      READY   STATUS    RESTARTS   AGE
busybox   1/1     Running   0          66s


$ kubectl get polr -o wide
NAME                                   KIND         NAME                                         PASS   FAIL   WARN   ERROR   SKIP   AGE
89044d72-8a1e-4af0-877b-9be727dc3ec4   Pod          busybox                                      1      0      0      0       0      15s


$ kubectl get polr 89044d72-8a1e-4af0-877b-9be727dc3ec4 -o yaml


<snipped>
results:
- message: validation rule 'secrets-not-from-env-vars' passed.
  policy: secrets-not-from-env-vars
  result: pass
  rule: secrets-not-from-env-vars
  scored: true
  source: kyverno
  timestamp:
    nanos: 0
    seconds: 1666097147
summary:
  error: 0
  fail: 0
  pass: 1
  skip: 0
  warn: 0

```

--------------------------------

### Iterate Containers with patchesJson6902 in Kyverno

Source: https://kyverno.io/docs/policy-types/cluster-policy/mutate

This example demonstrates how to use the 'foreach' loop with 'patchesJson6902' to add a 'securityContext' to each container in a Pod. It utilizes the 'elementIndex' variable to specify the path for the patch.

```yaml
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: foreach-json-patch
spec:
  rules:
    - name: add-security-context
      match:
        any:
          - resources:
              kinds:
                - Pod
              operations:
                - CREATE
      mutate:
        foreach:
          - list: 'request.object.spec.containers'
            patchesJson6902: |-
              - path: /spec/containers/{{elementIndex}}/securityContext
                op: add
                value:
                  runAsNonRoot: true

```

--------------------------------

### Kubernetes Pod Representation Seen by Admission Controller

Source: https://kyverno.io/docs/guides/admission-controllers

An example of a Kubernetes Pod object as it might be seen by a dynamic admission controller. This includes fields added by the API server and its internal controllers, such as `creationTimestamp` and `managedFields`.

```yaml
apiVersion: v1
kind: Pod
metadata:
  creationTimestamp: '2024-02-11T00:53:09Z'
  managedFields:
    - apiVersion: v1
      fieldsType: FieldsV1
      fieldsV1:
        f:spec:
          f:containers:
            k:{"name":"busybox"}:
              .: {}
              f:args: {}
              f:image: {}
              f:imagePullPolicy: {}
              f:name: {}
              f:resources:
                .: {}
                f:limits:
                  .: {}
                  f:cpu: {}
                  f:memory: {}
                f:requests:
                  .: {}
                  f:cpu: {}
                  f:memory: {}
              f:terminationMessagePath: {}
              f:terminationMessagePolicy: {}
          f:dnsPolicy: {}
          f:enableServiceLinks: {}
          f:restartPolicy: {}
          f:schedulerName: {}
          f:securityContext: {}
          f:terminationGracePeriodSeconds: {}
      manager: kubectl-create
      operation: Update
      time: '2024-02-11T00:53:09Z'
  name: mypod
  namespace: default
  uid: 49fee716-d086-4806-9c87-9796f5d3f7aa
spec:
  containers:
    - args:
        - sleep
        - infinity
      image: busybox
      imagePullPolicy: Always
      name: busybox
      resources:
        limits:
          cpu: 100m
          memory: 64Mi
        requests:
          cpu: 100m
          memory: 64Mi
      terminationMessagePath: /dev/termination-log
      terminationMessagePolicy: File
      volumeMounts:
        - mountPath: /var/run/secrets/kubernetes.io/serviceaccount
          name: kube-api-access-kzw57
          readOnly: true
  dnsPolicy: ClusterFirst
  enableServiceLinks: true
  preemptionPolicy: PreemptLowerPriority
  priority: 0
  restartPolicy: Always
  schedulerName: default-scheduler
  securityContext: {}
  serviceAccount: default
  serviceAccountName: default
  terminationGracePeriodSeconds: 30
  tolerations:
    - effect: NoExecute
      key: node.kubernetes.io/not-ready
      operator: Exists
      tolerationSeconds: 300
    - effect: NoExecute
      key: node.kubernetes.io/unreachable
      operator: Exists
      tolerationSeconds: 300
  volumes:
    - name: kube-api-access-kzw57
      projected:
        defaultMode: 420
        sources:
          - serviceAccountToken:
              expirationSeconds: 3607
              path: token
          - configMap:
              items:
                - key: ca.crt
                  path: ca.crt
              name: kube-root-ca.crt
          - downwardAPI:
              items:
                - fieldRef:
                    apiVersion: v1
                    fieldPath: metadata.namespace
                  path: namespace
status:
  phase: Pending
  qosClass: Guaranteed

```

--------------------------------

### Kyverno anyPattern for Annotation Validation

Source: https://kyverno.io/docs/policy-types/cluster-policy/validate

This example shows how anyPattern can be used to check for the presence of specific annotations. It will pass if either annotation pattern is found. This is useful for enforcing or disallowing certain metadata. Note that this pattern is more difficult to reason about with negated conditions.

```yaml
validate:
  message: Cannot use Flux v1 annotation.
  anyPattern:
    - metadata:
        =(annotations):
          X(fluxcd.io/*): '*?'
    - metadata:
        =(annotations):
          X(flux.weave.works/*): '*?'

```

--------------------------------

### Deploy Kyverno Policies with Enforce Action (Helm)

Source: https://kyverno.io/docs/guides/tracing

Installs the 'kyverno-policies' Helm chart with the 'Baseline' profile of PSS. This command sets the validation failure action to 'Enforce', ensuring that policy violations block admission requests.

```bash
helm install kyverno-policies --namespace kyverno --create-namespace --wait \
  --repo https://kyverno.github.io/kyverno kyverno-policies \
  --values - <<EOF
validationFailureAction: Enforce
EOF

```

--------------------------------

### Reference Other Variables in Kyverno Context

Source: https://kyverno.io/docs/policy-types/cluster-policy/variables

This example demonstrates how context variables can reference each other. 'jpExpression' is defined first, and then 'objName' uses it in its JMESPath expression. This highlights the ordered nature of context variable definitions.

```yaml
context:
  - name: jpExpression
    variable:
      value: name
  - name: objName
    variable:
      value:
        name: '{{ request.object.metadata.name }}'
      jmesPath: '{{ jpExpression }}'
```

--------------------------------

### Match Any Resource Kind with Label Selector (YAML)

Source: https://kyverno.io/docs/policy-types/cluster-policy/match-exclude

This policy snippet demonstrates matching across all resource kinds ('*') and applying a validation rule based on the presence of a specific label ('app.kubernetes.io/name'). It uses a wildcard in the label value ('?*') to ensure the label exists. This approach should be used cautiously due to the potential performance impact.

```yaml
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: require-labels
spec:
  background: false
  rules:
    - name: check-for-labels
      match:
        any:
          - resources:
              kinds:
                - '*'
              operations:
                - CREATE
      validate:
        failureAction: Audit
        message: 'The label `app.kubernetes.io/name` is required.'
        pattern:
          metadata:
            labels:
              app.kubernetes.io/name: '?*'
```

--------------------------------

### Apply Policy with Exception and Generate Report

Source: https://kyverno.io/docs/subprojects/kyverno-cli

Applies a Kyverno policy, a resource manifest, and a PolicyException to exempt a specific resource from the policy. A report is generated detailing the outcome.

```yaml
apiVersion: policies.kyverno.io/v1alpha1
kind: ValidatingPolicy
metadata:
  name: disallow-host-path
spec:
  matchConstraints:
    resourceRules:
      - apiGroups: ['']
        apiVersions: ['v1']
        operations: ['CREATE', 'UPDATE']
        resources: ['pods']
  validations:
    - expression: '!has(object.spec.volumes) || object.spec.volumes.all(volume, !has(volume.hostPath))'
      message: 'HostPath volumes are forbidden. The field spec.volumes[*].hostPath must be unset.'

```

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-with-hostpath
spec:
  containers:
    - name: nginx
      image: nginx
  volumes:
    - name: udev
      hostPath:
        path: /etc/udev

```

```yaml
apiVersion: policies.kyverno.io/v1alpha1
kind: PolicyException
metadata:
  name: exempt-hostpath-pod
spec:
  policyRefs:
    - name: disallow-host-path
      kind: ValidatingPolicy
  matchConditions:
    - name: 'skip-pod-by-name'
      expression: "object.metadata.name == 'pod-with-hostpath'"

```

```bash
kyverno apply policy.yaml --resource resource.yaml --exception exception.yaml -p

```

```yaml
apiVersion: openreports.io/v1alpha1
kind: ClusterReport
metadata:
  creationTimestamp: null
  name: merged
results:

```

--------------------------------

### Pod Definition with Istio Init Container (YAML)

Source: https://kyverno.io/docs/guides/exceptions

A Kubernetes Pod definition that includes an Istio init container. This example demonstrates the typical configuration for Istio sidecar injection, including necessary capabilities for the init container.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: istio-pod
spec:
  initContainers:
    - name: istio-init
      image: docker.io/istio/proxyv2:1.20.2
      args:
        - istio-iptables
        - -p
        - '15001'
        - -z
        - '15006'
        - -u
        - '1337'
        - -m
        - REDIRECT
        - -i
        - '*'
        - -x
        - ''
        - -b
        - '*'
        - -d
        - 15090,15021,15020
        - --log_output_level=default:info
      securityContext:
        allowPrivilegeEscalation: false
        capabilities:
          add:
            - NET_ADMIN
            - NET_RAW
          drop:
            - ALL
        privileged: false
        readOnlyRootFilesystem: false
        runAsGroup: 0
        runAsNonRoot: false
        runAsUser: 0
  containers:
    - name: busybox
      image: busybox:1.35
      args:
        - sleep
        - infinity
```

--------------------------------

### JMESPath Variable Example in Kyverno

Source: https://kyverno.io/docs/policy-types/cluster-policy/variables

Demonstrates how to use JMESPath to reference nested variables within a Kyverno policy. For plain JMESPath variables, double curly brackets are not needed, but for nested variables, they are required.

```yaml
- name: mountpath
  variable:
    jmesPath: request.object.metadata.annotations.optional || '/custom/string/{{request.object.metadata.annotations.mandatory}}'
```

--------------------------------

### Kyverno Policy Definition

Source: https://kyverno.io/docs/policy-types/cluster-policy/validate

An example of a Kyverno ClusterPolicy that disallows the use of HostPath volumes in deployments.

```yaml
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: disallow-host-path
spec:
  background: false
  rules:
    - name: host-path
      match:
        any:
          - resources:
              kinds:
                - Deployment
              operations:
                - CREATE
                - UPDATE
      validate:
        failureAction: Audit
        cel:
          expressions:
            - expression: '!has(object.spec.template.spec.volumes) || object.spec.template.spec.volumes.all(volume, !has(volume.hostPath))'
              message: 'HostPath volumes are forbidden. The field spec.template.spec.volumes[*].hostPath must be unset.'

```

--------------------------------

### ClusterCleanupPolicy with Foreground Deletion Propagation

Source: https://kyverno.io/docs/policy-types/cleanup-policy

An example of a `ClusterCleanupPolicy` that targets Deployments with specific labels and replica counts. It utilizes the `deletionPropagationPolicy: Foreground` to ensure dependent resources are deleted before the primary Deployment.

```yaml
apiVersion: kyverno.io/v2
kind: ClusterCleanupPolicy
metadata:
  name: cleandeploy
spec:
  match:
    any:
      - resources:
          kinds:
            - Deployment
          selector:
            matchLabels:
              canremove: 'true'
  conditions:
    any:
      - key: '{{ target.spec.replicas }}'
        operator: LessThan
        value: 2
  schedule: '*/5 * * * *'
  # use Foreground deletion propagation policy
  deletionPropagationPolicy: Foreground

```

--------------------------------

### Fetching Resources with Query Parameters

Source: https://kyverno.io/docs/policy-types/cluster-policy/external-data-sources

Demonstrates how to fetch resources using the `urlPath` field, allowing for query parameters like `labelSelector` and `limit`. This approach offloads processing to the Kubernetes API server.

```APIDOC
## GET /api/v1/namespaces/{namespace}/services

### Description
Fetches a collection of services within a specified namespace, with support for filtering by label selectors and limiting the number of results.

### Method
GET

### Endpoint
`/api/v1/namespaces/{{ request.namespace }}/services`

### Query Parameters
- **labelSelector** (string) - Optional - A label selector to filter services (e.g., `foo=bar`).
- **limit** (integer) - Optional - The maximum number of services to return.

### Request Example
```json
{
  "urlPath": "/api/v1/namespaces/{{ request.namespace }}/services?labelSelector=foo=bar?limit=5"
}
```

### Response
#### Success Response (200)
- **items** (array) - A list of Service objects matching the query.

#### Response Example
```json
{
  "kind": "ServiceList",
  "apiVersion": "v1",
  "metadata": {
    "resourceVersion": "167567"
  },
  "items": [
    // ... list of services matching the criteria
  ]
}
```
```

--------------------------------

### Example Pod Rejected by Baseline PSA with Nginx Capabilities Exemption (BAZ)

Source: https://kyverno.io/docs/policy-types/cluster-policy/validate

This Nginx Pod is rejected because it adds the 'BAZ' capability, which does not match the exempted values ('FOO', 'BAR') for nginx images in the policy.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx
spec:
  containers:
    - name: nginx
      image: nginx:latest
      securityContext:
        capabilities:
          add:
            - BAZ

```

--------------------------------

### Kyverno Policy: Count Pods using Kubernetes API GET Call

Source: https://kyverno.io/docs/policy-types/cluster-policy/external-data-sources

This Kyverno policy snippet shows how to define a context variable `podCount` by making a GET request to the Kubernetes API to retrieve Pods in the request's namespace. It then applies a JMESPath query to count the items and stores the result in the context.

```yaml
rules:
  - name: example-api-call
    context:
      - name: podCount
        apiCall:
          urlPath: '/api/v1/namespaces/{{request.namespace}}/pods'
          jmesPath: 'items | length(@)'
```

--------------------------------

### Create Staging Namespace and Label

Source: https://kyverno.io/docs/guides/reports

These commands create a new Kubernetes namespace named 'staging' and apply the label 'environment=staging' to it. This is a prerequisite for the ValidatingAdmissionPolicyBinding to take effect in this namespace.

```bash
kubectl create ns staging
kubectl label ns staging environment=staging

```

--------------------------------

### Add Default Resource Requests with Multiple Anchors in Kyverno

Source: https://kyverno.io/docs/policy-types/cluster-policy/mutate

This example illustrates using 'foreach' with 'patchStrategicMerge' and multiple anchors to add default resource requests to containers within a Pod if they are not specified. It shows how to combine conditional logic within a loop.

```yaml
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: add-default-resources
spec:
  rules:
    - name: add-default-requests
      match:
        any:
          - resources:
              kinds:
                - Pod
      preconditions:
        any:
          - key: "{{request.operation || 'BACKGROUND'}}"

```

--------------------------------

### Pod Rejection Example for seccompProfile Type

Source: https://kyverno.io/docs/policy-types/cluster-policy/validate

This YAML defines a Pod that would be rejected by a policy enforcing seccompProfile.type to be 'Unconfined'. It demonstrates a common scenario where a security context setting deviates from the expected value, leading to admission rejection.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx
spec:
  securityContext:
    seccompProfile:
      type: Unknown
  containers:
    - name: nginx
      image: nginx:latest
      securityContext:
        seccompProfile:
          type: Unconfined

```

--------------------------------

### Kyverno CLI Command for Testing Policies

Source: https://kyverno.io/docs/subprojects/kyverno-cli

This command executes Kyverno tests defined in the current directory. It loads policies, resources, and applies them, then checks the results, providing a summary of passed and failed tests.

```bash
$ kyverno test .

Loading test  ( kyverno-test.yaml ) ...
  Loading values/variables ...
  Loading policies ...
  Loading resources ...
  Applying 1 policy to 2 resources ...
  Checking results ...


│────│────────────────────│──────│────────────────────────────│────────│────────│
│ ID │ POLICY             │ RULE │ RESOURCE                   │ RESULT │ REASON │
│────│────────────────────│──────│────────────────────────────│────────│────────│
│  1 │ disallow-host-path │      │ Deployment/deployment-pass │ Pass   │ Ok     │
│  2 │ disallow-host-path │      │ Deployment/deployment-fail │ Pass   │ Ok     │
│────│────────────────────│──────│────────────────────────────│────────│────────│


Test Summary: 2 tests passed and 0 tests failed

```

--------------------------------

### Example Pod Allowed by Baseline PSA with Multiple Seccomp Exclusions

Source: https://kyverno.io/docs/policy-types/cluster-policy/validate

This Pod is allowed because its seccomp profile type ('Unconfined') matches one of the excluded values in the policy for both pod-level and container-level Seccomp controls.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx
spec:
  securityContext:
    seccompProfile:
      type: Unconfined
  containers:
    - name: nginx
      image: nginx:latest
      securityContext:
        seccompProfile:
          type: Unconfined

```

--------------------------------

### ClusterPolicy Structure Example

Source: https://kyverno.io/docs/guides/migration-to-cel

Demonstrates the structure of a Kyverno ClusterPolicy, including metadata and rules for validation. It specifies the kind as ClusterPolicy and defines a rule to check for required labels on Pod resources.

```yaml
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: require-labels
spec:
  validationFailureAction: Enforce
  rules:
    - name: check-labels
      match:
        any:
          - resources:
              kinds:
                - Pod
      validate:
        message: 'Required labels missing'
        pattern:
          metadata:
            labels:
              app: '?*'
              version: '?*'

```

--------------------------------

### Normalized Image Data for Official Docker Hub Images

Source: https://kyverno.io/docs/policy-types/cluster-policy/external-data-sources

This example demonstrates the normalized `imageData` structure for an official Docker Hub image like 'python:slim'. It highlights how Kyverno prefixes the repository with 'library/' and sets the registry to 'index.docker.io' for official images.

```json
{
  "image": "docker.io/python:slim",
  "resolvedImage": "index.docker.io/library/python@sha256:43705a7d3a22c5b954ed4bd8db073698522128cf2aaec07690a34aab59c65066",
  "registry": "index.docker.io",
  "repository": "library/python",
  "identifier": "slim"
}
```

--------------------------------

### Example Deployment Manifest to Test Policy

Source: https://kyverno.io/docs/policy-types/cluster-policy/external-data-sources

This Deployment manifest includes a 'role' annotation with a value ('super-user') that is not present in the allowed roles list defined in the ConfigMap. Creating this Deployment will trigger the Kyverno policy and result in a denial.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: busybox
  annotations:
    role: super-user
  labels:
    app: busybox
spec:
  replicas: 1
  selector:
    matchLabels:
      app: busybox
  template:
    metadata:
      labels:
        app: busybox
    spec:
      containers:
        - image: busybox:1.28
          name: busybox
          command: ['sleep', '9999']
```

--------------------------------

### Extract and Trim Image URL with JMESPath

Source: https://kyverno.io/docs/policy-types/cluster-policy/verify-images/sigstore

This example demonstrates how to use Kyverno's `imageExtractors` with a `jmesPath` filter to extract and clean an image URL from a KubeVirt DataVolume custom resource. The `trim_prefix()` filter removes the 'docker://' prefix, preparing the URL for verification.

```yaml
imageExtractors:
  DataVolume:
    - path: /spec/source/registry/url
      jmesPath: "trim_prefix(@, 'docker://')"

```

--------------------------------

### Kyverno Client Queries

Source: https://kyverno.io/docs/reference/metrics

This section describes the `kyverno_client_queries_total` metric, which tracks the total number of queries made by Kyverno to the Kubernetes API server. It includes details on metric value, labels, use cases, and example queries.

```APIDOC
## Kyverno Client Queries

### Description
Metrics tracking the total number of queries made by Kyverno to the Kubernetes API server.

### Metric Name(s)
* `kyverno_client_queries_total`

### Metric Value
Counter - An only-increasing integer representing the total number of policy-level changes associated with a metric sample.

### Metric Labels
| Label | Allowed Values | Description |
|---|---|---|
| client_type | dynamic, kubeclient, kyverno, policyreport | Client type |
| operation | create, get, list, update, update_status, delete, delete_collection, watch, patch | Operation performed |
| resource_kind | | Resource kind |
| resource_namespace | | Resource Namespace |

### Use Cases
* The cluster admin wants to track how many queries per second Kyverno is making to the Kubernetes API server.

### Useful Queries
* `kyverno_client_queries_total`
* `rate(kyverno_client_queries_total{client_type="dynamic"}[5m])`
* `increase(kyverno_client_queries_total{client_type="dynamic"}[5m])`
```

--------------------------------

### Apply Kyverno Policy to ConfigMaps using CLI

Source: https://kyverno.io/docs/subprojects/kyverno-cli

Command to apply the defined Kyverno policy and its binding to the specified ConfigMap resources, using a values file to provide namespace context. This command triggers the admission control process.

```bash
kyverno apply /path/to/add-label-to-configmap.yaml --resource /path/to/configmaps.yaml -f /path/to/values.yaml

```

--------------------------------

### Kyverno Policy Exception

Source: https://kyverno.io/docs/policy-types/cluster-policy/validate

An example of a Kyverno PolicyException that exempts specific resources from a policy's enforcement. This exception is considered during the generation of the ValidatingAdmissionPolicy.

```yaml
apiVersion: kyverno.io/v2
kind: PolicyException
metadata:
  name: policy-exception
spec:
  exceptions:
    - policyName: disallow-host-path
      ruleNames:
        - host-path
  match:
    any:
      - resources:
          kinds:
            - Deployment
          names:
            - important-tool
          operations:
            - CREATE
            - UPDATE

```

--------------------------------

### Kyverno Global Variables in Values File

Source: https://kyverno.io/docs/subprojects/kyverno-cli

Demonstrates how to specify global variable values in a Kyverno values file. This avoids repetition by applying the same variable value across multiple rules or resources.

```yaml
apiVersion: cli.kyverno.io/v1alpha1
kind: Values
metadata:
  name: values
globalValues:
  request.operation: UPDATE

```

--------------------------------

### Enable Kyverno Metrics Services via Helm

Source: https://kyverno.io/docs/guides/monitoring

This configuration enables the metrics services for various Kyverno controllers when installed via Helm. It ensures that metrics are exposed on port 8000, allowing for cluster observability.

```yaml
admissionController:
  metricsService:
    create: true
  # ...

backgroundController:
  metricsService:
    create: true
  # ...

cleanupController:
  metricsService:
    create: true
  # ...

reportsController:
  metricsService:
    create: true
  # ...
```

--------------------------------

### Kubectl: Get Pod Annotations

Source: https://kyverno.io/docs/policy-types/cluster-policy/variables

This command retrieves the annotations of the 'busybox' Pod in JSON format. It is used to verify that the 'created-by' annotation has been successfully applied by the Kyverno policy, showing the username of the request submitter.

```bash
kubectl get po busybox -o jsonpath='{.metadata.annotations}'

```

--------------------------------

### Apply ServiceMonitor Resource

Source: https://kyverno.io/docs/guides/monitoring

Applies the created ServiceMonitor YAML file to the Kubernetes cluster. This makes the ServiceMonitor active and allows Prometheus to start scraping metrics.

```shell
kubectl apply -f service-monitor.yaml
```

--------------------------------

### Kyverno Policy Report Structure Example

Source: https://kyverno.io/docs/guides/reports

Illustrates the structure of a Kyverno policy report, highlighting the 'results' array which contains details about policy evaluations against resources. It also shows summary statistics for different result types.

```yaml
scope:
  apiVersion: v1
  kind: Pod
  name: kube-apiserver-kind-control-plane
  namespace: kube-system
  uid: 487df031-11d8-4ab4-b089-dfc0db1e533e
summary:
  error: 0
  fail: 2
  pass: 10
  skip: 0
  warn: 0
```

--------------------------------

### Kyverno JMESPath Query for Bucket Tags

Source: https://kyverno.io/docs/policy-types/cluster-policy/jmespath

This command demonstrates how to query the final `spec.forProvider.tagging.tagSet` array of an AWS S3 Bucket resource after a Kyverno policy has been applied. It uses `kubectl` to get the bucket in JSON format and pipes it to `kyverno jp query` to extract the specified field, showing the merged tags.

```bash
$ kubectl get bucket lambda-bucket -o json | kyverno jp query "spec.forProvider.tagging.tagSet[]"

```

--------------------------------

### Kyverno: Generate NetworkPolicy to Deny All Traffic

Source: https://kyverno.io/docs/policy-types/cluster-policy/generate

This Kyverno ClusterPolicy example uses `generate.data` to create a NetworkPolicy that denies all inbound and outbound traffic for new Namespaces. The `spec` of the NetworkPolicy is defined within the `data` object, allowing for templating. This policy targets all Namespaces except system ones.

```yaml
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: default
spec:
  rules:
    - name: deny-all-traffic
      match:
        any:
          - resources:
              kinds:
                - Namespace
      exclude:
        any:
          - resources:
              namespaces:
                - kube-system
                - default
                - kube-public
                - kyverno
      generate:
        kind: NetworkPolicy
        apiVersion: networking.k8s.io/v1
        name: deny-all-traffic
        namespace: '{{request.object.metadata.name}}'
        data:
          spec:
            # select all pods in the namespace
            podSelector: {}
            policyTypes:
              - Ingress
              - Egress
```

--------------------------------

### Delete Kyverno Policy (kubectl)

Source: https://kyverno.io/docs/introduction/quick-start

Removes the 'sync-secrets' GeneratingPolicy from the Kubernetes cluster. This is a cleanup step to revert the changes made during the policy demonstration.

```bash
kubectl delete generatingpolicy sync-secrets
```

--------------------------------

### Prepend Registry to Container Image with patchStrategicMerge in Kyverno

Source: https://kyverno.io/docs/policy-types/cluster-policy/mutate

This example shows how to use 'foreach' with 'patchStrategicMerge' to prepend a registry address to the image name for each container in a Pod. It references container names and image details using the 'element' variable.

```yaml
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: prepend-registry
spec:
  background: false
  rules:
    - name: prepend-registry-containers
      match:
        any:
          - resources:
              kinds:
                - Pod
              operations:
                - CREATE
                - UPDATE
      mutate:
        foreach:
          - list: 'request.object.spec.containers'
            patchStrategicMerge:
              spec:
                containers:
                  - name: '{{ element.name }}'
                    image: registry.io/{{ images.containers."{{element.name}}".name}}:{{images.containers."{{element.name}}".tag}}

```

--------------------------------

### Delete the Kyverno MutatingPolicy

Source: https://kyverno.io/docs/introduction/quick-start

This command deletes the 'add-labels' MutatingPolicy that was created earlier. This is a cleanup step to remove the policy from the Kubernetes cluster after testing.

```bash
kubectl delete mutatingpolicy add-labels

```

--------------------------------

### Correct Kyverno Usage: Static Values in Resource Kinds

Source: https://kyverno.io/docs/policy-types/cluster-policy/verify-images/overview

Illustrates the correct way to define resource kinds in a Kyverno policy using static values. The 'match.resources.kinds' field should list predefined resource types such as 'Deployment' or 'StatefulSet' instead of using variable interpolation.

```yaml
rules:
  - name: restrict-deployment-kinds
    match:
      resources:
        kinds:
          - Deployment
          - StatefulSet
```

--------------------------------

### Generate Self-Signed CA and Leaf Certificates with step CLI

Source: https://kyverno.io/docs/installation/customization

This snippet demonstrates how to generate a self-signed root CA and then use it to sign leaf certificates for Kyverno services. It includes commands for creating the CA, generating service certificates with specified Subject Alternative Names (SANs) and expiration, and inspecting the generated certificates. Ensure the 'step' CLI is installed.

```bash
step certificate create kyverno-ca rootCA.crt rootCA.key --profile root-ca --insecure --no-password --kty=RSA

step certificate create kyverno-svc tls.crt tls.key --profile leaf \
            --ca rootCA.crt --ca-key rootCA.key \
            --san kyverno-svc --san kyverno-svc.kyverno --san kyverno-svc.kyverno.svc --not-after 43200h \
            --insecure --no-password --kty=RSA


step certificate create kyverno-cleanup-controller cleanup-tls.crt cleanup-tls.key --profile leaf \
            --ca rootCA.crt --ca-key rootCA.key \
            --san kyverno-cleanup-controller --san kyverno-cleanup-controller.kyverno --san kyverno-cleanup-controller.kyverno.svc --not-after 43200h \
            --insecure --no-password --kty=RSA

step certificate inspect tls.crt --short
```

--------------------------------

### Generating Policy Execution Latency

Source: https://kyverno.io/docs/reference/metrics

Metrics for tracking the execution latency of generating policies in Kyverno. Includes metric names, value descriptions, available labels, use cases, and example Prometheus queries.

```APIDOC
## Generating Policy Execution Latency

### Description
Metrics for tracking the execution latency of generating policies in Kyverno. These metrics help in understanding the performance and efficiency of policy generation.

### Metric Names
- `kyverno_generating_policy_execution_duration_seconds_count`
- `kyverno_generating_policy_execution_duration_seconds_sum`
- `kyverno_generating_policy_execution_duration_seconds_bucket`

### Metric Value
Histogram - A float value representing the latency of the generating policy’s execution in seconds. Refer to Prometheus documentation for a detailed explanation of histograms.

### Metric Labels
| Label | Allowed Values | Description |
|---|---|---|
| `policy_background_mode` | "true", "false" | Policy’s set background mode |
| `policy_name` | | Name of the policy |
| `resource_kind` | "Pod", "Deployment", "StatefulSet", "ReplicaSet", etc. | Kind of this resource |
| `resource_namespace` | | Namespace in which this resource lives |
| `resource_request_operation` | "create", "update", "delete" | If the requested resource is being created, updated, or deleted. |
| `execution_cause` | "admission_request", "background_scan" | Identifies whether the policy is executing in response to an admission request or a periodic background scan. |
| `result` | "PASS", "FAIL" | Result of the policy’s execution |

### Use Cases
- Track the average latencies associated with Kyverno policies’ execution over the last 24 hours to understand efficiency.
- Identify policies causing the highest latency in a specific cluster policy.

### Useful Queries
- Tracking the average latency associated with the execution of generating policies:
`avg(kyverno_generating_policy_execution_duration_seconds{})`
```

--------------------------------

### Convert String to Uppercase with to_upper Filter (YAML)

Source: https://kyverno.io/docs/policy-types/cluster-policy/jmespath

The `to_upper()` filter converts an input string to all upper-case letters. This example demonstrates its use for setting a label value in a Kubernetes Service.

```yaml
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: to-upper-demo
spec:
  rules:
    - name: format-deploy-zone
      match:
        any:
          - resources:
              kinds:
                - Service
      mutate:
        patchStrategicMerge:
          metadata:
            labels:
              deployzone: "{{ to_upper('{{@}}') }}"

```

--------------------------------

### Configure MutatingPolicy for Auto-generation of Policies

Source: https://kyverno.io/docs/policy-types/mutating-policy

This example demonstrates the `spec.autogen` field in a MutatingPolicy. It enables the auto-generation of policies for specified pod controllers (deployments, jobs, cronjobs, statefulsets) and the generation of `MutatingAdmissionPolicy` types for Kubernetes API server execution.

```yaml
apiVersion: policies.kyverno.io/v1
kind: MutatingPolicy
metadata:
  name: add-default-labels
spec:
  autogen:
    mutatingAdmissionPolicy:
      enabled: true
    podControllers:
      controllers:
        - deployments
        - jobs
        - cronjobs
        - statefulsets
```

--------------------------------

### Example Image Configuration JSON

Source: https://kyverno.io/docs/policy-types/cluster-policy/external-data-sources

This JSON output represents the configuration data of a container image obtained using `crane config`. It includes details about the image's architecture, creation history, operating system, and runtime configuration such as the entrypoint and user.

```json
{
  "architecture": "amd64",
  "author": "github.com/ko-build/ko",
  "created": "2023-01-08T00:10:08Z",
  "history": [
    {
      "author": "apko",
      "created": "2023-01-08T00:10:08Z",
      "created_by": "apko",
      "comment": "This is an apko single-layer image"
    },
    {
      "author": "ko",
      "created": "0001-01-01T00:00:00Z",
      "created_by": "ko build ko://github.com/kyverno/kyverno/cmd/kyverno",
      "comment": "kodata contents, at $KO_DATA_PATH"
    },
    {
      "author": "ko",
      "created": "0001-01-01T00:00:00Z",
      "created_by": "ko build ko://github.com/kyverno/kyverno/cmd/kyverno",
      "comment": "go build output, at /ko-app/kyverno"
    }
  ],
  "os": "linux",
  "rootfs": {
    "type": "layers",
    "diff_ids": [
      "sha256:c9770b71bc04d50fb006eaacea8180b5f7c0fc72d16618590ec5231f9cec2525",
      "sha256:ffe56a1c5f3878e9b5f803842adb9e2ce81584b6bd027e8599582aefe14a975b",
      "sha256:de3816af2ab66f6b306277c83a7cc9af74e5b0e235021a37f2fc916882751819"
    ]
  },
  "config": {
    "Entrypoint": ["/ko-app/kyverno"],
    "Env": [
      "PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/ko-app",
      "SSL_CERT_FILE=/etc/ssl/certs/ca-certificates.crt",
      "KO_DATA_PATH=/var/run/ko"
    ],
    "User": "65532"
  }
}
```

--------------------------------

### Define a Kyverno MutatingPolicy to Add Labels

Source: https://kyverno.io/docs/policy-types/mutating-policy

This example demonstrates how to define a Kyverno MutatingPolicy to automatically add a label 'foo: "bar"' to pods during creation. It utilizes the `spec.mutations.applyConfiguration` field for declarative configuration.

```yaml
apiVersion: policies.kyverno.io/v1
kind: MutatingPolicy
metadata:
  name: add-label
spec:
  matchConstraints:
    resourceRules:
      - apiGroups: ['']
        apiVersions: ['v1']
        operations: ['CREATE']
        resources: ['pods']
  mutations:
    - patchType: ApplyConfiguration
      applyConfiguration:
        expression: >
          Object{
            metadata: Object.metadata{
              labels: Object.metadata.labels{
                foo: "bar"
              }
            }
          }
```

--------------------------------

### Handling Special Characters in Container Names

Source: https://kyverno.io/docs/policy-types/cluster-policy/variables

This example shows how to correctly reference image properties when container names contain special characters like hyphens. It utilizes double quotes with double escape characters for JMESPath processing.

```kyverno
{{images.containers."my-container".tag}}
```

--------------------------------

### Kyverno CLI Test Command Usage

Source: https://kyverno.io/docs/subprojects/kyverno-cli

This snippet demonstrates the basic usage of the Kyverno CLI 'test' command. It scans a specified location (Git repository or local folder) for policy test declarations in 'kyverno-test.yaml' files and executes them. The command supports 'validate', 'mutate', and 'generate' rule types and can recursively search directories. Use the '-h' flag for detailed help.

```bash
kyverno test <path> [--detailed-results]
kyverno test -h
```

--------------------------------

### Example OpenReports Output for Policy Violation

Source: https://kyverno.io/docs/guides/reports

This YAML output demonstrates how Kyverno reports a policy violation using the openreports.io/v1alpha1 API. It details the failed policy, the resource, and the specific validation error message.

```yaml
apiVersion: v1
items:
  - apiVersion: openreports.io/v1alpha1
    kind: Report
    metadata:
      labels:
        app.kubernetes.io/managed-by: kyverno
      name: 7d23ea02-1526-4a4f-ba14-49665adf55e
    results:
      - message: "validation error: Pods must have an 'app' label. rule check-app-label failed at path /metadata/labels/app/"
        policy: default/require-app-label
        properties:
          process: background scan
        result: fail
        rule: check-app-label
        scored: true
        source: kyverno
        timestamp:
          nanos: 0
          seconds: 1849050397
    scope:
      apiVersion: v1
      kind: Pod
      name: example-deployment-c94dc9f47-dfq6l
      namespace: default
      uid: dcd32da4-8539-4636-bba5-fd2cc3a6aaff
    summary:
      error: 0
      fail: 1
      pass: 0
      skip: 0
      warn: 0
kind: List
metadata: {}

```

--------------------------------

### Generate Kyverno Completion Script for Fish

Source: https://kyverno.io/docs/kyverno-cli/reference/kyverno_completion

Generates the autocompletion script for kyverno for the fish shell. This script enables tab completion for kyverno commands, subcommands, flags, and arguments. It is typically installed in the fish completions directory.

```fish
# Generate and install fish completionkyverno completion fish > ~/.config/fish/completions/kyverno.fish
```

--------------------------------

### Configure ValidatingPolicy Autogeneration

Source: https://kyverno.io/docs/policy-types/validating-policy

This example shows how to configure `spec.autogen` in a ValidatingPolicy to enable automatic generation of policies for pod controllers (deployments, jobs, cronjobs, statefulsets) and to generate Kubernetes `ValidatingAdmissionPolicy` types for API server execution.

```yaml
apiVersion: policies.kyverno.io/v1
kind: ValidatingPolicy
metadata:
  name: disallow-capabilities
spec:
  autogen:
    validatingAdmissionPolicy:
      enabled: true
    podControllers:
      controllers:
        - deployments
        - jobs
        - cronjobs
        - statefulsets

```

--------------------------------

### Apply Policy with Local Context and Generate Report

Source: https://kyverno.io/docs/subprojects/kyverno-cli

Applies a Kyverno policy to resources using a local context file for mock ConfigMaps and generates a policy report. This is useful when the CLI cannot directly access cluster resources like ConfigMaps.

```yaml
apiVersion: cli.kyverno.io/v1alpha1
kind: Context
metadata:
  name: context
spec:
  # The resources defined here will be available to functions like resource.Get()
  resources:
    - apiVersion: v1
      kind: ConfigMap
      metadata:
        namespace: default
        name: policy-cm
      data:
        # According to this, the valid pod name is 'good-pod'.
        name: good-pod

```

```bash
kyverno apply /path/to/policy.yaml --resource /path/to/pods.yaml --context-file /path/to/context.yaml -p

```

```yaml
apiVersion: openreports.io/v1alpha1
kind: ClusterReport
metadata:
  creationTimestamp: null
  name: merged
results:
  - message: success
    policy: check-pod-name-from-configmap
    properties:
      process: background scan
    resources:
      - apiVersion: v1
        kind: Pod
        name: good-pod
        namespace: default
    result: pass
    scored: true
    source: KyvernoValidatingPolicy
    timestamp:
      nanos: 0
      seconds: 1752756617
  - policy: check-pod-name-from-configmap
    properties:
      process: background scan
    resources:
      - apiVersion: v1
        kind: Pod
        name: bad-pod
        namespace: default
    result: fail
    scored: true
    source: KyvernoValidatingPolicy
    timestamp:
      nanos: 0
      seconds: 1752756617
source: ''
summary:
  error: 0
  fail: 1
  pass: 1
  skip: 0
  warn: 0

```

--------------------------------

### Configure ValidatingPolicy Evaluation Settings

Source: https://kyverno.io/docs/policy-types/validating-policy

This example demonstrates how to configure the `spec.evaluation` field in a ValidatingPolicy to control admission and background processing, as well as the payload processing mode. The `mode` can be set to 'JSON' for non-Kubernetes payloads.

```yaml
apiVersion: policies.kyverno.io/v1
kind: ValidatingPolicy
metadata:
  name: sample
spec:
  evaluation:
    admission:
      enabled: false
    background:
      enabled: true
    mode: Kubernetes
  # ...

```

--------------------------------

### Generate Kyverno Completion Script for Bash

Source: https://kyverno.io/docs/kyverno-cli/reference/kyverno_completion

Generates the autocompletion script for kyverno for the bash shell. This script enables tab completion for kyverno commands, subcommands, flags, and arguments. It can be installed system-wide or sourced for the current session.

```bash
# Generate and install bash completion (Linux)kyverno completion bash > /etc/bash_completion.d/kyverno

# Generate and source bash completion for current session
source <(kyverno completion bash)
```

--------------------------------

### Kyverno CLI: Executing Policy Tests

Source: https://kyverno.io/docs/subprojects/kyverno-cli

This is a command-line execution of the Kyverno CLI to test policies against resources. It loads the specified test manifests and reports the results, indicating whether policies were applied successfully.

```bash
$ kyverno test .

```

--------------------------------

### Policy with Custom HTTP Headers for API Calls (YAML)

Source: https://kyverno.io/docs/policy-types/cluster-policy/external-data-sources

This example policy demonstrates how to configure custom HTTP headers, such as 'UserAgent' and 'Authorization', when making API calls to an external service.

```yaml
context:
  - name: result
    apiCall:
      method: POST
      data:
        - key: foo
          value: bar
        - key: namespace
          value: '{{ `{{ request.namespace }}` }}'
      service:
        url: http://my-service.svc.cluster.local/validation
        headers:
          - key: 'UserAgent'
            value: 'Kyverno Policy XYZ'
          - key: 'Authorization'
            value: 'Bearer {{ MY_SECRET }}'

```

--------------------------------

### Uninstall Kyverno using YAML Manifest

Source: https://kyverno.io/docs/installation/uninstallation

This command uninstalls Kyverno by deleting the resources defined in the specified YAML manifest. Ensure you use the correct version tag corresponding to your installation. After execution, verify that all webhooks have been removed.

```bash
kubectl delete -f https://github.com/kyverno/kyverno/releases/download/v1.12.0/install.yaml
```

--------------------------------

### Kyverno CLI Global Options

Source: https://kyverno.io/docs/kyverno-cli/reference/kyverno_jp_query

Inherited global options for Kyverno CLI commands, controlling logging behavior and Kubernetes configuration.

```bash
# Options inherited from parent commands
--add_dir_header                   If true, adds the file directory to the header of the log messages
--alsologtostderr                  log to standard error as well as files (no effect when -logtostderr=true)
--kubeconfig string                Paths to a kubeconfig. Only required if out-of-cluster.
--log_backtrace_at traceLocation   when logging hits line file:N, emit a stack trace (default :0)
--log_dir string                   If non-empty, write log files in this directory (no effect when -logtostderr=true)
--log_file string                  If non-empty, use this log file (no effect when -logtostderr=true)
--log_file_max_size uint           Defines the maximum size a log file can grow to (no effect when -logtostderr=true). Unit is megabytes. If the value is 0, the maximum file size is unlimited. (default 1800)
--logtostderr                      log to standard error instead of files (default true)
--one_output                       If true, only write logs to their native severity level (vs also writing to each lower severity level; no effect when -logtostderr=true)
--skip_headers                     If true, avoid header prefixes in the log messages
--skip_log_headers                 If true, avoid headers when opening log files (no effect when -logtostderr=true)
--stderrthreshold severity         logs at or above this threshold go to stderr when writing to files and stderr (no effect when -logtostderr=true or -alsologtostderr=true) (default 2)
-v, --v Level                          number for the log level verbosity
--vmodule moduleSpec               comma-separated list of pattern=N settings for file-filtered logging
```

--------------------------------

### Escaping Kyverno Variables for Helm

Source: https://kyverno.io/docs/policy-types/cluster-policy/variables

Illustrates how to escape Kyverno variables when deploying policies using Helm. This prevents Helm from interpreting Kyverno's templating syntax. The examples show escaping for simple variables and JMESPath expressions.

```go template
{{`{{ request.userInfo.username }}`}}

```

```go template
value: {{ `"{{ element.securityContext.capabilities.drop[].to_upper(@) || `}}`[]`{{` }}" ` }}

```

--------------------------------

### Kubernetes Deployment in 'staging' Namespace (YAML)

Source: https://kyverno.io/docs/subprojects/kyverno-cli

This YAML defines a Kubernetes Deployment named 'good-deployment' in the 'staging' namespace. It is expected to pass Kyverno policy checks because the namespace matches a common policy condition. This example requires a running Kubernetes cluster and kubectl configured to interact with it.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: good-deployment
  namespace: staging
  labels:
    app: nginx
spec:
  replicas: 1
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
        - name: nginx
          image: nginx:latest
```

--------------------------------

### Kyverno JP CLI Help Option

Source: https://kyverno.io/docs/kyverno-cli/reference/kyverno_jp

Displays the help information for the kyverno jp command. This includes available flags and a brief description of the command's purpose.

```bash
kyverno jp --help
```

--------------------------------

### Apply Policy to NodePort Services with CEL Precondition

Source: https://kyverno.io/docs/policy-types/cluster-policy/validate

This example demonstrates how to use CEL preconditions to filter Kubernetes Services. It ensures that only Services of type NodePort are processed, and then further validates that their externalTrafficPolicy is set to 'Local'. This requires the Kyverno policy to be applied to resources that can be validated by CEL expressions.

```yaml
rules:
  - name: validate-nodeport-trafficpolicy
    match:
      any:
        - resources:
            kinds:
              - Service
    celPreconditions:
      - name: check-service-type
        expression: "object.spec.type.matches('NodePort')"
    validate:
      cel:
        expressions:
          - expression: "object.spec.externalTrafficPolicy.matches('Local')"
            message: 'All NodePort Services must use an externalTrafficPolicy of Local.'

```

--------------------------------

### Processing Namespace Collections with JMESPath

Source: https://kyverno.io/docs/policy-types/cluster-policy/external-data-sources

This example shows how to use the Kyverno CLI with `jq` to process a collection of Kubernetes Namespace resources obtained via a raw API call. It applies a JMESPath query to extract the `name` and `creationTimestamp` from each item in the `items` array of the NamespaceList object.

```bash
kubectl get --raw /api/v1/namespaces | kyverno jp query "items[*].{name: metadata.name, creationTime: metadata.creationTimestamp}"
```

--------------------------------

### Test Kubernetes API Call with kubectl and kyverno jp

Source: https://kyverno.io/docs/policy-types/cluster-policy/external-data-sources

This command demonstrates how to fetch a list of Pods from a specific namespace using `kubectl get --raw` and then pipe the output to `kyverno jp` to count the number of Pods. It's a useful way to test API calls and JMESPath queries.

```bash
kubectl get --raw /api/v1/namespaces/kyverno/pods | kyverno jp query "items | length(@)"
```

--------------------------------

### Generate Kyverno Completion Script for Zsh

Source: https://kyverno.io/docs/kyverno-cli/reference/kyverno_completion

Generates the autocompletion script for kyverno for the zsh shell. This script enables tab completion for kyverno commands, subcommands, flags, and arguments. It can be installed system-wide or sourced for the current session.

```zsh
# Generate and install zsh completionkyverno completion zsh > "${fpath[1]}/_kyverno"

# Generate and source zsh completion for current session
source <(kyverno completion zsh)
```

--------------------------------

### Configure Cluster Roles for Kyverno Secrets Management (kubectl)

Source: https://kyverno.io/docs/introduction/quick-start

Applies ClusterRole definitions to grant Kyverno the necessary permissions to view and manage Secrets. This involves two roles: one for viewing secrets and another for creating, updating, and deleting them, aggregated to relevant Kyverno controllers.

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: kyverno:secrets:view
  labels:
    rbac.kyverno.io/aggregate-to-admission-controller: "true"
    rbac.kyverno.io/aggregate-to-reports-controller: "true"
    rbac.kyverno.io/aggregate-to-background-controller: "true"
rules:
- apiGroups:
  - ''
  resources:
  - secrets
  verbs:
  - get
  - list
  - watch
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: kyverno:secrets:manage
  labels:
    rbac.kyverno.io/aggregate-to-background-controller: "true"
rules:
- apiGroups:
  - ''
  resources:
  - secrets
  verbs:
  - create
  - update
  - delete
```

--------------------------------

### Wildcard Match with NotEquals Operator for Ingress Host

Source: https://kyverno.io/docs/policy-types/cluster-policy/preconditions

This snippet shows how to use the 'NotEquals' operator with a wildcard to match Ingress resources where the host does not end with a specific domain. It targets Ingress resources and uses a precondition to filter based on the host pattern. The input is an Ingress resource's host, and the output is a boolean.

```yaml
- name: mutate-rules-host
  match:
    resources:
      kinds:
        - Ingress
  preconditions:
    all:
      - key: '{{request.object.spec.rules[0].host}}'
        operator: NotEquals
        value: '*.mycompany.com'

```

--------------------------------

### Kyverno Policy Example for 'app' Label Enforcement

Source: https://kyverno.io/docs/guides/reports

This Kyverno policy enforces the presence of an 'app' label on all Pods. When OpenReports integration is enabled, Kyverno will generate reports in the openreports.io/v1alpha1 API group for policy violations.

```yaml
apiVersion: kyverno.io/v1
kind: Policy
metadata:
  name: require-app-label
  namespace: default
spec:
  admission: true
  background: true
  rules:
    - match:
        resources:
          kinds:
            - Pod
      name: check-app-label
      skipBackgroundRequests: true
      validate:
        message: Pods must have an 'app' label.
        pattern:
          metadata:
            labels:
              app: ?*
  validationFailureAction: enforce

```

--------------------------------

### Add Custom Messages to Precondition Failures

Source: https://kyverno.io/docs/policy-types/cluster-policy/preconditions

This example shows how to add custom messages to preconditions that will be displayed in the Kyverno logs when an expression evaluates to FALSE. It uses the 'Equals' operator for two conditions related to data fields 'food' and 'day'. The input is the 'food' and 'day' fields of a ConfigMap's data, and the output is a boolean along with a log message on failure.

```yaml
- name: message-rule
  match:
    any:
      - resources:
          kinds:
            - ConfigMap
  preconditions:
    all:
      - key: '{{ request.object.data.food }}'
        operator: Equals
        value: cheese
        message: My favorite food is cheese.
      - key: '{{ request.object.data.day }}'
        operator: Equals
        value: monday
        message: You have a case of the Mondays.

```

--------------------------------

### Generate MD5 Hash for Resource Names

Source: https://kyverno.io/docs/policy-types/cluster-policy/jmespath

The md5() function generates a fixed-length hash value from a string of any length. This is useful for creating shorter identifiers, especially when SHA-256's length is prohibitive for Kubernetes resource constraints. The example policy mutates resource names to their MD5 hash values.

```yaml
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: md5-demo
spec:
  rules:
    - name: convert-name-to-hash
      match:
        any:
          - resources:
              kinds:
                - Pod
      mutate:
        patchStrategicMerge:
          metadata:
            name: '{{ md5(request.object.metadata.name) }}'

```

--------------------------------

### Exempt Pods Created by Job Controller (YAML)

Source: https://kyverno.io/docs/policy-types/cluster-policy/autogen

This example shows a Kyverno precondition expression used to exempt Pods created by a Job controller from policy enforcement. It checks the `ownerReferences` of the request object.

```yaml
- key: Job
  operator: AnyNotIn
  value: '{{ request.object.metadata.ownerReferences[].kind }}'

```

--------------------------------

### Kyverno Values File with Global and Resource Values

Source: https://kyverno.io/docs/subprojects/kyverno-cli

A Kyverno Values file demonstrating the use of both global and resource-specific values. Resource-specific values take precedence over global values if variable names conflict.

```yaml
apiVersion: cli.kyverno.io/v1alpha1
kind: Values
metadata:
  name: values
policies:
  - name: <policy1 name>
    resources:
      - name: <resource1 name>
        values:
          <variable1 in policy1>: <value>
          <variable2 in policy1>: <value>
      - name: <resource2 name>
        values:
          <variable1 in policy1>: <value>
          <variable2 in policy1>: <value>
  - name: <policy2 name>
    resources:
      - name: <resource1 name>
        values:
          <variable1 in policy2>: <value>
          <variable2 in policy2>: <value>
      - name: <resource2 name>
        values:
          <variable1 in policy2>: <value>
          <variable2 in policy2>: <value>
globalValues:
  <global variable1>: <value>
  <global variable2>: <value>
```

--------------------------------

### Example NamespacedImageValidatingPolicy in Kyverno

Source: https://kyverno.io/docs/policy-types/image-validating-policy

Demonstrates a namespaced image validation policy. This policy applies to resources within a specific namespace and uses 'cosign' for keyless image signing verification.

```yaml
apiVersion: policies.kyverno.io/v1
kind: NamespacedImageValidatingPolicy
metadata:
  name: verify-team-images
  namespace: development
spec:
  matchConstraints:
    resourceRules:
      - apiGroups: ['']
        apiVersions: ['v1']
        operations: [CREATE, UPDATE]
        resources: [pods]
  matchImageReferences:
    - glob: 'ghcr.io/myorg/dev-*'
  attestors:
    - name: dev-attestor
      cosign:
        keyless:
          identities:
            - issuer: 'https://token.actions.githubusercontent.com'
              subject: '*@myorg.github.io'
  validations:
    - message: 'image must be signed by the development team'
      expression: 'imageverify.verify(images.containers, attestors.devAttestor).all(result, result.verified)'

```

--------------------------------

### Accessing Container Image Properties in Kyverno Rules

Source: https://kyverno.io/docs/policy-types/cluster-policy/variables

These examples demonstrate how to reference specific properties of container images within Kyverno rules using the 'images' variable. It covers accessing registry, path, name, tag, digest, and different reference formats for both containers and initContainers.

```kyverno
# Reference the registry URL for container nginx
{{images.containers.nginx.registry}}

# Reference the path to the image for container nginx
{{images.containers.nginx.path}}

# Reference the image name for container nginx
{{images.containers.nginx.name}}

# Reference the image tag for container nginx
{{images.containers.nginx.tag}}

# Reference the digest for container nginx
{{images.containers.nginx.digest}}

# Reference the readable reference for the image (digest preferred) for container nginx
{{images.containers.nginx.reference}}

# Reference the readable reference for the image (tag) for container nginx
{{images.containers.nginx.referenceWithTag}}

# Reference the registry URL for initContainer vault
{{images.initContainers.vault.registry}}

# Reference the path to the image for initContainer vault
{{images.initContainers.vault.path}}

# Reference the image name for initContainer vault
{{images.initContainers.vault.name}}

# Reference the image tag for initContainer vault
{{images.initContainers.vault.tag}}

# Reference the digest for initContainer vault
{{images.initContainers.vault.digest}}

# Reference the readable reference for the image (digest preferred) for initContainer vault
{{images.initContainers.vault.reference}}

# Reference the readable reference for the image (tag) for initContainer vault
{{images.initContainers.vault.referenceWithTag}}

# Fetch image properties of all containers for further processing
{{ images.containers.*.name }}
```

--------------------------------

### Pod Cleanup with TTL Label

Source: https://kyverno.io/docs/policy-types/cleanup-policy

Example of a Pod with a `cleanup.kyverno.io/ttl` label, demonstrating how Kyverno can automatically clean up resources after a specified duration without an explicit cleanup policy. The TTL value is set to '2m', indicating cleanup after two minutes.

```yaml
apiVersion: v1
kind: Pod
metadata:
  labels:
    cleanup.kyverno.io/ttl: 2m
  name: foo
spec:
  containers:
    - args:
        - sleep
        - 1d
      image: busybox:1.35
      name: foo

```

--------------------------------

### Example ClusterAdmissionReport Resource

Source: https://kyverno.io/docs/guides/reports

This YAML snippet demonstrates the structure of a ClusterAdmissionReport, an intermediary resource used by Kyverno to collect results from admission control. It includes metadata, the owner of the report, detailed results of policy checks, and a summary of outcomes.

```yaml
apiVersion: kyverno.io/v1alpha2
kind: ClusterAdmissionReport
metadata:
  creationTimestamp: '2022-10-18T13:15:09Z'
  generation: 1
  labels:
    app.kubernetes.io/managed-by: kyverno
    audit.kyverno.io/resource.hash: a7ec5160f220c5b83c26b5c8f7dc35b6
    audit.kyverno.io/resource.uid: 61946422-14ba-4aa2-94b4-229d38446381
    cpol.kyverno.io/require-ns-labels: '4773'
  name: c0cc7337-9bcd-4d53-abb2-93f7f5555216
  resourceVersion: '4986'
  uid: 10babc6c-9e6e-4386-abed-c13f50091523
spec:
  owner:
    apiVersion: v1
    kind: Namespace
    name: testing
    uid: 61946422-14ba-4aa2-94b4-229d38446381
  results:
    - message:
        'validation error: The label `thisshouldntexist` is required. rule check-for-labels-on-namespace
        failed at path /metadata/labels/thisshouldntexist/'
      policy: require-ns-labels
      result: fail
      rule: check-for-labels-on-namespace
      scored: true
      source: kyverno
      timestamp:
        nanos: 0
        seconds: 1666098909
  summary:
    error: 0
    fail: 1
    pass: 0
    skip: 0
    warn: 0

```

--------------------------------

### Kyverno Assertion Tree: Select Based on Labels

Source: https://kyverno.io/docs/subprojects/kyverno-cli

Illustrates selecting results based on resource and policy labels using Kyverno's assertion trees. This allows for targeted testing by specifying label selectors in the match stanza.

```yaml
- match:
    resource:
      metadata:
        labels:
          foo: bar
    policy:
      metadata:
        labels:
          bar: baz
  assert:
    # ...
  error:
    # ...

```

--------------------------------

### Output: Mutated ConfigMap after Policy Application (Text)

Source: https://kyverno.io/docs/subprojects/kyverno-cli

This output shows the result of applying the 'add-label-to-configmap' policy to the 'game-demo' ConfigMap. The ConfigMap is displayed with the newly added label 'lfx-mentorship: kyverno', confirming the mutation was successful. It also includes a summary of the policy application status.

```text
Applying 1 policy rule(s) to 1 resource(s)...


policy add-label-to-configmap applied to default/ConfigMap/game-demo:
apiVersion: v1
data:
  player_initial_lives: "3"
kind: ConfigMap
metadata:
  labels:
    app: game
    lfx-mentorship: kyverno
  name: game-demo
  namespace: default
---


Mutation has been applied successfully.
pass: 1, fail: 0, warn: 0, error: 0, skip: 0
```

--------------------------------

### Configure Kyverno Helm Chart for Pod Annotations

Source: https://kyverno.io/docs/guides/monitoring

Add custom Pod annotations to Kyverno using the Helm chart's values file. This allows for dynamic configuration of metrics collection, including specifying the DataDog OpenMetrics checks. The example demonstrates how to include the `ad.datadoghq.com/kyverno.checks` annotation.

```yaml
podAnnotations:
  # https://github.com/DataDog/integrations-core/blob/master/openmetrics/datadog_checks/openmetrics/data/conf.yaml.example
  # Note: To collect counter metrics with names ending in `_total`, specify the metric name without the `_total`
  ad.datadoghq.com/kyverno.checks: |
    {
      "openmetrics": {
        "init_config": {},
        "instances": [
          {
            "openmetrics_endpoint": "http://%%host%%:8000/metrics",
            "namespace": "kyverno",
            "metrics": [
              {"kyverno_policy_rule_info_total": "policy_rule_info"},
              {"kyverno_admission_requests": "admission_requests"},
              {"kyverno_policy_changes": "policy_changes"}
            ],
            "exclude_labels": [
              "resource_namespace"
            ]
          },
          {
            "openmetrics_endpoint": "http://%%host%%:8000/metrics",
            "namespace": "kyverno",
            "metrics": [
              {"kyverno_policy_results": "policy_results"}
            ]
          }
        ]
      }
    }

```

--------------------------------

### Kyverno Policy to Generate ValidatingAdmissionPolicy

Source: https://kyverno.io/docs/policy-types/cluster-policy/validate

An example Kyverno ClusterPolicy that uses a CEL expression in its `validate.cel` sub-rule to define a validation. This policy can be used by Kyverno to automatically generate a corresponding ValidatingAdmissionPolicy.

```yaml
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: disallow-host-path
spec:
  background: false
  rules:
    - name: host-path
      match:
        any:
          - resources:
              kinds:
                - Deployment
      validate:
        failureAction: Enforce
        cel:
          expressions:
            - expression: '!has(object.spec.template.spec.volumes) || object.spec.template.spec.volumes.all(volume, !has(volume.hostPath))'
              message: 'HostPath volumes are forbidden. The field spec.template.spec.volumes[*].hostPath must be unset.'

```

--------------------------------

### Troubleshoot Kyverno Policy Application Failure (Shell)

Source: https://kyverno.io/docs/policy-types/cluster-policy/mutate

This command demonstrates how to retrieve and inspect `UpdateRequest` Custom Resources to diagnose policy application failures. It shows an example of a `Failed` status due to insufficient permissions, providing the specific error message. This is crucial for identifying and resolving policy execution issues.

```shell
$ kubectl get ur -n kyverno
NAME       POLICY    RULETYPE   RESOURCEKIND   RESOURCENAME   RESOURCENAMESPACE   STATUS   AGE
ur-swsdg   add-sec   mutate     Deployment     foobar         default             Failed   84s


$ kubectl describe ur ur-swsdg -n kyverno
Name:         ur-swsdg
Namespace:    kyverno
...
Status:
  Message:  deployments.apps "foobar" is forbidden: User "system:serviceaccount:kyverno:kyverno-service-account" cannot update resource "deployments" in API group "apps" in the namespace "default"
  State:    Failed

```

--------------------------------

### Example DeletingPolicy for Pod Cleanup

Source: https://kyverno.io/docs/policy-types/deleting-policy

Demonstrates a cluster-scoped DeletingPolicy to remove pods in namespaces labeled 'environment: test' that are also labeled 'old: "true"'. It runs daily at 1 AM and includes an optional variable for ephemeral pod identification.

```yaml
apiVersion: policies.kyverno.io/v1
kind: DeletingPolicy
metadata:
  name: cleanup-old-test-pods
spec:
  schedule: '0 1 * * *' # Run daily at 1 AM
  matchConstraints:
    resourceRules:
      - apiGroups: ['']
        apiVersions: ['v1']
        operations: ['*']
        resources: ['pods']
        scope: 'Namespaced'
    namespaceSelector:
      matchLabels:
        environment: test
  conditions:
    - name: isOld
      expression: "has(object.metadata.labels.old) && object.metadata.labels.old == 'true'"
  variables:
    - name: isEphemeral
      expression: "has(object.metadata.labels.ephemeral) && object.metadata.labels.ephemeral == 'true'"
```

--------------------------------

### Kyverno Context Manifest for External Resources

Source: https://kyverno.io/docs/subprojects/kyverno-cli

This `context.yaml` file provides mock external resources for `kyverno test`. It defines a ConfigMap named `policy-cm` with specific data, which is then accessible to policies using the `resource.Get()` function during offline testing.

```yaml
apiVersion: cli.kyverno.io/v1alpha1
kind: Context
metadata:
  name: test-context
spec:
  resources:
    - apiVersion: v1
      kind: ConfigMap
      metadata:
        namespace: default
        name: policy-cm
      data:
        # The 'name' key specifies that the only valid pod name is 'good-pod'.
        name: good-pod

```

--------------------------------

### Fetching Raw Kubernetes API Data

Source: https://kyverno.io/docs/policy-types/cluster-policy/external-data-sources

This command uses `kubectl` to make a raw HTTP GET request to the Kubernetes API server. It fetches a collection of all Namespace resources. The output is piped to `jq` for pretty-printing, making the JSON response more readable.

```bash
kubectl get --raw /api/v1/namespaces | jq
```

--------------------------------

### Append Object to Array with JSONPatch

Source: https://kyverno.io/docs/policy-types/cluster-policy/mutate

This example shows how to append an object to an array, such as 'pod.spec.tolerations', using RFC 6902 JSONPatch. It utilizes a dash (-) at the end of the path to indicate appending to the array.

```yaml
mutate:
  patchesJson6902: |-
    - op: add
      path: "/spec/tolerations/-"
      value:
        key: networkzone
        operator: Equal
        value: dmz
        effect: NoSchedule

```

--------------------------------

### Apply MutatingAdmissionPolicy using Kyverno CLI (Command)

Source: https://kyverno.io/docs/subprojects/kyverno-cli

This command demonstrates how to use the Kyverno CLI to apply a MutatingAdmissionPolicy to a specific resource. It takes the policy manifest and the resource manifest as arguments. This is the operational command to test the defined policy.

```bash
kyverno apply /path/to/add-label-to-configmap.yaml --resource /path/to/configmap.yaml
```

--------------------------------

### Escape Variables in Kyverno Policy

Source: https://kyverno.io/docs/policy-types/cluster-policy/variables

Demonstrates how to escape variables in a Kyverno policy to prevent Kyverno from substituting them. This is useful when variables are intended for external processes. The example shows escaping for OTEL_RESOURCE_ATTRIBUTES.

```yaml
apiVersion: kyverno.io/v1
kind: Policy
metadata:
  name: add-otel-resource-env
  namespace: foobar
spec:
  background: false
  rules:
    - name: imbue-pod-spec
      match:
        any:
          - resources:
              kinds:
                - v1/Pod
      mutate:
        patchStrategicMerge:
          spec:
            containers:
              - (name): '?*'
                env:
                  - name: NODE_NAME
                    value: 'mutated_name'
                  - name: POD_IP_ADDRESS
                    valueFrom:
                      fieldRef:
                        fieldPath: status.podIP
                  - name: POD_NAME
                    valueFrom:
                      fieldRef:
                        fieldPath: metadata.name
                  - name: POD_NAMESPACE
                    valueFrom:
                      fieldRef:
                        fieldPath: metadata.namespace
                  - name: POD_SERVICE_ACCOUNT
                    valueFrom:
                      fieldRef:
                        fieldPath: spec.serviceAccountName
                  - name: OTEL_RESOURCE_ATTRIBUTES
                    value: >-
                      k8s.namespace.name=\$(POD_NAMESPACE),
                      k8s.node.name=\$(NODE_NAME),
                      k8s.pod.name=\$(POD_NAME),
                      k8s.pod.primary_ip_address=\$(POD_IP_ADDRESS),
                      k8s.pod.service_account.name=\$(POD_SERVICE_ACCOUNT),
                      rule_applied=$(./../../../../../../../../name)

```

--------------------------------

### Grant Background and Reports Controller Permissions for Custom Resources

Source: https://kyverno.io/docs/installation/customization

These ClusterRoles grant permissions for managing a custom resource named 'crontabs' within the 'stable.example.com' API group. One role allows editing (update), aggregated to the background controller, while the other allows viewing (get, list, watch) and is aggregated to both background and reports controllers.

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: kyverno:crontab:edit
  labels:
    rbac.kyverno.io/aggregate-to-background-controller: 'true'
rules:
  - apiGroups:
      - stable.example.com
    resources:
      - crontabs
    verbs:
      - update
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: kyverno:crontab:view
  labels:
    rbac.kyverno.io/aggregate-to-background-controller: 'true'
    rbac.kyverno.io/aggregate-to-reports-controller: 'true'
rules:
  - apiGroups:
      - stable.example.com
    resources:
      - crontabs
    verbs:
      - get
      - list
      - watch

```

--------------------------------

### Delete Non-Compliant Pod and Verify PolicyReport Deletion

Source: https://kyverno.io/docs/guides/reports

This command sequence demonstrates deleting the non-compliant Pod ('secret-pod') and then checking the PolicyReports. The example shows that upon deletion of the offending resource, the corresponding PolicyReport entry is also removed.

```bash
$ kubectl delete po secret-pod
pod "secret-pod" deleted


$ kubectl get polr -o wide
NAME                                   KIND         NAME                                         PASS   FAIL   WARN   ERROR   SKIP   AGE

```

--------------------------------

### Apply Policy to Resource

Source: https://kyverno.io/docs/subprojects/kyverno-cli

Applies a specified policy file to a given resource file. This is a fundamental use case for testing policy effectiveness.

```bash
kyverno apply /path/to/policy.yaml --resource /path/to/resource.yaml
```

--------------------------------

### Mutate Deployment with Preconditions and Context Variables

Source: https://kyverno.io/docs/policy-types/cluster-policy/mutate

This policy restarts existing Deployments that consume a Secret with the label 'kyverno.io/watch: "true"' and whose names start with 'testing-'. It showcases the use of preconditions and context variables within the `targets` array for fine-grained resource selection.

```yaml
apiVersion: kyverno.v2beta1
kind: ClusterPolicy
metadata:
  name: refresh-env-var-in-pods
spec:
  rules:
    - name: refresh-from-secret-env
      match:
        any:
          - resources:
              kinds:
                - Secret
              selector:
                matchLabels:
                  kyverno.io/watch: 'true'
              operations:
                - UPDATE
      mutate:
        mutateExistingOnPolicyUpdate: false
        targets:
          - apiVersion: apps/v1
            kind: Deployment
            namespace: '{{request.namespace}}'
            preconditions:
              all:
                - key: '{{target.metadata.name}}'
                  operator: Equals
                  value: testing-*
        patchStrategicMerge:
          spec:
            template:
              metadata:
                annotations:
                  corp.org/random: "{{ random('[0-9a-z]{8}') }}"
              spec:
                containers:
                  - env:
                      - valueFrom:
                          secretKeyRef:
                            <(name): '{{ request.object.metadata.name }}'

```

--------------------------------

### Define Kyverno Policy to Sync Secrets (kubectl)

Source: https://kyverno.io/docs/introduction/quick-start

Creates a Kyverno GeneratingPolicy named 'sync-secrets'. This policy is configured to synchronize a 'regcred' secret from the 'default' namespace to any newly created namespace, ensuring consistent access credentials across namespaces.

```yaml
apiVersion: policies.kyverno.io/v1alpha1
kind: GeneratingPolicy
metadata:
  name: sync-secrets
spec:
  evaluation:
    synchronize:
      enabled: true
  matchConstraints:
    resourceRules:
      - apiGroups: ['']
        apiVersions: ['v1']
        operations: ['CREATE']
        resources: ['namespaces']
  variables:
    - name: targetNs
      expression: 'object.metadata.name'
    - name: sourceSecret
      expression: 'resource.Get("v1", "secrets", "default", "regcred")'
  generate:
    - expression: 'generator.Apply(variables.targetNs, [variables.sourceSecret])'
```

--------------------------------

### List and Get Kyverno JMESPath Function Information

Source: https://kyverno.io/docs/kyverno-cli/reference/kyverno_jp_function

This command allows users to list all available JMESPath functions or retrieve detailed information about specific functions. It leverages Kyverno's enhanced JMESPath capabilities. No external dependencies are required beyond the Kyverno CLI.

```bash
# List functions
kyverno jp function

# Get function infos
kyverno jp function truncate
```

--------------------------------

### Delete Kyverno Validation Policy

Source: https://kyverno.io/docs/introduction/quick-start

This command removes the 'require-labels' `ValidatingPolicy` from the Kubernetes cluster, effectively disabling the label enforcement rule. This is typically done as a cleanup step after testing.

```bash
kubectl delete validatingpolicy require-labels
```

--------------------------------

### Example Attestation Payload Structure

Source: https://kyverno.io/docs/policy-types/cluster-policy/verify-images/sigstore

This JSON object represents a typical in-toto attestation payload, including payload type, predicate type, subject (image details), and the predicate itself containing metadata like code review information. It also includes signature details.

```json
{
  "payloadType": "https://example.com/CodeReview/v1",
  "payload": {
    "_type": "https://in-toto.io/Statement/v0.1",
    "predicateType": "https://example.com/CodeReview/v1",
    "subject": [
      {
        "name": "registry.io/org/app",
        "digest": {
          "sha256": "b31bfb4d0213f254d361e0079deaaebefa4f82ba7aa76ef82e90b4935ad5b105"
        }
      }
    ],
    "predicate": {
      "author": "alice@example.com",
      "repo": {
        "branch": "main",
        "type": "git",
        "uri": "https://git-repo.com/org/app"
      },
      "reviewers": ["bob@example.com"]
    }
  },
  "signatures": [
    {
      "keyid": "",
      "sig": "MEYCIQDtJYN8dq9RACVUYljdn6t/BBONrSaR8NDpB+56YdcQqAIhAKRgiQIFvGyQERJJYjq2+6Jq2tkVbFpQMXPU0Zu8Gu1S"
    }
  ]
}
```

--------------------------------

### Fetch Kubernetes Cluster Version Information

Source: https://kyverno.io/docs/policy-types/cluster-policy/external-data-sources

Retrieves detailed version information about the Kubernetes cluster by making a raw GET request to the `/version` endpoint. The output includes build details and Go version.

```bash
$ kubectl get --raw /version
{
  "major": "1",
  "minor": "23",
  "gitVersion": "v1.23.8+k3s1",
  "gitCommit": "53f2d4e7d80c09a7db1858e3f4e7ddfa13256c45",
  "gitTreeState": "clean",
  "buildDate": "2022-06-27T21:48:01Z",
  "goVersion": "go1.17.5",
  "compiler": "gc",
  "platform": "linux/amd64"
}

```

--------------------------------

### Kubernetes Deployment Missing 'app: nginx' Label (YAML)

Source: https://kyverno.io/docs/subprojects/kyverno-cli

This YAML defines a Kubernetes Deployment named 'skipped-deployment-1' in the 'default' namespace. It is expected to be skipped by Kyverno policies because it lacks the 'app: nginx' label, which might be a requirement for certain policies. This example requires a running Kubernetes cluster and kubectl configured to interact with it.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: skipped-deployment-1
  namespace: default
spec:
  replicas: 1
  selector:
    matchLabels:
      app: busybox
  template:
    metadata:
      labels:
        app: busybox
    spec:
      containers:
        - name: busybox
          image: busybox:latest
```

--------------------------------

### Kubectl Command to Create Namespace

Source: https://kyverno.io/docs/policy-types/cluster-policy/validate

This command demonstrates how to apply a Kubernetes manifest file (e.g., `ns.yaml`) using `kubectl`. If the manifest violates an active Kyverno policy, `kubectl` will return an error message from the admission webhook.

```bash
$ kubectl create -f ns.yaml
Error from server: error when creating "ns.yaml": admission webhook "validate.kyverno.svc" denied the request:

resource Namespace//prod-bus-app1 was blocked due to the following policies

require-ns-purpose-label:
  require-ns-purpose-label: 'Validation error: You must have label `purpose` with value `production` set on all new namespaces.; Validation rule require-ns-purpose-label failed at path /metadata/labels/purpose/'

```

--------------------------------

### Example of Cached Kubernetes Resource Data (JSON)

Source: https://kyverno.io/docs/policy-types/cluster-policy/external-data-sources

This JSON structure represents the data cached by a GlobalContextEntry for Kubernetes resources. It shows an array of Deployment objects, each with its API version, kind, and metadata.

```json
[
  {
    "apiVersion": "apps/v1",
    "kind": "Deployment",
    "metadata": {
      "annotations": {
        "deployment.kubernetes.io/revision": "1"
      }
    }
    //...
  },
  {
    "apiVersion": "apps/v1",
    "kind": "Deployment",
    "metadata": {
      "annotations": {
        "deployment.kubernetes.io/revision": "1"
      }
    }
    //...
  }
]

```

--------------------------------

### Parse JMESPath Expression to AST

Source: https://kyverno.io/docs/kyverno-cli/reference/kyverno_jp

Illustrates how to parse a JMESPath expression and display its Abstract Syntax Tree (AST). This is helpful for understanding the structure of complex queries.

```bash
kyverno jp parse 'request.object.metadata.name | truncate(@, `9`)'
```

--------------------------------

### Trim Characters from String Ends with trim Filter (YAML)

Source: https://kyverno.io/docs/policy-types/cluster-policy/jmespath

The `trim()` filter removes specified characters from the beginning and end of a string. This example shows how to remove a domain from an email address stored in an annotation for a Kubernetes Service.

```yaml
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: trim-demo
spec:
  rules:
    - name: trim-extnameemail
      match:
        any:
          - resources:
              kinds:
                - Service
      mutate:
        patchStrategicMerge:
          metadata:
            annotations:
              extnameemail: "{{ trim('{{@}}','@corp.com') }}"

```

--------------------------------

### Import Public Key Pair for Cosign Signing

Source: https://kyverno.io/docs/policy-types/cluster-policy/verify-images/sigstore

This command imports a public key pair using cosign, typically used when you have a private key and want to generate corresponding public key files for signing operations. It creates `import-cosign.key` and `import-cosign.pub`.

```bash
cosign import-key-pair --key test.key

```

--------------------------------

### Define Pod Validation Rule for Auto-Generation (YAML)

Source: https://kyverno.io/docs/policy-types/cluster-policy/autogen

This example demonstrates a Kyverno ClusterPolicy that validates container images for Pods, enabling auto-generation of rules for controllers that create Pods. It specifies a pattern to ensure images come from a trusted registry.

```yaml
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: restrict-image-registries
spec:
  rules:
    - name: validate-registries
      match:
        any:
          - resources:
              kinds:
                - Pod
      validate:
        failureAction: Enforce
        message: 'Images may only come from our internal enterprise registry.'
        pattern:
          spec:
            containers:
              - image: 'registry.domain.com/*'

```

--------------------------------

### Kyverno Policy: Restrict image registries using resource.Get()

Source: https://kyverno.io/docs/policy-types/cel-libraries

This Kyverno policy demonstrates using `resource.Get()` to fetch a ConfigMap named 'allowed-registry' from the 'kube-system' namespace. The policy then validates that all container images in a Pod resource start with the registry specified in the ConfigMap.

```yaml
apiVersion: policies.kyverno.io/v1
kind: ValidatingPolicy
metadata:
  name: restrict-image-registries
spec:
  validationActions:
    - Deny
  evaluation:
    background:
      enabled: false
  matchConstraints:
    resourceRules:
      - apiGroups: ['']
        apiVersions: ['v1']
        operations: ['CREATE', 'UPDATE']
        resources: ['pods']
  variables:
    - name: allContainers
      expression: >-
        object.spec.containers
        + object.spec.?initContainers.orValue([])
        + object.spec.?ephemeralContainers.orValue([])
    - name: cm
      expression: >-
        resource.Get("v1", "configmaps", "kube-system", "allowed-registry")
    - name: allowedRegistry
      expression: "variables.cm.data[?'registry'].orValue('')"
  validations:
    - expression: 'variables.allContainers.all(c, c.image.startsWith(variables.allowedRegistry))'
      messageExpression: '"image must be from registry: " + string(variables.allowedRegistry)'

```

--------------------------------

### Create Kubernetes Cluster

Source: https://kyverno.io/docs/guides/monitoring

Creates a local Kubernetes cluster using the 'kind' tool. This is a prerequisite for deploying Kyverno and its monitoring stack.

```shell
kind create cluster
```

--------------------------------

### Apply Policy with Specific Resource and Namespace Selector

Source: https://kyverno.io/docs/subprojects/kyverno-cli

Applies a specific policy to a resource, using a values file to define namespace selection criteria. This allows for fine-grained control over policy application.

```bash
kyverno apply /path/to/enforce-pod-name.yaml --resource /path/to/nginx.yaml -f /path/to/value.yaml
```

--------------------------------

### Kyverno Deleting Controller Errors

Source: https://kyverno.io/docs/reference/metrics

This section details metrics related to errors encountered during policy deletion operations in Kyverno. It includes use cases and example queries for monitoring and alerting on these errors.

```APIDOC
## Kyverno Deleting Controller Errors

### Description
Metrics related to errors during policy deletion operations.

### Use Cases
* Monitor the number of errors per deleting policy.
* Alert when deleting operations start failing for specific resources or namespaces.

### Useful Queries
* Number of errors per second per deleting policy:  
`sum by (policy_name, policy_namespace) (rate(kyverno_deleting_controller_errors_total{}[5m]))`
```

--------------------------------

### Configure MutatingPolicy Webhook Timeout

Source: https://kyverno.io/docs/policy-types/mutating-policy

This example illustrates setting the webhook timeout for a MutatingPolicy using `spec.webhookConfiguration.timeoutSeconds`. This value determines how long the admission request waits for policy evaluation before potentially failing.

```yaml
apiVersion: policies.kyverno.io/v1
kind: MutatingPolicy
metadata:
  name: add-labels
spec:
  webhookConfiguration:
    timeoutSeconds: 15
  # ...
```

--------------------------------

### Kyverno Assertion Tree: Select All Results

Source: https://kyverno.io/docs/subprojects/kyverno-cli

Demonstrates how to select all results using an empty match statement within Kyverno's assertion trees. This configuration ensures that all available checks are applied.

```yaml
- match: {}
  assert:
    # ...
  error:
    # ...

```

--------------------------------

### Fetch Node Metrics from Aggregated API

Source: https://kyverno.io/docs/policy-types/cluster-policy/external-data-sources

Demonstrates fetching metrics for nodes from an aggregated API endpoint (`metrics.k8s.io`). It uses `kubectl get --raw` and pipes the output to `jq` for pretty-printing the JSON response.

```bash
$ kubectl get --raw /apis/metrics.k8s.io/v1beta1/nodes | jq
{
  "kind": "NodeMetricsList",
  "apiVersion": "metrics.k8s.io/v1beta1",
  "metadata": {},
  "items": [
    {
      "metadata": {
        "name": "k3d-kyv180rc1-server-0",
        "creationTimestamp": "2022-09-11T13:37:39Z",
        "labels": {
          "beta.kubernetes.io/arch": "amd64",
          "beta.kubernetes.io/instance-type": "k3s",
          "beta.kubernetes.io/os": "linux",

```

--------------------------------

### Create Kyverno Validation Policy for Required Labels

Source: https://kyverno.io/docs/introduction/quick-start

This snippet defines a Kyverno `ValidatingPolicy` that enforces the presence of a 'team' label on Kubernetes Pods. It uses `validationActions` set to `Deny` to block non-compliant resources and `matchConstraints` to target Pod creations and updates. The `validations` field specifies the expression to check for the 'team' label.

```yaml
apiVersion: policies.kyverno.io/v1alpha1
kind: ValidatingPolicy
metadata:
  name: require-labels
spec:
  validationActions:
    - Deny
  matchConstraints:
    resourceRules:
      - apiGroups: ['']
        apiVersions: ['v1']
        operations: ['CREATE', 'UPDATE']
        resources: ['pods']
  validations:
    - message: "label 'team' is required"
      expression: "has(object.metadata.labels) && has(object.metadata.labels.team) && object.metadata.labels.team != ''"
```

--------------------------------

### Test Specific Policy, Rule, and Resource Combinations (CLI)

Source: https://kyverno.io/docs/subprojects/kyverno-cli

Command to execute a subset of policy, rules, and resource combinations rather than all defined in a test manifest. The `--test-case-selector` flag allows for precise targeting of specific tests.

```bash
kyverno test . --test-case-selector "policy=add-default-resources, rule=add-default-requests, resource=nginx-demo2"

```

--------------------------------

### Inject Global Context Entries with Variables

Source: https://kyverno.io/docs/subprojects/kyverno-cli

Demonstrates injecting global context entries and rule-specific values using a values file. This allows for setting global parameters like request operations and rule-specific counts.

```yaml
apiVersion: cli.kyverno.io/v1alpha1
kind: Value
metadata:
  name: values
globalValues:
  request.operation: CREATE
policies:
  - name: gctx
    rules:
      - name: main-deployment-exists
        values:
          deploymentCount: 1
```

--------------------------------

### Pod Security Violation Error Message (Restricted)

Source: https://kyverno.io/docs/policy-types/cluster-policy/validate

This example shows the detailed error message when a Pod violates the Pod Security restricted profile. It lists multiple violations, including `allowPrivilegeEscalation`, capabilities, host namespaces, `runAsNonRoot`, and `seccompProfile`, demonstrating the cumulative nature of the restricted profile.

```text
Error from server: error when creating "bad.yaml": admission webhook "validate.kyverno.svc-fail" denied the request:

policy Pod/default/badpod01 for resource violation:

psa:
  baseline: |
    Validation rule 'baseline' failed. It violates PodSecurity "restricted:latest": ({Allowed:false ForbiddenReason:allowPrivilegeEscalation != false ForbiddenDetail:container "container01" must set securityContext.allowPrivilegeEscalation=false})
    ({Allowed:false ForbiddenReason:unrestricted capabilities ForbiddenDetail:container "container01" must set securityContext.capabilities.drop=[ALL]})
    ({Allowed:false ForbiddenReason:host namespaces ForbiddenDetail:hostIPC=true})
    ({Allowed:false ForbiddenReason:runAsNonRoot != true ForbiddenDetail:pod or container "container01" must set securityContext.runAsNonRoot=true})
    ({Allowed:false ForbiddenReason:seccompProfile ForbiddenDetail:pod or container "container01" must set securityContext.seccompProfile.type to "RuntimeDefault" or "Localhost"})

```

--------------------------------

### Kyverno CLI Options

Source: https://kyverno.io/docs/kyverno-cli/reference/kyverno

Lists common command-line flags available for the Kyverno CLI. These options control logging behavior, configuration, and output formatting.

```bash
--add_dir_header
      --alsologtostderr
  -h, --help
      --kubeconfig string
      --log_backtrace_at traceLocation
      --log_dir string
      --log_file string
      --log_file_max_size uint
      --logtostderr
      --one_output
      --skip_headers
      --skip_log_headers
      --stderrthreshold severity
  -v, --v Level
      --vmodule moduleSpec
```

--------------------------------

### Kyverno foreach: List of Containers Validation

Source: https://kyverno.io/docs/policy-types/cluster-policy/validate

This example demonstrates how to use the `foreach` declaration to validate properties of sub-elements, specifically iterating over container definitions in a Pod resource. It ensures that all container images are pulled from a trusted registry. The `list` attribute specifies the JMESPath expression to select the sub-elements, and the `pattern` is applied to each element.

```yaml
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: check-images
spec:
  background: false
  rules:
    - name: check-registry
      match:
        any:
          - resources:
              kinds:
                - Pod
      preconditions:
        any:
          - key: '{{request.operation}}'
            operator: NotEquals
            value: DELETE
      validate:
        failureAction: Enforce
        message: 'unknown registry'
        foreach:
          - list: 'request.object.spec.initContainers'
            pattern:
              image: 'trusted-registry.io/*'
          - list: 'request.object.spec.containers'
            pattern:
              image: 'trusted-registry.io/*'
```

--------------------------------

### Kyverno CLI Subcommands

Source: https://kyverno.io/docs/kyverno-cli/reference/kyverno

Lists available subcommands for the Kyverno CLI, each performing a specific function like applying policies, generating completions, creating resources, or testing policies.

```bash
kyverno apply - Applies policies on resources.
kverno completion - Generate the autocompletion script for kyverno for the specified shell.
kverno create - Helps with the creation of various Kyverno resources.
kverno docs - Generates reference documentation.
kverno jp - Provides a command-line interface to JMESPath, enhanced with Kyverno specific custom functions.
kverno json - Runs tests against any json compatible payloads/policies.
kverno migrate - Migrate one or more resources to the stored version.
kverno test - Run tests from a local filesystem or a remote git repository.
kverno version - Prints the version of Kyverno CLI.
```

--------------------------------

### Kyverno CLI Output Showing Mutated ConfigMaps

Source: https://kyverno.io/docs/subprojects/kyverno-cli

Illustrates the expected output after applying the Kyverno policy. It shows that ConfigMaps in 'staging' and 'production' namespaces have been successfully mutated with the added label, while the ConfigMap in the 'testing' namespace remains unchanged.

```text
Applying 1 policy rule(s) to 3 resource(s)...


policy add-label-to-configmap applied to staging/ConfigMap/matched-cm-1:
apiVersion: v1
data:
  player_initial_lives: "3"
kind: ConfigMap
metadata:
  labels:
    color: red
    lfx-mentorship: kyverno
  name: matched-cm-1
  namespace: staging
---


Mutation has been applied successfully.
policy add-label-to-configmap applied to production/ConfigMap/matched-cm-2:
apiVersion: v1
data:
  player_initial_lives: "3"
kind: ConfigMap
metadata:
  labels:
    color: red
    lfx-mentorship: kyverno
  name: matched-cm-2
  namespace: production
---


Mutation has been applied successfully.
pass: 2, fail: 0, warn: 0, error: 0, skip: 0

```

--------------------------------

### Add 'team: bravo' Label to Pods with Kyverno MutatingPolicy

Source: https://kyverno.io/docs/introduction/quick-start

This policy adds the 'team: bravo' label to newly created or updated Pods, but only if the 'team' label is not already defined. It uses Kyverno's `MutatingPolicy` kind and CEL expressions for conditional logic. The `patchType` is set to `ApplyConfiguration` for declarative configuration.

```yaml
apiVersion: policies.kyverno.io/v1alpha1
kind: MutatingPolicy
metadata:
  name: add-labels
spec:
  matchConstraints:
    resourceRules:
      - apiGroups: ['']
        apiVersions: ['v1']
        operations: ['CREATE', 'UPDATE']
        resources: ['pods']
  matchConditions:
    - name: team-label-missing
      expression: '!has(object.metadata.labels) || !has(object.metadata.labels.team)'
  mutations:
    - patchType: ApplyConfiguration
      applyConfiguration:
        expression: >
          Object{
            metadata: Object.metadata{
              labels: Object.metadata.labels{
                team: "bravo"
              }
            }
          }

```

--------------------------------

### Get Current Timestamp with time.now()

Source: https://kyverno.io/docs/policy-types/cel-libraries

The `time.now()` function returns the current timestamp, which can be used for various time-based comparisons and calculations within Kyverno policies. It's fundamental for time-sensitive operations.

```cel
time.now()
```

--------------------------------

### Create a Pod for Trace Observation

Source: https://kyverno.io/docs/guides/tracing

Creates a simple NGINX pod in the Kubernetes cluster. This action triggers Kyverno's admission webhooks, generating traces that can be observed in Jaeger.

```bash
kubectl run nginx --image=nginx
```

--------------------------------

### Kyverno Nested foreach with patchesJson6902 (Modern Syntax)

Source: https://kyverno.io/docs/policy-types/cluster-policy/mutate

This example shows a Kyverno `ClusterPolicy` using nested `foreach` loops to mutate Ingress resources. It replaces specific DNS suffixes in the `spec.tls[].hosts[]` array using `patchesJson6902`. The modern `as` syntax is used to define loop variables.

```yaml
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: replace-image-registry
spec:
  background: false
  rules:
    - name: replace-dns-suffix
      match:
        any:
          - resources:
              kinds:
                - Ingress
      mutate:
        foreach:
          - list: request.object.spec.tls[]
            as: element0 # Outer loop element (tls array)
            foreach:
              - list: 'element.hosts'
                as: element1 # Inner loop element (hosts array)
                patchesJson6902: |-
                  - path: /spec/tls/{{elementIndex0}}/hosts/{{elementIndex1}}
                    op: replace
                    value: "{{ replace_all('{{element1}}', '.old.com', '.new.com') }}"
```

--------------------------------

### Kubectl: Create a Pod Resource

Source: https://kyverno.io/docs/policy-types/cluster-policy/variables

This command uses `kubectl` to create a simple Pod resource named 'busybox' with the specified image. This is a prerequisite for observing the annotation applied by the Kyverno policy.

```bash
kubectl run busybox --image busybox:1.28

```

--------------------------------

### kyverno jp query Command Options

Source: https://kyverno.io/docs/kyverno-cli/reference/kyverno_jp_query

Available options for the 'kyverno jp query' command, including input/output formatting and query source selection.

```bash
# Options for kyverno jp query
-c, --compact         Produce compact JSON output that omits non essential whitespace
-h, --help            help for query
-i, --input string    Read input from a JSON or YAML file instead of stdin
-q, --query strings   Read JMESPath expression from the specified file
-u, --unquoted        If the final result is a string, it will be printed without quotes
```

--------------------------------

### Match Requests from Specific Service Accounts with AnyIn

Source: https://kyverno.io/docs/policy-types/cluster-policy/preconditions

This snippet demonstrates using the 'AnyIn' operator to apply a rule only to requests originating from specific ServiceAccounts. The 'key' field accepts the 'serviceAccountName' variable, and the 'value' field is a list of allowed ServiceAccount names. It matches on Namespace resources. The input is the 'serviceAccountName' variable, and the output is a boolean.

```yaml
- name: generate-default-build-role
  match:
    any:
      - resources:
          kinds:
            - Namespace
  preconditions:
    any:
      - key: '{{serviceAccountName}}'
        operator: AnyIn
        value:
          - build-default
          - build-base

```

--------------------------------

### Mutating Policy Execution Latency

Source: https://kyverno.io/docs/reference/metrics

Metrics for tracking the execution latency of mutating policies in Kyverno. Includes metric names, value descriptions, available labels, use cases, and example Prometheus queries.

```APIDOC
## Mutating Policy Execution Latency

### Description
Metrics for tracking the execution latency of mutating policies in Kyverno. These metrics help in understanding the performance and efficiency of policy mutation.

### Metric Names
- `kyverno_mutating_policy_execution_duration_seconds_count`
- `kyverno_mutating_policy_execution_duration_seconds_sum`
- `kyverno_mutating_policy_execution_duration_seconds_bucket`

### Metric Value
Histogram - A float value representing the latency of the mutating policy’s execution in seconds. Refer to Prometheus documentation for a detailed explanation of histograms.

### Metric Labels
| Label | Allowed Values | Description |
|---|---|---|
| `policy_background_mode` | "true", "false" | Policy’s set background mode |
| `policy_name` | | Name of the policy |
| `resource_kind` | "Pod", "Deployment", "StatefulSet", "ReplicaSet", etc. | Kind of this resource |
| `resource_namespace` | | Namespace in which this resource lives |
| `resource_request_operation` | "create", "update", "delete" | If the requested resource is being created, updated, or deleted. |
| `execution_cause` | "admission_request", "background_scan" | Identifies whether the policy is executing in response to an admission request or a periodic background scan. |
| `result` | "PASS", "FAIL" | Result of the policy’s execution |

### Use Cases
- Track the average latencies associated with Kyverno policies’ execution over the last 24 hours to understand efficiency.
- Identify policies causing the highest latency in a specific cluster policy.

### Useful Queries
- Tracking the average latency associated with the execution of mutating policies:
`avg(kyverno_mutating_policy_execution_duration_seconds{})`
```

--------------------------------

### Validating Policy Execution Latency

Source: https://kyverno.io/docs/reference/metrics

Metrics for tracking the execution latency of validating policies in Kyverno. Includes metric names, value descriptions, available labels, use cases, and example Prometheus queries.

```APIDOC
## Validating Policy Execution Latency

### Description
Metrics for tracking the execution latency of validating policies in Kyverno. These metrics help in understanding the performance and efficiency of policy validation.

### Metric Names
- `kyverno_validating_policy_execution_duration_seconds_count`
- `kyverno_validating_policy_execution_duration_seconds_sum`
- `kyverno_validating_policy_execution_duration_seconds_bucket`

### Metric Value
Histogram - A float value representing the latency of the validating policy’s execution in seconds. Refer to Prometheus documentation for a detailed explanation of histograms.

### Metric Labels
| Label | Allowed Values | Description |
|---|---|---|
| `policy_background_mode` | "true", "false" | Policy’s set background mode |
| `policy_name` | | Name of the policy |
| `policy_validation_mode` | "enforce", "audit" | PolicyValidationFailure action of the rule’s parent policy |
| `resource_kind` | "Pod", "Deployment", "StatefulSet", "ReplicaSet", etc. | Kind of this resource |
| `resource_namespace` | | Namespace in which this resource lives |
| `resource_request_operation` | "create", "update", "delete" | If the requested resource is being created, updated, or deleted. |
| `execution_cause` | "admission_request", "background_scan" | Identifies whether the policy is executing in response to an admission request or a periodic background scan. |
| `result` | "PASS", "FAIL" | Result of the policy’s execution |

### Use Cases
- Track the average latencies associated with Kyverno policies’ execution over the last 24 hours to understand efficiency.
- Identify policies causing the highest latency in a specific cluster policy.

### Useful Queries
- Tracking the average latency associated with the execution of validating policies:
`avg(kyverno_validating_policy_execution_duration_seconds{})`
- Tracking the average execution latency of the deny policies:
`avg(kyverno_validating_policy_execution_duration_seconds{policy_validation_mode="Deny"})`
```

--------------------------------

### Incoming and Outgoing Pod Manifests with JMESPath Mutation

Source: https://kyverno.io/docs/policy-types/cluster-policy/jmespath

These YAML snippets demonstrate the effect of the Kyverno policy. The 'Incoming Pod' shows the original Pod definition, while the 'Outgoing Pod' shows the result after the 'add-labels' policy has been applied, highlighting the newly added 'appns' label with the correct namespace value.

```yaml
# Incoming Pod
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  containers:
    - name: busybox
      image: busybox

```

```yaml
# Outgoing Pod
apiVersion: v1
kind: Pod
metadata:
  name: mypod
  labels:
    appns: foo
spec:
  containers:
    - name: busybox
      image: busybox

```

--------------------------------

### Kyverno JP CLI Synopsis

Source: https://kyverno.io/docs/kyverno-cli/reference/kyverno_jp

The basic command structure for the kyverno jp CLI. It allows users to interact with JMESPath expressions and Kyverno-specific functions.

```bash
kyverno jp [flags]
```

--------------------------------

### Apply Policy with Context Variable Injection

Source: https://kyverno.io/docs/subprojects/kyverno-cli

Applies a policy to a resource and injects context variables defined in a values file. This enables dynamic policy behavior based on external configurations.

```bash
kyverno apply /path/to/policy1.yaml --resource /path/to/resource1.yaml -f /path/to/value.yaml
```

--------------------------------

### Apply Policy from Stdin

Source: https://kyverno.io/docs/subprojects/kyverno-cli

Applies a policy to resources piped from standard input, often used in conjunction with tools like `kustomize` to process generated resources.

```bash
kustomize build nginx/overlays/envs/prod/ | kyverno apply /path/to/policy.yaml --resource -
```

--------------------------------

### Kyverno Values File for Namespace Selector Context

Source: https://kyverno.io/docs/subprojects/kyverno-cli

Provides context for the Kyverno CLI, mapping namespace names to their associated labels. This file is crucial for the `namespaceSelector` in the `MutatingAdmissionPolicyBinding` to correctly evaluate which namespaces the policy should apply to.

```yaml
apiVersion: cli.kyverno.io/v1alpha1
kind: Value
metadata:
  name: values
namespaceSelector:
  - labels:
      environment: staging
    name: staging
  - labels:
      environment: production
    name: production
  - labels:
      environment: testing
    name: testing

```

--------------------------------

### Calculate Cleanup Resources Deleted Per Second (PromQL)

Source: https://kyverno.io/docs/reference/metrics

Calculates the number of resources deleted per second by each cleanup policy over a 5-minute interval. This query aggregates the rate of deletions by policy name, namespace, and resource kind.

```promql
sum by (policy_name, policy_namespace, resource_kind) (rate(kyverno_cleanup_controller_deletedobjects_total{}[5m]))
```

--------------------------------

### Apply Multiple Policies with Multiple Exceptions

Source: https://kyverno.io/docs/subprojects/kyverno-cli

Applies multiple policies to multiple resources, considering multiple exception files. This provides granular control over policy application and exclusion.

```bash
kyverno apply /path/to/policy1.yaml /path/to/folderFullOfPolicies --resource /path/to/resource1.yaml --resource /path/to/resource2.yaml --exception /path/to/exception1.yaml --exception /path/to/exception2.yaml
```

--------------------------------

### Apply Kyverno Policy to Resource using CLI

Source: https://kyverno.io/docs/guides/migration-to-cel

Demonstrates how to apply a Kyverno validating policy to a sample resource using the Kyverno CLI. This command checks if the resource conforms to the rules defined in the policy.

```bash
kyverno apply validating-policy.yaml --resource test-pod.yaml
```

--------------------------------

### Define Context Variable from Request Object in Kyverno

Source: https://kyverno.io/docs/policy-types/cluster-policy/variables

This example shows how to define a context variable 'objName' using a JMESPath expression to extract the value of 'request.object.metadata.name'. This is useful for referencing specific fields from the AdmissionReview request.

```yaml
context:
  - name: objName
    variable:
      jmesPath: request.object.metadata.name
```

--------------------------------

### Example Kyverno Deletion Event (Kubernetes Event)

Source: https://kyverno.io/docs/policy-types/deleting-policy

A sample Kubernetes Event object generated by Kyverno when a DeletingPolicy successfully removes a resource. This event includes details about the action, the policy involved, and the resource that was deleted.

```yaml
apiVersion: v1
kind: Event
metadata:
  name: cleanup-old-test-pods.184c935c5c7c52c0
  namespace: default
  creationTimestamp: '2025-06-26T11:13:00Z'
  resourceVersion: '3894'
  uid: 064e08ef-4547-43a3-b199-d2bbadd93b65
action: Resource Cleaned Up
reason: PolicyApplied
message: successfully deleted the target resource Pod/default/example
involvedObject:
  apiVersion: policies.kyverno.io/v1
  kind: DeletingPolicy
  name: deleting-pod
  uid: cc44fb71-9413-4bbf-bc37-036a10f02c7c
related:
  apiVersion: v1
  kind: Pod
  name: example
  namespace: default
reportingComponent: kyverno-cleanup
reportingInstance: kyverno-cleanup-kyverno-cleanup-controller-76c8b69df6-89mjj
type: Normal
```

--------------------------------

### Apply Mutation Policy and Output Mutated Resource

Source: https://kyverno.io/docs/subprojects/kyverno-cli

Applies a mutation policy to a resource and displays the resulting mutated resource in the output. This is useful for previewing changes.

```bash
kyverno apply /path/to/policy.yaml --resource /path/to/resource.yaml

applying 1 policy to 1 resource...

mutate policy <policy_name> applied to <resource_name>:
<final mutated resource output>
```

--------------------------------

### Test Policies Against Specified Local Directory (CLI)

Source: https://kyverno.io/docs/subprojects/kyverno-cli

Command to test Kyverno policies against YAML files located in a specific directory. This allows for more organized testing by targeting a particular folder containing test manifests.

```bash
kyverno test /path/to/folderContainingTestYamls

```

--------------------------------

### Apply Policy with Exception

Source: https://kyverno.io/docs/subprojects/kyverno-cli

Applies a policy to a resource while also considering a specified policy exception file. This allows for targeted exclusions from policy enforcement.

```bash
kyverno apply /path/to/policy.yaml --resource /path/to/resource.yaml --exception /path/to/exception.yaml
```

--------------------------------

### Apply Multiple Policies to Multiple Resources

Source: https://kyverno.io/docs/subprojects/kyverno-cli

Applies a set of policies (specified individually or by folder) to a set of resources (specified individually or via `--cluster`).

```bash
kyverno apply /path/to/policy1.yaml /path/to/folderFullOfPolicies --resource /path/to/resource1.yaml --resource /path/to/resource2.yaml --cluster
```

--------------------------------

### Execute Kyverno Tests

Source: https://kyverno.io/docs/subprojects/kyverno-cli

Command to execute Kyverno tests defined in `kyverno-test.yaml`. It loads policies, resources, and context, then applies policies to resources and checks the results against the expected outcomes.

```bash
$ kyverno test .

Loading test  ( kyverno-test.yaml ) ...
  Loading values/variables ...
  Loading policies ...
  Loading resources ...
  Loading exceptions ...
  Applying 1 policy to 2 resources with 0 exceptions ...
  Checking results ...


│────│────────────────────│──────│─────────────────────────│────────│────────│
│ ID │ POLICY             │ RULE │ RESOURCE                │ RESULT │ REASON │
│────│────────────────────│──────│─────────────────────────│────────│────────│
│ 1  │ disallow-host-path │      │ v1/Pod/default/bad-pod  │ Pass   │ Ok     │
│ 2  │ disallow-host-path │      │ v1/Pod/default/good-pod │ Pass   │ Ok     │
│────│────────────────────│──────│─────────────────────────│────────│────────│


Test Summary: 2 tests passed and 0 tests failed

```

--------------------------------

### Print Kyverno CLI Version

Source: https://kyverno.io/docs/kyverno-cli/reference/kyverno_version

This command prints the current version of the Kyverno CLI. It takes no arguments and has no required flags. The output is a string representing the version number.

```bash
kyverno version
```

--------------------------------

### Create Kyverno Metrics Config

Source: https://kyverno.io/docs/kyverno-cli/reference/kyverno_create_metrics-config

Generates a Kyverno metrics configuration file. This command allows specifying included and excluded namespaces, as well as a custom name for the configuration. The output can be directed to a file or standard output.

```bash
kyverno create metrics-config -i ns-included-1 -i ns-included-2 -e ns-excluded
```

--------------------------------

### Kyverno Policy Using resource.Get()

Source: https://kyverno.io/docs/subprojects/kyverno-cli

This policy `check-pod-name-from-configmap` demonstrates using the custom CEL function `resource.Get()` to fetch external resources, like a ConfigMap, from the cluster. It validates a Pod's name against a value stored in the `policy-cm` ConfigMap.

```yaml
apiVersion: policies.kyverno.io/v1alpha1
kind: ValidatingPolicy
metadata:
  name: check-pod-name-from-configmap
spec:
  matchConstraints:
    resourceRules:
      - apiGroups: ['']
        apiVersions: ['v1']
        operations: ['CREATE', 'UPDATE']
        resources: ['pods']
  variables:
    # Get the ConfigMap 'policy-cm' from the Pod's namespace.
    - name: cm
      expression: >-
        resource.Get("v1", "configmaps", object.metadata.namespace, "policy-cm")
  validations:
    # The Pod is valid only if its name matches the value from the ConfigMap.
    - expression: >-
        object.metadata.name == variables.cm.data.name

```

--------------------------------

### Define Image Matching Rules with 'matchImageReferences' in ImageValidatingPolicy

Source: https://kyverno.io/docs/policy-types/image-validating-policy

This example shows how to configure the `spec.matchImageReferences` field in an `ImageValidatingPolicy`. It allows specifying rules using glob patterns or CEL expressions to determine which container images the policy should apply to.

```yaml
apiVersion: policies.kyverno.io/v1
kind: ImageValidatingPolicy
metadata:
  name: check-images
spec:
  matchImageReferences: # At least one sub-field is required
    - glob: 'ghcr.io/kyverno/*'
    - expression: "image.registry == 'ghcr.io'"
  # ...
```

--------------------------------

### Kyverno Test Command Options

Source: https://kyverno.io/docs/kyverno-cli/reference/kyverno_test

Lists the available options for the 'kyverno test' command. These options control the test execution, output format, and filtering behavior.

```bash
      --detailed-results            If set to true, display detailed results
      --fail-only                   If set to true, display all the failing test only as output for the test command
  -f, --file-name string            Test filename (default "kyverno-test.yaml")
  -b, --git-branch string           Test github repository branch
  -h, --help                        help for test
  -o, --output-format string        Specifies the output format (json, yaml, markdown, junit)
      --registry                    If set to true, access the image registry using local docker credentials to populate external data
      --remove-color                Remove any color from output
      --require-tests               If set to true, return an error if no tests are found
  -t, --test-case-selector string   Filter test cases to run (default "policy=*,rule=*,resource=*")

```

--------------------------------

### Apply Policies with Exceptions Evaluated from Resources

Source: https://kyverno.io/docs/subprojects/kyverno-cli

Applies policies where exceptions are dynamically evaluated from provided resource files, rather than static exception definitions.

```bash
kyverno apply /path/to/policy1.yaml /path/to/folderFullOfPolicies --resource /path/to/resource1.yaml --resource /path/to/resource2.yaml --exceptions-with-resources
```

--------------------------------

### Kyverno CLI Test Execution Output

Source: https://kyverno.io/docs/subprojects/kyverno-cli

Shows the output of the `kyverno test .` command, detailing the policy testing process and the results for each resource. It includes a summary of passed and failed tests.

```text
$ kyverno test .


Loading test  ( kyverno-test.yaml ) ...
  Loading values/variables ...
  Loading policies ...
  Loading resources ...
  Loading exceptions ...
  Applying 1 policy to 6 resources ...
  Checking results ...


│────│───────────────────────────│──────│────────────────────────────────────│────────│──────────│
│ ID │ POLICY                    │ RULE │ RESOURCE                           │ RESULT │ REASON   │
│────│───────────────────────────│──────│────────────────────────────────────│────────│──────────│
│ 1  │ check-deployment-replicas │      │ Deployment/testing-deployment-1    │ Pass   │ Excluded │
│ 2  │ check-deployment-replicas │      │ Deployment/testing-deployment-2    │ Pass   │ Excluded │
│ 3  │ check-deployment-replicas │      │ Deployment/staging-deployment-1    │ Pass   │ Ok       │
│ 4  │ check-deployment-replicas │      │ Deployment/production-deployment-1 │ Pass   │ Ok       │
│ 5  │ check-deployment-replicas │      │ Deployment/staging-deployment-2    │ Pass   │ Ok       │
│ 6  │ check-deployment-replicas │      │ Deployment/production-deployment-2 │ Pass   │ Ok       │
│────│───────────────────────────│──────│────────────────────────────────────│────────│──────────│


Test Summary: 6 tests passed and 0 tests failed
```

--------------------------------

### Enable Policy Exceptions in All Namespaces (Helm)

Source: https://kyverno.io/docs/installation/upgrading

This Helm command enables policy exceptions across all namespaces, maintaining backward compatibility with prior Kyverno versions. While this ensures exceptions are enabled by default, limiting exceptions to specific namespaces is the recommended security practice.

```bash
helm upgrade kyverno kyverno/kyverno -n kyverno --set features.policyExceptions.enabled=true --set features.policyExceptions.namespace="*"
```

--------------------------------

### Configure Subresources for Kind/Subresource Matching (YAML)

Source: https://kyverno.io/docs/subprojects/kyverno-cli

This YAML configuration is used for testing subresources in the `Kind/Subresource` matching format. It requires a `subresources{}` section within the values file, specifying details for both the subresource and its parent resource.

```yaml
apiVersion: cli.kyverno.io/v1alpha1
kind: Values
metadata:
  name: values
subresources:
  - subresource:
      name: <name of subresource>
      kind: <kind of subresource>
      group: <group of subresource>
      version: <version of subresource>
    parentResource:
      name: <name of parent resource>
      kind: <kind of parent resource>
      group: <group of parent resource>
      version: <version of parent resource>

```

--------------------------------

### Define ClusterCleanupPolicy to Remove Deployments

Source: https://kyverno.io/docs/policy-types/cleanup-policy

This example defines a ClusterCleanupPolicy that targets Deployments with the label 'canremove: "true"'. It further refines the selection by deleting them only if they have less than two replicas. The policy is scheduled to run every 5 minutes.

```yaml
apiVersion: kyverno.io/v2
kind: ClusterCleanupPolicy
metadata:
  name: cleandeploy
spec:
  match:
    any:
      - resources:
          kinds:
            - Deployment
          selector:
            matchLabels:
              canremove: 'true'
  conditions:
    any:
      - key: '{{ target.spec.replicas }}'
        operator: LessThan
        value: 2
  schedule: '*/5 * * * *'

```

--------------------------------

### Apply Mutate Existing Rule with Target Resources from Directory

Source: https://kyverno.io/docs/subprojects/kyverno-cli

Runs a policy with a 'mutateExisting' rule against a primary resource and applies the changes to all target resources found within a specified directory.

```bash
kyverno apply /path/to/policy.yaml --resource /path/to/resource.yaml  --target-resources /path/to/targets/
```

--------------------------------

### Add allowPrivilegeEscalation with Conditional patchStrategicMerge in Kyverno

Source: https://kyverno.io/docs/policy-types/cluster-policy/mutate

This example demonstrates using 'foreach' with 'patchStrategicMerge' and a conditional anchor to add the 'allowPrivilegeEscalation' field to a container's security context only if it's not already present. It highlights the use of '(name)' for conditional matching.

```yaml
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: pss-migrate
spec:
  rules:
    - name: set-allowprivescalation
      match:
        any:
          - resources:
              kinds:
                - Pod
      mutate:
        foreach:
          - list: 'request.object.spec.containers[]'
            patchStrategicMerge:
              spec:
                containers:
                  - (name): '{{ element.name }}'
                    securityContext:
                      +(allowPrivilegeEscalation): false

```

--------------------------------

### Sign Image using Cosign Keyless Flow

Source: https://kyverno.io/docs/policy-types/cluster-policy/verify-images/sigstore

This command demonstrates how to sign a container image using the Cosign tool with the keyless signing flow. It requires setting the COSIGN_EXPERIMENTAL environment variable and uses ephemeral keys, prompting for OIDC identity confirmation. The generated signature can then be verified by Kyverno policies.

```bash
COSIGN_EXPERIMENTAL=1 cosign sign ghcr.io/kyverno/test-verify-image:signed-keyless

```

--------------------------------

### kyverno jp query Command Synopsis

Source: https://kyverno.io/docs/kyverno-cli/reference/kyverno_jp_query

The synopsis for the 'kyverno jp query' command, outlining its basic structure and arguments.

```bash
kyverno jp query [-i input] [-q query|query]... [flags]
```

--------------------------------

### Kyverno Cleanup Controller RBAC Rule for Deleting Resources

Source: https://kyverno.io/docs/policy-types/deleting-policy

An example Kubernetes RBAC rule defining the necessary permissions for the Kyverno cleanup controller to delete specific resources. This ensures the controller has the required privileges to perform its cleanup tasks.

```yaml
rules:
  - apiGroups: ['']
    resources: ['configmaps']
    verbs: ['get', 'list', 'watch', 'delete']
```

--------------------------------

### Test Policies Against Local Files (CLI)

Source: https://kyverno.io/docs/subprojects/kyverno-cli

Command to test Kyverno policies against a set of local YAML files in the current working directory. This is a fundamental command for validating policy behavior locally.

```bash
kyverno test .

```

--------------------------------

### Grant Kyverno Permissions to Cleanup Pods

Source: https://kyverno.io/docs/policy-types/cleanup-policy

This ClusterRole grants Kyverno the necessary permissions to perform cleanup operations on Pod resources. It allows 'get', 'watch', 'list', and 'delete' verbs on the 'pods' resource within the core API group.

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  labels:
    app.kubernetes.io/component: cleanup-controller
    app.kubernetes.io/instance: kyverno
    app.kubernetes.io/part-of: kyverno
  name: kyverno:cleanup-pods
rules:
  - apiGroups:
      - ''
    resources:
      - pods
    verbs:
      - get
      - watch
      - list
      - delete

```

--------------------------------

### Trim Prefix from String using trim_prefix() Filter

Source: https://kyverno.io/docs/policy-types/cluster-policy/jmespath

The trim_prefix() filter removes a specified prefix from the beginning of an input string. It requires the input string to start with the prefix for the trim to occur. This is useful for cleaning up URIs or other string formats where a consistent prefix needs to be removed.

```yaml
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: verify-data-volume-image
spec:
  background: false
  rules:
    - name: verify-data-volume-image
      match:
        any:
          - resources:
              kinds:
                - DataVolume
      imageExtractors:
        DataVolume:
          - path: /spec/source/registry/url
            jmesPath: "trim_prefix(@, 'docker://')"
      verifyImages:
        - imageReferences:
            - '*'
          failureAction: Enforce
          mutateDigest: true
          verifyDigest: true
          attestors:
            - entries:
                - keys:
                    publicKeys: |
                      -----BEGIN PUBLIC KEY-----
                      ...
                      -----END PUBLIC KEY-----
```

--------------------------------

### Run Kyverno Tests from Local or Remote Sources

Source: https://kyverno.io/docs/kyverno-cli/reference/kyverno_test

This command executes Kyverno tests defined in a 'kyverno-test.yaml' file. It can target a local directory or a remote Git repository. Options allow for specifying the Git branch, filtering test cases, and customizing the output.

```bash
kyverno test [local folder or git repository]... [flags]
```

--------------------------------

### Add ImagePullSecret using Global Anchor - Kyverno

Source: https://kyverno.io/docs/policy-types/cluster-policy/mutate

This policy adds an 'imagePullSecret' named 'my-secret' to any Pod whose container image starts with 'corp.reg.com/*'. It uses the global anchor to apply the mutation based on a condition related to the container image.

```yaml
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: add-imagepullsecrets
spec:
  rules:
    - name: add-imagepullsecret
      match:
        any:
          - resources:
              kinds:
                - Pod
      mutate:
        patchStrategicMerge:
          spec:
            containers:
              - <(image): 'corp.reg.com/*'
            imagePullSecrets:
              - name: my-secret

```

--------------------------------

### Kubectl Command: Dry Run Server for Policy Testing

Source: https://kyverno.io/docs/policy-types/cluster-policy/verify-images/notary

This kubectl command performs a server-side dry run to test the deployment of a pod with a signed image against Kyverno policies without actually creating the resource. It helps in validating policy enforcement.

```bash
kubectl run test --image=ghcr.io/kyverno/test-verify-image:signed --dry-run=server
pod/test created (server dry run)
```

--------------------------------

### Create ClusterRoleBinding for Kyverno ServiceAccount

Source: https://kyverno.io/docs/policy-types/cluster-policy/generate

This YAML defines a ClusterRoleBinding resource. It grants the 'admin' ClusterRole to the 'kyverno-background-controller' ServiceAccount in the 'kyverno' namespace. This is necessary for Kyverno to generate RoleBindings.

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: kyverno:generate-admin
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: admin
subjects:
  - kind: ServiceAccount
    name: kyverno-background-controller
    namespace: kyverno

```

--------------------------------

### Apply Policy Manifest to All Resources in Specific Namespace

Source: https://kyverno.io/docs/subprojects/kyverno-cli

Applies a Kyverno policy defined in 'policy.yaml' to all resources within the 'default' namespace of the live Kubernetes cluster, generating a policy report. This focuses policy application and reporting on a single namespace.

```bash
kyverno apply policy.yaml --cluster --policy-report -n default
```

--------------------------------

### Policy Definition Variable Lookup with Relative Paths

Source: https://kyverno.io/docs/policy-types/cluster-policy/variables

Shows how to use relative path-like syntax $(./../key_1/key_2) within Kyverno policy definitions to refer to other fields in the policy manifest. This allows for analyzing and comparing values without explicit definition.

```yaml
rules:
  - name: check-tcpSocket
    match:
      any:
        - resources:
            kinds:
              - Pod
    validate:
      failureAction: Enforce
      message: 'Port number for the livenessProbe must be less than that of the readinessProbe.'
      pattern:
        spec:
          ^(containers):
            - livenessProbe:
                tcpSocket:
                  port: '$(./../../../readinessProbe/tcpSocket/port)'
              readinessProbe:
                tcpSocket:
                  port: '3000'
```

--------------------------------

### Escape Tilde and Slash in JSON Patch Path

Source: https://kyverno.io/docs/policy-types/cluster-policy/mutate

This example demonstrates how to escape special characters like tilde (~) and forward slash (/) in JSON Patch paths when using RFC 6902 JSONPatch. Tilde is escaped as '~0' and forward slash as '~1'.

```yaml
- op: add
  path: /spec/template/metadata/annotations/config.linkerd.io~1skip-outbound-ports
  value: '8200'

```

--------------------------------

### UpdateRequest Resource with Cleanup TTL Label

Source: https://kyverno.io/docs/policy-types/cluster-policy/generate

An example of an UpdateRequest resource in Kubernetes that includes a 'cleanup.kyverno.io/ttl' label. This label is used by cleanup controllers to manage the lifecycle of the resource, typically by deleting it after a specified time-to-live (TTL). This functionality relies on an external cleanup controller being present in the cluster.

```yaml
apiVersion: kyverno.io/v2
kind: UpdateRequest
metadata:
  labels:
    cleanup.kyverno.io/ttl: '5m'
  # ... other metadata

```

--------------------------------

### Kyverno Policy with 'any' and 'all' Preconditions

Source: https://kyverno.io/docs/policy-types/cluster-policy/preconditions

A Kyverno ClusterPolicy showcasing the combined use of 'any' and 'all' blocks in preconditions. This policy requires the 'any' condition (color=blue OR app=busybox) to be met AND all conditions within the 'all' block (animal=cow AND env=qa) to be met for the validation to proceed.

```yaml
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: any-all-preconditions
spec:
  background: false
  rules:
    - name: any-all-rule
      match:
        any:
          - resources:
              kinds:
                - Deployment
      preconditions:
        any:
          - key: "{{ request.object.metadata.labels.color || '' }}"
            operator: Equals
            value: blue
          - key: "{{ request.object.metadata.labels.app || '' }}"
            operator: Equals
            value: busybox
        all:
          - key: "{{ request.object.metadata.labels.animal || '' }}"
            operator: Equals
            value: cow
          - key: "{{ request.object.metadata.labels.env || '' }}"
            operator: Equals
            value: qa
      validate:
        failureAction: Enforce
        message: 'Foxes must be used based on this label combination.'
        pattern:
          spec:
            template:
              spec:
                containers:
                  - name: '*foxes*'

```

--------------------------------

### View Kyverno ClusterRoles and Roles

Source: https://kyverno.io/docs/installation/customization

This command lists all ClusterRoles and Roles associated with Kyverno across all namespaces. It's useful for understanding Kyverno's default permissions and identifying which roles might need customization for additional functionality.

```bash
kubectl get clusterroles,roles -A | grep kyverno
```

--------------------------------

### List Kubernetes API Resources with kubectl

Source: https://kyverno.io/docs/policy-types/cluster-policy/external-data-sources

Uses the `kubectl api-resources` command to list all available resource types, their API versions, and whether they are namespaced. This is useful for discovering resource information.

```bash
$ kubectl api-resources
NAME                                SHORTNAMES   APIVERSION                              NAMESPACED   KIND
bindings                                         v1                                      true         Binding
componentstatuses                   cs           v1                                      false        ComponentStatus
configmaps                          cm           v1                                      true         ConfigMap
endpoints                           ep           v1                                      true         Endpoints
events                              ev           v1                                      true         Event
limitranges                         limits       v1                                      true         LimitRange
namespaces                          ns           v1                                      false        Namespace
nodes                               no           v1                                      false        Node
persistentvolumeclaims              pvc          v1                                      true         PersistentVolumeClaim
persistentvolumes                   pv           v1                                      false        PersistentVolume
pods                                po           v1                                      true         Pod
podtemplates                                     v1                                      true         PodTemplate
replicationcontrollers              rc           v1                                      true         ReplicationController
resourcequotas                      quota        v1                                      true         ResourceQuota
...
```

--------------------------------

### Kyverno Parent Command Options

Source: https://kyverno.io/docs/kyverno-cli/reference/kyverno_test

Details options inherited from parent commands that can be applied to the 'kyverno test' command. These relate to logging and Kubernetes configuration.

```bash
      --add_dir_header                   If true, adds the file directory to the header of the log messages
      --alsologtostderr                  log to standard error as well as files (no effect when -logtostderr=true)
      --kubeconfig string                Paths to a kubeconfig. Only required if out-of-cluster.
      --log_backtrace_at traceLocation   when logging hits line file:N, emit a stack trace (default :0)
      --log_dir string                   If non-empty, write log files in this directory (no effect when -logtostderr=true)
      --log_file string                  If non-empty, use this log file (no effect when -logtostderr=true)
      --log_file_max_size uint           Defines the maximum size a log file can grow to (no effect when -logtostderr=true). Unit is megabytes. If the value is 0, the maximum file size is unlimited. (default 1800)
      --logtostderr                      log to standard error instead of files (default true)
      --one_output                       If true, only write logs to their native severity level (vs also writing to each lower severity level; no effect when -logtostderr=true)
      --skip_headers                     If true, avoid header prefixes in the log messages
      --skip_log_headers                 If true, avoid headers when opening log files (no effect when -logtostderr=true)
      --stderrthreshold severity       logs at or above this threshold go to stderr when writing to files and stderr (no effect when -logtostderr=true or -alsologtostderr=true) (default 2)
  -v, --v Level                          number for the log level verbosity
      --vmodule moduleSpec               comma-separated list of pattern=N settings for file-filtered logging

```

--------------------------------

### Pod Security Violation Error Message (Baseline)

Source: https://kyverno.io/docs/policy-types/cluster-policy/validate

This is an example of the error message returned by the Kubernetes API server when a Pod violates the Pod Security baseline profile enforced by Kyverno. It details the policy, rule, violated profile, and specific control (`hostIPC=true`).

```text
Error from server: error when creating "bad.yaml": admission webhook "validate.kyverno.svc-fail" denied the request:

policy Pod/default/badpod01 for resource violation:

psa:
  baseline: |
    Validation rule 'baseline' failed. It violates PodSecurity "baseline:latest": ({Allowed:false ForbiddenReason:host namespaces ForbiddenDetail:hostIPC=true})

```

--------------------------------

### Kyverno Test Execution Output

Source: https://kyverno.io/docs/subprojects/kyverno-cli

This output shows the results of running the Kyverno test command. It details the loading process, policy application, and the final test summary, indicating that 2 tests passed and 0 failed.

```text
Loading test  ( kyverno-test.yaml ) ...
  Loading values/variables ...
  Loading policies ...
  Loading resources ...
  Loading exceptions ...
  Applying 1 policy to 3 resources with 0 exceptions ...
  Checking results ...


│────│────────────────────────│──────│──────────────────────────────────────│────────│────────│
│ ID │ POLICY                 │ RULE │ RESOURCE                             │ RESULT │ REASON │
│────│────────────────────────│──────│──────────────────────────────────────│────────│────────│
│ 1  │ add-label-to-configmap │      │ v1/ConfigMap/staging/matched-cm-1    │ Pass   │ Ok     │
│ 2  │ add-label-to-configmap │      │ v1/ConfigMap/production/matched-cm-2 │ Pass   │ Ok     │
│────│────────────────────────│──────│──────────────────────────────────────│────────│────────│


Test Summary: 2 tests passed and 0 tests failed


```

--------------------------------

### Apply Policy with Audit Warnings Enabled

Source: https://kyverno.io/docs/subprojects/kyverno-cli

Applies a policy to a resource and configures 'Audit' actions to produce warnings instead of failures. This is useful for non-blocking policy checks.

```bash
kyverno apply /path/to/policy.yaml --resource /path/to/resource.yaml --audit-warn
```

--------------------------------

### Kyverno ClusterPolicy with FailureActionOverrides

Source: https://kyverno.io/docs/policy-types/cluster-policy/validate

This example demonstrates a Kyverno ClusterPolicy that uses `failureActionOverrides` to apply different admission control actions based on the namespace. It specifies an 'Enforce' action for the 'default' namespace and an 'Audit' action for the 'test' namespace, while other namespaces default to the main `failureAction`.

```yaml
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: check-label-app
spec:
  rules:
    - name: check-label-app
      match:
        any:
          - resources:
              kinds:
                - Pod
      validate:
        failureAction: Audit
        failureActionOverrides:
          - action: Enforce # Action to apply
            namespaces: # List of affected namespaces
              - default
          - action: Audit
            namespaces:
              - test
        message: 'The label `app` is required.'
        pattern:
          metadata:
            labels:
              app: '?*'

```

--------------------------------

### Check for HostPath Volumes in Pods (YAML)

Source: https://kyverno.io/docs/policy-types/cluster-policy/preconditions

This rule checks Pods and uses a precondition to ensure that if any hostPath volumes are present, the rule proceeds. It showcases the use of context variables and JMESPath to extract information (volume names) and then evaluate a condition based on the length of the resulting array.

```yaml
rules:
  - name: check-hostpaths
    match:
      any:
        - resources:
            kinds:
              - Pod
    context:
      - name: hostpathvolnames
        variable:
          jmesPath: request.object.spec.volumes[?hostPath].name
          default: []
    preconditions:
      all:
        - key: '{{ length(hostpathvolnames) }}'
          operator: GreaterThan
          value: 0
```

--------------------------------

### Kyverno Namespace Selector in Values File

Source: https://kyverno.io/docs/subprojects/kyverno-cli

Shows how to specify namespace selectors within a Kyverno values file. This allows for dynamic selection of namespaces based on labels for policy testing.

```yaml
apiVersion: cli.kyverno.io/v1alpha1
kind: Values
metadata:
  name: values
namespaceSelector:
  - name: test1
    labels:
      foo.com/managed-state: managed

```

--------------------------------

### CEL-based ValidatingPolicy Structure Example

Source: https://kyverno.io/docs/guides/migration-to-cel

Illustrates the structure of a Kyverno CEL-based ValidatingPolicy. This policy type focuses on a single action (validation) and uses CEL expressions for defining validation logic. It matches specific resource rules and defines validation actions.

```yaml
apiVersion: policies.kyverno.io/v1
kind: ValidatingPolicy
metadata:
  name: require-app-version-labels
spec:
  matchConstraints:
    resourceRules:
      - apiGroups:
          - ''
        apiVersions:
          - v1
        operations:
          - CREATE
          - UPDATE
        resources:
          - pods
  validationActions:
    - Deny
  validations:
    - expression: >
        ['app', 'version'].all(label,
          object.metadata.?labels[label].orValue('') != ''
        )
      message: 'Required labels missing'

```

--------------------------------

### Calculate Time Difference with time_since

Source: https://kyverno.io/docs/policy-types/cluster-policy/jmespath

The time_since() filter calculates the duration between a start and end time. The times can be in RFC3339 format or a user-defined format supported by Go's time.Parse(). The end time can be an empty string to represent the current time. The output is always in hours, minutes, and seconds.

```yaml
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: time-since-demo
spec:
  rules:
    - name: block-stale-images
      match:
        any:
          - resources:
              kinds:
                - Pod
      validate:
        failureAction: Audit
        message: 'Images built more than 6 months ago are prohibited.'
        foreach:
          - list: 'request.object.spec.containers'
            context:
              - name: imageData
                imageRegistry:
                  reference: '{{ element.image }}'
            deny:
              conditions:
                all:
                  - key: "{{ time_since('', '{{ imageData.configData.created }}', '') }}"
                    operator: GreaterThan
                    value: 4380h

```

--------------------------------

### Conditional Mutation with Anchors in Kyverno

Source: https://kyverno.io/docs/policy-types/cluster-policy/mutate

This policy shows how to conditionally mutate a field based on a pattern. It targets Endpoints and uses a conditional anchor `(name): 'secure*'` to modify the `port` field only if the port name starts with 'secure'. This ensures the mutation is applied selectively.

```yaml
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: policy-set-port
spec:
  rules:
    - name: set-port
      match:
        any:
          - resources:
              kinds:
                - Endpoints
      mutate:
        patchStrategicMerge:
          subsets:
            - ports:
                - (name): 'secure*'
                  port: 6443

```

--------------------------------

### Fetching Kubernetes Resources with Field Selector

Source: https://kyverno.io/docs/policy-types/cluster-policy/external-data-sources

This command uses `kubectl` to query all Services in the 'default' namespace, filtering by a specific field selector `metadata.name=foo`. Even if no Service matches the selector, the API call will succeed and return an empty `items` list within the `ServiceList` object, unlike fetching a specific resource by name.

```bash
$ kubectl get --raw /api/v1/namespaces/default/services?fieldSelector=metadata.name=foo | jq
{
  "kind": "ServiceList",
  "apiVersion": "v1",
  "metadata": {
    "resourceVersion": "167567"
  },
  "items": []
}
```

--------------------------------

### Perform live Kubernetes API checks using resource.Post()

Source: https://kyverno.io/docs/policy-types/cel-libraries

The `resource.Post()` function allows for live interactions with the Kubernetes API, such as performing SubjectAccessReview checks. It sends a POST request to a specified API endpoint with a given payload. This is crucial for implementing policies that require real-time authorization or status checks before allowing or denying an operation.

```cel
resource.Post("authorization.k8s.io/v1", "subjectaccessreviews", {…})
```

--------------------------------

### Kyverno Policy with messageExpression for Dynamic Messages

Source: https://kyverno.io/docs/policy-types/validating-policy

This YAML policy demonstrates the use of messageExpression to create dynamic failure messages based on Kubernetes object labels. If the 'environment' label is missing on a deployment, a contextual error message is generated. This policy requires Kyverno to be installed.

```yaml
apiVersion: policies.kyverno.io/v1
kind: ValidatingPolicy
metadata:
  name: check-deployment-labels
  annotations:
    policies.kyverno.io/title: Check Deployment Labels
    policies.kyverno.io/category: Other
    policies.kyverno.io/severity: medium
spec:
  validationActions:
    - Audit
  matchConstraints:
    resourceRules:
      - apiGroups: [apps]
        apiVersions: [v1]
        operations: [CREATE, UPDATE]
        resources: [deployments]
  validations:
    - expression: >-
        'environment' in object.metadata.labels
      messageExpression: >-
        "Deployment " + object.metadata.name + " is missing required label 'environment'"
      message: Deployment is missing required label

```

--------------------------------

### Kubernetes Resource: ConfigMap Manifest

Source: https://kyverno.io/docs/subprojects/kyverno-cli

A standard Kubernetes ConfigMap manifest named 'game-demo'. It contains basic data and an initial label 'app: game'. This resource will be the target for the mutation policy.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: game-demo
  labels:
    app: game
data:
  player_initial_lives: '3'

```

--------------------------------

### Deploy Ingress NGINX Controller

Source: https://kyverno.io/docs/guides/tracing

This command deploys the ingress-nginx controller to the Kubernetes cluster. It applies a manifest from a remote URL and then waits for the controller pods to become ready, ensuring the ingress is operational.

```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/kind/deploy.yaml
sleep 15
kubectl wait --namespace ingress-nginx --for=condition=ready pod --selector=app.kubernetes.io/component=controller --timeout=90s

```

--------------------------------

### Validate Namespace Label with Kyverno ClusterPolicy

Source: https://kyverno.io/docs/policy-types/cluster-policy/validate

This example demonstrates a Kyverno `ClusterPolicy` that enforces a specific label (`purpose: production`) on all newly created Namespaces. It uses the `validate` rule type with `Enforce` failure action. If the label is missing or incorrect, the creation of the Namespace is blocked.

```yaml
apiVersion: kyverno.io/v1
# The `ClusterPolicy` kind applies to the entire cluster.
kind: ClusterPolicy
metadata:
  name: require-ns-purpose-label
# The `spec` defines properties of the policy.
spec:
  # The `rules` is one or more rules which must be true.
  rules:
    - name: require-ns-purpose-label
      # The `match` statement sets the scope of what will be checked. In this case, it is any `Namespace` resource.
      match:
        any:
          - resources:
              kinds:
                - Namespace
      # The `validate` statement tries to positively check what is defined. If the statement, when compared with the requested resource, is true, it is allowed. If false, it is blocked.
      validate:
        # The `failureAction` tells Kyverno if the resource being validated should be allowed but reported (`Audit`) or blocked (`Enforce`).
        failureAction: Enforce
        # The `message` is what gets displayed to a user if this rule fails validation.
        message: 'You must have label `purpose` with value `production` set on all new namespaces.'
        # The `pattern` object defines what pattern will be checked in the resource. In this case, it is looking for `metadata.labels` with `purpose=production`.
        pattern:
          metadata:
            labels:
              purpose: production

```

--------------------------------

### Configure Kyverno Trust with Host Certificate Mount (Helm Volume Method)

Source: https://kyverno.io/docs/policy-types/cluster-policy/verify-images/sigstore

This snippet shows how to configure Kyverno to trust custom Certificate Authorities by mounting the host's certificate store using Helm values. This method is beneficial when using a mix of internal and public registries, assuming the host nodes already trust both.

```yaml
global:
  caCertificates:
    volume:
      hostPath:
        path: /etc/ssl/certs/ca-certificates.crt
        type: File
```

--------------------------------

### Resource Manifest: ConfigMap (YAML)

Source: https://kyverno.io/docs/subprojects/kyverno-cli

This is a standard Kubernetes ConfigMap resource manifest. It defines a ConfigMap named 'game-demo' with some initial data and a label 'app: game'. This resource will be the target for the MutatingAdmissionPolicy.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: game-demo
  labels:
    app: game
data:
  player_initial_lives: '3'
```

--------------------------------

### Verify Kubernetes Webhook Configurations (kubectl)

Source: https://kyverno.io/docs/guides/troubleshooting

This command lists all validating and mutating webhook configurations in the cluster. It's crucial for ensuring that Kyverno has successfully registered its webhooks with Kubernetes admission controllers.

```bash
$ kubectl get validatingwebhookconfigurations,mutatingwebhookconfigurations
 NAME                                                                                                        WEBHOOKS       AGE
 validatingwebhookconfiguration.admissionregistration.k8s.io/kyverno-cleanup-validating-webhook-cfg             1          5d21h
 validatingwebhookconfiguration.admissionregistration.k8s.io/kyverno-policy-validating-webhook-cfg              1          5d21h
 validatingwebhookconfiguration.admissionregistration.k8s.io/kyverno-exception-validating-webhook-cfg           1          5d21h
 validatingwebhookconfiguration.admissionregistration.k8s.io/kyverno-resource-validating-webhook-cfg            1          5d21h
 validatingwebhookconfiguration.admissionregistration.k8s.io/kyverno-global-context-validating-webhook-cfg      1          5d21h
 validatingwebhookconfiguration.admissionregistration.k8s.io/kyverno-ttl-validating-webhook-cfg                 1          5d21h

 NAME                                                                                              WEBHOOKS   AGE
 mutatingwebhookconfiguration.admissionregistration.k8s.io/kyverno-policy-mutating-webhook-cfg     1          5d21h
 mutatingwebhookconfiguration.admissionregistration.k8s.io/kyverno-verify-mutating-webhook-cfg     1          5d21h
 mutatingwebhookconfiguration.admissionregistration.k8s.io/kyverno-resource-mutating-webhook-cfg   1          5d21h
```

--------------------------------

### Fetching a Specific Kubernetes Resource by Name

Source: https://kyverno.io/docs/policy-types/cluster-policy/external-data-sources

This command attempts to retrieve a specific Kubernetes Service resource named 'foo' from the 'default' namespace. If the resource does not exist, it will result in a 'NotFound' error from the Kubernetes API server.

```bash
$ kubectl get --raw /api/v1/namespaces/default/services/foo
Error from server (NotFound): services "foo" not found
```

--------------------------------

### Get Current Time (RFC 3339) with time_now()

Source: https://kyverno.io/docs/policy-types/cluster-policy/jmespath

The `time_now()` filter returns the current time as known by the Kubernetes Node in RFC 3339 format. It takes no inputs and always outputs an absolute time string. This can be useful for setting creation timestamps or scheduling actions relative to the current time.

```yaml
apiVersion: kyverno.io/v2beta1
kind: ClusterPolicy
metadata:
  name: automate-cleanup
spec:
  background: false
  rules:
    - name: cleanup
      match:
        any:
          - resources:
              kinds:
                - PolicyException
              namespaces:
                - foo
      generate:
        apiVersion: kyverno.io/v2alpha1
        kind: ClusterCleanupPolicy
        name: polex-{{ request.namespace }}-{{ request.object.metadata.name }}-{{ random('[0-9a-z]{8}') }}
        synchronize: false
        data:
          metadata:
            labels:
              kyverno.io/automated: 'true'
          spec:
            schedule: "{{ time_add('{{ time_now() }}','4h') | time_to_cron(@) }}"
            match:
              any:
                - resources:
                    kinds:
                      - PolicyException
                    namespaces:
                      - '{{ request.namespace }}'
                    names:
                      - '{{ request.object.metadata.name }}'

```

--------------------------------

### Kyverno Policy with 'any' Precondition

Source: https://kyverno.io/docs/policy-types/cluster-policy/preconditions

A Kyverno ClusterPolicy demonstrating the use of an 'any' block in preconditions. This policy triggers validation if either the 'color' label is 'blue' OR the 'app' label is 'busybox'. It requires the JMESPath syntax for handling potentially missing labels.

```yaml
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: any-all-preconditions
spec:
  background: false
  rules:
    - name: any-all-rule
      match:
        any:
          - resources:
              kinds:
                - Deployment
      preconditions:
        any:
          - key: "{{ request.object.metadata.labels.color || '' }}"
            operator: Equals
            value: blue
          - key: "{{ request.object.metadata.labels.app || '' }}"
            operator: Equals
            value: busybox
      validate:
        failureAction: Enforce
        message: 'Busybox must be used based on this label combination.'
        pattern:
          spec:
            template:
              spec:
                containers:
                  - name: '*busybox*'

```

--------------------------------

### Match Deployments in Namespaces with Label Expressions (Kyverno YAML)

Source: https://kyverno.io/docs/policy-types/cluster-policy/match-exclude

This snippet selects Deployments within Namespaces that have labels matching 'type=connector' or 'type=compute'. It uses `namespaceSelector` with `matchExpressions` and the `In` operator for selecting multiple namespace label values.

```yaml
spec:
  rules:
    - name: check-min-replicas
      match:
        any:
          # AND across resources and selector
          - resources:
              # OR inside list of kinds
              kinds:
                - Deployment
              operations:
                - CREATE
                - UPDATE
              namespaceSelector:
                matchExpressions:
                  - key: type
                    operator: In
                    values:
                      - connector
                      - compute

```

--------------------------------

### Kyverno CLI Usage

Source: https://kyverno.io/docs/kyverno-cli/reference/kyverno

The basic command structure for interacting with the Kyverno CLI. This command is used to execute various Kyverno operations.

```bash
kyverno [flags]
```

--------------------------------

### Test Policies Against Git Repository Branch (CLI)

Source: https://kyverno.io/docs/subprojects/kyverno-cli

Command to test Kyverno policies directly from a Git repository. It allows specifying a branch name to test against; if no branch is specified, it defaults to 'main'.

```bash
kyverno test https://github.com/kyverno/policies/release-1.6

```

--------------------------------

### Exempt InitContainers with Specific Capabilities for Istio/Linkerd

Source: https://kyverno.io/docs/guides/exceptions

This PolicyException exempts initContainers using Istio or Linkerd images from the 'Capabilities' control within the 'baseline' rule of the 'psa' policy. It specifically allows 'NET_ADMIN' and 'NET_RAW' capabilities for `spec.initContainers[*].securityContext.capabilities.add`.

```yaml
apiVersion: kyverno.io/v2
kind: PolicyException
metadata:
  name: pod-security-exception
  namespace: policy-exception-ns
spec:
  exceptions:
    - policyName: psa
      ruleNames:
        - baseline
  match:
    any:
      - resources:
          kinds:
            - Pod
  podSecurity:
    - controlName: Capabilities
      images:
        - '*/istio/proxyv2*'
        - '*/linkerd/proxy-init*'
      restrictedField: spec.initContainers[*].securityContext.capabilities.add
      values:
        - NET_ADMIN
        - NET_RAW

```

--------------------------------

### Find Deployment Resource API Group with kubectl

Source: https://kyverno.io/docs/policy-types/cluster-policy/external-data-sources

Demonstrates how to use `kubectl api-resources` combined with `grep` to find the API group for a specific resource type, in this case, 'Deployment'.

```bash
kubectl api-resources | grep deploy
```

--------------------------------

### Select Pods in Namespaces with Specific Labels (Kyverno YAML)

Source: https://kyverno.io/docs/policy-types/cluster-policy/match-exclude

This snippet demonstrates how to select Pods residing in Namespaces that have a specific label, 'organization: engineering'. It utilizes the `namespaceSelector` with `matchLabels` for straightforward label matching.

```yaml
match:
  any:
    - resources:
        kinds:
          - Pod
        namespaceSelector:
          matchLabels:
            organization: engineering

```

--------------------------------

### Apply Policy Manifest to Named Resources in Specific Namespace

Source: https://kyverno.io/docs/subprojects/kyverno-cli

Applies a Kyverno policy defined in 'policy.yaml' to specific resources named 'nginx1' and 'nginx2' within the 'default' namespace of the live Kubernetes cluster, generating a policy report. This targets specific resources within a particular namespace.

```bash
kyverno apply policy.yaml -r nginx1 -r nginx2 --cluster --policy-report -n default
```

--------------------------------

### Configure UpdateRequest Cleanup via Helm

Source: https://kyverno.io/docs/policy-types/cluster-policy/generate

This Helm configuration snippet enables automatic cleanup of `UpdateRequest` resources and sets a Time-to-Live (TTL) of 5 minutes. This helps manage the accumulation of `UpdateRequest` resources in large clusters.

```yaml
config:
  enableUpdateRequestCleanup: true
  updateRequestCleanupTTL: '5m' # Clean up after 5 minutes

```

--------------------------------

### Kyverno Test Manifest for Mutation Policy

Source: https://kyverno.io/docs/subprojects/kyverno-cli

This test manifest defines a test case for the Kyverno mutation policy. It specifies the policy file, resource file, and variable file to be used, along with the expected outcome. The 'results' section asserts that the policy should pass for the specified resources.

```yaml
apiVersion: kyverno.io/v1
kind: Test
metadata:
  name: test
policies:
  - policy.yaml
resources:
  - resource.yaml
results:
  - isMutatingAdmissionPolicy: true
    kind: ConfigMap
    patchedResources: patched-resource.yaml
    policy: add-label-to-configmap
    resources:
      - matched-cm-1
      - matched-cm-2
    result: pass
variables: values.yaml

```

--------------------------------

### Apply Mutate Existing Rule with Target Resources

Source: https://kyverno.io/docs/subprojects/kyverno-cli

Runs a policy with a 'mutateExisting' rule against a primary resource and applies the changes to a list of specified target resources.

```bash
kyverno apply /path/to/policy.yaml --resource /path/to/resource.yaml  --target-resource /path/to/target1.yaml --target-resource /path/to/target2.yaml
```

--------------------------------

### Kubernetes ConfigMap Resources for Testing

Source: https://kyverno.io/docs/subprojects/kyverno-cli

Contains three ConfigMap resources. Two are in 'staging' and 'production' namespaces, which should be mutated by the policy. One is in the 'testing' namespace and should remain unchanged.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: matched-cm-1
  namespace: staging
  labels:
    color: red
data:
  player_initial_lives: '3'
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: matched-cm-2
  namespace: production
  labels:
    color: red
data:
  player_initial_lives: '3'
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: unmatched-cm
  namespace: testing
  labels:
    color: blue
data:
  player_initial_lives: '3'

```

--------------------------------

### Verify Image Signatures with Kyverno Policy (YAML)

Source: https://kyverno.io/docs/policy-types/cluster-policy/verify-images/notary

This policy verifies if a container image is signed with a valid X.509 key matching the provided public certificate. It uses Kyverno's `verifyImages` rule type and requires the 'Notary' attestation type. The policy enforces signature verification and can block pods with unsigned images.

```yaml
apiVersion: kyverno.io/v2beta1
kind: ClusterPolicy
metadata:
  name: check-image-notary
spec:
  webhookConfiguration:
    failurePolicy: Fail
    timeoutSeconds: 30
  rules:
    - name: verify-signature-notary
      match:
        any:
          - resources:
              kinds:
                - Pod
      verifyImages:
        - type: Notary
          imageReferences:
            - 'ghcr.io/kyverno/test-verify-image*'
          failureAction: Enforce
          attestors:
            - count: 1
              entries:
                - certificates:
                    cert: |-
                      -----BEGIN CERTIFICATE-----
                      MIIDTTCCAjWgAwIBAgIJAPI+zAzn4s0xMA0GCSqGSIb3DQEBCwUAMEwxCzAJBgNV
                      BAYTAlVTMQswCQYDVQQIDAJXQTEQMA4GA1UEBwwHU2VhdHRsZTEPMA0GA1UECgwG
                      Tm90YXJ5MQ0wCwYDVQQDDAR0ZXN0MB4XDTIzMDUyMjIxMTUxOFoXDTMzMDUxOTIx
                      MTUxOFowTDELMAkGA1UEBhMCVVMxCzAJBgNVBAgMAldBMRAwDgYDVQQHDAdTZWF0
                      dGxlMQ8wDQYDVQQKDAZOb3RhcnkxDTALBgNVBAMMBHRlc3QwggEiMA0GCSqGSIb3
                      DQEBAQUAA4IBDwAwggEKAoIBAQDNhTwv+QMk7jEHufFfIFlBjn2NiJaYPgL4eBS+
                      b+o37ve5Zn9nzRppV6kGsa161r9s2KkLXmJrojNy6vo9a6g6RtZ3F6xKiWLUmbAL
                      hVTCfYw/2n7xNlVMjyyUpE+7e193PF8HfQrfDFxe2JnX5LHtGe+X9vdvo2l41R6m
                      Iia04DvpMdG4+da2tKPzXIuLUz/FDb6IODO3+qsqQLwEKmmUee+KX+3yw8I6G1y0
                      Vp0mnHfsfutlHeG8gazCDlzEsuD4QJ9BKeRf2Vrb0ywqNLkGCbcCWF2H5Q80Iq/f
                      ETVO9z88R7WheVdEjUB8UrY7ZMLdADM14IPhY2Y+tLaSzEVZAgMBAAGjMjAwMAkG
                      A1UdEwQCMAAwDgYDVR0PAQH/BAQDAgeAMBMGA1UdJQQMMAoGCCsGAQUFBwMDMA0G
                      CSqGSIb3DQEBCwUAA4IBAQBX7x4Ucre8AIUmXZ5PUK/zUBVOrZZzR1YE8w86J4X9
                      kYeTtlijf9i2LTZMfGuG0dEVFN4ae3CCpBst+ilhIndnoxTyzP+sNy4RCRQ2Y/k8
                      Zq235KIh7uucq96PL0qsF9s2RpTKXxyOGdtp9+HO0Ty5txJE2txtLDUIVPK5WNDF
                      ByCEQNhtHgN6V20b8KU2oLBZ9vyB8V010dQz0NRTDLhkcvJig00535/LUylECYAJ
                      5/jn6XKt6UYCQJbVNzBg/YPGc1RF4xdsGVDBben/JXpeGEmkdmXPILTKd9tZ5TC0
                      uOKpF5rWAruB5PCIrquamOejpXV9aQA/K2JQDuc0mcKz
                      -----END CERTIFICATE-----
```

--------------------------------

### Nested JMESPath Lookup from ConfigMap and AdmissionReview in Kyverno

Source: https://kyverno.io/docs/policy-types/cluster-policy/variables

This Kyverno ClusterPolicy example shows a nested JMESPath lookup. It fetches data from a ConfigMap ('LabelsCM') and uses an inner expression ('{{ request.object.metadata.labels.app }}') to dynamically construct the outer expression, allowing for dynamic annotation based on resource labels and ConfigMap data.

```yaml
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: resource-annotater
spec:
  background: false
  rules:
    - name: add-resource-annotations
      context:
        - name: LabelsCM
          configMap:
            name: resource-annotater-reference
            namespace: default
      match:
        any:
          - resources:
              kinds:
                - Pod
      mutate:
        patchStrategicMerge:
          metadata:
            annotations:
              foo: '{{LabelsCM.data.{{ request.object.metadata.labels.app }}}}'
```

--------------------------------

### Generate PodDisruptionBudget for Deployments

Source: https://kyverno.io/docs/policy-types/cluster-policy/generate

This policy creates a `PodDisruptionBudget` for existing and new `Deployment` resources, excluding those in the `local-path-storage` namespace. It uses `generateExisting: true` and synchronizes the generated resource. Note that this may require additional permissions.

```yaml
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: create-default-pdb
spec:
  rules:
    - name: create-default-pdb
      match:
        any:
          - resources:
              kinds:
                - Deployment
      exclude:
        resources:
          namespaces:
            - local-path-storage
      generate:
        generateExisting: true
        apiVersion: policy/v1
        kind: PodDisruptionBudget
        name: '{{request.object.metadata.name}}-default-pdb'
        namespace: '{{request.object.metadata.namespace}}'
        synchronize: true
        data:
          spec:
            minAvailable: 1
            selector:
              matchLabels: '{{request.object.metadata.labels}}'

```

--------------------------------

### Kyverno random Filter for Generating Random Strings

Source: https://kyverno.io/docs/policy-types/cluster-policy/jmespath

The `random()` filter generates random string data based on a regex pattern and length. It's useful for creating unique resource names, Pod hashes, auth tokens, license keys, and GUIDs. Complex outputs can be achieved by chaining multiple pattern and length combinations.

```yaml
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: ver-test
spec:
  rules:
    - name: test-ver-ver
      match:
        any:
          - resources:
              kinds:
                - Secret
              operations:
                - CREATE
      context:
        - name: randomtest
          variable:
            jmesPath: random('[a-z0-9]{6}')
      mutate:
        patchStrategicMerge:
          metadata:
            labels:
              randomoutput: random-{{randomtest}}

```

--------------------------------

### Querying Pod Containers with JMESPath

Source: https://kyverno.io/docs/policy-types/cluster-policy/jmespath

This snippet shows how to use the Kyverno CLI with JMESPath to query the 'spec.containers[]' array in a Pod YAML file. It returns an array of container objects.

```bash
$ kyverno jp query -i pod.yaml "spec.containers[]"
[
  {
    "image": "busybox",
    "name": "busybox"
  },
  {
    "image": "nginx",
    "name": "nginx"
  }
]
```

--------------------------------

### Kyverno Auto-Generated Pattern for Namespace

Source: https://kyverno.io/docs/policy-types/cluster-policy/autogen

This snippet illustrates how Kyverno auto-generates a pattern for Pod controllers when a rule targets the namespace. It shows the translated pattern for Deployments, which includes `spec.template.metadata.namespace`, differing from the intended `metadata.namespace`.

```yaml
pattern:
  spec:
    template:
      metadata:
        namespace: '!default'

```

--------------------------------

### List Kubernetes API Versions with kubectl

Source: https://kyverno.io/docs/policy-types/cluster-policy/external-data-sources

Uses the `kubectl api-versions` command to list all available API groups and their supported versions. This helps in determining the correct API version to use in URL paths.

```bash
$ kubectl api-versions
admissionregistration.k8s.io/v1
admissionregistration.k8s.io/v1alpha1
apiextensions.k8s.io/v1
apiregistration.k8s.io/v1
apps/v1
authentication.k8s.io/v1
authorization.k8s.io/v1
autoscaling/v1
autoscaling/v2
batch/v1
certificates.k8s.io/v1
coordination.k8s.io/v1
...

```

--------------------------------

### External Service API Call with CA Bundle

Source: https://kyverno.io/docs/policy-types/cluster-policy/external-data-sources

Configures a GlobalContextEntry to call an external service, such as Redis, using GET method. It includes a refresh interval and an optional CA bundle for secure communication. The data is cached and refreshed periodically.

```yaml
apiVersion: kyverno.io/v2alpha1
kind: GlobalContextEntry
metadata:
  name: redisdata
spec:
  apiCall:
    method: GET
    refreshInterval: 1m
    service:
      url: https://redis.myns.svc:6379
      caBundle: |-
        -----BEGIN CERTIFICATE-----
        MIIBdjCCAR2gAwIBAgIBADAKBggqhkjOPQQDAjAjMSEwHwYDVQQDDBhrM3Mtc2Vy
        <snip>
        W/LgVuvZmucCIBcETS4DIw2pWAfeKRDaEOi2YsJoDpWd7lFLQBUbe4G7
        -----END CERTIFICATE-----

```

--------------------------------

### Kyverno Policy: Perform SubjectAccessReview with resource.Post()

Source: https://kyverno.io/docs/policy-types/cel-libraries

This Kyverno policy illustrates the use of `resource.Post()` to perform a live SubjectAccessReview against the Kubernetes API. It checks if the user attempting to create or update a ConfigMap has the 'delete' permission on namespaces. If not authorized, the operation is denied.

```yaml
apiVersion: policies.kyverno.io/v1
kind: ValidatingPolicy
metadata:
  name: check-subjectaccessreview
spec:
  validationActions:
    - Deny
  matchConstraints:
    resourceRules:
      - apiGroups: ['']
        apiVersions: [v1]
        operations: [CREATE, UPDATE]
        resources: [configmaps]
  variables:
    - name: res
      expression: >-
        {
          "kind": dyn("SubjectAccessReview"),
          "apiVersion": dyn("authorization.k8s.io/v1"),
          "spec": dyn({
            "resourceAttributes": dyn({
              "resource": "namespaces",
              "namespace": string(object.metadata.namespace),
              "verb": "delete",
              "group": ""
            }),
            "user": dyn(request.userInfo.username)
          })
        }
    - name: subjectaccessreview
      expression: >-
        resource.Post("authorization.k8s.io/v1", "subjectaccessreviews", variables.res)
  validations:
    - expression: >-
        has(variables.subjectaccessreview.status) && variables.subjectaccessreview.status.allowed == true
      message: >-
        User is not authorized.


```

--------------------------------

### Configurable Deployment Replica Limit with Parameter Resources

Source: https://kyverno.io/docs/policy-types/cluster-policy/validate

This policy demonstrates using parameter resources to make the replica limit configurable for Deployments. It defines a `paramKind` and `paramRef` to reference an external parameter resource, `ReplicaLimit`, which specifies the maximum allowed replicas.

```yaml
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: check-deployment-replicas
spec:
  background: false
  rules:
    - name: check-deployment-replicas
      match:
        any:
          - resources:
              kinds:
                - Deployment
      validate:
        failureAction: Enforce
        cel:
          paramKind:
            apiVersion: rules.example.com/v1
            kind: ReplicaLimit
          paramRef:
            name: 'replica-limit'
            parameterNotFoundAction: 'Deny'
          expressions:
            - expression: 'object.spec.replicas < params.maxReplicas'
              messageExpression: "'Deployment spec.replicas must be less than ' + string(params.maxReplicas)"
```

--------------------------------

### Kyverno Test Declaration Structure (kyverno-test.yaml)

Source: https://kyverno.io/docs/subprojects/kyverno-cli

Defines the structure for a Kyverno test declaration file. It includes sections for policies, resources, exceptions, variables, userinfo, context, results, and checks. This file is used to specify the test environment and expected outcomes for Kyverno policies.

```yaml
apiVersion: cli.kyverno.io/v1alpha1
kind: Test
metadata:
  name: kyverno-test
policies:
  - <path/to/policy.yaml>
  - <path/to/policy.yaml>
resources:
  - <path/to/resource.yaml>
  - <path/to/resource.yaml>
targetResources: # optional key for specifying target resources when testing for mutate existing rules
  - <path/to/target-resource.yaml>
  - <path/to/target-resource.yaml>
exceptions: # optional files for specifying exceptions. See below for an example.
  - <path/to/exception.yaml>
  - <path/to/exception.yaml>
variables: variables.yaml # optional file for declaring variables. see below for example.
userinfo: user_info.yaml # optional file for declaring admission request information (roles, cluster roles and subjects). see below for example.
context: context.yaml # optional file for declaring context variables. It is used in the new policy types; validatingpolicies, imagevalidationpolicies, mutatingpolicies and generatingpolicies.
results:
  - policy: <name> # Namespaced Policy is specified as <namespace>/<name>
    isValidatingAdmissionPolicy: false # when the policy is ValidatingAdmissionPolicy, this field is required.
    isValidatingPolicy: false # when the policy is ValidatingPolicy, this field is required.
    rule: <name> # when the policy is a Kyverno policy, this field is required.
    resources: # optional, primarily for `validate` rules.
      - <namespace_1/name_1>
      - <namespace_2/name_2>
    patchedResources: <file_name.yaml> # when testing a mutate rule this field is required. File may contain one or more resources separated by ---
    generatedResource: <file_name.yaml> # when testing a generate rule this field is required.
    cloneSourceResource: <file_name.yaml> # when testing a generate rule that uses `clone` object this field is required.
    kind: <kind> # optional
    result: pass
checks:
  - match:
      resource: {}
      policy: {}
      rule: {}
    assert: {}
    error: {}

```

--------------------------------

### Calculate Drops Per Second Per Controller (PromQL)

Source: https://kyverno.io/docs/reference/metrics

Calculates the rate of dropped items per second for each controller over the last hour. This query uses the `sum by` and `rate` functions on the `kyverno_controller_drop_total` counter.

```promql
sum by (controller_name) (rate(kyverno_controller_drop_total{}[1h]))
```

--------------------------------

### Kyverno Policy: Add Label to ConfigMap with Namespace Selector

Source: https://kyverno.io/docs/subprojects/kyverno-cli

Defines a MutatingAdmissionPolicy to add a label 'lfx-mentorship: kyverno' to ConfigMaps. A MutatingAdmissionPolicyBinding restricts this policy to Namespaces matching the 'environment: staging' or 'environment: production' labels.

```yaml
apiVersion: admissionregistration.k8s.io/v1alpha1
kind: MutatingAdmissionPolicy
metadata:
  name: 'add-label-to-configmap'
spec:
  matchConstraints:
    resourceRules:
      - apiGroups: ['']
        apiVersions: ['v1']
        operations: ['CREATE']
        resources: ['configmaps']
  failurePolicy: Fail
  reinvocationPolicy: Never
  mutations:
    - patchType: 'ApplyConfiguration'
      applyConfiguration:
        expression: >
          object.metadata.?labels["lfx-mentorship"].hasValue() ?
              Object{}
              Object{ metadata: Object.metadata{ labels: {"lfx-mentorship": "kyverno"}}}
---
apiVersion: admissionregistration.k8s.io/v1alpha1
kind: MutatingAdmissionPolicyBinding
metadata:
  name: 'add-label-to-configmap-binding'
spec:
  policyName: 'add-label-to-configmap'
  matchResources:
    namespaceSelector:
      matchExpressions:
        - key: environment
          operator: In
          values:
            - staging
            - production

```

--------------------------------

### Find Apps API Group Versions with kubectl

Source: https://kyverno.io/docs/policy-types/cluster-policy/external-data-sources

Shows how to use `kubectl api-versions` combined with `grep` to find the available versions for a specific API group, such as 'apps'. This helps in constructing the correct API URL.

```bash
kubectl api-versions | grep apps
```

--------------------------------

### Kyverno JP Inherited Parent Command Options

Source: https://kyverno.io/docs/kyverno-cli/reference/kyverno_jp

Lists options inherited from parent commands, typically related to logging configuration. These options control how and where log messages are outputted.

```bash
# Example of logging options:
--logtostderr
--v 2
--log_dir "/var/log/kyverno"
```

--------------------------------

### Fetch Data from HTTP Endpoint using http.Get()

Source: https://kyverno.io/docs/policy-types/cel-libraries

This policy demonstrates how to use the `http.Get()` function to fetch data from an external HTTP endpoint. The fetched data, stored in the `externalData` variable, can then be used for validation against the object's properties. This is useful for cross-referencing information or enforcing external configurations.

```yaml
apiVersion: policies.kyverno.io/v1
kind: ValidatingPolicy
metadata:
  name: vpol-http-get
spec:
  validationActions:
    - Deny
  matchConstraints:
    resourceRules:
      - apiGroups: ['']
        apiVersions: [v1]
        operations: [CREATE, UPDATE]
        resources: [pods]
  variables:
    - name: externalData
      expression: >-
        http.Get("http://test-api-service.default.svc.cluster.local:80")
  validations:
    - expression: >-
        variables.externalData.metadata.labels.app == object.metadata.labels.app
      messageExpression: "'only create pod with labels, variables.get.metadata.labels.app: ' + string(variables.get.metadata.labels.app)"
```

--------------------------------

### Apply Policy Manifest to Multiple Named Resources in Cluster

Source: https://kyverno.io/docs/subprojects/kyverno-cli

Applies a Kyverno policy defined in 'policy.yaml' to specific resources named 'nginx1' and 'nginx2' within the live Kubernetes cluster, generating a policy report. This targets individual resources by name across the cluster.

```bash
kyverno apply policy.yaml -r nginx1 -r nginx2 --cluster --policy-report
```

--------------------------------

### Match Pods with specific annotations

Source: https://kyverno.io/docs/policy-types/cluster-policy/match-exclude

This rule selects all Pods undergoing CREATE or UPDATE operations that possess the annotation 'imageregistry: "https://hub.docker.com/"'. It illustrates matching resources based on their annotations.

```yaml
spec:
  rules:
    - name: match-pod-annotations
      match:
        any:
          - resources:
              annotations:
                imageregistry: 'https://hub.docker.com/'
              kinds:
                - Pod
              operations:
                - CREATE
                - UPDATE

```

--------------------------------

### Kyverno Nested foreach: Hostname Validation in Ingress TLS

Source: https://kyverno.io/docs/policy-types/cluster-policy/validate

This example showcases nested `foreach` declarations to validate hostnames within Ingress TLS configurations. It enforces that all TLS hosts must use a domain of 'old.com' and not end with 'new.com'. Nested loops allow for iterating through multiple levels of resource structure, such as iterating over TLS configurations and then over the hosts within each configuration.

```yaml
apiVersion: kyverno.io/v2beta1
kind: ClusterPolicy
metadata:
  name: check-ingress
spec:
  background: false
  rules:
    - name: check-tls-secret-host
      match:
        any:
          - resources:
              kinds:
                - Ingress
      validate:
        failureAction: Enforce
        message: 'All TLS hosts must use a domain of old.com.'
        foreach:
          - list: request.object.spec.tls[]
            foreach:
              - list: 'element.hosts'
                deny:
                  conditions:
                    all:
                      - key: '{{element}}'
                        operator: Equals
                        value: '*.new.com'
```

--------------------------------

### Create IAM Role for Kyverno Service Account with eksctl

Source: https://kyverno.io/docs/policy-types/cluster-policy/verify-images/sigstore

Creates an IAM role for the Kyverno service account and associates it with the specified policy using eksctl. This enables IRSA for Kyverno.

```bash
eksctl create iamserviceaccount \
    --name kyverno \
    --namespace kyverno \
    --cluster <cluster-name> \
    --attach-policy-arn "arn:aws:iam::<account-id>:policy/<iam-policy>" \
    --approve \
    --override-existing-serviceaccounts
```

--------------------------------

### Conditionally Mutate Containers with Map and Filter in Kyverno

Source: https://kyverno.io/docs/policy-types/mutating-policy

This policy illustrates conditional mutation of container elements using CEL's `map()` and `filter()` functions within a JSONPatch operation. It iterates through containers, and if a container's image starts with 'nginx:', it adds an environment variable. The `filter()` function then removes any null results, ensuring only valid patches are applied. This allows for targeted modifications based on resource content.

```yaml
apiVersion: policies.kyverno.io/v1
kind: MutatingPolicy
metadata:
  name: foreach-conditional
spec:
matchConstraints:
  resourceRules:
    - apiGroups: ['']
      apiVersions: ['v1']
      resources: ['pods']
      operations: ['CREATE', 'UPDATE']
  mutations:
    - patchType: JSONPatch
      jsonPatch:
        expression: |
          object.spec.containers.map(c,
            c.image.startsWith("nginx:") ?
            JSONPatch{
              op: "add",
              path: "/spec/containers/" + string(object.spec.containers.indexOf(c)) + "/env",
              value: [{"name": "NGINX_ENV", "value": "production"}]
            } : null
          ).filter(p, p != null)

```

--------------------------------

### Create Kubernetes Secrets for Kyverno Certificates

Source: https://kyverno.io/docs/installation/customization

This snippet shows how to create Kubernetes Secrets using the generated CA certificate and TLS certificate-key pairs. It includes commands to create a namespace if it doesn't exist and then create 'tls' and 'generic' secrets for both the admission controller (kyverno-svc) and the cleanup controller. Replace '<namespace>' with your target namespace.

```bash
kubectl create ns <namespace>

kubectl create secret tls kyverno-svc.kyverno.svc.kyverno-tls-pair --cert=tls.crt --key=tls.key -n <namespace>kubectl create secret generic kyverno-svc.kyverno.svc.kyverno-tls-ca --from-file=rootCA.crt -n <namespace>


kubectl create secret tls kyverno-cleanup-controller.kyverno.svc.kyverno-tls-pair --cert=cleanup-tls.crt --key=cleanup-tls.key -n <namespace>
kubectl create secret generic kyverno-cleanup-controller.kyverno.svc.kyverno-tls-ca --from-file=rootCA.crt -n <namespace>
```

--------------------------------

### Sign Image with Cosign

Source: https://kyverno.io/docs/policy-types/cluster-policy/verify-images/sigstore

This command signs a container image using Cosign. It requires the path to the private key (`cosign.key`) and the image reference. The signature is then published to the OCI registry.

```bash
# ${IMAGE} is REPOSITORY/PATH/NAME:TAG
cosign sign --key cosign.key ${IMAGE}

```

--------------------------------

### Verify GitHub Workflow Keyless Signing with Extensions

Source: https://kyverno.io/docs/policy-types/cluster-policy/verify-images/sigstore

This snippet shows a Kyverno attestor configuration for verifying images signed using GitHub Workflows via keyless signing. It includes specific `subject` and `issuer` patterns, along with `additionalExtensions` to match workflow attributes like trigger, SHA, name, and repository, ensuring the integrity of the signing process.

```yaml
attestors:
  - entries:
      - keyless:
          subject: 'https://github.com/{{ORGANIZATION}}/{{REPOSITORY}}/.github/workflows/{{WORKFLOW}}@refs/tags/*'
          issuer: 'https://token.actions.githubusercontent.com'
          additionalExtensions:
            githubWorkflowTrigger: push
            githubWorkflowSha: '{{WORKFLOW_COMMIT_SHA}}'
            githubWorkflowName: '{{WORKFLOW_NAME}}'
            githubWorkflowRepository: '{{WORKFLOW_ORGANIZATION}}/{{WORKFLOW_REPOSITORY}}'
          rekor:
            url: https://rekor.sigstore.dev

```

--------------------------------

### List Kubernetes resources and check conditions using resource.List()

Source: https://kyverno.io/docs/policy-types/cel-libraries

The `resource.List()` function retrieves a collection of Kubernetes resources based on API version, kind, and optionally a namespace. It supports filtering and aggregation operations on the returned list, enabling checks like resource counts or sorted properties. The function can operate across all namespaces or within a specific one.

```cel
resource.List("apps/v1", "deployments", "").items.size() > 0
```

```cel
resource.List("apps/v1", "deployments", object.metadata.namespace).items.exists(d, d.spec.replicas > 3)
```

```cel
resource.List("apps/v1", "deployments", object.metadata.namespace, { "env": "pod" }).items.exists(d, d.spec.replicas > 3)
```

```cel
resource.List("v1", "services", "default").items.map(s, s.metadata.name).isSorted()
```

```cel
resource.List("v1", "services", object.metadata.namespace).items.map(s, s.metadata.name).isSorted()
```

--------------------------------

### Kyverno Test Output: Policy Application Results

Source: https://kyverno.io/docs/subprojects/kyverno-cli

The output from the `kyverno test .` command, showing a table of test results. It confirms that the 'add-label-to-configmap' policy was applied to the 'v1/ConfigMap/default/game-demo' resource and passed.

```text
Loading test  ( kyverno-test.yaml ) ...
  Loading values/variables ...
  Loading policies ...
  Loading resources ...
  Loading exceptions ...
  Applying 1 policy to 1 resource with 0 exceptions ...
  Checking results ...


│────│────────────────────────│──────│────────────────────────────────│────────│────────│
│ ID │ POLICY                 │ RULE │ RESOURCE                       │ RESULT │ REASON │
│────│────────────────────────│──────│────────────────────────────────│────────│────────│
│ 1  │ add-label-to-configmap │      │ v1/ConfigMap/default/game-demo │ Pass   │ Ok     │
│────│────────────────────────│──────│────────────────────────────────│────────│────────│


Test Summary: 1 tests passed and 0 tests failed

```

--------------------------------

### Sign a YAML Manifest with a Private Key

Source: https://kyverno.io/docs/policy-types/cluster-policy/validate

Signs a specified YAML manifest file using a private key and outputs the signed manifest. This process uses the `kubectl-sigstore` tool and requires a password for the private key.

```bash
$ kubectl-sigstore sign -f secret.yaml -k cosign.key --tarball no -o secret-signed.yaml
Enter password for private key:
Using payload from: /tmp/kubectl-sigstore-temp-dir1572288324/tmp-blob-file
0D 7ѫO2ĎD)I!@t0X Xmj7+u
                                        _ڑ)ۆd0qHINFO[0004] signed manifest generated at secret-signed.yaml
```

--------------------------------

### Kyverno foreach List Definition

Source: https://kyverno.io/docs/policy-types/cluster-policy/generate

Defines how to specify a list for the 'foreach' declaration in Kyverno using a JMESPath expression. The expression should retrieve sub-elements for processing, and it should not be enclosed in braces.

```yaml
list: request.object.metadata.labels.namespaces | split(@, ',')
```

--------------------------------

### Retrieve a specific Kubernetes resource using resource.Get()

Source: https://kyverno.io/docs/policy-types/cel-libraries

The `resource.Get()` function retrieves a single Kubernetes resource by its API version, kind, namespace, and name. It's useful for accessing specific configuration data, like a ConfigMap's content, to inform policy decisions. Dependencies include the Kubernetes API access provided by Kyverno.

```cel
resource.Get("v1", "configmaps", "default", "clusterregistries").data["registries"]
```

--------------------------------

### Kyverno Test Execution Output

Source: https://kyverno.io/docs/subprojects/kyverno-cli

This output shows the results of running the `kyverno test` command. It details the policy, resource, and the outcome (Pass, Fail, Skip, Exclude) for each test case, along with a summary of test results.

```bash
$ kyverno test .

Loading test  ( kyverno-test.yaml ) ...
  Loading values/variables ...
  Loading policies ...
  Loading resources ...
  Loading exceptions ...
  Applying 1 policy to 4 resources with 0 exceptions ...
  Checking results ...


│────│────────────────────────────│──────│────────────────────────────────────────────│────────│──────────│
│ ID │ POLICY                     │ RULE │ RESOURCE                                   │ RESULT │ REASON   │
│────│────────────────────────────│──────│────────────────────────────────────────────│────────│──────────│
│ 1  │ check-deployment-namespace │      │ apps/v1/Deployment/default/bad-deployment  │ Pass   │ Ok       │
│ 2  │ check-deployment-namespace │      │ apps/v1/Deployment/staging/good-deployment │ Pass   │ Ok       │
│ 3  │ check-deployment-namespace │      │ apps/Deployment/v1                         │ Pass   │ Excluded │
│ 4  │ check-deployment-namespace │      │ apps/Deployment/v1                         │ Pass   │ Excluded │
│────│────────────────────────────│──────│────────────────────────────────────────────│────────│──────────│


Test Summary: 4 tests passed and 0 tests failed

```

--------------------------------

### Track Kyverno Client API Queries

Source: https://kyverno.io/docs/reference/metrics

These queries help track the number of requests Kyverno makes to the Kubernetes API server. They demonstrate how to calculate the rate and increase in client queries over a 5-minute interval, filtered by client type.

```PromQL
kyverno_client_queries_total
```

```PromQL
rate(kyverno_client_queries_total{client_type="dynamic"}[5m])
```

```PromQL
increase(kyverno_client_queries_total{client_type="dynamic"}[5m])
```

--------------------------------

### Fetching a Specific Resource (and handling Not Found)

Source: https://kyverno.io/docs/policy-types/cluster-policy/external-data-sources

Illustrates fetching a specific resource by name. If the resource does not exist, the API call will return a 'NotFound' error.

```APIDOC
## GET /api/v1/namespaces/{namespace}/services/{serviceName}

### Description
Fetches a specific service by its name within a given namespace.

### Method
GET

### Endpoint
`/api/v1/namespaces/default/services/foo`

### Response
#### Error Response (404 Not Found)
Returns an error if the specified service does not exist.

#### Response Example (Error)
```
Error from server (NotFound): services "foo" not found
```
```

--------------------------------

### Configure Tempo as Grafana Data Source

Source: https://kyverno.io/docs/guides/tracing

This command applies a Kubernetes ConfigMap to register Tempo as a data source within Grafana. It configures Grafana to connect to the Tempo service at 'http://tempo.monitoring:3100' and sets it as the default data source.

```bash
kubectl apply -f - <<EOF
apiVersion: v1
kind: ConfigMap
metadata:
  labels:
    grafana_datasource: "1"
  name: tempo-datasource
  namespace: monitoring
data:
  tempo-datasource.yaml: |-
    apiVersion: 1
    datasources:
    - name: Tempo
      type: tempo
      access: proxy
      url: "http://tempo.monitoring:3100"
      version: 1
      isDefault: true
EOF

```

--------------------------------

### Verify SlsaProvenance Attestation (Experimental)

Source: https://kyverno.io/docs/policy-types/cluster-policy/verify-images/sigstore

Verifies a slsaprovenance attestation for a given image using experimental features. It decodes the base64 encoded payload and pretty-prints it using jq. Requires COSIGN_EXPERIMENTAL=true environment variable.

```bash
COSIGN_EXPERIMENTAL=true cosign verify-attestation --type slsaprovenance registry.io/myrepo/myimage:mytag | jq .payload -r | base64 --decode | jq
```

--------------------------------

### Define Pod Manifests for Kyverno Testing

Source: https://kyverno.io/docs/subprojects/kyverno-cli

Defines two Pod manifests, `good-pod` and `bad-pod`, to be used in Kyverno policy testing. `good-pod` is expected to pass validation, while `bad-pod` is expected to fail.

```yaml
# This Pod should PASS validation.
apiVersion: v1
kind: Pod
metadata:
  name: good-pod
spec:
  containers:
    - name: nginx
      image: nginx
---
# This Pod should FAIL validation.
apiVersion: v1
kind: Pod
metadata:
  name: bad-pod
spec:
  containers:
    - name: nginx
      image: nginx

```

--------------------------------

### Match NetworkPolicy Kind (YAML)

Source: https://kyverno.io/docs/policy-types/cluster-policy/match-exclude

This snippet shows how to match a specific resource kind, NetworkPolicy, without specifying the group or version. This will match NetworkPolicies across all supported versions and groups. It's a less specific match than including the group and version.

```yaml
match:
  any:
    - resources:
        kinds:
          - v1/NetworkPolicy
```

--------------------------------

### Test JMESPath Filter with Input File

Source: https://kyverno.io/docs/subprojects/kyverno-cli

Tests a custom JMESPath filter using data from a JSON file. The `kyverno jp query` command reads the input from the specified file (`foo.json`) and applies the JMESPath expression.

```bash
$ cat foo.json
{"bar": "this-is-a-dashed-string"}


$ kyverno jp query -i foo.json "split(bar, '-')"
# split(bar, '-')
[
  "this",
  "is",
  "a",
  "dashed",
  "string"
]


```

--------------------------------

### Fetching Collections of Resources

Source: https://kyverno.io/docs/policy-types/cluster-policy/external-data-sources

Shows how to retrieve a list of all resources of a certain type within the cluster, such as all Namespace resources.

```APIDOC
## GET /api/v1/namespaces

### Description
Fetches a collection of all Namespace resources in the cluster.

### Method
GET

### Endpoint
`/api/v1/namespaces`

### Response
#### Success Response (200)
- **items** (array) - A list of Namespace objects.

#### Response Example
```json
{
  "kind": "NamespaceList",
  "apiVersion": "v1",
  "metadata": {
    "selfLink": "/api/v1/namespaces",
    "resourceVersion": "2009258"
  },
  "items": [
    {
      "metadata": {
        "name": "default",
        "selfLink": "/api/v1/namespaces/default",
        "uid": "5011b5d5-abb7-4fef-93f9-8b5fa4b2eba9",
        "resourceVersion": "155",
        "creationTimestamp": "2021-01-19T20:20:37Z"
      },
      "spec": {
        "finalizers": ["kubernetes"]
      },
      "status": {
        "phase": "Active"
      }
    }
    // ... more namespaces
  ]
}
```
```

--------------------------------

### Clone Multiple Resources with Kyverno Policy

Source: https://kyverno.io/docs/policy-types/cluster-policy/generate

This policy clones multiple resource types (Secrets and ConfigMaps) from the 'staging' namespace to the namespace of the triggering resource. It utilizes the 'generate.cloneList' object and an optional 'selector' to filter source resources by the label 'allowedToBeCloned="true"'. Synchronization is enabled. This policy requires no external dependencies.

```yaml
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: sync-secret-with-multi-clone
spec:
  rules:
    - name: sync-secret
      match:
        any:
          - resources:
              kinds:
                - Namespace
      exclude:
        any:
          - resources:
              namespaces:
                - kube-system
                - default
                - kube-public
                - kyverno
      generate:
        namespace: '{{request.object.metadata.name}}'
        synchronize: true
        cloneList:
          namespace: staging
          kinds:
            - v1/Secret
            - v1/ConfigMap
          selector:
            matchLabels:
              allowedToBeCloned: 'true'

```

--------------------------------

### Test Kyverno Service Connectivity (kubectl busybox wget)

Source: https://kyverno.io/docs/guides/troubleshooting

This command tests network connectivity and DNS resolution to the Kyverno service from within the cluster. It uses a temporary busybox pod to run a wget command against the Kyverno liveness endpoint.

```bash
$ kubectl run busybox --rm -ti --image=busybox -- /bin/sh
If you don't see a command prompt, try pressing enter.
/ # wget --no-check-certificate --spider --timeout=1 https://kyverno-svc.kyverno.svc:443/health/liveness
Connecting to kyverno-svc.kyverno.svc:443 (100.67.141.176:443)
remote file exists
/ # exit
Session ended, resume using 'kubectl attach busybox -c busybox -i -t' command when the pod is running
pod "busybox" deleted
```

--------------------------------

### Use Custom Rekor and CTLog Public Keys in Cosign (Kyverno Policy)

Source: https://kyverno.io/docs/policy-types/cluster-policy/verify-images/sigstore

This configuration demonstrates how to specify custom public keys for Rekor and CT logs in Cosign using `rekor.pubkey` and `ctlog.pubkey` within a Kyverno policy. This allows for verification against specific, non-default transparency log authorities.

```yaml
verifyImages:
  - imageReferences:
      - '*'
    attestors:
      - entries:
          - keys:
              publicKeys: |-
                -----BEGIN PUBLIC KEY-----
                MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE8nXRh950IZbRj8Ra/N9sbqOPZrfM
                5/KAQN0/KjHcorm/J5yctVd7iEcnessRQjU917hmKO6JWVGHpDguIyakZA==
                -----END PUBLIC KEY-----
              rekor:
                pubkey: |-
                  -----BEGIN PUBLIC KEY-----
                  MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEyQfmL5YwHbn9xrrgG3vgbU0KJxMY
                  BibYLJ5L4VSMvGxeMLnBGdM48w5IE//6idUPj3rscigFdHs7GDMH4LLAng==
                  -----END PUBLIC KEY-----
              ctlog:
                pubkey: |-
                  -----BEGIN PUBLIC KEY-----
                  MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEE8uGVnyDWPPlB7M5KOHRzxzPHtAy
                  FdGxexVrR4YqO1pRViKxmD9oMu4I7K/4sM51nbH65ycB2uRiDfIdRoV/+A==
                  -----END PUBLIC KEY-----

```

--------------------------------

### Execute JMESPath Query with Kyverno Functions

Source: https://kyverno.io/docs/kyverno-cli/reference/kyverno_jp_query

This command executes a JMESPath query against a given input file. The query can be provided directly or read from a file. Kyverno adds custom functions to enhance JMESPath capabilities.

```bash
kyverno jp query -i object.yaml 'request.object.metadata.name | truncate(@, `9`)'
```

```bash
kyverno jp query -i object.yaml -q query-file
```

```bash
kyverno jp query -i object.yaml -q query-file-1 -q query-file-2 'request.object.metadata.name | truncate(@, `9`)'
```

```bash
cat query-file | kyverno jp query -i object.yaml
```

```bash
cat object.yaml | kyverno jp query -q query-file
```

--------------------------------

### Track Changes for a Specific Cluster Policy

Source: https://kyverno.io/docs/reference/metrics

This query sums up all changes associated with a cluster policy named 'sample-policy'. It provides a total count of create, update, or delete operations for that specific policy.

```PromQL
sum(kyverno_policy_changes_total{policy_type="cluster", policy_name="sample-policy"})
```

--------------------------------

### Apply ValidatingAdmissionPolicy and Binding to Cluster with Kyverno CLI

Source: https://kyverno.io/docs/subprojects/kyverno-cli

Applies a ValidatingAdmissionPolicy along with its binding to all resources in the cluster using 'kyverno apply --cluster'. This is useful for enforcing policies cluster-wide with specific resource matching criteria.

```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingAdmissionPolicy
metadata:
  name: 'check-deployment-replicas'
spec:
  matchConstraints:
    resourceRules:
      - apiGroups:
          - apps
        apiVersions:
          - v1
        operations:
          - CREATE
          - UPDATE
        resources:
          - deployments
  validations:
    - expression: object.spec.replicas <= 5
---
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingAdmissionPolicyBinding
metadata:
  name: 'check-deployment-replicas-binding'
spec:
  policyName: 'check-deployment-replicas'
  validationActions: [Deny]
  matchResources:
    namespaceSelector:
      matchLabels:
        environment: staging
```

```bash
kubectl create ns staging
kubectl label ns staging environment=staging
```

```bash
kubectl create deployment nginx-1 --image=nginx --replicas=6 -n staging
kubectl create deployment nginx-2 --image=nginx --replicas=6
```

```bash
kyverno apply /path/to/check-deployment-replicas.yaml --cluster --policy-report
```

--------------------------------

### Evaluate JMESPath Query with Kyverno Functions

Source: https://kyverno.io/docs/kyverno-cli/reference/kyverno_jp

Shows how to execute a JMESPath query against a YAML object, utilizing Kyverno's custom functions. The '-i' flag specifies the input file.

```bash
kyverno jp query -i object.yaml 'request.object.metadata.name | truncate(@, `9`)'
```

--------------------------------

### Test Policies Against Specific Git Repository Directory and Branch (CLI)

Source: https://kyverno.io/docs/subprojects/kyverno-cli

Command to test Kyverno policies from a specific directory within a Git repository and a particular branch. The `--git-branch` or `-b` flag is required even when targeting the default 'main' branch if a directory is specified in the URL.

```bash
kyverno test https://github.com/kyverno/policies/pod-security/restricted -b release-1.6

```

--------------------------------

### Generate Key Pair for Signing Manifests

Source: https://kyverno.io/docs/policy-types/cluster-policy/validate

Generates a public and private key pair using the `cosign` command-line tool. These keys are essential for signing Kubernetes YAML manifests.

```bash
cosign generate-key-pair
```

--------------------------------

### Restart Kyverno Admission Controller (kubectl)

Source: https://kyverno.io/docs/guides/troubleshooting

Restarts the Kyverno admission controller by scaling its deployment down to zero replicas and then back up to the desired number. This is an optional step to ensure Kyverno is running correctly after resolving webhook issues.

```bash
kubectl scale deploy kyverno-admission-controller -n kyverno --replicas 0
kubectl scale deploy kyverno-admission-controller -n kyverno --replicas 3
```

--------------------------------

### Test JMESPath Expression from File

Source: https://kyverno.io/docs/subprojects/kyverno-cli

Executes a JMESPath expression stored in a separate file. The `kyverno jp query` command reads the expression from the `add` file and evaluates it against the provided input.

```bash
$ cat add
add(`1`,`2`)


$ echo {} | kyverno jp query -q add
Reading from terminal input.
Enter input object and hit Ctrl+D.
# add(`1`,`2`)
3


```

--------------------------------

### Test Kyverno Policy Using Namespace Object

Source: https://kyverno.io/docs/subprojects/kyverno-cli

This snippet shows how to test a Kyverno policy that relies on namespace properties, such as its name. Since `kyverno test` runs offline, mock namespace definitions must be provided via a values file referenced in the test manifest.

```yaml
apiVersion: policies.kyverno.io/v1alpha1
kind: ValidatingPolicy
metadata:
  name: check-deployment-namespace
spec:
  matchConstraints:
    resourceRules:
      - apiGroups: ['apps']
        apiVersions: ['v1']
        operations: ['CREATE', 'UPDATE']
        resources: ['deployments']
    objectSelector:
      matchLabels:
        app: nginx
  validations:
    - expression: "namespaceObject.metadata.name != 'default'"
      message: "Using 'default' namespace is not allowed for this application."

```

```yaml
# This deployment should FAIL because it's in the 'default' namespace.
apiVersion: apps/v1
kind: Deployment
metadata:
  name: bad-deployment
  namespace: default
  labels:
    app: nginx
spec:
  replicas: 1
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
        - name: nginx
          image: nginx:latest
---

```

--------------------------------

### Sign Container Image using Cosign with Certificate Chain

Source: https://kyverno.io/docs/policy-types/cluster-policy/verify-images/sigstore

This command signs a container image using cosign, specifying a private key, a certificate, and the certificate chain (root CA). This allows for verification of the image signature using the provided certificates.

```bash
cosign sign $IMAGE --key import-cosign.key --cert test.crt --cert-chain myCA.pem

```

--------------------------------

### Parse JMESPath Expression and AST (kyverno cli)

Source: https://kyverno.io/docs/kyverno-cli/reference/kyverno_jp_parse

This command parses a JMESPath expression and displays its Abstract Syntax Tree (AST). It can read expressions from standard input, a file, or multiple files. The '-f' flag specifies input files, and multiple expressions can be provided.

```bash
kyverno jp parse 'request.object.metadata.name | truncate(@, `9`)'
kyverno jp parse -f my-file
kyverno jp parse
kyverno jp parse -f my-file1 -f my-file-2 'request.object.metadata.name | truncate(@, `9`)'
cat my-file | kyverno jp parse
```

--------------------------------

### Generate RoleBinding for New Namespace in Kyverno

Source: https://kyverno.io/docs/policy-types/cluster-policy/generate

This Kyverno ClusterPolicy demonstrates how to automatically generate a RoleBinding when a new Namespace is created. It assigns the 'admin' ClusterRole to a user named 'steven' for the newly created Namespace.

```yaml
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: steven-rolebinding
spec:
  rules:
    - name: steven-rolebinding
      match:
        any:
          - resources:
              kinds:
                - Namespace
      generate:
        kind: RoleBinding
        apiVersion: rbac.authorization.k8s.io/v1
        name: steven-rolebinding
        namespace: '{{request.object.metadata.name}}'
        data:
          subjects:
            - kind: User
              name: steven
              apiGroup: rbac.authorization.k8s.io
          roleRef:
            kind: ClusterRole
            name: admin
            apiGroup: rbac.authorization.k8s.io

```

--------------------------------

### Kyverno Test Manifest: Policy and Resource Testing

Source: https://kyverno.io/docs/subprojects/kyverno-cli

A Kyverno test manifest (`kyverno-test.yaml`) that defines a test case. It specifies the policy (`policy.yaml`) and the resource (`resource.yaml`) to be tested, along with the expected patched resource and the assertion for a passing result.

```yaml
apiVersion: kyverno.io/v1
kind: Test
metadata:
  name: test
policies:
  - policy.yaml
resources:
  - resource.yaml
results:
  - isMutatingAdmissionPolicy: true
    kind: ConfigMap
    patchedResources: patched-resource.yaml
    policy: add-label-to-configmap
    resources:
      - game-demo
    result: pass

```

--------------------------------

### View PolicyReports in Staging Namespace

Source: https://kyverno.io/docs/guides/reports

This command retrieves PolicyReports from the 'staging' namespace and outputs them in YAML format. It allows inspection of the validation results, showing which deployments passed or failed the policy checks.

```bash
kubectl get polr -n staging -o yaml

```

--------------------------------

### Configure TLS Key Algorithm via Helm

Source: https://kyverno.io/docs/installation/customization

This snippet shows how to configure the cryptographic algorithm used for generating CA and TLS certificates in Kyverno via Helm values. It demonstrates setting 'tlsKeyAlgorithm' to 'ECDSA' for both the admission controller and cleanup controller.

```yaml
admissionController:
  tlsKeyAlgorithm: ECDSA

cleanupController:
  tlsKeyAlgorithm: ECDSA

```

--------------------------------

### List Kyverno Custom JMESPath Filters

Source: https://kyverno.io/docs/subprojects/kyverno-cli

Lists available custom JMESPath filters provided by Kyverno. This command helps users discover and understand the specific filters that extend standard JMESPath functionality within Kyverno.

```bash
$ kyverno jp function
Name: add
  Signature: add(any, any) any
  Note:      does arithmetic addition of two specified values of numbers, quantities, and durations


Name: base64_decode
  Signature: base64_decode(string) string
  Note:      decodes a base 64 string


Name: base64_encode
  Signature: base64_encode(string) string
  Note:      encodes a regular, plaintext and unencoded string to base64


Name: compare
  Signature: compare(string, string) number
  Note:      compares two strings lexicographically
<snip>

```

--------------------------------

### Save Mutated Resource to File

Source: https://kyverno.io/docs/subprojects/kyverno-cli

Applies a mutation policy and saves the resulting mutated resource directly to a specified file.

```bash
kyverno apply /path/to/policy.yaml --resource /path/to/resource.yaml -o newresource.yaml
```

--------------------------------

### Kyverno Values Manifest for Mock Namespaces

Source: https://kyverno.io/docs/subprojects/kyverno-cli

This `values.yaml` file is used with `kyverno test` to provide mock Kubernetes objects, specifically Namespace objects in this case. These mock objects are used to populate variables like `namespaceObject` during test runs, simulating cluster state.

```yaml
apiVersion: cli.kyverno.io/v1alpha1
kind: Value
metadata:
  name: values
namespaces:
  - apiVersion: v1
    kind: namespace
    metadata:
      labels:
        environment: staging
      name: staging
  - apiVersion: v1
    kind: namespace
    metadata:
      labels:
        environment: default
      name: default

```

--------------------------------

### Correct Usage of imageReferences in verifyImages Rule

Source: https://kyverno.io/docs/policy-types/cluster-policy/verify-images/overview

Illustrates the correct way to define `imageReferences` within a `verifyImages` rule using static string values. This adheres to the rule's requirement for explicit, non-interpolated image reference patterns.

```yaml
verifyImages:
  - imageReferences:
      - 'myregistry.com/app-image:v1'
      - 'myregistry.com/app-image:v2'
```

--------------------------------

### Apply Policy Directly to Cluster and Generate Report

Source: https://kyverno.io/docs/subprojects/kyverno-cli

Applies a Kyverno policy directly to the active Kubernetes cluster and generates a policy report. This method requires the policy resources (e.g., ConfigMaps) to exist in the cluster.

```bash
kyverno apply /path/to/check-pod-name-from-configmap.yaml --cluster --policy-report

```

--------------------------------

### Create Pod Exempted from 'runAsNonRoot' Control

Source: https://kyverno.io/docs/guides/exceptions

This Pod definition, running in the 'delta' namespace, satisfies most restricted profile controls but explicitly sets `runAsNonRoot: false`. It will be successfully created because it matches the PolicyException that exempts it from the 'Running as Non-root' control.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx-pod
  namespace: delta
spec:
  containers:
    - name: nginx
      image: nginx
      args:
        - sleep
        - 1d
      securityContext:
        seccompProfile:
          type: RuntimeDefault
        runAsNonRoot: false
        allowPrivilegeEscalation: false
        capabilities:
          drop:
            - ALL

```

--------------------------------

### Query Cleanup Controller Errors

Source: https://kyverno.io/docs/reference/metrics

This query calculates the number of errors per second per cleanup policy over a 5-minute interval. It aggregates errors by policy name and namespace.

```PromQL
sum by (policy_name, policy_namespace) (rate(kyverno_cleanup_controller_errors_total{}[5m]))
```

--------------------------------

### Incorrect Kyverno Usage: Variables in Resource Kinds

Source: https://kyverno.io/docs/policy-types/cluster-policy/verify-images/overview

Demonstrates incorrect usage of variables within the 'match.resources.kinds' field in a Kyverno policy. This field requires static resource kinds like 'Pod' or 'Deployment', and dynamic interpolation using '{{ request.object.kind }}' is not supported.

```yaml
rules:
  - name: restrict-deployment-kinds
    match:
      resources:
        kinds:
          - '{{ request.object.kind }}'
```

--------------------------------

### Kyverno PolicyException for Istio Init Container Capabilities (YAML)

Source: https://kyverno.io/docs/guides/exceptions

A Kyverno PolicyException resource designed to exempt Istio init containers from a 'Capabilities' control. It uses `namespaceSelector` and `selector` to target specific Pods and specifies allowed capabilities for the 'istio/proxyv2' image.

```yaml
apiVersion: kyverno.io/v2
kind: PolicyException
metadata:
  name: pod-security-exception
  namespace: policy-exception-ns
spec:
  exceptions:
    - policyName: psa
      ruleNames:
        - baseline
  match:
    any:
      # Istio Sidecar injection at namespace level
      # https://istio.io/latest/docs/setup/additional-setup/sidecar-injection/#controlling-the-injection-policy
      - resources:
          kinds:
            - Pod
        namespaceSelector:
          matchLabels:
            istio-injection: enabled
      # Sidecar injection can also be controlled on a per-pod basis, by configuring
      # the `sidecar.istio.io/inject` label on a pod
      - resources:
          kinds:
            - Pod
        selector:
          matchLabels:
            sidecar.istio.io/inject: 'true'
  podSecurity:
    - controlName: Capabilities
      images:
        - '*/istio/proxyv2*'
      restrictedField: spec.initContainers[*].securityContext.capabilities.add
      values:
        - NET_ADMIN
        - NET_RAW
```

--------------------------------

### Apply Policy and Generate Report with Specific Resource and Warning Exit Code

Source: https://kyverno.io/docs/subprojects/kyverno-cli

Applies a Kyverno policy from 'disallow-latest-tag.yaml' to an empty resource file, setting a warning exit code of 3. The subsequent `echo $?` command retrieves the exit code of the previous command, which is expected to be 3.

```bash
kyverno apply disallow-latest-tag.yaml --resource=empty.yaml --warn-exit-code 3 --warn-no-pass
echo $?
```

--------------------------------

### Apply Policy to Cluster Resources

Source: https://kyverno.io/docs/subprojects/kyverno-cli

Applies a policy to all resources within the current Kubernetes cluster context that match the policy's selectors. This is useful for broad policy validation.

```bash
kyverno apply /path/to/policy.yaml --cluster
```

--------------------------------

### Fetch and Decode Certificate from Kubernetes Secret for Image Verification

Source: https://kyverno.io/docs/policy-types/cluster-policy/verify-images/sigstore

This ClusterPolicy demonstrates fetching a base64-encoded certificate from a Kubernetes secret, decoding it, and then using it to verify image signatures. It utilizes `apiCall` for fetching and `base64_decode` for processing the certificate.

```yaml
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: verify-image
spec:
  background: false
  rules:
    - name: verify-image
      match:
        any:
          - resources:
              kinds:
                - Pod
      context:
        - name: encodedCert
          apiCall:
            urlPath: '/api/v1/namespaces/default/secrets/my-ca-secret'
            method: GET
            jmesPath: 'data."root-ca.pem"'
        - name: certChain
          variable:
            jmesPath: 'base64_decode(encodedCert)'
      verifyImages:
        - imageReferences:
            - 'docker.io/mohdcode/signingtest@sha256:ae0563a2513992491b4e3e2e3e610249696097a2be7ca76c1ecd52a5702a192d'
          failureAction: Enforce
          attestors:
            - entries:
                - certificates:
                    certChain: '{{certChain}}'
                    rekor:
                      ignoreTlog: true
                    ctlog:
                      ignoreSCT: true

```

--------------------------------

### Apply ValidatingAdmissionPolicy to a Resource with Kyverno CLI

Source: https://kyverno.io/docs/subprojects/kyverno-cli

Applies a ValidatingAdmissionPolicy to a specific Kubernetes resource using the 'kyverno apply' command. This allows testing policy compliance before or during resource creation/update.

```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingAdmissionPolicy
metadata:
  name: check-deployments-replicas
spec:
  failurePolicy: Fail
  matchConstraints:
    resourceRules:
      - apiGroups: ['apps']
        apiVersions: ['v1']
        operations: ['CREATE', 'UPDATE']
        resources: ['deployments']
  validations:
    - expression: 'object.spec.replicas <= 3'
      message: 'Replicas must be less than or equal 3'
```

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-pass
spec:
  replicas: 2
  selector:
    matchLabels:
      app: nginx-pass
  template:
    metadata:
      labels:
        app: nginx-pass
    spec:
      containers:
        - name: nginx-server
          image: nginx
```

```bash
kyverno apply /path/to/check-deployment-replicas.yaml --resource /path/to/deployment.yaml
```

--------------------------------

### Configure Kyverno Trust with Custom CA Certificates (Helm Replace Method)

Source: https://kyverno.io/docs/policy-types/cluster-policy/verify-images/sigstore

This snippet demonstrates how to configure Kyverno to trust custom Certificate Authorities by replacing its default certificate store using Helm values. This method is suitable for environments primarily using private, internal registries.

```yaml
global:
  caCertificates:
    data: |
      -----BEGIN CERTIFICATE-----
      MIIBdjCCAR2gAwIBAgIBADAKBggqhkjOPQQDAjAjMSEwHwYDVQQDDBhrM3Mtc2Vy
      dmVyLWNhQDE2ODEzODUyNDgwHhcNMjMwNDEzMTEyNzI4WhcNMzMwNDEwMTEyNzI4
      <snip>
      mPCB0cIwCgYIKoZIzj0EAwIDRwAwRAIgYF0Dy5QuQpYFyHcQEVq5GJgrE9W4gAy2
      W/LgVuvZmucCIBcETS4DIw2pWAfeKRDaEOi2YsJoDpWd7lFLQBUbe4G7
      -----END CERTIFICATE-----
```

--------------------------------

### Pod with Invalid Capabilities for Istio Init Container (YAML)

Source: https://kyverno.io/docs/guides/exceptions

A Kubernetes Pod definition where the Istio init container's security context includes 'SYS_ADMIN' in its capabilities, which violates a baseline security profile and would be rejected by Kyverno.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: istio-pod
spec:
  initContainers:
    - name: istio-init
      image: docker.io/istio/proxyv2:1.20.2
      args:
        - istio-iptables
        - -p
        - '15001'
        - -z
        - '15006'
        - -u
        - '1337'
        - -m
        - REDIRECT
        - -i
        - '*'
        - -x
        - ''
        - -b
        - '*'
        - -d
        - 15090,15021,15020
        - --log_output_level=default:info
      securityContext:
        allowPrivilegeEscalation: false
        capabilities:
          add:
            - NET_ADMIN
            - NET_RAW
            - SYS_ADMIN
          drop:
            - ALL
        privileged: false
        readOnlyRootFilesystem: false
        runAsGroup: 0
        runAsNonRoot: false
        runAsUser: 0
  containers:
    - name: busybox
      image: busybox:1.35
      args:
        - sleep
        - infinity
```

--------------------------------

### Iterate and Mutate Containers using ApplyConfiguration in Kyverno

Source: https://kyverno.io/docs/policy-types/mutating-policy

This policy demonstrates iterating through a list of containers within a pod and applying a mutation to each. It utilizes the `ApplyConfiguration` patch type and CEL's `map()` function to modify the `securityContext` of every container, setting `allowPrivilegeEscalation` to `false`. This is efficient for applying the same change to multiple similar elements.

```yaml
apiVersion: policies.kyverno.io/v1
kind: MutatingPolicy
metadata:
  name: foreach
spec:
  matchConstraints:
  resourceRules:
    - apiGroups: ['']
      apiVersions: ['v1']
      operations: ['CREATE']
      resources: ['pods']
  mutations:
    - patchType: ApplyConfiguration
      applyConfiguration:
        expression: >
          Object{
            spec: Object.spec{
              containers: object.spec.containers.map(container, Object.spec.containers{
                name: container.name,
                securityContext: Object.spec.containers.securityContext{
                  allowPrivilegeEscalation: false
                }
              }
            }
          }

```

--------------------------------

### Define Kubernetes Resource in GlobalContextEntry (YAML)

Source: https://kyverno.io/docs/policy-types/cluster-policy/external-data-sources

This YAML defines a GlobalContextEntry to cache all Deployment resources in the 'fitness' namespace. It specifies the resource group, version, plural resource name, and namespace. The resource value must be pluralized and lower-case.

```yaml
apiVersion: kyverno.io/v2alpha1
kind: GlobalContextEntry
metadata:
  name: deployments
spec:
  kubernetesResource:
    group: apps
    version: v1
    resource: deployments
    namespace: fitness

```

--------------------------------

### Resulting ConfigMaps after Kyverno Policy Application

Source: https://kyverno.io/docs/guides/exceptions

These ConfigMaps represent the resources generated by the 'generate-configmap' policy in the 'production' and 'staging' namespaces. No ConfigMap was created for the 'testing' namespace due to the applied PolicyException.

```yaml
apiVersion: v1
data:
  KAFKA_ADDRESS: 192.168.10.13:9092,192.168.10.14:9092,192.168.10.15:9092
  ZK_ADDRESS: 192.168.10.10:2181,192.168.10.11:2181,192.168.10.12:2181
kind: ConfigMap
metadata:
  name: zk-kafka-address
  namespace: staging
---
apiVersion: v1
data:
  KAFKA_ADDRESS: 192.168.10.13:9092,192.168.10.14:9092,192.168.10.15:9092
  ZK_ADDRESS: 192.168.10.10:2181,192.168.10.11:2181,192.168.10.12:2181
kind: ConfigMap
metadata:
  name: zk-kafka-address
  namespace: production

```

--------------------------------

### Associate IAM OIDC Provider with eksctl

Source: https://kyverno.io/docs/policy-types/cluster-policy/verify-images/sigstore

Associates an IAM OIDC provider with an EKS cluster using the eksctl command-line tool. This is a prerequisite for enabling IRSA.

```bash
eksctl utils associate-iam-oidc-provider --cluster <cluster-name> --approve
```

--------------------------------

### List UpdateRequests

Source: https://kyverno.io/docs/policy-types/cluster-policy/generate

This command lists all `UpdateRequest` resources across all namespaces. `UpdateRequest` objects are intermediate resources used by Kyverno to queue and track work items for resource generation.

```bash
kubectl get updaterequests -A

```

--------------------------------

### Define User Information for Admission Requests (YAML)

Source: https://kyverno.io/docs/subprojects/kyverno-cli

This YAML file defines user information, including roles, cluster roles, and subjects, which can be passed to admission requests. It specifies the API version, kind, metadata, cluster roles, and user details.

```yaml
apiVersion: cli.kyverno.io/v1alpha1
kind: UserInfo
metadata:
  name: user-info
clusterRoles:
  - admin
userInfo:
  username: someone@somecorp.com

```

--------------------------------

### Enable Kyverno Tracing via Helm Values

Source: https://kyverno.io/docs/guides/tracing

Configuration for enabling tracing in various Kyverno controllers (admission, background, cleanup, reports) using Helm values. This involves setting the 'enabled' flag to true and specifying the backend receiver address and port.

```yaml
# Enable tracing in the admission controller
admissionController:
  tracing:
    # -- Enable tracing
    enabled: true
    # -- Traces receiver address
    address: <backend url>
    # -- Traces receiver port
    port: 4317

# Enable tracing in the background controller
backgroundController:
  tracing:
    # -- Enable tracing
    enabled: true
    # -- Traces receiver address
    address: <backend url>
    # -- Traces receiver port
    port: 4317

# Enable tracing in the cleanup controller
cleanupController:
  tracing:
    # -- Enable tracing
    enabled: true
    # -- Traces receiver address
    address: <backend url>
    # -- Traces receiver port
    port: 4317

# Enable tracing in the reports controller
reportsController:
  tracing:
    # -- Enable tracing
    enabled: true
    # -- Traces receiver address
    address: <backend url>
    # -- Traces receiver port
    port: 4317

```

--------------------------------

### Verify Pipeline Bundle Signature with Public Key

Source: https://kyverno.io/docs/policy-types/cluster-policy/verify-images/sigstore

This Kyverno policy verifies that Tekton PipelineRun bundles are signed with a private key matching the provided public key. It utilizes `imageExtractors` to pinpoint the bundle reference within the PipelineRun spec and `verifyImages` to enforce signature validation.

```yaml
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: signed-pipeline-bundle
spec:
  rules:
    - name: check-signature
      match:
        any:
          - resources:
              kinds:
                - PipelineRun
      imageExtractors:
        PipelineRun:
          - name: 'pipelineruns'
            path: /spec/pipelineRef
            value: 'bundle'
            key: 'name'
      verifyImages:
        - imageReferences:
            - '*'
          failureAction: Enforce
          attestors:
            - entries:
                - keys:
                    publicKeys: |-
                      -----BEGIN PUBLIC KEY-----
                      MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEahmSvGFmxMJABilV1usgsw6ImcQ/
                      gDaxw57Sq+uNGHW8Q3zUSx46PuRqdTI+4qE3Ng2oFZgLMpFN/qMrP0MQQg==
                      -----END PUBLIC KEY-----

```

--------------------------------

### Configure Warning Exit Code with No Pass Flag

Source: https://kyverno.io/docs/subprojects/kyverno-cli

Combines the `--warn-exit-code` and `--warn-no-pass` flags to ensure the CLI exits with a warning code if no objects match a policy. This is helpful during policy development or when ensuring object existence.

```bash
kyverno apply disallow-latest-tag.yaml --resource=echo-test.yaml --audit-warn --warn-exit-code 3 --warn-no-pass
```

--------------------------------

### Save Mutated Resource to Directory

Source: https://kyverno.io/docs/subprojects/kyverno-cli

Applies a mutation policy and saves the resulting mutated resource to a specified directory. If multiple resources are processed, each will be saved in the directory.

```bash
kyverno apply /path/to/policy.yaml --resource /path/to/resource.yaml -o foo/
```

--------------------------------

### Generate ConfigMap with Data Source Mode in Kyverno

Source: https://kyverno.io/docs/policy-types/generating-policy

This policy demonstrates how to generate a ConfigMap in response to a Namespace creation using the Data Source mode. It captures the namespace name and defines the ConfigMap object using CEL expressions, then applies it to the target namespace.

```yaml
apiVersion: policies.kyverno.io/v1
kind: GeneratingPolicy
metadata:
  name: zk-kafka-address
spec:
  evaluation:
    synchronize:
      enabled: true
  matchConstraints:
    resourceRules:
      - apiGroups: ['']
        apiVersions: ['v1']
        operations: ['CREATE']
        resources: ['namespaces']
  variables:
    - name: nsName
      expression: 'object.metadata.name'
    - name: downstream
      expression: >-
        [
          {
            "kind": dyn("ConfigMap"),
            "apiVersion": dyn("v1"),
            "metadata": dyn({
              "name": "zk-kafka-address",
              "namespace": string(variables.nsName),
            }),
            "data": dyn({
              "KAFKA_ADDRESS": "192.168.10.13:9092,192.168.10.14:9092,192.168.10.15:9092",
              "ZK_ADDRESS": "192.168.10.10:2181,192.168.10.11:2181,192.168.10.12:2181"
            })
          }
        ]
  generate:
    - expression: generator.Apply(variables.nsName, variables.downstream)

```

--------------------------------

### Kyverno Test Manifest Configuration

Source: https://kyverno.io/docs/subprojects/kyverno-cli

This YAML defines the structure for a Kyverno test. It specifies the policies to be tested, the resources to test against, expected results, and external variable files (like `values.yaml`) to be used during the test.

```yaml
apiVersion: cli.kyverno.io/v1alpha1
kind: Test
metadata:
  name: kyverno-test.yaml
policies:
  - policy.yaml
resources:
  - resources.yaml
results:
  - isValidatingPolicy: true
    kind: Deployment
    policy: check-deployment-namespace
    resources:
      - bad-deployment
    result: fail
  - isValidatingPolicy: true
    kind: Deployment
    policy: check-deployment-namespace
    resources:
      - good-deployment
    result: pass
  - isValidatingPolicy: true
    kind: Deployment
    policy: check-deployment-namespace
    resources:
      - skipped-deployment-1
      - skipped-deployment-2
    result: skip
variables: values.yaml

```

--------------------------------

### Verify Image Signature with Cosign

Source: https://kyverno.io/docs/policy-types/cluster-policy/verify-images/sigstore

This command verifies the signature of a container image signed with Cosign. It uses the public key (`cosign.pub`) and the image reference to check the integrity and authenticity of the image.

```bash
cosign verify --key cosign.pub ${IMAGE}

```

--------------------------------

### Apply ValidatingPolicy to Cluster Deployments

Source: https://kyverno.io/docs/subprojects/kyverno-cli

This command tests a Kyverno `ValidatingPolicy` against all `Deployment` resources currently running in the Kubernetes cluster. It uses the `--cluster` flag instead of specifying resource files.

```bash
kyverno apply /path/to/check-deployment-replicas.yaml --cluster --policy-report

```

--------------------------------

### Kubernetes API Resource URL Paths

Source: https://kyverno.io/docs/policy-types/cluster-policy/external-data-sources

Defines the standard HTTP URL paths for interacting with Kubernetes API resources. These paths vary based on whether the resource is namespaced and whether you are retrieving a collection or a specific instance.

```text
/apis/{GROUP}/{VERSION}/{RESOURCETYPE}
/apis/{GROUP}/{VERSION}/{RESOURCETYPE}/{NAME}
/apis/{GROUP}/{VERSION}/namespaces/{NAMESPACE}/{RESOURCETYPE}
/apis/{GROUP}/{VERSION}/namespaces/{NAMESPACE}/{RESOURCETYPE}/{NAME}
/api/v1/namespaces
```

--------------------------------

### View Kyverno Webhooks using kubectl

Source: https://kyverno.io/docs/guides/security

This command retrieves all Kyverno mutating and validating webhook configurations. It filters the output to show only lines containing 'kyverno', making it easy to identify relevant webhook resources.

```bash
kubectl get mutatingwebhookconfigurations,validatingwebhookconfigurations | grep kyverno
```

--------------------------------

### MutatingAdmissionPolicy: Add Label to ConfigMap

Source: https://kyverno.io/docs/subprojects/kyverno-cli

This policy, written in YAML for Kyverno, mutates a ConfigMap by adding a specific label ('lfx-mentorship: kyverno') if it doesn't already exist. It uses `ApplyConfiguration` for patching and targets CREATE operations on ConfigMaps.

```yaml
apiVersion: admissionregistration.k8s.io/v1alpha1
kind: MutatingAdmissionPolicy
metadata:
  name: 'add-label-to-configmap'
spec:
  matchConstraints:
    resourceRules:
      - apiGroups: ['']
        apiVersions: ['v1']
        operations: ['CREATE']
        resources: ['configmaps']
  failurePolicy: Fail
  reinvocationPolicy: Never
  mutations:
    - patchType: 'ApplyConfiguration'
      applyConfiguration:
        expression: >
          object.metadata.?labels["lfx-mentorship"].hasValue() ?
              Object{}
              Object{ metadata: Object.metadata{ labels: {"lfx-mentorship": "kyverno"}}}

```

--------------------------------

### Test Disallowing HostPath Volumes with ValidatingAdmissionPolicy

Source: https://kyverno.io/docs/subprojects/kyverno-cli

This snippet demonstrates testing a ValidatingAdmissionPolicy that disallows hostPath volumes. It includes the policy definition, resource manifests (one passing, one failing), and a Kyverno test manifest. The `isValidatingAdmissionPolicy: true` field is crucial for test results.

```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingAdmissionPolicy
metadata:
  name: disallow-host-path
spec:
  failurePolicy: Fail
  matchConstraints:
    resourceRules:
      - apiGroups: ['apps']
        apiVersions: ['v1']
        operations: ['CREATE', 'UPDATE']
        resources: ['deployments']
  validations:
    - expression: '!has(object.spec.template.spec.volumes) || object.spec.template.spec.volumes.all(volume, !has(volume.hostPath))'
      message: 'HostPath volumes are forbidden. The field spec.template.spec.volumes[*].hostPath must be unset.'

```

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: deployment-pass
spec:
  replicas: 1
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
        - name: nginx-server
          image: nginx
          volumeMounts:
            - name: temp
              mountPath: /scratch
      volumes:
        - name: temp
          emptyDir: {}
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: deployment-fail
spec:
  replicas: 1
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
        - name: nginx-server
          image: nginx
          volumeMounts:
            - name: udev
              mountPath: /data
      volumes:
        - name: udev
          hostPath:
            path: /etc/udev

```

```yaml
apiVersion: cli.kyverno.io/v1alpha1
kind: Test
metadata:
  name: disallow-host-path-test
policies:
  - disallow-host-path.yaml
resources:
  - deployments.yaml
results:
  - policy: disallow-host-path
    resources:
      - deployment-pass
    isValidatingAdmissionPolicy: true
    kind: Deployment
    result: pass
  - policy: disallow-host-path
    resources:
      - deployment-fail
    isValidatingAdmissionPolicy: true
    kind: Deployment
    result: fail

```

--------------------------------

### Inspect Kyverno Policy Application Events (Shell)

Source: https://kyverno.io/docs/policy-types/cluster-policy/mutate

This command shows how to inspect deployment events to verify if a Kyverno policy was applied successfully. It displays event messages, including those from Kyverno indicating policy application. This is useful for debugging and confirming policy execution.

```shell
$ kubectl describe deploy foobar
...
Events:
  Type     Reason             Age                From                   Message
  ----     ------             ----               ----                   -------
  Normal   PolicyApplied      29s (x2 over 31s)  kyverno-mutate         policy add-sec/add-sec-rule applied

```

--------------------------------

### Kyverno Auto-Generated Rules for Controllers (YAML)

Source: https://kyverno.io/docs/policy-types/cluster-policy/autogen

This YAML shows the `status.autogen.rules` generated by Kyverno. It includes rules for DaemonSet, Deployment, Job, StatefulSet, ReplicaSet, and ReplicationController, as well as a separate rule for CronJob, based on the initial Pod validation rule.

```yaml
status:
  autogen:
    rules:
      - exclude:
          resources: {}
        generate:
          clone: {}
          cloneList: {}
        match:
          any:
            - resources:
                kinds:
                  - DaemonSet
                  - Deployment
                  - Job
                  - StatefulSet
                  - ReplicaSet
                  - ReplicationController
          resources: {}
        mutate: {}
        name: autogen-validate-registries
        validate:
          failureAction: Enforce
          message: Images may only come from our internal enterprise registry.
          pattern:
            spec:
              template:
                spec:
                  containers:
                    - image: registry.domain.com/*
      - exclude:
          resources: {}
        generate:
          clone: {}
          cloneList: {}
        match:
          any:
            - resources:
                kinds:
                  - CronJob
          resources: {}
        mutate: {}
        name: autogen-cronjob-validate-registries
        validate:
          failureAction: Enforce
          message: Images may only come from our internal enterprise registry.
          pattern:
            spec:
              jobTemplate:
                spec:
                  template:
                    spec:
                      containers:
                        - image: registry.domain.com/*

```

--------------------------------

### Generate Policy Report for a Live Cluster

Source: https://kyverno.io/docs/subprojects/kyverno-cli

Generates a policy report by applying 'policy.yaml' to all resources within the live Kubernetes cluster. This command assumes the policy is intended for cluster-wide application.

```bash
kyverno apply policy.yaml --cluster --policy-report
```

--------------------------------

### Verify Webhook CA Bundle

Source: https://kyverno.io/docs/installation/customization

This command retrieves the CA bundle used for registering webhooks with the Kubernetes API server. It decodes the base64-encoded bundle and inspects it to confirm that the same root CA certificate used by Kyverno is in effect.

```bash
$ kubectl get validatingwebhookconfiguration kyverno-resource-validating-webhook-cfg -o jsonpath='{.webhooks[0].clientConfig.caBundle}' | \ 
  step base64 -d | step certificate inspect --short
X.509v3 Root CA Certificate (RSA 2048) [Serial: 0]
  Subject:     *.kyverno.svc
  Issuer:      *.kyverno.svc
  Valid from:  2023-04-14T18:33:37Z
          to:  2024-04-13T19:33:37Z

```

--------------------------------

### Kyverno Policy for Image Attestation Validation (YAML)

Source: https://kyverno.io/docs/policy-types/cluster-policy/verify-images/notary

This YAML defines a Kyverno ClusterPolicy that validates image attestations. It uses the `verifyImages` rule to check for Notary signatures on specified image references and ensures the presence and validity of 'trivy/vulnerability' and 'vex/cyclone-dx' attestations signed by a given certificate. The policy enforces strict validation and fails the build if any checks do not pass.

```yaml
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: check-image-attestation
spec:
  validationFailureAction: Enforce
  webhookTimeoutSeconds: 30
  failurePolicy: Fail
  rules:
    - name: verify-attestation-notary
      match:
        any:
          - resources:
              kinds:
                - Pod
      context:
        - name: keys
          configMap:
            name: keys
            namespace: notary-verify-attestation
      verifyImages:
        - type: Notary
          imageReferences:
            - 'ghcr.io/kyverno/test-verify-image*'
          attestations:
            - type: trivy/vulnerability
              name: trivy
              attestors:
                - entries:
                    - certificates:
                        cert: |-
                          -----BEGIN CERTIFICATE-----
                          MIIDmDCCAoCgAwIBAgIUCntgF4FftePAhEa6nZTsu/NMT3cwDQYJKoZIhvcNAQEL
                          BQAwTDELMAkGA1UEBhMCVVMxCzAJBgNVBAgMAldBMRAwDgYDVQQHDAdTZWF0dGxl
                          MQ8wDQYDVQQKDAZOb3RhcnkxDTALBgNVBAMMBHRlc3QwHhcNMjQwNjEwMTYzMTQ2
                          WhcNMzQwNjA4MTYzMTQ2WjBMMQswCQYDVQQGEwJVUzELMAkGA1UECAwCV0ExEDAO
                          BgNVBAcMB1NlYXR0bGUxDzANBgNVBAoMBk5vdGFyeTENMAsGA1UEAwwEdGVzdDCC
                          ASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAJkEGqbILiWye6C1Jz+jwwDY
                          k/rovpXzxS+EQDvfj/YKvx37Kr4cjboJORu3wtzICWhPUtVWZ21ShfjerKgNq0iB
                          mrlF4cqz2KcOfuUT3XBglH/NwhEAqOrGPQrMsoQEFWgnilr0RTc+j4vDnkdkcTj2
                          K/qPhQHRAeb97TdvFCqcZfAGqiOVUqzDGxd2INz/fJd4/nYRX3LJBn9pUGxqRwZV
                          ElP5B/aCBjJDdh6tAElT5aDnLGAB+3+W2YwG342ELyAl2ILpbSRUpKLNAfKEd7Nj
                          1moIl4or5AIlTkgewZ/AK68HPFJEV3SwNbzkgAC+/mLVCD8tqu0o0ziyIUJtoQMC
                          AwEAAaNyMHAwHQYDVR0OBBYEFFTIzCppwv0vZnAVmETPm1CfMdcYMB8GA1UdIwQY
                          MBaAFFTIzCppwv0vZnAVmETPm1CfMdcYMAkGA1UdEwQCMAAwDgYDVR0PAQH/BAQD
                          AgeAMBMGA1UdJQQMMAoGCCsGAQUFBwMDMA0GCSqGSIb3DQEBCwUAA4IBAQB8/vfP
                          /TQ3X80JEZDsttdvd9NLm08bTJ/T+nh0DIiV10aHymQT9/u+iahfm1+7mj+uv8LS
                          Y63LepQCX5p9SoFzt513pbNYXMBbRrOKpth3DD49IPL2Gce86AFGydfrakd86CL1
                          9MhFeWhtRf0KndyUX8J2s7jbpoN8HrN4/wZygiEqbQWZG8YtIZ9EewmoVMYirQqH
                          EvW93NcgmjiELuhjndcT/kHjhf8fUAgSuxiPIy6ern02fJjw40KzgiKNvxMoI9su
                          G2zu6gXmxkw+x0SMe9kX+Rg4hCIjTUM7dc66XL5LcTp4S5YEZNVC40/FgTIZoK0e
                          r1dC2/Y1SmmrIoA1
                          -----END CERTIFICATE-----
            - type: vex/cyclone-dx
              name: vex
              attestors:
                - entries:
                    - certificates:
                        cert: |-
                          -----BEGIN CERTIFICATE-----
                          MIIDmDCCAoCgAwIBAgIUCntgF4FftePAhEa6nZTsu/NMT3cwDQYJKoZIhvcNAQEL
                          BQAwTDELMAkGA1UEBhMCVVMxCzAJBgNVBAgMAldBMRAwDgYDVQQHDAdTZWF0dGxl
                          MQ8wDQYDVQQKDAZOb3RhcnkxDTALBgNVBAMMBHRlc3QwHhcNMjQwNjEwMTYzMTQ2
                          WhcNMzQwNjA4MTYzMTQ2WjBMMQswCQYDVQQGEwJVUzELMAkGA1UECAwCV0ExEDAO
                          BgNVBAcMB1NlYXR0bGUxDzANBgNVBAoMBk5vdGFyeTENMAsGA1UEAwwEdGVzdDCC
                          ASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAJkEGqbILiWye6C1Jz+jwwDY
                          k/rovpXzxS+EQDvfj/YKvx37Kr4cjboJORu3wtzICWhPUtVWZ21ShfjerKgNq0iB
                          mrlF4cqz2KcOfuUT3XBglH/NwhEAqOrGPQrMsoQEFWgnilr0RTc+j4vDnkdkcTj2
                          K/qPhQHRAeb97TdvFCqcZfAGqiOVUqzDGxd2INz/fJd4/nYRX3LJBn9pUGxqRwZV
                          ElP5B/aCBjJDdh6tAElT5aDnLGAB+3+W2YwG342ELyAl2ILpbSRUpKLNAfKEd7Nj
                          1moIl4or5AIlTkgewZ/AK68HPFJEV3SwNbzkgAC+/mLVCD8tqu0o0ziyIUJtoQMC
                          AwEAAaNyMHAwHQYDVR0OBBYEFFTIzCppwv0vZnAVmETPm1CfMdcYMB8GA1UdIwQY
                          MBaAFFTIzCppwv0vZnAVmETPm1CfMdcYMAkGA1UdEwQCMAAwDgYDVR0PAQH/BAQD
                          AgeAMBMGA1UdJQQMMAoGCCsGAQUFBwMDMA0GCSqGSIb3DQEBCwUAA4IBAQB8/vfP
                          /TQ3X80JEZDsttdvd9NLm08bTJ/T+nh0DIiV10aHymQT9/u+iahfm1+7mj+uv8LS
                          Y63LepQCX5p9SoFzt513pbNYXMBbRrOKpth3DD49IPL2Gce86AFGydfrakd86CL1
                          9MhFeWhtRf0KndyUX8J2s7jbpoN8HrN4/wZygiEqbQWZG8YtIZ9EewmoVMYirQqH
                          EvW93NcgmjiELuhjndcT/kHjhf8fUAgSuxiPIy6ern02fJjw40KzgiKNvxMoI9su
                          G2zu6gXmxkw+x0SMe9kX+Rg4hCIjTUM7dc66XL5LcTp4S5YEZNVC40/FgTIZoK0e
                          r1dC2/Y1SmmrIoA1
                          -----END CERTIFICATE-----

```

--------------------------------

### Kyverno CLI Policy Syntax Validation Command

Source: https://kyverno.io/docs/guides/migration-to-cel

This command demonstrates how to use the Kyverno CLI to validate the syntax of a policy file.

```bash
# Example command to validate policy syntax using Kyverno CLI
# kyverno --policy <policy-file.yaml> --resource <resource-file.yaml>
```

--------------------------------

### Kubernetes Resources: Pod Manifests

Source: https://kyverno.io/docs/subprojects/kyverno-cli

Kubernetes Pod resource manifests for 'test-global-prod' and 'test-global-dev'. These are used to test policy application with global and resource-specific variables.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-global-prod
spec:
  containers:
    - name: nginx
      image: nginx:latest
---
apiVersion: v1
kind: Pod
metadata:
  name: test-global-dev
spec:
  containers:
    - name: nginx
      image: nginx:1.12
```

--------------------------------

### Check for 'app' Label in Deployments with Wildcards (YAML)

Source: https://kyverno.io/docs/policy-types/cluster-policy/validate

This policy enforces the presence of the 'app' label in Deployment, StatefulSet, and DaemonSet resources. It uses the '?*' wildcard to ensure the 'app' label exists and has at least one alphanumeric character.

```yaml
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: check-label-app
spec:
  rules:
    - name: check-label-app
      match:
        any:
          - resources:
              kinds:
                - Deployment
                - StatefulSet
                - DaemonSet
      validate:
        failureAction: Enforce
        message: 'The label `app` is required.'
        pattern:
          spec:
            template:
              metadata:
                labels:
                  app: '?*'

```

--------------------------------

### Generate ConfigMap then Mutate Namespace Label (Kyverno)

Source: https://kyverno.io/docs/policy-types/cluster-policy/mutate

This policy generates a ConfigMap in a new Namespace and then uses a 'mutate existing' rule to label the Namespace as 'ready'. It requires `skipBackgroundRequests: false` on the mutate rule to process the request from the generate rule, enabling mutations on existing resources after generation.

```yaml
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: demo-cluster-policy
spec:
  rules:
    - name: demo-generate
      match:
        any:
          - resources:
              kinds:
                - Namespace
              operations:
                - CREATE
      generate:
        apiVersion: v1
        kind: ConfigMap
        name: somecustomcm
        namespace: '{{request.object.metadata.name}}'
        synchronize: false
        data:
          metadata:
            labels:
              custom/related-namespace: '{{request.object.metadata.name}}'
          data:
            key: value
    - name: demo-mutate-existing
      skipBackgroundRequests: false
      match:
        all:
          - resources:
              kinds:
                - ConfigMap
              selector:
                matchLabels:
                  custom/related-namespace: '?*'
      mutate:
        mutateExistingOnPolicyUpdate: false
        targets:
          - apiVersion: v1
            kind: Namespace
            name: '{{ request.object.metadata.labels."custom/related-namespace" }}'
        patchStrategicMerge:
          metadata:
            labels:
              custom/namespace-ready: 'true'

```

--------------------------------

### Configure Wildcard Permissions for Kyverno Controllers (Helm)

Source: https://kyverno.io/docs/installation/upgrading

This configuration allows Kyverno controllers to maintain wildcard view permissions for all resources, including sensitive information. It is recommended to use explicit permissions instead of wildcards for enhanced security. This snippet is relevant for upgrading to Kyverno 1.13 and beyond.

```yaml
admissionController:
  rbac:
    clusterRole:
      extraResources:
        - apiGroups:
            - '*'
          resources:
            - '*'
          verbs:
            - get
            - list
            - watch
backgroundController:
  rbac:
    clusterRole:
      extraResources:
        - apiGroups:
            - '*'
          resources:
            - '*'
          verbs:
            - get
            - list
            - watch
reportsController:
  rbac:
    clusterRole:
      extraResources:
        - apiGroups:
            - '*'
          resources:
            - '*'
          verbs:
            - get
            - list
            - watch
```

--------------------------------

### Kyverno Test Manifest

Source: https://kyverno.io/docs/subprojects/kyverno-cli

Defines a Kyverno Test resource to configure policy testing scenarios. It specifies policies, resources, and variables to be used during the test execution, along with expected results.

```yaml
apiVersion: cli.kyverno.io/v1alpha1
kind: Test
metadata:
  name: kyverno-test.yaml
policies:
  - policy.yaml
resources:
  - resource.yaml
variables: values.yaml
results:
  - kind: Deployment
    policy: check-deployment-replicas
    isValidatingAdmissionPolicy: true
    resources:
      - testing-deployment-1
      - testing-deployment-2
    result: skip
  - kind: Deployment
    policy: check-deployment-replicas
    isValidatingAdmissionPolicy: true
    resources:
      - staging-deployment-1
      - production-deployment-1
    result: fail
  - kind: Deployment
    policy: check-deployment-replicas
    isValidatingAdmissionPolicy: true
    resources:
      - staging-deployment-2
      - production-deployment-2
    result: pass
```

--------------------------------

### Clone Secret List with Foreach Loop in Kyverno

Source: https://kyverno.io/docs/policy-types/cluster-policy/generate

This Kyverno policy demonstrates how to clone a list of Secrets based on a label selector using a foreach loop. It iterates through namespaces specified in a ConfigMap and clones Secrets that have the 'allowedToBeCloned: "true"' label into a target namespace.

```yaml
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: foreach-cpol-clone-list-sync-delete-source
spec:
  rules:
    - match:
        any:
          - resources:
              kinds:
                - ConfigMap
      name: k-kafka-address
      context:
        - name: configmapns
          variable:
            jmesPath: request.object.metadata.namespace
      preconditions:
        any:
          - key: '{{configmapns}}'
            operator: Equals
            value: '{{request.object.metadata.namespace}}'
      generate:
        generateExisting: false
        synchronize: true
        foreach:
          - list: request.object.data.namespaces | split(@, ',')
            context:
              - name: ns
                variable:
                  jmesPath: element
            preconditions:
              any:
                - key: '{{ ns }}'
                  operator: AnyIn
                  value:
                    - foreach-cpol-clone-list-sync-delete-source-target-ns-1
            namespace: '{{ ns }}'
            cloneList:
              kinds:
                - v1/Secret
              namespace: foreach-cpol-clone-list-sync-delete-source-existing-ns
              selector:
                matchLabels:
                  allowedToBeCloned: 'true'

```

--------------------------------

### Specify Custom Test File Name (CLI)

Source: https://kyverno.io/docs/subprojects/kyverno-cli

This command uses the `-f` flag to specify a custom file name for test cases. By default, Kyverno searches for a file named `kyverno-test.yaml`.

```bash
kyverno test . -f custom-test-file.yaml

```

--------------------------------

### Display Kyverno Version Information

Source: https://kyverno.io/docs/reference/metrics

This query retrieves the Kyverno version information. The `kyverno_info` metric is a gauge that provides a constant value of 1, with labels indicating the current version of Kyverno being used in the cluster.

```PromQL
kyverno_info
```

--------------------------------

### Kyverno ClusterPolicy for Verifying Image Attestations

Source: https://kyverno.io/docs/policy-types/cluster-policy/verify-images/notary

This ClusterPolicy defines rules for Kyverno to verify image attestations. It uses Notary to check signatures on specified image references and enforces conditions on the attestations, such as license types within an SBOM. The policy requires a ConfigMap named 'keys' in the 'kyverno' namespace to hold necessary certificates.

```yaml
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: check-image-attestation
spec:
  webhookConfiguration:
    failurePolicy: Fail
    timeoutSeconds: 30
  rules:
    - name: verify-attestation-notary
      match:
        any:
          - resources:
              kinds:
                - Pod
      context:
        - name: keys
          configMap:
            name: keys
            namespace: kyverno
      verifyImages:
        - type: Notary
          imageReferences:
            - 'ghcr.io/kyverno/test-verify-image*'
          failureAction: Enforce
          attestations:
            - type: sbom/cyclone-dx
              attestors:
                - entries:
                    - certificates:
                        cert: |-
                          -----BEGIN CERTIFICATE-----
                          MIIDTTCCAjWgAwIBAgIJAPI+zAzn4s0xMA0GCSqGSIb3DQEBCwUAMEwxCzAJBgNV
                          BAYTAlVTMQswCQYDVQQIDAJXQTEQMA4GA1UEBwwHU2VhdHRsZTEPMA0GA1UECgwG
                          Tm90YXJ5MQ0wCwYDVQQDDAR0ZXN0MB4XDTIzMDUyMjIxMTUxOFoXDTMzMDUxOTIx
                          MTUxOFowTDELMAkGA1UEBhMCVVMxCzAJBgNVBAgMAldBMRAwDgYDVQQHDAdTZWF0
                          dGxlMQ8wDQYDVQQKDAZOb3RhcnkxDTALBgNVBAMMBHRlc3QwggEiMA0GCSqGSIb3
                          DQEBAQUAA4IBDwAwggEKAoIBAQDNhTwv+QMk7jEHufFfIFlBjn2NiJaYPgL4eBS+
                          b+o37ve5Zn9nzRppV6kGsa161r9s2KkLXmJrojNy6vo9a6g6RtZ3F6xKiWLUmbAL
                          hVTCfYw/2n7xNlVMjyyUpE+7e193PF8HfQrfDFxe2JnX5LHtGe+X9vdvo2l41R6m
                          Iia04DvpMdG4+da2tKPzXIuLUz/FDb6IODO3+qsqQLwEKmmUee+KX+3yw8I6G1y0
                          Vp0mnHfsfutlHeG8gazCDlzEsuD4QJ9BKeRf2Vrb0ywqNLkGCbcCWF2H5Q80Iq/f
                          ETVO9z88R7WheVdEjUB8UrY7ZMLdADM14IPhY2Y+tLaSzEVZAgMBAAGjMjAwMAkG
                          A1UdEwQCMAAwDgYDVR0PAQH/BAQDAgeAMBMGA1UdJQQMMAoGCCsGAQUFBwMDMA0G
                          CSqGSIb3DQEBCwUAA4IBAQBX7x4Ucre8AIUmXZ5PUK/zUBVOrZZzR1YE8w86J4X9
                          kYeTtlijf9i2LTZMfGuG0dEVFN4ae3CCpBst+ilhIndnoxTyzP+sNy4RCRQ2Y/k8
                          Zq235KIh7uucq96PL0qsF9s2RpTKXxyOGdtp9+HO0Ty5txJE2txtLDUIVPK5WNDF
                          ByCEQNhtHgN6V20b8KU2oLBZ9vyB8V010dQz0NRTDLhkcvJig00535/LUylECYAJ
                          5/jn6XKt6UYCQJbVNzBg/YPGc1RF4xdsGVDBben/JXpeGEmkdmXPILTKd9tZ5TC0
                          uOKpF5rWAruB5PCIrquamOejpXV9aQA/K2JQDuc0mcKz
                          -----END CERTIFICATE-----
              conditions:
                - all:
                    - key: '{{ components[].licenses[].expression }}'
                      operator: AllIn
                      value: ['GPL-3.0']

```

--------------------------------

### Verify ClusterRole Aggregation

Source: https://kyverno.io/docs/installation/customization

This command retrieves the YAML definition of the 'kyverno:background-controller' ClusterRole to verify that permissions from aggregated roles have been successfully applied.

```bash
kubectl get clusterrole kyverno:background-controller -o yaml

```

--------------------------------

### Apply Policies with Namespace Selector

Source: https://kyverno.io/docs/subprojects/kyverno-cli

Applies policies to resources, filtering by namespace using a namespace selector defined in a values file. This is useful for targeting specific environments or groups of namespaces.

```bash
kyverno apply /path/to/policy1.yaml /path/to/policy2.yaml --resource /path/to/resource1.yaml --resource /path/to/resource2.yaml -f /path/to/value.yaml
```

--------------------------------

### Verify Attestation with Public Key

Source: https://kyverno.io/docs/policy-types/cluster-policy/verify-images/sigstore

Verifies an attestation for a given image using a public key. The --type flag specifies the type of attestation to verify.

```bash
cosign verify-attestation --key cosign.pub --type <type> ${IMAGE}
```

--------------------------------

### Verify Sigstore Bundles with Kyverno

Source: https://kyverno.io/docs/policy-types/cluster-policy/verify-images/sigstore

This policy verifies container image signatures using the Sigstore bundle format, specifically for images containing SLSA Provenance created with GitHub Artifact Attestation. It uses the `SigstoreBundle` verification type and specifies conditions for the attestations.

```yaml
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  annotations:
    pod-policies.kyverno.io/autogen-controllers: none
  name: sigstore-attestation-verification
spec:
  background: false
  validationFailureAction: Enforce
  webhookTimeoutSeconds: 30
  rules:
    - match:
        any:
          - resources:
              kinds:
                - Pod
      name: sigstore-attestation-verification
      verifyImages:
        - imageReferences:
            - '*'
          type: SigstoreBundle
          attestations:
            - attestors:
                - entries:
                    - keyless:
                        issuer: https://token.actions.githubusercontent.com
                        subject: https://github.com/vishal-chdhry/artifact-attestation-example/.github/workflows/build-attested-image.yaml@refs/heads/main
                        rekor:
                          url: https://rekor.sigstore.dev
              conditions:
                - all:
                    - key: '{{ buildDefinition.buildType }}'
                      operator: Equals
                      value: https://actions.github.io/buildtypes/workflow/v1
              type: https://slsa.dev/provenance/v1

```

--------------------------------

### Kubernetes Deployment Manifests

Source: https://kyverno.io/docs/subprojects/kyverno-cli

Defines multiple Kubernetes Deployments across different namespaces (staging and production) with varying replica counts. These manifests are used to illustrate application deployment configurations.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: staging-deployment-1
  namespace: staging
  labels:
    app: nginx
spec:
  replicas: 4
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
        - name: nginx
          image: nginx:latest
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: staging-deployment-2
  namespace: staging
  labels:
    app: nginx
spec:
  replicas: 2
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
        - name: nginx
          image: nginx:latest
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: production-deployment-1
  namespace: production
  labels:
    app: nginx
spec:
  replicas: 4
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
        - name: nginx
          image: nginx:latest
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: production-deployment-2
  namespace: production
  labels:
    app: nginx
spec:
  replicas: 2
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
        - name: nginx
          image: nginx:latest
```

--------------------------------

### Download Kyverno Dashboard JSON

Source: https://kyverno.io/docs/guides/monitoring

Downloads the Kyverno dashboard JSON file from a GitHub repository using curl. This file is required for importing the dashboard into Grafana.

```shell
curl -fsS https://raw.githubusercontent.com/kyverno/kyverno/main/charts/kyverno/charts/grafana/dashboard/kyverno-dashboard.json -o kyverno-dashboard.json
```

--------------------------------

### Compare Kubernetes Labels with label_match()

Source: https://kyverno.io/docs/policy-types/cluster-policy/jmespath

The `label_match()` filter compares two sets of Kubernetes labels (key and value) and returns a boolean indicating if they are equivalent. It's useful for associating resources based on label selectors, similar to the Kubernetes API server. A 'true' output means all labels from the first set are present in the second, which may contain additional labels.

```yaml
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: require-pdb
spec:
  background: false
  rules:
    - name: require-pdb
      match:
        any:
          - resources:
              kinds:
                - Deployment
              operations:
                - CREATE
      context:
        - name: pdb_count
          apiCall:
            urlPath: '/apis/policy/v1beta1/namespaces/{{request.namespace}}/poddisruptionbudgets'
            jmesPath: 'items[?label_match(spec.selector.matchLabels, `{{request.object.spec.template.metadata.labels}}`)] | length(@)'
      validate:
        failureAction: Audit
        message: 'There is no corresponding PodDisruptionBudget found for this Deployment.'
        deny:
          conditions:
            any:
              - key: '{{pdb_count}}'
                operator: LessThan
                value: 1

```

--------------------------------

### Generate Cosign Key Pair

Source: https://kyverno.io/docs/policy-types/cluster-policy/verify-images/sigstore

This command generates a public-private key pair for signing images using Cosign. The generated keys are essential for the subsequent signing and verification steps.

```bash
cosign generate-key-pair

```

--------------------------------

### Monitor Policy Rule Execution Latency

Source: https://kyverno.io/docs/reference/metrics

These queries analyze the latency of policy rule executions. They allow administrators to identify slow-performing rules or policies and optimize them for better performance.

```promql
avg(kyverno_policy_execution_duration_seconds{}) by (rule_type)
```

```promql
max(kyverno_policy_execution_duration_seconds{rule_type="validate"}[24h])
```

```promql
avg(kyverno_policy_execution_duration_seconds{policy_validation_mode="enforce", policy_namespace="default", policy_type="namespaced"}) by (policy_name)
```

--------------------------------

### Generate and Enable Kyverno Completion for PowerShell

Source: https://kyverno.io/docs/kyverno-cli/reference/kyverno_completion

Generates the autocompletion script for kyverno for PowerShell. This script enables tab completion for kyverno commands, subcommands, flags, and arguments. It can be executed for the current session or added to the PowerShell profile for permanent enabling.

```powershell
# Generate PowerShell completion
kyverno completion powershell | Out-String | Invoke-Expression

# To permanently enable PowerShell completion, add to your profile:
kyverno completion powershell >> $PROFILE
```

--------------------------------

### Restart Monitoring Deployments and StatefulSets

Source: https://kyverno.io/docs/guides/monitoring

Restarts all Deployments and StatefulSets in the 'monitoring' namespace. This ensures that any changes, including the new ServiceMonitor, are picked up by the monitoring components.

```shell
kubectl rollout restart deploy,sts -n monitoring
```

--------------------------------

### Compare Semantic Versions using semver_compare()

Source: https://kyverno.io/docs/policy-types/cluster-policy/jmespath

The `semver_compare()` filter compares two semantic version strings. It returns a boolean indicating the position of the second version relative to the first. The second string can include operators and supports AND/OR logic, as well as the 'x' placeholder. It is useful for validating software versions.

```yaml
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: semver-compare-demo
spec:
  background: false
  rules:
    - name: check-sbom
      match:
        any:
          - resources:
              kinds:
                - Pod
      verifyImages:
        - image: 'ghcr.io/kyverno/test-verify-image*'
          failureAction: Enforce
          key: |-
            -----BEGIN PUBLIC KEY-----
            MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEHMmDjK65krAyDaGaeyWNzgvIu155
            JI50B2vezCw8+3CVeE0lJTL5dbL3OP98Za0oAEBJcOxky8Riy/XcmfKZbw==
            -----END PUBLIC KEY-----
          attestations:
            - predicateType: https://example.com/CycloneDX/v1
              conditions:
                - all:
                    - key: "{{ components[?name == 'commons-logging'].version | [0] }}"
                      operator: GreaterThanOrEquals
                      value: '1.2.0'
                    - key: "{{ semver_compare( {{ components[?name == 'httpclient'].version | [0] }}, '>4.5.0') }}"
                      operator: Equals
                      value: true
```

--------------------------------

### Kyverno Policy Denying Specific Container Image

Source: https://kyverno.io/docs/policy-types/cluster-policy/jmespath

This Kyverno policy snippet demonstrates how to deny a Pod if it uses the 'busybox' image in any of its containers. It utilizes the flattened array of container images queried using JMESPath.

```yaml
deny:
  conditions:
    any:
      - key: busybox
        operator: AnyIn
        value: '{{request.object.spec.[initContainers, containers][].image}}'
```

--------------------------------

### Configure Resource Filters to Skip Specific Resources in Kyverno ConfigMap

Source: https://kyverno.io/docs/installation/customization

This configuration illustrates how to set `resourceFilters` in the Kyverno ConfigMap to exclude specific Kubernetes kinds, namespaces, or names from admission review. The format is a sequence of `[<Kind>,<Namespace>,<Name>]` entries, supporting wildcards. This acts as a final layer of filtering before Kyverno processes a request.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: kyverno
  namespace: kyverno
data:
  # resource types to be skipped by Kyverno
  resourceFilters:
    '[*/*,kyverno,*] [Event,*,*] [*/*,kube-system,*] [*/*,kube-public,*]
    [*/*,kube-node-lease,*] [Node,*,*] [Node/*,*,*] <snip>'

```

--------------------------------

### Kyverno Values Manifest

Source: https://kyverno.io/docs/subprojects/kyverno-cli

Defines a Kyverno Values resource to specify variable configurations for different namespaces. This manifest is used to provide dynamic values to Kyverno policies.

```yaml
apiVersion: cli.kyverno.io/v1alpha1
kind: Values
metadata:
  name: values
namespaceSelector:
  - name: staging
    labels:
      environment: staging
  - name: production
    labels:
      environment: production
  - name: testing
    labels:
      environment: testing
```

--------------------------------

### Compare Strings Lexicographically with Kyverno

Source: https://kyverno.io/docs/policy-types/cluster-policy/jmespath

The compare() filter provides lexicographical string comparison, similar to Golang's built-in function. It returns 0 if strings are equal, -1 if the first is lexicographically smaller, and 1 if the first is larger. While useful, Kyverno's built-in operators like 'Equals' are often more practical for simple comparisons in preconditions or deny conditions.

```yaml
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: compare-demo
spec:
  background: false
  rules:
    - name: write-dictionary
      match:
        any:
          - resources:
              kinds:
                - Service
      preconditions:
        any:
          - key: "{{ compare('{{request.object.metadata.annotations.foo}}', '{{request.object.metadata.annotations.bar}}') }}"
            operator: LessThan
            value: 0
      mutate:
        patchStrategicMerge:
          metadata:
            labels:
              dictionary: '{{request.object.metadata.annotations.foo}}-{{request.object.metadata.annotations.bar}}'

```