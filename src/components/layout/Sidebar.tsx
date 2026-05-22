import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Inbox, LayoutDashboard, FileSpreadsheet, Settings, LogOut } from 'lucide-react';
import { authStore } from '../../store/authStore';
import { cn } from '../../utils/cn';

export const Sidebar: React.FC = () => {
  const user = authStore((s) => s.user);
  const logout = authStore((s) => s.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="flex h-screen w-56 flex-shrink-0 flex-col border-r border-slate-200 bg-white px-3 py-4 shadow-sm">
      {/* Logo */}
      <div className="mb-5 flex items-center gap-2.5 px-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-label="IrishInvoice logo">
            <rect x="4" y="3" width="16" height="18" rx="2" fill="white" fillOpacity="0.9" />
            <path d="M8 8h8M8 12h8M8 16h5" stroke="#01696f" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-bold tracking-tight text-slate-900">IrishInvoice</p>
          <p className="text-[10px] text-slate-400">Document Intelligence</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5">
        <NavItem to="/" icon={Inbox} label="Inbox" />
        <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
        <NavItem to="/exports" icon={FileSpreadsheet} label="Exports" />
        <NavItem to="/settings" icon={Settings} label="Settings" />
      </nav>

      {/* User */}
      <div className="mt-4 border-t border-slate-100 pt-3">
        <div className="flex items-center gap-2 rounded-lg px-2 py-2">
          <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
            {user?.email?.[0]?.toUpperCase() ?? 'U'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-slate-700">{user?.email ?? 'Loading...'}</p>
            <p className="truncate text-[10px] text-slate-400">{user?.role ?? 'user'}</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            aria-label="Logout"
            className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};

interface NavItemProps {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon: Icon, label }) => (
  <NavLink
    to={to}
    end={to === '/'}
    className={({ isActive }) =>
      cn(
        'flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900',
        isActive && 'bg-primary/8 font-medium text-primary hover:bg-primary/12 hover:text-primary',
      )
    }
  >
    <Icon className="h-4 w-4 flex-shrink-0" />
    <span>{label}</span>
  </NavLink>
);
