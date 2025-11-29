export enum Status {
  PENDING = 'PENDING',       // Aguardando Coleta/Confecção
  PROCESSING = 'PROCESSING', // Em Processamento/Confecção
  READY = 'READY',           // Pronto para Retirada
  DELIVERED = 'DELIVERED',   // Entregue/Retirado
}

export type Role = 'patient' | 'exam_manager' | 'guide_manager';

export interface User {
  id: string;
  name: string;
  role: Role;
  cpf?: string;
}

export interface Patient {
  id: string;
  name: string;
  cpf: string;
  email: string;
  avatarUrl?: string;
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
  doctor: string;
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

// Stats for dashboard
export interface DashboardStats {
  pendingExams: number;
  processingExams: number;
  readyExams: number;
  availableGuides: number;
}