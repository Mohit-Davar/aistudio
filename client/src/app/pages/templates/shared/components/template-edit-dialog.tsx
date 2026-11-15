import { useTemplateEdit } from '@/app/pages/templates/shared/hooks/use-template-edit';
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
import { Textarea } from '@/app/shared/components/ui/textarea';

const DETAILS_FORM_ID = 'template-edit-details-form';

export function TemplateEditDialog() {
  const { form, isOpen, isUpdating, submit, closeDialog } = useTemplateEdit();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isUpdating && closeDialog()}>
      <DialogContent className="flex flex-col gap-4">
        <DialogHeader>
          <DialogTitle>Edit template</DialogTitle>
        </DialogHeader>

        <form
          id={DETAILS_FORM_ID}
          onSubmit={(event) => void handleSubmit(submit)(event)}
          className="space-y-4"
          noValidate
        >
          <Field>
            <FieldLabel htmlFor="template-name" required>
              Name
            </FieldLabel>
            <Input
              id="template-name"
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
              placeholder="e.g. Knitting machine, Cold room sensor"
              maxLength={160}
              disabled={isUpdating}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? 'template-name-error' : undefined}
              {...register('name')}
            />
            <div id="template-name-error" role="alert">
              <FieldError>{errors.name?.message}</FieldError>
            </div>
          </Field>

          <Field>
            <FieldLabel htmlFor="template-description">Description</FieldLabel>
            <Textarea
              id="template-description"
              rows={3}
              maxLength={2000}
              disabled={isUpdating}
              {...register('description')}
            />
          </Field>

          <div role="alert">
            <FieldError>{errors.root?.message}</FieldError>
          </div>
        </form>

        <DialogFooter>
          <Button type="button" variant="destructive" disabled={isUpdating} onClick={closeDialog}>
            Cancel
          </Button>
          <Button type="submit" form={DETAILS_FORM_ID} loading={isUpdating} loadingText="Saving…">
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
