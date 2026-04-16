export type Status = 'open' | 'in_progress' | 'resolved' | 'closed' | 'pending' | 'approved' | 'escalated' | 'cancelled';
export type Priority = 'low' | 'medium' | 'high' | 'critical';
export type Source = 'portal' | 'email' | 'phone' | 'chat' | 'monitoring' | 'api';

export interface BaseTicket {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  category: string;
  source: string;
  assignee: string;
  department?: string;
  created_at: string;
  updated_at?: string;
  sla_due?: string;
  sla_breached?: boolean;
  tags?: string[];
}

export interface Incident extends BaseTicket {
  type: 'incident';
  affected_systems?: string[];
  resolution?: string;
  root_cause?: string;
}

export interface ServiceRequest extends BaseTicket {
  type: 'request';
  fulfillment_date?: string;
  approved_by?: string;
  cost?: number;
}

export interface Complaint extends BaseTicket {
  type: 'complaint';
  customer_name?: string;
  customer_email?: string;
  escalation_level?: number;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  type: 'incident' | 'request' | 'complaint';
  trigger: 'manual' | 'auto' | 'scheduled';
  active: boolean;
  steps_count: number;
  run_count: number;
  created_at: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'agent' | 'viewer';
  department: string;
  status: 'active' | 'inactive';
  last_login?: string;
  avatar?: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  users_count: number;
  system: boolean;
}

export interface DashboardStats {
  incidents: { total: number; open: number; in_progress: number; resolved: number; closed: number; critical: number; high: number; sla_breached: number; };
  requests: { total: number; pending: number; approved: number; in_progress: number; completed: number; };
  complaints: { total: number; open: number; in_progress: number; escalated: number; resolved: number; };
  workflows: { total: number; active: number; inactive: number; };
  recent_incidents: Partial<Incident>[];
  chart_data: { incidents_by_day: any[]; incidents_by_status: any[]; incidents_by_priority: any[]; };
}
