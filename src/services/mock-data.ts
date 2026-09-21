import type { Contact, Meeting, Run, AIAnalysis, ToolCall } from '../types';

export const SAMPLE_EMAIL_ANA_TORRES = {
  sender: 'ana@techcorp.com',
  subject: 'Reunión - Módulo de pagos',
  body: `Hola equipo de UTP Consult, gracias por la propuesta.
Nos interesa avanzar. ¿Podríamos tener una reunión la próxima semana para discutir los detalles técnicos del módulo de pagos?

Adjunto un documento con algunos requisitos iniciales.

Saludos,
Ana Torres de TechCorp.`,
};

export const SAMPLE_EMAIL_INFORMATIONAL = {
  sender: 'carlos.mendoza@innovasoft.pe',
  subject: 'Consulta sobre alcance del proyecto',
  body: `Estimados, quisiéramos consultar si su equipo tiene experiencia previa con arquitecturas basadas en eventos utilizando Kafka. Solo es para nuestro mapeo interno de proveedores.

Atentamente,
Carlos Mendoza`,
};

export const SAMPLE_EMAIL_SCHEDULE_READY = {
  sender: 'patricia.velez@fintechlatam.com',
  subject: 'Confirmación de Demo para el Viernes',
  body: `Hola UTP Consult,
Queremos agendar la demo para este viernes 25 de septiembre de 2026 a las 10:00 AM (duración 45 min). 
Queremos ver el prototipo del flujo de autenticación biométrica.

Saludos cordiales,
Patricia Vélez
FinTech Latam`,
};

export const INITIAL_CONTACTS: Contact[] = [
  {
    id: 'c-1',
    name: 'Roberto Gómez',
    company: 'Logística Global S.A.',
    email: 'rgomez@logisticaglobal.com',
    phone: '+51 987 654 321',
    status: 'Customer',
    lastUpdated: '2026-09-18T14:30:00Z',
    createdAt: '2026-09-01T10:00:00Z',
  },
  {
    id: 'c-2',
    name: 'Patricia Vélez',
    company: 'FinTech Latam',
    email: 'patricia.velez@fintechlatam.com',
    phone: '+51 999 111 222',
    status: 'Qualified',
    lastUpdated: '2026-09-17T09:15:00Z',
    createdAt: '2026-09-10T11:20:00Z',
  },
  {
    id: 'c-3',
    name: 'Carlos Mendoza',
    company: 'InnovaSoft',
    email: 'carlos.mendoza@innovasoft.pe',
    status: 'Contacted',
    lastUpdated: '2026-09-19T11:00:00Z',
    createdAt: '2026-09-15T16:00:00Z',
  },
];

export const INITIAL_MEETINGS: Meeting[] = [
  {
    id: 'm-1',
    title: 'Demo flujo autenticación biométrica',
    client: 'Patricia Vélez (FinTech Latam)',
    email: 'patricia.velez@fintechlatam.com',
    date: '2026-09-25',
    time: '10:00',
    durationMinutes: 45,
    status: 'Scheduled',
    notes: 'Revisión técnica de arquitectura y seguridad.',
    createdAt: '2026-09-18T16:00:00Z',
  },
  {
    id: 'm-2',
    title: 'Kick-off Proyecto WMS',
    client: 'Roberto Gómez (Logística Global S.A.)',
    email: 'rgomez@logisticaglobal.com',
    date: '2026-09-28',
    time: '15:30',
    durationMinutes: 60,
    status: 'Scheduled',
    notes: 'Presentación de equipo y cronograma inicial.',
    createdAt: '2026-09-12T08:00:00Z',
  },
];

export const INITIAL_RUNS: Run[] = [
  {
    id: 'run-101',
    createdAt: '2026-09-18T15:45:00Z',
    provider: 'Gemini',
    model: 'gemini-1.5-flash',
    status: 'completed',
    inputEmail: SAMPLE_EMAIL_SCHEDULE_READY,
    analysis: {
      contact: {
        name: 'Patricia Vélez',
        company: 'FinTech Latam',
        email: 'patricia.velez@fintechlatam.com',
      },
      intent: 'Confirmar y agendar sesión de demo técnica para el flujo de autenticación biométrica.',
      requirements: [
        {
          module: 'Autenticación Biométrica',
          description: 'Demostración práctica del prototipo de flujo biométrico',
          priority: 'high',
        },
      ],
      meetingRequest: {
        requested: true,
        dateSpecified: true,
        timeSpecified: true,
        date: '2026-09-25',
        time: '10:00',
        notes: 'Demo flujo autenticación biométrica (45 min)',
      },
      confirmedInformation: [
        'Nombre: Patricia Vélez',
        'Empresa: FinTech Latam',
        'Fecha confirmada: 2026-09-25',
        'Hora confirmada: 10:00 AM',
      ],
      inferredInformation: [
        'Duración estimada: 45 minutos',
        'Interés de compra calificado',
      ],
      missingInformation: [],
    },
    toolCalls: [
      {
        id: 'tc-1',
        name: 'actualizar_contacto_en_crm',
        arguments: {
          name: 'Patricia Vélez',
          company: 'FinTech Latam',
          email: 'patricia.velez@fintechlatam.com',
          status: 'Qualified',
        },
        status: 'success',
        result: {
          action: 'updated',
          contactId: 'c-2',
          message: 'Contacto actualizado en CRM como Qualified',
        },
      },
      {
        id: 'tc-2',
        name: 'agendar_reunion_en_calendar',
        arguments: {
          title: 'Demo flujo autenticación biométrica',
          client: 'Patricia Vélez',
          date: '2026-09-25',
          time: '10:00',
          duration_minutes: 45,
        },
        status: 'success',
        result: {
          meetingId: 'm-1',
          status: 'Scheduled',
          message: 'Reunión agendada exitosamente en el calendario local',
        },
      },
    ],
    finalResponse:
      'Hola Patricia, hemos registrado la sesión para el viernes 25 de septiembre a las 10:00 AM. Nuestro equipo técnico preparará la demo del módulo biométrico. ¡Saludos!',
  },
];

/**
 * Función que simula el análisis de IA local según las reglas estrictas de SKILLS.md:
 * - No inventar fechas ni horas faltantes.
 * - Marcar faltantes con claridad.
 * - Despachar herramientas correspondientes.
 */
export function simulateAIAnalysis(email: { sender: string; subject: string; body: string }): {
  analysis: AIAnalysis;
  toolCalls: ToolCall[];
  finalResponse: string;
} {
  const isAna =
    email.sender.toLowerCase().includes('ana') ||
    email.body.toLowerCase().includes('ana torres') ||
    email.body.toLowerCase().includes('techcorp');

  const mentionsMeeting =
    email.body.toLowerCase().includes('reunión') ||
    email.body.toLowerCase().includes('reunion') ||
    email.subject.toLowerCase().includes('reunión') ||
    email.subject.toLowerCase().includes('reunion') ||
    email.body.toLowerCase().includes('agendar') ||
    email.body.toLowerCase().includes('demo');

  const isScheduleReady =
    email.sender.toLowerCase().includes('patricia.velez@fintechlatam.com') ||
    /25 de septiembre(?: de 2026)?[\s\S]*10:00/i.test(email.body);

  if (isScheduleReady) {
    const analysis: AIAnalysis = {
      contact: {
        name: 'Patricia Vélez',
        company: 'FinTech Latam',
        email: email.sender,
      },
      intent: 'Confirmar y agendar una demo técnica del flujo de autenticación biométrica.',
      requirements: [
        {
          module: 'Autenticación Biométrica',
          description: 'Demostración del prototipo de flujo biométrico.',
          priority: 'high',
        },
      ],
      meetingRequest: {
        requested: true,
        dateSpecified: true,
        timeSpecified: true,
        date: '2026-09-25',
        time: '10:00',
        notes: 'Fecha y hora explícitas en el correo.',
      },
      confirmedInformation: [
        'Nombre: Patricia Vélez',
        'Empresa: FinTech Latam',
        'Fecha confirmada: 2026-09-25',
        'Hora confirmada: 10:00',
      ],
      inferredInformation: [],
      missingInformation: [],
    };

    const toolCalls: ToolCall[] = [
      {
        id: `tc-${Date.now()}-1`,
        name: 'actualizar_contacto_en_crm',
        arguments: {
          name: 'Patricia Vélez',
          company: 'FinTech Latam',
          email: email.sender,
          status: 'Qualified',
        },
        status: 'success',
        result: { action: 'updated', message: 'Contacto actualizado en CRM.' },
      },
      {
        id: `tc-${Date.now()}-2`,
        name: 'agendar_reunion_en_calendar',
        arguments: {
          title: 'Demo flujo autenticación biométrica',
          date: '2026-09-25',
          time: '10:00',
          duration_minutes: 45,
          description: 'Revisión técnica del prototipo de flujo biométrico.',
        },
        status: 'success',
        result: { action: 'scheduled', message: 'Reunión agendada en el calendario local.' },
      },
    ];

    return {
      analysis,
      toolCalls,
      finalResponse: 'Hola Patricia, hemos registrado la demo para el viernes 25 de septiembre de 2026 a las 10:00 AM. ¡Saludos!',
    };
  }

  // Caso específico Ana Torres (Demo canónico de SKILLS.md)
  if (isAna) {
    const analysis: AIAnalysis = {
      contact: {
        name: 'Ana Torres',
        company: 'TechCorp',
        email: email.sender || 'ana@techcorp.com',
      },
      intent: 'El cliente muestra interés en avanzar con la propuesta y solicita reunión para revisar el módulo de pagos.',
      requirements: [
        {
          module: 'Módulo de Pagos',
          description: 'Discutir especificaciones técnicas y requisitos de integración según documento adjunto.',
          priority: 'high',
        },
      ],
      meetingRequest: {
        requested: true,
        dateSpecified: false,
        timeSpecified: false,
        date: null,
        time: null,
        notes: 'Mención vaga: "la próxima semana". No especifica día ni franja horaria.',
      },
      confirmedInformation: [
        'Contacto: Ana Torres',
        'Empresa: TechCorp',
        'Correo: ana@techcorp.com',
        'Interés: Avanzar con propuesta técnica',
        'Módulo objetivo: Pagos',
      ],
      inferredInformation: [
        'Estado potencial: Lead calificado con alta intención de cierre',
      ],
      missingInformation: [
        'Fecha exacta para la reunión',
        'Hora exacta para la reunión',
      ],
    };

    const toolCalls: ToolCall[] = [
      {
        id: `tc-${Date.now()}-1`,
        name: 'actualizar_contacto_en_crm',
        arguments: {
          name: 'Ana Torres',
          company: 'TechCorp',
          email: 'ana@techcorp.com',
          status: 'Lead',
        },
        status: 'success',
        result: {
          action: 'created_or_updated',
          status: 'Lead',
          message: 'Contacto Ana Torres (TechCorp) registrado/actualizado en CRM con estado Lead.',
        },
      },
      {
        id: `tc-${Date.now()}-2`,
        name: 'agendar_reunion_en_calendar',
        arguments: {
          client: 'Ana Torres (TechCorp)',
          title: 'Revisión técnica - Módulo de pagos',
          date: null,
          time: null,
          duration_minutes: 45,
        },
        status: 'skipped',
        reason: 'Acción omitida: Falta fecha y hora exacta. El correo menciona "la próxima semana" sin concretar agenda.',
      },
    ];

    const finalResponse =
      'Estimada Ana Torres, hemos recibido su confirmación de interés para avanzar con el módulo de pagos. Hemos registrado sus datos en nuestro CRM. Para agendar la sesión técnica, por favor indíquenos qué día de la próxima semana y en qué franja horaria le convendría reunirse.';

    return { analysis, toolCalls, finalResponse };
  }

  // Caso genérico con solicitud de reunión sin fecha
  if (mentionsMeeting) {
    const analysis: AIAnalysis = {
      contact: {
        name: email.sender.split('@')[0],
        company: email.sender.split('@')[1]?.split('.')[0] || 'Empresa Cliente',
        email: email.sender,
      },
      intent: 'Solicitud de contacto o reunión sobre servicios de consultoría.',
      requirements: [
        {
          module: 'Consultoría General',
          description: email.subject,
        },
      ],
      meetingRequest: {
        requested: true,
        dateSpecified: false,
        timeSpecified: false,
        date: null,
        time: null,
      },
      confirmedInformation: [`Remitente: ${email.sender}`, `Asunto: ${email.subject}`],
      inferredInformation: ['Cliente potencial'],
      missingInformation: ['Día y horario específico de reunión'],
    };

    const toolCalls: ToolCall[] = [
      {
        id: `tc-${Date.now()}-1`,
        name: 'actualizar_contacto_en_crm',
        arguments: {
          name: analysis.contact?.name || 'Cliente',
          company: analysis.contact?.company || 'Empresa',
          email: analysis.contact?.email || email.sender,
          status: 'Lead',
        },
        status: 'success',
        result: { action: 'saved', message: 'Contacto registrado en CRM.' },
      },
      {
        id: `tc-${Date.now()}-2`,
        name: 'agendar_reunion_en_calendar',
        arguments: { client: analysis.contact?.name || 'Cliente', title: email.subject },
        status: 'skipped',
        reason: 'Omitido: Se requiere especificar fecha y hora para agendar.',
      },
    ];

    return {
      analysis,
      toolCalls,
      finalResponse: `Gracias por contactarnos. Hemos tomado nota de su requerimiento ("${email.subject}"). Quedamos atentos a su disponibilidad para agendar una reunión.`,
    };
  }

  // Caso puramente informativo (sin reunión)
  const analysis: AIAnalysis = {
    contact: {
      name: email.sender.split('@')[0],
      company: email.sender.split('@')[1]?.split('.')[0] || 'Cliente',
      email: email.sender,
    },
    intent: 'Consulta informativa o técnica sin solicitud de agendamiento.',
    requirements: [
      {
        module: 'Consulta General',
        description: email.subject,
      },
    ],
    meetingRequest: {
      requested: false,
      dateSpecified: false,
      timeSpecified: false,
    },
    confirmedInformation: [`Remitente: ${email.sender}`],
    inferredInformation: ['Consulta exploratoria'],
    missingInformation: [],
  };

  const toolCalls: ToolCall[] = [
    {
      id: `tc-${Date.now()}-1`,
      name: 'actualizar_contacto_en_crm',
      arguments: {
        name: analysis.contact?.name || 'Cliente',
        company: analysis.contact?.company || 'Empresa',
        email: analysis.contact?.email || email.sender,
        status: 'Contacted',
      },
      status: 'success',
      result: { action: 'updated', message: 'Contacto marcado como Contacted.' },
    },
  ];

  return {
    analysis,
    toolCalls,
    finalResponse:
      'Hemos registrado su consulta informativa en nuestro sistema. Un consultor técnico responderá a la brevedad con la información solicitada.',
  };
}
