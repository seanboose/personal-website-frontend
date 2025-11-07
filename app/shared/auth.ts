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
  const refreshToken = getRefreshTokenFromRequest(request);

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

const getAccessTokenFromRequest = (request: Request): string | undefined => {
  const cookieHeader = request.headers.get('cookie');
  const accessTokenRegex = new RegExp(`${authAccessTokenName}=([^;]+)`);
  return cookieHeader?.match(accessTokenRegex)?.[1];
};

const getRefreshTokenFromRequest = (request: Request): string | undefined => {
  const cookieHeader = request.headers.get('cookie');
  const refreshTokenRegex = new RegExp(`${authRefreshTokenName}=([^;]+)`);
  return cookieHeader?.match(refreshTokenRegex)?.[1];
};

export async function requestWithAuth<T>(
  request: Request,
  apiCall: (accessToken: string) => Promise<T>,
  accessTokenOverride?: string, // allow passing a refreshed token from a previous call

  // TODO data is not a good name, its a rr7 helper function
): Promise<{ data: T; headers?: HeadersInit; accessToken: string }> {
  // TODO might be able to drop the override, not sure yet
  const accessToken = accessTokenOverride || getAccessTokenFromRequest(request);
  const refreshToken = getRefreshTokenFromRequest(request);
  if (!refreshToken) {
    const url = new URL(request.url);
    const redirectTo = url.pathname + url.search;
    throw redirect(`/auth/init?redirectTo=${encodeURIComponent(redirectTo)}`);
  }

  console.log(`REFRESH HELPER: first accessToken:${accessToken}`);

  try {
    if (typeof accessToken === 'undefined') {
      // TODO super janky, short circuiting the try/catch to switch to refreshing
      throw new Error('Access token is expired, refreshing');
    }
    const data = await apiCall(accessToken);
    return { data, accessToken };
  } catch (error) {
    // TODO need to use new Error types here
    if (error instanceof Error) {
      const response = await fetchRefreshAuth(request);
      const json = await response.json();
      const {
        accessToken: newAccessToken,
        expiresIn,
        refreshToken: newRefreshToken,
        refreshExpiresIn,
      } = json;
      console.log(`REFRESH HELPER: second accessToken:${newAccessToken}`);
      const { accessTokenCookie, refreshTokenCookie } = makeAuthCookies({
        accessToken: newAccessToken,
        expiresIn,
        refreshToken: newRefreshToken,
        refreshExpiresIn,
      });
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

interface MakeAuthCookiesProps {
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
  refreshExpiresIn: number;
}

export const makeAuthCookies = ({
  accessToken,
  expiresIn,
  refreshToken,
  refreshExpiresIn,
}: MakeAuthCookiesProps) => {
  const accessTokenCookie = `access_token=${accessToken}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${expiresIn}`;
  const refreshTokenCookie = `refresh_token=${refreshToken}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${refreshExpiresIn}`;
  return { accessTokenCookie, refreshTokenCookie };
};
