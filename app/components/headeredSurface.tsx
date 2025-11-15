import type { ReactNode } from 'react';

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
        <h2>{header}</h2>
      </div>
      <div className="px-4 py-2">{children}</div>
    </div>
  );
};
