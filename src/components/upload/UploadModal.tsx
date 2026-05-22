import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { X, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
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

  const processFiles = useCallback(
    async (files: File[]) => {
      const newItems: UploadItem[] = files.map((file) => ({ file, status: 'idle' }));
      setItems(newItems);

      for (const item of newItems) {
        setItems((prev) =>
          prev.map((it) => (it.file === item.file ? { ...it, status: 'uploading' } : it)),
        );
        try {
          const uploaded = await uploadDocument(item.file);
          setItems((prev) =>
            prev.map((it) => (it.file === item.file ? { ...it, status: 'success' } : it)),
          );
          void analyzeDocument(uploaded.id);
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : 'Upload failed';
          setItems((prev) =>
            prev.map((it) =>
              it.file === item.file ? { ...it, status: 'error', error: msg } : it,
            ),
          );
        }
      }

      await qc.invalidateQueries({ queryKey: ['documents'] });
      show({
        title: 'Upload complete',
        description: `${files.length} file(s) processed.`,
        variant: 'success',
      });
    },
    [show, qc],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: processFiles,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Upload documents</h2>
            <p className="mt-0.5 text-xs text-slate-500">PDF, PNG, JPG — max 20 MB per file</p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Dropzone */}
        <div className="p-5">
          <div
            {...getRootProps()}
            className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-12 text-center transition-colors ${
              isDragActive
                ? 'border-primary bg-primary/5'
                : 'border-slate-300 bg-slate-50 hover:border-slate-400 hover:bg-slate-100'
            }`}
          >
            <input {...getInputProps()} />
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
            </div>
            <p className="text-sm font-medium text-slate-700">
              {isDragActive ? 'Drop files here...' : 'Drag & drop files or click to browse'}
            </p>
          </div>

          {/* File list */}
          {items.length > 0 && (
            <ul className="mt-4 space-y-2">
              {items.map((item, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium text-slate-800">{item.file.name}</p>
                    <p className="text-[10px] text-slate-400">
                      {(item.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  {item.status === 'uploading' && (
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  )}
                  {item.status === 'success' && (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  )}
                  {item.status === 'error' && (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
