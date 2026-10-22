import type { ReactNode } from 'react';

export const Toggle = ({
  children,
  onClick,
  active,
}: {
  children: ReactNode;
  onClick: () => void;
  active: boolean;
}) => {
  return (
    <button type="button" onClick={onClick}>
      <div className="group cursor-pointer hover:text-text-selected border-background-selected">
        <div className="flex flex-row items-center p-1 group-hover:bg-background-selected">
          <div
            className={`w-3 h-3 mx-1 ${active ? 'bg-text-body group-hover:bg-text-selected' : 'border-2 border-text-body group-hover:border-text-selected'}`}
          />
          {children}
        </div>
      </div>
    </button>
  );
};
