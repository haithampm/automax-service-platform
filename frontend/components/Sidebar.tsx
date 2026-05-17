'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  AlertTriangle,
  FileText,
  MessageSquareWarning,
  Workflow,
  Users,
  Shield,
  Settings,
  ChevronLeft,
  ChevronRight,
  Activity,
  LogOut,
} from 'lucide-react';
import { clsx } from 'clsx';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Incidents', href: '/incidents', icon: AlertTriangle },
  { name: 'Requests', href: '/requests', icon: FileText },
  { name: 'Complaints', href: '/complaints', icon: MessageSquareWarning },
  { name: 'Workflows', href: '/workflows', icon: Workflow },
];

const adminNavigation = [
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Roles', href: '/admin/roles', icon: Shield },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <div
      className={clsx(
        'bg-[#0d1117] border-r border-[#21262d] flex flex-col h-full flex-shrink-0 transition-all duration-300',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Logo */}
      <div className={clsx('p-4 border-b border-[#21262d] flex items-center', collapsed ? 'justify-center' : 'justify-between')}>
        {!collapsed && (
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6e40c9] to-[#4f2d9e] flex items-center justify-center flex-shrink-0">
              <Activity className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-white font-bold text-sm leading-tight">Synergi</div>
              <div className="text-[#6e7681] text-xs leading-tight">IMS</div>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6e40c9] to-[#4f2d9e] flex items-center justify-center">
            <Activity className="w-4 h-4 text-white" />
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={clsx(
            'w-6 h-6 rounded-md bg-[#161b22] border border-[#30363d] flex items-center justify-center hover:bg-[#21262d] transition-colors flex-shrink-0',
            collapsed && 'hidden'
          )}
        >
          {collapsed ? <ChevronRight className="w-3 h-3 text-[#8b949e]" /> : <ChevronLeft className="w-3 h-3 text-[#8b949e]" />}
        </button>
      </div>

      {/* Collapse toggle when collapsed */}
      {collapsed && (
        <button
          onClick={() => setCollapsed(false)}
          className="mx-auto mt-2 w-8 h-6 rounded-md bg-[#161b22] border border-[#30363d] flex items-center justify-center hover:bg-[#21262d] transition-colors"
        >
          <ChevronRight className="w-3 h-3 text-[#8b949e]" />
        </button>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {!collapsed && (
          <p className="px-3 mb-2 text-[10px] font-semibold text-[#6e7681] uppercase tracking-widest">Main</p>
        )}
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.name : undefined}
              className={clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200',
                collapsed && 'justify-center px-2',
                isActive(item.href)
                  ? 'bg-[#6e40c9]/20 text-[#a78bfa] border border-[#6e40c9]/30 font-medium'
                  : 'text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#161b22]'
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        })}

        <div className={clsx('border-t border-[#21262d] pt-3 mt-3')}>
          {!collapsed && (
            <p className="px-3 mb-2 text-[10px] font-semibold text-[#6e7681] uppercase tracking-widest">Administration</p>
          )}
          {adminNavigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.name : undefined}
                className={clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200',
                  collapsed && 'justify-center px-2',
                  isActive(item.href)
                    ? 'bg-[#6e40c9]/20 text-[#a78bfa] border border-[#6e40c9]/30 font-medium'
                    : 'text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#161b22]'
                )}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User Profile */}
      <div className={clsx('p-3 border-t border-[#21262d]', collapsed && 'flex justify-center')}>
        {!collapsed ? (
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#161b22] transition-colors cursor-pointer group">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#6e40c9] to-[#4f2d9e] flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
              A
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[#e6edf3] text-xs font-medium truncate">Admin User</div>
              <div className="text-[#6e7681] text-[10px] truncate">admin@synergi.com</div>
            </div>
            <LogOut className="w-3.5 h-3.5 text-[#6e7681] group-hover:text-[#e6edf3] transition-colors flex-shrink-0" />
          </div>
        ) : (
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#6e40c9] to-[#4f2d9e] flex items-center justify-center text-xs font-bold text-white cursor-pointer" title="Admin User">
            A
          </div>
        )}
      </div>
    </div>
  );
}
