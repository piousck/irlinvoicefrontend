import { apiClient } from './client';

export async function runOcr(documentId: string) {
  const { data } = await apiClient.post(`/ocr/run-ocr/${documentId}`);
  return data;
}

export async function analyzeDocument(documentId: string) {
  const { data } = await apiClient.post(`/analyze/${documentId}`);
  return data;
}
