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
  const res = await fetch(grantAuthUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'internal-auth-key': serverConfig.authRequestKey,
    },
    credentials: 'include',
    body: JSON.stringify({ [authRequestClientKey]: authRequestClient }),
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

const getAccessTokenFromRequest = (request: Request): string | undefined => {
  const cookieHeader = request.headers.get('cookie');
  const accessTokenRegex = new RegExp(`${authAccessTokenName}=([^;]+)`);
  return cookieHeader?.match(accessTokenRegex)?.[1];
};

export async function requestWithRefresh<T>(
  request: Request,
  apiCall: (accessToken: string) => Promise<T>,
  accessTokenOverride?: string, // allow passing a refreshed token from a previous call
): Promise<{ data: T; headers?: HeadersInit; accessToken: string }> {
  const accessToken = accessTokenOverride || getAccessTokenFromRequest(request);
  console.log(`REFRESH HELPER: first accessToken:${accessToken}`);
  if (typeof accessToken === 'undefined') {
    throw new Error('Must provide access token when refreshing');
  }

  try {
    const data = await apiCall(accessToken);
    return { data, accessToken };
  } catch (error) {
    // TODO need to use new Error types here
    if (error instanceof Error) {
      const response = await fetchRefreshAuth(request);
      const json = await response.json();
      const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
        json;
      console.log(`REFRESH HELPER: second accessToken:${newAccessToken}`);
      const { accessTokenCookie, refreshTokenCookie } = makeAuthCookies(
        newAccessToken,
        newRefreshToken,
      );
      const data = await apiCall(newAccessToken);
      return {
        data,
        headers: [
          ['Set-Cookie', accessTokenCookie],
          ['Set-Cookie', refreshTokenCookie],
        ],
        accessToken: newAccessToken,
      };
    }
    throw Error;
  }
}

export const makeAuthCookies = (accessToken: string, refreshToken: string) => {
  // TODO need to get expiresIn,refreshExpiresIn from backend
  const accessTokenCookie = `access_token=${accessToken}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${15 * 60}`;
  const refreshTokenCookie = `refresh_token=${refreshToken}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${7 * 24 * 60 * 60}`;
  return { accessTokenCookie, refreshTokenCookie };
};
