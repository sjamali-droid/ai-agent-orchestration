# Mermaid (Diagram-as-Code)

> **Used by**: Architect
> **What to paste**: flowchart syntax, sequence diagram syntax, C4 diagram syntax (C4Context, C4Container, C4Component), class diagram syntax, entity relationship diagram syntax, theme/config options.
> **Source**: https://mermaid.js.org/intro/

<!-- PASTE CONTEXT BELOW THIS LINE -->


# Mermaid.js

Mermaid is a JavaScript-based diagramming and charting library that uses Markdown-inspired text definitions to create and render diagrams dynamically. It enables developers and documentation writers to generate flowcharts, sequence diagrams, class diagrams, state diagrams, Gantt charts, pie charts, ER diagrams, git graphs, mindmaps, and many more diagram types from simple text syntax. The library processes diagram definitions and renders them as SVG graphics in the browser.

The core functionality revolves around parsing text-based diagram definitions and rendering them into interactive SVG elements. Mermaid can be used via CDN for quick web page integration, as an npm package for Node.js applications, or through numerous plugins for documentation tools, IDEs, and content management systems. The library supports extensive theming and configuration options, accessibility features, and secure rendering modes for untrusted content.

## Core API - mermaid.initialize()

Configures Mermaid with initial settings before rendering diagrams. This function should be called once before any rendering operations to set global configuration options like theme, security level, and diagram-specific settings.

```javascript
import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';

// Basic initialization with common options
mermaid.initialize({
  startOnLoad: true,           // Auto-render diagrams on page load
  theme: 'default',            // Options: 'default', 'forest', 'dark', 'neutral', 'base'
  securityLevel: 'strict',     // Options: 'strict', 'loose', 'sandbox'
  logLevel: 'error',           // Options: 'debug', 'info', 'warn', 'error', 'fatal'
  fontFamily: 'arial',
  flowchart: {
    htmlLabels: true,
    curve: 'basis'
  },
  sequence: {
    diagramMarginX: 50,
    diagramMarginY: 10,
    actorMargin: 50,
    width: 150,
    height: 65
  },
  gantt: {
    titleTopMargin: 25,
    barHeight: 20,
    barGap: 4
  }
});

// Diagrams in elements with class="mermaid" will auto-render
```

## Core API - mermaid.render()

Renders a diagram from text definition to SVG. Returns a promise with the SVG code and optional bind functions for interactive elements. This is the primary programmatic rendering method.

```javascript
import mermaid from 'mermaid';

// Initialize mermaid first
mermaid.initialize({ startOnLoad: false });

// Render a diagram programmatically
async function renderDiagram() {
  const graphDefinition = `
    flowchart LR
      A[Start] --> B{Decision}
      B -->|Yes| C[Action 1]
      B -->|No| D[Action 2]
      C --> E[End]
      D --> E
  `;

  try {
    // render(id, text, container?) returns { svg, bindFunctions, diagramType }
    const { svg, bindFunctions } = await mermaid.render('myDiagram', graphDefinition);

    // Insert the SVG into the DOM
    const container = document.getElementById('diagram-container');
    container.innerHTML = svg;

    // Bind interactive functions (for click events, etc.)
    if (bindFunctions) {
      bindFunctions(container);
    }
  } catch (error) {
    console.error('Diagram rendering failed:', error);
  }
}

renderDiagram();
```

## Core API - mermaid.parse()

Validates diagram syntax without rendering. Useful for checking diagram definitions before rendering or for building editor integrations with syntax validation.

```javascript
import mermaid from 'mermaid';

mermaid.initialize({ startOnLoad: false });

async function validateDiagram(diagramText) {
  // With suppressErrors: true, returns false instead of throwing
  const result = await mermaid.parse(diagramText, { suppressErrors: true });

  if (result) {
    console.log('Valid diagram, type:', result.diagramType);
    // result.config contains any frontmatter config from the diagram
    return true;
  } else {
    console.log('Invalid diagram syntax');
    return false;
  }
}

// Example usage
validateDiagram('flowchart LR\n  A --> B');  // Valid - returns { diagramType: 'flowchart-v2' }
validateDiagram('invalid syntax here');       // Invalid - returns false

// Without suppressErrors, throws on invalid syntax
try {
  await mermaid.parse('bad diagram');
} catch (error) {
  console.error('Parse error:', error.message);
}
```

## Core API - mermaid.run()

Finds and renders all diagrams in the DOM. By default, looks for elements with the `mermaid` class, but can be configured to target specific elements or custom selectors.

```javascript
import mermaid from 'mermaid';

mermaid.initialize({ startOnLoad: false });

// Run with default selector (.mermaid)
await mermaid.run();

// Run with custom selector
await mermaid.run({ querySelector: '.my-diagram' });

// Run on specific nodes
const nodes = document.querySelectorAll('.custom-mermaid');
await mermaid.run({ nodes: nodes });

// Run with callback after each diagram renders
await mermaid.run({
  querySelector: '.mermaid',
  postRenderCallback: (id) => {
    console.log(`Rendered diagram: ${id}`);
  }
});

// Suppress errors instead of throwing
await mermaid.run({
  querySelector: '.mermaid',
  suppressErrors: true
});
```

## Flowchart Diagram

Flowcharts represent processes with nodes and directional edges. Support multiple node shapes, edge styles, and subgraphs for organizing complex flows.

```html
<pre class="mermaid">
flowchart TD
    A[Start Process] --> B{Is Valid?}
    B -->|Yes| C[Process Data]
    B -->|No| D[Show Error]
    C --> E[(Database)]
    E --> F[Generate Report]
    D --> G[Log Error]
    F --> H((End))
    G --> H

    subgraph Processing
        C
        E
        F
    end

    subgraph ErrorHandling
        D
        G
    end

    %% Styling
    style A fill:#f9f,stroke:#333
    style H fill:#bbf,stroke:#333
    classDef errorStyle fill:#f66,stroke:#900
    class D,G errorStyle
</pre>
```

```
flowchart LR
    %% Node shapes
    A[Rectangle] --> B(Rounded)
    B --> C([Stadium])
    C --> D[[Subroutine]]
    D --> E[(Database)]
    E --> F((Circle))
    F --> G>Flag]
    G --> H{Diamond}
    H --> I{{Hexagon}}
    I --> J[/Parallelogram/]
    J --> K[\Trapezoid/]
```

## Sequence Diagram

Sequence diagrams show interactions between participants over time. Support messages, activations, notes, loops, alternatives, and various participant types.

```html
<pre class="mermaid">
sequenceDiagram
    autonumber
    participant Client
    participant API as API Server
    participant DB as Database

    Client->>+API: POST /login
    API->>API: Validate credentials
    API->>+DB: Query user
    DB-->>-API: User data

    alt Valid credentials
        API->>API: Generate JWT
        API-->>Client: 200 OK + Token
    else Invalid credentials
        API-->>Client: 401 Unauthorized
    end

    Note over Client,API: Subsequent authenticated requests

    loop Every API call
        Client->>+API: Request + JWT
        API->>API: Verify token
        API-->>-Client: Response
    end

    Client->>+API: POST /logout
    API-->>-Client: 200 OK
</pre>
```

## Class Diagram

Class diagrams represent object-oriented structures with classes, attributes, methods, and relationships including inheritance, composition, and associations.

```html
<pre class="mermaid">
classDiagram
    class Animal {
        +String name
        +int age
        +makeSound() void
        +move() void
    }

    class Dog {
        +String breed
        +bark() void
        +fetch() void
    }

    class Cat {
        +bool isIndoor
        +meow() void
        +scratch() void
    }

    class Shelter {
        -List~Animal~ animals
        +addAnimal(Animal a) void
        +adoptAnimal(int id) Animal
        +getCount() int
    }

    Animal <|-- Dog : extends
    Animal <|-- Cat : extends
    Shelter "1" o-- "*" Animal : houses

    note for Animal "Base class for all animals"
</pre>
```

## State Diagram

State diagrams model finite state machines showing states, transitions, and state hierarchy with composite states and concurrent regions.

```html
<pre class="mermaid">
stateDiagram-v2
    [*] --> Idle

    Idle --> Processing : submit
    Processing --> Success : complete
    Processing --> Failed : error
    Success --> [*]
    Failed --> Idle : retry
    Failed --> [*] : cancel

    state Processing {
        [*] --> Validating
        Validating --> Executing : valid
        Validating --> [*] : invalid
        Executing --> [*]
    }

    state "Error Handling" as Failed {
        [*] --> LogError
        LogError --> NotifyUser
        NotifyUser --> [*]
    }

    note right of Idle : Waiting for user input
    note left of Processing : May take several seconds
</pre>
```

## Gantt Chart

Gantt charts visualize project schedules with tasks, durations, dependencies, milestones, and sections. Support date formats, exclusions, and critical paths.

```html
<pre class="mermaid">
gantt
    title Project Development Timeline
    dateFormat YYYY-MM-DD
    excludes weekends

    section Planning
    Requirements gathering    :done, req, 2024-01-01, 7d
    Technical design         :done, design, after req, 5d
    Architecture review      :milestone, m1, after design, 0d

    section Development
    Backend API             :active, api, after design, 14d
    Frontend UI             :ui, after design, 14d
    Database setup          :crit, db, after design, 7d
    Integration             :integ, after api, 5d

    section Testing
    Unit tests              :test1, after api, 7d
    Integration tests       :test2, after integ, 5d
    UAT                     :crit, uat, after test2, 5d

    section Deployment
    Staging deployment      :stage, after uat, 2d
    Production release      :milestone, release, after stage, 0d
</pre>
```

## Entity Relationship Diagram

ER diagrams model database schemas with entities, attributes, and relationships using crow's foot notation for cardinality.

```html
<pre class="mermaid">
erDiagram
    CUSTOMER ||--o{ ORDER : places
    CUSTOMER {
        int id PK
        string name
        string email UK
        date created_at
    }

    ORDER ||--|{ ORDER_ITEM : contains
    ORDER {
        int id PK
        int customer_id FK
        date order_date
        string status
        decimal total
    }

    ORDER_ITEM }|--|| PRODUCT : includes
    ORDER_ITEM {
        int id PK
        int order_id FK
        int product_id FK
        int quantity
        decimal unit_price
    }

    PRODUCT {
        int id PK
        string name
        string description
        decimal price
        int stock_quantity
    }

    PRODUCT }o--o{ CATEGORY : belongs_to
    CATEGORY {
        int id PK
        string name
        string description
    }
</pre>
```

## Pie Chart

Pie charts display proportional data with labeled slices. Support titles and optional data value display.

```html
<pre class="mermaid">
pie showData
    title Browser Market Share 2024
    "Chrome" : 65.12
    "Safari" : 18.78
    "Firefox" : 7.65
    "Edge" : 5.24
    "Other" : 3.21
</pre>
```

## Git Graph

Git graphs visualize branching strategies with commits, branches, merges, and cherry-picks for illustrating git workflows.

```html
<pre class="mermaid">
gitGraph
    commit id: "Initial"
    commit id: "Add README"

    branch develop
    checkout develop
    commit id: "Setup project"
    commit id: "Add core features"

    branch feature/auth
    checkout feature/auth
    commit id: "Add login"
    commit id: "Add logout"

    checkout develop
    merge feature/auth id: "Merge auth" tag: "v0.1.0"

    checkout main
    merge develop id: "Release" type: HIGHLIGHT

    checkout develop
    commit id: "Bug fixes"

    checkout main
    cherry-pick id: "Bug fixes"
</pre>
```

## Mindmap

Mindmaps organize hierarchical information radiating from a central concept with various node shapes and icons.

```html
<pre class="mermaid">
mindmap
  root((Web Development))
    Frontend
      HTML
      CSS
        Flexbox
        Grid
      JavaScript
        React
        Vue
        Angular
    Backend
      Node.js
      Python
      Java
    Database
      SQL
        PostgreSQL
        MySQL
      NoSQL
        MongoDB
        Redis
    DevOps
      Docker
      Kubernetes
      CI/CD
</pre>
```

## HTML Integration - CDN

The simplest way to use Mermaid is via CDN, requiring only a script import and diagram definitions in HTML elements.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Mermaid Diagrams</title>
</head>
<body>
  <h1>System Architecture</h1>

  <pre class="mermaid">
  flowchart TB
    subgraph Frontend
      A[React App] --> B[Redux Store]
    end

    subgraph Backend
      C[Express API] --> D[(PostgreSQL)]
      C --> E[(Redis Cache)]
    end

    A -->|REST API| C
  </pre>

  <h2>User Flow</h2>

  <pre class="mermaid">
  sequenceDiagram
    User->>App: Open application
    App->>API: Fetch data
    API-->>App: Return data
    App-->>User: Display content
  </pre>

  <script type="module">
    import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';
    mermaid.initialize({
      startOnLoad: true,
      theme: 'default',
      securityLevel: 'loose'
    });
  </script>
</body>
</html>
```

## Node.js / NPM Integration

Install Mermaid as an npm dependency for use in Node.js applications, bundlers, and modern JavaScript frameworks.

```javascript
// Install: npm install mermaid

import mermaid from 'mermaid';

// Configure mermaid for your application
mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  themeVariables: {
    primaryColor: '#4a90d9',
    primaryTextColor: '#fff',
    primaryBorderColor: '#2d5986',
    lineColor: '#5c8dc4',
    secondaryColor: '#3d7ab8',
    tertiaryColor: '#2a5580'
  }
});

// React component example
function DiagramViewer({ diagramCode }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current && diagramCode) {
      const renderDiagram = async () => {
        const id = `diagram-${Date.now()}`;
        try {
          const { svg, bindFunctions } = await mermaid.render(id, diagramCode);
          containerRef.current.innerHTML = svg;
          bindFunctions?.(containerRef.current);
        } catch (error) {
          containerRef.current.innerHTML = `<p class="error">Invalid diagram: ${error.message}</p>`;
        }
      };
      renderDiagram();
    }
  }, [diagramCode]);

  return <div ref={containerRef} className="diagram-container" />;
}
```

## Directive Configuration (Frontmatter)

Configure individual diagrams using YAML frontmatter or `%%` directive comments within the diagram definition.

```html
<pre class="mermaid">
---
title: My Custom Flowchart
config:
  theme: forest
  flowchart:
    curve: stepBefore
    padding: 20
  themeVariables:
    primaryColor: "#ff6b6b"
    primaryTextColor: "#ffffff"
    primaryBorderColor: "#ee5a5a"
    lineColor: "#4ecdc4"
    secondaryColor: "#ffe66d"
---
flowchart LR
    A[Input] --> B[Process]
    B --> C[Output]
</pre>

<pre class="mermaid">
%%{init: {"theme": "dark", "themeVariables": {"fontSize": "16px"}}}%%
sequenceDiagram
    Alice->>Bob: Hello Bob!
    Bob-->>Alice: Hi Alice!
</pre>
```

## Accessibility Features

Mermaid supports accessibility through title and description attributes that are rendered as SVG accessibility elements.

```html
<pre class="mermaid">
---
title: User Authentication Flow
---
flowchart TD
    accTitle: Authentication Process Diagram
    accDescr: This diagram shows the step-by-step process of user authentication including login validation and session management

    A[User visits login page] --> B[Enter credentials]
    B --> C{Valid?}
    C -->|Yes| D[Create session]
    C -->|No| E[Show error]
    D --> F[Redirect to dashboard]
    E --> B
</pre>
```

## Click Events and Interactivity

Add click handlers to nodes for interactive diagrams with callbacks, links, or custom JavaScript functions.

```html
<pre class="mermaid">
flowchart LR
    A[Dashboard] --> B[Reports]
    A --> C[Settings]
    B --> D[Sales Report]
    B --> E[Analytics]

    click A callback "Go to Dashboard"
    click B "https://example.com/reports" "View Reports" _blank
    click C callback "openSettings"
    click D call showReport("sales")
    click E call showReport("analytics")
</pre>

<script>
  // Define callback functions before mermaid renders
  window.callback = function(nodeId) {
    console.log('Clicked node:', nodeId);
  };

  window.openSettings = function() {
    document.getElementById('settings-modal').style.display = 'block';
  };

  window.showReport = function(reportType) {
    fetch(`/api/reports/${reportType}`)
      .then(response => response.json())
      .then(data => displayReport(data));
  };
</script>
```

## External Diagram Registration

Register custom or external diagram types to extend Mermaid's capabilities with new visualization types.

```javascript
import mermaid from 'mermaid';
import zenuml from '@mermaid-js/mermaid-zenuml';

// Register external diagram types
await mermaid.registerExternalDiagrams([zenuml]);

// Or register with lazy loading disabled for immediate availability
await mermaid.registerExternalDiagrams([zenuml], { lazyLoad: false });

// Now you can use the registered diagram type
const diagram = `
zenuml
  @Actor Alice
  @Database DB

  Alice->DB.query() {
    DB->DB.process()
    return data
  }
`;

const { svg } = await mermaid.render('zenuml-diagram', diagram);
```

## Security Configuration

Configure security levels for rendering diagrams, especially important when rendering user-provided content.

```javascript
import mermaid from 'mermaid';

// Strict mode (default) - sanitizes output, no JavaScript execution
mermaid.initialize({
  securityLevel: 'strict',
  // Click events disabled in strict mode
});

// Loose mode - allows click callbacks and some HTML
mermaid.initialize({
  securityLevel: 'loose',
  // Click events work, use only with trusted content
});

// Sandbox mode - renders in sandboxed iframe
mermaid.initialize({
  securityLevel: 'sandbox',
  // Maximum isolation, diagram rendered in iframe
  // Some interactivity limited
});

// For untrusted content, always use strict or sandbox
async function renderUntrustedDiagram(userInput) {
  mermaid.initialize({ securityLevel: 'sandbox' });

  try {
    const { svg } = await mermaid.render('user-diagram', userInput);
    return svg;
  } catch (error) {
    return '<p>Invalid diagram</p>';
  }
}
```

Mermaid is primarily used for creating technical documentation, software architecture diagrams, process documentation, and educational content. Its text-based approach makes diagrams version-controllable alongside code, easily maintainable, and accessible to developers who prefer writing over drawing. Common use cases include API documentation with sequence diagrams, database design with ER diagrams, deployment workflows with flowcharts, project timelines with Gantt charts, and git branching strategies with git graphs.

Integration patterns typically involve embedding Mermaid in Markdown-based documentation systems (GitHub, GitLab, Notion), static site generators (VitePress, Docusaurus), or building custom diagram editors in web applications. For build-time rendering, tools like mermaid-cli can generate static SVG/PNG files. The library's modular architecture allows selective loading of diagram types to optimize bundle size, and its theming system enables consistent visual styling across all diagram types within an application or documentation site.
