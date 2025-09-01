import { type ImageData } from '@seanboose/personal-website-api-types';
import { useEffect, useState } from 'react';

import { api } from '../shared/api';
import { Welcome } from '../welcome/welcome';

export function meta() {
  return [
    { title: 'Sean Boose Party Bus' },
    { name: 'description', content: 'Welcome to my site!!' },
  ];
}

export default function Home() {
  const [images, setImages] = useState<ImageData[]>([]);

  useEffect(() => {
    const callback = async () => {
      const payload = await api.images.list();
      setImages(payload.images || []);
    };
    callback();
  }, []);

  return <Welcome images={images} />;
}
