import { MagnifyingGlassIcon, XIcon } from '@phosphor-icons/react';
import type * as React from 'react';

import { Input } from '@/app/shared/components/ui/input';
import { cn } from '@/app/shared/utils/cn';

type SearchInputProps = Omit<React.ComponentProps<typeof Input>, 'type' | 'value'> & {
  value: string;
  /** Shows a clear button while there is text. */
  onClear?: () => void;
};

/** Text input with a leading search icon and an optional clear button. */
export function SearchInput({ value, onClear, className, disabled, ...props }: SearchInputProps) {
  return (
    <div className="relative min-w-0 flex-1">
      <MagnifyingGlassIcon
        size={16}
        aria-hidden="true"
        className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 -translate-y-1/2"
      />

      <Input
        type="text"
        value={value}
        disabled={disabled}
        className={cn('pl-9', onClear && 'pr-8', className)}
        {...props}
      />

      {onClear && value && !disabled && (
        <button
          type="button"
          onClick={onClear}
          aria-label="Clear search"
          className="text-muted-foreground hover:bg-muted hover:text-foreground absolute top-1/2 right-2.5 -translate-y-1/2 rounded-full p-0.5"
        >
          <XIcon size={14} />
        </button>
      )}
    </div>
  );
}
