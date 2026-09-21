import type {
  Contact,
  Meeting,
  Run,
  DashboardMetrics,
  EmailSubmission,
  ToolCall,
  AIAnalysis,
} from '../types';
import {
  INITIAL_CONTACTS,
  INITIAL_MEETINGS,
  INITIAL_RUNS,
  simulateAIAnalysis,
} from './mock-data';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

interface BackendEmail {
  id: number;
  sender: string;
  subject: string;
  body: string;
  received_at: string;
  processed: boolean;
}

interface BackendToolExecution {
  id: number;
  tool_name: string;
  arguments: string;
  result: string | null;
  status: string;
  error_message: string | null;
}

interface BackendAnalysis {
  intent?: string | null;
  contact?: {
    name?: string | null;
    company?: string | null;
    email?: string | null;
    phone?: string | null;
  };
  requirements?: string[];
  meeting_request?: {
    requested: boolean;
    date?: string | null;
    time?: string | null;
  };
  missing_information?: string[];
  summary?: string | null;
}

interface BackendProcessResponse {
  run_id: number;
  email: BackendEmail;
  status: string;
  provider: string;
  model: string;
  analysis: BackendAnalysis | null;
  tool_executions: BackendToolExecution[];
  final_response: string | null;
  error_message: string | null;
}

interface BackendRunSummary {
  id: number;
  email_id: number;
  status: string;
  provider: string;
  model: string;
  started_at: string;
  finished_at: string | null;
  final_response: string | null;
  error_message: string | null;
}

interface BackendContact {
  id: number;
  name: string | null;
  company: string | null;
  email: string;
  phone: string | null;
  status: string | null;
  created_at: string;
  updated_at: string;
}

interface BackendMeeting {
  id: number;
  title: string;
  contact_id: number | null;
  date: string;
  time: string;
  duration_minutes: number;
  description: string | null;
  status: string;
  created_at: string;
}

function parseJsonSafe(value: string | null | undefined): Record<string, unknown> | null {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function cleanOptionalFields(value: Record<string, unknown> | null): Record<string, unknown> | null {
  if (!value) return null;
  return Object.fromEntries(
    Object.entries(value).filter(([, fieldValue]) => {
      if (fieldValue === null || fieldValue === undefined) return false;
      if (Array.isArray(fieldValue) && fieldValue.length === 0) return false;
      return true;
    })
  );
}

const SPANISH_MONTHS: Record<string, string> = {
  enero: '01',
  febrero: '02',
  marzo: '03',
  abril: '04',
  mayo: '05',
  junio: '06',
  julio: '07',
  agosto: '08',
  septiembre: '09',
  octubre: '10',
  noviembre: '11',
  diciembre: '12',
};

function inferMeetingRequest(email: { subject: string; body: string }) {
  const text = `${email.subject}\n${email.body}`;
  const requested = /reuni[oó]n|agendar|demo|reunirnos|juntarnos/i.test(text);
  const isoDate = text.match(/\b(20\d{2})-(\d{1,2})-(\d{1,2})\b/);
  const spanishDate = text.match(/\b(\d{1,2})\s+de\s+(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)\s+de\s+(20\d{2})\b/i);
  const date = isoDate
    ? `${isoDate[1]}-${isoDate[2].padStart(2, '0')}-${isoDate[3].padStart(2, '0')}`
    : spanishDate
    ? `${spanishDate[3]}-${SPANISH_MONTHS[spanishDate[2].toLowerCase()]}-${spanishDate[1].padStart(2, '0')}`
    : null;
  const timeMatch = text.match(/\b(\d{1,2}):(\d{2})\s*(a\.?\s*m\.?|p\.?\s*m\.?)?\b/i);
  let time = timeMatch ? `${timeMatch[1].padStart(2, '0')}:${timeMatch[2]}` : null;
  if (time && timeMatch?.[3]) {
    const meridiem = timeMatch[3].replace(/\./g, '').replace(/\s/g, '').toLowerCase();
    let [hour, minute] = time.split(':').map(Number);
    if (meridiem === 'pm' && hour < 12) hour += 12;
    if (meridiem === 'am' && hour === 12) hour = 0;
    time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
  }
  return {
    requested,
    dateSpecified: Boolean(date),
    timeSpecified: Boolean(time),
    date,
    time,
  };
}

function normalizeToolExecutions(executions: BackendToolExecution[]): ToolCall[] {
  if (!Array.isArray(executions)) return [];
  return executions.map((te) => {
    const parsedArgs = parseJsonSafe(te.arguments) || te.arguments;
    const parsedResult = cleanOptionalFields(parseJsonSafe(te.result));
    const parsedReason = parsedResult?.reason;
    const parsedMessage = parsedResult?.message;
    const reason =
      te.error_message ||
      (parsedReason !== null && parsedReason !== undefined && String(parsedReason).trim() !== ''
        ? String(parsedReason)
        : (te.status === 'failed' || te.status === 'skipped') && parsedMessage
        ? String(parsedMessage)
        : undefined);

    return {
      id: te.id,
      name: te.tool_name,
      arguments: parsedArgs,
      status: te.status,
      result: parsedResult || te.result,
      reason,
    };
  });
}

function normalizeAnalysis(raw: BackendAnalysis | null, email?: { sender: string; subject: string; body: string }): AIAnalysis {
  if (!raw) {
    // Generar fallback seguro a partir de los datos del correo
    const sender = email?.sender || '';
    const subject = email?.subject || '';
    const meetingRequest = email ? inferMeetingRequest(email) : { requested: false, dateSpecified: false, timeSpecified: false, date: null, time: null };
    return {
      contact: {
        name: sender.split('@')[0] || 'Contacto',
        company: sender.split('@')[1]?.split('.')[0] || 'Empresa',
        email: sender,
      },
      intent: subject ? `Requerimiento sobre: ${subject}` : 'Consulta de cliente',
      requirements: subject ? [subject] : [],
      meetingRequest,
      missingInformation: [
        ...(meetingRequest.requested && !meetingRequest.dateSpecified ? ['Fecha exacta para la reunión'] : []),
        ...(meetingRequest.requested && !meetingRequest.timeSpecified ? ['Hora exacta para la reunión'] : []),
      ],
      confirmedInformation: [sender ? `Remitente: ${sender}` : 'Correo recibido'],
      inferredInformation: [],
    };
  }

  const meetingReq = raw.meeting_request;
  const hasDate = Boolean(meetingReq?.date);
  const hasTime = Boolean(meetingReq?.time);

  return {
    contact: {
      name: raw.contact?.name || (email?.sender.split('@')[0] ?? 'Contacto'),
      company: raw.contact?.company || 'Empresa',
      email: raw.contact?.email || email?.sender || '',
      phone: raw.contact?.phone || undefined,
    },
    intent: raw.intent || raw.summary || 'Procesamiento de solicitud de cliente',
    requirements: raw.requirements || [],
    meetingRequest: {
      requested: meetingReq?.requested ?? false,
      dateSpecified: hasDate,
      timeSpecified: hasTime,
      date: meetingReq?.date || null,
      time: meetingReq?.time || null,
    },
    missingInformation: raw.missing_information || [],
    confirmedInformation: [
      raw.contact?.name ? `Nombre: ${raw.contact.name}` : '',
      raw.contact?.company ? `Empresa: ${raw.contact.company}` : '',
      raw.contact?.email ? `Email: ${raw.contact.email}` : '',
    ].filter(Boolean),
    inferredInformation: raw.summary ? [raw.summary] : [],
  };
}

class LocalStore {
  private contacts: Contact[];
  private meetings: Meeting[];
  private runs: Run[];

  constructor() {
    this.contacts = [...INITIAL_CONTACTS];
    this.meetings = [...INITIAL_MEETINGS];
    this.runs = [...INITIAL_RUNS];
  }

  getContacts(): Contact[] {
    return [...this.contacts];
  }

  addOrUpdateContact(contactData: Partial<Contact> & { email: string; name: string }): Contact {
    const existingIndex = this.contacts.findIndex(
      (c) => c.email.toLowerCase() === contactData.email.toLowerCase()
    );

    if (existingIndex >= 0) {
      const updated: Contact = {
        ...this.contacts[existingIndex],
        ...contactData,
        lastUpdated: new Date().toISOString(),
      };
      this.contacts[existingIndex] = updated;
      return updated;
    } else {
      const newContact: Contact = {
        id: `c-${Date.now()}`,
        name: contactData.name,
        company: contactData.company || 'Empresa',
        email: contactData.email,
        phone: contactData.phone,
        status: contactData.status || 'Lead',
        lastUpdated: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };
      this.contacts.unshift(newContact);
      return newContact;
    }
  }

  addMeeting(meetingData: Omit<Meeting, 'id' | 'createdAt'>): Meeting {
    const existing = this.meetings.find(
      (meeting) =>
        meeting.title === meetingData.title &&
        meeting.date === meetingData.date &&
        meeting.time === meetingData.time
    );
    if (existing) return existing;

    const meeting: Meeting = {
      ...meetingData,
      id: `m-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.meetings.unshift(meeting);
    return meeting;
  }

  getMeetings(): Meeting[] {
    return [...this.meetings];
  }

  getRuns(): Run[] {
    return [...this.runs];
  }

  getRunById(id: string | number): Run | undefined {
    return this.runs.find((r) => String(r.id) === String(id));
  }

  addRun(run: Run): void {
    this.runs.unshift(run);
  }
}

const localStore = new LocalStore();

export const api = {
  /**
   * Process email using backend API or local mock engine
   */
  async processEmail(submission: EmailSubmission): Promise<Run> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/emails/process`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submission),
      });

      if (response.ok) {
        const data: BackendProcessResponse = await response.json();
        const toolCalls = normalizeToolExecutions(data.tool_executions);
        const analysis = normalizeAnalysis(data.analysis, {
          sender: data.email.sender,
          subject: data.email.subject,
          body: data.email.body,
        });

        return {
          id: data.run_id,
          emailId: data.email.id,
          createdAt: data.email.received_at || new Date().toISOString(),
          provider: data.provider,
          model: data.model,
          status: data.status,
          inputEmail: {
            sender: data.email.sender,
            subject: data.email.subject,
            body: data.email.body,
          },
          analysis,
          toolCalls,
          finalResponse: data.final_response,
          error: data.error_message || undefined,
        };
      }
    } catch (err) {
      console.warn('Backend API request failed, falling back to local simulation:', err);
    }

    // Local simulation fallback
    await new Promise((resolve) => setTimeout(resolve, 600));
    const { analysis, toolCalls, finalResponse } = simulateAIAnalysis(submission);

    for (const tc of toolCalls) {
      if (tc.name === 'actualizar_contacto_en_crm' && tc.status === 'success') {
        const args = tc.arguments as { name?: string; company?: string; email?: string; status?: string };
        localStore.addOrUpdateContact({
          name: args.name || analysis.contact?.name || 'Contacto',
          company: args.company || analysis.contact?.company || 'Empresa',
          email: args.email || analysis.contact?.email || submission.sender,
          status: args.status || 'Lead',
        });
      }

      if (tc.name === 'agendar_reunion_en_calendar' && tc.status === 'success') {
        const args = tc.arguments as {
          title?: string;
          date?: string;
          time?: string;
          duration_minutes?: number;
          description?: string;
        };
        if (args.title && args.date && args.time) {
          localStore.addMeeting({
            title: args.title,
            date: args.date,
            time: args.time,
            durationMinutes: args.duration_minutes || 30,
            status: 'Scheduled',
            notes: args.description,
          });
        }
      }
    }

    const run: Run = {
      id: `run-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString(),
      provider: 'Mock AI',
      model: 'utp-consult-v1',
      status: 'completed',
      inputEmail: submission,
      analysis,
      toolCalls,
      finalResponse,
    };

    localStore.addRun(run);
    return run;
  },

  async getContacts(): Promise<Contact[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/contacts`);
      if (res.ok) {
        const rawContacts: BackendContact[] = await res.json();
        return rawContacts.map((c) => ({
          id: c.id,
          name: c.name || 'Sin Nombre',
          company: c.company || 'Empresa',
          email: c.email,
          phone: c.phone || undefined,
          status: c.status ? c.status.charAt(0).toUpperCase() + c.status.slice(1) : 'Lead',
          lastUpdated: c.updated_at,
          createdAt: c.created_at,
        }));
      }
    } catch {
      // fallback
    }
    return localStore.getContacts();
  },

  async getMeetings(): Promise<Meeting[]> {
    try {
      const [resMeetings, resContacts] = await Promise.all([
        fetch(`${API_BASE_URL}/api/meetings`),
        fetch(`${API_BASE_URL}/api/contacts`),
      ]);

      if (resMeetings.ok) {
        const rawMeetings: BackendMeeting[] = await resMeetings.json();
        let contactsMap = new Map<number, string>();
        if (resContacts.ok) {
          const rawContacts: BackendContact[] = await resContacts.json();
          contactsMap = new Map(rawContacts.map((c) => [c.id, `${c.name || 'Cliente'} (${c.company || 'Empresa'})`]));
        }

        return rawMeetings.map((m) => ({
          id: m.id,
          title: m.title,
          client: (m.contact_id && contactsMap.get(m.contact_id)) || 'Cliente de Consultoría',
          contact_id: m.contact_id,
          date: m.date,
          time: m.time.slice(0, 5),
          durationMinutes: m.duration_minutes,
          status: m.status ? m.status.charAt(0).toUpperCase() + m.status.slice(1) : 'Scheduled',
          notes: m.description || undefined,
          createdAt: m.created_at,
        }));
      }
    } catch {
      // fallback
    }
    return localStore.getMeetings();
  },

  async getRuns(): Promise<Run[]> {
    try {
      const [resRuns, resEmails] = await Promise.all([
        fetch(`${API_BASE_URL}/api/runs`),
        fetch(`${API_BASE_URL}/api/emails`),
      ]);

      if (resRuns.ok) {
        const rawRuns: BackendRunSummary[] = await resRuns.json();
        let emailsMap = new Map<number, BackendEmail>();

        if (resEmails.ok) {
          const rawEmails: BackendEmail[] = await resEmails.json();
          emailsMap = new Map(rawEmails.map((e) => [e.id, e]));
        }

        return rawRuns.map((r) => {
          const email = emailsMap.get(r.email_id);
          return {
            id: r.id,
            emailId: r.email_id,
            createdAt: r.started_at,
            provider: r.provider,
            model: r.model,
            status: r.status,
            inputEmail: {
              sender: email?.sender || `ID Correo: #${r.email_id}`,
              subject: email?.subject || `Ejecución #${r.id}`,
              body: email?.body || '',
            },
            toolCalls: [],
            finalResponse: r.final_response,
            error: r.error_message || undefined,
          };
        });
      }
    } catch {
      // fallback
    }
    return localStore.getRuns();
  },

  async getRunById(id: string | number): Promise<Run | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/runs/${id}`);
      if (res.ok) {
        const data: BackendProcessResponse = await res.json();
        const toolCalls = normalizeToolExecutions(data.tool_executions);
        const analysis = normalizeAnalysis(data.analysis, {
          sender: data.email.sender,
          subject: data.email.subject,
          body: data.email.body,
        });

        return {
          id: data.run_id,
          emailId: data.email.id,
          createdAt: data.email.received_at || new Date().toISOString(),
          provider: data.provider,
          model: data.model,
          status: data.status,
          inputEmail: {
            sender: data.email.sender,
            subject: data.email.subject,
            body: data.email.body,
          },
          analysis,
          toolCalls,
          finalResponse: data.final_response,
          error: data.error_message || undefined,
        };
      }
    } catch {
      // fallback
    }
    return localStore.getRunById(id) || null;
  },

  async getDashboardMetrics(): Promise<DashboardMetrics> {
    // Calculamos métricas en base a datos reales del backend
    try {
      const [contacts, meetings, runs] = await Promise.all([
        this.getContacts(),
        this.getMeetings(),
        this.getRuns(),
      ]);

      let pendingActions = 0;
      let successfulTools = 0;
      let failedTools = 0;

      // Consultar últimos runs para contabilizar tools
      const recentRunsWithDetails = await Promise.all(
        runs.slice(0, 5).map((r) => this.getRunById(r.id))
      );

      for (const r of recentRunsWithDetails) {
        if (!r) continue;
        for (const tc of r.toolCalls) {
          if (tc.status === 'success' || tc.status === 'created' || tc.status === 'updated') {
            successfulTools++;
          } else if (tc.status === 'skipped') {
            pendingActions++;
          } else if (tc.status === 'failed') {
            failedTools++;
          }
        }
      }

      return {
        emailsProcessed: runs.length,
        contactsCount: contacts.length,
        meetingsScheduled: meetings.filter(
          (m) => String(m.status).toLowerCase() === 'scheduled'
        ).length,
        pendingActions,
        successfulToolExecutions: successfulTools,
        failedToolExecutions: failedTools,
      };
    } catch {
      return {
        emailsProcessed: 0,
        contactsCount: 0,
        meetingsScheduled: 0,
        pendingActions: 0,
        successfulToolExecutions: 0,
        failedToolExecutions: 0,
      };
    }
  },

  async checkBackendHealth(): Promise<{ online: boolean; provider?: string }> {
    try {
      const [healthRes, providersRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/health`, { method: 'GET', signal: AbortSignal.timeout(2000) }),
        fetch(`${API_BASE_URL}/api/ai/providers`, { method: 'GET', signal: AbortSignal.timeout(2000) }),
      ]);

      if (healthRes.ok) {
        let providerLabel = 'FastAPI';
        if (providersRes.ok) {
          const providersList: Array<{ name: string; model: string; configured: boolean }> = await providersRes.json();
          const configured = providersList.filter((p) => p.configured);
          if (configured.length > 0) {
            providerLabel = configured.map((p) => `${p.name.toUpperCase()} (${p.model})`).join(' | ');
          }
        }
        return { online: true, provider: providerLabel };
      }
    } catch {
      // offline
    }
    return { online: false, provider: 'Simulación Local (Demo)' };
  },
};
