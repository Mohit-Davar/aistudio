import { PencilSimpleIcon, TrashIcon } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';

import { useDeviceActions } from '@/app/pages/devices/shared/hooks/use-device-actions';
import type { Device } from '@/app/pages/devices/shared/types';
import { LocationTypeIcon } from '@/app/pages/locations/shared/lib/location-type';
import type { Location } from '@/app/pages/locations/shared/types';
import { DataTable, type DataTableColumn } from '@/app/shared/components/data-table';
import { RowActions } from '@/app/shared/components/row-actions';

type DevicesTableProps = {
  devices: Device[];
  locationsById: Map<string, Location>;
};

export function DevicesTable({ devices, locationsById }: DevicesTableProps) {
  const { openEdit, openDelete, can } = useDeviceActions();

  const columns: DataTableColumn<Device>[] = [
    {
      id: 'name',
      header: 'Name',
      cell: (device) => (
        <Link
          to={`/devices/${device.id}`}
          className="text-foreground group-hover:text-primary group-focus-within:text-primary font-medium transition-colors"
        >
          {device.name}
        </Link>
      ),
    },
    {
      id: 'template',
      header: 'Template',
      cell: (device) => (
        <Link to={`/templates/${device.template_id}`} className="hover:text-primary">
          {device.template_name}
        </Link>
      ),
    },
    {
      id: 'location',
      header: 'Spot',
      className: 'text-muted-foreground',
      cell: (device) => {
        const location = locationsById.get(device.location_id);

        return location ? (
          <Link
            to={`/locations/${location.id}`}
            className="hover:text-foreground inline-flex items-center gap-1.5"
          >
            <LocationTypeIcon location={location} size={16} className="text-primary shrink-0" />
            {location.name}
          </Link>
        ) : (
          '—'
        );
      },
    },
    {
      id: 'actions',
      header: <span className="sr-only">Actions</span>,
      className: 'w-14 text-right',
      cell: (device) => (
        <RowActions
          label={device.name}
          actions={[
            can.update && {
              key: 'edit',
              label: 'Edit',
              icon: <PencilSimpleIcon size={14} />,
              onClick: () => openEdit(device.id),
            },
            can.delete && 'separator',
            can.delete && {
              key: 'delete',
              label: 'Delete',
              icon: <TrashIcon size={14} />,
              destructive: true,
              onClick: () => openDelete(device.id),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={devices}
      getRowId={(device) => device.id}
      getRowHref={(device) => `/devices/${device.id}`}
    />
  );
}
