# Jest / Vitest

> **Used by**: Developer, QA
> **What to paste**: test/describe/it API, matchers (expect), mocking (jest.fn, vi.fn), config (jest.config / vitest.config), coverage options, async testing patterns.
> **Source**: https://jestjs.io/docs/getting-started + https://vitest.dev/guide/

<!-- PASTE CONTEXT BELOW THIS LINE -->


# Jest

Jest is a delightful JavaScript testing framework with a focus on simplicity. It works out of the box for most JavaScript projects and provides instant feedback through an interactive watch mode. Jest is developer-ready with zero configuration for most projects, supports snapshot testing to capture large object states, and includes built-in code coverage reporting.

Jest powers testing for major JavaScript projects including React, TypeScript, Node.js, Angular, and Vue applications. The framework provides a complete testing solution with assertions, mocking, spies, timers, and parallel test execution. Jest's architecture enables fast test runs through intelligent test file caching and parallel execution across workers.

## Installation and Setup

Install Jest and create your first test file to get started with JavaScript testing.

```bash
# Install Jest using npm
npm install --save-dev jest

# Or using yarn
yarn add --dev jest

# Initialize Jest configuration (optional)
npm init jest@latest
```

```javascript
// sum.js - Function to test
function sum(a, b) {
  return a + b;
}
module.exports = sum;

// sum.test.js - Test file
const sum = require('./sum');

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});
```

```json
// package.json - Add test script
{
  "scripts": {
    "test": "jest"
  }
}
```

```bash
# Run tests
npm test

# Output:
# PASS  ./sum.test.js
# ✓ adds 1 + 2 to equal 3 (5ms)
```

## Configuration

Configure Jest using a dedicated config file with type-safe options using defineConfig.

```javascript
// jest.config.js
const {defineConfig} = require('jest');

module.exports = defineConfig({
  // Test environment
  testEnvironment: 'node',

  // File patterns for test discovery
  testMatch: ['**/__tests__/**/*.js', '**/*.test.js'],

  // Coverage configuration
  collectCoverage: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['src/**/*.{js,jsx}', '!**/node_modules/**'],

  // Transform files with babel
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },

  // Module path aliases
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },

  // Setup files to run before tests
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  // Test timeout in milliseconds
  testTimeout: 5000,

  // Automatically clear mocks between tests
  clearMocks: true,

  // Stop running tests after first failure
  bail: 1,

  // Verbose output
  verbose: true,
});
```

## CLI Commands

Run Jest with various command-line options to control test execution.

```bash
# Run all tests
jest

# Run specific test file
jest path/to/test.js

# Run tests matching a pattern
jest --testNamePattern="should add numbers"

# Run tests in watch mode (re-run on changes)
jest --watch

# Run all tests in watch mode
jest --watchAll

# Run tests with coverage report
jest --coverage

# Run tests related to changed files (git)
jest --onlyChanged

# Update snapshots
jest --updateSnapshot

# Run tests in a specific directory
jest --testPathPattern="src/components"

# Run tests with verbose output
jest --verbose

# Run tests in band (sequentially, useful for debugging)
jest --runInBand

# Show configuration
jest --showConfig

# Clear Jest cache
jest --clearCache

# Detect open handles preventing exit
jest --detectOpenHandles

# Fail tests if no assertions
jest --passWithNoTests=false
```

## Test Structure with describe and test

Organize tests using describe blocks and test/it functions with setup and teardown hooks.

```javascript
const {describe, test, expect, beforeAll, afterAll, beforeEach, afterEach} = require('@jest/globals');

// Database connection example
let db;

// Runs once before all tests in this file
beforeAll(async () => {
  db = await connectToDatabase();
});

// Runs once after all tests in this file
afterAll(async () => {
  await db.close();
});

describe('User module', () => {
  let testUser;

  // Runs before each test in this describe block
  beforeEach(async () => {
    testUser = await db.createUser({name: 'Test User', email: 'test@example.com'});
  });

  // Runs after each test in this describe block
  afterEach(async () => {
    await db.deleteUser(testUser.id);
  });

  test('should create a user', () => {
    expect(testUser).toBeDefined();
    expect(testUser.name).toBe('Test User');
  });

  test('should find user by email', async () => {
    const found = await db.findByEmail('test@example.com');
    expect(found).toEqual(testUser);
  });

  // Nested describe for related tests
  describe('when user is admin', () => {
    beforeEach(async () => {
      await db.setRole(testUser.id, 'admin');
    });

    test('should have admin permissions', async () => {
      const permissions = await db.getPermissions(testUser.id);
      expect(permissions).toContain('admin');
    });
  });
});

// Skip a test temporarily
test.skip('this test is skipped', () => {
  expect(true).toBe(false);
});

// Mark a test as todo
test.todo('implement user deletion');

// Only run this test (for debugging)
test.only('only this test runs', () => {
  expect(1 + 1).toBe(2);
});
```

## Parameterized Tests with test.each

Run the same test with different data sets using test.each and describe.each.

```javascript
// Array of arrays format
test.each([
  [1, 1, 2],
  [1, 2, 3],
  [2, 2, 4],
  [5, 5, 10],
])('add(%i, %i) returns %i', (a, b, expected) => {
  expect(a + b).toBe(expected);
});

// Array of objects format (more readable)
test.each([
  {a: 1, b: 1, expected: 2},
  {a: 1, b: 2, expected: 3},
  {a: 2, b: 2, expected: 4},
])('add($a, $b) returns $expected', ({a, b, expected}) => {
  expect(a + b).toBe(expected);
});

// Tagged template literal format
test.each`
  a    | b    | expected
  ${1} | ${1} | ${2}
  ${1} | ${2} | ${3}
  ${2} | ${1} | ${3}
`('returns $expected when $a is added to $b', ({a, b, expected}) => {
  expect(a + b).toBe(expected);
});

// describe.each for parameterized test suites
describe.each([
  {name: 'mobile', width: 320},
  {name: 'tablet', width: 768},
  {name: 'desktop', width: 1024},
])('Responsive layout at $name ($width px)', ({name, width}) => {
  test('renders correctly', () => {
    const layout = renderAtWidth(width);
    expect(layout).toMatchSnapshot();
  });

  test('shows navigation', () => {
    const nav = getNavigation(width);
    expect(nav).toBeDefined();
  });
});
```

## Matchers and Assertions

Use expect matchers to assert values match expected conditions.

```javascript
// Exact equality
expect(2 + 2).toBe(4);
expect('hello').toBe('hello');

// Deep equality for objects and arrays
expect({name: 'John', age: 30}).toEqual({name: 'John', age: 30});
expect([1, 2, 3]).toEqual([1, 2, 3]);

// Strict equality (checks undefined, type mismatch)
expect({a: undefined, b: 2}).toStrictEqual({a: undefined, b: 2});

// Truthiness
expect(true).toBeTruthy();
expect(false).toBeFalsy();
expect(null).toBeNull();
expect(undefined).toBeUndefined();
expect('value').toBeDefined();

// Numbers
expect(10).toBeGreaterThan(5);
expect(10).toBeGreaterThanOrEqual(10);
expect(5).toBeLessThan(10);
expect(5).toBeLessThanOrEqual(5);
expect(0.1 + 0.2).toBeCloseTo(0.3, 5); // Floating point comparison

// Strings
expect('Hello World').toMatch(/World/);
expect('Hello World').toMatch('World');
expect('team').not.toMatch(/I/);

// Arrays and iterables
expect(['apple', 'banana', 'cherry']).toContain('banana');
expect([{id: 1}, {id: 2}]).toContainEqual({id: 1});
expect([1, 2, 3]).toHaveLength(3);

// Objects
expect({name: 'John', age: 30, city: 'NYC'}).toMatchObject({name: 'John', age: 30});
expect({name: 'John'}).toHaveProperty('name');
expect({user: {name: 'John'}}).toHaveProperty('user.name', 'John');

// Exceptions
expect(() => { throw new Error('Invalid'); }).toThrow();
expect(() => { throw new Error('Invalid input'); }).toThrow('Invalid');
expect(() => { throw new Error('Invalid input'); }).toThrow(/input/);
expect(() => { throw new TypeError('Wrong type'); }).toThrow(TypeError);

// Negation with .not
expect(5).not.toBe(10);
expect([1, 2]).not.toContain(3);

// Promises
await expect(Promise.resolve('success')).resolves.toBe('success');
await expect(Promise.reject(new Error('fail'))).rejects.toThrow('fail');
```

## Asymmetric Matchers

Use asymmetric matchers for flexible matching within toEqual and toHaveBeenCalledWith.

```javascript
// Match any value of a type
expect({id: 1, name: 'John', createdAt: new Date()}).toEqual({
  id: expect.any(Number),
  name: expect.any(String),
  createdAt: expect.any(Date),
});

// Match anything except null/undefined
expect({id: 123, data: 'test'}).toEqual({
  id: expect.anything(),
  data: expect.anything(),
});

// Array containing specific elements (subset)
expect(['Alice', 'Bob', 'Charlie']).toEqual(
  expect.arrayContaining(['Bob', 'Alice'])
);

// Array of elements matching a pattern
expect([{id: 1}, {id: 2}, {id: 3}]).toEqual(
  expect.arrayOf(expect.objectContaining({id: expect.any(Number)}))
);

// Object containing specific properties (subset)
expect({name: 'John', age: 30, city: 'NYC'}).toEqual(
  expect.objectContaining({name: 'John', age: 30})
);

// String matching pattern
expect('Hello World').toEqual(expect.stringContaining('World'));
expect('user@example.com').toEqual(expect.stringMatching(/^[\w.]+@[\w.]+$/));

// Floating point in objects
expect({title: 'Price', value: 0.1 + 0.2}).toEqual({
  title: 'Price',
  value: expect.closeTo(0.3, 5),
});

// Combining asymmetric matchers
expect(callback).toHaveBeenCalledWith(
  expect.objectContaining({
    type: 'click',
    target: expect.anything(),
    timestamp: expect.any(Number),
  })
);

// Negated asymmetric matchers
expect(['a', 'b']).toEqual(expect.not.arrayContaining(['c']));
expect({foo: 'bar'}).toEqual(expect.not.objectContaining({baz: 'qux'}));
```

## Mock Functions

Create mock functions to spy on behavior and control return values.

```javascript
// Create a basic mock function
const mockFn = jest.fn();
mockFn('arg1', 'arg2');

expect(mockFn).toHaveBeenCalled();
expect(mockFn).toHaveBeenCalledTimes(1);
expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');

// Mock with implementation
const mockAdd = jest.fn((a, b) => a + b);
expect(mockAdd(1, 2)).toBe(3);

// Mock return values
const mockGetUser = jest.fn();
mockGetUser.mockReturnValue({id: 1, name: 'John'});
expect(mockGetUser()).toEqual({id: 1, name: 'John'});

// Different return values per call
const mockIterator = jest.fn()
  .mockReturnValueOnce('first')
  .mockReturnValueOnce('second')
  .mockReturnValue('default');

expect(mockIterator()).toBe('first');
expect(mockIterator()).toBe('second');
expect(mockIterator()).toBe('default');

// Mock async functions
const mockFetch = jest.fn().mockResolvedValue({data: 'success'});
await expect(mockFetch()).resolves.toEqual({data: 'success'});

const mockFailingFetch = jest.fn().mockRejectedValue(new Error('Network error'));
await expect(mockFailingFetch()).rejects.toThrow('Network error');

// Access mock call information
const mockCallback = jest.fn();
mockCallback('first call');
mockCallback('second call', 'extra arg');

expect(mockCallback.mock.calls).toEqual([
  ['first call'],
  ['second call', 'extra arg'],
]);
expect(mockCallback.mock.calls[0][0]).toBe('first call');
expect(mockCallback.mock.lastCall).toEqual(['second call', 'extra arg']);

// Clear, reset, restore mocks
mockFn.mockClear();    // Clears call history
mockFn.mockReset();    // Clears history + removes implementation
mockFn.mockRestore();  // Restores original (only for spies)

// Mock implementation for specific calls
const mockParser = jest.fn()
  .mockImplementationOnce(() => 'first implementation')
  .mockImplementation(() => 'default implementation');
```

## Spying on Methods

Use jest.spyOn to monitor and mock methods on existing objects.

```javascript
const calculator = {
  add: (a, b) => a + b,
  multiply: (a, b) => a * b,
};

// Spy on a method (still calls original)
const addSpy = jest.spyOn(calculator, 'add');
expect(calculator.add(2, 3)).toBe(5);
expect(addSpy).toHaveBeenCalledWith(2, 3);

// Spy and mock implementation
const multiplySpy = jest.spyOn(calculator, 'multiply').mockImplementation((a, b) => 0);
expect(calculator.multiply(2, 3)).toBe(0);
expect(multiplySpy).toHaveBeenCalled();

// Spy on getters and setters
const config = {
  _value: 10,
  get value() { return this._value; },
  set value(v) { this._value = v; },
};

const getterSpy = jest.spyOn(config, 'value', 'get').mockReturnValue(42);
expect(config.value).toBe(42);

const setterSpy = jest.spyOn(config, 'value', 'set');
config.value = 100;
expect(setterSpy).toHaveBeenCalledWith(100);

// Restore all mocks after tests
afterEach(() => {
  jest.restoreAllMocks();
});

// Replace property values
const utils = {isProduction: false};
const replaced = jest.replaceProperty(utils, 'isProduction', true);
expect(utils.isProduction).toBe(true);
replaced.restore();
expect(utils.isProduction).toBe(false);
```

## Module Mocking

Mock entire modules to isolate units under test.

```javascript
// __tests__/user.test.js
import {getUser} from '../userService';
import {fetchFromAPI} from '../api';

// Mock the api module
jest.mock('../api');

describe('userService', () => {
  test('getUser returns user data', async () => {
    // Configure mock return value
    fetchFromAPI.mockResolvedValue({id: 1, name: 'John'});

    const user = await getUser(1);

    expect(fetchFromAPI).toHaveBeenCalledWith('/users/1');
    expect(user).toEqual({id: 1, name: 'John'});
  });
});

// Mock with factory function
jest.mock('../config', () => ({
  apiUrl: 'https://test-api.example.com',
  timeout: 1000,
}));

// Mock ES6 module with default export
jest.mock('../logger', () => ({
  __esModule: true,
  default: jest.fn(),
  logError: jest.fn(),
}));

// Partial mock (keep some original implementations)
jest.mock('../utils', () => {
  const originalModule = jest.requireActual('../utils');
  return {
    ...originalModule,
    formatDate: jest.fn(() => '2024-01-01'),
  };
});

// Mock per test with doMock (not hoisted)
beforeEach(() => {
  jest.resetModules();
});

test('with mock A', () => {
  jest.doMock('../service', () => ({getData: () => 'mock A'}));
  const {getData} = require('../service');
  expect(getData()).toBe('mock A');
});

test('with mock B', () => {
  jest.doMock('../service', () => ({getData: () => 'mock B'}));
  const {getData} = require('../service');
  expect(getData()).toBe('mock B');
});
```

## Snapshot Testing

Capture component output and compare against stored snapshots.

```javascript
// Component snapshot testing
import {render} from '@testing-library/react';
import Button from '../Button';

test('Button renders correctly', () => {
  const {container} = render(<Button label="Click me" disabled={false} />);
  expect(container.firstChild).toMatchSnapshot();
});

// Inline snapshots (written into test file)
test('user object matches inline snapshot', () => {
  const user = {id: 1, name: 'John', role: 'admin'};
  expect(user).toMatchInlineSnapshot(`
    {
      "id": 1,
      "name": "John",
      "role": "admin",
    }
  `);
});

// Snapshot with property matchers (for dynamic values)
test('user with dynamic fields', () => {
  const user = {
    id: Math.random(),
    name: 'John',
    createdAt: new Date(),
  };

  expect(user).toMatchSnapshot({
    id: expect.any(Number),
    createdAt: expect.any(Date),
  });
});

// Snapshot error messages
test('throws error matching snapshot', () => {
  expect(() => {
    throw new Error('Invalid user ID');
  }).toThrowErrorMatchingSnapshot();
});

// Update snapshots from command line
// jest --updateSnapshot
// jest -u
```

## Timer Mocking

Control time-dependent code with fake timers.

```javascript
beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

test('debounce waits before calling callback', () => {
  const callback = jest.fn();
  const debounced = debounce(callback, 1000);

  debounced();
  expect(callback).not.toHaveBeenCalled();

  // Fast-forward time by 500ms
  jest.advanceTimersByTime(500);
  expect(callback).not.toHaveBeenCalled();

  // Fast-forward remaining 500ms
  jest.advanceTimersByTime(500);
  expect(callback).toHaveBeenCalledTimes(1);
});

test('setInterval calls repeatedly', () => {
  const callback = jest.fn();
  setInterval(callback, 1000);

  expect(callback).not.toHaveBeenCalled();

  // Run all pending timers
  jest.runAllTimers();
  // Note: This runs indefinitely for setInterval, use runOnlyPendingTimers instead
});

test('advance to next timer', () => {
  const callback1 = jest.fn();
  const callback2 = jest.fn();

  setTimeout(callback1, 100);
  setTimeout(callback2, 200);

  jest.advanceTimersToNextTimer();
  expect(callback1).toHaveBeenCalled();
  expect(callback2).not.toHaveBeenCalled();

  jest.advanceTimersToNextTimer();
  expect(callback2).toHaveBeenCalled();
});

test('set system time', () => {
  jest.setSystemTime(new Date('2024-01-01T00:00:00Z'));
  expect(new Date().toISOString()).toBe('2024-01-01T00:00:00.000Z');
});

test('async timers', async () => {
  const callback = jest.fn();

  setTimeout(() => {
    Promise.resolve().then(callback);
  }, 100);

  // Use async version to handle promises
  await jest.advanceTimersByTimeAsync(100);
  expect(callback).toHaveBeenCalled();
});
```

## Testing Async Code

Test promises, async/await, and callbacks properly.

```javascript
// Testing promises
test('promise resolves with data', () => {
  return fetchData().then(data => {
    expect(data).toBe('data');
  });
});

// Using async/await
test('async function returns data', async () => {
  const data = await fetchData();
  expect(data).toBe('data');
});

// Testing promise rejection
test('promise rejects with error', async () => {
  await expect(fetchBadData()).rejects.toThrow('Error');
});

// Using resolves/rejects matchers
test('resolves to correct value', async () => {
  await expect(Promise.resolve('value')).resolves.toBe('value');
});

test('rejects with error', async () => {
  await expect(Promise.reject(new Error('fail'))).rejects.toThrow('fail');
});

// Testing callbacks with done
test('callback is called with data', done => {
  function callback(data) {
    try {
      expect(data).toBe('data');
      done();
    } catch (error) {
      done(error);
    }
  }

  fetchDataWithCallback(callback);
});

// Ensure assertions are called
test('all assertions run', async () => {
  expect.assertions(2);

  const data = await fetchData();
  expect(data).toBeDefined();
  expect(data.length).toBeGreaterThan(0);
});

test('at least one assertion runs', () => {
  expect.hasAssertions();

  return fetchData().then(data => {
    expect(data).toBeDefined();
  });
});
```

## Custom Matchers

Extend Jest with custom matchers for domain-specific assertions.

```javascript
// Define custom matcher
expect.extend({
  toBeWithinRange(received, floor, ceiling) {
    const pass = received >= floor && received <= ceiling;

    if (pass) {
      return {
        message: () =>
          `expected ${received} not to be within range ${floor} - ${ceiling}`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected ${received} to be within range ${floor} - ${ceiling}`,
        pass: false,
      };
    }
  },

  toBeValidEmail(received) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const pass = emailRegex.test(received);

    return {
      message: () => `expected ${received} ${pass ? 'not ' : ''}to be a valid email`,
      pass,
    };
  },
});

// Use custom matchers
test('number is within range', () => {
  expect(100).toBeWithinRange(90, 110);
  expect(50).not.toBeWithinRange(90, 110);
});

test('email is valid', () => {
  expect('user@example.com').toBeValidEmail();
  expect('invalid-email').not.toBeValidEmail();
});

// Async custom matcher
expect.extend({
  async toBeReachable(url) {
    try {
      const response = await fetch(url);
      return {
        message: () => `expected ${url} not to be reachable`,
        pass: response.ok,
      };
    } catch {
      return {
        message: () => `expected ${url} to be reachable`,
        pass: false,
      };
    }
  },
});

test('API is reachable', async () => {
  await expect('https://api.example.com').toBeReachable();
});

// TypeScript type declaration (jest.d.ts)
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeWithinRange(floor: number, ceiling: number): R;
      toBeValidEmail(): R;
    }
  }
}
```

## Code Coverage

Generate and configure code coverage reports.

```javascript
// jest.config.js
module.exports = {
  // Enable coverage collection
  collectCoverage: true,

  // Output directory for coverage reports
  coverageDirectory: 'coverage',

  // Files to include in coverage
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.js',
    '!**/node_modules/**',
  ],

  // Coverage thresholds (fail if below)
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
    './src/utils/': {
      branches: 100,
      functions: 100,
    },
  },

  // Report formats
  coverageReporters: ['text', 'lcov', 'html'],

  // Coverage provider (babel or v8)
  coverageProvider: 'v8',
};
```

```bash
# Run with coverage
jest --coverage

# Coverage with specific files
jest --coverage --collectCoverageFrom='src/**/*.js'

# View HTML report
open coverage/lcov-report/index.html
```

## Test Environment Setup

Configure test environments and global setup/teardown.

```javascript
// jest.config.js
module.exports = {
  // Test environment (node, jsdom, or custom)
  testEnvironment: 'jsdom',

  // Global setup file (runs once before all tests)
  globalSetup: './jest.globalSetup.js',

  // Global teardown file (runs once after all tests)
  globalTeardown: './jest.globalTeardown.js',

  // Setup files (runs before each test file)
  setupFilesAfterEnv: ['./jest.setup.js'],
};

// jest.globalSetup.js
module.exports = async () => {
  // Start test database
  global.__DB__ = await startTestDatabase();
  process.env.DATABASE_URL = global.__DB__.url;
};

// jest.globalTeardown.js
module.exports = async () => {
  // Stop test database
  await global.__DB__.stop();
};

// jest.setup.js
import '@testing-library/jest-dom';

// Add custom matchers
expect.extend({
  toBeValidDate(received) {
    return {
      pass: received instanceof Date && !isNaN(received),
      message: () => `expected ${received} to be a valid Date`,
    };
  },
});

// Global test timeout
jest.setTimeout(10000);

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
});
```

## Concurrent Tests

Run tests concurrently for improved performance.

```javascript
// Run tests concurrently
test.concurrent('async test 1', async () => {
  const result = await asyncOperation1();
  expect(result).toBe('result1');
});

test.concurrent('async test 2', async () => {
  const result = await asyncOperation2();
  expect(result).toBe('result2');
});

// Concurrent with each
test.concurrent.each([
  {input: 1, expected: 2},
  {input: 2, expected: 4},
  {input: 3, expected: 6},
])('doubles $input to $expected', async ({input, expected}) => {
  const result = await asyncDouble(input);
  expect(result).toBe(expected);
});

// Configure max concurrency in jest.config.js
module.exports = {
  maxConcurrency: 5, // Max concurrent tests
  maxWorkers: '50%', // Use 50% of available CPUs
};
```

Jest is widely used for testing JavaScript applications ranging from small utility libraries to large-scale enterprise applications. The framework's zero-configuration approach makes it ideal for quick project setups while still providing extensive customization options for complex testing requirements. Jest integrates seamlessly with popular frameworks like React, Vue, and Angular through dedicated testing utilities.

The combination of powerful mocking capabilities, snapshot testing, and parallel test execution makes Jest suitable for both unit testing individual functions and integration testing entire application flows. Teams can leverage Jest's watch mode during development for rapid feedback cycles, and the comprehensive coverage reporting helps maintain code quality standards across projects of any size.
