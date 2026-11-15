import {
  DeviceDeleteDialog,
  DeviceRotateKeyDialog,
} from '@/app/pages/devices/shared/components/device-action-dialogs';
import { DeviceCreateDialog } from '@/app/pages/devices/shared/components/device-create-dialog';
import { DeviceEditDialog } from '@/app/pages/devices/shared/components/device-edit-dialog';

export function DeviceDialogs() {
  return (
    <>
      <DeviceCreateDialog />
      <DeviceEditDialog />
      <DeviceDeleteDialog />
      <DeviceRotateKeyDialog />
    </>
  );
}
