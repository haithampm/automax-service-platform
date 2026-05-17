'use client';

import { useMemo, useState } from 'react';
import { Building2, Download, MapPin, Plus, Search, Users } from 'lucide-react';
import { classifications, departments, locations } from '../../../lib/imsData';

const initialRows = departments.map((name, index) => ({
  id: String(index + 1),
  name,
  arabicName: `قسم ${index + 1}`,
  type: index >= 4 ? 'External' : 'Internal',
  location: locations[index % locations.length],
  classification: classifications[index % classifications.length],
  defaultRole: ['Admin', 'Agent', 'Citizen', 'Contractor'][index % 4],
  members: 4 + index,
}));

export default function OrganizationPage() {
  const [rows, setRows] = useState(initialRows);
  const [search, setSearch] = useState('');
  const [name, setName] = useState('');
  const filtered = useMemo(() => rows.filter(row => `${row.name} ${row.location} ${row.classification}`.toLowerCase().includes(search.toLowerCase())), [rows, search]);

  const addDepartment = () => {
    if (!name.trim()) return;
    setRows(prev => [{ id: `d-${Date.now()}`, name, arabicName: '', type: 'Internal', location: locations[0], classification: classifications[0], defaultRole: 'Agent', members: 0 }, ...prev]);
    setName('');
  };

  return <div className="p-6 space-y-6 bg-[#0d1117] min-h-screen">
    <div className="flex items-center justify-between gap-4"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center"><Building2 className="text-purple-400" /></div><div><h1 className="text-2xl font-bold">Organization</h1><p className="text-sm text-[#8b949e]">Departments, locations, default roles, classifications, and hierarchy management.</p></div></div><button className="btn-secondary"><Download size={14}/> Export hierarchy</button></div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4"><div className="card"><Users className="text-blue-400"/><div className="text-2xl font-bold mt-2">{rows.length}</div><div className="text-sm text-[#8b949e]">Departments</div></div><div className="card"><MapPin className="text-green-400"/><div className="text-2xl font-bold mt-2">{locations.length}</div><div className="text-sm text-[#8b949e]">Mapped Locations</div></div><div className="card"><Building2 className="text-yellow-400"/><div className="text-2xl font-bold mt-2">{rows.filter(r => r.type === 'External').length}</div><div className="text-sm text-[#8b949e]">External Departments</div></div></div>
    <div className="card space-y-4"><div className="flex gap-3 flex-wrap"><div className="relative flex-1 min-w-[260px]"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6e7681]"/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search department, classification, location..." className="w-full pl-9 pr-4 py-2 bg-[#161b22] border border-[#30363d] rounded-lg text-white"/></div><input value={name} onChange={e=>setName(e.target.value)} placeholder="New root department" className="px-3 py-2 bg-[#161b22] border border-[#30363d] rounded-lg text-white"/><button onClick={addDepartment} className="btn-primary"><Plus size={14}/> Add</button></div><div className="overflow-x-auto rounded-xl border border-[#30363d]"><table className="w-full table-synergi"><thead><tr><th>Department</th><th>Type</th><th>Location</th><th>Classification</th><th>Default Role</th><th>Members</th><th>Actions</th></tr></thead><tbody>{filtered.map(row=><tr key={row.id}><td><div className="font-medium text-white">{row.name}</div><div className="text-xs text-[#6e7681]">{row.arabicName || 'Arabic name not set'}</div></td><td><span className={`badge ${row.type === 'External' ? 'badge-orange':'badge-blue'}`}>{row.type}</span></td><td className="text-sm text-[#8b949e]">{row.location}</td><td className="text-sm text-[#8b949e]">{row.classification}</td><td><span className="badge badge-gray">{row.defaultRole}</span></td><td className="text-sm text-[#8b949e]">{row.members}</td><td><button className="text-xs text-[#a78bfa]">Edit / Add Child</button></td></tr>)}</tbody></table></div></div>
  </div>;
}
