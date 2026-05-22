import React, { useState } from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { useDocuments } from '../hooks/useDocuments';
import { EmptyState } from '../components/shared/EmptyState';
import { DocumentTable } from '../components/documents/DocumentTable';
import { SkeletonRow } from '../components/shared/SkeletonRow';
import { UploadModal } from '../components/upload/UploadModal';

const InboxPage: React.FC = () => {
  const { data, isLoading, isError } = useDocuments();
  const [uploadOpen, setUploadOpen] = useState(false);

  return (
    <PageWrapper>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-500">
            {isLoading ? 'Loading…' : `${data?.length ?? 0} document${(data?.length ?? 0) !== 1 ? 's' : ''}`}
          </p>
        </div>
      </div>

      {isLoading && (
        <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
          <table className="min-w-full">
            <tbody>
              {Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)}
            </tbody>
          </table>
        </div>
      )}

      {isError && (
        <div className="rounded-xl bg-red-50 p-6 text-center text-sm text-red-700 ring-1 ring-red-200">
          Failed to load documents. Is the backend running at{' '}
          <code className="font-mono">http://localhost:8000</code>?
        </div>
      )}

      {!isLoading && !isError && (!data || data.length === 0) && (
        <EmptyState
          title="Drop your first invoice here"
          description="Upload supplier invoices, receipts or statements to start extracting data automatically."
          action={
            <button
              type="button"
              onClick={() => setUploadOpen(true)}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary/90"
            >
              Upload document
            </button>
          }
        />
      )}

      {!isLoading && !isError && data && data.length > 0 && (
        <DocumentTable documents={data} />
      )}

      <UploadModal open={uploadOpen} onClose={() => setUploadOpen(false)} />
    </PageWrapper>
  );
};

export default InboxPage;
