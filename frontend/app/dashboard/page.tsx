'use client';

import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Clock,
  FileText,
  Headphones,
  Settings,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
  Workflow,
} from 'lucide-react';
import { IncidentRecord, RequestRecord, seedIncidents, seedRequests } from '../../lib/imsData';
import { useLocalStorageState } from '../../lib/useLocalStorage';

type StatCard = {
  label: string;
  value: string;
  detail: string;
  colorClass: string;
  shellClass: string;
  Icon: LucideIcon;
};

type ModuleCard = {
  title: string;
  subtitle: string;
  desc: string;
  href: string;
  Icon: LucideIcon;
  gradient: string;
  count: string;
};

const moduleCards: ModuleCard[] = [
  { title: 'Incident Management', subtitle: 'Track & Resolve', desc: 'Workflow actions, SLA monitoring, convert-to-request, clone, map view, and CSV export.', href: '/incidents', Icon: AlertTriangle, gradient: 'from-blue-500 to-cyan-500', count: 'Live workflow' },
  { title: 'Request Management', subtitle: 'Service Requests', desc: 'Trace requests back to source incidents, process requests, audit, and export.', href: '/requests', Icon: FileText, gradient: 'from-emerald-500 to-teal-500', count: 'Linked records' },
  { title: 'Reports', subtitle: 'Builder & Templates', desc: 'Saved reports, data source selection, column picker, record limits, and CSV export.', href: '/reports', Icon: BarChart3, gradient: 'from-violet-500 to-fuchsia-500', count: 'Dynamic' },
  { title: 'CCM', subtitle: 'Contact Centre', desc: 'Contacts, call history, email inbox, SMS hub, and complaint audio support.', href: '/ccm', Icon: Headphones, gradient: 'from-orange-500 to-rose-500', count: 'Omnichannel' },
  { title: 'Workflow Automation', subtitle: 'Smart Transitions', desc: 'Required fields, roles, transitions, reopen, reject, close, and conversion logic.', href: '/workflows', Icon: Workflow, gradient: 'from-indigo-500 to-blue-500', count: 'Rules' },
  { title: 'Admin Panel', subtitle: 'Configuration', desc: 'Users, roles, departments, organization, classifications, and master data.', href: '/admin', Icon: Settings, gradient: 'from-purple-500 to-indigo-500', count: 'Governance' },
];

const activityTone: Record<string, string> = {
  New: 'badge-blue',
  'New Incident': 'badge-blue',
  'Under Resolution': 'badge-yellow',
  'Ready to Close': 'badge-purple',
  Closed: 'badge-green',
  Rejected: 'badge-red',
  'In Progress': 'badge-yellow',
  Close: 'badge-green',
  Completed: 'badge-green',
};

export default function DashboardPage() {
  const [incidents] = useLocalStorageState<IncidentRecord[]>('synergi.incidents', seedIncidents);
  const [requests] = useLocalStorageState<RequestRecord[]>('synergi.requests', seedRequests);

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  const openIncidents = incidents.filter(i => i.status !== 'Closed').length;
  const breached = incidents.filter(i => i.sla === 'Breached').length;
  const activeRequests = requests.filter(r => r.status !== 'Close' && r.status !== 'Completed').length;
  const closedToday = incidents.filter(i => i.status === 'Closed').length + requests.filter(r => r.status === 'Close' || r.status === 'Completed').length;

  const stats: StatCard[] = [
    { label: 'Open Incidents', value: String(openIncidents), detail: `${breached} SLA breach`, colorClass: 'text-red-200', shellClass: 'color-card-red', Icon: AlertCircle },
    { label: 'Active Requests', value: String(activeRequests), detail: `${requests.length} total requests`, colorClass: 'text-blue-200', shellClass: 'color-card-blue', Icon: FileText },
    { label: 'Workflow Queue', value: String(incidents.filter(i => i.status === 'Ready to Close' || i.status === 'Under Resolution').length), detail: 'Needs action', colorClass: 'text-yellow-200', shellClass: 'color-card-orange', Icon: Workflow },
    { label: 'Resolved / Closed', value: String(closedToday), detail: 'Completed records', colorClass: 'text-emerald-200', shellClass: 'color-card-green', Icon: CheckCircle2 },
  ];

  const recentActivity = [
    ...incidents.slice(0, 4).map(item => ({ id: item.number, title: item.title, status: item.status, meta: `${item.priority} • ${item.assignee}`, href: '/incidents' })),
    ...requests.slice(0, 2).map(item => ({ id: item.number, title: item.title, status: item.status, meta: `${item.priority} • ${item.assignee}`, href: '/requests' })),
  ].slice(0, 6);

  return (
    <div className="p-6 space-y-6">
      <section className="hero-panel">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.08] px-3 py-1 text-xs text-violet-100">
              <Sparkles className="w-3.5 h-3.5" /> Synergi IMS Command Center
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white">{greeting}, Admin</h1>
              <p className="text-sm text-[#d7def0] mt-2 max-w-2xl">Monitor incidents, process requests, run reports, manage workflows, and operate contact-centre actions from one colorful workspace.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/incidents" className="btn-primary">Open Incidents <ArrowRight className="w-4 h-4" /></Link>
              <Link href="/reports" className="btn-secondary">Build Report</Link>
              <Link href="/ccm" className="btn-secondary">Contact Centre</Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 min-w-[280px]">
            <div className="glass-panel p-4"><Activity className="w-5 h-5 text-emerald-200" /><div className="text-2xl font-bold mt-2">99.9%</div><div className="text-xs text-[#cbd5e1]">Platform health</div></div>
            <div className="glass-panel p-4"><ShieldCheck className="w-5 h-5 text-blue-200" /><div className="text-2xl font-bold mt-2">RBAC</div><div className="text-xs text-[#cbd5e1]">Enabled</div></div>
            <div className="glass-panel p-4"><Clock className="w-5 h-5 text-yellow-200" /><div className="text-2xl font-bold mt-2">24/7</div><div className="text-xs text-[#cbd5e1]">Operations</div></div>
            <div className="glass-panel p-4"><Users className="w-5 h-5 text-purple-200" /><div className="text-2xl font-bold mt-2">8</div><div className="text-xs text-[#cbd5e1]">Roles</div></div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, detail, colorClass, shellClass, Icon }) => (
          <div key={label} className={`stats-card ${shellClass}`}>
            <div className="flex items-start justify-between gap-3">
              <div className="kpi-icon"><Icon className={`w-5 h-5 ${colorClass}`} /></div>
              <TrendingUp className="w-4 h-4 text-emerald-200" />
            </div>
            <div className={`stats-value ${colorClass}`}>{value}</div>
            <div className="stats-label">{label}</div>
            <div className="mt-2 text-xs text-[#a9b6ca]">{detail}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <section className="xl:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[#a9b6ca] uppercase tracking-widest">Operational Modules</h2>
            <span className="badge badge-purple">Enhanced GUI</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {moduleCards.map(({ title, subtitle, desc, href, Icon, gradient, count }) => (
              <Link key={href} href={href} className="module-tile group">
                <div className="relative flex items-start justify-between mb-4">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-md`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="badge badge-gray">{count}</span>
                </div>
                <div className="relative text-base font-bold text-white group-hover:text-violet-100">{title}</div>
                <div className="relative text-xs text-[#8ea0b8] mt-1 mb-2">{subtitle}</div>
                <div className="relative text-xs text-[#a9b6ca] leading-relaxed">{desc}</div>
                <div className="relative flex items-center gap-1 mt-4 text-xs text-violet-200 font-semibold">
                  Open module <ArrowRight className="w-3 h-3" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-[#a9b6ca] uppercase tracking-widest">Live Activity</h2>
          <div className="card p-0 overflow-hidden">
            {recentActivity.map(item => (
              <Link key={item.id} href={item.href} className="flex items-start gap-3 px-4 py-3 hover:bg-white/[0.05] transition-colors border-b border-white/10 last:border-0">
                <div className="w-9 h-9 rounded-xl bg-white/[0.07] border border-white/10 flex items-center justify-center"><Activity className="w-4 h-4 text-violet-200" /></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1"><span className="text-[10px] font-mono text-[#a9b6ca]">{item.id}</span><span className={`badge ${activityTone[item.status] ?? 'badge-gray'}`}>{item.status}</span></div>
                  <div className="text-xs text-white truncate font-medium">{item.title}</div>
                  <div className="text-[10px] text-[#77849a] mt-1">{item.meta}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
