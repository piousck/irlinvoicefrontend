import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageWrapper } from '../components/layout/PageWrapper';
import { useDocument } from '../hooks/useDocument';
import { useReview } from '../hooks/useReview';
import { StatusBadge } from '../components/shared/StatusBadge';
import { DocTypeBadge } from '../components/shared/DocTypeBadge';
import { FieldEditor } from '../components/documents/FieldEditor';
import { analyzeDocument, runOcr } from '../api/processing';
import { createReviewAction } from '../api/review';
import { useToast } from '../components/shared/ToastProvider';
import { useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/cn';
import type { DocumentDetail } from '../types';

const STATUSES = ['uploaded', 'extracted', 'analyzed', 'reviewed', 'exported'] as const;

const DocumentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data: doc, isLoading } = useDocument(id);
  const { data: actions } = useReview(id);
  const { show } = useToast();
  const [activeTab, setActiveTab] = useState<'fields' | 'history'>('fields');
  const [running, setRunning] = useState<'ocr' | 'analyze' | null>(null);

  if (isLoading) {
    return (
      <PageWrapper>
        <div className="grid animate-pulse grid-cols-2 gap-4">
          <div className="h-[75vh] rounded-xl bg-slate-100" />
          <div className="h-[75vh] rounded-xl bg-slate-100" />
        </div>
      </PageWrapper>
    );
  }

  if (!doc) {
    return (
      <PageWrapper>
        <div className="rounded-xl bg-red-50 p-6 text-sm text-red-700">Document not found.</div>
      </PageWrapper>
    );
  }

  const refresh = () => {
    void qc.invalidateQueries({ queryKey: ['document', id] });
    void qc.invalidateQueries({ queryKey: ['documents'] });
  };

  const handleAction = async (action_type: 'approve' | 'reject') => {
    try {
      await createReviewAction(doc.id, { action_type });
      show({ title: action_type === 'approve' ? 'Document approved' : 'Document rejected', variant: action_type === 'approve' ? 'success' : 'warning' });
      refresh();
    } catch {
      show({ title: 'Action failed', variant: 'error' });
    }
  };

  const handleCorrectField = async (field: string, value: string) => {
    try {
      await createReviewAction(doc.id, { action_type: 'correct_field', field_name: field, corrected_value: value });
      show({ title: 'Field updated', variant: 'success' });
      refresh();
    } catch {
      show({ title: 'Update failed', variant: 'error' });
    }
  };

  const handleOcr = async () => {
    try { setRunning('ocr'); await runOcr(doc.id); show({ title: 'OCR completed', variant: 'success' }); refresh(); }
    catch { show({ title: 'OCR failed', variant: 'error' }); }
    finally { setRunning(null); }
  };

  const handleAnalyze = async () => {
    try { setRunning('analyze'); await analyzeDocument(doc.id); show({ title: 'Analysis complete', variant: 'success' }); refresh(); }
    catch { show({ title: 'Analysis failed', variant: 'error' }); }
    finally { setRunning(null); }
  };

  const fields: Array<{ key: keyof DocumentDetail; label: string; format?: (v: unknown) => string }> = [
    { key: 'supplier_name', label: 'Supplier name' },
    { key: 'vat_number', label: 'VAT number' },
    { key: 'invoice_number', label: 'Invoice number' },
    { key: 'invoice_date', label: 'Invoice date', format: (v) => formatDate(v as string) },
    { key: 'due_date', label: 'Due date', format: (v) => formatDate(v as string) },
    { key: 'subtotal', label: 'Subtotal', format: (v) => formatCurrency(v as number) },
    { key: 'vat_amount', label: 'VAT amount', format: (v) => formatCurrency(v as number) },
    { key: 'total_amount', label: 'Total amount', format: (v) => formatCurrency(v as number) },
    { key: 'currency', label: 'Currency' },
  ];

  const currentStatusIdx = STATUSES.indexOf(doc.status as typeof STATUSES[number]);

  return (
    <PageWrapper>
      {/* Back */}
      <button
        type="button"
        onClick={() => navigate('/')}
        className="mb-4 flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to inbox
      </button>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* LEFT — document viewer */}
        <div className="flex flex-col rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <div>
              <p className="max-w-[260px] truncate text-sm font-semibold text-slate-900">{doc.filename}</p>
              <p className="mt-0.5 text-xs text-slate-400">{formatDate(doc.created_at)}</p>
            </div>
            <StatusBadge status={doc.status} />
          </div>
          <div className="flex flex-1 items-center justify-center rounded-b-xl bg-slate-50 px-6 py-16 text-center">
            <div>
              <svg viewBox="0 0 64 64" fill="none" className="mx-auto mb-4 h-16 w-16 text-slate-300">
                <rect x="8" y="4" width="48" height="56" rx="4" stroke="currentColor" strokeWidth="2" />
                <path d="M20 20h24M20 30h24M20 40h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <p className="text-sm font-medium text-slate-500">Document preview</p>
              <p className="mt-1 text-xs text-slate-400 max-w-xs">
                Wire a PDF viewer here once the backend returns a file URL.
              </p>
              {doc.pages?.length > 0 && (
                <p className="mt-2 text-xs text-slate-400">{doc.pages.length} page(s) extracted</p>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT — data & actions */}
        <div className="flex flex-col rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
          {/* Header */}
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 px-4 py-3">
            <DocTypeBadge type={doc.doc_type} />
            <div className="ml-auto flex flex-wrap gap-1.5">
              <ActionBtn onClick={handleOcr} loading={running === 'ocr'} label="Run OCR" loadingLabel="Running…" />
              <ActionBtn onClick={handleAnalyze} loading={running === 'analyze'} label="Analyse" loadingLabel="Analysing…" />
              <button type="button" onClick={() => handleAction('approve')}
                className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700">
                Approve
              </button>
              <button type="button" onClick={() => handleAction('reject')}
                className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700">
                Reject
              </button>
            </div>
          </div>

          {/* Status stepper */}
          <div className="border-b border-slate-100 px-4 py-3">
            <div className="flex items-center gap-1">
              {STATUSES.map((s, i) => (
                <React.Fragment key={s}>
                  <div className="flex flex-col items-center gap-1">
                    <div className={`h-2 w-2 rounded-full ${
                      i <= currentStatusIdx ? 'bg-primary' : 'bg-slate-200'
                    }`} />
                    <span className="text-[10px] capitalize text-slate-400">{s}</span>
                  </div>
                  {i < STATUSES.length - 1 && (
                    <div className={`mb-3 h-0.5 flex-1 ${
                      i < currentStatusIdx ? 'bg-primary' : 'bg-slate-200'
                    }`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 border-b border-slate-100 px-4 pt-3">
            {(['fields', 'history'] as const).map((tab) => (
              <button key={tab} type="button" onClick={() => setActiveTab(tab)}
                className={`rounded-t-lg px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                  activeTab === tab
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-slate-500 hover:text-slate-800'
                }`}>
                {tab === 'fields' ? 'Extracted fields' : 'Review history'}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-auto p-4">
            {activeTab === 'fields' && (
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {fields.map(({ key, label }) => (
                  <FieldEditor
                    key={key as string}
                    label={label}
                    value={(doc as unknown as Record<string, unknown>)[key as string] as string | number | null}
                    onSave={(val) => handleCorrectField(key as string, val)}
                  />
                ))}
              </div>
            )}

            {activeTab === 'history' && (
              <ul className="space-y-2">
                {(actions ?? []).length === 0 && (
                  <p className="py-4 text-center text-sm text-slate-400">No review actions yet.</p>
                )}
                {(actions ?? []).map((a) => (
                  <li key={a.id} className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold capitalize text-slate-700">
                        {a.action_type.replace('_', ' ')}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {formatDate(a.created_at)}
                      </span>
                    </div>
                    {a.field_name && (
                      <p className="mt-1 text-xs text-slate-500">
                        {a.field_name}: <span className="font-medium">{a.corrected_value}</span>
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

const ActionBtn: React.FC<{ onClick: () => void; loading: boolean; label: string; loadingLabel: string }> = ({
  onClick, loading, label, loadingLabel
}) => (
  <button type="button" onClick={onClick} disabled={loading}
    className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60">
    {loading && <Loader2 className="h-3 w-3 animate-spin" />}
    {loading ? loadingLabel : label}
  </button>
);

export default DocumentDetailPage;
