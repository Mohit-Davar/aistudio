import { ParameterPicker } from '@/app/pages/templates/shared/components/parameter-picker';
import { useTemplateActions } from '@/app/pages/templates/shared/hooks/use-template-actions';
import { useTemplateParametersEditor } from '@/app/pages/templates/shared/hooks/use-template-parameters-editor';
import { pluralise } from '@/app/pages/templates/shared/lib/parameters';
import { Button } from '@/app/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/app/shared/components/ui/dialog';
import { FieldError } from '@/app/shared/components/ui/field';
import { Spinner } from '@/app/shared/components/ui/spinner';

export function TemplateParametersDialog() {
  const { action, targetId, closeDialog } = useTemplateActions();

  const isOpen = action === 'parameters' && Boolean(targetId);

  const templateId = isOpen ? (targetId ?? undefined) : undefined;

  const { template, parameters, setParameters, error, removedCount, isSaving, save } =
    useTemplateParametersEditor(templateId, closeDialog);

  const isLoading = !template;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open && !isSaving) closeDialog();
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-visible sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit template parameters</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="text-muted-foreground flex items-center justify-center gap-2 py-12 text-sm">
            <Spinner />
            Loading parameters…
          </div>
        ) : (
          <>
            <ParameterPicker value={parameters} onChange={setParameters} disabled={isSaving} />

            {removedCount > 0 && template.device_count > 0 && (
              <p className="text-muted-foreground rounded-md border border-amber-500/30 bg-amber-500/5 p-3 text-xs">
                Removing {pluralise(removedCount, 'parameter')} will stop associated devices from accepting
                those readings. Historical readings will remain available.
              </p>
            )}
          </>
        )}

        <FieldError>{error}</FieldError>

        <DialogFooter>
          <Button type="button" variant="outline" disabled={isSaving} onClick={closeDialog}>
            Cancel
          </Button>

          <Button
            type="button"
            disabled={isLoading || isSaving}
            loading={isSaving}
            loadingText="Saving…"
            onClick={() => void save()}
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
