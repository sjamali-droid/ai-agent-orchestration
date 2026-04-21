const API_URLS: Record<string, string> = {
  auth: process.env.NEXT_PUBLIC_AUTH_URL || 'http://localhost:3001',
  projects: process.env.NEXT_PUBLIC_PROJECT_URL || 'http://localhost:3002',
  tasks: process.env.NEXT_PUBLIC_TASK_URL || 'http://localhost:3003',
  files: process.env.NEXT_PUBLIC_FILE_URL || 'http://localhost:3004',
  notifications: process.env.NEXT_PUBLIC_NOTIFICATION_URL || 'http://localhost:3005',
};

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token');
}

export async function api<T>(
  service: keyof typeof API_URLS,
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_URLS[service]}${path}`, { ...options, headers });

  if (res.status === 401) {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.href = '/auth/login';
    throw new Error('Unauthorized');
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}
