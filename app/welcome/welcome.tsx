import { type ImageData } from "@seanboose/personal-website-api-types";

export interface Props {
  images?: ImageData[];
}

export function Welcome(props: Props) {
  const { images = [] } = props;
  return (
    <main className="flex items-center justify-center pt-16 pb-4">
      <div className="flex-1 flex flex-col items-center gap-16 min-h-0">
        <p>behold, an image!</p>
        {images.map((image) => (
          <div key={image.fileName} className="p-4">
            <img src={image.url} alt={image.fileName} className="max-w-xs" />
          </div>
        ))}
      </div>
    </main>
  );
}
