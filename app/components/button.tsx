import type { ButtonHTMLAttributes, ReactNode } from 'react';

export const Button = ({
  children,
  onClick,
  type = 'submit',
}: {
  children: ReactNode;
  onClick: () => void;
  type?: ButtonHTMLAttributes<unknown>['type'];
}) => {
  return (
    <button type={type} onClick={onClick}>
      <div className="group  cursor-pointer py-1 hover:border-y-2 hover:py-0.5 hover:text-text-selected border-background-selected">
        <div className="flex flex-row items-center p-1 bg-nav-selected group-hover:bg-background-selected">
          <div
            className={`w-3 h-3 mx-1 bg-text-body group-hover:bg-text-selected`}
          />
          {children}
        </div>
      </div>
    </button>
  );
};
