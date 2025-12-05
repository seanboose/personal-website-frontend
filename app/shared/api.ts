import { type ImagesListResponse } from '@seanboose/personal-website-api-types';

import { clientConfig } from '~/shared/config/client';

const apiFetch = async <T>(
  path: string,
  options: RequestInit = {},
): Promise<T> => {
  const headers = {
    ...options.headers,
    'Content-Type': 'application/json',
  };
  const res = await fetch(`${clientConfig.apiUrl}/api/${path}`, {
    ...options,
    credentials: 'include',
    headers,
  });
  if (!res.ok) {
    throw await res.json();
  }
  return res.json();
};

export const api = {
  images: {
    list: async (accessToken: string) =>
      apiFetch<ImagesListResponse>('images/list', {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
  },
};
