import type { Transition, Variants } from 'motion/react';

/**
 * JS side of the motion language; CSS tokens live in styles/globals.css (--ease-*, --motion-*).
 * Aligned with the 20 principles of animation & UX design:
 * - Enter: fast arrival, gentle settle (Slow In/Slow Out, Doherty Threshold)
 * - Exit: leaves faster than it arrived without lagging interaction (Snappy Timing)
 * - Spring: physical, critically damped movement without excessive bounce (Squash & Stretch, Follow Through)
 */

export const ease = {
  enter: [0.22, 1, 0.36, 1],
  exit: [0.4, 0, 1, 1],
  move: [0.65, 0, 0.35, 1],
  spring: [0.16, 1, 0.3, 1],
  outBack: [0.34, 1.3, 0.64, 1],
} as const;

export const duration = {
  instant: 0.1,
  fast: 0.15,
  normal: 0.2,
  slow: 0.26,
  exit: 0.12,
} as const;

export const spring = {
  /** Indicators that travel between positions (nav, tabs). Critically damped: no overshoot. */
  indicator: { type: 'spring', stiffness: 520, damping: 42, mass: 0.9 },
  /** Small direct-manipulation elements (thumbs, toggles, checkboxes). Subtle physical life. */
  snappy: { type: 'spring', stiffness: 700, damping: 38 },
  /** Micro-interactions like checkmarks and completion icons (Secondary Action). */
  bouncy: { type: 'spring', stiffness: 450, damping: 25 },
  /** Panel, modal and sheet settling (Follow Through). */
  gentle: { type: 'spring', stiffness: 320, damping: 32 },
} as const satisfies Record<string, Transition>;

export const transition = {
  enter: { duration: duration.normal, ease: ease.enter },
  exit: { duration: duration.exit, ease: ease.exit },
  spring: spring.snappy,
  dialog: { duration: duration.slow, ease: ease.enter },
} as const satisfies Record<string, Transition>;

/** Reusable motion variants for consistent pose-to-pose transitions */
export const motionVariants = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: transition.enter },
    exit: { opacity: 0, transition: transition.exit },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.96 },
    animate: { opacity: 1, scale: 1, transition: { duration: duration.fast, ease: ease.enter } },
    exit: { opacity: 0, scale: 0.96, transition: transition.exit },
  },
  slideDown: {
    initial: { opacity: 0, height: 0, y: -4 },
    animate: { opacity: 1, height: 'auto', y: 0, transition: { duration: duration.fast, ease: ease.enter } },
    exit: { opacity: 0, height: 0, y: -4, transition: transition.exit },
  },
} satisfies Record<string, Variants>;
