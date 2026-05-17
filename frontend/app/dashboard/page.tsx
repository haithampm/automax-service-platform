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
  { title: 'Admin Panel', subtitle: 'User & Access Control', desc: 'Users, roles, departments, master data.', href: '/admin', Icon: Settings, gradient: 'from-violet-600 to-purple-500', count: 'Governance' },
  { title: 'Incident Management', subtitle: 'Track & Resolve', desc: 'SLA, workflow, clone, map, convert.', href: '/incidents', Icon: AlertTriangle, gradient: 'from-blue-500 to-sky-600', count: 'Live' },
  { title: 'Request Management', subtitle: 'Service Requests', desc: 'Linked incidents, audit, processing.', href: '/requests', Icon: FileText, gradient: 'from-green-500 to-emerald-700', count: 'Linked' },
  { title: 'Reports & Analytics', subtitle: 'Insights & Logs', desc: 'Builder, templates, columns, export.', href: '/reports', Icon: BarChart3, gradient: 'from-teal-500 to-cyan-600', count: 'Dynamic' },
  { title: 'Workflow Management', subtitle: 'Design & Configure', desc: 'States, transitions, required fields.', href: '/workflows', Icon: Workflow, gradient: 'from-indigo-600 to-violet-700', count: 'Rules' },
  { title: 'Call Centre Management', subtitle: 'Manage Calls', desc: 'Contacts, calls, email, SMS, audio.', href: '/ccm', Icon: Headphones, gradient: 'from-orange-500 to-red-600', count: 'CCM' },
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
    { label: 'Active Requests', value: String(activeRequests), detail: `${requests.length} total`, colorClass: 'text-blue-200', shellClass: 'color-card-blue', Icon: FileText },
    { label: 'Workflow Queue', value: String(incidents.filter(i => i.status === 'Ready to Close' || i.status === 'Under Resolution').length), detail: 'Needs action', colorClass: 'text-yellow-200', shellClass: 'color-card-orange', Icon: Workflow },
    { label: 'Closed', value: String(closedToday), detail: 'Completed records', colorClass: 'text-emerald-200', shellClass: 'color-card-green', Icon: CheckCircle2 },
  ];

  const recentActivity = [
    ...incidents.slice(0, 4).map(item => ({ id: item.number, title: item.title, status: item.status, meta: `${item.priority} • ${item.assignee}`, href: '/incidents' })),
    ...requests.slice(0, 2).map(item => ({ id: item.number, title: item.title, status: item.status, meta: `${item.priority} • ${item.assignee}`, href: '/requests' })),
  ].slice(0, 6);

  return (
    <div className="compact-page">
      <section className="hero-panel">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.08] px-3 py-1 text-[10px] text-violet-100">
              <Sparkles className="w-3.5 h-3.5" /> Synergi IMS Workspace
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-white">{greeting}, Admin</h1>
              <p className="text-xs text-[#d7def0] mt-1 max-w-2xl">A compact colorful command center for incidents, requests, reports, workflow, administration, and contact-centre work.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/incidents" className="btn-primary">Open Incidents <ArrowRight className="w-3.5 h-3.5" /></Link>
              <Link href="/reports" className="btn-secondary">Reports</Link>
              <Link href="/ccm" className="btn-secondary">CCM</Link>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2 lg:min-w-[360px]">
            <div className="glass-panel p-3"><Activity className="w-4 h-4 text-emerald-200" /><div className="text-lg font-bold mt-1">99.9%</div><div className="text-[10px] text-[#cbd5e1]">Health</div></div>
            <div className="glass-panel p-3"><ShieldCheck className="w-4 h-4 text-blue-200" /><div className="text-lg font-bold mt-1">RBAC</div><div className="text-[10px] text-[#cbd5e1]">Access</div></div>
            <div className="glass-panel p-3"><Clock className="w-4 h-4 text-yellow-200" /><div className="text-lg font-bold mt-1">24/7</div><div className="text-[10px] text-[#cbd5e1]">Ops</div></div>
            <div className="glass-panel p-3"><Users className="w-4 h-4 text-purple-200" /><div className="text-lg font-bold mt-1">8</div><div className="text-[10px] text-[#cbd5e1]">Roles</div></div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map(({ label, value, detail, colorClass, shellClass, Icon }) => (
          <div key={label} className={`stats-card ${shellClass}`}>
            <div className="flex items-start justify-between gap-2">
              <div className="kpi-icon"><Icon className={`w-4 h-4 ${colorClass}`} /></div>
              <TrendingUp className="w-3.5 h-3.5 text-emerald-200" />
            </div>
            <div className={`stats-value ${colorClass}`}>{value}</div>
            <div className="stats-label">{label}</div>
            <div className="mt-1 text-[10px] text-[#a9b6ca]">{detail}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 2xl:grid-cols-4 gap-4">
        <section className="2xl:col-span-3 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold text-[#a9b6ca] uppercase tracking-widest">Modules</h2>
            <span className="badge badge-purple">Small colorful cards</span>
          </div>
          <div className="compact-grid">
            {moduleCards.map(({ title, subtitle, desc, href, Icon, gradient, count }) => (
              <Link key={href} href={href} className={`dashboard-module-card bg-gradient-to-br ${gradient} group`}>
                <div className="relative flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shadow-md backdrop-blur">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold text-white/90">{count}</span>
                </div>
                <div className="relative text-base font-extrabold text-white group-hover:text-white">{title}</div>
                <div className="relative text-[11px] font-semibold text-white/90 mt-0.5">{subtitle}</div>
                <div className="relative text-[11px] text-white/85 leading-snug mt-3 pr-4">{desc}</div>
                <div className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 text-white transition-transform group-hover:translate-x-0.5">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xs font-semibold text-[#a9b6ca] uppercase tracking-widest">Live Activity</h2>
          <div className="card p-0 overflow-hidden">
            {recentActivity.map(item => (
              <Link key={item.id} href={item.href} className="flex items-start gap-2 px-3 py-2.5 hover:bg-white/[0.05] transition-colors border-b border-white/10 last:border-0">
                <div className="w-8 h-8 rounded-lg bg-white/[0.07] border border-white/10 flex items-center justify-center"><Activity className="w-3.5 h-3.5 text-violet-200" /></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1"><span className="text-[9px] font-mono text-[#a9b6ca]">{item.id}</span><span className={`badge ${activityTone[item.status] ?? 'badge-gray'}`}>{item.status}</span></div>
                  <div className="text-[11px] text-white truncate font-medium">{item.title}</div>
                  <div className="text-[10px] text-[#77849a] mt-0.5">{item.meta}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
