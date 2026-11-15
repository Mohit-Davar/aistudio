import { createCustomIcon } from '@/app/shared/components/icons/custom-icon';

/** Soft 4-point sparkle, the little "cute" accent. */
const Sparkle = ({ cx, cy, r }: { cx: number; cy: number; r: number }) => (
  <path
    d={`M${cx} ${cy - r} Q${cx} ${cy} ${cx + r} ${cy} Q${cx} ${cy} ${cx} ${cy + r} Q${cx} ${cy} ${cx - r} ${cy} Q${cx} ${cy} ${cx} ${cy - r} Z`}
    fill="currentColor"
    stroke="currentColor"
    strokeWidth={6}
  />
);

/* Dashboard: pillowy tiles, mixing squares and circles */
const dashTiles = (
  <>
    <rect x="36" y="36" width="84" height="84" rx="30" />
    <circle cx="176" cy="78" r="42" />
    <circle cx="78" cy="178" r="42" />
    <rect x="136" y="136" width="84" height="84" rx="30" />
  </>
);

export const CustomDashboardIcon = createCustomIcon('CustomDashboardIcon', dashTiles, dashTiles);

/* Devices: round sensor puck sending out signal waves */
const puck = <rect x="36" y="108" width="136" height="108" rx="40" />;

export const CustomDeviceIcon = createCustomIcon(
  'CustomDeviceIcon',
  <>
    {puck}
    <circle cx="104" cy="162" r="12" fill="currentColor" stroke="none" />
    <circle cx="172" cy="84" r="10" fill="currentColor" stroke="none" />
    <path d="M172 56 A28 28 0 0 1 200 84" />
    <path d="M172 32 A52 52 0 0 1 224 84" />
  </>,
  puck,
);

/* Templates: soft UI card with a sparkle */
const card = <rect x="28" y="72" width="168" height="144" rx="36" />;

export const CustomTemplateIcon = createCustomIcon(
  'CustomTemplateIcon',
  <>
    {card}
    <circle cx="72" cy="114" r="12" fill="currentColor" stroke="none" />
    <path d="M104 114 H158" />
    <rect x="64" y="148" width="96" height="36" rx="14" />
    <Sparkle cx={210} cy={52} r={22} />
  </>,
  card,
);

const locationPin = (
  <path d="M128 228 C128 228 48 164 48 100 A80 80 0 0 1 208 100 C208 164 128 228 128 228 Z" />
);

export const CustomLocationIcon = createCustomIcon(
  'CustomLocationIcon',
  <>
    {locationPin}
    <path
      d="M128 126 C100 108 92 90 100 78 C108 66 126 70 128 86 C130 70 148 66 156 78 C164 90 156 108 128 126 Z"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth={6}
    />
  </>,
  locationPin,
);
