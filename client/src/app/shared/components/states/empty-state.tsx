import { motion, useReducedMotion } from 'motion/react';
import type * as React from 'react';

import { Button } from '@/app/shared/components/ui/button';
import { cn } from '@/app/shared/utils/cn';
import { transition } from '@/app/shared/utils/motion';

type IconComponent = React.ComponentType<{ className?: string }>;

export type EmptyStateProps = {
  icon?: IconComponent;
  title: string;
  description?: string;
  action?: React.ReactNode;
  secondaryAction?: React.ReactNode;
  variant?: 'plain' | 'card';
  className?: string;
};

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  secondaryAction,
  variant = 'plain',
  className,
}: EmptyStateProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: reduceMotion ? 0 : 6 }}
      animate={{ opacity: 1, y: 0, transition: transition.enter }}
      className={cn(
        'flex flex-col items-center justify-center px-6 text-center',
        variant === 'card' ? 'bg-muted/20 min-h-60 rounded-xl border border-dashed py-12' : 'py-16',
        className,
      )}
    >
      {Icon && (
        <div className="relative mb-5">
          <div className="bg-primary/10 absolute inset-0 rounded-2xl blur-xl" />
          <div className="bg-card relative flex size-14 items-center justify-center rounded-2xl border shadow-sm">
            <Icon className="text-muted-foreground size-6" aria-hidden="true" />
          </div>
        </div>
      )}

      <h3 className="text-foreground text-base font-semibold tracking-tight">{title}</h3>

      {description && (
        <p className="text-muted-foreground mt-2 max-w-sm text-sm leading-relaxed text-balance">
          {description}
        </p>
      )}

      {(action || secondaryAction) && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {action}
          {secondaryAction}
        </div>
      )}
    </motion.div>
  );
}

export function EmptySearchResult({
  query,
  onClear,
  className,
}: {
  query?: string;
  onClear?: () => void;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      role="status"
      initial={{ opacity: 0, y: reduceMotion ? 0 : 6 }}
      animate={{ opacity: 1, y: 0, transition: transition.enter }}
      className={cn('flex flex-col items-center justify-center px-6 py-12 text-center', className)}
    >
      <h3 className="text-foreground max-w-full text-base font-semibold tracking-tight">
        {query ? (
          <>
            No results for <span className="text-foreground">&ldquo;{query}&rdquo;</span>
          </>
        ) : (
          'No matching results'
        )}
      </h3>

      <p className="text-muted-foreground mt-2 max-w-sm text-sm leading-relaxed text-balance">
        {query
          ? 'Try a different search term or check the spelling.'
          : 'Try adjusting your search or removing some filters.'}
      </p>

      {onClear && (
        <Button size="sm" onClick={onClear} className="mt-5">
          {query ? 'Clear search' : 'Clear filters'}
        </Button>
      )}
    </motion.div>
  );
}
