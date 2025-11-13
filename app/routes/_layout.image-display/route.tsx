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

import { H1 } from '~/components/headers';
import { RowStart } from '~/components/rowStart';
import { TextBox } from '~/components/textBox';
import { api } from '~/shared/api';
import { requestWithAuth } from '~/shared/auth';

interface LoaderResponse {
  images: ImageData[];
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { body, headers } = await requestWithAuth(request, api.images.list);
  const { images = [] } = body;
  return data({ images } satisfies LoaderResponse, { headers });
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

  const { body, headers } = await requestWithAuth(request, api.images.list);
  const { images = [] } = body;

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
    <div className="flex flex-col gap-4">
      <H1>image retriever</H1>
      <div className="w-fit">
        <div className="flex flex-row gap-4">
          <RowStart />
          <TextBox>
            <div className="flex flex-col items-center justify-center">
              <p>this is just a simple test for my auth flow</p>
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
                {fetcher.state === 'submitting'
                  ? 'reloading...'
                  : 'load it again!'}
              </button>
            </div>
          </TextBox>
        </div>
      </div>
    </div>
  );
}
