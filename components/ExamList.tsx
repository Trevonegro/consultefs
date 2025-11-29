import React from 'react';
import { Exam, Status } from '../types';
import { Activity, CheckCircle, Check, Eye } from 'lucide-react';

interface ExamListProps {
  exams: Exam[];
  onAcknowledge: (id: string) => void;
}

const ExamList: React.FC<ExamListProps> = ({ exams, onAcknowledge }) => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-red-100 p-2 rounded-lg text-red-700">
           <Activity className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Meus Exames</h2>
      </div>

      <div className="space-y-4">
        {exams.length === 0 ? (
             <div className="text-center p-12 bg-white rounded-xl border border-gray-200">
                 <p className="text-gray-500">Nenhum exame solicitado.</p>
             </div>
        ) : (
            exams.map((exam) => (
                <div key={exam.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                             <h3 className="font-bold text-gray-800 text-lg">{exam.name}</h3>
                             {exam.status === Status.READY && <CheckCircle className="w-5 h-5 text-green-500" />}
                        </div>
                        <p className="text-sm text-gray-500">Solicitado em: {exam.dateRequested} • Laboratório: {exam.doctor}</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className={`px-4 py-2 rounded-lg text-sm font-semibold border ${
                            exam.status === Status.READY 
                            ? 'bg-green-50 text-green-700 border-green-200' 
                            : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                        }`}>
                            {exam.status === Status.READY ? 'RESULTADO PRONTO' : 'EM ANÁLISE'}
                        </div>
                        
                        {exam.status === Status.READY && (
                            <div className="flex gap-2">
                                {!exam.acknowledged ? (
                                    <button 
                                        onClick={() => onAcknowledge(exam.id)}
                                        className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-lg transition-colors shadow-sm flex items-center gap-2" 
                                        title="Confirmar Ciência"
                                    >
                                        <Eye className="w-5 h-5" />
                                        <span className="hidden md:inline">Confirmar Ciência</span>
                                    </button>
                                ) : (
                                    <span className="flex items-center gap-1 text-xs font-bold text-red-800 bg-red-100 px-3 py-2 rounded-lg border border-red-200">
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