'use client';
import { useState, useEffect } from 'react';

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', role: 'agent', department: '', status: 'active' });

  useEffect(() => { fetchUsers(); }, [search]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users?search=${search}`);
      const data = await res.json();
      setUsers(data.users || []);
    } catch { setUsers([]); } finally { setLoading(false); }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await fetch('/api/admin/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setShowModal(false);
    setForm({ name: '', email: '', role: 'agent', department: '', status: 'active' });
    fetchUsers();
  };

  const toggleStatus = async (id: string, status: string) => {
    const newStatus = status === 'active' ? 'inactive' : 'active';
    await fetch(`/api/admin/users/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: newStatus }) });
    fetchUsers();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Users</h1>
          <p className="text-[#8b949e] text-sm mt-1">Manage system users and their access</p>
        </div>
        <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-[#2188ff] text-white rounded-lg hover:bg-blue-600 text-sm font-medium">+ Add User</button>
      </div>
      <div className="bg-[#161b22] rounded-xl border border-[#30363d] p-4">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users by name or email..." className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-white text-sm placeholder:text-[#8b949e] focus:outline-none focus:border-[#2188ff]" />
      </div>
      <div className="bg-[#161b22] rounded-xl border border-[#30363d] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#1c2128] border-b border-[#30363d]">
            <tr>
              {['Name','Email','Role','Department','Status','Last Login','Actions'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-[#8b949e] font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#21262d]">
            {loading ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-[#8b949e]">Loading...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-[#8b949e]">No users found</td></tr>
            ) : users.map((u: any) => (
              <tr key={u.id} className="hover:bg-[#1c2128] transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#2188ff]/20 flex items-center justify-center text-[#2188ff] font-semibold text-xs">{u.name?.charAt(0)?.toUpperCase()}</div>
                    <span className="text-white font-medium">{u.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-[#8b949e]">{u.email}</td>
                <td className="px-4 py-3"><span className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-400">{u.role}</span></td>
                <td className="px-4 py-3 text-[#8b949e]">{u.department}</td>
                <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full ${u.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>{u.status}</span></td>
                <td className="px-4 py-3 text-[#8b949e] text-xs">{u.last_login ? new Date(u.last_login).toLocaleDateString() : 'Never'}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => toggleStatus(u.id, u.status)} className="text-xs text-[#8b949e] hover:text-white">{u.status === 'active' ? 'Deactivate' : 'Activate'}</button>
                    <button className="text-xs text-[#2188ff] hover:text-blue-300">Edit</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-4 py-3 text-sm text-[#8b949e] border-t border-[#30363d]">Total: {users.length} users</div>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#161b22] rounded-xl border border-[#30363d] p-6 w-full max-w-lg">
            <h2 className="text-lg font-bold text-white mb-4">Add New User</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Full Name" className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-white text-sm focus:outline-none focus:border-[#2188ff]" />
              <input required type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="Email" className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-white text-sm focus:outline-none focus:border-[#2188ff]" />
              <div className="grid grid-cols-2 gap-3">
                <select value={form.role} onChange={e=>setForm({...form,role:e.target.value})} className="px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-white text-sm focus:outline-none">
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="agent">Agent</option>
                  <option value="viewer">Viewer</option>
                </select>
                <input value={form.department} onChange={e=>setForm({...form,department:e.target.value})} placeholder="Department" className="px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-white text-sm focus:outline-none focus:border-[#2188ff]" />
              </div>
              <div className="flex gap-3 justify-end">
                <button type="button" onClick={()=>setShowModal(false)} className="px-4 py-2 border border-[#30363d] text-[#8b949e] rounded-lg text-sm">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-[#2188ff] text-white rounded-lg text-sm">Add User</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
