import React from 'react';
import { Patient, Exam, Guide, Status } from '../types';
import { Activity, FileText, Clock, FilePlus, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardProps {
  patient: Patient;
  exams: Exam[];
  guides: Guide[];
  globalAnnouncement?: string;
}

const Dashboard: React.FC<DashboardProps> = ({ patient, exams, guides, globalAnnouncement }) => {
  const readyExamsCount = exams.filter(e => e.status === Status.READY).length;
  const readyGuidesCount = guides.filter(g => g.status === Status.READY).length;
  
  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto flex flex-col min-h-[calc(100vh-8rem)]">
      <div className="flex-grow space-y-6">
        
        {/* Global Announcement Banner */}
        {globalAnnouncement && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 shadow-sm animate-in slide-in-from-top-2">
                <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0" />
                <div>
                    <h3 className="font-bold text-amber-800 text-sm uppercase mb-1">Aviso Importante</h3>
                    <p className="text-amber-900 text-sm leading-relaxed">{globalAnnouncement}</p>
                </div>
            </div>
        )}

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold text-slate-800">Olá, {patient.name}</h2>
                <p className="text-slate-500">Bem-vindo ao Portal do Paciente.</p>
            </div>
            <Link 
                to="/solicitar"
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl shadow-lg shadow-red-200 font-semibold flex items-center gap-2 transition-all"
            >
                <FilePlus className="w-5 h-5" />
                Nova Solicitação
            </Link>
        </div>

        {/* Main Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* EXAMS STATUS */}
            <div className={`relative overflow-hidden rounded-2xl p-6 border transition-all duration-300 hover:shadow-md ${readyExamsCount > 0 ? 'bg-emerald-50 border-emerald-100' : 'bg-white border-gray-200'}`}>
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Activity className="w-32 h-32 text-slate-800" />
                </div>
                
                <div className="flex justify-between items-start mb-6 relative z-10">
                    <div className={`p-3 rounded-xl shadow-sm ${readyExamsCount > 0 ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                        <Activity className="w-8 h-8" />
                    </div>
                    {readyExamsCount > 0 && <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-emerald-200">Disponível</span>}
                </div>
                
                <h3 className="text-lg font-bold text-slate-800 mb-2 relative z-10">Exames Laboratoriais</h3>
                
                {readyExamsCount > 0 ? (
                    <div className="relative z-10">
                        <p className="text-emerald-800 font-medium text-lg mb-6">
                            Você possui <span className="text-3xl font-bold">{readyExamsCount}</span> exame(s) pronto(s).
                        </p>
                        <Link to="/exames" className="w-full block text-center bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3.5 rounded-xl transition-colors shadow-sm shadow-emerald-200">
                            Visualizar Resultados
                        </Link>
                    </div>
                ) : (
                    <div className="relative z-10">
                        <p className="text-slate-500 mb-6">Nenhum resultado pronto para retirada no momento.</p>
                        <div className="flex items-center gap-2 text-sm text-slate-400 bg-white/60 p-3 rounded-lg border border-gray-100">
                            <Clock className="w-4 h-4" />
                            <span>Aguarde a atualização do sistema.</span>
                        </div>
                    </div>
                )}
            </div>

            {/* GUIDES STATUS */}
            <div className={`relative overflow-hidden rounded-2xl p-6 border transition-all duration-300 hover:shadow-md ${readyGuidesCount > 0 ? 'bg-blue-50 border-blue-100' : 'bg-white border-gray-200'}`}>
                 <div className="absolute top-0 right-0 p-4 opacity-10">
                    <FileText className="w-32 h-32 text-slate-800" />
                </div>

                <div className="flex justify-between items-start mb-6 relative z-10">
                    <div className={`p-3 rounded-xl shadow-sm ${readyGuidesCount > 0 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                        <FileText className="w-8 h-8" />
                    </div>
                    {readyGuidesCount > 0 && <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-blue-200">Retirada</span>}
                </div>
                
                <h3 className="text-lg font-bold text-slate-800 mb-2 relative z-10">Guias de Encaminhamento</h3>
                
                {readyGuidesCount > 0 ? (
                    <div className="relative z-10">
                        <p className="text-blue-800 font-medium text-lg mb-6">
                            <span className="text-3xl font-bold">{readyGuidesCount}</span> guia(s) pronta(s) para retirada.
                        </p>
                        <Link to="/guias" className="w-full block text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl transition-colors shadow-sm shadow-blue-200">
                            Ver Guia & QR Code
                        </Link>
                    </div>
                ) : (
                    <div className="relative z-10">
                        <p className="text-slate-500 mb-6">Nenhuma guia liberada para retirada.</p>
                        <div className="flex items-center gap-2 text-sm text-slate-400 bg-white/60 p-3 rounded-lg border border-gray-100">
                            <Clock className="w-4 h-4" />
                            <span>Assim que confeccionada, aparecerá aqui.</span>
                        </div>
                    </div>
                )}
            </div>
        </div>

        {/* List Preview */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mt-8">
            <div className="bg-slate-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-bold text-slate-700">Resumo Geral</h3>
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Últimas Atualizações</span>
            </div>
            <div className="divide-y divide-gray-100">
                {exams.length === 0 && guides.length === 0 && (
                    <div className="p-8 text-center text-slate-400">Nenhum registro encontrado.</div>
                )}
                
                {exams.map(e => (
                    <div key={e.id} className="p-4 sm:px-6 flex justify-between items-center hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="bg-emerald-100 p-2 rounded-lg text-emerald-700">
                                <Activity className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-800">{e.name}</p>
                                <p className="text-xs text-slate-500">Exame Laboratorial</p>
                            </div>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide border ${
                            e.status === Status.READY ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-slate-100 text-slate-500 border-slate-200'
                        }`}>
                            {e.status === Status.READY ? 'Pronto' : 'Em Análise'}
                        </span>
                    </div>
                ))}

                {guides.map(g => (
                    <div key={g.id} className="p-4 sm:px-6 flex justify-between items-center hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="bg-blue-100 p-2 rounded-lg text-blue-700">
                                <FileText className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-800">{g.specialty}</p>
                                <p className="text-xs text-slate-500">Guia Médica</p>
                            </div>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide border ${
                            g.status === Status.READY ? 'bg-blue-100 text-blue-800 border-blue-200' : 'bg-slate-100 text-slate-500 border-slate-200'
                        }`}>
                            {g.status === Status.READY ? 'Pronto' : 'Em Confecção'}
                        </span>
                    </div>
                ))}
            </div>
        </div>
        
        <div className="text-center p-4">
            <p className="text-xs text-slate-400">
                Dúvidas? Procure a recepção central com seu documento em mãos.
            </p>
        </div>
      </div>

      <div className="py-4 text-center border-t border-gray-100 mt-auto">
         <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">
             © 2025 CB BRUNO GASPARETE NASCIMENTO
         </p>
      </div>
    </div>
  );
};

export default Dashboard;