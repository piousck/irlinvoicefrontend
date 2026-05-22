import React, { useState } from 'react';
import type { DocumentSummary, DocumentStatus, DocumentType } from '../../types';
import { StatusBadge } from '../shared/StatusBadge';
import { DocTypeBadge } from '../shared/DocTypeBadge';
import { useNavigate } from 'react-router-dom';
import { Trash2, FileText } from 'lucide-react';
import { formatDate } from '../../utils/formatDate';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteDocument } from '../../api/documents';
import { useToast } from '../shared/ToastProvider';

interface Props {
  documents: DocumentSummary[];
}

const PAGE_SIZE = 20;

export const DocumentTable: React.FC<Props> = ({ documents }) => {
  const navigate = useNavigate();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<DocumentStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<DocumentType | 'all'>('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const { show } = useToast();
  const qc = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteDocument,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['documents'] });
      show({ title: 'Document deleted', variant: 'success' });
    },
    onError: () => show({ title: 'Delete failed', variant: 'error' }),
  });

  const filtered = documents.filter((doc) => {
    if (statusFilter !== 'all' && doc.status !== statusFilter) return false;
    if (typeFilter !== 'all' && doc.doc_type !== typeFilter) return false;
    if (search && !doc.filename.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const toggleAll = () => {
    if (selectedIds.length === paginated.length) setSelectedIds([]);
    else setSelectedIds(paginated.map((d) => d.id));
  };

  const toggleOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  return (
    <div className="rounded-xl bg-white shadow-sm">
      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 px-4 py-3">
        <input
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search filename..."
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
          <div className="ml-auto flex items-center gap-2 text-xs">
            <span className="text-slate-500">{selectedIds.length} selected</span>
            <button
              type="button"
              onClick={() => {
                selectedIds.forEach((id) => deleteMutation.mutate(id));
                setSelectedIds([]);
              }}
              className="flex items-center gap-1 rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-100"
            >
              <Trash2 className="h-3 w-3" /> Delete
            </button>
          </div>
        )}
        <span className="ml-auto text-xs text-slate-400">{filtered.length} document{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="w-8 px-4 py-3">
                <input
                  type="checkbox"
                  className="h-3.5 w-3.5 rounded accent-primary"
                  checked={selectedIds.length === paginated.length && paginated.length > 0}
                  onChange={toggleAll}
                />
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">Filename</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">Type</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">Status</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">Uploaded</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {paginated.map((doc) => (
              <tr
                key={doc.id}
                className="group cursor-pointer hover:bg-slate-50"
                onClick={() => navigate(`/documents/${doc.id}`)}
              >
                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    className="h-3.5 w-3.5 rounded accent-primary"
                    checked={selectedIds.includes(doc.id)}
                    onChange={() => toggleOne(doc.id)}
                  />
                </td>
                <td className="max-w-xs px-4 py-3">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 shrink-0 text-slate-300" />
                    <span className="truncate text-xs font-medium text-slate-800">{doc.filename}</span>
                  </div>
                </td>
                <td className="px-4 py-3"><DocTypeBadge type={doc.doc_type} /></td>
                <td className="px-4 py-3"><StatusBadge status={doc.status} /></td>
                <td className="px-4 py-3 text-xs text-slate-400">{formatDate(doc.created_at)}</td>
                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    onClick={() => deleteMutation.mutate(doc.id)}
                    className="invisible flex h-7 w-7 items-center justify-center rounded-md text-slate-300 hover:bg-red-50 hover:text-red-500 group-hover:visible"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </td>
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-sm text-slate-400">
                  No documents match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 text-xs">
          <button
            type="button"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-md border px-3 py-1 text-slate-600 disabled:opacity-40 hover:bg-slate-50"
          >
            Previous
          </button>
          <span className="text-slate-400">Page {page} of {totalPages}</span>
          <button
            type="button"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-md border px-3 py-1 text-slate-600 disabled:opacity-40 hover:bg-slate-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};
