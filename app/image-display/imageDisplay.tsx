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
import { requestWithAuth } from '~/shared/auth';

interface LoaderResponse {
  images: ImageData[];
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  console.log('LOADER: start');
  const { data: dataResponse, headers } = await requestWithAuth(
    request,
    api.images.list,
  );
  const { images = [] }: LoaderResponse = dataResponse;

  // TODO this considers data to be `any` still, need to figure that out
  console.log('LOADER: returning');
  return data({ images } satisfies LoaderResponse, { headers });
};

interface ActionResponse extends LoaderResponse {
  loadCount: number;
}

export const action = async ({ request }: ActionFunctionArgs) => {
  console.log('ACTION: start');
  let loadCount = 0;
  const formData = await request.formData();
  const rawLoadCount = formData.get('loadCount');
  if (typeof rawLoadCount === 'string') {
    loadCount = parseInt(rawLoadCount, 10) + 1;
  }

  const { data: dataResponse, headers } = await requestWithAuth(
    request,
    api.images.list,
  );
  console.log('ACTION: returning');
  const { images = [] } = dataResponse;

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
