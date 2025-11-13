import { NavBanner } from './navBanner';

export const Footer = () => {
  return (
    <div
      className={`pl-10 pr-10 border-t-2 border-primary w-full h-10 bg-background`}
    >
      <NavBanner />
    </div>
  );
};
