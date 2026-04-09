import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { applicationAPI } from '../services/api';
import type { Application, CreateApplicationData } from '../types';

export const useApplications = () => {
  return useQuery({
    queryKey: ['applications'],
    queryFn: async () => {
      const response = await applicationAPI.getAll();
      return response.data;
    },
    staleTime: 30000,
  });
};

export const useCreateApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateApplicationData) => applicationAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    },
  });
};

export const useUpdateApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Application> }) =>
      applicationAPI.update(id, data),
    onMutate: async ({ id, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['applications'] });

      // Snapshot previous value
      const previousApplications = queryClient.getQueryData<Application[]>(['applications']);

      // Optimistically update
      queryClient.setQueryData<Application[]>(['applications'], (old) =>
        old?.map((app) => (app._id === id ? { ...app, ...data } : app))
      );

      return { previousApplications };
    },
    onError: (_err, _variables, context) => {
      // Rollback on error
      if (context?.previousApplications) {
        queryClient.setQueryData(['applications'], context.previousApplications);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    },
  });
};

export const useDeleteApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => applicationAPI.delete(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['applications'] });
      const previousApplications = queryClient.getQueryData<Application[]>(['applications']);

      queryClient.setQueryData<Application[]>(['applications'], (old) =>
        old?.filter((app) => app._id !== id)
      );

      return { previousApplications };
    },
    onError: (_err, _id, context) => {
      if (context?.previousApplications) {
        queryClient.setQueryData(['applications'], context.previousApplications);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    },
  });
};
