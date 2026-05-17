export type TicketStatus = 'New' | 'New Incident' | 'Under Resolution' | 'Ready to Close' | 'Closed' | 'Rejected' | 'In Progress' | 'Close';
export type Priority = 'Low' | 'Medium' | 'High' | 'Critical';

export interface AuditEntry {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  notes?: string;
}

export interface IncidentRecord {
  id: string;
  number: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: Priority;
  assignee: string;
  department: string;
  classification: string;
  location: string;
  source: 'Portal' | 'Email' | 'Phone' | 'Mobile' | 'IVR';
  sla: 'On Track' | 'Breached';
  created: string;
  due: string;
  lat: number;
  lng: number;
  linkedRequest?: string;
  attachments: string[];
  comments: string[];
  audit: AuditEntry[];
}

export interface RequestRecord {
  id: string;
  number: string;
  title: string;
  description: string;
  status: 'New' | 'In Progress' | 'Close' | 'Completed';
  priority: Priority;
  assignee: string;
  sourceIncidents: string[];
  classification: string;
  created: string;
  audit: AuditEntry[];
}

export interface WorkflowTransition {
  from: TicketStatus;
  label: string;
  to: TicketStatus;
  role: string;
  requires: Array<'attachments' | 'comments' | 'duration' | 'externalDepartment' | 'feedback' | 'requestClassification'>;
  description: string;
}

export const workflowTransitions: WorkflowTransition[] = [
  { from: 'New Incident', label: 'Approve', to: 'Under Resolution', role: 'Agents', requires: [], description: 'Move the incident into resolution.' },
  { from: 'New Incident', label: 'Not Belong', to: 'Closed', role: 'Agents', requires: ['comments', 'externalDepartment'], description: 'Close and route ownership to an external department.' },
  { from: 'New Incident', label: 'Missing Incident Info', to: 'Closed', role: 'Agents', requires: ['feedback'], description: 'Close because mandatory incident information is missing.' },
  { from: 'Under Resolution', label: 'Not Belong', to: 'Ready to Close', role: 'Contractor', requires: ['comments', 'externalDepartment'], description: 'Mark ready to close after documenting external ownership.' },
  { from: 'Under Resolution', label: 'Ready to Close (Resolved)', to: 'Ready to Close', role: 'Contractor', requires: ['comments', 'duration'], description: 'Resolution completed with reversible duration tracking.' },
  { from: 'Under Resolution', label: 'Normal Close', to: 'Ready to Close', role: 'Contractor', requires: ['attachments', 'comments'], description: 'Normal closure with evidence attachments and closure notes.' },
  { from: 'Under Resolution', label: 'Convert to Request', to: 'Ready to Close', role: 'Contractor', requires: ['comments', 'requestClassification'], description: 'Convert the incident into a service request.' },
  { from: 'Under Resolution', label: 'Reject', to: 'Rejected', role: 'Contractor', requires: ['feedback'], description: 'Reject the incident with feedback.' },
  { from: 'Ready to Close', label: 'Final Close', to: 'Closed', role: 'QA Agent', requires: ['comments', 'feedback'], description: 'QA final closure.' },
  { from: 'Ready to Close', label: 'Reopen', to: 'Under Resolution', role: 'Agent', requires: ['comments', 'feedback'], description: 'Reopen from ready to close.' },
  { from: 'Closed', label: 'Reopen', to: 'Under Resolution', role: 'QA Agent', requires: ['comments', 'feedback'], description: 'Reopen a closed incident.' },
  { from: 'Rejected', label: 'Re-Approve', to: 'Under Resolution', role: 'Agents', requires: ['comments'], description: 'Re-approve a rejected incident.' },
];

export const departments = ['Operations', 'Testing Dept', 'Data Analysis Center', 'Network Ops', 'External Ministry', 'Civil Defense'];
export const classifications = ['Bulb', 'Road Damage', 'Animal and Insect', 'Email Server', 'API Gateway', 'Billing', 'Access Request'];
export const locations = ['India > Maharashtra > Kollam', 'India > Karnataka > Bangalore', 'Saudi Arabia > Eastern Province > Ain Dar', 'India > Jharkhand > Jamshedpur'];
export const priorities: Priority[] = ['Low', 'Medium', 'High', 'Critical'];

const now = '2026-05-17T10:00:00.000Z';

export const seedIncidents: IncidentRecord[] = [
  {
    id: '1', number: 'INC-2026-000145', title: 'API Gateway Timeout - Ain Dar', description: 'Gateway timeout impacting citizen portal submissions.', status: 'New Incident', priority: 'Critical', assignee: 'Ali Hassan', department: 'Network Ops', classification: 'API Gateway', location: 'Saudi Arabia > Eastern Province > Ain Dar', source: 'Portal', sla: 'Breached', created: '2026-05-17', due: '2026-05-18', lat: 26.75, lng: 49.62, attachments: [], comments: [], audit: [{ id: 'a1', action: 'Created', user: 'System', timestamp: now }]
  },
  {
    id: '2', number: 'INC-2026-000144', title: 'Bulb - Maharashtra - Kollam', description: 'Street light outage reported by mobile app.', status: 'Under Resolution', priority: 'Medium', assignee: 'contractor1', department: 'Operations', classification: 'Bulb', location: 'India > Maharashtra > Kollam', source: 'Mobile', sla: 'On Track', created: '2026-05-16', due: '2026-05-20', lat: 8.89, lng: 76.61, attachments: ['before-photo.jpg'], comments: ['Assigned to contractor.'], audit: [{ id: 'a2', action: 'Approved', user: 'Agent', timestamp: now }]
  },
  {
    id: '3', number: 'INC-2026-000143', title: 'Animal and Insect - Maharashtra - Pettah', description: 'Citizen complaint about insects near public facility.', status: 'Ready to Close', priority: 'High', assignee: 'QA Agent', department: 'Civil Defense', classification: 'Animal and Insect', location: 'India > Maharashtra > Kollam', source: 'Phone', sla: 'On Track', created: '2026-05-15', due: '2026-05-19', lat: 9.2, lng: 76.5, attachments: ['resolution-proof.jpg'], comments: ['Resolved and awaiting QA.'], audit: [{ id: 'a3', action: 'Ready to Close', user: 'contractor1', timestamp: now }]
  },
  {
    id: '4', number: 'INC-2026-000142', title: 'Email Server Latency', description: 'Delay in email notifications from SLA service.', status: 'Closed', priority: 'Medium', assignee: 'Ali Hassan', department: 'Network Ops', classification: 'Email Server', location: 'India > Karnataka > Bangalore', source: 'Email', sla: 'On Track', created: '2026-05-13', due: '2026-05-16', lat: 12.97, lng: 77.59, attachments: ['mail-log.txt'], comments: ['Patch applied.'], audit: [{ id: 'a4', action: 'Closed', user: 'QA Agent', timestamp: now }]
  },
  {
    id: '5', number: 'INC-2026-000141', title: 'Billing Discrepancy Q1', description: 'Customer reported billing mismatch.', status: 'Rejected', priority: 'Low', assignee: 'Agent', department: 'Data Analysis Center', classification: 'Billing', location: 'India > Jharkhand > Jamshedpur', source: 'IVR', sla: 'On Track', created: '2026-05-12', due: '2026-05-22', lat: 22.8, lng: 86.2, attachments: [], comments: ['Rejected due to duplicate record.'], audit: [{ id: 'a5', action: 'Rejected', user: 'contractor1', timestamp: now }]
  }
];

export const seedRequests: RequestRecord[] = [
  { id: 'r1', number: 'REQ-2026-000010', title: 'VPN Access for New Employee', description: 'Service request for VPN access.', status: 'New', priority: 'Medium', assignee: 'contractor1', sourceIncidents: [], classification: 'Access Request', created: '2026-05-15', audit: [{ id: 'ra1', action: 'Created', user: 'Agent', timestamp: now }] },
  { id: 'r2', number: 'REQ-2026-000009', title: 'Bulb replacement consolidated request', description: 'Generated from repeated street-light incidents.', status: 'In Progress', priority: 'High', assignee: 'contractor1', sourceIncidents: ['INC-2026-000144'], classification: 'Bulb', created: '2026-05-14', audit: [{ id: 'ra2', action: 'Created from incident', user: 'Contractor', timestamp: now }] }
];

export const featureModules = [
  { area: 'Admin Panel', features: ['User export/import', 'Role permissions', 'Departments', 'Locations', 'Classifications', 'Master data', 'Action logs', 'Escalation policies'] },
  { area: 'Workflow Management', features: ['Designer', 'Status SLA', 'Escalation mapping', 'Transitions', 'Required fields', 'Merge and convert rules'] },
  { area: 'Incident Management', features: ['Dashboard cards', 'Map view', 'Advanced filters', 'Create incident', 'Activity history', 'Merge', 'Clone', 'Convert to request'] },
  { area: 'Reports', features: ['Saved templates', 'Report builder', 'Column picker', 'Filters', 'Sorting', 'Export'] },
  { area: 'CCM', features: ['Contacts', 'Call history', 'Email inbox', 'SMS hub', 'Complaint audio'] },
  { area: 'Requests/Complaints/Queries', features: ['View details', 'Source incident links', 'Close with reply', 'Process requests'] },
];

export function nextRequestNumber(existing: RequestRecord[]) {
  const max = existing.reduce((acc, request) => {
    const value = Number(request.number.split('-').pop() ?? '0');
    return Number.isFinite(value) ? Math.max(acc, value) : acc;
  }, 10);
  return `REQ-2026-${String(max + 1).padStart(6, '0')}`;
}

export function statusColor(status: string) {
  if (status.includes('Closed') || status === 'Close' || status === 'Completed') return 'badge-green';
  if (status.includes('Ready')) return 'badge-blue';
  if (status.includes('Under') || status.includes('Progress')) return 'badge-yellow';
  if (status.includes('Rejected') || status.includes('Breached')) return 'badge-red';
  return 'badge-gray';
}

export function priorityColor(priority?: string | null) {
  if (priority === 'Critical') return 'badge-red';
  if (priority === 'High') return 'badge-orange';
  if (priority === 'Medium') return 'badge-yellow';
  if (priority === 'Low') return 'badge-blue';
  return 'badge-gray';
}
