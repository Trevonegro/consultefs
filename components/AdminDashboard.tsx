
import React, { useState, useEffect } from 'react';
import { getAllPatients, getPatientDetails, updateExamStatus, updateGuideStatus, addExamToPatient, addGuideToPatient, getLabExamsDatabase, getGuideProceduresDatabase, getGlobalAnnouncement, setGlobalAnnouncement, sendPatientNotification, registerPatient, deleteItem, editItem } from '../services/mockData';
import { Status, Role, PatientType, MilitaryOrganization, Patient } from '../types';
import { Search, User, Activity, FileText, Check, Truck, Clock, RefreshCw, Plus, X, ChevronRight, Users, ClipboardList, Paperclip, Megaphone, Send, MessageSquare, Trash2, Edit, Save, UserPlus, Loader2, KeyRound } from 'lucide-react';

interface AdminDashboardProps {
  role: Role;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ role }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatientCpf, setSelectedPatientCpf] = useState<string | null>(null);
  const [viewingAttachment, setViewingAttachment] = useState<string | null>(null);
  
  // Data State (Async handling)
  const [allPatientsList, setAllPatientsList] = useState<Patient[]>([]);
  const [activePatientData, setActivePatientData] = useState<any>(null);
  const [isLoadingPatients, setIsLoadingPatients] = useState(true);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  // Global Announcement State
  const [globalMsg, setGlobalMsg] = useState('');
  const [isEditingGlobal, setIsEditingGlobal] = useState(false);
  
  // Direct Message State
  const [isMessaging, setIsMessaging] = useState(false);
  const [msgTitle, setMsgTitle] = useState('');
  const [msgContent, setMsgContent] = useState('');

  // Item Forms state (Add)
  const [isAdding, setIsAdding] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemDoctor, setNewItemDoctor] = useState(''); // Used as Doctor Name for Exams, and Date for Guides
  const [newItemDeadline, setNewItemDeadline] = useState('');

  // Edit Item State
  const [editingItem, setEditingItem] = useState<{id: string, type: 'exam' | 'guide', data: any} | null>(null);

  // Patient Registration State
  const [isRegisteringPatient, setIsRegisteringPatient] = useState(false);
  const [newPatient, setNewPatient] = useState<Partial<Patient>>({
      name: '',
      cpf: '',
      birthDate: '',
      precCp: '',
      type: 'TITULAR',
      holderName: '',
      om: 'CIA CMDO'
  });
  const [newPatientPassword, setNewPatientPassword] = useState('');

  // Force re-render after update
  const [tick, setTick] = useState(0); 
  
  // Get database of exams/guides
  const examDatabase = getLabExamsDatabase();
  const guideProceduresDatabase = getGuideProceduresDatabase();

  // Load patients on mount and update
  useEffect(() => {
    const fetchPatients = async () => {
        setIsLoadingPatients(true);
        const data = await getAllPatients();
        setAllPatientsList(data);
        setIsLoadingPatients(false);
    };
    fetchPatients();
  }, [tick]);

  // Load active patient details when selected
  useEffect(() => {
    const fetchDetails = async () => {
        if (selectedPatientCpf) {
            setIsLoadingDetails(true);
            const data = await getPatientDetails(selectedPatientCpf);
            setActivePatientData(data);
            setIsLoadingDetails(false);
        } else {
            setActivePatientData(null);
        }
    };
    fetchDetails();
  }, [selectedPatientCpf, tick]);

  // Load initial global message
  useEffect(() => {
    setGlobalMsg(getGlobalAnnouncement());
  }, []);

  const patients = allPatientsList.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.cpf.includes(searchTerm)
  );

  // Stats calculation
  const stats = {
      totalPatients: allPatientsList.length,
      activeItems: 12, // Placeholder
      completedItems: 45 // Placeholder
  };

  const handleStatusChange = async (type: 'exam' | 'guide', id: string, status: Status) => {
    if (!selectedPatientCpf) return;
    
    if (type === 'exam') {
      await updateExamStatus(selectedPatientCpf, id, status);
    } else if (type === 'guide') {
      await updateGuideStatus(selectedPatientCpf, id, status);
    }
    setTick(t => t + 1); // Refresh UI
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatientCpf) return;

    if (role === 'exam_manager') {
      await addExamToPatient(selectedPatientCpf, newItemName, newItemDoctor);
    } else if (role === 'guide_manager') {
      // newItemDoctor acts as Date Registered for guides per requirements
      await addGuideToPatient(selectedPatientCpf, newItemName, newItemDoctor, newItemDeadline);
    }

    // Reset and close
    setIsAdding(false);
    setNewItemName('');
    setNewItemDoctor('');
    setNewItemDeadline('');
    setTick(t => t + 1);
  };

  const handleDeleteItem = async (id: string, type: 'exam' | 'guide') => {
      if(!selectedPatientCpf) return;
      
      const confirmDelete = window.confirm('ATENÇÃO: Tem certeza que deseja excluir permanentemente este item?');
      
      if(confirmDelete) {
          setIsLoadingDetails(true); // Show loading to indicate processing
          try {
            await deleteItem(selectedPatientCpf, id, type);
            // Force data refresh explicitly after deletion
            setTick(t => t + 1); 
          } catch (error) {
            console.error("Erro ao excluir:", error);
            alert("Houve um erro ao tentar excluir o item.");
            setIsLoadingDetails(false);
          }
      }
  };

  const handleStartEdit = (item: any, type: 'exam' | 'guide') => {
      setEditingItem({
          id: item.id,
          type,
          data: { ...item }
      });
  };

  const handleSaveEdit = async () => {
      if(!selectedPatientCpf || !editingItem) return;
      await editItem(selectedPatientCpf, editingItem.id, editingItem.type, editingItem.data);
      setEditingItem(null);
      setTick(t => t + 1);
  };

  const handleUpdateGlobal = () => {
    setGlobalAnnouncement(globalMsg);
    setIsEditingGlobal(false);
    alert("Aviso geral atualizado com sucesso!");
  };

  const handleSendMessage = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!selectedPatientCpf) return;

      await sendPatientNotification(selectedPatientCpf, msgTitle, msgContent);
      setIsMessaging(false);
      setMsgTitle('');
      setMsgContent('');
      alert("Mensagem enviada para o paciente.");
      setTick(t => t + 1);
  };

  const handleRegisterPatient = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!newPatient.name || !newPatient.cpf || !newPatient.precCp) {
          alert("Preencha os campos obrigatórios.");
          return;
      }
      if (newPatient.type === 'DEPENDENTE' && !newPatient.holderName) {
          alert("Para dependentes, o nome do titular é obrigatório.");
          return;
      }

      // Pass the password if provided, otherwise registerPatient handles the default
      const result = await registerPatient(newPatient as Patient, newPatientPassword || undefined);
      
      if (result.success) {
          alert(`Paciente cadastrado com sucesso!\nSenha definida: ${newPatientPassword || 'Números do CPF'}`);
          setIsRegisteringPatient(false);
          setNewPatient({ name: '', cpf: '', birthDate: '', precCp: '', type: 'TITULAR', holderName: '', om: 'CIA CMDO' });
          setNewPatientPassword('');
          setTick(t => t + 1);
      } else {
          alert("Erro: " + result.message);
      }
  };

  const getRoleIcon = () => {
    switch(role) {
        case 'exam_manager': return Activity;
        case 'guide_manager': return FileText;
        default: return User;
    }
  }

  const getRoleLabel = () => {
      switch(role) {
          case 'exam_manager': return 'Exames';
          case 'guide_manager': return 'Guias';
          default: return 'Geral';
      }
  }

  const RoleIcon = getRoleIcon();

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 flex flex-col min-h-[calc(100vh-5rem)]">
      
      {/* Top Section: Stats & Global Announcement */}
      {!selectedPatientCpf && (
        <div className="space-y-6 animate-fade-in">
             {/* Global Announcement Card */}
            <div className="bg-white dark:bg-military-900 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-military-700 transition-colors">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-amber-100 dark:bg-amber-900/40 p-2 rounded-lg text-amber-600 dark:text-amber-500">
                            <Megaphone className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-gray-800 dark:text-military-100">Comunicação Institucional (Aviso Geral)</h3>
                    </div>
                    {!isEditingGlobal && (
                        <button 
                            onClick={() => setIsEditingGlobal(true)}
                            className="text-sm text-gray-500 dark:text-military-300 hover:text-gray-900 dark:hover:text-military-100 underline"
                        >
                            Editar Aviso
                        </button>
                    )}
                </div>

                {isEditingGlobal ? (
                    <div className="space-y-3">
                        <textarea
                            className="w-full border border-gray-200 dark:border-military-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-amber-600 outline-none bg-gray-50 dark:bg-military-950 text-gray-800 dark:text-military-100"
                            rows={3}
                            placeholder="Digite o aviso que aparecerá para todos os pacientes..."
                            value={globalMsg}
                            onChange={(e) => setGlobalMsg(e.target.value)}
                        />
                        <div className="flex gap-2 justify-end">
                            <button 
                                onClick={() => setIsEditingGlobal(false)}
                                className="px-4 py-2 text-sm text-gray-500 dark:text-military-300 hover:bg-gray-100 dark:hover:bg-military-700 rounded-lg"
                            >
                                Cancelar
                            </button>
                            <button 
                                onClick={handleUpdateGlobal}
                                className="px-4 py-2 text-sm bg-amber-600 hover:bg-amber-500 dark:bg-amber-700 dark:hover:bg-amber-600 text-white rounded-lg font-medium"
                            >
                                Salvar Aviso
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className={`p-4 rounded-xl text-sm ${globalMsg ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-900/50' : 'bg-gray-50 dark:bg-military-800 text-gray-500 dark:text-military-400 italic'}`}>
                        {globalMsg || "Nenhum aviso geral configurado no momento."}
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard 
                    icon={Users} 
                    label="Total de Pacientes" 
                    value={isLoadingPatients ? "..." : stats.totalPatients.toString()} 
                    color="bg-gray-800 dark:bg-military-600" 
                />
                <StatCard 
                    icon={RefreshCw} 
                    label="Itens em Processamento" 
                    value="12" 
                    color="bg-amber-600 dark:bg-amber-700" 
                />
                <StatCard 
                    icon={Check} 
                    label="Prontos Hoje" 
                    value="8" 
                    color="bg-emerald-600 dark:bg-emerald-700" 
                />
            </div>
        </div>
      )}

      <div className="flex-grow space-y-6">
        
        {/* Search & Selection View */}
        {!selectedPatientCpf ? (
            <div className="bg-white dark:bg-military-900 p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-military-700 transition-colors">
                <div className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-center md:text-left">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-military-100">Diretório de Pacientes</h2>
                        <p className="text-gray-500 dark:text-military-300 mt-1">Localize um paciente ou cadastre um novo.</p>
                    </div>
                    <button 
                        onClick={() => setIsRegisteringPatient(true)}
                        className="bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium shadow-sm transition-all flex items-center gap-2"
                    >
                        <UserPlus className="w-5 h-5" />
                        Novo Paciente
                    </button>
                </div>

                <div className="relative max-w-2xl mx-auto md:mx-0">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400 dark:text-military-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Buscar por Nome ou CPF..."
                        className="w-full pl-11 pr-4 py-4 border border-gray-200 dark:border-military-700 rounded-xl focus:ring-2 focus:ring-gray-300 dark:focus:ring-military-600 focus:border-gray-400 dark:focus:border-military-600 outline-none transition-shadow shadow-sm text-gray-800 dark:text-military-100 bg-gray-50 dark:bg-military-950 focus:bg-white dark:focus:bg-military-950"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="mt-8">
                    {isLoadingPatients ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-gray-400 dark:text-military-400" />
                        </div>
                    ) : patients.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {patients.map(p => (
                                <button 
                                    key={p.cpf}
                                    onClick={() => setSelectedPatientCpf(p.cpf)}
                                    className="group bg-gray-50 dark:bg-military-700/50 border border-gray-200 dark:border-military-600 p-5 rounded-xl hover:border-gray-400 dark:hover:border-military-400 hover:shadow-md transition-all text-left flex items-start gap-4"
                                >
                                    <div className="bg-gray-200 dark:bg-military-600 p-3 rounded-full text-gray-500 dark:text-military-300 group-hover:bg-gray-300 dark:group-hover:bg-military-500 group-hover:text-gray-700 dark:group-hover:text-military-100 transition-colors">
                                        <User className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800 dark:text-military-100 group-hover:text-black dark:group-hover:text-white">{p.name}</h3>
                                        <p className="text-sm text-gray-500 dark:text-military-400 font-mono mt-0.5">{p.cpf}</p>
                                        <div className="flex items-center gap-1 mt-3 text-xs font-medium text-gray-400 dark:text-military-400 group-hover:text-gray-600 dark:group-hover:text-military-300">
                                            Acessar Prontuário <ChevronRight className="w-3 h-3" />
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="bg-gray-100 dark:bg-military-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Search className="w-8 h-8 text-gray-400 dark:text-military-400" />
                            </div>
                            <p className="text-gray-500 dark:text-military-400 font-medium">Nenhum paciente encontrado.</p>
                            <p className="text-sm text-gray-400 dark:text-military-500">Tente buscar por outro nome ou CPF.</p>
                        </div>
                    )}
                </div>
            </div>
        ) : !activePatientData || isLoadingDetails ? (
            <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
                <Loader2 className="w-10 h-10 animate-spin text-gray-400 dark:text-military-400 mb-4" />
                <p className="text-gray-500 dark:text-military-300">Carregando dados do paciente...</p>
                <button 
                    onClick={() => setSelectedPatientCpf(null)}
                    className="mt-4 text-sm text-gray-400 hover:text-gray-600 dark:text-military-500 dark:hover:text-military-300 underline"
                >
                    Cancelar
                </button>
            </div>
        ) : (
            // Active Patient Management View
            <div className="animate-in slide-in-from-right-4 duration-300">
                <button 
                    onClick={() => setSelectedPatientCpf(null)} 
                    className="mb-4 flex items-center gap-2 text-sm text-gray-500 dark:text-military-300 hover:text-gray-900 dark:hover:text-military-100 transition-colors"
                >
                    <ChevronRight className="w-4 h-4 rotate-180" /> Voltar para lista
                </button>

                <div className="bg-white dark:bg-military-900 rounded-2xl shadow-sm border border-gray-200 dark:border-military-700 overflow-hidden transition-colors">
                    {/* Patient Header */}
                    <div className="bg-gray-50 dark:bg-military-800 border-b border-gray-200 dark:border-military-700 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-5">
                            <div className="w-16 h-16 bg-gray-200 dark:bg-military-700 rounded-full flex items-center justify-center text-gray-500 dark:text-military-200 shadow-inner">
                                <User className="w-8 h-8" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800 dark:text-military-100">{activePatientData.profile.name}</h1>
                                <div className="flex gap-4 text-sm text-gray-500 dark:text-military-300 mt-1">
                                    <span className="font-mono">{activePatientData.profile.cpf}</span>
                                    {activePatientData.profile.om && (
                                        <span className="bg-gray-200 dark:bg-military-700 px-2 rounded text-xs font-bold flex items-center">{activePatientData.profile.om}</span>
                                    )}
                                    {activePatientData.profile.type && (
                                        <span className={`px-2 rounded text-xs font-bold flex items-center ${activePatientData.profile.type === 'TITULAR' ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300' : 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300'}`}>
                                            {activePatientData.profile.type}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button 
                                onClick={() => setIsMessaging(true)}
                                className="bg-white dark:bg-military-700 border border-gray-300 dark:border-military-600 hover:bg-gray-50 dark:hover:bg-military-600 text-gray-700 dark:text-military-100 px-4 py-2.5 rounded-lg text-sm font-medium shadow-sm transition-all flex items-center gap-2"
                                title="Enviar Mensagem ao Paciente"
                            >
                                <MessageSquare className="w-4 h-4" />
                                Mensagem
                            </button>
                            <button 
                                onClick={() => setIsAdding(true)}
                                className="bg-gray-900 dark:bg-military-100 hover:bg-gray-800 dark:hover:bg-white text-white dark:text-military-950 px-5 py-2.5 rounded-lg text-sm font-medium shadow-sm transition-all flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                {role === 'exam_manager' ? 'Novo Exame' : 'Nova Guia'}
                            </button>
                        </div>
                    </div>

                    {/* Messaging Modal */}
                    {isMessaging && (
                         <div className="bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-900/30 p-6 animate-in slide-in-from-top-2">
                             <div className="max-w-3xl mx-auto bg-white dark:bg-military-800 p-6 rounded-xl shadow-sm border border-blue-100 dark:border-blue-900/30">
                                <div className="flex justify-between items-center mb-4 border-b border-gray-100 dark:border-military-700 pb-2">
                                    <h4 className="font-bold text-gray-800 dark:text-military-100 flex items-center gap-2">
                                        <MessageSquare className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                                        Enviar Mensagem para {activePatientData.profile.name}
                                    </h4>
                                    <button onClick={() => setIsMessaging(false)} className="text-gray-400 dark:text-military-300 hover:text-gray-600 dark:hover:text-military-100">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                                <form onSubmit={handleSendMessage} className="space-y-4">
                                    <div>
                                        <label className="text-xs font-semibold text-gray-500 dark:text-military-400 uppercase block mb-1">Título</label>
                                        <input 
                                            required
                                            type="text" 
                                            className="w-full px-3 py-2 bg-gray-50 dark:bg-military-950 border border-gray-300 dark:border-military-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-800 dark:text-military-100"
                                            value={msgTitle}
                                            onChange={e => setMsgTitle(e.target.value)}
                                            placeholder="Ex: Pendência de Documento"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-gray-500 dark:text-military-400 uppercase block mb-1">Mensagem</label>
                                        <textarea 
                                            required
                                            rows={3}
                                            className="w-full px-3 py-2 bg-gray-50 dark:bg-military-950 border border-gray-300 dark:border-military-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-800 dark:text-military-100"
                                            value={msgContent}
                                            onChange={e => setMsgContent(e.target.value)}
                                            placeholder="Digite a mensagem para o paciente..."
                                        />
                                    </div>
                                    <div className="flex justify-end pt-2">
                                        <button type="submit" className="bg-blue-600 dark:bg-blue-700 hover:bg-blue-500 dark:hover:bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                                            Enviar <Send className="w-4 h-4" />
                                        </button>
                                    </div>
                                </form>
                             </div>
                         </div>
                    )}

                    {/* Add Item Form Area */}
                    {isAdding && (role === 'exam_manager' || role === 'guide_manager') && (
                        <div className="bg-gray-50 dark:bg-military-800 border-b border-gray-200 dark:border-military-700 p-6 animate-in slide-in-from-top-2">
                            <div className="max-w-3xl mx-auto bg-white dark:bg-military-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-military-700">
                                <div className="flex justify-between items-center mb-4 border-b border-gray-100 dark:border-military-700 pb-2">
                                    <h4 className="font-bold text-gray-800 dark:text-military-100 flex items-center gap-2">
                                        <ClipboardList className="w-5 h-5 text-gray-400 dark:text-military-300" />
                                        Cadastrar {role === 'exam_manager' ? 'Exame' : 'Guia'}
                                    </h4>
                                    <button onClick={() => setIsAdding(false)} className="text-gray-400 dark:text-military-300 hover:text-gray-600 dark:hover:text-military-100">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                                <form onSubmit={handleAddItem} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-gray-500 dark:text-military-400 uppercase">
                                                {role === 'exam_manager' ? 'Nome do Exame' : 'Especialidade / Procedimento'}
                                            </label>
                                            
                                            {/* Datalist for Exams */}
                                            {role === 'exam_manager' && (
                                                <div className="relative">
                                                     <input 
                                                        required
                                                        list="exam-options"
                                                        type="text" 
                                                        placeholder="Digite o nome ou selecione..."
                                                        className="w-full px-3 py-2 bg-gray-50 dark:bg-military-800 border border-gray-300 dark:border-military-600 rounded-lg text-sm focus:ring-2 focus:ring-gray-500 dark:focus:ring-military-500 outline-none text-gray-800 dark:text-military-100"
                                                        value={newItemName}
                                                        onChange={e => setNewItemName(e.target.value)}
                                                    />
                                                    <datalist id="exam-options">
                                                        {examDatabase.map((exam, index) => (
                                                            <option key={index} value={exam} />
                                                        ))}
                                                    </datalist>
                                                </div>
                                            )}

                                            {/* Datalist for Guides (Procedure List) */}
                                            {role === 'guide_manager' && (
                                                <div className="relative">
                                                     <input 
                                                        required
                                                        list="guide-options"
                                                        type="text" 
                                                        placeholder="Digite a especialidade ou selecione..."
                                                        className="w-full px-3 py-2 bg-gray-50 dark:bg-military-800 border border-gray-300 dark:border-military-600 rounded-lg text-sm focus:ring-2 focus:ring-gray-500 dark:focus:ring-military-500 outline-none text-gray-800 dark:text-military-100"
                                                        value={newItemName}
                                                        onChange={e => setNewItemName(e.target.value)}
                                                    />
                                                    <datalist id="guide-options">
                                                        {guideProceduresDatabase.map((proc, index) => (
                                                            <option key={index} value={proc} />
                                                        ))}
                                                    </datalist>
                                                </div>
                                            )}
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-gray-500 dark:text-military-400 uppercase">
                                                {role === 'exam_manager' ? 'Laboratório Realizado' : 'Dia do Cadastro'}
                                            </label>
                                            {role === 'guide_manager' ? (
                                                <input 
                                                    required
                                                    type="date" 
                                                    className="w-full px-3 py-2 bg-gray-50 dark:bg-military-800 border border-gray-300 dark:border-military-600 rounded-lg text-sm focus:ring-2 focus:ring-gray-500 dark:focus:ring-military-500 outline-none text-gray-800 dark:text-military-100 dark:[color-scheme:dark]"
                                                    value={newItemDoctor}
                                                    onChange={e => setNewItemDoctor(e.target.value)}
                                                />
                                            ) : (
                                                <input 
                                                    required
                                                    type="text" 
                                                    className="w-full px-3 py-2 bg-gray-50 dark:bg-military-800 border border-gray-300 dark:border-military-600 rounded-lg text-sm focus:ring-2 focus:ring-gray-500 dark:focus:ring-military-500 outline-none text-gray-800 dark:text-military-100"
                                                    value={newItemDoctor}
                                                    onChange={e => setNewItemDoctor(e.target.value)}
                                                />
                                            )}
                                        </div>
                                        {role === 'guide_manager' && (
                                             <div className="space-y-1">
                                                <label className="text-xs font-semibold text-gray-500 dark:text-military-400 uppercase">Prazo Estimado</label>
                                                <input 
                                                    required
                                                    type="text" 
                                                    placeholder="AAAA-MM-DD"
                                                    className="w-full px-3 py-2 bg-gray-50 dark:bg-military-800 border border-gray-300 dark:border-military-600 rounded-lg text-sm focus:ring-2 focus:ring-gray-500 dark:focus:ring-military-500 outline-none text-gray-800 dark:text-military-100"
                                                    value={newItemDeadline}
                                                    onChange={e => setNewItemDeadline(e.target.value)}
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <div className="pt-2 flex justify-end">
                                        <button type="submit" className="bg-gray-800 dark:bg-military-700 hover:bg-gray-700 dark:hover:bg-military-600 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors">
                                            Confirmar Cadastro
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                     {/* Edit Item Modal */}
                     {editingItem && (
                        <div className="bg-amber-50 dark:bg-amber-900/20 border-b border-amber-100 dark:border-amber-900/40 p-6 animate-in slide-in-from-top-2">
                             <div className="max-w-3xl mx-auto bg-white dark:bg-military-900 p-6 rounded-xl shadow-sm border border-amber-200 dark:border-amber-900/40">
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="font-bold text-gray-800 dark:text-military-100">Editar {editingItem.type === 'exam' ? 'Exame' : 'Guia'}</h4>
                                    <button onClick={() => setEditingItem(null)} className="text-gray-400 dark:text-military-300 hover:text-gray-600 dark:hover:text-military-100"><X className="w-5 h-5" /></button>
                                </div>
                                <div className="space-y-4">
                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Name / Procedure Field */}
                                        <div>
                                            <label className="text-xs font-semibold text-gray-500 dark:text-military-400 uppercase block mb-1">
                                                {editingItem.type === 'exam' ? 'Nome do Exame' : 'Especialidade'}
                                            </label>
                                            <input 
                                                className="w-full px-3 py-2 bg-gray-50 dark:bg-military-950 border border-gray-300 dark:border-military-600 rounded-lg text-sm text-gray-800 dark:text-military-100"
                                                value={editingItem.type === 'exam' ? editingItem.data.name : editingItem.data.specialty}
                                                onChange={e => setEditingItem({
                                                    ...editingItem, 
                                                    data: { ...editingItem.data, [editingItem.type === 'exam' ? 'name' : 'specialty']: e.target.value }
                                                })}
                                            />
                                        </div>

                                        {/* Date / Doctor Field */}
                                        <div>
                                             <label className="text-xs font-semibold text-gray-500 dark:text-military-400 uppercase block mb-1">
                                                {editingItem.type === 'exam' ? 'Laboratório' : 'Data do Cadastro'}
                                             </label>
                                             {editingItem.type === 'guide' ? (
                                                  <input 
                                                    type="date"
                                                    className="w-full px-3 py-2 bg-gray-50 dark:bg-military-950 border border-gray-300 dark:border-military-600 rounded-lg text-sm text-gray-800 dark:text-military-100 dark:[color-scheme:dark]"
                                                    value={editingItem.data.dateRequested}
                                                    onChange={e => setEditingItem({
                                                        ...editingItem,
                                                        data: { ...editingItem.data, dateRequested: e.target.value }
                                                    })}
                                                />
                                             ) : (
                                                <input 
                                                    className="w-full px-3 py-2 bg-gray-50 dark:bg-military-950 border border-gray-300 dark:border-military-600 rounded-lg text-sm text-gray-800 dark:text-military-100"
                                                    value={editingItem.data.doctor}
                                                    onChange={e => setEditingItem({
                                                        ...editingItem, 
                                                        data: { ...editingItem.data, doctor: e.target.value }
                                                    })}
                                                />
                                             )}
                                        </div>
                                     </div>
                                     <div className="flex justify-end gap-2 pt-2">
                                         <button onClick={() => setEditingItem(null)} className="px-4 py-2 text-gray-500 dark:text-military-300 hover:bg-gray-100 dark:hover:bg-military-700 rounded-lg text-sm">Cancelar</button>
                                         <button onClick={handleSaveEdit} className="px-4 py-2 bg-amber-600 hover:bg-amber-500 dark:bg-amber-700 dark:hover:bg-amber-600 text-white rounded-lg text-sm flex items-center gap-2">
                                             <Save className="w-4 h-4" /> Salvar Alterações
                                         </button>
                                     </div>
                                </div>
                             </div>
                        </div>
                    )}

                    {/* Items List */}
                    <div className="p-6">
                        <div className="flex items-center gap-2 mb-4 text-gray-800 dark:text-military-100 font-semibold">
                            <RoleIcon className="w-5 h-5" />
                            <h3>Histórico de {getRoleLabel()}</h3>
                        </div>
                        
                        <div className="space-y-3">
                            {role === 'exam_manager' && activePatientData.exams.length === 0 && (
                                <EmptyState message="Nenhum exame registrado para este paciente." />
                            )}
                            {role === 'guide_manager' && activePatientData.guides.length === 0 && (
                                <EmptyState message="Nenhuma guia registrada para este paciente." />
                            )}

                            {role === 'exam_manager' && activePatientData.exams.map((exam: any) => (
                                <ItemManager 
                                    key={exam.id} 
                                    name={exam.name} 
                                    status={exam.status}
                                    type="exam"
                                    meta={`Laboratório: ${exam.doctor} • ${exam.dateRequested}`}
                                    onStatusChange={(s) => handleStatusChange('exam', exam.id, s)}
                                    onDelete={() => handleDeleteItem(exam.id, 'exam')}
                                    onEdit={() => handleStartEdit(exam, 'exam')}
                                />
                            ))}
                            
                            {role === 'guide_manager' && activePatientData.guides.map((guide: any) => (
                                <ItemManager 
                                    key={guide.id} 
                                    name={`Guia: ${guide.specialty}`} 
                                    status={guide.status}
                                    type="guide"
                                    meta={`Cadastro: ${guide.dateRequested} • Prazo: ${guide.deadline}`}
                                    onStatusChange={(s) => handleStatusChange('guide', guide.id, s)}
                                    attachmentUrl={guide.attachmentUrl}
                                    onViewAttachment={() => setViewingAttachment(guide.attachmentUrl || null)}
                                    onDelete={() => handleDeleteItem(guide.id, 'guide')}
                                    onEdit={() => handleStartEdit(guide, 'guide')}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )}
      </div>

      {/* Patient Registration Modal */}
      {isRegisteringPatient && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
              <div className="bg-white dark:bg-military-900 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-military-700 transition-colors">
                  <div className="bg-gray-50 dark:bg-military-800 p-6 border-b border-gray-200 dark:border-military-700 flex justify-between items-center">
                      <h3 className="text-xl font-bold text-gray-800 dark:text-military-100 flex items-center gap-2">
                          <UserPlus className="w-6 h-6 text-emerald-600 dark:text-emerald-500" />
                          Cadastro de Paciente
                      </h3>
                      <button onClick={() => setIsRegisteringPatient(false)} className="text-gray-400 dark:text-military-400 hover:text-gray-600 dark:hover:text-military-100 transition-colors">
                          <X className="w-6 h-6" />
                      </button>
                  </div>
                  <form onSubmit={handleRegisterPatient} className="p-8 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-1.5">
                              <label className="text-sm font-semibold text-gray-500 dark:text-military-400">Nome Completo</label>
                              <input 
                                  required
                                  type="text" 
                                  className="w-full px-4 py-2.5 bg-white dark:bg-military-950 border border-gray-300 dark:border-military-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-gray-800 dark:text-military-100"
                                  value={newPatient.name}
                                  onChange={e => setNewPatient({...newPatient, name: e.target.value})}
                              />
                          </div>
                          <div className="space-y-1.5">
                              <label className="text-sm font-semibold text-gray-500 dark:text-military-400">CPF</label>
                              <input 
                                  required
                                  type="text" 
                                  placeholder="000.000.000-00"
                                  className="w-full px-4 py-2.5 bg-white dark:bg-military-950 border border-gray-300 dark:border-military-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-gray-800 dark:text-military-100"
                                  value={newPatient.cpf}
                                  onChange={e => setNewPatient({...newPatient, cpf: e.target.value})}
                              />
                          </div>
                          <div className="space-y-1.5">
                              <label className="text-sm font-semibold text-gray-500 dark:text-military-400">Data de Nascimento</label>
                              <input 
                                  required
                                  type="date" 
                                  className="w-full px-4 py-2.5 bg-white dark:bg-military-950 border border-gray-300 dark:border-military-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-gray-800 dark:text-military-100 dark:[color-scheme:dark]"
                                  value={newPatient.birthDate}
                                  onChange={e => setNewPatient({...newPatient, birthDate: e.target.value})}
                              />
                          </div>
                          <div className="space-y-1.5">
                              <label className="text-sm font-semibold text-gray-500 dark:text-military-400">PREC CP</label>
                              <input 
                                  required
                                  type="text" 
                                  placeholder="Apenas números"
                                  className="w-full px-4 py-2.5 bg-white dark:bg-military-950 border border-gray-300 dark:border-military-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-gray-800 dark:text-military-100"
                                  value={newPatient.precCp}
                                  onChange={e => {
                                      const val = e.target.value.replace(/\D/g, '');
                                      setNewPatient({...newPatient, precCp: val});
                                  }}
                              />
                          </div>
                          <div className="space-y-1.5">
                              <label className="text-sm font-semibold text-gray-500 dark:text-military-400">Tipo de Paciente</label>
                              <select 
                                  className="w-full px-4 py-2.5 bg-white dark:bg-military-950 border border-gray-300 dark:border-military-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-gray-800 dark:text-military-100"
                                  value={newPatient.type}
                                  onChange={e => setNewPatient({...newPatient, type: e.target.value as PatientType})}
                              >
                                  <option value="TITULAR">Titular</option>
                                  <option value="DEPENDENTE">Dependente</option>
                              </select>
                          </div>
                          <div className="space-y-1.5">
                              <label className="text-sm font-semibold text-gray-500 dark:text-military-400">OM de Vinculação</label>
                              <select 
                                  className="w-full px-4 py-2.5 bg-white dark:bg-military-950 border border-gray-300 dark:border-military-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-gray-800 dark:text-military-100"
                                  value={newPatient.om}
                                  onChange={e => setNewPatient({...newPatient, om: e.target.value as MilitaryOrganization})}
                              >
                                  <option value="CIA CMDO">CIA CMDO</option>
                                  <option value="6ª CIA COM">6ª CIA COM</option>
                                  <option value="COMANDO DA BRIGADA">COMANDO DA BRIGADA</option>
                                  <option value="PEL PE">PEL PE</option>
                              </select>
                          </div>
                          
                          {/* New Password Field */}
                          <div className="md:col-span-2 space-y-1.5 bg-gray-50 dark:bg-military-800 p-3 rounded-lg border border-gray-200 dark:border-military-600">
                              <label className="text-sm font-semibold text-gray-500 dark:text-military-400 flex items-center gap-2">
                                  <KeyRound className="w-4 h-4" /> Senha de Acesso (Opcional)
                              </label>
                              <input 
                                  type="text" 
                                  placeholder="Padrão: Apenas números do CPF"
                                  className="w-full px-4 py-2.5 bg-white dark:bg-military-950 border border-gray-300 dark:border-military-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-gray-800 dark:text-military-100"
                                  value={newPatientPassword}
                                  onChange={e => setNewPatientPassword(e.target.value)}
                              />
                              <p className="text-xs text-gray-400">Deixe em branco para usar o padrão.</p>
                          </div>
                      </div>

                      {newPatient.type === 'DEPENDENTE' && (
                          <div className="bg-gray-50 dark:bg-military-800 p-4 rounded-xl border border-gray-200 dark:border-military-700 animate-in fade-in">
                               <label className="text-sm font-semibold text-gray-500 dark:text-military-400 block mb-1.5">Nome Completo do Titular</label>
                               <input 
                                  required
                                  type="text" 
                                  className="w-full px-4 py-2.5 bg-white dark:bg-military-950 border border-gray-300 dark:border-military-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-gray-800 dark:text-military-100"
                                  value={newPatient.holderName}
                                  onChange={e => setNewPatient({...newPatient, holderName: e.target.value})}
                              />
                          </div>
                      )}

                      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-military-700">
                          <button 
                              type="button" 
                              onClick={() => setIsRegisteringPatient(false)}
                              className="px-6 py-2.5 text-gray-500 dark:text-military-400 hover:bg-gray-100 dark:hover:bg-military-800 rounded-lg font-medium transition-colors"
                          >
                              Cancelar
                          </button>
                          <button 
                              type="submit" 
                              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white rounded-lg font-medium shadow-sm transition-colors flex items-center gap-2"
                          >
                              <Check className="w-5 h-5" /> Confirmar Cadastro
                          </button>
                      </div>
                  </form>
              </div>
          </div>
      )}

      {/* Attachment Modal */}
      {viewingAttachment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
              <div className="bg-white dark:bg-military-900 rounded-xl overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col border border-gray-200 dark:border-military-700">
                  <div className="p-4 border-b border-gray-200 dark:border-military-700 flex justify-between items-center">
                      <h3 className="font-bold text-gray-800 dark:text-military-100">Anexo do Pedido Médico</h3>
                      <button onClick={() => setViewingAttachment(null)} className="p-1 hover:bg-gray-100 dark:hover:bg-military-700 rounded-full">
                          <X className="w-6 h-6 text-gray-500 dark:text-military-400" />
                      </button>
                  </div>
                  <div className="flex-1 overflow-auto p-4 bg-gray-50 dark:bg-military-950 flex justify-center">
                      <img src={viewingAttachment} alt="Pedido Médico" className="max-w-full h-auto object-contain rounded shadow-lg" />
                  </div>
              </div>
          </div>
      )}

      <div className="py-4 text-center border-t border-gray-200 dark:border-military-700 mt-auto">
         <p className="text-[10px] text-gray-500 dark:text-military-400 font-medium uppercase tracking-wide">
             © 2025 CB BRUNO GASPARETE NASCIMENTO
         </p>
      </div>
    </div>
  );
};

// --- Subcomponents ---

const StatCard: React.FC<{ icon: any, label: string, value: string, color: string }> = ({ icon: Icon, label, value, color }) => (
    <div className="bg-white dark:bg-military-900 p-5 rounded-2xl shadow-sm border border-gray-200 dark:border-military-700 flex items-center gap-4 hover:shadow-md transition-shadow">
        <div className={`${color} p-3 rounded-xl text-white shadow-sm`}>
            <Icon className="w-6 h-6" />
        </div>
        <div>
            <p className="text-gray-500 dark:text-military-400 text-xs uppercase font-bold tracking-wider">{label}</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-military-100">{value}</p>
        </div>
    </div>
);

const EmptyState: React.FC<{ message: string }> = ({ message }) => (
    <div className="text-center py-10 bg-white dark:bg-military-900 rounded-xl border border-dashed border-gray-300 dark:border-military-700">
        <p className="text-gray-500 dark:text-military-400 text-sm">{message}</p>
    </div>
);

const ItemManager: React.FC<{ 
    name: string, 
    status: Status, 
    type: 'exam' | 'guide', 
    meta: string, 
    onStatusChange: (s: Status) => void,
    attachmentUrl?: string,
    onViewAttachment?: () => void,
    onDelete: () => void,
    onEdit: () => void
}> = ({ name, status, type, meta, onStatusChange, attachmentUrl, onViewAttachment, onDelete, onEdit }) => {
    
    const getStatusColor = (s: Status) => {
        switch(s) {
            case Status.READY: return 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900';
            case Status.PROCESSING: return 'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-500 border-amber-200 dark:border-amber-900';
            case Status.PENDING: return 'bg-gray-100 dark:bg-military-800 text-gray-500 dark:text-military-400 border-gray-200 dark:border-military-700';
            case Status.DELIVERED: return 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900';
            default: return 'bg-gray-100 dark:bg-military-800 text-gray-500 dark:text-military-400';
        }
    };

    const getStatusLabel = (s: Status, type: 'exam' | 'guide') => {
        switch(s) {
            case Status.READY: return 'Pronto';
            case Status.PROCESSING: return type === 'guide' ? 'Em Confecção' : 'Em Análise';
            case Status.PENDING: return 'Pendente';
            case Status.DELIVERED: return 'Entregue';
            default: return s;
        }
    }

    return (
        <div className="bg-white dark:bg-military-900 border border-gray-200 dark:border-military-700 rounded-xl p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 transition-shadow hover:shadow-sm group">
            <div className="flex-grow">
                <div className="flex items-center gap-3">
                    <h4 className="font-bold text-gray-800 dark:text-military-100">{name}</h4>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${getStatusColor(status)}`}>
                        {getStatusLabel(status, type)}
                    </span>
                    {attachmentUrl && (
                        <button 
                            onClick={onViewAttachment}
                            className="text-xs bg-gray-100 dark:bg-military-800 hover:bg-gray-200 dark:hover:bg-military-700 text-gray-500 dark:text-military-300 px-2 py-0.5 rounded flex items-center gap-1 transition-colors"
                        >
                            <Paperclip className="w-3 h-3" /> Ver Anexo
                        </button>
                    )}
                </div>
                <p className="text-sm text-gray-500 dark:text-military-400 mt-1">{meta}</p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto mt-3 lg:mt-0">
                <div className="flex items-center gap-1 bg-gray-50 dark:bg-military-800 p-1.5 rounded-lg border border-gray-200 dark:border-military-700">
                    <StatusButton 
                        active={status === Status.PENDING} 
                        onClick={() => onStatusChange(Status.PENDING)}
                        icon={Clock}
                        label="Pendente"
                        colorClass="text-gray-500 dark:text-military-300 bg-white dark:bg-military-700 shadow-sm ring-1 ring-gray-200 dark:ring-military-600"
                    />
                    <StatusButton 
                        active={status === Status.PROCESSING} 
                        onClick={() => onStatusChange(Status.PROCESSING)}
                        icon={RefreshCw}
                        label={type === 'guide' ? 'Em Confecção' : 'Em Análise'}
                        colorClass="text-amber-500 bg-white dark:bg-military-700 shadow-sm ring-1 ring-amber-200 dark:ring-amber-900"
                    />
                    <StatusButton 
                        active={status === Status.READY} 
                        onClick={() => onStatusChange(Status.READY)}
                        icon={Check}
                        label="Pronto"
                        colorClass="text-emerald-500 dark:text-emerald-400 bg-white dark:bg-military-700 shadow-sm ring-1 ring-emerald-200 dark:ring-emerald-900"
                    />
                     <StatusButton 
                        active={status === Status.DELIVERED} 
                        onClick={() => onStatusChange(Status.DELIVERED)}
                        icon={Truck}
                        label="Entregue"
                        colorClass="text-blue-500 dark:text-blue-400 bg-white dark:bg-military-700 shadow-sm ring-1 ring-blue-200 dark:ring-blue-900"
                    />
                </div>
                
                <div className="flex items-center gap-1 pl-2 border-l border-gray-200 dark:border-military-700">
                    <button 
                        onClick={onEdit}
                        className="p-2 text-gray-400 dark:text-military-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors"
                        title="Editar"
                    >
                        <Edit className="w-4 h-4" />
                    </button>
                    <button 
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onDelete();
                        }}
                        className="p-2 text-gray-400 dark:text-military-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Excluir"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    )
}

const StatusButton: React.FC<{ active: boolean, onClick: () => void, icon: any, label: string, colorClass: string }> = ({ active, onClick, icon: Icon, label, colorClass }) => (
    <button 
        onClick={onClick}
        title={label}
        className={`p-2 rounded-md transition-all duration-200 ${active ? colorClass : 'text-gray-400 dark:text-military-500 hover:text-gray-600 dark:hover:text-military-300 hover:bg-gray-100 dark:hover:bg-military-700'}`}
    >
        <Icon className="w-4 h-4" />
    </button>
);

export default AdminDashboard;
