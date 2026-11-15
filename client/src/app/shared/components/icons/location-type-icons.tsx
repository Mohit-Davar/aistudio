import { createCustomIcon } from '@/app/shared/components/icons/custom-icon';

const areaFrame = <rect x="40" y="40" width="176" height="176" rx="36" />;

const areaCompartments = (
  <>
    <rect x="80" y="80" width="40" height="40" rx="10" />
    <rect x="136" y="80" width="40" height="40" rx="10" />
    <rect x="80" y="136" width="40" height="40" rx="10" />
    <rect x="136" y="136" width="40" height="40" rx="10" />
  </>
);

export const AreaIcon = createCustomIcon(
  'AreaIcon',
  <>
    {areaFrame}
    <g fill="currentColor" stroke="none">
      {areaCompartments}
    </g>
  </>,
  areaFrame,
);

const spotPin = <path d="M128 224 C128 224 52 164 52 108 A76 76 0 0 1 204 108 C204 164 128 224 128 224 Z" />;

export const SpotIcon = createCustomIcon(
  'SpotIcon',
  <>
    {spotPin}
    <circle cx="128" cy="108" r="24" fill="currentColor" stroke="none" />
  </>,
  spotPin,
);
