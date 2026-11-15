import { PencilSimpleIcon, SlidersHorizontalIcon, TrashIcon } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';

import { useTemplateActions } from '@/app/pages/templates/shared/hooks/use-template-actions';
import type { TemplateSummary } from '@/app/pages/templates/shared/types';
import { DataTable, type DataTableColumn } from '@/app/shared/components/data-table';
import { RowActions } from '@/app/shared/components/row-actions';

export function TemplatesTable({ templates }: { templates: TemplateSummary[] }) {
  const { openEdit, openParameters, openDelete, can } = useTemplateActions();

  const columns: DataTableColumn<TemplateSummary>[] = [
    {
      id: 'name',
      header: 'Template',
      cell: (template) => (
        <div className="max-w-xl min-w-0">
          <Link
            to={`/templates/${template.id}`}
            className="text-foreground group-focus-within:text-primary group-hover:text-primary font-medium transition-colors"
          >
            {template.name}
          </Link>
          {template.description && (
            <p className="text-muted-foreground truncate text-xs" title={template.description}>
              {template.description}
            </p>
          )}
        </div>
      ),
    },
    {
      id: 'devices',
      header: 'Devices',
      className: 'w-24 text-right tabular-nums',
      cell: (template) => <CountCell value={template.device_count} />,
    },
    {
      id: 'parameters',
      header: 'Parameters',
      className: 'w-28 text-right tabular-nums',
      cell: (template) => <CountCell value={template.parameter_count} />,
    },
    {
      id: 'actions',
      header: <span className="sr-only">Actions</span>,
      className: 'w-14 text-right',
      cell: (template) => (
        <RowActions
          label={template.name}
          actions={[
            can.update && {
              key: 'edit',
              label: 'Edit details',
              icon: <PencilSimpleIcon size={14} />,
              onClick: () => openEdit(template.id),
            },
            can.update && {
              key: 'parameters',
              label: 'Edit parameters',
              icon: <SlidersHorizontalIcon size={14} />,
              onClick: () => openParameters(template.id),
            },
            can.delete && 'separator',
            can.delete && {
              key: 'delete',
              label: 'Delete',
              icon: <TrashIcon size={14} />,
              destructive: true,
              onClick: () => openDelete(template.id),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={templates}
      getRowId={(template) => template.id}
      getRowHref={(template) => `/templates/${template.id}`}
    />
  );
}

/** Zero is de-emphasised so templates actually in use stand out. */
function CountCell({ value }: { value: number }) {
  return <span className={value === 0 ? 'text-muted-foreground' : 'font-medium'}>{value}</span>;
}
