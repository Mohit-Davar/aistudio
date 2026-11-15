import { TemplateCreateDialog } from '@/app/pages/templates/shared/components/template-create-dialog';
import { TemplateDeleteDialog } from '@/app/pages/templates/shared/components/template-delete-dialog';
import { TemplateEditDialog } from '@/app/pages/templates/shared/components/template-edit-dialog';
import { TemplateParametersDialog } from '@/app/pages/templates/shared/components/template-parameters-dialog';

export function TemplateDialogs() {
  return (
    <>
      <TemplateCreateDialog />
      <TemplateEditDialog />
      <TemplateParametersDialog />
      <TemplateDeleteDialog />
    </>
  );
}
