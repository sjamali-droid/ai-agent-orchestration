import http from 'k6/http';
import { check, sleep, group } from 'k6';

export const options = {
  vus: 50,
  duration: '2m',
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.01'],
  },
  summaryTrendStats: ['avg', 'min', 'med', 'max', 'p(90)', 'p(95)', 'p(99)'],
};

const AUTH_BASE = __ENV.AUTH_BASE || 'http://localhost:3001';
const PROJECT_BASE = __ENV.PROJECT_BASE || 'http://localhost:3002';
const TASK_BASE = __ENV.TASK_BASE || 'http://localhost:3003';

const JSON_HEADERS = { 'Content-Type': 'application/json' };

export function setup() {
  const ts = Date.now();
  const email = `k6-loadtest-${ts}-${__VU || 0}@test.com`;
  const password = 'Str0ngP@ssword!';

  const regRes = http.post(
    `${AUTH_BASE}/auth/register`,
    JSON.stringify({ name: 'k6 Load User', email, password }),
    { headers: JSON_HEADERS },
  );

  let tokens;
  if (regRes.status === 201) {
    tokens = JSON.parse(regRes.body);
  } else {
    const loginRes = http.post(
      `${AUTH_BASE}/auth/login`,
      JSON.stringify({ email, password }),
      { headers: JSON_HEADERS },
    );
    tokens = JSON.parse(loginRes.body);
  }

  const projRes = http.post(
    `${PROJECT_BASE}/projects`,
    JSON.stringify({ name: `k6-project-${ts}`, description: 'load test' }),
    { headers: { ...JSON_HEADERS, Authorization: `Bearer ${tokens.access_token}` } },
  );
  const project = JSON.parse(projRes.body);

  return {
    email,
    password,
    projectId: project.id,
  };
}

export default function (data) {
  let accessToken;

  group('Login', () => {
    const res = http.post(
      `${AUTH_BASE}/auth/login`,
      JSON.stringify({ email: data.email, password: data.password }),
      { headers: JSON_HEADERS },
    );

    check(res, {
      'login status 200': (r) => r.status === 200,
      'login has access_token': (r) => {
        const body = JSON.parse(r.body);
        accessToken = body.access_token;
        return !!accessToken;
      },
    });
  });

  sleep(0.5);

  const authHeaders = {
    ...JSON_HEADERS,
    Authorization: `Bearer ${accessToken}`,
  };

  group('List projects', () => {
    const res = http.get(`${PROJECT_BASE}/projects`, { headers: authHeaders });

    check(res, {
      'list projects 200': (r) => r.status === 200,
      'projects has data': (r) => JSON.parse(r.body).data !== undefined,
    });
  });

  sleep(0.3);

  group('List tasks', () => {
    const res = http.get(
      `${TASK_BASE}/projects/${data.projectId}/tasks`,
      { headers: authHeaders },
    );

    check(res, {
      'list tasks 200': (r) => r.status === 200,
    });
  });

  sleep(0.3);

  group('Create task', () => {
    const res = http.post(
      `${TASK_BASE}/projects/${data.projectId}/tasks`,
      JSON.stringify({
        title: `Load test task ${__ITER}-${__VU}`,
        description: 'Created during k6 load test',
        priority: 'medium',
      }),
      { headers: authHeaders },
    );

    check(res, {
      'create task 201': (r) => r.status === 201,
      'task has id': (r) => JSON.parse(r.body).id !== undefined,
    });
  });

  sleep(0.5);
}

export function teardown(data) {
  const loginRes = http.post(
    `${AUTH_BASE}/auth/login`,
    JSON.stringify({ email: data.email, password: data.password }),
    { headers: JSON_HEADERS },
  );
  const tokens = JSON.parse(loginRes.body);
  const authHeaders = {
    ...JSON_HEADERS,
    Authorization: `Bearer ${tokens.access_token}`,
  };

  http.del(`${PROJECT_BASE}/projects/${data.projectId}`, null, {
    headers: authHeaders,
  });
}
