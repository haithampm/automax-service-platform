'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: '🏠' },
  { name: 'Incidents', href: '/incidents', icon: '🚨' },
  { name: 'Requests', href: '/requests', icon: '📤' },
  { name: 'Complaints', href: '/complaints', icon: '🗣️' },
  { name: 'Workflows', href: '/workflows', icon: '⚙️' },
];

const adminNavigation = [
  { name: 'Users', href: '/admin/users', icon: '👥' },
  { name: 'Roles', href: '/admin/roles', icon: '🔑' },
  { name: 'Settings', href: '/settings', icon: '🔧' },
];

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <div className="w-60 bg-[#0d1117] border-r border-[#21262d] flex flex-col h-full flex-shrink-0">
      <div className="p-5 border-b border-[#21262d]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#2188ff] flex items-center justify-center text-white font-bold text-sm">A</div>
          <div>
            <div className="text-white font-semibold text-sm">AutoMax</div>
            <div className="text-[#8b949e] text-xs">Service Platform</div>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="text-[#8b949e] text-xs font-semibold uppercase tracking-wider px-3 py-2">Main</div>
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
              isActive(item.href)
                ? 'bg-[#2188ff]/20 text-[#2188ff] font-medium'
                : 'text-[#8b949e] hover:text-white hover:bg-[#161b22]'
            }`}
          >
            <span className="text-base">{item.icon}</span>
            {item.name}
          </Link>
        ))}
        <div className="text-[#8b949e] text-xs font-semibold uppercase tracking-wider px-3 py-2 mt-4">Administration</div>
        {adminNavigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
              isActive(item.href)
                ? 'bg-[#2188ff]/20 text-[#2188ff] font-medium'
                : 'text-[#8b949e] hover:text-white hover:bg-[#161b22]'
            }`}
          >
            <span className="text-base">{item.icon}</span>
            {item.name}
          </Link>
        ))}
      </nav>
      <div className="p-3 border-t border-[#21262d]">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-7 h-7 rounded-full bg-[#2188ff]/20 flex items-center justify-center text-[#2188ff] font-semibold text-xs">A</div>
          <div>
            <div className="text-white text-xs font-medium">Admin User</div>
            <div className="text-[#8b949e] text-xs">admin@automax.com</div>
          </div>
        </div>
      </div>
    </div>
  );
}
