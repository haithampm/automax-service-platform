'use client';

import { useMemo, useState } from 'react';
import { BarChart3, Download, Filter, Plus, Save, Search } from 'lucide-react';
import { IncidentRecord, RequestRecord, seedIncidents, seedRequests } from '../../lib/imsData';
import { useLocalStorageState } from '../../lib/useLocalStorage';

const templates = [
  { id: 'locations-status', name: 'Locations By Status', visibility: 'Public', creator: 'Admin', source: 'Incidents' },
  { id: 'location-count', name: 'Location Count Based Report', visibility: 'Private', creator: 'Admin', source: 'Incidents' },
  { id: 'sla-breach', name: 'SLA Breach Report', visibility: 'Public', creator: 'System', source: 'Incidents' },
  { id: 'request-source', name: 'Request Source Incident Report', visibility: 'Public', creator: 'Admin', source: 'Requests' },
];

const allColumns = {
  Incidents: ['number', 'title', 'status', 'priority', 'assignee', 'department', 'classification', 'location', 'sla', 'created', 'due'],
  Requests: ['number', 'title', 'status', 'priority', 'assignee', 'classification', 'created', 'sourceIncidents'],
};

export default function ReportsPage() {
  const [incidents] = useLocalStorageState<IncidentRecord[]>('synergi.incidents', seedIncidents);
  const [requests] = useLocalStorageState<RequestRecord[]>('synergi.requests', seedRequests);
  const [source, setSource] = useState<'Incidents' | 'Requests'>('Incidents');
  const [query, setQuery] = useState('');
  const [selectedColumns, setSelectedColumns] = useState<string[]>(allColumns.Incidents.slice(0, 7));
  const [limit, setLimit] = useState(100);
  const [loadedTemplate, setLoadedTemplate] = useState('');

  const sourceRows = source === 'Incidents' ? incidents : requests;
  const availableColumns = allColumns[source];
  const reportRows = useMemo(() => sourceRows.filter(row => JSON.stringify(row).toLowerCase().includes(query.toLowerCase())).slice(0, limit), [sourceRows, query, limit]);

  const switchSource = (value: 'Incidents' | 'Requests') => {
    setSource(value);
    setSelectedColumns(allColumns[value].slice(0, 7));
  };

  const toggleColumn = (column: string) => setSelectedColumns(prev => prev.includes(column) ? prev.filter(c => c !== column) : [...prev, column]);

  const exportCsv = () => {
    const rows = reportRows.map(row => selectedColumns.map(column => {
      const value = (row as unknown as Record<string, unknown>)[column];
      return Array.isArray(value) ? value.join('; ') : value ?? '';
    }));
    const csv = [selectedColumns, ...rows].map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `synergi-${source.toLowerCase()}-report.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return <div className="p-6 space-y-6 bg-[#0d1117] min-h-screen">
    <div className="flex items-center justify-between gap-4"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center"><BarChart3 className="text-green-400" /></div><div><h1 className="text-2xl font-bold">Reports</h1><p className="text-sm text-[#8b949e]">Saved templates, builder, column picker, filters, record limits, and export.</p></div></div><button onClick={exportCsv} className="btn-primary"><Download size={14}/> Export</button></div>
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
      <section className="card space-y-4"><div className="flex items-center justify-between"><h2 className="font-semibold">Report Templates</h2><button className="btn-secondary"><Plus size={14}/></button></div>{templates.map(t => <button key={t.id} onClick={() => { setLoadedTemplate(t.name); switchSource(t.source as 'Incidents' | 'Requests'); }} className={`w-full text-left rounded-lg border px-3 py-3 ${loadedTemplate === t.name ? 'border-[#6e40c9] bg-[#6e40c9]/10' : 'border-[#30363d] bg-[#0d1117]'}`}><div className="font-medium">{t.name}</div><div className="text-xs text-[#8b949e]">{t.source} • {t.visibility} • {t.creator}</div><div className="mt-2 flex gap-2"><span className="badge badge-blue">Generate</span><span className="badge badge-gray">Export</span></div></button>)}</section>
      <section className="xl:col-span-3 card space-y-4"><div className="grid grid-cols-1 md:grid-cols-4 gap-3"><select value={source} onChange={e => switchSource(e.target.value as 'Incidents' | 'Requests')} className="px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-white"><option>Incidents</option><option>Requests</option></select><div className="relative md:col-span-2"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6e7681]"/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Filter report rows..." className="w-full pl-9 pr-4 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-white"/></div><select value={limit} onChange={e=>setLimit(Number(e.target.value))} className="px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-white"><option value={10}>10 records</option><option value={25}>25 records</option><option value={100}>100 records</option><option value={1000}>1000 records</option></select></div><div><h3 className="font-semibold mb-2">Column Picker</h3><div className="flex flex-wrap gap-2">{availableColumns.map(column => <button key={column} onClick={() => toggleColumn(column)} className={`badge ${selectedColumns.includes(column) ? 'badge-blue':'badge-gray'}`}>{column}</button>)}</div></div><div className="flex items-center justify-between"><div className="text-sm text-[#8b949e]"><Filter size={14}/> {reportRows.length} rows generated from {source}</div><button className="btn-secondary"><Save size={14}/> Save as Template</button></div><div className="overflow-x-auto rounded-xl border border-[#30363d]"><table className="w-full table-synergi"><thead><tr>{selectedColumns.map(c => <th key={c}>{c}</th>)}</tr></thead><tbody>{reportRows.map((row, idx) => <tr key={idx}>{selectedColumns.map(column => { const value = (row as unknown as Record<string, unknown>)[column]; return <td key={column} className="text-sm text-[#8b949e]">{Array.isArray(value) ? value.join(', ') : String(value ?? '—')}</td>; })}</tr>)}</tbody></table></div></section>
    </div>
  </div>;
}
