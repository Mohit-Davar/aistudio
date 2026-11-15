import { zodResolver } from '@hookform/resolvers/zod';
import type { Dispatch, SetStateAction } from 'react';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

import { useOrganisationContext } from '@/app/pages/(organisation)/context';
import { useTemplateActions } from '@/app/pages/templates/shared/hooks/use-template-actions';
import { useCreateTemplate } from '@/app/pages/templates/shared/hooks/use-template-mutations';
import type { TemplateParameterInput } from '@/app/pages/templates/shared/types';
import { toast } from '@/app/shared/hooks/use-toast';
import { getErrorMessage } from '@/app/shared/utils/error-message';

const detailsSchema = z.object({
  name: z.string().min(1, 'Give the template a name.').max(160),
  description: z.string().max(2000).optional(),
});

const emptyDetails: CreateFormValues = { name: '', description: '' };

export type CreateFormValues = z.infer<typeof detailsSchema>;

export type TemplateCreateStep = 'details' | 'parameters';

type CreateSession = {
  key: string;
  step: TemplateCreateStep;
  parameters: TemplateParameterInput[];
  pendingDetails: CreateFormValues;
};

function toTemplateDetails(values: CreateFormValues) {
  return {
    name: values.name.trim(),
    description: values.description?.trim() || null,
  };
}

export function useTemplateCreate() {
  const navigate = useNavigate();

  const { organisation } = useOrganisationContext();

  const { action, closeDialog } = useTemplateActions();

  const { mutateAsync: create, isPending: isCreating } = useCreateTemplate(organisation.id);

  const isOpen = action === 'create';

  const sessionKey = isOpen ? 'create:new' : 'closed';

  const [session, setSession] = useState<CreateSession>(() => ({
    key: sessionKey,
    step: 'details',
    parameters: [],
    pendingDetails: emptyDetails,
  }));

  if (session.key !== sessionKey) {
    setSession({ key: sessionKey, step: 'details', parameters: [], pendingDetails: emptyDetails });
  }

  const setStep = useCallback<Dispatch<SetStateAction<TemplateCreateStep>>>((value) => {
    setSession((current) => ({
      ...current,
      step: typeof value === 'function' ? value(current.step) : value,
    }));
  }, []);

  const setParameters = useCallback<Dispatch<SetStateAction<TemplateParameterInput[]>>>((value) => {
    setSession((current) => ({
      ...current,
      parameters: typeof value === 'function' ? value(current.parameters) : value,
    }));
  }, []);

  const form = useForm<CreateFormValues>({
    resolver: zodResolver(detailsSchema),
    values: emptyDetails,
  });

  const { setError } = form;

  const submitDetails = (values: CreateFormValues) => {
    setSession((current) => ({
      ...current,
      pendingDetails: values,
      step: 'parameters',
    }));
  };

  const createTemplate = async () => {
    try {
      const created = await create({
        ...toTemplateDetails(session.pendingDetails),
        parameters: session.parameters,
      });

      toast({
        variant: 'success',
        title: 'Template created',
        description: `"${created.name}" is ready for devices.`,
      });

      void navigate(`/templates/${created.id}`);
    } catch (cause: unknown) {
      setStep('details');
      setError('root', {
        message: getErrorMessage(cause, 'Unable to create template.'),
      });
    }
  };

  return {
    form,
    isOpen,
    isCreating,
    step: session.step,
    setStep,
    parameters: session.parameters,
    setParameters,
    pendingName: session.pendingDetails.name.trim(),
    submitDetails,
    createTemplate,
    closeDialog,
  };
}
