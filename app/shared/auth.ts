import { clientConfig, serverConfig } from './config';

export let authCookie = '';
const authRequestClientKey = 'auth-request-client';
const authRequestClient = 'personal-website-frontend';
const grantAuthUrl = `${clientConfig.apiUrl}/api/auth/grant`;

export const fetchGrantAuth = async () => {
  const body = { [authRequestClientKey]: authRequestClient };
  const res = await fetch(grantAuthUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'internal-auth-key': serverConfig.authRequestKey,
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
