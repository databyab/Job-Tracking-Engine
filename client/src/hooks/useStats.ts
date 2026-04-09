import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import type { Statistics } from '../types';

export const useStats = () => {
  return useQuery<Statistics>({
    queryKey: ['stats'],
    queryFn: async () => {
      const { data } = await api.get('/applications/stats');
      return data;
    },
  });
};
