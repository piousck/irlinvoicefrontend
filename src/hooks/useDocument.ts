import { useQuery } from '@tanstack/react-query';
import { getDocument } from '../api/documents';
import type { DocumentDetail } from '../types';

export function useDocument(id?: string) {
  return useQuery<DocumentDetail, Error>({
    queryKey: ['document', id],
    queryFn: () => getDocument(id as string),
    enabled: Boolean(id),
    staleTime: 30_000,
  });
}
