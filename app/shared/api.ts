import { type ImageData } from '@seanboose/personal-website-api-types';

import { clientConfig } from '~/shared/config';

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
    const json = await res.json();
    const message = json?.message;
    throw new Error(
      `API request failed with status=${res.status}, message="${message}"`,
    );
  }
  return res.json();
};

// TODO define these with oapi in api-types
interface ImagesListResponse {
  images: ImageData[];
}

export const api = {
  images: {
    list: async (accessToken?: string) =>
      apiFetch<ImagesListResponse>(
        'images/list',
        accessToken
          ? { headers: { Authorization: `Bearer ${accessToken}` } }
          : undefined,
      ),
  },
};
