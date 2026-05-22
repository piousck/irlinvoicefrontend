import React, { useState } from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { authStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

const SettingsPage: React.FC = () => {
  const user = authStore((s) => s.user);
  const logout = authStore((s) => s.logout);
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <PageWrapper>
      <div className="mx-auto max-w-2xl space-y-5">
        {/* Profile */}
        <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="mb-4 text-sm font-semibold text-slate-900">Profile</h2>
          <dl className="space-y-3">
            <Row label="Email" value={user?.email} />
            <Row label="Organisation ID" value={user?.organisation_id} mono />
            <div>
              <dt className="mb-1 text-xs font-medium text-slate-500">Role</dt>
              <dd>
                <span className="rounded-md bg-slate-900 px-2 py-0.5 text-xs font-medium text-white">
                  {user?.role ?? 'user'}
                </span>
              </dd>
            </div>
          </dl>
        </section>

        {/* Organisation */}
        <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="mb-4 text-sm font-semibold text-slate-900">Organisation</h2>
          <Row label="Organisation ID" value={user?.organisation_id} mono />
          <p className="mt-3 text-xs text-slate-400">Member management coming soon.</p>
        </section>

        {/* Danger zone */}
        <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-red-200">
          <h2 className="mb-1 text-sm font-semibold text-red-700">Danger zone</h2>
          <p className="mb-4 text-xs text-slate-500">
            Deleting your account removes your access permanently. Documents may be retained for compliance.
          </p>
          {!showConfirm ? (
            <button type="button" onClick={() => setShowConfirm(true)}
              className="rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-xs font-medium text-red-700 hover:bg-red-100">
              Delete account
            </button>
          ) : (
            <div className="rounded-lg border border-red-300 bg-red-50 p-4">
              <p className="mb-3 text-xs font-medium text-red-700">Are you sure? This cannot be undone.</p>
              <div className="flex gap-2">
                <button type="button"
                  onClick={() => { logout(); navigate('/login'); }}
                  className="rounded-lg bg-red-600 px-4 py-2 text-xs font-medium text-white hover:bg-red-700">
                  Yes, delete
                </button>
                <button type="button" onClick={() => setShowConfirm(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50">
                  Cancel
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </PageWrapper>
  );
};

const Row: React.FC<{ label: string; value?: string; mono?: boolean }> = ({ label, value, mono }) => (
  <div>
    <dt className="mb-0.5 text-xs font-medium text-slate-500">{label}</dt>
    <dd className={`text-sm text-slate-800 ${mono ? 'font-mono text-xs' : ''}`}>{value ?? '—'}</dd>
  </div>
);

export default SettingsPage;
