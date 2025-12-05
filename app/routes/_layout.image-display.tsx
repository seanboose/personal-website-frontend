import { type ImageData } from '@seanboose/personal-website-api-types';
import { Suspense, useCallback, useState } from 'react';
import {
  type ActionFunctionArgs,
  Await,
  data,
  type LoaderFunctionArgs,
  useFetcher,
  useLoaderData,
} from 'react-router';

import { Button } from '~/components/button';
import { Divider } from '~/components/divider';
import { HeaderedSurface } from '~/components/headeredSurface';
import { RowStart } from '~/components/rowStart';
import { Surface } from '~/components/surface';
import { H1 } from '~/components/typography';
import { api } from '~/shared/api';
import { requestWithAuth } from '~/shared/auth';

interface LoaderResponse {
  body: Promise<{ images: ImageData[] }>;
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { body, headers } = await requestWithAuth(request, api.images.list);
  return data({ body } satisfies LoaderResponse, { headers });
};

type ActionResponse = LoaderResponse;

export const action = async ({ request }: ActionFunctionArgs) => {
  const { body, headers } = await requestWithAuth(request, api.images.list);
  return data({ body } satisfies ActionResponse, { headers });
};

export default function ImageDisplay() {
  const { body: loaderBody } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();
  const actionBody = fetcher.data?.body || Promise.resolve({ images: [] });

  const handleReloadClick = useCallback(() => {
    const formData = new FormData();
    fetcher.submit(formData, { method: 'post' });
  }, [fetcher]);

  return (
    <div className="flex flex-col gap-4">
      <H1 className="w-full">image retriever</H1>
      <div className="flex flex-col lg:flex-row gap-4 w-full">
        <RowStart />
        <Surface className="flex-1 w-full">
          <div className="flex flex-col gap-4">
            <p>this is just a simple test for my auth flow</p>
            <Button type="submit" onClick={handleReloadClick}>
              {fetcher.state === 'submitting'
                ? 'reloading...'
                : 'load it again!'}
            </Button>
            <Divider />
          </div>
          <p>{`the action is... ${fetcher.state}`}</p>
        </Surface>
        <ImageSurface actionBody={actionBody} loaderBody={loaderBody} />
      </div>
    </div>
  );
}

const ImageSurface = ({
  actionBody,
  loaderBody,
}: {
  actionBody: ActionResponse['body'];
  loaderBody: LoaderResponse['body'];
}) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  return (
    <HeaderedSurface header="The Image" className="w-full flex-2">
      <div className="flex flex-col gap-4">
        <p>{`behold${isImageLoaded ? ', an image!' : '...'}`}</p>
        <Suspense fallback={<ImageContainer />}>
          <Await resolve={loaderBody}>
            {({ images: loaderImages }) => (
              <Suspense fallback={<ImageContainer />}>
                <Await resolve={actionBody}>
                  {({ images: actionImages }) => {
                    let image = loaderImages[0];
                    if (!isImageLoaded && image) {
                      setIsImageLoaded(true);
                    }
                    let isAction = false;
                    if (actionImages[0]) {
                      image = actionImages[0];
                      isAction = !!actionImages[0];
                    }
                    return (
                      image && (
                        <div className={'flex flex-col gap-4'}>
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
      </div>
    </HeaderedSurface>
  );
};

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
