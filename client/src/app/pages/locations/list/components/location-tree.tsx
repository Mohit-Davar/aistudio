import { CaretDownIcon, CaretRightIcon, PencilSimpleIcon, PlusIcon, TrashIcon } from '@phosphor-icons/react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { useLocationActions } from '@/app/pages/locations/shared/hooks/use-location-actions';
import type { LocationTreeNode } from '@/app/pages/locations/shared/lib/build-location-tree';
import { getLocationType } from '@/app/pages/locations/shared/lib/location-type';
import { RowActions } from '@/app/shared/components/row-actions';

interface LocationTreeProps {
  nodes: LocationTreeNode[];
}

export function LocationTree({ nodes }: LocationTreeProps) {
  const { openCreate, openRename, openDelete, can } = useLocationActions();

  // Collapsed state per node (all expanded by default)
  const [collapsedNodes, setCollapsedNodes] = useState<Record<string, boolean>>({});

  const toggleCollapse = (id: string) => {
    setCollapsedNodes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const renderNodes = (items: LocationTreeNode[], level: number) =>
    items.map(({ location, children }) => {
      const hasChildren = children.length > 0;

      const isCollapsed = Boolean(collapsedNodes[location.id]);

      const locationType = getLocationType(location);

      const canAddChild = can.create && location.can_have_children;

      return (
        <li
          key={location.id}
          role="treeitem"
          aria-selected={false}
          aria-expanded={hasChildren ? !isCollapsed : undefined}
          aria-level={level}
          aria-label={`${location.name}, ${locationType.label.toLowerCase()}`}
          className="relative list-none"
        >
          {/* Row item */}
          <div className="group hover:bg-muted/50 focus-within:bg-muted/50 flex min-h-10 items-center gap-1.5 px-2 py-1 transition-colors">
            {hasChildren ? (
              <button
                type="button"
                onClick={() => toggleCollapse(location.id)}
                className="text-muted-foreground focus-visible:ring-ring flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-md focus-visible:ring-2 focus-visible:outline-none"
                aria-label={isCollapsed ? `Expand ${location.name}` : `Collapse ${location.name}`}
              >
                {isCollapsed ? (
                  <CaretRightIcon size={14} weight="bold" aria-hidden="true" />
                ) : (
                  <CaretDownIcon size={14} weight="bold" aria-hidden="true" />
                )}
              </button>
            ) : (
              // Leaf alignment placeholder
              <span aria-hidden="true" className="flex size-7 shrink-0 items-center justify-center">
                <span className="bg-muted-foreground/40 size-1.5 rounded-full" />
              </span>
            )}

            <Link
              to={`/locations/${location.id}`}
              className="text-foreground group-hover:text-primary group-focus-within:text-primary focus-visible:text-primary inline-flex min-w-0 flex-1 items-center text-sm font-medium transition-colors focus-visible:outline-none"
            >
              <span className="min-w-0 truncate">{location.name}</span>
            </Link>

            {/* Menu trigger visible all the time using standard RowActions */}
            <RowActions
              label={location.name}
              actions={[
                can.update && {
                  key: 'rename',
                  label: 'Rename',
                  icon: <PencilSimpleIcon size={14} />,
                  onClick: () => openRename(location.id),
                },
                canAddChild && {
                  key: 'create-sub',
                  label: 'Add sub-location',
                  icon: <PlusIcon size={14} />,
                  onClick: () => openCreate(location.id),
                },
                can.delete && 'separator',
                can.delete && {
                  key: 'delete',
                  label: 'Delete',
                  icon: <TrashIcon size={14} />,
                  destructive: true,
                  onClick: () => openDelete(location.id),
                },
              ]}
            />
          </div>

          {hasChildren && !isCollapsed && (
            <ul
              role="group"
              aria-label={`${location.name} sub-locations`}
              className="border-border/60 ml-3.5 border-l pl-2 sm:ml-4 sm:pl-3"
            >
              {renderNodes(children, level + 1)}
            </ul>
          )}
        </li>
      );
    });

  return (
    <ul role="tree" aria-label="Location hierarchy" className="space-y-0.5 p-2">
      {renderNodes(nodes, 1)}
    </ul>
  );
}
