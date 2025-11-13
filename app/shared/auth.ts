import {
  AuthenticationError,
  type AuthGrantRequestBody,
} from '@seanboose/personal-website-api-types';
import { redirect } from 'react-router';

import { clientConfig, serverConfig } from './config';

const authRequestClient = 'personal-website-frontend';
const grantAuthUrl = `${clientConfig.apiUrl}/api/auth/grant`;
const refreshAuthUrl = `${clientConfig.apiUrl}/api/auth/refresh`;

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
  body: T;
  headers?: HeadersInit;
  accessToken: string;
}> {
  const accessToken = accessTokenOverride || getAccessTokenFromRequest(request);
  const refreshToken = getRefreshTokenFromRequest(request);
  if (!refreshToken) {
    redirectToLogin(request);
  }

  if (typeof accessToken !== 'undefined') {
    try {
      const body = await apiCall(accessToken);
      return { body, accessToken };
    } catch (error) {
      const isUnauthorizedError =
        error &&
        typeof error === 'object' &&
        'statusCode' in error &&
        error.statusCode === 401;
      if (!isUnauthorizedError) {
        throw error;
      }
    }
  }

  const response = await fetchRefreshAuth(request);
  const json = await response.json();
  const {
    accessToken: newAccessToken,
    expiresIn,
    refreshToken: newRefreshToken,
    refreshExpiresIn,
  } = json;
  const { accessTokenCookie, refreshTokenCookie } = makeAuthCookies({
    accessToken: newAccessToken,
    expiresIn,
    refreshToken: newRefreshToken,
    refreshExpiresIn,
  });
  const body = await apiCall(newAccessToken);
  return {
    body,
    headers: [
      ['Set-Cookie', accessTokenCookie],
      ['Set-Cookie', refreshTokenCookie],
    ],
    accessToken: newAccessToken,
  };
}

export const fetchGrantAuth = async () => {
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

  const { accessToken, expiresIn, refreshToken, refreshExpiresIn } =
    await res.json();
  const { accessTokenCookie, refreshTokenCookie } = makeAuthCookies({
    accessToken,
    expiresIn,
    refreshToken,
    refreshExpiresIn,
  });
  return { accessTokenCookie, refreshTokenCookie };
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

const redirectToLogin = (request: Request) => {
  const url = new URL(request.url);
  const redirectTo = url.pathname + url.search;
  throw redirect(`/auth/init?redirectTo=${encodeURIComponent(redirectTo)}`);
};

const fetchRefreshAuth = async (request: Request) => {
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

  return res;
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
  const accessTokenCookie = `accessToken=${accessToken}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${expiresIn}`;
  const refreshTokenCookie = `refreshToken=${refreshToken}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${refreshExpiresIn}`;
  return { accessTokenCookie, refreshTokenCookie };
};
