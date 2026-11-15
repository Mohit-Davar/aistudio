import { DetailsStep } from '@/app/pages/templates/shared/components/template-create-details-step';
import { ParametersStep } from '@/app/pages/templates/shared/components/template-create-parameters-step';
import { useTemplateCreate } from '@/app/pages/templates/shared/hooks/use-template-create';
import { Dialog, DialogContent } from '@/app/shared/components/ui/dialog';
import { cn } from '@/app/shared/utils/cn';

export function TemplateCreateDialog() {
  const {
    form,
    isOpen,
    isCreating,
    step,
    setStep,
    parameters,
    setParameters,
    pendingName,
    submitDetails,
    createTemplate,
    closeDialog,
  } = useTemplateCreate();

  const isDismissBlocked = isCreating || (step === 'parameters' && parameters.length > 0);

  const handleBack = () => {
    form.clearErrors('root');
    setStep('details');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isCreating && closeDialog()}>
      <DialogContent
        className={cn(
          'flex max-h-[calc(100dvh-2rem)] flex-col',
          step === 'parameters' && 'h-144 sm:max-w-xl',
        )}
        onInteractOutside={(event) => {
          if (isDismissBlocked) {
            event.preventDefault();
          }
        }}
      >
        {step === 'details' ? (
          <DetailsStep
            form={form}
            isSubmitting={form.formState.isSubmitting}
            onSubmit={(event) => void form.handleSubmit(submitDetails)(event)}
            onCancel={closeDialog}
          />
        ) : (
          <ParametersStep
            form={form}
            templateName={pendingName}
            parameters={parameters}
            onParametersChange={setParameters}
            isCreating={isCreating}
            onBack={handleBack}
            onCreate={() => void createTemplate()}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
