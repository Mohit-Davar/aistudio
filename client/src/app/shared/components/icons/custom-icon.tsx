import { IconBase, type Icon, type IconWeight } from '@phosphor-icons/react';
import { forwardRef, type ReactElement, type ReactNode } from 'react';

const STROKE: Record<IconWeight, number> = {
  thin: 8,
  light: 12,
  regular: 18,
  bold: 26,
  fill: 18,
  duotone: 18,
};

const TINT_OPACITY: Partial<Record<IconWeight, number>> = {
  duotone: 0.22,
  fill: 0.4,
};

export function createCustomIcon(name: string, outline: ReactNode, tint: ReactNode): Icon {
  const weights = new Map<IconWeight, ReactElement>();

  (Object.keys(STROKE) as IconWeight[]).forEach((weight) => {
    weights.set(
      weight,
      <>
        {TINT_OPACITY[weight] !== undefined && (
          <g fill="currentColor" stroke="none" opacity={TINT_OPACITY[weight]}>
            {tint}
          </g>
        )}
        <g
          fill="none"
          stroke="currentColor"
          strokeWidth={STROKE[weight]}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {outline}
        </g>
      </>,
    );
  });

  const Component: Icon = forwardRef((props, ref) => <IconBase ref={ref} {...props} weights={weights} />);

  Component.displayName = name;

  return Component;
}
