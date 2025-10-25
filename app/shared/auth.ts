import { clientConfig, serverConfig } from './config';

export let authCookie = '';
export let refreshCookie = '';
const authRequestClientKey = 'auth-request-client';
const authRequestClient = 'personal-website-frontend';
const grantAuthUrl = `${clientConfig.apiUrl}/api/auth/grant`;
const refreshAuthUrl = `${clientConfig.apiUrl}/api/auth/refresh`;

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
      `Grant auth request failed with status=${res.status}, message="${message}"`,
    );
  }

  // TODO this cookie parsing is terrible
  const cookies = res.headers.get('set-cookie')?.split(',') || [];
  console.log({ cookies });
  authCookie = cookies[0].split(';')[0] || '';
  refreshCookie = cookies[2].split(';')[0] || '';
  return res;
};

export const fetchRefreshAuth = async () => {
  console.log(refreshCookie);
  const res = await fetch(refreshAuthUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: refreshCookie,
    },
    credentials: 'include',
  });

  if (!res.ok) {
    const json = await res.json();
    const message = json?.message;
    throw new Error(
      `Refresh auth request failed with status=${res.status}, message="${message}"`,
    );
  }
  const cookies = res.headers.get('set-cookie')?.split(';') || [];
  authCookie = cookies[0] || '';
  refreshCookie = cookies[1] || '';

  return res;
};
