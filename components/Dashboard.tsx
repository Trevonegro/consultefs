
import React, { useEffect, useState } from 'react';
import { Patient, Exam, Guide, Status } from '../types';
import { Activity, FileText, Clock, FilePlus, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardProps {
  patient: Patient;
  exams: Exam[];
  guides: Guide[];
  globalAnnouncement?: string;
}

const Dashboard: React.FC<DashboardProps> = ({ patient, exams: initialExams, guides: initialGuides, globalAnnouncement }) => {
  const [exams, setExams] = useState(initialExams);
  const [guides, setGuides] = useState(initialGuides);

  useEffect(() => {
    setExams(initialExams);
    setGuides(initialGuides);
  }, [initialExams, initialGuides]);

  // Realtime logic moved to App.tsx to ensure updates across all routes

  const readyExamsCount = exams.filter(e => e.status === Status.READY).length;
  const readyGuidesCount = guides.filter(g => g.status === Status.READY).length;
  
  return (
    <div className="space-y-6 max-w-5xl mx-auto flex flex-col min-h-[calc(100vh-8rem)]">
      <div className="flex-grow space-y-6">
        
        {/* Global Announcement Banner */}
        {globalAnnouncement && (
            <div className="bg-amber-100 dark:bg-amber-900/30 border-l-4 border-amber-500 rounded-lg p-4 flex items-start gap-3 shadow-md animate-fade-up">
                <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-500 flex-shrink-0" />
                <div>
                    <h3 className="font-bold text-amber-800 dark:text-amber-400 text-sm uppercase mb-1">Aviso Importante</h3>
                    <p className="text-amber-900 dark:text-amber-200 text-sm leading-relaxed">{globalAnnouncement}</p>
                </div>
            </div>
        )}

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white dark:bg-military-900 p-6 rounded-2xl shadow-xl border border-gray-200 dark:border-military-700 animate-fade-up delay-100 transition-colors">
            <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-military-100">Olá, {patient.name}</h2>
                <p className="text-gray-500 dark:text-military-400">Bem-vindo ao Portal do Paciente.</p>
            </div>
            <Link 
                to="/solicitar"
                className="bg-gray-900 dark:bg-military-950 hover:bg-gray-800 dark:hover:bg-military-700 text-white px-6 py-3 rounded-xl shadow-lg font-semibold flex items-center gap-2 transition-all hover:scale-105"
            >
                <FilePlus className="w-5 h-5" />
                Nova Solicitação
            </Link>
        </div>

        {/* Main Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* EXAMS STATUS */}
            <div className={`relative overflow-hidden rounded-2xl p-6 border transition-all duration-300 shadow-lg hover-scale animate-fade-up delay-100 ${readyExamsCount > 0 ? 'bg-white dark:bg-military-900 border-emerald-500/30' : 'bg-white dark:bg-military-900 border-gray-200 dark:border-military-700'}`}>
                <div className="absolute top-0 right-0 p-4 opacity-[0.03]">
                    <Activity className="w-32 h-32 text-gray-900 dark:text-military-100" />
                </div>
                
                <div className="flex justify-between items-start mb-6 relative z-10">
                    <div className={`p-3 rounded-xl shadow-sm ${readyExamsCount > 0 ? 'bg-emerald-100 dark:bg-military-800 text-emerald-600 dark:text-emerald-400' : 'bg-gray-100 dark:bg-military-800 text-gray-400 dark:text-military-300'}`}>
                        <Activity className="w-8 h-8" />
                    </div>
                    {readyExamsCount > 0 && <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-emerald-200 dark:border-emerald-800">Disponível</span>}
                </div>
                
                <h3 className="text-lg font-bold text-gray-800 dark:text-military-100 mb-2 relative z-10">Exames Laboratoriais</h3>
                
                {readyExamsCount > 0 ? (
                    <div className="relative z-10">
                        <p className="text-emerald-600 dark:text-emerald-400 font-medium text-lg mb-6">
                            Você possui <span className="text-3xl font-bold">{readyExamsCount}</span> exame(s) pronto(s).
                        </p>
                        <Link to="/exames" className="w-full block text-center bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3.5 rounded-xl transition-colors shadow-md">
                            Visualizar Resultados
                        </Link>
                    </div>
                ) : (
                    <div className="relative z-10">
                        <p className="text-gray-500 dark:text-military-400 mb-6">Nenhum resultado pronto para retirada no momento.</p>
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-military-400 bg-gray-50 dark:bg-military-800 p-3 rounded-lg border border-gray-100 dark:border-military-700">
                            <Clock className="w-4 h-4" />
                            <span>Aguarde a atualização do sistema.</span>
                        </div>
                    </div>
                )}
            </div>

            {/* GUIDES STATUS */}
            <div className={`relative overflow-hidden rounded-2xl p-6 border transition-all duration-300 shadow-lg hover-scale animate-fade-up delay-200 ${readyGuidesCount > 0 ? 'bg-white dark:bg-military-900 border-blue-500/30' : 'bg-white dark:bg-military-900 border-gray-200 dark:border-military-700'}`}>
                 <div className="absolute top-0 right-0 p-4 opacity-[0.03]">
                    <FileText className="w-32 h-32 text-gray-900 dark:text-military-100" />
                </div>

                <div className="flex justify-between items-start mb-6 relative z-10">
                    <div className={`p-3 rounded-xl shadow-sm ${readyGuidesCount > 0 ? 'bg-blue-100 dark:bg-military-800 text-blue-600 dark:text-blue-400' : 'bg-gray-100 dark:bg-military-800 text-gray-400 dark:text-military-300'}`}>
                        <FileText className="w-8 h-8" />
                    </div>
                    {readyGuidesCount > 0 && <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-blue-200 dark:border-blue-800">Retirada</span>}
                </div>
                
                <h3 className="text-lg font-bold text-gray-800 dark:text-military-100 mb-2 relative z-10">Guias de Encaminhamento</h3>
                
                {readyGuidesCount > 0 ? (
                    <div className="relative z-10">
                        <p className="text-blue-600 dark:text-blue-400 font-medium text-lg mb-6">
                            <span className="text-3xl font-bold">{readyGuidesCount}</span> guia(s) pronta(s) para retirada.
                        </p>
                        <Link to="/guias" className="w-full block text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl transition-colors shadow-md">
                            Ver Guia
                        </Link>
                    </div>
                ) : (
                    <div className="relative z-10">
                        <p className="text-gray-500 dark:text-military-400 mb-6">Nenhuma guia liberada para retirada.</p>
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-military-400 bg-gray-50 dark:bg-military-800 p-3 rounded-lg border border-gray-100 dark:border-military-700">
                            <Clock className="w-4 h-4" />
                            <span>Assim que confeccionada, aparecerá aqui.</span>
                        </div>
                    </div>
                )}
            </div>
        </div>

        {/* List Preview */}
        <div className="bg-white dark:bg-military-900 rounded-2xl border border-gray-200 dark:border-military-700 shadow-xl overflow-hidden mt-8 animate-fade-up delay-300 transition-colors">
            <div className="bg-gray-50 dark:bg-military-800 px-6 py-4 border-b border-gray-200 dark:border-military-700 flex justify-between items-center">
                <h3 className="font-bold text-gray-800 dark:text-military-100">Resumo Geral</h3>
                <span className="text-xs font-medium text-gray-500 dark:text-military-400 uppercase tracking-wider">Últimas Atualizações</span>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-military-700">
                {exams.length === 0 && guides.length === 0 && (
                    <div className="p-8 text-center text-gray-500 dark:text-military-400">Nenhum registro encontrado.</div>
                )}
                
                {exams.map(e => (
                    <div key={e.id} className="p-4 sm:px-6 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-military-800 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="bg-emerald-100 dark:bg-military-800 p-2 rounded-lg text-emerald-600 dark:text-emerald-400">
                                <Activity className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-800 dark:text-military-100">{e.name}</p>
                                <p className="text-xs text-gray-500 dark:text-military-400">Exame Laboratorial</p>
                            </div>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide border ${
                            e.status === Status.READY ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800' : 'bg-gray-100 dark:bg-military-800 text-gray-500 dark:text-military-400 border-gray-200 dark:border-military-600'
                        }`}>
                            {e.status === Status.READY ? 'Pronto' : 'Em Análise'}
                        </span>
                    </div>
                ))}

                {guides.map(g => (
                    <div key={g.id} className="p-4 sm:px-6 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-military-800 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="bg-blue-100 dark:bg-military-800 p-2 rounded-lg text-blue-600 dark:text-blue-400">
                                <FileText className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-800 dark:text-military-100">{g.specialty}</p>
                                <p className="text-xs text-gray-500 dark:text-military-400">Guia Médica</p>
                            </div>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide border ${
                            g.status === Status.READY ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800' : 'bg-gray-100 dark:bg-military-800 text-gray-500 dark:text-military-400 border-gray-200 dark:border-military-600'
                        }`}>
                            {g.status === Status.READY ? 'Pronto' : 'Em Confecção'}
                        </span>
                    </div>
                ))}
            </div>
        </div>
        
        <div className="text-center p-4">
            <p className="text-xs text-gray-500 dark:text-military-400">
                Dúvidas? Procure a recepção central com seu documento em mãos.
            </p>
        </div>
      </div>

      <div className="py-4 text-center border-t border-gray-200 dark:border-military-700 mt-auto">
         <p className="text-[10px] text-gray-600 dark:text-military-400 font-medium uppercase tracking-wide">
             © 2025 CB BRUNO GASPARETE NASCIMENTO
         </p>
      </div>
    </div>
  );
};

export default Dashboard;
