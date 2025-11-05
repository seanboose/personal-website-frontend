import type { LoaderFunction } from 'react-router';
import { redirect } from 'react-router';

import { fetchGrantAuth } from '~/shared/auth';

export const loader: LoaderFunction = async ({ request }) => {
  const backendRes = await fetchGrantAuth();

  const { accessToken, refreshToken } = await backendRes.json();
  const accessTokenCookie = `access_token=${accessToken}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${15 * 60}`;
  const refreshTokenCookie = `refresh_token=${refreshToken}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${7 * 24 * 60 * 60}`;

  const url = new URL(request.url);
  const redirectTo = url.searchParams.get('redirectTo') || '/';
  return redirect(redirectTo, {
    headers: [
      ['Set-Cookie', accessTokenCookie],
      ['Set-Cookie', refreshTokenCookie],
    ],
  });
};
