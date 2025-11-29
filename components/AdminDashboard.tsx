import React, { useState, useEffect } from 'react';
import { getAllPatients, getPatientDetails, updateExamStatus, updateGuideStatus, addExamToPatient, addGuideToPatient, getLabExamsDatabase, getGlobalAnnouncement, setGlobalAnnouncement, sendPatientNotification } from '../services/mockData';
import { Status, Patient, Role } from '../types';
import { Search, User, Activity, FileText, Check, Truck, Clock, RefreshCw, Plus, X, ChevronRight, Filter, Users, ClipboardList, Paperclip, Megaphone, Send, MessageSquare } from 'lucide-react';

interface AdminDashboardProps {
  role: Role;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ role }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatientCpf, setSelectedPatientCpf] = useState<string | null>(null);
  const [viewingAttachment, setViewingAttachment] = useState<string | null>(null);
  
  // Global Announcement State
  const [globalMsg, setGlobalMsg] = useState('');
  const [isEditingGlobal, setIsEditingGlobal] = useState(false);
  
  // Direct Message State
  const [isMessaging, setIsMessaging] = useState(false);
  const [msgTitle, setMsgTitle] = useState('');
  const [msgContent, setMsgContent] = useState('');

  // Forms state
  const [isAdding, setIsAdding] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemDoctor, setNewItemDoctor] = useState('');
  const [newItemDeadline, setNewItemDeadline] = useState('');

  // Force re-render after update
  const [tick, setTick] = useState(0); 
  
  // Get database of exams
  const examDatabase = getLabExamsDatabase();
  const allPatientsList = getAllPatients();

  // Load initial global message
  useEffect(() => {
    setGlobalMsg(getGlobalAnnouncement());
  }, []);

  const patients = allPatientsList.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.cpf.includes(searchTerm)
  );

  const activePatientData = selectedPatientCpf ? getPatientDetails(selectedPatientCpf) : null;

  // Stats calculation (Mock logic based on filtered view or total)
  const stats = {
      totalPatients: allPatientsList.length,
      activeItems: 12, // Placeholder
      completedItems: 45 // Placeholder
  };

  const handleStatusChange = (type: 'exam' | 'guide', id: string, status: Status) => {
    if (!selectedPatientCpf) return;
    
    if (type === 'exam') {
      updateExamStatus(selectedPatientCpf, id, status);
    } else {
      updateGuideStatus(selectedPatientCpf, id, status);
    }
    setTick(t => t + 1); // Refresh UI
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatientCpf) return;

    if (role === 'exam_manager') {
      addExamToPatient(selectedPatientCpf, newItemName, newItemDoctor);
    } else if (role === 'guide_manager') {
      addGuideToPatient(selectedPatientCpf, newItemName, newItemDoctor, newItemDeadline);
    }

    // Reset and close
    setIsAdding(false);
    setNewItemName('');
    setNewItemDoctor('');
    setNewItemDeadline('');
    setTick(t => t + 1);
  };

  const handleUpdateGlobal = () => {
    setGlobalAnnouncement(globalMsg);
    setIsEditingGlobal(false);
    alert("Aviso geral atualizado com sucesso!");
  };

  const handleSendMessage = (e: React.FormEvent) => {
      e.preventDefault();
      if (!selectedPatientCpf) return;

      sendPatientNotification(selectedPatientCpf, msgTitle, msgContent);
      setIsMessaging(false);
      setMsgTitle('');
      setMsgContent('');
      alert("Mensagem enviada para o paciente.");
      setTick(t => t + 1);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 flex flex-col min-h-[calc(100vh-5rem)]">
      
      {/* Top Section: Stats & Global Announcement */}
      {!selectedPatientCpf && (
        <div className="space-y-6 animate-fade-in">
             {/* Global Announcement Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-amber-100 p-2 rounded-lg text-amber-600">
                            <Megaphone className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-slate-800">Comunicação Institucional (Aviso Geral)</h3>
                    </div>
                    {!isEditingGlobal && (
                        <button 
                            onClick={() => setIsEditingGlobal(true)}
                            className="text-sm text-slate-500 hover:text-slate-800 underline"
                        >
                            Editar Aviso
                        </button>
                    )}
                </div>

                {isEditingGlobal ? (
                    <div className="space-y-3">
                        <textarea
                            className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                            rows={3}
                            placeholder="Digite o aviso que aparecerá para todos os pacientes..."
                            value={globalMsg}
                            onChange={(e) => setGlobalMsg(e.target.value)}
                        />
                        <div className="flex gap-2 justify-end">
                            <button 
                                onClick={() => setIsEditingGlobal(false)}
                                className="px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 rounded-lg"
                            >
                                Cancelar
                            </button>
                            <button 
                                onClick={handleUpdateGlobal}
                                className="px-4 py-2 text-sm bg-amber-600 text-white rounded-lg hover:bg-amber-700 font-medium"
                            >
                                Salvar Aviso
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className={`p-4 rounded-xl text-sm ${globalMsg ? 'bg-amber-50 text-amber-900 border border-amber-100' : 'bg-gray-50 text-gray-400 italic'}`}>
                        {globalMsg || "Nenhum aviso geral configurado no momento."}
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard 
                    icon={Users} 
                    label="Total de Pacientes" 
                    value={stats.totalPatients.toString()} 
                    color="bg-slate-800" 
                />
                <StatCard 
                    icon={RefreshCw} 
                    label="Itens em Processamento" 
                    value="12" 
                    color="bg-amber-600" 
                />
                <StatCard 
                    icon={Check} 
                    label="Prontos Hoje" 
                    value="8" 
                    color="bg-emerald-600" 
                />
            </div>
        </div>
      )}

      <div className="flex-grow space-y-6">
        
        {/* Search & Selection View */}
        {!activePatientData ? (
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                <div className="mb-8 text-center md:text-left">
                    <h2 className="text-2xl font-bold text-slate-800">Diretório de Pacientes</h2>
                    <p className="text-slate-500 mt-1">Localize um paciente para gerenciar solicitações e atualizações de status.</p>
                </div>

                <div className="relative max-w-2xl mx-auto md:mx-0">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Buscar por Nome ou CPF..."
                        className="w-full pl-11 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none transition-shadow shadow-sm text-gray-700 bg-gray-50 focus:bg-white"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="mt-8">
                    {patients.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {patients.map(p => (
                                <button 
                                    key={p.cpf}
                                    onClick={() => setSelectedPatientCpf(p.cpf)}
                                    className="group bg-white border border-gray-200 p-5 rounded-xl hover:border-slate-400 hover:shadow-md transition-all text-left flex items-start gap-4"
                                >
                                    <div className="bg-slate-100 p-3 rounded-full text-slate-600 group-hover:bg-slate-800 group-hover:text-white transition-colors">
                                        <User className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-800 group-hover:text-slate-900">{p.name}</h3>
                                        <p className="text-sm text-slate-500 font-mono mt-0.5">{p.cpf}</p>
                                        <div className="flex items-center gap-1 mt-3 text-xs font-medium text-slate-400 group-hover:text-slate-600">
                                            Acessar Prontuário <ChevronRight className="w-3 h-3" />
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Search className="w-8 h-8 text-gray-300" />
                            </div>
                            <p className="text-gray-500 font-medium">Nenhum paciente encontrado.</p>
                            <p className="text-sm text-gray-400">Tente buscar por outro nome ou CPF.</p>
                        </div>
                    )}
                </div>
            </div>
        ) : (
            // Active Patient Management View
            <div className="animate-in slide-in-from-right-4 duration-300">
                <button 
                    onClick={() => setSelectedPatientCpf(null)} 
                    className="mb-4 flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors"
                >
                    <ChevronRight className="w-4 h-4 rotate-180" /> Voltar para lista
                </button>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* Patient Header */}
                    <div className="bg-slate-50 border-b border-gray-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-5">
                            <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 shadow-inner">
                                <User className="w-8 h-8" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-800">{activePatientData.profile.name}</h1>
                                <p className="text-slate-500 font-mono text-sm">{activePatientData.profile.cpf}</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button 
                                onClick={() => setIsMessaging(true)}
                                className="bg-white border border-gray-300 hover:bg-gray-50 text-slate-700 px-4 py-2.5 rounded-lg text-sm font-medium shadow-sm transition-all flex items-center gap-2"
                                title="Enviar Mensagem ao Paciente"
                            >
                                <MessageSquare className="w-4 h-4" />
                                Mensagem
                            </button>
                            <button 
                                onClick={() => setIsAdding(true)}
                                className="bg-slate-800 hover:bg-slate-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium shadow-sm transition-all flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                {role === 'exam_manager' ? 'Novo Exame' : 'Nova Guia'}
                            </button>
                        </div>
                    </div>

                    {/* Messaging Modal */}
                    {isMessaging && (
                         <div className="bg-blue-50 border-b border-blue-100 p-6 animate-in slide-in-from-top-2">
                             <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-sm border border-blue-100">
                                <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
                                    <h4 className="font-bold text-slate-800 flex items-center gap-2">
                                        <MessageSquare className="w-5 h-5 text-blue-500" />
                                        Enviar Mensagem para {activePatientData.profile.name}
                                    </h4>
                                    <button onClick={() => setIsMessaging(false)} className="text-gray-400 hover:text-gray-600">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                                <form onSubmit={handleSendMessage} className="space-y-4">
                                    <div>
                                        <label className="text-xs font-semibold text-gray-500 uppercase block mb-1">Título</label>
                                        <input 
                                            required
                                            type="text" 
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                            value={msgTitle}
                                            onChange={e => setMsgTitle(e.target.value)}
                                            placeholder="Ex: Pendência de Documento"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-gray-500 uppercase block mb-1">Mensagem</label>
                                        <textarea 
                                            required
                                            rows={3}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                            value={msgContent}
                                            onChange={e => setMsgContent(e.target.value)}
                                            placeholder="Digite a mensagem para o paciente..."
                                        />
                                    </div>
                                    <div className="flex justify-end pt-2">
                                        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                                            Enviar <Send className="w-4 h-4" />
                                        </button>
                                    </div>
                                </form>
                             </div>
                         </div>
                    )}

                    {/* Add Item Form Area */}
                    {isAdding && (
                        <div className="bg-slate-50 border-b border-gray-200 p-6 animate-in slide-in-from-top-2">
                            <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
                                    <h4 className="font-bold text-slate-800 flex items-center gap-2">
                                        <ClipboardList className="w-5 h-5 text-slate-500" />
                                        Cadastrar {role === 'exam_manager' ? 'Exame' : 'Guia'}
                                    </h4>
                                    <button onClick={() => setIsAdding(false)} className="text-gray-400 hover:text-gray-600">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                                <form onSubmit={handleAddItem} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-gray-500 uppercase">
                                                {role === 'exam_manager' ? 'Nome do Exame' : 'Especialidade'}
                                            </label>
                                            {role === 'exam_manager' ? (
                                                <div className="relative">
                                                     <input 
                                                        required
                                                        list="exam-options"
                                                        type="text" 
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-slate-500 outline-none"
                                                        value={newItemName}
                                                        onChange={e => setNewItemName(e.target.value)}
                                                    />
                                                    <datalist id="exam-options">
                                                        {examDatabase.map((exam, index) => (
                                                            <option key={index} value={exam} />
                                                        ))}
                                                    </datalist>
                                                </div>
                                            ) : (
                                                <input 
                                                    required
                                                    type="text" 
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-slate-500 outline-none"
                                                    value={newItemName}
                                                    onChange={e => setNewItemName(e.target.value)}
                                                />
                                            )}
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-gray-500 uppercase">Médico Solicitante</label>
                                            <input 
                                                required
                                                type="text" 
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-slate-500 outline-none"
                                                value={newItemDoctor}
                                                onChange={e => setNewItemDoctor(e.target.value)}
                                            />
                                        </div>
                                        {role === 'guide_manager' && (
                                             <div className="space-y-1">
                                                <label className="text-xs font-semibold text-gray-500 uppercase">Prazo Estimado</label>
                                                <input 
                                                    required
                                                    type="text" 
                                                    placeholder="AAAA-MM-DD"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-slate-500 outline-none"
                                                    value={newItemDeadline}
                                                    onChange={e => setNewItemDeadline(e.target.value)}
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <div className="pt-2 flex justify-end">
                                        <button type="submit" className="bg-red-700 hover:bg-red-800 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors">
                                            Confirmar Cadastro
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Items List */}
                    <div className="p-6">
                        <div className="flex items-center gap-2 mb-4 text-slate-800 font-semibold">
                            {role === 'exam_manager' ? <Activity className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                            <h3>Histórico de {role === 'exam_manager' ? 'Exames' : 'Guias'}</h3>
                        </div>
                        
                        <div className="space-y-3">
                            {role === 'exam_manager' && activePatientData.exams.length === 0 && (
                                <EmptyState message="Nenhum exame registrado para este paciente." />
                            )}
                            {role === 'guide_manager' && activePatientData.guides.length === 0 && (
                                <EmptyState message="Nenhuma guia registrada para este paciente." />
                            )}

                            {role === 'exam_manager' && activePatientData.exams.map(exam => (
                                <ItemManager 
                                    key={exam.id} 
                                    name={exam.name} 
                                    status={exam.status}
                                    type="exam"
                                    meta={`Dr(a). ${exam.doctor} • ${exam.dateRequested}`}
                                    onStatusChange={(s) => handleStatusChange('exam', exam.id, s)}
                                />
                            ))}
                            
                            {role === 'guide_manager' && activePatientData.guides.map(guide => (
                                <ItemManager 
                                    key={guide.id} 
                                    name={`Guia: ${guide.specialty}`} 
                                    status={guide.status}
                                    type="guide"
                                    meta={`Dr(a). ${guide.doctor} • Prazo: ${guide.deadline}`}
                                    onStatusChange={(s) => handleStatusChange('guide', guide.id, s)}
                                    attachmentUrl={guide.attachmentUrl}
                                    onViewAttachment={() => setViewingAttachment(guide.attachmentUrl || null)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )}
      </div>

      {/* Attachment Modal */}
      {viewingAttachment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
              <div className="bg-white rounded-xl overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col">
                  <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                      <h3 className="font-bold text-gray-800">Anexo do Pedido Médico</h3>
                      <button onClick={() => setViewingAttachment(null)} className="p-1 hover:bg-gray-100 rounded-full">
                          <X className="w-6 h-6 text-gray-500" />
                      </button>
                  </div>
                  <div className="flex-1 overflow-auto p-4 bg-gray-50 flex justify-center">
                      <img src={viewingAttachment} alt="Pedido Médico" className="max-w-full h-auto object-contain rounded shadow-lg" />
                  </div>
              </div>
          </div>
      )}

      <div className="py-4 text-center border-t border-gray-200 mt-auto">
         <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">
             © 2025 CB BRUNO GASPARETE NASCIMENTO
         </p>
      </div>
    </div>
  );
};

// --- Subcomponents ---

const StatCard: React.FC<{ icon: any, label: string, value: string, color: string }> = ({ icon: Icon, label, value, color }) => (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
        <div className={`${color} p-3 rounded-xl text-white shadow-sm`}>
            <Icon className="w-6 h-6" />
        </div>
        <div>
            <p className="text-slate-400 text-xs uppercase font-bold tracking-wider">{label}</p>
            <p className="text-2xl font-bold text-slate-800">{value}</p>
        </div>
    </div>
);

const EmptyState: React.FC<{ message: string }> = ({ message }) => (
    <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
        <p className="text-gray-400 text-sm">{message}</p>
    </div>
);

const ItemManager: React.FC<{ 
    name: string, 
    status: Status, 
    type: 'exam' | 'guide', 
    meta: string, 
    onStatusChange: (s: Status) => void,
    attachmentUrl?: string,
    onViewAttachment?: () => void
}> = ({ name, status, type, meta, onStatusChange, attachmentUrl, onViewAttachment }) => {
    
    const getStatusColor = (s: Status) => {
        switch(s) {
            case Status.READY: return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            case Status.PROCESSING: return 'bg-amber-100 text-amber-800 border-amber-200';
            case Status.PENDING: return 'bg-slate-100 text-slate-600 border-slate-200';
            case Status.DELIVERED: return 'bg-blue-100 text-blue-800 border-blue-200';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    const getStatusLabel = (s: Status) => {
        switch(s) {
            case Status.READY: return 'Pronto';
            case Status.PROCESSING: return 'Em Análise';
            case Status.PENDING: return 'Pendente';
            case Status.DELIVERED: return 'Entregue';
            default: return s;
        }
    }

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 transition-shadow hover:shadow-sm">
            <div>
                <div className="flex items-center gap-3">
                    <h4 className="font-bold text-slate-800">{name}</h4>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${getStatusColor(status)}`}>
                        {getStatusLabel(status)}
                    </span>
                    {attachmentUrl && (
                        <button 
                            onClick={onViewAttachment}
                            className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-2 py-0.5 rounded flex items-center gap-1 transition-colors"
                        >
                            <Paperclip className="w-3 h-3" /> Ver Anexo
                        </button>
                    )}
                </div>
                <p className="text-sm text-slate-400 mt-1">{meta}</p>
            </div>
            
            <div className="flex items-center gap-1 bg-gray-50 p-1.5 rounded-lg border border-gray-200 self-start lg:self-center">
                <StatusButton 
                    active={status === Status.PENDING} 
                    onClick={() => onStatusChange(Status.PENDING)}
                    icon={Clock}
                    label="Pendente"
                    colorClass="text-slate-600 bg-white shadow-sm ring-1 ring-slate-200"
                />
                <StatusButton 
                    active={status === Status.PROCESSING} 
                    onClick={() => onStatusChange(Status.PROCESSING)}
                    icon={RefreshCw}
                    label="Análise"
                    colorClass="text-amber-600 bg-white shadow-sm ring-1 ring-amber-200"
                />
                <StatusButton 
                    active={status === Status.READY} 
                    onClick={() => onStatusChange(Status.READY)}
                    icon={Check}
                    label="Pronto"
                    colorClass="text-emerald-600 bg-white shadow-sm ring-1 ring-emerald-200"
                />
                 <StatusButton 
                    active={status === Status.DELIVERED} 
                    onClick={() => onStatusChange(Status.DELIVERED)}
                    icon={Truck}
                    label="Entregue"
                    colorClass="text-blue-600 bg-white shadow-sm ring-1 ring-blue-200"
                />
            </div>
        </div>
    )
}

const StatusButton: React.FC<{ active: boolean, onClick: () => void, icon: any, label: string, colorClass: string }> = ({ active, onClick, icon: Icon, label, colorClass }) => (
    <button 
        onClick={onClick}
        title={label}
        className={`p-2 rounded-md transition-all duration-200 ${active ? colorClass : 'text-gray-300 hover:text-gray-500 hover:bg-gray-200'}`}
    >
        <Icon className="w-4 h-4" />
    </button>
);

export default AdminDashboard;