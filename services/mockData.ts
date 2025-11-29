import { Patient, Exam, Guide, Status, Notification, User, PatientType, MilitaryOrganization, DentalAppointment } from '../types';

// --- DATABASE OF LABORATORY EXAMS ---
export const LAB_EXAMS_DATABASE = [
  "TODOS OS SEUS EXAMES ESTÃO PRONTOS",
  "Hemograma Completo",
  "Glicemia em Jejum",
  "Colesterol Total",
  "Colesterol HDL",
  "Triglicerídeos",
  "TSH (Hormônio Tireoestimulante)",
  "T4 Livre",
  "Ureia",
  "Creatinina",
  "Ácido Úrico",
  "TGO (AST)",
  "TGP (ALT)",
  "Gama GT",
  "Hemoglobina Glicada (HbA1c)",
  "Vitamina D (25-Hidroxi)",
  "Vitamina B12",
  "Urina Tipo 1 (EAS)",
  "Urocultura",
  "Parasitológico de Fezes",
  "PSA Total",
  "Beta HCG",
  "COVID-19 (RT-PCR)"
];

// --- DENTISTS DATABASE ---
export const DENTISTS_DATABASE = [
    "Cap Dentista Ana Souza",
    "Cap Dentista Carlos Ferreira",
    "Ten Dentista Marcos Oliveira",
    "Ten Dentista Julia Lima",
    "Ten Dentista Roberto Santos"
];

// --- DATABASE OF PROCEDURES (FROM PDF) FOR GUIDES ---
export const GUIDE_PROCEDURES_DATABASE = [
    "EXAMES LABORATORIAIS",
    "Abdome inferior feminina (bexiga, útero, ovários e anexos)",
    "Abdome inferior masculino (bexiga, próstata e vesícula)",
    "Abdome superior (fígado, vias biliares, vesícula, pâncreas, baço)",
    "Abdome total (inclui abdome inferior)",
    "Aparelho urinário feminino (rins, ureteres e bexigas)",
    "Aparelho urinário masculino (rins, ureteres, bexigas e próstata)",
    "Articular (por articulação)",
    "Dermatológica - pele e subcutâneo",
    "Doppler colorido arterial de membro inferior- unilateral",
    "Doppler colorido arterial de membro superior- unilateral",
    "Doppler colorido de aorta e artéria renais",
    "Doppler colorido de aorta e ilíacas",
    "Doppler colorido de artérias e viscerais",
    "Doppler colorido de órgão ou estrutura isolada",
    "Doppler col. de vasos cervicais arteriais bilaterais (carótidas e vertebrais)",
    "Doppler col. de vasos cervicais venosos bilaterais (subclávias e jugulares)",
    "Doppler colorido de veia cava superior ou inferior",
    "Doppler colorido venoso de membro inferior- unilateral",
    "Doppler colorido venoso de membro superior- superior",
    "Doppler transcraniano",
    "Ecodopplercardiograma com contraste intracavitário",
    "Ecodopplercardiograma transesofágico (inclui transtorácico)",
    "Ecodopplercardiograma transtorácico",
    "Estruturas superficiais (cervical ou axila ou músculo ou tendão)",
    "Glândulas salivares (todas)",
    "Mamas",
    "Obstétrica",
    "Obstétrica 1° trimestre (endovaginal)",
    "Obstétrica com translucência nucal",
    "Obstétrica Morfológica",
    "Órgãos superficiais (tireoide ou escroto ou pênis ou crânio)",
    "Transvaginal (inclui abdome inferior feminino)",
    "TC - Abdome superior",
    "TC - Abdome total (abdome superior, pelve e retroperitônio)",
    "TC - Articulação (unilateral)",
    "TC - Coluna – segmental adicional",
    "TC - Coluna cervical ou dorsal ou lombar (ate 03 segmentos)",
    "TC - Crânio ou sela túrcica ou orbitas",
    "TC - Mastoide ou orelhas",
    "TC - Face ou seios da face",
    "TC - Pelve ou bacia",
    "TC - Pescoço (partes moles, laringe, tireoide e faringe)",
    "TC - Segmentos apendiculares (braços, pernas, etc)",
    "TC - Tórax",
    "RX - ADENÓIDES OU CAVUM",
    "RX - CRÂNIO – 2 INCIDÊNCIAS",
    "RX - CRÂNIO-3 INCIDÊNCIAS",
    "RX - CRÂNIO- 4 INCIDÊNCIAS",
    "RX - OSSOS DA FACE",
    "RX - SEIOS DA FACE",
    "RX - COLUNA CERVICAL -3 INCIDENCIAS",
    "RX - COLUNA CERVICAL – 5 INCIDENCIAS",
    "RX - COLUNA DORSAL-2 INCIDENCIAS",
    "RX - COLUNA DORSAL -4 INCIDENCIAS",
    "RX - COLUNA LOMBO SACRA -5 INCIDENCIAS",
    "RX - COLUNA LOMBO-SACRA 3- INCIDENCIAS",
    "RX - SACRO COCCIX",
    "RX - Articulação coxofemoral (quadril)",
    "RX - Articulação tibiotársica (tornozelo)",
    "RX - Bacia",
    "RX - Calcâneo",
    "RX - Joelho",
    "RX - Pé ou pododáctilo",
    "RX - Perna",
    "RX - Antebraço",
    "RX - Articulação escapulo umeral (ombro)",
    "RX - Braço",
    "RX - Clavícula",
    "RX - Cotovelo",
    "RX - Mão ou quirodáctilo",
    "RX - Mãos e punhos para idade óssea",
    "RX - Punho",
    "RX - Tórax -1 incidência",
    "RX - Tórax -2 incidências",
    "RX - Tórax-3 incidências",
    "RX - Tórax – 4 incidências",
    "RX - Coração e vasos da base",
    "RX - Laringe ou hipofaringe ou pescoço (partes moles)",
    "RX - Abdome agudo",
    "RX - Abdome simples",
    "Colonoscopia",
    "Biopsia (colonoscopia)",
    "Densitometria óssea – corpo inteiro",
    "Densitometria óssea (um segmento)",
    "Densitometria óssea – rotina: coluna e fêmur",
    "Mamografia convencional bilateral",
    "Mamografia digital bilateral",
    "Polipectomia",
    "ECG convencional bilateral (eletrocardiograma)",
    "EEG em Mapeamento cerebral",
    "EEG em Mapeamento cerebral quantitativo",
    "Teste ergométrico computadorizado",
    "MAPA (24H)",
    "HOLTER (24 H)",
    "AUDIOMETRIA (TONAL)",
    "Endoscopia digestiva alta (com biópsia)",
    "Endoscopia digestiva alta",
    "MEDIDA DE ACUIDADE VISUAL",
    "TONOMETRIA",
    "PAQUIMETRIA ULTRASSÔNICA MOLECULAR",
    "BIOMETRIA ULTRASSÔNICAMONOCULAR",
    "MAPEAMNETO DE RETINA",
    "MICROSCOPIA ESPECULAR DE CÓRNEA",
    "CAMPIMETRIA MANUAL",
    "EXAME DE MOTILIDADE OCULAR",
    "CURVA TENSIONAL DIÁRIA - BINOCULAR",
    "GONIOSCOPIA - BINOCULAR",
    "ADAPTAÇÃO E TREINAMENTOS DE RECURSOS OPTICOS",
    "TESTE DE SCHIRMER / ROSA BENGALA",
    "TESTE DE TOLERÂNCIA HIDRICA",
    "TESTE CONES ISHIHARA",
    "CERATOSCOPIA",
    "CAMPO VISUAL COMPUTADORIZADO",
    "Consulta Nutricionista",
    "Consulta Pediatra",
    "Consulta Neurologista/ Psiquiatria",
    "Atendimento em Pronto Socorro",
    "Consulta com especialistas",
    "Imobilizações não gessadas",
    "Imobilização Membro inferior",
    "Imobilização Membro superior",
    "Bota com ou sem salto",
    "Luva Gessada",
    "Colete Gessado",
    "Fisioterapia - Consulta Inicial",
    "Fisioterapia - Patologia osteomiarticular em um membro",
    "Fisioterapia - Patologia osteomiarticular em um segmento da coluna",
    "Fisioterapia - Patologia osteomiarticular em diferentes segmentos da coluna",
    "Fisioterapia - Patologias osteomioarticulares com dependência (AVC)",
    "Fisioterapia - Paciente com D.P.O.C (Respiratória)",
    "Reabilitação perineal com Biofeedback",
    "Reeducação Postural Global (RGP)",
    "Retardo desenvolvimento psicomotor",
    "Parkinson",
    "Pilates",
    "Fonoaudiologia - Avaliação Inicial",
    "Fonoaudiologia sessão (até 8 sessões)",
    "Consulta psicólogo (a)",
    "Psicoterapia individual - 1 sessão",
    "ODONTO - PERIAPICAL",
    "ODONTO - OLUSAL",
    "ODONTO - RX POSTERO-ANTERIOR-RX OSSOS DA FACE",
    "ODONTO - RX DA ATM-(BILATERAL)",
    "ODONTO - PANORÂMICA",
    "ODONTO - TELERRADIOGRAFIA COM TRAÇADO COMPUTADORIZADO",
    "ODONTO - TELERRADIOGRAFIA SEM TRAÇADO COMPUTADORIZADO",
    "ODONTO - MODELOS ORTODÔNTICOS (PAR)",
    "ODONTO - SLIDES (UNIDADES)",
    "ODONTO - FOTOGRAFIA (UNIDADE)",
    "ODONTO - TC-ARTICULAÇÃO TEMPOROMANDIBULARES",
    "ODONTO - TC-DENTAL (DENTASCAN)",
    "ODONTO - TC-FACE OU SEIOS DA FACE",
    "ODONTO - TC-MAXILAR",
    "ODONTO - TC-MANDÍBULA",
    "ODONTO - CARPAL"
];

// Initial Mock Data
const examHistory: Exam[] = [
  { id: '101', name: 'Hemograma Completo', dateRequested: '2023-10-15', status: Status.DELIVERED, doctor: 'Laboratório Central', category: 'Sangue', acknowledged: true },
];

// --- SYSTEM STATE ---
let globalSystemMessage: string = "";

let mockPatients: Record<string, { password: string; profile: Patient; exams: Exam[]; guides: Guide[]; dentalAppointments: DentalAppointment[]; notifications: Notification[] }> = {
  '111.111.111-11': {
    password: 'paciente123',
    profile: { 
        id: 'p1', 
        name: 'Maria Oliveira', 
        cpf: '111.111.111-11', 
        email: 'maria@example.com',
        type: 'TITULAR',
        om: 'CIA CMDO',
        precCp: '123456789'
    },
    exams: [
      ...examHistory,
      { id: 'e1', name: 'Ressonância Magnética Joelho', dateRequested: '2024-05-18', status: Status.READY, doctor: 'Imagem Lab', category: 'Imagem', acknowledged: false },
    ],
    guides: [
      { id: 'g1', specialty: 'Consulta com especialistas', doctor: 'Dr. Silva', dateRequested: '2024-05-01', deadline: '2024-05-15', status: Status.READY, qrCodeData: 'GUIDE-001', acknowledged: false }
    ],
    dentalAppointments: [
        { id: 'd1', dentist: 'Cap Dentista Ana Souza', procedure: 'Consulta de Rotina', date: '2024-06-15', time: '14:00', status: Status.PENDING }
    ],
    notifications: [
        { id: 'n1', title: 'Bem-vindo', message: 'Seja bem-vindo ao novo portal CONSULTE FS.', date: '2024-05-01', read: false, type: 'info' }
    ]
  },
  '222.222.222-22': {
    password: 'paciente123',
    profile: { id: 'p2', name: 'João Santos', cpf: '222.222.222-22', email: 'joao@example.com', type: 'TITULAR', om: 'PEL PE', precCp: '987654321' },
    exams: [],
    guides: [],
    dentalAppointments: [],
    notifications: []
  }
};

// Functions to interact with data

export const loginUser = (credential: string, password: string): { user: User; data?: any } | null => {
  const lowerCred = credential.toLowerCase().trim();
  const cleanPassword = password.trim();

  // 1. Manager Access
  // Exam Manager
  if (lowerCred === 'gestor.exames' && cleanPassword === 'admin.exames') {
    return { 
      user: { id: 'admin-exam', name: 'Gestor de Exames', role: 'exam_manager' } 
    };
  }

  // Guide Manager
  if (lowerCred === 'gestor.guias' && cleanPassword === 'admin.guias') {
    return { 
      user: { id: 'admin-guide', name: 'Gestor de Guias', role: 'guide_manager' } 
    };
  }
  
  // Dentist Manager
  if (lowerCred === 'gestor.dentista' && cleanPassword === 'admin.dentista') {
    return { 
      user: { id: 'admin-dentist', name: 'Gestor Odontológico', role: 'dentist_manager' } 
    };
  }

  // 2. Patient Access Logic
  const cleanInput = credential.replace(/\D/g, '');
  const foundKey = Object.keys(mockPatients).find(key => {
      const cleanKey = key.replace(/\D/g, '');
      return cleanKey === cleanInput && cleanInput.length > 0;
  });

  if (foundKey) {
     const patientData = mockPatients[foundKey];
     if (patientData.password === cleanPassword) {
         return {
            user: { id: patientData.profile.id, name: patientData.profile.name, role: 'patient', cpf: foundKey },
            data: {
                profile: patientData.profile,
                exams: patientData.exams,
                guides: patientData.guides,
                dentalAppointments: patientData.dentalAppointments,
                notifications: patientData.notifications
            }
          };
     }
  }
  return null;
};

// Admin functions
export const getAllPatients = () => {
  return Object.values(mockPatients).map(p => p.profile);
};

export const getPatientDetails = (cpf: string) => {
    const p = mockPatients[cpf];
    return p ? {
        profile: p.profile,
        exams: p.exams,
        guides: p.guides,
        dentalAppointments: p.dentalAppointments || [],
        notifications: p.notifications
    } : null;
};

export const registerPatient = (patientData: Patient, password?: string) => {
    if (mockPatients[patientData.cpf]) {
        return { success: false, message: "CPF já cadastrado." };
    }
    mockPatients[patientData.cpf] = {
        password: password || patientData.cpf.replace(/\D/g, ''), 
        profile: {
            ...patientData,
            id: `p-${Date.now()}`,
            email: `${patientData.name.split(' ')[0].toLowerCase()}@sistema.com`
        },
        exams: [],
        guides: [],
        dentalAppointments: [],
        notifications: []
    };
    return { success: true };
};

export const changePatientPassword = (cpf: string, newPassword: string) => {
    if (mockPatients[cpf]) {
        mockPatients[cpf].password = newPassword;
        return true;
    }
    return false;
};

export const getGlobalAnnouncement = () => globalSystemMessage;

export const setGlobalAnnouncement = (message: string) => {
    globalSystemMessage = message;
};

export const sendPatientNotification = (cpf: string, title: string, message: string) => {
    const patient = mockPatients[cpf];
    if (patient) {
        const newNotification: Notification = {
            id: `notif-${Date.now()}`,
            title: title,
            message: message,
            date: new Date().toISOString().split('T')[0],
            read: false,
            type: 'info'
        };
        patient.notifications.unshift(newNotification);
        return true;
    }
    return false;
};

export const getLabExamsDatabase = () => LAB_EXAMS_DATABASE;
export const getGuideProceduresDatabase = () => GUIDE_PROCEDURES_DATABASE;
export const getDentistsDatabase = () => DENTISTS_DATABASE;

export const updateExamStatus = (cpf: string, examId: string, newStatus: Status) => {
  const patient = mockPatients[cpf];
  if (patient) {
    patient.exams = patient.exams.map(e => e.id === examId ? { ...e, status: newStatus } : e);
  }
};

export const updateGuideStatus = (cpf: string, guideId: string, newStatus: Status) => {
  const patient = mockPatients[cpf];
  if (patient) {
    patient.guides = patient.guides.map(g => g.id === guideId ? { ...g, status: newStatus } : g);
  }
};

export const updateDentalStatus = (cpf: string, appointId: string, newStatus: Status) => {
    const patient = mockPatients[cpf];
    if (patient) {
      patient.dentalAppointments = patient.dentalAppointments.map(a => a.id === appointId ? { ...a, status: newStatus } : a);
    }
};

export const addExamToPatient = (cpf: string, examName: string, doctor: string) => {
  const patient = mockPatients[cpf];
  if (patient) {
    const newExam: Exam = {
      id: `new-e-${Date.now()}`,
      name: examName,
      doctor: doctor,
      dateRequested: new Date().toISOString().split('T')[0],
      status: Status.PENDING,
      category: 'Laboratorial',
      acknowledged: false
    };
    patient.exams.unshift(newExam);
    return newExam;
  }
  return null;
};

export const addGuideToPatient = (cpf: string, specialty: string, dateRegistered: string, deadline: string) => {
  const patient = mockPatients[cpf];
  if (patient) {
    const newGuide: Guide = {
      id: `new-g-${Date.now()}`,
      specialty: specialty,
      doctor: 'Solicitação Interna',
      dateRequested: dateRegistered,
      deadline: deadline,
      status: Status.PENDING,
      acknowledged: false
    };
    patient.guides.unshift(newGuide);
    return newGuide;
  }
  return null;
};

export const deleteItem = (cpf: string, itemId: string, type: 'exam' | 'guide' | 'dental') => {
    const patient = mockPatients[cpf];
    if (patient) {
        if (type === 'exam') {
            patient.exams = patient.exams.filter(e => e.id !== itemId);
        } else if (type === 'guide') {
            patient.guides = patient.guides.filter(g => g.id !== itemId);
        } else if (type === 'dental') {
            patient.dentalAppointments = patient.dentalAppointments.filter(d => d.id !== itemId);
        }
        return true;
    }
    return false;
};

export const editItem = (cpf: string, itemId: string, type: 'exam' | 'guide' | 'dental', data: any) => {
    const patient = mockPatients[cpf];
    if (patient) {
        if (type === 'exam') {
             patient.exams = patient.exams.map(e => e.id === itemId ? { ...e, ...data } : e);
        } else if (type === 'guide') {
             patient.guides = patient.guides.map(g => g.id === itemId ? { ...g, ...data } : g);
        } else if (type === 'dental') {
             patient.dentalAppointments = patient.dentalAppointments.map(d => d.id === itemId ? { ...d, ...data } : d);
        }
        return true;
    }
    return false;
}

export const requestGuide = (cpf: string, data: { specialty: string, doctor: string, attachmentUrl?: string }) => {
    const patient = mockPatients[cpf];
    if (patient) {
        const newGuide: Guide = {
            id: `req-g-${Date.now()}`,
            specialty: data.specialty,
            doctor: data.doctor,
            dateRequested: new Date().toISOString().split('T')[0],
            deadline: 'A calcular',
            status: Status.PENDING,
            acknowledged: false,
            attachmentUrl: data.attachmentUrl
        };
        patient.guides.unshift(newGuide);
        return newGuide;
    }
    return null;
};

// Dental Functions
export const checkDateAvailability = (dateStr: string) => {
    // Mock logic: Weekends (0 and 6) are unavailable.
    // Randomly unavailable for demo purposes on days divisible by 5
    const date = new Date(dateStr + 'T00:00:00');
    const day = date.getDay();
    const dayNum = date.getDate();

    if (day === 0 || day === 6) return 'unavailable'; // Weekend
    if (dayNum % 7 === 0) return 'full'; // Mock full day
    
    return 'available';
};

export const getAvailableTimeSlots = (dateStr: string) => {
    // Mock slots
    return [
        "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
        "13:30", "14:00", "14:30", "15:00", "15:30", "16:00"
    ];
};

export const scheduleDentalAppointment = (cpf: string, data: { procedure: string, date: string, time: string, dentist: string }) => {
    const patient = mockPatients[cpf];
    if (patient) {
        const newAppt: DentalAppointment = {
            id: `dental-${Date.now()}`,
            dentist: data.dentist,
            procedure: data.procedure,
            date: data.date,
            time: data.time,
            status: Status.PENDING
        };
        // Initialize if undefined (for older mock data)
        if (!patient.dentalAppointments) patient.dentalAppointments = [];
        patient.dentalAppointments.unshift(newAppt);
        return newAppt;
    }
    return null;
};

export const acknowledgeItem = (cpf: string, itemId: string, type: 'exam' | 'guide') => {
    const patient = mockPatients[cpf];
    if (patient) {
        if (type === 'exam') {
            patient.exams = patient.exams.map(e => e.id === itemId ? { ...e, acknowledged: true } : e);
        } else {
            patient.guides = patient.guides.map(g => g.id === itemId ? { ...g, acknowledged: true } : g);
        }
        return {
            profile: patient.profile,
            exams: patient.exams,
            guides: patient.guides,
            dentalAppointments: patient.dentalAppointments || [],
            notifications: patient.notifications
        };
    }
    return null;
};