import { NextResponse } from 'next/server';

export async function GET() {
  // Mock dashboard statistics - connect to real DB in production
  const stats = {
    incidents: { total: 127, open: 45, in_progress: 23, resolved: 52, closed: 7, critical: 8, high: 19, sla_breached: 5 },
    requests: { total: 89, pending: 34, approved: 28, in_progress: 15, completed: 12 },
    complaints: { total: 56, open: 21, in_progress: 14, escalated: 3, resolved: 18 },
    workflows: { total: 12, active: 9, inactive: 3 },
    recent_incidents: [
      { id: 'INC-001', title: 'Server Down - Production', status: 'open', priority: 'critical', created_at: new Date().toISOString() },
      { id: 'INC-002', title: 'Email Service Disruption', status: 'in_progress', priority: 'high', created_at: new Date(Date.now()-3600000).toISOString() },
      { id: 'INC-003', title: 'VPN Connectivity Issue', status: 'open', priority: 'medium', created_at: new Date(Date.now()-7200000).toISOString() },
      { id: 'INC-004', title: 'Printer Malfunction', status: 'resolved', priority: 'low', created_at: new Date(Date.now()-86400000).toISOString() },
    ],
    chart_data: {
      incidents_by_day: [
        { day: 'Mon', incidents: 12, requests: 8, complaints: 5 },
        { day: 'Tue', incidents: 18, requests: 12, complaints: 7 },
        { day: 'Wed', incidents: 9, requests: 15, complaints: 4 },
        { day: 'Thu', incidents: 22, requests: 10, complaints: 9 },
        { day: 'Fri', incidents: 15, requests: 18, complaints: 6 },
        { day: 'Sat', incidents: 6, requests: 5, complaints: 2 },
        { day: 'Sun', incidents: 4, requests: 3, complaints: 1 },
      ],
      incidents_by_status: [
        { status: 'Open', count: 45, color: '#2188ff' },
        { status: 'In Progress', count: 23, color: '#f0a500' },
        { status: 'Resolved', count: 52, color: '#22c55e' },
        { status: 'Closed', count: 7, color: '#6b7280' },
      ],
      incidents_by_priority: [
        { priority: 'Critical', count: 8, color: '#ef4444' },
        { priority: 'High', count: 19, color: '#f97316' },
        { priority: 'Medium', count: 63, color: '#eab308' },
        { priority: 'Low', count: 37, color: '#22c55e' },
      ],
    },
  };
  return NextResponse.json(stats);
}
