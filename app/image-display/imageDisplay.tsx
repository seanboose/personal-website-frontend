import { type ImageData } from '@seanboose/personal-website-api-types';
import { useEffect, useState } from 'react';
import {
  type ActionFunctionArgs,
  data,
  type LoaderFunctionArgs,
  useActionData,
  useFetcher,
  useLoaderData,
} from 'react-router';

import { api } from '~/shared/api';
import {
  fetchRefreshAuth,
  getAccessTokenFromRequest,
  requireAuthForLoader,
} from '~/shared/auth';

interface LoaderResponse {
  images: ImageData[];
}

export const loader = async ({
  request,
}: LoaderFunctionArgs): Promise<LoaderResponse> => {
  console.log('LOADER: requesting auth');
  const oldAccessToken = await requireAuthForLoader(request);
  // TODO need to do this in a catch

  let images: ImageData[] = [];
  try {
    images = (await api.images.list(oldAccessToken)).images;
  } catch (error) {
    if (error instanceof Error) {
      // TODO: need to make custom error types in api-types
      console.log('LOADER: going to refresh auth');
      const refreshResponse = await fetchRefreshAuth(request);
      const { accessToken: newAccessToken } = await refreshResponse.json();
      console.log('LOADER: refreshed auth, requesting images');
      images = (await api.images.list(newAccessToken)).images;
    } else {
      console.log('LOADER: unexpected error encountered');
      console.log(error);
      throw error;
    }
  }
  return { images };
};

async function requestWithRefresh<T>(
  request: Request,
  // TODO doesnt handle requests with args
  apiCall: (accessToken: string) => Promise<T>,
): Promise<{ data: T; headers?: HeadersInit }> {
  // TODO forcing this to be a string so i can use it, need to fix later
  const accessToken = getAccessTokenFromRequest(request) || '';

  try {
    const data = await apiCall(accessToken);
    return { data };
  } catch (error) {
    // TODO need to use new Error types here
    if (error instanceof Error) {
      const response = await fetchRefreshAuth(request);
      const json = await response.json();
      const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
        json;
      // TODO copied from auth.init, need to refactor
      const accessTokenCookie = `access_token=${newAccessToken}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${15 * 60}`;
      const refreshTokenCookie = `refresh_token=${newRefreshToken}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${7 * 24 * 60 * 60}`;
      const data = await apiCall(newAccessToken);
      return {
        data,
        headers: [
          ['Set-Cookie', accessTokenCookie],
          ['Set-Cookie', refreshTokenCookie],
        ],
      };
    }
    throw Error;
  }
}

interface ActionResponse extends LoaderResponse {
  loadCount: number;
}

export const action = async ({ request }: ActionFunctionArgs) => {
  let loadCount = 0;
  const formData = await request.formData();
  const rawLoadCount = formData.get('loadCount');
  if (typeof rawLoadCount === 'string') {
    loadCount = parseInt(rawLoadCount, 10) + 1;
  }

  const { data: tempData, headers } = await requestWithRefresh(
    request,
    api.images.list,
  );
  const { images = [] } = tempData;
  console.log(images);
  return data({ images, loadCount } satisfies ActionResponse, { headers });
};

export default function ImageDisplay() {
  const { images: loaderImages } = useLoaderData<typeof loader>();
  const actionResponse = useActionData<typeof action>();
  const fetcher = useFetcher();
  const [loadCount, setLoadCount] = useState<number>(1);
  const images: ImageData[] = actionResponse?.images ?? loaderImages;

  useEffect(() => {
    if (typeof fetcher.data?.loadCount === 'number') {
      setLoadCount(fetcher.data?.loadCount);
    }
  }, [fetcher.data?.loadCount]);

  const handleReloadClick = () => {
    const formData = new FormData();
    formData.set('loadCount', `${loadCount}`);
    fetcher.submit(formData, { method: 'post' });
  };

  return (
    <main className="flex items-center justify-center pt-16 pb-4">
      <div className="flex-1 flex flex-col items-center gap-16 min-h-0">
        <p>behold, an image!</p>
        {images[0] && (
          <div key={images[0].fileName} className="p-4">
            <img
              src={images[0].url}
              alt={images[0].fileName}
              className="max-w-xs"
            />
          </div>
        )}
        <p>{`the image has been loaded ${loadCount} times!`}</p>
        <button type="submit" onClick={handleReloadClick}>
          load it again!
        </button>
        {fetcher.state === 'submitting' && <p>reloading...</p>}
      </div>
    </main>
  );
}
