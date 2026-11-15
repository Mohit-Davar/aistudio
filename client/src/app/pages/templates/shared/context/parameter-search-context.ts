import { createContext, useContext } from 'react';

import type { useParameterSearch } from '@/app/pages/templates/shared/hooks/use-parameter-search';

export type ParameterSearchContextValue = ReturnType<typeof useParameterSearch> & { disabled: boolean };

export const parameterSearchContext = createContext<ParameterSearchContextValue | null>(null);

/** Search state shared by the parameter picker's input, results and options. */
export function useParameterSearchContext(): ParameterSearchContextValue {
  const context = useContext(parameterSearchContext);

  if (!context) {
    throw new Error('useParameterSearchContext must be used within ParameterPicker.');
  }

  return context;
}
