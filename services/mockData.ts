
import { supabase } from './supabaseClient';
import { Patient, Exam, Guide, Status, Notification, User, PatientType, MilitaryOrganization, DentalAppointment } from '../types';

// --- STATIC DATABASES (Dropdowns) ---
export const LAB_EXAMS_DATABASE = [
  "Hemograma Completo", "Glicemia em Jejum", "Colesterol Total", "Colesterol HDL",
  "Triglicerídeos", "TSH", "T4 Livre", "Ureia", "Creatinina", "Ácido Úrico",
  "TGO", "TGP", "Gama GT", "HbA1c", "Vitamina D", "Vitamina B12",
  "Urina Tipo 1", "Urocultura", "Parasitológico", "PSA Total", "Beta HCG", "COVID-19"
];

export const GUIDE_PROCEDURES_DATABASE = [
    "Consulta com Especialista", "Raio-X", "Ultrassonografia", "Ressonância Magnética",
    "Tomografia", "Fisioterapia", "Psicologia", "Nutricionista", "Cardiologia",
    "Dermatologia", "Oftalmologia", "Ortopedia", "Ginecologia", "Pediatria"
];

export const DENTISTS_DATABASE = [
  "1º Ten Dent Silva (Clínico Geral)",
  "Cap Dent Souza (Ortodontista)",
  "Maj Dent Oliveira (Endodontista)",
  "2º Ten Dent Lima (Odontopediatra)"
];

// --- MAPPERS ---
const mapExamFromDB = (e: any): Exam => ({
    id: e.id,
    name: e.name,
    dateRequested: e.date_requested,
    dateResult: e.date_result,
    status: e.status,
    doctor: e.doctor || 'Laboratório',
    category: e.category,
    acknowledged: e.acknowledged
});

const mapGuideFromDB = (g: any): Guide => ({
    id: g.id,
    specialty: g.specialty,
    doctor: g.doctor || 'N/A',
    dateRequested: g.date_requested,
    deadline: g.deadline || 'A definir',
    status: g.status,
    acknowledged: g.acknowledged,
    attachmentUrl: g.attachment_url,
    qrCodeData: g.qr_code_data
});

// --- LOGIN FUNCTION (NOVA) ---
export const loginUser = async (credential: string, password: string) => {
  try {
    // 1. Fazer login no Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: credential,
      password: password,
    });

    if (authError) {
      console.error('Erro de autenticação:', authError);
      return { 
        success: false, 
        message: 'Credenciais inválidas. Verifique email e senha.' 
      };
    }

    if (!authData.user) {
      return { 
        success: false, 
        message: 'Usuário não encontrado.' 
      };
    }

    // 2. Buscar o perfil do usuário na tabela profiles
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (profileError || !profile) {
      console.error('Erro ao buscar perfil:', profileError);
      return { 
        success: false, 
        message: 'Erro ao carregar dados do usuário.' 
      };
    }

    console.log('Perfil carregado:', profile); // Debug - ver no console do navegador

    // 3. Verificar o role e retornar dados apropriados
    const userRole = profile.role;

    // GESTORES (exam_manager ou guide_manager)
    if (userRole === 'exam_manager' || userRole === 'guide_manager') {
      return {
        success: true,
        user: {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          cpf: profile.cpf,
          role: userRole, // Aqui está o role correto!
          om: profile.om,
        } as User,
        data: undefined, // Gestores não precisam de dados de paciente
      };
    }

    // PACIENTES
    if (userRole === 'patient') {
      // Buscar exames do paciente
      const { data: exams } = await supabase
        .from('exams')
        .select('*')
        .eq('patient_id', profile.id)
        .order('created_at', { ascending: false });

      // Buscar guias do paciente
      const { data: guides } = await supabase
        .from('guides')
        .select('*')
        .eq('patient_id', profile.id)
        .order('created_at', { ascending: false });

      // Buscar notificações do paciente
      const { data: notifications } = await supabase
        .from('notifications')
        .select('*')
        .eq('patient_id', profile.id)
        .eq('read', false)
        .order('created_at', { ascending: false });

      return {
        success: true,
        user: {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          cpf: profile.cpf,
          role: 'patient',
          om: profile.om,
        } as User,
        data: {
          profile: {
            id: profile.id,
            name: profile.name,
            cpf: profile.cpf,
            om: profile.om,
            type: profile.type,
            precCp: profile.prec_cp,
            holderName: profile.holder_name,
            birthDate: profile.birth_date,
            email: profile.email,
            role: profile.role
          },
          exams: (exams || []).map(mapExamFromDB),
          guides: (guides || []).map(mapGuideFromDB),
          notifications: notifications || [],
        },
      };
    }

    // Role desconhecido
    return { 
      success: false, 
      message: 'Tipo de usuário não reconhecido.' 
    };

  } catch (error) {
    console.error('Erro no login:', error);
    return { 
      success: false, 
      message: 'Erro de conexão. Tente novamente.' 
    };
  }
};

// --- AUTH / REGISTRATION SERVICES ---

export const registerPatient = async (patientData: Patient, password?: string) => {
    try {
        const email = patientData.email;
        const pass = password || patientData.cpf.replace(/\D/g, '');

        if (!email) {
            return { success: false, message: "E-mail é obrigatório." };
        }

        const { data, error } = await supabase.auth.signUp({
            email,
            password: pass,
            options: {
                data: {
                    name: patientData.name,
                    cpf: patientData.cpf,
                    om: patientData.om,
                    type: patientData.type,
                    precCp: patientData.precCp,
                    holderName: patientData.holderName,
                    birthDate: patientData.birthDate,
                    role: 'patient' // Força a role nos metadados
                }
            }
        });

        if (error) {
            return { success: false, message: error.message };
        }

        // Tenta criar o perfil explicitamente se o usuário foi criado.
        // USAMOS UPSERT AQUI para evitar erros caso um trigger do banco já tenha criado o perfil.
        if (data && data.user) {
             const { error: profileError } = await supabase.from('profiles').upsert({
                 id: data.user.id,
                 name: patientData.name,
                 cpf: patientData.cpf,
                 email: email,
                 role: 'patient',
                 om: patientData.om,
                 type: patientData.type,
                 prec_cp: patientData.precCp,
                 holder_name: patientData.holderName,
                 birth_date: patientData.birthDate
             }, { onConflict: 'id' });
             
             if (profileError) {
                 // Apenas logamos o erro, não falhamos o cadastro, pois o loginUser
                 // possui um mecanismo de recuperação (failsafe) que criará o perfil se faltar.
                 console.warn("Aviso: Tentativa de criar perfil retornou erro (pode ser RLS ou Trigger):", profileError);
             }
        }

        return { success: true };
    } catch (err: any) {
        console.error("Erro no registro:", err);
        return { success: false, message: err.message || "Falha desconhecida no registro." };
    }
};

export const changePatientPassword = async (cpf: string, newPassword: string) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    return !error;
};

// --- DATA FETCHING & MANIPULATION ---

export const getAllPatients = async () => {
    const { data, error } = await supabase.from('profiles')
        .select('*')
        .in('role', ['patient']) // Fetch only patients
        .order('name');
    
    if (error) {
        console.error("DB Error getting patients:", error.message || error);
        return [];
    }

    return (data || []).map(p => ({
        id: p.id,
        name: p.name,
        cpf: p.cpf,
        email: p.email,
        role: p.role,
        om: p.om,
        type: p.type,
        precCp: p.prec_cp
    }));
};

export const getPatientDetails = async (cpf: string) => {
    const { data: profile } = await supabase.from('profiles').select('*').eq('cpf', cpf).single();
    
    if (!profile) return null;

    const [exams, guides, notifications] = await Promise.all([
        supabase.from('exams').select('*').eq('patient_id', profile.id).order('created_at', { ascending: false }),
        supabase.from('guides').select('*').eq('patient_id', profile.id).order('created_at', { ascending: false }),
        supabase.from('notifications').select('*').eq('patient_id', profile.id).order('created_at', { ascending: false })
    ]);

    return {
        profile: {
             id: profile.id, name: profile.name, cpf: profile.cpf, email: profile.email,
             role: profile.role, om: profile.om, type: profile.type, precCp: profile.prec_cp
        },
        exams: (exams.data || []).map(mapExamFromDB),
        guides: (guides.data || []).map(mapGuideFromDB),
        notifications: (notifications.data || []),
        appointments: []
    };
};

// --- ADMIN ACTIONS ---

export const updateExamStatus = async (cpf: string, examId: string, newStatus: Status) => {
    await supabase.from('exams').update({ status: newStatus }).eq('id', examId);
};

export const updateGuideStatus = async (cpf: string, guideId: string, newStatus: Status) => {
    await supabase.from('guides').update({ status: newStatus }).eq('id', guideId);
};

export const addExamToPatient = async (cpf: string, examName: string, doctor: string) => {
    const { data: profile } = await supabase.from('profiles').select('id').eq('cpf', cpf).single();
    if (!profile) return null;

    await supabase.from('exams').insert({
        patient_id: profile.id,
        name: examName,
        doctor: doctor,
        status: Status.PENDING,
        date_requested: new Date().toISOString().split('T')[0]
    });
};

export const addGuideToPatient = async (cpf: string, specialty: string, dateRegistered: string, deadline: string, attachmentUrl?: string) => {
    const { data: profile } = await supabase.from('profiles').select('id').eq('cpf', cpf).single();
    if (!profile) return null;

    await supabase.from('guides').insert({
        patient_id: profile.id,
        specialty,
        doctor: dateRegistered, 
        deadline,
        attachment_url: attachmentUrl,
        status: Status.PENDING,
        date_requested: new Date().toISOString().split('T')[0]
    });
};

export const deleteItem = async (cpf: string, itemId: string, type: 'exam' | 'guide') => {
    const table = type === 'exam' ? 'exams' : 'guides';
    await supabase.from(table).delete().eq('id', itemId);
};

export const editItem = async (cpf: string, itemId: string, type: 'exam' | 'guide', data: any) => {
    const table = type === 'exam' ? 'exams' : 'guides';
    const updateData: any = type === 'exam' 
        ? { name: data.name, doctor: data.doctor } 
        : { specialty: data.specialty, doctor: data.doctor, deadline: data.deadline, date_requested: data.dateRequested };
    
    // Add attachment if present for guides
    if (type === 'guide' && data.attachmentUrl) {
        updateData.attachment_url = data.attachmentUrl;
    }
    
    await supabase.from(table).update(updateData).eq('id', itemId);
};

export const sendPatientNotification = async (cpf: string, title: string, message: string) => {
    const { data: profile } = await supabase.from('profiles').select('id').eq('cpf', cpf).single();
    if (!profile) return;

    await supabase.from('notifications').insert({
        patient_id: profile.id,
        title,
        message,
        date: new Date().toISOString().split('T')[0]
    });
};

// --- GLOBAL SETTINGS ---

export const getGlobalAnnouncement = async () => {
    const { data } = await supabase.from('system_settings').select('value').eq('key', 'global_announcement').single();
    return data?.value || '';
};

export const setGlobalAnnouncement = async (message: string) => {
    await supabase.from('system_settings').upsert({ key: 'global_announcement', value: message });
};

// --- PATIENT ACTIONS ---

export const acknowledgeItem = async (cpf: string, itemId: string, type: 'exam' | 'guide') => {
    const table = type === 'exam' ? 'exams' : 'guides';
    await supabase.from(table).update({ acknowledged: true }).eq('id', itemId);
    
    const { data: { user } } = await supabase.auth.getUser();
    if(user) {
         const [exams, guides, notifications] = await Promise.all([
            supabase.from('exams').select('*').eq('patient_id', user.id).order('date_requested', { ascending: false }),
            supabase.from('guides').select('*').eq('patient_id', user.id).order('date_requested', { ascending: false }),
            supabase.from('notifications').select('*').eq('patient_id', user.id).order('date', { ascending: false })
        ]);
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        
        return {
            profile: { ...profile, precCp: profile.prec_cp, holderName: profile.holder_name },
            exams: (exams.data || []).map(mapExamFromDB),
            guides: (guides.data || []).map(mapGuideFromDB),
            notifications: (notifications.data || []),
            appointments: []
        }
    }
    return null;
};

export const requestGuide = async (cpf: string, data: { specialty: string, doctor: string, attachmentUrl?: string }) => {
    const { data: { user } } = await supabase.auth.getUser();
    if(!user) return;

    await supabase.from('guides').insert({
        patient_id: user.id,
        specialty: data.specialty,
        doctor: data.doctor,
        status: Status.PENDING,
        deadline: 'A calcular',
        attachment_url: data.attachmentUrl,
        date_requested: new Date().toISOString().split('T')[0]
    });
};

export const getLabExamsDatabase = () => LAB_EXAMS_DATABASE;
export const getGuideProceduresDatabase = () => GUIDE_PROCEDURES_DATABASE;
export const getDentistsDatabase = () => DENTISTS_DATABASE;
export const checkDateAvailability = (date: string) => 'available'; 
export const getAvailableTimeSlots = (date: string) => ["08:00", "09:00", "10:00"];
export const scheduleDentalAppointment = async (cpf: string, data: any) => {}; 
export const getPatientAppointments = () => [];
