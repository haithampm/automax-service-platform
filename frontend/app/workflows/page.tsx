'use client';
import { useState, useEffect } from 'react';

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', type: 'incident', trigger: 'manual', steps: '' });

  useEffect(() => { fetchWorkflows(); }, []);

  const fetchWorkflows = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/workflows');
      const data = await res.json();
      setWorkflows(data.workflows || []);
    } catch { setWorkflows([]); } finally { setLoading(false); }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await fetch('/api/workflows', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setShowModal(false);
    fetchWorkflows();
  };

  const toggleStatus = async (id: string, active: boolean) => {
    await fetch(`/api/workflows/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ active: !active }) });
    fetchWorkflows();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Workflows</h1>
          <p className="text-[#8b949e] text-sm mt-1">Automate routing, escalation and assignment rules</p>
        </div>
        <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-[#2188ff] text-white rounded-lg hover:bg-blue-600 text-sm font-medium">+ New Workflow</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[{label:'Active',color:'text-green-400',key:'active'},{label:'Inactive',color:'text-gray-400',key:'inactive'},{label:'Total',color:'text-blue-400',key:'total'}].map(s => (
          <div key={s.key} className="bg-[#161b22] rounded-xl border border-[#30363d] p-5">
            <div className="text-[#8b949e] text-sm">{s.label} Workflows</div>
            <div className={`text-3xl font-bold mt-1 ${s.color}`}>
              {s.key === 'active' ? workflows.filter(w=>w.active).length : s.key === 'inactive' ? workflows.filter(w=>!w.active).length : workflows.length}
            </div>
          </div>
        ))}
      </div>
      <div className="space-y-3">
        {loading ? (
          <div className="bg-[#161b22] rounded-xl border border-[#30363d] p-8 text-center text-[#8b949e]">Loading...</div>
        ) : workflows.length === 0 ? (
          <div className="bg-[#161b22] rounded-xl border border-[#30363d] p-8 text-center text-[#8b949e]">
            <div className="text-4xl mb-3">⚙️</div>
            <div className="text-white font-medium">No workflows yet</div>
            <div className="text-sm mt-1">Create automation rules to streamline your operations</div>
          </div>
        ) : workflows.map((w: any) => (
          <div key={w.id} className="bg-[#161b22] rounded-xl border border-[#30363d] p-5">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-white font-semibold">{w.name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${w.active ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>{w.active ? 'Active' : 'Inactive'}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400">{w.type}</span>
                </div>
                <p className="text-[#8b949e] text-sm mt-1">{w.description}</p>
                <div className="flex gap-4 mt-3 text-xs text-[#8b949e]">
                  <span>Trigger: <span className="text-white">{w.trigger}</span></span>
                  <span>Steps: <span className="text-white">{w.steps_count || 0}</span></span>
                  <span>Runs: <span className="text-white">{w.run_count || 0}</span></span>
                </div>
              </div>
              <div className="flex gap-2 ml-4">
                <button onClick={() => toggleStatus(w.id, w.active)} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${w.active ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'}`}>
                  {w.active ? 'Deactivate' : 'Activate'}
                </button>
                <button className="px-3 py-1.5 bg-[#1c2128] border border-[#30363d] text-[#8b949e] rounded-lg text-xs hover:text-white">Edit</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#161b22] rounded-xl border border-[#30363d] p-6 w-full max-w-lg">
            <h2 className="text-lg font-bold text-white mb-4">New Workflow</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Workflow name" className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-white text-sm focus:outline-none focus:border-[#2188ff]" />
              <textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Description" rows={3} className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-white text-sm focus:outline-none focus:border-[#2188ff]" />
              <div className="grid grid-cols-2 gap-3">
                <select value={form.type} onChange={e=>setForm({...form,type:e.target.value})} className="px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-white text-sm focus:outline-none">
                  <option value="incident">Incident</option>
                  <option value="request">Request</option>
                  <option value="complaint">Complaint</option>
                </select>
                <select value={form.trigger} onChange={e=>setForm({...form,trigger:e.target.value})} className="px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-white text-sm focus:outline-none">
                  <option value="manual">Manual</option>
                  <option value="auto">Automatic</option>
                  <option value="scheduled">Scheduled</option>
                </select>
              </div>
              <div className="flex gap-3 justify-end">
                <button type="button" onClick={()=>setShowModal(false)} className="px-4 py-2 border border-[#30363d] text-[#8b949e] rounded-lg text-sm">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-[#2188ff] text-white rounded-lg text-sm">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
