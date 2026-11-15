import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createLocation, deleteLocation, updateLocation } from '@/app/pages/locations/shared/api';
import { locationQueries } from '@/app/pages/locations/shared/queries';
import type { LocationFormValues, LocationRenameValues } from '@/app/pages/locations/shared/types';

export function useCreateLocation(organisationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: LocationFormValues) => createLocation(organisationId, values),

    onSuccess: async (location) => {
      queryClient.setQueryData(locationQueries.detail(organisationId, location.id).queryKey, location);

      await queryClient.invalidateQueries({
        queryKey: locationQueries.list(organisationId).queryKey,
      });
    },
  });
}

export function useRenameLocation(organisationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ locationId, values }: { locationId: string; values: LocationRenameValues }) =>
      updateLocation(organisationId, locationId, values),

    onSuccess: async (location) => {
      queryClient.setQueryData(locationQueries.detail(organisationId, location.id).queryKey, location);

      await queryClient.invalidateQueries({
        queryKey: locationQueries.list(organisationId).queryKey,
      });
    },
  });
}

export function useDeleteLocation(organisationId: string) {
  const queryClient = useQueryClient();

  const listQueryKey = locationQueries.list(organisationId).queryKey;

  return useMutation({
    mutationFn: (locationId: string) => deleteLocation(organisationId, locationId),

    onMutate: async (locationId) => {
      await queryClient.cancelQueries({ queryKey: listQueryKey });

      const previousLocations = queryClient.getQueryData(listQueryKey);

      queryClient.setQueryData(listQueryKey, (locations) =>
        locations?.filter((location) => location.id !== locationId),
      );

      return { previousLocations };
    },

    onError: (_error, _locationId, context) => {
      if (context?.previousLocations !== undefined) {
        queryClient.setQueryData(listQueryKey, context.previousLocations);
      }
    },

    onSuccess: (_result, locationId) => {
      queryClient.removeQueries({
        queryKey: locationQueries.detail(organisationId, locationId).queryKey,
        exact: true,
      });
    },

    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: listQueryKey });
    },
  });
}
