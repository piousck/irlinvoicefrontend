import { useState, useCallback } from 'react';
import { uploadDocument } from '../api/documents';
import { analyzeDocument } from '../api/processing';
import { useQueryClient } from '@tanstack/react-query';

export interface UploadItem {
  file: File;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

export function useUpload() {
  const [items, setItems] = useState<UploadItem[]>([]);
  const queryClient = useQueryClient();

  const upload = useCallback(async (files: File[]) => {
    const mapped: UploadItem[] = files.map((file) => ({ file, status: 'pending' }));
    setItems(mapped);

    for (const item of mapped) {
      setItems((prev) =>
        prev.map((it) => (it.file === item.file ? { ...it, status: 'uploading' } : it))
      );
      try {
        const uploaded = await uploadDocument(item.file);
        void analyzeDocument(uploaded.id);
        setItems((prev) =>
          prev.map((it) => (it.file === item.file ? { ...it, status: 'success' } : it))
        );
      } catch {
        setItems((prev) =>
          prev.map((it) =>
            it.file === item.file ? { ...it, status: 'error', error: 'Upload failed' } : it
          )
        );
      }
    }
    void queryClient.invalidateQueries({ queryKey: ['documents'] });
  }, [queryClient]);

  const reset = useCallback(() => setItems([]), []);

  return { items, upload, reset };
}
