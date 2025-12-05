import {
  type AuthGrantRequestBody,
  type AuthRefreshResponse,
} from '@seanboose/personal-website-api-types';
import { jwtDecode } from 'jwt-decode';
import { redirect } from 'react-router';

import { paths } from '~/shared/paths';

import { clientConfig } from './clientConfig';
import { serverConfig } from './serverConfig.server';

const authRequestClient = 'personal-website-frontend';
const grantAuthUrl = `${clientConfig.apiUrl}/api/auth/grant`;
const refreshAuthUrl = `${clientConfig.apiUrl}/api/auth/refresh`;

// we'll expire client tokens earlier than their actual expiration time
// this helps ensure we never send an expired token to the api
const tokenExpirationBufferS = 30;

let refreshPromise: Promise<{
  accessToken: string;
  headers: HeadersInit;
}> | null = null;

/**
 * make a request to an api endpoint that requires authentication.
 *  if there's a valid accessToken: makes the request normally
 *  if accessToken does not exist or is expired: refreshes auth, then makes original request
 *  if refreshToken does not exist or is expired: no session exists, redirects to login
 * you MUST return the headers returned by this function in the calling loader/action in order to keep auth cookies current
 *
 * @param request pass in the request from the action/loader to retrieve auth tokens
 * @param apiCall api request to be performed. must be curried to take only an accessToken
 * @param accessTokenOverride when making multiple calls in a single action/loader, pass in the accessToken returned by the previous call
 */
export async function requestWithAuth<T>(
  request: Request,
  apiCall: (accessToken: string) => Promise<T>,
  accessTokenOverride?: string,
): Promise<{
  body: Promise<T>;
  headers?: HeadersInit;
  accessToken: string;
}> {
  const accessToken = accessTokenOverride || getAccessTokenFromRequest(request);
  const refreshToken = getRefreshTokenFromRequest(request);
  const hasSession = !!refreshToken;
  if (!hasSession) {
    redirectToLogin(request);
  }

  if (accessToken && isAccessTokenValid(accessToken)) {
    const body = apiCall(accessToken);
    return { body, accessToken };
  }

  if (!refreshPromise) {
    refreshPromise = refreshAuth(request);
  }
  const { accessToken: newAccessToken, headers } = await refreshPromise;

  const body = apiCall(newAccessToken);
  return {
    body,
    headers,
    accessToken: newAccessToken,
  };
}

const redirectToLogin = (request: Request) => {
  const url = new URL(request.url);
  const redirectTo = url.pathname + url.search;
  throw redirect(`${paths.login}?redirectTo=${encodeURIComponent(redirectTo)}`);
};

export const requestAuth = async () => {
  const { accessToken, expiresIn, refreshToken, refreshExpiresIn } =
    await fetchGrantAuth();
  const { accessTokenCookie, refreshTokenCookie } = makeAuthCookies({
    accessToken,
    expiresIn,
    refreshToken,
    refreshExpiresIn,
  });
  const headers: HeadersInit = [
    ['Set-Cookie', accessTokenCookie],
    ['Set-Cookie', refreshTokenCookie],
  ];
  return { headers };
};

const refreshAuth = async (request: Request) => {
  try {
    const json = await fetchRefreshAuth(request);
    const { accessToken, expiresIn, refreshToken, refreshExpiresIn } = json;
    const { accessTokenCookie, refreshTokenCookie } = makeAuthCookies({
      accessToken,
      expiresIn,
      refreshToken,
      refreshExpiresIn,
    });
    const headers: HeadersInit = [
      ['Set-Cookie', accessTokenCookie],
      ['Set-Cookie', refreshTokenCookie],
    ];
    return { accessToken, headers };
  } finally {
    setTimeout(() => {
      refreshPromise = null;
    }, 100);
  }
};

const fetchGrantAuth = async () => {
  const body: AuthGrantRequestBody = {
    authRequestClient,
  };
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

  return res.json();
};

const fetchRefreshAuth = async (
  request: Request,
): Promise<AuthRefreshResponse> => {
  const refreshToken = getRefreshTokenFromRequest(request);

  const res = await fetch(refreshAuthUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) {
    const json = await res.json();
    const message = json?.message;
    throw new Error(
      `Refresh auth request failed with status=${res.status}, message="${message}"`,
    );
  }

  return res.json();
};

const isAccessTokenValid = (accessToken: string) => {
  const decoded = jwtDecode<{ exp: number }>(accessToken);
  const tokenExpiresAtMs = (decoded.exp - tokenExpirationBufferS) * 1000;
  return Date.now() < tokenExpiresAtMs;
};

const getAccessTokenFromRequest = (request: Request): string | undefined => {
  const cookieHeader = request.headers.get('cookie');
  const accessTokenRegex = new RegExp('accessToken=([^;]+)');
  return cookieHeader?.match(accessTokenRegex)?.[1];
};

const getRefreshTokenFromRequest = (request: Request): string | undefined => {
  const cookieHeader = request.headers.get('cookie');
  const refreshTokenRegex = new RegExp('refreshToken=([^;]+)');
  return cookieHeader?.match(refreshTokenRegex)?.[1];
};

const makeAuthCookies = ({
  accessToken,
  expiresIn,
  refreshToken,
  refreshExpiresIn,
}: {
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
  refreshExpiresIn: number;
}) => {
  const accessExpiration = expiresIn - tokenExpirationBufferS;
  const refreshExpiration = refreshExpiresIn - tokenExpirationBufferS;
  const accessTokenCookie = `accessToken=${accessToken}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${accessExpiration}`;
  const refreshTokenCookie = `refreshToken=${refreshToken}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${refreshExpiration}`;
  return { accessTokenCookie, refreshTokenCookie };
};
