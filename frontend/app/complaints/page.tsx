'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const STATUS_COLORS: Record<string, string> = {
  open: 'bg-blue-500/20 text-blue-400',
  in_progress: 'bg-yellow-500/20 text-yellow-400',
  resolved: 'bg-green-500/20 text-green-400',
  closed: 'bg-gray-500/20 text-gray-400',
  escalated: 'bg-red-500/20 text-red-400',
};

const PRIORITY_COLORS: Record<string, string> = {
  low: 'bg-green-500/20 text-green-400',
  medium: 'bg-yellow-500/20 text-yellow-400',
  high: 'bg-orange-500/20 text-orange-400',
  critical: 'bg-red-500/20 text-red-400',
};

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', priority: 'medium', category: '', assignee: '' });

  useEffect(() => { fetchComplaints(); }, [page, search, statusFilter, priorityFilter]);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '10', ...(search && { search }), ...(statusFilter && { status: statusFilter }), ...(priorityFilter && { priority: priorityFilter }) });
      const res = await fetch(`/api/complaints?${params}`);
      const data = await res.json();
      setComplaints(data.complaints || []);
    } catch { setComplaints([]); } finally { setLoading(false); }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await fetch('/api/complaints', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setShowModal(false);
    setForm({ title: '', description: '', priority: 'medium', category: '', assignee: '' });
    fetchComplaints();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Complaints</h1>
          <p className="text-[#8b949e] text-sm mt-1">Manage and track all customer complaints</p>
        </div>
        <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-[#2188ff] text-white rounded-lg hover:bg-blue-600 text-sm font-medium">+ New Complaint</button>
      </div>
      <div className="bg-[#161b22] rounded-xl border border-[#30363d] p-4">
        <div className="flex gap-3 flex-wrap">
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search complaints..." className="flex-1 min-w-48 px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-white text-sm placeholder:text-[#8b949e] focus:outline-none focus:border-[#2188ff]" />
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-white text-sm focus:outline-none">
            <option value="">All Status</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="escalated">Escalated</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
          <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)} className="px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-white text-sm focus:outline-none">
            <option value="">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>
      </div>
      <div className="bg-[#161b22] rounded-xl border border-[#30363d] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#1c2128] border-b border-[#30363d]">
            <tr>
              {['ID','Title','Category','Status','Priority','Assignee','SLA','Actions'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-[#8b949e] font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#21262d]">
            {loading ? (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-[#8b949e]">Loading...</td></tr>
            ) : complaints.length === 0 ? (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-[#8b949e]">No complaints found</td></tr>
            ) : complaints.map((c: any) => (
              <tr key={c.id} className="hover:bg-[#1c2128] transition-colors">
                <td className="px-4 py-3 text-[#2188ff] font-mono">{c.id}</td>
                <td className="px-4 py-3 text-white font-medium">{c.title}</td>
                <td className="px-4 py-3 text-[#8b949e]">{c.category}</td>
                <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full ${STATUS_COLORS[c.status] || ''}`}>{c.status}</span></td>
                <td className="px-4 py-3">{c.priority ? <span className={`text-xs px-2 py-1 rounded-full ${PRIORITY_COLORS[c.priority] || ''}`}>{c.priority}</span> : '-'}</td>
                <td className="px-4 py-3 text-[#8b949e]">{c.assignee}</td>
                <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full ${c.sla_breached ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>{c.sla_breached ? 'Breached' : 'OK'}</span></td>
                <td className="px-4 py-3"><button className="text-xs text-[#2188ff] hover:text-blue-300">View</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-4 py-3 text-sm text-[#8b949e] border-t border-[#30363d]">Showing {complaints.length} complaints</div>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#161b22] rounded-xl border border-[#30363d] p-6 w-full max-w-lg">
            <h2 className="text-lg font-bold text-white mb-4">New Complaint</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input required value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Title" className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-white text-sm focus:outline-none focus:border-[#2188ff]" />
              <textarea required value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Description" rows={4} className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-white text-sm focus:outline-none focus:border-[#2188ff]" />
              <input value={form.category} onChange={e => setForm({...form, category: e.target.value})} placeholder="Category" className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-white text-sm focus:outline-none focus:border-[#2188ff]" />
              <select value={form.priority} onChange={e => setForm({...form, priority: e.target.value})} className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-white text-sm focus:outline-none">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
              <input value={form.assignee} onChange={e => setForm({...form, assignee: e.target.value})} placeholder="Assign To" className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-white text-sm focus:outline-none focus:border-[#2188ff]" />
              <div className="flex gap-3 justify-end">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border border-[#30363d] text-[#8b949e] rounded-lg text-sm hover:bg-[#1c2128]">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-[#2188ff] text-white rounded-lg text-sm hover:bg-blue-600">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
