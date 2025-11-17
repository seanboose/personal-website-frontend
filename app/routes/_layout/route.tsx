import { Outlet } from 'react-router';

import { Footer } from './footer';
import { Header } from './header';

export default function Layout() {
  return (
    <>
      <div className="flex flex-col min-h-screen">
        {/*<div className="w-full max-w-6xl mx-auto px-4">*/}
        <Header />
        {/*</div>*/}
        <div className="flex-1 w-full max-w-6xl mx-auto px-4 my-4">
          <Outlet />
        </div>
        <Footer />
      </div>
    </>
  );
}
