'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

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

export default function Header() {
  const pathname = usePathname();
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, type: 'critical', message: 'INC-001: Server Down - requires immediate attention', time: '2 min ago' },
    { id: 2, type: 'warning', message: 'SLA breach imminent for INC-002', time: '5 min ago' },
    { id: 3, type: 'info', message: 'REQ-003 approved by manager', time: '15 min ago' },
  ];

  const pageName = breadcrumbMap[pathname] || 'AutoMax';

  return (
    <header className="h-14 bg-[#0d1117] border-b border-[#21262d] flex items-center justify-between px-6 flex-shrink-0">
      <div className="flex items-center gap-2 text-sm">
        <span className="text-[#8b949e]">AutoMax</span>
        <span className="text-[#30363d]">/</span>
        <span className="text-white font-medium">{pageName}</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative w-8 h-8 rounded-lg bg-[#161b22] border border-[#30363d] flex items-center justify-center hover:bg-[#1c2128] transition-colors"
          >
            <span className="text-sm">🔔</span>
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">3</span>
          </button>
          {showNotifications && (
            <div className="absolute right-0 top-10 w-80 bg-[#161b22] border border-[#30363d] rounded-xl shadow-2xl z-50">
              <div className="p-3 border-b border-[#30363d] flex items-center justify-between">
                <span className="text-white font-semibold text-sm">Notifications</span>
                <button className="text-xs text-[#2188ff] hover:text-blue-300">Mark all read</button>
              </div>
              <div className="divide-y divide-[#21262d]">
                {notifications.map(n => (
                  <div key={n.id} className="p-3 hover:bg-[#1c2128] cursor-pointer">
                    <div className="flex items-start gap-2">
                      <span className="text-sm mt-0.5">{n.type === 'critical' ? '🚨' : n.type === 'warning' ? '⚠️' : 'ℹ️'}</span>
                      <div>
                        <p className="text-white text-xs">{n.message}</p>
                        <p className="text-[#8b949e] text-xs mt-1">{n.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#2188ff]/20 flex items-center justify-center text-[#2188ff] font-semibold text-xs">A</div>
          <span className="text-white text-sm">Admin</span>
        </div>
      </div>
    </header>
  );
}
