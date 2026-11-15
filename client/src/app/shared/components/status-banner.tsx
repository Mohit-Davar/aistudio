import { CheckCircleIcon, InfoIcon, WarningCircleIcon, WarningIcon } from '@phosphor-icons/react';
import { motion } from 'motion/react';
import type * as React from 'react';

import { cn } from '@/app/shared/utils/cn';
import { transition } from '@/app/shared/utils/motion';

export type StatusBannerProps = {
  variant: 'destructive' | 'success' | 'warning' | 'info';
  title?: string;
  children: React.ReactNode;
  className?: string;
};

export function StatusBanner({ variant, title, children, className }: StatusBannerProps) {
  let icon: React.ReactNode;

  let styles: string;

  switch (variant) {
    case 'destructive':
      icon = <WarningCircleIcon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />;
      styles = 'border-destructive/30 bg-destructive/5 text-destructive';
      break;
    case 'success':
      icon = <CheckCircleIcon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />;
      styles = 'border-status-healthy/30 bg-status-healthy-bg text-status-healthy-fg';
      break;
    case 'warning':
      icon = <WarningIcon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />;
      styles = 'border-status-warning-fg/30 bg-status-warning-bg text-status-warning-fg';
      break;
    case 'info':
      icon = <InfoIcon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />;
      styles = 'border-primary/30 bg-accent text-accent-foreground';
      break;
  }

  return (
    <motion.div
      role={variant === 'destructive' ? 'alert' : 'status'}
      className={cn(
        'flex items-center gap-2 rounded-lg border px-3.5 py-3 text-sm transition-colors',
        variant === 'destructive' && 'animate-error-shake',
        styles,
        className,
      )}
      initial={{ opacity: 0, y: -4, scale: 0.99 }}
      animate={{ opacity: 1, y: 0, scale: 1, transition: transition.enter }}
      exit={{ opacity: 0, scale: 0.99, transition: transition.exit }}
    >
      {icon}
      <div className="space-y-0.5">
        {title && <p className="leading-none font-medium">{title}</p>}
        <div className="text-sm leading-relaxed">{children}</div>
      </div>
    </motion.div>
  );
}
