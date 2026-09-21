# UTP Assistant — Frontend Skill

## 1. Project Context

You are working on the frontend of **UTP Assistant**, a local-only MVP for an academic project.

UTP Assistant is an AI-powered internal assistant designed to help a software consultancy process incoming customer emails and identify actions that should be performed.

The original academic case describes a system that receives customer emails, extracts requirements, updates a CRM, schedules follow-up meetings, and can create project-management tasks. For this MVP, the scope has intentionally been reduced.

### Current MVP scope

The frontend must focus on:

1. Processing simulated emails.
2. Displaying AI analysis results.
3. Displaying simulated CRM contacts.
4. Displaying simulated calendar meetings.
5. Showing AI execution history / Runs.
6. Showing the actions requested by the AI through tool calls.
7. Clearly communicating successful, pending, failed, or skipped actions.

### Explicitly out of scope

Do NOT implement:

- Jira integration.
- Real Google Calendar integration.
- Real Gmail integration.
- Real CRM integration.
- OAuth.
- User authentication.
- Production deployment.
- Cloud infrastructure.
- Payment systems.
- Real-time collaboration.
- Production-grade multi-tenancy.

All integrations are simulated locally by the backend.

---

# 2. Main Product Concept

The application represents an internal dashboard for a consultancy team.

The main workflow is:

```text
User enters an email
        ↓
Frontend sends email to FastAPI
        ↓
Backend sends content to AI provider
        ↓
AI analyzes the email
        ↓
AI may request tool calls
        ↓
Backend simulates CRM / Calendar actions
        ↓
Backend returns execution results
        ↓
Frontend displays the complete Run
```

The frontend must make this workflow visually understandable.

The user should be able to see:

- What email was processed.
- What the AI understood.
- What information was extracted.
- What actions the AI requested.
- Which tools were executed.
- Which actions were successful.
- Which actions could not be executed.
- Why an action was skipped.
- The final AI response.

---

# 3. Technology Stack

Use the following stack unless a strong technical reason requires an alternative.

## Required

- React
- TypeScript
- Vite
- Bun as package manager/runtime
- Tailwind CSS

## Recommended UI

- shadcn/ui
- Lucide React icons

## State management

Prefer React's built-in state management for the MVP.

Use:

- `useState`
- `useEffect`
- `useMemo`
- custom hooks when useful

Do NOT introduce Redux, Zustand, Jotai, or another global state library unless the application complexity actually requires it.

## Routing

Use React Router if multiple routes are required.

## Package manager

**Bun is mandatory.**

Use:

```bash
bun install
bun add <package>
bun remove <package>
bun run <script>
```

Do NOT use:

```bash
npm install
npm run
yarn
pnpm
```

Do not generate `package-lock.json`, `yarn.lock`, or `pnpm-lock.yaml`.

The repository should use:

```text
bun.lock
```

---

# 4. Local-Only Architecture

The application runs entirely on the developer's machine.

Expected architecture:

```text
┌─────────────────────────────────────────┐
│           React Frontend                │
│                                         │
│  Dashboard                              │
│  Email Processor                        │
│  CRM                                    │
│  Calendar                               │
│  Runs                                   │
└───────────────────┬─────────────────────┘
                    │
                    │ HTTP / REST
                    ▼
┌─────────────────────────────────────────┐
│              FastAPI Backend             │
│                                         │
│  AI Orchestrator                        │
│  Tool Orchestrator                      │
│  Business Logic                         │
│  SQLite                                 │
└─────────────────────────────────────────┘
```

The frontend does NOT communicate directly with Gemini, Ollama, SQLite, or any simulated external system.

The frontend communicates exclusively with the backend API.

---

# 5. AI Provider Context

The backend may support multiple AI providers:

```text
AI Provider
├── Gemini
└── Ollama
```

The frontend must therefore avoid assuming that Gemini is the only possible provider.

When the backend exposes provider/model information, display it in the UI where useful.

Example:

```text
AI Provider: Gemini
Model: <model-name>
```

or:

```text
AI Provider: Ollama
Model: <model-name>
```

Do not put API keys or AI provider credentials in the frontend.

Never use:

```text
VITE_GEMINI_API_KEY
```

or equivalent client-side API credentials.

AI credentials belong exclusively to the backend.

---

# 6. Core Frontend Modules

The MVP should contain the following primary modules.

## 6.1 Dashboard

Provides an overview of the assistant.

Display metrics such as:

```text
Emails processed
Contacts created/updated
Meetings scheduled
Pending actions
Successful tool executions
Failed tool executions
```

The dashboard should also show recent Runs or recently processed emails.

---

## 6.2 Email Processor

Main feature of the application.

The user should be able to enter a simulated email.

Fields:

```text
Sender
Subject
Body
```

Example:

```text
Sender:
ana@techcorp.com

Subject:
Reunión - Módulo de pagos

Body:
Hola equipo de UTP Consult, gracias por la propuesta.
Nos interesa avanzar. ¿Podríamos tener una reunión
la próxima semana para discutir los detalles técnicos
del módulo de pagos?

Adjunto un documento con algunos requisitos iniciales.

Saludos,
Ana Torres
TechCorp
```

Provide a clear primary action:

```text
Procesar con IA
```

While processing, show a loading state.

Do not allow duplicate submissions while a request is being processed.

---

# 7. Email Analysis UI

After processing an email, show structured information extracted by the backend.

Possible sections:

### Contact

```text
Name
Company
Email
```

### Intent

```text
Customer wants to move forward with the proposal.
```

### Requirements

```text
Module: Payments
Description: Discuss technical details
```

### Meeting request

```text
Requested: Yes
Date: Missing
Time: Missing
```

### Missing information

```text
Exact meeting date
Exact meeting time
```

The UI must clearly distinguish between:

- confirmed information;
- inferred information;
- missing information.

Never visually imply that missing information was automatically invented.

---

# 8. CRM Module

The CRM is simulated.

The frontend should provide a simple contacts interface.

Recommended columns:

```text
Name
Company
Email
Phone
Status
Last updated
```

Possible statuses:

```text
New
Lead
Contacted
Qualified
Customer
```

The actual allowed statuses should follow the backend contract.

The frontend must not invent CRM business rules.

If the backend reports:

```json
{
  "status": "created"
}
```

display that the contact was created.

If it reports:

```json
{
  "status": "updated"
}
```

display that the contact was updated.

---

# 9. Calendar Module

The Calendar is simulated.

The frontend should provide a clear visualization of meetings stored by the backend.

For the MVP, a simple calendar/list interface is sufficient.

Each meeting may display:

```text
Title
Client
Date
Time
Duration
Status
```

Possible statuses:

```text
Scheduled
Pending
Cancelled
Completed
```

Do not imply that meetings are synchronized with Google Calendar.

Use labels such as:

```text
Simulated Calendar
```

or:

```text
Local Calendar
```

when appropriate.

---

# 10. Runs / Execution History

This is an important technical feature.

The frontend must expose the lifecycle of an AI execution.

Conceptually:

```text
Email
  ↓
AI analysis
  ↓
Tool calls
  ↓
Tool execution
  ↓
Tool results
  ↓
Final response
```

A Run detail view should display this sequence.

Example:

```text
RUN #12

✓ Email received

✓ AI analysis completed

✓ Tool call:
  actualizar_contacto_en_crm

✓ CRM contact updated

⚠ Tool call:
  agendar_reunion

⚠ Not executed

Reason:
Missing date and time

✓ Final AI response generated
```

This interface is important because the academic assignment evaluates the design of the interaction cycle and the use of tool/function calls.

---

# 11. Tool Call Visualization

The frontend must clearly distinguish between an AI decision and the actual execution.

Example:

```text
AI requested:

actualizar_contacto_en_crm
```

Then:

```text
Backend execution:

✓ Contact created
```

Do not present the AI's requested action as if it automatically succeeded.

Recommended statuses:

```text
requested
executing
success
failed
skipped
requires_confirmation
```

The exact values should follow the backend API contract.

---

# 12. Handling Missing Information

This is a core behavior of UTP Assistant.

The AI must not invent information.

Example:

```text
"¿Podríamos tener una reunión la próxima semana?"
```

does NOT provide:

```text
Monday
10:00 AM
```

The frontend should display:

```text
Meeting requested

Date:
Not specified

Time:
Not specified

Status:
Pending information
```

If the backend returns missing information, highlight it clearly.

Use visual hierarchy rather than alarming UI.

---

# 13. Error Handling

Every API operation must have at least:

```text
Loading
Success
Error
```

For example:

```text
Loading:
Procesando correo...

Success:
Correo procesado correctamente.

Error:
No fue posible procesar el correo.
```

Never silently ignore API errors.

Avoid exposing raw backend stack traces to users.

If the backend returns a meaningful error message, display a user-friendly version.

---

# 14. API Communication

Create a centralized API client.

Recommended structure:

```text
src/
└── services/
    └── api.ts
```

Or, for a slightly larger implementation:

```text
src/
└── services/
    ├── api-client.ts
    ├── email-service.ts
    ├── crm-service.ts
    ├── calendar-service.ts
    └── run-service.ts
```

Do not scatter raw `fetch()` calls throughout components.

Example conceptual API:

```text
POST /api/emails/process
GET  /api/emails
GET  /api/emails/{id}

GET  /api/contacts
GET  /api/contacts/{id}

GET  /api/meetings
GET  /api/meetings/{id}

GET  /api/runs
GET  /api/runs/{id}
```

The exact endpoints must follow the backend repository's actual implementation.

Do not invent API endpoints if the backend contract already exists.

---

# 15. Environment Variables

Use Vite environment variables only for frontend-safe configuration.

Example:

```text
VITE_API_URL=http://localhost:8000
```

Never store:

- Gemini API keys
- Ollama credentials
- database credentials
- secrets
- private tokens

in the frontend.

The frontend only needs to know where the backend API is running.

---

# 16. UI Design Direction

The interface should look like a modern internal SaaS/admin application.

Design goals:

- professional;
- clean;
- modern;
- information-dense but readable;
- clear hierarchy;
- responsive;
- accessible;
- consistent.

Avoid:

- excessive gradients;
- excessive glassmorphism;
- unnecessary animations;
- oversized decorative elements;
- excessive rounded cards;
- visual clutter.

The application should communicate that UTP Assistant is a professional internal productivity tool.

---

# 17. Layout

Recommended structure:

```text
┌─────────────────────────────────────────────────────┐
│ Header                                              │
├──────────────┬──────────────────────────────────────┤
│              │                                      │
│ Sidebar      │ Main Content                         │
│              │                                      │
│ Dashboard    │                                      │
│ Emails       │                                      │
│ CRM          │                                      │
│ Calendar     │                                      │
│ Runs         │                                      │
│              │                                      │
└──────────────┴──────────────────────────────────────┘
```

On mobile:

```text
Header
   ↓
Content
   ↓
Mobile navigation
```

The dashboard should remain usable on smaller screens.

---

# 18. Component Design

Prefer small, reusable components.

Examples:

```text
components/
├── layout/
│   ├── app-shell.tsx
│   ├── sidebar.tsx
│   └── header.tsx
│
├── dashboard/
│   ├── metric-card.tsx
│   ├── recent-runs.tsx
│   └── activity-item.tsx
│
├── email/
│   ├── email-form.tsx
│   ├── email-preview.tsx
│   ├── email-analysis.tsx
│   └── email-status.tsx
│
├── crm/
│   ├── contacts-table.tsx
│   └── contact-detail.tsx
│
├── calendar/
│   ├── calendar-view.tsx
│   └── meeting-card.tsx
│
└── runs/
    ├── run-list.tsx
    ├── run-detail.tsx
    └── tool-execution.tsx
```

Use components from shadcn/ui when they improve consistency.

---

# 19. TypeScript Rules

TypeScript should be used strictly.

Avoid:

```typescript
any
```

unless there is a documented reason.

Define explicit types for:

- Email
- Contact
- Meeting
- Run
- ToolCall
- ToolExecution
- AIAnalysis
- API responses
- API errors

Example conceptual model:

```typescript
interface Contact {
  id: number;
  name: string;
  company: string;
  email: string;
  status: string;
}
```

Keep frontend types aligned with backend schemas.

---

# 20. Accessibility

Use semantic HTML.

Prefer:

```html
main
nav
header
section
article
button
form
label
```

over generic `<div>` elements when appropriate.

All form inputs must have labels.

Buttons must have meaningful accessible names.

Do not communicate information only through color.

Example:

Bad:

```text
green = success
red = error
```

Better:

```text
✓ Success
✕ Error
```

with color as a secondary visual cue.

Keyboard navigation should work for the primary flows.

---

# 21. Responsive Behavior

The primary development target is desktop because this is an internal dashboard.

However, the application must remain usable on:

```text
Desktop
Tablet
Mobile
```

Prioritize:

- dashboard;
- email processing;
- run details.

Tables may become horizontally scrollable on small screens when necessary.

Do not force complex desktop tables into unreadable mobile layouts.

---

# 22. State Management

Keep state local whenever possible.

Examples:

```text
Email form state
→ email-form.tsx

Calendar filters
→ calendar page/component

CRM search
→ CRM page/component
```

Use shared state only when multiple distant components genuinely require the same data.

For server data, create simple service functions and hooks where useful.

Do not introduce a large state-management architecture prematurely.

---

# 23. Loading States

Every major asynchronous action needs a loading state.

Examples:

```text
Procesando con IA...
Cargando contactos...
Cargando reuniones...
Cargando Run...
```

Buttons should become disabled while their operation is executing.

Avoid multiple simultaneous submissions of the same email.

---

# 24. Demo-Oriented UX

The MVP is intended to demonstrate the architecture during an academic presentation.

Therefore, the UI should make the AI workflow easy to understand.

A strong demo flow should be:

```text
1. Open Email Processor
2. Paste sample customer email
3. Click "Procesar con IA"
4. Show AI analysis
5. Show requested tool calls
6. Show CRM update
7. Show Calendar action
8. Show missing information
9. Open Run detail
10. Show complete execution lifecycle
```

The UI should make this sequence visually obvious.

---

# 25. Sample Email

The main demo email is:

```text
Hola equipo de UTP Consult, gracias por la propuesta.
Nos interesa avanzar. ¿Podríamos tener una reunión la
próxima semana para discutir los detalles técnicos del
módulo de pagos? Adjunto un documento con algunos
requisitos iniciales.

Saludos,
Ana Torres de TechCorp.
```

This email should be available as a convenient demo/sample option in the frontend.

Possible button:

```text
Cargar ejemplo
```

This allows the team to demonstrate the application consistently.

---

# 26. Important Product Behavior

The frontend must never assume that every email produces the same actions.

Possible result:

```text
Email
↓
CRM update
↓
Calendar request
```

Another email might produce:

```text
Email
↓
CRM update only
```

Another:

```text
Email
↓
No actions
↓
Informational email
```

Another:

```text
Email
↓
Calendar requested
↓
Missing date/time
↓
requires confirmation
```

The interface must dynamically render the actions returned by the backend.

---

# 27. Security Rules

Never place secrets in the frontend.

Never call Gemini directly from React.

Never access SQLite directly from React.

Never expose internal backend implementation details.

All sensitive operations must go through FastAPI.

Expected flow:

```text
React
 ↓
FastAPI
 ↓
AI / Database / Tools
```

Never:

```text
React
 ↓
Gemini API
```

---

# 28. Local Development

Expected local services:

```text
Frontend:
http://localhost:5173

Backend:
http://localhost:8000

Backend documentation:
http://localhost:8000/docs
```

The exact ports may be changed if required, but keep the default configuration simple.

Start frontend with Bun:

```bash
bun install
bun run dev
```

Build:

```bash
bun run build
```

Preview:

```bash
bun run preview
```

---

# 29. Git Rules

Use clear commits.

Examples:

```text
feat: add email processing interface
feat: add CRM contacts view
feat: add calendar view
feat: add run execution details
feat: connect email processor to API

fix: handle failed email processing
fix: improve mobile sidebar

refactor: extract API client
style: improve dashboard layout
```

Do not commit:

```text
.env
.env.local
API keys
credentials
database secrets
```

Commit:

```text
.env.example
```

when environment configuration is required.

---

# 30. Development Priorities

Implement in this order:

## Phase 1 — Foundation

- Initialize React + Vite + TypeScript.
- Configure Bun.
- Configure Tailwind.
- Configure shadcn/ui if used.
- Create application shell.
- Create navigation.

## Phase 2 — Static UI

Build:

- Dashboard
- Email Processor
- CRM
- Calendar
- Runs

using mocked frontend data initially.

## Phase 3 — API Integration

Connect:

```text
Email Processor → FastAPI
CRM → FastAPI
Calendar → FastAPI
Runs → FastAPI
```

## Phase 4 — AI Execution Visualization

Display:

```text
AI analysis
Tool calls
Tool execution
Tool results
Final response
```

## Phase 5 — Polish

- Loading states
- Error states
- Empty states
- Responsive behavior
- Accessibility
- UX refinement

Do not start with visual polish before the main workflow is functional.

---

# 31. Definition of Done

The frontend MVP is considered complete when a user can:

1. Open the dashboard.
2. Enter or load a sample email.
3. Send it to the backend.
4. See the AI processing state.
5. See extracted contact information.
6. See extracted requirements or intent.
7. See requested tool calls.
8. See CRM execution results.
9. See Calendar execution results.
10. See missing information when an action cannot be completed.
11. View the processed email.
12. View CRM contacts.
13. View simulated meetings.
14. View the complete Run lifecycle.
15. Understand from the UI what happened without reading backend logs.

---

# 32. Important Architectural Principle

The frontend is a **presentation and interaction layer**.

Business decisions belong to the backend.

The frontend must NOT decide:

```text
"Should this contact be created?"
"Should this meeting be scheduled?"
"What did the AI mean?"
"Should this tool be executed?"
```

Instead:

```text
Backend decides
      ↓
Frontend displays
```

The frontend may provide user confirmation when the backend requests it, but it should not reproduce AI/business logic independently.

---

# 33. Relationship With Academic Assignment

The academic assignment asks for an AI assistant capable of processing emails and automating actions such as CRM updates and meeting scheduling. It also evaluates the architecture, system prompt, function/tool definitions, interaction flow, and risk mitigation.

The frontend exists to **demonstrate these concepts visually**, not to replace the backend AI architecture.

The application should therefore make the following concepts visible:

```text
Email
  ↓
AI
  ↓
Analysis
  ↓
Tool Call
  ↓
Tool Execution
  ↓
Result
  ↓
Final Response
```

The MVP intentionally simulates external services such as CRM and Calendar because the goal is to demonstrate the AI orchestration workflow locally.

---

# 34. Final Rule

When implementing features, prioritize:

1. Correctness
2. Clear architecture
3. Type safety
4. Accessibility
5. Maintainability
6. Demo clarity
7. Visual polish

Do not add infrastructure, dependencies, integrations, or abstractions that are not justified by the MVP.

**Keep the frontend simple enough to finish, but polished enough to clearly demonstrate UTP Assistant's AI workflow.**