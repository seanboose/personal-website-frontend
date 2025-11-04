import { clientConfig, serverConfig } from './config';

export let authCookie = '';
export let refreshCookie = '';

const authTokenName = 'access_token';
const refreshTokenName = 'refresh_token';
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

  parseAndStoreAuthCookies(res);
  return res;
};

export const fetchRefreshAuth = async () => {
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
  parseAndStoreAuthCookies(res);

  return res;
};

const parseAndStoreAuthCookies = (res: Response) => {
  const setCookies = res.headers.getSetCookie();
  for (const cookie of setCookies) {
    const nameValue = cookie.split(';')[0];
    if (nameValue.startsWith(`${authTokenName}=`)) {
      authCookie = nameValue;
    } else if (nameValue.startsWith(`${refreshTokenName}=`)) {
      refreshCookie = nameValue;
    }
  }
};
