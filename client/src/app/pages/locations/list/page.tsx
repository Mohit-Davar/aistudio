import { PlusIcon } from '@phosphor-icons/react';
import { useMemo } from 'react';

import { useOrganisationContext } from '@/app/pages/(organisation)/context';
import { LocationTree } from '@/app/pages/locations/list/components/location-tree';
import { LocationDialogs } from '@/app/pages/locations/shared/components/location-dialogs';
import { useLocationActions } from '@/app/pages/locations/shared/hooks/use-location-actions';
import { useFetchLocations } from '@/app/pages/locations/shared/hooks/use-location-queries';
import {
  buildLocationTree,
  type LocationTreeNode,
} from '@/app/pages/locations/shared/lib/build-location-tree';

import { CustomLocationIcon } from '@/app/shared/components/icons/nav-icons';
import { ListMessage, ListView } from '@/app/shared/components/layout/list-view';
import { PageContainer } from '@/app/shared/components/layout/page-container';
import { PageHeader } from '@/app/shared/components/layout/page-header';
import { EmptyState } from '@/app/shared/components/states/empty-state';
import { ErrorState } from '@/app/shared/components/states/error-state';
import { TreeSkeleton } from '@/app/shared/components/states/table-skeleton';
import { Button } from '@/app/shared/components/ui/button';

export function LocationsTreePage() {
  const { organisation } = useOrganisationContext();

  const { openCreate, can } = useLocationActions();

  const {
    data: locations = [],
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useFetchLocations(organisation.id);

  const tree = useMemo(() => buildLocationTree(locations), [locations]);

  return (
    <PageContainer>
      <PageHeader
        title="Locations"
        description="Organise locations across your factories, buildings, and production sites"
        actions={
          can.create && (
            <Button size="sm" onClick={() => openCreate()}>
              <PlusIcon /> Add location
            </Button>
          )
        }
      />
      <ListView
        count={locations.length > 0 ? { shown: locations.length, total: locations.length } : undefined}
        isRefetching={!isLoading && isFetching}
      >
        <LocationsContent
          isLoading={isLoading}
          isError={isError}
          isRetrying={isFetching}
          onRetry={() => void refetch()}
          tree={tree}
          canCreate={can.create}
          onCreate={() => openCreate()}
        />
      </ListView>
      <LocationDialogs />
    </PageContainer>
  );
}

interface LocationsContentProps {
  isLoading: boolean;
  isError: boolean;
  isRetrying: boolean;
  onRetry: () => void;
  tree: LocationTreeNode[];
  canCreate: boolean;
  onCreate: () => void;
}

function LocationsContent({
  isLoading,
  isError,
  isRetrying,
  onRetry,
  tree,
  canCreate,
  onCreate,
}: LocationsContentProps) {
  if (isLoading) {
    return <TreeSkeleton />;
  }

  if (isError) {
    return (
      <ListMessage>
        <ErrorState
          title="Unable to load locations"
          message="We couldn't retrieve your locations. Please verify your connection and try again."
          onRetry={onRetry}
          isRetrying={isRetrying}
        />
      </ListMessage>
    );
  }

  if (tree.length === 0) {
    return (
      <ListMessage>
        <EmptyState
          icon={CustomLocationIcon}
          title="No locations yet"
          description="Create your first location."
          action={
            canCreate ? (
              <Button onClick={onCreate} className="gap-1.5 text-xs font-medium">
                <PlusIcon size={14} weight="bold" aria-hidden="true" />
                Add location
              </Button>
            ) : undefined
          }
        />
      </ListMessage>
    );
  }

  return (
    <div className="p-2">
      <LocationTree nodes={tree} />
    </div>
  );
}
