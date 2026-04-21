import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'yaml';

const CONTRACTS_DIR = path.resolve(__dirname, '../../../../contracts/openapi');

const SERVICE_PORTS: Record<string, number> = {
  'auth-service': 3001,
  'project-service': 3002,
  'task-service': 3003,
};

interface SchemaProperty {
  type?: string;
  enum?: string[];
  format?: string;
  items?: SchemaProperty;
  properties?: Record<string, SchemaProperty>;
  $ref?: string;
}

interface OpenApiSpec {
  paths: Record<string, Record<string, any>>;
  components?: { schemas?: Record<string, any> };
}

function resolveRef(spec: OpenApiSpec, ref: string): any {
  const parts = ref.replace('#/', '').split('/');
  let current: any = spec;
  for (const part of parts) current = current?.[part];
  return current;
}

function resolveSchema(spec: OpenApiSpec, schema: any): any {
  if (!schema) return schema;
  if (schema.$ref) return resolveRef(spec, schema.$ref);
  return schema;
}

function validateValueAgainstSchema(
  value: any,
  schema: any,
  spec: OpenApiSpec,
  breadcrumb = '',
): string[] {
  const errors: string[] = [];
  const resolved = resolveSchema(spec, schema);
  if (!resolved) return errors;

  if (resolved.type === 'object' && resolved.properties && typeof value === 'object' && value !== null) {
    for (const [key, propSchema] of Object.entries(resolved.properties)) {
      if (key in value) {
        errors.push(
          ...validateValueAgainstSchema(value[key], propSchema, spec, `${breadcrumb}.${key}`),
        );
      }
    }
  }

  if (resolved.type === 'array' && Array.isArray(value) && resolved.items) {
    value.forEach((item: any, i: number) => {
      errors.push(
        ...validateValueAgainstSchema(item, resolved.items, spec, `${breadcrumb}[${i}]`),
      );
    });
  }

  if (resolved.type && !['object', 'array'].includes(resolved.type)) {
    const jsType = resolved.type === 'integer' ? 'number' : resolved.type;
    if (typeof value !== jsType && value !== null) {
      errors.push(`${breadcrumb}: expected ${resolved.type}, got ${typeof value}`);
    }
  }

  if (resolved.enum && !resolved.enum.includes(value)) {
    errors.push(`${breadcrumb}: value "${value}" not in enum [${resolved.enum}]`);
  }

  return errors;
}

async function getAuthToken(): Promise<string> {
  const ts = Date.now();
  const regRes = await fetch(`http://localhost:${SERVICE_PORTS['auth-service']}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Contract Tester',
      email: `contract-${ts}@test.com`,
      password: 'Str0ngP@ssword!',
    }),
  });

  const body = regRes.status === 409
    ? await (
        await fetch(`http://localhost:${SERVICE_PORTS['auth-service']}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: `contract-${ts}@test.com`,
            password: 'Str0ngP@ssword!',
          }),
        })
      ).json()
    : await regRes.json();

  return body.access_token;
}

function buildUrl(
  basePath: string,
  port: number,
  pathTemplate: string,
): string {
  const filledPath = pathTemplate.replace(
    /\{[^}]+\}/g,
    '00000000-0000-0000-0000-000000000000',
  );
  return `http://localhost:${port}${filledPath}`;
}

describe('OpenAPI contract tests', () => {
  let authToken: string;

  const specFiles = fs.readdirSync(CONTRACTS_DIR).filter((f) => f.endsWith('.yaml'));

  beforeAll(async () => {
    authToken = await getAuthToken();
  });

  for (const file of specFiles) {
    const serviceName = file.replace('.openapi.yaml', '');
    const port = SERVICE_PORTS[serviceName];
    if (!port) continue;

    describe(`${serviceName} (${file})`, () => {
      let spec: OpenApiSpec;

      beforeAll(() => {
        const raw = fs.readFileSync(path.join(CONTRACTS_DIR, file), 'utf-8');
        spec = yaml.parse(raw) as OpenApiSpec;
      });

      it('should have a valid OpenAPI spec with paths', () => {
        expect(spec).toHaveProperty('paths');
        expect(Object.keys(spec.paths).length).toBeGreaterThan(0);
      });

      it('should return responses matching defined schemas for GET endpoints', async () => {
        const allErrors: string[] = [];

        for (const [pathTemplate, methods] of Object.entries(spec.paths)) {
          const getOp = methods['get'];
          if (!getOp) continue;

          const hasPathParam = pathTemplate.includes('{');
          if (hasPathParam) continue;

          const url = buildUrl('', port, pathTemplate);

          const res = await fetch(url, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${authToken}`,
            },
          });

          const successCodes = Object.keys(getOp.responses || {}).filter((c) =>
            c.startsWith('2'),
          );
          const expectedSchema =
            getOp.responses?.[String(res.status)]?.content?.['application/json']?.schema;

          if (expectedSchema && res.status >= 200 && res.status < 300) {
            const body = await res.json();
            const errors = validateValueAgainstSchema(body, expectedSchema, spec, pathTemplate);
            allErrors.push(...errors);
          }
        }

        if (allErrors.length > 0) {
          console.warn('Schema validation warnings:', allErrors);
        }
        expect(allErrors.length).toBe(0);
      });
    });
  }
});
