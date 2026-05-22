import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useQueryClient } from '@tanstack/react-query';
import { Upload, X, CheckCircle, AlertCircle, Loader2, FileText } from 'lucide-react';
import { uploadDocument } from '../../api/documents';
import { analyzeDocument } from '../../api/processing';
import { useToast } from '../shared/ToastProvider';
import { cn } from '../../utils/cn';

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

  const processFiles = useCallback(
    async (files: File[]) => {
      const mapped: UploadItem[] = files.map((file) => ({ file, status: 'pending' }));
      setItems(mapped);

      for (const item of mapped) {
        setItems((prev) =>
          prev.map((it) => (it.file.name === item.file.name ? { ...it, status: 'uploading' } : it)),
        );
        try {
          const uploaded = await uploadDocument(item.file);
          setItems((prev) =>
            prev.map((it) => (it.file.name === item.file.name ? { ...it, status: 'success' } : it)),
          );
          void analyzeDocument(uploaded.id);
        } catch (e: unknown) {
          const msg = e instanceof Error ? e.message : 'Upload failed';
          setItems((prev) =>
            prev.map((it) =>
              it.file.name === item.file.name ? { ...it, status: 'error', error: msg } : it,
            ),
          );
        }
      }

      await queryClient.invalidateQueries({ queryKey: ['documents'] });
      show({ title: 'Upload complete', description: 'Documents are being analysed.', variant: 'success' });
    },
    [queryClient, show],
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

  const statusIcon: Record<FileStatus, React.ReactNode> = {
    pending: <div className="h-4 w-4 rounded-full border-2 border-slate-300" />,
    uploading: <Loader2 className="h-4 w-4 animate-spin text-primary" />,
    success: <CheckCircle className="h-4 w-4 text-emerald-500" />,
    error: <AlertCircle className="h-4 w-4 text-red-500" />,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h2 className="text-base font-semibold text-slate-800">Upload documents</h2>
          <button
            type="button"
            onClick={handleClose}
            className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Drop zone */}
        <div className="p-5">
          <div
            {...getRootProps()}
            className={cn(
              'flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors',
              isDragActive
                ? 'border-primary bg-primary/5'
                : 'border-slate-200 bg-slate-50 hover:border-primary/50 hover:bg-primary/5',
            )}
          >
            <input {...getInputProps()} />
            <Upload className={cn('mb-3 h-8 w-8', isDragActive ? 'text-primary' : 'text-slate-400')} />
            <p className="text-sm font-medium text-slate-700">
              {isDragActive ? 'Drop files here' : 'Drag & drop files, or click to browse'}
            </p>
            <p className="mt-1 text-xs text-slate-400">PDF, PNG, JPG — up to 20MB each</p>
          </div>

          {/* File list */}
          {items.length > 0 && (
            <div className="mt-4 space-y-2">
              {items.map((item) => (
                <div
                  key={item.file.name}
                  className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2"
                >
                  <FileText className="h-4 w-4 flex-shrink-0 text-slate-400" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium text-slate-700">{item.file.name}</p>
                    <p className="text-[11px] text-slate-400">
                      {(item.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  {statusIcon[item.status]}
                  {item.status === 'error' && item.error && (
                    <p className="text-[11px] text-red-500">{item.error}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t px-5 py-3">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-md border border-slate-200 px-4 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
