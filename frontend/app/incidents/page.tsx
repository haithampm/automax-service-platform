"use client";
import { useState } from "react";
import Link from "next/link";
import { AlertTriangle, Plus, RefreshCw, Search, Filter, Map } from "lucide-react";

const MOCK_INCIDENTS = [
  { id: "1", number: "INC-2026-000145", title: "Incident - Ministry at Ain Dar", status: "New Incident", priority: null, assignee: null, sla: "On Track" },
  { id: "2", number: "INC-2026-000144", title: "Incident - Ministry at Ain Dar", status: "New Incident", priority: null, assignee: null, sla: "On Track" },
  { id: "3", number: "INC-2026-000143", title: "Animal and insect - Maharashtra - Pettah", status: "New Incident", priority: "Critical", assignee: null, sla: "Breached" },
  { id: "4", number: "INC-2026-000142", title: "Incident - Ministry at India", status: "Under Resolution", priority: "High", assignee: "Ali Hassan", sla: "On Track" },
  { id: "5", number: "INC-2026-000141", title: "Incident - Ministry at India", status: "Ready to Close", priority: "Medium", assignee: "contractor1", sla: "On Track" },
  { id: "6", number: "INC-2026-000140", title: "Incident - Ministry at Ain Dar", status: "Closed", priority: null, assignee: "Ali Hassan", sla: "On Track" },
];

const STATUS_COLORS: Record<string, string> = {
  "New Incident": "bg-blue-500/20 text-blue-400 border border-blue-500/30",
  "Under Resolution": "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
  "Ready to Close": "bg-green-500/20 text-green-400 border border-green-500/30",
  "Closed": "bg-gray-500/20 text-gray-400 border border-gray-500/30",
  "Rejected": "bg-red-500/20 text-red-400 border border-red-500/30",
};

const PRIORITY_COLORS: Record<string, string> = {
  Critical: "bg-red-500/20 text-red-400",
  High: "bg-orange-500/20 text-orange-400",
  Medium: "bg-yellow-500/20 text-yellow-400",
  Low: "bg-blue-500/20 text-blue-400",
};

export default function IncidentsPage() {
  const [search, setSearch] = useState("");
  const filtered = MOCK_INCIDENTS.filter(i =>
    i.title.toLowerCase().includes(search.toLowerCase()) ||
    i.number.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0d1117]">
      {/* Topbar */}
      <div className="border-b border-[#30363d] px-6 py-3 flex items-center gap-6 text-sm text-[#8b949e]">
        <Link href="/incidents" className="text-white font-medium">Incidents</Link>
        <span>/</span>
        <span>Management</span>
        <div className="ml-auto">
          <Link href="/dashboard" className="hover:text-white transition-colors">Back to Home</Link>
        </div>
      </div>

      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <AlertTriangle size={20} className="text-blue-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Incidents</h1>
              <p className="text-[#8b949e] text-sm">Track and manage incident reports</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-3 py-2 bg-[#1c2333] border border-[#30363d] rounded-lg text-sm text-white hover:bg-[#21262d] transition-colors">
              <Map size={14} /> Show Map
            </button>
            <button className="flex items-center gap-2 px-3 py-2 bg-[#1c2333] border border-[#30363d] rounded-lg text-sm text-white hover:bg-[#21262d] transition-colors">
              <RefreshCw size={14} /> Refresh
            </button>
            <Link href="/incidents/new" className="flex items-center gap-2 px-4 py-2 bg-[#6e40c9] rounded-lg text-sm text-white font-medium hover:bg-purple-700 transition-colors">
              <Plus size={14} /> Create Incident
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { label: "Total", value: 115, color: "text-blue-400", icon: "△" },
            { label: "Initial", value: 68, color: "text-yellow-400", icon: "!" },
            { label: "In Progress", value: 15, color: "text-blue-400", icon: "○" },
            { label: "SLA Breached", value: 5, color: "text-red-400", icon: "△" },
          ].map(s => (
            <div key={s.label} className="bg-[#1c2333] border border-[#30363d] rounded-xl p-4">
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-[#8b949e] text-sm">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="flex gap-3 mb-4">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6e7681]" />
            <input
              type="text"
              placeholder="Search by title or incident number..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#161b22] border border-[#30363d] rounded-lg text-sm text-white placeholder:text-[#6e7681] focus:outline-none focus:border-[#6e40c9]"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 bg-[#1c2333] border border-[#30363d] rounded-lg text-sm text-white hover:bg-[#21262d]">
            <Filter size={14} /> Filters
          </button>
        </div>

        {/* Table */}
        <div className="bg-[#1c2333] border border-[#30363d] rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#30363d]">
                <th className="text-left px-4 py-3 text-xs font-medium text-[#8b949e] uppercase"><input type="checkbox" /></th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[#8b949e] uppercase">Incidents</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[#8b949e] uppercase">State</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[#8b949e] uppercase">Priority</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[#8b949e] uppercase">Assignee</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[#8b949e] uppercase">SLA</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[#8b949e] uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((inc, idx) => (
                <tr key={inc.id} className={`border-b border-[#30363d] hover:bg-[#21262d] transition-colors ${idx % 2 === 0 ? "" : "bg-[#1c2333]/50"}`}>
                  <td className="px-4 py-3"><input type="checkbox" /></td>
                  <td className="px-4 py-3">
                    <div className="text-[#2188ff] text-sm font-medium hover:underline cursor-pointer">{inc.number}</div>
                    <div className="text-white text-sm">{inc.title}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${STATUS_COLORS[inc.status] || "bg-gray-500/20 text-gray-400"}`}>{inc.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    {inc.priority ? (
                      <span className={`text-xs px-2 py-1 rounded-full ${PRIORITY_COLORS[inc.priority] || ""}`}>{inc.priority}</span>
                    ) : <span className="text-[#6e7681]">-</span>}
                  </td>
                  <td className="px-4 py-3 text-sm text-[#8b949e]">{inc.assignee || "Unassigned"}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${inc.sla === "Breached" ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400"}`}>{inc.sla}</span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-xs text-[#2188ff] hover:text-blue-300 transition-colors">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-4 py-3 text-sm text-[#8b949e] border-t border-[#30363d]">
            Showing 1 to {filtered.length} of 145 incidents
          </div>
        </div>
      </div>
    </div>
  );
}
