import { clientConfig } from '../shared/config';
import { authCookie } from './auth';

const apiFetch = async (path: string, options: RequestInit = {}) => {
  const headers = {
    ...options.headers,
    'Content-Type': 'application/json',
    // TODO do i want to set this conditionally depending on ssr/csr? maybe a separate api?
    Cookie: authCookie,
  };
  const res = await fetch(`${clientConfig.apiUrl}/api/${path}`, {
    ...options,
    credentials: 'include',
    headers,
  });
  if (!res.ok) {
    // TODO idk if i like this pattern. its hard to troubleshoot failures, especially SSR requests
    const json = await res.json();
    const message = json?.message;
    throw new Error(
      `API request failed with status=${res.status}, message="${message}"`,
    );
  }
  return res.json();
};

export const api = {
  images: {
    list: async () => apiFetch('images/list'),
  },
};
