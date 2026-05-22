import { apiClient } from './client';
import type { ReviewAction } from '../types';

export async function createReviewAction(
  documentId: string,
  body: {
    action_type: 'approve' | 'reject' | 'correct_field';
    field_name?: string;
    corrected_value?: string;
  },
) {
  const { data } = await apiClient.post(`/review/${documentId}/action`, body);
  return data;
}

export async function listReviewActions(documentId: string): Promise<ReviewAction[]> {
  const { data } = await apiClient.get<ReviewAction[]>(`/review/${documentId}/actions`);
  return data;
}
