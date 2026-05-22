import React, { useState } from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { useExports } from '../hooks/useExports';
import { EmptyState } from '../components/shared/EmptyState';
import { createExport } from '../api/exports';
import { useToast } from '../components/shared/ToastProvider';
import { useQueryClient } from '@tanstack/react-query';
import { Plus, X } from 'lucide-react';
import type { ExportType } from '../types';
import { formatDate } from '../utils/cn';

const EXPORT_TYPES: { value: ExportType; label: string }[] = [
  { value: 'csv', label: 'CSV' },
  { value: 'excel', label: 'Excel' },
  { value: 'xero', label: 'Xero' },
  { value: 'sage', label: 'Sage' },
  { value: 'quickbooks', label: 'QuickBooks' },
];

const statusColor: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  completed: 'bg-emerald-100 text-emerald-700',
  failed: 'bg-red-100 text-red-700',
};

const ExportsPage: React.FC = () => {
  const { data, isLoading } = useExports();
  const qc = useQueryClient();
  const { show } = useToast();
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<ExportType>('csv');
  const [period, setPeriod] = useState('');
  const [approvedOnly, setApprovedOnly] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async () => {
    try {
      setSubmitting(true);
      await createExport({ export_type: type, period: period || null, parameters: { approved_only: approvedOnly } });
      show({ title: 'Export started', description: 'Your export is being generated.', variant: 'info' });
      setOpen(false);
      setPeriod('');
      void qc.invalidateQueries({ queryKey: ['exports'] });
    } catch {
      show({ title: 'Export failed', description: 'Please try again.', variant: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageWrapper>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-xs text-slate-500">{data?.length ?? 0} export run{(data?.length ?? 0) !== 1 ? 's' : ''}</p>
        <button type="button" onClick={() => setOpen(true)}
          className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-white shadow-sm hover:bg-primary/90">
          <Plus className="h-3.5 w-3.5" /> New export
        </button>
      </div>

      {isLoading && <div className="h-64 animate-pulse rounded-xl bg-slate-100" />}

      {!isLoading && (!data || data.length === 0) && (
        <EmptyState
          title="No exports yet"
          description="Approve some documents first, then generate CSV, Excel or direct accounting exports."
        />
      )}

      {!isLoading && data && data.length > 0 && (
        <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500">
                <th className="px-4 py-2.5 text-left">Type</th>
                <th className="px-4 py-2.5 text-left">Period</th>
                <th className="px-4 py-2.5 text-left">Status</th>
                <th className="px-4 py-2.5 text-left">Created</th>
                <th className="px-4 py-2.5 text-left">Download</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {data.map((exp) => (
                <tr key={exp.id}>
                  <td className="px-4 py-3 text-xs font-semibold text-slate-800">{exp.export_type.toUpperCase()}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{exp.period ?? '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${
                      statusColor[exp.status] ?? 'bg-slate-100 text-slate-600'
                    }`}>{exp.status}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500">{formatDate(exp.created_at)}</td>
                  <td className="px-4 py-3">
                    {exp.download_url ? (
                      <a href={exp.download_url} target="_blank" rel="noreferrer"
                        className="text-xs font-medium text-primary hover:underline">Download</a>
                    ) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* New export modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-900">New export</h2>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-700">Export type</label>
                <select value={type} onChange={(e) => setType(e.target.value as ExportType)}
                  className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm focus:border-primary focus:outline-none">
                  {EXPORT_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-700">Period (optional)</label>
                <input type="text" value={period} onChange={(e) => setPeriod(e.target.value)}
                  placeholder="e.g. 04/2026"
                  className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm placeholder:text-slate-400 focus:border-primary focus:outline-none" />
              </div>
              <label className="flex items-center gap-2.5 text-sm text-slate-700">
                <input type="checkbox" checked={approvedOnly} onChange={(e) => setApprovedOnly(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-primary" />
                Include only approved documents
              </label>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={() => setOpen(false)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50">Cancel</button>
              <button type="button" onClick={onSubmit} disabled={submitting}
                className="rounded-lg bg-primary px-4 py-2 text-xs font-medium text-white shadow-sm hover:bg-primary/90 disabled:opacity-60">
                {submitting ? 'Starting…' : 'Start export'}
              </button>
            </div>
          </div>
        </div>
      )}
    </PageWrapper>
  );
};

export default ExportsPage;
