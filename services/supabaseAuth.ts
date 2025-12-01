
import { supabase } from './supabaseClient';
import { User, Patient, Exam, Guide, Notification, Role } from '../types';

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

export const loginUser = async (credential: string, password: string) => {
  try {
    const emailInput = credential.trim().toLowerCase();

    // 1. Fazer login no Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: emailInput,
      password: password,
    });

    if (authError) {
      console.error('Erro de autenticação:', authError.message);
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

    const userId = authData.user.id;
    const userEmail = (authData.user.email || '').trim().toLowerCase();

    // 2. Buscar o perfil do usuário
    let { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    // --- DETERMINAÇÃO DE ROLE ---
    // Verifica roles administrativas hardcoded (Failsafe)
    let finalRole: string = 'patient'; 

    const isExamManager = 
        userEmail === 'gestor.exames.v4@admin.com' || 
        userEmail.includes('gestor.exames') ||
        userEmail === 'gestorexames@gmail.com'; 
    
    const isGuideManager = 
        userEmail === 'gestor.guias.v4@admin.com' || 
        userEmail.includes('gestor.guias') ||
        userEmail === 'gestorguias@gmail.com';

    if (isExamManager) {
        finalRole = 'exam_manager';
    } else if (isGuideManager) {
        finalRole = 'guide_manager';
    } else if (profile?.role) {
        finalRole = profile.role;
    } else if (authData.user.user_metadata?.role) {
        finalRole = authData.user.user_metadata.role;
    }

    // --- RECUPERAÇÃO DE PERFIL (Se não existir no banco) ---
    if (!profile) {
         console.warn("Perfil ausente. Tentando recuperar/criar com base no Auth.");
         const meta = authData.user.user_metadata || {};
         const newProfile = {
             id: userId,
             name: meta.name || userEmail.split('@')[0],
             email: userEmail,
             cpf: meta.cpf || '',
             role: finalRole,
             om: meta.om || 'CIA CMDO',
             type: meta.type || 'TITULAR',
             prec_cp: meta.precCp || '',
             holder_name: meta.holderName || '',
             birth_date: meta.birthDate || null
         };

         // Tenta salvar no banco (Upsert)
         const { error: upsertError } = await supabase.from('profiles').upsert(newProfile);
         
         if (upsertError) {
             console.error("Erro ao criar perfil de recuperação:", upsertError);
             // Mesmo com erro, continuamos com o objeto em memória para não bloquear o acesso
         }
         profile = newProfile;
    } else {
        // Se a role calculada for diferente da do banco (ex: virou admin hardcoded), atualiza em memória
        if (finalRole !== 'patient' && profile.role !== finalRole) {
            profile.role = finalRole;
        }
    }

    // 3. RETORNO DOS DADOS
    
    // Gestores
    if (finalRole === 'exam_manager' || finalRole === 'guide_manager') {
      return {
        success: true,
        user: {
          id: profile.id,
          name: profile.name,
          role: finalRole as Role,
          cpf: profile.cpf,
          email: userEmail,
        } as User,
        data: undefined,
      };
    }

    // Pacientes (Default)
    const { data: exams } = await supabase
        .from('exams')
        .select('*')
        .eq('patient_id', profile.id)
        .order('created_at', { ascending: false });

    const { data: guides } = await supabase
        .from('guides')
        .select('*')
        .eq('patient_id', profile.id)
        .order('created_at', { ascending: false });

    const { data: notifications } = await supabase
        .from('notifications')
        .select('*')
        .eq('patient_id', profile.id)
        .order('created_at', { ascending: false });

    return {
        success: true,
        user: {
            id: profile.id,
            name: profile.name,
            role: 'patient' as Role,
            cpf: profile.cpf,
            email: userEmail,
        } as User,
        data: {
            profile: {
                id: profile.id,
                name: profile.name,
                cpf: profile.cpf,
                email: userEmail,
                om: profile.om,
                type: profile.type,
                precCp: profile.prec_cp,
                holderName: profile.holder_name,
                birthDate: profile.birth_date,
                role: 'patient' as Role
            } as Patient,
            exams: (exams || []).map(mapExamFromDB),
            guides: (guides || []).map(mapGuideFromDB),
            notifications: (notifications || []),
        },
    };

  } catch (error: any) {
    console.error('Erro crítico no login:', error);
    return { 
      success: false, 
      message: 'Erro interno. Verifique sua conexão.' 
    };
  }
};

export const logoutUser = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Erro ao fazer logout:', error);
  }
};

export const getGlobalAnnouncement = async () => {
  try {
    const { data, error } = await supabase
      .from('system_settings')
      .select('value')
      .eq('key', 'global_announcement')
      .single();

    if (error) return '';
    return data?.value || '';
  } catch (error) {
    return '';
  }
};
