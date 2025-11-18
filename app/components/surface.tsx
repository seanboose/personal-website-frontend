import type { ReactNode } from 'react';

import { Divider } from '~/components/divider';

export const Surface = ({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={`flex flex-col px-1 bg-surface drop-shadow-[0.125rem_0.125rem_0px] drop-shadow-nav-unselected ${className}`}
    >
      <Divider />
      <div className="flex-1 p-4">{children}</div>
      <Divider />
    </div>
  );
};
