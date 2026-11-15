import { useMemo } from 'react';

import type { Location } from '@/app/pages/locations/shared/types';
import { getLocationPathLabel } from '@/app/pages/locations/shared/lib/get-location-path';

export interface DeviceSpotOption {
  id: string;
  label: string;
  location: Location;
}

/**
 * Filter non-parent locations (spots) and label each with its full hierarchical path.
 */
export function getDeviceSpotOptions(locations: Location[]): DeviceSpotOption[] {
  const byId = new Map(locations.map((location) => [location.id, location]));

  return locations
    .filter((location) => !location.can_have_children)
    .map((location) => ({
      id: location.id,
      label: getLocationPathLabel(location, byId),
      location,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

export function useDeviceSpotOptions(locations: Location[]): DeviceSpotOption[] {
  return useMemo(() => getDeviceSpotOptions(locations), [locations]);
}
