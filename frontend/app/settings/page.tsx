'use client';
import { useState } from 'react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [saved, setSaved] = useState(false);
  const [general, setGeneral] = useState({ org_name: 'AutoMax Service', org_email: 'support@automax.com', timezone: 'UTC+3', language: 'en', date_format: 'DD/MM/YYYY' });
  const [sla, setSla] = useState({ incident_low: 72, incident_medium: 24, incident_high: 8, incident_critical: 2, request_low: 120, request_medium: 48, complaint_high: 12 });
  const [notifications, setNotifications] = useState({ email_new: true, email_update: true, email_escalation: true, sms_critical: false, in_app: true });

  const handleSave = async () => {
    await fetch('/api/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ general, sla, notifications }) });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const tabs = [{ id: 'general', label: 'General' }, { id: 'sla', label: 'SLA Rules' }, { id: 'notifications', label: 'Notifications' }, { id: 'integrations', label: 'Integrations' }];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-[#8b949e] text-sm mt-1">Configure your service platform</p>
        </div>
        <button onClick={handleSave} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${saved ? 'bg-green-600 text-white' : 'bg-[#2188ff] text-white hover:bg-blue-600'}`}>
          {saved ? '✓ Saved' : 'Save Changes'}
        </button>
      </div>
      <div className="flex gap-1 bg-[#161b22] rounded-xl border border-[#30363d] p-1">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${activeTab === t.id ? 'bg-[#2188ff] text-white' : 'text-[#8b949e] hover:text-white'}`}>{t.label}</button>
        ))}
      </div>
      {activeTab === 'general' && (
        <div className="bg-[#161b22] rounded-xl border border-[#30363d] p-6 space-y-5">
          <h2 className="text-white font-semibold">Organization Settings</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[#8b949e] text-sm block mb-1">Organization Name</label>
              <input value={general.org_name} onChange={e=>setGeneral({...general,org_name:e.target.value})} className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-white text-sm focus:outline-none focus:border-[#2188ff]" />
            </div>
            <div>
              <label className="text-[#8b949e] text-sm block mb-1">Support Email</label>
              <input value={general.org_email} onChange={e=>setGeneral({...general,org_email:e.target.value})} className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-white text-sm focus:outline-none focus:border-[#2188ff]" />
            </div>
            <div>
              <label className="text-[#8b949e] text-sm block mb-1">Timezone</label>
              <select value={general.timezone} onChange={e=>setGeneral({...general,timezone:e.target.value})} className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-white text-sm focus:outline-none">
                <option>UTC+3</option><option>UTC+0</option><option>UTC-5</option>
              </select>
            </div>
            <div>
              <label className="text-[#8b949e] text-sm block mb-1">Language</label>
              <select value={general.language} onChange={e=>setGeneral({...general,language:e.target.value})} className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-white text-sm focus:outline-none">
                <option value="en">English</option><option value="ar">Arabic</option>
              </select>
            </div>
          </div>
        </div>
      )}
      {activeTab === 'sla' && (
        <div className="bg-[#161b22] rounded-xl border border-[#30363d] p-6 space-y-5">
          <h2 className="text-white font-semibold">SLA Response Times (hours)</h2>
          <div className="space-y-4">
            {[['Incident - Low','incident_low'],['Incident - Medium','incident_medium'],['Incident - High','incident_high'],['Incident - Critical','incident_critical'],['Request - Low','request_low'],['Request - Medium','request_medium'],['Complaint - High','complaint_high']].map(([label, key]) => (
              <div key={key} className="flex items-center gap-4">
                <label className="text-[#8b949e] text-sm w-48">{label}</label>
                <input type="number" value={(sla as any)[key]} onChange={e=>setSla({...sla,[key]:Number(e.target.value)})} className="w-24 px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-white text-sm focus:outline-none focus:border-[#2188ff]" />
                <span className="text-[#8b949e] text-sm">hours</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {activeTab === 'notifications' && (
        <div className="bg-[#161b22] rounded-xl border border-[#30363d] p-6 space-y-5">
          <h2 className="text-white font-semibold">Notification Preferences</h2>
          <div className="space-y-3">
            {[['email_new','Email on new ticket'],['email_update','Email on status update'],['email_escalation','Email on escalation'],['sms_critical','SMS for critical incidents'],['in_app','In-app notifications']].map(([key, label]) => (
              <label key={key} className="flex items-center gap-3 cursor-pointer">
                <div onClick={()=>setNotifications({...notifications,[key]:!(notifications as any)[key]})} className={`w-10 h-6 rounded-full transition-colors relative cursor-pointer ${(notifications as any)[key] ? 'bg-[#2188ff]' : 'bg-[#30363d]'}`}>
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${(notifications as any)[key] ? 'translate-x-5' : 'translate-x-1'}`} />
                </div>
                <span className="text-white text-sm">{label}</span>
              </label>
            ))}
          </div>
        </div>
      )}
      {activeTab === 'integrations' && (
        <div className="bg-[#161b22] rounded-xl border border-[#30363d] p-6">
          <h2 className="text-white font-semibold mb-4">Integrations</h2>
          <div className="grid grid-cols-2 gap-4">
            {[{name:'Email (SMTP)',status:'connected'},{name:'SMS Gateway',status:'disconnected'},{name:'Slack',status:'disconnected'},{name:'Webhook',status:'connected'}].map(i => (
              <div key={i.name} className="bg-[#1c2128] rounded-lg border border-[#30363d] p-4 flex items-center justify-between">
                <span className="text-white text-sm">{i.name}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${i.status === 'connected' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>{i.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
