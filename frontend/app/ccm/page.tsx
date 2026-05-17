'use client';

import { useMemo, useState } from 'react';
import { Headphones, Mail, MessageSquare, Phone, Search, Send, Volume2 } from 'lucide-react';

const contacts = [
  { id: '1', name: 'Ali Hassan', email: 'ali.hassan@synergi.com', department: 'Network Ops', extension: '1018', status: 'Available' },
  { id: '2', name: 'Sara Ahmed', email: 'sara.ahmed@synergi.com', department: 'Operation Center', extension: '1020', status: 'Busy' },
  { id: '3', name: 'contractor1', email: 'contractor1@synergi.com', department: 'Testing Dept', extension: '1055', status: 'Available' },
  { id: '4', name: 'QA Agent', email: 'qa.agent@synergi.com', department: 'Data Analysis Center', extension: '1099', status: 'Offline' },
];

const callHistory = [
  { id: 'c1', type: 'Incoming', contact: 'Citizen +9665000011', status: 'Completed', extension: '1018', time: 'Today, 06:55 PM', duration: '0:09' },
  { id: 'c2', type: 'Outgoing', contact: 'External Ministry', status: 'Declined', extension: '1020', time: 'Today, 05:22 PM', duration: '0:00' },
  { id: 'c3', type: 'Incoming', contact: 'Citizen +9665000012', status: 'Completed', extension: '1018', time: 'Today, 04:10 PM', duration: '0:01' },
];

const inbox = [
  { id: 'm1', folder: 'Inbox', subject: 'SLA Breach Report', from: 'system@synergi.com', snippet: 'Critical incident INC-2026-000145 breached SLA.', time: '10:15' },
  { id: 'm2', folder: 'Inbox', subject: 'Incident Update', from: 'agent@synergi.com', snippet: 'Contractor uploaded resolution evidence.', time: '09:45' },
  { id: 'm3', folder: 'Sent', subject: 'Follow-up request', from: 'admin@synergi.com', snippet: 'Please confirm the closure details.', time: 'Yesterday' },
];

const sms = [
  { id: 's1', direction: 'Outbound', to: '+9665000011', body: 'Your incident INC-2026-000145 has been created.', status: 'Delivered' },
  { id: 's2', direction: 'Outbound', to: '+9665000012', body: 'OTP: 493821', status: 'Delivered' },
  { id: 's3', direction: 'Inbound', to: 'Synergi', body: 'Need update on my request', status: 'New' },
];

export default function CCMPage() {
  const [search, setSearch] = useState('');
  const [folder, setFolder] = useState('Inbox');
  const [message, setMessage] = useState('');
  const filteredContacts = useMemo(() => contacts.filter(c => `${c.name} ${c.email} ${c.department}`.toLowerCase().includes(search.toLowerCase())), [search]);
  const filteredMail = inbox.filter(m => m.folder === folder);

  return <div className="p-6 space-y-6 bg-[#0d1117] min-h-screen">
    <div className="flex items-center justify-between gap-4"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center"><Headphones className="text-blue-400" /></div><div><h1 className="text-2xl font-bold">Contact Centre Management</h1><p className="text-sm text-[#8b949e]">Contacts, one-click communication, call history, email inbox, SMS, and complaint audio support.</p></div></div><button onClick={() => setMessage('Demo notification sent to selected stakeholder.')} className="btn-primary"><Send size={14}/> Notify</button></div>
    {message && <div className="rounded-lg border border-[#6e40c9]/30 bg-[#6e40c9]/10 px-4 py-3 text-sm">{message}</div>}
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <section className="card space-y-4"><div className="flex items-center justify-between"><h2 className="font-semibold">Contacts Directory</h2><span className="badge badge-blue">{filteredContacts.length}</span></div><div className="relative"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6e7681]"/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search contacts..." className="w-full pl-9 pr-4 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-white"/></div><div className="space-y-3">{filteredContacts.map(contact => <div key={contact.id} className="rounded-lg bg-[#0d1117] border border-[#30363d] p-3"><div className="flex items-center justify-between"><div><div className="font-medium">{contact.name}</div><div className="text-xs text-[#8b949e]">{contact.email}</div></div><span className={`badge ${contact.status === 'Available' ? 'badge-green' : contact.status === 'Busy' ? 'badge-yellow':'badge-gray'}`}>{contact.status}</span></div><div className="mt-3 flex items-center gap-2"><span className="badge badge-gray">{contact.department}</span><button className="text-xs text-[#58a6ff]"><Phone size={14}/> Ext. {contact.extension}</button><button className="text-xs text-[#a78bfa]"><Mail size={14}/> Email</button></div></div>)}</div></section>
      <section className="card space-y-4"><h2 className="font-semibold">Call History</h2><div className="space-y-3">{callHistory.map(call => <div key={call.id} className="rounded-lg bg-[#0d1117] border border-[#30363d] p-3"><div className="flex justify-between gap-3"><div><div className="font-medium text-sm">{call.contact}</div><div className="text-xs text-[#8b949e]">{call.type} • Ext. {call.extension} • {call.time}</div></div><span className={`badge ${call.status === 'Completed' ? 'badge-green':'badge-red'}`}>{call.status}</span></div><div className="text-xs text-[#6e7681] mt-2">Duration: {call.duration}</div></div>)}</div><div className="rounded-lg bg-[#0d1117] border border-[#30363d] p-3"><div className="flex items-center gap-2"><Volume2 className="text-orange-400" size={18}/><div><div className="font-medium text-sm">Audio Complaint</div><div className="text-xs text-[#8b949e]">Complaint COM-009 recording ready for playback.</div></div></div><button className="btn-secondary mt-3">Listen to audio complaint</button></div></section>
      <section className="card space-y-4"><h2 className="font-semibold">Email / SMS</h2><div className="flex gap-2">{['Inbox','Sent','Drafts','Trash'].map(f => <button key={f} onClick={()=>setFolder(f)} className={`badge ${folder === f ? 'badge-blue':'badge-gray'}`}>{f}</button>)}</div><div className="space-y-2">{filteredMail.length ? filteredMail.map(mail => <div key={mail.id} className="rounded-lg bg-[#0d1117] border border-[#30363d] p-3"><div className="font-medium text-sm">{mail.subject}</div><div className="text-xs text-[#8b949e]">{mail.from} • {mail.time}</div><p className="text-xs text-[#6e7681] mt-1">{mail.snippet}</p></div>) : <div className="text-sm text-[#8b949e]">No messages in {folder}</div>}</div><div className="border-t border-[#30363d] pt-4"><h3 className="font-semibold mb-3"><MessageSquare size={16}/> SMS Hub</h3><div className="space-y-2">{sms.map(item => <div key={item.id} className="rounded-lg bg-[#0d1117] border border-[#30363d] p-3"><div className="flex justify-between"><span className="text-sm font-medium">{item.direction}</span><span className="badge badge-green">{item.status}</span></div><div className="text-xs text-[#8b949e]">{item.to}</div><p className="text-xs text-[#6e7681] mt-1">{item.body}</p></div>)}</div></div></section>
    </div>
  </div>;
}
