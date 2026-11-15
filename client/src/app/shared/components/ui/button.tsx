import { Spinner } from '@/app/shared/components/ui/spinner';
import { cn } from '@/app/shared/utils/cn';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import type * as React from 'react';

const buttonVariants = cva(
  [
    'group/button inline-flex shrink-0 cursor-pointer items-center justify-center gap-2',
    'rounded-md text-sm font-medium whitespace-nowrap outline-none select-none',
    'transition-interactive press [-webkit-tap-highlight-color:transparent]',
    // Keyboard focus only (mouse clicks don't draw a ring). Uses theme --ring at 50%.
    'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
    'aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',
    // Disabled and busy states
    'disabled:pointer-events-none disabled:opacity-50 aria-busy:cursor-progress',
    // Icons: sized by default, never shrink
    '[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4',
  ].join(' '),
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 shadow-xs',
        outline:
          'border-input bg-background hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 border shadow-xs',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-xs',
        ghost: 'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
        // Accent text instead of primary: #3fafd5 text on white is too low in contrast for small labels
        link: 'text-accent-foreground underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 gap-1.5 px-3 text-xs has-[>svg]:px-2.5',
        lg: 'h-10 px-6 text-base has-[>svg]:px-4',
        icon: 'tap-target size-9',
        'icon-sm': 'tap-target size-8',
        'icon-lg': 'tap-target size-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export type ButtonProps = React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    loading?: boolean;
    loadingText?: React.ReactNode;
  };

// Both labels share one grid cell, so the button keeps its width when loading toggles.
const layer =
  'col-start-1 row-start-1 inline-flex items-center justify-center gap-[inherit] transition-opacity duration-(--motion-fast)';

function Button({
  className,
  variant,
  size,
  asChild = false,
  loading = false,
  loadingText,
  disabled,
  children,
  type = 'button',
  ...props
}: ButtonProps) {
  const isDisabled = Boolean(disabled || loading);

  const classes = cn(buttonVariants({ variant, size }), className);

  if (asChild) {
    // Links and other non-button elements can't be disabled natively, so expose it with ARIA.
    return (
      <Slot
        data-slot="button"
        data-variant={variant ?? 'default'}
        data-size={size ?? 'default'}
        aria-disabled={isDisabled || undefined}
        aria-busy={loading || undefined}
        data-disabled={isDisabled || undefined}
        className={classes}
        {...props}
      >
        {children}
      </Slot>
    );
  }

  const stacked = loading || loadingText !== undefined;

  return (
    <button
      type={type}
      data-slot="button"
      data-variant={variant ?? 'default'}
      data-size={size ?? 'default'}
      data-loading={loading || undefined}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      className={classes}
      {...props}
    >
      {stacked ? (
        <span data-slot="button-label" className="grid gap-[inherit]">
          <span className={cn(layer, loading && 'opacity-0')} aria-hidden={loading || undefined}>
            {children}
          </span>
          <span className={cn(layer, !loading && 'opacity-0')} aria-hidden={!loading || undefined}>
            {loading && <Spinner className="size-4 shrink-0" aria-hidden="true" />}
            {loading && (loadingText ?? <span className="sr-only">Loading</span>)}
            {!loading && loadingText}
          </span>
        </span>
      ) : (
        children
      )}
    </button>
  );
}

export { Button, buttonVariants };
