import { DotsThreeIcon } from '@phosphor-icons/react';
import React, { useRef } from 'react';

import { Button } from '@/app/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/app/shared/components/ui/dropdown-menu';

export type ActionItem = {
  key?: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  onClick: () => void;
  destructive?: boolean;
  disabled?: boolean;
};

export type ActionGroup = {
  key?: string;
  items: ActionItem[];
};

export type RowAction = ActionItem | ActionGroup | 'separator';

export type RowActionsProps = {
  /** Record name or description, used for accessible aria-labels */
  label: string;
  /**
   * Flexible list of actions: ActionItems, ActionGroups, or 'separator'.
   * False/undefined items can be passed inline and will be automatically filtered out.
   */
  actions: (RowAction | false | null | undefined)[];
  /** Optional custom trigger button */
  trigger?: React.ReactNode;
  align?: 'start' | 'center' | 'end';
  className?: string;
};

function isActionGroup(action: RowAction): action is ActionGroup {
  return typeof action === 'object' && action !== null && 'items' in action && Array.isArray(action.items);
}

/**
 * Clean, generic dropdown actions menu for lists, tables, and trees.
 * Accepts any arbitrary list of actions without special-case logic.
 */
export function RowActions({ label, actions, trigger, align = 'end', className }: RowActionsProps) {
  const pendingAction = useRef<(() => void) | null>(null);

  const validActions = actions.filter((action): action is RowAction => Boolean(action));

  if (validActions.length === 0) {
    return null;
  }

  const handleSelect = (onClick: () => void) => {
    pendingAction.current = onClick;
  };

  const renderItem = (item: ActionItem, index: number) => (
    <DropdownMenuItem
      key={item.key ?? (typeof item.label === 'string' ? item.label : index)}
      disabled={item.disabled}
      onSelect={() => handleSelect(item.onClick)}
      className={
        item.destructive ? 'text-destructive focus:bg-destructive/10 focus:text-destructive' : undefined
      }
    >
      {item.icon && (
        <span className={`mr-2 ${item.destructive ? 'opacity-80' : 'opacity-70'}`}>{item.icon}</span>
      )}
      {item.label}
    </DropdownMenuItem>
  );

  return (
    <div className={`flex justify-end ${className ?? ''}`}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {trigger ? (
            trigger
          ) : (
            <Button
              size="icon-sm"
              variant="ghost"
              className="text-muted-foreground hover:bg-muted/80 hover:text-foreground size-8 shrink-0"
              aria-label={`Actions for ${label}`}
              onClick={(event) => event.stopPropagation()}
            >
              <DotsThreeIcon size={18} weight="bold" aria-hidden="true" />
            </Button>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align={align}
          className="w-48"
          onClick={(event) => event.stopPropagation()}
          onCloseAutoFocus={() => {
            const action = pendingAction.current;

            if (action) {
              pendingAction.current = null;
              window.setTimeout(action, 0);
            }
          }}
        >
          {validActions.map((action, idx) => {
            if (action === 'separator') {
              return <DropdownMenuSeparator key={`sep-${idx}`} />;
            }

            if (isActionGroup(action)) {
              return (
                <React.Fragment key={action.key ?? `group-${idx}`}>
                  {idx > 0 && <DropdownMenuSeparator />}
                  {action.items.map(renderItem)}
                </React.Fragment>
              );
            }

            return renderItem(action, idx);
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
