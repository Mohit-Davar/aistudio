import { useCustomParameterForm } from '@/app/pages/templates/shared/hooks/use-custom-parameter-form';
import { DATA_TYPE_LABELS, DATA_TYPES } from '@/app/pages/templates/shared/lib/parameters';
import type { TemplateParameterInput } from '@/app/pages/templates/shared/types';
import { Button } from '@/app/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/app/shared/components/ui/dialog';
import { Field, FieldError, FieldLabel } from '@/app/shared/components/ui/field';
import { Input } from '@/app/shared/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/shared/components/ui/select';

type CustomParameterDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialLabel: string;
  takenKeys: Set<string>;
  onCreated: (parameter: TemplateParameterInput) => void;
};

export function CustomParameterDialog({
  open,
  onOpenChange,
  initialLabel,
  takenKeys,
  onCreated,
}: CustomParameterDialogProps) {
  const { label, setLabel, symbol, setSymbol, unit, setUnit, dataType, setDataType, error, isPending, save } =
    useCustomParameterForm({
      initialLabel,
      takenKeys,
      onCreated: (parameter) => {
        onCreated(parameter);
        onOpenChange(false);
      },
    });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void save();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!isPending) onOpenChange(nextOpen);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create custom parameter</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-4">
            <Field>
              <FieldLabel htmlFor="custom-parameter-label" required>
                Parameter name
              </FieldLabel>
              <Input
                id="custom-parameter-label"
                // eslint-disable-next-line jsx-a11y/no-autofocus
                autoFocus
                value={label}
                placeholder="e.g. Temperature"
                disabled={isPending}
                onChange={(event) => setLabel(event.target.value)}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="custom-parameter-type" required>
                Value type
              </FieldLabel>
              <Select value={dataType} onValueChange={setDataType} disabled={isPending}>
                <SelectTrigger id="custom-parameter-type" className="w-full">
                  <SelectValue placeholder="Select a value type" />
                </SelectTrigger>
                <SelectContent>
                  {DATA_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {DATA_TYPE_LABELS[type]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Field>
                <FieldLabel htmlFor="custom-parameter-symbol" required>
                  Symbol
                </FieldLabel>
                <Input
                  id="custom-parameter-symbol"
                  value={symbol}
                  placeholder="e.g. °C"
                  maxLength={40}
                  disabled={isPending}
                  onChange={(event) => setSymbol(event.target.value)}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="custom-parameter-unit" required>
                  Unit name
                </FieldLabel>
                <Input
                  id="custom-parameter-unit"
                  value={unit}
                  placeholder="e.g. Celsius"
                  maxLength={40}
                  disabled={isPending}
                  onChange={(event) => setUnit(event.target.value)}
                />
              </Field>
            </div>
          </div>

          <FieldError>{error}</FieldError>

          <DialogFooter>
            <Button
              type="button"
              variant="destructive"
              disabled={isPending}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending} loading={isPending} loadingText="Creating…">
              Create parameter
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
