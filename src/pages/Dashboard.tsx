import React, { useMemo } from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { useDocuments } from '../hooks/useDocuments';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid,
} from 'recharts';
import { formatCurrency } from '../utils/cn';

const COLORS = ['#0ea5e9', '#f97316', '#14b8a6', '#6366f1', '#94a3b8'];

const DashboardPage: React.FC = () => {
  const { data: documents, isLoading } = useDocuments();

  const metrics = useMemo(() => {
    const now = new Date();
    const docs = documents ?? [];
    const thisMonth = docs.filter((d) => {
      const dt = new Date(d.created_at);
      return dt.getMonth() === now.getMonth() && dt.getFullYear() === now.getFullYear();
    });
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const approvedWeek = docs.filter((d) => d.status === 'reviewed' && new Date(d.created_at) >= weekAgo).length;
    return { thisMonth: thisMonth.length, pending: docs.filter((d) => d.status === 'analyzed').length, approvedWeek };
  }, [documents]);

  const docsPerDay = useMemo(() => {
    const map = new Map<string, number>();
    (documents ?? []).forEach((d) => {
      const key = new Date(d.created_at).toLocaleDateString('en-IE', { day: '2-digit', month: 'short' });
      map.set(key, (map.get(key) ?? 0) + 1);
    });
    return Array.from(map.entries()).slice(-30).map(([date, count]) => ({ date, count }));
  }, [documents]);

  const typeBreakdown = useMemo(() => {
    const map = new Map<string, number>();
    (documents ?? []).forEach((d) => { const k = d.doc_type ?? 'unknown'; map.set(k, (map.get(k) ?? 0) + 1); });
    return Array.from(map.entries()).map(([type, value]) => ({ type, value }));
  }, [documents]);

  if (isLoading) {
    return (
      <PageWrapper>
        <div className="grid animate-pulse grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-24 rounded-xl bg-slate-100" />)}
        </div>
      </PageWrapper>
    );
  }

  if (!documents || documents.length === 0) {
    return (
      <PageWrapper>
        <div className="mx-auto max-w-md rounded-2xl bg-white p-10 text-center shadow-sm ring-1 ring-slate-200">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6 text-primary">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
            </svg>
          </div>
          <h2 className="text-base font-semibold text-slate-900">Upload documents to see analytics</h2>
          <p className="mt-2 text-sm text-slate-500">Volumes, VAT trends and OCR quality will appear once documents are uploaded.</p>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="space-y-5">
        {/* KPIs */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <KpiCard label="Documents this month" value={String(metrics.thisMonth)} />
          <KpiCard label="Pending review" value={String(metrics.pending)} accent />
          <KpiCard label="VAT reclaimed" value={formatCurrency(0)} />
          <KpiCard label="Approved this week" value={String(metrics.approvedWeek)} />
        </div>

        {/* Charts row 1 */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="col-span-2 rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <h3 className="mb-4 text-sm font-semibold text-slate-900">Documents uploaded per day</h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={docsPerDay} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                  <Bar dataKey="count" fill="#01696f" radius={[4, 4, 0, 0]} maxBarSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <h3 className="mb-4 text-sm font-semibold text-slate-900">Document type breakdown</h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={typeBreakdown} dataKey="value" nameKey="type" outerRadius={75} label={({ name }) => name}>
                    {typeBreakdown.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <h3 className="mb-4 text-sm font-semibold text-slate-900">OCR confidence trend</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={[]} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                  <Line type="monotone" dataKey="confidence" stroke="#16a34a" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
              {docsPerDay.length === 0 && (
                <p className="-mt-32 text-center text-xs text-slate-400">Run OCR on documents to see confidence trend</p>
              )}
            </div>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <h3 className="mb-4 text-sm font-semibold text-slate-900">Recent activity</h3>
            <ul className="space-y-1.5">
              {(documents ?? []).slice(0, 10).map((doc) => (
                <li key={doc.id} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                  <span className="max-w-[55%] truncate text-xs font-medium text-slate-700">{doc.filename}</span>
                  <span className="text-[11px] text-slate-400">{doc.status}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

const KpiCard: React.FC<{ label: string; value: string; accent?: boolean }> = ({ label, value, accent }) => (
  <div className={`rounded-xl p-5 shadow-sm ring-1 ${
    accent ? 'bg-amber-50 ring-amber-200' : 'bg-white ring-slate-200'
  }`}>
    <p className="text-xs text-slate-500">{label}</p>
    <p className="mt-2 text-2xl font-bold tabular-nums text-slate-900">{value}</p>
  </div>
);

export default DashboardPage;
