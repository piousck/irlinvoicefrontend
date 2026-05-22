import React from 'react';
import { Bell, Upload } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useDocuments } from '../../hooks/useDocuments';
import { authStore } from '../../store/authStore';

interface Props {
  onOpenUpload: () => void;
}

const titleMap: Record<string, string> = {
  '/': 'Inbox',
  '/dashboard': 'Dashboard',
  '/exports': 'Exports',
  '/settings': 'Settings',
};

export const HeaderBar: React.FC<Props> = ({ onOpenUpload }) => {
  const location = useLocation();
  const { data: documents } = useDocuments();
  const user = authStore((s) => s.user);
  const awaitingReview = documents?.filter((d) => d.status === 'analyzed').length ?? 0;

  const pathKey = '/' + location.pathname.split('/')[1];
  const title = titleMap[pathKey] ?? 'IrishInvoice';

  return (
    <header className="flex h-14 flex-shrink-0 items-center justify-between border-b border-slate-200 bg-white px-5">
      <h1 className="text-base font-semibold text-slate-900">{title}</h1>

      <div className="flex items-center gap-3">
        {user?.organisation_id && (
          <div className="hidden items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600 md:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span className="max-w-[120px] truncate">{user.organisation_id}</span>
          </div>
        )}

        <button
          type="button"
          aria-label="Notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100"
        >
          <Bell className="h-4 w-4" />
          {awaitingReview > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-bold text-white">
              {awaitingReview}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={onOpenUpload}
          className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-white shadow-sm hover:bg-primary/90 active:bg-primary/80"
        >
          <Upload className="h-3.5 w-3.5" />
          <span>Upload</span>
        </button>
      </div>
    </header>
  );
};
