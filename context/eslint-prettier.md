# ESLint + Prettier

> **Used by**: Developer
> **What to paste**: flat config format (eslint.config.js), common rules, TypeScript plugin config, Prettier integration (eslint-config-prettier), ignore patterns.
> **Source**: https://eslint.org/docs/latest/ + https://prettier.io/docs/en/

<!-- PASTE CONTEXT BELOW THIS LINE -->


# ESLint

ESLint is a powerful, pluggable static analysis tool for identifying and reporting patterns in ECMAScript/JavaScript code. It helps developers write more consistent code and catch bugs before they become problems. Unlike other linters, ESLint uses Espree for JavaScript parsing and evaluates patterns using an Abstract Syntax Tree (AST), making it highly flexible and extensible.

The tool is completely pluggable—every single rule is a plugin, and you can add more at runtime. ESLint supports ECMAScript 3, 5, and all versions from 2015 onwards, with the ability to configure language options, parsers, and custom rules. It integrates seamlessly into development workflows through CLI usage, Node.js APIs, and editor integrations.

## Installation and Basic Setup

ESLint can be installed and configured with a single command that sets up the configuration file and required dependencies.

```bash
# Initialize ESLint in your project (npm)
npm init @eslint/config@latest

# Or with a specific shared config
npm init @eslint/config@latest -- --config eslint-config-standard

# Run ESLint on files
npx eslint yourfile.js
npx eslint src/ tests/

# Run with auto-fix enabled
npx eslint --fix src/

# Check specific file types
npx eslint "**/*.{js,jsx,ts,tsx}"
```

## Configuration with eslint.config.js

ESLint uses flat config files (eslint.config.js) to define rules, plugins, and language options for your project.

```javascript
// eslint.config.js
import { defineConfig } from "eslint/config";
import js from "@eslint/js";
import globals from "globals";

export default defineConfig([
    // Apply recommended rules to all JavaScript files
    {
        files: ["**/*.js", "**/*.mjs", "**/*.cjs"],
        plugins: { js },
        extends: ["js/recommended"],
        languageOptions: {
            ecmaVersion: 2024,
            sourceType: "module",
            globals: {
                ...globals.browser,
                ...globals.node
            }
        }
    },

    // Custom rules configuration
    {
        files: ["**/*.js"],
        rules: {
            "no-unused-vars": "warn",
            "no-console": "off",
            "prefer-const": "error",
            "no-constant-binary-expression": "error",
            "eqeqeq": ["error", "always"],
            "curly": ["error", "all"]
        }
    },

    // Ignore specific patterns
    {
        ignores: ["dist/", "node_modules/", "coverage/"]
    }
]);
```

## ESLint Class - Node.js API

The ESLint class provides the primary programmatic interface for linting files and text from Node.js applications.

```javascript
const { ESLint } = require("eslint");

async function lintFiles() {
    // Create ESLint instance with options
    const eslint = new ESLint({
        cwd: process.cwd(),
        fix: true,                    // Auto-fix problems
        cache: true,                  // Enable caching for faster runs
        cacheLocation: ".eslintcache",
        errorOnUnmatchedPattern: false
    });

    // Lint files matching patterns
    const results = await eslint.lintFiles(["src/**/*.js"]);

    // Apply fixes to files (writes to disk)
    await ESLint.outputFixes(results);

    // Get formatter and output results
    const formatter = await eslint.loadFormatter("stylish");
    const resultText = formatter.format(results);
    console.log(resultText);

    // Get error statistics
    const errorCount = results.reduce((sum, r) => sum + r.errorCount, 0);
    const warningCount = results.reduce((sum, r) => sum + r.warningCount, 0);

    console.log(`Found ${errorCount} errors and ${warningCount} warnings`);

    // Filter to only error results (no warnings)
    const errorResults = ESLint.getErrorResults(results);

    return results;
}

// Lint text directly instead of files
async function lintText() {
    const eslint = new ESLint();

    const code = `
        const unused = 'value';
        console.log("Hello World")
    `;

    const results = await eslint.lintText(code, {
        filePath: "virtual-file.js",  // Virtual filename for config matching
        warnIgnored: true
    });

    return results;
}

lintFiles().catch(console.error);
```

## Linter Class - Low-Level API

The Linter class provides a lower-level API for linting code without file system access, useful for browser environments or custom tooling.

```javascript
const { Linter } = require("eslint");

// Create a new Linter instance
const linter = new Linter({
    cwd: process.cwd()
});

// Verify code with inline configuration
const messages = linter.verify(
    'var foo = "bar";',
    {
        languageOptions: {
            ecmaVersion: 2024,
            sourceType: "module"
        },
        rules: {
            "no-unused-vars": "error",
            "quotes": ["error", "single"],
            "semi": ["error", "always"]
        }
    },
    { filename: "test.js" }
);

console.log(messages);
// Output: [
//   {
//     ruleId: 'no-unused-vars',
//     severity: 2,
//     message: "'foo' is assigned a value but never used.",
//     line: 1,
//     column: 5,
//     ...
//   },
//   {
//     ruleId: 'quotes',
//     severity: 2,
//     message: "Strings must use singlequote.",
//     line: 1,
//     column: 11,
//     ...
//   }
// ]

// Verify and auto-fix code
const result = linter.verifyAndFix(
    'var foo = "bar"',
    {
        rules: {
            "quotes": ["error", "single"],
            "semi": ["error", "always"]
        }
    }
);

console.log(result.output);  // "var foo = 'bar';"
console.log(result.fixed);   // true
console.log(result.messages); // Remaining unfixed issues
```

## Custom Rules

Create custom ESLint rules to enforce project-specific code patterns and conventions.

```javascript
// rules/no-foo-variable.js
module.exports = {
    meta: {
        type: "problem",
        docs: {
            description: "Disallow variables named 'foo'",
            recommended: false,
            url: "https://example.com/rules/no-foo-variable"
        },
        fixable: "code",
        hasSuggestions: true,
        schema: [
            {
                type: "object",
                properties: {
                    allowedNames: {
                        type: "array",
                        items: { type: "string" }
                    }
                },
                additionalProperties: false
            }
        ],
        messages: {
            noFoo: "Variable name '{{name}}' is not allowed.",
            renameTo: "Rename to '{{newName}}'."
        }
    },

    create(context) {
        const options = context.options[0] || {};
        const allowedNames = options.allowedNames || [];

        return {
            VariableDeclarator(node) {
                const name = node.id.name;

                if (name === "foo" && !allowedNames.includes(name)) {
                    context.report({
                        node: node.id,
                        messageId: "noFoo",
                        data: { name },
                        fix(fixer) {
                            return fixer.replaceText(node.id, "bar");
                        },
                        suggest: [
                            {
                                messageId: "renameTo",
                                data: { newName: "bar" },
                                fix(fixer) {
                                    return fixer.replaceText(node.id, "bar");
                                }
                            }
                        ]
                    });
                }
            }
        };
    }
};

// Using the custom rule in eslint.config.js
import noFooVariable from "./rules/no-foo-variable.js";

export default [
    {
        plugins: {
            custom: {
                rules: {
                    "no-foo-variable": noFooVariable
                }
            }
        },
        rules: {
            "custom/no-foo-variable": ["error", { allowedNames: ["fooBar"] }]
        }
    }
];
```

## RuleTester - Testing Custom Rules

The RuleTester class provides a framework for writing unit tests for ESLint rules.

```javascript
const { RuleTester } = require("eslint");
const rule = require("./rules/no-foo-variable");

const ruleTester = new RuleTester({
    languageOptions: {
        ecmaVersion: 2024,
        sourceType: "module"
    }
});

ruleTester.run("no-foo-variable", rule, {
    valid: [
        // Valid test cases (should not trigger errors)
        "const bar = 1;",
        "let baz = 'hello';",
        {
            code: "const foo = 1;",
            options: [{ allowedNames: ["foo"] }]
        },
        {
            code: "function test() { return 42; }",
            name: "function declarations are allowed"
        }
    ],

    invalid: [
        // Invalid test cases (should trigger errors)
        {
            code: "const foo = 1;",
            errors: [
                {
                    messageId: "noFoo",
                    data: { name: "foo" },
                    line: 1,
                    column: 7,
                    type: "Identifier"
                }
            ],
            output: "const bar = 1;"  // Expected auto-fixed output
        },
        {
            code: "let foo = 'test';",
            errors: [{ messageId: "noFoo" }],
            output: "let bar = 'test';"
        },
        {
            name: "var declarations with foo",
            code: "var foo;",
            errors: 1  // Can specify error count instead of details
        },
        {
            code: "const foo = 1;",
            errors: [
                {
                    messageId: "noFoo",
                    suggestions: [
                        {
                            messageId: "renameTo",
                            data: { newName: "bar" },
                            output: "const bar = 1;"
                        }
                    ]
                }
            ],
            output: null  // null means no autofix expected
        }
    ]
});

console.log("All tests passed!");
```

## SourceCode API

The SourceCode class provides methods to inspect and work with the parsed source code within rules.

```javascript
// Inside a custom rule's create() function
module.exports = {
    meta: { /* ... */ },
    create(context) {
        const sourceCode = context.sourceCode;

        return {
            FunctionDeclaration(node) {
                // Get the source text for a node
                const functionText = sourceCode.getText(node);
                console.log("Function source:", functionText);

                // Get tokens
                const tokens = sourceCode.getTokens(node);
                const firstToken = sourceCode.getFirstToken(node);
                const lastToken = sourceCode.getLastToken(node);

                // Get comments
                const comments = sourceCode.getCommentsBefore(node);
                const allComments = sourceCode.getAllComments();

                // Get lines
                const lines = sourceCode.lines;
                const lineText = sourceCode.getLines()[node.loc.start.line - 1];

                // Get scope information
                const scope = sourceCode.getScope(node);
                const variables = scope.variables;
                const references = scope.references;

                // Get ancestors
                const ancestors = sourceCode.getAncestors(node);
                const parent = ancestors[ancestors.length - 1];

                // Token navigation
                const nextToken = sourceCode.getTokenAfter(node);
                const prevToken = sourceCode.getTokenBefore(node);
                const tokensBetween = sourceCode.getTokensBetween(
                    firstToken,
                    lastToken
                );

                // Check if node is on same line
                const isOneLine =
                    node.loc.start.line === node.loc.end.line;
            }
        };
    }
};
```

## CLI Options and Commands

ESLint provides extensive command-line options for various use cases.

```bash
# Basic linting
eslint src/
eslint "**/*.js" "**/*.jsx"

# Fix auto-fixable problems
eslint --fix src/
eslint --fix-dry-run src/  # Show what would be fixed without writing

# Fix only specific types
eslint --fix --fix-type suggestion src/
eslint --fix --fix-type problem --fix-type layout src/

# Output formats
eslint -f stylish src/     # Default pretty output
eslint -f json src/        # JSON output for tooling
eslint -f html -o report.html src/  # HTML report

# Caching for performance
eslint --cache src/
eslint --cache --cache-location .eslintcache src/
eslint --cache-strategy content src/  # Cache by content, not metadata

# Configuration options
eslint --config custom.config.js src/
eslint --no-config-lookup src/  # Ignore config files
eslint --inspect-config  # Debug configuration

# Ignore patterns
eslint --ignore-pattern "**/*.test.js" src/
eslint --no-ignore src/  # Don't use ignore patterns

# Warnings and errors
eslint --max-warnings 10 src/  # Fail if more than 10 warnings
eslint --quiet src/  # Only report errors, not warnings
eslint --no-error-on-unmatched-pattern src/

# Debug and info
eslint --debug src/  # Show debug information
eslint --print-config file.js  # Print config for a file
eslint --env-info  # Show environment info
eslint --version

# Parallel execution (ESLint 9+)
eslint --concurrency auto src/  # Auto-detect worker count
eslint --concurrency 4 src/     # Use 4 workers
```

## Integrating ESLint in Build Tools

ESLint can be integrated into various build tools and workflows.

```javascript
// Integration with custom Node.js script
const { ESLint } = require("eslint");

async function runESLintInCI() {
    const eslint = new ESLint({
        fix: false,
        cache: true,
        errorOnUnmatchedPattern: false
    });

    try {
        const results = await eslint.lintFiles(["src/**/*.js"]);

        const formatter = await eslint.loadFormatter("json");
        const jsonOutput = formatter.format(results);

        // Write results to file for CI artifact
        require("fs").writeFileSync(
            "eslint-results.json",
            jsonOutput
        );

        // Calculate totals
        const totals = results.reduce(
            (acc, result) => ({
                errors: acc.errors + result.errorCount,
                warnings: acc.warnings + result.warningCount,
                fixable: acc.fixable + result.fixableErrorCount +
                         result.fixableWarningCount
            }),
            { errors: 0, warnings: 0, fixable: 0 }
        );

        console.log(`Errors: ${totals.errors}`);
        console.log(`Warnings: ${totals.warnings}`);
        console.log(`Fixable: ${totals.fixable}`);

        // Exit with error code if there are errors
        if (totals.errors > 0) {
            process.exit(1);
        }

    } catch (error) {
        console.error("ESLint failed:", error);
        process.exit(2);
    }
}

runESLintInCI();
```

## Summary

ESLint serves as the foundational tool for JavaScript code quality in modern development workflows. Its primary use cases include enforcing coding standards across teams, catching potential bugs before runtime, and automatically fixing common code issues. The tool excels at maintaining consistent code style, preventing problematic patterns, and integrating with CI/CD pipelines for automated quality checks.

Integration patterns typically involve using the CLI for development and CI environments, the Node.js API (ESLint class) for custom tooling and IDE integrations, and the Linter class for browser-based or sandboxed environments. Custom rules enable teams to enforce domain-specific coding standards, while the RuleTester provides a robust testing framework. ESLint's flat config system (eslint.config.js) offers a flexible and composable approach to configuration that scales from small projects to large monorepos.
