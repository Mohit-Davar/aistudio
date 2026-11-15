import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useOrganisationContext } from '@/app/pages/(organisation)/context';
import { useTemplateActions } from '@/app/pages/templates/shared/hooks/use-template-actions';
import { useUpdateTemplate } from '@/app/pages/templates/shared/hooks/use-template-mutations';
import { useFetchTemplates } from '@/app/pages/templates/shared/hooks/use-template-queries';
import { toast } from '@/app/shared/hooks/use-toast';
import { getErrorMessage } from '@/app/shared/utils/error-message';

const detailsSchema = z.object({
  name: z.string().min(1, 'Give the template a name.').max(160),
  description: z.string().max(2000).optional(),
});

const emptyDetails: EditFormValues = { name: '', description: '' };

export type EditFormValues = z.infer<typeof detailsSchema>;

function toTemplateDetails(values: EditFormValues) {
  return {
    name: values.name.trim(),
    description: values.description?.trim() || null,
  };
}

export function useTemplateEdit() {
  const { organisation } = useOrganisationContext();

  const { action, targetId, closeDialog } = useTemplateActions();

  const { data: templates = [] } = useFetchTemplates(organisation.id);

  const { mutateAsync: update, isPending: isUpdating } = useUpdateTemplate(organisation.id);

  const template = action === 'edit' && targetId ? templates.find((item) => item.id === targetId) : undefined;

  const isOpen = Boolean(template);

  const formValues = useMemo<EditFormValues>(
    () => (isOpen ? { name: template?.name ?? '', description: template?.description ?? '' } : emptyDetails),
    [isOpen, template?.name, template?.description],
  );

  const form = useForm<EditFormValues>({
    resolver: zodResolver(detailsSchema),
    values: formValues,
  });

  const { setError } = form;

  const submit = async (values: EditFormValues) => {
    if (!template) return;

    try {
      await update({
        templateId: template.id,
        values: toTemplateDetails(values),
      });

      closeDialog();
      toast({ variant: 'success', title: 'Template updated' });
    } catch (cause: unknown) {
      setError('root', {
        message: getErrorMessage(cause, 'Unable to save template.'),
      });
    }
  };

  return {
    form,
    isOpen,
    isUpdating,
    template,
    submit,
    closeDialog,
  };
}
