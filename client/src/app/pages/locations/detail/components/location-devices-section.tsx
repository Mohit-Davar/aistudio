import { ArrowSquareOutIcon, PlusIcon } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';

import { useOrganisationContext } from '@/app/pages/(organisation)/context';
import { useFetchDevices } from '@/app/pages/devices/shared/hooks/use-device-queries';
import type { Device } from '@/app/pages/devices/shared/types';
import { CustomDeviceIcon } from '@/app/shared/components/icons/nav-icons';
import { EmptyState } from '@/app/shared/components/states/empty-state';
import { Button } from '@/app/shared/components/ui/button';
import { Spinner } from '@/app/shared/components/ui/spinner';

interface LocationDevicesSectionProps {
  locationId: string;
}

export function LocationDevicesSection({ locationId }: LocationDevicesSectionProps) {
  const { organisation } = useOrganisationContext();

  const { data: allDevices = [], isPending: isLoading, error: fetchError } = useFetchDevices(organisation.id);

  const devices = allDevices.filter((device) => device.location_id === locationId);

  const error = fetchError ? 'Unable to load devices for this spot.' : null;

  return (
    <section aria-labelledby="devices-heading" className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 id="devices-heading" className="text-foreground text-sm font-semibold tracking-tight">
          Devices
        </h2>
      </div>

      <LocationDevicesContent isLoading={isLoading} error={error} devices={devices} />
    </section>
  );
}

interface LocationDevicesContentProps {
  isLoading: boolean;
  error: string | null;
  devices: Device[];
}

function LocationDevicesContent({ isLoading, error, devices }: LocationDevicesContentProps) {
  if (isLoading) {
    return (
      <div className="border-border/70 bg-card flex min-h-40 items-center justify-center rounded-lg border p-6 shadow-xs">
        <div className="text-muted-foreground flex items-center gap-2.5 text-xs">
          <Spinner className="size-4" />
          <span>Loading devices...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="border-destructive/30 bg-destructive/5 text-destructive rounded-lg border p-4 text-xs">
        {error}
      </div>
    );
  }

  if (devices.length === 0) {
    return (
      <EmptyState
        title="No devices added yet"
        description="Add devices to this location."
        variant="card"
        action={
          <Button size="sm" asChild className="h-8 gap-1.5 px-3 text-xs">
            <Link to="/devices">
              <PlusIcon size={14} weight="bold" aria-hidden="true" />
              <span>Add device</span>
            </Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="border-border/70 bg-card divide-border/60 divide-y overflow-hidden rounded-lg border shadow-xs">
      {devices.map((device) => (
        <div
          key={device.id}
          className="hover:bg-muted/40 flex items-center justify-between gap-4 px-4 py-3 transition-colors"
        >
          <div className="flex min-w-0 items-center gap-3">
            <span
              className="border-border/60 bg-muted/40 text-muted-foreground flex size-8 shrink-0 items-center justify-center rounded-md border"
              aria-hidden="true"
            >
              <CustomDeviceIcon size={18} weight="duotone" className="text-primary" />
            </span>
            <div className="min-w-0">
              <span className="text-foreground block truncate text-sm font-medium">{device.name}</span>
              <span className="text-muted-foreground block text-xs">
                Device ID: <span className="font-mono text-[11px]">{device.id}</span>
              </span>
            </div>
          </div>

          <Button variant="ghost" size="sm" asChild className="h-8 gap-1 px-2.5 text-xs">
            <Link to={`/devices/${device.id}`} aria-label={`View ${device.name} details`}>
              <span>Details</span>
              <ArrowSquareOutIcon size={12} aria-hidden="true" />
            </Link>
          </Button>
        </div>
      ))}
    </div>
  );
}
