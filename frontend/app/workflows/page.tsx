"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Workflow, Plus, RefreshCw, Zap, CheckCircle2, Clock, PlayCircle, Edit, Power, X } from "lucide-react";
import { clsx } from "clsx";

const stats = [
  { label: "Total Workflows", value: "12", change: "+2", trend: "up", color: "text-[--color-accent]", bg: "bg-[--color-accent]/10", border: "border-[--color-accent]/20", icon: Workflow },
  { label: "Active", value: "8", change: "+1", trend: "up", color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20", icon: CheckCircle2 },
  { label: "Inactive", value: "4", change: "0", trend: "neutral", color: "text-gray-400", bg: "bg-gray-500/10", border: "border-gray-500/20", icon: Clock },
  { label: "Total Runs", value: "1,245", change: "+128", trend: "up", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", icon: PlayCircle },
];

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", type: "incident", trigger: "manual", steps: "" });

  useEffect(() => {
    fetchWorkflows();
  }, []);

  const fetchWorkflows = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/workflows");
      const data = await res.json();
      setWorkflows(data.workflows || []);
    } catch {
      setWorkflows([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await fetch("/api/workflows", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setShowModal(false);
    fetchWorkflows();
  };

  const toggleStatus = async (id: string, active: boolean) => {
    await fetch(`/api/workflows/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !active }),
    });
    fetchWorkflows();
  };

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
        <span style={{ color: "var(--color-text-primary)" }}>Workflows</span>
      </div>

      <div className="p-6 space-y-6">
        {/* Page Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ background: "var(--color-accent)/15", border: "1px solid var(--color-accent)/25" }}>
              <Workflow className="w-6 h-6" style={{ color: "var(--color-accent)" }} />
            </div>
            <div>
              <h1 className="text-2xl font-bold" style={{ color: "var(--color-text-primary)" }}>Workflows</h1>
              <p className="text-sm mt-0.5" style={{ color: "var(--color-text-muted)" }}>Automate routing, escalation and assignment rules</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchWorkflows()}
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
              New Workflow
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

        {/* Workflows List */}
        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-12" style={{ color: "var(--color-text-muted)" }}>
              <div className="skeleton-loader w-full h-24 rounded-xl" />
            </div>
          ) : workflows.length === 0 ? (
            <div className="text-center py-12 rounded-xl" style={{ border: "1px solid var(--color-border-primary)", background: "var(--color-bg-secondary)" }}>
              <Zap className="w-12 h-12 mx-auto mb-3" style={{ color: "var(--color-text-muted)" }} />
              <h3 className="text-lg font-semibold mb-1" style={{ color: "var(--color-text-primary)" }}>No workflows yet</h3>
              <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>Create automation rules to streamline your operations</p>
            </div>
          ) : (
            workflows.map((w: any) => (
              <div
                key={w.id}
                className="rounded-xl p-4"
                style={{ border: "1px solid var(--color-border-primary)", background: "var(--color-bg-secondary)" }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold" style={{ color: "var(--color-text-primary)" }}>{w.name}</h3>
                      <span className={clsx("badge", w.active ? "badge-green" : "badge-gray")}>
                        {w.active ? "Active" : "Inactive"}
                      </span>
                      <span className="badge badge-blue capitalize">{w.type}</span>
                    </div>
                    <p className="text-sm mb-3" style={{ color: "var(--color-text-muted)" }}>{w.description}</p>
                    <div className="flex items-center gap-4 text-xs" style={{ color: "var(--color-text-secondary)" }}>
                      <span className="flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        Trigger: <strong>{w.trigger}</strong>
                      </span>
                      <span className="flex items-center gap-1">
                        Steps: <strong>{w.steps_count || 0}</strong>
                      </span>
                      <span className="flex items-center gap-1">
                        Runs: <strong>{w.run_count || 0}</strong>
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleStatus(w.id, w.active)}
                      className={clsx("flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors", w.active ? "hover:opacity-80" : "hover:opacity-80")}
                      style={
                        w.active
                          ? { background: "var(--color-bg-tertiary)", color: "var(--color-text-muted)", border: "1px solid var(--color-border-primary)" }
                          : { background: "var(--color-accent)/10", color: "var(--color-accent)", border: "1px solid var(--color-accent)/30" }
                      }
                    >
                      <Power className="w-3 h-3" />
                      {w.active ? "Deactivate" : "Activate"}
                    </button>
                    <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors" style={{ color: "var(--color-accent)", border: "1px solid var(--color-accent)/30" }}>
                      <Edit className="w-3 h-3" />
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
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
              <h2 className="text-xl font-bold" style={{ color: "var(--color-text-primary)" }}>New Workflow</h2>
              <button onClick={() => setShowModal(false)} className="p-1 rounded hover:opacity-70" style={{ color: "var(--color-text-muted)" }}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                required
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="Workflow name"
                className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none transition-colors"
                style={{ background: "var(--color-bg-tertiary)", border: "1px solid var(--color-border-primary)", color: "var(--color-text-primary)" }}
              />
              <textarea
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder="Description"
                rows={3}
                className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none transition-colors"
                style={{ background: "var(--color-bg-tertiary)", border: "1px solid var(--color-border-primary)", color: "var(--color-text-primary)" }}
              />
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={form.type}
                  onChange={e => setForm({ ...form, type: e.target.value })}
                  className="px-3 py-2 rounded-lg text-sm focus:outline-none transition-colors"
                  style={{ background: "var(--color-bg-tertiary)", border: "1px solid var(--color-border-primary)", color: "var(--color-text-primary)" }}
                >
                  <option value="incident">Incident</option>
                  <option value="request">Request</option>
                  <option value="complaint">Complaint</option>
                </select>
                <select
                  value={form.trigger}
                  onChange={e => setForm({ ...form, trigger: e.target.value })}
                  className="px-3 py-2 rounded-lg text-sm focus:outline-none transition-colors"
                  style={{ background: "var(--color-bg-tertiary)", border: "1px solid var(--color-border-primary)", color: "var(--color-text-primary)" }}
                >
                  <option value="manual">Manual</option>
                  <option value="auto">Automatic</option>
                  <option value="scheduled">Scheduled</option>
                </select>
              </div>
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
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
