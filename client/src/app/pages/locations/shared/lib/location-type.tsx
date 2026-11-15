import type { IconWeight } from '@phosphor-icons/react';

import type { Location } from '@/app/pages/locations/shared/types';
import { AreaIcon, SpotIcon } from '@/app/shared/components/icons/location-type-icons';

const LOCATION_TYPES = {
  area: {
    label: 'Area',
    hint: 'Can contain sub-locations',
    Icon: AreaIcon,
  },
  spot: {
    label: 'Spot',
    hint: 'Where devices are installed',
    Icon: SpotIcon,
  },
} as const;

export function getLocationType(location: Pick<Location, 'can_have_children'>) {
  return location.can_have_children ? LOCATION_TYPES.area : LOCATION_TYPES.spot;
}

export function LocationTypeIcon({
  location,
  size = 18,
  weight = 'duotone',
  className,
}: {
  location: Pick<Location, 'can_have_children'>;
  size?: number;
  weight?: IconWeight;
  className?: string;
}) {
  const Icon = getLocationType(location).Icon;

  return <Icon size={size} weight={weight} className={className} aria-hidden="true" />;
}
