import React from 'react';
import type { DocumentStatus } from '../../types';

const STEPS: DocumentStatus[] = ['uploaded', 'extracted', 'analyzed', 'reviewed', 'exported'];

const stepColor: Record<DocumentStatus, string> = {
  uploaded: 'bg-slate-400',
  extracted: 'bg-blue-500',
  analyzed: 'bg-amber-500',
  reviewed: 'bg-emerald-500',
  exported: 'bg-purple-500',
};

export const StatusStepper: React.FC<{ status: DocumentStatus }> = ({ status }) => {
  const currentIdx = STEPS.indexOf(status);
  return (
    <div className="flex items-center gap-0">
      {STEPS.map((step, idx) => {
        const done = idx <= currentIdx;
        const active = idx === currentIdx;
        return (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center">
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-full text-[9px] font-bold text-white transition-all ${
                  done ? stepColor[status] : 'bg-slate-200 text-slate-400'
                } ${active ? 'ring-2 ring-offset-1 ring-' + stepColor[status].split('-')[1] + '-300' : ''}`}
              >
                {done ? '\u2713' : idx + 1}
              </div>
              <span className={`mt-1 text-[9px] capitalize ${
                active ? 'font-semibold text-slate-700' : 'text-slate-400'
              }`}>
                {step}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div className={`mb-4 h-0.5 w-6 ${
                idx < currentIdx ? stepColor[status] : 'bg-slate-200'
              }`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
