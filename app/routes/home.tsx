import type { Route } from './+types/home';
import { Welcome } from '../welcome/welcome';
import { useEffect } from 'react';
import { data } from 'react-router';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'New React Router App' },
    { name: 'description', content: 'Welcome to React Router!' },
  ];
}

export default function Home() {
  useEffect(() => {
    const callback = async () => {
      const res = await fetch(
        'https://personal-website-backend-fvac.onrender.com/api/hello'
      );
      const payload: { message: string } = await res.json();
      console.log(payload.message);
    };
    callback();
  }, []);

  return <Welcome />;
}
