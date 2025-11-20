import { NavLink } from 'react-router';

import { RowStart } from '~/components/rowStart';
import { paths } from '~/shared/paths';

import { NavBanner } from './navBanner';

export const Header = () => {
  return (
    <>
      <div className="border-b-2 border-border pt-6 overflow-x-auto">
        <div className="w-full max-w-6xl mx-auto px-4">
          <div className="flex flex-row justify-start gap-8">
            <RowStart className={'mb-4'} />
            <HeaderItem label={'home'} route={paths.home} />
            <HeaderItem label={'images'} route={paths.imageDisplay} />
          </div>
        </div>
      </div>
      <div className="pl-10 pr-10">
        <NavBanner />
      </div>
    </>
  );
};

const HeaderItem = ({ label, route }: { label: string; route: string }) => {
  return (
    <NavLink
      to={route}
      className={({ isActive }) => {
        const background = isActive ? 'bg-nav-selected' : 'bg-nav-unselected';
        const spacing = isActive ? 'pb-6' : 'pb-2 mb-4';
        return `p-2 w-30 flex flex-row items-center hover:bg-background-selected ${spacing} ${background}`;
      }}
    >
      {({ isActive }) => {
        const text = isActive
          ? 'text-text-selected-shaded'
          : 'text-text-body-shaded';
        const icon = isActive
          ? 'bg-text-selected-shaded'
          : 'bg-text-body-shaded';
        return (
          <>
            <div className={`w-4 h-4 mr-1 ${icon}`} />
            <p className={text}>{label.toUpperCase()}</p>
          </>
        );
      }}
    </NavLink>
  );
};
