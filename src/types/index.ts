export type ContactStatus =
  | 'New'
  | 'Lead'
  | 'Contacted'
  | 'Qualified'
  | 'Customer'
  | 'lead'
  | 'qualified'
  | 'customer'
  | 'contacted'
  | 'new'
  | string;

export interface Contact {
  id: string | number;
  name?: string | null;
  company?: string | null;
  email: string;
  phone?: string | null;
  status?: ContactStatus | null;
  lastUpdated?: string;
  createdAt?: string;
  created_at?: string;
  updated_at?: string;
}

export type MeetingStatus =
  | 'Scheduled'
  | 'Pending'
  | 'Cancelled'
  | 'Completed'
  | 'scheduled'
  | 'pending'
  | 'cancelled'
  | 'completed'
  | string;

export interface Meeting {
  id: string | number;
  title: string;
  client?: string;
  contact_id?: number | null;
  email?: string;
  date: string;
  time: string;
  durationMinutes?: number;
  duration_minutes?: number;
  status: MeetingStatus;
  notes?: string | null;
  description?: string | null;
  createdAt?: string;
  created_at?: string;
}

export type ToolExecutionStatus =
  | 'requested'
  | 'executing'
  | 'running'
  | 'success'
  | 'failed'
  | 'skipped'
  | 'requires_confirmation'
  | 'created'
  | 'updated'
  | string;

export interface ToolCall {
  id: string | number;
  name: string;
  arguments: Record<string, unknown> | string;
  status: ToolExecutionStatus;
  result?: Record<string, unknown> | string | null;
  reason?: string | null;
}

export interface ExtractedContact {
  name?: string | null;
  company?: string | null;
  email?: string | null;
  phone?: string | null;
}

export interface ExtractedRequirement {
  module: string;
  description: string;
  priority?: 'low' | 'medium' | 'high';
}

export interface MeetingRequestAnalysis {
  requested: boolean;
  dateSpecified?: boolean;
  timeSpecified?: boolean;
  date?: string | null;
  time?: string | null;
  notes?: string;
}

export interface AIAnalysis {
  contact?: ExtractedContact;
  intent?: string | null;
  requirements?: Array<ExtractedRequirement | string>;
  meetingRequest?: MeetingRequestAnalysis;
  missingInformation?: string[];
  confirmedInformation?: string[];
  inferredInformation?: string[];
}

export type RunStatus = 'created' | 'analyzing' | 'requires_action' | 'executing_tools' | 'completing' | 'completed' | 'failed' | string;

export interface Run {
  id: string | number;
  emailId?: string | number;
  createdAt: string;
  provider: string;
  model: string;
  status: RunStatus;
  inputEmail: {
    sender: string;
    subject: string;
    body: string;
  };
  analysis?: AIAnalysis | null;
  toolCalls: ToolCall[];
  finalResponse?: string | null;
  error?: string | null;
}

export interface EmailSubmission {
  sender: string;
  subject: string;
  body: string;
}

export interface DashboardMetrics {
  emailsProcessed: number;
  contactsCount: number;
  meetingsScheduled: number;
  pendingActions: number;
  successfulToolExecutions: number;
  failedToolExecutions: number;
}
