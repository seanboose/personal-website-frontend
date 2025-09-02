import { clientConfig, serverConfig } from './config';

export let authCookie = '';

export const fetchGrantAuth = async () => {
  const body = { client: 'personal-website-frontend' };
  const res = await fetch(`${clientConfig.apiUrl}/api/auth/grant`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-internal-auth-key': serverConfig.authRequestKey,
    },
    credentials: 'include',
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const json = await res.json();
    const message = json?.message;
    throw new Error(
      `Auth request failed with status=${res.status}, message="${message}"`,
    );
  }

  const cookie = res.headers.get('set-cookie')?.split(';')[0];
  authCookie = cookie || '';
  return res;
};
