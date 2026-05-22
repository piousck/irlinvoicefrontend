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
  const awaitingReview = (documents ?? []).filter((d) => d.status === 'analyzed').length;

  const pathKey = '/' + location.pathname.split('/')[1];
  const title = titleMap[pathKey] ?? 'Document Detail';

  return (
    <header className="flex h-14 flex-shrink-0 items-center justify-between border-b border-slate-200 bg-white px-5">
      <h1 className="text-base font-semibold text-slate-900">{title}</h1>
      <div className="flex items-center gap-3">
        {user?.organisation_id && (
          <span className="hidden items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600 sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            {user.organisation_id.slice(0, 8)}&hellip;
          </span>
        )}
        <button
          type="button"
          className="relative flex h-8 w-8 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100"
          aria-label="Notifications"
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
          className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-primary/90"
        >
          <Upload className="h-3.5 w-3.5" />
          Upload
        </button>
      </div>
    </header>
  );
};
