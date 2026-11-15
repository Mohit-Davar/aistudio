import { useRef } from 'react';

import { CustomParameterDialog } from '@/app/pages/templates/shared/components/custom-parameter-dialog';
import { ParameterSearchResults } from '@/app/pages/templates/shared/components/parameter-search-results';
import { SelectedParameterList } from '@/app/pages/templates/shared/components/selected-parameter-list';
import { parameterSearchContext } from '@/app/pages/templates/shared/context/parameter-search-context';
import { useParameterSearch } from '@/app/pages/templates/shared/hooks/use-parameter-search';
import type { TemplateParameterInput } from '@/app/pages/templates/shared/types';
import { SearchInput } from '@/app/shared/components/search-input';
import { cn } from '@/app/shared/utils/cn';

type ParameterPickerProps = {
  value: TemplateParameterInput[];
  onChange: (parameters: TemplateParameterInput[]) => void;
  disabled?: boolean;
};

export function ParameterPicker({ value, onChange, disabled = false }: ParameterPickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const search = useParameterSearch({ value, onChange, containerRef });

  const { isOpen, inputProps, dialogProps, remove } = search;

  return (
    <parameterSearchContext.Provider value={{ ...search, disabled }}>
      <div className="relative space-y-4">
        <div ref={containerRef} className="relative z-30">
          <SearchInput
            {...inputProps}
            disabled={disabled}
            placeholder="Search catalogue metrics (e.g. pressure, RPM, °C)…"
            aria-label="Search parameters"
            className={cn(
              'bg-background transition-all',
              isOpen && 'border-primary ring-primary/20 shadow-xs ring-2',
            )}
          />

          {isOpen && <ParameterSearchResults />}

          <CustomParameterDialog {...dialogProps} />
        </div>

        {/* Dimmed while searching so the results popover reads as the focus. */}
        <div
          className={cn(
            'transition-[opacity,filter] duration-150',
            isOpen && 'pointer-events-none opacity-40 blur-[1px] select-none',
          )}
        >
          <SelectedParameterList parameters={value} disabled={disabled} onRemove={remove} />
        </div>
      </div>
    </parameterSearchContext.Provider>
  );
}
