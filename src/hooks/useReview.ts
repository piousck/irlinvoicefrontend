import { useQuery } from '@tanstack/react-query';
import { listReviewActions } from '../api/review';
import type { ReviewAction } from '../types';

export function useReview(documentId?: string) {
  return useQuery<ReviewAction[], Error>({
    queryKey: ['review', documentId],
    queryFn: () => listReviewActions(documentId as string),
    enabled: Boolean(documentId),
  });
}
