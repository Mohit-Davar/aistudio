import { type RefObject, useState } from 'react';

import { useOrganisationContext } from '@/app/pages/(organisation)/context';
import { useFetchMetricDefinitions } from '@/app/pages/templates/shared/hooks/use-template-queries';
import {
  PARAMETER_RESULTS_ID,
  parameterFromDefinition,
  parameterOptionId,
  searchDefinitions,
} from '@/app/pages/templates/shared/lib/parameters';
import type { MetricDefinition, TemplateParameterInput } from '@/app/pages/templates/shared/types';
import { useClickOutside } from '@/app/shared/hooks/use-click-outside';
import { useListboxNavigation } from '@/app/shared/hooks/use-listbox-navigation';

type ParameterSearchOptions = {
  value: TemplateParameterInput[];
  onChange: (parameters: TemplateParameterInput[]) => void;
  /** Clicks outside this element close the results. */
  containerRef: RefObject<HTMLElement | null>;
};

/**
 * Catalogue search for the parameter picker. Returns prop groups ready to spread onto the
 * search input, the results listbox and the custom-parameter dialog.
 */
export function useParameterSearch({ value, onChange, containerRef }: ParameterSearchOptions) {
  const { organisation } = useOrganisationContext();

  const { data: definitions = [], isPending } = useFetchMetricDefinitions(organisation.id);

  const [query, setQuery] = useState('');

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const selectedKeys = new Set(value.map(({ key }) => key));

  const trimmedQuery = query.trim();

  const isOpen = trimmedQuery.length > 0;

  const results = isOpen ? searchDefinitions(definitions, trimmedQuery, selectedKeys) : [];

  // With no matches the only option is "add as custom parameter".
  const optionCount = isOpen ? Math.max(results.length, 1) : 0;

  const add = (parameter: TemplateParameterInput) => {
    if (selectedKeys.has(parameter.key)) return;

    onChange([...value, parameter]);
    clear();
  };

  const select = (definition: MetricDefinition) => add(parameterFromDefinition(definition));

  const openCustomDialog = () => setIsDialogOpen(true);

  const { highlightedIndex, resetHighlight, handleKeyDown } = useListboxNavigation({
    optionCount,
    onEscape: () => setQuery(''),
    onSelect: (index) => {
      const definition = results[index];

      if (results.length === 0) openCustomDialog();
      else if (definition) select(definition);
    },
  });

  function clear() {
    setQuery('');
    resetHighlight();
  }

  useClickOutside(containerRef, clear, isOpen);

  return {
    isOpen,

    inputProps: {
      role: 'combobox',
      value: query,
      onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(event.target.value);
        resetHighlight();
      },
      onKeyDown: handleKeyDown,
      onClear: clear,
      'aria-autocomplete': 'list',
      'aria-expanded': isOpen,
      'aria-controls': PARAMETER_RESULTS_ID,
      'aria-activedescendant': highlightedIndex >= 0 ? parameterOptionId(highlightedIndex) : undefined,
    } as const,

    listbox: {
      results,
      query: trimmedQuery,
      highlightedIndex,
      isPending,
      onSelect: select,
      onCreateCustom: openCustomDialog,
    },

    dialogProps: {
      open: isDialogOpen,
      onOpenChange: setIsDialogOpen,
      initialLabel: trimmedQuery,
      takenKeys: selectedKeys,
      onCreated: add,
    },

    remove: (key: string) => onChange(value.filter((parameter) => parameter.key !== key)),
  };
}
