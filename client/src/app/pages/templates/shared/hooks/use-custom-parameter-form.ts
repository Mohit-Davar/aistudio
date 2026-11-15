import { useState } from 'react';

import { useOrganisationContext } from '@/app/pages/(organisation)/context';
import { useCreateMetricDefinition } from '@/app/pages/templates/shared/hooks/use-template-mutations';
import {
  isMetricDataType,
  isValidParameterKey,
  parameterFromDefinition,
  toParameterKey,
} from '@/app/pages/templates/shared/lib/parameters';
import type { MetricDataType, TemplateParameterInput } from '@/app/pages/templates/shared/types';
import { getErrorMessage } from '@/app/shared/utils/error-message';

type CustomParameterFormOptions = {
  initialLabel: string;
  takenKeys: Set<string>;
  onCreated: (parameter: TemplateParameterInput) => void;
};

/** State and save flow for creating a custom catalogue parameter. The key is auto-generated from the name. */
export function useCustomParameterForm({ initialLabel, takenKeys, onCreated }: CustomParameterFormOptions) {
  const { organisation } = useOrganisationContext();

  const { mutateAsync, isPending } = useCreateMetricDefinition(organisation.id);

  const [label, setLabelState] = useState(initialLabel);

  // Key is derived from label — never exposed to the user.
  const [key, setKeyState] = useState(toParameterKey(initialLabel));

  const [symbol, setSymbol] = useState('');

  const [unit, setUnit] = useState('');

  const [dataType, setDataTypeState] = useState<MetricDataType>('number');

  const [error, setError] = useState<string | null>(null);

  const setLabel = (next: string) => {
    setLabelState(next);
    setKeyState(toParameterKey(next));
  };

  const setDataType = (next: string) => {
    if (isMetricDataType(next)) {
      setDataTypeState(next);
    }
  };

  const save = async () => {
    if (!label.trim()) {
      setError('Enter a name for this parameter.');

      return;
    }
    if (!isValidParameterKey(key)) {
      setError('The name must start with a letter and use only letters, numbers, spaces, or punctuation.');

      return;
    }
    if (takenKeys.has(key)) {
      setError(`A parameter with that name already exists in this template.`);

      return;
    }
    if (!symbol.trim()) {
      setError('Enter a symbol (e.g. °C, bar, %).');

      return;
    }
    if (!unit.trim()) {
      setError('Enter a unit name (e.g. Celsius, Bar, Percent).');

      return;
    }
    try {
      const definition = await mutateAsync({
        key,
        label: label.trim(),
        data_type: dataType,
        symbol: symbol.trim(),
        unit: unit.trim(),
      });

      onCreated(parameterFromDefinition(definition));
    } catch (cause: unknown) {
      setError(getErrorMessage(cause, 'Unable to create parameter.'));
    }
  };

  return {
    label,
    setLabel,
    symbol,
    setSymbol,
    unit,
    setUnit,
    dataType,
    setDataType,
    error,
    isPending,
    save,
  };
}
