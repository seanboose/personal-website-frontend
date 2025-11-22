import { useCallback, useState } from 'react';

import { Button } from '~/components/button';
import { HeaderedSurface } from '~/components/headeredSurface';
import { Surface } from '~/components/surface';
import { getS3Url } from '~/shared/aws';

export const loader = async () => {
  return {};
};

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
    <div className="flex flex-col md:flex-row gap-4 min-h-60">
      <Surface className="flex-1">
        <div className="flex flex-col gap-2">
          <p>
            oh no, the poor landwhale is about to embark on a harrowing mission
            to save all existence from a mysterious plague that has fallen upon
            the global subconscious and forgot to equip all of its upgrades!
          </p>
          <p>
            press the buttons to equip the landwhale's upgrades and prepare for
            the mission!
          </p>
          <div className="flex flex-col gap-2">
            {upgrades.map((upgrade) => (
              <Button onClick={() => toggleItem(upgrade)}>{upgrade}</Button>
            ))}
          </div>
        </div>
      </Surface>
      <HeaderedSurface header="Landwhale Specimen" className="flex-1">
        <div className="relative w-full h-full">
          <img
            className={imgClassname}
            alt="base"
            src={getS3Url('/assets/landwhale/base.png')}
          />
          {upgrades.map((upgrade) => (
            <img
              className={`${imgClassname} ${visibility[upgrade] ? '' : 'invisible'}`}
              alt={upgrade}
              src={getS3Url(`/assets/landwhale/${upgrade}.png`)}
            />
          ))}
        </div>
      </HeaderedSurface>
    </div>
  );
}
