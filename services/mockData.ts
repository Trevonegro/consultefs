
import { Patient, Exam, Guide, Status, Notification, User, PatientType, MilitaryOrganization, Role, DentalAppointment } from '../types';

// --- CONSTANTS & SEED DATA ---
const LAB_EXAMS_DATABASE = [
  "Hemograma Completo", "Glicemia em Jejum", "Colesterol Total", "Colesterol HDL",
  "Triglicerídeos", "TSH", "T4 Livre", "Ureia", "Creatinina", "Ácido Úrico",
  "TGO (AST)", "TGP (ALT)", "Gama GT", "Hemoglobina Glicada", "Vitamina D",
  "Vitamina B12", "Urina Tipo 1", "Urocultura", "Parasitológico de Fezes", "PSA Total",
  "Beta HCG", "COVID-19 (RT-PCR)"
];

const GUIDE_PROCEDURES_DATABASE = [
    "Consulta Cardiologista", "Consulta Oftalmologista", "Consulta Dermatologista",
    "Ressonância Magnética - Joelho", "Ressonância Magnética - Crânio",
    "Tomografia Computadorizada", "Ultrassonografia Abdominal", "Fisioterapia (10 sessões)",
    "Psicoterapia", "Endoscopia Digestiva", "Colonoscopia", "Ecocardiograma", "Teste Ergométrico",
    "Raio-X Tórax", "Raio-X Panorâmico (Odonto)"
];

const DENTISTS_DATABASE = [
  "Maj Dent. Oliveira",
  "Cap Dent. Santos",
  "Ten Dent. Costa",
  "Ten Dent. Silva"
];

// Seed Data (Initial Data if LocalStorage is empty)
const INITIAL_USERS = [
    {
        id: 'user-admin-exams',
        name: 'Gestor de Exames',
        cpf: 'admin.exames', // Changed to dot
        role: 'exam_manager' as Role,
        password: 'admin'
    },
    {
        id: 'user-admin-guides',
        name: 'Gestor de Guias',
        cpf: 'admin.guias', // Changed to dot
        role: 'guide_manager' as Role,
        password: 'admin'
    },
    {
        id: 'user-patient-1',
        name: 'Sd Pedro Silva',
        cpf: '000.000.000-00',
        role: 'patient' as Role,
        password: '123',
        email: 'pedro@email.com',
        type: 'TITULAR' as PatientType,
        om: 'CIA CMDO' as MilitaryOrganization,
        precCp: '987654321',
        holderName: '',
        birthDate: '1995-05-20'
    }
];

const INITIAL_EXAMS: Exam[] = [
    { id: 'ex-1', name: 'Hemograma Completo', dateRequested: '2025-02-20', status: Status.READY, doctor: 'Lab. Central', category: 'Laboratorial', acknowledged: false },
    { id: 'ex-2', name: 'Glicemia', dateRequested: '2025-02-21', status: Status.PROCESSING, doctor: 'Lab. Central', category: 'Laboratorial', acknowledged: false }
];

const INITIAL_GUIDES: Guide[] = [
    { id: 'gd-1', specialty: 'Cardiologia', doctor: 'Dr. Santos', dateRequested: '2025-02-15', deadline: '2025-02-25', status: Status.READY, acknowledged: false }
];

const INITIAL_NOTIFICATIONS: any[] = [];
const INITIAL_DENTAL_APPOINTMENTS: DentalAppointment[] = [];

// --- LOCAL STORAGE HELPERS ---
const STORAGE_KEYS = {
    USERS: 'minhafs_users',
    EXAMS: 'minhafs_exams',
    GUIDES: 'minhafs_guides',
    NOTIFICATIONS: 'minhafs_notifications',
    GLOBAL_MSG: 'minhafs_global_msg',
    DENTAL: 'minhafs_dental'
};

const loadData = (key: string, initial: any) => {
    const stored = localStorage.getItem(key);
    if (!stored) {
        localStorage.setItem(key, JSON.stringify(initial));
        return initial;
    }
    return JSON.parse(stored);
};

const saveData = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
};

// Initialize Global Message variable
let globalSystemMessage = localStorage.getItem(STORAGE_KEYS.GLOBAL_MSG) || "";

// --- SIMULATED ASYNC FUNCTIONS ---
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const loginUser = async (credential: string, password: string): Promise<{ user: User; data?: any } | null> => {
    await delay(300); // Simulate network
    const users = loadData(STORAGE_KEYS.USERS, INITIAL_USERS);
    
    const user = users.find((u: any) => {
        // 1. Check exact match (useful for admins like 'admin.exames')
        if (u.cpf === credential && u.password === password) return true;

        // 2. Check loose numeric match (useful for CPFs with/without dots)
        const cleanInput = credential.replace(/\D/g, '');
        const cleanStored = u.cpf.replace(/\D/g, '');
        
        // Ensure we are comparing numbers and not empty strings
        if (cleanInput.length > 0 && cleanInput === cleanStored && u.password === password) return true;

        return false;
    });

    if (!user) return null;

    const userData: User = {
        id: user.id,
        name: user.name,
        role: user.role,
        cpf: user.cpf
    };

    if (user.role !== 'patient') {
        return { user: userData };
    }

    const patientDetails = await getPatientDetails(user.cpf);
    return { user: userData, data: patientDetails };
};

export const getAllPatients = async (): Promise<Patient[]> => {
    await delay(200);
    const users = loadData(STORAGE_KEYS.USERS, INITIAL_USERS);
    return users.filter((u: any) => u.role === 'patient').map((p: any) => ({
        id: p.id,
        name: p.name,
        cpf: p.cpf,
        email: p.email || '',
        type: p.type,
        om: p.om,
        precCp: p.precCp,
        holderName: p.holderName,
        birthDate: p.birthDate 
    }));
};

export const getPatientDetails = async (cpf: string) => {
    await delay(200);
    const users = loadData(STORAGE_KEYS.USERS, INITIAL_USERS);
    const user = users.find((u: any) => u.cpf === cpf);
    if (!user) return null;

    const allExams = loadData(STORAGE_KEYS.EXAMS, INITIAL_EXAMS);
    const allGuides = loadData(STORAGE_KEYS.GUIDES, INITIAL_GUIDES);
    const allNotifs = loadData(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    const allDental = loadData(STORAGE_KEYS.DENTAL, INITIAL_DENTAL_APPOINTMENTS);

    // Filter for specific patient
    const filterByOwner = (item: any) => item.patient_cpf === cpf || (cpf === '000.000.000-00' && !item.patient_cpf);

    const exams = allExams.filter(filterByOwner).reverse();
    const guides = allGuides.filter(filterByOwner).reverse();
    const notifications = allNotifs.filter((n:any) => n.patient_cpf === cpf).reverse();
    const dental = allDental.filter(filterByOwner).reverse();

    return {
        profile: {
            id: user.id,
            name: user.name,
            cpf: user.cpf,
            email: user.email,
            type: user.type,
            om: user.om,
            precCp: user.precCp,
            holderName: user.holderName,
            birthDate: user.birthDate
        },
        exams,
        guides,
        notifications,
        dental
    };
};

export const registerPatient = async (patientData: Patient, password?: string) => {
    await delay(500);
    const users = loadData(STORAGE_KEYS.USERS, INITIAL_USERS);
    
    if (users.find((u: any) => u.cpf === patientData.cpf)) {
        return { success: false, message: "CPF já cadastrado." };
    }

    const newUser = {
        id: `user-${Date.now()}`,
        ...patientData,
        role: 'patient',
        password: password || patientData.cpf.replace(/\D/g, '') // Default password is CPF numbers
    };

    users.push(newUser);
    saveData(STORAGE_KEYS.USERS, users);
    return { success: true };
};

export const changePatientPassword = async (cpf: string, newPassword: string) => {
    await delay(300);
    const users = loadData(STORAGE_KEYS.USERS, INITIAL_USERS);
    const index = users.findIndex((u: any) => u.cpf === cpf);
    if (index === -1) return false;

    users[index].password = newPassword;
    saveData(STORAGE_KEYS.USERS, users);
    return true;
};

export const getGlobalAnnouncement = () => {
    return localStorage.getItem(STORAGE_KEYS.GLOBAL_MSG) || "";
};

export const setGlobalAnnouncement = (message: string) => {
    localStorage.setItem(STORAGE_KEYS.GLOBAL_MSG, message);
    globalSystemMessage = message;
};

export const sendPatientNotification = async (cpf: string, title: string, message: string) => {
    await delay(200);
    const notifs = loadData(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    notifs.push({
        id: `notif-${Date.now()}`,
        patient_cpf: cpf,
        title,
        message,
        date: new Date().toISOString().split('T')[0],
        read: false,
        type: 'info'
    });
    saveData(STORAGE_KEYS.NOTIFICATIONS, notifs);
    return true;
};

// --- DATA MODIFICATION ---

export const updateExamStatus = async (cpf: string, examId: string, newStatus: Status) => {
    await delay(200);
    const list = loadData(STORAGE_KEYS.EXAMS, INITIAL_EXAMS);
    const item = list.find((i: any) => i.id === examId);
    if (item) {
        item.status = newStatus;
        saveData(STORAGE_KEYS.EXAMS, list);
    }
};

export const updateGuideStatus = async (cpf: string, guideId: string, newStatus: Status) => {
    await delay(200);
    const list = loadData(STORAGE_KEYS.GUIDES, INITIAL_GUIDES);
    const item = list.find((i: any) => i.id === guideId);
    if (item) {
        item.status = newStatus;
        saveData(STORAGE_KEYS.GUIDES, list);
    }
};

export const addExamToPatient = async (cpf: string, examName: string, doctor: string) => {
    await delay(300);
    const list = loadData(STORAGE_KEYS.EXAMS, INITIAL_EXAMS);
    const newItem = {
        id: `ex-${Date.now()}`,
        patient_cpf: cpf,
        name: examName,
        doctor: doctor,
        dateRequested: new Date().toISOString().split('T')[0],
        status: Status.PENDING,
        category: 'Laboratorial',
        acknowledged: false
    };
    list.push(newItem);
    saveData(STORAGE_KEYS.EXAMS, list);
    return newItem;
};

export const addGuideToPatient = async (cpf: string, specialty: string, dateRegistered: string, deadline: string) => {
    await delay(300);
    const list = loadData(STORAGE_KEYS.GUIDES, INITIAL_GUIDES);
    const newItem = {
        id: `gd-${Date.now()}`,
        patient_cpf: cpf,
        specialty: specialty,
        doctor: 'Solicitação Interna', // Or use param if needed
        dateRequested: dateRegistered,
        deadline: deadline,
        status: Status.PENDING,
        acknowledged: false
    };
    list.push(newItem);
    saveData(STORAGE_KEYS.GUIDES, list);
    return newItem;
};

export const deleteItem = async (cpf: string, itemId: string, type: 'exam' | 'guide') => {
    await delay(200);
    const key = type === 'exam' ? STORAGE_KEYS.EXAMS : STORAGE_KEYS.GUIDES;
    const initial = type === 'exam' ? INITIAL_EXAMS : INITIAL_GUIDES;
    
    // Load full list
    let list = loadData(key, initial);
    
    // Filter out the item to delete
    const newList = list.filter((i: any) => i.id !== itemId);
    
    // Save new list
    saveData(key, newList);
    
    return await getPatientDetails(cpf);
};

export const editItem = async (cpf: string, itemId: string, type: 'exam' | 'guide', data: any) => {
    await delay(200);
    const key = type === 'exam' ? STORAGE_KEYS.EXAMS : STORAGE_KEYS.GUIDES;
    const initial = type === 'exam' ? INITIAL_EXAMS : INITIAL_GUIDES;
    
    const list = loadData(key, initial);
    const index = list.findIndex((i: any) => i.id === itemId);
    
    if (index !== -1) {
        list[index] = { ...list[index], ...data };
        saveData(key, list);
    }
    return true;
};

export const requestGuide = async (cpf: string, data: { specialty: string, doctor: string, attachmentUrl?: string, precCp?: string }) => {
    await delay(400);
    const list = loadData(STORAGE_KEYS.GUIDES, INITIAL_GUIDES);
    const newItem = {
        id: `gd-req-${Date.now()}`,
        patient_cpf: cpf,
        specialty: data.specialty,
        doctor: data.doctor,
        attachmentUrl: data.attachmentUrl,
        precCp: data.precCp,
        dateRequested: new Date().toISOString().split('T')[0],
        deadline: 'A calcular',
        status: Status.PENDING,
        acknowledged: false
    };
    list.push(newItem);
    saveData(STORAGE_KEYS.GUIDES, list);
    return newItem;
};

export const acknowledgeItem = async (cpf: string, itemId: string, type: 'exam' | 'guide') => {
    await delay(200);
    const key = type === 'exam' ? STORAGE_KEYS.EXAMS : STORAGE_KEYS.GUIDES;
    const initial = type === 'exam' ? INITIAL_EXAMS : INITIAL_GUIDES;
    
    const list = loadData(key, initial);
    const item = list.find((i: any) => i.id === itemId);
    if (item) {
        item.acknowledged = true;
        saveData(key, list);
    }
    return await getPatientDetails(cpf);
};

// --- DENTAL MOCK FUNCTIONS ---

export const getDentistsDatabase = () => DENTISTS_DATABASE;

export const checkDateAvailability = (dateString: string): 'available' | 'full' | 'unavailable' => {
    const date = new Date(dateString);
    const day = date.getDay();
    // Weekends unavailable
    if (day === 0 || day === 6) return 'unavailable';
    // Random mock availability for demo
    // For consistency in demo, let's say days divisible by 5 are full
    if (date.getDate() % 5 === 0) return 'full';
    return 'available';
};

export const getAvailableTimeSlots = (dateString: string): string[] => {
    // Return standard slots
    return ['08:00', '09:00', '10:00', '11:00', '13:30', '14:30', '15:30', '16:30'];
};

export const scheduleDentalAppointment = async (cpf: string, data: { procedure: string, date: string, time: string, dentist: string }) => {
    await delay(500);
    const list = loadData(STORAGE_KEYS.DENTAL, INITIAL_DENTAL_APPOINTMENTS);
    const newItem: DentalAppointment = {
        id: `dental-${Date.now()}`,
        patient_cpf: cpf,
        procedure: data.procedure,
        dentist: data.dentist,
        date: data.date,
        time: data.time,
        status: Status.READY // Auto confirm for demo
    };
    list.push(newItem);
    saveData(STORAGE_KEYS.DENTAL, list);
    return newItem;
};

// --- GETTERS FOR DATABASES ---
export const getLabExamsDatabase = () => LAB_EXAMS_DATABASE;
export const getGuideProceduresDatabase = () => GUIDE_PROCEDURES_DATABASE;
