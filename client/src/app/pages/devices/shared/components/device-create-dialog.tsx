import { Controller } from 'react-hook-form';

import { DeviceKeyPanel } from '@/app/pages/devices/shared/components/device-key-panel';
import { useDeviceCreate } from '@/app/pages/devices/shared/hooks/use-device-create';
import { LocationTypeIcon } from '@/app/pages/locations/shared/lib/location-type';
import { Button } from '@/app/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/app/shared/components/ui/dialog';
import { Field, FieldError, FieldLabel } from '@/app/shared/components/ui/field';
import { Input } from '@/app/shared/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/shared/components/ui/select';

export function DeviceCreateDialog() {
  const {
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
  } = useDeviceCreate();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isCreating && handleClose()}>
      <DialogContent>
        {created ? (
          <DeviceKeyPanel deviceKey={created.key} onDone={finish} />
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Add device</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={(event) => void handleSubmit(submit)(event)}
              className="space-y-4"
              noValidate
            >
              <Field>
                <FieldLabel htmlFor="device-create-template" required>
                  Template
                </FieldLabel>
                <Controller
                  name="template_id"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange} disabled={isCreating}>
                      <SelectTrigger
                        id="device-create-template"
                        className="w-full"
                        aria-invalid={Boolean(errors.template_id)}
                        ref={field.ref}
                      >
                        <SelectValue placeholder="Select a template" />
                      </SelectTrigger>
                      <SelectContent>
                        {templates.map((template) => (
                          <SelectItem key={template.id} value={template.id}>
                            {template.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.template_id && (
                  <FieldError>{errors.template_id.message}</FieldError>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="device-create-name" required>
                  Device name
                </FieldLabel>
                <Input
                  id="device-create-name"
                  placeholder="e.g. Knitting machine 07"
                  maxLength={160}
                  disabled={isCreating}
                  aria-invalid={Boolean(errors.name)}
                  {...register('name')}
                />
                <FieldError>{errors.name?.message}</FieldError>
              </Field>

              <Field>
                <FieldLabel htmlFor="device-create-location" required>
                  Spot
                </FieldLabel>
                <Controller
                  name="location_id"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange} disabled={isCreating}>
                      <SelectTrigger
                        id="device-create-location"
                        className="w-full"
                        aria-invalid={Boolean(errors.location_id)}
                        ref={field.ref}
                      >
                        <SelectValue placeholder="Select a spot" />
                      </SelectTrigger>
                      <SelectContent>
                        {spots.map((spot) => (
                          <SelectItem key={spot.id} value={spot.id}>
                            <LocationTypeIcon location={spot.location} className="text-primary" />
                            {spot.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.location_id ? (
                  <FieldError>{errors.location_id.message}</FieldError>
                ) : (
                  spots.length === 0 && (
                    <p className="text-muted-foreground text-xs">
                      Devices are installed at spots. Create one in Locations.
                    </p>
                  )
                )}
              </Field>

              <FieldError>{errors.root?.message}</FieldError>

              <DialogFooter>
                <Button type="button" variant="outline" disabled={isCreating} onClick={closeDialog}>
                  Cancel
                </Button>
                <Button type="submit" loading={isCreating} loadingText="Adding…">
                  Add device
                </Button>
              </DialogFooter>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
