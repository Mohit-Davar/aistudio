import { LocationChildrenSection } from '@/app/pages/locations/detail/components/location-children-card';
import { LocationDevicesSection } from '@/app/pages/locations/detail/components/location-devices-section';
import { useLocationActions } from '@/app/pages/locations/shared/hooks/use-location-actions';
import { getLocationPath } from '@/app/pages/locations/shared/lib/get-location-path';
import type { Location } from '@/app/pages/locations/shared/types';
import { PageHeader, type PageMenuItem } from '@/app/shared/components/layout/page-header';
import { Button } from '@/app/shared/components/ui/button';
import { PencilSimpleIcon, PlusIcon, TrashIcon } from '@phosphor-icons/react';
import { useMemo } from 'react';

interface LocationDetailsProps {
  location: Location;
  locationsById: Map<string, Location>;
}

export function LocationDetails({ location, locationsById }: LocationDetailsProps) {
  const { openCreate, openRename, openDelete, can } = useLocationActions();

  const directChildren = useMemo(
    () => Array.from(locationsById.values()).filter((item) => item.parent_id === location.id),
    [locationsById, location.id],
  );

  const path = useMemo(() => getLocationPath(location, locationsById), [location, locationsById]);

  const parent = path.length > 1 ? path[path.length - 2] : undefined;

  const menu: PageMenuItem[] = [];

  if (can.update) {
    menu.push({
      label: 'Rename',
      icon: PencilSimpleIcon,
      onSelect: () => openRename(location.id),
    });
  }
  if (can.delete) {
    menu.push({
      label: 'Delete',
      icon: TrashIcon,
      destructive: true,
      onSelect: () => openDelete(location.id),
    });
  }

  return (
    <>
      <PageHeader
        back={
          parent
            ? { to: `/locations/${parent.id}`, label: parent.name }
            : { to: '/locations', label: 'Locations' }
        }
        title={location.name}
        menu={menu}
        actions={
          can.create &&
          location.can_have_children && (
            <Button size="sm" onClick={() => openCreate(location.id)}>
              <PlusIcon /> Add sub-location
            </Button>
          )
        }
      />

      {location.can_have_children ? (
        <LocationChildrenSection location={location} childrenLocations={directChildren} />
      ) : (
        <LocationDevicesSection locationId={location.id} />
      )}
    </>
  );
}
