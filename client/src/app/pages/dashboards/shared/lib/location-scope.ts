import type { Device } from '@/app/pages/devices/shared/types';
import { getLocationPath, getLocationPathLabel } from '@/app/pages/locations/shared/lib/get-location-path';
import { getLocationType } from '@/app/pages/locations/shared/lib/location-type';
import type { Location } from '@/app/pages/locations/shared/types';

export type LocationOption = { id: string; label: string; location: Location };

/** Locations labelled with their full path and type, sorted alphabetically. */
export function toLocationOptions(
  locations: Location[],
  locationsById: Map<string, Location>,
): LocationOption[] {
  return locations
    .map((location) => ({
      id: location.id,
      label: `${getLocationPathLabel(location, locationsById)} · ${getLocationType(location).label}`,
      location,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

/** The location and every location nested inside it, however deep. */
export function descendantLocationIds(locations: Location[], rootId: string) {
  const ids = new Set([rootId]);

  let grew = true;

  while (grew) {
    grew = false;
    for (const location of locations) {
      if (!location.parent_id || !ids.has(location.parent_id) || ids.has(location.id)) {
        continue;
      }
      ids.add(location.id);
      grew = true;
    }
  }

  return ids;
}

function isWithin(location: Location | undefined, ancestorId: string, locationsById: Map<string, Location>) {
  if (!location) {
    return false;
  }

  return getLocationPath(location, locationsById).some((item) => item.id === ancestorId);
}

/**
 * Locations and devices the dashboard bar can filter by: everything inside the dashboard's
 * location (or the whole organisation), with devices narrowed by the chosen location.
 * A template dashboard offers only the template's devices and no location filter, because
 * analytics scopes combine as a union and a location would pull in other templates' devices.
 */
export function dashboardFilterOptions(
  locations: Location[],
  devices: Device[],
  dashboardLocationId: string | null,
  filterLocationId: string | null,
  dashboardTemplateId: string | null = null,
) {
  if (dashboardTemplateId) {
    return {
      locationOptions: [],
      deviceOptions: devices.filter((device) => device.template_id === dashboardTemplateId),
    };
  }

  const byId = new Map(locations.map((location) => [location.id, location]));

  const inScope = new Set<string>();

  for (const location of locations) {
    if (dashboardLocationId && !isWithin(location, dashboardLocationId, byId)) {
      continue;
    }
    inScope.add(location.id);
  }
  const underFilter = (locationId: string) => {
    if (!filterLocationId) {
      return true;
    }

    return isWithin(byId.get(locationId), filterLocationId, byId);
  };

  return {
    locationOptions: toLocationOptions(
      locations.filter((location) => inScope.has(location.id) && location.id !== dashboardLocationId),
      byId,
    ),
    deviceOptions: devices.filter(
      (device) => inScope.has(device.location_id) && underFilter(device.location_id),
    ),
  };
}
