"use client";
import { useState } from "react";
import Link from "next/link";
import { Settings, Bell, Clock, Link as LinkIcon, Save, CheckCircle } from "lucide-react";
import { clsx } from "clsx";

const tabs = [
  { id: "general", label: "General" },
  { id: "sla", label: "SLA Rules" },
  { id: "notifications", label: "Notifications" },
  { id: "integrations", label: "Integrations" },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [saved, setSaved] = useState(false);
  const [general, setGeneral] = useState({
    org_name: "Synergi IMS",
    org_email: "support@synergi-ims.com",
    timezone: "UTC+3",
    language: "en",
    date_format: "DD/MM/YYYY",
  });
  const [sla, setSla] = useState({
    incident_low: 72,
    incident_medium: 24,
    incident_high: 8,
    incident_critical: 2,
    request_low: 120,
    request_medium: 48,
    complaint_high: 12,
  });
  const [notifications, setNotifications] = useState({
    email_new: true,
    email_update: true,
    email_escalation: true,
    sms_critical: false,
    in_app: true,
  });

  const handleSave = async () => {
    await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ general, sla, notifications }),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--color-bg-primary)" }}>
      {/* Breadcrumb */}
      <div className="border-b px-6 py-3 flex items-center gap-2 text-sm" style={{ borderColor: "var(--color-border-primary)", background: "var(--color-bg-secondary)" }}>
        <Link
          href="/dashboard"
          className="transition-colors"
          style={{ color: "var(--color-text-muted)" }}
          onMouseEnter={e => (e.currentTarget.style.color = "var(--color-accent)")}
          onMouseLeave={e => (e.currentTarget.style.color = "var(--color-text-muted)")}
        >
          Dashboard
        </Link>
        <span style={{ color: "var(--color-text-muted)" }}>/</span>
        <span style={{ color: "var(--color-text-primary)" }}>Settings</span>
      </div>

      <div className="p-6 space-y-6">
        {/* Page Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ background: "var(--color-accent)/15", border: "1px solid var(--color-accent)/25" }}>
              <Settings className="w-6 h-6" style={{ color: "var(--color-accent)" }} />
            </div>
            <div>
              <h1 className="text-2xl font-bold" style={{ color: "var(--color-text-primary)" }}>Settings</h1>
              <p className="text-sm mt-0.5" style={{ color: "var(--color-text-muted)" }}>Configure your service platform</p>
            </div>
          </div>
          <button
            onClick={handleSave}
            className={clsx("flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all", saved ? "opacity-80" : "")}
            style={{ background: saved ? "var(--color-accent)/50" : "var(--color-accent)", color: "#fff" }}
          >
            {saved ? (
              <>
                <CheckCircle className="w-4 h-4" />
                Saved
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 rounded-xl p-1" style={{ background: "var(--color-bg-secondary)", border: "1px solid var(--color-border-primary)" }}>
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={clsx("flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors", activeTab === t.id ? "text-white" : "hover:opacity-80")}
              style={
                activeTab === t.id
                  ? { background: "var(--color-accent)", color: "#fff" }
                  : { color: "var(--color-text-secondary)" }
              }
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="rounded-xl p-6 space-y-6" style={{ border: "1px solid var(--color-border-primary)", background: "var(--color-bg-secondary)" }}>
          {activeTab === "general" && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold mb-4" style={{ color: "var(--color-text-primary)" }}>Organization Settings</h2>
              {[
                ["Organization Name", "org_name"],
                ["Support Email", "org_email"],
              ].map(([label, key]) => (
                <div key={key}>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--color-text-secondary)" }}>{label}</label>
                  <input
                    value={(general as any)[key]}
                    onChange={e => setGeneral({ ...general, [key]: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none transition-colors"
                    style={{ background: "var(--color-bg-tertiary)", border: "1px solid var(--color-border-primary)", color: "var(--color-text-primary)" }}
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--color-text-secondary)" }}>Timezone</label>
                <select
                  value={general.timezone}
                  onChange={e => setGeneral({ ...general, timezone: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none transition-colors"
                  style={{ background: "var(--color-bg-tertiary)", border: "1px solid var(--color-border-primary)", color: "var(--color-text-primary)" }}
                >
                  <option>UTC+3</option>
                  <option>UTC+0</option>
                  <option>UTC-5</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === "sla" && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold mb-4" style={{ color: "var(--color-text-primary)" }}>SLA Response Times (hours)</h2>
              {[
                ["Incident - Low", "incident_low"],
                ["Incident - Medium", "incident_medium"],
                ["Incident - High", "incident_high"],
                ["Incident - Critical", "incident_critical"],
                ["Request - Low", "request_low"],
                ["Request - Medium", "request_medium"],
                ["Complaint - High", "complaint_high"],
              ].map(([label, key]) => (
                <div key={key} className="flex items-center justify-between">
                  <label className="text-sm font-medium" style={{ color: "var(--color-text-secondary)" }}>{label}</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={(sla as any)[key]}
                      onChange={e => setSla({ ...sla, [key]: Number(e.target.value) })}
                      className="w-24 px-3 py-2 rounded-lg text-sm focus:outline-none transition-colors text-center"
                      style={{ background: "var(--color-bg-tertiary)", border: "1px solid var(--color-border-primary)", color: "var(--color-text-primary)" }}
                    />
                    <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>hours</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold mb-4" style={{ color: "var(--color-text-primary)" }}>Notification Preferences</h2>
              {[
                ["email_new", "Email on new ticket"],
                ["email_update", "Email on status update"],
                ["email_escalation", "Email on escalation"],
                ["sms_critical", "SMS for critical incidents"],
                ["in_app", "In-app notifications"],
              ].map(([key, label]) => (
                <div key={key} className="flex items-center justify-between">
                  <label className="text-sm font-medium" style={{ color: "var(--color-text-secondary)" }}>{label}</label>
                  <button
                    onClick={() => setNotifications({ ...notifications, [key]: !(notifications as any)[key] })}
                    className={clsx("w-11 h-6 rounded-full transition-colors relative", (notifications as any)[key] ? "" : "")}
                    style={{ background: (notifications as any)[key] ? "var(--color-accent)" : "var(--color-border-primary)" }}
                  >
                    <div
                      className={clsx("absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform", (notifications as any)[key] ? "right-0.5" : "left-0.5")}
                    />
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === "integrations" && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold mb-4" style={{ color: "var(--color-text-primary)" }}>Integrations</h2>
              {[
                { name: "Email (SMTP)", status: "connected" },
                { name: "SMS Gateway", status: "disconnected" },
                { name: "Slack", status: "disconnected" },
                { name: "Webhook", status: "connected" },
              ].map(i => (
                <div key={i.name} className="flex items-center justify-between p-3 rounded-lg" style={{ background: "var(--color-bg-tertiary)", border: "1px solid var(--color-border-primary)" }}>
                  <span className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>{i.name}</span>
                  <span className={clsx("badge", i.status === "connected" ? "badge-green" : "badge-gray")}>{i.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
