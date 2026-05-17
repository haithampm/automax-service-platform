'use client';
import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import {
  Bell,
  Search,
  X,
  AlertCircle,
  AlertTriangle,
  Info,
  ChevronRight,
  Check,
} from 'lucide-react';
import { clsx } from 'clsx';

const breadcrumbMap: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/incidents': 'Incidents',
  '/requests': 'Requests',
  '/complaints': 'Complaints',
  '/workflows': 'Workflows',
  '/admin/users': 'Users',
  '/admin/roles': 'Roles',
  '/settings': 'Settings',
};

type NotificationType = 'critical' | 'warning' | 'info';

interface Notification {
  id: number;
  type: NotificationType;
  message: string;
  time: string;
  read: boolean;
}

const initialNotifications: Notification[] = [
  { id: 1, type: 'critical', message: 'INC-001: Server Down - requires immediate attention', time: '2 min ago', read: false },
  { id: 2, type: 'warning', message: 'SLA breach imminent for INC-002', time: '5 min ago', read: false },
  { id: 3, type: 'info', message: 'REQ-003 approved by manager', time: '15 min ago', read: false },
  { id: 4, type: 'info', message: 'New complaint submitted: COM-012', time: '32 min ago', read: true },
];

const notificationIcon = {
  critical: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const notificationColor = {
  critical: 'text-red-400',
  warning: 'text-yellow-400',
  info: 'text-blue-400',
};

export default function Header() {
  const pathname = usePathname();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [searchValue, setSearchValue] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const pageName = breadcrumbMap[pathname] || 'Synergi IMS';
  const parentPage = pathname.split('/')[1];
  const parentName = breadcrumbMap['/' + parentPage];
  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <header className="h-14 bg-[#0d1117] border-b border-[#21262d] flex items-center justify-between px-4 flex-shrink-0">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm">
        <span className="text-[#6e7681] font-medium">Synergi IMS</span>
        {parentName && parentName !== pageName && (
          <>
            <ChevronRight className="w-3 h-3 text-[#30363d]" />
            <span className="text-[#6e7681]">{parentName}</span>
          </>
        )}
        <ChevronRight className="w-3 h-3 text-[#30363d]" />
        <span className="text-[#e6edf3] font-medium">{pageName}</span>
      </div>

      {/* Search + Actions */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <div className={clsx(
          'flex items-center gap-2 rounded-lg border px-3 py-1.5 transition-all duration-200',
          searchFocused
            ? 'bg-[#161b22] border-[#6e40c9]/50 w-64'
            : 'bg-[#161b22] border-[#30363d] w-44'
        )}>
          <Search className="w-3.5 h-3.5 text-[#6e7681] flex-shrink-0" />
          <input
            type="text"
            placeholder="Search incidents, requests..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="bg-transparent text-xs text-[#e6edf3] placeholder:text-[#6e7681] outline-none w-full"
          />
          {searchValue && (
            <button onClick={() => setSearchValue('')}>
              <X className="w-3 h-3 text-[#6e7681] hover:text-[#e6edf3]" />
            </button>
          )}
        </div>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative w-8 h-8 rounded-lg bg-[#161b22] border border-[#30363d] flex items-center justify-center hover:bg-[#21262d] transition-colors"
          >
            <Bell className="w-4 h-4 text-[#8b949e]" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#6e40c9] text-white text-[9px] font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-10 w-80 bg-[#161b22] border border-[#30363d] rounded-xl shadow-2xl z-50 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#21262d]">
                <span className="text-sm font-semibold text-[#e6edf3]">Notifications</span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="flex items-center gap-1 text-xs text-[#6e40c9] hover:text-[#a78bfa] transition-colors"
                  >
                    <Check className="w-3 h-3" />
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifications.map(n => {
                  const Icon = notificationIcon[n.type];
                  return (
                    <div
                      key={n.id}
                      onClick={() => markRead(n.id)}
                      className={clsx(
                        'flex gap-3 px-4 py-3 cursor-pointer hover:bg-[#1c2333] transition-colors border-b border-[#21262d] last:border-0',
                        !n.read && 'bg-[#6e40c9]/5'
                      )}
                    >
                      <Icon className={clsx('w-4 h-4 mt-0.5 flex-shrink-0', notificationColor[n.type])} />
                      <div className="flex-1 min-w-0">
                        <p className={clsx('text-xs leading-relaxed', n.read ? 'text-[#8b949e]' : 'text-[#e6edf3]')}>
                          {n.message}
                        </p>
                        <p className="text-[10px] text-[#6e7681] mt-0.5">{n.time}</p>
                      </div>
                      {!n.read && (
                        <div className="w-1.5 h-1.5 rounded-full bg-[#6e40c9] mt-1.5 flex-shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* User Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-[#21262d]">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#6e40c9] to-[#4f2d9e] flex items-center justify-center text-xs font-bold text-white cursor-pointer">
            A
          </div>
          <span className="text-xs text-[#8b949e] hidden sm:block">Admin</span>
        </div>
      </div>
    </header>
  );
}
