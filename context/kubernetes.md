# Kubernetes

> **Used by**: Architect, DevSecOps
> **What to paste**: core resource manifests (Deployment, Service, ConfigMap, Secret, Ingress, NetworkPolicy), kubectl cheat sheet, RBAC patterns, resource quotas.
> **Source**: https://kubernetes.io/docs/

<!-- PASTE CONTEXT BELOW THIS LINE -->


### Go Client Installation

Source: https://kubernetes.io/docs/tasks/_print

Instructions for obtaining the `client-go` library using `go get`. Ensure you specify the correct Kubernetes version and refer to `INSTALL.md` for detailed setup.

```bash
go get k8s.io/client-go@kubernetes-<kubernetes-version-number>

```

--------------------------------

### Example: Start Kubelet with Dynamic Config

Source: https://kubernetes.io/docs/reference/_print

Example showing how to write a dynamic environment file with kubelet flags from an InitConfiguration file and start the kubelet. This is useful for managing kubelet settings via a configuration file.

```bash
kubeadm init phase kubelet-start --config config.yaml
```

--------------------------------

### Install and run kubelet service

Source: https://kubernetes.io/docs/tutorials/cluster-management/kubelet-standalone

Set permissions for the binary, create a systemd service file, and start the service.

```bash
chmod +x kubelet
sudo cp kubelet /usr/bin/
```

```bash
sudo tee /etc/systemd/system/kubelet.service <<EOF
[Unit]
Description=Kubelet

[Service]
ExecStart=/usr/bin/kubelet \
 --config=/etc/kubernetes/kubelet.yaml
Restart=always

[Install]
WantedBy=multi-user.target
EOF
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now kubelet.service
```

--------------------------------

### Minikube Version Example

Source: https://kubernetes.io/docs/tasks/administer-cluster/network-policy-provider/cilium-network-policy

This is an example output of the 'minikube version' command, indicating the installed version.

```text
minikube version: v1.5.2

```

--------------------------------

### Create and Install a Kubectl Plugin

Source: https://kubernetes.io/docs/tasks/extend-kubectl/kubectl-plugins

This example demonstrates how to create a simple bash script as a kubectl plugin, make it executable, and install it into the system's PATH for kubectl to recognize.

```bash
# create a plugin
echo -e '#!/bin/bash\n\necho "My first command-line argument was $1"' > kubectl-foo-bar-baz
sudo chmod +x ./kubectl-foo-bar-baz

# "install" your plugin by moving it to a directory in your $PATH
sudo mv ./kubectl-foo-bar-baz /usr/local/bin
```

--------------------------------

### Get documentation for pods

Source: https://kubernetes.io/docs/reference/kubectl/generated/kubectl_explain

This example shows how to get the documentation for the 'pods' resource and its fields.

```bash
kubectl explain pods
```

--------------------------------

### Install and configure shell completion

Source: https://kubernetes.io/docs/reference/kubectl/generated/kubectl_completion/_print

Examples for installing and enabling autocompletion across different shells and operating systems.

```bash
  # Installing bash completion on macOS using homebrew
  ## If running Bash 3.2 included with macOS
  brew install bash-completion
  ## or, if running Bash 4.1+
  brew install bash-completion@2
  ## If kubectl is installed via homebrew, this should start working immediately
  ## If you've installed via other means, you may need add the completion to your completion directory
  kubectl completion bash > $(brew --prefix)/etc/bash_completion.d/kubectl
  
  
  # Installing bash completion on Linux
  ## If bash-completion is not installed on Linux, install the 'bash-completion' package
  ## via your distribution's package manager.
  ## Load the kubectl completion code for bash into the current shell
  source <(kubectl completion bash)
  ## Write bash completion code to a file and source it from .bash_profile
  kubectl completion bash > ~/.kube/completion.bash.inc
  printf "
  # kubectl shell completion
  source '$HOME/.kube/completion.bash.inc'
  " >> $HOME/.bash_profile
  source $HOME/.bash_profile
  
  # Load the kubectl completion code for zsh[1] into the current shell
  source <(kubectl completion zsh)
  # Set the kubectl completion code for zsh[1] to autoload on startup
  kubectl completion zsh > "${fpath[1]}/_kubectl"
  
  
  # Load the kubectl completion code for fish[2] into the current shell
  kubectl completion fish | source
  # To load completions for each session, execute once:
  kubectl completion fish > ~/.config/fish/completions/kubectl.fish
  
  # Load the kubectl completion code for powershell into the current shell
  kubectl completion powershell | Out-String | Invoke-Expression
  # Set kubectl completion code for powershell to run on startup
  ## Save completion code to a script and execute in the profile
  kubectl completion powershell > "$HOME\.kube\completion.ps1"
  Add-Content $PROFILE ". '$HOME\.kube\completion.ps1'"
  ## Execute completion code in the profile
  Add-Content $PROFILE "if (Get-Command kubectl -ErrorAction SilentlyContinue) {
  kubectl completion powershell | Out-String | Invoke-Expression
  }"
  ## Add completion code directly to the $PROFILE script
  kubectl completion powershell >> $PROFILE
```

--------------------------------

### View kuberc configuration examples

Source: https://kubernetes.io/docs/reference/_print

Examples showing how to view configuration in different formats or from specific files.

```bash
  # View kuberc configuration in YAML format (default)
  kubectl alpha kuberc view
  
  # View kuberc configuration in JSON format
  kubectl alpha kuberc view --output json
  
  # View a specific kuberc file
  kubectl alpha kuberc view --kuberc /path/to/kuberc
```

--------------------------------

### Start kubelet

Source: https://kubernetes.io/docs/reference/setup-tools/kubeadm/kubeadm-init-phase

Writes the kubelet configuration and environment files, then starts the kubelet service.

```bash
kubeadm init phase kubelet-start [flags]
```

```bash
  # Writes a dynamic environment file with kubelet flags from a InitConfiguration file.
  kubeadm init phase kubelet-start --config config.yaml
```

--------------------------------

### Install Go Client Library

Source: https://kubernetes.io/docs/tasks/access-application-cluster/access-cluster

Use this command to get the Go client library. Refer to INSTALL.md for detailed instructions and check the GitHub repository for supported versions.

```bash
go get k8s.io/client-go@kubernetes-<kubernetes-version-number>
```

--------------------------------

### Install Kompose using go get

Source: https://kubernetes.io/docs/tasks/configure-pod-container/translate-compose-kubernetes

Install Kompose from the master branch using go get. This method fetches the latest development changes.

```bash
go get -u github.com/kubernetes/kompose
```

--------------------------------

### Examples of setting credentials

Source: https://kubernetes.io/docs/reference/kubectl/generated/kubectl_config/kubectl_config_set-credentials

Various practical examples for configuring different authentication types in kubeconfig.

```bash
  # Set only the "client-key" field on the "cluster-admin"
  # entry, without touching other values
  kubectl config set-credentials cluster-admin --client-key=~/.kube/admin.key
  
  # Set basic auth for the "cluster-admin" entry
  kubectl config set-credentials cluster-admin --username=admin --password=uXFGweU9l35qcif
  
  # Embed client certificate data in the "cluster-admin" entry
  kubectl config set-credentials cluster-admin --client-certificate=~/.kube/admin.crt --embed-certs=true
  
  # Enable the Google Compute Platform auth provider for the "cluster-admin" entry
  kubectl config set-credentials cluster-admin --auth-provider=gcp
  
  # Enable the OpenID Connect auth provider for the "cluster-admin" entry with additional arguments
  kubectl config set-credentials cluster-admin --auth-provider=oidc --auth-provider-arg=client-id=foo --auth-provider-arg=client-secret=bar
  
  # Remove the "client-secret" config value for the OpenID Connect auth provider for the "cluster-admin" entry
  kubectl config set-credentials cluster-admin --auth-provider=oidc --auth-provider-arg=client-secret-
  
  # Enable new exec auth plugin for the "cluster-admin" entry
  kubectl config set-credentials cluster-admin --exec-command=/path/to/the/executable --exec-api-version=client.authentication.k8s.io/v1beta1
  
  # Enable new exec auth plugin for the "cluster-admin" entry with interactive mode
  kubectl config set-credentials cluster-admin --exec-command=/path/to/the/executable --exec-api-version=client.authentication.k8s.io/v1beta1 --exec-interactive-mode=Never
  
  # Define new exec auth plugin arguments for the "cluster-admin" entry
  kubectl config set-credentials cluster-admin --exec-arg=arg1 --exec-arg=arg2
  
  # Create or update exec auth plugin environment variables for the "cluster-admin" entry
  kubectl config set-credentials cluster-admin --exec-env=key1=val1 --exec-env=key2=val2
  
  # Remove exec auth plugin environment variables for the "cluster-admin" entry
  kubectl config set-credentials cluster-admin --exec-env=var-to-remove-
```

--------------------------------

### PersistentVolume list example

Source: https://kubernetes.io/docs/tasks/administer-cluster/_print

An example output of the `kubectl get pv` command, showing PersistentVolumes with their details.

```text
NAME                                       CAPACITY   ACCESSMODES   RECLAIMPOLICY   STATUS    CLAIM             STORAGECLASS     REASON    AGE
pvc-b6efd8da-b7b5-11e6-9d58-0ed433a7dd94   4Gi        RWO           Delete          Bound     default/claim1    manual                     10s
pvc-b95650f8-b7b5-11e6-9d58-0ed433a7dd94   4Gi        RWO           Delete          Bound     default/claim2    manual                     6s
pvc-bb3ca71d-b7b5-11e6-9d58-0ed433a7dd94   4Gi        RWO           Delete          Bound     default/claim3    manual                     3s
```

--------------------------------

### View rollout history examples

Source: https://kubernetes.io/docs/reference/kubectl/generated/_print

Examples showing how to view the history of a deployment and specific revision details for a daemonset.

```bash
  # View the rollout history of a deployment
  kubectl rollout history deployment/abc
  
  # View the details of daemonset revision 3
  kubectl rollout history daemonset/abc --revision=3
```

--------------------------------

### Create a ClusterIP service examples

Source: https://kubernetes.io/docs/reference/kubectl/generated/kubectl_create/kubectl_create_service_clusterip

Examples for creating a standard ClusterIP service and a headless service.

```bash
  # Create a new ClusterIP service named my-cs
  kubectl create service clusterip my-cs --tcp=5678:8080
  
  # Create a new ClusterIP service named my-cs (in headless mode)
  kubectl create service clusterip my-cs --clusterip="None"
```

--------------------------------

### Examples for kubectl create rolebinding

Source: https://kubernetes.io/docs/reference/_print

Practical examples demonstrating how to bind users, groups, and service accounts to specific roles.

```bash
  # Create a role binding for user1, user2, and group1 using the admin cluster role
  kubectl create rolebinding admin --clusterrole=admin --user=user1 --user=user2 --group=group1
  
  # Create a role binding for service account monitoring:sa-dev using the admin role
  kubectl create rolebinding admin-binding --role=admin --serviceaccount=monitoring:sa-dev
```

--------------------------------

### Create deployment and kustomization files

Source: https://kubernetes.io/docs/tasks/_print

Initial setup for a deployment and a kustomization file with namespace, prefix, suffix, and label configurations.

```bash
cat <<EOF >./deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    app: nginx
spec:
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
        image: nginx
EOF

cat <<EOF >./kustomization.yaml
namespace: my-namespace
namePrefix: dev-
nameSuffix: "-001"
labels:
  - pairs:
      app: bingo
    includeSelectors: true 
commonAnnotations:
  oncallPager: 800-555-1212
resources:
- deployment.yaml
EOF
```

--------------------------------

### Start application deployment

Source: https://kubernetes.io/docs/tasks/extend-kubernetes/_print

Deploy a sample application to the cluster for testing.

```bash
kubectl create deployment hello-app --image=gcr.io/google-samples/hello-app:2.0 --port=8080
```

--------------------------------

### Example Pod Output

Source: https://kubernetes.io/docs/tasks/extend-kubernetes/configure-multiple-schedulers

This is an example output from `kubectl get pods --namespace=kube-system`, showing a running `my-scheduler` pod alongside other system pods.

```text
NAME                                           READY     STATUS    RESTARTS   AGE
....
my-scheduler-lnf4s-4744f                       1/1       Running   0          2m
...

```

--------------------------------

### Node Information Output Example

Source: https://kubernetes.io/docs/tutorials/services/_print

Example output from `kubectl get nodes`, showing node names, status, roles, age, and Kubernetes version.

```bash
NAME                           STATUS     ROLES    AGE     VERSION
kubernetes-node-6jst   Ready      <none>   2h      v1.13.0
kubernetes-node-cx31   Ready      <none>   2h      v1.13.0
kubernetes-node-jj1t   Ready      <none>   2h      v1.13.0
```

--------------------------------

### Example kubectl get pods Output

Source: https://kubernetes.io/docs/tasks/extend-kubernetes/socks5-proxy-access-api

This is an example output from the 'kubectl get pods' command when run through the SOCKS5 proxy.

```bash
NAMESPACE     NAME                                     READY   STATUS      RESTARTS   AGE
kube-system   coredns-85cb69466-klwq8                  1/1     Running     0          5m46s

```

--------------------------------

### Create role binding examples

Source: https://kubernetes.io/docs/reference/kubectl/generated/kubectl_create/kubectl_create_rolebinding

Examples showing how to bind users, groups, and service accounts to roles.

```bash
  # Create a role binding for user1, user2, and group1 using the admin cluster role
  kubectl create rolebinding admin --clusterrole=admin --user=user1 --user=user2 --group=group1
  
  # Create a role binding for service account monitoring:sa-dev using the admin role
  kubectl create rolebinding admin-binding --role=admin --serviceaccount=monitoring:sa-dev
```

--------------------------------

### View last-applied-configuration examples

Source: https://kubernetes.io/docs/reference/kubectl/generated/kubectl_apply/kubectl_apply_view-last-applied

Examples showing how to view annotations by resource type/name or by file with specific output formats.

```bash
  # View the last-applied-configuration annotations by type/name in YAML
  kubectl apply view-last-applied deployment/nginx
  
  # View the last-applied-configuration annotations by file in JSON
  kubectl apply view-last-applied -f deploy.yaml -o json
```

--------------------------------

### Example Scheduler Pod Output

Source: https://kubernetes.io/docs/tasks/_print

This is an example output from 'kubectl get pods --namespace=kube-system', showing a running custom scheduler pod.

```text
NAME                                           READY     STATUS    RESTARTS   AGE
....
my-scheduler-lnf4s-4744f                       1/1       Running   0          2m
...
```

--------------------------------

### Pod Status Output Example

Source: https://kubernetes.io/docs/tasks/_print

Example output of `kubectl get pods` showing a pod with `TopologyAffinityError` status.

```text
NAME         READY   STATUS                  RESTARTS   AGE
guaranteed   0/1     TopologyAffinityError   0          113s

```

--------------------------------

### Start minikube with CNI network plugin

Source: https://kubernetes.io/docs/tasks/administer-cluster/_print

Start minikube with the CNI network plugin enabled, which is a prerequisite for Cilium installation.

```bash
minikube start --network-plugin=cni
```

--------------------------------

### Install Cilium on Minikube

Source: https://kubernetes.io/docs/tasks/administer-cluster/network-policy-provider/_print

Commands to verify minikube version, start the cluster with CNI support, and install the Cilium CLI.

```bash
minikube version
```

```bash
minikube version: v1.5.2
```

```bash
minikube start --network-plugin=cni
```

```bash
curl -LO https://github.com/cilium/cilium-cli/releases/latest/download/cilium-linux-amd64.tar.gz
```

```bash
sudo tar xzvfC cilium-linux-amd64.tar.gz /usr/local/bin
rm cilium-linux-amd64.tar.gz
```

```bash
cilium install
```

--------------------------------

### Verify Device Driver Installation

Source: https://kubernetes.io/docs/tasks/configure-pod-container/assign-resources/_print

Command to list ResourceSlices and an example of the expected output.

```bash
kubectl get resourceslices
```

```text
NAME                                                  NODE                DRIVER               POOL                             AGE
cluster-1-device-pool-1-driver.example.com-lqx8x      cluster-1-node-1    driver.example.com   cluster-1-device-pool-1-r1gc     7s
cluster-1-device-pool-2-driver.example.com-29t7b      cluster-1-node-2    driver.example.com   cluster-1-device-pool-2-446z     8s
```

--------------------------------

### Full Kubeadm Init Configuration Example

Source: https://kubernetes.io/docs/reference/config-api/_print

A comprehensive YAML example combining InitConfiguration and ClusterConfiguration for `kubeadm init`, demonstrating detailed settings for tokens, node registration, networking, etcd, and API server.

```yaml
apiVersion: kubeadm.k8s.io/v1beta3
kind: InitConfiguration
bootstrapTokens:
  - token: "9a08jv.c0izixklcxtmnze7"
    description: "kubeadm bootstrap token"
    ttl: "24h"
  - token: "783bde.3f89s0fje9f38fhf"
    description: "another bootstrap token"
    usages:
      - authentication
      - signing
    groups:
      - system:bootstrappers:kubeadm:default-node-token
nodeRegistration:
  name: "ec2-10-100-0-1"
  criSocket: "/var/run/dockershim.sock"
  taints:
    - key: "kubeadmNode"
      value: "someValue"
      effect: "NoSchedule"
  kubeletExtraArgs:
    v: 4
  ignorePreflightErrors:
    - IsPrivilegedUser
  imagePullPolicy: "IfNotPresent"
localAPIEndpoint:
  advertiseAddress: "10.100.0.1"
  bindPort: 6443
certificateKey: "e6a2eb8581237ab72a4f494f30285ec12a9694d750b9785706a83bfcbbbd2204"
skipPhases:
  - addon/kube-proxy
---
apiVersion: kubeadm.k8s.io/v1beta3
kind: ClusterConfiguration
etcd:
  # one of local or external
  local:
    imageRepository: "registry.k8s.io"
    imageTag: "3.2.24"
    dataDir: "/var/lib/etcd"
    extraArgs:
      listen-client-urls: "http://10.100.0.1:2379"
    serverCertSANs:
      -  "ec2-10-100-0-1.compute-1.amazonaws.com"
    peerCertSANs:
      - "10.100.0.1"
  # external:
    # endpoints:
    # - "10.100.0.1:2379"
    # - "10.100.0.2:2379"
    # caFile: "/etcd/kubernetes/pki/etcd/etcd-ca.crt"
    # certFile: "/etcd/kubernetes/pki/etcd/etcd.crt"
    # keyFile: "/etcd/kubernetes/pki/etcd/etcd.key"
networking:
  serviceSubnet: "10.96.0.0/16"
  podSubnet: "10.244.0.0/24"
  dnsDomain: "cluster.local"
kubernetesVersion: "v1.21.0"
controlPlaneEndpoint: "10.100.0.1:6443"
apiServer:
  extraArgs:
    authorization-mode: "Node,RBAC"
  extraVolumes:
    - name: "some-volume"
      hostPath: "/etc/some-path"
      mountPath: "/etc/some-pod-path"
      readOnly: false
      pathType: File
  certSANs:
    - "10.100.1.1"
    - "ec2-10-100-0-1.compute-1.amazonaws.com"
  timeoutForControlPlane: 4m0s
controllerManager:
  extraArgs:
    "node-cidr-mask-size": "20"
  extraVolumes:
    - name: "some-volume"

```

--------------------------------

### Apply configuration examples

Source: https://kubernetes.io/docs/reference/kubectl/_print

Common usage patterns for applying resources using files, directories, stdin, and pruning options.

```bash
# Apply the configuration in pod.json to a pod
  kubectl apply -f ./pod.json
  
  # Apply resources from a directory containing kustomization.yaml - e.g. dir/kustomization.yaml
  kubectl apply -k dir/
  
  # Apply the JSON passed into stdin to a pod
  cat pod.json | kubectl apply -f -
  
  # Apply the configuration from all files that end with '.json'
  kubectl apply -f '*.json'
  
  # Note: --prune is still in Alpha
  # Apply the configuration in manifest.yaml that matches label app=nginx and delete all other resources that are not in the file and match label app=nginx
  kubectl apply --prune -f manifest.yaml -l app=nginx
  
  # Apply the configuration in manifest.yaml and delete all the other config maps that are not in the file
  kubectl apply --prune -f manifest.yaml --all --prune-allowlist=core/v1/ConfigMap
```

--------------------------------

### Start Kubelet Phase

Source: https://kubernetes.io/docs/reference/_print

Initializes kubelet settings and certificates, then starts or restarts the kubelet service.

```bash
kubeadm join phase kubelet-start [api-server-endpoint] [flags]
```

--------------------------------

### kubectl get usage examples

Source: https://kubernetes.io/docs/reference/kubectl/generated/kubectl_get

Common patterns for listing resources, specifying output formats, and filtering by namespace or file.

```bash
  # List all pods in ps output format
  kubectl get pods
  
  # List all pods in ps output format with more information (such as node name)
  kubectl get pods -o wide
  
  # List a single replication controller with specified NAME in ps output format
  kubectl get replicationcontroller web
  
  # List deployments in JSON output format, in the "v1" version of the "apps" API group
  kubectl get deployments.v1.apps -o json
  
  # List a single pod in JSON output format
  kubectl get -o json pod web-pod-13je7
  
  # List a pod identified by type and name specified in "pod.yaml" in JSON output format
  kubectl get -f pod.yaml -o json
  
  # List resources from a directory with kustomization.yaml - e.g. dir/kustomization.yaml
  kubectl get -k dir/
  
  # Return only the phase value of the specified pod
  kubectl get -o template pod/web-pod-13je7 --template={{.status.phase}}
  
  # List resource information in custom columns
  kubectl get pod test-pod -o custom-columns=CONTAINER:.spec.containers[0].name,IMAGE:.spec.containers[0].image
  
  # List all replication controllers and services together in ps output format
  kubectl get rc,services
  
  # List one or more resources by their type and names
  kubectl get rc/web service/frontend pods/web-pod-13je7
  
  # List the 'status' subresource for a single pod
  kubectl get pod web-pod-13je7 --subresource status
  
  # List all deployments in namespace 'backend'
  kubectl get deployments.apps --namespace backend
  
  # List all pods existing in all namespaces
  kubectl get pods --all-namespaces
```

--------------------------------

### Install kubectl-convert

Source: https://kubernetes.io/docs/tasks/tools/install-kubectl-linux

Install the binary to the system path with root permissions.

```bash
sudo install -o root -g root -m 0755 kubectl-convert /usr/local/bin/kubectl-convert
```

--------------------------------

### Example output of kubectl get all

Source: https://kubernetes.io/docs/tasks/extend-kubernetes/custom-resources/_print

Shows the expected output format when listing resources in the 'all' category.

```text
NAME                          AGE
crontabs/my-new-cron-object   3s
```

--------------------------------

### kubectl create examples

Source: https://kubernetes.io/docs/reference/kubectl/generated/kubectl_create/_print

Common patterns for creating resources, including file-based creation, stdin piping, and editing before creation.

```bash
  # Create a pod using the data in pod.json
  kubectl create -f ./pod.json
  
  # Create a pod based on the JSON passed into stdin
  cat pod.json | kubectl create -f -
  
  # Edit the data in registry.yaml in JSON then create the resource using the edited data
  kubectl create -f registry.yaml --edit -o json
```

--------------------------------

### Full kubeadm init configuration example

Source: https://kubernetes.io/docs/reference/config-api/kubeadm-config.v1beta4

A comprehensive example combining InitConfiguration and ClusterConfiguration in a single YAML file.

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: InitConfiguration
bootstrapTokens:
  - token: "9a08jv.c0izixklcxtmnze7"
    description: "kubeadm bootstrap token"
    ttl: "24h"
  - token: "783bde.3f89s0fje9f38fhf"
    description: "another bootstrap token"
    usages:
  - authentication
  - signing
    groups:
  - system:bootstrappers:kubeadm:default-node-token

nodeRegistration:
  name: "ec2-10-100-0-1"
  criSocket: "unix:///var/run/containerd/containerd.sock"
  taints:
    - key: "kubeadmNode"
      value: "someValue"
      effect: "NoSchedule"
  kubeletExtraArgs:
    - name: v
      value: "5"
  ignorePreflightErrors:
    - IsPrivilegedUser
  imagePullPolicy: "IfNotPresent"
  imagePullSerial: true

localAPIEndpoint:
  advertiseAddress: "10.100.0.1"
  bindPort: 6443
certificateKey: "e6a2eb8581237ab72a4f494f30285ec12a9694d750b9785706a83bfcbbbd2204"
skipPhases:
  - preflight
timeouts:
  controlPlaneComponentHealthCheck: "60s"
  kubenetesAPICall: "40s"
---
apiVersion: kubeadm.k8s.io/v1beta4
kind: ClusterConfiguration
etcd:

  # one of local or external
  local:
    imageRepository: "registry.k8s.io"
    imageTag: "3.2.24"
    dataDir: "/var/lib/etcd"
    extraArgs:
      - name: listen-client-urls
        value: http://10.100.0.1:2379
    extraEnvs:
      - name: SOME_VAR
        value: SOME_VALUE
    serverCertSANs:
      - ec2-10-100-0-1.compute-1.amazonaws.com
    peerCertSANs:
      - 10.100.0.1
  # external:
  #   endpoints:
  #     - 10.100.0.1:2379
  #     - 10.100.0.2:2379
  #   caFile: "/etcd/kubernetes/pki/etcd/etcd-ca.crt"
  #   certFile: "/etcd/kubernetes/pki/etcd/etcd.crt"
  #   keyFile: "/etcd/kubernetes/pki/etcd/etcd.key"

networking:
  serviceSubnet: "10.96.0.0/16"
  podSubnet: "10.244.0.0/24"
  dnsDomain: "cluster.local"
kubernetesVersion: "v1.21.0"
controlPlaneEndpoint: "10.100.0.1:6443"
apiServer:
  extraArgs:
    - name: authorization-mode
      value: Node,RBAC
  extraEnvs:
    - name: SOME_VAR
      value: SOME_VALUE
  extraVolumes:
    - name: "some-volume"
      hostPath: "/etc/some-path"
```

--------------------------------

### Get ControllerRevision HTTP Request

Source: https://kubernetes.io/docs/reference//kubernetes-api/workload-resources/controller-revision-v1

Example HTTP GET request to retrieve a specific ControllerRevision by name and namespace.

```http
GET /apis/apps/v1/namespaces/{namespace}/controllerrevisions/{name}
```

--------------------------------

### Example DeviceClasses Output

Source: https://kubernetes.io/docs/tasks/configure-pod-container/_print

This is an example output of the `kubectl get deviceclasses` command, showing the names and age of the DeviceClasses available in the cluster. It helps in verifying the creation and availability of device categories.

```text
NAME                 AGE
driver.example.com   16m

```

--------------------------------

### Pod Disruption Budget Examples

Source: https://kubernetes.io/docs/reference/kubectl/generated/kubectl_create/kubectl_create_poddisruptionbudget

Practical examples showing how to create a PDB with specific label selectors and availability constraints.

```bash
  # Create a pod disruption budget named my-pdb that will select all pods with the app=rails label
  # and require at least one of them being available at any point in time
  kubectl create poddisruptionbudget my-pdb --selector=app=rails --min-available=1
  
  # Create a pod disruption budget named my-pdb that will select all pods with the app=nginx label
  # and require at least half of the pods selected to be available at any point in time
  kubectl create pdb my-pdb --selector=app=nginx --min-available=50%
```

--------------------------------

### Start containerd Service on Windows

Source: https://kubernetes.io/docs/tasks/administer-cluster/migrating-from-dockershim/_print

These PowerShell commands register containerd as a Windows service and then start the service. This completes the installation and configuration of containerd on a Windows node.

```powershell
.\containerd.exe --register-service
Start-Service containerd

```

--------------------------------

### Create a Deployment

Source: https://kubernetes.io/docs/tasks/extend-kubernetes/http-proxy-access-api

Starts a Hello World application deployment. Ensure you have a cluster and kubectl configured.

```bash
kubectl create deployment hello-app --image=gcr.io/google-samples/hello-app:2.0 --port=8080

```

--------------------------------

### Full InitConfiguration and ClusterConfiguration example

Source: https://kubernetes.io/docs/reference/config-api/_print

A comprehensive example demonstrating a single YAML file with both InitConfiguration and ClusterConfiguration for `kubeadm init`. This includes detailed settings for bootstrap tokens, node registration, local etcd, networking, and API server arguments.

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: InitConfiguration
bootstrapTokens:
  - token: "9a08jv.c0izixklcxtmnze7"
    description: "kubeadm bootstrap token"
    ttl: "24h"
  - token: "783bde.3f89s0fje9f38fhf"
    description: "another bootstrap token"
    usages:
  - authentication
  - signing
    groups:
  - system:bootstrappers:kubeadm:default-node-token

nodeRegistration:
  name: "ec2-10-100-0-1"
  criSocket: "unix:///var/run/containerd/containerd.sock"
  taints:
    - key: "kubeadmNode"
      value: "someValue"
      effect: "NoSchedule"
  kubeletExtraArgs:
    - name: v
      value: "5"
  ignorePreflightErrors:
    - IsPrivilegedUser
  imagePullPolicy: "IfNotPresent"
  imagePullSerial: true

localAPIEndpoint:
  advertiseAddress: "10.100.0.1"
  bindPort: 6443
certificateKey: "e6a2eb8581237ab72a4f494f30285ec12a9694d750b9785706a83bfcbbbd2204"
skipPhases:
  - preflight
timeouts:
  controlPlaneComponentHealthCheck: "60s"
  kubenetesAPICall: "40s"
---
apiVersion: kubeadm.k8s.io/v1beta4
kind: ClusterConfiguration
etcd:

  # one of local or external
  local:
    imageRepository: "registry.k8s.io"
    imageTag: "3.2.24"
    dataDir: "/var/lib/etcd"
    extraArgs:
      - name: listen-client-urls
        value: http://10.100.0.1:2379
    extraEnvs:
      - name: SOME_VAR
        value: SOME_VALUE
    serverCertSANs:
      - ec2-10-100-0-1.compute-1.amazonaws.com
    peerCertSANs:
      - 10.100.0.1
  # external:
  #   endpoints:
  #     - 10.100.0.1:2379
  #     - 10.100.0.2:2379
  #   caFile: "/etcd/kubernetes/pki/etcd/etcd-ca.crt"
  #   certFile: "/etcd/kubernetes/pki/etcd/etcd.crt"
  #   keyFile: "/etcd/kubernetes/pki/etcd/etcd.key"

networking:
  serviceSubnet: "10.96.0.0/16"
  podSubnet: "10.244.0.0/24"
  dnsDomain: "cluster.local"
kubernetesVersion: "v1.21.0"
controlPlaneEndpoint: "10.100.0.1:6443"
apiServer:
  extraArgs:
    - name: authorization-mode
      value: Node,RBAC
  extraEnvs:
    - name: SOME_VAR
      value: SOME_VALUE
  extraVolumes:
    - name: "some-volume"
      hostPath: "/etc/some-path"

```

--------------------------------

### Example Preference Configuration

Source: https://kubernetes.io/docs/reference/_print

Illustrates how to configure default command options and aliases within the KubeRC Preference file. This example shows setting a default image for the 'runx' command and defining 'getn' as an alias for 'get node' with a default output format.

```yaml
apiVersion: kubectl.config.k8s.io/v1beta1
kind: Preference
defaults:
  - command: run
    options:
      - name: image
        default: nginx
        appendArgs:
          - custom-arg1
  - command: get
    options:
      - name: output
        default: wide
        prependArgs:
          - node
aliases:
  - name: runx
    command: run
    options:
      - name: image
        default: nginx
    appendArgs:
      - custom-arg1
  - name: getn
    command: get
    options:
      - name: output
        default: wide
        prependArgs:
          - node
credentialPluginPolicy: Allowlist
credentialPluginAllowlist:
  - name: cloud-provider-plugin
  - name: /usr/local/bin/my-plugin
```

--------------------------------

### Full InitConfiguration and ClusterConfiguration example

Source: https://kubernetes.io/docs/reference/_print

A comprehensive example demonstrating a single YAML file with both InitConfiguration and ClusterConfiguration for `kubeadm init`, including detailed settings for bootstrap tokens, node registration, etcd, networking, and API server.

```yaml
apiVersion: kubeadm.k8s.io/v1beta3
kind: InitConfiguration
bootstrapTokens:
  - token: "9a08jv.c0izixklcxtmnze7"
    description: "kubeadm bootstrap token"
    ttl: "24h"
  - token: "783bde.3f89s0fje9f38fhf"
    description: "another bootstrap token"
    usages:
      - authentication
      - signing
    groups:
      - system:bootstrappers:kubeadm:default-node-token
nodeRegistration:
  name: "ec2-10-100-0-1"
  criSocket: "/var/run/dockershim.sock"
  taints:
    - key: "kubeadmNode"
      value: "someValue"
      effect: "NoSchedule"
  kubeletExtraArgs:
    v: 4
  ignorePreflightErrors:
    - IsPrivilegedUser
  imagePullPolicy: "IfNotPresent"
localAPIEndpoint:
  advertiseAddress: "10.100.0.1"
  bindPort: 6443
certificateKey: "e6a2eb8581237ab72a4f494f30285ec12a9694d750b9785706a83bfcbbbd2204"
skipPhases:
  - addon/kube-proxy
---
apiVersion: kubeadm.k8s.io/v1beta3
kind: ClusterConfiguration
etcd:
  # one of local or external
  local:
    imageRepository: "registry.k8s.io"
    imageTag: "3.2.24"
    dataDir: "/var/lib/etcd"
    extraArgs:
      listen-client-urls: "http://10.100.0.1:2379"
    serverCertSANs:
      -  "ec2-10-100-0-1.compute-1.amazonaws.com"
    peerCertSANs:
      - "10.100.0.1"
  # external:
    # endpoints:
    # - "10.100.0.1:2379"
    # - "10.100.0.2:2379"
    # caFile: "/etcd/kubernetes/pki/etcd/etcd-ca.crt"
    # certFile: "/etc/kubernetes/pki/etcd/etcd.crt"
    # keyFile: "/etc/kubernetes/pki/etcd/etcd.key"
networking:
  serviceSubnet: "10.96.0.0/16"
  podSubnet: "10.244.0.0/24"
  dnsDomain: "cluster.local"
kubernetesVersion: "v1.21.0"
controlPlaneEndpoint: "10.100.0.1:6443"
apiServer:
  extraArgs:
    authorization-mode: "Node,RBAC"
  extraVolumes:
    - name: "some-volume"
      hostPath: "/etc/some-path"
      mountPath: "/etc/some-pod-path"
      readOnly: false
      pathType: File
  certSANs:
    - "10.100.1.1"
    - "ec2-10-100-0-1.compute-1.amazonaws.com"
  timeoutForControlPlane: 4m0s
controllerManager:
  extraArgs:
    "node-cidr-mask-size": "20"
  extraVolumes:
    - name: "some-volume"

```

--------------------------------

### Install Jinja2 for Python

Source: https://kubernetes.io/docs/tasks/job/parallel-processing-expansion

Install the Jinja2 templating library for Python using pip. This is required for advanced templating examples.

```shell
pip install --user jinja2

```

--------------------------------

### Install Go Client Library

Source: https://kubernetes.io/docs/tasks/administer-cluster/_print

Command to get the `client-go` library for programmatic access to the Kubernetes API using Go. Ensure you replace `<kubernetes-version-number>` with a supported version.

```bash
go get k8s.io/client-go@kubernetes-<kubernetes-version-number>

```

--------------------------------

### View last-applied-configuration examples

Source: https://kubernetes.io/docs/reference/_print

Examples showing how to view annotations by resource type/name in YAML or by file in JSON format.

```bash
  # View the last-applied-configuration annotations by type/name in YAML
  kubectl apply view-last-applied deployment/nginx
  
  # View the last-applied-configuration annotations by file in JSON
  kubectl apply view-last-applied -f deploy.yaml -o json
```

--------------------------------

### Start Hello World Application Deployment

Source: https://kubernetes.io/docs/tasks/_print

Deploy a sample Hello World application to your Kubernetes cluster using `kubectl create deployment`.

```bash
kubectl create deployment hello-app --image=gcr.io/google-samples/hello-app:2.0 --port=8080
```

--------------------------------

### Download kind configuration

Source: https://kubernetes.io/docs/tutorials/security/seccomp

Download the example kind configuration file.

```bash
curl -L -O https://k8s.io/examples/pods/security/seccomp/kind.yaml
```

--------------------------------

### Example Pod List Output

Source: https://kubernetes.io/docs/tasks/debug/_print

This output shows an example of the `kubectl get pods` command, highlighting the name of a completed debugging Pod. You will need to use this name to delete the Pod.

```bash
NAME                          READY   STATUS       RESTARTS   AGE
node-debugger-mynode-pdx84    0/1     Completed    0          8m1s

```

--------------------------------

### Output of kubectl get all

Source: https://kubernetes.io/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions

Example output showing custom resources included when listing by category.

```text
NAME                          AGE
crontabs/my-new-cron-object   3s

```

--------------------------------

### List and Describe Contexts

Source: https://kubernetes.io/docs/reference/kubectl/generated/kubectl_config/_print

Examples showing how to list all available contexts or describe a specific one.

```bash
  # List all the contexts in your kubeconfig file
  kubectl config get-contexts
  
  # Describe one context in your kubeconfig file
  kubectl config get-contexts my-context
```

--------------------------------

### Populated TopologyInfo Example

Source: https://kubernetes.io/docs/concepts/extend-kubernetes/compute-storage-net/_print

Example of a Go struct initialization for a device plugin advertising NUMA affinity.

```go
pluginapi.Device{ID: "25102017", Health: pluginapi.Healthy, Topology:&pluginapi.TopologyInfo{Nodes: []*pluginapi.NUMANode{&pluginapi.NUMANode{ID: 0,},}}}
```

--------------------------------

### Examples for kubectl create role

Source: https://kubernetes.io/docs/reference/_print

Various examples demonstrating how to define roles with specific verbs, resources, resource names, API groups, and subresources.

```bash
  # Create a role named "pod-reader" that allows user to perform "get", "watch" and "list" on pods
  kubectl create role pod-reader --verb=get --verb=list --verb=watch --resource=pods
  
  # Create a role named "pod-reader" with ResourceName specified
  kubectl create role pod-reader --verb=get --resource=pods --resource-name=readablepod --resource-name=anotherpod
  
  # Create a role named "foo" with API Group specified
  kubectl create role foo --verb=get,list,watch --resource=rs.apps
  
  # Create a role named "foo" with SubResource specified
  kubectl create role foo --verb=get,list,watch --resource=pods,pods/status
```

--------------------------------

### kubectl kustomize usage examples

Source: https://kubernetes.io/docs/reference/kubectl/generated/kubectl_kustomize/_print

Common examples for building configurations from local directories or remote git repositories.

```bash
  # Build the current working directory
  kubectl kustomize
  
  # Build some shared configuration directory
  kubectl kustomize /home/config/production
  
  # Build from github
  kubectl kustomize https://github.com/kubernetes-sigs/kustomize.git/examples/helloWorld?ref=v1.0.6
```

--------------------------------

### Start Kubelet with Configuration

Source: https://kubernetes.io/docs/reference/setup-tools/kubeadm/kubeadm-join-phase

Writes KubeletConfiguration and environment files, then restarts kubelet. Use this to configure node-specific kubelet settings.

```bash
kubeadm join phase kubelet-start [api-server-endpoint] [flags]

```

--------------------------------

### GET /flagz

Source: https://kubernetes.io/docs/reference/instrumentation/_print

Retrieves the command-line arguments used to start the component.

```APIDOC
## GET /flagz

### Description
Shows the command-line arguments used to start a component. Requires the ComponentFlagz feature gate to be enabled.

### Method
GET

### Endpoint
/flagz

### Parameters
#### Query Parameters
- **Accept** (string) - Required - Must be set to 'application/json;v=v1alpha1;g=config.k8s.io;as=Flagz' for structured response.

### Response
#### Success Response (200)
- **kind** (string) - The resource kind, 'Flagz'.
- **apiVersion** (string) - The API version, 'config.k8s.io/v1alpha1'.
- **flags** (map) - Key-value pairs of command-line flags and their values.

#### Response Example
{
  "kind": "Flagz",
  "apiVersion": "config.k8s.io/v1alpha1",
  "flags": {
    "advertise-address": "192.168.8.4",
    "profiling": "true"
  }
}
```

--------------------------------

### Start Minikube Cluster

Source: https://kubernetes.io/docs/tutorials/_print

Use this command to initiate a local Kubernetes cluster using Minikube. Ensure Minikube is installed before running.

```bash
minikube start

```

--------------------------------

### Send a GET request to the nginx server from within the container

Source: https://kubernetes.io/docs/tasks/debug/debug-application/_print

Installs curl and then sends a GET request to the local nginx server to retrieve the content of index.html.

```bash
# Run this in the shell inside your container
apt-get update
apt-get install curl
curl http://localhost/

```

--------------------------------

### Install kubeadm and kubelet on Windows

Source: https://kubernetes.io/docs/tasks/administer-cluster/kubeadm/adding-windows-nodes

Downloads and runs the preparation script to install Kubernetes components on the Windows node.

```powershell
curl.exe -LO https://raw.githubusercontent.com/kubernetes-sigs/sig-windows-tools/master/hostprocess/PrepareNode.ps1
.\PrepareNode.ps1 -KubernetesVersion v1.35.0
```

--------------------------------

### Edit Workflow Example

Source: https://kubernetes.io/docs/concepts/workloads/management

This sequence demonstrates the process of getting a deployment's YAML, editing it locally, applying the changes, and then cleaning up the temporary file.

```bash
kubectl get deployment my-nginx -o yaml > /tmp/nginx.yaml
vi /tmp/nginx.yaml
# do some edit, and then save the file

kubectl apply -f /tmp/nginx.yaml
deployment.apps/my-nginx configured

rm /tmp/nginx.yaml


```

--------------------------------

### Install All Addons

Source: https://kubernetes.io/docs/reference/_print

Installs all available addons for the cluster.

```bash
kubeadm init phase addon all [flags]
```

--------------------------------

### Example Custom Resource Output

Source: https://kubernetes.io/docs/tasks/access-kubernetes-api/custom-resources/custom-resource-definitions

This is an example of the output you might see when using `kubectl get` on a custom resource that has additional printer columns defined in its CRD.

```text
NAME                 SPEC        REPLICAS   AGE
my-new-cron-object   * * * * *   1          7s

```

--------------------------------

### Edit last-applied-configuration examples

Source: https://kubernetes.io/docs/reference/kubectl/generated/kubectl_apply/kubectl_apply_edit-last-applied

Examples demonstrating how to edit configurations by resource type or by file, including format specification.

```bash
  # Edit the last-applied-configuration annotations by type/name in YAML
  kubectl apply edit-last-applied deployment/nginx
  
  # Edit the last-applied-configuration annotations by file in JSON
  kubectl apply edit-last-applied -f deploy.yaml -o json
```

--------------------------------

### Deployment Output Example

Source: https://kubernetes.io/docs/tasks/administer-cluster/node-overprovisioning

Example output showing the status of a deployment with 5 replicas.

```text
NAME                   READY   UP-TO-DATE   AVAILABLE   AGE
capacity-reservation   5/5     5            5           2m
```

--------------------------------

### Install kubeadm and kubelet on Windows

Source: https://kubernetes.io/docs/tasks/_print

Download and run the `PrepareNode.ps1` script to install `kubeadm` and `kubelet`. Specify the desired Kubernetes version using the `-KubernetesVersion` flag.

```powershell
curl.exe -LO https://raw.githubusercontent.com/kubernetes-sigs/sig-windows-tools/master/hostprocess/PrepareNode.ps1
```

```powershell
.\PrepareNode.ps1 -KubernetesVersion v1.35.0
```

--------------------------------

### Docker Output Examples

Source: https://kubernetes.io/docs/reference/kubectl/_print

Example outputs from docker commands.

```text
55c103fa129692154a7652490236fee9be47d70a8dd562281ae7d2f9a339a6db
```

```text
docker ps
```

```text
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                NAMES
55c103fa1296        nginx               "nginx -g 'daemon of…"   9 seconds ago       Up 9 seconds        0.0.0.0:80->80/tcp   nginx-app
```

--------------------------------

### Get PodDisruptionBudget status (no matching pods)

Source: https://kubernetes.io/docs/tasks/_print

Example output of 'kubectl get poddisruptionbudgets' when no pods match the PDB's selector. 'ALLOWED DISRUPTIONS' is 0.

```text
NAME     MIN AVAILABLE   MAX UNAVAILABLE   ALLOWED DISRUPTIONS   AGE
zk-pdb   2               N/A               0                     7s

```

--------------------------------

### Create a namespace example

Source: https://kubernetes.io/docs/reference/kubectl/generated/kubectl_create/kubectl_create_namespace

An example of creating a specific namespace named my-namespace.

```bash
  # Create a new namespace named my-namespace
  kubectl create namespace my-namespace
```

--------------------------------

### Chained command output

Source: https://kubernetes.io/docs/concepts/cluster-administration/manage-deployment

Example output from a chained kubectl get command.

```text
NAME           TYPE           CLUSTER-IP   EXTERNAL-IP   PORT(S)      AGE
my-nginx-svc   LoadBalancer   10.0.0.208   <pending>     80/TCP       0s
```

--------------------------------

### Example Pod YAML Output

Source: https://kubernetes.io/docs/tasks/debug/debug-application/debug-running-pod

This is an example output of `kubectl get pod -o yaml`, showing detailed pod configuration including metadata, spec, and status.

```yaml
apiVersion: v1
kind: Pod
metadata:
  creationTimestamp: "2022-02-17T21:51:01Z"
  generateName: nginx-deployment-67d4bdd6f5-
  labels:
    app: nginx
    pod-template-hash: 67d4bdd6f5
  name: nginx-deployment-67d4bdd6f5-w6kd7
  namespace: default
  ownerReferences:
  - apiVersion: apps/v1
    blockOwnerDeletion: true
    controller: true
    kind: ReplicaSet
    name: nginx-deployment-67d4bdd6f5
    uid: 7d41dfd4-84c0-4be4-88ab-cedbe626ad82
  resourceVersion: "1364"
  uid: a6501da1-0447-4262-98eb-c03d4002222e
spec:
  containers:
  - image: nginx
    imagePullPolicy: Always
    name: nginx
    ports:
    - containerPort: 80
      protocol: TCP
    resources:
      limits:
        cpu: 500m
        memory: 128Mi
      requests:
        cpu: 500m
        memory: 128Mi

```

--------------------------------

### Describe Pod Output Example

Source: https://kubernetes.io/docs/tasks/debug/debug-application/debug-init-containers

Example output from a describe command showing the state of multiple Init Containers.

```text
Init Containers:
  <init-container-1>:
    Container ID:    ...
    ...
    State:           Terminated
      Reason:        Completed
      Exit Code:     0
      Started:       ...
      Finished:      ...
    Ready:           True
    Restart Count:   0
    ...
  <init-container-2>:
    Container ID:    ...
    ...
    State:           Waiting
      Reason:        CrashLoopBackOff
    Last State:      Terminated
      Reason:        Error
      Exit Code:     1
      Started:       ...
      Finished:      ...
    Ready:           False
    Restart Count:   3
    ...
```

--------------------------------

### Apply configurations using kubectl

Source: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands

Examples of applying resource configurations from files, directories, and standard input.

```bash
kubectl apply -f ./pod.json
```

```bash
kubectl apply -k dir/
```

```bash
cat pod.json | kubectl apply -f -
```

```bash
kubectl apply -f '*.json'
```

```bash
kubectl apply --prune -f manifest.yaml -l app=nginx
```

```bash
kubectl apply --prune -f manifest.yaml --all --prune-allowlist=core/v1/ConfigMap
```

--------------------------------

### Enable and Start kubelet Service

Source: https://kubernetes.io/docs/setup/production-environment/tools/_print

Enables the kubelet service to start on boot and starts it immediately. This is an optional step before running kubeadm.

```bash
sudo systemctl enable --now kubelet

```

--------------------------------

### Alias Override with Prepend Args Example

Source: https://kubernetes.io/docs/reference/_print

Defines a command alias 'getn' that defaults to 'get node' with a specific output format. This example demonstrates using `prependArgs` to insert arguments before user-provided ones.

```yaml
name: getn
command: get
options:
  - name: output
    default: wide
    prependArgs:
      - node
```

--------------------------------

### Make Kubelet Executable and Install

Source: https://kubernetes.io/docs/tutorials/cluster-management/_print

Makes the downloaded kubelet binary executable and copies it to the system's PATH. This prepares it for execution as a service.

```bash
chmod +x kubelet
sudo cp kubelet /usr/bin/
```

--------------------------------

### Example Kubernetes apt Repository Line

Source: https://kubernetes.io/docs/tasks/administer-cluster/_print

This is an example line that indicates you are using the community-owned Kubernetes package repositories.

```text
deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/v1.34/deb/ /
```

--------------------------------

### EncryptionConfiguration Example

Source: https://kubernetes.io/docs/tasks/administer-cluster/encrypt-data

A comprehensive configuration example demonstrating multiple providers, key management, and wildcard resource matching.

```yaml
apiVersion: apiserver.config.k8s.io/v1
kind: EncryptionConfiguration
resources:
  - resources:
      - secrets
      - configmaps
      - pandas.awesome.bears.example # a custom resource API
    providers:
      # This configuration does not provide data confidentiality. The first
      # configured provider is specifying the "identity" mechanism, which
      # stores resources as plain text.
      #
      - identity: {} # plain text, in other words NO encryption
      - aesgcm:
          keys:
            - name: key1
              secret: c2VjcmV0IGlzIHNlY3VyZQ==
            - name: key2
              secret: dGhpcyBpcyBwYXNzd29yZA==
      - aescbc:
          keys:
            - name: key1
              secret: c2VjcmV0IGlzIHNlY3VyZQ==
            - name: key2
              secret: dGhpcyBpcyBwYXNzd29yZA==
      - secretbox:
          keys:
            - name: key1
              secret: YWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXoxMjM0NTY=
  - resources:
      - events
    providers:
      - identity: {} # do not encrypt Events even though *.* is specified below
  - resources:
      - '*.apps' # wildcard match requires Kubernetes 1.27 or later
    providers:
      - aescbc:
          keys:
          - name: key2
            secret: c2VjcmV0IGlzIHNlY3VyZSwgb3IgaXMgaXQ/Cg==
  - resources:
      - '*.*' # wildcard match requires Kubernetes 1.27 or later
    providers:
      - aescbc:
          keys:
          - name: key3
            secret: c2VjcmV0IGlzIHNlY3VyZSwgSSB0aGluaw==
```

--------------------------------

### Create a cron job examples

Source: https://kubernetes.io/docs/reference/kubectl/generated/kubectl_create/kubectl_create_cronjob

Examples showing how to create a basic cron job and one that executes a specific command.

```bash
  # Create a cron job
  kubectl create cronjob my-job --image=busybox --schedule="*/1 * * * *"
  
  # Create a cron job with a command
  kubectl create cronjob my-job --image=busybox --schedule="*/1 * * * *" -- date
```

--------------------------------

### Example output for kubectl get secrets

Source: https://kubernetes.io/docs/tutorials/services/connect-applications-service

Expected output format when listing Kubernetes secrets.

```text
NAME                  TYPE                                  DATA      AGE
nginxsecret           kubernetes.io/tls                     2         1m
```

--------------------------------

### Example ResourceSlices Output

Source: https://kubernetes.io/docs/tutorials/cluster-management/_print

Sample output showing advertised device classes.

```text
NAME                                 NODE           DRIVER            POOL           AGE
kind-worker-gpu.example.com-k69gd    kind-worker    gpu.example.com   kind-worker    19s
kind-worker2-gpu.example.com-qdgpn   kind-worker2   gpu.example.com   kind-worker2   19s
```

--------------------------------

### Manage kuberc configurations

Source: https://kubernetes.io/docs/reference/_print

Examples for viewing current configurations, setting default command flags, and creating command aliases.

```bash
  # View the current kuberc configuration
  kubectl alpha kuberc view
  
  # Set a default value for a command flag
  kubectl alpha kuberc set --section defaults --command get --option output=wide
  
  # Create an alias for a command
  kubectl alpha kuberc set --section aliases --name getn --command get --prependarg nodes --option output=wide
```

--------------------------------

### Create a Pod for Debugging Copy Example

Source: https://kubernetes.io/docs/tasks/_print

This command starts a pod with the busybox image that runs a command to keep it alive, simulating an application pod that needs debugging.

```bash
kubectl run myapp --image=busybox:1.28 --restart=Never -- sleep 1d
```

--------------------------------

### Install the Java client

Source: https://kubernetes.io/docs/tasks/administer-cluster/access-cluster-api

Commands to clone the repository and install project artifacts using Maven.

```bash
# Clone java library
git clone --recursive https://github.com/kubernetes-client/java

# Installing project artifacts, POM etc:
cd java
mvn install
```

--------------------------------

### KubeletConfiguration Example

Source: https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file

This is an example of a Kubelet configuration file in YAML format. It demonstrates how to set the address, port, and eviction policies for the Kubelet. Ensure the kubelet has read permissions on this file.

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
address: "192.168.0.8"
port: 20250
serializeImagePulls: false
evictionHard:
    memory.available:  "100Mi"
    nodefs.available:  "10%"
    nodefs.inodesFree: "5%"
    imagefs.available: "15%"
    imagefs.inodesFree: "5%"

```

--------------------------------

### List installed kubectl plugins

Source: https://kubernetes.io/docs/tasks/_print

The `kubectl plugin list` command searches your PATH for executable files starting with `kubectl-` to display installed plugins. It warns about non-executable files or name overlaps.

```bash
kubectl plugin list

```

--------------------------------

### Example: Finalize Kubelet with Config File

Source: https://kubernetes.io/docs/reference/_print

Example demonstrating how to update kubelet settings after TLS bootstrap using a configuration file. This is useful for custom configurations.

```bash
kubeadm init phase kubelet-finalize all --config
```

--------------------------------

### Get PodDisruptionBudget status (with matching pods)

Source: https://kubernetes.io/docs/tasks/_print

Example output of 'kubectl get poddisruptionbudgets' when pods match the PDB's selector. 'ALLOWED DISRUPTIONS' is non-zero, indicating the PDB is managing disruptions.

```text
NAME     MIN AVAILABLE   MAX UNAVAILABLE   ALLOWED DISRUPTIONS   AGE
zk-pdb   2               N/A               1                     7s

```

--------------------------------

### kubeadm init phase kubelet-start

Source: https://kubernetes.io/docs/reference/setup-tools/kubeadm/_print

Writes KubeletConfiguration and environment files, then starts the kubelet. Use the --config flag to specify a kubeadm configuration file.

```bash
kubeadm init phase kubelet-start [flags]
```

```bash
kubeadm init phase kubelet-start --config config.yaml
```

--------------------------------

### kubectl create ingress Examples

Source: https://kubernetes.io/docs/reference/kubectl/generated/kubectl_create/_print

Examples demonstrating the creation of Kubernetes Ingress resources with different configurations.

```APIDOC
## kubectl create ingress Examples

This section provides examples of how to use the `kubectl create ingress` command to manage Ingress resources in Kubernetes.

### Example 1: Create a single ingress

```bash
# Create a single ingress called 'simple' that directs requests to foo.com/bar to svc
# svc1:8080 with a TLS secret "my-cert"
kubectl create ingress simple --rule="foo.com/bar=svc1:8080,tls=my-cert"
```

### Example 2: Create a catch-all ingress

```bash
# Create a catch all ingress of "/path" pointing to service svc:port and Ingress Class as "otheringress"
kubectl create ingress catch-all --class=otheringress --rule="/path=svc:port"
```

### Example 3: Create an ingress with annotations

```bash
# Create an ingress with two annotations: ingress.annotation1 and ingress.annotations2
kubectl create ingress annotated --class=default --rule="foo.com/bar=svc:port" \
  --annotation ingress.annotation1=foo \
  --annotation ingress.annotation2=bla
```

### Example 4: Create an ingress with multiple paths for the same host

```bash
# Create an ingress with the same host and multiple paths
kubectl create ingress multipath --class=default \
  --rule="foo.com/=svc:port" \
  --rule="foo.com/admin/=svcadmin:portadmin"
```

### Example 5: Create an ingress with multiple hosts and Prefix pathType

```bash
# Create an ingress with multiple hosts and the pathType as Prefix
kubectl create ingress ingress1 --class=default \
  --rule="foo.com/path*=svc:8080" \
  --rule="bar.com/admin*=svc2:http"
```

### Example 6: Create an ingress with TLS enabled using default certificate and different path types

```bash
# Create an ingress with TLS enabled using the default ingress certificate and different path types
kubectl create ingress ingtls --class=default \
  --rule="foo.com/=svc:https,tls" \
  --rule="foo.com/path/subpath*=othersvc:8080"
```

### Example 7: Create an ingress with TLS enabled using a specific secret and Prefix pathType

```bash
# Create an ingress with TLS enabled using a specific secret and pathType as Prefix
kubectl create ingress ingsecret --class=default \
  --rule="foo.com/*=svc:8080,tls=secret1"
```

### Example 8: Create an ingress with a default backend

```bash
# Create an ingress with a default backend
kubectl create ingress ingdefault --class=default \
  --default-backend=defaultsvc:http \
  --rule="foo.com/*=svc:8080,tls=secret1"
```
```

--------------------------------

### kubectl set selector examples

Source: https://kubernetes.io/docs/reference/kubectl/generated/kubectl_set/kubectl_set_selector

Examples demonstrating how to set labels and selectors for deployment and service pairs using local operations.

```bash
  # Set the labels and selector before creating a deployment/service pair
  kubectl create service clusterip my-svc --clusterip="None" -o yaml --dry-run=client | kubectl set selector --local -f - 'environment=qa' -o yaml | kubectl create -f -
  kubectl create deployment my-dep --image=nginx -o yaml --dry-run=client | kubectl label --local -f - environment=qa -o yaml | kubectl create -f -
```

--------------------------------

### kubectl create deployment examples

Source: https://kubernetes.io/docs/reference/kubectl/generated/kubectl_create/kubectl_create_deployment

Common usage patterns for creating deployments, including setting replicas, ports, and multiple containers.

```bash
  # Create a deployment named my-dep that runs the busybox image
  kubectl create deployment my-dep --image=busybox
  
  # Create a deployment with a command
  kubectl create deployment my-dep --image=busybox -- date
  
  # Create a deployment named my-dep that runs the nginx image with 3 replicas
  kubectl create deployment my-dep --image=nginx --replicas=3
  
  # Create a deployment named my-dep that runs the busybox image and expose port 5701
  kubectl create deployment my-dep --image=busybox --port=5701
  
  # Create a deployment named my-dep that runs multiple containers
  kubectl create deployment my-dep --image=busybox:latest --image=ubuntu:latest --image=nginx
```

--------------------------------

### kubectl create clusterrole examples

Source: https://kubernetes.io/docs/reference/kubectl/generated/kubectl_create/kubectl_create_clusterrole

Various examples demonstrating how to define cluster roles with different resource, verb, and aggregation configurations.

```bash
  # Create a cluster role named "pod-reader" that allows user to perform "get", "watch" and "list" on pods
  kubectl create clusterrole pod-reader --verb=get,list,watch --resource=pods
  
  # Create a cluster role named "pod-reader" with ResourceName specified
  kubectl create clusterrole pod-reader --verb=get --resource=pods --resource-name=readablepod --resource-name=anotherpod
  
  # Create a cluster role named "foo" with API Group specified
  kubectl create clusterrole foo --verb=get,list,watch --resource=rs.apps
  
  # Create a cluster role named "foo" with SubResource specified
  kubectl create clusterrole foo --verb=get,list,watch --resource=pods,pods/status
  
  # Create a cluster role name "foo" with NonResourceURL specified
  kubectl create clusterrole "foo" --verb=get --non-resource-url=/logs/*
  
  # Create a cluster role name "monitoring" with AggregationRule specified
  kubectl create clusterrole monitoring --aggregation-rule="rbac.example.com/aggregate-to-monitoring=true"
```

--------------------------------

### Get Pod Status

Source: https://kubernetes.io/docs/tutorials/security/_print

Retrieves the status of the 'audit-pod'. This command is used to verify that the Pod has started successfully and is running.

```bash
kubectl get pod audit-pod
```

--------------------------------

### Interactive Pod Prompt

Source: https://kubernetes.io/docs/tutorials/services/connect-applications-service

This message indicates that the Pod is starting and you can now interact with it. Press Enter to get the command prompt.

```text
Waiting for pod default/curl-131556218-9fnch to be running, status is Pending, pod ready: false
Hit enter for command prompt
```

--------------------------------

### Examples for generating kubeconfig

Source: https://kubernetes.io/docs/reference/setup-tools/_print

Examples showing how to generate a kubeconfig file for a user with or without a configuration file.

```bash
  # Output a kubeconfig file for an additional user named foo
  kubeadm kubeconfig user --client-name=foo
  
  # Output a kubeconfig file for an additional user named foo using a kubeadm config file bar
  kubeadm kubeconfig user --client-name=foo --config=bar
```

--------------------------------

### Retrieve subject attributes with output formatting

Source: https://kubernetes.io/docs/reference/kubectl/generated/_print

Examples of running the command to get attributes in standard or JSON format.

```bash
  # Get your subject attributes
  kubectl auth whoami
  
  # Get your subject attributes in JSON format
  kubectl auth whoami -o json
```

--------------------------------

### Example join command output

Source: https://kubernetes.io/docs/setup/_print

Example output provided by kubeadm init for joining additional nodes to the cluster.

```bash
    kubeadm join 192.168.0.200:6443 --token 9vr73a.a8uxyaju799qwdjv --discovery-token-ca-cert-hash sha256:7c2e69131a36ae2a042a339b33381c6d0d43887e2de83720eff5359e26aec866 --control-plane --certificate-key f8902e114ef118304e561c3ecd4d0b543adc226b7a07f675f56564185ffe0c07

    kubeadm join 192.168.0.200:6443 --token 9vr73a.a8uxyaju799qwdjv --discovery-token-ca-cert-hash sha256:7c2e69131a36ae2a042a339b33381c6d0d43887e2de83720eff5359e26aec866
```

--------------------------------

### GET /statusz

Source: https://kubernetes.io/docs/reference/instrumentation/zpages

Retrieves high-level diagnostic information about a Kubernetes component, including version, start time, and uptime.

```APIDOC
## GET /statusz

### Description
Displays high-level information about the component such as its Kubernetes version, emulation version, start time, and more. This endpoint is intended for human debugging.

### Method
GET

### Endpoint
/statusz

### Parameters
#### Query Parameters
- **Accept** (header) - Optional - Use 'application/json;v=v1alpha1;g=config.k8s.io;as=Statusz' to request a structured JSON response.

### Response
#### Success Response (200)
- **kind** (string) - The object kind, 'Statusz'.
- **apiVersion** (string) - The API version, 'config.k8s.io/v1alpha1'.
- **startTime** (string) - The time the component process was initiated.
- **uptimeSeconds** (integer) - The duration in seconds the component has been running.
- **goVersion** (string) - The Go version used to build the binary.
- **binaryVersion** (string) - The version of the component's binary.
- **emulationVersion** (string) - The Kubernetes API version being emulated.
- **paths** (array) - List of relative URLs to other essential read-only endpoints.

#### Response Example
{
  "kind": "Statusz",
  "apiVersion": "config.k8s.io/v1alpha1",
  "metadata": {
    "name": "kube-apiserver"
  },
  "startTime": "2025-10-29T00:30:01Z",
  "uptimeSeconds": 856,
  "goVersion": "go1.23.2",
  "binaryVersion": "1.35.0",
  "emulationVersion": "1.35",
  "paths": [
    "/healthz",
    "/livez",
    "/metrics",
    "/readyz",
    "/statusz",
    "/version"
  ]
}
```

--------------------------------

### kubeadm init phase kubelet-start

Source: https://kubernetes.io/docs/reference/setup-tools/kubeadm/kubeadm-init-phase

Writes the kubelet configuration file and environment file, then starts the kubelet.

```APIDOC
## kubeadm init phase kubelet-start

### Description
Write kubelet settings and (re)start kubelet.

### Method
POST

### Endpoint
/kubeadm/init/phase/kubelet-start

### Parameters
#### Query Parameters
- **config** (string) - Optional - Path to a kubeadm configuration file.
- **cri-socket** (string) - Optional - Path to the CRI socket to connect. If empty kubeadm will try to auto-detect this value; use this option only if you have more than one CRI installed or if you have non-standard CRI socket.
- **dry-run** (boolean) - Optional - Don't apply any changes; just output what would be done.
- **image-repository** (string) - Optional - Choose a container registry to pull control plane images from. Default: "registry.k8s.io"
- **node-name** (string) - Optional - Specify the node name.
- **patches** (string) - Optional - Path to a directory that contains files named "target[suffix][+patchtype].extension". For example, "kube-apiserver0+merge.yaml" or just "etcd.json". "target" can be one of "kube-apiserver", "kube-controller-manager", "kube-scheduler", "etcd", "kubeletconfiguration", "corednsdeployment". "patchtype" can be one of "strategic", "merge" or "json" and they match the patch formats supported by kubectl. The default "patchtype" is "strategic". "extension" must be either "json" or "yaml". "suffix" is an optional string that can be used to determine which patches are applied first alpha-numerically.
- **rootfs** (string) - Optional - The path to the 'real' host root filesystem. This will cause kubeadm to chroot into the provided path.

### Request Example
```json
{
  "config": "config.yaml",
  "node-name": "my-node"
}
```

### Response
#### Success Response (200)
- **message** (string) - Indicates the kubelet has been started successfully.

#### Response Example
```json
{
  "message": "Kubelet started successfully."
}
```
```

--------------------------------

### Example: getn alias for kubectl get node

Source: https://kubernetes.io/docs/reference/_print

Defines an alias 'getn' for 'kubectl get node', setting the default output to 'wide'. It also shows how user-provided flags like '--output=json' override the default. 'kubectl getn control-plane-1' expands to 'kubectl get node control-plane-1 --output=wide', while 'kubectl getn control-plane-1 --output=json' expands to 'kubectl get node --output=json control-plane-1'.

```yaml
name: getn
command: get
flags:
  - name: output
    default: wide
    prependArgs:
      - node
```

--------------------------------

### Example output for resources

Source: https://kubernetes.io/docs/tutorials/services/pods-and-endpoint-termination-flow

Sample output for kubectl commands.

```text
NAME                  ADDRESSTYPE   PORTS   ENDPOINTS                 AGE
nginx-service-6tjbr   IPv4          80      10.12.1.199,10.12.1.201   22m
```

```text
NAME                                READY   STATUS        RESTARTS      AGE
nginx-deployment-7768647bf9-b4b9s   1/1     Terminating   0             4m1s
nginx-deployment-7768647bf9-rkxlw   1/1     Running       0             8s
```

--------------------------------

### Apply Deployment with Server-Side Apply

Source: https://kubernetes.io/docs/reference/using-api/server-side-apply

Apply the initial configuration using the --server-side flag.

```bash
kubectl apply -f https://k8s.io/examples/application/ssa/nginx-deployment.yaml --server-side
```

--------------------------------

### Create Deployment and Label

Source: https://kubernetes.io/docs/reference/_print

This example shows creating a deployment and then labeling it, which is a precursor to setting a selector. It uses dry-run to pipe resources between commands.

```bash
kubectl create deployment my-dep --image=nginx -o yaml --dry-run=client | kubectl label --local -f - environment=qa -o yaml | kubectl create -f -
```

--------------------------------

### Download Pod Manifest

Source: https://kubernetes.io/docs/tasks/_print

Download the example Pod manifest file from the Kubernetes documentation. This provides a starting point for creating your own Pods that use image pull secrets.

```bash
curl -L -o my-private-reg-pod.yaml https://k8s.io/examples/pods/private-reg-pod.yaml

```

--------------------------------

### Create Basic Kubernetes Deployments and Jobs

Source: https://kubernetes.io/docs/reference/_print

Examples for creating a simple Nginx deployment, a one-off job, and a scheduled cron job.

```bash
kubectl create deployment nginx --image=nginx       # start a single instance of nginx
```

```bash
# create a Job which prints "Hello World"
kubectl create job hello --image=busybox:1.28 -- echo "Hello World"
```

```bash
# create a CronJob that prints "Hello World" every minute
kubectl create cronjob hello --image=busybox:1.28   --schedule="*/1 * * * *" -- echo "Hello World"
```

--------------------------------

### Pod Status Output Showing Success

Source: https://kubernetes.io/docs/tutorials/security/seccomp

Example output of `kubectl get pod fine-pod`, showing the Pod in a 'Running' state.

```text
NAME        READY   STATUS    RESTARTS   AGE
fine-pod   1/1     Running   0          30s

```

--------------------------------

### Examples of kubectl explain usage

Source: https://kubernetes.io/docs/reference/kubectl/generated/kubectl_explain/_print

Common usage patterns for inspecting Kubernetes resources and their fields.

```bash
  # Get the documentation of the resource and its fields
  kubectl explain pods
  
  # Get all the fields in the resource
  kubectl explain pods --recursive
  
  # Get the explanation for deployment in supported api versions
  kubectl explain deployments --api-version=apps/v1
  
  # Get the documentation of a specific field of a resource
  kubectl explain pods.spec.containers
  
  # Get the documentation of resources in different format
  kubectl explain deployment --output=plaintext-openapiv2
```

--------------------------------

### Example Alias Override: getn

Source: https://kubernetes.io/docs/reference/config-api/_print

Defines an alias 'getn' for the 'get' command, setting a default output format and prepending arguments.

```yaml
name: getn
command: get
options:
  - name: output
    default: wide
prependArgs:
  - node
```

--------------------------------

### ServiceCIDR Table Output

Source: https://kubernetes.io/docs/tasks/_print

Example output of the 'kubectl get servicecidr' command, displaying the 'kubernetes' ServiceCIDR with its allocated IP range.

```text
NAME         CIDRS          AGE
kubernetes   10.96.0.0/28   17d
```

--------------------------------

### Create a deployment with kubectl

Source: https://kubernetes.io/docs/reference/kubectl/kubectl-cmds

Examples of creating deployments with different configurations such as images, replicas, commands, and ports.

```bash
kubectl create deployment my-dep --image=busybox
```

```bash
kubectl create deployment my-dep --image=busybox -- date
```

```bash
kubectl create deployment my-dep --image=nginx --replicas=3
```

```bash
kubectl create deployment my-dep --image=busybox --port=5701
```

--------------------------------

### Contextual Logging Command Example

Source: https://kubernetes.io/docs/concepts/cluster-administration/_print

Demonstrates how to enable the ContextualLogging feature gate and run an example command. This shows the command-line arguments and the resulting log output when contextual logging is active.

```bash
$ cd $GOPATH/src/k8s.io/kubernetes/staging/src/k8s.io/component-base/logs/example/cmd/
$ go run . --help
...
      --feature-gates mapStringBool  A set of key=value pairs that describe feature gates for alpha/experimental features. Options are:
                                     AllAlpha=true|false (ALPHA - default=false)
                                     AllBeta=true|false (BETA - default=false)
                                     ContextualLogging=true|false (BETA - default=true)
$ go run . --feature-gates ContextualLogging=true
...
I0222 15:13:31.645988  197901 example.go:54] "runtime" logger="example.myname" foo="bar" duration="1m0s"
I0222 15:13:31.646007  197901 example.go:55] "another runtime" logger="example" foo="bar" duration="1h0m0s" duration="1m0s"

```

--------------------------------

### Start Kubelet with Configuration

Source: https://kubernetes.io/docs/reference/setup-tools/_print

Use this command to write KubeletConfiguration and environment files, then start or restart the kubelet. It can dynamically generate kubelet flags from a configuration file.

```bash
kubeadm init phase kubelet-start --config config.yaml
```

--------------------------------

### Examples of kubectl explain usage

Source: https://kubernetes.io/docs/reference/kubectl/generated/_print

Common usage patterns for exploring resource documentation and specific fields.

```bash
# Get the documentation of the resource and its fields
  kubectl explain pods
  
  # Get all the fields in the resource
  kubectl explain pods --recursive
  
  # Get the explanation for deployment in supported api versions
  kubectl explain deployments --api-version=apps/v1
  
  # Get the documentation of a specific field of a resource
  kubectl explain pods.spec.containers
  
  # Get the documentation of resources in different format
  kubectl explain deployment --output=plaintext-openapiv2
```

--------------------------------

### ClusterRole Example for Secret Read Access

Source: https://kubernetes.io/docs/reference/access-authn-authz/rbac

Defines a ClusterRole granting read access (get, watch, list) to secrets across any namespace.

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  # "namespace" omitted since ClusterRoles are not namespaced
  name: secret-reader
rules:
- apiGroups: [""]
  #
  # at the HTTP level, the name of the resource for accessing Secret
  # objects is "secrets"
  resources: ["secrets"]
  verbs: ["get", "watch", "list"]

```

--------------------------------

### Example Directory Listing

Source: https://kubernetes.io/docs/tasks/configure-pod-container/_print

Example output from 'ls -l' showing directory permissions, owner, group, and size.

```text
drwxrwsrwx 2 root 2000 4096 Jun  6 20:08 demo

```

--------------------------------

### Role Example for Pod Read Access

Source: https://kubernetes.io/docs/reference/access-authn-authz/rbac

Defines a Role in the 'default' namespace granting read access (get, watch, list) to pods.

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: default
  name: pod-reader
rules:
- apiGroups: [""] # "" indicates the core API group
  resources: ["pods"]
  verbs: ["get", "watch", "list"]

```

--------------------------------

### Bash Autocomplete Setup for kubectl

Source: https://kubernetes.io/docs/reference/_print

Set up shell autocompletion for kubectl in Bash. Ensure the bash-completion package is installed first. Add this to your ~/.bashrc for permanent activation.

```bash
source <(kubectl completion bash) # set up autocomplete in bash into the current shell, bash-completion package should be installed first.
echo "source <(kubectl completion bash)" >> ~/.bashrc # add autocomplete permanently to your bash shell.
```

--------------------------------

### Example File Listing

Source: https://kubernetes.io/docs/tasks/configure-pod-container/_print

Example output from 'ls -l' showing file permissions, owner, group, size, and modification date.

```text
-rw-r--r-- 1 1000 2000 6 Jun  6 20:08 testfile

```

--------------------------------

### Example ConfigMap with Managed Fields

Source: https://kubernetes.io/docs/reference/using-api/_print

This example shows a ConfigMap object with a managed fields record in its metadata. The record details the manager, operation, and specific fields being managed. Use `--show-managed-fields` with `kubectl get` in json or yaml format to view this data.

```yaml
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: test-cm
  namespace: default
  labels:
    test-label: test
  managedFields:
  - manager: kubectl
    operation: Apply # note capitalization: "Apply" (or "Update")
    apiVersion: v1
    time: "2010-10-10T0:00:00Z"
    fieldsType: FieldsV1
    fieldsV1:
      f:metadata:
        f:labels:
          f:test-label: {}
      f:data:
        f:key: {}
data:
  key: some value

```

--------------------------------

### Kubelet Configuration File Example

Source: https://kubernetes.io/docs/tasks/administer-cluster/_print

Use this JSON configuration file to set Kubelet parameters. Ensure the kubelet has read permissions on this file. This example configures the Kubelet's serving address and port, image pull serialization, and various eviction thresholds.

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
address: "192.168.0.8"
port: 20250
serializeImagePulls: false
evictHard:
    memory.available:  "100Mi"
    nodefs.available:  "10%"
    nodefs.inodesFree: "5%"
    imagefs.available: "15%"
    imagefs.inodesFree: "5%"

```

--------------------------------

### Correct reservedMemory configuration with evictionHard

Source: https://kubernetes.io/docs/tasks/administer-cluster/_print

Example of a correct reservedMemory configuration that accounts for the default evictionHard threshold. This configuration is necessary for the Memory Manager to start.

```yaml
memoryManagerPolicy: Static
kubeReserved: { cpu: "4", memory: "4Gi" }
systemReserved: { cpu: "1", memory: "1Gi" }
reservedMemory:
  - numaNode: 0
    limits:
      memory: "3Gi"
  - numaNode: 1
    limits:
      memory: "2148Mi" # 3GiB minus 100MiB
```

--------------------------------

### Install kubectl binary

Source: https://kubernetes.io/docs/tasks/tools/_print

Install the kubectl binary to the system path with root privileges.

```bash
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
```

--------------------------------

### Kubelet Configuration Example

Source: https://kubernetes.io/docs/tasks/_print

This is an example of a Kubelet configuration file in YAML format. It demonstrates how to set parameters such as the serving address and port, control image pull serialization, and define eviction thresholds for memory and disk space.

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
address: "192.168.0.8"
port: 20250
serializeImagePulls: false
evictionHard:
    memory.available:  "100Mi"
    nodefs.available:  "10%"
    nodefs.inodesFree: "5%"
    imagefs.available: "15%"
    imagefs.inodesFree: "5%"

```

--------------------------------

### NodePort Service Details Output

Source: https://kubernetes.io/docs/tutorials/security/seccomp

Example output of `kubectl get service fine-pod`, showing the assigned NodePort (e.g., 32373/TCP) for accessing the service.

```text
NAME        TYPE       CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
fine-pod    NodePort   10.111.36.142   <none>        5678:32373/TCP   72s

```

--------------------------------

### Start a hazelcast pod with labels

Source: https://kubernetes.io/docs/reference/_print

Start a hazelcast pod and set labels `app` and `env`.

```bash
kubectl run hazelcast --image=hazelcast/hazelcast --labels="app=hazelcast,env=prod"
```

--------------------------------

### Start containerd service on Windows

Source: https://kubernetes.io/docs/tasks/administer-cluster/migrating-from-dockershim/change-runtime-containerd

Register and start the containerd service.

```powershell
.\containerd.exe --register-service
Start-Service containerd
```

--------------------------------

### Examples for kubectl create quota

Source: https://kubernetes.io/docs/reference/kubectl/generated/kubectl_create/_print

Practical examples for creating resource quotas with specific hard limits and scopes.

```bash
  # Create a new resource quota named my-quota
  kubectl create quota my-quota --hard=cpu=1,memory=1G,pods=2,services=3,replicationcontrollers=2,resourcequotas=1,secrets=5,persistentvolumeclaims=10
  
  # Create a new resource quota named best-effort
  kubectl create quota best-effort --hard=pods=100 --scopes=BestEffort
```

--------------------------------

### Create Kustomize Base Resources

Source: https://kubernetes.io/docs/tasks/manage-kubernetes-objects/kustomization

Set up a base directory containing deployment, service, and kustomization files for reuse.

```bash
mkdir base
cat <<EOF > base/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-nginx
spec:
  selector:
    matchLabels:
      run: my-nginx
  replicas: 2
  template:
    metadata:
      labels:
        run: my-nginx
    spec:
      containers:
      - name: my-nginx
        image: nginx
EOF

cat <<EOF > base/service.yaml
apiVersion: v1
kind: Service
metadata:
  name: my-nginx
  labels:
    run: my-nginx
spec:
  ports:
  - port: 80
    protocol: TCP
  selector:
    run: my-nginx
EOF
cat <<EOF > base/kustomization.yaml
resources:
- deployment.yaml
- service.yaml
EOF
```

--------------------------------

### Update Pod Image Version

Source: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands

Example of updating a single-container pod's image version using kubectl get, sed, and kubectl replace.

```APIDOC
## POST /api/replace/image

### Description
Update a single-container pod's image version (tag) to a new value.

### Method
POST

### Endpoint
/api/replace/image

### Parameters
#### Query Parameters
- **f** (string) - Required - Filename or stdin for the resource definition.

### Request Example
```json
{
  "example": "kubectl get pod mypod -o yaml | sed 's/\(image: myimage\):.*$/\1:v4/' | kubectl replace -f -"
}
```

### Response
#### Success Response (200)
- **message** (string) - Confirmation message of the image update.

#### Response Example
```json
{
  "example": "Pod image version updated successfully."
}
```
```

--------------------------------

### Verify Kubernetes apt Repository Entry

Source: https://kubernetes.io/docs/tasks/_print

Check if the output shows a line similar to the example, indicating the use of Kubernetes package repositories. This is crucial for applying the upgrade guide.

```text
deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/v1.34/deb/ /

```

--------------------------------

### Install Kompose via binary

Source: https://kubernetes.io/docs/tasks/configure-pod-container/_print

Download and install the Kompose binary for Linux, macOS, or Windows.

```bash
# Linux
curl -L https://github.com/kubernetes/kompose/releases/download/v1.34.0/kompose-linux-amd64 -o kompose

# macOS
curl -L https://github.com/kubernetes/kompose/releases/download/v1.34.0/kompose-darwin-amd64 -o kompose

# Windows
curl -L https://github.com/kubernetes/kompose/releases/download/v1.34.0/kompose-windows-amd64.exe -o kompose.exe

chmod +x kompose
sudo mv ./kompose /usr/local/bin/kompose
```

--------------------------------

### Create a Simple Kubectl Plugin

Source: https://kubernetes.io/docs/reference/_print

This example shows how to create a basic kubectl plugin by naming an executable file with the `kubectl-` prefix and placing it in your PATH.

```bash
cat ./kubectl-hello
```

```bash
#!/bin/sh

# this plugin prints the words "hello world"
echo "hello world"
```

```bash
chmod a+x ./kubectl-hello

# and move it to a location in our PATH
sudo mv ./kubectl-hello /usr/local/bin
sudo chown root:root /usr/local/bin
```

```bash
kubectl hello
```

```bash
hello world
```

```bash
sudo rm /usr/local/bin/kubectl-hello
```

--------------------------------

### Example Pod Resource Output

Source: https://kubernetes.io/docs/tasks/_print

Illustrates the typical output format for `kubectl get pod -o yaml` when displaying resource specifications. Shows how requests and limits are represented.

```yaml
spec: 
  containers:    
  ...
  resources:
    requests:
      memory: 100Mi
    limits:
      memory: 200Mi
...

```

--------------------------------

### Install Kube-Proxy Addon

Source: https://kubernetes.io/docs/reference/setup-tools/kubeadm/kubeadm-init-phase

Executes the installation of kube-proxy components via the API server.

```bash
kubeadm init phase addon kube-proxy [flags]
```

--------------------------------

### Create Command Alias

Source: https://kubernetes.io/docs/reference/kubectl/generated/_print

Create a custom alias for a command. This example creates an alias 'getn' for the 'get nodes' command with a specified output format.

```bash
kubectl alpha kuberc set --section aliases --name getn --command get --prependarg nodes --option output=wide
```

--------------------------------

### Process Output Example

Source: https://kubernetes.io/docs/tasks/configure-pod-container/_print

Example output showing process user IDs.

```text
USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
2000         1  0.0  0.0   4336   764 ?        Ss   20:36   0:00 /bin/sh -c node server.js
2000         8  0.1  0.5 772124 22604 ?        Sl   20:36   0:00 node server.js
...
```

--------------------------------

### Run Contextual Logging Example

Source: https://kubernetes.io/docs/concepts/cluster-administration/system-logs

Demonstrates executing the contextual logging example with the ContextualLogging feature gate enabled.

```bash
$ cd $GOPATH/src/k8s.io/kubernetes/staging/src/k8s.io/component-base/logs/example/cmd/
$ go run . --help
...
      --feature-gates mapStringBool  A set of key=value pairs that describe feature gates for alpha/experimental features. Options are:
                                     AllAlpha=true|false (ALPHA - default=false)
                                     AllBeta=true|false (BETA - default=false)
                                     ContextualLogging=true|false (BETA - default=true)
$ go run . --feature-gates ContextualLogging=true
...
I0222 15:13:31.645988  197901 example.go:54] "runtime" logger="example.myname" foo="bar" duration="1m0s"
I0222 15:13:31.646007  197901 example.go:55] "another runtime" logger="example" foo="bar" duration="1h0m0s" duration="1m0s"
```

--------------------------------

### Install kubectl using Scoop

Source: https://kubernetes.io/docs/tasks/tools/_print

Install the kubectl command-line tool on Windows using the Scoop package manager. Ensure Scoop is installed and configured.

```powershell
scoop install kubectl
```

--------------------------------

### Install kubectl via snap

Source: https://kubernetes.io/docs/tasks/tools/install-kubectl-linux

Installs kubectl as a snap application.

```bash
snap install kubectl --classic
kubectl version --client
```

--------------------------------

### Validate Dual-Stack Service Output

Source: https://kubernetes.io/docs/tasks/network/validate-dual-stack

This is an example output from `kubectl get svc`. It shows a dual-stack Service with both IPv6 and IPv4 addresses assigned to `CLUSTER-IP` and `EXTERNAL-IP`.

```text
NAME         TYPE           CLUSTER-IP            EXTERNAL-IP        PORT(S)        AGE
my-service   LoadBalancer   2001:db8:fd00::7ebc   2603:1030:805::5   80:30790/TCP   35s


```

--------------------------------

### Install kubectl binary

Source: https://kubernetes.io/docs/tasks/tools/install-kubectl-linux

Install the binary to a system directory or a local user directory.

```bash
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
```

```bash
chmod +x kubectl
mkdir -p ~/.local/bin
mv ./kubectl ~/.local/bin/kubectl
# and then append (or prepend) ~/.local/bin to $PATH
```

--------------------------------

### GET /flagz

Source: https://kubernetes.io/docs/reference/instrumentation/zpages

Retrieves the command-line flags used to start the component. Supports plain text by default or structured JSON via specific Accept headers.

```APIDOC
## GET /flagz

### Description
Returns the command-line arguments used to start a component. This endpoint is intended for debugging purposes.

### Method
GET

### Endpoint
/flagz

### Parameters
#### Query Parameters
- **Accept** (header) - Optional - Use 'application/json;v=v1alpha1;g=config.k8s.io;as=Flagz' to request a structured JSON response.

### Response
#### Success Response (200)
- **kind** (string) - The object type (Flagz).
- **apiVersion** (string) - The API version (e.g., config.k8s.io/v1alpha1).
- **metadata** (object) - Standard object metadata.
- **flags** (map[string]string) - Key-value pairs of command-line flags.

#### Response Example
{
  "kind": "Flagz",
  "apiVersion": "config.k8s.io/v1alpha1",
  "metadata": {
    "name": "kube-apiserver"
  },
  "flags": {
    "advertise-address": "192.168.8.4",
    "allow-privileged": "true",
    "anonymous-auth": "true",
    "authorization-mode": "[Node,RBAC]",
    "enable-priority-and-fairness": "true",
    "profiling": "true",
    "default-watch-cache-size": "100"
  }
}
```

--------------------------------

### Get Node Metrics Summary via Kubectl

Source: https://kubernetes.io/docs/reference/instrumentation/node-metrics

Use this command to retrieve the Summary API metrics for a specific node. Ensure you have kubectl installed and configured.

```bash
kubectl get --raw "/api/v1/nodes/minikube/proxy/stats/summary"
```

--------------------------------

### Execute Commands in Pods

Source: https://kubernetes.io/docs/reference/_print

Use `kubectl exec` to run commands inside a container within a pod. You can get output from a command or start an interactive shell.

```bash
kubectl exec <pod-name> -- date
```

```bash
kubectl exec <pod-name> -c <container-name> -- date
```

```bash
kubectl exec -ti <pod-name> -- /bin/bash
```

--------------------------------

### Kubectl Get Pods by Field Selector

Source: https://kubernetes.io/docs/reference/_print

Filters pods based on specific field selectors. This example shows how to list pods running on a particular node.

```bash
# List all pods running on node server01
kubectl get pods --field-selector=spec.nodeName=server01
```

--------------------------------

### Create a basic job

Source: https://kubernetes.io/docs/reference/kubectl/generated/kubectl_create/kubectl_create_job

This example demonstrates the simplest way to create a job, specifying only the job name and the container image to use.

```bash
kubectl create job my-job --image=busybox
```

--------------------------------

### Initialize .kube directory and config

Source: https://kubernetes.io/docs/tasks/tools/install-kubectl-windows

Sets up the default directory and creates an empty configuration file.

```bash
# If you're using cmd.exe, run: cd %USERPROFILE%
cd ~
```

```bash
mkdir .kube
```

```bash
cd .kube
```

```powershell
New-Item config -type file
```

--------------------------------

### Example join commands

Source: https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/high-availability

Example output showing commands to join additional control plane and worker nodes to the cluster.

```bash
kubeadm join 192.168.0.200:6443 --token 9vr73a.a8uxyaju799qwdjv --discovery-token-ca-cert-hash sha256:7c2e69131a36ae2a042a339b33381c6d0d43887e2de83720eff5359e26aec866 --control-plane --certificate-key f8902e114ef118304e561c3ecd4d0b543adc226b7a07f675f56564185ffe0c07

kubeadm join 192.168.0.200:6443 --token 9vr73a.a8uxyaju799qwdjv --discovery-token-ca-cert-hash sha256:7c2e69131a36ae2a042a339b33381c6d0d43887e2de83720eff5359e26aec866
```

--------------------------------

### Kubelet Configuration Example

Source: https://kubernetes.io/docs/tasks/_print

This shows a typical kubelet command line with various configuration flags, including 'hairpin-mode'.

```bash
root      3392  1.1  0.8 186804 65208 ?        Sl   00:51  11:11 /usr/local/bin/kubelet --enable-debugging-handlers=true --config=/etc/kubernetes/manifests --allow-privileged=True --v=4 --cluster-dns=10.0.0.10 --cluster-domain=cluster.local --configure-cbr0=true --cgroup-root=/ --system-cgroups=/system --hairpin-mode=promiscuous-bridge --runtime-cgroups=/docker-daemon --kubelet-cgroups=/kubelet --babysit-daemons=true --max-pods=110 --serialize-image-pulls=false --outofdisk-transition-frequency=0
```

--------------------------------

### CRD Validation Rule Example: Field Prefix Match

Source: https://kubernetes.io/docs/tasks/access-kubernetes-api/custom-resources/custom-resource-definitions

Validates that the 'name' field of an object starts with the value of another field, 'prefix'. This demonstrates cross-field validation.

```text
self.metadata.name.startsWith(self.prefix)
```

--------------------------------

### Describe Kubernetes resources examples

Source: https://kubernetes.io/docs/reference/kubectl/generated/kubectl_describe

Common usage examples for describing nodes, pods, and filtering by labels or files.

```bash
  # Describe a node
  kubectl describe nodes kubernetes-node-emt8.c.myproject.internal
  
  # Describe a pod
  kubectl describe pods/nginx
  
  # Describe a pod identified by type and name in "pod.json"
  kubectl describe -f pod.json
  
  # Describe all pods
  kubectl describe pods
  
  # Describe pods by label name=myLabel
  kubectl describe pods -l name=myLabel
  
  # Describe all pods managed by the 'frontend' replication controller
  # (rc-created pods get the name of the rc as a prefix in the pod name)
  kubectl describe pods frontend
```

--------------------------------

### Execute kubectl plugin list commands

Source: https://kubernetes.io/docs/reference/_print

Examples for listing plugins with or without full file paths.

```bash
  # List all available plugins
  kubectl plugin list
  
  # List only binary names of available plugins without paths
  kubectl plugin list --name-only
```

--------------------------------

### Start a pod with custom arguments

Source: https://kubernetes.io/docs/reference/_print

Start the nginx pod using the default command but with custom arguments.

```bash
kubectl run nginx --image=nginx -- <arg1> <arg2> ... <argN>
```

--------------------------------

### Pod Status Output Showing Violation

Source: https://kubernetes.io/docs/tutorials/security/seccomp

Example output of `kubectl get pod violation-pod`, showing the Pod in a `CrashLoopBackOff` state due to the restrictive seccomp profile.

```text
NAME            READY   STATUS             RESTARTS   AGE
violation-pod   0/1     CrashLoopBackOff   1          6s

```

--------------------------------

### Get Node Summary API Metrics with curl

Source: https://kubernetes.io/docs/reference/_print

This example demonstrates how to retrieve Summary API metrics using curl. You must run 'kubectl proxy' first and adjust the port if necessary.

```bash
# You need to run "kubectl proxy" first
# Change 8080 to the port that "kubectl proxy" assigns
curl http://localhost:8080/api/v1/nodes/minikube/proxy/stats/summary
```

--------------------------------

### View Pod Status Output Example

Source: https://kubernetes.io/docs/tasks/debug/debug-application/debug-init-containers

Example output showing a pod status where one of two Init Containers has completed.

```text
NAME         READY     STATUS     RESTARTS   AGE
<pod-name>   0/1       Init:1/2   0          7s
```

--------------------------------

### Install kubeadm and kubelet Binaries

Source: https://kubernetes.io/docs/setup/production-environment/tools/_print

Downloads and installs the kubeadm and kubelet binaries for the specified release and architecture. Ensures the binaries are executable.

```bash
RELEASE="$(curl -sSL https://dl.k8s.io/release/stable.txt)"
ARCH="amd64"
cd $DOWNLOAD_DIR
sudo curl -L --remote-name-all https://dl.k8s.io/release/${RELEASE}/bin/linux/${ARCH}/{kubeadm,kubelet}
sudo chmod +x {kubeadm,kubelet}

```

--------------------------------

### StatefulSet Pod Status Example

Source: https://kubernetes.io/docs/tutorials/_print

Example output showing the lifecycle of StatefulSet Pods during creation, from 'Pending' to 'Running', illustrating ordered deployment.

```text
NAME      READY     STATUS    RESTARTS   AGE
web-0     0/1       Pending   0          0s
web-0     0/1       Pending   0         0s
web-0     0/1       ContainerCreating   0         0s
web-0     1/1       Running   0         19s
web-1     0/1       Pending   0         0s
web-1     0/1       Pending   0         0s
web-1     0/1       ContainerCreating   0         0s
web-1     1/1       Running   0         18s

```

--------------------------------

### Start a pod with labels

Source: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands

Applies metadata labels to the created pod.

```bash
kubectl run hazelcast --image=hazelcast/hazelcast --labels="app=hazelcast,env=prod"
```

--------------------------------

### Create a Deployment

Source: https://kubernetes.io/docs/concepts/policy/_print

Create a sample deployment to test object count quotas.

```bash
kubectl create deployment nginx --image=nginx --namespace=myspace --replicas=2
```

--------------------------------

### Set Default Command Flag

Source: https://kubernetes.io/docs/reference/kubectl/generated/_print

This command sets a default value for a specific command flag. For example, setting the default output format for the 'get' command to 'wide'.

```bash
kubectl alpha kuberc set --section defaults --command get --option output=wide
```

--------------------------------

### Kubeconfig user examples

Source: https://kubernetes.io/docs/reference/_print

Examples for generating a kubeconfig file for a specific user.

```bash
  # Output a kubeconfig file for an additional user named foo
  kubeadm kubeconfig user --client-name=foo
  
  # Output a kubeconfig file for an additional user named foo using a kubeadm config file bar
  kubeadm kubeconfig user --client-name=foo --config=bar
```

--------------------------------

### Create Deployment and Set Label

Source: https://kubernetes.io/docs/reference/kubectl/generated/_print

This example shows creating a deployment and then applying a label to it, which can be a precursor to setting a selector. It uses a dry-run to pipe the output to 'kubectl label' and then to 'kubectl create'.

```bash
kubectl create deployment my-dep --image=nginx -o yaml --dry-run=client | kubectl label --local -f - environment=qa -o yaml | kubectl create -f -
```

--------------------------------

### Verify Kubernetes yum Repository Entry

Source: https://kubernetes.io/docs/tasks/_print

Examine the output for a `baseurl` similar to the example, confirming the use of Kubernetes package repositories. This is necessary for following the upgrade guide.

```ini
[kubernetes]
name=Kubernetes
baseurl=https://pkgs.k8s.io/core:/stable:/v1.34/rpm/
enabled=1
gpgcheck=1
gpgkey=https://pkgs.k8s.io/core:/stable:/v1.34/rpm/repodata/repomd.xml.key
exclude=kubelet kubeadm kubectl

```

--------------------------------

### KubeletConfiguration Example

Source: https://kubernetes.io/docs/reference/config-api/kubeadm-config.v1beta4

Basic structure for Kubelet configuration.

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
# kubelet specific options here

```

--------------------------------

### Example /etc/resolv.conf configuration

Source: https://kubernetes.io/docs/concepts/services-networking/dns-pod-service

Shows the DNS search and nameserver configuration used by kubelet for Pod resolution.

```text
nameserver 10.32.0.10
search <namespace>.svc.cluster.local svc.cluster.local cluster.local
options ndots:5

```

--------------------------------

### Install Python Client Library

Source: https://kubernetes.io/docs/tasks/access-application-cluster/access-cluster

Install the Python client library using pip. Additional installation options can be found on the Python Client Library page.

```bash
pip install kubernetes
```

--------------------------------

### Install CoreDNS Addon with Kubeadm

Source: https://kubernetes.io/docs/reference/_print

Installs the CoreDNS addon components via the API server. Note that CoreDNS will not be scheduled until CNI is installed. This command can also print manifests instead of installing.

```bash
kubeadm init phase addon coredns [flags]
```

--------------------------------

### Run CRI-O installer

Source: https://kubernetes.io/docs/tutorials/cluster-management/kubelet-standalone

Execute the downloaded script to install CRI-O and dependencies.

```bash
sudo bash crio-install
```

--------------------------------

### Display Pod status table with Init Container progress

Source: https://kubernetes.io/docs/tasks/debug/_print

Example output of `kubectl get pod <pod-name>` showing a Pod with two Init Containers, where one has completed successfully.

```text
NAME         READY     STATUS     RESTARTS   AGE
<pod-name>   0/1       Init:1/2   0          7s

```

--------------------------------

### Configure Deployment with Labels

Source: https://kubernetes.io/docs/tasks/manage-kubernetes-objects/kustomization

Create a deployment and a kustomization file that applies labels to resources.

```bash
cat <<EOF > deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-nginx
spec:
  selector:
    matchLabels:
      run: my-nginx
  replicas: 2
  template:
    metadata:
      labels:
        run: my-nginx
    spec:
      containers:
      - name: my-nginx
        image: nginx
        ports:
        - containerPort: 80
EOF

cat <<EOF >./kustomization.yaml
namePrefix: dev-
labels:
  - pairs:
      app: my-nginx
    includeSelectors: true 
resources:
- deployment.yaml
EOF
```

--------------------------------

### Install dependencies

Source: https://kubernetes.io/docs/contribute/_print

Download required Go packages and the reference-docs repository.

```bash
go get -u github.com/spf13/pflag
go get -u github.com/spf13/cobra
go get -u gopkg.in/yaml.v2
go get -u github.com/kubernetes-sigs/reference-docs

```

--------------------------------

### Start a pod with a different command and arguments

Source: https://kubernetes.io/docs/reference/_print

Start the nginx pod using a different command and custom arguments.

```bash
kubectl run nginx --image=nginx --command -- <cmd> <arg1> ... <argN>
```

--------------------------------

### Start a basic nginx pod

Source: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands

Creates a simple pod running the nginx image.

```bash
kubectl run nginx --image=nginx
```

--------------------------------

### List ResourceSlices to Verify Drivers

Source: https://kubernetes.io/docs/tasks/configure-pod-container/assign-resources/set-up-dra-cluster

After installing device drivers, use `kubectl get resourceslices` to confirm they are functioning correctly and publishing resources. This command lists the available ResourceSlices in the cluster.

```bash
kubectl get resourceslices
```

--------------------------------

### Install kubectl on Debian/Ubuntu

Source: https://kubernetes.io/docs/tasks/_print

Installs kubectl on Debian-based systems using apt. Ensure apt-transport-https and gnupg are installed.

```bash
sudo apt-get update
sudo apt-get install -y apt-transport-https ca-certificates curl gnupg
```

```bash
curl -fsSL https://pkgs.k8s.io/core:/stable:/v1.35/deb/Release.key | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg
sudo chmod 644 /etc/apt/keyrings/kubernetes-apt-keyring.gpg
```

```bash
echo 'deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/v1.35/deb/ /' | sudo tee /etc/apt/sources.list.d/kubernetes.list
sudo chmod 644 /etc/apt/sources.list.d/kubernetes.list
```

```bash
sudo apt-get update
sudo apt-get install -y kubectl
```

--------------------------------

### Pod Configuration Example

Source: https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.35

A basic Pod configuration that executes an echo command to print 'Hello World'.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-example
spec:
  containers:
  - name: ubuntu
    image: ubuntu:trusty
    command: ["echo"]
    args: ["Hello World"]
```

--------------------------------

### Install kubectl using Chocolatey

Source: https://kubernetes.io/docs/tasks/tools/_print

Install the kubectl command-line tool on Windows using the Chocolatey package manager. Ensure Chocolatey is installed and configured.

```powershell
choco install kubernetes-cli
```

--------------------------------

### Download and install containerd on Windows

Source: https://kubernetes.io/docs/tasks/administer-cluster/kubeadm/adding-windows-nodes

Downloads the installation script and executes it with a specified containerd version.

```powershell
curl.exe -LO https://raw.githubusercontent.com/kubernetes-sigs/sig-windows-tools/master/hostprocess/Install-Containerd.ps1
```

```powershell
.\Install-Containerd.ps1 -ContainerDVersion CONTAINERD_VERSION
```

--------------------------------

### Well-Known Metadata Examples

Source: https://kubernetes.io/docs/reference/_print

Examples of standard Kubernetes labels and annotations.

```yaml
apf.kubernetes.io/autoupdate-spec: "true"
```

```yaml
app.kubernetes.io/component: "database"
```

```yaml
app.kubernetes.io/created-by: "controller-manager"
```

```yaml
app.kubernetes.io/instance: "mysql-abcxyz"
```

```yaml
app.kubernetes.io/managed-by: "helm"
```

```yaml
app.kubernetes.io/name: "mysql"
```

```yaml
app.kubernetes.io/part-of: "wordpress"
```

```yaml
app.kubernetes.io/version: "5.7.21"
```

--------------------------------

### List ControllerRevisions HTTP Request

Source: https://kubernetes.io/docs/reference//kubernetes-api/workload-resources/controller-revision-v1

Example HTTP GET request to list or watch ControllerRevision objects within a specific namespace. Supports various query parameters for filtering and pagination.

```http
GET /apis/apps/v1/namespaces/{namespace}/controllerrevisions
```

--------------------------------

### kubeadm init Output and Post-Initialization Steps

Source: https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm

This output from `kubeadm init` provides essential commands for setting up kubectl for regular users and instructions for joining other nodes to the cluster. Ensure you save the `kubeadm join` command as it contains a secret token.

```bash
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

```bash
kubectl apply -f [podnetwork].yaml
```

```bash
kubeadm join <control-plane-host>:<control-plane-port> --token <token> --discovery-token-ca-cert-hash sha256:<hash>
```

--------------------------------

### Kubectl Rollout Examples

Source: https://kubernetes.io/docs/reference/kubectl/generated/_print

Examples of how to use the kubectl rollout command for various operations.

```APIDOC
## Examples
```
  # Rollback to the previous deployment
  kubectl rollout undo deployment/abc
  
  # Check the rollout status of a daemonset
  kubectl rollout status daemonset/foo
  
  # Restart a deployment
  kubectl rollout restart deployment/abc
  
  # Restart deployments with the 'app=nginx' label
  kubectl rollout restart deployment --selector=app=nginx

```
```

--------------------------------

### Test Nginx Server from Container

Source: https://kubernetes.io/docs/tasks/_print

Install curl and send a GET request to the local Nginx server from within the container to verify the index.html content. Requires an active shell session.

```bash
# Run this in the shell inside your container
apt-get update
apt-get install curl
curl http://localhost/

```

--------------------------------

### AuthenticationConfiguration JWT Example

Source: https://kubernetes.io/docs/reference/_print

This configuration maps JWT claims to user info fields and includes a user validation rule. The username validation rule ensures that the username does not start with 'system:'.

```yaml
apiVersion: apiserver.config.k8s.io/v1
kind: AuthenticationConfiguration
jwt:
- issuer:
    url: https://example.com
    audiences:
    - my-app
  claimMappings:
    username:
      expression: 'claims.username + ":external-user"'
    groups:
      expression: 'claims.roles.split(",")'
    uid:
      expression: 'claims.sub'
    extra:
    - key: 'example.com/tenant'
      valueExpression: 'claims.tenant'
  userValidationRules:
  - expression: "!user.username.startsWith('system:')" # the expression will evaluate to true, so validation will succeed.
    message: 'username cannot used reserved system: prefix'

```

--------------------------------

### Install kubectl using Homebrew

Source: https://kubernetes.io/docs/tasks/_print

Installs kubectl using the Homebrew package manager on Linux systems. Verify the installation with `kubectl version --client`.

```bash
brew install kubectl
kubectl version --client

```

--------------------------------

### Pod Specification Examples

Source: https://kubernetes.io/docs/tasks/extend-kubernetes/configure-multiple-schedulers

Examples of Pod configurations with and without explicit scheduler assignments.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: no-annotation
  labels:
    name: multischeduler-example
spec:
  containers:
  - name: pod-with-no-annotation-container
    image: registry.k8s.io/pause:3.8
```

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: annotation-default-scheduler
  labels:
    name: multischeduler-example
spec:
  schedulerName: default-scheduler
  containers:
  - name: pod-with-default-annotation-container
    image: registry.k8s.io/pause:3.8
```

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: annotation-second-scheduler
  labels:
    name: multischeduler-example
spec:
  schedulerName: my-scheduler
  containers:
  - name: pod-with-second-annotation-container
    image: registry.k8s.io/pause:3.8
```

--------------------------------

### Create a new namespace

Source: https://kubernetes.io/docs/tutorials/security/_print

Creates a Kubernetes namespace named example.

```bash
kubectl create ns example
```

--------------------------------

### Autoscale Deployment Example

Source: https://kubernetes.io/docs/reference/kubectl/_print

Examples demonstrating how to autoscale a Kubernetes deployment with different configurations for minimum and maximum pod counts, and CPU/memory targets.

```APIDOC
## POST /api/v1/namespaces/{namespace}/scale

### Description
This endpoint allows for the configuration of the Horizontal Pod Autoscaler for a specified resource, such as a Deployment or ReplicationController. It enables dynamic adjustment of the number of pods based on observed metrics like CPU or memory utilization.

### Method
POST

### Endpoint
/api/v1/namespaces/{namespace}/scale

### Parameters
#### Query Parameters
- **namespace** (string) - Required - The namespace of the resource to autoscale.

#### Request Body
- **apiVersion** (string) - Required - The version of the API.
- **kind** (string) - Required - The type of resource to autoscale (e.g., "Deployment", "ReplicationController").
- **metadata** (object) - Required - Metadata for the resource.
  - **name** (string) - Required - The name of the resource to autoscale.
- **spec** (object) - Required - Specification for the autoscaler.
  - **minReplicas** (integer) - Optional - The minimum number of replicas.
  - **maxReplicas** (integer) - Required - The maximum number of replicas.
  - **targetCPUUtilizationPercentage** (integer) - Optional - The target CPU utilization percentage.
  - **targetMemoryUtilizationPercentage** (integer) - Optional - The target memory utilization percentage.

### Request Example
```json
{
  "apiVersion": "autoscaling/v1",
  "kind": "Scale",
  "metadata": {
    "name": "my-deployment"
  },
  "spec": {
    "minReplicas": 2,
    "maxReplicas": 10,
    "targetCPUUtilizationPercentage": 80
  }
}
```

### Response
#### Success Response (200)
- **apiVersion** (string) - The version of the API.
- **kind** (string) - The type of resource scaled.
- **metadata** (object) - Metadata for the scaled resource.
  - **name** (string) - The name of the scaled resource.
- **spec** (object) - The updated specification for the autoscaler.
  - **minReplicas** (integer) - The minimum number of replicas.
  - **maxReplicas** (integer) - The maximum number of replicas.
  - **targetCPUUtilizationPercentage** (integer) - The target CPU utilization percentage.
  - **targetMemoryUtilizationPercentage** (integer) - The target memory utilization percentage.

#### Response Example
```json
{
  "apiVersion": "autoscaling/v1",
  "kind": "Scale",
  "metadata": {
    "name": "my-deployment"
  },
  "spec": {
    "minReplicas": 2,
    "maxReplicas": 10,
    "targetCPUUtilizationPercentage": 80
  }
}
```
```

--------------------------------

### Define kubectl alias with prepended arguments

Source: https://kubernetes.io/docs/reference/_print

Use `prependArgs` to insert arguments immediately after the kubectl command and subcommand. This example sets up an alias 'getn' for 'get' that defaults to the 'json' output and prepends 'namespace'.

```yaml
apiVersion: kubectl.config.k8s.io/v1beta1
kind: Preference
alias:
  - name: getn
    command: get
    options:
      - name: output
        default: json
    prependArgs:
      - namespace

```

--------------------------------

### Install kubectl using winget

Source: https://kubernetes.io/docs/tasks/tools/_print

Install the kubectl command-line tool on Windows using the winget package manager. This command installs the official Kubernetes CLI package.

```powershell
winget install -e --id Kubernetes.kubectl
```

--------------------------------

### Get Cluster Service Information

Source: https://kubernetes.io/docs/tasks/access-application-cluster/access-cluster-services

Use `kubectl cluster-info` to list built-in services and their proxy URLs. This command helps in discovering services like logging and monitoring that are typically started within the `kube-system` namespace.

```bash
kubectl cluster-info

```

--------------------------------

### Kubectl List Services Output

Source: https://kubernetes.io/docs/reference/using-api/api-concepts

Example output from 'kubectl get services -A -o yaml'. This uses 'kind: List' as an internal representation for collections, which is distinct from the API's native collection kinds.

```yaml
apiVersion: v1
kind: List
metadata:
  resourceVersion: ""
  selfLink: ""
items:
- apiVersion: v1
  kind: Service
  metadata:
    creationTimestamp: "2021-06-03T14:54:12Z"
    labels:
      component: apiserver
      provider: kubernetes
    name: kubernetes
    namespace: default
...
- apiVersion: v1
  kind: Service
  metadata:
    annotations:
      prometheus.io/port: "9153"
      prometheus.io/scrape: "true"
    creationTimestamp: "2021-06-03T14:54:14Z"
    labels:
      k8s-app: kube-dns
      kubernetes.io/cluster-service: "true"
      kubernetes.io/name: CoreDNS
    name: kube-dns
    namespace: kube-system


```

--------------------------------

### Python Client Installation

Source: https://kubernetes.io/docs/tasks/_print

Install the Kubernetes Python client library using `pip`. Refer to the Python Client Library page for alternative installation methods and options.

```bash
pip install kubernetes

```

--------------------------------

### Install Addons

Source: https://kubernetes.io/docs/reference/_print

Installs required addons for passing conformance tests.

```bash
kubeadm init phase addon [flags]
```

--------------------------------

### Install and List Processes

Source: https://kubernetes.io/docs/tasks/_print

Update package lists, install the 'procps' package for process utilities, and then list running processes within the container.

```bash
root@redis:/data/redis# apt-get update
root@redis:/data/redis# apt-get install procps
root@redis:/data/redis# ps aux
```

--------------------------------

### Kustomize Output Example

Source: https://kubernetes.io/docs/tasks/manage-kubernetes-objects/_print

Example of a Kubernetes Deployment generated by Kustomize, showing the applied name prefix and suffix.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: dev-my-nginx-001
spec:
  replicas: 2
  selector:
    matchLabels:
      run: my-nginx
  template:
    metadata:
      labels:
        run: my-nginx
    spec:
      containers:
      - command:
        - start
        - --host
        - dev-my-nginx-001
        image: nginx
        name: my-nginx
```

--------------------------------

### Burstable QoS Pod Output Example

Source: https://kubernetes.io/docs/tasks/_print

This output snippet from `kubectl get pod ... --output=yaml` shows that the Pod has been assigned the 'Burstable' QoS class because its memory request is less than its memory limit.

```yaml
spec:
  containers:
  - image: nginx
    imagePullPolicy: Always
    name: qos-demo-2-ctr
    resources:
      limits:
        memory: 200Mi
      requests:
        memory: 100Mi
  ...
status:
  qosClass: Burstable

```

--------------------------------

### Example APT repository entry

Source: https://kubernetes.io/docs/tasks/administer-cluster/kubeadm/change-package-repository

Current and updated repository URL formats for Debian-based systems.

```text
deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/v1.34/deb/ /
```

```text
deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/v1.35/deb/ /
```

--------------------------------

### ConfigMap output example

Source: https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap

Example output showing the structure of a ConfigMap.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  creationTimestamp: 2019-12-27T18:36:28Z
  name: game-config-env-file
  namespace: default
  resourceVersion: "809965"
  uid: d9d1ca5b-eb34-11e7-887b-42010a8002b8
data:
  allowed: '"true"'
  enemies: aliens
  lives: "3"
```

--------------------------------

### Create a demo Pod

Source: https://kubernetes.io/docs/tasks/debug/debug-application/debug-running-pod

Initializes a Pod using the pause image to demonstrate debugging scenarios.

```bash
kubectl run ephemeral-demo --image=registry.k8s.io/pause:3.1 --restart=Never
```

--------------------------------

### ZooKeeper Start Command Configuration

Source: https://kubernetes.io/docs/tutorials/_print

Example of ZooKeeper server configuration passed as command-line arguments within a Kubernetes manifest. This includes settings for server count, data directories, ports, and various ZooKeeper protocol parameters.

```yaml
command:
      - sh
      - -c
      - "start-zookeeper \
        --servers=3 \
        --data_dir=/var/lib/zookeeper/data \
        --data_log_dir=/var/lib/zookeeper/data/log \
        --conf_dir=/opt/zookeeper/conf \
        --client_port=2181 \
        --election_port=3888 \
        --server_port=2888 \
        --tick_time=2000 \
        --init_limit=10 \
        --sync_limit=5 \
        --heap=512M \
        --max_client_cnxns=60 \
        --snap_retain_count=3 \
        --purge_interval=12 \
        --max_session_timeout=40000 \
        --min_session_timeout=4000 \
        --log_level=INFO"
…
```

--------------------------------

### Pod Manifest Examples

Source: https://kubernetes.io/docs/tasks/_print

Example Pod manifests demonstrating different resource specification scenarios.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: default-mem-demo
spec:
  containers:
  - name: default-mem-demo-ctr
    image: nginx
```

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: default-mem-demo-2
spec:
  containers:
  - name: default-mem-demo-2-ctr
    image: nginx
    resources:
      limits:
        memory: "1Gi"
```

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: default-mem-demo-3
spec:
  containers:
  - name: default-mem-demo-3-ctr
    image: nginx
    resources:
      requests:
        memory: "128Mi"
```

--------------------------------

### Install Jinja2 Library

Source: https://kubernetes.io/docs/tasks/job/_print

Installs the Jinja2 template library for advanced manifest generation.

```bash
pip install --user jinja2
```

--------------------------------

### Test Web Server Response Inside Container

Source: https://kubernetes.io/docs/tasks/debug/_print

Update package lists, install `curl`, and then send a GET request to the local nginx server to verify the `index.html` content. This is run from within the container's shell.

```bash
# Run in the shell inside your container
apt-get update
apt-get install curl
curl http://localhost/

```

--------------------------------

### SubjectAccessReview Request for Kubernetes Authorization

Source: https://kubernetes.io/docs/concepts/_print

A SubjectAccessReview request used to check if a user is authorized to perform an action. This example checks if 'bob' can 'get' 'pods' in the 'projectCaribou' namespace. The 'group' field should match the API group of the resource.

```json
{
  "apiVersion": "authorization.k8s.io/v1beta1",
  "kind": "SubjectAccessReview",
  "spec": {
    "resourceAttributes": {
      "namespace": "projectCaribou",
      "verb": "get",
      "group": "unicorn.example.org",
      "resource": "pods"
    }
  }
}

```

--------------------------------

### Install Kube-proxy Addon

Source: https://kubernetes.io/docs/reference/setup-tools/kubeadm/kubeadm-init-phase

Installs the kube-proxy addon components via the API server.

```APIDOC
## kubeadm init phase addon kube-proxy

### Description
Install the kube-proxy addon components via the API server.

### Method
POST (implied by 'install')

### Endpoint
/api/v1/namespaces/kube-system/configmaps/kube-proxy - (This is an inferred endpoint based on typical Kubernetes addon installation)

### Parameters
#### Query Parameters
- **--config** (string) - Optional - Path to a kubeadm configuration file.
- **--dry-run** - Optional - Don't apply any changes; just output what would be done.
- **--feature-gates** (string) - Optional - A set of key=value pairs that describe feature gates for various features.
- **-h, --help** - Optional - help for kube-proxy
- **--image-repository** (string) - Optional - Choose a container registry to pull control plane images from. Default: "registry.k8s.io"
- **--kubeconfig** (string) - Optional - The kubeconfig file to use when talking to the cluster. If the flag is not set, a set of standard locations can be searched for an existing kubeconfig file. Default: "/etc/kubernetes/admin.conf"
- **--kubernetes-version** (string) - Optional - Choose a specific Kubernetes version for the control plane. Default: "stable-1"
- **--service-cidr** (string) - Optional - Use alternative range of IP address for service VIPs. Default: "10.96.0.0/12"
- **--service-dns-domain** (string) - Optional - Use alternative domain for services, e.g. "myorg.internal". Default: "cluster.local"

#### Inherited Options
- **--rootfs** (string) - Optional - The path to the 'real' host root filesystem. This will cause kubeadm to chroot into the provided path.

### Request Example
```bash
kubeadm init phase addon kube-proxy --kubernetes-version v1.28.0
```

### Response
#### Success Response (200)
- **status** (string) - Indicates the success of the operation.

#### Response Example
```json
{
  "status": "Kube-proxy addon installed successfully"
}
```
```

--------------------------------

### Start Hugo Server (Windows/Fallback)

Source: https://kubernetes.io/docs/contribute/new-content/preview-locally

Alternative command for starting the Hugo server when make is unavailable.

```bash
hugo server --buildFuture
```

--------------------------------

### Multi-file ConfigMap output example

Source: https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap

Example output for a ConfigMap created from multiple environment files.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  creationTimestamp: 2019-12-27T18:38:34Z
  name: config-multi-env-files
  namespace: default
  resourceVersion: "810136"
  uid: 252c4572-eb35-11e7-887b-42010a8002b8
data:
  allowed: '"true"'
  color: purple
  enemies: aliens
  how: fairlyNice
  lives: "3"
  textmode: "true"
```

--------------------------------

### Install Kube-Proxy Addon

Source: https://kubernetes.io/docs/reference/setup-tools/kubeadm/_print

Installs the kube-proxy addon components via the API server.

```APIDOC
## kubeadm init phase addon kube-proxy

### Description
Install the kube-proxy addon components via the API server.
```

--------------------------------

### Get Docker environment information

Source: https://kubernetes.io/docs/reference/kubectl/_print

Use `docker info` to retrieve detailed information about the Docker installation, including the number of containers, images, storage driver, kernel version, and OS. It also shows system resource information.

```bash
docker info

```

```text
Containers: 40
Images: 168
Storage Driver: aufs
 Root Dir: /usr/local/google/docker/aufs
 Backing Filesystem: extfs
 Dirs: 248
 Dirperm1 Supported: false
Execution Driver: native-0.2
Logging Driver: json-file
Kernel Version: 3.13.0-53-generic
Operating System: Ubuntu 14.04.2 LTS
CPUs: 12
Total Memory: 31.32 GiB
Name: k8s-is-fun.mtv.corp.google.com
ID: ADUV:GCYR:B3VJ:HMPO:LNPQ:KD5S:YKFQ:76VN:IANZ:7TFV:ZBF4:BYJO
WARNING: No swap limit support


```

--------------------------------

### Create ConfigMap and Deployment files

Source: https://kubernetes.io/docs/tasks/_print

Initial setup of application properties, deployment manifest, and kustomization file for ConfigMap generation.

```bash
cat <<EOF >application.properties
FOO=Bar
EOF

cat <<EOF >deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
  labels:
    app: my-app
spec:
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
      - name: app
        image: my-app
        volumeMounts:
        - name: config
          mountPath: /config
      volumes:
      - name: config
        configMap:
          name: example-configmap-1
EOF

cat <<EOF >./kustomization.yaml
resources:
- deployment.yaml
configMapGenerator:
- name: example-configmap-1
  files:
  - application.properties
EOF
```

--------------------------------

### Guaranteed QoS Pod Output Example

Source: https://kubernetes.io/docs/tasks/_print

This output snippet from `kubectl get pod ... --output=yaml` confirms that the Pod has been assigned the 'Guaranteed' QoS class because its container's memory and CPU requests match its limits.

```yaml
spec:
  containers:
    ...
    resources:
      limits:
        cpu: 700m
        memory: 200Mi
      requests:
        cpu: 700m
        memory: 200Mi
    ...
status:
  qosClass: Guaranteed

```

--------------------------------

### Apply Deployment Configuration

Source: https://kubernetes.io/docs/tasks/_print

Use this command to create the Deployment and ReplicaSet for the Hello World application in your cluster.

```bash
kubectl apply -f https://k8s.io/examples/service/access/hello-application.yaml

```

--------------------------------

### Install Cilium CLI

Source: https://kubernetes.io/docs/tasks/_print

Download and install the Cilium CLI tool to a local binary directory.

```bash
curl -LO https://github.com/cilium/cilium-cli/releases/latest/download/cilium-linux-amd64.tar.gz
```

```bash
sudo tar xzvfC cilium-linux-amd64.tar.gz /usr/local/bin
rm cilium-linux-amd64.tar.gz
```

--------------------------------

### Install kubectl with Homebrew

Source: https://kubernetes.io/docs/tasks/tools/_print

Installs kubectl using the Homebrew package manager.

```bash
brew install kubectl
```

```bash
brew install kubernetes-cli
```

--------------------------------

### Create ConfigMap from multiple environment files

Source: https://kubernetes.io/docs/tasks/_print

Starting with Kubernetes v1.23, you can specify `--from-env-file` multiple times to create a ConfigMap from several data sources. View the resulting ConfigMap with `kubectl get configmap <configmap-name> -o yaml`.

```bash
kubectl create configmap config-multi-env-files \
        --from-env-file=configure-pod-container/configmap/game-env-file.properties \
        --from-env-file=configure-pod-container/configmap/ui-env-file.properties
```

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  creationTimestamp: 2019-12-27T18:38:34Z
  name: config-multi-env-files
  namespace: default
  resourceVersion: "810136"
  uid: 252c4572-eb35-11e7-887b-42010a8002b8
data:
  allowed: '"true"'
  color: purple
  enemies: aliens
  how: fairlyNice
  lives: "3"
  textmode: "true"
```

--------------------------------

### Clean Up Tutorial Resources

Source: https://kubernetes.io/docs/tutorials/cluster-management/install-use-dra

Remove all namespaces, device classes, roles, and bindings created during the tutorial.

```bash
kubectl delete namespace dra-tutorial
kubectl delete deviceclass gpu.example.com
kubectl delete clusterrole dra-example-driver-role
kubectl delete clusterrolebinding dra-example-driver-role-binding
kubectl delete priorityclass dra-driver-high-priority
```

--------------------------------

### Install kubectl with Homebrew

Source: https://kubernetes.io/docs/tasks/tools/install-kubectl-macos

Installs kubectl using the Homebrew package manager.

```bash
brew install kubectl
```

```bash
brew install kubernetes-cli
```

```bash
kubectl version --client
```

--------------------------------

### Define kubectl alias with prepended arguments

Source: https://kubernetes.io/docs/reference/kubectl/kuberc

This example extends the previous alias by adding a 'prependArgs' section. This allows inserting arguments immediately after the command and subcommand. For instance, 'kubectl getn' will now translate to 'kubectl get namespace --output json'.

```yaml
apiVersion: kubectl.config.k8s.io/v1beta1
kind: Preference
alias:
  - name: getn
    command: get
    options:
      - name: output
        default: json
    prependArgs:
      - namespace

```

--------------------------------

### Enable Kubelet Service

Source: https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/install-kubeadm

Enable and start the kubelet service.

```bash
sudo systemctl enable --now kubelet
```

--------------------------------

### Configure Exec Credential Plugin (v1)

Source: https://kubernetes.io/docs/reference/_print

Example of a kubectl config file snippet for configuring an exec credential plugin using API version client.authentication.k8s.io/v1. This configuration specifies the command to execute, API version, environment variables, arguments, install hint, and interactive mode.

```yaml
apiVersion: v1
kind: Config
users:
- name: my-user
  user:
    exec:
      # Command to execute. Required.
      command: "example-client-go-exec-plugin"

      # API version to use when decoding the ExecCredentials resource. Required.
      #
      # The API version returned by the plugin MUST match the version listed here.
      #
      # To integrate with tools that support multiple versions (such as client.authentication.k8s.io/v1beta1),
      # set an environment variable, pass an argument to the tool that indicates which version the exec plugin expects,
      # or read the version from the ExecCredential object in the KUBERNETES_EXEC_INFO environment variable.
      apiVersion: "client.authentication.k8s.io/v1"

      # Environment variables to set when executing the plugin. Optional.
      env:
      - name: "FOO"
        value: "bar"

      # Arguments to pass when executing the plugin. Optional.
      args:
      - "arg1"
      - "arg2"

      # Text shown to the user when the executable doesn't seem to be present. Optional.
      installHint: |
        example-client-go-exec-plugin is required to authenticate
        to the current cluster.  It can be installed:

        On macOS: brew install example-client-go-exec-plugin

        On Ubuntu: apt-get install example-client-go-exec-plugin

        On Fedora: dnf install example-client-go-exec-plugin

        ...        

      # Whether or not to provide cluster information, which could potentially contain
      # very large CA data, to this exec plugin as a part of the KUBERNETES_EXEC_INFO
      # environment variable.
      provideClusterInfo: true

      # The contract between the exec plugin and the standard input I/O stream. If the
      # contract cannot be satisfied, this plugin will not be run and an error will be
      # returned. Valid values are "Never" (this exec plugin never uses standard input),
      # "IfAvailable" (this exec plugin wants to use standard input if it is available),
      # or "Always" (this exec plugin requires standard input to function). Required.
      interactiveMode: Never
clusters:
- name: my-cluster
  cluster:
    server: "https://172.17.4.100:6443"
    certificate-authority: "/etc/kubernetes/ca.pem"
    extensions:
    - name: client.authentication.k8s.io/exec # reserved extension name for per cluster exec config
      extension:
        arbitrary: config
        this: can be provided via the KUBERNETES_EXEC_INFO environment variable upon setting provideClusterInfo
        you: ["can", "put", "anything", "here"]
contexts:
- name: my-cluster
  context:
    cluster: my-cluster
    user: my-user
current-context: my-cluster

```

--------------------------------

### Pod's resolv.conf Example Output (IPv4)

Source: https://kubernetes.io/docs/concepts/services-networking/dns-pod-service

This is an example of the output from viewing a Pod's /etc/resolv.conf file, showing custom DNS settings with a specific nameserver, search domains, and options.

```text
nameserver 192.0.2.1
search ns1.svc.cluster-domain.example my.dns.search.suffix
options ndots:2 edns0

```

--------------------------------

### Install and Verify kubectl-convert

Source: https://kubernetes.io/docs/tasks/_print

Commands to make the binary executable, move it to the system path, and verify the installation.

```bash
chmod +x ./kubectl-convert

```

```bash
sudo mv ./kubectl-convert /usr/local/bin/kubectl-convert
sudo chown root: /usr/local/bin/kubectl-convert

```

```bash
kubectl convert --help

```

```bash
rm kubectl-convert kubectl-convert.sha256

```

--------------------------------

### Create a cluster role binding example

Source: https://kubernetes.io/docs/reference/kubectl/generated/kubectl_create/_print

Example of binding multiple users and a group to the cluster-admin cluster role.

```bash
# Create a cluster role binding for user1, user2, and group1 using the cluster-admin cluster role
  kubectl create clusterrolebinding cluster-admin --clusterrole=cluster-admin --user=user1 --user=user2 --group=group1
```

--------------------------------

### Create the deployment

Source: https://kubernetes.io/docs/tasks/manage-kubernetes-objects/_print

Apply the deployment configuration from a URL.

```bash
kubectl apply -f https://k8s.io/examples/application/deployment-retainkeys.yaml
```

--------------------------------

### Install Cilium

Source: https://kubernetes.io/docs/tasks/administer-cluster/_print

Install Cilium on the Kubernetes cluster. Cilium will automatically detect the cluster configuration and install necessary components.

```bash
cilium install
```

--------------------------------

### Kubeadm Initialization

Source: https://kubernetes.io/docs/reference/_print

Guides and references for initializing a Kubernetes cluster using kubeadm.

```APIDOC
## Kubeadm Init

### Description
Commands and options for initializing a new Kubernetes cluster with kubeadm.

### Method
`kubeadm init`

### Endpoint
N/A (CLI command)

### Parameters
(Refer to kubeadm documentation for specific flags and options)

### Request Example
```bash
kubeadm init --pod-network-cidr=10.244.0.0/16
```

### Response
(Output typically includes instructions for joining nodes and accessing the cluster.)
```

--------------------------------

### Install Java Kubernetes Client

Source: https://kubernetes.io/docs/tasks/_print

Commands to clone the repository and install the Java client artifacts using Maven.

```bash
# Clone java library
git clone --recursive https://github.com/kubernetes-client/java

# Installing project artifacts, POM etc:
cd java
mvn install
```

--------------------------------

### Install kubectl-convert Plugin

Source: https://kubernetes.io/docs/tasks/_print

Install the kubectl-convert binary to a directory in your system's PATH, such as /usr/local/bin. This makes the plugin available system-wide.

```bash
sudo install -o root -g root -m 0755 kubectl-convert /usr/local/bin/kubectl-convert

```

--------------------------------

### Install kubeadm and kubelet

Source: https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/install-kubeadm

Download the kubeadm and kubelet binaries and configure their systemd service files.

```bash
RELEASE="$(curl -sSL https://dl.k8s.io/release/stable.txt)"
ARCH="amd64"
cd $DOWNLOAD_DIR
sudo curl -L --remote-name-all https://dl.k8s.io/release/${RELEASE}/bin/linux/${ARCH}/{kubeadm,kubelet}
sudo chmod +x {kubeadm,kubelet}

RELEASE_VERSION="v0.16.2"
curl -sSL "https://raw.githubusercontent.com/kubernetes/release/${RELEASE_VERSION}/cmd/krel/templates/latest/kubelet/kubelet.service" | sed "s:/usr/bin:${DOWNLOAD_DIR}:g" | sudo tee /usr/lib/systemd/system/kubelet.service
sudo mkdir -p /usr/lib/systemd/system/kubelet.service.d
curl -sSL "https://raw.githubusercontent.com/kubernetes/release/${RELEASE_VERSION}/cmd/krel/templates/latest/kubeadm/10-kubeadm.conf" | sed "s:/usr/bin:${DOWNLOAD_DIR}:g" | sudo tee /usr/lib/systemd/system/kubelet.service.d/10-kubeadm.conf
```

--------------------------------

### Install CoreDNS Addon

Source: https://kubernetes.io/docs/reference/setup-tools/kubeadm/kubeadm-init-phase

Installs the CoreDNS addon components via the API server. Note that CoreDNS will not be scheduled until CNI is installed.

```APIDOC
## kubeadm init phase addon coredns

### Description
Install the CoreDNS addon components via the API server. Please note that although the DNS server is deployed, it will not be scheduled until CNI is installed.

### Method
POST (implied by 'install')

### Endpoint
/api/v1/namespaces/kube-system/configmaps/coredns - (This is an inferred endpoint based on typical Kubernetes addon installation)

### Parameters
#### Query Parameters
- **--config** (string) - Optional - Path to a kubeadm configuration file.
- **--dry-run** - Optional - Don't apply any changes; just output what would be done.
- **--feature-gates** (string) - Optional - A set of key=value pairs that describe feature gates for various features.
- **-h, --help** - Optional - help for coredns
- **--image-repository** (string) - Optional - Choose a container registry to pull control plane images from. Default: "registry.k8s.io"
- **--kubeconfig** (string) - Optional - The kubeconfig file to use when talking to the cluster. If the flag is not set, a set of standard locations can be searched for an existing kubeconfig file. Default: "/etc/kubernetes/admin.conf"
- **--kubernetes-version** (string) - Optional - Choose a specific Kubernetes version for the control plane. Default: "stable-1"
- **--print-manifest** - Optional - Print the addon manifests to STDOUT instead of installing them
- **--service-cidr** (string) - Optional - Use alternative range of IP address for service VIPs. Default: "10.96.0.0/12"
- **--service-dns-domain** (string) - Optional - Use alternative domain for services, e.g. "myorg.internal". Default: "cluster.local"

#### Inherited Options
- **--rootfs** (string) - Optional - The path to the 'real' host root filesystem. This will cause kubeadm to chroot into the provided path.

### Request Example
```bash
kubeadm init phase addon coredns --image-repository my.registry.com/kubernetes
```

### Response
#### Success Response (200)
- **status** (string) - Indicates the success of the operation.

#### Response Example
```json
{
  "status": "CoreDNS addon installed successfully"
}
```
```

--------------------------------

### Install CoreDNS Addon

Source: https://kubernetes.io/docs/reference/setup-tools/kubeadm/kubeadm-init-phase

Executes the installation of CoreDNS components. Note that the DNS server remains unscheduled until a CNI plugin is installed.

```bash
kubeadm init phase addon coredns [flags]
```

--------------------------------

### Install kubectl to System Directory

Source: https://kubernetes.io/docs/tasks/_print

Install the kubectl binary to the system's default executable path, requiring root privileges.

```bash
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
```

--------------------------------

### Example Process Output

Source: https://kubernetes.io/docs/tasks/configure-pod-container/_print

Example output from the 'ps' command, showing process ID, user, time, and command.

```text
PID   USER     TIME  COMMAND
    1 1000      0:00 sleep 1h
    6 1000      0:00 sh
...

```

--------------------------------

### View kuberc configuration examples

Source: https://kubernetes.io/docs/reference/kubectl/generated/kubectl_alpha/_print

Common usage patterns for viewing kuberc configuration with different output formats and file paths.

```bash
  # View kuberc configuration in YAML format (default)
  kubectl alpha kuberc view
  
  # View kuberc configuration in JSON format
  kubectl alpha kuberc view --output json
  
  # View a specific kuberc file
  kubectl alpha kuberc view --kuberc /path/to/kuberc
```

--------------------------------

### Example of Running update-imported-docs Tool

Source: https://kubernetes.io/docs/contribute/generate-ref-docs/_print

Specific example of running the update-imported-docs.py tool with 'reference.yml' and version '1.17'.

```bash
./update-imported-docs.py reference.yml 1.17


```

--------------------------------

### Create a deployment with replicas and image

Source: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands

Create a deployment with a specific name, image, and number of replicas.

```bash
kubectl create deployment my-dep --image=nginx --replicas=3
```

--------------------------------

### Install CoreDNS Addon

Source: https://kubernetes.io/docs/reference/setup-tools/kubeadm/_print

Installs the CoreDNS addon components via the API server. Note that the DNS server will not be scheduled until CNI is installed.

```APIDOC
## kubeadm init phase addon coredns

### Description
Install the CoreDNS addon components via the API server.

### Parameters
#### Flags
- **--config** (string) - Optional - Path to a kubeadm configuration file.
- **--dry-run** (boolean) - Optional - Don't apply any changes; just output what would be done.
- **--feature-gates** (string) - Optional - A set of key=value pairs that describe feature gates.
- **--image-repository** (string) - Optional - Choose a container registry to pull control plane images from (Default: "registry.k8s.io").
- **--kubeconfig** (string) - Optional - The kubeconfig file to use (Default: "/etc/kubernetes/admin.conf").
- **--kubernetes-version** (string) - Optional - Choose a specific Kubernetes version (Default: "stable-1").
- **--print-manifest** (boolean) - Optional - Print the addon manifests to STDOUT instead of installing them.
- **--service-cidr** (string) - Optional - Use alternative range of IP address for service VIPs (Default: "10.96.0.0/12").
- **--service-dns-domain** (string) - Optional - Use alternative domain for services (Default: "cluster.local").
- **--rootfs** (string) - Optional - The path to the 'real' host root filesystem.
```

--------------------------------

### StatefulSet Pods List Example

Source: https://kubernetes.io/docs/tutorials/_print

Example output of listing Pods for the 'web' StatefulSet, showing Pods named 'web-0' and 'web-1' with their running status.

```text
NAME      READY     STATUS    RESTARTS   AGE
web-0     1/1       Running   0          1m
web-1     1/1       Running   0          1m

```

--------------------------------

### Install All Addons with Kubeadm

Source: https://kubernetes.io/docs/reference/setup-tools/kubeadm/kubeadm-init-phase

Installs all required addons for passing conformance tests. This command ensures essential components like CoreDNS and kube-proxy are set up.

```bash
kubeadm init phase addon all [flags]
```

--------------------------------

### Download sample configuration files

Source: https://kubernetes.io/docs/tasks/configure-pod-container/_print

Download sample property files into the local directory for ConfigMap creation.

```bash
# Download the sample files into `configure-pod-container/configmap/` directory
wget https://kubernetes.io/examples/configmap/game.properties -O configure-pod-container/configmap/game.properties
wget https://kubernetes.io/examples/configmap/ui.properties -O configure-pod-container/configmap/ui.properties
```

--------------------------------

### Metadata Example

Source: https://kubernetes.io/docs/tutorials/configuration/_print

Example of ConfigMap metadata structure.

```yaml
metadata:
  creationTimestamp: "2024-01-04T14:05:06Z"
  name: sport
  namespace: default
  resourceVersion: "1743935"
  uid: 024ee001-fe72-487e-872e-34d6464a8a23
```

--------------------------------

### Example Kubernetes repository configuration

Source: https://kubernetes.io/docs/tasks/_print

A sample configuration for a Kubernetes repository using the pkgs.k8s.io URL structure.

```ini
[kubernetes]
name=Kubernetes
baseurl=https://pkgs.k8s.io/core:/stable:/v1.34/rpm/
enabled=1
gpgcheck=1
gpgkey=https://pkgs.k8s.io/core:/stable:/v1.34/rpm/repodata/repomd.xml.key
exclude=kubelet kubeadm kubectl
```

--------------------------------

### Configure Readiness Probe with Exec

Source: https://kubernetes.io/docs/tasks/_print

Example of configuring a readiness probe using an exec command. This probe checks for the existence of a file to determine readiness. Ensure `initialDelaySeconds` is set appropriately if a startup probe is also defined.

```yaml
readinessProbe:
  exec:
    command:
    - cat
    - /tmp/healthy
  initialDelaySeconds: 5
  periodSeconds: 5
```

--------------------------------

### Migration Status Output Example

Source: https://kubernetes.io/docs/tasks/manage-kubernetes-objects/storage-version-migration

Example output showing the status of a migration resource.

```yaml
kind: StorageVersionMigration
apiVersion: storagemigration.k8s.io/v1beta1
metadata:
  name: crdsvm
  uid: 13062fe4-32d7-47cc-9528-5067fa0c6ac8
  resourceVersion: "111"
  creationTimestamp: "2024-03-12T22:40:01Z"
spec:
  resource:
    group: example.com
    resource: testcrds
status:
  conditions:
    - type: Running
      status: "False"
```

--------------------------------

### Storage Capacity Examples

Source: https://kubernetes.io/docs/tasks/_print

Examples of how to represent different storage capacities in node status.

```text
Capacity:
 ...
 example.com/special-storage: 8
```

```text
Capacity:
 ...
 example.com/special-storage:  800Gi
```

--------------------------------

### Install kubectl without root access

Source: https://kubernetes.io/docs/tasks/tools/_print

Install the kubectl binary to a local user directory.

```bash
chmod +x kubectl
mkdir -p ~/.local/bin
mv ./kubectl ~/.local/bin/kubectl
# and then append (or prepend) ~/.local/bin to $PATH
```

--------------------------------

### Download CRI-O installer script

Source: https://kubernetes.io/docs/tutorials/cluster-management/kubelet-standalone

Download the static binary bundle script for CRI-O installation.

```bash
curl https://raw.githubusercontent.com/cri-o/packaging/main/get > crio-install
```

--------------------------------

### Apply a baseline Pod to the example namespace

Source: https://kubernetes.io/docs/tutorials/security/ns-level-pss

Apply a Pod manifest to the 'example' namespace. This will trigger warnings if the Pod violates the configured security standards.

```bash
kubectl apply -n example -f https://k8s.io/examples/security/example-baseline-pod.yaml

```

--------------------------------

### Install kubectl on Fedora/CentOS/RHEL

Source: https://kubernetes.io/docs/tasks/tools/_print

Installs kubectl on RPM-based systems. This involves adding the Kubernetes yum repository configuration and then installing the kubectl package using yum.

```bash
cat <<EOF | sudo tee /etc/yum.repos.d/kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=https://pkgs.k8s.io/core:/stable:/v1.35/rpm/
enabled=1
gpgcheck=1
gpgkey=https://pkgs.k8s.io/core:/stable:/v1.35/rpm/repodata/repomd.xml.key
EOF
```

```bash
sudo yum install -y kubectl
```

--------------------------------

### Install Jinja2 Template Library

Source: https://kubernetes.io/docs/tasks/_print

Installs the Jinja2 library for advanced template processing.

```bash
pip install --user jinja2
```

--------------------------------

### Start a hazelcast pod and expose port

Source: https://kubernetes.io/docs/reference/_print

Start a hazelcast pod and expose port 5701.

```bash
kubectl run hazelcast --image=hazelcast/hazelcast --port=5701
```

--------------------------------

### List DeviceClasses Output

Source: https://kubernetes.io/docs/tasks/_print

Example output showing a list of DeviceClasses in the cluster, including their names and age. This confirms that DeviceClasses have been successfully registered and are available.

```text
NAME                 AGE
driver.example.com   16m

```

--------------------------------

### Pod's resolv.conf Example Output (IPv6)

Source: https://kubernetes.io/docs/concepts/services-networking/dns-pod-service

This is an example of the output from viewing a Pod's /etc/resolv.conf file, demonstrating IPv6 DNS configuration including nameserver and search paths.

```text
nameserver 2001:db8:30::a
search default.svc.cluster-domain.example svc.cluster-domain.example cluster-domain.example
options ndots:5

```

--------------------------------

### Custom key ConfigMap output example

Source: https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap

Example output showing a ConfigMap with a custom key.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  creationTimestamp: 2022-02-18T18:54:22Z
  name: game-config-3
  namespace: default
  resourceVersion: "530"
  uid: 05f8da22-d671-11e5-8cd0-68f728db1985
data:
  game-special-key: |
    enemies=aliens
    lives=3
    enemies.cheat=true
    enemies.cheat.level=noGoodRotten
    secret.code.passphrase=UUDDLRLRBABAS
    secret.code.allowed=true
    secret.code.lives=30
```

--------------------------------

### Install Dependencies

Source: https://kubernetes.io/docs/contribute/new-content/preview-locally

Installs project dependencies using npm.

```bash
npm ci
```

--------------------------------

### Initialize kubeadm with a configuration file

Source: https://kubernetes.io/docs/tasks/administer-cluster/kubeadm/_print

Pass a configuration file to the `kubeadm init` command to apply the specified cluster and kubelet configurations.

```bash
kubeadm init --config kubeadm-config.yaml
```

--------------------------------

### Create a NodePort service example

Source: https://kubernetes.io/docs/reference/kubectl/generated/kubectl_create/kubectl_create_service_nodeport

Example command to create a new NodePort service named my-ns with a specific TCP port mapping.

```bash
  # Create a new NodePort service named my-ns
  kubectl create service nodeport my-ns --tcp=5678:8080
```

--------------------------------

### Start Hugo Server Locally

Source: https://kubernetes.io/docs/contribute/new-content/preview-locally

Starts the Hugo server directly on the host machine.

```bash
cd <path_to_your_repo>/website
make serve
```

--------------------------------

### Get Deployment Information

Source: https://kubernetes.io/docs/tasks/_print

These commands display information about the hello-world Deployment and its associated ReplicaSet.

```bash
kubectl get deployments hello-world
kubectl describe deployments hello-world

```

--------------------------------

### Create a new namespace

Source: https://kubernetes.io/docs/tutorials/security/ns-level-pss

Create a Kubernetes namespace named 'example' to apply Pod Security Standards.

```bash
kubectl create ns example

```

--------------------------------

### Update apt and Install Prerequisites (Debian/Ubuntu)

Source: https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/install-kubeadm

Updates the package index and installs necessary packages for adding the Kubernetes apt repository. Ensure apt-transport-https is installed if needed.

```bash
sudo apt-get update
# apt-transport-https may be a dummy package; if so, you can skip that package
sudo apt-get install -y apt-transport-https ca-certificates curl gpg

```

--------------------------------

### Run kubeadm join phase kubelet-start

Source: https://kubernetes.io/docs/reference/setup-tools/kubeadm/_print

Use this command to write kubelet settings, certificates, and restart the kubelet. Ensure you provide the API server endpoint.

```bash
kubeadm join phase kubelet-start [api-server-endpoint] [flags]
```

--------------------------------

### List Application Pods

Source: https://kubernetes.io/docs/tasks/_print

This command lists the pods running the Hello World application, filtering by the 'run=load-balancer-example' label and showing wide output including IP addresses.

```bash
kubectl get pods --selector="run=load-balancer-example" --output=wide

```

--------------------------------

### Start a hazelcast pod with environment variables

Source: https://kubernetes.io/docs/reference/_print

Start a hazelcast pod and set environment variables `DNS_DOMAIN` and `POD_NAMESPACE`.

```bash
kubectl run hazelcast --image=hazelcast/hazelcast --env="DNS_DOMAIN=cluster" --env="POD_NAMESPACE=default"
```

--------------------------------

### Example TopologyInfo for Device Plugin

Source: https://kubernetes.io/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins

An example of a TopologyInfo struct populated by a Device Plugin, indicating NUMA node affinity.

```go
pluginapi.Device{ID: "25102017", Health: pluginapi.Healthy, Topology:&pluginapi.TopologyInfo{Nodes: []*pluginapi.NUMANode{&pluginapi.NUMANode{ID: 0,},}}}

```

--------------------------------

### Install kubectl with Macports

Source: https://kubernetes.io/docs/tasks/tools/_print

Updates Macports and installs the kubectl package.

```bash
sudo port selfupdate
sudo port install kubectl
```

--------------------------------

### Start Minikube with custom resources

Source: https://kubernetes.io/docs/tutorials/stateful-application/_print

Initialize Minikube with increased memory and CPU to support stateful applications.

```bash
minikube start --memory 5120 --cpus=4
```

--------------------------------

### kubectl uncordon example

Source: https://kubernetes.io/docs/reference/kubectl/generated/kubectl_uncordon/_print

Example of marking a specific node as schedulable.

```bash
  # Mark node "foo" as schedulable
  kubectl uncordon foo
```

--------------------------------

### Initialize easyrsa for Certificate Generation

Source: https://kubernetes.io/docs/tasks/administer-cluster/_print

Download and initialize the patched easyrsa3 environment.

```bash
curl -LO https://dl.k8s.io/easy-rsa/easy-rsa.tar.gz
tar xzf easy-rsa.tar.gz
cd easy-rsa-master/easyrsa3
./easyrsa init-pki
```

--------------------------------

### kubectl create ingress examples

Source: https://kubernetes.io/docs/reference/kubectl/generated/kubectl_create/kubectl_create_ingress

Various configurations for creating ingress resources, including TLS, annotations, and multiple paths.

```bash
  # Create a single ingress called 'simple' that directs requests to foo.com/bar to svc
  # svc1:8080 with a TLS secret "my-cert"
  kubectl create ingress simple --rule="foo.com/bar=svc1:8080,tls=my-cert"
  
  # Create a catch all ingress of "/path" pointing to service svc:port and Ingress Class as "otheringress"
  kubectl create ingress catch-all --class=otheringress --rule="/path=svc:port"
  
  # Create an ingress with two annotations: ingress.annotation1 and ingress.annotations2
  kubectl create ingress annotated --class=default --rule="foo.com/bar=svc:port" \
  --annotation ingress.annotation1=foo \
  --annotation ingress.annotation2=bla
  
  # Create an ingress with the same host and multiple paths
  kubectl create ingress multipath --class=default \
  --rule="foo.com/=svc:port" \
  --rule="foo.com/admin/=svcadmin:portadmin"
  
  # Create an ingress with multiple hosts and the pathType as Prefix
  kubectl create ingress ingress1 --class=default \
  --rule="foo.com/path*=svc:8080" \
  --rule="bar.com/admin*=svc2:http"
  
  # Create an ingress with TLS enabled using the default ingress certificate and different path types
  kubectl create ingress ingtls --class=default \
  --rule="foo.com/=svc:https,tls" \
  --rule="foo.com/path/subpath*=othersvc:8080"
  
  # Create an ingress with TLS enabled using a specific secret and pathType as Prefix
  kubectl create ingress ingsecret --class=default \
  --rule="foo.com/*=svc:8080,tls=secret1"
  
  # Create an ingress with a default backend
  kubectl create ingress ingdefault --class=default \
  --default-backend=defaultsvc:http \
  --rule="foo.com/*=svc:8080,tls=secret1"
```

--------------------------------

### Examples of kubectl config set

Source: https://kubernetes.io/docs/reference/kubectl/generated/kubectl_config/kubectl_config_set

Common usage examples for setting cluster, context, and user fields, including handling binary data.

```bash
  # Set the server field on the my-cluster cluster to https://1.2.3.4
  kubectl config set clusters.my-cluster.server https://1.2.3.4
  
  # Set the certificate-authority-data field on the my-cluster cluster
  kubectl config set clusters.my-cluster.certificate-authority-data $(echo "cert_data_here" | base64 -i -)
  
  # Set the cluster field in the my-context context to my-cluster
  kubectl config set contexts.my-context.cluster my-cluster
  
  # Set the client-key-data field in the cluster-admin user using --set-raw-bytes option
  kubectl config set users.cluster-admin.client-key-data cert_data_here --set-raw-bytes=true
```

--------------------------------

### Install kubectl using snap

Source: https://kubernetes.io/docs/tasks/_print

Installs kubectl as a snap package. This is a convenient method for systems that support snap.

```bash
snap install kubectl --classic
kubectl version --client

```

--------------------------------

### Rollout history output

Source: https://kubernetes.io/docs/tutorials/stateful-application/zookeeper

Example output showing available revisions.

```text
statefulsets "zk"
REVISION
1
2
```

--------------------------------

### Install Kompose via Go

Source: https://kubernetes.io/docs/tasks/_print

Install the latest development version of Kompose using the Go toolchain.

```bash
go get -u github.com/kubernetes/kompose
```

--------------------------------

### GET /api/v1/namespaces/{namespace}/pods/{name}/proxy

Source: https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.35

Connect GET requests to the proxy of a Pod. This endpoint allows you to send GET requests to a specific pod's proxy.

```APIDOC
## GET /api/v1/namespaces/{namespace}/pods/{name}/proxy

### Description
Connect GET requests to proxy of Pod

### Method
GET

### Endpoint
/api/v1/namespaces/{namespace}/pods/{name}/proxy

### Parameters
#### Path Parameters
- **name** (string) - Required - name of the PodProxyOptions
- **namespace** (string) - Required - object name and auth scope, such as for teams and projects

#### Query Parameters
- **path** (string) - Optional - Path is the URL path to use for the current proxy request to pod.

### Response
#### Success Response (200)
- **string** - OK
```

--------------------------------

### Execute custom init phases

Source: https://kubernetes.io/docs/reference/_print

Demonstrates generating manifest files, modifying them, and then running the full init process while skipping the previously executed phases.

```bash
sudo kubeadm init phase control-plane all --config=configfile.yaml
sudo kubeadm init phase etcd local --config=configfile.yaml
# you can now modify the control plane and etcd manifest files
sudo kubeadm init --skip-phases=control-plane,etcd --config=configfile.yaml
```

--------------------------------

### Create Ingress Resources with kubectl

Source: https://kubernetes.io/docs/reference/_print

Examples demonstrating how to define Ingress rules, TLS secrets, annotations, and default backends using the kubectl create ingress command.

```bash
  # Create a single ingress called 'simple' that directs requests to foo.com/bar to svc
  # svc1:8080 with a TLS secret "my-cert"
  kubectl create ingress simple --rule="foo.com/bar=svc1:8080,tls=my-cert"
  
  # Create a catch all ingress of "/path" pointing to service svc:port and Ingress Class as "otheringress"
  kubectl create ingress catch-all --class=otheringress --rule="/path=svc:port"
  
  # Create an ingress with two annotations: ingress.annotation1 and ingress.annotations2
  kubectl create ingress annotated --class=default --rule="foo.com/bar=svc:port" \
  --annotation ingress.annotation1=foo \
  --annotation ingress.annotation2=bla
  
  # Create an ingress with the same host and multiple paths
  kubectl create ingress multipath --class=default \
  --rule="foo.com/=svc:port" \
  --rule="foo.com/admin/=svcadmin:portadmin"
  
  # Create an ingress with multiple hosts and the pathType as Prefix
  kubectl create ingress ingress1 --class=default \
  --rule="foo.com/path*=svc:8080" \
  --rule="bar.com/admin*=svc2:http"
  
  # Create an ingress with TLS enabled using the default ingress certificate and different path types
  kubectl create ingress ingtls --class=default \
  --rule="foo.com/=svc:https,tls" \
  --rule="foo.com/path/subpath*=othersvc:8080"
  
  # Create an ingress with TLS enabled using a specific secret and pathType as Prefix
  kubectl create ingress ingsecret --class=default \
  --rule="foo.com/*=svc:8080,tls=secret1"
  
  # Create an ingress with a default backend
  kubectl create ingress ingdefault --class=default \
  --default-backend=defaultsvc:http \
  --rule="foo.com/*=svc:8080,tls=secret1"
```

--------------------------------

### Verify CNI Bridge Plugin Installation

Source: https://kubernetes.io/docs/tutorials/_print

Run this command to check if the CNI bridge plugin is installed and to see its version. This confirms the `cri-o` installer configured the necessary network components.

```bash
/opt/cni/bin/bridge --version

```

--------------------------------

### Direct API response example

Source: https://kubernetes.io/docs/tasks/_print

Example JSON output when accessing the API directly.

```json
{
  "kind": "APIVersions",
  "versions": [
    "v1"
  ],
  "serverAddressByClientCIDRs": [
    {
      "clientCIDR": "0.0.0.0/0",
      "serverAddress": "10.0.1.149:443"
    }
  ]
}
```

--------------------------------

### Rollout restart examples

Source: https://kubernetes.io/docs/reference/kubectl/generated/kubectl_rollout/kubectl_rollout_restart

Common usage patterns for restarting deployments and daemon sets using namespaces, resource names, or label selectors.

```bash
  # Restart all deployments in the test-namespace namespace
  kubectl rollout restart deployment -n test-namespace
  
  # Restart a deployment
  kubectl rollout restart deployment/nginx
  
  # Restart a daemon set
  kubectl rollout restart daemonset/abc
  
  # Restart deployments with the app=nginx label
  kubectl rollout restart deployment --selector=app=nginx
```

--------------------------------

### Verify Plugin Installation

Source: https://kubernetes.io/docs/tasks/tools/install-kubectl-windows

Command to confirm the plugin is correctly installed and accessible.

```bash
kubectl convert --help
```

--------------------------------

### Install and configure bash-completion

Source: https://kubernetes.io/docs/tasks/tools/install-kubectl-macos

Commands to install bash-completion v2 and source it in your profile.

```bash
brew install bash-completion@2
```

```bash
brew_etc="$(brew --prefix)/etc" && [[ -r "${brew_etc}/profile.d/bash_completion.sh" ]] && . "${brew_etc}/profile.d/bash_completion.sh"
```

--------------------------------

### Install kubectl with Macports

Source: https://kubernetes.io/docs/tasks/tools/install-kubectl-macos

Installs kubectl using the Macports package manager.

```bash
sudo port selfupdate
sudo port install kubectl
```

```bash
kubectl version --client
```

--------------------------------

### Create ConfigMap examples

Source: https://kubernetes.io/docs/reference/kubectl/generated/kubectl_create/kubectl_create_configmap

Common usage patterns for creating ConfigMaps from folders, specific files, literal values, and environment files.

```bash
  # Create a new config map named my-config based on folder bar
  kubectl create configmap my-config --from-file=path/to/bar
  
  # Create a new config map named my-config with specified keys instead of file basenames on disk
  kubectl create configmap my-config --from-file=key1=/path/to/bar/file1.txt --from-file=key2=/path/to/bar/file2.txt
  
  # Create a new config map named my-config with key1=config1 and key2=config2
  kubectl create configmap my-config --from-literal=key1=config1 --from-literal=key2=config2
  
  # Create a new config map named my-config from the key=value pairs in the file
  kubectl create configmap my-config --from-file=path/to/bar
  
  # Create a new config map named my-config from an env file
  kubectl create configmap my-config --from-env-file=path/to/foo.env --from-env-file=path/to/bar.env
```

--------------------------------

### Start Redis Pod and Service

Source: https://kubernetes.io/docs/tasks/_print

Deploys a single-instance Redis pod and its corresponding service to the cluster.

```bash
kubectl apply -f https://k8s.io/examples/application/job/redis/redis-pod.yaml
kubectl apply -f https://k8s.io/examples/application/job/redis/redis-service.yaml
```

--------------------------------

### Start Kubernetes Proxy

Source: https://kubernetes.io/docs/tasks/_print

Starts a local proxy to facilitate communication with the Kubernetes API server.

```bash
kubectl proxy
```

--------------------------------

### Start Hugo in Container

Source: https://kubernetes.io/docs/contribute/new-content/preview-locally

Starts the Hugo server within a Docker container.

```bash
# Run this in a terminal
make container-serve
```

--------------------------------

### Log Output Example

Source: https://kubernetes.io/docs/tutorials/configuration/_print

Example log output showing time-stamped messages.

```text
Thu Jan  4 14:11:36 UTC 2024 My preferred sport is football
Thu Jan  4 14:11:46 UTC 2024 My preferred sport is football
Thu Jan  4 14:11:56 UTC 2024 My preferred sport is football
Thu Jan  4 14:12:06 UTC 2024 My preferred sport is cricket
Thu Jan  4 14:12:16 UTC 2024 My preferred sport is cricket
```

--------------------------------

### kubeadm init phase addon all

Source: https://kubernetes.io/docs/reference/_print

Installs all required addons for passing conformance tests.

```APIDOC
## kubeadm init phase addon all

### Description
Install all the addons required for the Kubernetes cluster.

### Parameters
#### Options
- **--apiserver-advertise-address** (string) - Optional - The IP address the API Server will advertise it's listening on.
- **--apiserver-bind-port** (int32) - Optional - Port for the API Server to bind to (Default: 6443).
- **--config** (string) - Optional - Path to a kubeadm configuration file.
- **--control-plane-endpoint** (string) - Optional - Specify a stable IP address or DNS name for the control plane.
- **--dry-run** (boolean) - Optional - Don't apply any changes; just output what would be done.
- **--feature-gates** (string) - Optional - A set of key=value pairs that describe feature gates.
- **--image-repository** (string) - Optional - Choose a container registry to pull control plane images from (Default: "registry.k8s.io").
- **--kubeconfig** (string) - Optional - The kubeconfig file to use (Default: "/etc/kubernetes/admin.conf").
- **--kubernetes-version** (string) - Optional - Choose a specific Kubernetes version (Default: "stable-1").
- **--pod-network-cidr** (string) - Optional - Specify range of IP addresses for the pod network.
- **--service-cidr** (string) - Optional - Use alternative range of IP address for service VIPs (Default: "10.96.0.0/12").
- **--service-dns-domain** (string) - Optional - Use alternative domain for services (Default: "cluster.local").
- **--rootfs** (string) - Optional - The path to the 'real' host root filesystem.
```

--------------------------------

### Examples for generating control plane manifests

Source: https://kubernetes.io/docs/reference/setup-tools/kubeadm/kubeadm-init-phase

Common usage examples for generating control plane manifests, including using a configuration file.

```bash
  # Generates all static Pod manifest files for control plane components,
  # functionally equivalent to what is generated by kubeadm init.
  kubeadm init phase control-plane all
  
  # Generates all static Pod manifest files using options read from a configuration file.
  kubeadm init phase control-plane all --config config.yaml
```

--------------------------------

### Install kubectl bash completion on macOS

Source: https://kubernetes.io/docs/reference/_print

Use Homebrew to install bash-completion. If kubectl is installed via Homebrew, completion should work immediately. Otherwise, manually add the completion to the bash completion directory.

```bash
# Installing bash completion on macOS using homebrew
## If running Bash 3.2 included with macOS
brew install bash-completion
## or, if running Bash 4.1+
brew install bash-completion@2
## If kubectl is installed via homebrew, this should start working immediately
## If you've installed via other means, you may need add the completion to your completion directory
kubectl completion bash > $(brew --prefix)/etc/bash_completion.d/kubectl
```

--------------------------------

### Example Pod Listing

Source: https://kubernetes.io/docs/concepts/workloads/management

This output shows a single running pod managed by a deployment after scaling down.

```text
NAME                        READY     STATUS    RESTARTS   AGE
my-nginx-2035384211-j5fhi   1/1       Running   0          30m


```

--------------------------------

### ApplyConfiguration Example

Source: https://kubernetes.io/docs/reference/kubernetes-api/policy-resources/_print

Example of using ApplyConfiguration to set a field using CEL.

```APIDOC
### ApplyConfiguration Example

```cel
Object{
  spec: Object.spec{
    serviceAccountName: "example"
  }
}
```
```

--------------------------------

### RawExtension Example

Source: https://kubernetes.io/docs/reference/kubernetes-api/workload-resources/resource-claim-v1

Example demonstrating the usage of RawExtension for embedding arbitrary data.

```APIDOC
## RawExtension Usage Example

### Description
This example illustrates how `runtime.RawExtension` is used to embed arbitrary data, such as plugin-specific configurations, within Kubernetes objects.

### Internal Struct
```go
type MyAPIObject struct {
	runtime.TypeMeta `json:",inline"`
	MyPlugin runtime.Object `json:"myPlugin"`
}

type PluginA struct {
	AOption string `json:"aOption"`
}
```

### External Struct
```go
type MyAPIObject struct {
	runtime.TypeMeta `json:",inline"`
	MyPlugin runtime.RawExtension `json:"myPlugin"`
}

type PluginA struct {
	AOption string `json:"aOption"`
}
```

### On-Wire JSON Example
```json
{
	"kind":"MyAPIObject",
	"apiVersion":"v1",
	"myPlugin": {
		"kind":"PluginA",
		"aOption":"foo",
	}
}
```

### Explanation
1. **Decoding**: The `MyAPIObject` is first decoded from JSON or YAML into the external struct. This stores the raw JSON data within the `MyPlugin` field of type `runtime.RawExtension` without unpacking it.
2. **Conversion**: Subsequently, the data is copied into the internal struct. The `runtime` package's `DefaultScheme` handles the conversion, unpacking the JSON from `RawExtension` into the correct object type (e.g., `PluginA`) and storing it in the `Object` field of the internal struct.
```

--------------------------------

### Create a basic deployment

Source: https://kubernetes.io/docs/reference/generated/kubectl/kubectl

Use this command to create a deployment with a specified name and image.

```bash
kubectl create deployment my-dep --image=busybox

```

--------------------------------

### Create API objects from configuration files

Source: https://kubernetes.io/docs/contribute/style/write-new-topic

Demonstrate object creation by referencing the configuration file URL in a kubectl command.

```bash
kubectl create -f https://k8s.io/examples/pods/storage/gce-volume.yaml
```

--------------------------------

### Create a basic deployment

Source: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands

Use this command to create a deployment with a specified name and image.

```bash
kubectl create deployment my-dep --image=busybox
```

--------------------------------

### SelfSubjectAccessReview response example

Source: https://kubernetes.io/docs/reference/access-authn-authz/_print

Example of the status field returned by a SelfSubjectAccessReview query.

```yaml
apiVersion: authorization.k8s.io/v1
kind: SelfSubjectAccessReview
metadata:
  creationTimestamp: null
spec:
  resourceAttributes:
    group: apps
    resource: deployments
    namespace: dev
    verb: create
status:
  allowed: true
  denied: false
```

--------------------------------

### Example Controller-Manager CA Configuration

Source: https://kubernetes.io/docs/reference/access-authn-authz/_print

Example flags for configuring the kube-controller-manager with specific paths to the Kubernetes CA certificate and key files.

```bash
--cluster-signing-cert-file="/var/lib/kubernetes/ca.pem" --cluster-signing-key-file="/var/lib/kubernetes/ca-key.pem"
```

--------------------------------

### Service-scoped Pod A record example

Source: https://kubernetes.io/docs/concepts/services-networking/dns-pod-service

Example of a service-scoped DNS A record for a Pod.

```text
172-17-0-3.barista.cafe.svc.cluster.local

```

--------------------------------

### Example Service Description Output

Source: https://kubernetes.io/docs/tasks/access-application-cluster/_print

This is an example output from `kubectl describe services`. It shows details like the Service type, IP address, and LoadBalancer Ingress.

```text
Name:                     example-service
Namespace:                default
Labels:                   app=example
Annotations:              <none>
Selector:                 app=example
Type:                     LoadBalancer
IP Families:              <none>
IP:                       10.3.22.96
IPs:                      10.3.22.96
LoadBalancer Ingress:     192.0.2.89
Port:                     <unset>  8765/TCP
TargetPort:               9376/TCP
NodePort:                 <unset>  30593/TCP
Endpoints:                172.17.0.3:9376
Session Affinity:         None
External Traffic Policy:  Cluster
Events:                   <none>


```

--------------------------------

### Example: Create ExternalName Service

Source: https://kubernetes.io/docs/reference/kubectl/generated/kubectl_create/kubectl_create_service_externalname

This example demonstrates creating an ExternalName service named 'my-ns' that resolves to 'bar.com'.

```bash
kubectl create service externalname my-ns --external-name bar.com
```

--------------------------------

### Create a LoadBalancer service example

Source: https://kubernetes.io/docs/reference/kubectl/_print

Example command to create a new LoadBalancer service named my-lbs with TCP port mapping.

```bash
# Create a new LoadBalancer service named my-lbs
  kubectl create service loadbalancer my-lbs --tcp=5678:8080
```

--------------------------------

### kubectl create role examples

Source: https://kubernetes.io/docs/reference/kubectl/generated/kubectl_create/kubectl_create_role

Common usage patterns for creating roles with various resource and verb configurations.

```bash
  # Create a role named "pod-reader" that allows user to perform "get", "watch" and "list" on pods
  kubectl create role pod-reader --verb=get --verb=list --verb=watch --resource=pods
  
  # Create a role named "pod-reader" with ResourceName specified
  kubectl create role pod-reader --verb=get --resource=pods --resource-name=readablepod --resource-name=anotherpod
  
  # Create a role named "foo" with API Group specified
  kubectl create role foo --verb=get,list,watch --resource=rs.apps
  
  # Create a role named "foo" with SubResource specified
  kubectl create role foo --verb=get,list,watch --resource=pods,pods/status
```

--------------------------------

### Install AMQP Tools in Pod

Source: https://kubernetes.io/docs/tasks/_print

Install necessary packages inside the interactive shell to enable message queue interaction.

```bash
apt-get update && apt-get install -y curl ca-certificates amqp-tools python3 dnsutils
```

--------------------------------

### Create a Namespace

Source: https://kubernetes.io/docs/tasks/_print

Create a new namespace to isolate resources for this example. Ensure you have the necessary permissions.

```bash
kubectl create namespace quota-mem-cpu-example
```

--------------------------------

### Install Bash Completion on macOS

Source: https://kubernetes.io/docs/reference/kubectl/generated/_print

Installs bash-completion using homebrew. If kubectl is installed via homebrew, completion should work immediately. Otherwise, manually add the completion to the kubectl completion directory.

```bash
# Installing bash completion on macOS using homebrew
## If running Bash 3.2 included with macOS
brew install bash-completion
## or, if running Bash 4.1+
brew install bash-completion@2
## If kubectl is installed via homebrew, this should start working immediately
## If you've installed via other means, you may need add the completion to your completion directory
kubectl completion bash > $(brew --prefix)/etc/bash_completion.d/kubectl
```

--------------------------------

### Example Pod Manifest with Name

Source: https://kubernetes.io/docs/concepts/overview/working-with-objects/names

This is an example manifest for a Pod named 'nginx-demo'. Ensure names adhere to the specified constraints for the resource type.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx-demo
spec:
  containers:
  - name: nginx
    image: nginx:1.14.2
    ports:
    - containerPort: 80

```

--------------------------------

### Install bash completion on macOS

Source: https://kubernetes.io/docs/reference/kubectl/generated/kubectl_completion

Installs bash completion for macOS using homebrew. If kubectl is installed via homebrew, completion should work immediately. Otherwise, add the completion to your completion directory.

```bash
brew install bash-completion
brew install bash-completion@2
kubectl completion bash > $(brew --prefix)/etc/bash_completion.d/kubectl
```

--------------------------------

### Get nodes not running DaemonSet pods

Source: https://kubernetes.io/docs/tasks/manage-daemon/update-daemon-set

Identify nodes that have not scheduled DaemonSet pods by comparing `kubectl get nodes` with the output of `kubectl get pods`. This is useful for troubleshooting stuck rollouts.

```bash
kubectl get pods -l name=fluentd-elasticsearch -o wide -n kube-system

```

--------------------------------

### Example Pod output

Source: https://kubernetes.io/docs/tasks/manage-daemon/pods-some-nodes

Sample output showing Pods running on nodes labeled with SSD storage.

```text
NAME                              READY     STATUS    RESTARTS   AGE    IP      NODE
<daemonset-name><some-hash-01>    1/1       Running   0          13s    .....   example-node-1
<daemonset-name><some-hash-02>    1/1       Running   0          13s    .....   example-node-2
<daemonset-name><some-hash-03>    1/1       Running   0          5s     .....   example-node-3
```

--------------------------------

### Verify CNI plugin installation

Source: https://kubernetes.io/docs/tutorials/cluster-management/kubelet-standalone

Check the version of the installed bridge CNI plugin.

```bash
/opt/cni/bin/bridge --version
```

--------------------------------

### Examples of kuberc configuration

Source: https://kubernetes.io/docs/reference/kubectl/generated/kubectl_alpha/kubectl_alpha_kuberc_set

Common usage patterns for setting defaults and creating aliases.

```bash
  # Set default output format for 'get' command
  kubectl alpha kuberc set --section defaults --command get --option output=wide
  
  # Set default output format for a subcommand
  kubectl alpha kuberc set --section defaults --command "set env" --option output=yaml
  
  # Create an alias 'getn' for 'get' command with prepended 'nodes' resource
  kubectl alpha kuberc set --section aliases --name getn --command get --prependarg nodes --option output=wide
  
  # Create an alias 'runx' for 'run' command with appended arguments
  kubectl alpha kuberc set --section aliases --name runx --command run --option image=nginx --appendarg "--" --appendarg custom-arg1
  
  # Overwrite an existing default
  kubectl alpha kuberc set --section defaults --command get --option output=json --overwrite
```

--------------------------------

### IP Address Object Example

Source: https://kubernetes.io/docs/reference/_print

An example output showing IPAddress objects and their parent Service references.

```text
NAME              PARENTREF
2001:db8:1:2::1   services/default/kubernetes
2001:db8:1:2::a   services/kube-system/kube-dns
```

--------------------------------

### Service IP Address Example

Source: https://kubernetes.io/docs/reference/_print

An example output showing a Kubernetes service with its assigned ClusterIP.

```text
NAME         TYPE        CLUSTER-IP        EXTERNAL-IP   PORT(S)   AGE
kubernetes   ClusterIP   2001:db8:1:2::1   <none>        443/TCP   3d1h
```

--------------------------------

### Deployment List Output

Source: https://kubernetes.io/docs/concepts/workloads/controllers/deployment

Example output showing the status of Deployments.

```text
NAME               READY   UP-TO-DATE   AVAILABLE   AGE
nginx-deployment   3/3     3            3           36s
```

--------------------------------

### Apply Initial Deployment

Source: https://kubernetes.io/docs/tasks/manage-kubernetes-objects/update-api-object-kubectl-patch

Use this `kubectl` command to create the Deployment defined in the `application/deployment-retainkeys.yaml` file.

```bash
kubectl apply -f https://k8s.io/examples/application/deployment-retainkeys.yaml

```

--------------------------------

### Clean up installation files

Source: https://kubernetes.io/docs/tasks/tools/install-kubectl-linux

Remove the temporary binary and checksum files after successful installation.

```bash
rm kubectl-convert kubectl-convert.sha256
```

--------------------------------

### Install kubectl via yum

Source: https://kubernetes.io/docs/tasks/tools/install-kubectl-linux

Installs kubectl using the yum package manager.

```bash
sudo yum install -y kubectl
```

--------------------------------

### Example directory listing output

Source: https://kubernetes.io/docs/tutorials/security/seccomp

Expected output showing the available seccomp profile files.

```text
audit.json  fine-grained.json  violation.json
```

--------------------------------

### Create Service and Set Selector

Source: https://kubernetes.io/docs/reference/kubectl/generated/_print

This example demonstrates setting a selector on a Service before creating it, using a dry-run to pipe the output to 'kubectl set selector' and then to 'kubectl create'.

```bash
kubectl create service clusterip my-svc --clusterip="None" -o yaml --dry-run=client | kubectl set selector --local -f - 'environment=qa' -o yaml | kubectl create -f -
```

--------------------------------

### Cleanup Installation Files

Source: https://kubernetes.io/docs/tasks/tools/install-kubectl-windows

Commands to remove temporary installation files after verifying the plugin.

```bash
del kubectl-convert.exe
del kubectl-convert.exe.sha256
```

--------------------------------

### Start Kubernetes Proxy

Source: https://kubernetes.io/docs/tasks/administer-cluster/extended-resource-node

Run this command to start a proxy that allows easy access to the Kubernetes API server from your local machine.

```bash
kubectl proxy

```

--------------------------------

### Example output of kubectl describe

Source: https://kubernetes.io/docs/tasks/_print

Sample output showing the LoadBalancer Ingress field.

```text
Name:                     example-service
Namespace:                default
Labels:                   app=example
Annotations:              <none>
Selector:                 app=example
Type:                     LoadBalancer
IP Families:              <none>
IP:                       10.3.22.96
IPs:                      10.3.22.96
LoadBalancer Ingress:     192.0.2.89
Port:                     <unset>  8765/TCP
TargetPort:               9376/TCP
NodePort:                 <unset>  30593/TCP
Endpoints:                172.17.0.3:9376
Session Affinity:         None
External Traffic Policy:  Cluster
Events:                   <none>

```

--------------------------------

### Pod List Response Example

Source: https://kubernetes.io/docs/tasks/_print

Example JSON output returned when querying the pods endpoint.

```json
{
  "kind": "PodList",
  "apiVersion": "v1",
  "metadata": {
    "resourceVersion": "33074"
  },
  "items": [
    {
      "metadata": {
        "name": "kubernetes-bootcamp-2321272333-ix8pt",
        "generateName": "kubernetes-bootcamp-2321272333-",
        "namespace": "default",
        "uid": "ba21457c-6b1d-11e6-85f7-1ef9f1dab92b",
        "resourceVersion": "33003",
        "creationTimestamp": "2016-08-25T23:43:30Z",
        "labels": {
          "pod-template-hash": "2321272333",
          "run": "kubernetes-bootcamp"
        },
        ...
}
```

--------------------------------

### Create and Apply Pod

Source: https://kubernetes.io/docs/tasks/administer-cluster/_print

Create the Pod defined in the manifest and apply it to the 'default-cpu-example' namespace. This Pod will inherit default CPU requests and limits.

```bash
kubectl apply -f https://k8s.io/examples/admin/resource/cpu-defaults-pod.yaml --namespace=default-cpu-example
```

--------------------------------

### Start Hugo Server

Source: https://kubernetes.io/docs/contribute/style/content-organization

Use this command to start the Hugo server with automatic navigation to changed files.

```bash
hugo server --navigateToChanged
```

--------------------------------

### Start Temporary Redis Pod

Source: https://kubernetes.io/docs/tasks/job/fine-parallel-processing-work-queue

Start a temporary interactive pod to access the Redis CLI for queue management.

```bash
kubectl run -i --tty temp --image redis --command "/bin/sh"

```

--------------------------------

### Start Kubernetes API proxy

Source: https://kubernetes.io/docs/tasks/administer-cluster/extended-resource-node

Starts a local proxy to facilitate communication with the Kubernetes API server.

```bash
kubectl proxy
```

--------------------------------

### Watch API Response Example

Source: https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.35

Example JSON output returned when watching a service resource.

```json
{
	"type": "ADDED",
	"object": {
		"kind": "Service",
		"apiVersion": "v1",
		"metadata": {
			"name": "deployment-example",
			"namespace": "default",
			"selfLink": "/api/v1/namespaces/default/services/deployment-example",
			"uid": "93e5c731-9d30-11e6-9c54-42010a800148",
			"resourceVersion": "2205995",
			"creationTimestamp": "2016-10-28T17:04:24Z"
		},
		"spec": {
			"ports": [
				{
					"name": "http",
					"protocol": "TCP",
					"port": 80,
					"targetPort": 8080,
					"nodePort": 32417
				}
			],
			"selector": {
				"app": "nginx"
			},
			"clusterIP": "10.183.250.161",
			"type": "LoadBalancer",
			"sessionAffinity": "None"
		},
		"status": {
			"loadBalancer": {
				"ingress": [
					{
						"ip": "104.198.186.106"
					}
				]
			}
		}
	}
}
```

```json
{
	"type": "ADDED",
	"object": {
		"kind": "Service",
		"apiVersion": "v1",
		"metadata": {
			"name": "deployment-example",
			"namespace": "default",
			"selfLink": "/api/v1/namespaces/default/services/deployment-example",
			"uid": "93e5c731-9d30-11e6-9c54-42010a800148",
			"resourceVersion": "2205995",
			"creationTimestamp": "2016-10-28T17:04:24Z"
		},
		"spec": {
			"ports": [
				{
					"name": "http",
					"protocol": "TCP",
					"port": 80,
					"targetPort": 8080,
					"nodePort": 32417
				}
			],
			"selector": {
				"app": "nginx"
			},
			"clusterIP": "10.183.250.161",
			"type": "LoadBalancer",
			"sessionAffinity": "None"
		},
		"status": {
			"loadBalancer": {
				"ingress": [
					{
						"ip": "104.198.186.106"
					}
				]
			}
		}
	}
}
```

--------------------------------

### Install CNI Plugins

Source: https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/install-kubeadm

Download and install the CNI plugins required for pod networking.

```bash
CNI_PLUGINS_VERSION="v1.3.0"
ARCH="amd64"
DEST="/opt/cni/bin"
sudo mkdir -p "$DEST"
curl -L "https://github.com/containernetworking/plugins/releases/download/${CNI_PLUGINS_VERSION}/cni-plugins-linux-${ARCH}-${CNI_PLUGINS_VERSION}.tgz" | sudo tar -C "$DEST" -xz
```

--------------------------------

### Install amqp-tools and other utilities

Source: https://kubernetes.io/docs/tasks/job/coarse-parallel-processing-work-queue

Installs necessary tools within the temporary pod, including curl, amqp-tools, python3, and dnsutils, for interacting with the message queue and network services.

```bash
apt-get update && apt-get install -y curl ca-certificates amqp-tools python3 dnsutils
```

--------------------------------

### Create a target application Pod

Source: https://kubernetes.io/docs/tasks/debug/debug-application/debug-running-pod

Sets up a simple application Pod to be copied for debugging.

```bash
kubectl run myapp --image=busybox:1.28 --restart=Never -- sleep 1d
```

--------------------------------

### Example Kubernetes yum Repository Configuration

Source: https://kubernetes.io/docs/tasks/administer-cluster/_print

This is an example configuration that indicates you are using the community-owned Kubernetes package repositories.

```ini
[kubernetes]
name=Kubernetes
baseurl=https://pkgs.k8s.io/core:/stable:/v1.34/rpm/
enabled=1
gpgcheck=1
gpgkey=https://pkgs.k8s.io/core:/stable:/v1.34/rpm/repodata/repomd.xml.key
exclude=kubelet kubeadm kubectl
```

--------------------------------

### kubeadm join phase kubelet-start

Source: https://kubernetes.io/docs/reference/setup-tools/kubeadm/kubeadm-join-phase

Writes KubeletConfiguration and environment files, then restarts kubelet.

```APIDOC
## POST /kubeadm/join/phase/kubelet-start

### Description
Writes KubeletConfiguration and an environment file with node specific kubelet settings, and then (re)starts kubelet.

### Method
POST

### Endpoint
/kubeadm/join/phase/kubelet-start

### Parameters
#### Query Parameters
- **api-server-endpoint** (string) - Required - The API server endpoint for the cluster.
- **config** (string) - Optional - Path to a kubeadm configuration file.
- **cri-socket** (string) - Optional - Path to the CRI socket to connect. If empty kubeadm will try to auto-detect this value; use this option only if you have more than one CRI installed or if you have non-standard CRI socket.
- **discovery-file** (string) - Optional - For file-based discovery, a file or URL from which to load cluster information.
- **discovery-token** (string) - Optional - For token-based discovery, the token used to validate cluster information fetched from the API server.
- **discovery-token-ca-cert-hash** (strings) - Optional - For token-based discovery, validate that the root CA public key matches this hash (format: "<type>:<value>").
- **discovery-token-unsafe-skip-ca-verification** (boolean) - Optional - For token-based discovery, allow joining without --discovery-token-ca-cert-hash pinning.
- **dry-run** (boolean) - Optional - Don't apply any changes; just output what would be done.
- **help** (boolean) - Optional - help for kubelet-start
- **node-name** (string) - Optional - Specify the node name.
- **patches** (string) - Optional - Path to a directory that contains files named "target[suffix][+patchtype].extension".
- **tls-bootstrap-token** (string) - Optional - Specify the token used to temporarily authenticate with the Kubernetes Control Plane while joining the node.
- **token** (string) - Optional - Use this token for both discovery-token and tls-bootstrap-token when those values are not provided.
- **rootfs** (string) - Optional - The path to the 'real' host root filesystem. This will cause kubeadm to chroot into the provided path.

### Request Example
```json
{
  "api-server-endpoint": "https://<your-api-server-endpoint>:6443",
  "config": "/path/to/kubeadm.yaml",
  "cri-socket": "/var/run/containerd/containerd.sock",
  "discovery-file": "/path/to/cluster-info.yaml",
  "discovery-token": "your-discovery-token",
  "discovery-token-ca-cert-hash": "sha256:your-ca-cert-hash",
  "node-name": "your-node-name",
  "patches": "/path/to/patches/",
  "tls-bootstrap-token": "your-tls-bootstrap-token",
  "token": "your-join-token"
}
```

### Response
#### Success Response (200)
- **message** (string) - A success message indicating kubelet has been configured and restarted.

#### Response Example
```json
{
  "message": "Kubelet configured and restarted successfully."
}
```
```

--------------------------------

### Enable and start CRI-O service

Source: https://kubernetes.io/docs/tutorials/cluster-management/kubelet-standalone

Reload systemd daemon and start the crio service.

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now crio.service
```

--------------------------------

### Set up encrypted swap

Source: https://kubernetes.io/docs/tutorials/cluster-management/provision-swap-memory

Uses cryptsetup to create an encrypted swap device backed by a 4GiB file.

```bash
# Allocate storage and restrict access
fallocate --length 4GiB /swapfile
chmod 600 /swapfile

# Create an encrypted device backed by the allocated storage
cryptsetup --type plain --cipher aes-xts-plain64 --key-size 256 -d /dev/urandom open /swapfile cryptswap

# Format the swap space
mkswap /dev/mapper/cryptswap

# Activate the swap space for paging
swapon /dev/mapper/cryptswap
```

--------------------------------

### Example Env File Syntax

Source: https://kubernetes.io/docs/tasks/inject-data-application/_print

This is an example of a valid Kubernetes env file format, using single quotes for literal values and supporting multi-line values.

```text
MY_VAR='my-literal-value'
```

--------------------------------

### Locally Test Documentation

Source: https://kubernetes.io/docs/contribute/generate-ref-docs/kubectl

Build and serve the Kubernetes documentation locally from your <web-base> directory. Ensure git submodules are updated if necessary.

```bash
cd <web-base>
git submodule update --init --recursive --depth 1 # if not already done
make container-serve
```

--------------------------------

### Authentication Flag Examples

Source: https://kubernetes.io/docs/reference/_print

Examples of flags used for client certificates, bearer tokens, and basic authentication.

```bash
    Client-certificate flags:
    --client-certificate=certfile --client-key=keyfile
    
    Bearer token flags:
    --token=bearer_token
    
    Basic auth flags:
    --username=basic_user --password=basic_password
```

--------------------------------

### kubectl edit Examples

Source: https://kubernetes.io/docs/reference/_print

Illustrative examples of using the kubectl edit command with various options.

```APIDOC
## Examples

# Edit the service named 'registry'
```bash
kubectl edit svc/registry
```

# Use an alternative editor (nano)
```bash
KUBE_EDITOR="nano" kubectl edit svc/registry
```

# Edit the job 'myjob' in JSON using the v1 API format
```bash
kubectl edit job.v1.batch/myjob -o json
```

# Edit the deployment 'mydeployment' in YAML and save the modified config in its annotation
```bash
kubectl edit deployment/mydeployment -o yaml --save-config
```

# Edit the 'status' subresource for the 'mydeployment' deployment
```bash
kubectl edit deployment mydeployment --subresource='status'
```
```

--------------------------------

### kubectl debug usage examples

Source: https://kubernetes.io/docs/reference/kubectl/generated/kubectl_debug/_print

Various examples for creating interactive debugging sessions, copying pods, and debugging nodes.

```bash
  # Create an interactive debugging session in pod mypod and immediately attach to it.
  kubectl debug mypod -it --image=busybox
  
  # Create an interactive debugging session for the pod in the file pod.yaml and immediately attach to it.
  # (requires the EphemeralContainers feature to be enabled in the cluster)
  kubectl debug -f pod.yaml -it --image=busybox
  
  # Create a debug container named debugger using a custom automated debugging image.
  kubectl debug --image=myproj/debug-tools -c debugger mypod
  
  # Create a copy of mypod adding a debug container and attach to it
  kubectl debug mypod -it --image=busybox --copy-to=my-debugger
  
  # Create a copy of mypod changing the command of mycontainer
  kubectl debug mypod -it --copy-to=my-debugger --container=mycontainer -- sh
  
  # Create a copy of mypod changing all container images to busybox
  kubectl debug mypod --copy-to=my-debugger --set-image=*=busybox
  
  # Create a copy of mypod adding a debug container and changing container images
  kubectl debug mypod -it --copy-to=my-debugger --image=debian --set-image=app=app:debug,sidecar=sidecar:debug
  
  # Create an interactive debugging session on a node and immediately attach to it.
  # The container will run in the host namespaces and the host's filesystem will be mounted at /host
  kubectl debug node/mynode -it --image=busybox
```

--------------------------------

### Process tree output

Source: https://kubernetes.io/docs/tutorials/stateful-application/_print

Example output showing the entry point process and its children.

```text
UID        PID  PPID  C STIME TTY          TIME CMD
zookeep+     1     0  0 15:03 ?        00:00:00 sh -c zkGenConfig.sh && zkServer.sh start-foreground
zookeep+    27     1  0 15:03 ?        00:00:03 /usr/lib/jvm/java-8-openjdk-amd64/bin/java -Dzookeeper.log.dir=/var/log/zookeeper -Dzookeeper.root.logger=INFO,CONSOLE -cp /usr/bin/../build/classes:/usr/bin/../build/lib/*.jar:/usr/bin/../share/zookeeper/zookeeper-3.4.9.jar:/usr/bin/../share/zookeeper/slf4j-log4j12-1.6.1.jar:/usr/bin/../share/zookeeper/slf4j-api-1.6.1.jar:/usr/bin/../share/zookeeper/netty-3.10.5.Final.jar:/usr/bin/../share/zookeeper/log4j-1.2.16.jar:/usr/bin/../share/zookeeper/jline-0.9.94.jar:/usr/bin/../src/java/lib/*.jar:/usr/bin/../etc/zookeeper: -Xmx2G -Xms2G -Dcom.sun.management.jmxremote -Dcom.sun.management.jmxremote.local.only=false org.apache.zookeeper.server.quorum.QuorumPeerMain /usr/bin/../etc/zookeeper/zoo.cfg
```

--------------------------------

### Example Pod with Container Resource Specifications

Source: https://kubernetes.io/docs/concepts/configuration/_print

This example demonstrates how to define resource requests and limits for CPU and memory for individual containers within a Pod. Ensure the PodLevelResources feature gate is enabled for Pod-level resource specification.

```yaml
---
apiVersion: v1
kind: Pod
metadata:
  name: frontend
spec:
  containers:
  - name: app
    image: images.my-company.example/app:v4
    resources:
      requests:
        memory: "64Mi"
        cpu: "250m"
      limits:
        memory: "128Mi"
        cpu: "500m"
  - name: log-aggregator
    image: images.my-company.example/log-aggregator:v6
    resources:
      requests:
        memory: "64Mi"
        cpu: "250m"
      limits:
        memory: "128Mi"
        cpu: "500m"

```

--------------------------------

### Create Namespace for CPU Example

Source: https://kubernetes.io/docs/tasks/configure-pod-container/assign-cpu-resource

Creates a dedicated Kubernetes namespace named 'cpu-example' to isolate resources created during this tutorial. This helps in organizing and cleaning up resources.

```bash
kubectl create namespace cpu-example

```

--------------------------------

### Probe Warning Event Example

Source: https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-probes

Example of a ProbeWarning event triggered by excessive redirects.

```text
Events:
  Type     Reason        Age                     From               Message
  ----     ------        ----                    ----               -------
  Normal   Scheduled     29m                     default-scheduler  Successfully assigned default/httpbin-7b8bc9cb85-bjzwn to daocloud
  Normal   Pulling       29m                     kubelet            Pulling image "docker.io/kennethreitz/httpbin"
  Normal   Pulled        24m                     kubelet            Successfully pulled image "docker.io/kennethreitz/httpbin" in 5m12.402735213s
  Normal   Created       24m                     kubelet            Created container httpbin
  Normal   Started       24m                     kubelet            Started container httpbin
 Warning  ProbeWarning  4m11s (x1197 over 24m)  kubelet            Readiness probe warning: Probe terminated redirects
```

--------------------------------

### Create a job examples

Source: https://kubernetes.io/docs/reference/kubectl/generated/kubectl_create/_print

Common usage patterns for creating jobs, including running specific commands and creating jobs from existing cron jobs.

```bash
  # Create a job
  kubectl create job my-job --image=busybox
  
  # Create a job with a command
  kubectl create job my-job --image=busybox -- date
  
  # Create a job from a cron job named "a-cronjob"
  kubectl create job test-job --from=cronjob/a-cronjob
```

--------------------------------

### Literal ConfigMap output example

Source: https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap

Example output for a ConfigMap created from literal values.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  creationTimestamp: 2022-02-18T19:14:38Z
  name: special-config
  namespace: default
  resourceVersion: "651"
  uid: dadce046-d673-11e5-8cd0-68f728db1985
data:
  special.how: very
  special.type: charm
```

--------------------------------

### View Help for a Specific Init Phase

Source: https://kubernetes.io/docs/reference/setup-tools/kubeadm/_print

Use `kubeadm init phase <phase> <sub-phase> --help` to view available options for a specific phase and its sub-phases. This is useful for understanding phase-specific flags.

```bash
sudo kubeadm init phase control-plane controller-manager --help
```

```bash
sudo kubeadm init phase control-plane --help
```

--------------------------------

### Enable and Start Kubelet Service

Source: https://kubernetes.io/docs/tutorials/cluster-management/_print

Reloads the systemd daemon, then enables and starts the Kubelet service. This ensures Kubelet runs on boot and is active.

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now kubelet.service
```

--------------------------------

### Node Drain Output Example

Source: https://kubernetes.io/docs/tasks/administer-cluster/kubeadm/upgrading-windows-nodes

Example output observed after successfully draining a node.

```text
node/ip-172-31-85-18 cordoned
node/ip-172-31-85-18 drained
```

--------------------------------

### JSONPatch Example

Source: https://kubernetes.io/docs/reference/kubernetes-api/policy-resources/_print

Example of using JSONPatch to conditionally modify a value using CEL.

```APIDOC
### JSONPatch Example

```cel
[
  JSONPatch{op: "test", path: "/spec/example", value: "Red"},
  JSONPatch{op: "replace", path: "/spec/example", value: "Green"}
]
```
```

--------------------------------

### Initiate dual-stack control plane

Source: https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/dual-stack-support

Run the initialization command using the provided configuration file.

```bash
kubeadm init --config=kubeadm-config.yaml
```

--------------------------------

### Create a Namespace

Source: https://kubernetes.io/docs/tasks/configure-pod-container/quality-service-pod

Isolate resources for the tutorial by creating a dedicated namespace.

```bash
kubectl create namespace qos-example
```

--------------------------------

### Examples of requesting service account tokens

Source: https://kubernetes.io/docs/reference/kubectl/generated/kubectl_create/kubectl_create_token

Various usage examples for requesting tokens with custom configurations like namespaces, durations, audiences, and object bindings.

```bash
  # Request a token to authenticate to the kube-apiserver as the service account "myapp" in the current namespace
  kubectl create token myapp
  
  # Request a token for a service account in a custom namespace
  kubectl create token myapp --namespace myns
  
  # Request a token with a custom expiration
  kubectl create token myapp --duration 10m
  
  # Request a token with a custom audience
  kubectl create token myapp --audience https://example.com
  
  # Request a token bound to an instance of a Secret object
  kubectl create token myapp --bound-object-kind Secret --bound-object-name mysecret
  
  # Request a token bound to an instance of a Secret object with a specific UID
  kubectl create token myapp --bound-object-kind Secret --bound-object-name mysecret --bound-object-uid 0d4691ed-659b-4935-a832-355f77ee47cc
```

--------------------------------

### Example Certificate Content

Source: https://kubernetes.io/docs/reference/access-authn-authz/certificate-signing-requests

This is an example of a PEM-encoded certificate that can be used in the status.certificate field of a CSR.

```text
-----BEGIN CERTIFICATE-----
MIIDgjCCAmqgAwIBAgIUC1N1EJ4Qnsd322BhDPRwmg3b/oAwDQYJKoZIhvcNAQEL
BQAwXDELMAkGA1UEBhMCeHgxCjAIBgNVBAgMAXgxCjAIBgNVBAcMAXgxCjAIBgNV
BAoMAXgxCjAIBgNVBAsMAXgxCzAJBgNVBAMMAmNhMRAwDgYJKoZIhvcNAQkBFgF4
MB4XDTIwMDcwNjIyMDcwMFoXDTI1MDcwNTIyMDcwMFowNzEVMBMGA1UEChMMc3lz
dGVtOm5vZGVzMR4wHAYDVQQDExVzeXN0ZW06bm9kZToxMjcuMC4wLjEwggEiMA0G
CSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDne5X2eQ1JcLZkKvhzCR4Hxl9+ZmU3
+e1zfOywLdoQxrPi+o4hVsUH3q0y52BMa7u1yehHDRSaq9u62cmi5ekgXhXHzGmm
kmW5n0itRECv3SFsSm2DSghRKf0mm6iTYHWDHzUXKdm9lPPWoSOxoR5oqOsm3JEh
Q7Et13wrvTJqBMJo1GTwQuF+HYOku0NF/DLqbZIcpI08yQKyrBgYz2uO51/oNp8a
sTCsV4OUfyHhx2BBLUo4g4SptHFySTBwlpRWBnSjZPOhmN74JcpTLB4J5f4iEeA7
2QytZfADckG4wVkhH3C2EJUmRtFIBVirwDn39GXkSGlnvnMgF3uLZ6zNAgMBAAGj
YTBfMA4GA1UdDwEB/wQEAwIFoDATBgNVHSUEDDAKBggrBgEFBQcDAjAMBgNVHRMB
Af8EAjAAMB0GA1UdDgQWBBTREl2hW54lkQBDeVCcd2f2VSlB1DALBgNVHREEBDAC
ggAwDQYJKoZIhvcNAQELBQADggEBABpZjuIKTq8pCaX8dMEGPWtAykgLsTcD2jYr
L0/TCrqmuaaliUa42jQTt2OVsVP/L8ofFunj/KjpQU0bvKJPLMRKtmxbhXuQCQi1
qCRkp8o93mHvEz3mTUN+D1cfQ2fpsBENLnpS0F4G/JyY2Vrh19/X8+mImMEK5eOy
o0BMby7byUj98WmcUvNCiXbC6F45QTmkwEhMqWns0JZQY+/XeDhEcg+lJvz9Eyo2
aGgPsye1o3DpyXnyfJWAWMhOz7cikS5X2adesbgI86PhEHBXPIJ1v13ZdfCExmdd
M1fLPhLyR54fGaY+7/X8P9AZzPefAkwizeXwe9ii6/a08vWoiE4=
-----END CERTIFICATE-----
```

--------------------------------

### Get Resource Documentation with kubectl explain

Source: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands

Use 'kubectl explain' to retrieve documentation for Kubernetes resources. Specify the resource name to get general information, or resource.fieldName to get details about a specific field. The --recursive flag can be used to display all fields.

```bash
kubectl explain pods
```

```bash
kubectl explain pods.spec.containers
```

--------------------------------

### Set up Local Workspace and GOPATH

Source: https://kubernetes.io/docs/contribute/generate-ref-docs/kubernetes-api

Create a local workspace directory and export the GOPATH environment variable. This is a prerequisite for cloning and building Go-related projects.

```bash
mkdir -p $HOME/<workspace>

export GOPATH=$HOME/<workspace>
```

--------------------------------

### Get CertificateSigningRequest API

Source: https://kubernetes.io/docs/reference/kubernetes-api/_print

HTTP GET request to retrieve a specific CertificateSigningRequest by its name.

```http
GET /apis/certificates.k8s.io/v1/certificatesigningrequests/{name}
```

--------------------------------

### Kubeadm Configuration File Example

Source: https://kubernetes.io/docs/reference/_print

A kubeadm configuration file can contain multiple configuration types separated by '---'. This example shows common types for init and cluster configuration.

```yaml
apiVersion: kubeadm.k8s.io/v1beta3
kind: InitConfiguration

apiVersion: kubeadm.k8s.io/v1beta3
kind: ClusterConfiguration

apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration

apiVersion: kubeproxy.config.k8s.io/v1alpha1
kind: KubeProxyConfiguration

apiVersion: kubeadm.k8s.io/v1beta3
kind: JoinConfiguration


```

--------------------------------

### Install and execute a kubectl plugin

Source: https://kubernetes.io/docs/tasks/extend-kubectl/kubectl-plugins

Commands to make a plugin executable, move it to the PATH, and invoke it via kubectl.

```bash
sudo chmod +x ./kubectl-foo
```

```bash
sudo mv ./kubectl-foo /usr/local/bin
```

```bash
kubectl foo
```

```bash
I am a plugin named kubectl-foo
```

```bash
kubectl foo version
```

```bash
1.0.0
```

```bash
export KUBECONFIG=~/.kube/config
kubectl foo config
```

```bash
/home/<user>/.kube/config
```

```bash
KUBECONFIG=/etc/kube/config kubectl foo config
```

```bash
/etc/kube/config
```

--------------------------------

### Example docker-compose.yml

Source: https://kubernetes.io/docs/tasks/_print

This is an example docker-compose.yml file used for demonstrating the Kompose conversion process. It defines Redis services and a web application.

```yaml
services:

  redis-leader:
    container_name: redis-leader
    image: redis
    ports:
      - "6379"

  redis-replica:
    container_name: redis-replica
    image: redis
    ports:
      - "6379"
    command: redis-server --replicaof redis-leader 6379 --dir /tmp

  web:
    container_name: web
    image: quay.io/kompose/web
    ports:
      - "8080:8080"
    environment:
      - GET_HOSTS_FROM=dns
    labels:
      kompose.service.type: LoadBalancer

```

--------------------------------

### ReplicationController Example for Nginx

Source: https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.35

This example demonstrates how to configure a ReplicationController to ensure 3 Nginx instances are running. Note that Deployments are often recommended over ReplicationControllers.

```yaml
apiVersion: v1
kind: ReplicationController
metadata:
  # Unique key of the ReplicationController instance
  name: replicationcontroller-example
spec:
  # 3 Pods should exist at all times.
  replicas: 3
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      # Run the nginx image
      - name: nginx
        image: nginx:1.14
```

--------------------------------

### Example ID Command Output

Source: https://kubernetes.io/docs/tasks/configure-pod-container/_print

Example output from the 'id' command, displaying user ID, group ID, and supplemental groups.

```text
uid=1000 gid=3000 groups=2000,3000,4000

```

--------------------------------

### Download Sample Configuration Files

Source: https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap

Download sample configuration files using wget to populate a local directory. These files will be used to create a ConfigMap.

```bash
# Download the sample files into `configure-pod-container/configmap/` directory
wget https://kubernetes.io/examples/configmap/game.properties -O configure-pod-container/configmap/game.properties
wget https://kubernetes.io/examples/configmap/ui.properties -O configure-pod-container/configmap/ui.properties

```

--------------------------------

### Create initial ConfigMap

Source: https://kubernetes.io/docs/tutorials/configuration/_print

Creates a ConfigMap named example-redis-config with an empty redis-config key.

```bash
cat <<EOF >./example-redis-config.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: example-redis-config
data:
  redis-config: ""
EOF

```

--------------------------------

### Structural schema example

Source: https://kubernetes.io/docs/tasks/_print

A valid structural schema corresponding to the non-structural example 3.

```yaml
type: object
description: "foo bar object"
properties:
  foo:
    type: string
    pattern: "abc"
  bar:
    type: integer
  metadata:
    type: object
    properties:
      name:
        type: string
        pattern: "^a"
anyOf:
- properties:
    bar:
      minimum: 42
  required: ["bar"]
```

--------------------------------

### Create a Kubernetes Namespace

Source: https://kubernetes.io/docs/reference/_print

Use this command to create a new namespace named 'examplens' if it does not already exist. This is often a prerequisite for organizing resources.

```bash
kubectl create namespace examplens
```

--------------------------------

### DaemonSet deletion response examples

Source: https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.35

Example outputs and response bodies returned after a successful deletion request.

```text
daemonset "daemonset-example" deleted
```

```json
{
  "kind": "Status",
  "apiVersion": "v1",
  "metadata": {},
  "status": "Success",
  "code": 200
}
```

--------------------------------

### GET /api/v1/nodes/{name}/proxy

Source: https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.35

Connect GET requests to the proxy of a specific Node.

```APIDOC
## GET /api/v1/nodes/{name}/proxy

### Description
Connect GET requests to proxy of Node.

### Method
GET

### Endpoint
/api/v1/nodes/{name}/proxy

### Parameters
#### Path Parameters
- **name** (string) - Required - name of the NodeProxyOptions

#### Query Parameters
- **path** (string) - Optional - Path is the URL path to use for the current proxy request to node.

### Response
#### Success Response (200)
- **string** - OK
```

--------------------------------

### Connect to MySQL instance

Source: https://kubernetes.io/docs/tasks/_print

Use a temporary Pod to run a MySQL client and connect to the database service.

```bash
kubectl run -it --rm --image=mysql:9 --restart=Never mysql-client -- mysql -h mysql -ppassword
```

--------------------------------

### Verify kubectl convert plugin installation

Source: https://kubernetes.io/docs/tasks/tools/install-kubectl-macos

Run this command to confirm that the kubectl convert plugin has been successfully installed and is accessible.

```bash
kubectl convert --help

```

--------------------------------

### API Version Response Example

Source: https://kubernetes.io/docs/tasks/_print

Example JSON output returned when querying the API versions endpoint.

```json
{
  "kind": "APIVersions",
  "versions": [
    "v1"
  ],
  "serverAddressByClientCIDRs": [
    {
      "clientCIDR": "0.0.0.0/0",
      "serverAddress": "10.0.2.15:8443"
    }
  ]
}
```

--------------------------------

### Create an object from a URL with editing

Source: https://kubernetes.io/docs/tasks/manage-kubernetes-objects/imperative-config

Downloads a configuration from a URL and opens it in an editor before creating the object.

```bash
kubectl create -f <url> --edit
```

--------------------------------

### Install kubectl on Debian/Ubuntu

Source: https://kubernetes.io/docs/tasks/tools/_print

Installs kubectl on Debian-based systems. Ensure apt-transport-https and ca-certificates are installed first. The Kubernetes signing key is downloaded and added to the system's keyring, and the Kubernetes apt repository is configured.

```bash
sudo apt-get install -y apt-transport-https ca-certificates curl gnupg
```

```bash
curl -fsSL https://pkgs.k8s.io/core:/stable:/v1.35/deb/Release.key | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg
sudo chmod 644 /etc/apt/keyrings/kubernetes-apt-keyring.gpg
```

```bash
echo 'deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/v1.35/deb/ /' | sudo tee /etc/apt/sources.list.d/kubernetes.list
sudo chmod 644 /etc/apt/sources.list.d/kubernetes.list
```

```bash
sudo apt-get update
sudo apt-get install -y kubectl
```

--------------------------------

### Install bash completion on Linux

Source: https://kubernetes.io/docs/reference/kubectl/generated/kubectl_completion

Installs bash completion on Linux by first ensuring the 'bash-completion' package is installed. It then loads the completion code into the current shell and optionally writes it to a file for persistent sourcing from .bash_profile.

```bash
source <(kubectl completion bash)
kubectl completion bash > ~/.kube/completion.bash.inc
printf "
# kubectl shell completion
source '$HOME/.kube/completion.bash.inc'
" >> $HOME/.bash_profile
source $HOME/.bash_profile
```

--------------------------------

### Create a Basic Job with Kubectl

Source: https://kubernetes.io/docs/reference/_print

This example demonstrates how to create a simple Kubernetes job named 'my-job' using the 'busybox' image.

```bash
kubectl create job my-job --image=busybox
```

--------------------------------

### Install kubectl via package managers

Source: https://kubernetes.io/docs/tasks/_print

Install the Kubernetes CLI using common Windows package managers.

```bash
choco install kubernetes-cli
```

```bash
scoop install kubectl
```

```bash
winget install -e --id Kubernetes.kubectl
```

--------------------------------

### Create Namespace for Memory Example

Source: https://kubernetes.io/docs/tasks/configure-pod-container/assign-memory-resource

Creates a dedicated namespace named 'mem-example' to isolate resources for this exercise.

```bash
kubectl create namespace mem-example

```

--------------------------------

### Verify bash-completion installation

Source: https://kubernetes.io/docs/tasks/tools/install-kubectl-linux

Check if the bash-completion package is installed by testing for the existence of the _init_completion function.

```bash
type _init_completion
```

--------------------------------

### Example kubectl version output

Source: https://kubernetes.io/docs/tasks/debug/_print

This is an example of the output you should see when checking your kubectl version. It displays client and server versions, Git information, build date, and platform details.

```text
Client Version: version.Info{Major:"1", Minor:"27", GitVersion:"v1.27.4",GitCommit:"fa3d7990104d7c1f16943a67f11b154b71f6a132", GitTreeState:"clean",BuildDate:"2023-07-19T12:20:54Z", GoVersion:"go1.20.6", Compiler:"gc", Platform:"linux/amd64"}
Kustomize Version: v5.0.1
Server Version: version.Info{Major:"1", Minor:"27", GitVersion:"v1.27.3",GitCommit:"25b4e43193bcda6c7328a6d147b1fb73a33f1598", GitTreeState:"clean",BuildDate:"2023-06-14T09:47:40Z", GoVersion:"go1.20.5", Compiler:"gc", Platform:"linux/amd64"}


```

--------------------------------

### Example Kubernetes YUM Repository Configuration

Source: https://kubernetes.io/docs/tasks/administer-cluster/kubeadm/change-package-repository

This is an example of a Kubernetes yum repository configuration. Verify the baseurl points to pkgs.k8s.io.

```ini
[kubernetes]
name=Kubernetes
baseurl=https://pkgs.k8s.io/core:/stable:/v1.34/rpm/
enabled=1
gpgcheck=1
gpgkey=https://pkgs.k8s.io/core:/stable:/v1.34/rpm/repodata/repomd.xml.key
exclude=kubelet kubeadm kubectl

```

--------------------------------

### Start Minikube with increased resources

Source: https://kubernetes.io/docs/tutorials/stateful-application/cassandra

Start Minikube with increased memory and CPU to avoid resource errors during the tutorial. This configuration is necessary for running resource-intensive applications like Cassandra.

```bash
minikube start --memory 5120 --cpus=4

```

--------------------------------

### Install kubectl via Homebrew

Source: https://kubernetes.io/docs/tasks/tools/install-kubectl-linux

Installs kubectl using the Homebrew package manager on Linux.

```bash
brew install kubectl
kubectl version --client
```

--------------------------------

### Use the minikube context

Source: https://kubernetes.io/docs/reference/kubectl/generated/kubectl_config/_print

Example of setting the current context to the minikube cluster.

```bash
# Use the context for the minikube cluster
kubectl config use-context minikube
```

--------------------------------

### Prepare Node with kubeadm and kubelet

Source: https://kubernetes.io/docs/tasks/administer-cluster/kubeadm/_print

Run this script to install kubeadm and kubelet on the node. Specify the desired Kubernetes version using the -KubernetesVersion flag (e.g., v1.35.0).

```powershell
.\PrepareNode.ps1 -KubernetesVersion v1.35.0
```

--------------------------------

### Update zypper and install kubectl

Source: https://kubernetes.io/docs/tasks/tools/install-kubectl-linux

Updates the zypper repository index and installs the kubectl package.

```bash
sudo zypper update
```

```bash
sudo zypper install -y kubectl
```

--------------------------------

### Example URL structure for a topic

Source: https://kubernetes.io/docs/contribute/style/write-new-topic

This is an example of how a topic's URL is structured on the Kubernetes website, incorporating the directory path and filename.

```url
/docs/tasks/extend-kubernetes/http-proxy-access-api/

```

--------------------------------

### Install kubectl via apt

Source: https://kubernetes.io/docs/tasks/tools/install-kubectl-linux

Updates the package index and installs kubectl on Debian-based systems.

```bash
sudo apt-get update
sudo apt-get install -y kubectl
```

--------------------------------

### Create and install a multi-level subcommand plugin

Source: https://kubernetes.io/docs/tasks/_print

Demonstrates creating a plugin named `kubectl-foo-bar-baz` that handles `kubectl foo bar baz` commands. The script echoes the first argument it receives.

```bash
# create a plugin
echo -e '#!/bin/bash\n\necho "My first command-line argument was $1"' > kubectl-foo-bar-baz
sudo chmod +x ./kubectl-foo-bar-baz

# "install" your plugin by moving it to a directory in your $PATH
sudo mv ./kubectl-foo-bar-baz /usr/local/bin

```

--------------------------------

### Install kubectl via package managers

Source: https://kubernetes.io/docs/tasks/tools/install-kubectl-windows

Installs kubectl using Chocolatey, Scoop, or winget.

```bash
choco install kubernetes-cli
```

```bash
scoop install kubectl
```

```bash
winget install -e --id Kubernetes.kubectl
```

--------------------------------

### Create and scale a deployment

Source: https://kubernetes.io/docs/tasks/debug/debug-application/debug-service

Commands to set up a test deployment and scale it to multiple replicas.

```bash
kubectl create deployment hostnames --image=registry.k8s.io/serve_hostname
```

```text
deployment.apps/hostnames created
```

```bash
kubectl scale deployment hostnames --replicas=3
```

```text
deployment.apps/hostnames scaled
```

--------------------------------

### Install Kubernetes apt dependencies

Source: https://kubernetes.io/docs/tasks/tools/install-kubectl-linux

Update apt and install necessary packages for the Kubernetes repository.

```bash
sudo apt-get update
# apt-transport-https may be a dummy package; if so, you can skip that package
sudo apt-get install -y apt-transport-https ca-certificates curl gnupg
```

--------------------------------

### StatefulSet Example with Headless Service

Source: https://kubernetes.io/docs/concepts/_print

This example defines a Headless Service and a StatefulSet for an Nginx application. It includes volume claim templates for persistent storage and specifies the number of replicas. Ensure the .spec.selector matches .spec.template.metadata.labels.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx
  labels:
    app: nginx
spec:
  ports:
  - port: 80
    name: web
  clusterIP: None
  selector:
    app: nginx
---
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: web
spec:
  selector:
    matchLabels:
      app: nginx # has to match .spec.template.metadata.labels
  serviceName: "nginx"
  replicas: 3 # by default is 1
  minReadySeconds: 10 # by default is 0
  template:
    metadata:
      labels:
        app: nginx # has to match .spec.selector.matchLabels
    spec:
      terminationGracePeriodSeconds: 10
      containers:
      - name: nginx
        image: registry.k8s.io/nginx-slim:0.24
        ports:
        - containerPort: 80
          name: web
        volumeMounts:
        - name: www
          mountPath: /usr/share/nginx/html
  volumeClaimTemplates:
  - metadata:
      name: www
    spec:
      accessModes: [ "ReadWriteOnce" ]
      storageClassName: "my-storage-class"
      resources:
        requests:
          storage: 1Gi

```

--------------------------------

### Example Node Runtime Output

Source: https://kubernetes.io/docs/tasks/_print

Sample output showing container runtime information for Docker and containerd.

```text
NAME         STATUS   VERSION    CONTAINER-RUNTIME
node-1       Ready    v1.16.15   docker://19.3.1
node-2       Ready    v1.16.15   docker://19.3.1
node-3       Ready    v1.16.15   docker://19.3.1

```

```text
NAME         STATUS   VERSION   CONTAINER-RUNTIME
node-1       Ready    v1.19.6   containerd://1.4.1
node-2       Ready    v1.19.6   containerd://1.4.1
node-3       Ready    v1.19.6   containerd://1.4.1

```

--------------------------------

### Kubeadm Init and Join Example

Source: https://kubernetes.io/docs/reference/_print

Use `kubeadm init` to bootstrap a Kubernetes control-plane node and `kubeadm join` to bootstrap a worker node and join it to the cluster. Repeat the join step for additional worker nodes.

```bash
┌──────────────────────────────────────────────────────────┐
│ On the first machine:                                    │
├──────────────────────────────────────────────────────────┤
│ control-plane# kubeadm init                              
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ On the second machine:                                   │
├──────────────────────────────────────────────────────────┤
│ worker# kubeadm join &lt;arguments-returned-from-init&gt;      
└──────────────────────────────────────────────────────────┘
```

--------------------------------

### Example output for containerd runtime

Source: https://kubernetes.io/docs/tasks/administer-cluster/migrating-from-dockershim/_print

Sample output showing nodes running with containerd.

```text
NAME         STATUS   VERSION   CONTAINER-RUNTIME
node-1       Ready    v1.19.6   containerd://1.4.1
node-2       Ready    v1.19.6   containerd://1.4.1
node-3       Ready    v1.19.6   containerd://1.4.1

```

--------------------------------

### Kubernetes API Versions Example

Source: https://kubernetes.io/docs/tasks/access-application-cluster/_print

Example output from exploring the Kubernetes API via `kubectl proxy`. It lists the API versions available and server addresses.

```json
{
  "kind": "APIVersions",
  "versions": [
    "v1"
  ],
  "serverAddressByClientCIDRs": [
    {
      "clientCIDR": "0.0.0.0/0",
      "serverAddress": "10.0.1.149:443"
    }
  ]
}

```

--------------------------------

### Example: Create Cluster Role Binding for Users and Groups

Source: https://kubernetes.io/docs/reference/kubectl/_print

This example demonstrates how to create a cluster role binding named 'cluster-admin' and assign it to multiple users ('user1', 'user2') and a group ('group1'), using the 'cluster-admin' cluster role.

```bash
kubectl create clusterrolebinding cluster-admin --clusterrole=cluster-admin --user=user1 --user=user2 --group=group1

```

--------------------------------

### Example: Create a LoadBalancer Service

Source: https://kubernetes.io/docs/reference/kubectl/generated/kubectl_create/kubectl_create_service_loadbalancer

This example demonstrates creating a LoadBalancer service named 'my-lbs' that listens on port 5678 and forwards traffic to target port 8080.

```bash
kubectl create service loadbalancer my-lbs --tcp=5678:8080
```

--------------------------------

### Install Kubernetes Components with YUM (DNF)

Source: https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/_print

Installs kubelet, kubeadm, and kubectl using yum, disabling excludes for the Kubernetes repository.

```bash
sudo yum install -y kubelet kubeadm kubectl --disableexcludes=kubernetes
```

--------------------------------

### Install Kubernetes Packages on Debian

Source: https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/install-kubeadm

Update the package index and install the core Kubernetes components.

```bash
sudo apt-get update
sudo apt-get install -y kubelet kubeadm kubectl
sudo apt-mark hold kubelet kubeadm kubectl
```

--------------------------------

### Install kubectl on SUSE/openSUSE

Source: https://kubernetes.io/docs/tasks/_print

Installs kubectl on SUSE-based systems using zypper. This command adds the Kubernetes zypper repository.

```bash
cat <<EOF | sudo tee /etc/zypp/repos.d/kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=https://pkgs.k8s.io/core:/stable:/v1.35/rpm/
enabled=1
gpgcheck=1
gpgkey=https://pkgs.k8s.io/core:/stable:/v1.35/rpm/repodata/repomd.xml.key
EOF
```

--------------------------------

### Install missing system dependencies

Source: https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/_print

Commands to install ebtables and ethtool on common Linux distributions.

```bash
apt install ebtables ethtool
```

```bash
yum install ebtables ethtool
```

--------------------------------

### View controller-manager phase help

Source: https://kubernetes.io/docs/reference/setup-tools/kubeadm/kubeadm-init

Use this command to view available options for the controller-manager phase of kubeadm init.

```bash
sudo kubeadm init phase control-plane controller-manager --help

```

--------------------------------

### ConfigMap Manifest Example

Source: https://kubernetes.io/docs/tutorials/_print

An example of a ConfigMap manifest. This shows the structure and data fields, such as 'color'.

```yaml
apiVersion: v1
data:
  color: blue
kind: ConfigMap
# You can leave the existing metadata as they are.
# The values you'll see won't exactly match these.
metadata:
  creationTimestamp: "2024-01-05T08:12:05Z"
  name: color
  namespace: configmap
  resourceVersion: "1801272"
  uid: 80d33e4a-cbb4-4bc9-ba8c-544c68e425d6

```

--------------------------------

### kubeadm init phase addon

Source: https://kubernetes.io/docs/reference/setup-tools/kubeadm/kubeadm-init-phase

Installs required addons for passing conformance tests. Supports installing all addons or specific ones like coredns and kube-proxy.

```APIDOC
## kubeadm init phase addon

### Description
You can install all the available addons with the `all` subcommand, or install them selectively.

### Method
COMMAND

### Endpoint
`kubeadm init phase addon [flags]`

### Parameters
#### Options
- **-h, --help** - help for addon

### Options inherited from parent commands
#### Options
- **--rootfs** (string) - The path to the 'real' host root filesystem. This will cause kubeadm to chroot into the provided path.

### Synopsis
Install all the addons

### Method
COMMAND

### Endpoint
`kubeadm init phase addon all [flags]`

### Parameters
#### Options
- **-h, --help** - help for all

### Options inherited from parent commands
#### Options
- **--rootfs** (string) - The path to the 'real' host root filesystem. This will cause kubeadm to chroot into the provided path.
```

--------------------------------

### Storage Example: Advertise Extended Resource in Chunks

Source: https://kubernetes.io/docs/tasks/administer-cluster/extended-resource-node

This example shows how to advertise a special storage resource in fixed-size chunks (100 GiB), resulting in 8 advertised resources.

```yaml
Capacity:
 ...
 example.com/special-storage: 8

```

--------------------------------

### Deploy StatefulSet Resources

Source: https://kubernetes.io/docs/tutorials/stateful-application/basic-stateful-set

Applies the configuration file to create the service and StatefulSet.

```bash
kubectl apply -f https://k8s.io/examples/application/web/web.yaml
```

```text
service/nginx created
statefulset.apps/web created
```

--------------------------------

### Non-structural schema example 3

Source: https://kubernetes.io/docs/tasks/access-kubernetes-api/custom-resources/custom-resource-definitions

An example of a schema that violates multiple structural schema rules.

```yaml
properties:
  foo:
    pattern: "abc"
  metadata:
    type: object
    properties:
      name:
        type: string
        pattern: "^a"
      finalizers:
        type: array
        items:
          type: string
          pattern: "my-finalizer"
anyOf:
- properties:
    bar:
      type: integer
      minimum: 42
  required: ["bar"]
  description: "foo bar object"
```

--------------------------------

### hostPath Volume Configuration Example (Linux)

Source: https://kubernetes.io/docs/concepts/_print

This is an example manifest for mounting a host path on a Linux node. Be aware of the security risks associated with hostPath volumes.

```yaml
---
# This manifest mounts /data/foo on the host as /foo inside the
# single container that runs within the hostpath-example-linux Pod.
#

```

--------------------------------

### Example kubectl version output

Source: https://kubernetes.io/docs/tasks/debug/debug-cluster/_print

This is an example of the output you should see when checking your kubectl version. It displays client and server version information.

```text
Client Version: version.Info{Major:"1", Minor:"27", GitVersion:"v1.27.4",GitCommit:"fa3d7990104d7c1f16943a67f11b154b71f6a132", GitTreeState:"clean",BuildDate:"2023-07-19T12:20:54Z", GoVersion:"go1.20.6", Compiler:"gc", Platform:"linux/amd64"
Kustomize Version: v5.0.1
Server Version: version.Info{Major:"1", Minor:"27", GitVersion:"v1.27.3",GitCommit:"25b4e43193bcda6c7328a6d147b1fb73a33f1598", GitTreeState:"clean",BuildDate:"2023-06-14T09:47:40Z", GoVersion:"go1.20.5", Compiler:"gc", Platform:"linux/amd64"}


```

--------------------------------

### Create ConfigMap and Deployment with Kustomize

Source: https://kubernetes.io/docs/tasks/manage-kubernetes-objects/_print

Sets up a configuration file, a deployment manifest, and a kustomization file to generate a ConfigMap.

```bash
cat <<EOF >application.properties
FOO=Bar
EOF

cat <<EOF >deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
  labels:
    app: my-app
spec:
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
      - name: app
        image: my-app
        volumeMounts:
        - name: config
          mountPath: /config
      volumes:
      - name: config
        configMap:
          name: example-configmap-1
EOF

cat <<EOF >./kustomization.yaml
resources:
- deployment.yaml
configMapGenerator:
- name: example-configmap-1
  files:
  - application.properties
EOF
```

--------------------------------

### Admission Webhook Response Examples

Source: https://kubernetes.io/docs/reference/access-authn-authz/_print

Examples of minimal AdmissionReview responses for allowing or forbidding requests.

```json
{
  "apiVersion": "admission.k8s.io/v1",
  "kind": "AdmissionReview",
  "response": {
    "uid": "<value from request.uid>",
    "allowed": true
  }
}
```

```json
{
  "apiVersion": "admission.k8s.io/v1",
  "kind": "AdmissionReview",
  "response": {
    "uid": "<value from request.uid>",
    "allowed": false
  }
}
```

--------------------------------

### Example service-scoped Pod DNS record

Source: https://kubernetes.io/docs/concepts/services-networking/_print

A concrete example of a service-scoped DNS A record for a Pod.

```text
172-17-0-3.barista.cafe.svc.cluster.local
```

--------------------------------

### Pod DNS record example

Source: https://kubernetes.io/docs/concepts/services-networking/dns-pod-service

Example of a resolved DNS name for a Pod in the default namespace.

```text
172-17-0-3.default.pod.cluster.local

```

--------------------------------

### Download and inspect environment files

Source: https://kubernetes.io/docs/tasks/configure-pod-container/_print

Downloads sample environment files and displays their contents.

```bash
wget https://kubernetes.io/examples/configmap/game-env-file.properties -O configure-pod-container/configmap/game-env-file.properties
wget https://kubernetes.io/examples/configmap/ui-env-file.properties -O configure-pod-container/configmap/ui-env-file.properties

# The env-file `game-env-file.properties` looks like below
cat configure-pod-container/configmap/game-env-file.properties
enemies=aliens
lives=3
allowed="true"
```

--------------------------------

### Manage Pod Lifecycle

Source: https://kubernetes.io/docs/tasks/configure-pod-container/_print

Commands for deploying, inspecting, and interacting with the init-demo Pod.

```bash
kubectl apply -f https://k8s.io/examples/pods/init-containers.yaml
```

```bash
kubectl get pod init-demo
```

```bash
kubectl exec -it init-demo -- /bin/bash
```

--------------------------------

### Get CertificateSigningRequest Status API

Source: https://kubernetes.io/docs/reference/kubernetes-api/_print

HTTP GET request to retrieve the status of a specific CertificateSigningRequest.

```http
GET /apis/certificates.k8s.io/v1/certificatesigningrequests/{name}/status
```

--------------------------------

### Install containerd on Windows

Source: https://kubernetes.io/docs/tasks/administer-cluster/kubeadm/_print

Execute the downloaded script to install containerd. Replace CONTAINERD_VERSION with a specific release tag from the containerd repository (e.g., 1.7.22).

```powershell
.\Install-Containerd.ps1 -ContainerDVersion CONTAINERD_VERSION
```

--------------------------------

### Apply recommended labels to a Deployment and Service

Source: https://kubernetes.io/docs/concepts/overview/working-with-objects/common-labels

Shows how to label a simple stateless service using Deployment and Service objects.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app.kubernetes.io/name: myservice
    app.kubernetes.io/instance: myservice-abcxyz
...
```

```yaml
apiVersion: v1
kind: Service
metadata:
  labels:
    app.kubernetes.io/name: myservice
    app.kubernetes.io/instance: myservice-abcxyz
...
```

--------------------------------

### Create and Verify Pod

Source: https://kubernetes.io/docs/tasks/configure-pod-container/resize-pod-resources

Commands to deploy the Pod and inspect its initial resource configuration.

```bash
kubectl create -f pod-level-resize.yaml
```

```bash
# Wait a moment for the pod to be running
kubectl get pod pod-level-resize-demo --output=yaml
```

--------------------------------

### Web-hosted Static Pod Manifest Example

Source: https://kubernetes.io/docs/tasks/_print

An example of a static Pod manifest that can be hosted on a web server and referenced by the kubelet.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: static-web
  labels:
    role: myrole
spec:
  containers:
    - name: web
      image: nginx
      ports:
        - name: web
          containerPort: 80
          protocol: TCP
```

--------------------------------

### Configure kubelet

Source: https://kubernetes.io/docs/tutorials/cluster-management/kubelet-standalone

Create the directory for static pod manifests and write the kubelet configuration file.

```bash
sudo mkdir -p /etc/kubernetes/manifests
```

```bash
sudo tee /etc/kubernetes/kubelet.yaml <<EOF
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
authentication:
  webhook:
    enabled: false # Do NOT use in production clusters!
authorization:
  mode: AlwaysAllow # Do NOT use in production clusters!
enableServer: false
logging:
  format: text
address: 127.0.0.1 # Restrict access to localhost
readOnlyPort: 10255 # Do NOT use in production clusters!
staticPodPath: /etc/kubernetes/manifests
containerRuntimeEndpoint: unix:///var/run/crio/crio.sock
EOF
```

--------------------------------

### Example output for Pod list

Source: https://kubernetes.io/docs/tutorials/services/_print

Sample output showing the status of pods during a rolling update.

```text
NAME                                READY   STATUS        RESTARTS      AGE
nginx-deployment-7768647bf9-b4b9s   1/1     Terminating   0             4m1s
nginx-deployment-7768647bf9-rkxlw   1/1     Running       0             8s
```

--------------------------------

### GET /api/v1/namespaces/{namespace}/pods/{name}/portforward

Source: https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.35

Connect GET requests to portforward of Pod.

```APIDOC
## GET /api/v1/namespaces/{namespace}/pods/{name}/portforward

### Description
Connect GET requests to portforward of Pod.

### Method
GET

### Endpoint
/api/v1/namespaces/{namespace}/pods/{name}/portforward

### Parameters
#### Path Parameters
- **name** (string) - Required - name of the PodPortForwardOptions
- **namespace** (string) - Required - object name and auth scope, such as for teams and projects

#### Query Parameters
- **ports** (string) - Required - List of ports to forward Required when using WebSockets
```

--------------------------------

### Validation Actions Example

Source: https://kubernetes.io/docs/reference/_print

Demonstrates how to configure multiple validation actions for a policy binding. This example specifies both 'Warn' and 'Audit' actions.

```yaml
validationActions: [Warn, Audit]
```

--------------------------------

### Create and Install a kubectl Plugin

Source: https://kubernetes.io/docs/reference/kubectl

Define a custom executable script prefixed with 'kubectl-' and move it to a directory in your PATH.

```bash
cat ./kubectl-hello
```

```bash
#!/bin/sh

# this plugin prints the words "hello world"
echo "hello world"
```

```bash
chmod a+x ./kubectl-hello

# and move it to a location in our PATH
sudo mv ./kubectl-hello /usr/local/bin
sudo chown root:root /usr/local/bin

# You have now created and "installed" a kubectl plugin.
# You can begin using this plugin by invoking it from kubectl as if it were a regular command
kubectl hello
```

```bash
hello world
```

```bash
# You can "uninstall" a plugin, by removing it from the folder in your
# $PATH where you placed it
sudo rm /usr/local/bin/kubectl-hello
```

--------------------------------

### Start a new etcd member

Source: https://kubernetes.io/docs/tasks/_print

Configure environment variables and start the etcd process for a new member in an existing cluster.

```bash
export ETCD_NAME="member4"
export ETCD_INITIAL_CLUSTER="member2=http://10.0.0.2:2380,member3=http://10.0.0.3:2380,member4=http://10.0.0.4:2380"
export ETCD_INITIAL_CLUSTER_STATE=existing
etcd [flags]
```

--------------------------------

### Example kubectl output

Source: https://kubernetes.io/docs/tasks/extend-kubernetes/_print

Sample output showing pod status.

```text
NAMESPACE     NAME                                     READY   STATUS      RESTARTS   AGE
kube-system   coredns-85cb69466-klwq8                  1/1     Running     0          5m46s
```

--------------------------------

### Example output for Docker Engine runtime

Source: https://kubernetes.io/docs/tasks/administer-cluster/migrating-from-dockershim/find-out-runtime-you-use

Sample output showing nodes running with the Docker Engine runtime.

```text
NAME         STATUS   VERSION    CONTAINER-RUNTIME
node-1       Ready    v1.16.15   docker://19.3.1
node-2       Ready    v1.16.15   docker://19.3.1
node-3       Ready    v1.16.15   docker://19.3.1
```

--------------------------------

### Example Encryption Configuration

Source: https://kubernetes.io/docs/tasks/_print

This is an example configuration for Kubernetes encryption at rest. Do not use this configuration directly in a production cluster.

```yaml
---
#
# CAUTION: this is an example configuration.
#          Do not use this for your own cluster!

```

--------------------------------

### Example ConfigMap with managedFields

Source: https://kubernetes.io/docs/reference/_print

An example of a ConfigMap object showing how multiple managers track ownership of different fields.

```yaml
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: test-cm
  namespace: default
  labels:
    test-label: test
  managedFields:
  - manager: kubectl
    operation: Apply
    time: '2019-03-30T15:00:00.000Z'
    apiVersion: v1
    fieldsType: FieldsV1
    fieldsV1:
      f:metadata:
        f:labels:
          f:test-label: {}
  - manager: kube-controller-manager
    operation: Update
    apiVersion: v1
    time: '2019-03-30T16:00:00.000Z'
    fieldsType: FieldsV1
    fieldsV1:
      f:data:
        f:key: {}
data:
  key: new value
```

--------------------------------

### Kubernetes Service Resource Example

Source: https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.35

This is an example JSON output for a Kubernetes Service resource, showing its metadata, spec, and status.

```json
{
  "kind": "Service",
  "apiVersion": "v1",
  "metadata": {
    "name": "deployment-example",
    "namespace": "default",
    "selfLink": "/api/v1/namespaces/default/services/deployment-example",
    "uid": "93e5c731-9d30-11e6-9c54-42010a800148",
    "resourceVersion": "2205995",
    "creationTimestamp": "2016-10-28T17:04:24Z"
  },
  "spec": {
    "ports": [
      {
        "name": "http",
        "protocol": "TCP",
        "port": 80,
        "targetPort": 8080,
        "nodePort": 32417
      }
    ],
    "selector": {
      "app": "nginx"
    },
    "clusterIP": "10.183.250.161",
    "type": "LoadBalancer",
    "sessionAffinity": "None"
  },
  "status": {
    "loadBalancer": {
      "ingress": [
        {
          "ip": "104.198.186.106"
        }
      ]
    }
  }
}
```

--------------------------------

### Example metrics output

Source: https://kubernetes.io/docs/tasks/_print

Sample output showing current CPU usage in milliCPU.

```text
NAME                        CPU(cores)   MEMORY(bytes)
cpu-demo                    974m         <something>
```

--------------------------------

### Create a job with a command

Source: https://kubernetes.io/docs/reference/kubectl/generated/kubectl_create/kubectl_create_job

This example shows how to create a job that executes a specific command and its arguments within the container, overriding the image's default entrypoint.

```bash
kubectl create job my-job --image=busybox -- date
```

--------------------------------

### GET /api/v1/namespaces/{namespace}/services/{name}/proxy

Source: https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.35

Connect GET requests to the proxy of a Service.

```APIDOC
## GET /api/v1/namespaces/{namespace}/services/{name}/proxy

### Description
Connect GET requests to the proxy of a Service.

### Method
GET

### Endpoint
/api/v1/namespaces/{namespace}/services/{name}/proxy

### Parameters
#### Path Parameters
- **name** (string) - Required - name of the ServiceProxyOptions
- **namespace** (string) - Required - object name and auth scope, such as for teams and projects

#### Query Parameters
- **path** (string) - Required - Path is the part of URLs that include service endpoints, suffixes, and parameters to use for the current proxy request to service. For example, the whole request URL is http://localhost/api/v1/namespaces/kube-system/services/elasticsearch-logging/_search?q=user:kimchy. Path is _search?q=user:kimchy.

### Response
#### Success Response (200)
- _string_ - OK
```

--------------------------------

### Apply and verify gRPC probe

Source: https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes

Commands to deploy the example Pod and inspect its status.

```bash
kubectl apply -f https://k8s.io/examples/pods/probe/grpc-liveness.yaml
```

```bash
kubectl describe pod etcd-with-grpc
```

--------------------------------

### Install Kube-Proxy Addon with Kubeadm

Source: https://kubernetes.io/docs/reference/_print

Installs the kube-proxy addon components via the API server. This command is used to set up network proxying for the cluster.

```bash
kubeadm init phase addon kube-proxy [flags]
```

--------------------------------

### Example Cilium Pod Output

Source: https://kubernetes.io/docs/tasks/administer-cluster/network-policy-provider/cilium-network-policy

This is an example output showing a running Cilium pod in the 'kube-system' namespace. The 'READY' status should be '1/1' and 'STATUS' should be 'Running'.

```text
NAME           READY   STATUS    RESTARTS   AGE
cilium-kkdhz   1/1     Running   0          3m23s
...

```

--------------------------------

### Windows Credential Plugin Allowlist Example

Source: https://kubernetes.io/docs/reference/_print

An example of a Windows-compatible allowlist for credential plugins, specifying trusted binaries by name or full path.

```yaml
apiVersion: kubectl.config.k8s.io/v1beta1
kind: Preference
credentialPluginPolicy: Allowlist
credentialPluginAllowlist:
  - name: my-trusted-binary
  - name: "C:\my-other-trusted-binary"

```

--------------------------------

### Apply Deployment with Server-Side Apply

Source: https://kubernetes.io/docs/reference/using-api/_print

Command to apply the initial Deployment manifest using Server-Side Apply.

```bash
kubectl apply -f https://k8s.io/examples/application/ssa/nginx-deployment.yaml --server-side

```

--------------------------------

### Install kubectl on openSUSE/SLES

Source: https://kubernetes.io/docs/tasks/tools/_print

Installs kubectl on SUSE-based systems. This involves adding the Kubernetes zypper repository configuration and then installing the kubectl package using zypper. You will be prompted to trust the new repository's signing key.

```bash
cat <<EOF | sudo tee /etc/zypp/repos.d/kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=https://pkgs.k8s.io/core:/stable:/v1.35/rpm/
enabled=1
gpgcheck=1
gpgkey=https://pkgs.k8s.io/core:/stable:/v1.35/rpm/repodata/repomd.xml.key
EOF
```

```bash
sudo zypper update
```

```text
New repository or package signing key received:

Repository:       Kubernetes
Key Fingerprint:  1111 2222 3333 4444 5555 6666 7777 8888 9999 AAAA
Key Name:         isv:kubernetes OBS Project <isv:kubernetes@build.opensuse.org>
Key Algorithm:    RSA 2048
Key Created:      Thu 25 Aug 2022 01:21:11 PM -03
Key Expires:      Sat 02 Nov 2024 01:21:11 PM -03 (expires in 85 days)
Rpm Name:         gpg-pubkey-9a296436-6307a177

Note: Signing data enables the recipient to verify that no modifications occurred after the data
were signed. Accepting data with no, wrong or unknown signature can lead to a corrupted system
and in extreme cases even to a system compromise.

Note: A GPG pubkey is clearly identified by its fingerprint. Do not rely on the key's name. If
you are not sure whether the presented key is authentic, ask the repository provider or check
their web site. Many providers maintain a web page showing the fingerprints of the GPG keys they
are using.

Do you want to reject the key, trust temporarily, or trust always? [r/t/a/?] (r): a
```

```bash
sudo zypper install -y kubectl
```

--------------------------------

### Kubectl Resource Type Examples

Source: https://kubernetes.io/docs/reference/kubectl

Demonstrates how to specify resource types in kubectl commands. Singular, plural, and abbreviated forms yield the same output.

```bash
kubectl get pod pod1
```

```bash
kubectl get pods pod1
```

```bash
kubectl get po pod1
```

--------------------------------

### Clean up kubectl-convert installation files

Source: https://kubernetes.io/docs/tasks/tools/install-kubectl-macos

Remove the downloaded kubectl-convert binary and its checksum file after successful installation.

```bash
rm kubectl-convert kubectl-convert.sha256

```

--------------------------------

### Docker Hub Configuration Example

Source: https://kubernetes.io/docs/tasks/configure-pod-container/pull-image-private-registry

An example of the `config.json` file content, showing the `auths` section with the authorization token for Docker Hub. If a credentials store is used, a `credsStore` entry might be present instead.

```json
{
    "auths": {
        "https://index.docker.io/v1/": {
            "auth": "c3R...zE2"
        }
    }
}

```

--------------------------------

### Install Kubernetes Packages on RHEL

Source: https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/install-kubeadm

Install Kubernetes components using DNF or DNF5 package managers.

```bash
sudo yum install -y kubelet kubeadm kubectl --disableexcludes=kubernetes
```

```bash
sudo yum install -y kubelet kubeadm kubectl --setopt=disable_excludes=kubernetes
```

--------------------------------

### Configure startup probes

Source: https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes

Combines a startup probe with a liveness probe to allow for slow application initialization.

```yaml
ports:
- name: liveness-port
  containerPort: 8080

livenessProbe:
  httpGet:
    path: /healthz
    port: liveness-port
  failureThreshold: 1
  periodSeconds: 10

startupProbe:
  httpGet:
    path: /healthz
    port: liveness-port
  failureThreshold: 30
  periodSeconds: 10
```

--------------------------------

### Install ebtables and ethtool on CentOS/Fedora

Source: https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/troubleshooting-kubeadm

Use yum to install the ebtables and ethtool packages on CentOS/Fedora systems.

```bash
yum install ebtables ethtool
```

--------------------------------

### Example output for Docker Engine runtime

Source: https://kubernetes.io/docs/tasks/administer-cluster/migrating-from-dockershim/_print

Sample output showing nodes running with Docker Engine.

```text
NAME         STATUS   VERSION    CONTAINER-RUNTIME
node-1       Ready    v1.16.15   docker://19.3.1
node-2       Ready    v1.16.15   docker://19.3.1
node-3       Ready    v1.16.15   docker://19.3.1

```

--------------------------------

### Install ebtables and ethtool on Debian/Ubuntu

Source: https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/troubleshooting-kubeadm

Use apt to install the ebtables and ethtool packages on Debian-based systems.

```bash
apt install ebtables ethtool
```

--------------------------------

### Install apt dependencies

Source: https://kubernetes.io/docs/setup/production-environment/tools/_print

Update the package index and install necessary tools for the Kubernetes apt repository.

```bash
sudo apt-get update
# apt-transport-https may be a dummy package; if so, you can skip that package
sudo apt-get install -y apt-transport-https ca-certificates curl gpg
```

--------------------------------

### POSIX Credential Plugin Allowlist Example

Source: https://kubernetes.io/docs/reference/_print

An example of a POSIX-compatible allowlist for credential plugins, specifying trusted binaries by name or full path.

```yaml
apiVersion: kubectl.config.k8s.io/v1beta1
kind: Preference
credentialPluginPolicy: Allowlist
credentialPluginAllowlist:
  - name: my-trusted-binary
  - name: /usr/local/bin/my-other-trusted-binary

```

--------------------------------

### Check for ingress-nginx installation

Source: https://kubernetes.io/docs/reference/issues-security/official-cve-feed/index.json

Verify if the ingress-nginx controller is installed in the cluster by checking for pods with the corresponding label.

```bash
kubectl get pods --all-namespaces --selector app.kubernetes.io/name=ingress-nginx
```

--------------------------------

### Clean Up Installation Files

Source: https://kubernetes.io/docs/tasks/_print

Remove the downloaded kubectl-convert binary and its checksum file after successful installation to free up disk space.

```bash
rm kubectl-convert kubectl-convert.sha256

```

--------------------------------

### Install kubectl using zypper

Source: https://kubernetes.io/docs/tasks/_print

Installs the kubectl binary using the zypper package manager. Ensure the Kubernetes repository is configured and updated first.

```bash
sudo zypper install -y kubectl

```

--------------------------------

### Initialize easyrsa

Source: https://kubernetes.io/docs/tasks/_print

Initialize the easyrsa PKI directory. This command should be run first when using easyrsa.

```bash
curl -LO https://dl.k8s.io/easy-rsa/easy-rsa.tar.gz
tar xzf easy-rsa.tar.gz
cd easy-rsa-master/easyrsa3
./easyrsa init-pki

```

--------------------------------

### Run kube-apiserver

Source: https://kubernetes.io/docs/reference/command-line-tools-reference/kube-apiserver

Basic command-line syntax for starting the Kubernetes API server.

```bash
kube-apiserver [flags]
```

--------------------------------

### Deployment status output

Source: https://kubernetes.io/docs/tasks/_print

Example output showing the current state of the deployment replicas.

```text
NAME         READY   UP-TO-DATE   AVAILABLE   AGE
php-apache   7/7      7           7           19m
```

```text
NAME         READY   UP-TO-DATE   AVAILABLE   AGE
php-apache   1/1     1            1           27m
```

--------------------------------

### Install Required Go Packages

Source: https://kubernetes.io/docs/contribute/generate-ref-docs/kubernetes-api

Navigate to the gen-apidocs directory and install the necessary Go packages for OpenAPI specification handling. Ensure your Go environment is set up correctly.

```bash
go get -u github.com/go-openapi/loads
go get -u github.com/go-openapi/spec
```

--------------------------------

### Example node output

Source: https://kubernetes.io/docs/tutorials/stateful-application/zookeeper

Sample output showing node names for scheduled pods.

```text
kubernetes-node-pb41
kubernetes-node-ixsl
kubernetes-node-i4c4
```

--------------------------------

### Start Kubelet

Source: https://kubernetes.io/docs/reference/setup-tools/kubeadm/kubeadm-join-phase

This phase is used to write kubelet settings, certificates, and restart the kubelet. It's a crucial step after control plane preparation.

```bash
kubeadm join phase kubelet-start
```

--------------------------------

### JSONPatch Add Example with Object Type

Source: https://kubernetes.io/docs/reference/kubernetes-api/policy-resources/_print

Example of using JSONPatch with an Object type for the patch value.

```APIDOC
### JSONPatch Add Example with Object Type

```cel
[
  JSONPatch{
    op: "add",
    path: "/spec/selector",
    value: Object.spec.selector{matchLabels: {"environment": "test"}}
  }
]
```
```

--------------------------------

### Start a pod and keep it in foreground

Source: https://kubernetes.io/docs/reference/_print

Start a busybox pod, keep it in the foreground, and prevent it from restarting if it exits using `--restart=Never`.

```bash
kubectl run -i -t busybox --image=busybox --restart=Never
```

--------------------------------

### kubectl debug - Examples

Source: https://kubernetes.io/docs/reference/kubectl/generated/kubectl_debug/_print

Illustrative examples of how to use the kubectl debug command for various troubleshooting scenarios.

```APIDOC
## Examples

```bash
# Create an interactive debugging session in pod mypod and immediately attach to it.
kubectl debug mypod -it --image=busybox

# Create an interactive debugging session for the pod in the file pod.yaml and immediately attach to it.
# (requires the EphemeralContainers feature to be enabled in the cluster)
kubectl debug -f pod.yaml -it --image=busybox

# Create a debug container named debugger using a custom automated debugging image.
kubectl debug --image=myproj/debug-tools -c debugger mypod

# Create a copy of mypod adding a debug container and attach to it
kubectl debug mypod -it --image=busybox --copy-to=my-debugger

# Create a copy of mypod changing the command of mycontainer
kubectl debug mypod -it --copy-to=my-debugger --container=mycontainer -- sh

# Create a copy of mypod changing all container images to busybox
kubectl debug mypod --copy-to=my-debugger --set-image=*=busybox

# Create a copy of mypod adding a debug container and changing container images
kubectl debug mypod -it --copy-to=my-debugger --image=debian --set-image=app=app:debug,sidecar=sidecar:debug

# Create an interactive debugging session on a node and immediately attach to it.
# The container will run in the host namespaces and the host's filesystem will be mounted at /host
kubectl debug node/mynode -it --image=busybox
```
```

--------------------------------

### Post-initialization output and instructions

Source: https://kubernetes.io/docs/setup/production-environment/tools/_print

The output displayed after a successful kubeadm init, including commands to configure kubectl.

```text
Your Kubernetes control-plane has initialized successfully!

To start using your cluster, you need to run the following as a regular user:

  mkdir -p $HOME/.kube
  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config

You should now deploy a Pod network to the cluster.
Run "kubectl apply -f [podnetwork].yaml" with one of the options listed at:
  /docs/concepts/cluster-administration/addons/

You can now join any number of machines by running the following on each node
as root:

  kubeadm join <control-plane-host>:<control-plane-port> --token <token> --discovery-token-ca-cert-hash sha256:<hash>
```

--------------------------------

### Manage pod resource constraints

Source: https://kubernetes.io/docs/reference/kubectl/generated/_print

Examples for setting, updating, and removing CPU and memory limits and requests for containers within a deployment.

```bash
  # Set a deployments nginx container cpu limits to "200m" and memory to "512Mi"
  kubectl set resources deployment nginx -c=nginx --limits=cpu=200m,memory=512Mi
  
  # Set the resource request and limits for all containers in nginx
  kubectl set resources deployment nginx --limits=cpu=200m,memory=512Mi --requests=cpu=100m,memory=256Mi
  
  # Remove the resource requests for resources on containers in nginx
  kubectl set resources deployment nginx --limits=cpu=0,memory=0 --requests=cpu=0,memory=0
  
  # Print the result (in yaml format) of updating nginx container limits from a local, without hitting the server
  kubectl set resources -f path/to/file.yaml --limits=cpu=200m,memory=512Mi --local -o yaml
```

--------------------------------

### Example CredentialProviderConfig for ECR

Source: https://kubernetes.io/docs/tasks/_print

This is an example configuration file for the kubelet's image credential provider. It specifies the API version and kind, and lists the providers to be enabled. Multiple providers can match a single image, and their results are combined.

```yaml
apiVersion: kubelet.config.k8s.io/v1
kind: CredentialProviderConfig
# providers is a list of credential provider helper plugins that will be enabled by the kubelet.
# Multiple providers may match against a single image, in which case credentials
# from all providers will be returned to the kubelet. If multiple providers are called
# for a single image, the results are combined. If providers return overlapping
```

--------------------------------

### CEL Apply Configuration Example

Source: https://kubernetes.io/docs/reference/_print

An example of a CEL expression that returns an apply configuration to set a single field in an object.

```APIDOC
## CEL Apply Configuration Example

### Description
This example demonstrates how to create an apply configuration using CEL to set a specific field within an object.

### Method
N/A (This is a configuration expression, not an API endpoint)

### Endpoint
N/A

### Request Body
```cel
Object{
  spec: Object.spec{
    serviceAccountName: "example"
  }
}
```

### Response
N/A
```

--------------------------------

### Start MySQL Server with Replication

Source: https://kubernetes.io/docs/tasks/run-application/_print

This command starts the MySQL server process. It includes options for listening on port 3307, sending backups when requested, and streaming data using xtrabackup.

```bash
exec ncat --listen --keep-open --send-only --max-conns=1 3307 -c \
  "xtrabackup --backup --slave-info --stream=xbstream --host=127.0.0.1 --user=root"
```

--------------------------------

### Using RawExtension for Driver Configuration

Source: https://kubernetes.io/docs/reference/kubernetes-api/extend-resources/_print

Demonstrates how to use RawExtension to pass driver-specific configuration parameters. This is useful when the exact configuration structure is unknown at compile time or varies by driver.

```go
package main

import (
	"encoding/json"
	"k8s.io/apimachinery/pkg/runtime"
)

// Internal package: 
type MyAPIObjectInternal struct {
	runtime.TypeMeta `json:",inline"
	MyPlugin           runtime.Object `json:"myPlugin"`
}

type PluginAInternal struct {
	AOption string `json:"aOption"`
}

// External package: 
type MyAPIObjectExternal struct {
	runtime.TypeMeta `json:",inline"
	MyPlugin           runtime.RawExtension `json:"myPlugin"`
}

type PluginAExternal struct {
	AOption string `json:"aOption"`
}

// On the wire, the JSON will look something like this:
// { "kind":"MyAPIObject", "apiVersion":"v1", "myPlugin": { "kind":"PluginA", "aOption":"foo" } }
```

--------------------------------

### TokenReview API Output Example

Source: https://kubernetes.io/docs/reference/access-authn-authz/_print

Example response from the TokenReview API showing extracted claims and metadata.

```yaml
apiVersion: authentication.k8s.io/v1
kind: TokenReview
metadata:
  creationTimestamp: null
spec:
  token: <token>
status:
  audiences:
  - https://kubernetes.default.svc.cluster.local
  authenticated: true
  user:
    extra:
      authentication.kubernetes.io/credential-id:
      - JTI=7ee52be0-9045-4653-aa5e-0da57b8dccdc
      authentication.kubernetes.io/node-name:
      - kind-control-plane
      authentication.kubernetes.io/node-uid:
      - 497e9d9a-47aa-4930-b0f6-9f2fb574c8c6
      authentication.kubernetes.io/pod-name:
      - test-pod
      authentication.kubernetes.io/pod-uid:
      - e87dbbd6-3d7e-45db-aafb-72b24627dff5
    groups:
    - system:serviceaccounts
    - system:serviceaccounts:default
    - system:authenticated
    uid: f8b4161b-2e2b-11e9-86b7-2afc33b31a7e
    username: system:serviceaccount:default:my-sa
```

--------------------------------

### Initialize easyrsa PKI

Source: https://kubernetes.io/docs/tasks/administer-cluster/certificates

Download, unpack, and initialize the easyrsa3 tool. This sets up the necessary directory structure for certificate generation.

```bash
curl -LO https://dl.k8s.io/easy-rsa/easy-rsa.tar.gz
tar xzf easy-rsa.tar.gz
cd easy-rsa-master/easyrsa3
./easyrsa init-pki

```

--------------------------------

### Traditional klog output examples

Source: https://kubernetes.io/docs/concepts/_print

Examples of the native klog format, including handling of multi-line messages.

```text
I1025 00:15:15.525108       1 httplog.go:79] GET /api/v1/namespaces/kube-system/pods/metrics-server-v0.3.1-57c75779f-9p8wg: (1.512ms) 200 [pod_nanny/v0.0.0 (linux/amd64) kubernetes/$Format 10.56.1.19:51756]
```

```text
I1025 00:15:15.525108       1 example.go:79] This is a message
which has a line break.
```

--------------------------------

### Example kubectl output

Source: https://kubernetes.io/docs/tasks/configure-pod-container/_print

Sample output showing the mirror Pod status.

```text
NAME                  READY   STATUS    RESTARTS        AGE
static-web-my-node1   1/1     Running   0               2m
```

--------------------------------

### Initialize localization directory structure

Source: https://kubernetes.io/docs/contribute/localization

Create the required subdirectory for a new language and copy the base English documentation files to begin the translation process.

```bash
mkdir -p content/de/docs/tutorials
cp -ra content/en/docs/tutorials/kubernetes-basics/ content/de/docs/tutorials/
```

--------------------------------

### Example Token Payload

Source: https://kubernetes.io/docs/reference/access-authn-authz/_print

This is the decoded payload of the example JWT token, showing the claims available for authentication.

```json
{
    "aud": "kubernetes",
    "exp": 1703232949,
    "iat": 1701107233,
    "iss": "https://example.com",
    "jti": "7c337942807e73caa2c30c868ac0ce910bce02ddcbfebe8c23b8b5f27ad62873",
    "nbf": 1701107233,
    "roles": "user,admin",
    "sub": "auth",
    "tenant": "72f988bf-86f1-41af-91ab-2d7cd011db4a",
    "username": "foo"
  }

```

--------------------------------

### Example of a Pod with a Mutated Sidecar Container

Source: https://kubernetes.io/docs/reference/_print

This example shows a Pod resource after the MutatingAdmissionPolicy has been applied, demonstrating the addition of the `mesh-proxy` initContainer.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: myapp
  namespace: default
spec:
  ...
  initContainers:
  - name: mesh-proxy
    image: mesh/proxy:v1.0.0
    args: ["proxy", "sidecar"]
    restartPolicy: Always
  - name: myapp-initializer
    image: example/initializer:v1.0.0
  ...


```

--------------------------------

### Create PriorityClass Examples

Source: https://kubernetes.io/docs/reference/_print

Common usage patterns for creating priority classes with different configurations like global defaults and preemption policies.

```bash
  # Create a priority class named high-priority
  kubectl create priorityclass high-priority --value=1000 --description="high priority"
  
  # Create a priority class named default-priority that is considered as the global default priority
  kubectl create priorityclass default-priority --value=1000 --global-default=true --description="default priority"
  
  # Create a priority class named high-priority that cannot preempt pods with lower priority
  kubectl create priorityclass high-priority --value=1000 --description="high priority" --preemption-policy="Never"
```

--------------------------------

### Compose multiple resources

Source: https://kubernetes.io/docs/tasks/_print

Example of grouping a Deployment and a Service into a single kustomization configuration.

```bash
# Create a deployment.yaml file
cat <<EOF > deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-nginx
spec:
  selector:
    matchLabels:
      run: my-nginx
  replicas: 2
  template:
    metadata:
      labels:
        run: my-nginx
    spec:
      containers:
      - name: my-nginx
        image: nginx
        ports:
        - containerPort: 80
EOF

# Create a service.yaml file
cat <<EOF > service.yaml
apiVersion: v1
kind: Service
metadata:
  name: my-nginx
  labels:
    run: my-nginx
spec:
  ports:
  - port: 80
    protocol: TCP
  selector:
    run: my-nginx
EOF

# Create a kustomization.yaml composing them
cat <<EOF >./kustomization.yaml
resources:
- deployment.yaml
- service.yaml
EOF
```

--------------------------------

### Example Pod with Injected Sidecar Container

Source: https://kubernetes.io/docs/reference/access-authn-authz/mutating-admission-policy

This is an example of a Pod that has been mutated by the MutatingAdmissionPolicy to include the sidecar container.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: myapp
  namespace: default
spec:
  ...
  initContainers:
  - name: mesh-proxy
    image: mesh/proxy:v1.0.0
    args: ["proxy", "sidecar"]
    restartPolicy: Always
  - name: myapp-initializer
    image: example/initializer:v1.0.0
  ...


```

--------------------------------

### Initialize CA and service account files

Source: https://kubernetes.io/docs/tasks/administer-cluster/kubeadm/kubeadm-certs

Generate the necessary CA certificates and service account keys on the primary control plane node.

```bash
sudo kubeadm init phase certs ca
sudo kubeadm init phase certs etcd-ca
sudo kubeadm init phase certs front-proxy-ca
sudo kubeadm init phase certs sa
```

--------------------------------

### Go Code Example in Tab

Source: https://kubernetes.io/docs/contribute/style/hugo-shortcodes

Example of Go code within a tab generated by the `tabs` shortcode.

```go
println "This is tab 2."
```

--------------------------------

### Initialize control plane and etcd with custom manifests

Source: https://kubernetes.io/docs/reference/setup-tools/kubeadm/kubeadm-init

This example demonstrates skipping the control-plane and etcd phases during initialization, allowing for manual modification of their manifest files before creating the control plane node.

```bash
sudo kubeadm init phase control-plane all --config=configfile.yaml
sudo kubeadm init phase etcd local --config=configfile.yaml
# you can now modify the control plane and etcd manifest files
sudo kubeadm init --skip-phases=control-plane,etcd --config=configfile.yaml

```

--------------------------------

### Bash Code Example in Tab

Source: https://kubernetes.io/docs/contribute/style/hugo-shortcodes

Example of bash code within a tab generated by the `tabs` shortcode.

```bash
echo "This is tab 1."
```

--------------------------------

### Display the current-context

Source: https://kubernetes.io/docs/reference/_print

Example showing how to display the current context.

```bash
  # Display the current-context
  kubectl config current-context
```

--------------------------------

### Basic kubeadm Cluster Creation Commands

Source: https://kubernetes.io/docs/reference/setup-tools/kubeadm/implementation-details

These commands outline the essential steps for setting up a new Kubernetes cluster using kubeadm and applying a network plugin.

```bash
kubeadm init
export KUBECONFIG=/etc/kubernetes/admin.conf
kubectl apply -f <network-plugin-of-choice.yaml>
kubeadm join --token <token> <endpoint>:<port>
```

--------------------------------

### Git status output example

Source: https://kubernetes.io/docs/contribute/new-content/open-a-pr

Example output showing files that are modified but not yet staged for commit.

```text
On branch <my_new_branch>
Your branch is up to date with 'origin/<my_new_branch>'.

Changes not staged for commit:
(use "git add <file>..." to update what will be committed)
(use "git checkout -- <file>..." to discard changes in working directory)

modified:   content/en/docs/contribute/new-content/contributing-content.md

no changes added to commit (use "git add" and/or "git commit -a")
```

--------------------------------

### Example Pod Description Output

Source: https://kubernetes.io/docs/tasks/debug/debug-application/debug-running-pod

This is an example output of `kubectl describe pod`, showing resource requests, limits, and scheduling events for a pending pod.

```yaml
  Name:	nginx-deployment-1370807587-fz9sd
  Namespace:	default
  Node:	/
  Labels:	app=nginx,pod-template-hash=1370807587
  Status:	Pending
  IP:
  Controllers:	ReplicaSet/nginx-deployment-1370807587
  Containers:
    nginx:
      Image:	nginx
      Port:	80/TCP
      QoS Tier:
        memory:	Guaranteed
        cpu:	Guaranteed
      Limits:
        cpu:	1
        memory:	128Mi
      Requests:
        cpu:	1
        memory:	128Mi
      Environment Variables:
  Volumes:
    default-token-4bcbi:
      Type:	Secret (a volume populated by a Secret)
      SecretName:	default-token-4bcbi
  Events:
    FirstSeen	LastSeen	Count	From		        SubobjectPath	Type	Reason		    Message
    ---------	--------	-----	----		        -------------	--------	------		    -------
    1m	    48s		    7	    {default-scheduler }		            	Warning		FailedScheduling	pod (nginx-deployment-1370807587-fz9sd) failed to fit in any node
  fit failure on node (kubernetes-node-6ta5): Node didn't have enough resource: CPU, requested: 1000, used: 1420, capacity: 2000
  fit failure on node (kubernetes-node-wul5): Node didn't have enough resource: CPU, requested: 1000, used: 1100, capacity: 2000

```

--------------------------------

### Verify Resource Allocation

Source: https://kubernetes.io/docs/tasks/_print

Example output showing the applied default resource limits on a container.

```yaml
containers:
- image: nginx
  imagePullPolicy: Always
  name: default-cpu-demo-ctr
  resources:
    limits:
      cpu: "1"
    requests:
      cpu: 500m
```

--------------------------------

### Create the Pod

Source: https://kubernetes.io/docs/tasks/_print

Deploy the Pod using the created manifest.

```bash
kubectl create -f pod-resize.yaml -n qos-example
```

--------------------------------

### Example Cluster Info Output

Source: https://kubernetes.io/docs/tasks/_print

Sample output showing proxy-verb URLs for system services.

```text
Kubernetes master is running at https://192.0.2.1
elasticsearch-logging is running at https://192.0.2.1/api/v1/namespaces/kube-system/services/elasticsearch-logging/proxy
kibana-logging is running at https://192.0.2.1/api/v1/namespaces/kube-system/services/kibana-logging/proxy
kube-dns is running at https://192.0.2.1/api/v1/namespaces/kube-system/services/kube-dns/proxy
grafana is running at https://192.0.2.1/api/v1/namespaces/kube-system/services/monitoring-grafana/proxy
heapster is running at https://192.0.2.1/api/v1/namespaces/kube-system/services/monitoring-heapster/proxy
```

--------------------------------

### Create a namespace for DRA tutorial

Source: https://kubernetes.io/docs/tutorials/_print

Creates a dedicated namespace named dra-tutorial to organize resources and simplify cleanup.

```bash
kubectl create namespace dra-tutorial 
```

--------------------------------

### View structured log entry example

Source: https://kubernetes.io/docs/concepts/cluster-administration/system-logs

A concrete example of a structured log message with key-value pairs.

```text
I1025 00:15:15.525108       1 controller_utils.go:116] "Pod status updated" pod="kube-system/kubedns" status="ready"
```

--------------------------------

### kubectl apply usage examples

Source: https://kubernetes.io/docs/reference/kubectl/generated/kubectl_apply

Common patterns for applying configurations, including file-based, directory-based, and stdin-based operations.

```bash
  # Apply the configuration in pod.json to a pod
  kubectl apply -f ./pod.json
  
  # Apply resources from a directory containing kustomization.yaml - e.g. dir/kustomization.yaml
  kubectl apply -k dir/
  
  # Apply the JSON passed into stdin to a pod
  cat pod.json | kubectl apply -f -
  
  # Apply the configuration from all files that end with '.json'
  kubectl apply -f '*.json'
  
  # Note: --prune is still in Alpha
  # Apply the configuration in manifest.yaml that matches label app=nginx and delete all other resources that are not in the file and match label app=nginx
  kubectl apply --prune -f manifest.yaml -l app=nginx
  
  # Apply the configuration in manifest.yaml and delete all the other config maps that are not in the file
  kubectl apply --prune -f manifest.yaml --all --prune-allowlist=core/v1/ConfigMap
```

--------------------------------

### Get CertificateSigningRequest Approval API

Source: https://kubernetes.io/docs/reference/kubernetes-api/_print

HTTP GET request to retrieve the approval status of a specific CertificateSigningRequest.

```http
GET /apis/certificates.k8s.io/v1/certificatesigningrequests/{name}/approval
```

--------------------------------

### Install bash-completion v2

Source: https://kubernetes.io/docs/tasks/_print

Install bash-completion v2 using Homebrew. This is a prerequisite for enabling kubectl autocompletion on newer Bash versions.

```bash
brew install bash-completion@2

```

--------------------------------

### Create and inspect the Pod

Source: https://kubernetes.io/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace

Commands to deploy the Pod manifest and verify its resulting resource configuration.

```bash
kubectl apply -f https://k8s.io/examples/admin/resource/cpu-defaults-pod-3.yaml --namespace=default-cpu-example
```

```bash
kubectl get pod default-cpu-demo-3 --output=yaml --namespace=default-cpu-example
```

--------------------------------

### Command Output Examples

Source: https://kubernetes.io/docs/tasks/debug/debug-application/_print

Expected output from kubectl commands.

```text
deployment.apps/nginx-deployment created
```

```text
NAME                                READY   STATUS    RESTARTS   AGE
nginx-deployment-67d4bdd6f5-cx2nz   1/1     Running   0          13s
nginx-deployment-67d4bdd6f5-w6kd7   1/1     Running   0          13s
```

```text
Name:         nginx-deployment-67d4bdd6f5-w6kd7
Namespace:    default
Priority:     0
Node:         kube-worker-1/192.168.0.113
Start Time:   Thu, 17 Feb 2022 16:51:01 -0500
Labels:       app=nginx
              pod-template-hash=67d4bdd6f5
Annotations:  <none>
Status:       Running
IP:           10.88.0.3
IPs:
  IP:           10.88.0.3
  IP:           2001:db8::1
Controlled By:  ReplicaSet/nginx-deployment-67d4bdd6f5
Containers:
  nginx:
    Container ID:   containerd://5403af59a2b46ee5a23fb0ae4b1e077f7ca5c5fb7af16e1ab21c00e0e616462a
    Image:          nginx
    Image ID:       docker.io/library/nginx@sha256:2834dc507516af02784808c5f48b7cbe38b8ed5d0f4837f16e78d00deb7e7767
    Port:           80/TCP
    Host Port:      0/TCP
    State:          Running
      Started:      Thu, 17 Feb 2022 16:51:05 -0500
    Ready:          True
    Restart Count:  0
    Limits:
      cpu:     500m
      memory:  128Mi
    Requests:
      cpu:        500m
      memory:     128Mi
    Environment:  <none>
    Mounts:
      /var/run/secrets/kubernetes.io/serviceaccount from kube-api-access-bgsgp (ro)
Conditions:
  Type              Status
  Initialized       True 
  Ready             True 
  ContainersReady   True 
  PodScheduled      True 
Volumes:
  kube-api-access-bgsgp:
    Type:                    Projected (a volume that contains injected data from multiple sources)
    TokenExpirationSeconds:  3607
    ConfigMapName:           kube-root-ca.crt
    ConfigMapOptional:       <nil>
    DownwardAPI:             true
QoS Class:                   Guaranteed
Node-Selectors:              <none>
Tolerations:                 node.kubernetes.io/not-ready:NoExecute op=Exists for 300s
                             node.kubernetes.io/unreachable:NoExecute op=Exists for 300s
Events:
  Type    Reason     Age   From               Message
  ----    ------     ----  ----               -------
  Normal  Scheduled  34s   default-scheduler  Successfully assigned default/nginx-deployment-67d4bdd6f5-w6kd7 to kube-worker-1
  Normal  Pulling    31s   kubelet            Pulling image "nginx"
  Normal  Pulled     30s   kubelet            Successfully pulled image "nginx" in 1.146417389s
  Normal  Created    30s   kubelet            Created container nginx
  Normal  Started    30s   kubelet            Started container nginx
```

--------------------------------

### Example IPv6 DNS configuration output

Source: https://kubernetes.io/docs/concepts/_print

Sample output showing how DNS settings appear for an IPv6-enabled Pod.

```text
nameserver 2001:db8:30::a
search default.svc.cluster-domain.example svc.cluster-domain.example cluster-domain.example
options ndots:5
```

--------------------------------

### Start a pod with overridden spec

Source: https://kubernetes.io/docs/reference/_print

Start a pod and overload its spec with values parsed from JSON using the `--overrides` flag.

```bash
kubectl run nginx --image=nginx --overrides='{ "apiVersion": "v1", "spec": { ... } }'
```

--------------------------------

### Create a Deployment using kubectl apply

Source: https://kubernetes.io/docs/tasks/manage-kubernetes-objects/update-api-object-kubectl-patch

Apply the Deployment configuration defined in a YAML file to create the resources in the Kubernetes cluster.

```bash
kubectl apply -f https://k8s.io/examples/application/deployment-patch.yaml

```

--------------------------------

### Expose Deployment with NodePort Service

Source: https://kubernetes.io/docs/tasks/access-application-cluster/_print

Creates a Kubernetes Service of type NodePort named 'example-service' to expose the 'hello-world' Deployment.

```bash
kubectl expose deployment hello-world --type=NodePort --name=example-service

```

--------------------------------

### Create and verify the Pod

Source: https://kubernetes.io/docs/tasks/configure-pod-container/resize-container-resources

Commands to create the Pod and inspect its initial resource configuration.

```bash
kubectl create -f pod-resize.yaml -n qos-example
```

```bash
# Wait a moment for the pod to be running
kubectl get pod resize-demo --output=yaml -n qos-example
```

--------------------------------

### Example output for containerd runtime

Source: https://kubernetes.io/docs/tasks/administer-cluster/migrating-from-dockershim/find-out-runtime-you-use

Sample output showing nodes running with the containerd runtime.

```text
NAME         STATUS   VERSION   CONTAINER-RUNTIME
node-1       Ready    v1.19.6   containerd://1.4.1
node-2       Ready    v1.19.6   containerd://1.4.1
node-3       Ready    v1.19.6   containerd://1.4.1
```

--------------------------------

### ValidatingAdmissionPolicy Example

Source: https://kubernetes.io/docs/reference/_print

This example demonstrates a ValidatingAdmissionPolicy that enforces image naming conventions based on namespace labels.

```APIDOC
## ValidatingAdmissionPolicy: image-matches-namespace-environment.policy.example.com

### Description
This policy ensures that container images used in deployments adhere to a naming convention based on the 'environment' label of the namespace. It allows images to contain 'example.com' only if they are prefixed with the namespace's environment label (e.g., 'prod.example.com/nginx'). Deployments are exempt if they have an 'exempt: "true"' label.

### Method
N/A (This is a Kubernetes resource definition, not an API endpoint)

### Endpoint
N/A

### Parameters
N/A

### Request Example
```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingAdmissionPolicy
metadata:
  name: "image-matches-namespace-environment.policy.example.com"
spec:
  failurePolicy: Fail
  matchConstraints:
    resourceRules:
    - apiGroups:   ["apps"]
      apiVersions: ["v1"]
      operations:  ["CREATE", "UPDATE"]
      resources:   ["deployments"]
  variables:
  - name: environment
    expression: "'environment' in namespaceObject.metadata.labels ? namespaceObject.metadata.labels['environment'] : 'prod'"
  - name: exempt
    expression: "'exempt' in object.metadata.labels && object.metadata.labels['exempt'] == 'true'"
  - name: containers
    expression: "object.spec.template.spec.containers"
  - name: containersToCheck
    expression: "variables.containers.filter(c, c.image.contains('example.com/'))"
  validations:
  - expression: "variables.exempt || variables.containersToCheck.all(c, c.image.startsWith(variables.environment + '.'))"
    messageExpression: "'only ' + variables.environment + ' images are allowed in namespace ' + namespaceObject.metadata.name"
```

### Response
N/A (This is a resource definition, not a request/response API)

### Error Handling
- Rejection of deployment creation/update if image naming conventions are violated and the deployment is not exempt.
- Error message format: `error: failed to create deployment: deployments.apps \"invalid\" is forbidden: ValidatingAdmissionPolicy 'image-matches-namespace-environment.policy.example.com' with binding 'demo-binding-test.example.com' denied request: only prod images are allowed in namespace default`
```

--------------------------------

### KubeProxyConfiguration Example

Source: https://kubernetes.io/docs/reference/config-api/kubeadm-config.v1beta4

Basic structure for Kube-proxy configuration.

```yaml
apiVersion: kubeproxy.config.k8s.io/v1alpha1
kind: KubeProxyConfiguration
# kube-proxy specific options here

```

--------------------------------

### Default ServiceCIDR Example

Source: https://kubernetes.io/docs/reference/_print

An example output showing the default ServiceCIDR object and its assigned CIDR range.

```text
NAME         CIDRS         AGE
kubernetes   10.96.0.0/28  17m
```

--------------------------------

### Docker Run Command

Source: https://kubernetes.io/docs/reference/kubectl/_print

Example of a docker run command.

```bash
docker run -d --restart=always -e DOMAIN=cluster --name nginx-app -p 80:80 nginx
```

--------------------------------

### Create a TLS secret example

Source: https://kubernetes.io/docs/reference/_print

Example command to create a TLS secret named tls-secret using specific certificate and key files.

```bash
  # Create a new TLS secret named tls-secret with the given key pair
  kubectl create secret tls tls-secret --cert=path/to/tls.crt --key=path/to/tls.key
```

--------------------------------

### Using RawExtension for Driver Configuration

Source: https://kubernetes.io/docs/reference/kubernetes-api/extend-resources/device-class-v1

Demonstrates how to use RawExtension to pass driver-specific configuration parameters. This is useful for abstracting driver details and allowing flexible configuration.

```go
type MyAPIObject struct { runtime.TypeMeta `json:",inline"` MyPlugin runtime.Object `json:"myPlugin"` }
type PluginA struct { AOption string `json:"aOption"` }
```

```go
type MyAPIObject struct { runtime.TypeMeta `json:",inline"` MyPlugin runtime.RawExtension `json:"myPlugin"` }
type PluginA struct { AOption string `json:"aOption"` }
```

--------------------------------

### Download Install-Containerd.ps1 script

Source: https://kubernetes.io/docs/tasks/administer-cluster/kubeadm/_print

Use this command to download the PowerShell script for installing containerd. Ensure you have curl installed.

```powershell
curl.exe -LO https://raw.githubusercontent.com/kubernetes-sigs/sig-windows-tools/master/hostprocess/Install-Containerd.ps1
```

--------------------------------

### Install crictl

Source: https://kubernetes.io/docs/setup/production-environment/tools/_print

Installs the crictl tool, which is required for interacting with the Container Runtime Interface (CRI). This is optional for kubeadm itself.

```bash
CRICTL_VERSION="v1.31.0"
ARCH="amd64"
curl -L "https://github.com/kubernetes-sigs/cri-tools/releases/download/${CRICTL_VERSION}/crictl-${CRICTL_VERSION}-linux-${ARCH}.tar.gz" | sudo tar -C $DOWNLOAD_DIR -xz

```

--------------------------------

### Kubernetes Deployment Creation Output

Source: https://kubernetes.io/docs/concepts/overview/working-with-objects/_print

Example output from the `kubectl apply` command indicating successful creation of a Deployment resource.

```bash
deployment.apps/nginx-deployment created

```

--------------------------------

### kubeadm join phase kubelet-start

Source: https://kubernetes.io/docs/reference/setup-tools/kubeadm/kubeadm-join-phase

Writes kubelet settings, certificates and restarts the kubelet.

```APIDOC
## kubeadm join phase kubelet-start

### Description
Using this phase you can write the kubelet settings, certificates and (re)start the kubelet.

### Method
Not applicable (CLI command)

### Endpoint
Not applicable (CLI command)

### Options
- **--config** (string) - Path to a kubeadm configuration file.
- **--dry-run** - Don't apply any changes; just output what would be done.
- **-h, --help** - help for kubelet-start.
- **--rootfs** (string) - The path to the 'real' host root filesystem. This will cause kubeadm to chroot into the provided path.

### Synopsis
```
kubeadm join phase kubelet-start [flags]
```
```

--------------------------------

### Examples for kubectl api-resources

Source: https://kubernetes.io/docs/reference/_print

Common usage patterns for listing and filtering API resources.

```bash
  # Print the supported API resources
  kubectl api-resources
  
  # Print the supported API resources with more information
  kubectl api-resources -o wide
  
  # Print the supported API resources sorted by a column
  kubectl api-resources --sort-by=name
  
  # Print the supported namespaced resources
  kubectl api-resources --namespaced=true
  
  # Print the supported non-namespaced resources
  kubectl api-resources --namespaced=false
  
  # Print the supported API resources with a specific APIGroup
  kubectl api-resources --api-group=rbac.authorization.k8s.io
```

--------------------------------

### Create a Deployment

Source: https://kubernetes.io/docs/tasks/_print

Deploys a set of Pods using the serve_hostname image.

```bash
kubectl create deployment hostnames --image=registry.k8s.io/serve_hostname
```

--------------------------------

### Expose Kubernetes Resources as Services

Source: https://kubernetes.io/docs/reference/kubectl/generated/_print

Examples of using kubectl expose to create services for different resource types and configurations.

```bash
  # Create a service for a replicated nginx, which serves on port 80 and connects to the containers on port 8000
  kubectl expose rc nginx --port=80 --target-port=8000
  
  # Create a service for a replication controller identified by type and name specified in "nginx-controller.yaml", which serves on port 80 and connects to the containers on port 8000
  kubectl expose -f nginx-controller.yaml --port=80 --target-port=8000
  
  # Create a service for a pod valid-pod, which serves on port 444 with the name "frontend"
  kubectl expose pod valid-pod --port=444 --name=frontend
  
  # Create a second service based on the above service, exposing the container port 8443 as port 443 with the name "nginx-https"
  kubectl expose service nginx --port=443 --target-port=8443 --name=nginx-https
  
  # Create a service for a replicated streaming application on port 4100 balancing UDP traffic and named 'video-stream'.
  kubectl expose rc streamer --port=4100 --protocol=UDP --name=video-stream
  
  # Create a service for a replicated nginx using replica set, which serves on port 80 and connects to the containers on port 8000
  kubectl expose rs nginx --port=80 --target-port=8000
  
  # Create a service for an nginx deployment, which serves on port 80 and connects to the containers on port 8000
  kubectl expose deployment nginx --port=80 --target-port=8000
```

--------------------------------

### Configuration file output

Source: https://kubernetes.io/docs/tasks/access-application-cluster/configure-access-multiple-clusters

Example structure of a Kubernetes configuration file containing clusters, contexts, and user credentials.

```yaml
apiVersion: v1
clusters:
- cluster:
    certificate-authority: fake-ca-file
    server: https://1.2.3.4
  name: development
- cluster:
    insecure-skip-tls-verify: true
    server: https://5.6.7.8
  name: test
contexts:
- context:
    cluster: development
    namespace: frontend
    user: developer
  name: dev-frontend
- context:
    cluster: development
    namespace: storage
    user: developer
  name: dev-storage
- context:
    cluster: test
    namespace: default
    user: experimenter
  name: exp-test
current-context: ""
kind: Config
preferences: {}
users:
- name: developer
  user:
    client-certificate: fake-cert-file
    client-key: fake-key-file
- name: experimenter
  user:
    # Documentation note (this comment is NOT part of the command output).
    # Storing passwords in Kubernetes client config is risky.
    # A better alternative would be to use a credential plugin
    # and store the credentials separately.
    # See https://kubernetes.io/docs/reference/access-authn-authz/authentication/#client-go-credential-plugins
    password: some-password
    username: exp
```

```yaml
apiVersion: v1
clusters:
- cluster:
    certificate-authority: fake-ca-file
    server: https://1.2.3.4
  name: development
contexts:
- context:
    cluster: development
    namespace: frontend
    user: developer
  name: dev-frontend
current-context: dev-frontend
kind: Config
preferences: {}
users:
- name: developer
  user:
    client-certificate: fake-cert-file
    client-key: fake-key-file
```

--------------------------------

### Example Encryption Configuration

Source: https://kubernetes.io/docs/tasks/administer-cluster/encrypt-data

A template for the encryption provider configuration file. This example is for illustrative purposes only and should not be used in production.

```yaml
---
#
# CAUTION: this is an example configuration.
#          Do not use this for your own cluster!
```

--------------------------------

### MongoDB Deployment Status Output

Source: https://kubernetes.io/docs/tasks/_print

Example output showing the status of the MongoDB deployment, indicating it is ready.

```bash
NAME    READY   UP-TO-DATE   AVAILABLE   AGE
mongo   1/1     1            1           2m21s
```

--------------------------------

### Example PersistentVolumeClaim Manifest

Source: https://kubernetes.io/docs/tasks/administer-cluster/change-pv-access-mode-readwriteoncepod

This is an example YAML manifest for a PersistentVolumeClaim. It specifies the desired storage size and access mode.

```yaml
# cat-pictures-pvc.yaml
kind: PersistentVolumeClaim
apiVersion: v1
metadata:
  name: cat-pictures-pvc
spec:
  accessModes:
  - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi

```

--------------------------------

### Example deployment configuration

Source: https://kubernetes.io/docs/tasks/manage-kubernetes-objects/declarative-config

A sample Deployment manifest used for creating or updating Kubernetes resources.

```yaml
kind: Deployment
metadata:
  annotations:
    # ...
    # This is the json representation of simple_deployment.yaml
    # It was written by kubectl apply when the object was created
    kubectl.kubernetes.io/last-applied-configuration: |
      {"apiVersion":"apps/v1","kind":"Deployment",
      "metadata":{"annotations":{},"name":"nginx-deployment","namespace":"default"},
      "spec":{"minReadySeconds":5,"selector":{"matchLabels":{"app":nginx}},"template":{"metadata":{"labels":{"app":"nginx"}},
      "spec":{"containers":[{"image":"nginx:1.14.2","name":"nginx",
      "ports":[{"containerPort":80}]}]}}}}}      
  # ...
spec:
  # ...
  minReadySeconds: 5
  selector:
    matchLabels:
      # ...
      app: nginx
  template:
    metadata:
      # ...
      labels:
        app: nginx
    spec:
      containers:
      - image: nginx:1.14.2
        # ...
        name: nginx
        ports:
        - containerPort: 80
        # ...
      # ...
    # ...
  # ...
```

--------------------------------

### Pod event output

Source: https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-probes

Example output showing successful Pod scheduling and container startup.

```text
Type    Reason     Age   From               Message
----    ------     ----  ----               -------
Normal  Scheduled  11s   default-scheduler  Successfully assigned default/liveness-exec to node01
Normal  Pulling    9s    kubelet, node01    Pulling image "registry.k8s.io/busybox:1.27.2"
Normal  Pulled     7s    kubelet, node01    Successfully pulled image "registry.k8s.io/busybox:1.27.2"
Normal  Created    7s    kubelet, node01    Created container liveness
Normal  Started    7s    kubelet, node01    Started container liveness
```

--------------------------------

### Custom Resource Example

Source: https://kubernetes.io/docs/reference/using-api/server-side-apply

An example of a custom resource with managed fields, illustrating the structure before a potential topology change.

```yaml
---
apiVersion: example.com/v1
kind: Foo
metadata:
  name: foo-sample
  managedFields:
  - manager: "manager-one"
    operation: Apply
    apiVersion: example.com/v1
    fieldsType: FieldsV1
    fieldsV1:
      f:spec:
        f:data: {}
spec:
  data:
    key1: val1
    key2: val2

```

--------------------------------

### Create and Delete Pods via kubectl

Source: https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap

Commands to manage the lifecycle of the example Pods.

```bash
kubectl create -f https://kubernetes.io/examples/pods/pod-configmap-volume.yaml
```

```bash
kubectl delete pod dapi-test-pod --now
```

--------------------------------

### Pod List Output

Source: https://kubernetes.io/docs/tasks/run-application/_print

Example output showing the list of running pods associated with the deployment.

```text
NAME                                READY     STATUS    RESTARTS   AGE
nginx-deployment-1771418926-7o5ns   1/1       Running   0          16h
nginx-deployment-1771418926-r18az   1/1       Running   0          16h
```

--------------------------------

### kubectl create deployment syntax

Source: https://kubernetes.io/docs/reference/kubectl/generated/kubectl_create/kubectl_create_deployment

Basic syntax for creating a deployment with a specified name and image.

```bash
kubectl create deployment NAME --image=image -- [COMMAND] [args...]
```

--------------------------------

### Deployment Status Output

Source: https://kubernetes.io/docs/tutorials/kubernetes-basics/scale/scale-intro

Example output showing the status of a deployment.

```text
NAME                  READY   UP-TO-DATE   AVAILABLE   AGE
kubernetes-bootcamp   1/1     1            1           11m
```

--------------------------------

### Watch Pod Lifecycle Output

Source: https://kubernetes.io/docs/tutorials/stateful-application/basic-stateful-set

Example output showing the sequential creation of pods.

```text
NAME      READY     STATUS    RESTARTS   AGE
web-0     1/1       Running   0          2h
web-1     1/1       Running   0          2h
NAME      READY     STATUS    RESTARTS   AGE
web-2     0/1       Pending   0         0s
web-2     0/1       Pending   0         0s
web-2     0/1       ContainerCreating   0         0s
web-2     1/1       Running   0         19s
web-3     0/1       Pending   0         0s
web-3     0/1       Pending   0         0s
web-3     0/1       ContainerCreating   0         0s
web-3     1/1       Running   0         18s
web-4     0/1       Pending   0         0s
web-4     0/1       Pending   0         0s
web-4     0/1       ContainerCreating   0         0s
web-4     1/1       Running   0         19s
```

--------------------------------

### Start a single-node etcd cluster

Source: https://kubernetes.io/docs/tasks/_print

Run this command to initialize a single-node etcd instance for testing purposes.

```bash
etcd --listen-client-urls=http://$PRIVATE_IP:2379 \
   --advertise-client-urls=http://$PRIVATE_IP:2379
```

--------------------------------

### Apply and Manage Resources

Source: https://kubernetes.io/docs/tasks/_print

Commands to apply manifests and inspect Pod resource configurations.

```bash
kubectl apply -f https://k8s.io/examples/admin/resource/memory-defaults.yaml --namespace=default-mem-example
```

```bash
kubectl apply -f https://k8s.io/examples/admin/resource/memory-defaults-pod.yaml --namespace=default-mem-example
```

```bash
kubectl get pod default-mem-demo --output=yaml --namespace=default-mem-example
```

```bash
kubectl delete pod default-mem-demo --namespace=default-mem-example
```

```bash
kubectl apply -f https://k8s.io/examples/admin/resource/memory-defaults-pod-2.yaml --namespace=default-mem-example
```

```bash
kubectl get pod default-mem-demo-2 --output=yaml --namespace=default-mem-example
```

```bash
kubectl apply -f https://k8s.io/examples/admin/resource/memory-defaults-pod-3.yaml --namespace=default-mem-example
```

```bash
kubectl get pod default-mem-demo-3 --output=yaml --namespace=default-mem-example
```

--------------------------------

### Example Kubelet Systemd Service Unit Configuration

Source: https://kubernetes.io/docs/reference/_print

A complete systemd unit file example for the kubelet, including watchdog configuration and restart policies. Ensure `WatchdogSec` is set appropriately for your environment.

```ini
[Unit]
Description=kubelet: The Kubernetes Node Agent
Documentation=https://kubernetes.io/docs/home/
Wants=network-online.target
After=network-online.target

[Service]
ExecStart=/usr/bin/kubelet
# Configures the watchdog timeout
WatchdogSec=30s
Restart=on-failure
StartLimitInterval=0
RestartSec=10

[Install]
WantedBy=multi-user.target

```

--------------------------------

### Run and Expose Nginx Deployment

Source: https://kubernetes.io/docs/reference/kubectl/docker-cli-to-kubectl

Use `kubectl create deployment` to start an Nginx pod. Use `kubectl set env` to add environment variables. Use `kubectl expose deployment` to create a service to access the deployment.

```bash
docker run -d --restart=always -e DOMAIN=cluster --name nginx-app -p 80:80 nginx

```

```bash
55c103fa129692154a7652490236fee9be47d70a8dd562281ae7d2f9a339a6db

```

```bash
docker ps

```

```bash
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                NAMES
55c103fa1296        nginx               "nginx -g 'daemon of…"   9 seconds ago       Up 9 seconds        0.0.0.0:80->80/tcp   nginx-app

```

```bash
# start the pod running nginx
kubectl create deployment --image=nginx nginx-app

```

```bash
deployment.apps/nginx-app created

```

```bash
# add env to nginx-app
kubectl set env deployment/nginx-app  DOMAIN=cluster

```

```bash
deployment.apps/nginx-app env updated

```

```bash
# expose a port through with a service
kubectl expose deployment nginx-app --port=80 --name=nginx-http

```

```bash
service "nginx-http" exposed

```

--------------------------------

### Examples of unsetting kubeconfig values

Source: https://kubernetes.io/docs/reference/kubectl/generated/kubectl_config/kubectl_config_unset

Common usage examples for removing the current context or a specific namespace from a context.

```bash
  # Unset the current-context
  kubectl config unset current-context
  
  # Unset namespace in foo context
  kubectl config unset contexts.foo.namespace
```

--------------------------------

### Configure API Server for Certificates

Source: https://kubernetes.io/docs/tasks/administer-cluster/_print

Parameters to add to the API server startup configuration.

```bash
--client-ca-file=/yourdirectory/ca.crt
--tls-cert-file=/yourdirectory/server.crt
--tls-private-key-file=/yourdirectory/server.key
```

--------------------------------

### ValidatingWebhookConfiguration Example

Source: https://kubernetes.io/docs/reference/_print

This is an example of a ValidatingWebhookConfiguration resource. It defines rules for when the webhook should be called, the service endpoint for the webhook, and other configuration details. Replace `<CA_BUNDLE>` with a valid CA bundle.

```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingWebhookConfiguration
metadata:
  name: "pod-policy.example.com"
webhooks:
- name: "pod-policy.example.com"
  rules:
  - apiGroups:
    - ""
    apiVersions:
    - "v1"
    operations:
    - "CREATE"
    resources:
    - "pods"
    scope:
      "Namespaced"
  clientConfig:
    service:
      namespace: "example-namespace"
      name: "example-service"
    caBundle: <CA_BUNDLE>
  admissionReviewVersions: ["v1"]
  sideEffects: None
  timeoutSeconds: 5

```

--------------------------------

### List available plugins

Source: https://kubernetes.io/docs/reference/_print

Commands to display installed plugins, with an option to show only binary names.

```bash
# List all available plugins
  kubectl plugin list
  
  # List only binary names of available plugins without paths
  kubectl plugin list --name-only
```

--------------------------------

### RawExtension Usage Example

Source: https://kubernetes.io/docs/reference/kubernetes-api/_print

Demonstrates how to use RawExtension for handling arbitrary driver-specific configuration parameters in Kubernetes. This involves defining internal and external types and using the runtime.Scheme for conversion.

```go
// Internal package:
type MyAPIObject struct { runtime.TypeMeta `json:",inline"` MyPlugin runtime.Object `json:"myPlugin"` }
type PluginA struct { AOption string `json:"aOption"` }
// External package:
type MyAPIObject struct { runtime.TypeMeta `json:",inline"` MyPlugin runtime.RawExtension `json:"myPlugin"` }
type PluginA struct { AOption string `json:"aOption"` }
// On the wire, the JSON will look something like this:
{
  "kind":"MyAPIObject", 
  "apiVersion":"v1", 
  "myPlugin": {
    "kind":"PluginA", 
    "aOption":"foo", 
  },
}
So what happens? Decode first uses json or yaml to unmarshal the serialized data into your external MyAPIObject. That causes the raw JSON to be stored, but not unpacked. The next step is to copy (using pkg/conversion) into the internal struct. The runtime package's DefaultScheme has conversion functions installed which will unpack the JSON stored in RawExtension, turning it into the correct object type, and storing it in the Object. (TODO: In the case where the object is of an unknown type, a runtime.Unknown object will be created and stored.)
```

--------------------------------

### Structured logging format examples

Source: https://kubernetes.io/docs/concepts/_print

Examples of structured log messages which use key-value pairs for programmatic extraction.

```text
<klog header> "<message>" <key1>="<value1>" <key2>="<value2>" ...
```

```text
I1025 00:15:15.525108       1 controller_utils.go:116] "Pod status updated" pod="kube-system/kubedns" status="ready"
```

```text
I1025 00:15:15.525108       1 example.go:116] "Example" data="This is text with a line break\nand \"quotation marks\"." someInt=1 someFloat=0.1 someStruct={StringField: First line,
second line.}
```

--------------------------------

### Example remote configuration output

Source: https://kubernetes.io/docs/contribute/new-content/open-a-pr

Shows the expected output format when verifying remote repositories.

```text
origin	git@github.com:<github_username>/website.git (fetch)
origin	git@github.com:<github_username>/website.git (push)
upstream	https://github.com/kubernetes/website.git (fetch)
upstream	https://github.com/kubernetes/website.git (push)
```

--------------------------------

### Install kubectl to Local User Directory

Source: https://kubernetes.io/docs/tasks/_print

Install kubectl to a local user directory if root access is not available. This requires making the binary executable and moving it to a directory in your PATH.

```bash
chmod +x kubectl
mkdir -p ~/.local/bin
mv ./kubectl ~/.local/bin/kubectl
```

--------------------------------

### SelfSubjectReview JSON Response Example

Source: https://kubernetes.io/docs/reference/access-authn-authz/authentication

Example of a SelfSubjectReview response containing user identity, UID, and extra attributes.

```json
{
  "apiVersion": "authentication.k8s.io/v1",
  "kind": "SelfSubjectReview",
  "status": {
    "userInfo": {
      "username": "janedoe@example.com",
      "groups": [
        "viewers",
        "editors",
        "system:authenticated"
      ],
      "uid": "000042",
      "extra": {
        "firstName": [
          "Jane"
        ],
        "familyName": [
          "Doe"
        ],
        "projectAssignments": [
          "web-frontend",
          "ai-training-proof-of-concept"
        ],
      }
    }
  }
}
```

--------------------------------

### Set up unencrypted swap

Source: https://kubernetes.io/docs/tutorials/cluster-management/provision-swap-memory

Creates a standard 4GiB unencrypted swap file.

```bash
# Allocate storage and restrict access
fallocate --length 4GiB /swapfile
chmod 600 /swapfile

# Format the swap space
mkswap /swapfile

# Activate the swap space for paging
swapon /swapfile
```

--------------------------------

### Signer-linked ClusterTrustBundle Example

Source: https://kubernetes.io/docs/reference/access-authn-authz/certificate-signing-requests

Example of a signer-linked ClusterTrustBundle. These are maintained by a signer-specific controller and require specific naming and authorization.

```yaml
apiVersion: certificates.k8s.io/v1alpha1
kind: ClusterTrustBundle
metadata:
  name: example.com:mysigner:foo
spec:
  signerName: example.com/mysigner
  trustBundle: "<... PEM data ...>"
```

--------------------------------

### ResourceSlice Example Output

Source: https://kubernetes.io/docs/tasks/_print

An example output of a ResourceSlice specification, showing device attributes, capacity, driver information, and node name. This helps understand the structure of device information available for selection.

```yaml
apiVersion: resource.k8s.io/v1
kind: ResourceSlice
# lines omitted for clarity
spec:
  devices:
  - attributes:
      type:
        string: gpu
    capacity:
      memory:
        value: 64Gi
    name: gpu-0
  - attributes:
      type:
        string: gpu
    capacity:
      memory:
        value: 64Gi
    name: gpu-1
  driver: driver.example.com
  nodeName: cluster-1-node-1
# lines omitted for clarity

```

--------------------------------

### Explain Resource with Different Output Format

Source: https://kubernetes.io/docs/reference/_print

This command retrieves resource documentation and renders it in the plaintext-openapiv2 format.

```bash
kubectl explain deployment --output=plaintext-openapiv2
```

--------------------------------

### Example TokenReview Output

Source: https://kubernetes.io/docs/reference/access-authn-authz/service-accounts-admin

This is an example of the output generated by the TokenReview API, showing authentication status and user details.

```yaml
apiVersion: authentication.k8s.io/v1
kind: TokenReview
metadata:
  creationTimestamp: null
spec:
  token: <token>
status:
  audiences:
  - https://kubernetes.default.svc.cluster.local
  authenticated: true
  user:
    extra:
      authentication.kubernetes.io/credential-id:
      - JTI=7ee52be0-9045-4653-aa5e-0da57b8dccdc
      authentication.kubernetes.io/node-name:
      - kind-control-plane
      authentication.kubernetes.io/node-uid:
      - 497e9d9a-47aa-4930-b0f6-9f2fb574c8c6
      authentication.kubernetes.io/pod-name:
      - test-pod
      authentication.kubernetes.io/pod-uid:
      - e87dbbd6-3d7e-45db-aafb-72b24627dff5
    groups:
    - system:serviceaccounts
    - system:serviceaccounts:default
    - system:authenticated
    uid: f8b4161b-2e2b-11e9-86b7-2afc33b31a7e
    username: system:serviceaccount:default:my-sa

```

--------------------------------

### Describe Service

Source: https://kubernetes.io/docs/tasks/_print

This command displays detailed information about the created 'example-service', including its NodePort.

```bash
kubectl describe services example-service

```

--------------------------------

### ImageReview request payload example

Source: https://kubernetes.io/docs/reference/access-authn-authz/admission-controllers

Example of the JSON serialized ImageReview object sent by the API server to the webhook.

```json
{
  "apiVersion": "imagepolicy.k8s.io/v1alpha1",
  "kind": "ImageReview",
  "spec": {
    "containers": [
      {
        "image": "myrepo/myimage:v1"
      },
      {
        "image": "myrepo/myimage@sha256:beb6bd6a68f114c1dc2ea4b28db81bdf91de202a9014972bec5e4d9171d90ed"
      }
    ],
    "annotations": {
      "mycluster.image-policy.k8s.io/ticket-1234": "break-glass"
    },
    "namespace": "mynamespace"
  }
}

```

--------------------------------

### Job Status Example

Source: https://kubernetes.io/docs/concepts/workloads/controllers/_print

An example of a Job's status in YAML format, showing its current state and configuration.

```yaml
apiVersion: batch/v1
kind: Job

```

--------------------------------

### Example legacy Pod DNS record

Source: https://kubernetes.io/docs/concepts/services-networking/_print

A concrete example of a legacy DNS record for a Pod in the default namespace.

```text
172-17-0-3.default.pod.cluster.local
```

--------------------------------

### Create Hello World Deployment

Source: https://kubernetes.io/docs/tasks/_print

This YAML defines a Deployment for a Hello World application with two replicas. Ensure this file is saved as hello-application.yaml.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: hello-world
spec:
  selector:
    matchLabels:
      run: load-balancer-example
  replicas: 2
  template:
    metadata:
      labels:
        run: load-balancer-example
    spec:
      containers:
        - name: hello-world
          image: us-docker.pkg.dev/google-samples/containers/gke/hello-app:2.0
          ports:
            - containerPort: 8080
              protocol: TCP

```

--------------------------------

### Upgrade Kubeadm on Windows

Source: https://kubernetes.io/docs/tasks/_print

Downloads and installs a specific version of kubeadm.exe on a Windows node. Replace 1.35.0 with your desired version and <path-to-kubeadm.exe> with the target installation path.

```powershell
# replace 1.35.0 with your desired version
curl.exe -Lo <path-to-kubeadm.exe>  "https://dl.k8s.io/v1.35.0/bin/windows/amd64/kubeadm.exe"
```

--------------------------------

### JSON Log Format Example

Source: https://kubernetes.io/docs/concepts/cluster-administration/system-logs

Example of a pretty-printed JSON log entry used when --logging-format=json is enabled.

```json
{
   "ts": 1580306777.04728,
   "v": 4,
   "msg": "Pod status updated",
   "pod":{
      "name": "nginx-1",
      "namespace": "default"
   },
   "status": "ready"
}
```

--------------------------------

### Apply and Verify Frontend Deployment

Source: https://kubernetes.io/docs/tutorials/stateless-application/_print

Commands to deploy the frontend and verify that the replicas are running.

```bash
kubectl apply -f https://k8s.io/examples/application/guestbook/frontend-deployment.yaml
```

```bash
kubectl get pods -l app=guestbook -l tier=frontend
```

--------------------------------

### CEL identifier escaping examples

Source: https://kubernetes.io/docs/reference/_print

Examples showing how to escape specific property names when accessing them in CEL expressions.

```CEL
self.__namespace__ > 0
```

```CEL
self.x__dash__prop > 0
```

```CEL
self.redact__underscores__d > 0
```

```CEL
self.startsWith('kube')
```

--------------------------------

### Example Pod Description Output

Source: https://kubernetes.io/docs/concepts/configuration/manage-resources-containers

This is an example output from `kubectl describe pod`. Pay attention to `Limits`, `State`, `Last State` (specifically `Reason` and `Exit Code`), `Restart Count`, and `Events` for clues about termination.

```yaml
Name:                           simmemleak-hra99
Namespace:                      default
Image(s):                       saadali/simmemleak
Node:                           kubernetes-node-tf0f/10.240.216.66
Labels:                         name=simmemleak
Status:                         Running
Reason:
Message:
IP:                             10.244.2.75
Containers:
  simmemleak:
    Image:  saadali/simmemleak:latest
    Limits:
      cpu:          100m
      memory:       50Mi
    State:          Running
      Started:      Tue, 07 Jul 2019 12:54:41 -0700
    Last State:     Terminated
      Reason:       OOMKilled
      Exit Code:    137
      Started:      Fri, 07 Jul 2019 12:54:30 -0700
      Finished:     Fri, 07 Jul 2019 12:54:33 -0700
    Ready:          False
    Restart Count:  5
Conditions:
  Type      Status
  Ready     False
Events:
  Type    Reason     Age   From               Message
  ----    ------     ----  ----               -------
  Normal  Scheduled  42s   default-scheduler  Successfully assigned simmemleak-hra99 to kubernetes-node-tf0f
  Normal  Pulled     41s   kubelet            Container image "saadali/simmemleak:latest" already present on machine
  Normal  Created    41s   kubelet            Created container simmemleak
  Normal  Started    40s   kubelet            Started container simmemleak
  Normal  Killing    32s   kubelet            Killing container with id ead3fb35-5cf5-44ed-9ae1-488115be66c6: Need to kill Pod

```

--------------------------------

### Install Bash with Homebrew

Source: https://kubernetes.io/docs/tasks/_print

If your Bash version is too old, use Homebrew to install or upgrade to a compatible version (4.1+).

```bash
brew install bash

```

--------------------------------

### Create and verify Deployment

Source: https://kubernetes.io/docs/tasks/manage-kubernetes-objects/update-api-object-kubectl-patch

Commands to apply the deployment manifest and list the resulting pods.

```bash
kubectl apply -f https://k8s.io/examples/application/deployment.yaml
```

```bash
kubectl get pods -l app=nginx
```

--------------------------------

### Create and Configure a Deployment

Source: https://kubernetes.io/docs/reference/_print

Commands to initialize a deployment and update environment variables for a running application.

```bash
kubectl create deployment --image=nginx nginx-app
```

```bash
kubectl set env deployment/nginx-app  DOMAIN=cluster
```

--------------------------------

### Create Ingress resources

Source: https://kubernetes.io/docs/reference/generated/kubectl/kubectl

Examples of creating Ingress resources with different rules, annotations, TLS secrets, and default backends.

```bash
kubectl create ingress simple --rule="foo.com/bar=svc1:8080,tls=my-cert"
```

```bash
kubectl create ingress catch-all --class=otheringress --rule="/path=svc:port"
```

```bash
kubectl create ingress annotated --class=default --rule="foo.com/bar=svc:port" \
--annotation ingress.annotation1=foo \
--annotation ingress.annotation2=bla
```

```bash
kubectl create ingress multipath --class=default \
--rule="foo.com/=svc:port" \
--rule="foo.com/admin/=svcadmin:portadmin"
```

```bash
kubectl create ingress ingress1 --class=default \
--rule="foo.com/path*=svc:8080" \
--rule="bar.com/admin*=svc2:http"
```

```bash
kubectl create ingress ingtls --class=default \
--rule="foo.com/=svc:https,tls" \
--rule="foo.com/path/subpath*=othersvc:8080"
```

```bash
kubectl create ingress ingsecret --class=default \
--rule="foo.com/*=svc:8080,tls=secret1"
```

```bash
kubectl create ingress ingdefault --class=default \
--default-backend=defaultsvc:http \
--rule="foo.com/*=svc:8080,tls=secret1"
```

--------------------------------

### Example Pod Status Output

Source: https://kubernetes.io/docs/tasks/_print

Sample output showing the status of Pods after the Job has executed.

```text
NAME                                            READY   STATUS      RESTARTS   AGE
job-backoff-limit-per-index-failindex-0-4g4cm   0/1     Error       0          4s
job-backoff-limit-per-index-failindex-0-fkdzq   0/1     Error       0          15s
job-backoff-limit-per-index-failindex-1-2bgdj   0/1     Error       0          15s
job-backoff-limit-per-index-failindex-2-vs6lt   0/1     Completed   0          11s
job-backoff-limit-per-index-failindex-3-s7s47   0/1     Completed   0          6s
```