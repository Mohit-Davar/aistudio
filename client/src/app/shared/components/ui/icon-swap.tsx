import { AnimatePresence, motion } from 'motion/react';
import type * as React from 'react';

import { transition } from '@/app/shared/utils/motion';

/**
 * Cross-fades between two icons in place (e.g. show/hide, sun/moon).
 * Uses strictly performant transform and opacity transitions (no paint-heavy blur filters),
 * adhering to the 20 principles (Squash & Stretch, Snappy Timing).
 */
export function IconSwap({ swapKey, children }: { swapKey: string; children: React.ReactNode }) {
  return (
    <span className="relative inline-flex items-center justify-center">
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={swapKey}
          className="inline-flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.72 }}
          animate={{ opacity: 1, scale: 1, transition: transition.spring }}
          exit={{ opacity: 0, scale: 0.72, transition: transition.exit }}
        >
          {children}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
