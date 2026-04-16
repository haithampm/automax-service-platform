'use client';
import { useState, useEffect } from 'react';

export default function RolesPage() {
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', permissions: [] as string[] });

  const ALL_PERMISSIONS = [
    'incidents.view','incidents.create','incidents.edit','incidents.delete','incidents.assign',
    'requests.view','requests.create','requests.edit','requests.delete',
    'complaints.view','complaints.create','complaints.edit','complaints.delete',
    'workflows.view','workflows.manage',
    'admin.users','admin.roles','admin.settings',
    'reports.view','reports.export',
  ];

  useEffect(() => { fetchRoles(); }, []);

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/roles');
      const data = await res.json();
      setRoles(data.roles || []);
    } catch { setRoles([]); } finally { setLoading(false); }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await fetch('/api/admin/roles', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setShowModal(false);
    fetchRoles();
  };

  const togglePermission = (perm: string) => {
    setForm(f => ({ ...f, permissions: f.permissions.includes(perm) ? f.permissions.filter(p=>p!==perm) : [...f.permissions, perm] }));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Roles & Permissions</h1>
          <p className="text-[#8b949e] text-sm mt-1">Define access control roles and their permissions</p>
        </div>
        <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-[#2188ff] text-white rounded-lg hover:bg-blue-600 text-sm font-medium">+ New Role</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-3 text-center text-[#8b949e] py-8">Loading...</div>
        ) : roles.map((r: any) => (
          <div key={r.id} className="bg-[#161b22] rounded-xl border border-[#30363d] p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-white font-semibold">{r.name}</h3>
                <p className="text-[#8b949e] text-xs mt-0.5">{r.description}</p>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-400">{r.users_count || 0} users</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(r.permissions || []).slice(0,6).map((p: string) => (
                <span key={p} className="text-xs px-2 py-0.5 rounded bg-[#1c2128] text-[#8b949e] border border-[#30363d]">{p}</span>
              ))}
              {(r.permissions || []).length > 6 && (
                <span className="text-xs px-2 py-0.5 rounded bg-[#1c2128] text-[#8b949e]">+{r.permissions.length-6} more</span>
              )}
            </div>
            <div className="flex gap-2 mt-4">
              <button className="text-xs text-[#2188ff] hover:text-blue-300">Edit</button>
              {!r.system && <button className="text-xs text-red-400 hover:text-red-300">Delete</button>}
            </div>
          </div>
        ))}
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#161b22] rounded-xl border border-[#30363d] p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-white mb-4">New Role</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Role name" className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-white text-sm focus:outline-none focus:border-[#2188ff]" />
              <textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Description" rows={2} className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-white text-sm focus:outline-none focus:border-[#2188ff]" />
              <div>
                <p className="text-[#8b949e] text-sm mb-2">Permissions</p>
                <div className="grid grid-cols-2 gap-2">
                  {ALL_PERMISSIONS.map(p => (
                    <label key={p} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={form.permissions.includes(p)} onChange={()=>togglePermission(p)} className="rounded" />
                      <span className="text-xs text-[#8b949e]">{p}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 justify-end">
                <button type="button" onClick={()=>setShowModal(false)} className="px-4 py-2 border border-[#30363d] text-[#8b949e] rounded-lg text-sm">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-[#2188ff] text-white rounded-lg text-sm">Create Role</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
