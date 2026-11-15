import { Controller } from 'react-hook-form';

import { useDeviceEdit } from '@/app/pages/devices/shared/hooks/use-device-edit';
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

export function DeviceEditDialog() {
  const {
    form,
    isOpen,
    isUpdating,
    templates,
    spots,
    isTemplateChanged,
    submit,
    closeDialog,
  } = useDeviceEdit();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isUpdating && closeDialog()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit device</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={(event) => void handleSubmit(submit)(event)}
          className="space-y-4"
          noValidate
        >
          <Field>
            <FieldLabel htmlFor="device-edit-template" required>
              Template
            </FieldLabel>
            <Controller
              name="template_id"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange} disabled={isUpdating}>
                  <SelectTrigger
                    id="device-edit-template"
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
            <FieldLabel htmlFor="device-edit-name" required>
              Device name
            </FieldLabel>
            <Input
              id="device-edit-name"
              placeholder="e.g. Knitting machine 07"
              maxLength={160}
              disabled={isUpdating}
              aria-invalid={Boolean(errors.name)}
              {...register('name')}
            />
            <FieldError>{errors.name?.message}</FieldError>
          </Field>

          <Field>
            <FieldLabel htmlFor="device-edit-location" required>
              Spot
            </FieldLabel>
            <Controller
              name="location_id"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange} disabled={isUpdating}>
                  <SelectTrigger
                    id="device-edit-location"
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

          {isTemplateChanged && (
            <p className="text-muted-foreground rounded-md border border-amber-500/30 bg-amber-500/5 p-3 text-xs">
              The device will start reporting the new template&apos;s parameters. Readings already
              recorded are kept.
            </p>
          )}

          <FieldError>{errors.root?.message}</FieldError>

          <DialogFooter>
            <Button type="button" variant="outline" disabled={isUpdating} onClick={closeDialog}>
              Cancel
            </Button>
            <Button type="submit" loading={isUpdating} loadingText="Saving…">
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
