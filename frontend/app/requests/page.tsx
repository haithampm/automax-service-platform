'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { CheckCircle2, Clock, Download, Eye, FileText, Play, Plus, RefreshCw, Search } from 'lucide-react';
import { priorityColor, RequestRecord, seedRequests, statusColor } from '../../lib/imsData';
import { useLocalStorageState } from '../../lib/useLocalStorage';

type StatCard = {
  label: string;
  value: number;
  Icon: LucideIcon;
  color: string;
};

export default function RequestsPage() {
  const [requests, setRequests, resetRequests] = useLocalStorageState<RequestRecord[]>('synergi.requests', seedRequests);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [activeId, setActiveId] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [message, setMessage] = useState('');

  const filtered = useMemo(() => requests.filter(request => {
    const body = `${request.number} ${request.title} ${request.description} ${request.assignee} ${request.classification} ${request.sourceIncidents.join(' ')}`.toLowerCase();
    return body.includes(search.toLowerCase()) && (statusFilter === 'All' || request.status === statusFilter);
  }), [requests, search, statusFilter]);

  const activeRequest = requests.find(request => request.id === activeId) ?? null;
  const stats = {
    total: requests.length,
    new: requests.filter(r => r.status === 'New').length,
    progress: requests.filter(r => r.status === 'In Progress').length,
    closed: requests.filter(r => r.status === 'Close' || r.status === 'Completed').length,
  };

  const statCards: StatCard[] = [
    { label: 'Total Requests', value: stats.total, Icon: FileText, color: 'text-blue-400' },
    { label: 'New', value: stats.new, Icon: Plus, color: 'text-blue-400' },
    { label: 'In Progress', value: stats.progress, Icon: Clock, color: 'text-yellow-400' },
    { label: 'Closed', value: stats.closed, Icon: CheckCircle2, color: 'text-green-400' },
  ];

  const processRequest = (id: string, status: RequestRecord['status']) => {
    setRequests(prev => prev.map(request => request.id === id ? {
      ...request,
      status,
      audit: [{ id: `rq-${Date.now()}`, action: `Moved to ${status}`, user: 'Request Processor', timestamp: new Date().toISOString(), notes: note }, ...request.audit],
    } : request));
    setMessage(`Request moved to ${status}.`);
    setNote('');
    setActiveId(null);
  };

  const exportCsv = () => {
    const header = ['Number','Title','Status','Priority','Assignee','Classification','Source Incidents'];
    const rows = filtered.map(r => [r.number, r.title, r.status, r.priority, r.assignee, r.classification, r.sourceIncidents.join('; ')]);
    const csv = [header, ...rows].map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'synergi-requests.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#0d1117]">
      <div className="border-b border-[#30363d] px-6 py-3 flex items-center gap-2 text-sm text-[#8b949e]"><Link href="/dashboard" className="hover:text-white">Dashboard</Link><span>/</span><span className="text-white">Requests</span></div>
      <div className="p-6 space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center"><FileText className="w-5 h-5 text-blue-400" /></div><div><h1 className="text-2xl font-bold">Request Management</h1><p className="text-sm text-[#8b949e]">View requests, trace source incidents, and process requests through closure.</p></div></div>
          <div className="flex gap-2"><button onClick={resetRequests} className="btn-secondary"><RefreshCw size={14}/> Reset</button><button onClick={exportCsv} className="btn-secondary"><Download size={14}/> Export</button><button className="btn-primary"><Plus size={14}/> Create Request</button></div>
        </div>
        {message && <div className="rounded-lg border border-[#6e40c9]/30 bg-[#6e40c9]/10 px-4 py-3 text-sm">{message}</div>}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map(({ label, value, Icon, color }) => (
            <div key={label} className="card">
              <Icon className={`w-5 h-5 ${color}`} />
              <div className={`mt-2 text-2xl font-bold ${color}`}>{value}</div>
              <div className="text-sm text-[#8b949e]">{label}</div>
            </div>
          ))}
        </div>
        <div className="card space-y-4">
          <div className="flex gap-3 flex-wrap"><div className="relative flex-1 min-w-[240px]"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6e7681]" size={16}/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search requests or source incident..." className="w-full pl-9 pr-4 py-2 bg-[#161b22] border border-[#30363d] rounded-lg text-sm text-white" /></div><select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-2 bg-[#161b22] border border-[#30363d] rounded-lg text-white"><option>All</option><option>New</option><option>In Progress</option><option>Close</option><option>Completed</option></select></div>
          <div className="overflow-x-auto rounded-xl border border-[#30363d]"><table className="w-full table-synergi"><thead><tr><th>Request</th><th>Source Incident</th><th>Status</th><th>Priority</th><th>Assignee</th><th>Classification</th><th>Actions</th></tr></thead><tbody>{filtered.map(request => <tr key={request.id}><td><div className="text-[#58a6ff] font-medium text-sm">{request.number}</div><div className="text-white text-sm">{request.title}</div><div className="text-xs text-[#6e7681]">{request.description}</div></td><td>{request.sourceIncidents.length ? request.sourceIncidents.map(src => <div key={src} className="text-xs text-[#a78bfa]">{src}</div>) : <span className="text-[#6e7681]">—</span>}</td><td><span className={`badge ${statusColor(request.status)}`}>{request.status}</span></td><td><span className={`badge ${priorityColor(request.priority)}`}>{request.priority}</span></td><td className="text-sm text-[#8b949e]">{request.assignee}</td><td className="text-sm text-[#8b949e]">{request.classification}</td><td><button onClick={() => setActiveId(request.id)} className="text-xs text-[#a78bfa] hover:text-white"><Eye size={14}/> View / Process</button></td></tr>)}</tbody></table></div>
          <div className="text-sm text-[#8b949e]">Showing {filtered.length} of {requests.length} requests.</div>
        </div>
      </div>
      {activeRequest && <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"><div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6 w-full max-w-2xl space-y-4"><div><h2 className="text-lg font-bold">{activeRequest.number}</h2><p className="text-sm text-[#8b949e]">{activeRequest.title}</p></div><div className="grid grid-cols-2 gap-3 text-sm"><div className="card"><strong>Status</strong><div>{activeRequest.status}</div></div><div className="card"><strong>Source Incidents</strong><div>{activeRequest.sourceIncidents.join(', ') || 'None'}</div></div></div><textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Processing note / closure reply" className="textarea w-full" /><div className="card"><h3 className="font-semibold mb-2">Audit</h3>{activeRequest.audit.map(a => <div key={a.id} className="text-xs text-[#8b949e] border-b border-[#30363d] py-2 last:border-0">{a.action} • {a.user} • {new Date(a.timestamp).toLocaleString()} {a.notes ? `• ${a.notes}` : ''}</div>)}</div><div className="flex justify-end gap-3"><button onClick={() => setActiveId(null)} className="btn-secondary">Close</button><button onClick={() => processRequest(activeRequest.id, 'In Progress')} className="btn-secondary"><Play size={14}/> In Progress</button><button onClick={() => processRequest(activeRequest.id, 'Close')} className="btn-primary">Close Request</button></div></div></div>}
    </div>
  );
}
