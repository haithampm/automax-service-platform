'use client';

import { useMemo, useState } from 'react';
import { Database, Download, Lock, Plus, Search } from 'lucide-react';
import { classifications, priorities } from '../../../lib/imsData';

const initialCategories = [
  { id: 'priority', name: 'Priority', code: 'PRIORITY', fieldType: 'Dropdown', locked: true, addToIncident: true, values: priorities.map((p, i) => ({ name: p, code: p.toUpperCase(), color: ['#3B82F6','#EAB308','#F97316','#EF4444'][i], default: p === 'Medium' })) },
  { id: 'classification', name: 'Classification', code: 'CLASSIFICATION', fieldType: 'Tree', locked: true, addToIncident: true, values: classifications.map((c, i) => ({ name: c, code: `CLS-${i + 1}`, color: '#6E40C9', default: i === 0 })) },
  { id: 'duration', name: 'Closure Duration', code: 'DURATION', fieldType: 'Dropdown', locked: false, addToIncident: false, values: ['12 hours','24 hours','1 day','2 days','3 days'].map((d, i) => ({ name: d, code: `DUR-${i + 1}`, color: '#58A6FF', default: i === 2 })) },
  { id: 'feedback', name: 'Feedback', code: 'FEEDBACK', fieldType: 'Dropdown', locked: false, addToIncident: true, values: ['Missing Incident information','Rejected by contractor','Reopen requested','Customer confirmation pending'].map((d, i) => ({ name: d, code: `FDB-${i + 1}`, color: '#D29922', default: i === 0 })) },
];

export default function MasterDataPage() {
  const [categories, setCategories] = useState(initialCategories);
  const [search, setSearch] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [activeId, setActiveId] = useState(categories[0].id);
  const [newValue, setNewValue] = useState('');

  const filtered = useMemo(() => categories.filter(c => `${c.name} ${c.code} ${c.values.map(v => v.name).join(' ')}`.toLowerCase().includes(search.toLowerCase())), [categories, search]);
  const active = categories.find(c => c.id === activeId) ?? categories[0];

  const addCategory = () => {
    if (!categoryName.trim()) return;
    const newCategory = { id: `cat-${Date.now()}`, name: categoryName, code: categoryName.toUpperCase().replace(/\s+/g, '_'), fieldType: 'Dropdown', locked: false, addToIncident: false, values: [] as typeof initialCategories[number]['values'] };
    setCategories(prev => [newCategory, ...prev]);
    setActiveId(newCategory.id);
    setCategoryName('');
  };

  const addValue = () => {
    if (!newValue.trim() || !active) return;
    setCategories(prev => prev.map(cat => cat.id === active.id ? { ...cat, values: [{ name: newValue, code: newValue.toUpperCase().replace(/\s+/g, '_'), color: '#6E40C9', default: cat.values.length === 0 }, ...cat.values] } : cat));
    setNewValue('');
  };

  return <div className="p-6 space-y-6 bg-[#0d1117] min-h-screen">
    <div className="flex items-center justify-between gap-4"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center"><Database className="text-blue-400" /></div><div><h1 className="text-2xl font-bold">Master Data</h1><p className="text-sm text-[#8b949e]">Lookup categories, values, defaults, color coding, and incident-form visibility.</p></div></div><button className="btn-secondary"><Download size={14}/> Export</button></div>
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <section className="card space-y-4"><div className="relative"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6e7681]"/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search categories..." className="w-full pl-9 pr-4 py-2 bg-[#161b22] border border-[#30363d] rounded-lg text-white"/></div><div className="flex gap-2"><input value={categoryName} onChange={e=>setCategoryName(e.target.value)} placeholder="New category" className="flex-1 px-3 py-2 bg-[#161b22] border border-[#30363d] rounded-lg text-white"/><button onClick={addCategory} className="btn-primary"><Plus size={14}/></button></div><div className="space-y-2">{filtered.map(cat => <button key={cat.id} onClick={()=>setActiveId(cat.id)} className={`w-full text-left rounded-lg border px-3 py-3 ${activeId === cat.id ? 'border-[#6e40c9] bg-[#6e40c9]/10' : 'border-[#30363d] bg-[#0d1117]'}`}><div className="flex items-center justify-between"><span className="font-medium">{cat.name}</span>{cat.locked && <Lock size={14} className="text-[#8b949e]"/>}</div><div className="text-xs text-[#8b949e]">{cat.code} • {cat.fieldType} • {cat.values.length} values</div></button>)}</div></section>
      <section className="xl:col-span-2 card space-y-4"><div className="flex items-start justify-between"><div><h2 className="text-xl font-semibold">{active.name}</h2><p className="text-sm text-[#8b949e]">Code: {active.code} • Field type: {active.fieldType}</p></div><span className={`badge ${active.addToIncident ? 'badge-green':'badge-gray'}`}>{active.addToIncident ? 'Added to Incident Form':'System Only'}</span></div><div className="flex gap-2"><input value={newValue} onChange={e=>setNewValue(e.target.value)} placeholder="Add lookup value" className="flex-1 px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-white"/><button onClick={addValue} className="btn-primary"><Plus size={14}/> Add Value</button></div><div className="overflow-x-auto rounded-xl border border-[#30363d]"><table className="w-full table-synergi"><thead><tr><th>Value</th><th>Code</th><th>Color</th><th>Default</th><th>Actions</th></tr></thead><tbody>{active.values.map(v => <tr key={v.code}><td className="font-medium text-white">{v.name}</td><td className="text-sm text-[#8b949e]">{v.code}</td><td><span className="inline-flex items-center gap-2 text-sm text-[#8b949e]"><span className="w-4 h-4 rounded-full border border-[#30363d]" style={{background:v.color}} />{v.color}</span></td><td><span className={`badge ${v.default ? 'badge-blue':'badge-gray'}`}>{v.default ? 'Default':'No'}</span></td><td><button className="text-xs text-[#a78bfa]">Edit / Delete</button></td></tr>)}</tbody></table></div></section>
    </div>
  </div>;
}
