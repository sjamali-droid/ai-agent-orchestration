# Helm

> **Used by**: DevSecOps
> **What to paste**: chart structure, values.yaml patterns, template functions, hooks, chart dependencies, helm CLI commands.
> **Source**: https://helm.sh/docs/

<!-- PASTE CONTEXT BELOW THIS LINE -->


### Helm SDK: Main Execution Flow (Go)

Source: https://helm.sh/docs/sdk/examples

Demonstrates a complete Helm SDK workflow including pulling a chart, installing it, listing releases, upgrading the release with new values, and finally uninstalling it. This example serves as a practical guide to using the Helm SDK for managing application deployments.

```Go
package main

import (
	"bufio"
	"context"
	"fmt"
	"log"
	"net/http"
	"os"

	"helm.sh/helm/v4/pkg/action"
	"helm.sh/helm/v4/pkg/cli"
	"helm.sh/helm/v4/pkg/registry"
)

var helmDriver string = os.Getenv("HELM_DRIVER")

func initActionConfig(settings *cli.EnvSettings, logger *log.Logger) (*action.Configuration, error) {
	return initActionConfigList(settings, logger, false)
}

func initActionConfigList(settings *cli.EnvSettings, logger *log.Logger, allNamespaces bool) (*action.Configuration, error) {

	actionConfig := new(action.Configuration)

	namespace := func() string {
		// For list action, you can pass an empty string instead of settings.Namespace() to list
		// all namespaces
		if allNamespaces {
			return ""
		}
		return settings.Namespace()
	}()

	if err := actionConfig.Init(
		settings.RESTClientGetter(),
		namespace,
		helmdriver);
		err != nil {
		return nil, err
	}

	return actionConfig, nil
}

func newRegistryClient(settings *cli.EnvSettings, certFile, keyFile, caFile string, insecureSkipTLSVerify, plainHTTP bool) (*registry.Client, error) {

	opts := []registry.ClientOption{
		registry.ClientOptDebug(settings.Debug),
		registry.ClientOptEnableCache(true),
		registry.ClientOptWriter(os.Stderr),
		registry.ClientOptCredentialsFile(settings.RegistryConfig),
	}

	if plainHTTP {
		opts = append(opts, registry.ClientOptPlainHTTP())
	}

	if certFile != "" && keyFile != "" || caFile != "" || insecureSkipTLSVerify {
		tlsConf, err := NewTLSConfig(
			WithInsecureSkipVerify(insecureSkipTLSVerify),
			WithCertKeyPairFiles(certFile, keyFile),
			WithCAFile(caFile),
		)
		if err != nil {
			return nil, fmt.Errorf("failed to load client TLS certs: %w", err)
		}

		opts = append(opts, registry.ClientOptHTTPClient(&http.Client{
			Transport: &http.Transport{
				TLSClientConfig: tlsConf,
				Proxy:           http.ProxyFromEnvironment,
			},
		}))
	}

	// Create a new registry client
	registryClient, err := registry.NewClient(opts...)
	if err != nil {
		return nil, fmt.Errorf("failed to initialize registry client: %w", err)
	}

	return registryClient, nil
}

func main() {

	logger := log.Default()

	// For convenience, initialize SDK setting via CLI mechanism
	settings := cli.New()

	// Release name, chart and values
	releaseName := "helm-sdk-example"
	chartRef := "oci://ghcr.io/stefanprodan/charts/podinfo"
	releaseValues := map[string]interface{}{
		"replicaCount": "2",
	}

	// Pull the chart to the local filesystem
	if err := runPull(logger, settings, chartRef, "6.4.1"); err != nil {
		fmt.Printf("failed to run pull: %+v", err)
		os.Exit(1)
	}

	// Install the chart (from the pulled chart local archive)
	if err := runInstall(context.TODO(), logger, settings, releaseName, "./podinfo-6.4.1.tgz", "", releaseValues); err != nil {
		fmt.Printf("failed to run install: %+v", err)
		os.Exit(1)
	}

	// List installed charts
	if err := runList(logger, settings); err != nil {
		fmt.Printf("failed to run list: %+v", err)
		os.Exit(1)
	}

	//
	fmt.Print("Chart installed. Press 'Return' to continue...")
	bufio.NewReader(os.Stdin).ReadBytes('\n')

	// Upgrade to version 6.5.4, updating the replicaCount to three
	releaseValues["replicaCount"] = "3"
	if err := runUpgrade(context.TODO(), logger, settings, releaseName, chartRef, "6.5.4", releaseValues); err != nil {
		fmt.Printf("failed to run upgrade: %+v", err)
		os.Exit(1)
	}

	// List installed charts
	if err := runList(logger, settings); err != nil {
		fmt.Printf("failed to run list: %+v", err)
		os.Exit(1)
	}

	//
	fmt.Print("Chart upgraded. Press 'Return' to continue...")
	bufio.NewReader(os.Stdin).ReadBytes('\n')

	// Uninstall the chart
	if err := runUninstall(logger, settings, releaseName); err != nil {
		fmt.Printf("failed to run uninstall: %+v", err)
		os.Exit(1)
	}
}

```

--------------------------------

### Install Helm using get_helm.sh Script

Source: https://helm.sh/docs/intro/install

Automatically install the latest Helm version by downloading and executing the official installation script. This script fetches and sets up Helm with minimal user intervention.

```bash
curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-4
chmod 700 get_helm.sh
./get_helm.sh
```

```bash
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-4 | bash
```

--------------------------------

### Define a Complex Helm Plugin with Platform Hooks

Source: https://helm.sh/docs/topics/plugins

This example shows a plugin structure with platform-specific commands and lifecycle hooks for installation and updates. It demonstrates how to use platformHooks to trigger scripts based on the operating system.

```yaml
name: myplugin
version: 0.1.0
usage: example plugin
description: example plugin
ignoreFlags: false
platformCommand:
  - command: ${HELM_PLUGIN_DIR}/bin/myplugin
  - os: windows
    command: ${HELM_PLUGIN_DIR}\bin\myplugin.exe
platformHooks:
  install:
    - command: ${HELM_PLUGIN_DIR}/scripts/install.sh
    - os: windows
      command: pwsh
      args:
        - -c
        - ${HELM_PLUGIN_DIR}\scripts\install.ps1
  update:
    - command: ${HELM_PLUGIN_DIR}/scripts/install.sh
      args:
        - -u
    - os: windows
      command: pwsh
      args:
        - -c
        - ${HELM_PLUGIN_DIR}\scripts\install.ps1
        - -Update
```

--------------------------------

### Install and Verify Helm Plugin

Source: https://helm.sh/docs/plugins/developer/tutorial-cli-plugin

Commands to make the script executable, install the plugin in development mode, and verify its installation.

```bash
chmod +x system-info.sh
helm plugin install $HOME/code/helm/plugins/system-info
helm plugin list
helm system-info
```

--------------------------------

### Helm Post-Install Job Hook Example

Source: https://helm.sh/docs/topics/charts_hooks

This example demonstrates a Kubernetes Job manifest configured as a Helm hook that runs after a chart is installed. It includes annotations for defining the hook type, weight, and deletion policy. The job's container uses an Alpine image and a command that sleeps for a duration specified in Helm values.

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: "{{ .Release.Name }}"
  labels:
    app.kubernetes.io/managed-by: {{ .Release.Service | quote }}
    app.kubernetes.io/instance: {{ .Release.Name | quote }}
    app.kubernetes.io/version: {{ .Chart.AppVersion }}
    helm.sh/chart: "{{ .Chart.Name }}-{{ .Chart.Version }}"
  annotations:
    # This is what defines this resource as a hook. Without this line,
    # the job is considered part of the release.
    "helm.sh/hook": post-install
    "helm.sh/hook-weight": "-5"
    "helm.sh/hook-delete-policy": hook-succeeded
spec:
  template:
    metadata:
      name: "{{ .Release.Name }}"
      labels:
        app.kubernetes.io/managed-by: {{ .Release.Service | quote }}
        app.kubernetes.io/instance: {{ .Release.Name | quote }}
        helm.sh/chart: "{{ .Chart.Name }}-{{ .Chart.Version }}"
    spec:
      restartPolicy: Never
      containers:
      - name: post-install-job
        image: "alpine:3.3"
        command: ["/bin/sleep","{{ default "10" .Values.sleepyTime }}"]

```

--------------------------------

### Helm CLI: Install Library Chart

Source: https://helm.sh/docs/topics/library_charts

Attempting to install a library chart directly will result in an error, as they are not designed for standalone installation.

```bash
$ helm install mylibchart mylibchart/
Error: library charts are not installable
```

--------------------------------

### Install and Test Helm Chart

Source: https://helm.sh/docs/topics/chart_tests

Commands to install a Helm chart and then run the defined tests against the deployed release.

```bash
helm install demo demo --namespace default
helm test demo
```

--------------------------------

### Example Provenance File Structure

Source: https://helm.sh/docs/topics/provenance

An example of a .prov file showing the YAML chart data, file checksums, and the PGP signature block.

```yaml
Hash: SHA512

apiVersion: v2
appVersion: "1.16.0"
description: Sample chart
name: mychart
type: application
version: 0.1.0

...
files:
  mychart-0.1.0.tgz: sha256:d31d2f08b885ec696c37c7f7ef106709aaf5e8575b6d3dc5d52112ed29a9cb92
-----BEGIN PGP SIGNATURE-----

wsBcBAEBCgAQBQJdy0ReCRCEO7+YH8GHYgAAfhUIADx3pHHLLINv0MFkiEYpX/Kd
nvHFBNps7hXqSocsg0a9Fi1LRAc3OpVh3knjPfHNGOy8+xOdhbqpdnB+5ty8YopI
mYMWp6cP/Mwpkt7/gP1ecWFMevicbaFH5AmJCBihBaKJE4R1IX49/wTIaLKiWkv2
cR64bmZruQPSW83UTNULtdD7kuTZXeAdTMjAK0NECsCz9/eK5AFggP4CDf7r2zNi
hZsNrzloIlBZlGGns6mUOTO42J/+JojnOLIhI3Psd0HBD2bTlsm/rSfty4yZUs7D
qtgooNdohoyGSzR5oapd7fEvauRQswJxOA0m0V+u9/eyLR0+JcYB8Udi1prnWf8=
=aHfz
-----END PGP SIGNATURE-----
```

--------------------------------

### Install Helm from Binary Release (Linux)

Source: https://helm.sh/docs/intro/install

Manually install Helm by downloading a binary release, unpacking it, and moving the executable to a desired location. This method provides direct control over the Helm version.

```bash
tar -zxvf helm-v4.0.0-linux-amd64.tar.gz
mv linux-amd64/helm /usr/local/bin/helm
```

--------------------------------

### Install a Helm chart with verification

Source: https://helm.sh/docs/topics/provenance

This command installs a Helm chart and verifies its integrity before installation. If verification fails, the installation is aborted, preventing the deployment of potentially compromised charts.

```bash
$ helm install --generate-name --verify mychart-0.1.0.tgz  

```

--------------------------------

### Install Helm Chart using Go SDK

Source: https://helm.sh/docs/sdk/examples

This Go code snippet demonstrates how to install a specified Helm chart for a given release name, version, and values. It handles chart loading, dependency checking and updating, and utilizes the Helm action configuration. Dependencies include the Helm SDK for Go.

```Go
package main

import (
	"context"
	"fmt"
	"log"

	"helm.sh/helm/v4/pkg/action"
	"helm.sh/helm/v4/pkg/chart"
	"helm.sh/helm/v4/pkg/chart/loader"
	"helm.sh/helm/v4/pkg/cli"
	"helm.sh/helm/v4/pkg/downloader"
	"helm.sh/helm/v4/pkg/getter"
)

func runInstall(ctx context.Context, logger *log.Logger, settings *cli.EnvSettings, releaseName string, chartRef string, chartVersion string, releaseValues map[string]interface{}) error {

	actionConfig, err := initActionConfig(settings, logger)
	if err != nil {
		return fmt.Errorf("failed to init action config: %w", err)
	}

	installClient := action.NewInstall(actionConfig)

	installClient.DryRunStrategy = "none"
	installClient.WaitStrategy = "watcher"
	installClient.ReleaseName = releaseName
	installClient.Namespace = settings.Namespace()
	installClient.Version = chartVersion

	registryClient, err := newRegistryClient(
		settings,
		installClient.CertFile,
		installClient.KeyFile,
		installClient.CaFile,
		installClient.InsecureSkipTLSverify,
		installClient.PlainHTTP)
	if err != nil {
		return fmt.Errorf("failed to created registry client: %w", err)
	}
	installClient.SetRegistryClient(registryClient)

	chartPath, err := installClient.ChartPathOptions.LocateChart(chartRef, settings)
	if err != nil {
		return err
	}

	providers := getter.All(settings)

	charter, err := loader.Load(chartPath)
	if err != nil {
		return err
	}

	chartAccessor, err := chart.NewDefaultAccessor(charter)
	if err != nil {
		return fmt.Errorf("error creating chart accessor: %w", err)
	}

	// Check chart dependencies to make sure all are present in /charts
	if chartDependencies := chartAccessor.MetaDependencies(); chartDependencies != nil {
		if err := action.CheckDependencies(charter, chartDependencies); err != nil {
			err = fmt.Errorf("failed to check chart dependencies: %w", err)
			if !installClient.DependencyUpdate {
				return err
			}

			manager := &downloader.Manager{
				Out:              logger.Writer(),
				ChartPath:        chartPath,
				Keyring:          installClient.ChartPathOptions.Keyring,
				SkipUpdate:       false,
				Getters:          providers,
				RepositoryConfig: settings.RepositoryConfig,
				RepositoryCache:  settings.RepositoryCache,
				Debug:            settings.Debug,
				RegistryClient:   installClient.GetRegistryClient(),
			}
			if err := manager.Update(); err != nil {
				return err
			}
			// Reload the chart with the updated Chart.lock file.
			if charter, err = loader.Load(chartPath); err != nil {
				return fmt.Errorf("failed to reload chart after repo update: %w", err)
			}
		}
	}

	_, err = installClient.RunWithContext(ctx, charter, releaseValues)
	if err != nil {
		return fmt.Errorf("failed to run install: %w", err)
	}

	logger.Printf("release created")

	return nil
}

```

--------------------------------

### Helm Install Configuration

Source: https://helm.sh/docs/helm/helm_install

Configuration flags for managing Helm chart installation behavior and resource ownership.

```APIDOC
## HELM INSTALL OPTIONS

### Description
Flags used to control the installation process of Helm charts, including CRD management, schema validation, and resource ownership.

### Parameters
#### Flags
- **--skip-crds** (boolean) - Optional - If set, no CRDs will be installed.
- **--skip-schema-validation** (boolean) - Optional - Disables JSON schema validation.
- **--take-ownership** (boolean) - Optional - Ignore helm annotations and take ownership of existing resources.
- **--timeout** (duration) - Optional - Time to wait for Kubernetes operations (default 5m0s).
- **--username** (string) - Optional - Chart repository username.
- **-f, --values** (strings) - Optional - Specify values in a YAML file or URL.
- **--verify** (boolean) - Optional - Verify the package before using it.
- **--version** (string) - Optional - Specify a version constraint for the chart.
- **--wait** (WaitStrategy) - Optional - Wait until resources are ready (watcher, hookOnly, legacy).
- **--wait-for-jobs** (boolean) - Optional - Wait until all Jobs are completed.
```

--------------------------------

### List Helm Releases using Go SDK

Source: https://helm.sh/docs/sdk/examples

Provides an example of how to list all Helm releases within the configured namespace. It demonstrates configuring the list client to include all states.

```go
func runList(logger *log.Logger, settings *cli.EnvSettings) error {
	actionConfig, err := initActionConfigList(settings, logger, false)
	if err != nil {
		return fmt.Errorf("failed to init action config: %w", err)
	}

	listClient := action.NewList(actionConfig)
	listClient.All = true
	listClient.SetStateMask()

	results, err := listClient.Run()
	if err != nil {
		return fmt.Errorf("failed to run list action: %w", err)
	}

	for _, rel := range results {
		logger.Printf("list result: %+v", rel)
	}
	return nil
}
```

--------------------------------

### Install Helm using Apt (Debian/Ubuntu)

Source: https://helm.sh/docs/intro/install

Install Helm on Debian or Ubuntu systems using the Apt package manager. This involves adding a community-maintained repository and GPG key.

```bash
sudo apt-get install curl gpg apt-transport-https --yes
curl -fsSL https://packages.buildkite.com/helm-linux/helm-debian/gpgkey | gpg --dearmor | sudo tee /usr/share/keyrings/helm.gpg > /dev/null
echo "deb [signed-by=/usr/share/keyrings/helm.gpg] https://packages.buildkite.com/helm-linux/helm-debian/any/ any main" | sudo tee /etc/apt/sources.list.d/helm-stable-debian.list
sudo apt-get update
sudo apt-get install helm
```

--------------------------------

### List Installed Helm Plugins (Shell)

Source: https://helm.sh/docs/plugins/developer/tutorial-postrenderer-plugin

Displays a list of all installed Helm plugins, including their name, version, type, API version, provenance, and source. This command is used to verify the installation of the custom plugin.

```shell
% helm plugin list
```

--------------------------------

### Install Helm using Snap

Source: https://helm.sh/docs/intro/install

Install Helm on systems that support Snap packages. This version is maintained by the Snapcrafters community.

```bash
sudo snap install helm --classic
```

--------------------------------

### Helm Install with Dry Run and Debug

Source: https://helm.sh/docs/chart_template_guide/values_files

This command demonstrates how to perform a Helm installation with a dry run and debug flags enabled. It shows the computed values, including those from `values.yaml`, and the resulting manifest.

```bash
$ helm install geared-marsupi ./mychart --dry-run=client --debug
```

--------------------------------

### Install Helm Chart with Digest (Shell)

Source: https://helm.sh/docs/topics/registries

Installs a Helm chart from an OCI registry using its immutable digest for enhanced security. This method ensures that the exact version of the chart is installed, preventing unexpected changes.

```shell
$ helm install myrelease oci://localhost:5000/helm-charts/mychart@sha256:52ccaee6d4dd272e54bfccda77738b42e1edf0e4a20c27e23f0b6c15d01aef79
```

--------------------------------

### Helm Values File Example (YAML)

Source: https://helm.sh/docs/topics/charts

An example of a typical `values.yaml` file used in Helm charts. This file defines default configuration parameters for a chart, such as image registry, tag, pull policy, and storage type.

```yaml
imageRegistry: "quay.io/deis"
dockerTag: "latest"
pullPolicy: "Always"
storage: "s3"

```

--------------------------------

### Install Helm using DNF/YUM (Fedora)

Source: https://helm.sh/docs/intro/install

Install Helm on Fedora systems using the DNF or YUM package manager. Helm is available in the official Fedora repository starting from version 35.

```bash
sudo dnf install helm
```

--------------------------------

### Install and Inspect Helm Releases

Source: https://helm.sh/docs/chart_template_guide/getting_started

Commands to install a Helm chart into a Kubernetes cluster and retrieve the rendered manifest of the deployed resources.

```bash
helm install full-coral ./mychart
helm get manifest full-coral
```

--------------------------------

### Install Helm using Winget (Windows)

Source: https://helm.sh/docs/intro/install

Install Helm on Windows using the Winget package manager. This is a community-maintained package and is generally kept up-to-date.

```powershell
winget install Helm.Helm
```

--------------------------------

### Helm CLI: Install Application Chart

Source: https://helm.sh/docs/topics/library_charts

Installs the application Helm chart, which includes the library chart as a dependency. The ConfigMap defined in the template will be deployed to the Kubernetes cluster.

```bash
$ helm install mydemo mychart/
NAME: mydemo
LAST DEPLOYED: Tue Mar  3 17:52:40 2020
NAMESPACE: default
STATUS: deployed
REVISION: 1
TEST SUITE: None
```

--------------------------------

### Execute Post-Renderer with Helm CLI

Source: https://helm.sh/docs/topics/advanced

Demonstrates how to apply a custom post-renderer executable during a Helm install operation. The executable processes manifests from STDIN and outputs them to STDOUT.

```bash
helm install mychart stable/wordpress --post-renderer ./path/to/executable
```

--------------------------------

### Overriding Helm Values with `helm install` (Shell)

Source: https://helm.sh/docs/topics/charts

Demonstrates how to override default values in a Helm chart during installation using the `--values` flag with a custom values file. The example shows merging `myvals.yaml` with the chart's default `values.yaml`.

```shell
$ helm install --generate-name --values=myvals.yaml wordpress

```

--------------------------------

### Implement Go Downloader Function for Helm Plugin

Source: https://helm.sh/docs/plugins/developer/tutorial-getter-plugin

Implements the `demoDownloader` function in Go, which takes an `InputMessage`, converts a 'demo://' URL to 'https://', downloads the content using HTTP GET, and returns the data in an `OutputMessage`. It includes error handling and logging.

```go
// Delete the `replaceMeImplementationGoesHere` function

func demoDownloader(input InputMessage) (*OutputMessage, error) {

	// Convert demo:// to https://
	downloadURL := strings.Replace(input.URL, "demo://", "https://", 1)
	pdk.Log(pdk.LogLevelInfo, fmt.Sprintf("Converted %s to %s", input.URL, downloadURL))

	// Download content
	resp, err := http.Get(downloadURL)
	if err != nil {
		return nil, fmt.Errorf("failed to download: %w", err)
	}
	defer resp.Body.Close()

	// Read and output content
	data, _ := io.ReadAll(resp.Body)
	output := OutputMessage{Data: data}
	return &output, nil
}
```

--------------------------------

### Implement plugin.complete script

Source: https://helm.sh/docs/topics/plugins

Example of a shell script for plugin.complete that delegates completion logic to the main plugin script using a custom flag.

```shell
#!/usr/bin/env sh

# "$@" is the entire command-line that requires completion.
# It is important to double-quote the "$@" variable to preserve a possibly empty last parameter.
$HELM_PLUGIN_DIR/status.sh --complete "$@"
```

--------------------------------

### Install Helm using Homebrew (macOS)

Source: https://helm.sh/docs/intro/install

Install Helm on macOS using the Homebrew package manager. This is a community-maintained formula and is generally kept up-to-date.

```bash
brew install helm
```

--------------------------------

### Install Helm using Scoop (Windows)

Source: https://helm.sh/docs/intro/install

Install Helm on Windows using the Scoop package manager. This is a community-maintained package and is generally kept up-to-date.

```powershell
scoop install helm
```

--------------------------------

### Create a new Helm chart

Source: https://helm.sh/docs/topics/provenance

This command initializes a new Helm chart with a default directory structure and files. It's the starting point for developing a new Helm chart.

```bash
$ helm create mychart  
Creating mychart  

```

--------------------------------

### GET /helm/repo/list

Source: https://helm.sh/docs/topics/chart_repository

Lists all configured Helm repositories.

```APIDOC
## GET /helm/repo/list

### Description
Lists all repositories currently added to the Helm client.

### Method
GET

### Endpoint
helm repo list

### Response
#### Success Response (200)
- **list** (array) - A list of repository names and their associated URLs.
```

--------------------------------

### Querying Kubernetes resources with lookup

Source: https://helm.sh/docs/chart_template_guide/functions_and_pipelines

Examples of using the lookup function to retrieve specific Kubernetes resources or lists of resources from a running cluster.

```yaml
(lookup "v1" "Namespace" "" "mynamespace").metadata.annotations
```

```yaml
{{ range $index, $service := (lookup "v1" "Service" "mynamespace" "").items }}
    {{/* do something with each service */}}
{{ end }}
```

--------------------------------

### Authenticate to a Registry via CLI

Source: https://helm.sh/docs/helm/helm_registry_login

Demonstrates how to authenticate to a remote container registry using Helm. The first example shows a secure method for CI/CD pipelines using stdin, while the second shows the basic command structure.

```bash
echo "$GITHUB_TOKEN" | helm registry login ghcr.io -u $GITHUB_USER --password-stdin
```

```bash
helm registry login [host] [flags]
```

--------------------------------

### Helm Get All Command Options

Source: https://helm.sh/docs/helm/helm_get_all

This section outlines the specific options available for the 'helm get all' command. These include flags for help, specifying a revision, and formatting the output using Go templates.

```bash
  -h, --help              help for all  
      --revision int      get the named release with revision  
      --template string   go template for formatting the output, eg: {{.Release.Name}}  
```

--------------------------------

### Helm CLI Installation and Debugging Commands

Source: https://helm.sh/docs/chart_template_guide/getting_started

Commands to install a Helm chart and to perform a dry-run rendering of templates for debugging purposes without modifying the cluster state.

```bash
helm install clunky-serval ./mychart
helm install --debug --dry-run goodly-guppy ./mychart
```

--------------------------------

### Install Helm using Chocolatey (Windows)

Source: https://helm.sh/docs/intro/install

Install Helm on Windows using the Chocolatey package manager. This is a community-maintained package and is generally kept up-to-date.

```powershell
choco install kubernetes-helm
```

--------------------------------

### Install Helm using Pkg (FreeBSD)

Source: https://helm.sh/docs/intro/install

Install Helm on FreeBSD systems using the Pkg package manager. This is a community-contributed package within the FreeBSD Ports Collection.

```bash
pkg install helm
```

--------------------------------

### Helm: Define and Use a Labels Template

Source: https://helm.sh/docs/chart_template_guide/named_templates

This example demonstrates defining a reusable template for Kubernetes labels using `define` and then embedding it within a ConfigMap using the `template` action. The `template` action renders the named template inline at the call site.

```go-template
{{- define "mychart.labels" }}
  labels:
    generator: helm
    date: {{ now | htmlDate }}
{{- end }}
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
  {{- template "mychart.labels" }}
data:
  myvalue: "Hello World"
  {{- range $key, $val := .Values.favorite }}
  {{ $key }}: {{ $val | quote }}
  {{- end }}

```

--------------------------------

### GET /helm/get/all

Source: https://helm.sh/docs/helm/helm_get_all

Retrieves all information for a named Helm release, including configuration and manifest details.

```APIDOC
## GET helm get all

### Description
Prints a human-readable collection of information about the notes, hooks, supplied values, and generated manifest file of the given release.

### Method
CLI Command

### Endpoint
helm get all RELEASE_NAME [flags]

### Parameters
#### Path Parameters
- **RELEASE_NAME** (string) - Required - The name of the release to retrieve.

#### Flags
- **--revision** (int) - Optional - Get the named release with a specific revision.
- **--template** (string) - Optional - Go template for formatting the output.
- **-n, --namespace** (string) - Optional - Namespace scope for this request.

### Request Example
helm get all my-release --namespace default

### Response
#### Success Response (Output)
- **Notes** (string) - Release notes.
- **Hooks** (list) - List of defined hooks.
- **Values** (map) - Supplied values for the release.
- **Manifest** (string) - Generated Kubernetes manifest file.
```

--------------------------------

### Install Helm Plugin in Dev Mode (Shell)

Source: https://helm.sh/docs/plugins/developer/tutorial-postrenderer-plugin

Installs a Helm plugin from a local directory in development mode. This mode creates a symbolic link to the source directory and bypasses provenance checks, making it suitable for local development and testing.

```shell
% helm plugin install $HOME/code/helm/plugins/label-injector
```

--------------------------------

### Create Symbolic Link for Local Plugin (Shell)

Source: https://helm.sh/docs/topics/plugins

This command creates a symbolic link to a local plugin's build output, allowing for testing without full installation. It assumes the plugin is named 'helm-mapkubeapis' and is located in the user's GitHub directory.

```shell
ln -s ~/GitHub/helm-mapkubeapis ./helm-mapkubeapis
```

--------------------------------

### Helm Chart Repository Usage Instructions (Markdown)

Source: https://helm.sh/docs/howto/chart_releaser_action

Provides instructions for users on how to add and update a Helm repository, and install or uninstall charts. This is typically included in a README.md file on the GitHub Pages site.

```markdown
## Usage  
  
[Helm](https://helm.sh) must be installed to use the charts.  Please refer to  
Helm's [documentation](https://helm.sh/docs) to get started.  
  
Once Helm has been set up correctly, add the repo as follows:  
  
  helm repo add <alias> https://<orgname>.github.io/helm-charts  
  
If you had already added this repo earlier, run `helm repo update` to retrieve  
the latest versions of the packages.  You can then run `helm search repo  
<alias>` to see the charts.  
  
To install the <chart-name> chart:  
  
    helm install my-<chart-name> <alias>/<chart-name>  
  
To uninstall the chart:  
  
    helm uninstall my-<chart-name>  

```

--------------------------------

### Helm values.yaml Documentation

Source: https://helm.sh/docs/chart_best_practices/values

Shows correct and incorrect documentation practices for `values.yaml` properties. Correct documentation starts with the property name, followed by a description.

```yaml
# the host name for the webserver
serverHost: example
serverPort: 9191
```

```yaml
# serverHost is the host name for the webserver
serverHost: example
# serverPort is the HTTP listener port for the webserver
serverPort: 9191
```

--------------------------------

### Manage Helm Plugins

Source: https://helm.sh/docs/intro/cheatsheet

Commands for managing the lifecycle of Helm plugins, including installation, listing, updating, and uninstallation.

```bash
helm plugin install <path/url>
helm plugin list
helm plugin update <plugin>
helm plugin uninstall <plugin>
```

--------------------------------

### Helm CLI: Dry Run Install

Source: https://helm.sh/docs/topics/library_charts

Performs a dry run of the Helm chart installation, showing the rendered Kubernetes manifests without actually deploying them. This is useful for verifying the configuration.

```bash
$ helm install mydemo mychart/ --debug --dry-run
install.go:159: [debug] Original chart version: ""
install.go:176: [debug] CHART PATH: /root/test/helm-charts/mychart

NAME: mydemo
LAST DEPLOYED: Tue Mar  3 17:48:47 2020
NAMESPACE: default
STATUS: pending-install
REVISION: 1
TEST SUITE: None
USER-SUPPLIED VALUES: 
{}

COMPUTED VALUES:
affinity: {}
fullnameOverride: ""
image:
  pullPolicy: IfNotPresent
  repository: nginx
imagePullSecrets: []
ingress:
  annotations: {}
  enabled: false
  hosts:
  - host: chart-example.local
    paths: []
  tls: []
mylibchart:
  global: {}
nameOverride: ""
nodeSelector: {}
podSecurityContext: {}
replicaCount: 1
resources: {}
securityContext: {}
service:
  port: 80
  type: ClusterIP
serviceAccount:
  annotations: {}
  create: true
  name: null
tolerations: []

HOOKS:
MANIFEST:
---
# Source: mychart/templates/configmap.yaml
apiVersion: v1
data:
  myvalue: Hello World
kind: ConfigMap
metadata:
  labels:
    app: mychart
    chart: mychart-0.1.0
    release: mydemo
  name: mychart-mydemo
```

--------------------------------

### Helm CLI for Setting Tags and Conditions

Source: https://helm.sh/docs/topics/charts

Illustrates using the Helm CLI's '--set' parameter to dynamically override tag and condition values during chart installation. This allows for runtime configuration of dependency loading.

```bash
helm install --set tags.front-end=true --set subchart2.enabled=false
```

--------------------------------

### Helm Plugin Management

Source: https://helm.sh/docs/intro/cheatsheet

Commands for installing, listing, updating, and uninstalling Helm plugins.

```APIDOC
## Helm Plugin Management

### Description
Commands for managing Helm plugins, allowing users to extend Helm's functionality.

### Commands
- `helm plugin install <path/url>`: Installs a Helm plugin from a local path or a URL.
- `helm plugin list`: Displays a list of all installed Helm plugins.
- `helm plugin update <plugin>`: Updates a specific installed Helm plugin.
- `helm plugin uninstall <plugin>`: Uninstalls a specified Helm plugin.
```

--------------------------------

### Example Helm Upgrade Failure Error

Source: https://helm.sh/docs/topics/kubernetes_apis

An example of the error message returned by Helm when a release manifest contains API versions that have been removed in the target Kubernetes cluster.

```text
Error: UPGRADE FAILED: current release manifest contains removed kubernetes api(s) for this kubernetes version and it is therefore unable to build the kubernetes objects for performing the diff. error from kubernetes: unable to recognize "": no matches for kind "Deployment" in version "apps/v1beta1"
```

--------------------------------

### Helm Show Readme Command Usage

Source: https://helm.sh/docs/helm/helm_show_readme

This command inspects a chart (directory, file, or URL) and displays the contents of its README file. It allows users to view chart documentation before installation. Options include specifying chart details, security settings, and version constraints.

```bash
helm show readme [CHART] [flags]
```

--------------------------------

### Multi-level Values Configuration (YAML)

Source: https://helm.sh/docs/topics/charts

An example of a values file structured to provide configurations for a parent chart and its dependencies (e.g., `mysql`, `apache`). It shows how values are namespaced and how parent charts can access dependency values.

```yaml
title: "My WordPress Site"

mysql:
  max_connections: 100
  password: "secret"

apache:
  port: 8080

```

--------------------------------

### GET /helm/list

Source: https://helm.sh/docs/helm/helm_list

Lists all releases for a specified namespace or across all namespaces, supporting regex filtering and custom output formats.

```APIDOC
## GET helm list

### Description
Lists all the releases for a specified namespace. By default, it lists all releases in any status and supports filtering by status, regex patterns, and labels.

### Method
CLI Command (GET-like behavior)

### Endpoint
helm list [flags]

### Parameters
#### Query Parameters
- **--all-namespaces** (bool) - Optional - List releases across all namespaces
- **--filter** (string) - Optional - A Perl compatible regular expression to filter release names
- **--max** (int) - Optional - Maximum number of releases to fetch (default 256)
- **--output** (string) - Optional - Output format: table, json, yaml
- **--selector** (string) - Optional - Label query selector (e.g., key1=value1)

### Request Example
helm list --filter 'ara[a-z]+' --output json

### Response
#### Success Response (200)
- **NAME** (string) - The name of the release
- **UPDATED** (string) - The timestamp of the last update
- **CHART** (string) - The chart version and name

#### Response Example
[
  {
    "name": "maudlin-arachnid",
    "updated": "2020-06-18 14:17:46",
    "chart": "alpine-0.1.0"
  }
]
```

--------------------------------

### Helm Plugin File Structure Example

Source: https://helm.sh/docs/plugins/overview

This illustrates the expected directory structure for a Helm plugin. The 'plugin.yaml' is mandatory, while 'plugin.sh' is for Subprocess runtime and 'plugin.wasm' is for Wasm runtime.

```yaml
example-plugin  
├── plugin.yaml # REQUIRED  
├── plugin.sh   # OPTIONAL for Subprocess runtime  
└── plugin.wasm # REQUIRED for Wasm runtime  
```

--------------------------------

### List Helm Releases using Go SDK

Source: https://helm.sh/docs/sdk/gosdk

This Go code snippet demonstrates how to use the Helm Go SDK to perform a 'helm list' command. It initializes the action configuration, creates a list client, sets options (e.g., to list only deployed releases), and then runs the command to retrieve and log the release information. Dependencies include the 'action' and 'cli' packages from the Helm SDK.

```Go
package main

import (
    "log"
    "os"

    "helm.sh/helm/v4/pkg/action"
    "helm.sh/helm/v4/pkg/cli"
)

func main() {
    settings := cli.New()

    actionConfig := new(action.Configuration)
    // You can pass an empty string instead of settings.Namespace() to list
    // all namespaces
    if err := actionConfig.Init(settings.RESTClientGetter(), settings.Namespace(), os.Getenv("HELM_DRIVER"), log.Printf); err != nil {
        log.Printf("%+v", err)
        os.Exit(1)
    }

    client := action.NewList(actionConfig)
    // Only list deployed
    client.Deployed = true
    results, err := client.Run()
    if err != nil {
        log.Printf("%+v", err)
        os.Exit(1)
    }

    for _, rel := range results {
        log.Printf("%+v", rel)
    }
}

```

--------------------------------

### Create CRD Instance in Template

Source: https://helm.sh/docs/topics/charts

An example of creating an instance of a custom resource within the templates/ directory using Helm template syntax.

```yaml
apiVersion: stable.example.com
kind: CronTab
metadata:
  name: {{ .Values.name }}
spec:
   # ...
```

--------------------------------

### Helm Install Overriding Value with --set

Source: https://helm.sh/docs/chart_template_guide/values_files

This command shows how to override a value defined in `values.yaml` using the `--set` flag during a Helm installation. The `--set` flag takes precedence over the default values.

```bash
$ helm install solid-vulture ./mychart --dry-run=client --debug --set favoriteDrink=slurm
```

--------------------------------

### Install and Uninstall Helm Releases

Source: https://helm.sh/docs/intro/CheatSheet

Commands to deploy applications into Kubernetes clusters using Helm charts and remove them when no longer needed. Includes options for configuration overrides and validation.

```bash
helm install <name> <chart>
helm install <name> <chart> --namespace <namespace>
helm install <name> <chart> --set key1=val1,key2=val2
helm install <name> <chart> --values <yaml-file/url>
helm install <name> <chart> --dry-run --debug
helm install <name> <chart> --verify
helm install <name> <chart> --dependency-update
helm uninstall <name>
helm uninstall <release-name> --namespace <namespace>
```

--------------------------------

### Helm Values for Tags and Conditions

Source: https://helm.sh/docs/topics/charts

Provides example parent values demonstrating how 'tags' and 'condition' fields in dependencies are evaluated. It shows how parent values can enable/disable charts and how conditions take precedence over tags.

```yaml
subchart1:
  enabled: true
tags:
  front-end: false
  back-end: true
```

--------------------------------

### Create Helm Demo Chart

Source: https://helm.sh/docs/topics/chart_tests

Command to create a new Helm chart with a basic structure, including a sample test file.

```bash
helm create demo
```

--------------------------------

### CLI Command: helm get

Source: https://helm.sh/docs/helm/helm_get

Retrieves extended information about a named release. This command acts as a parent for several subcommands that fetch specific release details.

```APIDOC
## GET helm get [subcommand] [RELEASE_NAME]

### Description
This command is used to retrieve extended information about a named release. It serves as a base command for subcommands like 'all', 'hooks', 'manifest', 'metadata', 'notes', and 'values'.

### Method
CLI Command

### Endpoint
helm get [subcommand] [RELEASE_NAME]

### Parameters
#### Path Parameters
- **RELEASE_NAME** (string) - Required - The name of the release to query.

#### Options
- **-h, --help** (flag) - Optional - Show help for the get command.
- **-n, --namespace** (string) - Optional - Namespace scope for this request.

### Request Example
helm get values my-release -n default

### Response
#### Success Response (stdout)
- **Output** (string) - Returns the requested information (values, manifest, hooks, etc.) in the format specified by the subcommand.
```

--------------------------------

### GET /helm/pull

Source: https://helm.sh/docs/helm/helm_pull

Downloads a chart from a specified repository and optionally unpacks it into a local directory.

```APIDOC
## GET /helm/pull

### Description
Retrieve a package from a package repository and download it locally. This command supports cryptographic verification and automatic unpacking of the chart.

### Method
GET

### Endpoint
helm pull [chart URL | repo/chartname]

### Parameters
#### Path Parameters
- **chart** (string) - Required - The URL or repository/chartname to download.

#### Query Parameters
- **--version** (string) - Optional - Specify a version constraint for the chart.
- **--verify** (boolean) - Optional - Verify the package before using it.
- **--untar** (boolean) - Optional - If set to true, will untar the chart after downloading.
- **--destination** (string) - Optional - Location to write the chart (default ".").
- **--username** (string) - Optional - Repository username.
- **--password** (string) - Optional - Repository password.

### Request Example
helm pull stable/nginx --version 1.2.3 --untar

### Response
#### Success Response (200)
- **status** (string) - Confirmation that the chart was downloaded and/or unpacked successfully.

#### Response Example
{
  "status": "success",
  "message": "Chart downloaded to ./nginx"
}
```

--------------------------------

### Helm Chart Naming Convention Examples

Source: https://helm.sh/docs/chart_best_practices/conventions

Examples of valid Helm chart names using lowercase letters, numbers, and dashes. These names comply with the requirement to avoid uppercase letters, underscores, and dots.

```text
drupal
nginx-lego
aws-cluster-autoscaler
```

--------------------------------

### Verify Helm Plugin Signature and Integrity

Source: https://helm.sh/docs/helm/helm_plugin_verify

This command verifies that a Helm plugin has a valid provenance file and that this file is signed by a trusted PGP key. It supports verification for both plugin tarballs (.tgz or .tar.gz files) and installed plugin directories. For installed plugins, specify the path to the plugin directory. To generate a signed plugin, use 'helm plugin package --sign'.

```bash
helm plugin verify [PATH] [--keyring string] [flags]
```

--------------------------------

### Helm Get Values Inherited Options

Source: https://helm.sh/docs/helm/helm_get_values

These are options inherited from parent commands that can be used with 'helm get values'. They control aspects like Kubernetes API connection, client-side throttling, and configuration file paths.

```bash
      --burst-limit int                 client-side default throttling limit (default 100)  
      --color string                    use colored output (never, auto, always) (default "auto")  
      --colour string                   use colored output (never, auto, always) (default "auto")  
      --content-cache string            path to the directory containing cached content (e.g. charts) (default "~/.cache/helm/content")  
      --debug                           enable verbose output  
      --kube-apiserver string           the address and the port for the Kubernetes API server  
      --kube-as-group stringArray       group to impersonate for the operation, this flag can be repeated to specify multiple groups.  
      --kube-as-user string             username to impersonate for the operation  
      --kube-ca-file string             the certificate authority file for the Kubernetes API server connection  
      --kube-context string             name of the kubeconfig context to use  
      --kube-insecure-skip-tls-verify   if true, the Kubernetes API server's certificate will not be checked for validity. This will make your HTTPS connections insecure  
      --kube-tls-server-name string     server name to use for Kubernetes API server certificate validation. If it is not provided, the hostname used to contact the server is used  
      --kube-token string               bearer token used for authentication  
      --kubeconfig string               path to the kubeconfig file  
  -n, --namespace string                namespace scope for this request  
      --qps float32                     queries per second used when communicating with the Kubernetes API, not including bursting  
      --registry-config string          path to the registry config file (default "~/.config/helm/registry/config.json")  
      --repository-cache string         path to the directory containing cached repository indexes (default "~/.cache/helm/repository")  
      --repository-config string        path to the file containing repository names and URLs (default "~/.config/helm/repositories.yaml")  
```

--------------------------------

### Helm Hook Annotation Examples

Source: https://helm.sh/docs/topics/charts_hooks

Illustrates different ways to define Helm hooks using annotations. This includes specifying a single hook type, multiple hook types for a single resource, and setting a numerical weight for execution order.

```yaml
annotations:
  "helm.sh/hook": post-install

```

```yaml
annotations:
  "helm.sh/hook": post-install,post-upgrade

```

```yaml
annotations:
  "helm.sh/hook-weight": "5"

```

--------------------------------

### Helm Get Values Command Options

Source: https://helm.sh/docs/helm/helm_get_values

Available options for the 'helm get values' command include dumping all computed values, specifying the output format (table, json, yaml), and retrieving a specific revision of the release.

```bash
  -a, --all             dump all (computed) values  
  -h, --help            help for values  
  -o, --output format   prints the output in the specified format. Allowed values: table, json, yaml (default table)  
      --revision int    get the named release with revision  
```

--------------------------------

### Initialize Helm Plugin Directory

Source: https://helm.sh/docs/plugins/developer/tutorial-cli-plugin

Commands to create the directory structure for a new Helm plugin on the local filesystem.

```bash
mkdir -p $HOME/code/helm/plugins/system-info
cd $HOME/code/helm/plugins/system-info
```

--------------------------------

### Registry Client Initialization

Source: https://helm.sh/docs/sdk/examples

Sets up the registry client for interacting with OCI-compliant chart repositories.

```APIDOC
## Initialization: newRegistryClient

### Description
Creates a new registry client instance with support for TLS configuration, authentication, and debug logging.

### Method
Internal Function

### Parameters
#### Path Parameters
- **settings** (cli.EnvSettings) - Required - Helm environment settings
- **certFile** (string) - Optional - Path to client certificate
- **keyFile** (string) - Optional - Path to client key
- **caFile** (string) - Optional - Path to CA certificate
- **insecureSkipTLSVerify** (bool) - Optional - Skip TLS verification
- **plainHTTP** (bool) - Optional - Use plain HTTP instead of HTTPS

### Response
- **registry.Client** - The initialized OCI registry client.
```

--------------------------------

### Template Chart with Post-Renderer (Shell)

Source: https://helm.sh/docs/plugins/developer/tutorial-postrenderer-plugin

Generates Kubernetes manifests from a Helm chart and applies the specified post-renderer plugin. This command is used to test the functionality of the installed `label-injector` plugin by observing the added labels in the output.

```shell
% helm template ../mychart --post-renderer label-injector
```

--------------------------------

### GET /helm/get/hooks

Source: https://helm.sh/docs/helm/helm_get_hooks

Retrieves all hooks for a specified Helm release name.

```APIDOC
## GET helm get hooks

### Description
This command downloads hooks for a given release. Hooks are returned in YAML format, separated by the standard YAML '---\n' separator.

### Method
GET

### Endpoint
helm get hooks RELEASE_NAME [flags]

### Parameters
#### Path Parameters
- **RELEASE_NAME** (string) - Required - The name of the release to retrieve hooks for.

#### Query Parameters
- **--revision** (int) - Optional - Get the named release with a specific revision number.
- **--namespace** (string) - Optional - Namespace scope for this request.

### Request Example
helm get hooks my-release --revision 1

### Response
#### Success Response (200)
- **Body** (string) - YAML formatted hooks content.

#### Response Example
---
# Source: my-chart/templates/tests/test-connection.yaml
apiVersion: v1
kind: Pod
metadata:
  name: "my-release-test-connection"
  annotations:
    "helm.sh/hook": test
```

--------------------------------

### Upgrade Helm Release using Go SDK

Source: https://helm.sh/docs/sdk/examples

Demonstrates how to upgrade a Helm release by specifying the chart, version, and values. It includes logic for locating the chart, managing dependencies, and executing the upgrade action.

```go
func runUpgrade(ctx context.Context, logger *log.Logger, settings *cli.EnvSettings, releaseName string, chartRef string, chartVersion string, releaseValues map[string]interface{}) error {
	actionConfig, err := initActionConfig(settings, logger)
	if err != nil {
		return fmt.Errorf("failed to init action config: %w", err)
	}

	upgradeClient := action.NewUpgrade(actionConfig)
	upgradeClient.Namespace = settings.Namespace()
	upgradeClient.DryRunStrategy = "none"
	upgradeClient.Version = chartVersion
	upgradeClient.WaitStrategy = "watcher"

	// ... (registry client setup and dependency management omitted for brevity)

	release, err := upgradeClient.RunWithContext(ctx, releaseName, charter, releaseValues)
	if err != nil {
		return fmt.Errorf("failed to run upgrade action: %w", err)
	}
	logger.Printf("release: %+v", release)
	return nil
}
```

--------------------------------

### GET /helm/get/values

Source: https://helm.sh/docs/helm/helm_get_values

Retrieves the values configuration for a specified Helm release.

```APIDOC
## GET helm get values

### Description
Downloads or displays the values file for a given release name. This is useful for inspecting the configuration applied to a specific deployment.

### Method
CLI Command

### Endpoint
helm get values RELEASE_NAME [flags]

### Parameters
#### Path Parameters
- **RELEASE_NAME** (string) - Required - The name of the release to retrieve values for.

#### Options
- **-a, --all** (boolean) - Optional - Dump all computed values.
- **-o, --output** (string) - Optional - Prints the output in the specified format (table, json, yaml).
- **--revision** (int) - Optional - Get the named release with a specific revision number.

### Request Example
helm get values my-release --output json

### Response
#### Success Response (200)
- **values** (object/string) - The configuration values used for the release.

#### Response Example
{
  "replicaCount": 2,
  "image": "nginx:latest"
}
```

--------------------------------

### Base64 Encode File Content for Secrets

Source: https://helm.sh/docs/chart_template_guide/accessing_files

This example shows how to read a file's content using `Files.Get` and then base64 encode it using `b64enc` for secure transmission within a Kubernetes Secret. This ensures that sensitive data within files is properly handled.

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: {{ .Release.Name }}-secret
type: Opaque
data:
  token: |-
    {{ .Files.Get "config1.toml" | b64enc }}

```

--------------------------------

### Using Repeat and Default Functions

Source: https://helm.sh/docs/chart_template_guide/functions_and_pipelines

Illustrates the use of the 'repeat' function to duplicate strings and the 'default' function to provide fallback values when configuration is missing.

```yaml
data:
  drink: {{ .Values.favorite.drink | default "tea" | repeat 5 | quote }}
  food: {{ .Values.favorite.food | upper | quote }}
```

--------------------------------

### Helm Get All Command Usage

Source: https://helm.sh/docs/helm/helm_get_all

This command retrieves all information for a named Helm release, including notes, hooks, supplied values, and the generated manifest file. It requires the release name as an argument and supports various flags for customization and filtering.

```bash
helm get all RELEASE_NAME [flags]
```

--------------------------------

### Make Script Executable (Shell)

Source: https://helm.sh/docs/plugins/developer/tutorial-postrenderer-plugin

This command grants execute permissions to the `inject-labels.sh` script, allowing it to be run as a program. This is a necessary step before installing and using the script as part of the Helm plugin.

```shell
chmod +x inject-labels.sh
```

--------------------------------

### Define a Kubernetes ReplicationController Template

Source: https://helm.sh/docs/topics/charts

An example of a Kubernetes ReplicationController manifest using Helm template syntax. It demonstrates how to inject custom values from the .Values object for image registry, tags, pull policies, and storage configuration.

```yaml
apiVersion: v1
kind: ReplicationController
metadata:
  name: deis-database
  namespace: deis
  labels:
    app.kubernetes.io/managed-by: deis
spec:
  replicas: 1
  selector:
    app.kubernetes.io/name: deis-database
  template:
    metadata:
      labels:
        app.kubernetes.io/name: deis-database
    spec:
      serviceAccount: deis-database
      containers:
        - name: deis-database
          image: {{ .Values.imageRegistry }}/postgres:{{ .Values.dockerTag }}
          imagePullPolicy: {{ .Values.pullPolicy }}
          ports:
            - containerPort: 5432
          env:
            - name: DATABASE_STORAGE
              value: {{ default "minio" .Values.storage }}
```

--------------------------------

### Grant User Cluster-Scope Write Access using kubectl

Source: https://helm.sh/docs/topics/rbac

This example shows how to grant a user 'sam' cluster-wide administrative access using 'admin' or 'cluster-admin' ClusterRoles. It provides commands to create ClusterRoleBindings for 'view' and 'secret-reader' roles, which can be precursors to broader access.

```bash
$ kubectl create clusterrolebinding sam-view \
    --clusterrole view \
    --user sam
$ kubectl create clusterrolebinding sam-secret-reader \
    --clusterrole secret-reader \
    --user sam
```

--------------------------------

### Viewing Generated YAML with Commented Sections

Source: https://helm.sh/docs/chart_template_guide/debugging

Demonstrates a technique to view the rendered YAML output even when template errors occur. By commenting out problematic sections and using `helm install --dry-run --debug`, you can inspect the generated content.

```yaml
apiVersion: v2
# some: problem section
# {{ .Values.foo | quote }}
```

```yaml
apiVersion: v2
# some: problem section
#  "bar"
```

--------------------------------

### helm lint

Source: https://helm.sh/docs/helm/helm_lint

Examines a chart for possible issues. It emits ERROR messages for installation failures and WARNING messages for convention breaches.

```APIDOC
## helm lint

### Description
This command takes a path to a chart and runs a series of tests to verify that the chart is well-formed. If the linter encounters things that will cause the chart to fail installation, it will emit [ERROR] messages. If it encounters issues that break with convention or recommendation, it will emit [WARNING] messages.

### Synopsis
```
helm lint PATH [flags]
```

### Options
```
  -h, --help                      help for lint
      --kube-version string       Kubernetes version used for capabilities and deprecation checks
      --quiet                     print only warnings and errors
      --set stringArray           set values on the command line (can specify multiple or separate values with commas: key1=val1,key2=val2)
      --set-file stringArray      set values from respective files specified via the command line (can specify multiple or separate values with commas: key1=path1,key2=path2)
      --set-json stringArray      set JSON values on the command line (can specify multiple or separate values with commas: key1=jsonval1,key2=jsonval2 or using json format: {"key1": jsonval1, "key2": "jsonval2"})
      --set-literal stringArray   set a literal STRING value on the command line
      --set-string stringArray    set STRING values on the command line (can specify multiple or separate values with commas: key1=val1,key2=val2)
      --skip-schema-validation    if set, disables JSON schema validation
      --strict                    fail on lint warnings
  -f, --values strings            specify values in a YAML file or a URL (can specify multiple)
      --with-subcharts            lint dependent charts
```

### Options inherited from parent commands
```
      --burst-limit int                 client-side default throttling limit (default 100)
      --color string                    use colored output (never, auto, always) (default "auto")
      --colour string                   use colored output (never, auto, always) (default "auto")
      --content-cache string            path to the directory containing cached content (e.g. charts) (default "~/.cache/helm/content")
      --debug                           enable verbose output
      --kube-apiserver string           the address and the port for the Kubernetes API server
      --kube-as-group stringArray       group to impersonate for the operation, this flag can be repeated to specify multiple groups.
      --kube-as-user string             username to impersonate for the operation
      --kube-ca-file string             the certificate authority file for the Kubernetes API server connection
      --kube-context string             name of the kubeconfig context to use
      --kube-insecure-skip-tls-verify   if true, the Kubernetes API server's certificate will not be checked for validity. This will make your HTTPS connections insecure
      --kube-tls-server-name string     server name to use for Kubernetes API server certificate validation. If it is not provided, the hostname used to contact the server is used
      --kube-token string               bearer token used for authentication
      --kubeconfig string               path to the kubeconfig file
  -n, --namespace string                namespace scope for this request
      --qps float32                     queries per second used when communicating with the Kubernetes API, not including bursting
      --registry-config string          path to the registry config file (default "~/.config/helm/registry/config.json")
      --repository-cache string         path to the directory containing cached repository indexes (default "~/.cache/helm/repository")
      --repository-config string        path to the file containing repository names and URLs (default "~/.config/helm/repositories.yaml")
```

### SEE ALSO
  * helm - The Helm package manager for Kubernetes.

###### Auto generated by spf13/cobra on 9-Feb-2026

```

--------------------------------

### GET /status/{RELEASE_NAME}

Source: https://helm.sh/docs/helm/helm_status

Retrieves the status of a named Helm release, including deployment time, namespace, state, and resource details.

```APIDOC
## GET /status/{RELEASE_NAME}

### Description
Displays the status of a named release, including its current state, revision, and associated Kubernetes resources.

### Method
GET

### Endpoint
helm status RELEASE_NAME

### Parameters
#### Path Parameters
- **RELEASE_NAME** (string) - Required - The name of the release to query.

#### Query Parameters
- **-o, --output** (string) - Optional - Format of the output (table, json, yaml). Default: table.
- **--revision** (int) - Optional - Display the status of a specific revision of the release.
- **-n, --namespace** (string) - Optional - Namespace scope for the request.

### Request Example
helm status my-release --output json

### Response
#### Success Response (200)
- **info** (object) - Contains deployment time, status, and description.
- **manifest** (string) - The Kubernetes resources associated with the release.
- **notes** (string) - Additional notes provided by the chart.

#### Response Example
{
  "name": "my-release",
  "info": {
    "status": "deployed",
    "first_deployed": "2026-02-09T10:00:00Z",
    "last_deployed": "2026-02-09T10:05:00Z"
  },
  "version": 1
}
```

--------------------------------

### Subprocess Runtime Configuration

Source: https://helm.sh/docs/plugins/overview

Configuration for Helm plugins using the 'subprocess' runtime. This allows defining platform-specific commands for execution, installation, update, and deletion, along with arguments.

```yaml
runtimeconfig:
    platformCommand: # Configure command to run based on the platform
        - os: OS match, can be empty or omitted to match any OS
          arch: Architecture match, can be empty or omitted to match any architecture
          command: Plugin command to execute
          args: Plugin command arguments
    platformHooks: # Configure plugin lifecycle hooks based on the platform
        install: # Install lifecycle commands
            - os: OS match, can be empty or omitted to match any OS
              arch: Architecture match, can be empty or omitted to match any architecture
              command: Plugin install command to execute
              args: Plugin install command arguments
        update: # Update lifecycle commands
            - os: OS match, can be empty or omitted to match any OS
              arch: Architecture match, can be empty or omitted to match any architecture
              command: Plugin update command to execute
              args: Plugin update command arguments
        delete: # Delete lifecycle commands
            - os: OS match, can be empty or omitted to match any OS
              arch: Architecture match, can be empty or omitted to match any architecture
              command: Plugin delete command to execute
              args: Plugin delete command arguments
    protocolCommands: # Obsolete/deprecated
        - protocols: [] # Protocols are the list of schemes from the charts URL.
          platformCommand: [] # Same structure as "platformCommand" above
```

--------------------------------

### helm get metadata RELEASE_NAME

Source: https://helm.sh/docs/helm/helm_get_metadata

Fetches metadata for a specified Helm release. You can customize the output format and specify a revision.

```APIDOC
## helm get metadata RELEASE_NAME

### Description
This command fetches metadata for a given release.

### Method
GET (conceptual, as this is a CLI command)

### Endpoint
Not applicable (CLI command)

### Parameters
#### Path Parameters
- **RELEASE_NAME** (string) - Required - The name of the release to fetch metadata for.

#### Query Parameters
- **-o, --output** (string) - Optional - Prints the output in the specified format. Allowed values: table, json, yaml (default table).
- **--revision** (int) - Optional - Specify release revision.

#### Inherited Options
- **--burst-limit** (int) - Optional - Client-side default throttling limit (default 100).
- **--color** (string) - Optional - Use colored output (never, auto, always) (default "auto").
- **--colour** (string) - Optional - Use colored output (never, auto, always) (default "auto").
- **--content-cache** (string) - Optional - Path to the directory containing cached content (e.g. charts) (default "~/.cache/helm/content").
- **--debug** - Optional - Enable verbose output.
- **--kube-apiserver** (string) - Optional - The address and the port for the Kubernetes API server.
- **--kube-as-group** (stringArray) - Optional - Group to impersonate for the operation, this flag can be repeated to specify multiple groups.
- **--kube-as-user** (string) - Optional - Username to impersonate for the operation.
- **--kube-ca-file** (string) - Optional - The certificate authority file for the Kubernetes API server connection.
- **--kube-context** (string) - Optional - Name of the kubeconfig context to use.
- **--kube-insecure-skip-tls-verify** - Optional - If true, the Kubernetes API server's certificate will not be checked for validity. This will make your HTTPS connections insecure.
- **--kube-tls-server-name** (string) - Optional - Server name to use for Kubernetes API server certificate validation. If it is not provided, the hostname used to contact the server is used.
- **--kube-token** (string) - Optional - Bearer token used for authentication.
- **--kubeconfig** (string) - Optional - Path to the kubeconfig file.
- **-n, --namespace** (string) - Optional - Namespace scope for this request.
- **--qps** (float32) - Optional - Queries per second used when communicating with the Kubernetes API, not including bursting.
- **--registry-config** (string) - Optional - Path to the registry config file (default "~/.config/helm/registry/config.json").
- **--repository-cache** (string) - Optional - Path to the directory containing cached repository indexes (default "~/.cache/helm/repository").
- **--repository-config** (string) - Optional - Path to the file containing repository names and URLs (default "~/.config/helm/repositories.yaml").

### Request Example
```bash
helm get metadata my-release -o json
```

### Response
#### Success Response (200)
- **metadata** (object) - Contains various metadata about the release.
  - **name** (string) - The name of the release.
  - **version** (string) - The version of the release.
  - **namespace** (string) - The namespace the release is deployed in.
  - **status** (string) - The current status of the release (e.g., deployed, failed).
  - **first_deployed** (string) - Timestamp of the first deployment.
  - **last_deployed** (string) - Timestamp of the last deployment.
  - **chart** (string) - The name and version of the chart used for the release.
  - **app_version** (string) - The application version specified in the chart.

#### Response Example
```json
{
  "name": "my-release",
  "version": "1.2.3",
  "namespace": "default",
  "status": "deployed",
  "first_deployed": "2023-01-01T10:00:00Z",
  "last_deployed": "2023-01-05T12:00:00Z",
  "chart": "mychart-0.1.0",
  "app_version": "1.16.0"
}
```
```

--------------------------------

### Manage Dictionaries

Source: https://helm.sh/docs/chart_template_guide/function_list

Demonstrates creating, retrieving, updating, and deleting keys in a Helm dictionary.

```helm
$myDict := dict "name1" "value1" "name2" "value2" "name3" "value 3"
get $myDict "name1"
$_ := set $myDict "name4" "value4"
$_ := unset $myDict "name4"
hasKey $myDict "name1"
```

--------------------------------

### Define Custom Resource Definition (CRD)

Source: https://helm.sh/docs/topics/charts

An example of a plain YAML file for a CustomResourceDefinition placed in the crds/ directory. CRDs must not contain template directives.

```yaml
kind: CustomResourceDefinition
metadata:
  name: crontabs.stable.example.com
spec:
  group: stable.example.com
  versions:
    - name: v1
      served: true
      storage: true
  scope: Namespaced
  names:
    plural: crontabs
    singular: crontab
    kind: CronTab
```

--------------------------------

### File System: Remove Default Templates

Source: https://helm.sh/docs/topics/library_charts

Removes all default template files from the newly created chart to start with a clean slate for custom templates.

```bash
$ rm -rf mychart/templates/*
```

--------------------------------

### Build Helm Plugin to WebAssembly using Make

Source: https://helm.sh/docs/plugins/developer/tutorial-getter-plugin

Builds the Helm plugin into a WebAssembly binary using the `make build` command. This step compiles the Go source code into a portable `.wasm` file, ready for deployment and execution.

```bash
$ make build
$ ls -la plugin.wasm
```

--------------------------------

### Helm Test Pod Definition

Source: https://helm.sh/docs/topics/chart_tests

Example Kubernetes Pod definition for a Helm chart test. This pod runs a `wget` command to check connectivity to a service defined in the chart.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: "{{ include \"demo.fullname\" . }}-test-connection"
  labels:
    {{- include \"demo.labels\" . | nindent 4 }}
  annotations:
    "helm.sh/hook": test
spec:
  containers:
    - name: wget
      image: busybox
      command: ['wget']
      args: ['{{ include \"demo.fullname\" . }}:{{ .Values.service.port }}']
  restartPolicy: Never
```

--------------------------------

### Reading YAML Files with Glob Patterns in Helm

Source: https://helm.sh/docs/chart_template_guide/accessing_files

This Helm template example shows how to use the .Files.Glob method to find and read all YAML files within a chart's directory structure. It iterates over the matched files and retrieves their content using .Files.Get.

```yaml
{{ $currentScope := .}}
{{ range $path, $_ :=  .Files.Glob  "**.yaml" }}
    {{- with $currentScope}}
        {{ .Files.Get $path }}
    {{- end }}
{{ end }}
```

```yaml
{{ range $path, $_ :=  .Files.Glob  "**.yaml" }}
      {{ $.Files.Get $path }}
{{ end }}
```

--------------------------------

### Define JSON Schema for Helm Values

Source: https://helm.sh/docs/topics/charts

An example of a values.schema.json file using JSON Schema draft-07 to define required fields and data types for chart values.

```json
{
  "$schema": "https://json-schema.org/draft-07/schema#",
  "properties": {
    "image": {
      "description": "Container Image",
      "properties": {
        "repo": {
          "type": "string"
        },
        "tag": {
          "type": "string"
        }
      },
      "type": "object"
    },
    "name": {
      "description": "Service name",
      "type": "string"
    },
    "port": {
      "description": "Port",
      "minimum": 0,
      "type": "integer"
    },
    "protocol": {
      "type": "string"
    }
  },
  "required": [
    "protocol",
    "port"
  ],
  "title": "Values",
  "type": "object"
}
```

--------------------------------

### Generate and Install Helm Bash Autocompletion

Source: https://helm.sh/docs/helm/helm_completion_bash

Provides commands to generate the bash autocompletion script for Helm. It includes instructions for loading completions in the current session and persisting them for future sessions on Linux and MacOS.

```bash
source <(helm completion bash)
```

```bash
helm completion bash > /etc/bash_completion.d/helm
```

```bash
helm completion bash > /usr/local/etc/bash_completion.d/helm
```

--------------------------------

### Helm Schema Validation Commands

Source: https://helm.sh/docs/topics/charts

Common Helm commands for installing, upgrading, or linting charts with schema validation, including an option to skip validation.

```bash
helm install --set port=443
helm install --skip-schema-validation
```

--------------------------------

### Override Subchart Values from Parent

Source: https://helm.sh/docs/chart_template_guide/subcharts_and_globals

Example of modifying the parent chart's values.yaml to override specific values within a subchart.

```yaml
favorite:
  drink: coffee
  food: pizza
pizzaToppings:
  - mushrooms
  - cheese
  - peppers
  - onions

mysubchart:
  dessert: ice cream
```

--------------------------------

### Grant User Read-Only Access to a Namespace using kubectl

Source: https://helm.sh/docs/topics/rbac

This example demonstrates granting a user 'sam' read-only access to the 'foo' namespace, including the ability to read secrets. It involves creating the namespace, the 'secret-reader' ClusterRole (if not already present), and then creating RoleBindings for both the 'view' and 'secret-reader' roles.

```bash
$ kubectl create namespace foo
$ kubectl create rolebinding sam-view \
    --clusterrole view \
    --user sam \
    --namespace foo
$ kubectl create rolebinding sam-secret-reader \
    --clusterrole secret-reader \
    --user sam \
    --namespace foo
```

--------------------------------

### Get Helm Environment Variables (Shell)

Source: https://helm.sh/docs/topics/plugins

This command retrieves environment variables related to Helm, which can be useful for locating Helm's plugin directory.

```shell
helm env
```

--------------------------------

### Rollback a Helm Release

Source: https://helm.sh/docs/intro/using_helm

Reverts a release to a specific revision number. Revision numbers are incremented automatically with every install, upgrade, or rollback operation.

```bash
helm rollback happy-panda 1
```

--------------------------------

### Initialize and Manage Helm Charts

Source: https://helm.sh/docs/chart_template_guide/getting_started

Commands to create a new Helm chart structure and clean up default template files for custom development.

```bash
helm create mychart
rm -rf mychart/templates/*
```

--------------------------------

### Upgrade release with multiple values files

Source: https://helm.sh/docs/helm/helm_upgrade

Demonstrates how to upgrade a release using multiple YAML values files. The last file specified in the command takes precedence for any overlapping keys.

```bash
helm upgrade -f myvalues.yaml -f override.yaml redis ./redis
```

--------------------------------

### Helm CLI: Get Deployed Manifest

Source: https://helm.sh/docs/topics/library_charts

Retrieves and displays the Kubernetes manifest for a deployed Helm release. This confirms that the ConfigMap with the overridden value was correctly applied.

```bash
$ helm get manifest mydemo
---
# Source: mychart/templates/configmap.yaml
apiVersion: v1
data:
  myvalue: Hello World
kind: ConfigMap
metadata:
  labels:
    app: mychart
    chart: mychart-0.1.0
    release: mydemo
  name: mychart-mydemo
```

--------------------------------

### String Containment and Prefix/Suffix Check (contains, hasPrefix, hasSuffix)

Source: https://helm.sh/docs/chart_template_guide/function_list

These functions test relationships between strings. `contains` checks if one string is a substring of another. `hasPrefix` and `hasSuffix` verify if a string starts or ends with a specified substring, respectively.

```Helm
contains "cat" "catch"
```

```Helm
hasPrefix "cat" "catch"
```

--------------------------------

### Add Helm Chart Repository

Source: https://helm.sh/docs/helm/helm_repo_add

Adds a Helm chart repository by specifying a name and URL. This command allows for the management of chart sources, enabling users to install charts from custom or public repositories. Options include specifying credentials, TLS settings, and force updating an existing repository.

```bash
helm repo add [NAME] [URL] [flags]
```

--------------------------------

### Helm Show All Command Options

Source: https://helm.sh/docs/helm/helm_show_all

This section lists the available options for the 'helm show all' command. These options control aspects like TLS verification, certificate usage, development version inclusion, and specifying chart versions. They allow for fine-grained control over how the chart is inspected and downloaded.

```bash
      --ca-file string
              verify certificates of HTTPS-enabled servers using this CA bundle  
      --cert-file string
              identify HTTPS client using this SSL certificate file  
      --devel
              use development versions, too. Equivalent to version '>0.0.0-0'. If --version is set, this is ignored  
  -h, --help
              help for all  
      --insecure-skip-tls-verify
              skip tls certificate checks for the chart download  
      --key-file string
              identify HTTPS client using this SSL key file  
      --keyring string
              location of public keys used for verification (default "~/.gnupg/pubring.gpg")  
      --pass-credentials
              pass credentials to all domains  
      --password string
              chart repository password where to locate the requested chart  
      --plain-http
              use insecure HTTP connections for the chart download  
      --repo string
              chart repository url where to locate the requested chart  
      --username string
              chart repository username where to locate the requested chart  
      --verify
              verify the package before using it  
      --version string
              specify a version constraint for the chart version to use. This constraint can be a specific tag (e.g. 1.1.1) or it may reference a valid range (e.g. ^2.0.0). If this is not specified, the latest version is used  
```

--------------------------------

### Manage Local Helm Repositories

Source: https://helm.sh/docs/intro/using_helm

Shows how to add a new Helm repository to the local client and search for charts within added repositories. This process allows for offline searching of previously indexed charts.

```bash
helm repo add brigade https://brigadecore.github.io/charts
helm search repo brigade
```

--------------------------------

### Accessing Values in Helm Template

Source: https://helm.sh/docs/chart_template_guide/values_files

This example demonstrates how to access a value defined in `values.yaml` (specifically `favoriteDrink`) within a Helm ConfigMap template. The `{{ .Values.favoriteDrink }}` syntax is used to inject the value.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ .Values.favoriteDrink }}
```

--------------------------------

### Helm Get Values Command Usage

Source: https://helm.sh/docs/helm/helm_get_values

This command downloads the values file for a given Helm release. It can be used with flags to control the output format and retrieve specific revisions or all computed values.

```bash
helm get values RELEASE_NAME [flags]
```

--------------------------------

### Helm Repo Index Command Options

Source: https://helm.sh/docs/helm/helm_repo_index

Provides a list of available options for the 'helm repo index' command, including flags for help, JSON output, merging with existing indexes, and specifying the repository URL.

```bash
helm repo index --help
helm repo index --json
helm repo index --merge <index.yaml>
helm repo index --url <repository_url>
```

--------------------------------

### Accessing Nested Values in Helm Template

Source: https://helm.sh/docs/chart_template_guide/values_files

This example shows how to access values from a nested structure defined in `values.yaml` within a Helm template. The `{{ .Values.favorite.drink }}` and `{{ .Values.favorite.food }}` syntax is used.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ .Values.favorite.drink }}
  food: {{ .Values.favorite.food }}
```

--------------------------------

### Example of Removed Deployment API Version in Kubernetes 1.16

Source: https://helm.sh/docs/topics/kubernetes_apis

This snippet demonstrates a Kubernetes Deployment object using an API version that was removed in Kubernetes 1.16. Chart maintainers should update such definitions to use supported API versions to prevent deployment failures.

```yaml
apiVersion: apps/v1beta1
kind: Deployment

```

--------------------------------

### Helm Deployment Template Override

Source: https://helm.sh/docs/topics/library_charts

Example of overriding the default deployment template in a Helm chart to utilize the common helper chart's deployment functionality. It shows how to include common deployment configurations and define specific overrides.

```yaml
{{- template "common.deployment" (list . "demo.deployment") -}}
{{- define "demo.deployment" -}}
## Define overrides for your Deployment resource here, e.g.  
apiVersion: apps/v1
spec:
  replicas: {{ .Values.replicaCount }}
  selector:
    matchLabels:
      {{- include "demo.selectorLabels" . | nindent 6 }}
  template:
    metadata:
      labels:
        {{- include "demo.selectorLabels" . | nindent 8 }}

{{- end -}}

```

--------------------------------

### Helm SDK: Create Registry Client (Go)

Source: https://helm.sh/docs/sdk/examples

Creates a new Helm registry client, enabling interaction with OCI registries. It supports various configuration options including TLS settings, credentials, and caching. This client is used for pulling and pushing Helm charts to and from remote repositories.

```Go
package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"

	"helm.sh/helm/v4/pkg/action"
	"helm.sh/helm/v4/pkg/cli"
	"helm.sh/helm/v4/pkg/registry"
)

func newRegistryClient(settings *cli.EnvSettings, certFile, keyFile, caFile string, insecureSkipTLSVerify, plainHTTP bool) (*registry.Client, error) {

	opts := []registry.ClientOption{
		registry.ClientOptDebug(settings.Debug),
		registry.ClientOptEnableCache(true),
		registry.ClientOptWriter(os.Stderr),
		registry.ClientOptCredentialsFile(settings.RegistryConfig),
	}

	if plainHTTP {
		opts = append(opts, registry.ClientOptPlainHTTP())
	}

	if certFile != "" && keyFile != "" || caFile != "" || insecureSkipTLSVerify {
		tlsConf, err := NewTLSConfig(
			WithInsecureSkipVerify(insecureSkipTLSVerify),
			WithCertKeyPairFiles(certFile, keyFile),
			WithCAFile(caFile),
		)
		if err != nil {
			return nil, fmt.Errorf("failed to load client TLS certs: %w", err)
		}

		opts = append(opts, registry.ClientOptHTTPClient(&http.Client{
			Transport: &http.Transport{
				TLSClientConfig: tlsConf,
				Proxy:           http.ProxyFromEnvironment,
			},
		}))
	}

	// Create a new registry client
	registryClient, err := registry.NewClient(opts...)
	if err != nil {
		return nil, fmt.Errorf("failed to initialize registry client: %w", err)
	}

	return registryClient, nil
}

```

--------------------------------

### Helm Values Naming Conventions

Source: https://helm.sh/docs/chart_best_practices/values

Demonstrates correct and incorrect naming conventions for Helm chart values. Correct names start with a lowercase letter and use camelCase. Incorrect names use initial caps or hyphens.

```yaml
chicken: true
chickenNoodleSoup: true
```

```yaml
Chicken: true  # initial caps may conflict with built-ins
chicken-noodle-soup: true # do not use hyphens in the name
```

--------------------------------

### Update Helm Plugins

Source: https://helm.sh/docs/helm/helm_plugin_update

This command updates one or more specified Helm plugins to their latest available versions. It requires the names of the plugins to be updated as arguments. Ensure Helm is installed and configured correctly before use.

```bash
helm plugin update <plugin>...
```

--------------------------------

### Helm Service Template Override

Source: https://helm.sh/docs/topics/library_charts

Example of overriding the default service template in a Helm chart to integrate with the common helper chart. This allows for shared service configurations and custom modifications.

```yaml
{{- template "common.service" (list . "demo.service") -}}
{{- define "demo.service" -}}
## Define overrides for your Service resource here, e.g.  
# metadata:
#   labels:
#     custom: label
# spec:
#   ports:
#   - port: 8080
{{- end -}}

```

--------------------------------

### Create Helm Library Chart Scaffold

Source: https://helm.sh/docs/topics/library_charts

Commands to create a new Helm chart scaffold and remove unnecessary default files and configurations to prepare it as a library chart.

```bash
$ helm create mylibchart
Creating mylibchart  

```

```bash
$ rm -rf mylibchart/templates/*  

```

```bash
$ rm -f mylibchart/values.yaml  

```

--------------------------------

### Define a Simple Helm Plugin Configuration

Source: https://helm.sh/docs/topics/plugins

This YAML snippet demonstrates a basic plugin configuration that executes a command to list the last release name. It defines metadata fields and a platform-agnostic command execution.

```yaml
name: last
version: 0.1.0
usage: get the last release name
description: get the last release name
ignoreFlags: false
platformCommand:
  - command: ${HELM_BIN}
    args:
      - list
      - --short
      - --max=1
      - --date
      - -r
```

--------------------------------

### Access File Lines in Templates

Source: https://helm.sh/docs/chart_template_guide/accessing_files

This snippet illustrates how to use the `Files.Lines` method to iterate over each line of a specified file within a Helm template. This is useful when you need to process or display file content line by line, for example, within a ConfigMap's data.

```yaml
data:
  some-file.txt: {{ range .Files.Lines "foo/bar.txt" }}
    {{ . }}{{ end }}

```

--------------------------------

### Generate Helm Completion Script for Fish Shell

Source: https://helm.sh/docs/helm/helm_completion_fish

This command generates an autocompletion script for Helm specifically for the Fish shell. It can be used to load completions in the current session or to save them for all future sessions. Ensure a new shell is started for the changes to take effect.

```bash
helm completion fish
helm completion fish | source
helm completion fish > ~/.config/fish/completions/helm.fish
```

--------------------------------

### List Helm Repositories

Source: https://helm.sh/docs/topics/chart_repository

Lists all the Helm repositories that have been added to the client. This command displays the names and URLs of the configured repositories.

```bash
$ helm repo list
```

--------------------------------

### Helm Template Commenting Best Practices

Source: https://helm.sh/docs/chart_best_practices/templates

Explains the difference between YAML comments and Helm template comments, recommending template comments for documenting template logic and YAML comments for user-visible debugging information. Shows correct usage to avoid rendering errors.

```go-template
{{- /*
This is a comment.
*/}}
type: frobnitz

```

```go-template
{{- /*
mychart.shortname provides a 6 char truncated version of the release name.
*/}}
{{ define "mychart.shortname" -}}
{{ .Release.Name | trunc 6 }}
{{- end -}}

```

```yaml
# This is a comment
type: sprocket

```

```yaml
# This may cause problems if the value is more than 100Gi
memory: {{ .Values.maxMem | quote }}

```

```go-template
{{- /*
# This may cause problems if the value is more than 100Gi
memory: {{ required "maxMem must be set" .Values.maxMem | quote }}
*/ -}}

```

--------------------------------

### Implement Plugin Logic

Source: https://helm.sh/docs/plugins/developer/tutorial-cli-plugin

A shell script that outputs system and Helm environment information when the plugin is executed.

```bash
#!/bin/bash

echo "=== System Information ==="
echo "OS: $(uname -s)"
echo "Architecture: $(uname -m)"

echo ""
echo "=== Helm Information ==="
echo "Plugin Dir: $HELM_PLUGIN_DIR"
echo "Arguments: $*"

echo ""
echo "System info complete!"
```

--------------------------------

### Perform Fuzzy Search on Local Repositories

Source: https://helm.sh/docs/intro/using_helm

Illustrates the use of fuzzy string matching with the 'helm search repo' command to find charts by partial names.

```bash
helm search repo kash
```

--------------------------------

### Helm Template Structure

Source: https://helm.sh/docs/topics/charts

Overview of how to define Kubernetes manifests using Go templates and inject dynamic values.

```APIDOC
## Helm Template Syntax

### Description
Helm uses Go templates to generate Kubernetes manifests. Values are injected using the `{{ .Values.key }}` syntax.

### Template Example
```yaml
apiVersion: v1
kind: ReplicationController
metadata:
  name: {{ .Release.Name }}
spec:
  template:
    spec:
      containers:
        - name: app
          image: {{ .Values.imageRegistry }}/app:{{ .Values.dockerTag }}
```

### Pre-defined Objects
- **Release.Name** (string) - The name of the release.
- **Release.Namespace** (string) - The target namespace.
- **Chart** (object) - Contents of Chart.yaml.
- **Capabilities** (object) - Information about the Kubernetes cluster version and APIs.
```

--------------------------------

### Helm `range` Action for Iteration

Source: https://helm.sh/docs/chart_template_guide/control_structures

The `range` action in Helm templates iterates over a collection (like a list or map), similar to `for` loops in other languages. Inside the loop, `.` is set to the current item. The `$` symbol can be used to access variables from the root scope, such as lists defined in `values.yaml`. This example demonstrates iterating over a list of pizza toppings and applying transformations like `title` and `quote`.

```Go Template
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  {{- with .Values.favorite }}
  drink: {{ .drink | default "tea" | quote }}
  food: {{ .food | upper | quote }}
  {{- end }}
  toppings: |-
    {{- range .Values.pizzaToppings }}
    - {{ . | title | quote }}
    {{- end }}
```

```Go Template
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  {{- with .Values.favorite }}
  drink: {{ .drink | default "tea" | quote }}
  food: {{ .food | upper | quote }}
  toppings: |-
    {{- range $.Values.pizzaToppings }}
    - {{ . | title | quote }}
    {{- end }}
  {{- end }}
```

--------------------------------

### Build Helm from Source (Linux, macOS)

Source: https://helm.sh/docs/intro/install

Compile Helm from its source code. This method requires a working Go environment and is suitable for testing the latest development versions.

```bash
git clone https://github.com/helm/helm.git
cd helm
make
```

--------------------------------

### Wildcard Comparisons in SemVer

Source: https://helm.sh/docs/chart_template_guide/function_list

Demonstrates the use of wildcard characters (`x`, `X`, `*`) in SemVer comparisons. These wildcards allow for flexible version matching across major, minor, or patch levels.

```go-template
'1.2.x'
'>= 1.2.x'
'<= 2.x'
'*'

```

--------------------------------

### Use Repository Aliases in Dependencies

Source: https://helm.sh/docs/topics/charts

Demonstrates how to reference a chart from a previously added repository using an alias in the dependency definition.

```yaml
dependencies:
  - name: awesomeness
    version: 1.0.0
    repository: "@fantastic-charts"
```

--------------------------------

### Create Helm Chart Scaffold

Source: https://helm.sh/docs/topics/library_charts

Command to create a new Helm chart scaffold. This is the initial step before integrating helper charts.

```bash
$ helm create demo
```

--------------------------------

### Handling Prerelease Versions in Comparisons

Source: https://helm.sh/docs/chart_template_guide/function_list

Explains how prerelease versions (e.g., `-beta.1`) are handled in SemVer comparisons. By default, constraints without a prerelease comparator skip prereleases. Appending `-0` or using specific prerelease comparators ensures prereleases are included in comparisons.

```go-template
'>=1.2.3-0'

```

--------------------------------

### Helm Show All Command Usage

Source: https://helm.sh/docs/helm/helm_show_all

This snippet demonstrates the basic usage of the 'helm show all' command. It is used to inspect a Helm chart (directory, file, or URL) and display all its content, including values.yaml, Chart.yaml, and README files. It accepts a CHART argument and various flags for customization.

```bash
helm show all [CHART] [flags]
```

--------------------------------

### Define Post-Renderer Interface in Go

Source: https://helm.sh/docs/topics/advanced

Shows the Go interface required to implement a custom post-renderer. The Run method processes a buffer of rendered manifests and returns the modified content or an error.

```go
type PostRenderer interface {
    Run(renderedManifests *bytes.Buffer) (modifiedManifests *bytes.Buffer, err error)
}
```

--------------------------------

### Helm Chart Dependency Versioning

Source: https://helm.sh/docs/chart_best_practices/dependencies

Demonstrates recommended versioning strategies for Helm chart dependencies. It shows how to use version ranges, specifically patch-level matching with the '~' operator, to allow for updates while maintaining compatibility. It also illustrates how to include pre-release versions.

```yaml
version: ~1.2.3
```

```yaml
version: ~1.2.3-0
```

--------------------------------

### Define a Helm NOTES.txt Template

Source: https://helm.sh/docs/chart_template_guide/notes_files

This snippet demonstrates the content of a NOTES.txt file using Go template syntax to display the chart name and release name dynamically. It is placed within the templates directory of a Helm chart.

```text
Thank you for installing {{ .Chart.Name }}.  
  
Your release is named {{ .Release.Name }}.  
  
To learn more about the release, try:  
  
  $ helm status {{ .Release.Name }}  
  $ helm get all {{ .Release.Name }}
```

--------------------------------

### Verify Helm Chart with Keybase

Source: https://helm.sh/docs/topics/provenance

Commands to track a maintainer via Keybase, pull their PGP keys, and verify a Helm chart package.

```bash
keybase follow technosophos
keybase pgp pull
helm verify somechart-1.2.3.tgz
```

--------------------------------

### Helm upgrade command syntax

Source: https://helm.sh/docs/helm/helm_upgrade

The basic syntax structure for executing the helm upgrade command.

```bash
helm upgrade [RELEASE] [CHART] [flags]
```

--------------------------------

### Upgrade release with multiple set flags

Source: https://helm.sh/docs/helm/helm_upgrade

Shows how to use the --set flag multiple times to override configuration values. The right-most flag takes precedence.

```bash
helm upgrade --set foo=bar --set foo=newbar redis ./redis
```

--------------------------------

### Create a Subchart

Source: https://helm.sh/docs/chart_template_guide/subcharts_and_globals

Commands to initialize a new subchart within an existing Helm chart directory and clear default templates.

```bash
cd mychart/charts
helm create mysubchart
rm -rf mysubchart/templates/*
```

--------------------------------

### Helm SDK: Initialize Action Configuration (Go)

Source: https://helm.sh/docs/sdk/examples

Initializes the action configuration for Helm SDK operations. It sets up the necessary connection details to the Kubernetes cluster and specifies the namespace for operations. This function is crucial for any Helm SDK action that requires cluster interaction.

```Go
package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"

	"helm.sh/helm/v4/pkg/action"
	"helm.sh/helm/v4/pkg/cli"
	"helm.sh/helm/v4/pkg/registry"
)

var helmDriver string = os.Getenv("HELM_DRIVER")

func initActionConfig(settings *cli.EnvSettings, logger *log.Logger) (*action.Configuration, error) {
	return initActionConfigList(settings, logger, false)
}

func initActionConfigList(settings *cli.EnvSettings, logger *log.Logger, allNamespaces bool) (*action.Configuration, error) {

	actionConfig := new(action.Configuration)

	namespace := func() string {
		// For list action, you can pass an empty string instead of settings.Namespace() to list
		// all namespaces
		if allNamespaces {
			return ""
		}
		return settings.Namespace()
	}()

	if err := actionConfig.Init(
		settings.RESTClientGetter(),
		namespace,
		helmdriver);
		err != nil {
		return nil, err
	}

	return actionConfig, nil
}

```

--------------------------------

### ConfigMap and Secrets Utility Functions

Source: https://helm.sh/docs/chart_template_guide/accessing_files

Demonstrates how to use Glob, AsConfig, and AsSecrets to place file content into ConfigMaps and Secrets. This is particularly useful when organizing files using Glob.

```APIDOC
## ConfigMap and Secrets Utility Functions

### Description
This section explains how to use Helm's utility functions `Files.Glob`, `Files.AsConfig`, and `Files.AsSecrets` to manage file content within ConfigMaps and Secrets. It's recommended to use these in conjunction with `Files.Glob` for better organization.

### Method
N/A (Template Directives)

### Endpoint
N/A (Helm Template)

### Parameters
N/A

### Request Example
```yaml
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: conf
data:
{{ (.Files.Glob "foo/*").AsConfig | indent 2 }}
---
apiVersion: v1
kind: Secret
metadata:
  name: very-secret
type: Opaque
data:
{{ (.Files.Glob "bar/*").AsSecrets | indent 2 }}
```

### Response
N/A (Generated Kubernetes manifests)
```

--------------------------------

### Pull Helm Chart from OCI Repository (Go)

Source: https://helm.sh/docs/sdk/examples

This Go code snippet demonstrates how to pull a Helm chart from an OCI repository using the Helm SDK. It initializes the action configuration, creates a pull client, and executes the pull operation. Dependencies include the Helm SDK for Go. The function takes logger, settings, chart reference, and chart version as input, and outputs the result of the pull operation or an error.

```Go
package main

import (
	"fmt"
	"log"

	"helm.sh/helm/v4/pkg/action"
	"helm.sh/helm/v4/pkg/cli"
)

func runPull(logger *log.Logger, settings *cli.EnvSettings, chartRef, chartVersion string) error {

actionConfig, err := initActionConfig(settings, logger)
	if err != nil {
		return fmt.Errorf("failed to init action config: %w", err)
	}


pullClient := action.NewPull(action.WithConfig(actionConfig))
	// client.RepoURL = ""

pullClient.DestDir = "./"

pullClient.Settings = settings

pullClient.Version = chartVersion

registryClient, err := newRegistryClient(
		settings,
		pullClient.CertFile,
		pullClient.KeyFile,
		pullClient.CaFile,
		pullClient.InsecureSkipTLSverify,
		pullClient.PlainHTTP)
	if err != nil {
		return fmt.Errorf("failed to created registry client: %w", err)
	}
	actionConfig.RegistryClient = registryClient



















































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































```

--------------------------------

### CLI Command: helm plugin package

Source: https://helm.sh/docs/helm/helm_plugin_package

Packages a local Helm plugin directory into a tarball, with options for PGP signing and destination configuration.

```APIDOC
## COMMAND: helm plugin package

### Description
This command packages a Helm plugin directory into a tarball. By default, it generates a provenance file signed with a PGP key to ensure the plugin can be verified after installation.

### Method
CLI Command

### Endpoint
helm plugin package [PATH] [flags]

### Parameters
#### Path Parameters
- **PATH** (string) - Required - The local file system path to the plugin directory.

#### Flags
- **-d, --destination** (string) - Optional - The directory path where the resulting tarball will be written. Defaults to the current directory.
- **--sign** (boolean) - Optional - Whether to use a PGP private key to sign the plugin. Defaults to true.
- **--key** (string) - Optional - The name of the PGP key to use for signing.
- **--keyring** (string) - Optional - Path to the public keyring file. Defaults to "~/.gnupg/pubring.gpg".
- **--passphrase-file** (string) - Optional - Path to a file containing the passphrase for the signing key.

### Request Example
helm plugin package ./my-plugin --destination ./dist --sign=true

### Response
#### Success Response (stdout)
- **Output** (string) - Confirmation message indicating the plugin has been packaged and signed (if applicable).

#### Response Example
Successfully packaged plugin and saved it to: ./dist/my-plugin-0.1.0.tgz
```

--------------------------------

### Helm Verify Command Options

Source: https://helm.sh/docs/helm/helm_verify

Lists the available options for the 'helm verify' command, including help flags and specific options like specifying a custom keyring for public keys. It also inherits common Helm command-line options for configuration and control.

```bash
helm verify PATH [flags]

Options:
  -h, --help             help for verify
      --keyring string   keyring containing public keys (default "~/.gnupg/pubring.gpg")

Options inherited from parent commands:
      --burst-limit int                 client-side default throttling limit (default 100)
      --color string                    use colored output (never, auto, always) (default "auto")
      --colour string                   use colored output (never, auto, always) (default "auto")
      --content-cache string            path to the directory containing cached content (e.g. charts) (default "~/.cache/helm/content")
      --debug                           enable verbose output
      --kube-apiserver string           the address and the port for the Kubernetes API server
      --kube-as-group stringArray       group to impersonate for the operation, this flag can be repeated to specify multiple groups.
      --kube-as-user string             username to impersonate for the operation
      --kube-ca-file string             the certificate authority file for the Kubernetes API server connection
      --kube-context string             name of the kubeconfig context to use
      --kube-insecure-skip-tls-verify   if true, the Kubernetes API server's certificate will not be checked for validity. This will make your HTTPS connections insecure
      --kube-tls-server-name string     server name to use for Kubernetes API server certificate validation. If it is not provided, the hostname used to contact the server is used
      --kube-token string               bearer token used for authentication
      --kubeconfig string               path to the kubeconfig file
  -n, --namespace string                namespace scope for this request
      --qps float32                     queries per second used when communicating with the Kubernetes API, not including bursting
      --registry-config string          path to the registry config file (default "~/.config/helm/registry/config.json")
      --repository-cache string         path to the directory containing cached repository indexes (default "~/.cache/helm/repository")
      --repository-config string        path to the file containing repository names and URLs (default "~/.config/helm/repositories.yaml")
```

--------------------------------

### Global Helm CLI Options

Source: https://helm.sh/docs/helm/helm_list

This section lists and describes the global options that can be applied to most Helm commands.

```APIDOC
## Global Helm CLI Options

### Description
These are global options that can be passed to most Helm commands to modify their behavior.

### Method
N/A (CLI Options)

### Endpoint
N/A (CLI Options)

### Parameters
#### Global Options
- **--burst-limit** (int) - Optional - Client-side default throttling limit (default 100).
- **--color** (string) - Optional - Use colored output (never, auto, always) (default "auto").
- **--colour** (string) - Optional - Use colored output (never, auto, always) (default "auto").
- **--content-cache** (string) - Optional - Path to the directory containing cached content (e.g. charts) (default "~/.cache/helm/content").
- **--debug** (bool) - Optional - Enable verbose output.
- **--kube-apiserver** (string) - Optional - The address and the port for the Kubernetes API server.
- **--kube-as-group** (stringArray) - Optional - Group to impersonate for the operation, this flag can be repeated to specify multiple groups.
- **--kube-as-user** (string) - Optional - Username to impersonate for the operation.
- **--kube-ca-file** (string) - Optional - The certificate authority file for the Kubernetes API server connection.
- **--kube-context** (string) - Optional - Name of the kubeconfig context to use.
- **--kube-insecure-skip-tls-verify** (bool) - Optional - If true, the Kubernetes API server's certificate will not be checked for validity. This will make your HTTPS connections insecure.
- **--kube-tls-server-name** (string) - Optional - Server name to use for Kubernetes API server certificate validation. If it is not provided, the hostname used to contact the server is used.
- **--kube-token** (string) - Optional - Bearer token used for authentication.
- **--kubeconfig** (string) - Optional - Path to the kubeconfig file.
- **-n, --namespace** (string) - Optional - Namespace scope for this request.
- **--qps** (float32) - Optional - Queries per second used when communicating with the Kubernetes API, not including bursting.
- **--registry-config** (string) - Optional - Path to the registry config file (default "~/.config/helm/registry/config.json").
- **--repository-cache** (string) - Optional - Path to the directory containing cached repository indexes (default "~/.cache/helm/repository").
- **--repository-config** (string) - Optional - Path to the file containing repository names and URLs (default "~/.config/helm/repositories.yaml").

### Request Example
```bash
helm install my-release ./my-chart --namespace default --debug
```

### Response
N/A (CLI Options)

### Response Example
N/A (CLI Options)
```

--------------------------------

### Helm List Command Syntax

Source: https://helm.sh/docs/helm/helm_list

The basic syntax for executing the helm list command with available flags.

```bash
helm list [flags]
```

--------------------------------

### Hyphen Range Comparisons for SemVer

Source: https://helm.sh/docs/chart_template_guide/function_list

Illustrates hyphen range comparisons, which define a lower and upper bound for version matching. These ranges are inclusive of the lower bound and inclusive of the upper bound.

```go-template
'1.2 - 1.4.5'
'2.3.4 - 4.5'

```

--------------------------------

### CLI Command: helm plugin verify

Source: https://helm.sh/docs/helm/helm_plugin_verify

Verifies that a Helm plugin at the specified path has been signed and is valid.

```APIDOC
## helm plugin verify

### Description
Verifies that a Helm plugin has a valid provenance file and that the provenance file is signed by a trusted PGP key. It supports both plugin tarballs and installed plugin directories.

### Method
CLI Command

### Endpoint
helm plugin verify [PATH] [flags]

### Parameters
#### Path Parameters
- **PATH** (string) - Required - The file system path to the plugin tarball or the directory of an installed plugin.

#### Flags
- **--keyring** (string) - Optional - Path to the keyring containing public keys (default: "~/.gnupg/pubring.gpg").
- **-h, --help** (boolean) - Optional - Help for the verify command.

### Request Example
helm plugin verify ~/.local/share/helm/plugins/example-cli

### Response
#### Success Response (0)
- **Output** (string) - Returns a success message if the signature is valid.

#### Error Response (1)
- **Output** (string) - Returns an error message if the verification fails or the file is not found.
```

--------------------------------

### Helm Show All Inherited Parent Command Options

Source: https://helm.sh/docs/helm/helm_show_all

This snippet details options inherited from parent commands that can be used with 'helm show all'. These include settings for Kubernetes API connection, client-side throttling, output coloring, caching directories, debugging, and namespace scope. They provide broader control over Helm's interaction with Kubernetes and its configuration.

```bash
      --burst-limit int
              client-side default throttling limit (default 100)  
      --color string
              use colored output (never, auto, always) (default "auto")  
      --colour string
              use colored output (never, auto, always) (default "auto")  
      --content-cache string
              path to the directory containing cached content (e.g. charts) (default "~/.cache/helm/content")  
      --debug
              enable verbose output  
      --kube-apiserver string
              the address and the port for the Kubernetes API server  
      --kube-as-group stringArray
              group to impersonate for the operation, this flag can be repeated to specify multiple groups.  
      --kube-as-user string
              username to impersonate for the operation  
      --kube-ca-file string
              the certificate authority file for the Kubernetes API server connection  
      --kube-context string
              name of the kubeconfig context to use  
      --kube-insecure-skip-tls-verify
              if true, the Kubernetes API server's certificate will not be checked for validity. This will make your HTTPS connections insecure  
      --kube-tls-server-name string
              server name to use for Kubernetes API server certificate validation. If it is not provided, the hostname used to contact the server is used  
      --kube-token string
              bearer token used for authentication  
      --kubeconfig string
              path to the kubeconfig file  
  -n, --namespace string
              namespace scope for this request  
      --qps float32
              queries per second used when communicating with the Kubernetes API, not including bursting  
      --registry-config string
              path to the registry config file (default "~/.config/helm/registry/config.json")  
      --repository-cache string
              path to the directory containing cached repository indexes (default "~/.cache/helm/repository")  
      --repository-config string
              path to the file containing repository names and URLs (default "~/.config/helm/repositories.yaml")  
```

--------------------------------

### Implementing If/Else Conditional Logic in Helm Templates

Source: https://helm.sh/docs/chart_template_guide/control_structures

Demonstrates the syntax for conditional blocks in Helm templates using if/else. It explains how pipelines are evaluated for truthiness and shows a practical application within a ConfigMap.

```yaml
{{ if PIPELINE }}  
  # Do something  
{{ else if OTHER PIPELINE }}  
  # Do something else  
{{ else }}  
  # Default case  
{{ end }}
```

```yaml
apiVersion: v1  
kind: ConfigMap  
metadata:  
  name: {{ .Release.Name }}-configmap  
data:  
  myvalue: "Hello World"  
  drink: {{ .Values.favorite.drink | default "tea" | quote }}  
  food: {{ .Values.favorite.food | upper | quote }}  
  {{ if eq .Values.favorite.drink "coffee" }}mug: "true"{{ end }}
```

--------------------------------

### Manage Helm Charts

Source: https://helm.sh/docs/intro/CheatSheet

Commands for creating, packaging, linting, and inspecting Helm charts. These tools help developers prepare and validate charts before deployment.

```bash
helm create <name>
helm package <chart-path>
helm lint <chart>
helm show all <chart>
helm show values <chart>
helm pull <chart>
helm pull <chart> --untar=true
helm pull <chart> --verify
helm pull <chart> --version <number>
helm dependency list <chart>
```

--------------------------------

### CLI Command: helm verify

Source: https://helm.sh/docs/helm/helm_verify

Verify the integrity and provenance of a local Helm chart.

```APIDOC
## helm verify

### Description
Verify that the given chart has a valid provenance file. Provenance files provide cryptographic verification that a chart has not been tampered with and was packaged by a trusted provider.

### Method
CLI Command

### Endpoint
helm verify PATH [flags]

### Parameters
#### Path Parameters
- **PATH** (string) - Required - The local file system path to the Helm chart directory or package.

#### Options
- **--keyring** (string) - Optional - Path to the keyring containing public keys (default "~/.gnupg/pubring.gpg").
- **-h, --help** (boolean) - Optional - Display help for the verify command.

### Request Example
helm verify ./my-chart --keyring ./pubring.gpg

### Response
#### Success Response
- **Output** (string) - Returns a confirmation message if the chart is valid and signed correctly.

#### Error Response
- **Output** (string) - Returns an error message if the provenance file is missing, invalid, or the signature does not match.
```

--------------------------------

### Helm Plugin Package Options

Source: https://helm.sh/docs/helm/helm_plugin_package

Provides options for the `helm plugin package` command, including destination for the tarball, signing options, and PGP key management.

```bash
helm plugin package --destination <location> --sign --key <key_name> --keyring <path_to_keyring> --passphrase-file <path_to_passphrase>
```

--------------------------------

### Helm SDK Action Configuration

Source: https://helm.sh/docs/sdk/examples

Initializes the Helm action configuration required for executing SDK commands against a Kubernetes cluster.

```APIDOC
## Initialization: initActionConfig

### Description
Configures the Helm action environment, including REST client access and namespace targeting.

### Method
Internal Function

### Parameters
#### Path Parameters
- **settings** (cli.EnvSettings) - Required - Helm environment settings
- **logger** (log.Logger) - Required - Logger instance

### Response
- **action.Configuration** - The initialized Helm action configuration object.
```

--------------------------------

### Package and sign a Helm chart

Source: https://helm.sh/docs/topics/provenance

This command packages a Helm chart into a versioned archive and signs it using a specified PGP key. This ensures the integrity and origin of the chart.

```bash
$ helm package --sign --key 'John Smith' --keyring path/to/keyring.secret mychart  

```

--------------------------------

### Helm YAML Configuration for RBAC and ServiceAccount

Source: https://helm.sh/docs/chart_best_practices/rbac

Demonstrates the recommended YAML structure for configuring RBAC and ServiceAccount resources in Helm charts. This separation clarifies their distinct roles and facilitates management. It shows basic creation flags and how to extend for multiple components.

```yaml
rbac:
  # Specifies whether RBAC resources should be created
  create: true

serviceAccount:
  # Specifies whether a ServiceAccount should be created
  create: true
  # The name of the ServiceAccount to use.
  # If not set and create is true, a name is generated using the fullname template
  name:  
```

```yaml
someComponent:
  serviceAccount:
    create: true
    name:  
anotherComponent:
  serviceAccount:
    create: true
    name:  
```

--------------------------------

### Import Keybase PGP key into GnuPG

Source: https://helm.sh/docs/topics/provenance

This command imports your PGP key from Keybase.io into your local GnuPG keyring. This allows you to use your Keybase identity for signing Helm charts.

```bash
$ keybase pgp export -s | gpg --import  

```

--------------------------------

### Create Plugin Directory (Shell)

Source: https://helm.sh/docs/plugins/developer/tutorial-postrenderer-plugin

This command creates the necessary directory structure for a Helm plugin on your local filesystem. It ensures the parent directories exist and then changes the current directory to the new plugin's root.

```shell
mkdir -p $HOME/code/helm/plugins/label-injector
cd $HOME/code/helm/plugins/label-injector
```

--------------------------------

### Uninstall Helm Release using Go SDK

Source: https://helm.sh/docs/sdk/examples

Shows how to uninstall an existing Helm release. It configures the deletion propagation strategy and waits for the operation to complete.

```go
func runUninstall(logger *log.Logger, settings *cli.EnvSettings, releaseName string) error {
	actionConfig, err := initActionConfig(settings, logger)
	if err != nil {
		return fmt.Errorf("failed to init action config: %w", err)
	}

	uninstallClient := action.NewUninstall(actionConfig)
	uninstallClient.DeletionPropagation = "foreground"
	uninstallClient.WaitStrategy = "watcher"

	result, err := uninstallClient.Run(releaseName)
	if err != nil {
		return fmt.Errorf("failed to run uninstall action: %w", err)
	}
	logger.Printf("release \"%s\" uninstalled\n", releaseName)
	return nil
}
```

--------------------------------

### helm repo

Source: https://helm.sh/docs/helm/helm_repo

The base command for managing chart repositories in Helm.

```APIDOC
## CLI Command: helm repo

### Description
This command group allows users to interact with chart repositories, including adding, removing, listing, updating, and indexing repositories.

### Method
CLI Command

### Options
- **-h, --help** (bool) - Optional - Show help for the repo command.

### Inherited Options
- **--burst-limit** (int) - Optional - Client-side default throttling limit (default 100).
- **--color** (string) - Optional - Use colored output (never, auto, always) (default "auto").
- **--kubeconfig** (string) - Optional - Path to the kubeconfig file.
- **--namespace** (string) - Optional - Namespace scope for this request.

### Usage
`helm repo [command] [flags]`

### Subcommands
- **add**: Add a chart repository.
- **index**: Generate an index file given a directory containing packaged charts.
- **list**: List chart repositories.
- **remove**: Remove one or more chart repositories.
- **update**: Update information of available charts locally from chart repositories.
```

--------------------------------

### Helm Version Command Usage

Source: https://helm.sh/docs/helm/helm_version

Basic usage of the helm version command and its primary flags for formatting output.

```bash
helm version [flags]
```

```bash
helm version --short
```

```bash
helm version --template='Version: {{.Version}}'
```

--------------------------------

### Define a Reusable Helm Template

Source: https://helm.sh/docs/chart_template_guide/named_templates

Demonstrates how to define a reusable block of YAML using the 'define' keyword. This is typically stored in a _helpers.tpl file.

```yaml
{{/* Generate basic labels */}}
{{- define "mychart.labels" }}
  labels:
    generator: helm
    date: {{ now | htmlDate }}
{{- end }}
```

--------------------------------

### Create ConfigMap and Secret from Files using Glob

Source: https://helm.sh/docs/chart_template_guide/accessing_files

This snippet demonstrates how to use Helm's `Files.Glob` method in conjunction with `AsConfig` and `AsSecrets` to populate ConfigMaps and Secrets with content from files matching a pattern. It's useful for organizing and injecting file data into Kubernetes resources.

```yaml
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: conf
data:
{{ (.Files.Glob "foo/*").AsConfig | indent 2 }}
---
apiVersion: v1
kind: Secret
metadata:
  name: very-secret
type: Opaque
data:
{{ (.Files.Glob "bar/*").AsSecrets | indent 2 }}

```

--------------------------------

### Helm Plugin Directory Structure

Source: https://helm.sh/docs/topics/plugins

A visual representation of the recommended directory structure for a Helm plugin, including the plugin.yaml file and a scripts directory for lifecycle management.

```text
$HELM_PLUGINS/
  |- myplugin/
    |- scripts/
      |- install.ps1
      |- install.sh
    |- plugin.yaml
```

--------------------------------

### POST /helm/repo/add

Source: https://helm.sh/docs/topics/chart_repository

Adds a new Helm chart repository to the local client configuration.

```APIDOC
## POST /helm/repo/add

### Description
Adds a new repository to the Helm client. The repository must contain a valid index.yaml file.

### Method
POST

### Endpoint
helm repo add [NAME] [URL]

### Parameters
#### Path Parameters
- **NAME** (string) - Required - The local name to reference the repository.
- **URL** (string) - Required - The remote URL of the repository.

#### Query Parameters
- **--username** (string) - Optional - Username for HTTP basic authentication.
- **--password** (string) - Optional - Password for HTTP basic authentication.
- **--insecure-skip-tls-verify** (boolean) - Optional - Skip CA verification for self-signed certificates.

### Request Example
helm repo add fantastic-charts https://fantastic-charts.storage.googleapis.com --username my-user --password my-pass

### Response
#### Success Response (200)
- **status** (string) - Confirmation that the repository has been added.
```

--------------------------------

### Define Helm Plugin Manifest

Source: https://helm.sh/docs/plugins/developer/tutorial-cli-plugin

The plugin.yaml file defines the plugin metadata, runtime type, and the command to execute.

```yaml
apiVersion: v1
type: cli/v1
name: "system-info"
version: "0.1.0"
runtime: subprocess
config:
  usage: system-info
  shortHelp: Display system and Helm information
  longHelp: Shows OS info, Helm version, and environment details
runtimeConfig:
  platformCommand:
    - command: ${HELM_PLUGIN_DIR}/system-info.sh
```

--------------------------------

### Representing Lists in YAML vs JSON

Source: https://helm.sh/docs/chart_best_practices/templates

Demonstrates the difference between standard YAML list syntax and the more compact JSON list syntax for Helm template arguments. This approach is recommended for simple lists to enhance readability.

```yaml
arguments:  
  - "--dirname"  
  - "/foo"
```

```json
arguments: ["--dirname", "/foo"]
```

--------------------------------

### Search for Charts on Artifact Hub

Source: https://helm.sh/docs/intro/using_helm

Demonstrates how to use the 'helm search hub' command to find publicly available charts on the Artifact Hub. This command helps users discover charts by keyword.

```bash
helm search hub wordpress
```

--------------------------------

### Manage Certificates

Source: https://helm.sh/docs/chart_template_guide/function_list

Functions for generating private keys, building custom certificates, creating CAs, and generating self-signed or CA-signed certificates.

```text
$ca := buildCustomCert "base64-encoded-ca-crt" "base64-encoded-ca-key"
$ca := genCA "foo-ca" 365
$cert := genSelfSignedCert "foo.com" (list "10.0.0.1" "10.0.0.2") (list "bar.com" "bat.com") 365
$cert := genSignedCert "foo.com" (list "10.0.0.1" "10.0.0.2") (list "bar.com" "bat.com") 365 $ca
```

--------------------------------

### Helm Dependency List Command Options

Source: https://helm.sh/docs/helm/helm_dependency_list

This section outlines the specific options available for the 'helm dependency list' command, including help flags and output formatting controls. It also lists options inherited from parent commands that control Kubernetes API interaction and configuration.

```bash
  -h, --help                 help for list  
      --max-col-width uint   maximum column width for output table (default 80)  
```

```bash
      --burst-limit int                 client-side default throttling limit (default 100)  
      --color string                    use colored output (never, auto, always) (default "auto")  
      --colour string                   use colored output (never, auto, always) (default "auto")  
      --content-cache string            path to the directory containing cached content (e.g. charts) (default "~/.cache/helm/content")  
      --debug                           enable verbose output  
      --kube-apiserver string           the address and the port for the Kubernetes API server  
      --kube-as-group stringArray       group to impersonate for the operation, this flag can be repeated to specify multiple groups.  
      --kube-as-user string             username to impersonate for the operation  
      --kube-ca-file string             the certificate authority file for the Kubernetes API server connection  
      --kube-context string             name of the kubeconfig context to use  
      --kube-insecure-skip-tls-verify   if true, the Kubernetes API server's certificate will not be checked for validity. This will make your HTTPS connections insecure  
      --kube-tls-server-name string     server name to use for Kubernetes API server certificate validation. If it is not provided, the hostname used to contact the server is used  
      --kube-token string               bearer token used for authentication  
      --kubeconfig string               path to the kubeconfig file  
  -n, --namespace string                namespace scope for this request  
      --qps float32                     queries per second used when communicating with the Kubernetes API, not including bursting  
      --registry-config string          path to the registry config file (default "~/.config/helm/registry/config.json")  
      --repository-cache string         path to the directory containing cached repository indexes (default "~/.cache/helm/repository")  
      --repository-config string        path to the file containing repository names and URLs (default "~/.config/helm/repositories.yaml")  
```

--------------------------------

### Date and Time Utilities

Source: https://helm.sh/docs/chart_template_guide/function_list

Functions for calculating durations, formatting dates, handling timezones, and converting to Unix epoch time.

```text
ago .CreatedAt
now | date "2006-01-02"
dateInZone "2006-01-02" (now) "UTC"
duration "95"
durationRound "2h10m5s"
now | unixEpoch
```

--------------------------------

### Defining and using a Helm template

Source: https://helm.sh/docs/chart_template_guide/named_templates

Shows the definition of a partial template and its initial usage within a ConfigMap, which highlights indentation issues when using the template action.

```yaml
{{- define "mychart.app" -}}
app_name: {{ .Chart.Name }}
app_version: "{{ .Chart.Version }}"
{{- end -}}

apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
  labels:
    {{ template "mychart.app" . }}
data:
  myvalue: "Hello World"
  {{- range $key, $val := .Values.favorite }}
  {{ $key }}: {{ $val | quote }}
  {{- end }}
{{ template "mychart.app" . }}
```

--------------------------------

### Generate Helm Repo Index File

Source: https://helm.sh/docs/helm/helm_repo_index

This command reads charts from a specified directory and generates an 'index.yaml' file. It can also merge with existing index files and set an absolute URL for the charts. The output is written to 'index.yaml' in the current directory.

```bash
helm repo index [DIR] [flags]
```

--------------------------------

### YAML as a Superset of JSON

Source: https://helm.sh/docs/chart_template_guide/yaml_techniques

Demonstrates that valid JSON is also valid YAML. It shows equivalent representations of data in JSON, standard YAML, and a mixed format, highlighting that Helm and Kubernetes parse these into the same internal representation. It also notes that Helm does not recognize `.json` file extensions.

```JSON
{
  "coffee": "yes, please",
  "coffees": [
    "Latte", "Cappuccino", "Espresso"
  ]
}

```

```YAML
coffee: yes, please
coffees:
- Latte
- Cappuccino
- Espresso

```

```YAML
coffee: "yes, please"
coffees: [ "Latte", "Cappuccino", "Espresso"]

```

--------------------------------

### Manage Helm Repositories

Source: https://helm.sh/docs/intro/CheatSheet

Commands for interacting with Helm chart repositories, including adding, listing, updating, and searching for charts. These are essential for managing external dependencies.

```bash
helm repo add <repo-name> <url>
helm repo list
helm repo update
helm repo remove <repo_name>
helm repo index <DIR>
helm repo index <DIR> --merge
helm search repo <keyword>
helm search hub <keyword>
```

--------------------------------

### List Helm Releases

Source: https://helm.sh/docs/intro/using_helm

Displays a list of currently deployed releases. The --all flag can be used to include uninstalled releases that were kept with history.

```bash
helm list
helm list --all
```

--------------------------------

### Helm CLI: Create Scaffold Chart

Source: https://helm.sh/docs/topics/library_charts

This command creates a new Helm chart scaffold, which will be used as the base for our application chart.

```bash
$ helm create mychart
Creating mychart
```

--------------------------------

### Helm Template Formatting and Whitespace

Source: https://helm.sh/docs/chart_best_practices/templates

Illustrates correct formatting for Helm templates, including indentation with two spaces, whitespace around directives, and chomp whitespace for cleaner output. Also shows preferred and discouraged whitespace in generated YAML.

```go-template
{{ .foo }}
{{ print "foo" }}
{{- print "bar" -}}

```

```go-template
foo:
  {{- range .Values.items }}
  {{ . }}
  {{ end -}}

```

```go-template
{{ if $foo -}}
  {{- with .Bar }}Hello{{ end -}}
{{- end -}}

```

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: example
  labels:
    first: first
    second: second

```

--------------------------------

### Perform Math Operations in Helm

Source: https://helm.sh/docs/chart_template_guide/function_list

Demonstrates basic integer and float math operations such as multiplication, addition, and division. These functions operate on standard integer types or float64 values.

```text
mul 1 2 3
max 1 2 3
addf 1.5 2 2
subf 7.5 2 3
divf 10 2 4
mulf 1.5 2 2
maxf 1 2.5 3
minf 1.5 2 3
```

--------------------------------

### Helm Plugin Update Options

Source: https://helm.sh/docs/helm/helm_plugin_update

This section lists the available options for the 'helm plugin update' command, including help flags and inherited options for configuring Kubernetes API communication, namespaces, and registry settings. These options allow for fine-grained control over the update process and Helm's interaction with the Kubernetes cluster.

```bash
helm plugin update <plugin>... [flags]

Options:
  -h, --help   help for update

Options inherited from parent commands:
      --burst-limit int                 client-side default throttling limit (default 100)
      --color string                    use colored output (never, auto, always) (default "auto")
      --colour string                   use colored output (never, auto, always) (default "auto")
      --content-cache string            path to the directory containing cached content (e.g. charts) (default "~/.cache/helm/content")
      --debug                           enable verbose output
      --kube-apiserver string           the address and the port for the Kubernetes API server
      --kube-as-group stringArray       group to impersonate for the operation, this flag can be repeated to specify multiple groups.
      --kube-as-user string             username to impersonate for the operation
      --kube-ca-file string             the certificate authority file for the Kubernetes API server connection
      --kube-context string             name of the kubeconfig context to use
      --kube-insecure-skip-tls-verify   if true, the Kubernetes API server's certificate will not be checked for validity. This will make your HTTPS connections insecure
      --kube-tls-server-name string     server name to use for Kubernetes API server certificate validation. If it is not provided, the hostname used to contact the server is used
      --kube-token string               bearer token used for authentication
      --kubeconfig string               path to the kubeconfig file
  -n, --namespace string                namespace scope for this request
      --qps float32                     queries per second used when communicating with the Kubernetes API, not including bursting
      --registry-config string          path to the registry config file (default "~/.config/helm/registry/config.json")
      --repository-cache string         path to the directory containing cached repository indexes (default "~/.cache/helm/repository")
      --repository-config string        path to the file containing repository names and URLs (default "~/.config/helm/repositories.yaml")
```

--------------------------------

### Define Container Image and Tag

Source: https://helm.sh/docs/chart_best_practices/pods

Shows how to combine separate image and tag values from values.yaml into a single image string.

```yaml
image: "{{ .Values.redisImage }}:{{ .Values.redisTag }}"
```

--------------------------------

### Declare Downloader Plugin Capability (YAML)

Source: https://helm.sh/docs/topics/plugins

This YAML configuration snippet shows how to declare a downloader plugin in the 'plugin.yaml' file. It specifies the command to execute and the custom protocols the plugin supports for downloading Helm charts.

```yaml
downloaders:
- command: "bin/mydownloader"
  protocols:
  - "myprotocol"
  - "myprotocols"
```

--------------------------------

### Package Helm Plugin

Source: https://helm.sh/docs/helm/helm_plugin_package

Packages a Helm plugin directory into a tarball. By default, it generates a signed provenance file. Use --sign=false to skip signing.

```bash
helm plugin package [PATH] [flags]
```

--------------------------------

### Iterating Over Maps with Range and Variables

Source: https://helm.sh/docs/chart_template_guide/variables

Demonstrates how to loop through key-value pairs in a map using the 'range' function in Helm templates.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  {{- range $key, $val := .Values.favorite }}
  {{ $key }}: {{ $val | quote }}
  {{- end }}
```

--------------------------------

### Implement Subprocess Getter Script

Source: https://helm.sh/docs/plugins/developer/tutorial-getter-plugin

A shell script that handles the retrieval of a chart package. It creates a temporary directory, generates a demo chart, packages it, and outputs the resulting file path.

```bash
#!/usr/bin/env sh
set -e

URI=$@
TMPDIR="$(mktemp -d)"

FILENAME=$(basename -- $URI)
helm create $TMPDIR/$FILENAME 1>/dev/null
helm package $TMPDIR/$FILENAME -d $TMPDIR 1>/dev/null
rm -r $TMPDIR/$FILENAME 1>/dev/null
cat $TMPDIR/$FILENAME-*
```

--------------------------------

### Dynamic ConfigMap Naming with Helm Templates

Source: https://helm.sh/docs/chart_template_guide/getting_started

Demonstrates how to use the .Release.Name built-in object within a Kubernetes ConfigMap metadata field to ensure unique resource naming.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
```

--------------------------------

### Define Container Image with Quote

Source: https://helm.sh/docs/chart_best_practices/pods

Demonstrates how to reference a container image from values.yaml using the quote function to ensure proper YAML formatting.

```yaml
image: {{ .Values.redisImage | quote }}
```

--------------------------------

### Tilde Range Comparisons (Patch Level)

Source: https://helm.sh/docs/chart_template_guide/function_list

Explains tilde range comparisons (`~`), which are used for specifying acceptable patch-level changes when a minor version is present, or major-level changes when only the major version is specified.

```go-template
'~1.2.3'
'~1'
'~2.3'
'~1.2.x'
'~1.x'

```

--------------------------------

### Define Subprocess Getter Plugin Manifest

Source: https://helm.sh/docs/plugins/developer/tutorial-getter-plugin

The plugin.yaml configuration file for a getter plugin using the subprocess runtime, specifying the 'demo' protocol and the associated execution command.

```yaml
apiVersion: v1
type: getter/v1
name: demo-getter
version: 0.1.0
runtime: subprocess
config:
  protocols: ["demo"]
runtimeConfig:
  protocolCommands:
    - protocols:
        - demo
      platformCommand:
        - command: get-demo.sh
```

--------------------------------

### Sequence and Range Generation

Source: https://helm.sh/docs/chart_template_guide/function_list

Functions to generate lists of integers, useful for loops and pagination.

```text
until 5
untilStep 3 6 2
seq 0 2 10
chunk 3 (list 1 2 3 4 5 6 7 8)
```

--------------------------------

### Sign Helm chart using Keybase identity

Source: https://helm.sh/docs/topics/provenance

This command packages and signs a Helm chart using your Keybase identity. It requires specifying part of your key's identifier and the path to your GnuPG secret keyring.

```bash
$ helm package --sign --key technosophos --keyring ~/.gnupg/secring.gpg mychart  

```

--------------------------------

### Helm Chart Labels for Resource Identification

Source: https://helm.sh/docs/chart_best_practices/labels

Demonstrates recommended labels for identifying Helm-managed Kubernetes resources. These labels aid in querying and managing applications, ensuring consistency across deployments.

```yaml
app.kubernetes.io/name: {{ template "name" . }}
helm.sh/chart: {{ .Chart.Name }}-{{ .Chart.Version | replace "+" "_" }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/version: {{ .Chart.AppVersion }}
app.kubernetes.io/component: frontend
app.kubernetes.io/part-of: my-application
```

--------------------------------

### Base64 Encoding Files for Secrets

Source: https://helm.sh/docs/chart_template_guide/accessing_files

Shows how to use the `Files.Get` and `b64enc` functions to read a file's content and base64 encode it for secure transmission within a Secret.

```APIDOC
## Encoding Files for Secrets

### Description
This section demonstrates how to import a file and base64 encode its content using `Files.Get` and `b64enc` for secure transmission within a Kubernetes Secret.

### Method
N/A (Template Directives)

### Endpoint
N/A (Helm Template)

### Parameters
N/A

### Request Example
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: {{ .Release.Name }}-secret
type: Opaque
data:
  token: |-
    {{ .Files.Get "config1.toml" | b64enc }}
```

### Response
#### Success Response (Generated Secret)
- **data.token** (string) - Base64 encoded content of the specified file.

#### Response Example
```yaml
# Source: mychart/templates/secret.yaml
apiVersion: v1
kind: Secret
metadata:
  name: lucky-turkey-secret
type: Opaque
data:
  token: |-
    bWVzc2FnZSA9ICJIZWxsbyBmcm9tIGNvbmZpZyAxIgo=
```
```

--------------------------------

### List Creation and Manipulation

Source: https://helm.sh/docs/chart_template_guide/function_list

Functions for creating and interacting with lists, such as retrieving the first or last elements, or the remainder of a list.

```Helm Template
$myList := list 1 2 3 4 5
first $myList
rest $myList
last $myList
```

--------------------------------

### Applying Indentation Functions in Helm

Source: https://helm.sh/docs/chart_template_guide/control_structures

Shows how to use the indent function to programmatically control indentation in generated YAML, which is often safer than manual whitespace management.

```yaml
{{ indent 2 "mug:true" }}
```

--------------------------------

### Retrieve Release Information

Source: https://helm.sh/docs/intro/cheatsheet

Commands to download and display detailed information about a specific Helm release, including hooks, manifests, notes, and values files.

```bash
helm get all <release>
helm get hooks <release>
helm get manifest <release>
helm get notes <release>
helm get values <release>
```

--------------------------------

### Grant User Read/Write Access to a Namespace using kubectl

Source: https://helm.sh/docs/topics/rbac

This snippet demonstrates how to grant a user 'sam' edit access to the 'foo' namespace. It first creates the namespace if it doesn't exist, then creates a RoleBinding to assign the 'edit' role to the user within that namespace.

```bash
$ kubectl create namespace foo
$ kubectl create rolebinding sam-edit \
    --clusterrole edit \
    --user sam \
    --namespace foo
```

--------------------------------

### Trigger Deployment Rolls with Annotations

Source: https://helm.sh/docs/howto/charts_tips_and_tricks

Shows how to force a Deployment rollout by updating annotations. This can be achieved by hashing configuration files or injecting random strings to ensure the pod template spec changes on every upgrade.

```yaml
kind: Deployment
spec:
  template:
    metadata:
      annotations:
        checksum/config: {{ include (print $.Template.BasePath "/configmap.yaml") . | sha256sum }}
```

```yaml
kind: Deployment
spec:
  template:
    metadata:
      annotations:
        rollme: {{ randAlphaNum 5 | quote }}
```

--------------------------------

### Add Helm Repository

Source: https://helm.sh/docs/topics/chart_repository

Adds a Helm repository to the client configuration. This allows users to access charts from the specified URL. The repository must contain a valid `index.yaml` file.

```bash
$ helm repo add fantastic-charts https://fantastic-charts.storage.googleapis.com
$ helm repo list
fantastic-charts    https://fantastic-charts.storage.googleapis.com
```

```bash
$ helm repo add fantastic-charts https://fantastic-charts.storage.googleapis.com --username my-username --password my-password
$ helm repo list
fantastic-charts    https://fantastic-charts.storage.googleapis.com
```

```bash
$ helm repo add --insecure-skip-tls-verify my-repo https://example.com/charts
```

--------------------------------

### Display Helm Client Environment Information (CLI)

Source: https://helm.sh/docs/helm/helm_env

The 'helm env' command prints all environment information currently in use by the Helm client. This includes details about the Kubernetes connection, configuration paths, and other settings. It does not take any arguments but has several flags for customization.

```bash
helm env [flags]
```

```bash
helm env --help
```

--------------------------------

### Semantic Version Comparison Operators

Source: https://helm.sh/docs/chart_template_guide/function_list

Defines the basic comparison operators used for semantic versioning, including equality, inequality, greater than, less than, and their inclusive variants. These operators can be combined with AND (space/comma) and OR (||) logic.

```go-template
'>= 1.2 < 3.0.0 || >= 4.2.3'

```

--------------------------------

### Print and Printf String Formatting

Source: https://helm.sh/docs/chart_template_guide/function_list

The print function concatenates multiple arguments into a single string, while printf allows for formatted output using C-style placeholders. These are essential for building dynamic strings from template variables.

```Helm Template
print "Matt has " .Dogs " dogs"
printf "%s has %d dogs." .Name .NumberDogs
```

--------------------------------

### Manual Dependency Structure in Helm

Source: https://helm.sh/docs/topics/charts

Shows the directory structure for manually including dependencies within a parent chart's charts/ directory.

```text
wordpress:
  Chart.yaml
  charts/
    apache/
      Chart.yaml
    mysql/
      Chart.yaml
```

--------------------------------

### Retrieve Helm Release Hooks

Source: https://helm.sh/docs/helm/helm_get_hooks

This command fetches all hooks for a specified release name. It supports optional flags such as --revision to target a specific version of the release.

```bash
helm get hooks RELEASE_NAME [flags]
```

--------------------------------

### Accessing File Lines

Source: https://helm.sh/docs/chart_template_guide/accessing_files

Explains how to use the `Files.Lines` method to access and iterate over each line of a file within your Helm templates.

```APIDOC
## Accessing File Lines

### Description
This section details the use of the `Files.Lines` method, which allows you to access and process each line of a file individually within your Helm templates. It can be used with a `range` function for iteration.

### Method
N/A (Template Directives)

### Endpoint
N/A (Helm Template)

### Parameters
N/A

### Request Example
```yaml
data:
  some-file.txt: {{ range .Files.Lines "foo/bar.txt" }}
    {{ . }}{{ end }}
```

### Response
N/A (Processed file content within a manifest)
```

--------------------------------

### Manage Helm Repositories and Dependencies via CLI

Source: https://helm.sh/docs/topics/charts

Commands to add a chart repository and update dependencies for a specific chart. These commands ensure local caches are updated and required charts are downloaded into the charts/ directory.

```bash
helm repo add fantastic-charts https://charts.helm.sh/incubator
helm dep up foochart
```

--------------------------------

### Injecting File Content into Helm Templates

Source: https://helm.sh/docs/chart_template_guide/yaml_techniques

Demonstrates how to inject the content of a file into a Helm template using the `.Files.Get` function. It utilizes the `indent` function to properly format the file content within YAML, ensuring correct indentation for multi-line file insertions.

```Go/Helm
myfile: |
{{ .Files.Get "myfile.txt" | indent 2 }}

```

--------------------------------

### Debug dynamic completion

Source: https://helm.sh/docs/topics/plugins

Commands to manually trigger and verify the output of a plugin's dynamic completion logic.

```shell
helm __complete fullstatus --output js
helm __complete fullstatus -o json ""
```

--------------------------------

### Helm Dependency Command Options

Source: https://helm.sh/docs/helm/helm_dependency

This snippet lists the available options for the 'helm dependency' command and its inherited options from parent commands. These options control aspects like help display, API server connection, and namespace.

```bash
helm dependency --help
```

```bash
helm dependency --burst-limit int
--color string
--colour string
--content-cache string
--debug
--kube-apiserver string
--kube-as-group stringArray
--kube-as-user string
--kube-ca-file string
--kube-context string
--kube-insecure-skip-tls-verify
--kube-tls-server-name string
--kube-token string
--kubeconfig string
-n, --namespace string
--qps float32
--registry-config string
--repository-cache string
--repository-config string
```

--------------------------------

### Fetch Helm Release Metadata

Source: https://helm.sh/docs/helm/helm_get_metadata

This command retrieves the metadata for a specified Helm release. It supports optional flags for output formatting and revision selection.

```bash
helm get metadata RELEASE_NAME [flags]
```

--------------------------------

### Implement Helm Library Chart Merge Utility

Source: https://helm.sh/docs/topics/library_charts

Implements a helper named template `mylibchart.util.merge` for Helm library charts. This utility takes a context and two template names, merges their YAML outputs, and returns the result. It's designed to combine base templates with override configurations.

```yaml
{{- /*
mylibchart.util.merge will merge two YAML templates and output the result.
This takes an array of three values:
- the top context
- the template name of the overrides (destination)
- the template name of the base (source)
*/ -}}
{{- define "mylibchart.util.merge" -}}
{{- $top := first . -}}
{{- $overrides := fromYaml (include (index . 1) $top) | default (dict )
{{- $tpl := fromYaml (include (index . 2) $top) | default (dict )
{{- toYaml (merge $overrides $tpl) -}}
{{- end -}}

```

--------------------------------

### Helm Global Options

Source: https://helm.sh/docs/helm/helm

This section lists the global command-line options available for the Helm CLI. These options can be used with most Helm commands to modify their behavior.

```APIDOC
## Helm Global Options

### Description
Global options that can be applied to most Helm commands.

### Parameters
#### Query Parameters
- **--burst-limit** (int) - Optional - Client-side default throttling limit (default 100)
- **--color** (string) - Optional - Use colored output (never, auto, always) (default "auto")
- **--colour** (string) - Optional - Use colored output (never, auto, always) (default "auto")
- **--content-cache** (string) - Optional - Path to the directory containing cached content (e.g. charts) (default "~/.cache/helm/content")
- **--debug** (bool) - Optional - Enable verbose output
- **-h, --help** (bool) - Optional - Help for helm
- **--kube-apiserver** (string) - Optional - The address and the port for the Kubernetes API server
- **--kube-as-group** (stringArray) - Optional - Group to impersonate for the operation, this flag can be repeated to specify multiple groups.
- **--kube-as-user** (string) - Optional - Username to impersonate for the operation
- **--kube-ca-file** (string) - Optional - The certificate authority file for the Kubernetes API server connection
- **--kube-context** (string) - Optional - Name of the kubeconfig context to use
- **--kube-insecure-skip-tls-verify** (bool) - Optional - If true, the Kubernetes API server's certificate will not be checked for validity. This will make your HTTPS connections insecure
- **--kube-tls-server-name** (string) - Optional - Server name to use for Kubernetes API server certificate validation. If it is not provided, the hostname used to contact the server is used
- **--kube-token** (string) - Optional - Bearer token used for authentication
- **--kubeconfig** (string) - Optional - Path to the kubeconfig file
- **-n, --namespace** (string) - Optional - Namespace scope for this request
- **--qps** (float32) - Optional - Queries per second used when communicating with the Kubernetes API, not including bursting
- **--registry-config** (string) - Optional - Path to the registry config file (default "~/.config/helm/registry/config.json")
- **--repository-cache** (string) - Optional - Path to the directory containing cached repository indexes (default "~/.cache/helm/repository")
- **--repository-config** (string) - Optional - Path to the file containing repository names and URLs (default "~/.config/helm/repositories.yaml")

### Request Example
```bash
helm install my-release ./my-chart --namespace default --debug
```

### Response
This command typically does not produce a direct response body, but rather executes actions based on the provided options and arguments.
```

--------------------------------

### Robust Semantic Version Comparison with Ranges

Source: https://helm.sh/docs/chart_template_guide/function_list

The `semverCompare` function provides a more robust comparison, supporting version ranges. It can check for exact matches, patch-level increments (tilde operator), and other complex range specifications.

```go-template
semverCompare "1.2.3" "1.2.3"
semverCompare "~1.2.0" "1.2.3"

```

--------------------------------

### Define Simple Value in values.yaml

Source: https://helm.sh/docs/chart_template_guide/values_files

This snippet shows how to define a simple key-value pair in the `values.yaml` file for a Helm chart. This value can then be accessed within the chart's templates.

```yaml
favoriteDrink: coffee
```

--------------------------------

### Helm Commands for Template Debugging

Source: https://helm.sh/docs/chart_template_guide/debugging

This section outlines essential Helm commands used for debugging templates. These include linting charts, testing template rendering locally, and performing dry runs with debugging enabled to inspect generated YAML without deploying.

```bash
helm lint
helm template --debug
helm install --dry-run --debug
helm install --dry-run=server --debug
helm get manifest
```

--------------------------------

### Helm Plugin Management API

Source: https://helm.sh/docs/helm/helm_plugin

This section covers the general 'helm plugin' command for managing client-side Helm plugins.

```APIDOC
## helm plugin

### Description
Manage client-side Helm plugins.

### Synopsis
```
helm plugin [command]
```

### Options
```
  -h, --help   help for plugin
```

### Options inherited from parent commands
```
      --burst-limit int                 client-side default throttling limit (default 100)
      --color string                    use colored output (never, auto, always) (default "auto")
      --colour string                   use colored output (never, auto, always) (default "auto")
      --content-cache string            path to the directory containing cached content (e.g. charts) (default "~/.cache/helm/content")
      --debug                           enable verbose output
      --kube-apiserver string           the address and the port for the Kubernetes API server
      --kube-as-group stringArray       group to impersonate for the operation, this flag can be repeated to specify multiple groups.
      --kube-as-user string             username to impersonate for the operation
      --kube-ca-file string             the certificate authority file for the Kubernetes API server connection
      --kube-context string             name of the kubeconfig context to use
      --kube-insecure-skip-tls-verify   if true, the Kubernetes API server's certificate will not be checked for validity. This will make your HTTPS connections insecure
      --kube-tls-server-name string     server name to use for Kubernetes API server certificate validation. If it is not provided, the hostname used to contact the server is used
      --kube-token string               bearer token used for authentication
      --kubeconfig string               path to the kubeconfig file
  -n, --namespace string                namespace scope for this request
      --qps float32                     queries per second used when communicating with the Kubernetes API, not including bursting
      --registry-config string          path to the registry config file (default "~/.config/helm/registry/config.json")
      --repository-cache string         path to the directory containing cached repository indexes (default "~/.cache/helm/repository")
      --repository-config string        path to the file containing repository names and URLs (default "~/.config/helm/repositories.yaml")
```

### SEE ALSO
* helm - The Helm package manager for Kubernetes.
* helm plugin install - install a Helm plugin
* helm plugin list - list installed Helm plugins
* helm plugin package - package a plugin directory into a plugin archive
* helm plugin uninstall - uninstall one or more Helm plugins
* helm plugin update - update one or more Helm plugins
* helm plugin verify - verify that a plugin at the given path has been signed and is valid

###### Auto generated by spf13/cobra on 9-Feb-2026
```

--------------------------------

### Using the default function in Helm templates

Source: https://helm.sh/docs/chart_template_guide/functions_and_pipelines

Demonstrates how to use the default function to provide fallback values for computed template variables.

```yaml
drink: {{ .Values.favorite.drink | default (printf "%s-tea" (include "fullname" .)) }}
```

--------------------------------

### Helm urlParse Function

Source: https://helm.sh/docs/chart_template_guide/function_list

Parses a URL string into its constituent parts, returning a dictionary. This function relies on Go's standard library 'net/url' package. It takes a URL string as input and outputs a dictionary containing scheme, host, path, query, opaque, fragment, and userinfo.

```go
urlParse "http://admin:secret@server.com:8080/api?list=false#anchor"
```

--------------------------------

### Convert GPG keyring to legacy format

Source: https://helm.sh/docs/topics/provenance

These commands export your GPG public and secret keys to the legacy format, which might be required by older versions of GnuPG or specific Helm operations.

```bash
$ gpg --export >~/.gnupg/pubring.gpg  
$ gpg --export-secret-keys >~/.gnupg/secring.gpg  

```

--------------------------------

### Case Conversion (snakecase, camelcase, kebabcase, swapcase)

Source: https://helm.sh/docs/chart_template_guide/function_list

This group of functions converts strings between different casing conventions. `snakecase` converts camelCase to snake_case, `camelcase` converts snake_case to CamelCase, `kebabcase` converts camelCase to kebab-case, and `swapcase` inverts the case of characters based on specific rules involving whitespace.

```Helm
snakecase "FirstName"
```

```Helm
camelcase "http_server"
```

```Helm
kebabcase "FirstName"
```

```Helm
swapcase "This Is A.Test"
```

--------------------------------

### helm dependency list

Source: https://helm.sh/docs/helm/helm_dependency_list

Lists all dependencies declared in a specified chart directory or archive.

```APIDOC
## CLI COMMAND: helm dependency list

### Description
List all of the dependencies declared in a chart. This command accepts chart archives or chart directories as input and does not modify the chart contents.

### Method
CLI Command

### Endpoint
helm dependency list CHART [flags]

### Parameters
#### Path Parameters
- **CHART** (string) - Required - The path to the chart directory or chart archive file.

#### Flags
- **--max-col-width** (uint) - Optional - Maximum column width for output table (default 80).
- **--namespace** (string) - Optional - Namespace scope for this request.
- **--debug** (boolean) - Optional - Enable verbose output.

### Request Example
helm dependency list ./my-chart

### Response
#### Success Response (Exit Code 0)
- **Output** (table) - A table listing dependencies, their versions, and status.

#### Response Example
NAME    VERSION    REPOSITORY    STATUS
nginx   1.2.3      https://...   ok
```

--------------------------------

### Helm PowerShell Completion Command Syntax

Source: https://helm.sh/docs/helm/helm_completion_powershell

The basic syntax for invoking the completion command with optional flags to control output behavior.

```bash
helm completion powershell [flags]
```

--------------------------------

### Generate List using Helm Tuple Function

Source: https://helm.sh/docs/chart_template_guide/control_structures

This Helm template snippet illustrates how to dynamically generate a list within a ConfigMap's data using the 'tuple' function and the 'range' action. The 'tuple' function creates a collection of values, and 'range' iterates over them to format each item as a list entry. The '|- ' marker ensures the output is treated as a multi-line string.

```helm
sizes: |-
  {{- range tuple "small" "medium" "large" }}
  - {{ . }}
  {{- end }}
```

--------------------------------

### List GnuPG secret keys

Source: https://helm.sh/docs/topics/provenance

This command lists the secret keys available in your GnuPG keyring. It's useful for verifying that your Keybase PGP key has been imported correctly.

```bash
$ gpg --list-secret-keys  
/Users/mattbutcher/.gnupg/secring.gpg  
-------------------------------------
sec   2048R/1FC18762 2016-07-25  
uid                  technosophos (keybase.io/technosophos) <technosophos@keybase.io>  
ssb   2048R/D125E546 2016-07-25  


```

--------------------------------

### Helm Subcommands

Source: https://helm.sh/docs/helm/helm

This section provides a list of available Helm subcommands, each with its own set of options and functionalities for managing Helm charts and releases.

```APIDOC
## Helm Subcommands

### Description
List of available subcommands for the Helm CLI.

### SEE ALSO
  * helm completion - generate autocompletion scripts for the specified shell
  * helm create - create a new chart with the given name
  * helm dependency - manage a chart's dependencies
  * helm env - helm client environment information
  * helm get - download extended information of a named release
  * helm history - fetch release history
  * helm install - install a chart
  * helm lint - examine a chart for possible issues
  * helm list - list releases
  * helm package - package a chart directory into a chart archive
  * helm plugin - install, list, or uninstall Helm plugins
  * helm pull - download a chart from a repository and (optionally) unpack it in local directory
  * helm push - push a chart to remote
  * helm registry - login to or logout from a registry
  * helm repo - add, list, remove, update, and index chart repositories
  * helm rollback - roll back a release to a previous revision
  * helm search - search for a keyword in charts
  * helm show - show information of a chart
  * helm status - display the status of the named release
  * helm template - locally render templates
  * helm test - run tests for a release
  * helm uninstall - uninstall a release
  * helm upgrade - upgrade a release
  * helm verify - verify that a chart at the given path has been signed and is valid
  * helm version - print the helm version information

###### Auto generated by spf13/cobra on 9-Feb-2026
```

--------------------------------

### CLI Plugin Type Configuration

Source: https://helm.sh/docs/plugins/overview

Configuration options for Helm plugins of type 'cli/v1'. This includes setting usage text, short and long help descriptions, and an option to ignore flags passed from Helm.

```yaml
usage: OPTIONAL - The single-line usage text shown in help
shortHelp: The short description shown in the 'helm help' output
longHelp: The long message shown in the 'helm help <this-command>' output
ignoreFlags: Ignores any flags passed in from Helm
```

--------------------------------

### Define Go Input/Output Messages for Helm Plugin

Source: https://helm.sh/docs/plugins/developer/tutorial-getter-plugin

Defines the Go struct types `InputMessage` and `OutputMessage` used for structured communication within the Helm plugin. `InputMessage` expects a URL and protocol, while `OutputMessage` returns byte data. These are crucial for the Extism PDK.

```go
package main

...

type InputMessage struct {
	URL string `json:"url"`
	Protocol string `json:"protocol"`
}

type OutputMessage struct {
	Data []byte `json:"data"`
}
```

--------------------------------

### helm version

Source: https://helm.sh/docs/helm/helm_version

Displays the version information for the Helm client.

```APIDOC
## helm version

### Description
Show the version for Helm. This command will print a representation of the version of Helm, including build details.

### Synopsis
```
helm version [flags]
```

### Options
```
  -h, --help              help for version
      --short             print the version number
      --template string   template for version string format
```

### Options inherited from parent commands
```
      --burst-limit int                 client-side default throttling limit (default 100)
      --color string                    use colored output (never, auto, always) (default "auto")
      --colour string                   use colored output (never, auto, always) (default "auto")
      --content-cache string            path to the directory containing cached content (e.g. charts) (default "~/.cache/helm/content")
      --debug                           enable verbose output
      --kube-apiserver string           the address and the port for the Kubernetes API server
      --kube-as-group stringArray       group to impersonate for the operation, this flag can be repeated to specify multiple groups.
      --kube-as-user string             username to impersonate for the operation
      --kube-ca-file string             the certificate authority file for the Kubernetes API server connection
      --kube-context string             name of the kubeconfig context to use
      --kube-insecure-skip-tls-verify   if true, the Kubernetes API server's certificate will not be checked for validity. This will make your HTTPS connections insecure
      --kube-tls-server-name string     server name to use for Kubernetes API server certificate validation. If it is not provided, the hostname used to contact the server is used
      --kube-token string               bearer token used for authentication
      --kubeconfig string               path to the kubeconfig file
  -n, --namespace string                namespace scope for this request
      --qps float32                     queries per second used when communicating with the Kubernetes API, not including bursting
      --registry-config string          path to the registry config file (default "~/.config/helm/registry/config.json")
      --repository-cache string         path to the directory containing cached repository indexes (default "~/.cache/helm/repository")
      --repository-config string        path to the file containing repository names and URLs (default "~/.config/helm/repositories.yaml")
```

### SEE ALSO
  * helm - The Helm package manager for Kubernetes.

###### Auto generated by spf13/cobra on 9-Feb-2026

```

--------------------------------

### Helm Chart Dependency Conditions and Tags

Source: https://helm.sh/docs/chart_best_practices/dependencies

Shows how to use conditions and tags for optional or swappable Helm chart dependencies. Conditions allow enabling/disabling dependencies, with a default of 'true'. Tags enable grouping related optional dependencies that can be enabled or disabled together.

```yaml
condition: somechart.enabled
```

```yaml
tags:
  - webaccelerator
```

--------------------------------

### Inspect Helm Release Values

Source: https://helm.sh/docs/intro/using_helm

Retrieves the current configuration values for a specific release to verify that updates have been applied successfully.

```bash
helm get values happy-panda
```

--------------------------------

### Helm Values Overrideability with --set

Source: https://helm.sh/docs/chart_best_practices/values

Demonstrates structuring Helm values for easier overrides using the `--set` flag. Map-based structures are preferred over lists of maps for simpler `--set` syntax.

```yaml
servers:
  - name: foo
    port: 80
  - name: bar
    port: 81
```

```yaml
servers:
  foo:
    port: 80
  bar:
    port: 81
```

```yaml
--set servers[0].port=80
```

```yaml
--set servers.foo.port=80
```

--------------------------------

### Perform Reflection and Type Checking

Source: https://helm.sh/docs/chart_template_guide/function_list

Utilities for inspecting Go types and kinds within Helm templates. Useful for advanced template logic that requires checking data structures or comparing values deeply.

```text
kindOf "hello"
kindIs "int" 123
deepEqual (list 1 2 3) (list 1 2 3)
```

--------------------------------

### Math Operations

Source: https://helm.sh/docs/chart_template_guide/function_list

Basic mathematical functions operating on int64 values.

```text
add 1 2 3
```

--------------------------------

### Helm Postrenderer Plugin Manifest (YAML)

Source: https://helm.sh/docs/plugins/developer/tutorial-postrenderer-plugin

Defines the metadata and runtime configuration for a Helm postrenderer plugin. It specifies the plugin type, name, version, and the command to execute for the Subprocess runtime.

```yaml
apiVersion: v1
type: postrenderer/v1
name: label-injector
version: 0.1.0
runtime: subprocess
runtimeConfig:
  platformCommand:
    - command: ${HELM_PLUGIN_DIR}/inject-labels.sh
```

--------------------------------

### Handling Folded Multi-line Strings in YAML

Source: https://helm.sh/docs/chart_template_guide/yaml_techniques

Illustrates the use of the folded multi-line string syntax ('>') in YAML to represent multiple lines as a single string. It shows how newlines are converted to spaces by default and how the '>-' variant can trim trailing newlines. It also explains how indentation within folded blocks preserves whitespace and newlines.

```YAML
coffee: >
  Latte
  Cappuccino
  Espresso
  
  

```

```YAML
coffee: >-
  Latte
    12 oz
    16 oz
  Cappuccino
  Espresso

```

--------------------------------

### Injecting File Contents into ConfigMap using Helm

Source: https://helm.sh/docs/chart_template_guide/accessing_files

This Helm template demonstrates how to read the contents of multiple TOML files and inject them into a Kubernetes ConfigMap. It uses the .Files.Get method within a range loop to process each specified file.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  {{- $files := .Files }}
  {{- range tuple "config1.toml" "config2.toml" "config3.toml" }}
  {{ . }}: |-
    {{ $files.Get . }}
  {{- end }}
```

--------------------------------

### Chaining Functions with Pipelines

Source: https://helm.sh/docs/chart_template_guide/functions_and_pipelines

Shows how to use the pipe operator (|) to chain multiple template functions, such as 'upper' and 'quote', for sequential data transformation.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ .Values.favorite.drink | quote }}
  food: {{ .Values.favorite.food | upper | quote }}
```

--------------------------------

### helm completion fish

Source: https://helm.sh/docs/helm/helm_completion_fish

Generates an autocompletion script for the fish shell to improve CLI usability.

```APIDOC
## helm completion fish

### Description
Generates the autocompletion script for Helm for the fish shell. This allows users to get command suggestions and tab-completion for Helm commands.

### Method
CLI Command

### Endpoint
helm completion fish [flags]

### Parameters
#### Options
- **--help** (boolean) - Optional - Show help for the fish command.
- **--no-descriptions** (boolean) - Optional - Disable completion descriptions in the output.

#### Inherited Options
- **--debug** (boolean) - Optional - Enable verbose output.
- **--namespace** (string) - Optional - Namespace scope for this request.
- **--kubeconfig** (string) - Optional - Path to the kubeconfig file.

### Request Example
helm completion fish --no-descriptions

### Response
#### Success Response (Standard Output)
- **stdout** (string) - The generated shell script content to be sourced or saved to a file.

#### Response Example
# Output of the command is a shell script block
complete -c helm -f -a '...'
```

--------------------------------

### Define ConfigMap with Multi-line String in Helm

Source: https://helm.sh/docs/chart_template_guide/control_structures

This snippet shows how to define a Kubernetes ConfigMap using Helm. It specifically demonstrates the use of the '|- ' YAML marker to create a multi-line string for the 'toppings' field, which is then treated as a single string value within the ConfigMap data.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: edgy-dragonfly-configmap
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "PIZZA"
  toppings: |-
    - "Mushrooms"
    - "Cheese"
    - "Peppers"
    - "Onions"
    - "Pineapple"
```

--------------------------------

### Correcting template indentation with include

Source: https://helm.sh/docs/chart_template_guide/named_templates

Demonstrates the use of the include function to pipe template output into the indent function, resulting in correctly formatted YAML output.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
  labels:
{{ include "mychart.app" . | indent 4 }}
data:
  myvalue: "Hello World"
  {{- range $key, $val := .Values.favorite }}
  {{ $key }}: {{ $val | quote }}
  {{- end }}
{{ include "mychart.app" . | indent 2 }}
```

--------------------------------

### Helm urlJoin Function

Source: https://helm.sh/docs/chart_template_guide/function_list

Constructs a URL string from a dictionary of URL parts, typically produced by urlParse. This function enables the recomposition of URLs from their components. It takes a dictionary representing URL parts and returns a formatted URL string.

```go
urlJoin (dict "fragment" "fragment" "host" "host:80" "path" "/path" "query" "query" "scheme" "http")
```

--------------------------------

### Compare Semantic Versions

Source: https://helm.sh/docs/chart_template_guide/function_list

Compares two semantic version strings. The `Compare` method on a `Version` object returns -1 if the compared version is greater, 1 if the current version is greater, and 0 if they are equal. Build metadata is ignored during comparison.

```go-template
semver "1.4.3" | (semver "1.2.3").Compare

```

--------------------------------

### helm registry login

Source: https://helm.sh/docs/helm/helm_registry

Authenticates the Helm client with a remote container registry.

```APIDOC
## POST helm registry login

### Description
Logs the Helm client into a remote registry to enable pushing and pulling charts.

### Method
CLI Command

### Endpoint
helm registry login [REGISTRY_URL]

### Parameters
#### Options
- **--username** (string) - Required - Username for registry authentication
- **--password** (string) - Required - Password or token for registry authentication

### Request Example
helm registry login myregistry.com -u myuser -p mypassword

### Response
#### Success Response (0)
- **message** (string) - Login Succeeded
```

--------------------------------

### Filter Helm Releases by Name

Source: https://helm.sh/docs/helm/helm_list

Demonstrates how to use the --filter flag with a Perl-compatible regular expression to find specific releases. This command returns releases matching the provided regex pattern.

```bash
helm list --filter 'ara[a-z]+'
```

--------------------------------

### Accessing Values in Kubernetes Manifest (Go Template)

Source: https://helm.sh/docs/topics/charts

Shows how values defined in `values.yaml` are accessed within a Kubernetes resource definition using Go templating syntax. It demonstrates accessing `imageRegistry`, `dockerTag`, `pullPolicy`, and `storage` via the `.Values` object.

```go-template
apiVersion: v1
kind: ReplicationController
metadata:
  name: deis-database
  namespace: deis
  labels:
    app.kubernetes.io/managed-by: deis
spec:
  replicas: 1
  selector:
    app.kubernetes.io/name: deis-database
  template:
    metadata:
      labels:
        app.kubernetes.io/name: deis-database
    spec:
      serviceAccount: deis-database
      containers:
        - name: deis-database
          image: {{ .Values.imageRegistry }}/postgres:{{ .Values.dockerTag }}
          imagePullPolicy: {{ .Values.pullPolicy }}
          ports:
            - containerPort: 5432
          env:
            - name: DATABASE_STORAGE
              value: {{ default "minio" .Values.storage }}

```

--------------------------------

### Format Helm Status Output

Source: https://helm.sh/docs/helm/helm_status

Demonstrates how to output the release status in different formats such as JSON or YAML. This is useful for programmatic parsing of release information.

```bash
helm status RELEASE_NAME --output json
helm status RELEASE_NAME --output yaml
```

--------------------------------

### Helm Version Command Options

Source: https://helm.sh/docs/helm/helm_version

Common flags used to modify the behavior of the helm version command.

```text
-h, --help              help for version
      --short             print the version number
      --template string   template for version string format
```

--------------------------------

### Define Subchart Values and Template

Source: https://helm.sh/docs/chart_template_guide/subcharts_and_globals

Configuration for a subchart's values.yaml and a corresponding ConfigMap template to demonstrate local value access.

```yaml
dessert: cake
```

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-cfgmap2
data:
  dessert: {{ .Values.dessert }}
```

--------------------------------

### Update Go runPlugin Function to Use demoDownloader

Source: https://helm.sh/docs/plugins/developer/tutorial-getter-plugin

Modifies the `runPlugin` function in Go to call the `demoDownloader` function instead of a placeholder, ensuring the plugin utilizes the implemented download logic for processing input.

```go
func runPlugin() error {
	...
	// Remove: output, err := replaceMeImplementationGoesHere(input)
	output, err := demoDownloader(input)

```

--------------------------------

### Define Namespaced Templates in Helm

Source: https://helm.sh/docs/chart_best_practices/templates

Demonstrates the correct way to define globally accessible templates in Helm using namespaced names to avoid conflicts between charts and subcharts. Incorrect usage can lead to naming collisions.

```go-template
{{- define "nginx.fullname" }}
{{/* ... */}}
{{ end -}}

```

```go-template
{{- define "fullname" -}}
{{/* ... */}}
{{ end -}}

```

--------------------------------

### Prevent Resource Deletion with Resource Policy

Source: https://helm.sh/docs/howto/charts_tips_and_tricks

Explains how to use the helm.sh/resource-policy annotation to keep resources alive even when a Helm release is uninstalled or upgraded.

```yaml
kind: Secret
metadata:
  annotations:
    helm.sh/resource-policy: keep
```

--------------------------------

### GitHub Actions Workflow for Chart Release (YAML)

Source: https://helm.sh/docs/howto/chart_releaser_action

This GitHub Actions workflow automates the release of Helm charts. It checks out the code, configures Git, and then uses the `helm/chart-releaser-action` to create GitHub releases and update the `index.yaml` file for the chart repository on every push to the main branch.

```yaml
name: Release Charts  
  
on:  
  push:  
    branches:  
      - main  
  
jobs:  
  release:  
    permissions:  
      contents: write  
    runs-on: ubuntu-latest  
    steps:  
      - name: Checkout  
        uses: actions/checkout@v4  
        with:  
          fetch-depth: 0  
  
      - name: Configure Git  
        run: |  
          git config user.name "$GITHUB_ACTOR"  
          git config user.email "$GITHUB_ACTOR@users.noreply.github.com"  
  
      - name: Run chart-releaser  
        uses: helm/chart-releaser-action@v1.6.0  
        env:  
          CR_TOKEN: "${{ secrets.GITHUB_TOKEN }}"  

```

--------------------------------

### Create Image Pull Secrets via Helm Templates

Source: https://helm.sh/docs/howto/charts_tips_and_tricks

Demonstrates how to generate a Kubernetes dockerconfigjson Secret using a helper template that encodes registry credentials. It requires values defined in values.yaml and utilizes base64 encoding functions.

```yaml
imageCredentials:
  registry: quay.io
  username: someone
  password: sillyness
  email: someone@host.com
```

```yaml
{{- define "imagePullSecret" }}
{{- with .Values.imageCredentials }}
{{- printf "{\"auths\":{\"%s\":{\"username\":\"%s\",\"password\":%s,\"email\":\"%s\",\"auth\":\"%s\"}}}" .registry .username (.password | quote) .email (printf "%s:%s" .username .password | b64enc) | b64enc }}
{{- end }}
{{- end }}
```

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: myregistrykey
type: kubernetes.io/dockerconfigjson
data:
  .dockerconfigjson: {{ template "imagePullSecret" . }}
```

--------------------------------

### Helm Chart Dependency Repository Configuration

Source: https://helm.sh/docs/chart_best_practices/dependencies

Illustrates different ways to specify repository URLs for Helm chart dependencies. It covers using HTTPS URLs, HTTP URLs, repository names as aliases, and the special case of file URLs. It also notes the behavior when the repository field is blank.

```yaml
repository: https://example.com/charts
```

```yaml
repository: alias-name
```

```yaml
repository: file:///path/to/local/charts
```

--------------------------------

### Helm Template: Basic ConfigMap Definition

Source: https://helm.sh/docs/topics/library_charts

A standard Kubernetes ConfigMap definition. This serves as a base that can be extended or overridden by other charts.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name | printf "%s-%s" .Chart.Name }}
data:
  myvalue: "Hello World"
```

--------------------------------

### Helm Chart: Add Library Dependency

Source: https://helm.sh/docs/topics/library_charts

Adds a library chart named 'mylibchart' as a dependency to the application chart. The repository is specified as a local file path.

```yaml
# My common code in my library chart
dependencies:
- name: mylibchart
  version: 0.1.0
  repository: file://../mylibchart
```

--------------------------------

### Using Helm Whitespace Control Modifiers

Source: https://helm.sh/docs/chart_template_guide/control_structures

Demonstrates the use of {{- and -}} to manage whitespace in a ConfigMap template. This prevents the template engine from leaving empty lines in the rendered YAML output.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ .Values.favorite.drink | default "tea" | quote }}
  food: {{ .Values.favorite.food | upper | quote }}
  {{- if eq .Values.favorite.drink "coffee" }}
  mug: "true"
  {{- end }}
```

--------------------------------

### CLI Command: helm rollback

Source: https://helm.sh/docs/helm/helm_rollback

Rolls back a release to a previous revision.

```APIDOC
## CLI COMMAND: helm rollback

### Description
This command rolls back a release to a previous revision. If the revision argument is omitted or set to 0, it defaults to the previous release.

### Method
CLI

### Endpoint
helm rollback <RELEASE> [REVISION] [flags]

### Parameters
#### Path Parameters
- **RELEASE** (string) - Required - The name of the release to roll back.
- **REVISION** (int) - Optional - The specific revision number to roll back to.

#### Flags
- **--cleanup-on-fail** (bool) - Optional - Allow deletion of new resources created in this rollback when rollback fails.
- **--dry-run** (string) - Optional - Simulates the operation without persisting changes.
- **--force-conflicts** (bool) - Optional - Force changes against conflicts during server-side apply.
- **--timeout** (duration) - Optional - Time to wait for any individual Kubernetes operation (default 5m0s).
- **--wait** (WaitStrategy) - Optional - Wait until resources are ready (default hookOnly).

### Request Example
helm rollback my-release 2 --cleanup-on-fail

### Response
#### Success Response (0)
- **Output** (string) - Returns a confirmation message indicating the release has been rolled back to the specified revision.
```

--------------------------------

### Using the include function in Helm templates

Source: https://helm.sh/docs/howto/charts_tips_and_tricks

The include function allows developers to include templates within pipelines, enabling further processing like indentation or string manipulation. This is essential for managing complex YAML structures.

```Go Template
{{ include "toYaml" $value | indent 2 }}
value: {{ include "mytpl" . | lower | quote }}
```

--------------------------------

### Include a Template with Scope

Source: https://helm.sh/docs/chart_template_guide/named_templates

Shows how to invoke a defined template within a ConfigMap and pass the current scope ('.') to ensure the template can access chart metadata like name and version.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
  {{- template "mychart.labels" . }}
data:
  myvalue: "Hello World"
  {{- range $key, $val := .Values.favorite }}
  {{ $key }}: {{ $val | quote }}
  {{- end }}
```

--------------------------------

### Query Specific Release Revision

Source: https://helm.sh/docs/helm/helm_status

Shows how to retrieve the status of a specific revision of a release using the --revision flag. This is helpful for auditing historical deployment states.

```bash
helm status RELEASE_NAME --revision 1
```

--------------------------------

### Using YAML Anchors for References

Source: https://helm.sh/docs/chart_template_guide/yaml_techniques

Illustrates YAML anchors ('&') and references ('*') for storing and reusing values. It warns that anchors are expanded and discarded upon first consumption, meaning they are lost when Helm or Kubernetes read, modify, and rewrite YAML files, potentially causing subtle bugs.

```YAML
coffee: "yes, please"
favorite: &favoriteCoffee "Cappuccino"
coffees:
  - Latte
  - *favoriteCoffee
  - Espresso

```

--------------------------------

### Applying Quote Function to Template Values

Source: https://helm.sh/docs/chart_template_guide/functions_and_pipelines

Demonstrates how to use the 'quote' function to ensure string values from the .Values object are properly quoted in a Kubernetes ConfigMap.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ quote .Values.favorite.drink }}
  food: {{ quote .Values.favorite.food }}
```

--------------------------------

### Iterating Over Lists with Range and Variables

Source: https://helm.sh/docs/chart_template_guide/variables

Shows how to use the 'range' function to capture both the index and the value from a list-like object in Helm templates.

```yaml
toppings: |-
  {{- range $index, $topping := .Values.pizzaToppings }}
    {{ $index }}: {{ $topping }}
  {{- end }}
```

--------------------------------

### Assigning Variables to Manage Scope in Helm

Source: https://helm.sh/docs/chart_template_guide/variables

Demonstrates how to assign a value to a variable before entering a 'with' block to maintain access to the root context, such as the release name.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  {{- $relname := .Release.Name -}}
  {{- with .Values.favorite }}
  drink: {{ .drink | default "tea" | quote }}
  food: {{ .food | upper | quote }}
  release: {{ $relname }}
  {{- end }}
```

--------------------------------

### Parse Semantic Version String

Source: https://helm.sh/docs/chart_template_guide/function_list

The `semver` function parses a given string into a Semantic Version object. If parsing fails, template execution halts. The resulting object provides access to Major, Minor, Patch, Prerelease, Metadata, and Original version components.

```go-template
$version := semver "1.2.3-alpha.1+123"

```

--------------------------------

### Define Post-Renderer Filename Annotation

Source: https://helm.sh/docs/topics/advanced

Illustrates the metadata annotation used by Helm to track original template filenames through the post-rendering process.

```yaml
metadata:
  annotations:
    postrenderer.helm.sh/postrender-filename: <original-template-filename>
```

--------------------------------

### CLI Command: helm repo update

Source: https://helm.sh/docs/helm/helm_repo_update

Updates the local cache of chart repositories to ensure Helm has the latest metadata.

```APIDOC
## CLI COMMAND: helm repo update

### Description
Updates the local information about charts from the configured chart repositories. This command is essential before running 'helm search' to ensure the local cache reflects the latest available versions.

### Usage
`helm repo update [REPO1 [REPO2 ...]] [flags]`

### Parameters
#### Positional Arguments
- **REPO_NAME** (string) - Optional - A list of specific repository names to update. If omitted, all configured repositories are updated.

#### Flags
- **--timeout** (duration) - Optional - Time to wait for the index file download to complete (default 2m0s).
- **--help** (boolean) - Optional - Show help for the update command.

### Global Flags
- **--debug** (boolean) - Enable verbose output.
- **--kubeconfig** (string) - Path to the kubeconfig file.
- **--namespace** (string) - Namespace scope for the request.

### Example
```bash
# Update all repositories
helm repo update

# Update specific repositories
helm repo update stable incubator
```
```

--------------------------------

### Label Injector Script (Shell)

Source: https://helm.sh/docs/plugins/developer/tutorial-postrenderer-plugin

A shell script that acts as a Helm postrenderer. It reads Kubernetes resource definitions from standard input, uses `yq` to add a specific label ('postrendered-by: helm-label-injector-plugin') to the metadata, and outputs the modified resources to standard output.

```shell
#!/usr/bin/env sh
# set -e
cat <&0 | yq '.metadata.labels.postrendered-by = "helm-label-injector-plugin"'
```

--------------------------------

### List Helm Chart Dependencies

Source: https://helm.sh/docs/helm/helm_dependency_list

The 'helm dependency list' command is used to display all dependencies declared within a specified Helm chart. It accepts chart archives or directories as input and does not modify the chart's contents. An error will be produced if the chart cannot be loaded.

```bash
helm dependency list CHART [flags]
```

--------------------------------

### Helm Chart Manifest with Provenance (JSON)

Source: https://helm.sh/docs/topics/registries

Illustrates a Helm chart manifest that includes a provenance file, typically used for verifying chart integrity. This JSON structure shows the additional layer for the provenance data.

```json
{
  "schemaVersion": 2,
  "config": {
    "mediaType": "application/vnd.cncf.helm.config.v1+json",
    "digest": "sha256:8ec7c0f2f6860037c19b54c3cfbab48d9b4b21b485a93d87b64690fdb68c2111",
    "size": 117
  },
  "layers": [
    {
      "mediaType": "application/vnd.cncf.helm.chart.content.v1.tar+gzip",
      "digest": "sha256:1b251d38cfe948dfc0a5745b7af5ca574ecb61e52aed10b19039db39af6e1617",
      "size": 2487
    },
    {
      "mediaType": "application/vnd.cncf.helm.chart.provenance.v1.prov",
      "digest": "sha256:3e207b409db364b595ba862cdc12be96dcdad8e36c59a03b7b3b61c946a5741a",
      "size": 643
    }
  ]
}
```

--------------------------------

### Helm Chart Lint and Template Commands

Source: https://helm.sh/docs/topics/library_charts

Commands to validate Helm chart templates for correctness (`helm lint`) and to render the templates with current values (`helm template`) prior to deployment.

```bash
helm lint
helm template
```

--------------------------------

### Kubernetes and Utility Functions

Source: https://helm.sh/docs/chart_template_guide/function_list

Functions for interacting with Kubernetes cluster state and generating unique identifiers.

```APIDOC
## Kubernetes and Utility Functions

### uuidv4
Generates a random UUID v4 string.

### lookup
Queries a running Kubernetes cluster for resources. Returns empty during `helm template`.

### .Capabilities.APIVersions.Has
Checks if a specific API version or resource type is available in the cluster.

### Usage Example
{{ uuidv4 }}
{{ .Capabilities.APIVersions.Has "apps/v1" }}
```

--------------------------------

### String Replacement (replace)

Source: https://helm.sh/docs/chart_template_guide/function_list

The `replace` function performs a simple find-and-replace operation within a source string. It takes the substring to find, the substring to replace it with, and the source string as arguments.

```Helm
"I Am Henry VIII" | replace " " "-"
```

--------------------------------

### Upgrade release while reusing existing values

Source: https://helm.sh/docs/helm/helm_upgrade

Updates a release while maintaining existing values, merging them with new overrides provided via flags.

```bash
helm upgrade --reuse-values --set foo=bar --set foo=newbar redis ./redis
```

--------------------------------

### Helm Values Structure: Flat vs. Nested

Source: https://helm.sh/docs/chart_best_practices/values

Illustrates flat and nested structures for Helm values. Flat structures are generally preferred for simplicity and easier templating, while nested structures can improve readability for large, related variables.

```yaml
server:
  name: nginx
  port: 80
```

```yaml
serverName: nginx
serverPort: 80
```

```yaml
{{ if .Values.server }}
  {{ default "none" .Values.server.name }}
{{ end }}
```

```yaml
{{ default "none" .Values.serverName }}
```

--------------------------------

### Deep Copy Data Structures

Source: https://helm.sh/docs/chart_template_guide/function_list

Creates a deep copy of a value, including dictionaries and complex structures. 'deepCopy' panics on error, while 'mustDeepCopy' returns an error.

```Helm Template
dict "a" 1 "b" 2 | deepCopy
```

--------------------------------

### Helm Chart Dependencies with Aliases

Source: https://helm.sh/docs/topics/charts

Defines multiple dependencies on the same subchart with unique aliases in the parent chart's Chart.yaml. This allows for distinct configurations and management of identical subcharts within a parent.

```yaml
dependencies:
  - name: subchart
    repository: http://localhost:10191
    version: 0.1.0
    alias: new-subchart-1
  - name: subchart
    repository: http://localhost:10191
    version: 0.1.0
    alias: new-subchart-2
  - name: subchart
    repository: http://localhost:10191
    version: 0.1.0
```

--------------------------------

### Define Structured Values in values.yaml

Source: https://helm.sh/docs/chart_template_guide/values_files

This snippet illustrates how to define more structured data within a `values.yaml` file, using nested keys. This allows for organizing related configuration parameters.

```yaml
favorite:
  drink: coffee
  food: pizza
```

--------------------------------

### Convert Strings to Dates

Source: https://helm.sh/docs/chart_template_guide/function_list

Parses a string into a date object using a specified layout. Returns the zero value on failure, or throws an error if using mustToDate.

```helm
toDate "2006-01-02" "2017-12-31" | date "02/01/2006"
```

--------------------------------

### Evaluating strings as templates with tpl

Source: https://helm.sh/docs/howto/charts_tips_and_tricks

The tpl function evaluates a string as a template, allowing for dynamic content generation from values or external files.

```Go Template
# template
{{ tpl .Values.template . }}

# Rendering external file
{{ tpl (.Files.Get "conf/app.conf") . }}
```

--------------------------------

### Helm Release Information Retrieval

Source: https://helm.sh/docs/intro/cheatsheet

Commands to download and view detailed information about a Helm release.

```APIDOC
## Helm Release Information Retrieval

### Description
Commands to download and view detailed information about a Helm release, including notes, hooks, manifests, and values.

### Commands
- `helm get all <release>`: Retrieves all information about a release (notes, hooks, values, manifest).
- `helm get hooks <release>`: Downloads the hooks associated with a release in YAML format.
- `helm get manifest <release>`: Fetches the Kubernetes manifest generated for a release.
- `helm get notes <release>`: Displays the deployment notes for a release.
- `helm get values <release>`: Downloads the values file used for a release. Use `-o` to format output.
```

--------------------------------

### POST /helm/repo/update

Source: https://helm.sh/docs/topics/chart_repository

Updates the local cache of chart information from all configured repositories.

```APIDOC
## POST /helm/repo/update

### Description
Fetches the latest index.yaml files from all configured repositories and updates the local cache.

### Method
POST

### Endpoint
helm repo update

### Response
#### Success Response (200)
- **status** (string) - Confirmation that the repository cache has been updated.
```

--------------------------------

### Encode Data to Pretty YAML with toYamlPretty

Source: https://helm.sh/docs/chart_template_guide/function_list

The `toYamlPretty` function encodes a data structure into an indented YAML string, similar to `toYaml`, but with additional 2-space indentation for list elements. This provides enhanced readability for complex YAML structures.

```yaml
# toYamlPretty
- name: bob
  age: 25
  hobbies:
    - hiking
    - fishing
    - cooking

```

--------------------------------

### Upgrade and Rollback Helm Releases

Source: https://helm.sh/docs/intro/CheatSheet

Commands to manage the lifecycle of existing releases, including upgrading to newer versions or reverting to previous revisions. These commands ensure application stability during updates.

```bash
helm upgrade <release> <chart>
helm upgrade <release> <chart> --rollback-on-failure
helm upgrade <release> <chart> --dependency-update
helm upgrade <release> <chart> --version <version_number>
helm upgrade <release> <chart> --values
helm upgrade <release> <chart> --set key1=val1,key2=val2
helm upgrade <release> <chart> --force
helm rollback <release> <revision>
helm rollback <release> <revision> --cleanup-on-fail
```

--------------------------------

### Build Helm Chart Dependencies

Source: https://helm.sh/docs/helm/helm_dependency_build

Rebuilds the charts/ directory for a Helm chart based on the state specified in the Chart.lock file. If no lock file exists, it behaves like 'helm dependency update'. This command does not re-negotiate dependencies.

```bash
helm dependency build CHART [flags]
```

--------------------------------

### Shuffle String (shuffle)

Source: https://helm.sh/docs/chart_template_guide/function_list

The `shuffle` function randomizes the order of characters within a given string. The output is a permutation of the input string's characters.

```Helm
shuffle "hello"
```

--------------------------------

### Logic and Flow Control Functions

Source: https://helm.sh/docs/chart_template_guide/function_list

A collection of functions for managing conditional logic and default value handling in Helm templates.

```APIDOC
## Logic and Flow Control Functions

### Description
Functions to handle boolean logic, comparisons, and conditional rendering within Helm templates.

### Available Functions
- **and** (Arg1, Arg2) - Returns boolean AND of arguments.
- **or** (Arg1, Arg2) - Returns boolean OR of arguments.
- **not** (Arg) - Returns boolean negation.
- **eq/ne** (Arg1, Arg2) - Equality/Inequality checks.
- **lt/le/gt/ge** (Arg1, Arg2) - Comparison operators.
- **default** (DefaultValue, Value) - Returns default if value is empty.
- **required** (ErrorMessage, Value) - Fails rendering if value is empty.
- **empty** (Value) - Checks if a value is considered empty.
- **fail** (ErrorMessage) - Unconditionally returns an error.
- **coalesce** (List) - Returns the first non-empty value from a list.
- **ternary** (TrueValue, FalseValue, TestValue) - Returns TrueValue if test is true, else FalseValue.

### Usage Example
```
{{ default "default_value" .Values.key }}
{{ required "Value is required" .Values.key }}
{{ ternary "is_true" "is_false" .Values.condition }}
```
```

--------------------------------

### Regenerated Values with Global Scope (YAML)

Source: https://helm.sh/docs/topics/charts

Illustrates how the `global` values are propagated down to subcharts. The `global.app` value becomes accessible within the `mysql` and `apache` charts as `.Values.global.app`.

```yaml
title: "My WordPress Site"

global:
  app: MyWordPress

mysql:
  global:
    app: MyWordPress
  max_connections: 100
  password: "secret"

apache:
  global:
    app: MyWordPress
  port: 8080

```

--------------------------------

### Define Wasm Getter Plugin Manifest

Source: https://helm.sh/docs/plugins/developer/tutorial-getter-plugin

The plugin.yaml configuration file for a getter plugin using the extism/v1 (Wasm) runtime, including memory and timeout settings.

```yaml
apiVersion: v1
type: getter/v1
name: demo-getter
version: 0.1.0
runtime: extism/v1
config:
  protocols: ["demo"]
runtimeConfig:
  memory:
    maxPages: 16
  timeout: 30000
```

--------------------------------

### Helm Release Monitoring Commands

Source: https://helm.sh/docs/intro/cheatsheet

Commands to list and filter Helm releases, view their status, and history.

```APIDOC
## Helm Release Monitoring Commands

### Description
Commands to list and filter Helm releases, view their status, and history.

### Commands
- `helm list`: Lists all releases in the current or specified namespace.
- `helm list --all` or `helm list -a`: Shows all releases without filters.
- `helm list --all-namespaces` or `helm list -A`: Lists releases across all namespaces.
- `helm list -l key1=value1,key2=value2`: Filters releases using label selectors.
- `helm list --date`: Sorts releases by date.
- `helm list --deployed`: Shows only deployed releases.
- `helm list --pending`: Shows releases in a pending state.
- `helm list --failed`: Shows releases that have failed.
- `helm list --uninstalled`: Shows uninstalled releases (if history was kept).
- `helm list --superseded`: Shows superseded releases.
- `helm list -o <format>`: Outputs the list in a specified format (table, json, yaml).
- `helm status <release>`: Displays the status of a specific release.
- `helm status <release> --revision <number>`: Shows the status of a specific revision of a release.
- `helm history <release>`: Displays the revision history of a release.
- `helm env`: Prints Helm environment information.
```

--------------------------------

### CLI Command: helm upgrade

Source: https://helm.sh/docs/helm/helm_upgrade

Upgrades a release to a new version of a chart with support for value overrides and configuration flags.

```APIDOC
## CLI COMMAND: helm upgrade

### Description
Upgrades a release to a new version of a chart. The command supports various methods for overriding values, including file-based overrides and command-line flags.

### Method
CLI Command

### Endpoint
helm upgrade [RELEASE] [CHART] [flags]

### Parameters
#### Positional Arguments
- **RELEASE** (string) - Required - The name of the release to upgrade.
- **CHART** (string) - Required - The chart reference, path to directory, or URL.

#### Flags
- **--values / -f** (string) - Optional - Path to a values file. Can be specified multiple times.
- **--set** (string) - Optional - Set values on the command line. Can be specified multiple times.
- **--reuse-values** (boolean) - Optional - Reuse the last release's values and merge in any new overrides.
- **--dry-run** (boolean) - Optional - Simulate the upgrade without applying changes.
- **--hide-secret** (boolean) - Optional - Hide Kubernetes Secrets in dry-run output.

### Request Example
helm upgrade -f myvalues.yaml -f override.yaml redis ./redis

### Response
#### Success Response (0)
- **Output** (string) - Returns the status of the upgrade and the updated release manifest.

#### Response Example
Release "redis" has been upgraded. Happy Helming!
```

--------------------------------

### Embedding Multiple YAML Documents

Source: https://helm.sh/docs/chart_template_guide/yaml_techniques

Explains how to embed multiple YAML documents within a single file using '---' to separate documents and '...' to end them. It notes that while some delimiters can be omitted, Helm's `values.yaml` only uses the first document, whereas template files can contain multiple documents which are split before being sent to Kubernetes.

```YAML
---
document: 1
...
---
document: 2
...

```

--------------------------------

### Find First Regex Match with regexFind

Source: https://helm.sh/docs/chart_template_guide/function_list

The `regexFind` function returns the first (leftmost) substring that matches the given regular expression. Panics on error.

```go-template
regexFind "[a-zA-Z][1-9]" "abcd1234"

```

--------------------------------

### String Initial Extraction

Source: https://helm.sh/docs/chart_template_guide/function_list

The initials function extracts the first letter of each word in a string to create an acronym or identifier.

```Helm Template
initials "First Try"
```

--------------------------------

### Helm Global Configuration

Source: https://helm.sh/docs/helm/helm_install

Global flags inherited by Helm commands for Kubernetes API interaction and environment settings.

```APIDOC
## HELM GLOBAL OPTIONS

### Description
Configuration flags for connecting to the Kubernetes API and managing local Helm environment settings.

### Parameters
#### Flags
- **--kubeconfig** (string) - Optional - Path to the kubeconfig file.
- **-n, --namespace** (string) - Optional - Namespace scope for the request.
- **--kube-apiserver** (string) - Optional - Address and port for the Kubernetes API server.
- **--kube-token** (string) - Optional - Bearer token for authentication.
- **--debug** (boolean) - Optional - Enable verbose output.
- **--burst-limit** (int) - Optional - Client-side throttling limit (default 100).
- **--qps** (float32) - Optional - Queries per second for API communication.
```

--------------------------------

### Convert List to String Slice with toStrings

Source: https://helm.sh/docs/chart_template_guide/function_list

The `toStrings` function takes a list-like collection and converts each element into a string, returning a slice of strings. This is useful for processing lists where elements need to be treated as text.

```helm
list 1 2 3 | toStrings
```

--------------------------------

### Indent String Lines (indent, nindent)

Source: https://helm.sh/docs/chart_template_guide/function_list

The `indent` function adds a specified number of space characters to the beginning of each line within a given string. `nindent` performs the same indentation but also prepends a newline character to the entire string.

```Helm
indent 4 $lots_of_text
```

```Helm
nindent 4 $lots_of_text
```

--------------------------------

### Helm Template: Include Library ConfigMap

Source: https://helm.sh/docs/topics/library_charts

This Helm template snippet includes a ConfigMap definition from a library chart using the `include` function and defines a local override for the data.

```helm
{{- include "mylibchart.configmap" (list . "mychart.configmap") -}}
{{- define "mychart.configmap" -}}
data:
  myvalue: "Hello World"
{{- end -}}
```

--------------------------------

### Helm Template: Less Than or Equal Comparison (le)

Source: https://helm.sh/docs/chart_template_guide/function_list

The 'le' function compares two arguments and returns a boolean true if the first argument is less than or equal to the second (Arg1 <= Arg2). Otherwise, it returns false. Useful for range checks and comparisons.

```Go Template
le .Arg1 .Arg2
```

--------------------------------

### Helm CLI: Update Dependencies

Source: https://helm.sh/docs/topics/library_charts

Updates the dependencies for a Helm chart. This command downloads the specified library chart into the `charts/` directory.

```bash
$ helm dependency update mychart/
Hang tight while we grab the latest from your chart repositories...
...Successfully got an update from the "stable" chart repository
Update Complete. ⎈Happy Helming!⎈
Saving 1 charts
Deleting outdated charts
```

--------------------------------

### Filter Dictionary Keys with Pick and Omit

Source: https://helm.sh/docs/chart_template_guide/function_list

Selects or excludes specific keys from a dictionary to create a new dictionary.

```Helm Template
$new := pick $myDict "name1" "name2"
$new := omit $myDict "name1" "name3"
```

--------------------------------

### Helm Dependency Subcommands

Source: https://helm.sh/docs/helm/helm_dependency

This snippet outlines the primary subcommands available for managing Helm chart dependencies: 'build' to rebuild the charts directory, 'list' to display dependencies, and 'update' to synchronize with Chart.yaml.

```bash
helm dependency build
```

```bash
helm dependency list
```

```bash
helm dependency update
```

--------------------------------

### Convert Unix Octal to Decimal with toDecimal

Source: https://helm.sh/docs/chart_template_guide/function_list

The `toDecimal` function converts a Unix octal permission string (e.g., "0777") into its equivalent decimal integer representation (int64). This is useful for handling file permission data.

```helm
"0777" | toDecimal
```

--------------------------------

### Configure ImagePullPolicy

Source: https://helm.sh/docs/chart_best_practices/pods

Configures the image pull policy in deployment manifests using values from values.yaml, defaulting to IfNotPresent.

```yaml
imagePullPolicy: {{ .Values.image.pullPolicy }}
```

```yaml
image:
  pullPolicy: IfNotPresent
```

--------------------------------

### YAML Collections: Maps and Sequences

Source: https://helm.sh/docs/chart_template_guide/yaml_techniques

Demonstrates the two fundamental collection types in YAML: maps (key-value pairs) and sequences (ordered lists). These are essential for structuring data in Helm charts.

```yaml
map:
  one: 1
  two: 2
  three: 3

sequence:
  - one
  - two
  - three

```

--------------------------------

### Monitor Helm Releases

Source: https://helm.sh/docs/intro/cheatsheet

Commands to list, filter, and check the status of Helm releases within a Kubernetes cluster. These commands help track deployment states, revisions, and environment configurations.

```bash
helm list
helm list --all
helm list --all-namespaces
helm list -l key1=value1,key2=value2
helm list --date
helm list --deployed
helm list --pending
helm list --failed
helm list --uninstalled
helm list --superseded
helm list -o yaml
helm status <release>
helm status <release> --revision <number>
helm history <release>
helm env
```

--------------------------------

### Extract Keys and Values from Dictionaries

Source: https://helm.sh/docs/chart_template_guide/function_list

Functions to retrieve keys or values from a dictionary. 'keys' returns a list of keys, while 'values' returns a list of values.

```Helm Template
keys $myDict | sortAlpha
keys $myDict $myOtherDict | uniq | sortAlpha
$vals := values $myDict
```

--------------------------------

### Accessing Global Context with the $ Variable

Source: https://helm.sh/docs/chart_template_guide/variables

Illustrates how to use the '$' variable to access the root context while inside a 'range' loop, where the local scope would otherwise prevent access to chart metadata.

```yaml
{{- range .Values.tlsSecrets }}
---
apiVersion: v1
kind: Secret
metadata:
  name: {{ .name }}
  labels:
    app.kubernetes.io/name: {{ template "fullname" $ }}
    helm.sh/chart: "{{ $.Chart.Name }}-{{ $.Chart.Version }}"
    app.kubernetes.io/instance: "{{ $.Release.Name }}"
    app.kubernetes.io/version: "{{ $.Chart.AppVersion }}"
    app.kubernetes.io/managed-by: "{{ $.Release.Service }}"
type: kubernetes.io/tls
data:
  tls.crt: {{ .certificate }}
  tls.key: {{ .key }}
{{- end }}
```

--------------------------------

### Identify Helm Release Manifests

Source: https://helm.sh/docs/topics/kubernetes_apis

Use the Helm CLI to retrieve the manifest of a deployed release. This command is essential for auditing the API versions currently in use by your Kubernetes objects.

```bash
helm get manifest <release-name>
```

--------------------------------

### Define a Named Template in Helm

Source: https://helm.sh/docs/chart_template_guide/named_templates

The `define` action is used to create a named template within a Helm template file. This allows for modularity and reusability of template segments. Template names are global, so using chart-specific prefixes is recommended.

```go-template
{{- define "MY.NAME" }}
  # body of template here
{{- end }}

```

--------------------------------

### Run Helm Lint on a Chart

Source: https://helm.sh/docs/helm/helm_lint

Executes the lint command on a specified chart directory to verify its integrity. The command checks for schema compliance and configuration errors.

```bash
helm lint PATH [flags]
```

--------------------------------

### Define Shared Templates in Helm

Source: https://helm.sh/docs/chart_template_guide/subcharts_and_globals

Illustrates how to define a template in Helm that can be shared across charts. The `{{- define "labels" }}...{{ end }}` syntax creates a named template block. This block can be included in other charts using `{{ include $mytemplate }}`, which supports dynamic referencing, unlike the `template` function that only accepts string literals.

```go-template
{{- define "labels" }}from: mychart{{ end }}

```

```go-template
{{ include $mytemplate }}

```

--------------------------------

### Define a Kubernetes ConfigMap Template

Source: https://helm.sh/docs/chart_template_guide/getting_started

A basic YAML template for a Kubernetes ConfigMap that Helm will process and deploy to the cluster.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: mychart-configmap
data:
  myvalue: "Hello World"
```

--------------------------------

### Generate Random Strings (randAlphaNum, randAlpha, randNumeric, randAscii)

Source: https://helm.sh/docs/chart_template_guide/function_list

These functions generate cryptographically secure random strings using different character sets: alphanumeric, alphabetic, numeric, or printable ASCII. They accept an integer specifying the desired length of the output string.

```Helm
randNumeric 3
```

--------------------------------

### Rendered List from Helm Tuple Function

Source: https://helm.sh/docs/chart_template_guide/control_structures

This is the output generated by the Helm template snippet that uses the 'tuple' function. It shows the 'sizes' field as a multi-line string, with each item from the tuple rendered as a separate list entry.

```yaml
sizes: |-
  - small
  - medium
  - large
```

--------------------------------

### Helm Plugin Metadata Configuration

Source: https://helm.sh/docs/plugins/overview

Defines the core metadata for a Helm plugin, including API version, type, name, version, runtime, source URL, and configuration fields. The 'config' and 'runtimeConfig' fields depend on the plugin type and runtime respectively.

```yaml
apiVersion: REQUIRED - The Plugin API version. Must be "v1"
type: REQUIRED - The versioned Plugin Type. Can be "cli/v1", "getter/v1", or "postrenderer/v1"
name: REQUIRED - The name of the plugin
version: REQUIRED - The version of the plugin
runtime: REQUIRED - The runtime for the plugin. Can be "subprocess" or "extism/v1" (Wasm)
sourceURL: OPTIONAL - A URL pointing to the source code for your plugin
config: DEPENDS ON PLUGIN TYPE
runtimeConfig: DEPENDS ON RUNTIME
```

--------------------------------

### Rollback a Helm Release

Source: https://helm.sh/docs/helm/helm_rollback

Basic syntax for rolling back a Helm release. The command requires the release name and optionally a revision number.

```bash
helm rollback <RELEASE> [REVISION] [flags]
```

--------------------------------

### Quote and Squote Strings

Source: https://helm.sh/docs/chart_template_guide/function_list

The `quote` function wraps a given string in double quotes, while `squote` wraps it in single quotes. These are useful for ensuring strings are properly escaped or formatted.

--------------------------------

### String Trimming and Cleaning

Source: https://helm.sh/docs/chart_template_guide/function_list

Functions like trim, trimAll, trimPrefix, and trimSuffix allow for the removal of whitespace or specific characters from the edges of strings. The nospace function provides a quick way to remove all internal whitespace.

```Helm Template
trim "   hello    "
trimAll "$" "$5.00"
trimPrefix "-" "-hello"
trimSuffix "-" "hello-"
nospace "hello w o r l d"
```

--------------------------------

### Getter Plugin Type Configuration

Source: https://helm.sh/docs/plugins/overview

Configuration for Helm plugins of type 'getter/v1'. This primarily involves specifying the list of URL schemes (protocols) that the plugin supports.

```yaml
protocols: The list of schemes from the charts URL that this plugin supports.
```

--------------------------------

### Upgrade a Helm Release

Source: https://helm.sh/docs/intro/using_helm

Upgrades an existing release with new configuration values provided via a YAML file. Helm performs a minimal update by only modifying resources that have changed.

```bash
helm upgrade -f panda.yaml happy-panda bitnami/wordpress
```

--------------------------------

### Helm Chart Dependencies with Tags and Conditions

Source: https://helm.sh/docs/topics/charts

Configures chart dependencies with optional 'tags' and 'condition' fields in Chart.yaml. Conditions control chart loading based on parent values, while tags provide labels for group enabling/disabling. Conditions override tags.

```yaml
dependencies:
  - name: subchart1
    repository: http://localhost:10191
    version: 0.1.0
    condition: subchart1.enabled,global.subchart1.enabled
    tags:
      - front-end
      - subchart1
  - name: subchart2
    repository: http://localhost:10191
    version: 0.1.0
    condition: subchart2.enabled,global.subchart2.enabled
    tags:
      - back-end
      - subchart2
```

--------------------------------

### Helm Template for ServiceAccount Name Generation

Source: https://helm.sh/docs/chart_best_practices/rbac

A Helm helper template that dynamically generates the ServiceAccount name. It checks if a ServiceAccount should be created and uses a default name (generated via fullname or 'default') if not explicitly provided.

```helm
{{/*
Create the name of the service account to use
*/}}
{{- define "mychart.serviceAccountName" -}}
{{- if .Values.serviceAccount.create -}}
    {{ default (include "mychart.fullname" .) .Values.serviceAccount.name }}
{{- else -}}
    {{ default "default" .Values.serviceAccount.name }}
{{- end -}}
{{- end -}}  
```

--------------------------------

### Manipulate File Paths

Source: https://helm.sh/docs/chart_template_guide/function_list

Functions for processing string paths according to file system conventions. These include extracting base names, directory paths, cleaning paths, and checking for absolute paths.

```text
base "foo/bar/baz"
clean "foo/bar/../baz"
ext "foo.bar"
```

--------------------------------

### Quoting strings and integers in Helm

Source: https://helm.sh/docs/howto/charts_tips_and_tricks

Best practices for data types in Helm: always quote strings to avoid parsing issues, but keep integers unquoted to ensure compatibility with Kubernetes manifests.

```YAML
name: {{ .Values.MyName | quote }}
port: {{ .Values.Port }}
env:
  - name: HOST
    value: "http://host"
  - name: PORT
    value: "1234"
```

--------------------------------

### Helm Template: Equality Check (eq)

Source: https://helm.sh/docs/chart_template_guide/function_list

The 'eq' function checks if two arguments are equal. It returns a boolean true if the arguments are equal (Arg1 == Arg2) and false otherwise. This is fundamental for conditional rendering based on value comparison.

```Go Template
eq .Arg1 .Arg2
```

--------------------------------

### Wrap Text (wrap, wrapWith)

Source: https://helm.sh/docs/chart_template_guide/function_list

The `wrap` function wraps text to a specified column count, using newline characters as delimiters. `wrapWith` extends this functionality by allowing a custom string to be used as the delimiter instead of a newline.

```Helm
wrap 80 $someText
```

```Helm
wrapWith 5 "\t" "Hello World"
```

--------------------------------

### Parse YAML String to Object with fromYaml

Source: https://helm.sh/docs/chart_template_guide/function_list

The `fromYaml` function parses a YAML string and returns a data object that can be used within templates. It's essential for loading configuration or data defined in YAML format.

```yaml
name: Bob
age: 25
hobbies:
  - hiking
  - fishing
  - cooking

```

```helm
{{- $person := .Files.Get "yamls/person.yaml" | fromYaml }}
greeting: |
  Hi, my name is {{ $person.name }} and I am {{ $person.age }} years old.
  My hobbies are {{ range $person.hobbies }}{{ . }} {{ end }}.

```

--------------------------------

### Grant Namespace Access via PostgreSQL RLS Policy

Source: https://helm.sh/docs/topics/permissions_sql_storage_backend

This SQL command creates a security policy on the releases_v1 table. It restricts access for a specific database role to only those records where the namespace matches the provided value, enabling multi-tenant isolation within the Helm SQL backend.

```sql
CREATE POLICY <name> ON releases_v1 FOR ALL TO <role> USING (namespace = 'default');
```

--------------------------------

### Concatenate Strings (cat)

Source: https://helm.sh/docs/chart_template_guide/function_list

The `cat` function joins multiple strings together into a single string, inserting a space character between each concatenated string. It's a simple way to combine several string values.

```Helm
cat "hello" "beautiful" "world"
```

--------------------------------

### Configuring Helm Value Overrides with Null Deletion

Source: https://helm.sh/docs/chart_template_guide/values_files

Demonstrates how to override default Helm chart values and remove specific keys that cause configuration conflicts. By setting a key to null, Helm removes it from the final merged values, preventing invalid Kubernetes manifest generation.

```yaml
livenessProbe:  
  httpGet:  
    path: /user/login  
    port: http  
  initialDelaySeconds: 120
```

```bash
helm install stable/drupal --set image=my-registry/drupal:0.1.0 --set livenessProbe.exec.command=[cat,docroot/CHANGELOG.txt] --set livenessProbe.httpGet=null
```

--------------------------------

### Importing Subchart Values in Helm

Source: https://helm.sh/docs/topics/charts

Demonstrates the use of the import-values directive in Chart.yaml to map values from a child chart to a parent chart's values structure.

```yaml
dependencies:
  - name: subchart1
    repository: http://localhost:10191
    version: 0.1.0
    import-values:
      - child: default.data
        parent: myimports
```

--------------------------------

### Helm Template: Less Than Comparison (lt)

Source: https://helm.sh/docs/chart_template_guide/function_list

The 'lt' function compares two arguments and returns a boolean true if the first argument is strictly less than the second (Arg1 < Arg2). Otherwise, it returns false. Used for numerical or version comparisons.

```Go Template
lt .Arg1 .Arg2
```

--------------------------------

### Generate htpasswd Hash with htpasswd

Source: https://helm.sh/docs/chart_template_guide/function_list

The `htpasswd` function generates a bcrypt hash for a given username and password, suitable for Apache basic authentication. Storing passwords directly in templates is discouraged.

```go-template
htpasswd "myUser" "myPassword"

```

--------------------------------

### Regular Expression Functions

Source: https://helm.sh/docs/chart_template_guide/function_list

Functions for matching, finding, replacing, and splitting strings using regular expressions.

```APIDOC
## regexMatch / mustRegexMatch

### Description
Returns true if the input string contains a match for the regex.

### Example
regexMatch "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$" "test@acme.com"

## regexReplaceAll / mustRegexReplaceAll

### Description
Replaces matches of a pattern in an input string with a replacement string, supporting $1 submatch expansion.

### Parameters
- **pattern** (string) - Required
- **input** (string) - Required
- **replacement** (string) - Required

### Example
regexReplaceAll "a(x*)b" "-ab-axxb-" "${1}W"
```

--------------------------------

### Uninstall a Helm Release

Source: https://helm.sh/docs/helm/helm_uninstall

Basic syntax for uninstalling a Helm release by providing the release name. This command removes the release resources and history from the cluster.

```bash
helm uninstall RELEASE_NAME [...] [flags]
```

--------------------------------

### Format Dates for HTML

Source: https://helm.sh/docs/chart_template_guide/function_list

Formats a date object for use in HTML date picker input fields, optionally specifying a timezone.

```helm
now | htmlDate
htmlDateInZone (now) "UTC"
```

--------------------------------

### URL Manipulation Functions

Source: https://helm.sh/docs/chart_template_guide/function_list

Functions for parsing, joining, and encoding URL components within Helm templates.

```APIDOC
## URL Functions

### urlParse
Parses a URL string into a dictionary of components.

### urlJoin
Joins a dictionary of URL components into a single string.

### urlquery
Escapes a string for safe use in a URL query parameter.

### Request Example
{{ urlParse "http://server.com/api" }}
{{ urlJoin (dict "host" "server.com" "scheme" "http") }}
{{ urlquery "my value" }}
```

--------------------------------

### String Truncation and Abbreviation

Source: https://helm.sh/docs/chart_template_guide/function_list

Functions for extracting substrings or shortening strings with ellipses. These are commonly used to ensure data fits within specific UI or configuration constraints.

```Helm Template
substr 0 5 "hello world"
trunc 5 "hello world"
trunc -5 "hello world"
abbrev 5 "hello world"
abbrevboth 5 10 "1234 5678 9123"
```

--------------------------------

### Helm Template: Greater Than or Equal Comparison (ge)

Source: https://helm.sh/docs/chart_template_guide/function_list

The 'ge' function compares two arguments and returns a boolean true if the first argument is greater than or equal to the second (Arg1 >= Arg2). Otherwise, it returns false. Used for threshold checks and comparisons.

```Go Template
ge .Arg1 .Arg2
```

--------------------------------

### YAML Inline String Representations

Source: https://helm.sh/docs/chart_template_guide/yaml_techniques

Shows the three ways to declare strings on a single line in YAML: bare words (unquoted), double-quoted strings (allowing backslash escapes), and single-quoted strings (literal, with '' for a single quote).

```yaml
way1: bare words
way2: "double-quoted strings"
way3: 'single-quoted strings'

```

--------------------------------

### Update Helm Repositories

Source: https://helm.sh/docs/topics/chart_repository

Fetches the latest chart information from all added Helm repositories. This command updates the local cache of repository index files, ensuring users can access the newest chart versions.

```bash
$ helm repo update
```

--------------------------------

### YAML Multi-line Strings: Controlling Trailing Newlines

Source: https://helm.sh/docs/chart_template_guide/yaml_techniques

Demonstrates how to control trailing newlines in multi-line strings using '|-' to strip the final newline and '|+' to preserve all trailing whitespace, including newlines. Indentation within the block is preserved.

```yaml
coffee: |-
  Latte
  Cappuccino
  Espresso

coffee: |+
  Latte
  Cappuccino
  Espresso
  
  
another: value

cofee: |-
  Latte
    12 oz
    16 oz
  Cappuccino
  Espresso

```

--------------------------------

### Define Helm Library Chart ConfigMap Template

Source: https://helm.sh/docs/topics/library_charts

Defines a named Helm template for a ConfigMap within a library chart. This template, `mylibchart.configmap.tpl`, creates a basic ConfigMap structure. It is then included in another named template, `mylibchart.configmap`, which utilizes a merge utility.

```yaml
{{- define "mylibchart.configmap.tpl" -}}
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name | printf "%s-%s" .Chart.Name }}
data: {}
{{- end -}}
{{- define "mylibchart.configmap" -}}
{{- include "mylibchart.util.merge" (append . "mylibchart.configmap.tpl") -}}
{{- end -}}

```

--------------------------------

### Declare Selectors in PodTemplates

Source: https://helm.sh/docs/chart_best_practices/pods

Ensures that PodTemplate sections specify selectors to correctly associate sets with pods, preventing issues with dynamic labels.

```yaml
selector:
  matchLabels:
      app.kubernetes.io/name: MyName
template:
  metadata:
    labels:
      app.kubernetes.io/name: MyName
```

--------------------------------

### Cryptographic Functions

Source: https://helm.sh/docs/chart_template_guide/function_list

Functions for generating hashes, checksums, and authentication credentials.

```APIDOC
## sha256sum

### Description
Computes the SHA256 digest of a string in an ASCII armored format.

### Example
sha256sum "Hello world!"

## htpasswd

### Description
Generates a bcrypt hash for a username and password, suitable for Apache basic authentication.

### Parameters
- **username** (string) - Required
- **password** (string) - Required

### Example
htpasswd "myUser" "myPassword"
```

--------------------------------

### Generate Random Bytes

Source: https://helm.sh/docs/chart_template_guide/function_list

Generates a cryptographically secure random sequence of N bytes using crypto/rand, returned as a base64 encoded string.

```text
randBytes 24
```

--------------------------------

### Helm Import Child Values via Exports

Source: https://helm.sh/docs/topics/charts

Demonstrates importing specific values from a child chart's 'exports' field into the parent chart's values. This is achieved by listing the desired keys in the 'import-values' field within the parent's Chart.yaml.

```yaml
# parent's Chart.yaml file

dependencies:
  - name: subchart
    repository: http://localhost:10191
    version: 0.1.0
    import-values:
      - data
```

```yaml
# child's values.yaml file

exports:
  data:
    myint: 99
```

```yaml
# parent's values

myint: 99
```

--------------------------------

### Find All Regex Matches with regexFindAll

Source: https://helm.sh/docs/chart_template_guide/function_list

The `regexFindAll` function returns a slice of all substrings that match the provided regular expression. The `n` parameter controls the maximum number of matches returned (-1 for all). Panics on error.

```go-template
regexFindAll "[2,4,6,8]" "123456789" -1

```

--------------------------------

### Managing Whitespace in Helm Templates

Source: https://helm.sh/docs/chart_template_guide/control_structures

Illustrates how improper indentation in Helm templates can lead to invalid YAML generation. It provides a corrected version of a conditional block to ensure proper formatting.

```yaml
apiVersion: v1  
kind: ConfigMap  
metadata:  
  name: {{ .Release.Name }}-configmap  
data:  
  myvalue: "Hello World"  
  drink: {{ .Values.favorite.drink | default "tea" | quote }}  
  food: {{ .Values.favorite.food | upper | quote }}  
  {{ if eq .Values.favorite.drink "coffee" }}  
  mug: "true"  
  {{ end }}
```

--------------------------------

### Helm Template: Set Default Value (default)

Source: https://helm.sh/docs/chart_template_guide/function_list

The 'default' function provides a fallback value if the given argument is considered empty. The definition of 'empty' varies by type (0 for numbers, "" for strings, etc.). It ensures a value is always present, preventing template errors.

```Go Template
default "foo" .Bar
```

--------------------------------

### Encode to TOML with toToml and mustToToml

Source: https://helm.sh/docs/chart_template_guide/function_list

The `toToml` function encodes a given item into a TOML string, returning an empty string if conversion fails. `mustToToml` provides error handling for failed conversions.

```go-template
toToml .Item

```

--------------------------------

### Helm Template: Force Template Failure (fail)

Source: https://helm.sh/docs/chart_template_guide/function_list

The 'fail' function unconditionally halts template rendering and returns a specified error message. This is useful for explicit error handling when certain conditions are met, ensuring clarity in failure scenarios.

```Go Template
fail "Please accept the end user license agreement"
```

--------------------------------

### Parse YAML Array to List with fromYamlArray

Source: https://helm.sh/docs/chart_template_guide/function_list

The `fromYamlArray` function converts a YAML array into a list usable within Helm templates. It takes the content of a YAML file as input.

```yaml
- name: Bob
  age: 25
- name: Ram
  age: 16

```

```go-template
{{- $people := .Files.Get "yamls/people.yml" | fromYamlArray }}
{{- range $person := $people }}
greeting: |
  Hi, my name is {{ $person.name }} and I am {{ $person.age }} years old.
{{ end }}

```

--------------------------------

### Specify Helm Chart Dependencies (YAML)

Source: https://helm.sh/docs/topics/registries

Defines chart dependencies within the Chart.yaml file, specifying the name, version, and OCI repository. The `helm dependency update` command uses this information to fetch the required charts from the registry.

```yaml
dependencies:
  - name: mychart
    version: "2.7.0"
    repository: "oci://localhost:5000/myrepo"
```

--------------------------------

### AES Encryption and Decryption

Source: https://helm.sh/docs/chart_template_guide/function_list

Encrypts plaintext using AES-256 CBC into a base64 string, or decrypts a base64 encoded string back to plaintext.

```text
encryptAES "secretkey" "plaintext"
"30tEfhuJSVRhpG97XCuWgz2okj7L8vQ1s6V9zVUPeDQ=" | decryptAES "secretkey"
```

--------------------------------

### Compute SHA256 Digest with sha256sum

Source: https://helm.sh/docs/chart_template_guide/function_list

The `sha256sum` function computes the SHA256 digest of an input string, returning it in an ASCII-armored format.

```go-template
sha256sum "Hello world!"

```

--------------------------------

### Helm Template: Check for Empty Value (empty)

Source: https://helm.sh/docs/chart_template_guide/function_list

The 'empty' function returns true if the given value is considered empty (e.g., 0, "", [], {}, false, nil) and false otherwise. It's useful for explicit checks, though often Go template's truthiness evaluation is sufficient.

```Go Template
empty .Foo
```

--------------------------------

### Declare Helm Chart Dependencies in Chart.yaml

Source: https://helm.sh/docs/helm/helm_dependency

This snippet shows how to declare dependencies for a Helm chart within the Chart.yaml file. It specifies the name, version, and repository URL for each dependency. The repository can be a remote URL or a local path prefixed with 'file://'.

```yaml
# Chart.yaml  
dependencies:  
- name: nginx  
  version: "1.2.3"  
  repository: "https://example.com/charts"  
- name: memcached  
  version: "3.2.1"  
  repository: "https://another.example.com/charts"  

```

```yaml
# Chart.yaml  
dependencies:  
- name: nginx  
  version: "1.2.3"  
  repository: "file://../dependency_chart/nginx"  

```

--------------------------------

### List Filtering and Access

Source: https://helm.sh/docs/chart_template_guide/function_list

Functions to check for existence, remove empty values, access specific indices, or slice lists.

```text
has 4 $myList
$copy := compact (list 1 "a" "foo" "")
index $myList 0 1
slice $myList 1 3
```

--------------------------------

### Retrieve Helm Release Status

Source: https://helm.sh/docs/helm/helm_status

Basic usage of the helm status command to view the status of a specific release. This command requires the release name as an argument.

```bash
helm status RELEASE_NAME
```

--------------------------------

### Define Global Values in Helm values.yaml

Source: https://helm.sh/docs/chart_template_guide/subcharts_and_globals

This snippet shows how to declare global values in a Helm chart's `values.yaml` file. These values, placed under the `global` key, can be accessed from any chart or subchart using the `{{ .Values.global.<key> }}` syntax. Ensure explicit declaration as non-global values cannot be accessed as globals.

```yaml
favorite:
  drink: coffee
  food: pizza
pizzaToppings:
  - mushrooms
  - cheese
  - peppers
  - onions

mysubchart:
  dessert: ice cream

global:
  salad: caesar

```

--------------------------------

### Helm Template: First Non-Empty Value (coalesce)

Source: https://helm.sh/docs/chart_template_guide/function_list

The 'coalesce' function takes a list of arguments and returns the first one that is not empty. This is highly effective for checking multiple potential values or variables in order and using the first available one.

```Go Template
coalesce 0 1 2
```

```Go Template
coalesce .name .parent.name "Matt"
```

--------------------------------

### Compute SHA1 Digest with sha1sum

Source: https://helm.sh/docs/chart_template_guide/function_list

The `sha1sum` function calculates the SHA1 digest of a given input string.

```go-template
sha1sum "Hello world!"

```

--------------------------------

### Pluralize String (plural)

Source: https://helm.sh/docs/chart_template_guide/function_list

The `plural` function conditionally selects between a singular and plural string based on a provided length integer. It takes the singular string, the plural string, and the length as arguments. Note that Helm's pluralization is basic and does not support complex rules; 0 is treated as plural.

```Helm
len $fish | plural "one anchovy" "many anchovies"
```

--------------------------------

### Helm Template: Inequality Check (ne)

Source: https://helm.sh/docs/chart_template_guide/function_list

The 'ne' function checks if two arguments are not equal. It returns a boolean true if the arguments are not equal (Arg1 != Arg2) and false otherwise. Useful for templates that need to react to differing values.

```Go Template
ne .Arg1 .Arg2
```

--------------------------------

### Data Serialization Functions

Source: https://helm.sh/docs/chart_template_guide/function_list

Functions for converting objects and collections into JSON or YAML strings, including pretty-printing and raw formatting options.

```APIDOC
## toJson / mustToJson

### Description
Encodes an item into a JSON string. `mustToJson` returns an error if encoding fails.

### Method
Function Call

### Parameters
- **item** (any) - Required - The object, list, or dict to encode.

### Request Example
{{ toJson .Values }}

### Response
- **string** (string) - JSON representation of the input.

## toYaml / toYamlPretty

### Description
Encodes an object into an indented YAML string. `toYamlPretty` adds additional indentation for list elements.

### Method
Function Call

### Parameters
- **item** (any) - Required - The object, list, or dict to encode.

### Request Example
{{ toYaml .Values.config }}
```

--------------------------------

### Encode Data to Pretty JSON with toPrettyJson and mustToPrettyJson

Source: https://helm.sh/docs/chart_template_guide/function_list

The `toPrettyJson` function encodes a data item into a pretty-printed (indented) JSON string. `mustToPrettyJson` returns an error on failure. This is useful for creating human-readable JSON output.

```helm
toPrettyJson .Item
```

--------------------------------

### Update Helm Repository Information

Source: https://helm.sh/docs/helm/helm_repo_update

The 'helm repo update' command fetches the latest information about available charts from your configured Helm repositories. This information is cached locally and used by commands like 'helm search'. You can update all repositories or specify individual ones.

```bash
helm repo update [REPO1 [REPO2 ...]] [flags]
```

--------------------------------

### Helm Template: Require Value (required)

Source: https://helm.sh/docs/chart_template_guide/function_list

The 'required' function enforces that a specific value must be set. If the provided argument is empty, the template rendering fails with the specified error message. This is crucial for ensuring mandatory configuration parameters are provided.

```Go Template
required "A valid foo is required!" .Bar
```

--------------------------------

### Helm Template: Boolean OR Function

Source: https://helm.sh/docs/chart_template_guide/function_list

The 'or' function returns the boolean OR of two or more arguments. It evaluates to the first non-empty argument or the last argument if all are empty. This is useful for providing fallback values or conditional logic.

```Go Template
or .Arg1 .Arg2
```

--------------------------------

### Add Common Helm Chart Dependency

Source: https://helm.sh/docs/topics/library_charts

Configuration to add the Common Helm Helper Chart as a dependency in your Helm chart's `Chart.yaml` file. This specifies the chart name, version, and repository.

```yaml
dependencies:
- name: common
  version: "^0.0.5"
  repository: "https://charts.helm.sh/incubator/"

```

--------------------------------

### Compute Adler-32 Checksum with adler32sum

Source: https://helm.sh/docs/chart_template_guide/function_list

The `adler32sum` function calculates the Adler-32 checksum for a given input string.

```go-template
adler32sum "Hello world!"

```

--------------------------------

### Verify Helm Chart Integrity

Source: https://helm.sh/docs/helm/helm_verify

Verifies that a Helm chart at the specified path has a valid provenance file, ensuring its integrity and authenticity. This command is crucial for security, confirming that the chart has not been modified since its creation by a trusted provider. It can be used standalone or through flags in other Helm commands.

```bash
helm verify PATH [flags]
```

--------------------------------

### Helm Hook Deletion Policy Annotations

Source: https://helm.sh/docs/topics/charts_hooks

Shows how to configure Helm hook deletion policies using annotations. These policies determine when the resources created by a hook are automatically deleted after the hook's execution.

```yaml
annotations:
  "helm.sh/hook-delete-policy": before-hook-creation,hook-succeeded

```

--------------------------------

### Helm Values Type Clarity

Source: https://helm.sh/docs/chart_best_practices/values

Emphasizes the importance of explicit type handling in Helm values to avoid YAML's counterintuitive type coercion. Strings should be quoted, and integers can be stored as strings and converted using `{{ int $value }}`.

```yaml
foo: "false"
foo: "12345678"
```

```yaml
{{ int $value }}
```

```yaml
foo: !!string 1234
```

--------------------------------

### Helm Chart Manifest Structure (JSON)

Source: https://helm.sh/docs/topics/registries

Represents the structure of a Helm chart as stored in an OCI registry. This JSON object details the configuration and layers, including media types and digests, for the chart's components.

```json
{
  "schemaVersion": 2,
  "config": {
    "mediaType": "application/vnd.cncf.helm.config.v1+json",
    "digest": "sha256:8ec7c0f2f6860037c19b54c3cfbab48d9b4b21b485a93d87b64690fdb68c2111",
    "size": 117
  },
  "layers": [
    {
      "mediaType": "application/vnd.cncf.helm.chart.content.v1.tar+gzip",
      "digest": "sha256:1b251d38cfe948dfc0a5745b7af5ca574ecb61e52aed10b19039db39af6e1617",
      "size": 2487
    }
  ]
}
```

--------------------------------

### Data Deserialization Functions

Source: https://helm.sh/docs/chart_template_guide/function_list

Functions for parsing YAML or JSON strings into objects or lists usable within Helm templates.

```APIDOC
## fromYaml

### Description
Parses a YAML string into a template-accessible object.

### Method
Function Call

### Parameters
- **yamlString** (string) - Required - The YAML content to parse.

### Request Example
{{ $data := .Files.Get "config.yaml" | fromYaml }}

## fromJson

### Description
Parses a JSON string into a template-accessible object.

### Method
Function Call

### Parameters
- **jsonString** (string) - Required - The JSON content to parse.

### Request Example
{{ $data := .Files.Get "config.json" | fromJson }}
```

--------------------------------

### Replace All Regex Matches with regexReplaceAll

Source: https://helm.sh/docs/chart_template_guide/function_list

The `regexReplaceAll` function returns a modified string where all occurrences matching the regular expression are replaced with a specified replacement string. Submatches can be referenced using $1, $2, etc. Panics on error.

```go-template
regexReplaceAll "a(x*)b" "-ab-axxb-" "${1}W"

```

--------------------------------

### Generate and Load Helm PowerShell Autocompletion

Source: https://helm.sh/docs/helm/helm_completion_powershell

This command generates the PowerShell autocompletion script for Helm. It can be piped into Invoke-Expression for immediate session use or added to a PowerShell profile for persistence.

```powershell
helm completion powershell | Out-String | Invoke-Expression
```

--------------------------------

### Split String by Regex with regexSplit

Source: https://helm.sh/docs/chart_template_guide/function_list

The `regexSplit` function splits an input string into a slice of substrings based on a regular expression delimiter. The `n` parameter limits the number of splits. Panics on error.

```go-template
regexSplit "z+" "pizza" -1

```

--------------------------------

### Helm Template: Greater Than Comparison (gt)

Source: https://helm.sh/docs/chart_template_guide/function_list

The 'gt' function compares two arguments and returns a boolean true if the first argument is strictly greater than the second (Arg1 > Arg2). Otherwise, it returns false. Essential for ordering and conditional logic.

```Go Template
gt .Arg1 .Arg2
```

--------------------------------

### String Casing and Repetition

Source: https://helm.sh/docs/chart_template_guide/function_list

These functions modify the casing of strings or repeat them. They are useful for normalizing input data or generating repetitive patterns.

```Helm Template
lower "HELLO"
upper "hello"
title "hello world"
repeat 3 "hello"
```

--------------------------------

### Create 'secret-reader' ClusterRole for Namespace Access

Source: https://helm.sh/docs/topics/rbac

This snippet defines and applies a custom ClusterRole named 'secret-reader'. This role is necessary for users to view Helm release secrets within a namespace, which is required for commands like 'helm list'. It includes the YAML definition and the kubectl command to create it.

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: secret-reader
rules:
- apiGroups: [""]
  resources: ["secrets"]
  verbs: ["get", "watch", "list"]
```

```bash
$ kubectl create -f clusterrole-secret-reader.yaml
```

--------------------------------

### Helm Template: Conditional Value Selection (ternary)

Source: https://helm.sh/docs/chart_template_guide/function_list

The 'ternary' function selects between two values based on a test condition. If the test value is true, the first value is returned; if the test value is empty (or false), the second value is returned. It mimics the C-style ternary operator.

```Go Template
ternary "foo" "bar" true
```

```Go Template
true | ternary "foo" "bar"
```

```Go Template
ternary "foo" "bar" false
```

```Go Template
false | ternary "foo" "bar"
```

--------------------------------

### Helm Template: Boolean AND Function

Source: https://helm.sh/docs/chart_template_guide/function_list

The 'and' function returns the boolean AND of two or more arguments. It evaluates to the first empty argument or the last argument if all are non-empty. This is useful for conditional logic within Helm templates.

```Go Template
and .Arg1 .Arg2
```

--------------------------------

### Configure Helm Chart Type to Library

Source: https://helm.sh/docs/topics/library_charts

Modifies the `Chart.yaml` file of a Helm chart to designate it as a library chart. This involves changing the `type` field from 'application' to 'library', which alters how Helm processes and deploys the chart.

```yaml
apiVersion: v2
name: mylibchart
description: A Helm chart for Kubernetes

# A chart can be either an 'application' or a 'library' chart.
#
# Application charts are a collection of templates that can be packaged into versioned archives
# to be deployed.
#
# Library charts provide useful utilities or functions for the chart developer. They're included as
# a dependency of application charts to inject those utilities and functions into the rendering
# pipeline. Library charts do not define any templates and therefore cannot be deployed.
# type: application
type: library

# This is the chart version. This version number should be incremented each time you make changes
# to the chart and its templates, including the app version.
version: 0.1.0

# This is the version number of the application being deployed. This version number should be

```

--------------------------------

### Helm .Capabilities.APIVersions.Has Function

Source: https://helm.sh/docs/chart_template_guide/function_list

Checks if a specific Kubernetes API version or resource is available in the cluster. This function is particularly useful for conditional logic within Helm charts based on cluster capabilities. It takes an API version or resource string and returns a boolean.

```go
.Capabilities.APIVersions.Has "apps/v1"
```

```go
.Capabilities.APIVersions.Has "apps/v1/Deployment"
```

--------------------------------

### Logout from a Helm Registry

Source: https://helm.sh/docs/helm/helm_registry_logout

This command removes the authentication credentials associated with a specific registry host from the local Helm configuration. It accepts the registry host as an argument and supports various global Helm flags for configuration and debugging.

```bash
helm registry logout [host] [flags]
```

--------------------------------

### Helm Chart Values Override for Image Tag

Source: https://helm.sh/docs/topics/library_charts

Configuration in `values.yaml` to set the image tag, necessary for compatibility with Helm 3 scaffold charts when using older helper charts that might rely on Helm 2 constructs.

```yaml
image:
  tag: 1.16.0

```

--------------------------------

### Encode Data to JSON with toJson and mustToJson

Source: https://helm.sh/docs/chart_template_guide/function_list

The `toJson` function encodes a given data item into a JSON string. If encoding fails, it returns an empty string. `mustToJson` is similar but returns an error on failure. Both are useful for generating JSON output from template data.

```helm
toJson .Item
```

--------------------------------

### Resulting Merged Values after Override (YAML)

Source: https://helm.sh/docs/topics/charts

Illustrates the outcome of merging a custom values file (`myvals.yaml`) with the default `values.yaml` of a Helm chart. Only the specified fields in the custom file override the defaults.

```yaml
imageRegistry: "quay.io/deis"
dockerTag: "latest"
pullPolicy: "Always"
storage: "gcs"

```

--------------------------------

### Parse JSON String to Object with fromJson

Source: https://helm.sh/docs/chart_template_guide/function_list

The `fromJson` function parses a JSON string and returns a data object usable in templates. It's the counterpart to `toJson` for loading JSON data.

```json
{
  "name": "Bob",
  "age": 25,
  "hobbies": [
    "hiking",
    "fishing",
    "cooking"
  ]
}

```

```helm
{{- $person := .Files.Get "jsons/person.json" | fromJson }}
greeting: |
  Hi, my name is {{ $person.name }} and I am {{ $person.age }} years old.
  My hobbies are {{ range $person.hobbies }}{{ . }} {{ end }}.

```

--------------------------------

### Helm urlquery Function

Source: https://helm.sh/docs/chart_template_guide/function_list

Escapes a given string to be safely embedded within the query component of a URL. This is crucial for ensuring that special characters in query parameters do not break the URL structure. It takes a string as input and returns its URL-escaped version.

```go
$var := urlquery "string for query"
```

--------------------------------

### Encode Data to YAML with toYaml

Source: https://helm.sh/docs/chart_template_guide/function_list

The `toYaml` function encodes a data structure (list, slice, array, dict, or object) into an indented YAML string. It's useful for generating YAML output, similar to GoLang's `yaml.Marshal`.

```yaml
# toYaml
- name: bob
  age: 25
  hobbies:
  - hiking
  - fishing
  - cooking

```

--------------------------------

### helm registry logout

Source: https://helm.sh/docs/helm/helm_registry

Removes authentication credentials for a remote container registry.

```APIDOC
## POST helm registry logout

### Description
Removes the stored credentials for the specified registry from the local configuration.

### Method
CLI Command

### Endpoint
helm registry logout [REGISTRY_URL]

### Request Example
helm registry logout myregistry.com

### Response
#### Success Response (0)
- **message** (string) - Logout Succeeded
```

--------------------------------

### List Manipulation Functions

Source: https://helm.sh/docs/chart_template_guide/function_list

Functions for modifying lists such as appending, prepending, concatenating, reversing, and removing duplicates. These functions generally return a new list without modifying the original.

```text
$new := append $myList 6
prepend $myList 0
concat $myList (list 6 7) (list 8)
reverse $myList
list 1 1 1 2 | uniq
without $myList 1 3 5
```

--------------------------------

### Helm `with` Action for Scope Control

Source: https://helm.sh/docs/chart_template_guide/control_structures

The `with` action in Helm templates allows you to set the current scope (`.`) to a specific object. This simplifies referencing nested variables within the block. The scope reverts after the `end` keyword. Variables from parent scopes are not directly accessible within the `with` block unless accessed using the root scope symbol `$`. This block only executes if the specified pipeline value is not empty.

```Go Template
{{ with PIPELINE }}
  # restricted scope
{{ end }}
```

```Go Template
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  {{- with .Values.favorite }}
  drink: {{ .drink | default "tea" | quote }}
  food: {{ .food | upper | quote }}
  {{- end }}
```

```Go Template
{{- with .Values.favorite }}
  drink: {{ .drink | default "tea" | quote }}
  food: {{ .food | upper | quote }}
  release: {{ .Release.Name }}
  {{- end }}
```

```Go Template
{{- with .Values.favorite }}
  drink: {{ .drink | default "tea" | quote }}
  food: {{ .food | upper | quote }}
  {{- end }}
  release: {{ .Release.Name }}
```

```Go Template
{{- with .Values.favorite }}
  drink: {{ .drink | default "tea" | quote }}
  food: {{ .food | upper | quote }}
  release: {{ $.Release.Name }}
  {{- end }}
```

--------------------------------

### YAML Multi-line Strings with '|'

Source: https://helm.sh/docs/chart_template_guide/yaml_techniques

Explains the use of the '|' (literal block scalar) for preserving newlines in multi-line strings. The content is treated as a single string with embedded newline characters. Proper indentation is crucial, and a commented first line can prevent indentation errors.

```yaml
coffee: |
  Latte
  Cappuccino
  Espresso

coffee: |
  # Commented first line
         Latte
  Cappuccino
  Espresso

```

--------------------------------

### Access Global Values in Helm Templates

Source: https://helm.sh/docs/chart_template_guide/subcharts_and_globals

Demonstrates how to access globally defined values within Helm chart templates. Both the parent chart (`mychart/templates/configmap.yaml`) and a subchart (`mysubchart/templates/configmap.yaml`) can reference the global `salad` value as `{{ .Values.global.salad }}`. The subchart also accesses its own specific value `{{ .Values.dessert }}`.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  salad: {{ .Values.global.salad }}

```

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-cfgmap2
data:
  dessert: {{ .Values.dessert }}
  salad: {{ .Values.global.salad }}

```

--------------------------------

### Parse JSON Array to List with fromJsonArray

Source: https://helm.sh/docs/chart_template_guide/function_list

The `fromJsonArray` function parses a JSON array string and returns a list that can be iterated over in templates. This is useful for handling lists of objects defined in JSON.

```json
[
 { "name": "Bob","age": 25 },
 { "name": "Ram","age": 16 }
]

```

```helm
{{- $people := .Files.Get "jsons/people.json" | fromJsonArray }}
{{- range $person := $people }}
greeting: |
  Hi, my name is {{ $person.name }} and I am {{ $person.age }} years old.
{{ end }}

```

--------------------------------

### Helm uuidv4 Function

Source: https://helm.sh/docs/chart_template_guide/function_list

Generates a universally unique identifier (UUID) of version 4. UUID v4 is based on random numbers, ensuring a high degree of uniqueness. This function requires no arguments and returns a new UUID string.

```go
uuidv4
```

--------------------------------

### Pluck Values from Multiple Dictionaries

Source: https://helm.sh/docs/chart_template_guide/function_list

Extracts values for a specific key across multiple dictionaries into a list.

```helm
pluck "name1" $myDict $myOtherDict
```

--------------------------------

### Regex Match String with regexMatch

Source: https://helm.sh/docs/chart_template_guide/function_list

The `regexMatch` function checks if an input string contains a match for a given regular expression. It returns `true` if a match is found, `false` otherwise. Panics on error.

```go-template
regexMatch "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$" "test@acme.com"

```

--------------------------------

### Derive Password

Source: https://helm.sh/docs/chart_template_guide/function_list

Derives a specific password based on shared master password constraints using a specified algorithm.

```text
derivePassword 1 "long" "password" "user" "example.com"
```

--------------------------------

### Uninstall a Helm Release

Source: https://helm.sh/docs/intro/using_helm

Removes a release from the Kubernetes cluster. In Helm 3, this deletes the release record by default unless the --keep-history flag is used.

```bash
helm uninstall happy-panda
```

--------------------------------

### YAML Scalar Type Inference

Source: https://helm.sh/docs/chart_template_guide/yaml_techniques

Illustrates how YAML infers scalar types (numeric, boolean, string) based on formatting. Unquoted numbers and booleans are typically treated as their respective types, while quotes enforce string representation. YAML node tags can be used to explicitly force type inference.

```yaml
count: 1
size: 2.34

count: "1" # <-- string, not int
size: '2.34' # <-- string, not float

isGood: true   # bool
answer: "true" # string

coffee: "yes, please"
age: !!str 21
port: !!int "80"

```

--------------------------------

### Helm Template: Boolean NOT Function

Source: https://helm.sh/docs/chart_template_guide/function_list

The 'not' function returns the boolean negation of its single argument. It inverts the truthiness of the provided value, useful for negating conditions in templates.

```Go Template
not .Arg
```

--------------------------------

### Define Chart Dependencies in Chart.yaml

Source: https://helm.sh/docs/topics/charts

The dependencies field in Chart.yaml allows you to specify external charts required by your project. It includes fields for the chart name, version, and repository URL.

```yaml
dependencies:
  - name: apache
    version: 1.2.3
    repository: https://example.com/charts
  - name: mysql
    version: 3.2.1
    repository: https://another.example.com/charts
```

--------------------------------

### Traverse Nested Dictionaries with Dig

Source: https://helm.sh/docs/chart_template_guide/function_list

Safely retrieves values from nested dictionaries, providing a default value if a key path is missing.

```helm
dig "user" "role" "humanName" "guest" $dict
merge a b c | dig "one" "two" "three" "<missing>"
```

--------------------------------

### Data Processing Functions

Source: https://helm.sh/docs/chart_template_guide/function_list

Functions for parsing YAML arrays and encoding data into TOML format.

```APIDOC
## fromYamlArray

### Description
Parses a YAML array string into a list usable within Helm templates.

### Parameters
- **yamlString** (string) - Required - The YAML formatted string to parse.

### Example
{{- $people := .Files.Get "yamls/people.yml" | fromYamlArray }}

## toToml / mustToToml

### Description
Encodes an item into a TOML string. `mustToToml` returns an error if encoding fails.

### Parameters
- **item** (interface) - Required - The object to encode.

### Example
toToml .Item
```

--------------------------------

### Merge Dictionaries in Helm

Source: https://helm.sh/docs/chart_template_guide/function_list

Merges two or more dictionaries. 'merge' gives precedence to the destination dictionary, while 'mergeOverwrite' gives precedence to the source dictionaries (right to left).

```Helm Template
$newdict := merge $dest $source1 $source2
$newdict := mergeOverwrite $dest $source1 $source2
deepCopy $source | merge $dest
```

--------------------------------

### Enforcing required values with the required function

Source: https://helm.sh/docs/howto/charts_tips_and_tricks

The required function ensures that specific values are present in the values.yaml file. If a value is missing, the template rendering fails with a custom error message.

```Go Template
{{ required "A valid foo is required!" .Values.foo }}
value: {{ required "A valid .Values.who entry required!" .Values.who }}
```

--------------------------------

### Encode Data to Raw JSON with toRawJson and mustToRawJson

Source: https://helm.sh/docs/chart_template_guide/function_list

The `toRawJson` function encodes a data item into a JSON string with HTML characters unescaped. `mustToRawJson` returns an error on failure. This is useful when the JSON content might be rendered in an HTML context.

```helm
toRawJson .Item
```

--------------------------------

### Modify Dates with dateModify

Source: https://helm.sh/docs/chart_template_guide/function_list

Adjusts a date by a specified duration string. Returns the original date if the modification format is invalid.

```helm
now | dateModify "-1.5h"
```

--------------------------------

### Replace All Literal Regex Matches with regexReplaceAllLiteral

Source: https://helm.sh/docs/chart_template_guide/function_list

The `regexReplaceAllLiteral` function replaces all occurrences matching the regular expression with a literal replacement string, without interpreting special characters like '$'. Panics on error.

```go-template
regexReplaceAllLiteral "a(x*)b" "-ab-axxb-" "${1}"

```

=== COMPLETE CONTENT === This response contains all available snippets from this library. No additional content exists. Do not make further requests.