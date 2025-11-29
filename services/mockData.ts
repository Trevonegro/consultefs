import { Patient, Exam, Guide, Status, Notification, User } from '../types';

// --- DATABASE OF LABORATORY EXAMS ---
// A comprehensive list of common laboratory exams for the manager to select from.
export const LAB_EXAMS_DATABASE = [
  "Hemograma Completo",
  "Glicemia em Jejum",
  "Colesterol Total",
  "Colesterol HDL",
  "Colesterol LDL",
  "Triglicerídeos",
  "TSH (Hormônio Tireoestimulante)",
  "T4 Livre",
  "T3 Livre",
  "Ureia",
  "Creatinina",
  "Ácido Úrico",
  "TGO (AST)",
  "TGP (ALT)",
  "Gama GT",
  "Bilirrubinas Total e Frações",
  "Hemoglobina Glicada (HbA1c)",
  "Vitamina D (25-Hidroxi)",
  "Vitamina B12",
  "Ferro Sérico",
  "Ferritina",
  "Cálcio Iônico",
  "Sódio",
  "Potássio",
  "Magnésio",
  "PCR (Proteína C Reativa)",
  "VHS (Velocidade de Hemossedimentação)",
  "Urina Tipo 1 (EAS)",
  "Urocultura",
  "Parasitológico de Fezes",
  "Sangue Oculto nas Fezes",
  "PSA Total",
  "PSA Livre",
  "Beta HCG (Qualitativo)",
  "Beta HCG (Quantitativo)",
  "Tipagem Sanguínea + Fator Rh",
  "Coagulograma",
  "Tempo de Protrombina (TAP)",
  "Insulina",
  "Cortisol Basal",
  "Testosterona Total",
  "Estradiol",
  "Progesterona",
  "Prolactina",
  "HIV 1 e 2 (Pesquisa)",
  "VDRL (Sífilis)",
  "Hepatite B (HBsAg)",
  "Hepatite C (Anti-HCV)",
  "Dengue (IgM/IgG)",
  "Dengue (NS1)",
  "COVID-19 (RT-PCR)",
  "COVID-19 (Antígeno)",
  "CK (Creatinofosfoquinase)",
  "CK-MB",
  "Troponina",
  "Amilase",
  "Lipase"
];

// Initial Mock Data
const examHistory: Exam[] = [
  { id: '101', name: 'Hemograma Completo', dateRequested: '2023-10-15', status: Status.DELIVERED, doctor: 'Dr. Silva', category: 'Sangue', acknowledged: true },
  { id: '102', name: 'Colesterol Total', dateRequested: '2023-10-15', status: Status.DELIVERED, doctor: 'Dr. Silva', category: 'Sangue', resultValue: 180, resultUnit: 'mg/dL', acknowledged: true },
];

// --- SYSTEM STATE ---
let globalSystemMessage: string = "";

// Added 'password' field to internal storage (not exposed in Patient type for security in real apps, but fine for mock)
let mockPatients: Record<string, { password: string; profile: Patient; exams: Exam[]; guides: Guide[]; notifications: Notification[] }> = {
  // Scenario 1: Exams Ready
  '111.111.111-11': {
    password: 'paciente123',
    profile: { id: 'p1', name: 'Maria Oliveira', cpf: '111.111.111-11', email: 'maria@example.com' },
    exams: [
      ...examHistory,
      { id: 'e1', name: 'Ressonância Magnética Joelho', dateRequested: '2024-05-18', status: Status.READY, doctor: 'Dr. House', category: 'Imagem', acknowledged: false },
      { id: 'e2', name: 'Vitamina D (25-Hidroxi)', dateRequested: '2024-05-20', status: Status.READY, doctor: 'Dra. Ana', category: 'Sangue', acknowledged: false },
    ],
    guides: [
      { id: 'g1', specialty: 'Cardiologia', doctor: 'Dr. Silva', dateRequested: '2024-05-01', deadline: '2024-05-15', status: Status.READY, qrCodeData: 'GUIDE-001', acknowledged: false }
    ],
    notifications: [
        { id: 'n1', title: 'Bem-vindo', message: 'Seja bem-vindo ao novo portal CONSULTE FS.', date: '2024-05-01', read: false, type: 'info' }
    ]
  },
  // Scenario 2: Processing
  '222.222.222-22': {
    password: 'paciente123',
    profile: { id: 'p2', name: 'João Santos', cpf: '222.222.222-22', email: 'joao@example.com' },
    exams: [
      { id: 'e3', name: 'Ecocardiograma', dateRequested: '2024-05-21', status: Status.PROCESSING, doctor: 'Dr. Mendes', category: 'Imagem' },
      { id: 'e4', name: 'Teste Ergométrico', dateRequested: '2024-05-21', status: Status.PROCESSING, doctor: 'Dr. Mendes', category: 'Cardio' }
    ],
    guides: [],
    notifications: []
  },
  // Scenario 3: Waiting for Guide
  '333.333.333-33': {
    password: 'paciente123',
    profile: { id: 'p3', name: 'Carlos Pereira', cpf: '333.333.333-33', email: 'carlos@example.com' },
    exams: [],
    guides: [
      { id: 'g2', specialty: 'Oftalmologia', doctor: 'Dra. Costa', dateRequested: '2024-05-22', deadline: '2024-05-30', status: Status.PENDING },
      { id: 'g3', specialty: 'Dermatologia', doctor: 'Dra. Costa', dateRequested: '2024-05-22', deadline: '2024-06-05', status: Status.PROCESSING }
    ],
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
  
  // 2. Patient Access Logic
  // Normalize input (remove non-digits to compare CPFs easily)
  const cleanInput = credential.replace(/\D/g, '');
  
  // Try to find exact match in mock data keys (numeric match)
  const foundKey = Object.keys(mockPatients).find(key => {
      const cleanKey = key.replace(/\D/g, '');
      return cleanKey === cleanInput && cleanInput.length > 0;
  });

  if (foundKey) {
     const patientData = mockPatients[foundKey];
     
     // Check password
     if (patientData.password === cleanPassword) {
         return {
            user: { id: patientData.profile.id, name: patientData.profile.name, role: 'patient', cpf: foundKey },
            data: {
                profile: patientData.profile,
                exams: patientData.exams,
                guides: patientData.guides,
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
        notifications: p.notifications
    } : null;
};

// Global Announcement Functions
export const getGlobalAnnouncement = () => globalSystemMessage;

export const setGlobalAnnouncement = (message: string) => {
    globalSystemMessage = message;
};

// Notification Functions
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

// Helper to get exams list
export const getLabExamsDatabase = () => LAB_EXAMS_DATABASE;

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

// Add functions
export const addExamToPatient = (cpf: string, examName: string, doctor: string) => {
  const patient = mockPatients[cpf];
  if (patient) {
    const newExam: Exam = {
      id: `new-e-${Date.now()}`,
      name: examName,
      doctor: doctor,
      dateRequested: new Date().toISOString().split('T')[0], // Today YYYY-MM-DD
      status: Status.PENDING,
      category: 'Laboratorial',
      acknowledged: false
    };
    patient.exams.unshift(newExam); // Add to top
    return newExam;
  }
  return null;
};

export const addGuideToPatient = (cpf: string, specialty: string, doctor: string, deadline: string) => {
  const patient = mockPatients[cpf];
  if (patient) {
    const newGuide: Guide = {
      id: `new-g-${Date.now()}`,
      specialty: specialty,
      doctor: doctor,
      dateRequested: new Date().toISOString().split('T')[0],
      deadline: deadline,
      status: Status.PENDING,
      acknowledged: false
    };
    patient.guides.unshift(newGuide); // Add to top
    return newGuide;
  }
  return null;
};

// New function to handle Patient Guide Requests
export const requestGuide = (cpf: string, data: { specialty: string, doctor: string, attachmentUrl?: string }) => {
    const patient = mockPatients[cpf];
    if (patient) {
        const newGuide: Guide = {
            id: `req-g-${Date.now()}`,
            specialty: data.specialty,
            doctor: data.doctor,
            dateRequested: new Date().toISOString().split('T')[0],
            deadline: 'A calcular',
            status: Status.PENDING, // Starts as pending
            acknowledged: false,
            attachmentUrl: data.attachmentUrl
        };
        patient.guides.unshift(newGuide);
        return newGuide;
    }
    return null;
};

// New function for patient interaction
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
            notifications: patient.notifications
        };
    }
    return null;
};