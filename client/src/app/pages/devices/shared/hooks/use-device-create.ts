import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

import { useOrganisationContext } from '@/app/pages/(organisation)/context';
import { useDeviceActions } from '@/app/pages/devices/shared/hooks/use-device-actions';
import { useCreateDevice } from '@/app/pages/devices/shared/hooks/use-device-mutations';
import { useDeviceSpotOptions } from '@/app/pages/devices/shared/lib/device-spots';
import { useFetchLocations } from '@/app/pages/locations/shared/hooks/use-location-queries';
import { useFetchTemplates } from '@/app/pages/templates/shared/hooks/use-template-queries';
import { toast } from '@/app/shared/hooks/use-toast';
import { getErrorMessage } from '@/app/shared/utils/error-message';

export const deviceCreateSchema = z.object({
  template_id: z.string().min(1, 'Please choose a template.'),
  name: z.string().min(1, 'Device name is required.').max(160),
  location_id: z.string().min(1, 'Please choose a spot.'),
});

export type DeviceCreateFormValues = z.infer<typeof deviceCreateSchema>;

export interface CreatedDeviceState {
  deviceId: string;
  key: string;
}

export function useDeviceCreate() {
  const navigate = useNavigate();
  const { organisation } = useOrganisationContext();
  const { action, closeDialog } = useDeviceActions();

  const isOpen = action === 'create';

  const { data: locations = [] } = useFetchLocations(organisation.id);
  const { data: templates = [] } = useFetchTemplates(organisation.id);
  const { mutateAsync: create, isPending: isCreating } = useCreateDevice(organisation.id);

  const spots = useDeviceSpotOptions(locations);

  const [created, setCreated] = useState<CreatedDeviceState | null>(null);

  const form = useForm<DeviceCreateFormValues>({
    resolver: zodResolver(deviceCreateSchema),
    defaultValues: { template_id: '', name: '', location_id: '' },
  });

  const finish = () => {
    if (created) {
      void navigate(`/devices/${created.deviceId}`);
    } else {
      closeDialog();
    }
  };

  const handleClose = () => {
    setCreated(null);
    form.reset({ template_id: '', name: '', location_id: '' });
    finish();
  };

  const submit = async (values: DeviceCreateFormValues) => {
    try {
      const result = await create({ ...values, name: values.name.trim() });
      setCreated({ deviceId: result.id, key: result.device_key });
      toast({ variant: 'success', title: 'Device registered successfully' });
    } catch (cause: unknown) {
      form.setError('root', {
        message: getErrorMessage(cause, 'Unable to register device.'),
      });
    }
  };

  return {
    form,
    isOpen,
    isCreating,
    created,
    templates,
    spots,
    submit,
    finish,
    handleClose,
    closeDialog,
  };
}
