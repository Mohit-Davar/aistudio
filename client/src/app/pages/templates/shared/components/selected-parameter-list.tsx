import { TrashIcon } from '@phosphor-icons/react';

import { ParameterLabel } from '@/app/pages/templates/shared/components/parameter-label';
import type { TemplateParameterInput } from '@/app/pages/templates/shared/types';
import { Button } from '@/app/shared/components/ui/button';

type SelectedParameterListProps = {
  parameters: TemplateParameterInput[];
  disabled?: boolean;
  onRemove: (key: string) => void;
};

export function SelectedParameterList({ parameters, disabled, onRemove }: SelectedParameterListProps) {
  if (parameters.length === 0) {
    return (
      <div className="border-border/80 text-muted-foreground flex flex-col items-center justify-center rounded-lg border border-dashed px-4 py-8 text-center">
        <p className="text-sm font-medium">No parameters selected</p>
        <p className="text-muted-foreground/80 mt-0.5 text-xs">
          Type above to search catalogue metrics or create custom ones.
        </p>
      </div>
    );
  }

  return (
    <div className="border-border bg-card overflow-hidden rounded-lg border shadow-xs">
      <ul className="divide-border/60 divide-y">
        {parameters.map((parameter) => (
          <li
            key={parameter.key}
            className="hover:bg-muted/30 flex items-center justify-between gap-3 px-3.5 py-2.5 transition-colors"
          >
            <ParameterLabel
              label={parameter.label}
              symbol={parameter.symbol}
              unit={parameter.unit}
              className="flex-1"
            />

            <Button
              type="button"
              size="icon-sm"
              variant="ghost"
              className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive size-7 shrink-0 transition-colors"
              aria-label={`Remove ${parameter.label}`}
              disabled={disabled}
              onClick={() => onRemove(parameter.key)}
            >
              <TrashIcon size={14} aria-hidden="true" />
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
