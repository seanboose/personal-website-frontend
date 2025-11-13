import { Outlet } from 'react-router';

import { Footer } from './footer';
import { Header } from './header';

export default function Layout() {
  return (
    <>
      <div className="flex flex-col">
        <Header />
        <div className="pl-10 pr-10">
          <Outlet />
        </div>
        <Footer />
      </div>
    </>
  );
}
