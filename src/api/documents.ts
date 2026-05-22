import { apiClient } from './client';
import type { DocumentDetail, DocumentSummary } from '../types';

export async function listDocuments(): Promise<DocumentSummary[]> {
  const { data } = await apiClient.get<DocumentSummary[]>('/documents');
  return data;
}

export async function getDocument(id: string): Promise<DocumentDetail> {
  const { data } = await apiClient.get<DocumentDetail>(`/documents/${id}`);
  return data;
}

export async function deleteDocument(id: string): Promise<void> {
  await apiClient.delete(`/documents/${id}`);
}

export async function uploadDocument(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await apiClient.post('/ingest/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data as { id: string; filename: string; status: string };
}
