import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Inbox, LayoutDashboard, FileSpreadsheet, Settings, LogOut, Receipt } from 'lucide-react';
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
    <aside className="flex h-screen w-56 flex-shrink-0 flex-col border-r border-slate-200 bg-white px-3 py-4">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-2 pb-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <Receipt className="h-4 w-4 text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900">IrishInvoice</p>
          <p className="text-[10px] text-slate-500">Document Intelligence</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 text-sm">
        <NavItem to="/" icon={Inbox} label="Inbox" end />
        <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
        <NavItem to="/exports" icon={FileSpreadsheet} label="Exports" />
        <NavItem to="/settings" icon={Settings} label="Settings" />
      </nav>

      {/* User */}
      <div className="border-t border-slate-100 pt-3">
        <div className="flex items-center justify-between gap-2 rounded-lg px-2 py-2">
          <div className="min-w-0">
            <p className="truncate text-xs font-medium text-slate-700">{user?.email ?? 'Anonymous'}</p>
            <p className="truncate text-[10px] text-slate-400">{user?.role ?? 'user'}</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            aria-label="Log out"
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
  end?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon: Icon, label, end }) => (
  <NavLink
    to={to}
    end={end}
    className={({ isActive }) =>
      cn(
        'flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors',
        isActive
          ? 'bg-primary text-white'
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
      )
    }
  >
    <Icon className="h-4 w-4 flex-shrink-0" />
    <span>{label}</span>
  </NavLink>
);
