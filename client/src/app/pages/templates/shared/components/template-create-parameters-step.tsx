import { useCallback } from 'react';

import { ParameterPicker } from '@/app/pages/templates/shared/components/parameter-picker';
import type { CreateFormValues } from '@/app/pages/templates/shared/hooks/use-template-create';
import type { TemplateParameterInput } from '@/app/pages/templates/shared/types';
import { Button } from '@/app/shared/components/ui/button';
import { DialogFooter, DialogHeader, DialogTitle } from '@/app/shared/components/ui/dialog';
import { FieldError } from '@/app/shared/components/ui/field';
import type { UseFormReturn } from 'react-hook-form';

interface ParametersStepProps {
  form: UseFormReturn<CreateFormValues>;
  templateName: string;
  parameters: TemplateParameterInput[];
  onParametersChange: (
    value: TemplateParameterInput[] | ((prev: TemplateParameterInput[]) => TemplateParameterInput[]),
  ) => void;
  isCreating: boolean;
  onBack: () => void;
  onCreate: () => void;
}

export function ParametersStep({
  form,
  templateName,
  parameters,
  onParametersChange,
  isCreating,
  onBack,
  onCreate,
}: ParametersStepProps) {
  const focusOnMount = useCallback((node: HTMLHeadingElement | null) => {
    node?.focus();
  }, []);

  return (
    <>
      <DialogHeader>
        <DialogTitle ref={focusOnMount} tabIndex={-1} className="truncate outline-none">
          What does a {templateName} send?
        </DialogTitle>
      </DialogHeader>

      <div className="-mx-1 min-h-0 flex-1 px-1 py-1">
        <ParameterPicker value={parameters} onChange={onParametersChange} disabled={isCreating} />
        <div role="alert" className="mt-2">
          <FieldError>{form.formState.errors.root?.message}</FieldError>
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="destructive" disabled={isCreating} onClick={onBack}>
          Cancel
        </Button>
        <Button type="button" loading={isCreating} loadingText="Creating…" onClick={onCreate}>
          Create template
        </Button>
      </DialogFooter>
    </>
  );
}
