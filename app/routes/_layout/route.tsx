import { Outlet } from 'react-router';

import { Footer } from './footer';
import { Header } from './header';

export default function Layout() {
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-1 w-full max-w-6xl mx-auto px-4 my-4 items-center">
          <Outlet />
        </div>
        <Footer />
      </div>
    </>
  );
}
