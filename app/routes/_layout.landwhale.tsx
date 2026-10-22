import { useCallback, useState } from 'react';

import { Toggle } from '~/components/button';
import { HeaderedSurface } from '~/components/headeredSurface';
import { RowStart } from '~/components/rowStart';
import { Surface } from '~/components/surface';
import { H1 } from '~/components/typography';

export function meta() {
  return [{ title: 'landwhale | sean boose' }];
}

const upgrades = [
  'backpack',
  'gold-flipper',
  'scanner',
  'spikes',
  'spine-eyes',
];

export default function Landwhale() {
  const imgClassname = 'absolute inset-0 w-full h-full object-contain';
  const [visibility, setVisibility] = useState<Record<string, boolean>>(
    upgrades.reduce((acc, upgrade) => ({ ...acc, [upgrade]: false }), {}),
  );
  const toggleItem = useCallback(
    (upgrade: string) => {
      setVisibility({ ...visibility, [upgrade]: !visibility[upgrade] });
    },
    [visibility],
  );
  return (
    <div className="flex flex-col gap-4">
      <H1>equip the landwhale</H1>
      <div className="flex flex-col md:flex-row gap-4">
        <RowStart />
        <Surface className="flex-1">
          <div className="flex flex-col gap-2">
            <p>
              oh no, the poor landwhale is about to embark on a harrowing
              mission to save all existence from a mysterious plague that has
              fallen upon the global subconscious and it forgot to equip all of
              its upgrades!
            </p>
            <p>
              press the buttons to equip the landwhale's upgrades and prepare
              for the mission!
            </p>
            <div className="flex flex-col">
              {upgrades.map((upgrade) => (
                <Toggle
                  key={upgrade}
                  active={visibility[upgrade]}
                  onClick={() => toggleItem(upgrade)}
                >
                  {upgrade.replace('-', ' ')}
                </Toggle>
              ))}
            </div>
          </div>
        </Surface>
        <HeaderedSurface header="Current Loadout" className="flex-1">
          <div className="h-full flex items-center justify-center">
            <div className="relative bg-nav-unselected w-xs aspect-square">
              <img
                className={imgClassname}
                alt="base"
                src="/assets/landwhale/base.png"
              />
              {upgrades.map((upgrade) => (
                <img
                  key={upgrade}
                  className={`${imgClassname} ${visibility[upgrade] ? '' : 'invisible'}`}
                  alt={upgrade}
                  src={`/assets/landwhale/${upgrade}.png`}
                />
              ))}
            </div>
          </div>
        </HeaderedSurface>
      </div>
    </div>
  );
}
