import { Patient, Exam, Guide, Status, Notification, User, PatientType, MilitaryOrganization, DentalAppointment } from '../types';
import { supabase } from './supabaseClient';

// --- CONSTANTS ---
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

export const DENTISTS_DATABASE = [
    "Cap Dentista Ana Souza",
    "Cap Dentista Carlos Ferreira",
    "Ten Dentista Marcos Oliveira",
    "Ten Dentista Julia Lima",
    "Ten Dentista Roberto Santos"
];

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

let globalSystemMessage: string = "";

// --- ASYNC FUNCTIONS ---

export const loginUser = async (credential: string, password: string): Promise<{ user: User; data?: any } | null> => {
  const lowerCred = credential.toLowerCase().trim();
  const cleanPassword = password.trim();

  try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('cpf', lowerCred)
        .eq('password', cleanPassword)
        .single();

      if (error || !data) return null;

      const user = { 
          id: data.id, 
          name: data.name, 
          role: data.role, 
          cpf: data.cpf 
      };

      if (data.role !== 'patient') {
          return { user };
      }

      // If patient, fetch all related data
      const patientDetails = await getPatientDetails(data.cpf);
      return {
          user,
          data: patientDetails
      };

  } catch (err) {
      console.error("Login error:", err);
      return null;
  }
};

export const getAllPatients = async (): Promise<Patient[]> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'patient');
  
  if (error) {
      console.error('Error fetching patients:', error);
      return [];
  }
  
  // Map snake_case DB to camelCase Types
  return data.map(p => ({
      id: p.id,
      name: p.name,
      cpf: p.cpf,
      email: p.email || '',
      type: p.type,
      om: p.om,
      precCp: p.prec_cp,
      holderName: p.holder_name,
      birthDate: p.birth_date // Assumes column might exist if registered via form
  }));
};

export const getPatientDetails = async (cpf: string) => {
    try {
        const profileReq = supabase.from('profiles').select('*').eq('cpf', cpf).single();
        const examsReq = supabase.from('exams').select('*').eq('patient_cpf', cpf).order('created_at', { ascending: false });
        const guidesReq = supabase.from('guides').select('*').eq('patient_cpf', cpf).order('created_at', { ascending: false });
        const dentalReq = supabase.from('dental_appointments').select('*').eq('patient_cpf', cpf).order('created_at', { ascending: false });
        const notifReq = supabase.from('notifications').select('*').eq('patient_cpf', cpf).order('created_at', { ascending: false });

        const [profileRes, examsRes, guidesRes, dentalRes, notifRes] = await Promise.all([
            profileReq, examsReq, guidesReq, dentalReq, notifReq
        ]);

        if (profileRes.error) throw profileRes.error;

        // Map data structures
        const profile: Patient = {
            id: profileRes.data.id,
            name: profileRes.data.name,
            cpf: profileRes.data.cpf,
            email: profileRes.data.email,
            type: profileRes.data.type,
            om: profileRes.data.om,
            precCp: profileRes.data.prec_cp,
            holderName: profileRes.data.holder_name,
            birthDate: profileRes.data.birth_date
        };

        const exams: Exam[] = (examsRes.data || []).map(e => ({
            id: e.id,
            name: e.name,
            dateRequested: e.date_requested,
            status: e.status,
            doctor: e.doctor,
            category: e.category,
            acknowledged: e.acknowledged
        }));

        const guides: Guide[] = (guidesRes.data || []).map(g => ({
            id: g.id,
            specialty: g.specialty,
            doctor: g.doctor,
            dateRequested: g.date_requested,
            deadline: g.deadline,
            status: g.status,
            attachmentUrl: g.attachment_url,
            acknowledged: g.acknowledged
        }));

        const dentalAppointments: DentalAppointment[] = (dentalRes.data || []).map(d => ({
            id: d.id,
            dentist: d.dentist,
            procedure: d.procedure,
            date: d.date,
            time: d.time,
            status: d.status
        }));

        const notifications: Notification[] = (notifRes.data || []).map(n => ({
            id: n.id,
            title: n.title,
            message: n.message,
            date: n.date,
            read: n.read,
            type: n.type
        }));

        return { profile, exams, guides, dentalAppointments, notifications };

    } catch (error) {
        console.error("Error getting patient details:", error);
        return null;
    }
};

export const registerPatient = async (patientData: Patient, password?: string) => {
    try {
        const { error } = await supabase.from('profiles').insert({
            cpf: patientData.cpf,
            password: password || patientData.cpf.replace(/\D/g, ''),
            name: patientData.name,
            role: 'patient',
            type: patientData.type,
            om: patientData.om,
            prec_cp: patientData.precCp,
            holder_name: patientData.holderName,
            email: patientData.email
            // birth_date is handled if you add it to the schema, passing it here if schema allows
        });

        if (error) {
            if (error.code === '23505') return { success: false, message: "CPF já cadastrado." };
            return { success: false, message: error.message };
        }
        return { success: true };
    } catch (e) {
        return { success: false, message: "Erro de conexão." };
    }
};

export const changePatientPassword = async (cpf: string, newPassword: string) => {
    const { error } = await supabase
        .from('profiles')
        .update({ password: newPassword })
        .eq('cpf', cpf);
    return !error;
};

export const getGlobalAnnouncement = () => globalSystemMessage;

export const setGlobalAnnouncement = (message: string) => {
    globalSystemMessage = message;
};

export const sendPatientNotification = async (cpf: string, title: string, message: string) => {
    const { error } = await supabase.from('notifications').insert({
        patient_cpf: cpf,
        title,
        message,
        date: new Date().toISOString().split('T')[0],
        read: false,
        type: 'info'
    });
    return !error;
};

export const getLabExamsDatabase = () => LAB_EXAMS_DATABASE;
export const getGuideProceduresDatabase = () => GUIDE_PROCEDURES_DATABASE;
export const getDentistsDatabase = () => DENTISTS_DATABASE;

export const updateExamStatus = async (cpf: string, examId: string, newStatus: Status) => {
    await supabase.from('exams').update({ status: newStatus }).eq('id', examId);
};

export const updateGuideStatus = async (cpf: string, guideId: string, newStatus: Status) => {
    await supabase.from('guides').update({ status: newStatus }).eq('id', guideId);
};

export const updateDentalStatus = async (cpf: string, appointId: string, newStatus: Status) => {
    await supabase.from('dental_appointments').update({ status: newStatus }).eq('id', appointId);
};

export const addExamToPatient = async (cpf: string, examName: string, doctor: string) => {
    const { data, error } = await supabase.from('exams').insert({
        patient_cpf: cpf,
        name: examName,
        doctor: doctor,
        date_requested: new Date().toISOString().split('T')[0],
        status: Status.PENDING,
        category: 'Laboratorial',
        acknowledged: false
    }).select().single();
    
    if (error) return null;
    return {
        id: data.id,
        name: data.name,
        doctor: data.doctor,
        dateRequested: data.date_requested,
        status: data.status,
        category: data.category,
        acknowledged: data.acknowledged
    };
};

export const addGuideToPatient = async (cpf: string, specialty: string, dateRegistered: string, deadline: string) => {
    const { data, error } = await supabase.from('guides').insert({
        patient_cpf: cpf,
        specialty: specialty,
        doctor: 'Solicitação Interna',
        date_requested: dateRegistered,
        deadline: deadline,
        status: Status.PENDING,
        acknowledged: false
    }).select().single();

    if (error) return null;
    return {
        id: data.id,
        specialty: data.specialty,
        doctor: data.doctor,
        dateRequested: data.date_requested,
        deadline: data.deadline,
        status: data.status,
        acknowledged: data.acknowledged
    };
};

export const deleteItem = async (cpf: string, itemId: string, type: 'exam' | 'guide' | 'dental') => {
    const table = type === 'exam' ? 'exams' : type === 'guide' ? 'guides' : 'dental_appointments';
    const { error } = await supabase.from(table).delete().eq('id', itemId);
    return !error;
};

export const editItem = async (cpf: string, itemId: string, type: 'exam' | 'guide' | 'dental', data: any) => {
    const table = type === 'exam' ? 'exams' : type === 'guide' ? 'guides' : 'dental_appointments';
    // Need to map frontend camelCase to backend snake_case if necessary, or assume 1:1 for specific fields
    // For simplicity, we are handling basic fields.
    const payload: any = {};
    if (type === 'exam') {
        payload.name = data.name;
        payload.doctor = data.doctor;
    } else if (type === 'guide') {
        payload.specialty = data.specialty;
        payload.deadline = data.deadline; // Assuming this is editable
        payload.date_requested = data.dateRequested;
    } else if (type === 'dental') {
        payload.procedure = data.procedure;
        payload.dentist = data.dentist;
        payload.date = data.date;
        payload.time = data.time;
    }

    const { error } = await supabase.from(table).update(payload).eq('id', itemId);
    return !error;
}

export const requestGuide = async (cpf: string, data: { specialty: string, doctor: string, attachmentUrl?: string }) => {
    const { data: res, error } = await supabase.from('guides').insert({
        patient_cpf: cpf,
        specialty: data.specialty,
        doctor: data.doctor,
        attachment_url: data.attachmentUrl,
        date_requested: new Date().toISOString().split('T')[0],
        deadline: 'A calcular',
        status: Status.PENDING,
        acknowledged: false
    }).select().single();
    
    if (error) return null;
    return res;
};

// Dental Functions
export const checkDateAvailability = (dateStr: string) => {
    // Keep local logic for now as it's purely algorithmic in the mock
    const date = new Date(dateStr + 'T00:00:00');
    const day = date.getDay();
    const dayNum = date.getDate();

    if (day === 0 || day === 6) return 'unavailable'; 
    if (dayNum % 7 === 0) return 'full'; 
    
    return 'available';
};

export const getAvailableTimeSlots = (dateStr: string) => {
    return [
        "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
        "13:30", "14:00", "14:30", "15:00", "15:30", "16:00"
    ];
};

export const scheduleDentalAppointment = async (cpf: string, data: { procedure: string, date: string, time: string, dentist: string }) => {
    const { data: res, error } = await supabase.from('dental_appointments').insert({
        patient_cpf: cpf,
        dentist: data.dentist,
        procedure: data.procedure,
        date: data.date,
        time: data.time,
        status: Status.PENDING
    }).select().single();

    if (error) return null;
    return {
        id: res.id,
        dentist: res.dentist,
        procedure: res.procedure,
        date: res.date,
        time: res.time,
        status: res.status
    };
};

export const acknowledgeItem = async (cpf: string, itemId: string, type: 'exam' | 'guide') => {
    const table = type === 'exam' ? 'exams' : 'guides';
    await supabase.from(table).update({ acknowledged: true }).eq('id', itemId);
    // Return fresh data
    return await getPatientDetails(cpf);
};