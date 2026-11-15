import { WarningCircleIcon } from '@phosphor-icons/react';
import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useOrganisationContext } from '@/app/pages/(organisation)/context';
import { useLocationActions } from '@/app/pages/locations/shared/hooks/use-location-actions';
import { useDeleteLocation } from '@/app/pages/locations/shared/hooks/use-location-mutations';
import { useFetchLocations } from '@/app/pages/locations/shared/hooks/use-location-queries';

import { Button } from '@/app/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/app/shared/components/ui/dialog';
import { Spinner } from '@/app/shared/components/ui/spinner';
import { toast } from '@/app/shared/hooks/use-toast';
import { getErrorMessage } from '@/app/shared/utils/error-message';

export function LocationDeleteDialog() {
  const navigate = useNavigate();

  const { locationId: activeLocationId } = useParams();

  const { organisation } = useOrganisationContext();

  const { action, targetId, closeDialog } = useLocationActions();

  const { data: locations = [] } = useFetchLocations(organisation.id);

  const { mutateAsync, isPending: isDeleting } = useDeleteLocation(organisation.id);

  const location = targetId ? locations.find((item) => item.id === targetId) : null;

  const isOpen = action === 'delete' && Boolean(location);

  const directChildCount = useMemo(() => {
    if (!location) {
      return 0;
    }

    return locations.filter((item) => item.parent_id === location.id).length;
  }, [locations, location]);

  const hasChildren = directChildCount > 0;

  const canConfirm = !hasChildren;

  const handleOpenChange = (open: boolean) => {
    if (!open && !isDeleting) {
      closeDialog();
    }
  };

  const handleDelete = async () => {
    if (!location || !canConfirm) {
      return;
    }
    const { id, name } = location;

    try {
      await mutateAsync(id);
      closeDialog();
      toast({
        variant: 'success',
        title: 'Location deleted',
        description: `"${name}" has been permanently deleted.`,
      });
      if (activeLocationId === id) {
        void navigate('/locations', { replace: true });
      }
    } catch (cause: unknown) {
      toast({
        variant: 'destructive',
        title: 'Unable to delete Location',
        description: getErrorMessage(cause),
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-md">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle className="flex items-center gap-2 pt-2">Delete Location?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. It will permanently remove this Location from your organization.
          </DialogDescription>
        </DialogHeader>

        {hasChildren && (
          <div className="px-6 pt-4">
            <div
              role="alert"
              className="border-destructive/30 bg-destructive/10 text-destructive flex items-start gap-3 rounded-lg border p-3.5 text-xs leading-relaxed"
            >
              <WarningCircleIcon size={18} weight="fill" className="mt-0.5 shrink-0" aria-hidden="true" />
              <div>
                <p className="text-destructive font-semibold">
                  Cannot delete an area that contains sub-locations
                </p>
                <p className="text-muted-foreground mt-1">
                  This area currently contains{' '}
                  <span className="text-foreground font-semibold">
                    {directChildCount} {directChildCount === 1 ? 'sub-location' : 'sub-locations'}
                  </span>
                  . Remove or reassign them before deleting this area.
                </p>
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="border-border mt-6 gap-2 border-t px-6 py-4 sm:justify-end">
          <Button type="button" disabled={isDeleting} onClick={closeDialog}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={isDeleting || !canConfirm}
            onClick={() => void handleDelete()}
          >
            {isDeleting ? (
              <>
                <Spinner className="size-4" />
                Deleting...
              </>
            ) : (
              'Delete Location'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
