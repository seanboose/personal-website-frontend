import type { ImageData } from '@seanboose/personal-website-api-types';
import { useEffect, useState } from 'react';
import {
  type ActionFunctionArgs,
  useActionData,
  useFetcher,
  useLoaderData,
} from 'react-router';

import { api } from '~/shared/api';
import { fetchGrantAuth, fetchRefreshAuth } from '~/shared/auth';

interface LoaderResponse {
  images: ImageData[];
}

export const loader = async (): Promise<LoaderResponse> => {
  try {
    await fetchGrantAuth();
  } catch (error) {
    console.log('CAUGHT EXPIRATION');
    console.log(error);
  }
  const { images = [] } = await api.images.list();
  return { images };
};

interface ActionResponse extends LoaderResponse {
  loadCount: number;
}

export const action = async ({
  request,
}: ActionFunctionArgs): Promise<ActionResponse> => {
  let loadCount = 0;
  const formData = await request.formData();
  const rawLoadCount = formData.get('loadCount');
  if (typeof rawLoadCount === 'string') {
    loadCount = parseInt(rawLoadCount, 10) + 1;
  }

  await fetchRefreshAuth();
  const { images = [] } = await api.images.list();
  return { images, loadCount };
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
