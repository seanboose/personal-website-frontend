import {
  authAccessTokenName,
  authRefreshTokenName,
} from '@seanboose/personal-website-api-types';
import { redirect } from 'react-router';

import { clientConfig, serverConfig } from './config';

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

  return res;
};

export const fetchRefreshAuth = async (request: Request) => {
  const cookieHeader = request.headers.get('cookie');
  const refreshTokenRegex = new RegExp(`${authRefreshTokenName}=([^;]+)`);
  const refreshToken = cookieHeader?.match(refreshTokenRegex)?.[1];

  const res = await fetch(refreshAuthUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ [authRefreshTokenName]: refreshToken }),
  });

  if (!res.ok) {
    const json = await res.json();
    const message = json?.message;
    throw new Error(
      `Refresh auth request failed with status=${res.status}, message="${message}"`,
    );
  }

  return res;
};

/**
 * checks client request for an access_token cookie. if it's there, returns it. if not, redirects to auth and sets it
 * @param request incoming client request, just pass it in from the loader/action
 */
export const requireAuthForLoader = async (request: Request) => {
  const accessToken = getAccessTokenFromRequest(request);
  if (!accessToken) {
    const url = new URL(request.url);
    const redirectTo = url.pathname + url.search;
    throw redirect(`/auth/init?redirectTo=${encodeURIComponent(redirectTo)}`);
  }
  return accessToken;
};

export const getAccessTokenFromRequest = (
  request: Request,
): string | undefined => {
  const cookieHeader = request.headers.get('cookie');
  const accessTokenRegex = new RegExp(`${authAccessTokenName}=([^;]+)`);
  const accessToken = cookieHeader?.match(accessTokenRegex)?.[1];
  return accessToken;
};
