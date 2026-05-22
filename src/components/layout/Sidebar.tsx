import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Inbox,
  LayoutDashboard,
  FileSpreadsheet,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { authStore } from '../../store/authStore';
import { cn } from '../../utils/cn';

export const Sidebar: React.FC = () => {
  const user = authStore((s) => s.user);
  const logout = authStore((s) => s.logout);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        'flex h-screen flex-col border-r border-slate-200 bg-white transition-all duration-200',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Logo */}
      <div className={cn('flex items-center gap-2 border-b border-slate-100 px-4 py-4', collapsed && 'justify-center px-2')}>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-white">
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-label="IrishInvoice logo">
            <rect x="3" y="3" width="18" height="18" rx="3" fill="currentColor" opacity="0.15" />
            <path d="M7 8h10M7 12h7M7 16h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="18" cy="16" r="3" fill="currentColor" />
            <path d="M17 16l.8.8 1.6-1.6" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900">IrishInvoice</p>
            <p className="truncate text-[10px] text-slate-400">Document Intelligence</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-2 py-3">
        <NavItem to="/" icon={Inbox} label="Inbox" collapsed={collapsed} end />
        <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" collapsed={collapsed} />
        <NavItem to="/exports" icon={FileSpreadsheet} label="Exports" collapsed={collapsed} />
        <NavItem to="/settings" icon={Settings} label="Settings" collapsed={collapsed} />
      </nav>

      {/* Collapse toggle */}
      <button
        type="button"
        onClick={() => setCollapsed((v) => !v)}
        className="flex items-center justify-center border-t border-slate-100 py-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>

      {/* User */}
      <div className={cn('border-t border-slate-100 px-3 py-3', collapsed && 'px-2')}>
        <div className={cn('flex items-center gap-2', collapsed && 'justify-center')}>
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
            {user?.email?.[0]?.toUpperCase() ?? 'U'}
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-slate-700">{user?.email ?? 'User'}</p>
              <p className="truncate text-[10px] text-slate-400">Org: {user?.organisation_id?.slice(0, 8) ?? '—'}</p>
            </div>
          )}
          {!collapsed && (
            <button
              type="button"
              onClick={() => { logout(); window.location.href = '/login'; }}
              className="shrink-0 rounded-md p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500"
              aria-label="Log out"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};

interface NavItemProps {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  collapsed: boolean;
  end?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon: Icon, label, collapsed, end }) => (
  <NavLink
    to={to}
    end={end}
    title={collapsed ? label : undefined}
    className={({ isActive }) =>
      cn(
        'flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors',
        collapsed && 'justify-center px-2',
        isActive
          ? 'bg-primary text-white'
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
      )
    }
  >
    <Icon className="h-4 w-4 shrink-0" />
    {!collapsed && <span>{label}</span>}
  </NavLink>
);
