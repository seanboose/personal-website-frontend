import type { ReactNode } from 'react';

export const TextBox = ({ children }: { children: ReactNode }) => {
  return (
    <div className="bg-surface drop-shadow-[0.125rem_0.125rem_0px] drop-shadow-nav-unselected">
      <div className="m-1 border-t-2 border-b-2 border-nav-unselected">
        {children}
      </div>
    </div>
  );
};
