import type { LoaderFunction } from 'react-router';
import { redirect } from 'react-router';

import { requestAuth } from '~/shared/auth';

export const loader: LoaderFunction = async ({ request }) => {
  const { headers } = await requestAuth();
  const url = new URL(request.url);
  const redirectTo = url.searchParams.get('redirectTo') || '/';
  return redirect(redirectTo, { headers });
};
