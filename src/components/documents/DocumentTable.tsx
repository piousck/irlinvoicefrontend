import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { DocumentSummary, DocumentStatus, DocumentType } from '../../types';
import { StatusBadge } from '../shared/StatusBadge';
import { DocTypeBadge } from '../shared/DocTypeBadge';
import { formatDate } from '../../utils/cn';
import { FileText, Trash2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteDocument } from '../../api/documents';
import { useToast } from '../shared/ToastProvider';

interface Props {
  documents: DocumentSummary[];
}

export const DocumentTable: React.FC<Props> = ({ documents }) => {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { show } = useToast();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<DocumentStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<DocumentType | 'all'>('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const PER_PAGE = 20;

  const deleteMut = useMutation({
    mutationFn: deleteDocument,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['documents'] });
      show({ title: 'Document deleted', variant: 'success' });
    },
    onError: () => show({ title: 'Delete failed', variant: 'error' }),
  });

  const toggleAll = () => {
    setSelectedIds((prev) =>
      prev.length === filtered.length ? [] : filtered.map((d) => d.id),
    );
  };

  const toggleOne = (id: string) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  const filtered = documents.filter((doc) => {
    if (statusFilter !== 'all' && doc.status !== statusFilter) return false;
    if (typeFilter !== 'all' && doc.doc_type !== typeFilter) return false;
    if (search && !doc.filename.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 px-4 py-3">
        <input
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search filename…"
          className="h-8 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value as DocumentStatus | 'all'); setPage(1); }}
          className="h-8 rounded-lg border border-slate-200 bg-slate-50 px-2 text-xs focus:border-primary focus:outline-none"
        >
          <option value="all">All statuses</option>
          <option value="uploaded">Uploaded</option>
          <option value="extracted">Extracted</option>
          <option value="analyzed">Analyzed</option>
          <option value="reviewed">Reviewed</option>
          <option value="exported">Exported</option>
        </select>
        <select
          value={typeFilter ?? 'all'}
          onChange={(e) => { setTypeFilter(e.target.value as DocumentType | 'all'); setPage(1); }}
          className="h-8 rounded-lg border border-slate-200 bg-slate-50 px-2 text-xs focus:border-primary focus:outline-none"
        >
          <option value="all">All types</option>
          <option value="invoice">Invoice</option>
          <option value="credit_note">Credit note</option>
          <option value="receipt">Receipt</option>
          <option value="statement">Statement</option>
        </select>
        {selectedIds.length > 0 && (
          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs text-slate-500">{selectedIds.length} selected</span>
            <button
              type="button"
              onClick={() => {
                selectedIds.forEach((id) => deleteMut.mutate(id));
                setSelectedIds([]);
              }}
              className="flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-2 py-1 text-xs text-red-700 hover:bg-red-100"
            >
              <Trash2 className="h-3 w-3" /> Delete selected
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500">
              <th className="px-4 py-2.5 text-left">
                <input
                  type="checkbox"
                  className="h-3.5 w-3.5 rounded border-slate-300"
                  checked={selectedIds.length === paginated.length && paginated.length > 0}
                  onChange={toggleAll}
                />
              </th>
              <th className="px-4 py-2.5 text-left">Filename</th>
              <th className="px-4 py-2.5 text-left">Type</th>
              <th className="px-4 py-2.5 text-left">Status</th>
              <th className="px-4 py-2.5 text-left">Uploaded</th>
              <th className="px-4 py-2.5 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {paginated.map((doc) => (
              <tr
                key={doc.id}
                className="cursor-pointer hover:bg-slate-50"
                onClick={() => navigate(`/documents/${doc.id}`)}
              >
                <td
                  className="px-4 py-3"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="checkbox"
                    className="h-3.5 w-3.5 rounded border-slate-300"
                    checked={selectedIds.includes(doc.id)}
                    onChange={() => toggleOne(doc.id)}
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 flex-shrink-0 text-slate-400" />
                    <span className="max-w-[200px] truncate text-xs font-medium text-slate-800">
                      {doc.filename}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <DocTypeBadge type={doc.doc_type} />
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={doc.status} />
                </td>
                <td className="px-4 py-3 text-xs text-slate-500">
                  {formatDate(doc.created_at)}
                </td>
                <td
                  className="px-4 py-3"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    aria-label="Delete document"
                    onClick={() => deleteMut.mutate(doc.id)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </td>
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-sm text-slate-400">
                  No documents match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 text-xs text-slate-500">
          <span>
            Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} of{' '}
            {filtered.length}
          </span>
          <div className="flex gap-1">
            <button
              type="button"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="rounded-lg border px-2.5 py-1 disabled:opacity-40 hover:bg-slate-50"
            >
              Prev
            </button>
            <button
              type="button"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-lg border px-2.5 py-1 disabled:opacity-40 hover:bg-slate-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
