import { Outlet } from 'react-router';

import { Footer } from './footer';
import { Header } from './header';

export default function Layout() {
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-1 pl-10 pr-10">
          <Outlet />
        </div>
        <Footer />
      </div>
    </>
  );
}
