import type { ReactNode } from 'react';

import { H2 } from '~/components/typography';

export const HeaderedSurface = ({
  children,
  header,
}: {
  children: ReactNode;
  header: ReactNode;
}) => {
  return (
    <div className="flex flex-col bg-surface">
      <div className="bg-background-selected text-text-selected py-1 px-4">
        <H2>{header}</H2>
      </div>
      <div className="px-4 py-2">{children}</div>
    </div>
  );
};
