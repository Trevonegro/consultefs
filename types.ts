

export enum Status {
  PENDING = 'PENDING',       // Aguardando Coleta/Confecção/Confirmação
  PROCESSING = 'PROCESSING', // Em Processamento/Confecção
  READY = 'READY',           // Pronto para Retirada/Confirmado
  DELIVERED = 'DELIVERED',   // Entregue/Retirado/Realizado
  CANCELED = 'CANCELED'      // Cancelado
}

export type Role = 'patient' | 'exam_manager' | 'guide_manager';

export interface User {
  id: string;
  name: string;
  role: Role;
  cpf?: string;
}

export type PatientType = 'TITULAR' | 'DEPENDENTE';
export type MilitaryOrganization = 'CIA CMDO' | '6ª CIA COM' | 'COMANDO DA BRIGADA' | 'PEL PE';

export interface Patient {
  id: string;
  name: string;
  cpf: string;
  email: string; // Used as placeholder or optional
  avatarUrl?: string;
  role?: Role;
  // New fields
  birthDate?: string;
  precCp?: string; // Numbers only
  type?: PatientType;
  holderName?: string; // Required if type is DEPENDENTE
  om?: MilitaryOrganization;
}

export interface Exam {
  id: string;
  name: string;
  dateRequested: string;
  dateResult?: string;
  status: Status;
  doctor: string;
  category: string; // e.g., "Laboratorial", "Imagem"
  resultValue?: number; // For charts
  resultUnit?: string;
  acknowledged?: boolean;
}

export interface Guide {
  id: string;
  specialty: string;
  doctor: string; // Can be used as "Data do Cadastro" context or keep doctor name if needed, but UI will change
  dateRequested: string;
  deadline: string;
  status: Status;
  qrCodeData?: string;
  acknowledged?: boolean;
  attachmentUrl?: string; // URL/Base64 of the medical order photo
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'info' | 'success' | 'warning';
}

export interface DentalAppointment {
  id: string;
  procedure: string;
  date: string;
  time: string;
  dentist: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELED';
}

// Stats for dashboard
export interface DashboardStats {
  pendingExams: number;
  processingExams: number;
  readyExams: number;
  availableGuides: number;
}