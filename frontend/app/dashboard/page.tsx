"use client";
import Link from "next/link";
import { Settings, AlertTriangle, FileText, MessageSquareWarning, ArrowRight, Zap } from "lucide-react";

const modules = [
  {
    title: "Admin Panel",
    subtitle: "User & Access Control",
    desc: "Users, roles, permissions, departments",
    href: "/admin",
    icon: Settings,
    gradient: "from-purple-600 to-purple-800",
  },
  {
    title: "Incident Management",
    subtitle: "Track & Resolve",
    desc: "Create, track, and manage incidents",
    href: "/incidents",
    icon: AlertTriangle,
    gradient: "from-blue-600 to-blue-800",
  },
  {
    title: "Request Management",
    subtitle: "Service Requests",
    desc: "Handle and track service requests",
    href: "/requests",
    icon: FileText,
    gradient: "from-green-600 to-green-800",
  },
  {
    title: "Complaint Management",
    subtitle: "Citizen Complaints",
    desc: "Handle and resolve complaints",
    href: "/complaints",
    icon: MessageSquareWarning,
    gradient: "from-orange-500 to-orange-700",
  },
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#0d1117]">
      {/* Topbar */}
      <div className="border-b border-[#30363d] bg-[#0d1117] px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
            <Zap size={16} className="text-white" />
          </div>
          <span className="font-semibold text-white">Automax</span>
        </div>
        <nav className="flex items-center gap-4">
          <Link href="/dashboard" className="bg-[#6e40c9] text-white text-sm px-4 py-1.5 rounded-lg font-medium">Dashboard</Link>
          <Link href="/incidents" className="text-[#8b949e] hover:text-white text-sm transition-colors">Incidents</Link>
          <Link href="/requests" className="text-[#8b949e] hover:text-white text-sm transition-colors">Requests</Link>
          <Link href="/complaints" className="text-[#8b949e] hover:text-white text-sm transition-colors">Complaints</Link>
          <Link href="/admin" className="text-[#8b949e] hover:text-white text-sm transition-colors">Admin</Link>
        </nav>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold">S</div>
          <span className="text-sm text-white">Super Admin</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="mb-8 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
            <Zap size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Welcome back, Super</h1>
            <p className="text-[#8b949e]">What would you like to work on today?</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {modules.map((m) => (
            <Link key={m.href} href={m.href}
              className={`relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br ${m.gradient} cursor-pointer group transition-all duration-200 hover:scale-[1.02] hover:shadow-2xl`}
            >
              <div className="absolute top-4 right-4 opacity-10">
                <m.icon size={80} />
              </div>
              <div className="relative z-10">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-4">
                  <m.icon size={20} className="text-white" />
                </div>
                <h2 className="text-xl font-bold text-white mb-1">{m.title}</h2>
                <p className="text-white/70 text-sm font-medium mb-2">{m.subtitle}</p>
                <p className="text-white/60 text-sm mb-4">{m.desc}</p>
                <div className="flex items-center gap-2 text-white/80 text-sm font-medium group-hover:gap-3 transition-all">
                  <span>Open</span>
                  <ArrowRight size={16} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
