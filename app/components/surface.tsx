import type { ReactNode } from 'react';

import { Divider } from '~/components/divider';

export const Surface = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col px-1 bg-surface drop-shadow-[0.125rem_0.125rem_0px] drop-shadow-nav-unselected">
      <Divider />
      <div className="flex-1">{children}</div>
      <Divider />
    </div>
  );
};
