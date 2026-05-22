import { apiClient } from './client';
import type { ExportRun, ExportType } from '../types';

export async function listExports(): Promise<ExportRun[]> {
  const { data } = await apiClient.get<ExportRun[]>('/exports/');
  return data;
}

export async function createExport(body: {
  export_type: ExportType;
  period?: string | null;
  parameters?: Record<string, unknown> | null;
}) {
  const { data } = await apiClient.post('/exports/', body);
  return data as { id: string };
}
