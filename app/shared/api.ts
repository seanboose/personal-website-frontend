import { config } from '../shared/config';

const apiFetch = async (path: string, options: RequestInit = {}) => {
  const headers = {
    ...options.headers,
    'Content-Type': 'application/json',
    // TODO do i want to set this conditionally depending on ssr/csr? maybe a separate api?
    Cookie: authCookie,
  };
  const res = await fetch(`${config.apiUrl}/api/${path}`, {
    ...options,
    credentials: 'include',
    headers,
  });
  if (!res.ok) {
    // TODO idk if i like this pattern. its hard to troubleshoot failures, especially SSR requests
    const json = await res.json();
    const message = json?.message;
    throw new Error(`API request failed with status ${res.status}: ${message}`);
  }
  return res.json();
};

let authCookie = '';

export const api = {
  images: {
    list: async () => apiFetch('images/list'),
  },
};

export const fetchGrantAuth = async () => {
  const body = {
    'auth-request-client': 'personal-website-frontend',
  };
  const res = await fetch(`${config.apiUrl}/api/auth/grant`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // TODO
      'x-internal-auth-key': getAuthRequestKey(),
    },
    credentials: 'include',
    body: JSON.stringify(body),
  });
  const cookie = res.headers.get('set-cookie')?.split(';')[0];
  authCookie = cookie || '';
  return res;
};

function getAuthRequestKey(): string {
  const secret = process.env.AUTH_REQUEST_KEY;
  if (!secret) {
    throw new Error('Missing AUTH_REQUEST_KEY env var');
  }
  return secret;
}
