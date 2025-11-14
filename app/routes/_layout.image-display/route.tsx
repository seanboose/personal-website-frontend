import { type ImageData } from '@seanboose/personal-website-api-types';
import { Suspense, useEffect, useState } from 'react';
import {
  type ActionFunctionArgs,
  Await,
  data,
  type LoaderFunctionArgs,
  useFetcher,
  useLoaderData,
} from 'react-router';

import { Divider } from '~/components/divider';
import { HeaderedSurface } from '~/components/headeredSurface';
import { H1 } from '~/components/headers';
import { RowStart } from '~/components/rowStart';
import { Surface } from '~/components/surface';
import { api } from '~/shared/api';
import { requestWithAuth } from '~/shared/auth';

interface LoaderResponse {
  body: Promise<{ images: ImageData[] }>;
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { body, headers } = await requestWithAuth(request, api.images.list);
  return data({ body } satisfies LoaderResponse, { headers });
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
  return data({ body, loadCount } satisfies ActionResponse, { headers });
};

export default function ImageDisplay() {
  const { body: loaderBody } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();
  const actionBody = fetcher.data?.body || Promise.resolve({ images: [] });
  const [loadCount, setLoadCount] = useState<number>(1);

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
      <div className="flex flex-col md:flex-row gap-4 w-fit">
        <RowStart />
        <Surface>
          <div className="flex flex-col items-center justify-center gap-4 mw-md">
            <p>this is just a simple test for my auth flow</p>
            <p>
              it hits my backend, which shuts down due to inactivity. don't be
              surprised if there's a delay on initial access
            </p>
            <button type="submit" onClick={handleReloadClick}>
              {fetcher.state === 'submitting'
                ? 'reloading...'
                : 'load it again!'}
            </button>
          </div>
        </Surface>
        <ImageSurface
          actionBody={actionBody}
          loaderBody={loaderBody}
          loadCount={loadCount}
        />
      </div>
    </div>
  );
}

const ImageContainer = ({
  className = '',
  image,
}: {
  className?: string;
  image?: ImageData;
}) => {
  return (
    <div
      className={`w-full min-w-full aspect-square bg-background-selected ${className}`}
    >
      {image ? (
        <div key={image.fileName}>
          <img src={image.url} alt={image.fileName} className="w-full" />
        </div>
      ) : (
        <div className="grid place-items-center h-full">Loading...</div>
      )}
    </div>
  );
};

const ImageSurface = ({
  actionBody,
  loaderBody,
  loadCount,
}: {
  actionBody: ActionResponse['body'];
  loaderBody: LoaderResponse['body'];
  loadCount: number;
}) => {
  return (
    <HeaderedSurface header="The Image">
      <div className="w-xs flex flex-col gap-4">
        <p>behold, an image!</p>
        <Suspense fallback={<ImageContainer />}>
          <Await resolve={loaderBody}>
            {({ images: loaderImages }) => (
              <Suspense fallback={<ImageContainer />}>
                <Await resolve={actionBody}>
                  {({ images: actionImages }) => {
                    let image = loaderImages[0];
                    let isAction = false;
                    if (actionImages[0]) {
                      image = actionImages[0];
                      isAction = !!actionImages[0];
                    }
                    return (
                      image && (
                        <div>
                          <ImageContainer image={image} />
                          <p>
                            {isAction
                              ? 'image is from the action'
                              : 'image is from the loader'}
                          </p>
                        </div>
                      )
                    );
                  }}
                </Await>
              </Suspense>
            )}
          </Await>
        </Suspense>
        <Divider />
        <p>{`the image has been loaded ${loadCount} times!`}</p>
      </div>
    </HeaderedSurface>
  );
};
