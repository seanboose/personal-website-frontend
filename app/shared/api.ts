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
    // TODO idk if i like this pattern. its hard to troubleshoot failures, especially SSR requests
    const json = await res.json();
    const message = json?.message;
    throw new Error(
      `API request failed with status=${res.status}, message="${message}"`,
    );
  }
  return res.json(); // TODO may need to cast as Promise<T>;
};

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
