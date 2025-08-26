import type { Route } from './+types/home';
import { Welcome } from '../welcome/welcome';
import { useEffect } from 'react';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'New React Router App' },
    { name: 'description', content: 'Welcome to React Router!' },
  ];
}

export default function Home() {
  useEffect(() => {
    const callback = async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/hello`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const payload: { message: string } = await res.json();
      console.log(payload.message);
    };
    callback();
  }, []);

  return <Welcome />;
}
