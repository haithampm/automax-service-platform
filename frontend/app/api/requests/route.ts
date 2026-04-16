import { NextRequest, NextResponse } from 'next/server';

let requests = [
  { id: 'REQ-001', title: 'New Laptop Request', description: 'Need a new laptop for development work', status: 'pending', priority: 'medium', category: 'Hardware', source: 'Portal', assignee: 'IT Team', created_at: new Date().toISOString() },
  { id: 'REQ-002', title: 'Software License', description: 'Adobe Creative Suite license needed', status: 'approved', priority: 'low', category: 'Software', source: 'Email', assignee: 'Procurement', created_at: new Date(Date.now()-86400000).toISOString() },
  { id: 'REQ-003', title: 'VPN Access', description: 'Remote VPN access for new employee', status: 'in_progress', priority: 'high', category: 'Access', source: 'Portal', assignee: 'Network Team', created_at: new Date(Date.now()-3600000).toISOString() },
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search') || '';
  const status = searchParams.get('status') || '';
  const priority = searchParams.get('priority') || '';
  const page = Number(searchParams.get('page') || 1);
  const limit = Number(searchParams.get('limit') || 10);

  let filtered = requests;
  if (search) filtered = filtered.filter(r => r.title.toLowerCase().includes(search.toLowerCase()) || r.id.toLowerCase().includes(search.toLowerCase()));
  if (status) filtered = filtered.filter(r => r.status === status);
  if (priority) filtered = filtered.filter(r => r.priority === priority);

  const total = filtered.length;
  const data = filtered.slice((page-1)*limit, page*limit);
  return NextResponse.json({ requests: data, total, page, totalPages: Math.ceil(total/limit) });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const newReq = {
    id: `REQ-${String(requests.length + 1).padStart(3,'0')}`,
    ...body,
    status: 'pending',
    created_at: new Date().toISOString(),
  };
  requests.unshift(newReq);
  return NextResponse.json(newReq, { status: 201 });
}
