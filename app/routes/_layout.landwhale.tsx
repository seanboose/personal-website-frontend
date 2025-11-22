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
  return (
    <div className="relative w-[200px] h-[409px]">
      <img
        className={imgClassname}
        alt="base"
        src={getS3Url('/assets/landwhale/base.png')}
      />
      {upgrades.map((upgrade) => (
        <img
          className={imgClassname}
          alt={upgrade}
          src={getS3Url(`/assets/landwhale/${upgrade}.png`)}
        />
      ))}
    </div>
  );
}
