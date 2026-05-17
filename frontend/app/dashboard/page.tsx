"use client";
import Link from "next/link";
import {
  Settings,
  AlertTriangle,
  FileText,
  MessageSquareWarning,
  Workflow,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle2,
  AlertCircle,
  Activity,
} from "lucide-react";
import { clsx } from "clsx";

const stats = [
  {
    label: "Open Incidents",
    value: "24",
    change: "+3",
    trend: "up",
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    icon: AlertCircle,
  },
  {
    label: "Pending Requests",
    value: "18",
    change: "-5",
    trend: "down",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    icon: FileText,
  },
  {
    label: "Active Complaints",
    value: "9",
    change: "+1",
    trend: "up",
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
    icon: MessageSquareWarning,
  },
  {
    label: "Resolved Today",
    value: "37",
    change: "+12",
    trend: "up",
    color: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
    icon: CheckCircle2,
  },
];

const modules = [
  {
    title: "Incident Management",
    subtitle: "Track & Resolve",
    desc: "Create, track, and resolve incidents with SLA monitoring",
    href: "/incidents",
    icon: AlertTriangle,
    gradient: "from-blue-600 to-blue-800",
    count: "24 open",
  },
  {
    title: "Request Management",
    subtitle: "Service Requests",
    desc: "Handle and fulfil service requests end-to-end",
    href: "/requests",
    icon: FileText,
    gradient: "from-green-600 to-green-800",
    count: "18 pending",
  },
  {
    title: "Complaint Management",
    subtitle: "Customer Complaints",
    desc: "Manage and resolve customer complaints efficiently",
    href: "/complaints",
    icon: MessageSquareWarning,
    gradient: "from-orange-500 to-orange-700",
    count: "9 active",
  },
  {
    title: "Workflow Automation",
    subtitle: "Smart Workflows",
    desc: "Automate escalation, routing and assignment rules",
    href: "/workflows",
    icon: Workflow,
    gradient: "from-teal-600 to-teal-800",
    count: "12 active",
  },
  {
    title: "Admin Panel",
    subtitle: "User & Access Control",
    desc: "Manage users, roles, permissions and departments",
    href: "/admin",
    icon: Settings,
    gradient: "from-purple-600 to-purple-800",
    count: "8 users",
  },
];

const recentActivity = [
  { id: "INC-024", title: "API Gateway Timeout", type: "incident", status: "open", priority: "critical", time: "2 min ago" },
  { id: "REQ-018", title: "VPN Access for New Employee", type: "request", status: "pending", priority: "medium", time: "15 min ago" },
  { id: "COM-009", title: "Billing Discrepancy Q1", type: "complaint", status: "in_progress", priority: "high", time: "1 hr ago" },
  { id: "INC-023", title: "Email Server Latency", type: "incident", status: "resolved", priority: "medium", time: "2 hr ago" },
];

const statusColor: Record<string, string> = {
  open: "bg-red-500/20 text-red-400 border-red-500/30",
  pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  in_progress: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  resolved: "bg-green-500/20 text-green-400 border-green-500/30",
};

const priorityColor: Record<string, string> = {
  critical: "text-red-400",
  high: "text-orange-400",
  medium: "text-yellow-400",
  low: "text-green-400",
};

export default function DashboardPage() {
  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Banner */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#e6edf3]">{greeting}, Admin</h1>
          <p className="text-sm text-[#8b949e] mt-0.5">Here&apos;s what&apos;s happening across Synergi IMS today.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#161b22] border border-[#30363d]">
          <Activity className="w-3.5 h-3.5 text-green-400" />
          <span className="text-xs text-[#8b949e]">All systems operational</span>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className={clsx('card flex items-start gap-3', s.border, 'border')}>
              <div className={clsx('w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0', s.bg)}>
                <Icon className={clsx('w-4 h-4', s.color)} />
              </div>
              <div>
                <div className="text-xl font-bold text-[#e6edf3]">{s.value}</div>
                <div className="text-xs text-[#8b949e] leading-tight">{s.label}</div>
                <div className={clsx('flex items-center gap-0.5 mt-1 text-xs', s.trend === 'up' ? 'text-red-400' : 'text-green-400')}>
                  {s.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  <span>{s.change} this week</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modules Grid + Activity Feed */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Modules */}
        <div className="xl:col-span-2">
          <h2 className="text-sm font-semibold text-[#8b949e] uppercase tracking-widest mb-3">Modules</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {modules.map((m) => {
              const Icon = m.icon;
              return (
                <Link key={m.href} href={m.href} className="card group hover:border-[#6e40c9]/30 hover:bg-[#1c2333]/80 transition-all duration-200">
                  <div className="flex items-start justify-between mb-3">
                    <div className={clsx('w-9 h-9 rounded-lg bg-gradient-to-br flex items-center justify-center', m.gradient)}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-[10px] text-[#6e7681] bg-[#161b22] px-2 py-0.5 rounded-full border border-[#30363d]">
                      {m.count}
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-[#e6edf3] group-hover:text-white">{m.title}</div>
                  <div className="text-xs text-[#6e7681] mt-0.5 mb-2">{m.subtitle}</div>
                  <div className="text-xs text-[#8b949e] leading-relaxed">{m.desc}</div>
                  <div className="flex items-center gap-1 mt-3 text-xs text-[#6e40c9] group-hover:text-[#a78bfa] font-medium">
                    Open <ArrowRight className="w-3 h-3" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-sm font-semibold text-[#8b949e] uppercase tracking-widest mb-3">Recent Activity</h2>
          <div className="card space-y-0 divide-y divide-[#21262d] p-0 overflow-hidden">
            {recentActivity.map((item) => (
              <div key={item.id} className="flex items-start gap-3 px-4 py-3 hover:bg-[#161b22] transition-colors cursor-pointer">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono text-[#6e7681]">{item.id}</span>
                    <span className={clsx('text-[10px] px-1.5 py-0.5 rounded border font-medium', statusColor[item.status])}>
                      {item.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="text-xs text-[#e6edf3] truncate font-medium">{item.title}</div>
                  <div className="flex items-center gap-1 mt-1">
                    <Clock className="w-2.5 h-2.5 text-[#6e7681]" />
                    <span className="text-[10px] text-[#6e7681]">{item.time}</span>
                    <span className={clsx('ml-1 text-[10px] font-medium', priorityColor[item.priority])}>
                      {item.priority}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            <div className="px-4 py-2.5">
              <Link href="/incidents" className="text-xs text-[#6e40c9] hover:text-[#a78bfa] flex items-center gap-1">
                View all activity <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
