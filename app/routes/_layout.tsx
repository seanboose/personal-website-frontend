import { useCallback, useState } from 'react';
import { Outlet } from 'react-router';

import { RowStart } from '~/components/rowStart';

const tabs = ['home', 'blog', 'portfolio', 'images'];

export default function Layout() {
  const [selected, setSelected] = useState<string>(tabs[0]);
  const onClick = useCallback((label: string) => {
    setSelected(label);
  }, []);
  return (
    <>
      <div className="border-b-2 border-border pt-6 pl-10 pr-10">
        <div className="flex flex-row justify-start gap-8">
          <RowStart />
          {tabs.map((tab) => (
            <HeaderItem
              label={tab}
              isSelected={selected === tab}
              onClick={onClick}
            />
          ))}
        </div>
      </div>
      <div className="pl-10 pr-10">
        <Outlet />
      </div>
      <div className="border-t-2 border-primary fixed bottom-0 left-0 w-full h-10" />
    </>
  );
}

const HeaderItem = ({
  label,
  isSelected,
  onClick,
}: {
  label: string;
  isSelected: boolean;
  onClick: (label: string) => void;
}) => {
  const text = isSelected
    ? 'text-text-selected-shaded'
    : 'text-text-body-shaded';
  const background = isSelected ? 'bg-nav-selected' : 'bg-nav-unselected';
  const spacing = isSelected ? 'pb-6' : 'pb-2 mb-4';
  const icon = isSelected ? 'bg-text-selected-shaded' : 'bg-text-body-shaded';
  return (
    <button
      className={`p-2 w-30 flex flex-row items-center hover:bg-background-selected ${spacing} ${background}`}
      onClick={() => onClick(label)}
    >
      <div className={`w-4 h-4 mr-1 ${icon}`} />
      <p className={text}>{label.toUpperCase()}</p>
    </button>
  );
};
