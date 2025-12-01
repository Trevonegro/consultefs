
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
    // 1. Normalizar credenciais
    const emailInput = credential.trim().toLowerCase();

    // 2. Fazer login no Supabase Auth
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

    // 3. Buscar o perfil do usuário
    let { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    // --- LOGICA DE DETERMINAÇÃO DE ROLE (HIERARQUIA DE PODER) ---
    // 1. Prioridade Máxima: Emails Hardcoded de Gestores
    // Verifica tanto o email exato quanto padrões para flexibilidade
    let finalRole: string = 'patient'; // Default seguro

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
    } else if (profile && profile.role) {
        // 2. Prioridade Média: Role vinda do Banco de Dados
        finalRole = profile.role;
    } else if (authData.user.user_metadata?.role) {
        // 3. Prioridade Baixa: Metadados do Auth
        finalRole = authData.user.user_metadata.role;
    }

    // --- FAILSAFE / RECUPERAÇÃO DE PERFIL ---
    // Se não existir perfil no banco, cria um baseado na role determinada
    if (!profile) {
         console.warn("Perfil ausente. Criando perfil temporário na memória e tentando salvar no banco.");
         
         const meta = authData.user.user_metadata || {};
         const newProfile = {
             id: userId,
             name: meta.name || userEmail.split('@')[0],
             email: userEmail,
             cpf: meta.cpf || '',
             role: finalRole, // Usa a role calculada acima
             om: meta.om || 'CIA CMDO',
             type: meta.type || 'TITULAR',
             prec_cp: meta.precCp || '',
             holder_name: meta.holderName || '',
             birth_date: meta.birthDate || null
         };

         // Tenta persistir para corrigir logins futuros
         await supabase.from('profiles').upsert(newProfile);
         profile = newProfile;
    } else {
        // Se o perfil existe, mas a role calculada (via email hardcoded) for diferente da do banco,
        // atualizamos o objeto em memória para garantir o acesso correto AGORA.
        if (profile.role !== finalRole) {
            console.log(`Atualizando role em memória: ${profile.role} -> ${finalRole}`);
            profile.role = finalRole;
        }
    }

    console.log(`Login Sucesso: ${userEmail} -> Role Definida: ${finalRole}`);

    // 4. RETORNAR DADOS BASEADOS NA ROLE FINAL
    if (finalRole === 'exam_manager' || finalRole === 'guide_manager') {
      return {
        success: true,
        user: {
          id: profile.id,
          name: profile.name,
          role: finalRole as Role,
          cpf: profile.cpf,
          email: userEmail, // FIX: Use userEmail from Auth, not profile.email
        } as User,
        data: undefined, // Gestores não precisam carregar dados de paciente aqui
      };
    }

    // Fluxo Padrão (Paciente)
    // Mesmo que finalRole seja desconhecido, tratamos como paciente para evitar crash
    const { data: exams } = await supabase
    .from('exams')
    .select('*')
    .eq('patient_id', profile.id)
    .order('date_requested', { ascending: false });

    const { data: guides } = await supabase
    .from('guides')
    .select('*')
    .eq('patient_id', profile.id)
    .order('date_requested', { ascending: false });

    const { data: notifications } = await supabase
    .from('notifications')
    .select('*')
    .eq('patient_id', profile.id)
    .order('date', { ascending: false });

    return {
    success: true,
    user: {
        id: profile.id,
        name: profile.name,
        role: 'patient' as Role, // Garante que o App receba 'patient' se caiu aqui
        cpf: profile.cpf,
        email: userEmail, // FIX: Use userEmail from Auth
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
