import { useQuery } from '@tanstack/react-query';
import { listExports } from '../api/exports';
import type { ExportRun } from '../types';

export function useExports() {
  return useQuery<ExportRun[], Error>({
    queryKey: ['exports'],
    queryFn: listExports,
    staleTime: 10_000,
    refetchInterval: (query) => {
      const anyPending = (query.state.data ?? []).some((e) => e.status === 'pending');
      return anyPending ? 5_000 : false;
    },
  });
}
