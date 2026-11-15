import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';

import { useOrganisationContext } from '@/app/pages/(organisation)/context';
import { useDeviceActions } from '@/app/pages/devices/shared/hooks/use-device-actions';
import { useUpdateDevice } from '@/app/pages/devices/shared/hooks/use-device-mutations';
import { useFetchDevices } from '@/app/pages/devices/shared/hooks/use-device-queries';
import { getDeviceChanges } from '@/app/pages/devices/shared/lib/device-changes';
import { useDeviceSpotOptions } from '@/app/pages/devices/shared/lib/device-spots';
import { useFetchLocations } from '@/app/pages/locations/shared/hooks/use-location-queries';
import { useFetchTemplates } from '@/app/pages/templates/shared/hooks/use-template-queries';
import { toast } from '@/app/shared/hooks/use-toast';
import { getErrorMessage } from '@/app/shared/utils/error-message';

export const deviceEditSchema = z.object({
  template_id: z.string().min(1, 'Please choose a template.'),
  name: z.string().min(1, 'Device name is required.').max(160),
  location_id: z.string().min(1, 'Please choose a spot.'),
});

export type DeviceEditFormValues = z.infer<typeof deviceEditSchema>;

const emptyValues: DeviceEditFormValues = {
  template_id: '',
  name: '',
  location_id: '',
};

export function useDeviceEdit() {
  const { organisation } = useOrganisationContext();
  const { action, targetId, closeDialog } = useDeviceActions();

  const { data: devices = [] } = useFetchDevices(organisation.id);
  const { data: locations = [] } = useFetchLocations(organisation.id);
  const { data: templates = [] } = useFetchTemplates(organisation.id);
  const { mutateAsync: update, isPending: isUpdating } = useUpdateDevice(organisation.id);

  const device = action === 'edit' && targetId ? devices.find((item) => item.id === targetId) : undefined;
  const isOpen = Boolean(device);

  const spots = useDeviceSpotOptions(locations);

  const formValues = useMemo<DeviceEditFormValues>(() => {
    if (!device) return emptyValues;
    return {
      template_id: device.template_id,
      name: device.name,
      location_id: device.location_id,
    };
  }, [device]);

  const form = useForm<DeviceEditFormValues>({
    resolver: zodResolver(deviceEditSchema),
    values: formValues,
  });

  const watchTemplateId = useWatch({ control: form.control, name: 'template_id' });
  const isTemplateChanged = Boolean(device && watchTemplateId && watchTemplateId !== device.template_id);

  const submit = async (values: DeviceEditFormValues) => {
    if (!device) return;

    try {
      const changes = getDeviceChanges(device, values);
      if (Object.keys(changes).length > 0) {
        await update({ deviceId: device.id, values: changes });
      }
      closeDialog();
      toast({ variant: 'success', title: 'Device updated' });
    } catch (cause: unknown) {
      form.setError('root', {
        message: getErrorMessage(cause, 'Unable to save device.'),
      });
    }
  };

  return {
    form,
    isOpen,
    isUpdating,
    device,
    templates,
    spots,
    isTemplateChanged,
    submit,
    closeDialog,
  };
}
