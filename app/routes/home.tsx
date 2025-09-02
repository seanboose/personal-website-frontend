import { useLoaderData } from 'react-router';

import { api, fetchGrantAuth } from '../shared/api';
import { Welcome } from '../welcome/welcome';

export function meta() {
  return [
    { title: 'Sean Boose Party Bus' },
    { name: 'description', content: 'Welcome to my site!!' },
  ];
}

export const loader = async () => {
  await fetchGrantAuth();
  const { images = [] } = await api.images.list();
  return { images };
};

export default function Home() {
  const { images } = useLoaderData<typeof loader>();

  return <Welcome images={images} />;
}
