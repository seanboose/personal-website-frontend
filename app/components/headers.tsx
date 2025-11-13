import type { ReactNode } from 'react';

export const H1 = ({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <h1
      className={`drop-shadow-[0.375rem_0.375rem_0px] drop-shadow-nav-unselected uppercase ${className}`}
    >
      {children}
    </h1>
  );
};
