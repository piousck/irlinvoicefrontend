import React, { useState } from 'react';
import { Pencil, Check, X } from 'lucide-react';
import { ConfidenceBar } from '../shared/ConfidenceBar';

interface Props {
  label: string;
  value?: string | number | null;
  confidence?: number;
  onSave: (value: string) => Promise<void>;
}

export const FieldEditor: React.FC<Props> = ({ label, value, confidence, onSave }) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value?.toString() ?? '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave(draft);
    setSaving(false);
    setEditing(false);
  };

  const handleCancel = () => {
    setDraft(value?.toString() ?? '');
    setEditing(false);
  };

  return (
    <div className="rounded-lg border border-slate-100 bg-slate-50/50 px-3 py-2.5">
      <div className="flex items-start justify-between gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{label}</p>
        {!editing && (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="flex h-5 w-5 items-center justify-center rounded text-slate-300 hover:bg-slate-200 hover:text-slate-600"
          >
            <Pencil className="h-3 w-3" />
          </button>
        )}
      </div>

      {!editing ? (
        <div className="mt-1">
          <p className="text-xs font-medium text-slate-800">
            {value != null ? value.toString() : <span className="italic text-slate-400">Not extracted</span>}
          </p>
          {confidence != null && <ConfidenceBar value={confidence} />}
        </div>
      ) : (
        <div className="mt-1.5 flex items-center gap-1.5">
          <input
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') void handleSave(); if (e.key === 'Escape') handleCancel(); }}
            className="h-7 flex-1 rounded-md border border-slate-300 bg-white px-2 text-xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <button
            type="button"
            onClick={() => void handleSave()}
            disabled={saving}
            className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-white hover:bg-primary/90 disabled:opacity-60"
          >
            <Check className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:bg-slate-100"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
