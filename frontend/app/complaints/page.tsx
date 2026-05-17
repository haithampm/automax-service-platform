"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  MessageSquareWarning,
  Plus,
  RefreshCw,
  Search,
  Filter,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  X,
  TrendingUp,
} from "lucide-react";
import { clsx } from "clsx";

const STATUS_COLORS: Record<string, string> = {
  open: "badge-blue",
  in_progress: "badge-yellow",
  resolved: "badge-green",
  closed: "badge-gray",
  escalated: "badge-red",
};

const PRIORITY_COLORS: Record<string, string> = {
  low: "badge-blue",
  medium: "badge-yellow",
  high: "badge-orange",
  critical: "badge-red",
};

const stats = [
  { label: "Total Complaints", value: "48", change: "+5", trend: "up", color: "text-[--color-accent]", bg: "bg-[--color-accent]/10", border: "border-[--color-accent]/20", icon: MessageSquareWarning },
  { label: "Open", value: "12", change: "+2", trend: "up", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", icon: AlertCircle },
  { label: "In Progress", value: "18", change: "+3", trend: "up", color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20", icon: Clock },
  { label: "Resolved", value: "18", change: "+5", trend: "up", color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20", icon: CheckCircle2 },
];

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", priority: "medium", category: "", assignee: "" });

  useEffect(() => {
    fetchComplaints();
  }, [page, search, statusFilter, priorityFilter]);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "10",
        ...(search && { search }),
        ...(statusFilter !== "All" && { status: statusFilter }),
        ...(priorityFilter !== "All" && { priority: priorityFilter }),
      });
      const res = await fetch(`/api/complaints?${params}`);
      const data = await res.json();
      setComplaints(data.complaints || []);
    } catch {
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await fetch("/api/complaints", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setShowModal(false);
    setForm({ title: "", description: "", priority: "medium", category: "", assignee: "" });
    fetchComplaints();
  };

  const filtered = complaints.filter(c => {
    const matchSearch = c.title?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || c.status === statusFilter;
    const matchPriority = priorityFilter === "All" || c.priority === priorityFilter;
    return matchSearch && matchStatus && matchPriority;
  });

  return (
    <div className="min-h-screen" style={{ background: "var(--color-bg-primary)" }}>
      {/* Breadcrumb */}
      <div className="border-b px-6 py-3 flex items-center gap-2 text-sm" style={{ borderColor: "var(--color-border-primary)", background: "var(--color-bg-secondary)" }}>
        <Link
          href="/dashboard"
          className="transition-colors"
          style={{ color: "var(--color-text-muted)" }}
          onMouseEnter={e => (e.currentTarget.style.color = "var(--color-accent)")}
          onMouseLeave={e => (e.currentTarget.style.color = "var(--color-text-muted)")}
        >
          Dashboard
        </Link>
        <span style={{ color: "var(--color-text-muted)" }}>/</span>
        <span style={{ color: "var(--color-text-primary)" }}>Complaints</span>
      </div>

      <div className="p-6 space-y-6">
        {/* Page Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ background: "var(--color-accent)/15", border: "1px solid var(--color-accent)/25" }}>
              <MessageSquareWarning className="w-6 h-6" style={{ color: "var(--color-accent)" }} />
            </div>
            <div>
              <h1 className="text-2xl font-bold" style={{ color: "var(--color-text-primary)" }}>Complaints</h1>
              <p className="text-sm mt-0.5" style={{ color: "var(--color-text-muted)" }}>Manage and track all customer complaints</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchComplaints()}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors"
              style={{ background: "var(--color-bg-tertiary)", color: "var(--color-text-secondary)", border: "1px solid var(--color-border-primary)" }}
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{ background: "var(--color-accent)", color: "#fff" }}
            >
              <Plus className="w-4 h-4" />
              New Complaint
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map(stat => {
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
              placeholder="Search complaints..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg text-sm focus:outline-none transition-colors"
              style={{ background: "var(--color-bg-tertiary)", border: "1px solid var(--color-border-primary)", color: "var(--color-text-primary)" }}
            />
          </div>
          <div className="flex items-center gap-2">
            {["All", "open", "in_progress", "escalated", "resolved", "closed"].map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={clsx("px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize", statusFilter === s ? "text-white" : "hover:opacity-80")}
                style={
                  statusFilter === s
                    ? { background: "var(--color-accent)", color: "#fff" }
                    : { background: "var(--color-bg-tertiary)", color: "var(--color-text-secondary)", border: "1px solid var(--color-border-primary)" }
                }
              >
                {s === "All" ? "All Status" : s.replace("_", " ")}
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
                  <th>ID</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Assignee</th>
                  <th>SLA</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8" style={{ color: "var(--color-text-muted)" }}>
                      <div className="skeleton-loader w-full h-8 rounded" />
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8" style={{ color: "var(--color-text-muted)" }}>
                      No complaints found
                    </td>
                  </tr>
                ) : (
                  filtered.map((c: any) => (
                    <tr key={c.id}>
                      <td>
                        <span className="text-xs font-mono" style={{ color: "var(--color-text-secondary)" }}>{c.id}</span>
                      </td>
                      <td>
                        <p className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>{c.title}</p>
                      </td>
                      <td>
                        <span className="text-sm" style={{ color: "var(--color-text-secondary)" }}>{c.category || "—"}</span>
                      </td>
                      <td>
                        <span className={clsx("badge", STATUS_COLORS[c.status] ?? "badge-gray")}>{c.status?.replace("_", " ") || "—"}</span>
                      </td>
                      <td>
                        {c.priority ? <span className={clsx("badge", PRIORITY_COLORS[c.priority] ?? "badge-gray")}>{c.priority}</span> : <span style={{ color: "var(--color-text-muted)" }}>—</span>}
                      </td>
                      <td>
                        <span className="text-sm" style={{ color: "var(--color-text-secondary)" }}>{c.assignee || "Unassigned"}</span>
                      </td>
                      <td>
                        <span className={clsx("badge", c.sla_breached ? "badge-red" : "badge-green")}>{c.sla_breached ? "Breached" : "On Track"}</span>
                      </td>
                      <td>
                        <button className="flex items-center gap-1 text-xs px-2 py-1 rounded transition-colors" style={{ color: "var(--color-accent)", border: "1px solid var(--color-accent)/30" }}>
                          <Eye className="w-3 h-3" />
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t flex items-center justify-between text-xs" style={{ borderColor: "var(--color-border-primary)", color: "var(--color-text-muted)" }}>
            <span>Showing {filtered.length} complaints</span>
            <div className="flex items-center gap-2">
              <button className="px-2 py-1 rounded hover:opacity-80" style={{ border: "1px solid var(--color-border-primary)" }}>
                Previous
              </button>
              <button className="px-2 py-1 rounded hover:opacity-80" style={{ border: "1px solid var(--color-border-primary)" }}>
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div
            className="rounded-xl p-6 w-full max-w-md space-y-4 shadow-2xl"
            style={{ background: "var(--color-bg-secondary)", border: "1px solid var(--color-border-primary)" }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold" style={{ color: "var(--color-text-primary)" }}>New Complaint</h2>
              <button onClick={() => setShowModal(false)} className="p-1 rounded hover:opacity-70" style={{ color: "var(--color-text-muted)" }}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                required
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                placeholder="Title"
                className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none transition-colors"
                style={{ background: "var(--color-bg-tertiary)", border: "1px solid var(--color-border-primary)", color: "var(--color-text-primary)" }}
              />
              <textarea
                required
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder="Description"
                rows={4}
                className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none transition-colors"
                style={{ background: "var(--color-bg-tertiary)", border: "1px solid var(--color-border-primary)", color: "var(--color-text-primary)" }}
              />
              <input
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
                placeholder="Category"
                className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none transition-colors"
                style={{ background: "var(--color-bg-tertiary)", border: "1px solid var(--color-border-primary)", color: "var(--color-text-primary)" }}
              />
              <select
                value={form.priority}
                onChange={e => setForm({ ...form, priority: e.target.value })}
                className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none transition-colors"
                style={{ background: "var(--color-bg-tertiary)", border: "1px solid var(--color-border-primary)", color: "var(--color-text-primary)" }}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
              <input
                value={form.assignee}
                onChange={e => setForm({ ...form, assignee: e.target.value })}
                placeholder="Assign To"
                className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none transition-colors"
                style={{ background: "var(--color-bg-tertiary)", border: "1px solid var(--color-border-primary)", color: "var(--color-text-primary)" }}
              />
              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg text-sm transition-colors"
                  style={{ border: "1px solid var(--color-border-primary)", color: "var(--color-text-muted)" }}
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 rounded-lg text-sm font-medium" style={{ background: "var(--color-accent)", color: "#fff" }}>
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
