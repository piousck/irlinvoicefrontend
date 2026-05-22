import { useQuery } from '@tanstack/react-query';
import { listDocuments } from '../api/documents';
import type { DocumentSummary } from '../types';

export function useDocuments() {
  return useQuery<DocumentSummary[], Error>({
    queryKey: ['documents'],
    queryFn: listDocuments,
    staleTime: 30_000,
  });
}
