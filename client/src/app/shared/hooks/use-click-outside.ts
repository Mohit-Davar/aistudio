import { type RefObject, useEffect, useEffectEvent } from 'react';

/** Calls `handler` on a mousedown outside `ref`'s element while `enabled` is true. */
export function useClickOutside<T extends HTMLElement>(
  ref: RefObject<T | null>,
  handler: (event: MouseEvent) => void,
  enabled = true,
) {
  const onClickOutside = useEffectEvent(handler);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const handleMouseDown = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClickOutside(event);
      }
    };

    document.addEventListener('mousedown', handleMouseDown);

    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, [ref, enabled]);
}
