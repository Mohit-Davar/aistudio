import { PencilSimpleIcon, SlidersHorizontalIcon, TrashIcon } from '@phosphor-icons/react';

import { ParameterLabel } from '@/app/pages/templates/shared/components/parameter-label';
import { useTemplateActions } from '@/app/pages/templates/shared/hooks/use-template-actions';
import { DATA_TYPE_LABELS } from '@/app/pages/templates/shared/lib/parameters';
import type { Template, TemplateParameter } from '@/app/pages/templates/shared/types';
import { DataTable, type DataTableColumn } from '@/app/shared/components/data-table';
import { FormField, FormSection, FormView } from '@/app/shared/components/layout/form-view';
import { PageHeader, type PageMenuItem } from '@/app/shared/components/layout/page-header';
import { EmptyState } from '@/app/shared/components/states/empty-state';
import { Badge } from '@/app/shared/components/ui/badge';
import { Button } from '@/app/shared/components/ui/button';

const PARAMETER_COLUMNS: DataTableColumn<TemplateParameter>[] = [
  {
    id: 'parameter',
    header: 'Parameter',
    cell: (parameter) => (
      <ParameterLabel label={parameter.label} symbol={parameter.symbol} unit={parameter.unit} />
    ),
  },
  {
    id: 'key',
    header: 'Telemetry key',
    className: 'font-mono text-xs text-muted-foreground',
    cell: (parameter) => parameter.key,
  },
  {
    id: 'type',
    header: 'Type',
    className: 'w-28',
    cell: (parameter) => (
      <Badge variant="outline" className="text-xs font-normal">
        {DATA_TYPE_LABELS[parameter.data_type]}
      </Badge>
    ),
  },
];

export function TemplateDetails({ template }: { template: Template }) {
  const { openEdit, openDelete, openParameters, can } = useTemplateActions();

  const devices = template.device_count;

  const menu: PageMenuItem[] = [];

  if (can.update) {
    menu.push({
      label: 'Edit details',
      icon: PencilSimpleIcon,
      onSelect: () => openEdit(template.id),
    });
  }
  if (can.delete) {
    menu.push({
      label: 'Delete',
      icon: TrashIcon,
      destructive: true,
      onSelect: () => openDelete(template.id),
    });
  }

  return (
    <>
      <PageHeader
        back={{ to: '/templates', label: 'Templates' }}
        title={template.name}
        description={template.description ?? undefined}
        menu={menu}
        actions={
          can.update && (
            <Button size="sm" onClick={() => openParameters(template.id)}>
              <SlidersHorizontalIcon /> Edit parameters
            </Button>
          )
        }
      />

      <FormView>
        <FormSection title="Details" columns={3}>
          <FormField label="Name">{template.name}</FormField>
          <FormField label="Parameters">{template.parameters.length}</FormField>
          <FormField label="Devices">{devices}</FormField>
        </FormSection>

        <FormSection title={`Parameters (${template.parameters.length})`} columns={1}>
          {template.parameters.length === 0 ? (
            <EmptyState
              title="No parameters yet"
              description="Add the readings and metrics that devices associated with this template report."
              action={
                can.update ? (
                  <Button size="sm" onClick={() => openParameters(template.id)}>
                    Add parameters
                  </Button>
                ) : undefined
              }
            />
          ) : (
            <div className="border-border bg-card overflow-hidden rounded-lg border shadow-xs">
              <DataTable
                columns={PARAMETER_COLUMNS}
                rows={template.parameters}
                getRowId={(parameter) => parameter.id}
              />
            </div>
          )}
        </FormSection>
      </FormView>
    </>
  );
}
