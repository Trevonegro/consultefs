import React from 'react';
import { Exam, Status } from '../types';
import { Activity, CheckCircle, Check, Eye } from 'lucide-react';

interface ExamListProps {
  exams: Exam[];
  onAcknowledge: (id: string) => void;
}

const ExamList: React.FC<ExamListProps> = ({ exams, onAcknowledge }) => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-up">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-emerald-100 dark:bg-military-800 p-2 rounded-lg text-emerald-700 dark:text-emerald-400">
           <Activity className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-military-100">Meus Exames</h2>
      </div>

      <div className="space-y-4">
        {exams.length === 0 ? (
             <div className="text-center p-12 bg-white dark:bg-military-900 rounded-xl border border-gray-200 dark:border-military-700 shadow-lg">
                 <p className="text-gray-500 dark:text-military-400">Nenhum exame solicitado.</p>
             </div>
        ) : (
            exams.map((exam, index) => (
                <div 
                    key={exam.id} 
                    className="bg-white dark:bg-military-900 p-5 rounded-xl shadow-lg border border-gray-200 dark:border-military-700 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-scale-in transition-colors"
                    style={{ animationDelay: `${index * 100}ms` }}
                >
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                             <h3 className="font-bold text-gray-800 dark:text-military-100 text-lg">{exam.name}</h3>
                             {exam.status === Status.READY && <CheckCircle className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-military-400">Solicitado em: {exam.dateRequested} • Laboratório: {exam.doctor}</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className={`px-4 py-2 rounded-lg text-sm font-semibold border ${
                            exam.status === Status.READY 
                            ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800' 
                            : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                        }`}>
                            {exam.status === Status.READY ? 'RESULTADO PRONTO' : 'EM ANÁLISE'}
                        </div>
                        
                        {exam.status === Status.READY && (
                            <div className="flex gap-2">
                                {!exam.acknowledged ? (
                                    <button 
                                        onClick={() => onAcknowledge(exam.id)}
                                        className="bg-gray-900 dark:bg-military-950 hover:bg-gray-800 dark:hover:bg-military-700 text-white p-3 rounded-lg transition-colors shadow-md flex items-center gap-2 hover:scale-105" 
                                        title="Confirmar Ciência"
                                    >
                                        <Eye className="w-5 h-5" />
                                        <span className="hidden md:inline">Confirmar Ciência</span>
                                    </button>
                                ) : (
                                    <span className="flex items-center gap-1 text-xs font-bold text-gray-500 dark:text-military-400 bg-gray-100 dark:bg-military-800 px-3 py-2 rounded-lg border border-gray-200 dark:border-military-700">
                                        <Check className="w-3 h-3" /> Ciente
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            ))
        )}
      </div>
    </div>
  );
};

export default ExamList;