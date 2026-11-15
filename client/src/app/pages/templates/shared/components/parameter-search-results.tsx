import { PlusIcon } from '@phosphor-icons/react';
import { useEffect, useRef } from 'react';

import { ParameterLabel } from '@/app/pages/templates/shared/components/parameter-label';
import { useParameterSearchContext } from '@/app/pages/templates/shared/context/parameter-search-context';
import { PARAMETER_RESULTS_ID, parameterOptionId } from '@/app/pages/templates/shared/lib/parameters';
import type { MetricDefinition } from '@/app/pages/templates/shared/types';
import { Spinner } from '@/app/shared/components/ui/spinner';
import { cn } from '@/app/shared/utils/cn';

const OPTION_CLASS =
  'flex w-full cursor-pointer items-center justify-between gap-3 rounded-md px-3 text-left transition-colors focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50';

/** Floating listbox under the parameter search input. */
export function ParameterSearchResults() {
  const { listbox } = useParameterSearchContext();

  const { results, highlightedIndex, isPending } = listbox;

  const listRef = useRef<HTMLDivElement>(null);

  // Keep the keyboard-highlighted option visible inside the scrollable popover.
  useEffect(() => {
    if (highlightedIndex < 0) return;

    listRef.current
      ?.querySelector(`#${parameterOptionId(highlightedIndex)}`)
      ?.scrollIntoView({ block: 'nearest' });
  }, [highlightedIndex]);

  return (
    <div
      ref={listRef}
      id={PARAMETER_RESULTS_ID}
      role="listbox"
      aria-label="Available parameters"
      aria-busy={isPending}
      className="border-border/80 bg-popover text-popover-foreground absolute top-full right-0 left-0 z-50 mt-1.5 max-h-64 overflow-y-auto rounded-lg border shadow-xl ring-1 ring-black/5 dark:ring-white/10"
    >
      {isPending ? (
        <div className="text-muted-foreground flex items-center justify-center gap-2.5 py-8 text-sm">
          <Spinner />
          <span>Searching catalogue…</span>
        </div>
      ) : (
        <div className="divide-border/40 divide-y p-1">
          {results.map((definition, index) => (
            <DefinitionOption key={definition.id} definition={definition} index={index} />
          ))}

          {results.length === 0 && <CustomParameterOption />}
        </div>
      )}
    </div>
  );
}

function DefinitionOption({ definition, index }: { definition: MetricDefinition; index: number }) {
  const { listbox, disabled } = useParameterSearchContext();

  const isHighlighted = index === listbox.highlightedIndex;

  return (
    <button
      id={parameterOptionId(index)}
      type="button"
      role="option"
      aria-selected={isHighlighted}
      disabled={disabled}
      onClick={() => listbox.onSelect(definition)}
      className={cn(
        OPTION_CLASS,
        'group hover:bg-accent hover:text-accent-foreground py-2',
        isHighlighted && 'bg-accent text-accent-foreground',
      )}
    >
      <ParameterLabel
        label={definition.label}
        symbol={definition.symbol}
        unit={definition.unit}
        className="flex-1"
      />

      <span className="border-border/40 bg-background text-muted-foreground group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground flex size-6 shrink-0 items-center justify-center rounded border transition-all">
        <PlusIcon size={12} weight="bold" aria-hidden="true" />
      </span>
    </button>
  );
}

/** The only option when nothing in the catalogue matches. */
function CustomParameterOption() {
  const { listbox, disabled } = useParameterSearchContext();

  const isHighlighted = listbox.highlightedIndex === 0;

  return (
    <button
      id={parameterOptionId(0)}
      type="button"
      role="option"
      aria-selected={isHighlighted}
      disabled={disabled}
      onClick={listbox.onCreateCustom}
      className={cn(
        OPTION_CLASS,
        'text-primary hover:bg-primary/10 py-2.5 text-sm',
        isHighlighted && 'bg-primary/15 font-medium',
      )}
    >
      <span className="flex items-center gap-2">
        <PlusIcon size={14} weight="bold" aria-hidden="true" />
        <span>
          Add <span className="text-foreground font-semibold">&ldquo;{listbox.query}&rdquo;</span> as custom
          parameter
        </span>
      </span>

      <span className="bg-primary/20 text-primary rounded px-1.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase">
        New
      </span>
    </button>
  );
}
