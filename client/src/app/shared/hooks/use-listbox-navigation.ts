import { useState } from 'react';

type ListboxNavigationOptions = {
  /** Number of selectable options currently rendered. */
  optionCount: number;
  /** Called on Enter with the highlighted index (-1 when nothing is highlighted). */
  onSelect: (index: number) => void;
  /** Called on Escape. */
  onEscape?: () => void;
};

/**
 * Arrow-key / Enter / Escape handling for an input that drives a listbox (combobox pattern).
 * Highlight wraps around at both ends.
 */
export function useListboxNavigation({ optionCount, onSelect, onEscape }: ListboxNavigationOptions) {
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const resetHighlight = () => setHighlightedIndex(-1);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    switch (event.key) {
      case 'Escape':
        resetHighlight();
        onEscape?.();
        break;

      case 'ArrowDown':
        if (optionCount === 0) return;
        event.preventDefault();
        setHighlightedIndex((index) => (index + 1) % optionCount);
        break;

      case 'ArrowUp':
        if (optionCount === 0) return;
        event.preventDefault();
        setHighlightedIndex((index) => (index <= 0 ? optionCount - 1 : index - 1));
        break;

      case 'Enter':
        if (optionCount === 0) return;
        event.preventDefault();
        onSelect(highlightedIndex);
        break;
    }
  };

  return { highlightedIndex, resetHighlight, handleKeyDown };
}
