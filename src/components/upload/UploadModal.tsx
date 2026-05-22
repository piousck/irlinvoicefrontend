import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useQueryClient } from '@tanstack/react-query';
import { X, CheckCircle2, XCircle, Loader2, UploadCloud } from 'lucide-react';
import { uploadDocument } from '../../api/documents';
import { analyzeDocument } from '../../api/processing';
import { useToast } from '../shared/ToastProvider';

interface Props {
  open: boolean;
  onClose: () => void;
}

type FileStatus = 'pending' | 'uploading' | 'success' | 'error';

interface UploadItem {
  file: File;
  status: FileStatus;
  error?: string;
}

export const UploadModal: React.FC<Props> = ({ open, onClose }) => {
  const [items, setItems] = useState<UploadItem[]>([]);
  const { show } = useToast();
  const queryClient = useQueryClient();

  const processFiles = async (files: File[]) => {
    const mapped: UploadItem[] = files.map((f) => ({ file: f, status: 'pending' }));
    setItems(mapped);

    for (const item of mapped) {
      setItems((prev) =>
        prev.map((it) => (it.file === item.file ? { ...it, status: 'uploading' } : it)),
      );
      try {
        const uploaded = await uploadDocument(item.file);
        setItems((prev) =>
          prev.map((it) => (it.file === item.file ? { ...it, status: 'success' } : it)),
        );
        // kick off analysis in background
        analyzeDocument(uploaded.id).catch(() => null);
      } catch {
        setItems((prev) =>
          prev.map((it) =>
            it.file === item.file ? { ...it, status: 'error', error: 'Upload failed' } : it,
          ),
        );
      }
    }
    await queryClient.invalidateQueries({ queryKey: ['documents'] });
    show({ title: 'Upload complete', variant: 'success' });
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    void processFiles(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    maxSize: 20 * 1024 * 1024,
    accept: {
      'application/pdf': ['.pdf'],
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
    },
  });

  if (!open) return null;

  const statusIcon = (status: FileStatus) => {
    if (status === 'uploading') return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
    if (status === 'success') return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
    if (status === 'error') return <XCircle className="h-4 w-4 text-red-500" />;
    return <div className="h-4 w-4 rounded-full border-2 border-slate-300" />;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Upload documents</h2>
            <p className="text-xs text-slate-500">PDF, PNG, JPG — up to 20 MB each</p>
          </div>
          <button
            type="button"
            onClick={() => { setItems([]); onClose(); }}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div
          {...getRootProps()}
          className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-10 transition-colors ${
            isDragActive
              ? 'border-primary bg-primary/5'
              : 'border-slate-300 bg-slate-50 hover:border-primary/50 hover:bg-slate-100'
          }`}
        >
          <input {...getInputProps()} />
          <UploadCloud className="h-10 w-10 text-slate-400" />
          <div className="text-center">
            <p className="text-sm font-medium text-slate-700">
              {isDragActive ? 'Drop files here' : 'Drag & drop or click to browse'}
            </p>
            <p className="mt-1 text-xs text-slate-400">Invoices, receipts, statements</p>
          </div>
        </div>

        {items.length > 0 && (
          <ul className="mt-4 space-y-2">
            {items.map((item) => (
              <li
                key={item.file.name}
                className="flex items-center gap-3 rounded-lg bg-slate-50 px-3 py-2"
              >
                {statusIcon(item.status)}
                <span className="flex-1 truncate text-xs font-medium text-slate-700">
                  {item.file.name}
                </span>
                <span className="text-[11px] text-slate-400">
                  {(item.file.size / 1024).toFixed(0)} KB
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
