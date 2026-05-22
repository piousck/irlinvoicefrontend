import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, CheckCircle2, XCircle, Loader2, X } from 'lucide-react';
import { useUpload } from '../../hooks/useUpload';
import { useToast } from '../shared/ToastProvider';
import { cn } from '../../utils/cn';

interface Props {
  open: boolean;
  onClose: () => void;
}

export const UploadModal: React.FC<Props> = ({ open, onClose }) => {
  const { items, upload, reset } = useUpload();
  const { show } = useToast();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      await upload(acceptedFiles);
      const allOk = acceptedFiles.length > 0;
      if (allOk) {
        show({ title: `${acceptedFiles.length} file(s) uploaded`, description: 'Analysis started in background.', variant: 'success' });
      }
    },
    [upload, show]
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
    reset();
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h2 className="text-sm font-semibold text-slate-900">Upload documents</h2>
          <button type="button" onClick={handleClose} className="text-slate-400 hover:text-slate-600" aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Drop zone */}
        <div className="p-5">
          <div
            {...getRootProps()}
            className={cn(
              'flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-12 text-center transition-colors',
              isDragActive
                ? 'border-primary bg-primary/5'
                : 'border-slate-300 bg-slate-50 hover:border-primary/50 hover:bg-slate-100'
            )}
          >
            <input {...getInputProps()} />
            <UploadCloud className="mb-3 h-10 w-10 text-slate-300" />
            <p className="text-sm font-medium text-slate-700">
              {isDragActive ? 'Drop files here…' : 'Drag & drop files, or click to browse'}
            </p>
            <p className="mt-1 text-xs text-slate-400">PDF, PNG, JPG — max 20 MB each</p>
          </div>

          {/* File list */}
          {items.length > 0 && (
            <ul className="mt-4 space-y-2">
              {items.map((item) => (
                <li
                  key={item.file.name}
                  className="flex items-center gap-3 rounded-lg bg-slate-50 px-3 py-2 text-xs"
                >
                  <span className="shrink-0">
                    {item.status === 'success' && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                    {item.status === 'error' && <XCircle className="h-4 w-4 text-red-500" />}
                    {item.status === 'uploading' && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
                    {item.status === 'pending' && <div className="h-4 w-4 rounded-full border-2 border-slate-300" />}
                  </span>
                  <span className="flex-1 truncate font-medium text-slate-700">{item.file.name}</span>
                  <span className="shrink-0 text-[10px] uppercase tracking-wide text-slate-400">
                    {item.status === 'uploading' ? 'Uploading…' : item.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex justify-end border-t px-5 py-3">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg bg-slate-100 px-4 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
