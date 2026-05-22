import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, FileText } from 'lucide-react';
import type { DocumentSummary, DocumentStatus, DocumentType } from '../../types';
import { StatusBadge } from '../shared/StatusBadge';
import { DocTypeBadge } from '../shared/DocTypeBadge';
import { formatDate } from '../../utils/cn';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteDocument } from '../../api/documents';
import { useToast } from '../shared/ToastProvider';

interface Props {
  documents: DocumentSummary[];
}

export const DocumentTable: React.FC<Props> = ({ documents }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { show } = useToast();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [statusFilter, setStatusFilter] = useState<DocumentStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<DocumentType | 'all'>('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const PER_PAGE = 20;

  const deleteMutation = useMutation({
    mutationFn: deleteDocument,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['documents'] });
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

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const toggleAll = () => {
    if (selectedIds.size === paginated.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(paginated.map((d) => d.id)));
  };

  const toggleOne = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="rounded-xl bg-white shadow-sm">
      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-2 border-b px-4 py-3">
        <input
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search filename…"
          className="h-8 rounded-md border border-slate-200 px-3 text-xs shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value as DocumentStatus | 'all'); setPage(1); }}
          className="h-8 rounded-md border border-slate-200 px-2 text-xs shadow-sm"
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
          className="h-8 rounded-md border border-slate-200 px-2 text-xs shadow-sm"
        >
          <option value="all">All types</option>
          <option value="invoice">Invoice</option>
          <option value="credit_note">Credit note</option>
          <option value="receipt">Receipt</option>
          <option value="statement">Statement</option>
        </select>
        {selectedIds.size > 0 && (
          <span className="ml-auto text-xs text-slate-500">{selectedIds.size} selected</span>
        )}
        <span className="ml-auto text-xs text-slate-400">{filtered.length} documents</span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto text-sm">
          <thead className="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  className="h-3.5 w-3.5 rounded"
                  checked={selectedIds.size === paginated.length && paginated.length > 0}
                  onChange={toggleAll}
                />
              </th>
              <th className="px-4 py-3 text-left">Filename</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Uploaded</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginated.map((doc) => (
              <tr
                key={doc.id}
                className="cursor-pointer hover:bg-slate-50"
                onClick={() => navigate(`/documents/${doc.id}`)}
              >
                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    className="h-3.5 w-3.5 rounded"
                    checked={selectedIds.has(doc.id)}
                    onChange={() => toggleOne(doc.id)}
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 flex-shrink-0 text-slate-400" />
                    <span className="max-w-[240px] truncate text-xs font-medium text-slate-800">
                      {doc.filename}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3"><DocTypeBadge type={doc.doc_type} /></td>
                <td className="px-4 py-3"><StatusBadge status={doc.status} /></td>
                <td className="px-4 py-3 text-xs text-slate-500">{formatDate(doc.created_at)}</td>
                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    onClick={() => deleteMutation.mutate(doc.id)}
                    className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:bg-red-50 hover:text-red-500"
                    title="Delete"
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
        <div className="flex items-center justify-between border-t px-4 py-3 text-xs text-slate-500">
          <span>Page {page} of {totalPages}</span>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded border px-2 py-1 hover:bg-slate-50 disabled:opacity-40"
            >
              Prev
            </button>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="rounded border px-2 py-1 hover:bg-slate-50 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
