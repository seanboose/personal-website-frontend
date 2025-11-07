import type { LoaderFunction } from 'react-router';
import { redirect } from 'react-router';

import { fetchGrantAuth } from '~/shared/auth';

export const loader: LoaderFunction = async ({ request }) => {
  const { accessTokenCookie, refreshTokenCookie } = await fetchGrantAuth();
  const url = new URL(request.url);
  const redirectTo = url.searchParams.get('redirectTo') || '/';
  return redirect(redirectTo, {
    headers: [
      ['Set-Cookie', accessTokenCookie],
      ['Set-Cookie', refreshTokenCookie],
    ],
  });
};
