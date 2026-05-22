import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { X, CheckCircle, AlertCircle, Loader2, UploadCloud } from 'lucide-react';
import { uploadDocument } from '../../api/documents';
import { analyzeDocument } from '../../api/processing';
import { useToast } from '../shared/ToastProvider';
import { useQueryClient } from '@tanstack/react-query';

interface Props {
  open: boolean;
  onClose: () => void;
}

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

interface UploadItem {
  file: File;
  status: UploadStatus;
  error?: string;
}

export const UploadModal: React.FC<Props> = ({ open, onClose }) => {
  const [items, setItems] = useState<UploadItem[]>([]);
  const { show } = useToast();
  const qc = useQueryClient();

  const processFiles = useCallback(async (files: File[]) => {
    const mapped: UploadItem[] = files.map((file) => ({ file, status: 'idle' }));
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
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : 'Upload failed';
        setItems((prev) =>
          prev.map((it) =>
            it.file === item.file ? { ...it, status: 'error', error: msg } : it,
          ),
        );
      }
    }

    await qc.invalidateQueries({ queryKey: ['documents'] });
    show({ title: 'Upload complete', description: `${files.length} file(s) processed.`, variant: 'success' });
  }, [show, qc]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => void processFiles(acceptedFiles),
    [processFiles],
  );

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

  const handleClose = () => {
    setItems([]);
    onClose();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Upload documents"
    >
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900">Upload documents</h2>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close upload modal"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div
          {...getRootProps()}
          className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed px-6 py-10 text-center transition-colors ${
            isDragActive
              ? 'border-primary bg-primary/5 text-primary'
              : 'border-slate-300 bg-slate-50 text-slate-500 hover:border-primary/60 hover:bg-primary/5'
          }`}
        >
          <input {...getInputProps()} />
          <UploadCloud className="h-8 w-8 opacity-60" />
          <div>
            <p className="text-sm font-medium">
              {isDragActive ? 'Drop files here…' : 'Drag & drop files, or click to browse'}
            </p>
            <p className="mt-1 text-xs text-slate-400">PDF, PNG, JPG — up to 20 MB each</p>
          </div>
        </div>

        {items.length > 0 && (
          <ul className="mt-4 space-y-2">
            {items.map((item) => (
              <li
                key={item.file.name}
                className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2"
              >
                {item.status === 'uploading' && (
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                )}
                {item.status === 'success' && (
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                )}
                {item.status === 'error' && (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                )}
                {item.status === 'idle' && (
                  <div className="h-4 w-4 rounded-full border-2 border-slate-300" />
                )}
                <span className="flex-1 truncate text-xs font-medium text-slate-700">
                  {item.file.name}
                </span>
                <span className="text-[10px] uppercase tracking-wide text-slate-400">
                  {item.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
