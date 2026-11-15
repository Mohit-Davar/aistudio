import type * as React from 'react';

import { Button } from '@/app/shared/components/ui/button';
import { cn } from '@/app/shared/utils/cn';
import { transition } from '@/app/shared/utils/motion';
import { ArrowClockwiseIcon, WarningCircleIcon } from '@phosphor-icons/react';
import { motion, useReducedMotion } from 'motion/react';

export type ErrorStateProps = {
  title?: string;
  message?: string;
  /** Technical reference such as a request ID or error digest, shown in a small mono box. */
  details?: string;
  action?: React.ReactNode;
  onRetry?: () => void;
  retryLabel?: string;
  isRetrying?: boolean;
  variant?: 'fullscreen' | 'inline' | 'card';
  className?: string;
};

export function ErrorState({
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
  details,
  action,
  onRetry,
  retryLabel = 'Try again',
  isRetrying = false,
  variant = 'inline',
  className,
}: ErrorStateProps) {
  const reduceMotion = useReducedMotion();

  const isInline = variant === 'inline';

  const isFullscreen = variant === 'fullscreen';

  const Heading = isFullscreen ? 'h1' : 'h3';

  const iconContainerSize = {
    fullscreen: 'size-14',
    inline: 'size-9',
    card: 'size-12',
  }[variant];

  const iconSize = {
    fullscreen: 'size-7',
    inline: 'size-[18px]',
    card: 'size-6',
  }[variant];

  const icon = (
    <div
      className={cn(
        'animate-error-shake ring-destructive/20 flex shrink-0 items-center justify-center rounded-full ring-1 ring-inset',
        'bg-(--status-critical-bg) text-(--status-critical)',
        iconContainerSize,
      )}
    >
      <WarningCircleIcon weight="duotone" className={iconSize} aria-hidden="true" />
    </div>
  );

  const retryButton = onRetry ? (
    <Button
      variant="outline"
      size="sm"
      onClick={onRetry}
      disabled={isRetrying}
      aria-busy={isRetrying}
      className="transition-interactive press gap-1.5"
    >
      <ArrowClockwiseIcon className={cn('size-3.5', isRetrying && 'animate-spin')} aria-hidden="true" />
      {isRetrying ? 'Retrying…' : retryLabel}
    </Button>
  ) : null;

  const hasActions = Boolean(action || retryButton);

  const text = (
    <div className={cn('min-w-0', isInline ? 'flex-1 text-left' : 'text-center')}>
      <Heading
        className={cn('text-foreground font-semibold tracking-tight', isFullscreen ? 'text-xl' : 'text-sm')}
      >
        {title}
      </Heading>
      <p
        className={cn(
          'text-muted-foreground mt-1 leading-relaxed',
          isFullscreen ? 'text-sm' : 'text-xs',
          !isInline && 'mx-auto max-w-sm',
        )}
      >
        {message}
      </p>
      {details && (
        <code className="bg-muted text-muted-foreground mt-3 inline-block max-w-full rounded-md px-2 py-1 font-mono text-[11px] leading-4 break-all">
          {details}
        </code>
      )}
    </div>
  );

  const actions = hasActions ? (
    <div className={cn('flex shrink-0 items-center gap-2', isInline ? 'sm:ml-2' : 'mt-5 justify-center')}>
      {action}
      {retryButton}
    </div>
  ) : null;

  const content = (
    <motion.div
      role="alert"
      className={cn(
        'w-full rounded-xl border',
        isInline
          ? 'border-destructive/20 flex flex-col gap-3 bg-(--status-critical-bg) p-4 sm:flex-row sm:items-center sm:gap-4'
          : 'bg-card flex flex-col items-center p-8 text-center shadow-xs',
        variant === 'card' && 'max-w-md',
        isFullscreen && 'max-w-lg gap-1 p-10',
        className,
      )}
      initial={{ opacity: 0, y: reduceMotion ? 0 : 8 }}
      animate={{ opacity: 1, y: 0, transition: transition.enter }}
    >
      {icon}
      <div className={cn(!isInline && 'mt-4 w-full')}>{text}</div>
      {actions}
    </motion.div>
  );

  if (isFullscreen) {
    return (
      <main className="bg-background flex min-h-svh items-center justify-center px-5 py-10">{content}</main>
    );
  }

  return content;
}
