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
import { useAuthStore } from '../../store/authStore';
import { cn } from '../../utils/cn';

export const Sidebar: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        'relative flex h-screen flex-col border-r border-slate-200 bg-white transition-all duration-200',
        collapsed ? 'w-14' : 'w-60',
      )}
    >
      {/* Logo */}
      <div className={cn('flex items-center gap-2.5 px-3 py-4', collapsed && 'justify-center px-0')}>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-white">
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
            <path d="M7 3C5.9 3 5 3.9 5 5v14c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V8l-5-5H7zm5 0l5 5h-5V3z" />
          </svg>
        </div>
        {!collapsed && (
          <div>
            <p className="text-sm font-bold leading-tight text-slate-900">IrishInvoice</p>
            <p className="text-[10px] leading-tight text-slate-400">Document Intelligence</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className={cn('flex-1 space-y-0.5 px-2 text-sm')}>
        <NavItem to="/" icon={Inbox} label="Inbox" collapsed={collapsed} />
        <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" collapsed={collapsed} />
        <NavItem to="/exports" icon={FileSpreadsheet} label="Exports" collapsed={collapsed} />
        <NavItem to="/settings" icon={Settings} label="Settings" collapsed={collapsed} />
      </nav>

      {/* User */}
      <div className={cn('border-t border-slate-100 px-2 py-3')}>
        {!collapsed ? (
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-slate-700">{user?.email ?? 'Anonymous'}</p>
              <p className="truncate text-[10px] text-slate-400">{user?.role ?? 'user'}</p>
            </div>
            <button
              type="button"
              title="Log out"
              onClick={() => { logout(); window.location.href = '/login'; }}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            title="Log out"
            onClick={() => { logout(); window.location.href = '/login'; }}
            className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100"
          >
            <LogOut className="h-4 w-4" />
          </button>
        )}
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
        'flex items-center gap-2.5 rounded-md px-2 py-2 text-sm transition-colors',
        isActive
          ? 'bg-slate-900 text-white'
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
        collapsed && 'justify-center px-0',
      )
    }
  >
    <Icon className="h-4 w-4 shrink-0" />
    {!collapsed && <span>{label}</span>}
  </NavLink>
);
