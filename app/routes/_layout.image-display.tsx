import { useState } from 'react';

import { Button } from '~/components/button';
import { Divider } from '~/components/divider';
import { HeaderedSurface } from '~/components/headeredSurface';
import { RowStart } from '~/components/rowStart';
import { Surface } from '~/components/surface';
import { H1 } from '~/components/typography';

const images = Object.entries(
  import.meta.glob<string>('/public/assets/images/**/*.png', {
    eager: true,
    query: '?url',
    import: 'default',
  }),
)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([path, url]) => ({
    url,
    alt: path.split('/').pop() ?? 'Image from my collection',
  }));

export function meta() {
  return [{ title: 'image retriever | sean boose' }];
}

export default function ImageDisplay() {
  const [imageIndex, setImageIndex] = useState(0);
  const image = images[imageIndex];

  return (
    <div className="flex flex-col gap-4">
      <H1 className="w-full">image retriever</H1>
      <div className="flex flex-col lg:flex-row gap-4 w-full">
        <RowStart />
        <Surface className="flex-1 w-full">
          <div className="flex flex-col gap-4">
            <p>a few images from my collection</p>
            <Button
              type="button"
              onClick={() =>
                setImageIndex((index) =>
                  images.length ? (index + 1) % images.length : 0,
                )
              }
            >
              load it again!
            </Button>
            <Divider />
          </div>
        </Surface>
        <HeaderedSurface header="The Image" className="w-full flex-2">
          <div className="flex flex-col gap-4">
            <p>behold, an image!</p>
            <div className="w-full min-w-full aspect-square bg-background-selected">
              {image && (
                <img src={image.url} alt={image.alt} className="w-full" />
              )}
            </div>
          </div>
        </HeaderedSurface>
      </div>
    </div>
  );
}
