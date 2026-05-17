"use client";
import { useState } from "react";
import Link from "next/link";
import {
  FileText,
  Plus,
  RefreshCw,
  Search,
  Filter,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  ChevronDown,
} from "lucide-react";
import { clsx } from "clsx";

const MOCK_REQUESTS = [
  { id: "1", number: "REQ-2026-000010", title: "Test BA 4/2- 3", status: "New", priority: "Medium", assignee: "contractor1", sla: "On Track", source: "INC-2026-000145", created: "2026-05-15" },
  { id: "2", number: "REQ-2026-000009", title: "bulb - Maharashtra - Kollam", status: "New", priority: "Medium", assignee: "contractor1", sla: "On Track", source: "INC-2026-000144", created: "2026-05-14" },
  { id: "3", number: "REQ-2026-000008", title: "bulb - Maharashtra - Jamshedpur", status: "New", priority: null, assignee: "agent1", sla: "On Track", source: "INC-2026-000143", created: "2026-05-13" },
  { id: "4", number: "REQ-2026-000007", title: "bulb - Maharashtra - Jamshedpur", status: "New", priority: "High", assignee: "Supervisor", sla: "On Track", source: "INC-2026-000142", created: "2026-05-10" },
  { id: "5", number: "REQ-2026-000006", title: "Testing request 9/2", status: "Close", priority: null, assignee: "agent1", sla: "On Track", source: null, created: "2026-05-09" },
  { id: "6", number: "REQ-2026-000002", title: "Test Request", status: "In Progress", priority: null, assignee: "contractor1", sla: "On Track", source: "INC-2026-000141", created: "2026-04-28" },
];

const STATUS_COLORS: Record<string, string> = {
  New: "badge-blue",
  "In Progress": "badge-yellow",
  Close: "badge-gray",
  Completed: "badge-green",
};

const PRIORITY_COLORS: Record<string, string> = {
  Critical: "badge-red",
  High: "badge-orange",
  Medium: "badge-yellow",
  Low: "badge-blue",
};

const stats = [
  { label: "Total Requests", value: "10", change: "+2", trend: "up", color: "text-[--color-accent]", bg: "bg-[--color-accent]/10", border: "border-[--color-accent]/20", icon: FileText },
  { label: "New", value: "4", change: "+1", trend: "up", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", icon: AlertCircle },
  { label: "In Progress", value: "1", change: "0", trend: "neutral", color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20", icon: Clock },
  { label: "Completed", value: "5", change: "+3", trend: "up", color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20", icon: CheckCircle2 },
];

export default function RequestsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = MOCK_REQUESTS.filter(r => {
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.number.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="min-h-screen" style={{ background: "var(--color-bg-primary)" }}>
      {/* Breadcrumb */}
      <div className="border-b px-6 py-3 flex items-center gap-2 text-sm" style={{ borderColor: "var(--color-border-primary)", background: "var(--color-bg-secondary)" }}>
        <Link href="/dashboard" className="transition-colors" style={{ color: "var(--color-text-muted)" }}
          onMouseEnter={e => (e.currentTarget.style.color = "var(--color-accent)")}
          onMouseLeave={e => (e.currentTarget.style.color = "var(--color-text-muted)")}>
          Dashboard
        </Link>
        <span style={{ color: "var(--color-text-muted)" }}>/</span>
        <span style={{ color: "var(--color-text-primary)" }}>Requests</span>
      </div>

      <div className="p-6 space-y-6">
        {/* Page Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ background: "var(--color-accent)/15", border: "1px solid var(--color-accent)/25" }}>
              <FileText className="w-6 h-6" style={{ color: "var(--color-accent)" }} />
            </div>
            <div>
              <h1 className="text-2xl font-bold" style={{ color: "var(--color-text-primary)" }}>Requests</h1>
              <p className="text-sm mt-0.5" style={{ color: "var(--color-text-muted)" }}>Track and manage service requests</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors" style={{ background: "var(--color-bg-tertiary)", color: "var(--color-text-secondary)", border: "1px solid var(--color-border-primary)" }}>
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors" style={{ background: "var(--color-accent)", color: "#fff" }}>
              <Plus className="w-4 h-4" />
              Create Request
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className={clsx("rounded-xl p-4 border", stat.bg, stat.border)}>
                <div className="flex items-center justify-between mb-2">
                  <Icon className={clsx("w-5 h-5", stat.color)} />
                  <span className={clsx("text-xs font-medium", stat.trend === "up" ? "text-green-400" : stat.trend === "down" ? "text-red-400" : "text-gray-400")}>
                    {stat.change !== "0" ? stat.change : "—"}
                  </span>
                </div>
                <p className={clsx("text-2xl font-bold", stat.color)}>{stat.value}</p>
                <p className="text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Filters & Search */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--color-text-muted)" }} />
            <input
              type="text"
              placeholder="Search by title or request number..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg text-sm focus:outline-none transition-colors"
              style={{ background: "var(--color-bg-tertiary)", border: "1px solid var(--color-border-primary)", color: "var(--color-text-primary)" }}
            />
          </div>
          <div className="flex items-center gap-2">
            {["All", "New", "In Progress", "Close", "Completed"].map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={clsx("px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                  statusFilter === s
                    ? "text-white"
                    : "hover:opacity-80"
                )}
                style={statusFilter === s
                  ? { background: "var(--color-accent)", color: "#fff" }
                  : { background: "var(--color-bg-tertiary)", color: "var(--color-text-secondary)", border: "1px solid var(--color-border-primary)" }
                }
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--color-border-primary)", background: "var(--color-bg-secondary)" }}>
          <div className="overflow-x-auto">
            <table className="table-synergi w-full">
              <thead>
                <tr>
                  <th>Request</th>
                  <th>Source Incident</th>
                  <th>State</th>
                  <th>Priority</th>
                  <th>Assignee</th>
                  <th>SLA</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(req => (
                  <tr key={req.id}>
                    <td>
                      <div>
                        <p className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>{req.number}</p>
                        <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>{req.title}</p>
                      </div>
                    </td>
                    <td>
                      {req.source ? (
                        <Link href="/incidents" className="text-xs font-mono hover:underline" style={{ color: "var(--color-accent)" }}>
                          {req.source}
                        </Link>
                      ) : <span style={{ color: "var(--color-text-muted)" }}>—</span>}
                    </td>
                    <td>
                      <span className={clsx("badge", STATUS_COLORS[req.status] ?? "badge-gray")}>
                        {req.status}
                      </span>
                    </td>
                    <td>
                      {req.priority ? (
                        <span className={clsx("badge", PRIORITY_COLORS[req.priority] ?? "badge-gray")}>
                          {req.priority}
                        </span>
                      ) : <span style={{ color: "var(--color-text-muted)" }}>—</span>}
                    </td>
                    <td>
                      <span className="text-sm" style={{ color: "var(--color-text-secondary)" }}>{req.assignee}</span>
                    </td>
                    <td>
                      <span className={clsx("badge", req.sla === "Breached" ? "badge-red" : req.sla === "On Track" ? "badge-green" : "badge-gray")}>
                        {req.sla}
                      </span>
                    </td>
                    <td>
                      <button className="flex items-center gap-1 text-xs px-2 py-1 rounded transition-colors" style={{ color: "var(--color-accent)", border: "1px solid var(--color-accent)/30" }}>
                        <Eye className="w-3 h-3" />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t flex items-center justify-between text-xs" style={{ borderColor: "var(--color-border-primary)", color: "var(--color-text-muted)" }}>
            <span>Showing {filtered.length} of 10 requests</span>
            <div className="flex items-center gap-2">
              <button className="px-2 py-1 rounded hover:opacity-80" style={{ border: "1px solid var(--color-border-primary)" }}>Previous</button>
              <button className="px-2 py-1 rounded hover:opacity-80" style={{ border: "1px solid var(--color-border-primary)" }}>Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
