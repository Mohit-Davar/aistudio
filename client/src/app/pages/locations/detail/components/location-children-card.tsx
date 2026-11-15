import { CaretRightIcon, MagnifyingGlassIcon, PlusIcon } from '@phosphor-icons/react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useLocationActions } from '@/app/pages/locations/shared/hooks/use-location-actions';
import { getLocationType, LocationTypeIcon } from '@/app/pages/locations/shared/lib/location-type';
import type { Location } from '@/app/pages/locations/shared/types';
import { EmptySearchResult, EmptyState } from '@/app/shared/components/states/empty-state';
import { Button } from '@/app/shared/components/ui/button';
import { Input } from '@/app/shared/components/ui/input';

interface LocationChildrenSectionProps {
  location: Location;
  childrenLocations: Location[];
}

const SEARCH_THRESHOLD = 6;

export function LocationChildrenSection({ location, childrenLocations }: LocationChildrenSectionProps) {
  const { openCreate, can } = useLocationActions();

  const [searchQuery, setSearchQuery] = useState('');

  // Search appears only once the list is long enough to need it
  const showSearch = childrenLocations.length >= SEARCH_THRESHOLD;

  const filteredChildren = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!showSearch || !query) {
      return childrenLocations;
    }

    return childrenLocations.filter((child) => child.name.toLowerCase().includes(query));
  }, [childrenLocations, searchQuery, showSearch]);

  return (
    <section aria-labelledby="sub-locations-heading" className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 id="sub-locations-heading" className="text-foreground text-sm font-semibold tracking-tight">
          Sub-locations
        </h2>

        {showSearch && (
          <div className="relative w-full sm:w-64">
            <MagnifyingGlassIcon
              size={14}
              className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2"
              aria-hidden="true"
            />
            <Input
              type="search"
              placeholder="Filter by name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 pl-8 text-xs"
              aria-label="Filter sub-locations by name"
            />
          </div>
        )}
      </div>

      <SubLocationsContent
        hasChildren={childrenLocations.length > 0}
        locations={filteredChildren}
        searchQuery={searchQuery.trim()}
        onClearSearch={() => setSearchQuery('')}
        canCreate={can.create}
        onCreate={() => openCreate(location.id)}
      />
    </section>
  );
}

interface SubLocationsContentProps {
  hasChildren: boolean;
  locations: Location[];
  searchQuery: string;
  onClearSearch: () => void;
  canCreate: boolean;
  onCreate: () => void;
}

function SubLocationsContent({
  hasChildren,
  locations,
  searchQuery,
  onClearSearch,
  canCreate,
  onCreate,
}: SubLocationsContentProps) {
  const navigate = useNavigate();

  if (!hasChildren) {
    return (
      <EmptyState
        title="No sub-locations yet"
        description="Add sub-locations to manage devices."
        variant="card"
        action={
          canCreate ? (
            <Button size="sm" onClick={onCreate} className="h-8 gap-1.5 px-3 text-xs">
              <PlusIcon size={14} weight="bold" aria-hidden="true" />
              Add sub-location
            </Button>
          ) : undefined
        }
      />
    );
  }

  if (locations.length === 0) {
    return <EmptySearchResult query={searchQuery} onClear={onClearSearch} />;
  }

  return (
    <ul className="border-border/70 bg-card divide-border/60 divide-y overflow-hidden rounded-lg border shadow-xs">
      {locations.map((child) => {
        const type = getLocationType(child);

        return (
          <li key={child.id}>
            <button
              type="button"
              onClick={() => void navigate(`/locations/${child.id}`)}
              aria-label={`Open ${child.name}, ${type.label.toLowerCase()}`}
              className="hover:bg-muted/50 focus-visible:bg-muted/50 focus-visible:ring-ring group flex w-full cursor-pointer items-center justify-between gap-4 px-4 py-3 text-left transition-colors focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span
                  className="border-border/60 bg-muted/40 flex size-8 shrink-0 items-center justify-center rounded-md border"
                  aria-hidden="true"
                >
                  <LocationTypeIcon location={child} className="text-primary" />
                </span>
                <div className="min-w-0">
                  <span className="text-foreground block truncate text-sm font-medium">{child.name}</span>
                  <span className="text-muted-foreground block truncate text-xs">
                    {type.label} · {type.hint}
                  </span>
                </div>
              </div>

              <CaretRightIcon
                size={15}
                className="text-muted-foreground/70 group-hover:text-muted-foreground shrink-0 transition-colors"
                aria-hidden="true"
              />
            </button>
          </li>
        );
      })}
    </ul>
  );
}
