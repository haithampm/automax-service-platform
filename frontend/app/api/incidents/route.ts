import { NextRequest, NextResponse } from 'next/server';

// Mock data - replace with real DB in production
let incidents = [
  { id: 'INC-001', title: 'Server Down - Production', description: 'Main production server is not responding', status: 'open', priority: 'critical', category: 'Infrastructure', source: 'Monitoring', assignee: 'Ahmed Ali', department: 'IT', created_at: new Date().toISOString(), sla_due: new Date(Date.now()+2*3600000).toISOString() },
  { id: 'INC-002', title: 'Email Service Disruption', description: 'Users unable to send emails', status: 'in_progress', priority: 'high', category: 'Email', source: 'Portal', assignee: 'Sara Mohamed', department: 'IT', created_at: new Date(Date.now()-3600000).toISOString(), sla_due: new Date(Date.now()+5*3600000).toISOString() },
  { id: 'INC-003', title: 'Printer Not Working', description: 'Printer on 3rd floor not printing', status: 'resolved', priority: 'low', category: 'Hardware', source: 'Email', assignee: 'Khalid Omar', department: 'Admin', created_at: new Date(Date.now()-86400000).toISOString(), sla_due: new Date(Date.now()+70*3600000).toISOString() },
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search') || '';
  const status = searchParams.get('status') || '';
  const priority = searchParams.get('priority') || '';
  const page = Number(searchParams.get('page') || 1);
  const limit = Number(searchParams.get('limit') || 10);

  let filtered = incidents;
  if (search) filtered = filtered.filter(i => i.title.toLowerCase().includes(search.toLowerCase()) || i.id.toLowerCase().includes(search.toLowerCase()));
  if (status) filtered = filtered.filter(i => i.status === status);
  if (priority) filtered = filtered.filter(i => i.priority === priority);

  const total = filtered.length;
  const data = filtered.slice((page-1)*limit, page*limit);
  return NextResponse.json({ incidents: data, total, page, totalPages: Math.ceil(total/limit) });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const newIncident = {
    id: `INC-${String(incidents.length + 1).padStart(3,'0')}`,
    ...body,
    status: 'open',
    created_at: new Date().toISOString(),
    sla_due: new Date(Date.now() + 24*3600000).toISOString(),
  };
  incidents.unshift(newIncident);
  return NextResponse.json(newIncident, { status: 201 });
}
