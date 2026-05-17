'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, Copy, Download, Filter, Map, RefreshCw, Search, Shuffle, Workflow } from 'lucide-react';
import { classifications, departments, IncidentRecord, nextRequestNumber, priorityColor, RequestRecord, seedIncidents, seedRequests, statusColor, workflowTransitions } from '../../lib/imsData';
import { useLocalStorageState } from '../../lib/useLocalStorage';

type ActionForm = {
  comments: string;
  feedback: string;
  externalDepartment: string;
  duration: string;
  requestClassification: string;
  attachments: string;
};

const emptyForm: ActionForm = {
  comments: '',
  feedback: '',
  externalDepartment: departments[4],
  duration: '1 day',
  requestClassification: classifications[6],
  attachments: '',
};

export default function IncidentsPage() {
  const [incidents, setIncidents, resetIncidents] = useLocalStorageState<IncidentRecord[]>('synergi.incidents', seedIncidents);
  const [requests, setRequests] = useLocalStorageState<RequestRecord[]>('synergi.requests', seedRequests);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [priority, setPriority] = useState('All');
  const [showMap, setShowMap] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeIncidentId, setActiveIncidentId] = useState<string | null>(null);
  const [actionLabel, setActionLabel] = useState<string>('');
  const [form, setForm] = useState<ActionForm>(emptyForm);
  const [message, setMessage] = useState('');

  const filtered = useMemo(() => incidents.filter(incident => {
    const text = `${incident.title} ${incident.number} ${incident.classification} ${incident.location} ${incident.assignee}`.toLowerCase();
    return text.includes(search.toLowerCase()) &&
      (status === 'All' || incident.status === status) &&
      (priority === 'All' || incident.priority === priority);
  }), [incidents, search, status, priority]);

  const activeIncident = incidents.find(i => i.id === activeIncidentId) ?? null;
  const availableActions = activeIncident ? workflowTransitions.filter(t => t.from === activeIncident.status) : [];
  const currentTransition = availableActions.find(t => t.label === actionLabel) ?? availableActions[0];

  const stats = useMemo(() => ({
    total: incidents.length,
    initial: incidents.filter(i => i.status === 'New Incident').length,
    inProgress: incidents.filter(i => i.status === 'Under Resolution').length,
    breached: incidents.filter(i => i.sla === 'Breached').length,
    ready: incidents.filter(i => i.status === 'Ready to Close').length,
  }), [incidents]);

  const toggleSelected = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  const selectAllVisible = () => setSelectedIds(prev => prev.length === filtered.length ? [] : filtered.map(i => i.id));

  const validateRequired = () => {
    if (!currentTransition) return 'Select a workflow action first.';
    const missing = currentTransition.requires.filter(req => {
      if (req === 'attachments') return !form.attachments.trim();
      return !String(form[req] ?? '').trim();
    });
    return missing.length ? `Missing required field(s): ${missing.join(', ')}` : '';
  };

  const createRequestFromIncidents = (sourceIncidents: IncidentRecord[], note: string) => {
    const number = nextRequestNumber(requests);
    const request: RequestRecord = {
      id: `r-${Date.now()}`,
      number,
      title: sourceIncidents.length === 1 ? `Request from ${sourceIncidents[0].number}: ${sourceIncidents[0].title}` : `Consolidated request from ${sourceIncidents.length} incidents`,
      description: `${note}\n\nSource incidents: ${sourceIncidents.map(i => i.number).join(', ')}`,
      status: 'New',
      priority: sourceIncidents.some(i => i.priority === 'Critical') ? 'Critical' : sourceIncidents.some(i => i.priority === 'High') ? 'High' : 'Medium',
      assignee: 'contractor1',
      sourceIncidents: sourceIncidents.map(i => i.number),
      classification: form.requestClassification || sourceIncidents[0].classification,
      created: new Date().toISOString().slice(0, 10),
      audit: [{ id: `ra-${Date.now()}`, action: 'Created from incident conversion', user: 'Contractor', timestamp: new Date().toISOString(), notes: note }],
    };
    setRequests(prev => [request, ...prev]);
    return number;
  };

  const applyAction = () => {
    if (!activeIncident || !currentTransition) return;
    const error = validateRequired();
    if (error) {
      setMessage(error);
      return;
    }

    let requestNumber = '';
    if (currentTransition.label === 'Convert to Request') {
      requestNumber = createRequestFromIncidents([activeIncident], form.comments);
    }

    setIncidents(prev => prev.map(incident => incident.id === activeIncident.id ? {
      ...incident,
      status: currentTransition.to,
      linkedRequest: requestNumber || incident.linkedRequest,
      attachments: form.attachments ? [...incident.attachments, ...form.attachments.split(',').map(v => v.trim()).filter(Boolean)] : incident.attachments,
      comments: form.comments ? [...incident.comments, form.comments] : incident.comments,
      audit: [{
        id: `a-${Date.now()}`,
        action: currentTransition.label,
        user: currentTransition.role,
        timestamp: new Date().toISOString(),
        notes: [form.comments, form.feedback, requestNumber ? `Created ${requestNumber}` : ''].filter(Boolean).join(' | '),
      }, ...incident.audit],
    } : incident));
    setMessage(`${activeIncident.number} moved to ${currentTransition.to}${requestNumber ? ` and ${requestNumber} was created` : ''}.`);
    setActiveIncidentId(null);
    setForm(emptyForm);
  };

  const bulkConvert = () => {
    const selected = incidents.filter(i => selectedIds.includes(i.id));
    const eligible = selected.filter(i => i.status !== 'Closed' && !i.linkedRequest);
    if (!eligible.length) {
      setMessage('No eligible incidents selected. Closed or already-linked incidents cannot be converted.');
      return;
    }
    const requestNumber = createRequestFromIncidents(eligible, 'Bulk conversion from incident list.');
    setIncidents(prev => prev.map(i => eligible.some(e => e.id === i.id) ? {
      ...i,
      status: 'Closed',
      linkedRequest: requestNumber,
      comments: [...i.comments, `Bulk converted to ${requestNumber}`],
      audit: [{ id: `a-${Date.now()}-${i.id}`, action: 'Bulk Convert to Request', user: 'Contractor', timestamp: new Date().toISOString(), notes: requestNumber }, ...i.audit],
    } : i));
    setSelectedIds([]);
    setMessage(`${eligible.length} incident(s) converted into ${requestNumber}.`);
  };

  const cloneIncident = (incident: IncidentRecord) => {
    const cloneNumber = `INC-2026-${String(100000 + incidents.length + 1).slice(-6)}`;
    setIncidents(prev => [{ ...incident, id: `clone-${Date.now()}`, number: cloneNumber, title: `${incident.title} (Clone)`, status: 'New Incident', linkedRequest: undefined, created: new Date().toISOString().slice(0, 10), audit: [{ id: `a-${Date.now()}`, action: 'Cloned', user: 'Agent', timestamp: new Date().toISOString(), notes: `Cloned from ${incident.number}` }] }, ...prev]);
    setMessage(`${cloneNumber} cloned from ${incident.number}.`);
  };

  const exportCsv = () => {
    const header = ['Number','Title','Status','Priority','Assignee','Department','Classification','Location','SLA','Linked Request'];
    const rows = filtered.map(i => [i.number, i.title, i.status, i.priority, i.assignee, i.department, i.classification, i.location, i.sla, i.linkedRequest ?? '']);
    const csv = [header, ...rows].map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'synergi-incidents.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#0d1117]">
      <div className="border-b border-[#30363d] px-6 py-3 flex items-center gap-6 text-sm text-[#8b949e]">
        <Link href="/incidents" className="text-white font-medium">Incidents</Link>
        <span>/</span>
        <span>Management</span>
        <div className="ml-auto"><Link href="/dashboard" className="hover:text-white transition-colors">Back to Home</Link></div>
      </div>

      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center"><AlertTriangle size={20} className="text-blue-400" /></div>
            <div><h1 className="text-xl font-bold text-white">Incident Management</h1><p className="text-[#8b949e] text-sm">Advanced filters, workflow transitions, merge/convert, audit history, and reporting.</p></div>
          </div>
          <div className="flex gap-2 flex-wrap justify-end">
            <button onClick={() => setShowMap(!showMap)} className="btn-secondary"><Map size={14} /> {showMap ? 'Hide Map' : 'Show Map'}</button>
            <button onClick={bulkConvert} className="btn-secondary"><Shuffle size={14} /> Convert Selected</button>
            <button onClick={exportCsv} className="btn-secondary"><Download size={14} /> Export</button>
            <button onClick={() => { resetIncidents(); setSelectedIds([]); }} className="btn-secondary"><RefreshCw size={14} /> Reset Demo</button>
            <Link href="/incidents/new" className="btn-primary">Create Incident</Link>
          </div>
        </div>

        {message && <div className="rounded-lg border border-[#6e40c9]/30 bg-[#6e40c9]/10 px-4 py-3 text-sm text-[#e6edf3]">{message}</div>}

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          {[['Total', stats.total, 'text-blue-400'], ['Initial', stats.initial, 'text-yellow-400'], ['In Progress', stats.inProgress, 'text-blue-400'], ['Ready', stats.ready, 'text-green-400'], ['SLA Breached', stats.breached, 'text-red-400']].map(([label, value, color]) => (
            <div key={String(label)} className="bg-[#1c2333] border border-[#30363d] rounded-xl p-4"><div className={`text-2xl font-bold ${color}`}>{value}</div><div className="text-[#8b949e] text-sm">{label}</div></div>
          ))}
        </div>

        {showMap && <div className="card"><h2 className="text-sm font-semibold mb-3">Incident Map</h2><div className="grid grid-cols-1 md:grid-cols-3 gap-3">{incidents.map(i => <div key={i.id} className="rounded-lg bg-[#0d1117] border border-[#30363d] p-3"><div className="font-medium text-sm">{i.number}</div><div className="text-xs text-[#8b949e]">{i.location}</div><div className="text-xs text-[#6e7681] mt-1">Lat {i.lat}, Lng {i.lng}</div></div>)}</div></div>}

        <div className="card space-y-4">
          <div className="flex gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[240px]"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6e7681]" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by title, number, assignee, location..." className="w-full pl-9 pr-4 py-2 bg-[#161b22] border border-[#30363d] rounded-lg text-sm text-white" /></div>
            <select value={status} onChange={e => setStatus(e.target.value)} className="px-3 py-2 bg-[#161b22] border border-[#30363d] rounded-lg text-white text-sm"><option>All</option>{Array.from(new Set(incidents.map(i => i.status))).map(s => <option key={s}>{s}</option>)}</select>
            <select value={priority} onChange={e => setPriority(e.target.value)} className="px-3 py-2 bg-[#161b22] border border-[#30363d] rounded-lg text-white text-sm"><option>All</option><option>Low</option><option>Medium</option><option>High</option><option>Critical</option></select>
            <button className="btn-secondary"><Filter size={14} /> Filters</button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-[#30363d]">
            <table className="w-full table-synergi">
              <thead><tr><th><input type="checkbox" checked={selectedIds.length === filtered.length && filtered.length > 0} onChange={selectAllVisible} /></th><th>Incident</th><th>Status</th><th>Priority</th><th>Assignee</th><th>SLA</th><th>Source</th><th>Linked Request</th><th>Actions</th></tr></thead>
              <tbody>{filtered.map(incident => <tr key={incident.id}><td><input type="checkbox" checked={selectedIds.includes(incident.id)} onChange={() => toggleSelected(incident.id)} /></td><td><div className="text-[#2188ff] text-sm font-medium">{incident.number}</div><div className="text-white text-sm">{incident.title}</div><div className="text-xs text-[#6e7681]">{incident.classification} • {incident.location}</div></td><td><span className={`badge ${statusColor(incident.status)}`}>{incident.status}</span></td><td><span className={`badge ${priorityColor(incident.priority)}`}>{incident.priority}</span></td><td className="text-sm text-[#8b949e]">{incident.assignee}</td><td><span className={`badge ${incident.sla === 'Breached' ? 'badge-red' : 'badge-green'}`}>{incident.sla}</span></td><td className="text-sm text-[#8b949e]">{incident.source}</td><td className="text-xs text-[#8b949e]">{incident.linkedRequest ?? '—'}</td><td><div className="flex gap-2"><button onClick={() => { setActiveIncidentId(incident.id); setActionLabel(workflowTransitions.find(t => t.from === incident.status)?.label ?? ''); setForm(emptyForm); }} className="text-xs text-[#a78bfa] hover:text-white"><Workflow size={14} /> Workflow</button><button onClick={() => cloneIncident(incident)} className="text-xs text-[#58a6ff] hover:text-white"><Copy size={14} /> Clone</button></div></td></tr>)}</tbody>
            </table>
          </div>
          <div className="text-sm text-[#8b949e]">Showing {filtered.length} of {incidents.length} incidents. Selected: {selectedIds.length}</div>
        </div>

        {activeIncident && currentTransition && <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"><div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6 w-full max-w-2xl space-y-4"><div><h2 className="text-lg font-bold">Workflow Action: {activeIncident.number}</h2><p className="text-sm text-[#8b949e]">Current status: {activeIncident.status}</p></div><select value={actionLabel} onChange={e => setActionLabel(e.target.value)} className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-white">{availableActions.map(a => <option key={a.label}>{a.label}</option>)}</select><p className="text-sm text-[#8b949e]">{currentTransition.description}</p><div className="grid grid-cols-1 md:grid-cols-2 gap-3"><textarea value={form.comments} onChange={e => setForm({...form, comments: e.target.value})} placeholder="Comments" className="textarea" /><textarea value={form.feedback} onChange={e => setForm({...form, feedback: e.target.value})} placeholder="Feedback" className="textarea" /><select value={form.externalDepartment} onChange={e => setForm({...form, externalDepartment: e.target.value})} className="px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-white">{departments.map(d => <option key={d}>{d}</option>)}</select><select value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} className="px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-white"><option>1 day</option><option>2 days</option><option>3 days</option><option>12 hours</option><option>24 hours</option></select><select value={form.requestClassification} onChange={e => setForm({...form, requestClassification: e.target.value})} className="px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-white">{classifications.map(c => <option key={c}>{c}</option>)}</select><input value={form.attachments} onChange={e => setForm({...form, attachments: e.target.value})} placeholder="Attachments, comma separated" className="px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-white" /></div><div className="rounded-lg bg-[#0d1117] border border-[#30363d] p-3 text-sm"><strong>Required:</strong> {currentTransition.requires.length ? currentTransition.requires.join(', ') : 'No mandatory fields'}</div><div className="flex justify-end gap-3"><button onClick={() => setActiveIncidentId(null)} className="btn-secondary">Cancel</button><button onClick={applyAction} className="btn-primary">Apply Action</button></div></div></div>}
      </div>
    </div>
  );
}
