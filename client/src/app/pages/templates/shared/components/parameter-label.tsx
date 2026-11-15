type ParameterLabelProps = {
  label: string;
  symbol?: string | null;
  unit?: string | null;
  className?: string;
};

/**
 * Standardized presentation for a template or catalogue metric:
 * - High-contrast label
 * - Subtle unit/symbol pill (e.g. "ppm", "°C", "L/min")
 */
export function ParameterLabel({ label, symbol, unit, className = '' }: ParameterLabelProps) {
  const displayUnit = symbol && unit && symbol !== unit ? `${unit} (${symbol})` : unit || symbol;

  return (
    <div className={`flex min-w-0 items-center justify-between gap-2.5 ${className}`}>
      <div className="flex min-w-0 items-center gap-2">
        <span className="text-foreground truncate text-sm font-medium">{label}</span>
        {displayUnit && (
          <span className="bg-muted text-muted-foreground shrink-0 rounded px-1.5 py-0.5 font-mono text-xs">
            {displayUnit}
          </span>
        )}
      </div>
    </div>
  );
}
