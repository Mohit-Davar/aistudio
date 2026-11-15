import { ArrowRightIcon } from '@phosphor-icons/react';

import type { CreateFormValues } from '@/app/pages/templates/shared/hooks/use-template-create';
import { Button } from '@/app/shared/components/ui/button';
import { DialogFooter, DialogHeader, DialogTitle } from '@/app/shared/components/ui/dialog';
import { Field, FieldError, FieldLabel } from '@/app/shared/components/ui/field';
import { Input } from '@/app/shared/components/ui/input';
import { Textarea } from '@/app/shared/components/ui/textarea';
import type { UseFormReturn } from 'react-hook-form';

const DETAILS_FORM_ID = 'template-create-details-form';

interface DetailsStepProps {
  form: UseFormReturn<CreateFormValues>;
  isSubmitting: boolean;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
}

export function DetailsStep({ form, isSubmitting, onSubmit, onCancel }: DetailsStepProps) {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <>
      <DialogHeader>
        <DialogTitle>New template</DialogTitle>
      </DialogHeader>

      <div className="-mx-1 min-h-0 flex-1 overflow-y-auto px-1 py-1">
        <form id={DETAILS_FORM_ID} onSubmit={onSubmit} className="space-y-4" noValidate>
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
              disabled={isSubmitting}
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
              disabled={isSubmitting}
              {...register('description')}
            />
          </Field>

          <div role="alert">
            <FieldError>{errors.root?.message}</FieldError>
          </div>
        </form>
      </div>

      <DialogFooter>
        <Button type="button" variant="destructive" disabled={isSubmitting} onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" form={DETAILS_FORM_ID} loading={isSubmitting} loadingText="Next…">
          Next
          <ArrowRightIcon aria-hidden="true" />
        </Button>
      </DialogFooter>
    </>
  );
}
