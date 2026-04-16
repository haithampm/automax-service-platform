"use client";
import { useState } from "react";
import Link from "next/link";
import { FileText, Plus, RefreshCw, Search, Filter } from "lucide-react";

const MOCK_REQUESTS = [
  { id: "1", number: "REQ-2026-000010", title: "Test BA 4/2- 3", status: "New", priority: "Medium", assignee: "contractor1", sla: "On Track", source: "INC-2026-000145" },
  { id: "2", number: "REQ-2026-000009", title: "bulb - Maharashtra - Kollam", status: "New", priority: "Medium", assignee: "contractor1", sla: "On Track", source: "INC-2026-000144" },
  { id: "3", number: "REQ-2026-000008", title: "bulb - Maharashtra - Jamshedpur", status: "New", priority: null, assignee: "agent1", sla: "On Track", source: "INC-2026-000143" },
  { id: "4", number: "REQ-2026-000007", title: "bulb - Maharashtra - Jamshedpur", status: "New", priority: "High", assignee: "Supervisor", sla: "On Track", source: "INC-2026-000142" },
  { id: "5", number: "REQ-2026-000006", title: "Testing request 9/2", status: "Close", priority: null, assignee: "agent1", sla: "On Track", source: null },
  { id: "6", number: "REQ-2026-000002", title: "Test Request", status: "In Progress", priority: null, assignee: "contractor1", sla: "On Track", source: "INC-2026-000141" },
];

const STATUS_COLORS: Record<string, string> = {
  New: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
  "In Progress": "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
  Close: "bg-gray-500/20 text-gray-400 border border-gray-500/30",
  Completed: "bg-green-500/20 text-green-400 border border-green-500/30",
};

export default function RequestsPage() {
  const [search, setSearch] = useState("");
  const filtered = MOCK_REQUESTS.filter(r =>
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    r.number.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0d1117]">
      <div className="border-b border-[#30363d] px-6 py-3 flex items-center gap-6 text-sm text-[#8b949e]">
        <Link href="/requests" className="text-white font-medium">Requests</Link>
        <span>/</span><span>Management</span>
        <div className="ml-auto"><Link href="/dashboard" className="hover:text-white">Back to Home</Link></div>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
              <FileText size={20} className="text-green-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Requests</h1>
              <p className="text-[#8b949e] text-sm">Track and manage service requests</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-3 py-2 bg-[#1c2333] border border-[#30363d] rounded-lg text-sm text-white hover:bg-[#21262d]">
              <RefreshCw size={14} /> Refresh
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#6e40c9] rounded-lg text-sm text-white font-medium hover:bg-purple-700">
              <Plus size={14} /> Create Request
            </button>
          </div>
        </div>

        <div className="flex gap-3 mb-4">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6e7681]" />
            <input type="text" placeholder="Search by title or request number..." value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#161b22] border border-[#30363d] rounded-lg text-sm text-white placeholder:text-[#6e7681] focus:outline-none focus:border-[#6e40c9]"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 bg-[#1c2333] border border-[#30363d] rounded-lg text-sm text-white">
            <Filter size={14} /> Filters
          </button>
        </div>

        <div className="bg-[#1c2333] border border-[#30363d] rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#30363d]">
                {["Request", "Source Incident", "State", "Priority", "Assignee", "SLA", "Actions"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-medium text-[#8b949e] uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(req => (
                <tr key={req.id} className="border-b border-[#30363d] hover:bg-[#21262d] transition-colors">
                  <td className="px-4 py-3">
                    <div className="text-[#2188ff] text-sm font-medium">{req.number}</div>
                    <div className="text-white text-sm">{req.title}</div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {req.source ? <span className="text-[#2188ff] hover:underline cursor-pointer">{req.source}</span> : <span className="text-[#6e7681]">-</span>}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${STATUS_COLORS[req.status] || ""}`}>{req.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    {req.priority ? <span className="text-xs px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-400">{req.priority}</span> : <span className="text-[#6e7681]">-</span>}
                  </td>
                  <td className="px-4 py-3 text-sm text-[#8b949e]">{req.assignee}</td>
                  <td className="px-4 py-3"><span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400">{req.sla}</span></td>
                  <td className="px-4 py-3"><button className="text-xs text-[#2188ff] hover:text-blue-300">View</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-4 py-3 text-sm text-[#8b949e] border-t border-[#30363d]">Showing 1 to {filtered.length} of 10 requests</div>
        </div>
      </div>
    </div>
  );
}
