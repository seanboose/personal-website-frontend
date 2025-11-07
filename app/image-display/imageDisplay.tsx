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
  requestWithRefresh,
  requireAuthForLoader,
} from '~/shared/auth';

interface LoaderResponse {
  images: ImageData[];
}

export const loader = async ({
  request,
}: LoaderFunctionArgs): Promise<LoaderResponse> => {
  console.log('LOADER: requesting auth');
  const accessToken = await requireAuthForLoader(request);
  let images: ImageData[] = [];
  try {
    images = (await api.images.list(accessToken)).images;
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
    (token) => api.images.list(token),
  );
  const { images = [] } = tempData;
  console.log(images);
  // TODO id like a better typing solution for this response than a `satisfies`, but it may not be possible
  // TS infers types fine, but i want guard rails that prevent me from changing the response on accident
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
