import React, { useState } from 'react';
import { Pencil, Check, X } from 'lucide-react';
import { ConfidenceBar } from '../shared/ConfidenceBar';

interface Props {
  label: string;
  value?: string | number | null;
  confidence?: number;
  onSave: (value: string) => void;
}

export const FieldEditor: React.FC<Props> = ({ label, value, confidence, onSave }) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value?.toString() ?? '');

  const handleSave = () => {
    onSave(draft);
    setEditing(false);
  };

  const handleCancel = () => {
    setDraft(value?.toString() ?? '');
    setEditing(false);
  };

  return (
    <div className="rounded-lg border border-slate-100 bg-white px-3 py-2.5">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{label}</p>
        {!editing && (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="flex h-6 w-6 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            aria-label={`Edit ${label}`}
          >
            <Pencil className="h-3 w-3" />
          </button>
        )}
      </div>

      {!editing ? (
        <>
          <p className="mt-1 text-sm text-slate-800">
            {value != null && value !== '' ? String(value) : (
              <span className="text-slate-400 italic">Not extracted</span>
            )}
          </p>
          <ConfidenceBar value={confidence} />
        </>
      ) : (
        <div className="mt-2 flex items-center gap-2">
          <input
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') handleCancel(); }}
            className="h-8 flex-1 rounded-lg border border-slate-300 px-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <button
            type="button"
            onClick={handleSave}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white hover:bg-primary/90"
            aria-label="Save"
          >
            <Check className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="flex h-8 w-8 items-center justify-center rounded-lg border text-slate-500 hover:bg-slate-50"
            aria-label="Cancel"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
