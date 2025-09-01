import type { Route } from './+types/home';
import { Welcome } from '../welcome/welcome';
import { useEffect, useState } from 'react';
import { type ImageData } from '@seanboose/personal-website-api-types';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Sean Boose Party Bus' },
    { name: 'description', content: 'Welcome to my site!!' },
  ];
}

export default function Home() {
  const [images, setImages] = useState<ImageData[]>([]);

  useEffect(() => {
    const callback = async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/images/list/`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const payload: { images: ImageData[] } = await res.json();
      setImages(payload.images || []);
    };
    callback();
  }, []);

  return <Welcome images={images} />;
}
