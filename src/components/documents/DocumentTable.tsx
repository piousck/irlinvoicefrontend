import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Trash2 } from 'lucide-react';
import type { DocumentSummary, DocumentStatus, DocumentType } from '../../types';
import { StatusBadge } from '../shared/StatusBadge';
import { DocTypeBadge } from '../shared/DocTypeBadge';
import { formatDate } from '../../utils/cn';
import { deleteDocument } from '../../api/documents';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '../shared/ToastProvider';

interface Props {
  documents: DocumentSummary[];
}

export const DocumentTable: React.FC<Props> = ({ documents }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { show } = useToast();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<DocumentStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<DocumentType | 'all'>('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const PER_PAGE = 20;

  const filtered = documents.filter((doc) => {
    if (statusFilter !== 'all' && doc.status !== statusFilter) return false;
    if (typeFilter !== 'all' && doc.doc_type !== typeFilter) return false;
    if (search && !doc.filename.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const toggleAll = () =>
    setSelectedIds(selectedIds.length === paged.length ? [] : paged.map((d) => d.id));
  const toggleOne = (id: string) =>
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteDocument(id);
      void queryClient.invalidateQueries({ queryKey: ['documents'] });
      show({ title: 'Document deleted', variant: 'success' });
    } catch {
      show({ title: 'Delete failed', variant: 'error' });
    }
  };

  return (
    <div>
      {/* Filter bar */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <input
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search filename…"
          className="h-8 rounded-lg border border-slate-200 bg-white px-3 text-xs shadow-sm placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value as DocumentStatus | 'all'); setPage(1); }}
          className="h-8 rounded-lg border border-slate-200 bg-white px-2 text-xs shadow-sm focus:border-primary focus:outline-none"
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
          className="h-8 rounded-lg border border-slate-200 bg-white px-2 text-xs shadow-sm focus:border-primary focus:outline-none"
        >
          <option value="all">All types</option>
          <option value="invoice">Invoice</option>
          <option value="credit_note">Credit Note</option>
          <option value="receipt">Receipt</option>
          <option value="statement">Statement</option>
        </select>
        <span className="ml-auto text-xs text-slate-400">{filtered.length} document{filtered.length !== 1 ? 's' : ''}</span>
        {selectedIds.length > 0 && (
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
            {selectedIds.length} selected
          </span>
        )}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-[11px] font-medium uppercase tracking-wide text-slate-500">
                <th className="w-8 px-3 py-2.5 text-left">
                  <input
                    type="checkbox"
                    className="h-3.5 w-3.5 rounded accent-primary"
                    checked={paged.length > 0 && selectedIds.length === paged.length}
                    onChange={toggleAll}
                    aria-label="Select all"
                  />
                </th>
                <th className="px-3 py-2.5 text-left">Filename</th>
                <th className="px-3 py-2.5 text-left">Type</th>
                <th className="px-3 py-2.5 text-left">Status</th>
                <th className="px-3 py-2.5 text-left">Uploaded</th>
                <th className="px-3 py-2.5 text-left"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paged.map((doc) => (
                <tr
                  key={doc.id}
                  className="cursor-pointer transition-colors hover:bg-slate-50"
                  onClick={() => navigate(`/documents/${doc.id}`)}
                >
                  <td className="px-3 py-2.5" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      className="h-3.5 w-3.5 rounded accent-primary"
                      checked={selectedIds.includes(doc.id)}
                      onChange={() => toggleOne(doc.id)}
                      aria-label={`Select ${doc.filename}`}
                    />
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <FileText className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                      <span className="max-w-[220px] truncate font-medium text-slate-800">{doc.filename}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5"><DocTypeBadge type={doc.doc_type} /></td>
                  <td className="px-3 py-2.5"><StatusBadge status={doc.status} /></td>
                  <td className="px-3 py-2.5 text-slate-500">{formatDate(doc.created_at)}</td>
                  <td className="px-3 py-2.5" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={(e) => handleDelete(doc.id, e)}
                      className="rounded p-1 text-slate-300 hover:bg-red-50 hover:text-red-500"
                      aria-label="Delete document"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
              {paged.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-xs text-slate-400">
                    No documents match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-100 px-4 py-2.5 text-xs text-slate-500">
            <span>Page {page} of {totalPages}</span>
            <div className="flex gap-1">
              <button
                type="button"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="rounded px-2 py-1 hover:bg-slate-100 disabled:opacity-40"
              >Prev</button>
              <button
                type="button"
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="rounded px-2 py-1 hover:bg-slate-100 disabled:opacity-40"
              >Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
