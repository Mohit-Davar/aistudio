import { Spinner } from '@/app/shared/components/ui/spinner';
import { cn } from '@/app/shared/utils/cn';
import { transition } from '@/app/shared/utils/motion';
import { motion } from 'motion/react';

export type LoadingStateProps = {
  label: string;
  variant: 'fullscreen' | 'inline';
  className?: string;
};

export function LoadingState({ label, variant, className }: LoadingStateProps) {
  if (variant === 'inline') {
    return (
      <motion.div
        className={cn(
          'text-muted-foreground flex items-center justify-center gap-2.5 py-8 text-sm',
          className,
        )}
        role="status"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: transition.enter }}
      >
        <Spinner aria-hidden="true" />
        <span>{label}</span>
      </motion.div>
    );
  }

  return (
    <main className={cn('flex min-h-svh items-center justify-center px-5', className)}>
      <motion.div
        className="text-muted-foreground flex items-center gap-3 text-sm"
        role="status"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: transition.enter }}
      >
        <Spinner aria-hidden="true" />
        <span>{label}</span>
      </motion.div>
    </main>
  );
}
