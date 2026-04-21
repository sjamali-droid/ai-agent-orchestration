# Kibana

> **Used by**: QA, DevSecOps
> **What to paste**: saved objects API, dashboard creation, data views (index patterns), KQL syntax, discover filters, visualization types.
> **Source**: https://www.elastic.co/guide/en/kibana/current/

<!-- PASTE CONTEXT BELOW THIS LINE -->


### Start Kibana with Developer Examples

Source: https://www.elastic.co/guide/en/kibana/8.19/development-getting-started.html

Starts Kibana and includes developer examples. Use `yarn start --help` to view all available options.

```bash
yarn start --run-examples
```

--------------------------------

### Register an HTTP route handler in a plugin setup

Source: https://www.elastic.co/guide/en/kibana/8.19/kibana-platform-plugin-api.html

Demonstrates accessing the core HTTP service during the setup phase to create a router and define a GET endpoint.

```typescript
import type { CoreSetup } from '@kbn/core/server';

export class MyPlugin {
  public setup(core: CoreSetup) {
    const router = core.http.createRouter();
    // handler is called when '/path' resource is requested with `GET` method
    router.get({ path: '/path', validate: false }, (context, req, res) => res.ok({ content: 'ok' }));
  }
}
```

--------------------------------

### Ansible Setup for Ubuntu

Source: https://www.elastic.co/guide/en/kibana/8.19/development-tests.html

Installs necessary packages for Ansible on Ubuntu systems. Requires root privileges.

```bash
# Ubuntu
sudo apt-get install python3-pip libarchive-tools
pip3 install --user ansible
```

--------------------------------

### Set plugin install timeout to 30 seconds

Source: https://www.elastic.co/guide/en/kibana/8.19/kibana-plugins.html

Use the --timeout option to specify how long the plugin manager should wait before failing an installation. This example sets the timeout to 30 seconds.

```bash
bin/kibana-plugin install --timeout 30s sample-plugin
```

--------------------------------

### Install kbn-action CLI tool

Source: https://www.elastic.co/guide/en/kibana/8.19/alerting-troubleshooting.html

Install the kbn-action utility globally via npm to manage rules and connectors from the command line.

```bash
npm install -g pmuellr/kbn-action
```

--------------------------------

### Install Kibana via APT

Source: https://www.elastic.co/guide/en/kibana/8.19/deb.html

Updates the package index and installs the Kibana package.

```bash
sudo apt-get update && sudo apt-get install kibana
```

--------------------------------

### Set plugin install timeout to 1 minute

Source: https://www.elastic.co/guide/en/kibana/8.19/kibana-plugins.html

Use the --timeout option to specify how long the plugin manager should wait before failing an installation. This example sets the timeout to 1 minute.

```bash
bin/kibana-plugin install --timeout 1m sample-plugin
```

--------------------------------

### Install Kibana Plugin from URL

Source: https://www.elastic.co/guide/en/kibana/8.19/kibana-plugins.html

You can install plugins by providing a direct URL to the plugin's zip file. This is useful for installing specific versions or custom builds.

```bash
$ bin/kibana-plugin install https://artifacts.elastic.co/downloads/packs/x-pack/x-pack-8.19.13.zip
```

```bash
or
file:///local/path/to/custom_plugin.zip
```

--------------------------------

### Enable and Start Kibana Service with systemd

Source: https://www.elastic.co/guide/en/kibana/8.19/rpm.html

Configure Kibana to start automatically on system boot and manage its running state using systemctl.

```bash
sudo /bin/systemctl daemon-reload
sudo /bin/systemctl enable kibana.service

```

```bash
sudo systemctl start kibana.service
sudo systemctl stop kibana.service

```

--------------------------------

### Install and list actions with kbn-action

Source: https://www.elastic.co/guide/en/kibana/8.19/testing-connectors.html

Install the tool globally via npm and configure the environment variable to point to your Kibana instance before listing available actions.

```bash
$ npm -g install pmuellr/kbn-action

$ export KBN_URLBASE=https://elastic:<password>@<cloud-host>.us-east-1.aws.found.io:9243

$ kbn-action ls
[
    {
        "id": "a692dc89-15b9-4a3c-9e47-9fb6872e49ce",
        "actionTypeId": ".email",
        "name": "gmail",
        "config": {
            "from": "test@gmail.com",
            "host": "smtp.gmail.com",
            "port": 465,
            "secure": true,
            "service": null
        },
        "isPreconfigured": false,
        "isDeprecated": false,
        "referencedByCount": 0
    }
]
```

--------------------------------

### Bootstrap Kibana and Install Dependencies

Source: https://www.elastic.co/guide/en/kibana/8.19/development-getting-started.html

Installs all necessary dependencies for Kibana development. Ensure you have yarn v1 installed.

```bash
yarn kbn bootstrap
```

--------------------------------

### Install a Kibana Plugin

Source: https://www.elastic.co/guide/en/kibana/8.19/kibana-plugins.html

Use this command to install a plugin by its package name or URL. Ensure you have the correct package name or URL for the plugin you wish to install.

```bash
bin/kibana-plugin install <package name or URL>
```

--------------------------------

### Install Kibana using Package Manager

Source: https://www.elastic.co/guide/en/kibana/8.19/rpm.html

Use the appropriate command for your distribution to install Kibana after configuring the repository.

```bash
sudo yum install kibana __

```

```bash
sudo dnf install kibana __

```

```bash
sudo zypper install kibana __

```

--------------------------------

### Install Kibana and Run OS Level Tests

Source: https://www.elastic.co/guide/en/kibana/8.19/development-tests.html

Installs Kibana and its dependencies on the virtual machine, and runs OS-level tests. This step ensures the machine state is ready for further testing.

```bash
# Install Kibana and run OS level tests
# This step can be repeated when adding new tests, it ensures machine state - installations won't run twice
vagrant provision <hostname>
```

--------------------------------

### Example Preconfigured Server Log Connector

Source: https://www.elastic.co/guide/en/kibana/8.19/alert-action-settings-kb.html

This is an example of how to configure a preconfigured server log connector. Ensure the actionTypeId matches the connector type.

```yaml
xpack.actions.preconfigured:
  my-server-log:
    name: preconfigured-server-log-connector-type
    actionTypeId: .server-log
```

--------------------------------

### Start Kibana with APM

Source: https://www.elastic.co/guide/en/kibana/8.19/kibana-debugging.html

Standard command to start the Kibana development server.

```bash
yarn start
```

--------------------------------

### Ansible Setup for Darwin

Source: https://www.elastic.co/guide/en/kibana/8.19/development-tests.html

Installs necessary packages for Ansible on macOS systems using Homebrew. Requires user privileges.

```bash
# Darwin
brew install python3
pip3 install --user ansible
```

--------------------------------

### Bind-mount Kibana configuration with Docker Compose

Source: https://www.elastic.co/guide/en/kibana/8.19/docker.html

Example Docker Compose configuration to start Kibana, specifying a bind-mount for the kibana.yml configuration file.

```yaml
version: '2'
services:
  kibana:
    image: docker.elastic.co/kibana/kibana:8.19.13
    volumes:
      - ./kibana.yml:/usr/share/kibana/config/kibana.yml
```

--------------------------------

### Install Node.js and migrate npm packages

Source: https://www.elastic.co/guide/en/kibana/8.19/upgrading-nodejs.html

Installs a new Node.js version while automatically reinstalling global npm packages from a previous version.

```bash
nvm install <version> --reinstall-packages-from=16
```

--------------------------------

### GET /_search

Source: https://www.elastic.co/guide/en/kibana/8.19/console-kibana.html

Example of executing a standard Elasticsearch search request using the Console syntax.

```APIDOC
## GET /_search

### Description
Executes a search query against Elasticsearch using the Console interface.

### Method
GET

### Endpoint
/_search

### Request Example
GET /_search
{
  "query": {
    "match_all": {}
  }
}
```

--------------------------------

### Start Local APM Infrastructure

Source: https://www.elastic.co/guide/en/kibana/8.19/kibana-debugging.html

Starts Elasticsearch and APM servers without launching Kibana.

```bash
./scripts/compose.py start master --no-kibana
```

--------------------------------

### Download and install Debian package manually

Source: https://www.elastic.co/guide/en/kibana/8.19/deb.html

Downloads the specific version of the .deb file, verifies the checksum, and installs it.

```bash
wget https://artifacts.elastic.co/downloads/kibana/kibana-8.19.13-amd64.deb
shasum -a 512 kibana-8.19.13-amd64.deb __
sudo dpkg -i kibana-8.19.13-amd64.deb
```

--------------------------------

### Kibana Test File Structure

Source: https://www.elastic.co/guide/en/kibana/8.19/development-tests.html

This example demonstrates the basic structure of a Kibana functional test file, including service and page object loading, and before/after hooks for setup and teardown.

```javascript
import expect from '@kbn/expect';
// test files must `export default` a function that defines a test suite
export default function ({ getService, getPageObject }) {

  // most test files will start off by loading some services
  const retry = getService('retry');
  const testSubjects = getService('testSubjects');
  const esArchiver = getService('esArchiver');
  const kibanaServer = getService('kibanaServer');

  // for historical reasons, PageObjects are loaded in a single API call
  // and returned on an object with a key/value for each requested PageObject
  const PageObjects = getPageObjects(['common', 'visualize']);

  // every file must define a top-level suite before defining hooks/tests
  describe('My Test Suite', () => {

    // most suites start with a before hook that navigates to a specific
    // app/page and restores some archives into {es} with esArchiver
    before(async () => {
      await Promise.all([
        // start by clearing Saved Objects from the .kibana index
        await kibanaServer.savedObjects.cleanStandardList();
        // load some basic log data only if the index doesn't exist
        esArchiver.loadIfNeeded('src/platform/test/functional/fixtures/es_archiver/makelogs')
      ]);
      // go to the page described by `apps.visualize` in the config
      await PageObjects.common.navigateTo('visualize');
    });

    // right after the before() hook definition, add the teardown steps
    // that will tidy up {es} for other test suites
    after(async () => {
      // we clear Kibana Saved Objects but not the makelogs
      // archive because we don't make any changes to it, and subsequent
      // suites could use it if they call `.loadIfNeeded()`.
      await kibanaServer.savedObjects.cleanStandardList();
    });

    // This series of tests illustrate how tests generally verify
    // one step of a larger process and then move on to the next in
    // a new test, each step building on top of the previous
    it('Vis Listing Page is empty');
    it('Create a new vis');
    it('Shows new vis in listing page');
    it('Opens the saved vis');
    it('Respects time filter changes');
    it(... 
  });

}
```

--------------------------------

### Install an Official Elastic Plugin

Source: https://www.elastic.co/guide/en/kibana/8.19/kibana-plugins.html

To install an official Elastic plugin, simply provide its name. The tool will attempt to download it from the official repository.

```bash
$ bin/kibana-plugin install x-pack
```

--------------------------------

### GET kbn:/api/index_management/indices

Source: https://www.elastic.co/guide/en/kibana/8.19/console-kibana.html

Example of executing a Kibana-specific API request by prepending the kbn: prefix.

```APIDOC
## GET kbn:/api/index_management/indices

### Description
Executes a request to the Kibana Index Management API.

### Method
GET

### Endpoint
kbn:/api/index_management/indices

### Request Example
GET kbn:/api/index_management/indices
```

--------------------------------

### Start Kibana and Elasticsearch Servers for Development

Source: https://www.elastic.co/guide/en/kibana/8.19/development-tests.html

Use this command in a separate terminal to start the long-running Kibana and Elasticsearch servers. This allows for faster test re-runs during development as the servers are not restarted each time.

```bash
node scripts/functional_tests_server
```

--------------------------------

### Setup Virtual Machine for Package Testing

Source: https://www.elastic.co/guide/en/kibana/8.19/development-tests.html

Initializes the Vagrant virtual machine and sets up networking for package testing. Use '<hostname>' to specify the target machine.

```bash
cd src/platform/test/package

# Setup virtual machine and networking
vagrant up <hostname> --no-provision
```

--------------------------------

### Install Node.js version with nvm

Source: https://www.elastic.co/guide/en/kibana/8.19/upgrading-nodejs.html

Installs a specific version of Node.js. Replace <version> with the target version number.

```bash
nvm install <version>
```

--------------------------------

### Start Kibana from the command line

Source: https://www.elastic.co/guide/en/kibana/8.19/start-stop.html

Use these commands to start Kibana in the foreground. The process runs in the current terminal and can be terminated with Ctrl-C.

```bash
./bin/kibana
```

```batch
.\bin\kibana.bat
```

--------------------------------

### Install Kibana RPM Manually

Source: https://www.elastic.co/guide/en/kibana/8.19/rpm.html

Install the downloaded Kibana RPM package using the rpm command.

```bash
sudo rpm --install kibana-8.19.13-x86_64.rpm

```

--------------------------------

### Start Primary and Remote Elasticsearch Clusters

Source: https://www.elastic.co/guide/en/kibana/8.19/running-elasticsearch.html

Start your primary Elasticsearch cluster with persistent data. Then, start a remote cluster with specified HTTP and transport ports, and persistent data.

```bash
yarn es snapshot -E path.data=../data_prod1
```

```bash
yarn es snapshot -E transport.port=9500 -E http.port=9201 -E path.data=../data_prod2
```

--------------------------------

### Run Kibana with Custom Host for Cross-Browser Testing

Source: https://www.elastic.co/guide/en/kibana/8.19/development-tests.html

Starts the Kibana development server with a specified host, enabling testing from virtual machines. Replace 'computer' with your actual computer name.

```bash
yarn start --host=computer.local
```

--------------------------------

### Create Comment URL Example

Source: https://www.elastic.co/guide/en/kibana/8.19/cases-webhook-action-type.html

Example URL for creating a case comment by ID in a third-party system. Use the variable selector to add the external system ID. Ensure the hostname is added to `xpack.actions.allowedHosts` if used.

```url
<JIRA_URL>/rest/api/2/issue/{{{external.system.id}}}/comment
```

--------------------------------

### Configure Torq Connector

Source: https://www.elastic.co/guide/en/kibana/8.19/pre-configured-connectors.html

This example shows how to create a Torq connector. You need to specify the webhook integration URL and an authentication token.

```yaml
xpack.actions.preconfigured:
  my-torq:
    name: preconfigured-torq-connector-type
    actionTypeId: .torq
    config:
      webhookIntegrationUrl: <WEBHOOK_URL> __
    secrets:
      token: mytorqtoken __
```

--------------------------------

### Get Case URL Example

Source: https://www.elastic.co/guide/en/kibana/8.19/cases-webhook-action-type.html

REST API URL to GET a case by ID from a third-party system. Use the variable selector to add the external system ID. Ensure the hostname is added to `xpack.actions.allowedHosts` if used. The JSON is validated after Mustache variables are substituted.

```url
<JIRA_URL>/rest/api/2/issue/{{{external.system.id}}}
```

--------------------------------

### Timelion Visualization Example

Source: https://www.elastic.co/guide/en/kibana/8.19/legacy-editors.html

This example demonstrates how to create a time series visualization using Timelion, plotting average bytes and average machine RAM with different y-axes.

```APIDOC
## Example Visualization

This example shows how to create two series with custom y-axes:

```
.es(index=kibana_sample_data_logs, timefield='@timestamp', metric='avg:bytes')
  .label('Average Bytes for request')
  .title('Memory consumption over time in bytes').yaxis(1,units=bytes,position=left)
__
.es(index=kibana_sample_data_logs, timefield='@timestamp', metric=avg:machine.ram)
  .label('Average Machine RAM amount').yaxis(2,units=bytes,position=right)
```

**Explanation:**
- The first series uses `.es()` to get the average bytes, labels it, sets a title, and configures the first y-axis (`yaxis(1)`) with byte units on the left.
- The second series retrieves average machine RAM, labels it, and configures the second y-axis (`yaxis(2)`) with byte units on the right.
```

--------------------------------

### Define Plugin Interfaces (Foobar Plugin)

Source: https://www.elastic.co/guide/en/kibana/8.19/kibana-platform-plugin-api.html

Define setup and start interfaces for a plugin. These interfaces specify the public APIs that other plugins can consume. Ensure types are explicitly declared for better integration.

```typescript
import type { Plugin } from '@kbn/core/server';
export interface FoobarPluginSetup {
  getFoo(): string;
}

export interface FoobarPluginStart {
  getBar(): string;
}

export class MyPlugin implements Plugin<FoobarPluginSetup, FoobarPluginStart> {
  public setup(): FoobarPluginSetup {
    return {
      getFoo() {
        return 'foo';
      },
    };
  }

  public start(): FoobarPluginStart {
    return {
      getBar() {
        return 'bar';
      },
    };
  }
}
```

--------------------------------

### Mocking Core Setup Contracts in Kibana Plugin Tests

Source: https://www.elastic.co/guide/en/kibana/8.19/testing-kibana-plugin.html

Use coreMock to create a setup contract and mock specific service methods like uiSettings.

```typescript
import { coreMock } from '@kbn/core/public/mocks';

const coreSetup = coreMock.createSetup();
coreSetup.uiSettings.get.mockImplementation((key: string) => {
  …
});
…
const plugin = new MyPlugin(coreSetup, ...);
```

--------------------------------

### Download and install Kibana on Linux

Source: https://www.elastic.co/guide/en/kibana/8.19/targz.html

Downloads the Linux 64-bit archive, verifies the checksum, and extracts the files.

```bash
curl -O https://artifacts.elastic.co/downloads/kibana/kibana-8.19.13-linux-x86_64.tar.gz
curl https://artifacts.elastic.co/downloads/kibana/kibana-8.19.13-linux-x86_64.tar.gz.sha512 | shasum -a 512 -c - __
tar -xzf kibana-8.19.13-linux-x86_64.tar.gz
cd kibana-8.19.13/ __
```

--------------------------------

### Implement Spaces Plugin API Dependency

Source: https://www.elastic.co/guide/en/kibana/8.19/sharing-saved-objects.html

Update the Plugin class to include the Spaces plugin in the start dependencies and register it during setup.

```typescript
interface PluginStartDeps {
  spaces?: SpacesPluginStart;
}

export class MyPlugin implements Plugin<{}, {}, {}, PluginStartDeps> {
  public setup(core: CoreSetup<PluginStartDeps>) {
    core.application.register({
      ...
      async mount(appMountParams: AppMountParameters) {
        const [, pluginStartDeps] = await core.getStartServices();
        const { spaces: spacesApi } = pluginStartDeps;
        ...
        // pass `spacesApi` to your app when you render it
      },
    });
    ...
  }
}
```

--------------------------------

### Start Kibana container

Source: https://www.elastic.co/guide/en/kibana/8.19/docker.html

Starts a Kibana container named 'kib01' on the 'elastic' network, exposing port 5601.

```bash
docker run --name kib01 --net elastic -p 5601:5601 docker.elastic.co/kibana/kibana:8.19.13
```

--------------------------------

### Start Address and Time Fields

Source: https://www.elastic.co/guide/en/kibana/8.19/exported-fields-osquery.html

Fields indicating start addresses or times.

```APIDOC
## Start Address and Time Fields

### Description
Fields indicating start addresses or times.

### Fields
- **_memory_map.start_** (text) - Start address of memory region
- **_process_memory_map.start_** (text) - Virtual start address (hex)
- **_launchd.start_interval_** (text) - Frequency to run in seconds
- **_launchd.start_on_mount_** (text) - Run daemon or agent every time a filesystem is mounted
- **_start_time** (number) -
```

--------------------------------

### Start Kibana from the command line

Source: https://www.elastic.co/guide/en/kibana/8.19/windows.html

Executes the Kibana server process in the foreground using the Windows batch script.

```shell
.\bin\kibana.bat
```

--------------------------------

### Consume Plugin Interfaces (Demo Plugin)

Source: https://www.elastic.co/guide/en/kibana/8.19/kibana-platform-plugin-api.html

Access and use interfaces from dependent plugins within the `setup` and `start` lifecycle functions. Manually compose the interface types by importing from the plugin and using the plugin ID as the property name.

```typescript
import type { CoreSetup, CoreStart } from '@kbn/core/server';
import type { FoobarPluginSetup, FoobarPluginStart } from '../../foobar/server';

interface DemoSetupPlugins {
  foobar: FoobarPluginSetup;
}

interface DemoStartPlugins {
  foobar: FoobarPluginStart;
}

export class AnotherPlugin {
  public setup(core: CoreSetup, plugins: DemoSetupPlugins) {
    const { foobar } = plugins;
    foobar.getFoo(); // 'foo'
    foobar.getBar(); // throws because getBar does not exist
  }

  public start(core: CoreStart, plugins: DemoStartPlugins) {
    const { foobar } = plugins;
    foobar.getFoo(); // throws because getFoo does not exist
    foobar.getBar(); // 'bar'
  }

  public stop() {}
}
```

--------------------------------

### Get Private Location by ID/Label Request Example

Source: https://www.elastic.co/guide/en/kibana/8.19/get-private-locations-api.html

These are example API endpoints for retrieving a single private location. Use the location's unique ID or its label to make the request.

```http
GET api/synthetics/private_locations/<location_id>
```

```http
GET api/synthetics/private_locations/<Location label>
```

--------------------------------

### Run All Functional Tests (Easiest Option)

Source: https://www.elastic.co/guide/en/kibana/8.19/development-tests.html

This command starts Kibana and Elasticsearch servers, runs all tests, and then tears down the environment. It's recommended for single test runs due to its slower startup time.

```bash
node scripts/functional_tests
```

--------------------------------

### Create the Kibana keystore

Source: https://www.elastic.co/guide/en/kibana/8.19/secure-settings.html

Initializes a new keystore file in the configuration directory. Use the --password flag to enable password protection.

```bash
bin/kibana-keystore create
```

--------------------------------

### GET /api/index_management/indices

Source: https://www.elastic.co/guide/en/kibana/8.19/api.html

Example of how to access a Kibana API endpoint using the Dev Tools Console.

```APIDOC
## GET kbn:/api/index_management/indices

### Description
Retrieves a list of indices managed by Kibana. This is an example of using the `kbn:` prefix in the Dev Tools Console.

### Method
GET

### Endpoint
kbn:/api/index_management/indices

### Authentication
- Token-based authentication (Basic Authentication using username and password)
```

--------------------------------

### Example Task Manager Workload Statistics

Source: https://www.elastic.co/guide/en/kibana/8.19/task-manager-troubleshooting.html

A sample JSON output representing a healthy Task Manager workload with low schedule density.

```json
{
  "count": 26, __
  "task_types": {
    "alerting:.index-threshold": {
      "count": 2, __
      "status": {
        "idle": 2
      }
    },
    "actions:.index": {
      "count": 14,
      "status": {
        "idle": 2,
        "running": 2,
        "failed": 10 __
      }
    },
    "alerting:xpack.uptime.alerts.monitorStatus": {
      "count": 10,
      "status": {
        "idle": 10
      }
    },
  },
  "non_recurring": 0, __
  "owner_ids": 1, __
  "schedule": [ __
    ["10s", 2],
    ["1m", 2],
    ["90s", 2],
    ["5m", 8]
  ],
  "overdue_non_recurring": 0, __
  "overdue": 0, __
  "estimated_schedule_density": [ __
    0, 1, 0, 0, 0, 1, 0, 1, 0, 1,
    0, 0, 0, 1, 0, 0, 1, 1, 1, 0,
    0, 3, 0, 0, 0, 1, 0, 1, 0, 1,
    0, 0, 0, 1, 0, 0, 1, 1, 1, 0
  ],
  "capacity_requirements": { __
    "per_minute": 14,
    "per_hour": 240,
    "per_day": 0
  }
}
```

```json
{
  "count": 2191, __
  "task_types": {
    "alerting:.index-threshold": {
      "count": 202,
      "status": {
        "idle": 183,
        "claiming": 2,
        "running": 19
      }
    },
    "alerting:.es-query": {
      "count": 225,
      "status": {
        "idle": 225,
      }
    },
    "actions:.index": {
      "count": 89,
      "status": {
        "idle": 24,
        "running": 2,
        "failed": 63
      }
    },
    "alerting:xpack.uptime.alerts.monitorStatus": {
      "count": 87,
      "status": {
        "idle": 74,
        "running": 13
      }
    },
  },
  "non_recurring": 0,
  "owner_ids": 1,
  "schedule": [ __
    ["10s", 38],
    ["1m", 101],
    ["90s", 55],
    ["5m", 89],
    ["20m", 62],
    ["60m", 106],
    ["1d", 61]
  ],
  "overdue_non_recurring": 0,
  "overdue": 0, __
  "estimated_schedule_density": [  __
    10, 1, 0, 10, 0, 20, 0, 1, 0, 1,
    9, 0, 3, 10, 0, 0, 10, 10, 7, 0,
    0, 31, 0, 12, 16, 31, 0, 10, 0, 10,
    3, 22, 0, 10, 0, 2, 10, 10, 1, 0
  ],
  "capacity_requirements": {
    "per_minute": 329, __
    "per_hour": 4272, __
    "per_day": 61 __
  }
}
```

--------------------------------

### Configure Fleet packages and agent policies

Source: https://www.elastic.co/guide/en/kibana/8.19/fleet-settings-kb.html

Example configuration for pre-defining integrations and agent policies in the kibana.yml file.

```yaml
xpack.fleet.packages:
  - name: apache
    version: 0.5.0

xpack.fleet.agentPolicies:
  - name: Preconfigured Policy
    id: preconfigured-policy
    namespace: test
    package_policies:
      - package:
          name: system
        name: System Integration
        namespace: test
        id: preconfigured-system
        inputs:
          system-system/metrics:
            enabled: true
            vars:
              '[system.hostfs]': home/test
            streams:
              '[system.core]':
                enabled: true
                vars:
                  period: 20s
          system-winlog:
            enabled: false
```

--------------------------------

### Generate a demo table using Canvas expressions

Source: https://www.elastic.co/guide/en/kibana/8.19/canvas-expressions-always-start-with-a-function.html

Demonstrates a basic pipeline starting with filters, followed by data generation, table formatting, and rendering.

```text
/* Simple demo table */
filters
| demodata
| table
| render
```

--------------------------------

### Download and install Kibana on macOS

Source: https://www.elastic.co/guide/en/kibana/8.19/targz.html

Downloads the Darwin archive, verifies the checksum, and extracts the files.

```bash
curl -O https://artifacts.elastic.co/downloads/kibana/kibana-8.19.13-darwin-x86_64.tar.gz
curl https://artifacts.elastic.co/downloads/kibana/kibana-8.19.13-darwin-x86_64.tar.gz.sha512 | shasum -a 512 -c - __
tar -xzf kibana-8.19.13-darwin-x86_64.tar.gz
cd kibana-8.19.13/ __
```

--------------------------------

### Start Elastic Maps Server

Source: https://www.elastic.co/guide/en/kibana/8.19/maps-connect-to-ems.html

Run the Elastic Maps Server Docker container, exposing port 8080. This command starts the service and makes it accessible.

```bash
docker run --rm --init --publish 8080:8080 \
  docker.elastic.co/elastic-maps-service/elastic-maps-server:8.19.13
```

--------------------------------

### View Build Options

Source: https://www.elastic.co/guide/en/kibana/8.19/building-kibana.html

Run this command to see all available build options for Kibana.

```bash
yarn build --help
```

--------------------------------

### Update All Optional Index Pattern Fields

Source: https://www.elastic.co/guide/en/kibana/8.19/index-patterns-api-update.html

This example demonstrates updating all optional fields for an index pattern. Note that `...` indicates placeholder values for demonstration.

```bash
$ curl -X POST api/index_patterns/index-pattern/my-pattern
{
  "index_pattern": {
    "title": "...",
    "name": "...",
    "timeFieldName": "...",
    "sourceFilters": [],
    "fieldFormats": {},
    "type": "...",
    "typeMeta": {},
    "fields": {},
    "runtimeFieldMap": {}
  }
}
```

--------------------------------

### FormatNumber and EvalMath Output Example

Source: https://www.elastic.co/guide/en/kibana/8.19/rule-action-variables.html

Displays the rendered output of a combined EvalMath and FormatNumber operation.

```text
    original value: 628.4
    formatted value: 62,84 €
```

--------------------------------

### Access Clicked Row Index

Source: https://www.elastic.co/guide/en/kibana/8.19/drilldowns.html

Get the index of the clicked row (starting from 0) using `event.rowIndex`.

```handlebars
{{event.rowIndex}}
```

--------------------------------

### Access UI Capabilities in Plugin Start

Source: https://www.elastic.co/guide/en/kibana/8.19/development-security.html

Access UI capabilities from the `core.application` service within your plugin's `start` lifecycle function. Use these capabilities to conditionally render UI elements based on user permissions.

```javascript
public start(core) {
  const { capabilities } = core.application;

  const canUserSave = capabilities.foo.save;
  if (canUserSave) {
    // show save button
  }
}
```

--------------------------------

### Version conflict engine exception log example

Source: https://www.elastic.co/guide/en/kibana/8.19/reporting-troubleshooting.html

Example of a 409 status code error indicating a version conflict during concurrent reporting job processing.

```text
StatusCodeError: [version_conflict_engine_exception] [...]: version conflict, required seqNo [6124], primary term [1]. current document has seqNo [6125] and primary term [1], with { ... }
  status: 409,
  displayName: 'Conflict',
  path: '/.reporting-...',
  body: {
    error: {
      type: 'version_conflict_engine_exception',
      reason: '[...]: version conflict, required seqNo [6124], primary term [1]. current document has seqNo [6125] and primary term [1]',
    },
  },
  statusCode: 409
}
```

--------------------------------

### Run Elasticsearch Snapshot

Source: https://www.elastic.co/guide/en/kibana/8.19/development-getting-started.html

Starts the latest Elasticsearch snapshot. The `--license trial` flag provides access to all capabilities.

```bash
yarn es snapshot --license trial
```

--------------------------------

### Start Elasticsearch container

Source: https://www.elastic.co/guide/en/kibana/8.19/docker.html

Starts a single Elasticsearch node container named 'es01' on the 'elastic' network, exposing port 9200 and setting a memory limit of 1GB.

```bash
docker run --name es01 --net elastic -p 9200:9200 -it -m 1GB docker.elastic.co/elasticsearch/elasticsearch:8.19.13
```

--------------------------------

### Use date formatting helper

Source: https://www.elastic.co/guide/en/kibana/8.19/drilldowns.html

Examples of formatting dates using the date helper with specific patterns or relative expressions.

```text
{{date event.from “YYYY MM DD”}}
```

```text
{{date “now-15”}}
```

--------------------------------

### Using offeringBasedSchema for environment-specific configuration

Source: https://www.elastic.co/guide/en/kibana/8.19/configuration-service.html

The offeringBasedSchema helper simplifies conditional configuration logic for Serverless versus traditional environments.

```javascript
import { schema, offeringBasedSchema } from '@kbn/config-schema'

export const config = {
  schema: schema.object({
    // Enabled by default in Dev mode
    enabled: schema.boolean({ defaultValue: schema.contextRef('dev') }),

    // Setting only allowed in the Serverless offering
    plansForWorldPeace: offeringBasedSchema({
      serverless: schema.string({ defaultValue: 'Free hugs' }),
    }),
  }),
};
```

--------------------------------

### Force Node Modules Installation

Source: https://www.elastic.co/guide/en/kibana/8.19/development-getting-started.html

This command forces the re-installation of node_modules, useful for troubleshooting installation issues.

```bash
yarn kbn bootstrap --force-install
```

--------------------------------

### Search with KQL

Source: https://www.elastic.co/guide/en/kibana/8.19/discover-get-started.html

Example of a KQL query filtering by country code and product price.

```text
geoip.country_iso_code : US and products.taxless_price >= 75
```

--------------------------------

### Retrieve Kibana Verification Code

Source: https://www.elastic.co/guide/en/kibana/8.19/kibana-verification-code.html

Run this command to get a verification code for Kibana. This is typically used during setup or for security checks in production environments.

```bash
bin/kibana-verification-code
```

--------------------------------

### Start Kibana in debug mode

Source: https://www.elastic.co/guide/en/kibana/8.19/kibana-debugging.html

Use this command to start the Kibana server with Node's inspect flag enabled, which initiates three processes on ports 9229, 9230, and 9231.

```bash
yarn debug
```

--------------------------------

### Client-side Plugin Definition (`public/plugin.ts`)

Source: https://www.elastic.co/guide/en/kibana/8.19/kibana-platform-plugin-api.html

The main definition for the client-side plugin. It implements the `Plugin` interface with `setup`, `start`, and `stop` methods for managing the plugin's lifecycle.

```typescript
import type { Plugin, PluginInitializerContext, CoreSetup, CoreStart } from '@kbn/core/server';

export class MyPlugin implements Plugin {
  constructor(initializerContext: PluginInitializerContext) {}

  public setup(core: CoreSetup) {
    // called when plugin is setting up during Kibana's startup sequence
  }

  public start(core: CoreStart) {
    // called after all plugins are set up
  }

  public stop() {
    // called when plugin is torn down during Kibana's shutdown sequence
  }
}
```

--------------------------------

### Use JSON serialization helper

Source: https://www.elastic.co/guide/en/kibana/8.19/drilldowns.html

Examples of using the json helper to serialize variables for URL parameters.

```text
{{json event}}
```

```text
{{json event.key event.value}}
```

```text
{{json filters=context.panel.filters}}
```

--------------------------------

### Navigate to Integration Testing Directory

Source: https://www.elastic.co/guide/en/kibana/8.19/kibana-debugging.html

Command to enter the cloned integration testing repository.

```bash
cd apm-integration-testing
```

--------------------------------

### Build Kibana Documentation

Source: https://www.elastic.co/guide/en/kibana/8.19/development-documentation.html

Use this command to build and open the documentation. Ensure the elastic/docs repo is cloned as a sibling to your Kibana repo and the tooling is set up.

```bash
node scripts/docs.js --open
```

--------------------------------

### Valid Saved Object Type Model Version Definition

Source: https://www.elastic.co/guide/en/kibana/8.19/saved-objects-service.html

Example of a valid `modelVersions` configuration for a Saved Object type. It demonstrates correct version numbering starting from 1 with sequential increments.

```typescript
const myType: SavedObjectsType = {
  name: 'test',
  switchToModelVersionAt: '8.10.0',
  modelVersions: {
    1: modelVersion1, // valid: start with version 1
    2: modelVersion2, // valid: no gap between versions
  },
  // ...other mandatory properties
};
```

--------------------------------

### FormatNumber Output Example

Source: https://www.elastic.co/guide/en/kibana/8.19/rule-action-variables.html

Displays the rendered output of a FormatNumber operation given a specific input value.

```text
    original value: 628.4
    formatted value: 628,40 €
```

--------------------------------

### Configure systemd for Kibana

Source: https://www.elastic.co/guide/en/kibana/8.19/deb.html

Reloads the systemd daemon and enables the Kibana service to start on boot.

```bash
sudo /bin/systemctl daemon-reload
sudo /bin/systemctl enable kibana.service
```

--------------------------------

### Example prompt for AI Assistant

Source: https://www.elastic.co/guide/en/kibana/8.19/obs-ai-assistant-action-type.html

Use this prompt structure to define tasks for the AI Assistant, including creating graphs and recalling information. It demonstrates how to specify steps and send messages to external connectors like Slack.

```text
High error count alert has triggered.
  Execute the following steps:
  - create a graph of the error count for the service impacted by the alert
  for the last 24h
  - to help troubleshoot, recall past occurrences of this alert, plus any
  other active alerts. Generate a report with all the found information
  and send it to the Slack connector as a single message. Also include
  the link to this conversation in the report.
```

--------------------------------

### Console Output with Warn Level

Source: https://www.elastic.co/guide/en/kibana/8.19/logging-service.html

Example console output when the logger is configured with 'warn' level for the 'server' logger.

```log
[2017-07-25T11:54:41.639-07:00][WARN ][server] Message with `warn` log level.
[2017-07-25T11:54:41.639-07:00][ERROR][server] Message with `error` log level.
[2017-07-25T11:54:41.639-07:00][FATAL][server] Message with `fatal` log level.
```

--------------------------------

### Create Kibana keystore

Source: https://www.elastic.co/guide/en/kibana/8.19/docker.html

Creates a new keystore file for Kibana secure settings by bind-mounting configuration and data directories. This command should be run once to initialize the keystore.

```bash
docker run -it --rm -v full_path_to/config:/usr/share/kibana/config -v full_path_to/data:/usr/share/kibana/data docker.elastic.co/kibana/kibana:8.19.13 bin/kibana-keystore create
```

--------------------------------

### Generate Encryption Keys

Source: https://www.elastic.co/guide/en/kibana/8.19/kibana-encryption-keys.html

The `generate` command creates encryption keys. By default, keys are output to the console and must be manually copied to `kibana.yml` or other configuration files. Use the interactive flag for guided setup.

```bash
bin/kibana-encryption-keys generate
```

--------------------------------

### Run Accessibility Tests Locally

Source: https://www.elastic.co/guide/en/kibana/8.19/development-tests.html

Commands to start the functional test server and run the accessibility test runner.

```bash
node scripts/functional_tests_server --config test/accessibility/config.ts
```

```bash
node scripts/functional_test_runner.js --config test/accessibility/config.ts
```

--------------------------------

### Get Private Location Response Example

Source: https://www.elastic.co/guide/en/kibana/8.19/get-private-locations-api.html

This JSON object represents the response when retrieving a single private location by its ID or label. It includes the location's details such as label, ID, agent policy ID, service management status, validity, geographic coordinates, and namespace.

```json
{
    "label": "Test private location",
    "id": "test-private-location-id",
    "agentPolicyId": "test-private-location-id",
    "isServiceManaged": false,
    "isInvalid": false,
    "geo": {
        "lat": 0,
        "lon": 0
    },
    "namespace": "default"
}
```

--------------------------------

### Setup and Teardown for Model Version Integration Tests

Source: https://www.elastic.co/guide/en/kibana/8.19/saved-objects-service.html

Use createModelVersionTestBed to set up and tear down an Elasticsearch server for integration tests. Prepare the test kit before each test and tear it down afterward to ensure a clean state for migration testing.

```typescript
import {
  createModelVersionTestBed,
  type ModelVersionTestKit
} from '@kbn/core-test-helpers-model-versions';

describe('myIntegrationTest', () => {
  const testbed = createModelVersionTestBed();
  let testkit: ModelVersionTestKit;

  beforeAll(async () => {
    await testbed.startES();
  });

  afterAll(async () => {
    await testbed.stopES();
  });

  beforeEach(async () => {
    // prepare the test, preparing the index and performing the SO migration
    testkit = await testbed.prepareTestKit({
      savedObjectDefinitions: [{
        definition: mySoTypeDefinition,
        // the model version that will be used for the "before" version
        modelVersionBefore: 1,
        // the model version that will be used for the "after" version
        modelVersionAfter: 2,
      }]
    })
  });

  afterEach(async () => {
    if(testkit) {
      // delete the indices between each tests to perform a migration again
      await testkit.tearDown();
    }
  });

  it('can be used to test model version cohabitation', async () => {
    // last registered version is `1` (modelVersionBefore)
    const repositoryV1 = testkit.repositoryBefore;
    // last registered version is `2` (modelVersionAfter)
    const repositoryV2 = testkit.repositoryAfter;

    // do something with the two repositories, e.g
    await repositoryV1.create(someAttrs, { id });
    const v2docReadFromV1 = await repositoryV2.get('my-type', id);
    expect(v2docReadFromV1.attributes).toEqual(whatIExpect);
  });
});
```

--------------------------------

### Create a Time Series Visualization (CPU Usage)

Source: https://www.elastic.co/guide/en/kibana/8.19/legacy-editors.html

This example shows how to define a Timelion expression to track the real-time percentage of CPU user.

```APIDOC
## Create a Time Series Visualization (CPU Usage)

To track the real-time percentage of CPU, enter the following in the **Timelion Expression** field:

```
.es(index=metricbeat-*, timefield='@timestamp', metric='avg:system.cpu.user.pct')
```

This expression uses the `.es()` function to query the `metricbeat-*` index for the average user CPU percentage (`avg:system.cpu.user.pct`) over the `@timestamp` field.
```

--------------------------------

### Short URL API Response Example

Source: https://www.elastic.co/guide/en/kibana/8.19/short-urls-api-resolve.html

This is an example of the JSON response received when retrieving short URL information. It includes the ID, slug, locator details, access count, and dates.

```json
{
  "id": "12345",
  "slug": "hello-world",
  "locator": {
    "id": "LOCATOR_ID",
    "version": "x.x.x",
    "state": {}
  },
  "accessCount": 0,
  "accessDate": 1632680100000,
  "createDate": 1632680100000
}
```

--------------------------------

### Console Output with Trace Level

Source: https://www.elastic.co/guide/en/kibana/8.19/logging-service.html

Example console output when the logger is configured with 'console' appender and 'trace' level.

```log
[2017-07-25T11:54:41.639-07:00][TRACE][server] Message with `trace` log level.
[2017-07-25T11:54:41.639-07:00][DEBUG][server] Message with `debug` log level.
[2017-07-25T11:54:41.639-07:00][INFO ][server] Message with `info` log level.
[2017-07-25T11:54:41.639-07:00][WARN ][server] Message with `warn` log level.
[2017-07-25T11:54:41.639-07:00][ERROR][server] Message with `error` log level.
[2017-07-25T11:54:41.639-07:00][FATAL][server] Message with `fatal` log level.

[2017-07-25T11:54:41.639-07:00][TRACE][server.http] Message with `trace` log level.
[2017-07-25T11:54:41.639-07:00][DEBUG][server.http] Message with `debug` log level.
```

--------------------------------

### Install Kibana Plugin via Proxy

Source: https://www.elastic.co/guide/en/kibana/8.19/kibana-plugins.html

Kibana supports plugin installation through a proxy. Set the http_proxy and https_proxy environment variables to specify the proxy URL. The no_proxy variable can be used to exclude specific URLs.

```bash
$ http_proxy="<PROXY_URL>.local:4242" bin/kibana-plugin install <package name or URL>
```

--------------------------------

### Handle APT source errors

Source: https://www.elastic.co/guide/en/kibana/8.19/deb.html

Example of an error message encountered when an incorrect deb-src entry is present.

```text
Unable to find expected entry 'main/source/Sources' in Release file
(Wrong sources.list entry or malformed file)
```

--------------------------------

### Verify Task Manager startup log

Source: https://www.elastic.co/guide/en/kibana/8.19/task-manager-troubleshooting.html

Log entry confirming successful initialization of the Task Manager with the associated Kibana UUID.

```text
server log [12:41:33.672] [info][plugins][taskManager][taskManager] TaskManager is identified by the Kibana UUID: 5b2de169-2785-441b-ae8c-186a1936b17d
```

--------------------------------

### Inspect Task Document Structure

Source: https://www.elastic.co/guide/en/kibana/8.19/alerting-troubleshooting.html

Example of a task document retrieved from the .kibana_task_manager index.

```json
{
  "_index": ".kibana_task_manager_8.7.0_001",
  "_id": "task:ed30d1b0-7c9e-11ed-ba24-0b137d501cb7",
  "_version": 85,
  "_seq_no": 13009,
  "_primary_term": 3,
  "found": true,
  "_source": {
    "migrationVersion": {
      "task": "8.5.0"
    },
    "task": {
      "retryAt": null,
      "runAt": "2022-12-15T18:05:19.804Z",
      "startedAt": null,
      "params": """{"alertId":"ed30d1b0-7c9e-11ed-ba24-0b137d501cb7","spaceId":"default","consumer":"alerts"}""",
      "ownerId": null,
      "enabled": true,
      "schedule": {
        "interval": "1m"
      },
      "taskType": "alerting:monitoring_alert_cluster_health",
      "scope": [
        "alerting"
      ],
      "traceparent": "",
      "state": """{"alertTypeState":{"lastChecked":1671127459923},"alertInstances":{},"alertRecoveredInstances":{},"previousStartedAt":"2022-12-15T18:04:19.804Z"}""",
      "scheduledAt": "2022-12-15T18:04:16.824Z",
      "attempts": 0,
      "status": "idle"
    },
    "references": [],
    "updated_at": "2022-12-15T18:04:19.998Z",
    "coreMigrationVersion": "8.7.0",
    "created_at": "2022-12-15T17:35:55.204Z",
    "type": "task"
  }
}
```

--------------------------------

### Perform API Request with Headers

Source: https://www.elastic.co/guide/en/kibana/8.19/api.html

Example of a POST request to the Kibana API including the required kbn-xsrf and Content-Type headers.

```bash
curl -X POST \
  http://localhost:5601/api/spaces/space \
  -H 'Content-Type: application/json' \
  -H 'kbn-xsrf: true' \
  -d '{
	"id": "sales",
	"name": "Sales",
	"description": "This is your Sales Space!",
	"disabledFeatures": []
}
'
```

--------------------------------

### Use Rison serialization helper

Source: https://www.elastic.co/guide/en/kibana/8.19/drilldowns.html

Examples of using the rison helper to serialize variables into Rison format for Kibana state storage.

```text
{{rison event}}
```

```text
{{rison event.key event.value}}
```

```text
{{rison filters=context.panel.filters}}
```

--------------------------------

### Identify disk watermark issues

Source: https://www.elastic.co/guide/en/kibana/8.19/resolve-migrations-failures.html

Example output from the allocation explain API when the cluster exceeds disk usage limits.

```text
"The node is above the low watermark cluster setting [cluster.routing.allocation.disk.watermark.low=85%], using more disk space than the maximum allowed [85.0%], actual free: [11.692661332965082%]"
```

--------------------------------

### Reindex API Response Example

Source: https://www.elastic.co/guide/en/kibana/8.19/check-reindex-status.html

Example JSON response returned by the reindex API.

```json
{
  "reindexOp": {
    "indexName": ".ml-state",
    "newIndexName": ".reindexed-v7-ml-state", __
    "status": 0, __
    "lastCompletedStep": 40, __
    "reindexTaskId": "QprwvTMzRQ2MLWOW22oQ4Q:11819", __
    "reindexTaskPercComplete": 0.3, __
    "errorMessage": null __
  },
  "warnings": [], __
  "hasRequiredPrivileges": true __
}
```

--------------------------------

### Batch Start or Resume Reindex API

Source: https://www.elastic.co/guide/en/kibana/8.19/upgrade-assistant-api.html

Starts or resumes multiple reindex tasks in a batch.

```APIDOC
## Batch Start or Resume Reindex API

### Description
Allows for starting new reindex operations or resuming multiple paused reindex tasks simultaneously.

### Method
POST

### Endpoint
/api/upgrade_assistant/reindex/batch_start

### Parameters

#### Request Body
- **reindex_tasks** (array) - Required - A list of reindex tasks to start or resume.
  - **source_version** (string) - Required - The source major version of Elasticsearch.
  - **target_version** (string) - Required - The target major version of Elasticsearch.
  - **indices** (array) - Optional - A list of specific indices to reindex for this task.
    - **index** (string) - The name of the index.
  - **resume_task_id** (string) - Optional - The ID of a paused reindex task to resume.

### Request Example
```json
{
  "reindex_tasks": [
    {
      "source_version": "7.x",
      "target_version": "8.x",
      "indices": [{"index": "logs-2023.01"}]
    },
    {
      "source_version": "7.x",
      "target_version": "8.x",
      "resume_task_id": "paused_reindex_67890"
    }
  ]
}
```

### Response
#### Success Response (200)
- **results** (array) - A list of results for each batch task.
  - **task_id** (string) - The ID of the initiated or resumed reindex task.
  - **message** (string) - A status message for the task.

#### Response Example
```json
{
  "results": [
    {
      "task_id": "reindex_task_abcde",
      "message": "Reindex operation started."
    },
    {
      "task_id": "reindex_task_fghij",
      "message": "Reindex task resumed."
    }
  ]
}
```
```

--------------------------------

### Use string manipulation helpers

Source: https://www.elastic.co/guide/en/kibana/8.19/drilldowns.html

Examples of various string transformation helpers available in Handlebars templates.

```text
{{lowercase event.value}}
```

```text
{{uppercase event.value}}
```

```text
{{trim event.value}}
```

```text
{{trimLeft event.value}}
```

```text
{{trimRight event.value}}
```

```text
{{mid event.value 3 5}}
```

```text
{{left event.value 3}}
```

```text
{{right event.value 3}}
```

```text
{{concat event.value "," event.key}}
```

```text
{{replace event.value "stringToReplace" "stringToReplaceWith"}}
```

```text
{{split event.value ","}}
```

--------------------------------

### GET /v8.19/manifest

Source: https://www.elastic.co/guide/en/kibana/8.19/maps-connect-to-ems.html

Retrieves the JSON manifest describing the available basemaps and their styles.

```APIDOC
## GET /v8.19/manifest

### Description
Retrieves the JSON manifest describing the available basemaps and their styles.

### Method
GET

### Endpoint
https://tiles.maps.elastic.co/v8.19/manifest

### Parameters
#### Query Parameters
- **elastic_tile_service_tos** (string) - Required - Must be set to 'agree'
- **my_app_name** (string) - Required - The name of the application (e.g., 'kibana')
- **my_app_version** (string) - Required - The version of the application (e.g., '8.19.13')

### Response
#### Success Response (200)
- **content-type** (string) - application/json; charset=utf-8
```

--------------------------------

### Configure authentication providers in kibana.yml

Source: https://www.elastic.co/guide/en/kibana/8.19/security-settings-kb.html

Define authentication providers and their order in the `kibana.yml` configuration file. This example shows basic, SAML, and PKI providers.

```yaml
xpack.security.authc:
    providers:
      basic.basic1: __
          order: 0 __
          ...

      saml.saml1: __
          order: 1
          ...

      saml.saml2: __
          order: 2
          ...

      pki.realm3:
          order: 3
          ...
    ...
```

--------------------------------

### Use number formatting helper

Source: https://www.elastic.co/guide/en/kibana/8.19/drilldowns.html

Example of formatting a numeric value using the formatNumber helper.

```text
{{formatNumber event.value "0.0"}}
```

--------------------------------

### Configure Amazon Bedrock Connector

Source: https://www.elastic.co/guide/en/kibana/8.19/pre-configured-connectors.html

Example configuration for an Amazon Bedrock connector, requiring an API URL, default model, and AWS authentication credentials.

```yaml
xpack.actions.preconfigured:
  my-bedrock:
    name: preconfigured-bedrock-connector-type
    actionTypeId: .bedrock
    config:
      apiUrl: <REQUEST_URL> __
      defaultModel: anthropic.claude-3-5-sonnet-20240620-v1:0 __
    secrets:
      accessKey: key-value __
      secret: secret-value __
```

--------------------------------

### Example aggregation results for long-running rules

Source: https://www.elastic.co/guide/en/kibana/8.19/alerting-common-issues.html

This is an example of the aggregation results, showing rule IDs grouped by their execution duration in seconds. The 'key' represents the duration bucket, and 'buckets' list the rule IDs within that duration.

```json
{
  "took" : 322,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 326,
      "relation" : "eq"
    },
    "max_score" : null,
    "hits" : [ ]
  },
  "aggregations" : {
    "ruleIdsByExecutionDuration" : {
      "buckets" : [
        {
          "key" : 0.0, 
          "doc_count" : 320,
          "ruleId" : {
            "doc_count" : 320,
            "ruleId" : {
              "doc_count_error_upper_bound" : 0,
              "sum_other_doc_count" : 0,
              "buckets" : [
                {
                  "key" : "1923ada0-a8f3-11eb-a04b-13d723cdfdc5",
                  "doc_count" : 140
                },
                {
                  "key" : "15415ecf-cdb0-4fef-950a-f824bd277fe4",
                  "doc_count" : 130
                },
                {
                  "key" : "dceeb5d0-6b41-11eb-802b-85b0c1bc8ba2",
                  "doc_count" : 50
                }
              ]
            }
          }
        },
        {
          "key" : 30.0, 
          "doc_count" : 6,
          "ruleId" : {
            "doc_count" : 6,
            "ruleId" : {

```

--------------------------------

### Install apt-transport-https

Source: https://www.elastic.co/guide/en/kibana/8.19/deb.html

Required package for Debian systems to support HTTPS repositories.

```bash
sudo apt-get install apt-transport-https
```

--------------------------------

### Configure Slack and Webhook Connectors

Source: https://www.elastic.co/guide/en/kibana/8.19/pre-configured-connectors.html

Example configuration for Slack and Webhook connectors in kibana.yml. The key acts as the unique identifier for the connector.

```yaml
  xpack.actions.preconfigured:
    my-slack1:                  __
      actionTypeId: .slack      __
      name: 'Slack #xyz'        __
      secrets:
        webhookUrl: '<WEBHOOK_URL>' __
    webhook-service:
      actionTypeId: .webhook
      name: 'Email service'
      config:                   __
        url: '<SERVICE_URL>' __
        method: post
        headers:
          header1: value1
          header2: value2
      secrets:                  __
        user: elastic
        password: changeme
      exposeConfig: true        __
```

--------------------------------

### Validate bundle size limits once

Source: https://www.elastic.co/guide/en/kibana/8.19/ci-metrics.html

Run a single build with production optimizations to get accurate bundle sizes for validation. This process can be resource-intensive and time-consuming; consider using --max-workers to limit resource usage.

```bash
node scripts/build_kibana_platform_plugins --validate-limits --focus {pluginId}
```

--------------------------------

### Check cluster upgrade readiness

Source: https://www.elastic.co/guide/en/kibana/8.19/upgrade-assistant-api-status.html

Use this GET request to check the upgrade readiness status of your cluster. The `targetVersion` parameter is optional and specifies the version to upgrade to. This API is experimental.

```bash
GET <kibana host>:<port>/api/upgrade_assistant/status?targetVersion=9.0.0
```

--------------------------------

### Identify allocation restriction issues

Source: https://www.elastic.co/guide/en/kibana/8.19/resolve-migrations-failures.html

Example output from the allocation explain API when routing allocation is restricted.

```text
"allocate_explanation" : "cannot allocate because allocation is not permitted to any of the nodes"
```

--------------------------------

### Start or Resume Reindex API

Source: https://www.elastic.co/guide/en/kibana/8.19/upgrade-assistant-api.html

Starts a new reindex operation or resumes a paused reindex task.

```APIDOC
## Start or Resume Reindex API

### Description
Initiates a new reindex operation for indices created in a previous major version or resumes a reindex task that was previously paused.

### Method
POST

### Endpoint
/api/upgrade_assistant/reindex/start

### Parameters

#### Request Body
- **source_version** (string) - Required - The source major version of Elasticsearch from which to reindex.
- **target_version** (string) - Required - The target major version of Elasticsearch to reindex into.
- **indices** (array) - Optional - A list of specific indices to reindex. If not provided, all eligible indices will be considered.
  - **index** (string) - The name of the index.
- **resume_task_id** (string) - Optional - The ID of a paused reindex task to resume.

### Request Example
```json
{
  "source_version": "7.x",
  "target_version": "8.x",
  "indices": [
    {"index": "my-index-2023.01.01"}
  ]
}
```

### Response
#### Success Response (200)
- **task_id** (string) - The ID of the initiated or resumed reindex task.
- **message** (string) - A confirmation message.

#### Response Example
```json
{
  "task_id": "reindex_task_12345",
  "message": "Reindex operation started successfully."
}
```
```

--------------------------------

### Generate sample data with makelogs

Source: https://www.elastic.co/guide/en/kibana/8.19/sample-data.html

Use the makelogs script to generate sample data. Ensure Elasticsearch is running before execution.

```bash
node scripts/makelogs --auth <username>:<password>
```

--------------------------------

### Get Settings API

Source: https://www.elastic.co/guide/en/kibana/8.19/uptime-apis.html

Retrieves the current settings for the Uptime feature.

```APIDOC
## GET /api/uptime/settings

### Description
Gets the current settings for the Uptime feature.

### Method
GET

### Endpoint
/api/uptime/settings

### Response
#### Success Response (200)
- **settings** (object) - An object containing the current Uptime settings.

#### Response Example
```json
{
  "settings": {
    "some_setting": "value",
    "another_setting": 123
  }
}
```
```

--------------------------------

### Manage Kibana service state

Source: https://www.elastic.co/guide/en/kibana/8.19/deb.html

Commands to start or stop the Kibana service.

```bash
sudo systemctl start kibana.service
sudo systemctl stop kibana.service
```

--------------------------------

### Build plugin distributable

Source: https://www.elastic.co/guide/en/kibana/8.19/plugin-tooling.html

Execute this command within the plugin folder to generate a production-ready zip archive.

```bash
yarn build
```

--------------------------------

### Automated Accessibility Test Example

Source: https://www.elastic.co/guide/en/kibana/8.19/development-tests.html

Example of an accessibility test using the a11y service to perform snapshot testing with axe.

```javascript
export default function ({ getService, getPageObjects }) {
  const { common, home } = getPageObjects(['common', 'home']);
  const a11y = getService('a11y'); /* this is the wrapping service around axe */

  describe('Kibana Home', () => {
    before(async () => {
      await common.navigateToApp('home'); /* navigates to the page we want to test */
    });

    it('Kibana Home view', async () => {
      await retry.waitFor(
        'home page visible',
        async () => await testSubjects.exists('homeApp')
      ); /* confirm you're on the correct page and that it's loaded */
      await a11y.testAppSnapshot(); /* this expects that there are no failures found by axe */
    });

    /**
     * If these tests were added by our QA team, tests that fail that require significant app code
     * changes to be fixed will be skipped with a corresponding issue label with more info
     */
    // Skipped due to https://github.com/elastic/kibana/issues/99999
    it.skip('all plugins view page meets a11y requirements', async () => {
      await home.clickAllKibanaPlugins();
      await a11y.testAppSnapshot();
    });

    /**
     * Testing all the versions and different views of of a page is important to get good
     * coverage. Things like empty states, different license levels, different permissions, and
     * loaded data can all significantly change the UI which necessitates their own test.
     */
    it('Add Kibana sample data page', async () => {
      await common.navigateToUrl('home', '/tutorial_directory/sampleData', {
        useActualUrl: true,
      });
      await a11y.testAppSnapshot();
    });
  });
}
```

--------------------------------

### Example Response for Queued Report

Source: https://www.elastic.co/guide/en/kibana/8.19/automating-report-generation.html

A successful response for a queued report generation includes a `path` property for downloading the report and a `job` object with details about the reporting job.

```json
{
  "path": "/api/reporting/jobs/download/jxzaofkc0ykpf4062305t068",
  "job": {
    "id": "jxzaofkc0ykpf4062305t068",
    "index": ".reporting-2018.11.11",
    "jobtype": "csv",
    "created_by": "elastic",
    "payload": ...,
    "timeout": 120000,
    "max_attempts": 3
  }
}
```

--------------------------------

### Download and Verify Kibana RPM Manually

Source: https://www.elastic.co/guide/en/kibana/8.19/rpm.html

Download the Kibana RPM and its SHA512 checksum. Verify the integrity of the downloaded file before installation.

```bash
wget https://artifacts.elastic.co/downloads/kibana/kibana-8.19.13-x86_64.rpm
wget https://artifacts.elastic.co/downloads/kibana/kibana-8.19.13-x86_64.rpm.sha512
shasum -a 512 -c kibana-8.19.13-x86_64.rpm.sha512 __

```

--------------------------------

### Register Saved Object types in plugin setup

Source: https://www.elastic.co/guide/en/kibana/8.19/saved-objects-service.html

Registers defined Saved Object types during the plugin setup phase.

```typescript
import { dashboard, dashboardVisualization } from './saved_objects';

export class MyPlugin implements Plugin {
  setup({ savedObjects }) {
    savedObjects.registerType(dashboard);
    savedObjects.registerType(dashboardVisualization);
  }
}
```

--------------------------------

### Enable Kibana X-Pack Module in Metricbeat

Source: https://www.elastic.co/guide/en/kibana/8.19/monitoring-metricbeat.html

Run this command to enable the Kibana X-Pack module in Metricbeat, allowing it to collect monitoring data.

```bash
metricbeat modules enable kibana-xpack
```

--------------------------------

### Handle duplicate repository errors

Source: https://www.elastic.co/guide/en/kibana/8.19/deb.html

Example of an error message when multiple entries exist for the same repository.

```text
Duplicate sources.list entry https://artifacts.elastic.co/packages/8.x/apt/ ...
```

--------------------------------

### Configure xpack.fleet.outputs with secrets

Source: https://www.elastic.co/guide/en/kibana/8.19/fleet-settings-kb.html

Example configuration for a preconfigured Logstash output using SSL certificates and secret key management.

```yaml
xpack.fleet.outputs:
  - id: my-logstash-output-with-a-secret
    name: preconfigured logstash output with a secret
    type:  logstash
    hosts: ["localhost:9999"]
    ssl:
      certificate: xxxxxxxxxx
    secrets:
      ssl:
        key: securekey
```

--------------------------------

### Example cURL command for proxy debugging

Source: https://www.elastic.co/guide/en/kibana/8.19/alert-action-settings-kb.html

Use this command to diagnose issues with proxy configurations by observing client-proxy interactions in verbose mode.

```bash
curl --verbose --proxytunnel --proxy http://localhost:8080 http://example.com
```

--------------------------------

### Add a setting to the keystore

Source: https://www.elastic.co/guide/en/kibana/8.19/secure-settings.html

Adds a new setting to the keystore. The tool will prompt for the value unless the --stdin flag is used.

```bash
bin/kibana-keystore add the.setting.name.to.set
```

```bash
bin/kibana-keystore add elasticsearch.username
```

```bash
cat /file/containing/setting/value | bin/kibana-keystore add the.setting.name.to.set --stdin
```

--------------------------------

### Calculate kilobytes from bytes

Source: https://www.elastic.co/guide/en/kibana/8.19/managing-data-views.html

Perform calculations on existing fields. This example converts bytes to kilobytes using division. Ensure the field `bytes` exists and is numeric.

```painless
emit(doc['bytes'].value / 1024)
```

--------------------------------

### Create Index Pattern with All Optional Fields

Source: https://www.elastic.co/guide/en/kibana/8.19/index-patterns-api-create.html

Demonstrates creating an index pattern where all fields are optional at creation time. This includes fields like `id`, `version`, `timeFieldName`, `sourceFilters`, `fields`, `typeMeta`, `fieldFormats`, `fieldAttrs`, `runtimeFieldMap`, and `allowNoIndex`.

```bash
$ curl -X POST api/index_patterns/index_pattern
{
  "index_pattern": {
      "id": "...",
      "version": "...",
      "title": "...",
      "type": "...",
      "timeFieldName": "...",
      "sourceFilters": [],
      "fields": {},
      "typeMeta": {},
      "fieldFormats": {},
      "fieldAttrs": {},
      "runtimeFieldMap": {}
      "allowNoIndex": "..."
    }
}
```

--------------------------------

### Clone Kibana repository

Source: https://www.elastic.co/guide/en/kibana/8.19/development-getting-started.html

Clone the Kibana repository to your local machine and navigate into the directory. This is the first step to start developing or contributing to Kibana.

```bash
git clone https://github.com/[YOUR_USERNAME]/kibana.git kibana
cd kibana
```

--------------------------------

### GET /data/v3/{z}/{x}/{y}.pbf

Source: https://www.elastic.co/guide/en/kibana/8.19/maps-connect-to-ems.html

Retrieves a vector tile asset in protobuffer format.

```APIDOC
## GET /data/v3/{z}/{x}/{y}.pbf

### Description
Retrieves a vector tile asset in protobuffer format for a specific map coordinate.

### Method
GET

### Endpoint
https://tiles.maps.elastic.co/data/v3/{z}/{x}/{y}.pbf

### Parameters
#### Path Parameters
- **z** (integer) - Required - Zoom level
- **x** (integer) - Required - X coordinate
- **y** (integer) - Required - Y coordinate

#### Query Parameters
- **elastic_tile_service_tos** (string) - Required - Must be set to 'agree'
- **my_app_name** (string) - Required - The name of the application
- **my_app_version** (string) - Required - The version of the application

### Response
#### Success Response (200)
- **content-type** (string) - application/x-protobuf
```

--------------------------------

### Elasticsearch Aggregation Response Example

Source: https://www.elastic.co/guide/en/kibana/8.19/vega.html

This is an example response structure for a nested aggregation query, showing buckets for categories and their time-based document counts.

```json
{
  "aggregations" : {
    "categories" : {
      "doc_count_error_upper_bound" : 0,
      "sum_other_doc_count" : 0,
      "buckets" : [{
        "key" : "Men's Clothing",
        "doc_count" : 1661,
        "time_buckets" : {
          "buckets" : [{
            "key_as_string" : "2020-06-30T00:00:00.000Z",
            "key" : 1593475200000,
            "doc_count" : 19
          }, {
            "key_as_string" : "2020-07-01T00:00:00.000Z",
            "key" : 1593561600000,
            "doc_count" : 71
          }]
        }
      }]
    }
  }
}
```

--------------------------------

### Example of enabled action types

Source: https://www.elastic.co/guide/en/kibana/8.19/alert-action-settings-kb.html

A list of action types that are enabled. Defaults to all types. An empty list disables all action types.

```yaml
xpack.actions.enabledActionTypes:
  - ".email"
  - ".slack"
```

--------------------------------

### D3 Security API payload example

Source: https://www.elastic.co/guide/en/kibana/8.19/d3security-action-type.html

Example of a typeless payload sent to the D3 Security API URL. This content is not validated by the connector.

```text
this can be any type, it is not validated
```

--------------------------------

### Configure Kibana Logging Verbosity

Source: https://www.elastic.co/guide/en/kibana/8.19/settings.html

This example demonstrates how to configure Kibana's root logger to capture all events, including system usage and requests. Ensure that if custom logging configurations are applied, the root logger is also explicitly configured.

```yaml
logging:
  appenders:
    console_appender:
      type: console
      layout:
        type: pattern
        highlight: true
  root:
    appenders: [console_appender]
    level: all
```

--------------------------------

### Customize Index Pattern Creation Behavior

Source: https://www.elastic.co/guide/en/kibana/8.19/index-patterns-api-create.html

This example shows how to customize index pattern creation by setting `override` and `refresh_fields` flags. `override` determines if existing patterns are overwritten, and `refresh_fields` controls whether fields are refreshed.

```bash
$ curl -X POST api/index_patterns/index_pattern
{
  "override": false,
  "refresh_fields": true,
  "index_pattern": {
     "title": "hello"
  }
}
```

--------------------------------

### GET Request to Elasticsearch _search API

Source: https://www.elastic.co/guide/en/kibana/8.19/console-kibana.html

Use this syntax for basic GET requests to Elasticsearch APIs. It includes a JSON body for the query.

```json
GET /_search
{
  "query": {
    "match_all": {}
  }
}
```

--------------------------------

### Build and format plugin distributable

Source: https://www.elastic.co/guide/en/kibana/8.19/ci-metrics.html

Build the distributable version of your plugin and format it using prettier for direct comparison with upstream versions. This helps in inspecting byte-level changes.

```bash
node scripts/build_kibana_platform_plugins --focus {pluginId} --dist
```

```bash
npm install -g prettier
```

```bash
prettier -w {pluginDir}/target/public/{pluginId}.plugin.js
```

--------------------------------

### Webhook Action Body Example

Source: https://www.elastic.co/guide/en/kibana/8.19/webhook-action-type.html

Example of a JSON payload for a webhook action. Mustache template variables are escaped to ensure valid JSON output.

```json
{
  "short_description": "{{context.rule.name}}",
  "description": "{{context.rule.description}}",
  ...
}
```

--------------------------------

### Configure Kibana with Docker Compose

Source: https://www.elastic.co/guide/en/kibana/8.19/docker.html

Example of setting Kibana environment variables, including array syntax for host lists, using a docker-compose.yml file.

```yaml
version: '2'
services:
  kibana:
    image: docker.elastic.co/kibana/kibana:8.19.13
    environment:
      SERVER_NAME: kibana.example.org
      ELASTICSEARCH_HOSTS: '["<HOST_1>:9200","<HOST_2>:9200","<HOST_3>:9200"]'
```

--------------------------------

### Run Functional Tests Against Pre-started Servers

Source: https://www.elastic.co/guide/en/kibana/8.19/development-tests.html

Execute this command after starting servers with `functional_tests_server` to run tests against the existing Kibana and Elasticsearch instances. The exit code indicates test success or failure.

```bash
node scripts/functional_test_runner
```

--------------------------------

### List keystore settings

Source: https://www.elastic.co/guide/en/kibana/8.19/secure-settings.html

Displays all settings currently stored within the Kibana keystore.

```bash
bin/kibana-keystore list
```

--------------------------------

### External Case View URL Example

Source: https://www.elastic.co/guide/en/kibana/8.19/cases-webhook-action-type.html

URL to view a case in the external system. Use the variable selector to add the external system ID or title.

```url
<JIRA_URL>/browse/{{{external.system.title}}}
```

--------------------------------

### Install Custom API Integration

Source: https://www.elastic.co/guide/en/kibana/8.19/asset-tracking-tutorial.html

Configures the httpjson integration to poll the TriMet REST API and process the response.

```json
POST kbn:/api/fleet/package_policies
{
 "policy_id": "<policy_id>", __
 "package": {
   "name": "httpjson",
   "version": "1.18.0"
 },
 "name": "httpjson-trimet",
 "description": "TriMet data upload",
 "namespace": "default",
 "inputs": {
   "generic-httpjson": {
     "enabled": true,
     "streams": {
       "httpjson.generic": {
         "enabled": true,
         "vars": {
           "data_stream.dataset": "httpjson.trimet",
           "request_url": "https://developer.trimet.org/ws/v2/vehicles?appID=<tri_met_app_id>", __
           "request_interval": "1m", __
           "request_method": "GET",
           "response_split": "target: body.resultSet.vehicle",
           "request_redirect_headers_ban_list": [],
           "oauth_scopes": [],
           "processors": "- decode_json_fields:\n    fields: [\"message\"]\n    target: \"trimet\"\n",
           "tags": [
             "trimet"
             ]
         }
       }
     }
   }
 }
}
```

--------------------------------

### Watch and build plugin bundles locally

Source: https://www.elastic.co/guide/en/kibana/8.19/ci-metrics.html

Continuously build front-end bundles for your plugin and its dependencies while you make changes. Inspect metrics in target/public/metrics.json to determine if changes are reducing asset size.

```bash
node scripts/build_kibana_platform_plugins --dist --watch --focus {pluginId}
```

--------------------------------

### Add a 'Hello World' Runtime Field

Source: https://www.elastic.co/guide/en/kibana/8.19/discover-get-started.html

Use this script to add a simple 'Hello World!' string as a new runtime field in your data view. This is useful for testing or adding static text.

```painless
emit("Hello World!");
```

--------------------------------

### Create Kibana enrollment token

Source: https://www.elastic.co/guide/en/kibana/8.19/docker.html

Generates an enrollment token for Kibana to connect to Elasticsearch. This token is required during Kibana setup.

```bash
docker exec -it es01 /usr/share/elasticsearch/bin/elasticsearch-create-enrollment-token -s kibana
```

--------------------------------

### Accessing Elasticsearch client in a Kibana plugin

Source: https://www.elastic.co/guide/en/kibana/8.19/elasticsearch-service.html

Demonstrates how to utilize the elasticsearch.client API within a plugin's start method to perform operations as the internal system user.

```typescript
import { CoreStart, Plugin } from '@kbn/core/public';

export class MyPlugin implements Plugin {
  public start(core: CoreStart) {
    async function asyncTask() {
      const result = await core.elasticsearch.client.asInternalUser.ping(…);
    }
    asyncTask();
  }
}
```

--------------------------------

### Configure Kibana Logging via CLI

Source: https://www.elastic.co/guide/en/kibana/8.19/_cli_configuration.html

Specify logging configuration directly to the CLI. This example shows how to set custom appenders, layouts, and root logging levels.

```yaml
logging:
  appenders:
    custom:
      type: console
      layout:
        type: pattern
        pattern: "[%date][%level] %message"
  root:
    level: warn
    appenders: [custom]
```

--------------------------------

### Google Gemini API Payload Example

Source: https://www.elastic.co/guide/en/kibana/8.19/gemini-action-type.html

A stringified JSON payload for the Google Gemini invoke model API. Ensure the 'role' is correctly set, for example, 'user'.

```javascript
{
  body: JSON.stringify({
        contents: [{
            role: user,
            parts: [{ text: 'Hello world!' }]
        }],
        generation_config: {
            temperature: 0,
            maxOutputTokens: 8192
        }
  })
}
```

--------------------------------

### Complete Rewrite Appender Configuration Example

Source: https://www.elastic.co/guide/en/kibana/8.19/logging-configuration.html

An example showing the configuration of a rewrite appender named 'censor' that redacts cookie headers before logs are sent to console and file appenders.

```yaml
logging:
  appenders:
    custom_console:
      type: console
      layout:
        type: pattern
        highlight: true
        pattern: "[%date][%level][%logger] %message %meta"
    file:
      type: file
      fileName: ./kibana.log
      layout:
        type: json
    censor:
      type: rewrite
      appenders: [custom_console, file]
      policy:
        type: meta
        mode: update
        properties:
          - path: "http.request.headers.cookie"
            value: "[REDACTED]"
  loggers:
    - name: http.server.response
      appenders: [censor] # pass these logs to our rewrite appender
      level: debug
```

--------------------------------

### Configure Y-Axis and Data Series

Source: https://www.elastic.co/guide/en/kibana/8.19/legacy-editors.html

Example of chaining .es, .label, .title, and .yaxis functions to visualize multiple data series with specific axis configurations.

```text
.es(index= kibana_sample_data_logs,
    timefield='@timestamp',
    metric='avg:bytes')
  .label('Average Bytes for request')
  .title('Memory consumption over time in bytes').yaxis(1,units=bytes,position=left), __
.es(index= kibana_sample_data_logs,
    timefield='@timestamp',
    metric=avg:machine.ram)
  .label('Average Machine RAM amount').yaxis(2,units=bytes,position=right) __
```

--------------------------------

### Configure D3 Security Connector

Source: https://www.elastic.co/guide/en/kibana/8.19/pre-configured-connectors.html

Example configuration for a D3 Security connector, requiring the API URL and an authentication token.

```yaml
xpack.actions.preconfigured:
  my-d3security:
    name: preconfigured-d3security-connector-type
    actionTypeId: .d3security
    config:
      url: <URL> __
    secrets:
      token: <TOKEN> __
```

--------------------------------

### Import Elastic PGP Key

Source: https://www.elastic.co/guide/en/kibana/8.19/rpm.html

Import the Elastic PGP key to verify package integrity before installing Kibana. This command should be run on RPM-based systems.

```bash
rpm --import https://artifacts.elastic.co/GPG-KEY-elasticsearch
```

--------------------------------

### Example Error Message for Google SMTP Credentials

Source: https://www.elastic.co/guide/en/kibana/8.19/event-log-index.html

An example of an error message that might appear when Google SMTP credentials fail. This snippet shows the structure of the error message.

```json
"error" : {
  "message" : "error sending email: Invalid login: 535-5.7.8 Username and Password not accepted. Learn more at
535 5.7.8  https://support.google.com/mail/?p=BadCredentials e207sm3359731pfh.171 - gsmtp"
}
```

--------------------------------

### Run Kibana with plugin in dev mode

Source: https://www.elastic.co/guide/en/kibana/8.19/plugin-tooling.html

Use this command in the plugin root folder to enable browser bundle watching.

```bash
yarn dev --watch
```

--------------------------------

### Kibana Plugin Logging Example

Source: https://www.elastic.co/guide/en/kibana/8.19/logging-service.html

Demonstrates how to use the Kibana Logging service within a plugin to log debug and error messages. The logger is obtained from the initializer context and is only available server-side.

```typescript
import type { PluginInitializerContext, CoreSetup, Plugin, Logger } from '@kbn/core/server';

export class MyPlugin implements Plugin {
  private readonly logger: Logger;

  constructor(initializerContext: PluginInitializerContext) {
    this.logger = initializerContext.logger.get();
  }

  public setup(core: CoreSetup) {
    try {
      this.logger.debug('doing something...');
      // …
    } catch (e) {
      this.logger.error('failed doing something...');
    }
  }
}
```

--------------------------------

### Create ServiceNow ITOM Connector with Basic Auth

Source: https://www.elastic.co/guide/en/kibana/8.19/pre-configured-connectors.html

Configure a ServiceNow ITOM connector using basic authentication. Username and password should be stored in the Kibana keystore.

```yaml
xpack.actions.preconfigured:
  my-servicenow-itom:
    name: preconfigured-servicenow-connector-type
    actionTypeId: .servicenow-itom
    config:
      apiUrl: https://example.service-now.com/ __
    secrets:
      username: testuser __
      password: passwordkeystorevalue __
```

--------------------------------

### Customize Index Pattern Update Behavior

Source: https://www.elastic.co/guide/en/kibana/8.19/index-patterns-api-update.html

This example shows how to customize the update behavior by setting `refresh_fields` to true and providing an empty `fields` object. This can be useful for triggering field reloads.

```bash
$ curl -X POST api/index_patterns/index-pattern/my-pattern
{
  "refresh_fields": true,
  "index_pattern": {
    "fields": {}
  }
}
```

--------------------------------

### Build Kibana Production Distributable

Source: https://www.elastic.co/guide/en/kibana/8.19/building-kibana.html

Use this command to build a production distributable for Kibana. The `--skip-os-packages` flag prevents the building of OS-specific packages.

```bash
yarn build --skip-os-packages
```

--------------------------------

### Register Kibana Feature in Plugin Setup

Source: https://www.elastic.co/guide/en/kibana/8.19/development-security.html

Call `features.registerKibanaFeature` within your plugin's `setup` lifecycle function to register a new feature. Provide the necessary feature details as an argument.

```javascript
setup(core, { features }) {
  features.registerKibanaFeature({
    // feature details here.
  });
}
```

--------------------------------

### Show Help Information

Source: https://www.elastic.co/guide/en/kibana/8.19/kibana-encryption-keys.html

The `-h` or `--help` flag displays help information for the `kibana-encryption-keys` command, detailing available commands and options.

```bash
bin/kibana-encryption-keys -h
```

--------------------------------

### Rule Execution Time Response

Source: https://www.elastic.co/guide/en/kibana/8.19/alerting-common-issues.html

Example JSON response showing rule execution metrics, including doc counts and bucketed run durations.

```json
              "doc_count_error_upper_bound" : 0,
              "sum_other_doc_count" : 0,
              "buckets" : [
                {
                  "key" : "41893910-6bca-11eb-9e0d-85d233e3ee35",
                  "doc_count" : 6
                }
              ]
            }
          }
        }
      ]
    }
  }
}
```

--------------------------------

### Example URL for Github Issues Drilldown

Source: https://www.elastic.co/guide/en/kibana/8.19/drilldowns.html

This URL template is used for creating a URL drilldown that navigates to Github issues. Kibana substitutes `{{event.value}}` with the selected data point's value.

```html
https://github.com/elastic/kibana/issues?q=is:issue+is:open+{{event.value}}
```

--------------------------------

### Curl Request Example for EMS Headers

Source: https://www.elastic.co/guide/en/kibana/8.19/maps-connect-to-ems.html

This example demonstrates how to make a curl request to Elastic Maps Service to inspect response headers. It is useful for verifying connectivity and understanding the headers returned by the service.

```bash
curl -I https://vector.maps.elastic.co/6/12/12.pbf
```

--------------------------------

### Create a General Email Connector

Source: https://www.elastic.co/guide/en/kibana/8.19/pre-configured-connectors.html

Use this configuration to create a general email connector. Ensure `host` and `port` are defined if `service` is 'other'.

```yaml
xpack.actions.preconfigured:
  my-email:
    name: preconfigured-email-connector-type
    actionTypeId: .email
    config:
      service: other __
      from: testsender@test.com __
      host: validhostname __
      port: 8080 __
      secure: false __
      hasAuth: true __
    secrets:
      user: testuser __
      password: passwordkeystorevalue __
```

--------------------------------

### Execute a connector action via kbn-action CLI

Source: https://www.elastic.co/guide/en/kibana/8.19/alerting-troubleshooting.html

Run a connector action using the kbn-action CLI tool, which simplifies the interaction with the underlying REST API.

```bash
kbn-action execute a692dc89-15b9-4a3c-9e47-9fb6872e49ce ‘{"params":{"subject":"hallo","message":"hallo!","to":["me@example.com"]}}’
```

--------------------------------

### Example Event Log Entry for Action Execution Error

Source: https://www.elastic.co/guide/en/kibana/8.19/event-log-index.html

An example of an event log entry detailing an error during action execution. This entry includes details about the event, Kibana saved objects, and the error message.

```json
{
  "event": {
    "provider": "actions",
    "action": "execute",
    "start": "2020-03-31T04:27:30.392Z",
    "end": "2020-03-31T04:27:30.393Z",
    "duration": 1000000
  },
  "kibana": {
    "namespace": "default",
    "saved_objects": [
      {
        "type": "action",
        "id": "7a6fd3c6-72b9-44a0-8767-0432b3c70910"
      }
    ],
  },
  "message": "action executed: .server-log:7a6fd3c6-72b9-44a0-8767-0432b3c70910: server-log",
  "@timestamp": "2020-03-31T04:27:30.393Z",
}
```

--------------------------------

### Select fields with ES|QL

Source: https://www.elastic.co/guide/en/kibana/8.19/try-esql.html

Retrieves specific fields from the sample logs index.

```ES|QL
FROM kibana_sample_data_logs __
| KEEP machine.os, machine.ram __
```

--------------------------------

### GET /api/synthetics/monitors/{config_id}

Source: https://www.elastic.co/guide/en/kibana/8.19/get-monitor-api.html

Retrieves a specific monitor by its configuration ID. If the monitor is not found, the API returns a 404 error.

```APIDOC
## GET /api/synthetics/monitors/<config_id>

### Description
Get a monitor with the config_id. If the monitor is not found, then this API returns a 404 error.

### Method
GET

### Endpoint
<kibana host>:<port>/api/synthetics/monitors/<config_id>
<kibana host>:<port>/s/<space_id>/api/synthetics/monitors/<config_id>

### Parameters
#### Path Parameters
- **config_id** (string) - Required - The ID of the monitor that you want to update.
- **space_id** (string) - Optional - An identifier for the space. If space_id is not provided in the URL, the default space is used.
```

--------------------------------

### Upgrade readiness status API response

Source: https://www.elastic.co/guide/en/kibana/8.19/upgrade-assistant-api-status.html

This is an example of a successful response from the Upgrade readiness status API. It indicates whether the cluster is ready for an upgrade and provides details on any issues that must be resolved.

```json
{
  "readyForUpgrade": false,
  "details":"The following issues must be resolved before upgrading: 1 Elasticsearch deprecation issue."
}
```

--------------------------------

### Identify migration timeout logs

Source: https://www.elastic.co/guide/en/kibana/8.19/resolve-migrations-failures.html

Example log entry indicating a migration failure due to an index failing to reach yellow status.

```text
"Action failed with [index_not_yellow_timeout] Timeout waiting for the status of the [.kibana_8.1.0_001] index to become "yellow". Retrying attempt 1 in 2 seconds."
```

--------------------------------

### Enable time series in ES|QL

Source: https://www.elastic.co/guide/en/kibana/8.19/try-esql.html

Uses ?_tstart and ?_tend parameters to enable time series capabilities for indices lacking a @timestamp field.

```ES|QL
FROM kibana_sample_data_ecommerce
| WHERE order_date >= ?_tstart and order_date <= ?_tend
```

--------------------------------

### Default Server Log Connector Message

Source: https://www.elastic.co/guide/en/kibana/8.19/rule-type-es-query.html

Example message template provided for server log connector actions that run for each alert.

```text
Elasticsearch query rule '{{rule.name}}' is active:

- Value: {{context.value}}
- Conditions Met: {{context.conditions}} over {{rule.params.timeWindowSize}}{{rule.params.timeWindowUnit}}
- Timestamp: {{context.date}}
- Link: {{context.link}}
```

--------------------------------

### Example of enabled email services

Source: https://www.elastic.co/guide/en/kibana/8.19/alert-action-settings-kb.html

An array of strings indicating which email services are enabled. If the array is empty, no email services are enabled. The default value enables all services.

```yaml
xpack.actions.email.services.enabled:
  - "amazon-ses"
  - "microsoft-outlook"
```

--------------------------------

### Build Kibana OS Packages

Source: https://www.elastic.co/guide/en/kibana/8.19/building-kibana.html

This section outlines the steps to build OS packages (RPM and DEB) for Kibana. It requires specific Ruby gems and Docker for testing on Linux. The `--skip-archives` flag is used to focus on OS package building.

```bash
apt-get install ruby ruby-dev rpm dpkg build-essential
gem install fpm -v 1.5.0
yarn build --skip-archives
```

--------------------------------

### Batch Start or Resume Reindex API

Source: https://www.elastic.co/guide/en/kibana/8.19/batch-start-resume-reindex.html

Starts or resumes upgrading multiple indices in one request. Reindexing tasks are queued and executed one-by-one to minimize cluster resource consumption. This API does not support data streams.

```APIDOC
## Batch Start or Resume Reindex API

### Description
Starts or resumes upgrading multiple indices in one request. Additionally, reindexing tasks for upgrading indices that are started or resumed via the batch endpoint will be placed on a queue and executed one-by-one. This ensures that minimal cluster resources are consumed over time. This API does not support data streams.

### Method
POST

### Endpoint
/api/upgrade_assistant/reindex/batch

### Parameters
#### Request Body
- **indexNames** (Required, array) - The list of index names to be reindexed.

### Request Example
```json
{
  "indexNames": [
    "index1",
    "index2"
  ]
}
```

### Response
#### Success Response (200)
Indicates a successful call.

#### Response Example
```json
{
  "acknowledged": true
}
```
```

--------------------------------

### Example Event Log Entry for Rule Execution Error

Source: https://www.elastic.co/guide/en/kibana/8.19/event-log-index.html

An example of an event log entry for a rule execution error. This entry includes details about the event, Kibana saved objects, and the specific error message encountered.

```json
{
  "event": {
    "provider": "alerting",
    "start": "2020-03-31T04:27:30.392Z",
    "end": "2020-03-31T04:27:30.393Z",
    "duration": 1000000
  },
  "kibana": {
    "namespace": "default",
    "saved_objects": [
      {
        "rel" : "primary",
        "type" : "alert",
      	  "id" : "30d856c0-b14b-11eb-9a7c-9df284da9f99"
      }
    ],
  },
  "message": "rule executed: .index-threshold:30d856c0-b14b-11eb-9a7c-9df284da9f99: 'test'",
  "error" : {
    "message" : "Saved object [action/ef0e2530-b14a-11eb-9a7c-9df284da9f99] not found"
  },
}
```

--------------------------------

### Add Elastic APT repository

Source: https://www.elastic.co/guide/en/kibana/8.19/deb.html

Saves the repository definition to the sources list directory.

```bash
echo "deb [signed-by=/usr/share/keyrings/elasticsearch-keyring.gpg] https://artifacts.elastic.co/packages/8.x/apt stable main" | sudo tee /etc/apt/sources.list.d/elastic-8.x.list
```

--------------------------------

### Register Kibana Feature with Subfeature Privileges

Source: https://www.elastic.co/guide/en/kibana/8.19/development-security.html

This example demonstrates registering a Kibana feature named 'Discover' with both general and subfeature privileges. It includes 'Create Short URLs' and 'Generate PDF Reports' subfeatures, with the latter having a 'platinum' license requirement.

```javascript
public setup(core, { features }) {
  features.registerKibanaFeature({
    {
      id: 'discover',
      name: i18n.translate('xpack.features.discoverFeatureName', {
        defaultMessage: 'Discover',
      }),
      order: 100,
      category: DEFAULT_APP_CATEGORIES.kibana,
      app: ['kibana'],
      catalogue: ['discover'],
      privileges: {
        all: {
          app: ['kibana'],
          catalogue: ['discover'],
          savedObject: {
            all: ['search', 'query'],
            read: ['index-pattern'],
          },
          ui: ['show', 'save', 'saveQuery'],
        },
        read: {
          app: ['kibana'],
          catalogue: ['discover'],
          savedObject: {
            all: [],
            read: ['index-pattern', 'search', 'query'],
          },
          ui: ['show'],
        },
      },
      subFeatures: [
        {
          name: i18n.translate('xpack.features.ossFeatures.discoverShortUrlSubFeatureName', {
            defaultMessage: 'Short URLs',
          }),
          privilegeGroups: [
            {
              groupType: 'independent',
              privileges: [
                {
                  id: 'url_create',
                  name: i18n.translate(
                    'xpack.features.ossFeatures.discoverCreateShortUrlPrivilegeName',
                    {
                      defaultMessage: 'Create Short URLs',
                    }
                  ),
                  includeIn: 'all',
                  savedObject: {
                    all: ['url'],
                    read: [],
                  },
                  ui: ['createShortUrl'],
                },
              ],
            },
            {
              groupType: 'independent',
              privileges: [
                {
                  id: 'pdf_generate',
                  name: i18n.translate(
                    'xpack.features.ossFeatures.discoverGeneratePDFReportsPrivilegeName',
                    {
                      defaultMessage: 'Generate PDF Reports',
                    }
                  ),
                  minimumLicense: 'platinum',
                  includeIn: 'all',
                  savedObject: {
                    all: [],
                    read: [],
                  },
                  api: ['generatePDFReports'],
                  ui: ['generatePDFReports'],
                },
              ],
            },
          ],
        },
      ],
    }
  });
}
```

--------------------------------

### GET /api/synthetics/private_locations

Source: https://www.elastic.co/guide/en/kibana/8.19/get-private-locations-api.html

Retrieves a list of all available private locations.

```APIDOC
## GET /api/synthetics/private_locations

### Description
Returns a JSON array of all private locations.

### Method
GET

### Endpoint
api/synthetics/private_locations

### Response
#### Success Response (200)
- **label** (string) - A label for the private location.
- **id** (string) - The unique identifier of the private location.
- **agentPolicyId** (string) - The ID of the agent policy associated with the private location.
- **isInvalid** (boolean) - Indicates whether the location is invalid.
- **geo** (object) - Geographic coordinates (lat, lon).
- **namespace** (string) - The namespace of the location.

#### Response Example
[
    {
        "label": "Test private location",
        "id": "fleet-server-policy",
        "agentPolicyId": "fleet-server-policy",
        "isInvalid": false,
        "geo": {
            "lat": 0,
            "lon": 0
        },
        "namespace": "default"
    }
]
```

--------------------------------

### GET /api/index_patterns/index_pattern/<id>

Source: https://www.elastic.co/guide/en/kibana/8.19/index-patterns-api-get.html

Retrieves the details of a specific index pattern.

```APIDOC
## GET /api/index_patterns/index_pattern/<id>

### Description
Retrieves the configuration and metadata for a specific index pattern.

### Method
GET

### Endpoint
/api/index_patterns/index_pattern/<id>

### Parameters
#### Path Parameters
- **id** (string) - Required - The unique identifier of the index pattern.
```

--------------------------------

### Get Features API

Source: https://www.elastic.co/guide/en/kibana/8.19/advanced.html

Retrieves information about available Kibana features.

```APIDOC
## GET /api/features

### Description
Retrieves a list of available Kibana features and their statuses.

### Method
GET

### Endpoint
/api/features
```

--------------------------------

### Display a setting value

Source: https://www.elastic.co/guide/en/kibana/8.19/secure-settings.html

Outputs the configured value for a specific setting key.

```bash
bin/kibana-keystore show setting.key
```

--------------------------------

### Package BOM Modified Time

Source: https://www.elastic.co/guide/en/kibana/8.19/exported-fields-osquery.html

The timestamp when a file in a package BOM was installed.

```APIDOC
## GET /api/package_bom/modified_time

### Description
Retrieves the installation timestamp for a file in a package BOM.

### Method
GET

### Endpoint
/api/package_bom/modified_time

### Parameters
#### Query Parameters
- **_package_bom.modified_time_** (number.long) - Required - Timestamp the file was installed
```

--------------------------------

### Verify Kibana image signature

Source: https://www.elastic.co/guide/en/kibana/8.19/docker.html

Verifies the signature of the Kibana Docker image using Cosign. Ensure Cosign is installed and cosign.pub is downloaded.

```bash
wget https://artifacts.elastic.co/cosign.pub
cosign verify --key cosign.pub docker.elastic.co/kibana/kibana:8.19.13
```

--------------------------------

### Configure Kibana RPM Repository

Source: https://www.elastic.co/guide/en/kibana/8.19/rpm.html

Create this file in /etc/yum.repos.d/ or /etc/zypp/repos.d/ to add the Kibana repository for package management.

```ini
[kibana-8.x]
name=Kibana repository for 8.x packages
baseurl=https://artifacts.elastic.co/packages/8.x/yum
gpgcheck=1
gpgkey=https://artifacts.elastic.co/GPG-KEY-elasticsearch
enabled=1
autorefresh=1
type=rpm-md

```

--------------------------------

### Get Task Manager Health

Source: https://www.elastic.co/guide/en/kibana/8.19/dashboard-import-api.html

Retrieves the health status of the Task Manager.

```APIDOC
## GET /api/tasks/health

### Description
Retrieves the health status of the Task Manager.

### Method
GET

### Endpoint
/api/tasks/health
```

--------------------------------

### Generate Webpack Stats for Bundle Analysis

Source: https://www.elastic.co/guide/en/kibana/8.19/plugin-performance.html

Command to build Kibana platform plugins with profiling enabled and without examples, generating a webpack stats file for detailed bundle analysis.

```bash
node scripts/build_kibana_platform_plugins.js --dist --no-examples --profile
```

--------------------------------

### GET /api/upgrade_assistant/reindex/{index}

Source: https://www.elastic.co/guide/en/kibana/8.19/check-reindex-status.html

Checks the status of a reindex task for a specific index.

```APIDOC
## GET /api/upgrade_assistant/reindex/{index}

### Description
Check the status of the reindex task for the specified index.

### Method
GET

### Endpoint
<kibana host>:<port>/api/upgrade_assistant/reindex/{index}

### Parameters
#### Path Parameters
- **index** (string) - Required - The name of the index to check the reindex status for.

### Response
#### Success Response (200)
- Indicates a successful call.
```

--------------------------------

### Create ServiceNow SecOps Connector with Basic Auth

Source: https://www.elastic.co/guide/en/kibana/8.19/pre-configured-connectors.html

Use this configuration to create a ServiceNow SecOps connector with basic authentication. The password should be stored in the Kibana keystore.

```yaml
xpack.actions.preconfigured:
  my-servicenow-sir:
    name: preconfigured-servicenow-connector-type
    actionTypeId: .servicenow-sir
    config:
      apiUrl: https://example.service-now.com/ __
      usesTableApi: false __
    secrets:
      username: testuser __
      password: passwordkeystorevalue __
```

--------------------------------

### Register Git Pre-commit Hook

Source: https://www.elastic.co/guide/en/kibana/8.19/development-getting-started.html

Installs a pre-commit hook to run checks like linting and file casing before committing. The hook is created in `.git/hooks/pre-commit`.

```bash
node scripts/register_git_hook
```

--------------------------------

### Get Features API

Source: https://www.elastic.co/guide/en/kibana/8.19/agent-explorer.html

Retrieves information about available features within Kibana.

```APIDOC
## GET /api/features

### Description
Retrieves a list of available features in Kibana.

### Method
GET

### Endpoint
/api/features
```

--------------------------------

### Start or Resume Reindex API

Source: https://www.elastic.co/guide/en/kibana/8.19/start-resume-reindex.html

This API allows you to start a new reindex task or resume a previously paused reindex task. The reindex process involves several steps, including setting the index to read-only, creating a new index, reindexing documents, creating an index alias, and deleting the old index.

```APIDOC
## POST /api/upgrade_assistant/reindex/{indexName}

### Description
Starts a new reindex task or resumes a paused reindex task for the specified index.

### Method
POST

### Endpoint
`/api/upgrade_assistant/reindex/{indexName}`

### Parameters
#### Path Parameters
- **indexName** (string) - Required - The name of the index to reindex.

### Response
#### Success Response (200)
Indicates a successful call.

#### Response Example
(No specific response body example provided in the source text)
```

--------------------------------

### Extension Fields

Source: https://www.elastic.co/guide/en/kibana/8.19/exported-fields-osquery.html

Fields related to browser extensions, specifically if they were installed from a web store.

```APIDOC
## Extension Fields

### _chrome_extensions.from_webstore_
**Description**: True if this extension was installed from the web store
```

--------------------------------

### Ingest Sample Data with Elasticsearch Bulk API

Source: https://www.elastic.co/guide/en/kibana/8.19/playground.html

Use the Bulk API to add multiple documents to an Elasticsearch index. This example adds book data to the 'books' index.

```json
POST /_bulk
{ "index" : { "_index" : "books" } }
{"name": "Snow Crash", "author": "Neal Stephenson", "release_date": "1992-06-01", "page_count": 470}
{ "index" : { "_index" : "books" } }
{"name": "Revelation Space", "author": "Alastair Reynolds", "release_date": "2000-03-15", "page_count": 585}
{ "index" : { "_index" : "books" } }
{"name": "1984", "author": "George Orwell", "release_date": "1985-06-01", "page_count": 328}
{ "index" : { "_index" : "books" } }
{"name": "Fahrenheit 451", "author": "Ray Bradbury", "release_date": "1953-10-15", "page_count": 227}
{ "index" : { "_index" : "books" } }
{"name": "Brave New World", "author": "Aldous Huxley", "release_date": "1932-06-01", "page_count": 268}
{ "index" : { "_index" : "books" } }
{"name": "The Handmaids Tale", "author": "Margaret Atwood", "release_date": "1985-06-01", "page_count": 311}
```

--------------------------------

### GET /api/upgrade_assistant/status

Source: https://www.elastic.co/guide/en/kibana/8.19/upgrade-assistant-api-status.html

Checks the upgrade readiness status of the cluster for a specified target version.

```APIDOC
## GET /api/upgrade_assistant/status

### Description
Check the status of your cluster to determine if it is ready for an upgrade to a specific version.

### Method
GET

### Endpoint
<kibana host>:<port>/api/upgrade_assistant/status

### Parameters
#### Query Parameters
- **targetVersion** (string) - Optional - The version to upgrade to (e.g., 9.0.0).

### Response
#### Success Response (200)
- **readyForUpgrade** (boolean) - Indicates if the cluster is ready for the upgrade.
- **details** (string) - Provides information regarding issues that must be resolved before upgrading.

#### Response Example
{
  "readyForUpgrade": false,
  "details": "The following issues must be resolved before upgrading: 1 Elasticsearch deprecation issue."
}

### Response Codes
- **200**: Indicates a successful call.
- **403**: Indicates a forbidden request when the upgrade path is not supported (e.g., upgrading more than 1 major version or downgrading).
```

--------------------------------

### demodata

Source: https://www.elastic.co/guide/en/kibana/8.19/canvas-function-reference.html

Provides a sample data set including project CI times, usernames, countries, and run phases.

```APIDOC
## demodata

### Description
A sample data set that includes project CI times with usernames, countries, and run phases.

### Parameters
#### Arguments
- **type** (string) - Optional - The name of the demo data set to use. Default: "ci"

### Returns
- **datatable**
```

--------------------------------

### GET Reindex Status

Source: https://www.elastic.co/guide/en/kibana/8.19/start-resume-reindex.html

Retrieves the current status and progress information for a reindexing task.

```APIDOC
## GET /reindex/status

### Description
Returns the status of the reindexing process, including the new index name, completion percentage, and any error messages.

### Method
GET

### Response
#### Success Response (200)
- **indexName** (string) - The original index name.
- **newIndexName** (string) - The name of the new index.
- **status** (integer) - The reindex status code.
- **lastCompletedStep** (integer) - The last successfully completed step of the reindex.
- **reindexTaskId** (string) - The task ID of the reindex task in Elasticsearch.
- **reindexTaskPercComplete** (decimal) - The progress of the reindexing task (0 to 1).
- **errorMessage** (string) - The error message if the reindex failed.

#### Response Example
{
  "indexName": ".ml-state",
  "newIndexName": ".reindexed-v7-ml-state",
  "status": 0,
  "lastCompletedStep": 0,
  "reindexTaskId": null,
  "reindexTaskPercComplete": null,
  "errorMessage": null
}
```

--------------------------------

### Running Kibana with Specific Config Files

Source: https://www.elastic.co/guide/en/kibana/8.19/production.html

Command line usage to specify different configuration files for Kibana instances.

```bash
bin/kibana -c config/instance1.yml
bin/kibana -c config/instance2.yml
```

--------------------------------

### Task Manager Health API

Source: https://www.elastic.co/guide/en/kibana/8.19/release-notes-8.15.2.html

API to get the health status of the Task Manager.

```APIDOC
## GET /api/task_manager/health

### Description
Gets the health status of the Task Manager.

### Method
GET

### Endpoint
/api/task_manager/health
```

--------------------------------

### GET /api/synthetics/private_locations

Source: https://www.elastic.co/guide/en/kibana/8.19/get-private-locations-api.html

Retrieves a list of private locations or a single private location by ID.

```APIDOC
## GET /api/synthetics/private_locations

### Description
Retrieves a list of private locations or a single private location by ID.

### Method
GET

### Endpoint
`GET <kibana host>:<port>/api/synthetics/private_locations`
`GET <kibana host>:<port>/s/<space_id>/api/synthetics/private_locations`

### Parameters
#### Path Parameters
- **space_id** (string) - Optional - An identifier for the Kibana space.

### Prerequisites
You must have `read` privileges for the **Synthetics and Uptime** feature in the **Observability** section of the Kibana feature privileges.
```

--------------------------------

### Example of allowed email domains

Source: https://www.elastic.co/guide/en/kibana/8.19/alert-action-settings-kb.html

A list of allowed email domains for the email connector. If this list is used, only emails with sender or recipient domains in this list will be allowed.

```yaml
xpack.actions.email.domain_allowlist:
  - "example.com"
  - "example.org"
```

--------------------------------

### Get array size

Source: https://www.elastic.co/guide/en/kibana/8.19/canvas-tinymath-functions.html

Returns the length of an array. Throws an error if the input is not an array.

```javascript
size([]) // returns 0
size([-1, -2, -3, -4]) // returns 4
size(100) // returns 1
```

--------------------------------

### Navigate to Kibana Directory

Source: https://www.elastic.co/guide/en/kibana/8.19/kibana-debugging.html

Command to enter the Kibana repository directory.

```bash
cd ../kibana
```

--------------------------------

### Get Task Manager Health

Source: https://www.elastic.co/guide/en/kibana/8.19/alerting-apis.html

Retrieves the health status of the Kibana Task Manager.

```APIDOC
## GET /api/tasks_api/health

### Description
Retrieves the health status of the Task Manager.

### Method
GET

### Endpoint
/api/tasks_api/health
```

--------------------------------

### Get Task Manager Health API

Source: https://www.elastic.co/guide/en/kibana/8.19/add-parameters-api.html

Retrieves the health status of the Task Manager.

```APIDOC
## Get Task Manager health

### Description
Retrieves the health status of the Task Manager.

### Method
GET

### Endpoint
/api/task_manager/health
```

--------------------------------

### Create HTTP Monitor

Source: https://www.elastic.co/guide/en/kibana/8.19/add-monitor-api.html

Use this to check a website's availability. Specify the URL and desired locations.

```json
POST /api/synthetics/monitors
{
  "type": "http",
  "name": "Website Availability",
  "url": "https://example.com",
  "tags": ["website", "availability"],
  "locations": ["united_kingdom"]
}
```

--------------------------------

### List Logstash Pipelines

Source: https://www.elastic.co/guide/en/kibana/8.19/logstash-configuration-management-api-list.html

This section provides an example of the API response when listing Logstash pipelines. The structure includes details about each pipeline such as its ID, description, last modification date, and optionally the username if security is enabled.

```APIDOC
## GET /pipelines

### Description
Retrieves a list of all configured Logstash pipelines.

### Method
GET

### Endpoint
/pipelines

### Response
#### Success Response (200)
- **pipelines** (array) - An array of pipeline objects.
  - **id** (string) - The unique identifier for the pipeline.
  - **description** (string) - A brief description of the pipeline.
  - **last_modified** (string) - The timestamp when the pipeline was last modified (ISO 8601 format).
  - **username** (string) - Optional. The username of the user who last modified the pipeline. This field appears only when security is enabled.

#### Response Example
```json
{
  "pipelines": [
    {
      "id": "hello-world",
      "description": "Just a simple pipeline",
      "last_modified": "2018-04-14T12:23:29.772Z",
      "username": "elastic"
    },
    {
      "id": "sleepy-pipeline",
      "description": "",
      "last_modified": "2018-03-24T03:41:30.554Z"
    }
  ]
}
```
```

--------------------------------

### Task Manager Health API

Source: https://www.elastic.co/guide/en/kibana/8.19/accessibility.html

Get the health status of the Kibana Task Manager.

```APIDOC
## Get Task Manager health

### Description
Retrieves the current health status of the Kibana Task Manager.

### Method
GET

### Endpoint
/api/tasks_kibana/health
```

--------------------------------

### Define a Data Removal Change

Source: https://www.elastic.co/guide/en/kibana/8.19/saved-objects-service.html

Example of a SavedObjectsModelDataRemovalChange used to remove data from all documents of a type.

```typescript
let change: SavedObjectsModelDataRemovalChange = {
  type: 'data_removal',
  attributePaths: ['someRootAttributes', 'some.nested.attribute'],
};
```

--------------------------------

### Import Elastic PGP Key for Debian Package

Source: https://www.elastic.co/guide/en/kibana/8.19/deb.html

This command downloads and installs the Elastic PGP public signing key. It is required to verify the authenticity of Kibana packages downloaded from Elastic's APT repository or website.

```bash
wget -qO - https://artifacts.elastic.co/GPG-KEY-elasticsearch | sudo gpg --dearmor -o /usr/share/keyrings/elasticsearch-keyring.gpg
```

--------------------------------

### Define a Data Backfill Change

Source: https://www.elastic.co/guide/en/kibana/8.19/saved-objects-service.html

Example of a SavedObjectsModelDataBackfillChange used to populate newly introduced fields.

```typescript
let change: SavedObjectsModelDataBackfillChange = {
  type: 'data_backfill',
  transform: (document) => {
    return { attributes: { someAddedField: 'defaultValue' } };
  },
};
```

--------------------------------

### Create Opsgenie Connector Configuration

Source: https://www.elastic.co/guide/en/kibana/8.19/pre-configured-connectors.html

Configure an Opsgenie connector with the API URL and an API key stored in the Kibana keystore.

```yaml
xpack.actions.preconfigured:
  my-opsgenie:
    name: preconfigured-opsgenie-connector-type
    actionTypeId: .opsgenie
    config:
      apiUrl: <OPSGENIE_URL> __
    secrets:
      apiKey: apikey __
```

--------------------------------

### Define a Mappings Deprecation Change

Source: https://www.elastic.co/guide/en/kibana/8.19/saved-objects-service.html

Example of a SavedObjectsModelMappingsDeprecationChange used to flag mappings as no longer used.

```typescript
let change: SavedObjectsModelMappingsDeprecationChange = {
  type: 'mappings_deprecation',
  deprecatedMappings: ['someDeprecatedField', 'someNested.deprecatedField'],
};
```

--------------------------------

### Update Case URL Example

Source: https://www.elastic.co/guide/en/kibana/8.19/cases-webhook-action-type.html

Construct the REST API URL to update a case by ID. Ensure the hostname is in `xpack.actions.allowedHosts` if used. The external system ID is added using the variable selector.

```url
<JIRA_URL>/rest/api/2/issue/{{{external.system.ID}}}
```

--------------------------------

### Switch Node.js Version with NVM

Source: https://www.elastic.co/guide/en/kibana/8.19/development-getting-started.html

Use this command to switch to the correct Node.js version specified in the .node-version file when using nvm.

```bash
nvm use
```

--------------------------------

### OpenAI API JSON Payload

Source: https://www.elastic.co/guide/en/kibana/8.19/openai-action-type.html

Example JSON structure for the OpenAI API request body.

```json
{
  "model": "gpt-3.5-turbo",
  "messages": [
    {
      "role": "user",
      "content": "Hello world"
    }
  ]
}
```

--------------------------------

### Configure automatic sizing for Vega visualizations

Source: https://www.elastic.co/guide/en/kibana/8.19/vega.html

Use these settings to make a visualization fill the available container space.

```json
autosize: {
  type: fit
  contains: padding
}
width: container
height: container
```

--------------------------------

### Server-side Plugin Entry Point (`server/index.ts`)

Source: https://www.elastic.co/guide/en/kibana/8.19/kibana-platform-plugin-api.html

The entry point for server-side plugin code. Similar to the client-side entry point, it exports a `plugin` function that initializes and returns the plugin instance.

```typescript
import type { PluginInitializerContext } from '@kbn/core/server';

export async function plugin(initializerContext: PluginInitializerContext) {
  const { MyPlugin } = await import('./plugin');
  return new MyPlugin(initializerContext);
}
```

--------------------------------

### GET api/task_manager/_health

Source: https://www.elastic.co/guide/en/kibana/8.19/task-manager-api-health.html

Retrieves the current health status and detailed statistics of the Kibana Task Manager.

```APIDOC
## GET api/task_manager/_health

### Description
Retrieves the health status of the Kibana Task Manager, including configuration, runtime, and workload metrics.

### Method
GET

### Endpoint
api/task_manager/_health

### Response
#### Success Response (200)
- **id** (string) - Unique identifier for the health check instance.
- **timestamp** (string) - ISO 8601 timestamp of the health check.
- **status** (string) - Overall health status (e.g., "OK").
- **last_update** (string) - Timestamp of the last update.
- **stats** (object) - Detailed statistics including configuration, runtime, and workload.

#### Response Example
{
  "id": "15415ecf-cdb0-4fef-950a-f824bd277fe4",
  "timestamp": "2021-02-16T11:38:10.077Z",
  "status": "OK",
  "last_update": "2021-02-16T11:38:09.934Z",
  "stats": {
    "configuration": { "status": "OK" },
    "runtime": { "status": "OK" },
    "workload": { "status": "OK" }
  }
}
```

--------------------------------

### Create xMatters connector with basic authentication

Source: https://www.elastic.co/guide/en/kibana/8.19/pre-configured-connectors.html

Use this configuration to create an xMatters connector using basic HTTP authentication. Ensure the password is stored in the Kibana keystore.

```yaml
xpack.actions.preconfigured:
  my-xmatters:
    name: preconfigured-xmatters-connector-type
    actionTypeId: .xmatters
    config:
      configUrl: <REQUEST_URL> __
      usesBasic: true __
    secrets:
      user: testuser __
      password: passwordkeystorevalue __
```

--------------------------------

### GET api/short_url/_slug/{slug}

Source: https://www.elastic.co/guide/en/kibana/8.19/short-urls-api-resolve.html

Retrieves the details of a short URL based on the provided slug identifier.

```APIDOC
## GET api/short_url/_slug/{slug}

### Description
Retrieves the short URL information associated with a specific slug ID.

### Method
GET

### Endpoint
api/short_url/_slug/{slug}

### Parameters
#### Path Parameters
- **slug** (string) - Required - The unique identifier for the short URL.

### Request Example
curl -X GET api/short_url/_slug/hello-world

### Response
#### Success Response (200)
- **id** (string) - The unique ID of the short URL.
- **slug** (string) - The slug identifier.
- **locator** (object) - The locator object containing id, version, and state.
- **accessCount** (integer) - The number of times the URL has been accessed.
- **accessDate** (long) - The timestamp of the last access.
- **createDate** (long) - The timestamp of when the URL was created.

#### Response Example
{
  "id": "12345",
  "slug": "hello-world",
  "locator": {
    "id": "LOCATOR_ID",
    "version": "x.x.x",
    "state": {}
  },
  "accessCount": 0,
  "accessDate": 1632680100000,
  "createDate": 1632680100000
}
```

--------------------------------

### Define Custom Host Settings for Mail and HTTPS

Source: https://www.elastic.co/guide/en/kibana/8.19/alert-action-settings-kb.html

Configure custom settings for mail and HTTPS servers to override global defaults. This example shows custom settings for an SMTP server with certificate data and an HTTPS server with verification disabled.

```yaml
xpack.actions.customHostSettings:
  - url: smtp://mail.example.com:465
    ssl:
      verificationMode: 'full'
      certificateAuthoritiesFiles: [ 'one.crt' ]
      certificateAuthoritiesData: |
          -----BEGIN CERTIFICATE-----
          MIIDTD...
          CwUAMD...
          ... multiple lines of certificate data ...
          -----END CERTIFICATE-----
    smtp:
      requireTLS: true
  - url: <WEBHOOK_URL>
    ssl:
      verificationMode: 'none'
```

--------------------------------

### GET /styles/{style}/sprite.png

Source: https://www.elastic.co/guide/en/kibana/8.19/maps-connect-to-ems.html

Retrieves a sprite image asset for a specific map style.

```APIDOC
## GET /styles/{style}/sprite.png

### Description
Retrieves a sprite image asset used for map styling.

### Method
GET

### Endpoint
https://tiles.maps.elastic.co/styles/{style}/sprite.png

### Parameters
#### Path Parameters
- **style** (string) - Required - The name of the map style (e.g., 'osm-bright-desaturated')

### Response
#### Success Response (200)
- **content-type** (string) - image/png
```

--------------------------------

### Client-side Plugin Entry Point (`public/index.ts`)

Source: https://www.elastic.co/guide/en/kibana/8.19/kibana-platform-plugin-api.html

The entry point for client-side plugin code. It must export a `plugin` function that receives core capabilities and returns an instance of the plugin class.

```typescript
import type { PluginInitializerContext } from '@kbn/core/server';
import { MyPlugin } from './plugin';

export function plugin(initializerContext: PluginInitializerContext) {
  return new MyPlugin(initializerContext);
}
```

--------------------------------

### Create Case JSON Payload Example

Source: https://www.elastic.co/guide/en/kibana/8.19/cases-webhook-action-type.html

Use this JSON payload to create a case in a third-party system. Include case data using Mustache template variables. Ensure the JSON is valid when Mustache variables are disregarded, as it's validated after variable substitution.

```json
{
	"fields": {
	  "summary": {{{case.title}}},
	  "description": {{{case.description}}},
	  "labels": {{{case.tags}}}
	}
}
```

--------------------------------

### GET /api/index_patterns/index_pattern/{id}

Source: https://www.elastic.co/guide/en/kibana/8.19/index-patterns-api-get.html

Retrieves the details of a specific index pattern object identified by its ID.

```APIDOC
## GET api/index_patterns/index_pattern/{id}

### Description
Retrieves the index pattern object associated with the provided ID.

### Method
GET

### Endpoint
api/index_patterns/index_pattern/{id}

### Parameters
#### Path Parameters
- **id** (string) - Required - The unique identifier of the index pattern.

### Request Example
curl -X GET api/index_patterns/index_pattern/my-pattern

### Response
#### Success Response (200)
- **index_pattern** (object) - The index pattern configuration object.

#### Response Example
{
    "index_pattern": {
        "id": "my-pattern",
        "version": "...",
        "title": "...",
        "type": "...",
        "timeFieldName": "...",
        "sourceFilters": [],
        "fields": {},
        "typeMeta": {},
        "fieldFormats": {},
        "fieldAttrs": {},
        "runtimeFieldMap": {},
        "allowNoIndex": "..."
    }
}
```

--------------------------------

### Enable SSL for development

Source: https://www.elastic.co/guide/en/kibana/8.19/running-kibana-advanced.html

Use the --ssl flag to utilize self-signed certificates for Kibana and Elasticsearch snapshot services.

```bash
yarn start --ssl
```

```bash
yarn es snapshot --ssl
```

--------------------------------

### GET /api/synthetics/private_locations/<id_or_label>

Source: https://www.elastic.co/guide/en/kibana/8.19/get-private-locations-api.html

Retrieves details for a specific private location using its ID or label.

```APIDOC
## GET /api/synthetics/private_locations/<location_id_or_label>

### Description
Returns a JSON object of a single private location based on the provided ID or label.

### Method
GET

### Endpoint
api/synthetics/private_locations/<location_id>

### Parameters
#### Path Parameters
- **location_id** (string) - Required - The unique identifier or label of the private location.

### Response
#### Success Response (200)
- **label** (string) - A label for the private location.
- **id** (string) - The unique identifier of the private location.
- **agentPolicyId** (string) - The ID of the agent policy associated with the private location.
- **isServiceManaged** (boolean) - Indicates if the location is service managed.
- **isInvalid** (boolean) - Indicates whether the location is invalid.
- **geo** (object) - Geographic coordinates (lat, lon).
- **namespace** (string) - The namespace of the location.

#### Response Example
{
    "label": "Test private location",
    "id": "test-private-location-id",
    "agentPolicyId": "test-private-location-id",
    "isServiceManaged": false,
    "isInvalid": false,
    "geo": {
        "lat": 0,
        "lon": 0
    },
    "namespace": "default"
}
```

--------------------------------

### GET Kibana Feature Privileges

Source: https://www.elastic.co/guide/en/kibana/8.19/features-api-get.html

Retrieves a list of Kibana features and their defined privilege structures.

```APIDOC
## GET /api/features

### Description
Retrieves the configuration and privilege definitions for Kibana features such as Discover, Visualize, Dashboard, and Dev Tools.

### Method
GET

### Response
#### Success Response (200)
- **id** (string) - The unique identifier for the feature.
- **name** (string) - The display name of the feature.
- **app** (array) - List of applications associated with the feature.
- **catalogue** (array) - List of catalogue entries for the feature.
- **privileges** (object) - The defined access levels (all/read) including savedObject, ui, and api permissions.
- **privilegesTooltip** (string) - Optional guidance regarding Elasticsearch cluster and index privileges.

#### Response Example
[
  {
    "id": "discover",
    "name": "Discover",
    "app": ["kibana"],
    "catalogue": ["discover"],
    "privileges": {
      "all": {
        "savedObject": {
          "all": ["search", "url"],
          "read": ["config", "index-pattern"]
        },
        "ui": ["show", "createShortUrl", "save"]
      },
      "read": {
        "savedObject": {
          "all": [],
          "read": ["config", "index-pattern", "search", "url"]
        },
        "ui": ["show"]
      }
    }
  }
]
```

--------------------------------

### Run Kibana with an alternate configuration file

Source: https://www.elastic.co/guide/en/kibana/8.19/running-kibana-advanced.html

Use the --config flag to point Kibana to a specific YML configuration file.

```bash
yarn start --config=config/my_config.yml
```

--------------------------------

### Access Current Query String

Source: https://www.elastic.co/guide/en/kibana/8.19/drilldowns.html

Get the current query string from the panel using `context.panel.query.query`.

```handlebars
{{context.panel.query.query}}
```

--------------------------------

### Configure Webhook Connector with Basic Auth

Source: https://www.elastic.co/guide/en/kibana/8.19/pre-configured-connectors.html

Configure a webhook connector for basic authentication. This requires the web service URL, method, and authentication credentials. Ensure the hostname is allowed if using `xpack.actions.allowedHosts`.

```yaml
xpack.actions.preconfigured:
  my-webhook:
    name: preconfigured-webhook-connector-type
    actionTypeId: .webhook
    config:
      url: <WEB_SERVICE_URL> __
      method: post __
      headers: __
        testheader: testvalue
      hasAuth: true __
    secrets:
      user: testuser __
      password: passwordkeystorevalue __
```

--------------------------------

### Get Task Manager Health API

Source: https://www.elastic.co/guide/en/kibana/8.19/beats-page.html

Retrieves the health status of the Kibana Task Manager.

```APIDOC
## Get Task Manager Health API

### Description
Retrieves the health status of the Kibana Task Manager.

### Method
GET

### Endpoint
/api/tasks_tool/health
```

--------------------------------

### Enable Chromium Proxy

Source: https://www.elastic.co/guide/en/kibana/8.19/reporting-settings-kb.html

Enables the proxy for Chromium. When true, `xpack.screenshotting.browser.chromium.proxy.server` must also be specified. Defaults to false.

```yaml
xpack.screenshotting.browser.chromium.proxy.enabled: true
```

--------------------------------

### FormatDate Template Usage

Source: https://www.elastic.co/guide/en/kibana/8.19/rule-action-variables.html

Demonstrates various ways to invoke the FormatDate lambda with optional time zone and format parameters.

```text
    {{#FormatDate}} {{{timestamp}}} {{/FormatDate}}
    {{#FormatDate}} {{{timestamp}}} ; UTC {{/FormatDate}}
    {{#FormatDate}} {{{timestamp}}} ; UTC; YYYY-MM-DD hh:mm {{/FormatDate}}
    {{#FormatDate}} {{{timestamp}}} ; ; YYYY-MM-DD hh:mm {{/FormatDate}}
```

--------------------------------

### Disable basepath in development mode

Source: https://www.elastic.co/guide/en/kibana/8.19/development-basepath.html

Use this command to start Kibana without a base path during development.

```bash
yarn start --no-base-path
```

--------------------------------

### Upgrade Assistant APIs

Source: https://www.elastic.co/guide/en/kibana/8.19/accessibility.html

Manage the upgrade process and check readiness.

```APIDOC
## Upgrade Assistant APIs

### Description
APIs to assist with upgrading Kibana and its components, including checking readiness and managing reindexing tasks.

### Endpoints
- GET /api/upgrade_assistant/readiness
- POST /api/upgrade_assistant/reindex/start
- POST /api/upgrade_assistant/reindex/batch/start
- GET /api/upgrade_assistant/reindex/batch/queue
- GET /api/upgrade_assistant/reindex/status/{id}
- DELETE /api/upgrade_assistant/reindex/{id}
```

--------------------------------

### Define a Mappings Addition Change

Source: https://www.elastic.co/guide/en/kibana/8.19/saved-objects-service.html

Example of a SavedObjectsModelMappingsAdditionChange used to define new mappings introduced in a version.

```typescript
const change: SavedObjectsModelMappingsAdditionChange = {
  type: 'mappings_addition',
  addedMappings: {
    newField: { type: 'text' },
    existingNestedField: {
      properties: {
        newNestedProp: { type: 'keyword' },
      },
    },
  },
};
```

--------------------------------

### Create TCP Monitor

Source: https://www.elastic.co/guide/en/kibana/8.19/add-monitor-api.html

Use this to monitor a server's availability over TCP. Requires host and private location.

```json
POST /api/synthetics/monitors
{
  "type": "tcp",
  "name": "Server Availability",
  "host": "example.com",
  "private_locations": ["my_private_location"]
}
```

--------------------------------

### Evaluate multiple conditions with sub-expressions

Source: https://www.elastic.co/guide/en/kibana/8.19/canvas-expressions-compose-functions-with-subexpressions.html

Demonstrates using the all function to evaluate multiple criteria against the price context.

```text
demodata
| image dataurl={
  if condition={getCell price | all {gte 100} {neq 105}}
    then={asset 3cb3ec3a-84d7-48fa-8709-274ad5cc9e0b}
    else={asset cbc11a1f-8f25-4163-94b4-2c3a060192e7}
}
```

--------------------------------

### Define Timelion Expressions

Source: https://www.elastic.co/guide/en/kibana/8.19/legacy-editors.html

Basic syntax examples for querying Elasticsearch data using the .es function.

```text
es(q=*)
```

```text
es(q=*, index=logstash-*)
```

--------------------------------

### Nested field document structure

Source: https://www.elastic.co/guide/en/kibana/8.19/kuery-query.html

Example document structure where the user field is defined as a nested field.

```json
{
  "user" : [
    {
      "first" : "John",
      "last" :  "Smith"
    },
    {
      "first" : "Alice",
      "last" :  "White"
    }
  ]
}
```

--------------------------------

### Identify push rejection error

Source: https://www.elastic.co/guide/en/kibana/8.19/development-github.html

Example of a non-fast-forward rejection message that occurs when a branch history has been modified.

```text
! [rejected] name-of-your-branch -> name-of-your-branch (non-fast-forward)
error: failed to push some refs to 'https://github.com/YourGitHubHandle/kibana.git'
hint: Updates were rejected because the tip of your current branch is behind
hint: its remote counterpart. Integrate the remote changes (e.g.
hint: 'git pull ...') before pushing again.
hint: See the 'Note about fast-forwards' in 'git push --help' for details.
```

--------------------------------

### Create Jira Connector Configuration

Source: https://www.elastic.co/guide/en/kibana/8.19/pre-configured-connectors.html

Configure a Jira connector with instance URL and project key. Secrets like email and API token should be stored in the Kibana keystore.

```yaml
xpack.actions.preconfigured:
  my-jira:
    name: preconfigured-jira-connector-type
    actionTypeId: .jira
    config:
      apiUrl: <JIRA_INSTANCE_URL> __
      projectKey: ES __
    secrets:
      email: testuser __
      apiToken: tokenkeystorevalue __
```

--------------------------------

### Create ServiceNow SecOps Connector with OAuth

Source: https://www.elastic.co/guide/en/kibana/8.19/pre-configured-connectors.html

Use this configuration to create a ServiceNow SecOps connector with OAuth authentication. Ensure `isOAuth` is set to `true` and provide necessary OAuth credentials.

```yaml
xpack.actions.preconfigured:
  my-servicenow:
    name: preconfigured-oauth-servicenow-connector-type
    actionTypeId: .servicenow-sir
    config:
      apiUrl: https://example.service-now.com/
      usesTableApi: false
      isOAuth: true __
      userIdentifierValue: testuser@email.com __
      clientId: abcdefghijklmnopqrstuvwxyzabcdef __
      jwtKeyId: fedcbazyxwvutsrqponmlkjihgfedcba __
    secrets:
      clientSecret: secretsecret __
      privateKey: |
        -----BEGIN RSA PRIVATE KEY-----
        MIIE...
        KAgD...
        ... multiple lines of key data ...
        -----END RSA PRIVATE KEY-----
```

--------------------------------

### Retrieve Rule Details

Source: https://www.elastic.co/guide/en/kibana/8.19/alerting-troubleshooting.html

Example JSON object returned by alerting APIs, highlighting the scheduled_task_id field.

```json
{
  "id":"ed30d1b0-7c9e-11ed-ba24-0b137d501cb7",
  "name":"cluster_health_rule",
  "consumer":"alerts",
  "enabled":true,
  ...
  "scheduled_task_id":"ed30d1b0-7c9e-11ed-ba24-0b137d501cb7",
  ...
  "next_run":"2022-12-15T17:56:55.713Z"
}
```

--------------------------------

### Configure Plugin Dependencies

Source: https://www.elastic.co/guide/en/kibana/8.19/sharing-saved-objects.html

Add the Spaces plugin as a dependency in your plugin's configuration files.

```json
...
"optionalPlugins": ["spaces"]
```

```json
...
"references": [
  ...
  { "path": "../spaces/tsconfig.json" },
]
```

--------------------------------

### Synthetics Parameters API Response

Source: https://www.elastic.co/guide/en/kibana/8.19/add-parameters-api.html

Example JSON responses returned by the API after successfully adding parameters.

```json
{
  "id": "unique-parameter-id",
  "key": "your-key-name",
  "value": "your-param-value",
  "description": "Param to use in browser monitor",
  "tags": ["authentication", "security"],
  "share_across_spaces": true
}
```

```json
[
  {
    "id": "param1-id",
    "key": "param1",
    "value": "value1"
  },
  {
    "id": "param2-id",
    "key": "param2",
    "value": "value2"
  }
]
```

--------------------------------

### GET /api/logstash/pipeline/{id}

Source: https://www.elastic.co/guide/en/kibana/8.19/logstash-configuration-management-api-retrieve.html

Retrieves a centrally-managed Logstash pipeline by its ID. This functionality is currently in technical preview.

```APIDOC
## GET /api/logstash/pipeline/<id>

### Description
Retrieves a centrally-managed Logstash pipeline.

### Method
GET

### Endpoint
/api/logstash/pipeline/<id>

### Parameters
#### Path Parameters
- **id** (string) - Required - The pipeline ID.

### Response
#### Success Response (200)
- **id** (string) - The pipeline ID.
- **description** (string) - A description of the pipeline.
- **username** (string) - The user who created or owns the pipeline.
- **pipeline** (string) - The pipeline configuration string.
- **settings** (object) - Configuration settings for the pipeline.

#### Response Example
{
  "id": "hello-world",
  "description": "Just a simple pipeline",
  "username": "elastic",
  "pipeline": "input { stdin {} } output { stdout {} }",
  "settings": {
    "queue.type": "persistent"
  }
}
```

--------------------------------

### Pattern Layout with Date Formatting

Source: https://www.elastic.co/guide/en/kibana/8.19/logging-configuration.html

Demonstrates various date formatting options available for the pattern layout, including ISO8601, absolute time, Unix timestamp, and timezone-specific formats.

```yaml
appender.layout.pattern: "%date{ISO8601}"
```

```yaml
appender.layout.pattern: "%date{ISO8601_TZ}"
```

```yaml
appender.layout.pattern: "%date{ISO8601_TZ}{America/Los_Angeles}"
```

```yaml
appender.layout.pattern: "%date{ABSOLUTE}"
```

```yaml
appender.layout.pattern: "%date{ABSOLUTE}{America/Los_Angeles}"
```

```yaml
appender.layout.pattern: "%date{UNIX}"
```

```yaml
appender.layout.pattern: "%date{UNIX_MILLIS}"
```

--------------------------------

### Create an index for connector testing

Source: https://www.elastic.co/guide/en/kibana/8.19/index-action-type.html

Defines the index settings and mappings required to store connector action data.

```json
PUT test
{
    "settings" : {
        "number_of_shards" : 1
    },
    "mappings" : {
        "properties" : {
            "rule_id" : { "type" : "text" },
            "rule_name" : { "type" : "text" },
            "alert_id" : { "type" : "text" },
            "context_message": { "type" : "text" }
        }
    }
}
```

--------------------------------

### GET api/index_patterns/default

Source: https://www.elastic.co/guide/en/kibana/8.19/index-patterns-api-default-get.html

Retrieves the ID of the default index pattern. If no default is set, the API returns null.

```APIDOC
## GET api/index_patterns/default

### Description
Retrieves the ID of the default index pattern configured in Kibana.

### Method
GET

### Endpoint
api/index_patterns/default

### Response
#### Success Response (200)
- **index_pattern_id** (string|null) - The ID of the default index pattern, or null if none is set.

#### Response Example
{
    "index_pattern_id": "my-index-pattern-id"
}
```

--------------------------------

### Access Saved Object ID

Source: https://www.elastic.co/guide/en/kibana/8.19/drilldowns.html

Get the ID of the saved object behind a panel using `context.panel.savedObjectId`.

```handlebars
{{context.panel.savedObjectId}}
```

--------------------------------

### GET /api/upgrade_assistant/reindex/batch/queue

Source: https://www.elastic.co/guide/en/kibana/8.19/batch-reindex-queue.html

Retrieves the current status of the reindex batch queue. Note that this API is considered experimental.

```APIDOC
## GET /api/upgrade_assistant/reindex/batch/queue

### Description
Check the current reindex batch queue status. This API is part of the Upgrade Assistant and is currently experimental.

### Method
GET

### Endpoint
/api/upgrade_assistant/reindex/batch/queue

### Response
#### Success Response (200)
- **status** (string) - Indicates a successful call.
```

--------------------------------

### Create an OpenAI Connector

Source: https://www.elastic.co/guide/en/kibana/8.19/pre-configured-connectors.html

Use this configuration to create an OpenAI connector. The `apiUrl` is the OpenAI request URL, and `apiProvider` specifies 'OpenAI' or 'Azure OpenAI'.

```yaml
xpack.actions.preconfigured:
  my-open-ai:
    name: preconfigured-openai-connector-type
    actionTypeId: .gen-ai
    config:
      apiUrl: <REQUEST_URL> __
      apiProvider: 'OpenAI' __
      defaultModel: gpt-4o __
    secrets:
      apiKey: superlongapikey __
```

--------------------------------

### Update local master branch

Source: https://www.elastic.co/guide/en/kibana/8.19/development-github.html

Ensure the local master branch is synchronized with the upstream repository before starting a rebase.

```bash
git checkout master
git fetch upstream
git rebase upstream/master
```

--------------------------------

### Create ServiceNow ITOM Connector with OAuth

Source: https://www.elastic.co/guide/en/kibana/8.19/pre-configured-connectors.html

Configure a ServiceNow ITOM connector using OAuth authentication. Includes client ID, secret, key ID, and a multiline RSA private key.

```yaml
xpack.actions.preconfigured:
  my-servicenow:
    name: preconfigured-oauth-servicenow-connector-type
    actionTypeId: .servicenow-itom
    config:
      apiUrl: https://example.service-now.com/
      isOAuth: true __
      userIdentifierValue: testuser@email.com __
      clientId: abcdefghijklmnopqrstuvwxyzabcdef __
      jwtKeyId: fedcbazyxwvutsrqponmlkjihgfedcba __
    secrets:
      clientSecret: secretsecret __
      privateKey: | __
        -----BEGIN RSA PRIVATE KEY-----
        MIIE...
        KAgD...
        ... multiple lines of key data ...
        -----END RSA PRIVATE KEY-----
```

--------------------------------

### Define an Unsafe Transform Change

Source: https://www.elastic.co/guide/en/kibana/8.19/saved-objects-service.html

Example of a SavedObjectsModelUnsafeTransformChange for executing arbitrary transformation functions on documents. Use with caution.

```typescript
let change: SavedObjectsModelUnsafeTransformChange = {
  type: 'unsafe_transform',
  transformFn: (document) => {
    document.attributes.someAddedField = 'defaultValue';
    return { document };
  },
};
```

--------------------------------

### Replace empty machine OS with 'None'

Source: https://www.elastic.co/guide/en/kibana/8.19/managing-data-views.html

Handle empty string values for a field. This script checks if 'machine.os.keyword' is an empty string and emits 'None' if it is, otherwise it emits the field's value.

```painless
def source = doc['machine.os.keyword'].value;
if (source != "") {
	emit(source);
}
else {
	emit("None");
}
```

--------------------------------

### Register and retrieve UI settings in server-side plugins

Source: https://www.elastic.co/guide/en/kibana/8.19/ui-settings-service.html

Use core.uiSettings.register to define settings with schemas, and access them via the request context.

```typescript
import { schema } from '@kbn/config-schema';
import type { CoreSetup,Plugin } from '@kbn/core/server';

export class MyPlugin implements Plugin {
  public setup(core: CoreSetup) {
    core.uiSettings.register({
      custom: {
        value: '42',
        schema: schema.string(),
      },
    });
    const router = core.http.createRouter();
    router.get({
      path: 'my_plugin/{id}',
      validate: …,
    },
    async (context, request, response) => {
      const customSetting = await context.uiSettings.client.get('custom');
      …
    });
  }
}
```

--------------------------------

### Get Short URL API

Source: https://www.elastic.co/guide/en/kibana/8.19/short-urls-api-get.html

Retrieve a single Kibana short URL by its ID. This functionality is in technical preview.

```APIDOC
## GET /api/short_url/{id}

### Description
Retrieve a single Kibana short URL by its ID.

### Method
GET

### Endpoint
`<kibana host>:<port>/api/short_url/{id}`

### Parameters
#### Path Parameters
- **id** (string) - Required - The ID of the short URL.

### Request Example
Retrieve the short URL with the `12345` ID:
```bash
curl -X GET api/short_url/12345
```

### Response
#### Success Response (200)
- **id** (string) - The ID of the short URL.
- **slug** (string) - The generated slug for the short URL.
- **locator** (object) - Information about the locator.
  - **id** (string) - The ID of the locator.
  - **version** (string) - The version of the locator.
  - **state** (object) - The state of the locator.
- **accessCount** (integer) - The number of times the short URL has been accessed.
- **accessDate** (integer) - The timestamp of the last access.
- **createDate** (integer) - The timestamp when the short URL was created.

#### Response Example
```json
{
  "id": "12345",
  "slug": "adjective-adjective-noun",
  "locator": {
    "id": "LOCATOR_ID",
    "version": "x.x.x",
    "state": {}
  },
  "accessCount": 0,
  "accessDate": 1632680100000,
  "createDate": 1632680100000
}
```
```

--------------------------------

### GET /api/synthetics/monitors

Source: https://www.elastic.co/guide/en/kibana/8.19/find-monitors-api.html

Retrieves a list of Synthetics monitors with support for various query parameters to filter and sort the results.

```APIDOC
## GET /api/synthetics/monitors

### Description
Retrieves a list of Synthetics monitors. You can filter and sort the results using the provided query parameters.

### Method
GET

### Endpoint
/api/synthetics/monitors

### Query Parameters
- **page** (integer) - Optional - Page number for paginated results.
- **perPage** (integer) - Optional - Number of items per page.
- **sortField** (string) - Optional - Field to sort the results by. Possible values: `name`, `createdAt`, `updatedAt`, `status`.
- **sortOrder** (string) - Optional - Sort order (`asc` or `desc`).
- **query** (string) - Optional - Free-text query string.
- **filter** (string) - Optional - Additional filtering criteria.
- **tags** (string or array) - Optional - Tags to filter monitors.
- **monitorTypes** (string or array) - Optional - Monitor types to filter (e.g., `http`, `tcp`, `icmp` or `browser`).
- **locations** (string or array) - Optional - Locations to filter by.
- **projects** (string or array) - Optional - Projects to filter by.
- **schedules** (string or array) - Optional - Schedules to filter by.
- **status** (string or array) - Optional - Status to filter by.

### Request Example
```
GET /api/synthetics/monitors?tags=prod&monitorTypes=http&locations=us-east-1&projects=project1&status=up
```

### Response
#### Success Response (200)
- **page** (integer) - The current page number.
- **total** (integer) - The total number of monitors matching the query.
- **monitors** (array) - An array of monitor objects.
  - **type** (string) - The type of the monitor.
  - **enabled** (boolean) - Whether the monitor is enabled.
  - **alert** (object) - Alerting configuration.
  - **schedule** (object) - Scheduling configuration.
  - **config_id** (string) - The configuration ID of the monitor.
  - **timeout** (string) - The timeout for the monitor check.
  - **name** (string) - The name of the monitor.
  - **locations** (array) - List of locations where the monitor runs.
  - **namespace** (string) - The namespace of the monitor.
  - **origin** (string) - The origin of the monitor (e.g., 'ui').
  - **id** (string) - The unique ID of the monitor.
  - **max_attempts** (integer) - Maximum number of attempts for the monitor check.
  - **wait** (string) - Wait time between attempts.
  - **revision** (integer) - The revision number of the monitor configuration.
  - **mode** (string) - The mode of the monitor (e.g., 'all').
  - **ipv4** (boolean) - Whether IPv4 is enabled.
  - **ipv6** (boolean) - Whether IPv6 is enabled.
  - **created_at** (string) - Timestamp when the monitor was created.
  - **updated_at** (string) - Timestamp when the monitor was last updated.
  - **host** (string) - The host being monitored.
- **absoluteTotal** (integer) - The absolute total number of monitors.
- **perPage** (integer) - The number of items per page.

#### Response Example
```json
{
    "page": 1,
    "total": 24,
    "monitors": [
        {
            "type": "icmp",
            "enabled": false,
            "alert": {
                "status": {
                    "enabled": true
                },
                "tls": {
                    "enabled": true
                }
            },
            "schedule": {
                "number": "3",
                "unit": "m"
            },
            "config_id": "e59142e5-1fe3-4aae-b0b0-19d6345e65a1",
            "timeout": "16",
            "name": "8.8.8.8:80",
            "locations": [
                {
                    "id": "us_central",
                    "label": "North America - US Central",
                    "geo": {
                        "lat": 41.25,
                        "lon": -95.86
                    },
                    "isServiceManaged": true
                }
            ],
            "namespace": "default",
            "origin": "ui",
            "id": "e59142e5-1fe3-4aae-b0b0-19d6345e65a1",
            "max_attempts": 2,
            "wait": "7",
            "revision": 3,
            "mode": "all",
            "ipv4": true,
            "ipv6": true,
            "created_at": "2023-11-07T09:57:04.152Z",
            "updated_at": "2023-12-04T19:19:34.039Z",
            "host": "8.8.8.8:80"
        }
    ],
    "absoluteTotal": 24,
    "perPage": 10
}
```
```

--------------------------------

### Access Row Field Names

Source: https://www.elastic.co/guide/en/kibana/8.19/drilldowns.html

Get an array of field names for each column in the clicked row using `event.keys`.

```handlebars
{{event.keys}}
```

--------------------------------

### kibana Function

Source: https://www.elastic.co/guide/en/kibana/8.19/canvas-function-reference.html

Gets the Kibana global context. This function is useful for accessing global Kibana settings or information.

```APIDOC
## `kibana`

### Description
Gets kibana global context

### Accepts
`kibana_context`, `null`

### Returns
`kibana_context`
```

--------------------------------

### Check reindex status API request

Source: https://www.elastic.co/guide/en/kibana/8.19/check-reindex-status.html

Use this GET request to retrieve the status of a specific reindex task.

```http
GET <kibana host>:<port>/api/upgrade_assistant/reindex/myIndex
```

--------------------------------

### Terms Aggregation Response

Source: https://www.elastic.co/guide/en/kibana/8.19/terms-join.html

Example response from a terms aggregation where the key property serves as the shared key for the right source.

```json
{
  aggregations: {
    join: {
      buckets: [
        {
          doc_count: 4,
          key: "SE",
          avg_of_bytes: {
            value: 3177.25
          }
        },
        ...
      ]
    }
  }
}
```

--------------------------------

### Combine multiple queries

Source: https://www.elastic.co/guide/en/kibana/8.19/kuery-query.html

Use AND/OR keywords and parentheses to group logic and define precedence.

```KQL
http.request.method: GET OR http.response.status_code: 400
```

```KQL
http.request.method: GET AND http.response.status_code: 400
```

```KQL
(http.request.method: GET AND http.response.status_code: 200) OR
(http.request.method: POST AND http.response.status_code: 400)
```

```KQL
http.request.method: (GET OR POST OR DELETE)
```

--------------------------------

### Define a Model Version with Multiple Mapping Additions

Source: https://www.elastic.co/guide/en/kibana/8.19/saved-objects-service.html

Example of a valid SavedObjectsModelVersion definition that includes multiple 'mappings_addition' changes.

```typescript
const version1: SavedObjectsModelVersion = {
  changes: [
    {
      type: 'mappings_addition',
      addedMappings: {
        someNewField: { type: 'text' },
      },
    },
    {
      type: 'mappings_addition',
      addedMappings: {
        anotherNewField: { type: 'text' },
      },
    },
  ],
};
```

--------------------------------

### Generate a new Kibana plugin

Source: https://www.elastic.co/guide/en/kibana/8.19/plugin-tooling.html

Run this command within the Kibana repository to initiate the interactive plugin generation process.

```bash
node scripts/generate_plugin
```

--------------------------------

### Nested field within a nested field document structure

Source: https://www.elastic.co/guide/en/kibana/8.19/kuery-query.html

Example document structure where both user and names are nested fields.

```json
{
  "user": [
    {
      "names": [
        {
          "first": "John",
          "last": "Smith"
        },
        {
          "first": "Alice",
          "last": "White"
        }
      ]
    }
  ]
}
```

--------------------------------

### Kibana Action Configuration Settings

Source: https://www.elastic.co/guide/en/kibana/8.19/alert-action-settings-kb.html

Documentation for configuring allowed hosts and custom host settings for Kibana actions.

```APIDOC
## Configuration Settings

### xpack.actions.allowedHosts
- **Description**: A list of hostnames that Kibana is allowed to connect to when built-in actions are triggered. Defaults to ["*"].
- **Type**: List of strings

### xpack.actions.customHostSettings
- **Description**: A list of custom host settings to override existing global settings for specific hosts.
- **Type**: List of objects

#### Properties
- **url** (string) - Required - The protocol, hostname, and port (e.g., https://webhook.example.com).
- **ssl.verificationMode** (string) - Optional - Controls certificate verification (full, certificate, none). Default: full.
- **ssl.certificateAuthoritiesFiles** (list) - Optional - PEM-encoded certificate files for validation.
- **ssl.certificateAuthoritiesData** (string) - Optional - Inline PEM-encoded certificate data.
- **smtp.requireTLS** (boolean) - Optional - Require TLS for SMTP connections.
- **smtp.ignoreTLS** (boolean) - Optional - Do not use TLS for SMTP connections.

### Configuration Example
```yaml
xpack.actions.customHostSettings:
  - url: smtp://mail.example.com:465
    ssl:
      verificationMode: 'full'
      certificateAuthoritiesFiles: [ 'one.crt' ]
    smtp:
      requireTLS: true
  - url: https://webhook.example.com
    ssl:
      verificationMode: 'none'
```
```

--------------------------------

### Configure OIDC and basic authentication

Source: https://www.elastic.co/guide/en/kibana/8.19/kibana-authentication.html

Enable both OIDC and basic authentication to allow administrative access for accounts not linked to the SSO database.

```yaml
xpack.security.authc.providers:
  oidc.oidc1:
    order: 0
    realm: oidc1
    description: "Log in with Elastic"
  basic.basic1:
    order: 1
```

--------------------------------

### Profile Kibana Plugin Bundle Size

Source: https://www.elastic.co/guide/en/kibana/8.19/plugin-performance.html

Command to build Kibana platform plugins with profiling enabled to analyze the size of plugin artifacts. Use the --focus flag to profile a specific plugin.

```bash
node scripts/build_kibana_platform_plugins.js --dist --profile --focus=my_plugin
```

--------------------------------

### Running Jest Tests with Custom Configuration

Source: https://www.elastic.co/guide/en/kibana/8.19/development-tests.html

When working on a specific plugin or package, you can improve efficiency by providing a custom Jest configuration file. This is done using the `--config` flag with the `yarn jest` command.

```bash
yarn jest --config src/platform/plugins/shared/discover/jest.config.js
```

--------------------------------

### Create Slack Connector with Webhook

Source: https://www.elastic.co/guide/en/kibana/8.19/pre-configured-connectors.html

This configuration creates a Slack connector using a webhook URL. Replace `<SLACK_WEBHOOK_URL>` with your actual webhook URL.

```yaml
xpack.actions.preconfigured:
  my-slack:
    name: preconfigured-slack-webhook-connector-type
    actionTypeId: .slack
    secrets:
      webhookUrl: '<SLACK_WEBHOOK_URL>' __
```

--------------------------------

### Accessing Exposed Configuration on Client-Side

Source: https://www.elastic.co/guide/en/kibana/8.19/configuration-service.html

Retrieves configuration properties exposed to the browser within the plugin's setup lifecycle.

```typescript
interface ClientConfigType {
  uiProp: string;
}

export class MyPlugin implements Plugin<PluginSetup, PluginStart> {
  constructor(private readonly initializerContext: PluginInitializerContext) {}

  public async setup(core: CoreSetup, deps: {}) {
    const config = this.initializerContext.config.get<ClientConfigType>();
  }
```

--------------------------------

### Upgrade Assistant APIs

Source: https://www.elastic.co/guide/en/kibana/8.19/batch-start-resume-reindex.html

APIs for managing the upgrade process and checking upgrade readiness.

```APIDOC
## Upgrade Assistant APIs

### Description
APIs for managing upgrade assistant functionalities.

### Upgrade Readiness Status

#### Method
GET

#### Endpoint
/api/upgrade_assistant/readiness

### Start or Resume Reindex

#### Method
POST

#### Endpoint
/api/upgrade_assistant/reindex/start

### Batch Start or Resume Reindex

#### Method
POST

#### Endpoint
/api/upgrade_assistant/reindex/batch_start

### Batch Reindex Queue

#### Method
GET

#### Endpoint
/api/upgrade_assistant/reindex/queue

### Check Reindex Status

#### Method
GET

#### Endpoint
/api/upgrade_assistant/reindex/status/{task_id}

### Cancel Reindex

#### Method
POST

#### Endpoint
/api/upgrade_assistant/reindex/cancel/{task_id}
```

--------------------------------

### GET /api/index_patterns/index_pattern/{id}/runtime_field/{name}

Source: https://www.elastic.co/guide/en/kibana/8.19/index-patterns-runtime-field-api-get.html

Retrieves a specific runtime field by its name from a given index pattern ID.

```APIDOC
## GET /api/index_patterns/index_pattern/{id}/runtime_field/{name}

### Description
Retrieve a runtime field named `foo` of index pattern with the `my-pattern` ID.

### Method
GET

### Endpoint
`/api/index_patterns/index_pattern/{id}/runtime_field/{name}`

### Path Parameters
- **id** (string) - Required - The ID of the index pattern.
- **name** (string) - Required - The name of the runtime field to retrieve.

### Request Example
```bash
curl -X GET api/index_patterns/index_pattern/my-pattern/runtime_field/foo
```

### Response
#### Success Response (200)
- **field** (object) - Contains field definition details.
- **runtimeField** (object) - Contains the runtime field definition.

#### Response Example
```json
{
    "field": {
        ...
    },
    "runtimeField": {
        ...
    }
}
```
```

--------------------------------

### Retrieve a single parameter by ID

Source: https://www.elastic.co/guide/en/kibana/8.19/get-parameters-api.html

Use this GET request to fetch details for a specific parameter using its unique identifier.

```http
GET /api/synthetics/params/unique-parameter-id
```

--------------------------------

### Pattern Layout with Highlight Option

Source: https://www.elastic.co/guide/en/kibana/8.19/logging-configuration.html

Illustrates the use of the 'highlight' option in the pattern layout for colorizing log messages, which is beneficial for terminal output.

```yaml
appender.layout.highlight: true
```

--------------------------------

### Identify routing allocation errors

Source: https://www.elastic.co/guide/en/kibana/8.19/resolve-migrations-failures.html

Example log error message indicating that cluster routing allocation settings are preventing migrations.

```text
Unable to complete saved object migrations for the [.kibana] index: [incompatible_cluster_routing_allocation] The elasticsearch cluster has cluster routing allocation incorrectly set for migrations to continue. To proceed, please remove the cluster routing allocation settings with PUT /_cluster/settings {"transient": {"cluster.routing.allocation.enable": null}, "persistent": {"cluster.routing.allocation.enable": null}}
```

--------------------------------

### Perform partial update of Uptime settings

Source: https://www.elastic.co/guide/en/kibana/8.19/update-settings-api.html

Update specific settings keys while merging with existing configurations.

```json
PUT api/uptime/settings
{
    "heartbeatIndices": "heartbeat-8*",
}
```

```json
{
    "heartbeatIndices": "heartbeat-8*",
    "certExpirationThreshold": 30,
    "certAgeThreshold": 730,
    "defaultConnectors": [
        "08990f40-09c5-11ee-97ae-912b222b13d4",
        "db25f830-2318-11ee-9391-6b0c030836d6"
    ],
    "defaultEmail": {
        "to": [],
        "cc": [],
        "bcc": []
    }
}
```

--------------------------------

### Generate Kibana Enrollment Token

Source: https://www.elastic.co/guide/en/kibana/8.19/rpm.html

Use this command to create an enrollment token for Kibana to securely connect with Elasticsearch.

```bash
bin/elasticsearch-create-enrollment-token -s kibana

```

--------------------------------

### Example ECS JSON log entry

Source: https://www.elastic.co/guide/en/kibana/8.19/kibana-troubleshooting-kibana-server-logs.html

A sample log entry in ECS JSON format containing trace and transaction identifiers.

```json
{
  "message":"POST /internal/telemetry/clusters/_stats 200 1014ms - 43.2KB",
  "log":{"level":"DEBUG","logger":"http.server.response"},
  "trace":{"id":"9b99131a6f66587971ef085ef97dfd07"},
  "transaction":{"id":"d0c5bbf14f5febca"
}
```

--------------------------------

### Run the diagnostic tool script

Source: https://www.elastic.co/guide/en/kibana/8.19/kibana-diagnostic.html

Execute the diagnostic script using the recommended flags for local Kibana instances.

```bash
sudo ./diagnostics.sh --type kibana-local --host localhost --port 5601 -u elastic -p --bypassDiagVerify --ssl --noVerify
```

```batch
sudo .\diagnostics.bat --type kibana-local --host localhost --port 5601 -u elastic -p --bypassDiagVerify --ssl --noVerify
```

--------------------------------

### Test File Anatomy

Source: https://www.elastic.co/guide/en/kibana/8.19/development-tests.html

An example of a typical Kibana functional test file, demonstrating the structure, service loading, and test definitions.

```APIDOC
## Test File Anatomy

### Description
This annotated example file shows the basic structure every test suite uses. It starts by importing `@kbn/expect` and defining its default export: an anonymous Test Provider. The test provider then destructures the Provider API for the `getService()` and `getPageObjects()` functions. It uses these functions to collect the dependencies of this suite. The rest of the test file will look pretty normal to mocha.js users. `describe()`, `it()`, `before()` and the lot are used to define suites that happen to automate a browser via services and objects of type `PageObject`.

### Method
N/A (This is a code example)

### Endpoint
N/A

### Parameters
N/A

### Request Example
```javascript
import expect from '@kbn/expect';
// test files must `export default` a function that defines a test suite
export default function ({ getService, getPageObject }) {

  // most test files will start off by loading some services
  const retry = getService('retry');
  const testSubjects = getService('testSubjects');
  const esArchiver = getService('esArchiver');
  const kibanaServer = getService('kibanaServer');

  // for historical reasons, PageObjects are loaded in a single API call
  // and returned on an object with a key/value for each requested PageObject
  const PageObjects = getPageObjects(['common', 'visualize']);

  // every file must define a top-level suite before defining hooks/tests
  describe('My Test Suite', () => {

    // most suites start with a before hook that navigates to a specific
    // app/page and restores some archives into {es} with esArchiver
    before(async () => {
      await Promise.all([
        // start by clearing Saved Objects from the .kibana index
        await kibanaServer.savedObjects.cleanStandardList();
        // load some basic log data only if the index doesn't exist
        esArchiver.loadIfNeeded('src/platform/test/functional/fixtures/es_archiver/makelogs')
      ]);
      // go to the page described by `apps.visualize` in the config
      await PageObjects.common.navigateTo('visualize');
    });

    // right after the before() hook definition, add the teardown steps
    // that will tidy up {es} for other test suites
    after(async () => {
      // we clear Kibana Saved Objects but not the makelogs
      // archive because we don't make any changes to it, and subsequent
      // suites could use it if they call `.loadIfNeeded()`.
      await kibanaServer.savedObjects.cleanStandardList();
    });

    // This series of tests illustrate how tests generally verify
    // one step of a larger process and then move on to the next in
    // a new test, each step building on top of the previous
    it('Vis Listing Page is empty');
    it('Create a new vis');
    it('Shows new vis in listing page');
    it('Opens the saved vis');
    it('Respects time filter changes');
    it(...);
  });

}
```

### Response
N/A
```

--------------------------------

### Create xMatters connector with URL authentication

Source: https://www.elastic.co/guide/en/kibana/8.19/pre-configured-connectors.html

Configure an xMatters connector using URL authentication, where the API key is included in the request URL. Set `usesBasic` to `false` for this method.

```yaml
xpack.actions.preconfigured:
  my-xmatters:
    name: preconfigured-xmatters-connector-type
    actionTypeId: .xmatters
    config:
      usesBasic: false __
    secrets:
      secretsUrl: <SECRETS_URL> __
```

--------------------------------

### Response Example for Bulk Parameter Deletion

Source: https://www.elastic.co/guide/en/kibana/8.19/delete-parameters-api.html

The response returns an array of objects indicating the deletion status for each requested parameter ID.

```json
[
  {
    "id": "param1-id",
    "deleted": true
  }
]
```

--------------------------------

### Response for list of parameters

Source: https://www.elastic.co/guide/en/kibana/8.19/get-parameters-api.html

JSON array response containing multiple parameters, with additional fields included for users with write permissions.

```json
[
  {
    "id": "param1-id",
    "key": "param1",
    "description": "Description for param1",
    "tags": ["tag1", "tag2"],
    "namespaces": ["namespace1"]
  },
  {
    "id": "param2-id",
    "key": "param2",
    "description": "Description for param2",
    "tags": ["tag3"],
    "namespaces": ["namespace2"]
  }
]
```

```json
[
  {
    "id": "param1-id",
    "key": "param1",
    "description": "Description for param1",
    "tags": ["tag1", "tag2"],
    "namespaces": ["namespace1"],
    "value": "value1"
  },
  {
    "id": "param2-id",
    "key": "param2",
    "description": "Description for param2",
    "tags": ["tag3"],
    "namespaces": ["namespace2"],
    "value": "value2"
  }
]
```

--------------------------------

### Amazon Bedrock Invoke Model API Payload

Source: https://www.elastic.co/guide/en/kibana/8.19/bedrock-action-type.html

Example of a stringified JSON payload for the Amazon Bedrock Invoke Model API.

```javascript
{
  body: JSON.stringify({
        prompt: `${combinedMessages} \n\nAssistant:`,
        max_tokens_to_sample: 300,
        stop_sequences: ['\n\nHuman:']
  })
}
```

--------------------------------

### GET /api/index_patterns/index_pattern/<id>

Source: https://www.elastic.co/guide/en/kibana/8.19/index-patterns-api-get.html

Retrieves a single Kibana index pattern by its unique identifier. This endpoint is deprecated since version 8.0.0.

```APIDOC
## GET /api/index_patterns/index_pattern/<id>

### Description
Retrieve a single Kibana index pattern by ID. This API is deprecated in 8.0.0; use the data views API instead.

### Method
GET

### Endpoint
`GET <kibana host>:<port>/api/index_patterns/index_pattern/<id>`
`GET <kibana host>:<port>/s/<space_id>/api/index_patterns/index_pattern/<id>`

### Parameters
#### Path Parameters
- **space_id** (string) - Optional - An identifier for the space. If not provided, the default space is used.
- **id** (string) - Required - The ID of the index pattern you want to retrieve.

### Response
#### Success Response (200)
- **200** - Indicates a successful call.

#### Error Response (404)
- **404** - The specified index pattern and ID doesn’t exist.
```

--------------------------------

### Using aliases and unnamed arguments in mapColumn

Source: https://www.elastic.co/guide/en/kibana/8.19/canvas-aliases-and-unnamed-arguments.html

Demonstrates equivalent ways to call the mapColumn function using canonical names, aliases, and the unnamed argument syntax.

```text
mapColumn name=newColumn fn={string example}
```

```text
mapColumn name=newColumn expression={string example}
```

```text
mapColumn newColumn fn={string example}
```

--------------------------------

### GET /api/features

Source: https://www.elastic.co/guide/en/kibana/8.19/features-api-get.html

Retrieves a list of all Kibana features. This endpoint is used to identify features that can be managed via spaces and security settings.

```APIDOC
## GET /api/features

### Description
Retrieves all Kibana features. Features are used by spaces and security to refine and secure access to Kibana.

### Method
GET

### Endpoint
/api/features

### Response
#### Success Response (200)
- Indicates a successful call.
```

--------------------------------

### Run Kibana Optimizer with Profiling

Source: https://www.elastic.co/guide/en/kibana/8.19/ci-metrics.html

Use this command to generate webpack stats.json files for a specific plugin, which helps in identifying the cause of bundle size overages.

```bash
node scripts/build_kibana_platform_plugins --focus {pluginid} --profile
```

--------------------------------

### LXD Instance Configuration Fields

Source: https://www.elastic.co/guide/en/kibana/8.19/exported-fields-osquery.html

Fields related to LXD instance configuration, including parameter names.

```APIDOC
## GET /api/fields/lxd_instance_config

### Description
Retrieves configuration parameters for LXD instances, including the parameter names.

### Method
GET

### Endpoint
/api/fields/lxd_instance_config

### Query Parameters
- **_lxd_instance_config.key_** (text.text) - Optional - Configuration parameter name.

### Response
#### Success Response (200)
- **_lxd_instance_config.key_** (text.text) - The name of the LXD instance configuration parameter.

#### Response Example
{
  "_lxd_instance_config.key_": "limits.cpu"
}
```

--------------------------------

### Get Array Length

Source: https://www.elastic.co/guide/en/kibana/8.19/canvas-tinymath-functions.html

Use count to determine the number of elements in an array. This function is an alias for size and requires an array input.

```javascript
count([]) // returns 0
count([-1, -2, -3, -4]) // returns 4
count(100) // returns 1
```