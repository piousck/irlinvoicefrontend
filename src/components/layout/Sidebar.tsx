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
        'relative flex h-screen flex-col border-r border-slate-200 bg-white transition-all duration-200',
        collapsed ? 'w-14' : 'w-60',
      )}
    >
      {/* Logo */}
      <div className={cn('flex items-center gap-2 border-b border-slate-100 px-3 py-4', collapsed && 'justify-center px-0')}>
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary text-white">
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        {!collapsed && (
          <div>
            <p className="text-sm font-bold text-slate-800">IrishInvoice</p>
            <p className="text-[10px] text-slate-400">Document Intelligence</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 px-2 py-3">
        <NavItem to="/" icon={Inbox} label="Inbox" collapsed={collapsed} />
        <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" collapsed={collapsed} />
        <NavItem to="/exports" icon={FileSpreadsheet} label="Exports" collapsed={collapsed} />
        <NavItem to="/settings" icon={Settings} label="Settings" collapsed={collapsed} />
      </nav>

      {/* User / logout */}
      <div className="border-t border-slate-100 px-2 py-3">
        <div className={cn('flex items-center gap-2', collapsed && 'justify-center')}>
          <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
            {user?.email?.[0]?.toUpperCase() ?? 'U'}
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-slate-700">{user?.email ?? 'Anonymous'}</p>
              <p className="truncate text-[10px] text-slate-400">Org: {user?.organisation_id?.slice(0, 8) ?? '—'}</p>
            </div>
          )}
          <button
            type="button"
            onClick={() => { logout(); window.location.href = '/login'; }}
            title="Logout"
            className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Collapse toggle */}
      <button
        type="button"
        onClick={() => setCollapsed((c) => !c)}
        className="absolute -right-3 top-6 flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 shadow-sm hover:text-slate-700"
      >
        {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </button>
    </aside>
  );
};

interface NavItemProps {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  collapsed: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon: Icon, label, collapsed }) => (
  <NavLink
    to={to}
    end={to === '/'}
    title={collapsed ? label : undefined}
    className={({ isActive }) =>
      cn(
        'flex items-center gap-2.5 rounded-md px-2 py-2 text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900',
        isActive && 'bg-primary text-white hover:bg-primary/90 hover:text-white',
        collapsed && 'justify-center px-0',
      )
    }
  >
    <Icon className="h-4 w-4 flex-shrink-0" />
    {!collapsed && <span>{label}</span>}
  </NavLink>
);
