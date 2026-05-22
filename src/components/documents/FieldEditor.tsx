import React, { useState } from 'react';
import { Pencil, Check, X } from 'lucide-react';
import { ConfidenceBar } from '../shared/ConfidenceBar';

interface Props {
  label: string;
  value: string;
  confidence?: number;
  onSave: (value: string) => void;
}

export const FieldEditor: React.FC<Props> = ({ label, value, confidence, onSave }) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  const handleSave = () => {
    onSave(draft);
    setEditing(false);
  };

  const handleCancel = () => {
    setDraft(value);
    setEditing(false);
  };

  return (
    <div className="rounded-lg border border-slate-100 bg-white px-3 py-2.5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">{label}</p>
        {!editing && (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="flex h-6 w-6 items-center justify-center rounded text-slate-300 hover:bg-slate-100 hover:text-primary"
          >
            <Pencil className="h-3 w-3" />
          </button>
        )}
      </div>

      {editing ? (
        <div className="mt-1.5 flex items-center gap-1.5">
          <input
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') handleCancel(); }}
            className="h-7 flex-1 rounded border border-primary px-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <button
            type="button"
            onClick={handleSave}
            className="flex h-7 w-7 items-center justify-center rounded bg-primary text-white hover:bg-primary/90"
          >
            <Check className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="flex h-7 w-7 items-center justify-center rounded border text-slate-500 hover:bg-slate-50"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <div className="mt-1">
          <p className="text-xs text-slate-800">
            {value || <span className="italic text-slate-300">No value</span>}
          </p>
          {confidence != null && <ConfidenceBar value={confidence} />}
        </div>
      )}
    </div>
  );
};
