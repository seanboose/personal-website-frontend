import type { LoaderFunction } from 'react-router';
import { redirect } from 'react-router';

import { fetchGrantAuth, makeAuthCookies } from '~/shared/auth';

export const loader: LoaderFunction = async ({ request }) => {
  const backendRes = await fetchGrantAuth();

  const { accessToken, expiresIn, refreshToken, refreshExpiresIn } =
    await backendRes.json();
  const { accessTokenCookie, refreshTokenCookie } = makeAuthCookies({
    accessToken,
    expiresIn,
    refreshToken,
    refreshExpiresIn,
  });

  const url = new URL(request.url);
  const redirectTo = url.searchParams.get('redirectTo') || '/';
  return redirect(redirectTo, {
    headers: [
      ['Set-Cookie', accessTokenCookie],
      ['Set-Cookie', refreshTokenCookie],
    ],
  });
};
