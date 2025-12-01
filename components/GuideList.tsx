
import React from 'react';
import { Guide, Status } from '../types';
import { FileText, MapPin, QrCode, Clock, CheckCircle, Check, Eye, Paperclip, Download } from 'lucide-react';

interface GuideListProps {
  guides: Guide[];
  onAcknowledge: (id: string) => void;
}

const GuideList: React.FC<GuideListProps> = ({ guides, onAcknowledge }) => {
  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-military-100">Guias de Encaminhamento</h2>
        <button className="text-gray-500 dark:text-military-300 font-medium text-sm hover:underline hover:text-gray-900 dark:hover:text-military-100">Histórico completo</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {guides.length === 0 ? (
          <div className="col-span-full bg-white dark:bg-military-900 p-8 rounded-xl border border-gray-200 dark:border-military-700 text-center shadow-lg transition-colors">
            <div className="mx-auto bg-gray-100 dark:bg-military-800 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-gray-400 dark:text-military-300" />
            </div>
            <h3 className="text-gray-800 dark:text-military-100 font-medium">Nenhuma guia ativa</h3>
            <p className="text-gray-500 dark:text-military-400 text-sm mt-1">Você não possui guias de encaminhamento pendentes ou prontas para retirada no momento.</p>
          </div>
        ) : (
          guides.map((guide, index) => (
            <div 
                key={guide.id} 
                className="bg-white dark:bg-military-900 rounded-xl shadow-lg border border-gray-200 dark:border-military-700 overflow-hidden flex flex-col hover-scale animate-scale-in transition-colors"
                style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="p-5 flex-grow">
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium border
                    ${guide.status === Status.READY || guide.status === Status.DELIVERED ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800' : 
                      guide.status === Status.PROCESSING ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800' : 
                      'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800'}`}>
                    {guide.status === Status.READY ? 'Pronta p/ Retirada' : 
                     guide.status === Status.DELIVERED ? 'Retirada' :
                     guide.status === Status.PROCESSING ? 'Em Confecção' : 'Aguardando'}
                  </span>
                  {guide.attachmentUrl && (
                      <span className="bg-gray-100 dark:bg-military-800 p-1.5 rounded-lg text-gray-500 dark:text-military-300" title="Possui anexo">
                          <Paperclip className="w-4 h-4" />
                      </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-gray-800 dark:text-military-100 mb-1">{guide.specialty}</h3>
                <p className="text-sm text-gray-500 dark:text-military-400 mb-4">{guide.doctor}</p>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-500 dark:text-military-400">
                    <Clock className="w-4 h-4 text-gray-400 dark:text-military-300" />
                    <span>Solicitado em: {guide.dateRequested}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 dark:text-military-400">
                     {guide.status === Status.READY ? (
                       <CheckCircle className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                     ) : (
                       <MapPin className="w-4 h-4 text-gray-400 dark:text-military-300" />
                     )}
                    <span className={guide.status === Status.READY ? 'font-medium text-emerald-600 dark:text-emerald-400' : ''}>
                      {guide.status === Status.READY 
                        ? 'Disponível na Recepção Central' 
                        : `Previsão: ${guide.deadline}`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="bg-gray-50 dark:bg-military-800 px-5 py-3 border-t border-gray-100 dark:border-military-700 space-y-2">
                
                {/* View Attachment Button */}
                {guide.attachmentUrl && (
                    <a 
                        href={guide.attachmentUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-full bg-white dark:bg-military-700 hover:bg-gray-50 dark:hover:bg-military-600 text-blue-600 dark:text-blue-400 border border-gray-200 dark:border-military-600 py-2 rounded-lg text-sm font-medium transition-colors flex justify-center items-center gap-2"
                    >
                        <Download className="w-4 h-4" />
                        Visualizar Documento
                    </a>
                )}

                {/* Status/Acknowledge Button */}
                {guide.status === Status.READY ? (
                  !guide.acknowledged ? (
                    <button 
                      onClick={() => onAcknowledge(guide.id)}
                      className="w-full bg-gray-900 dark:bg-military-950 hover:bg-gray-800 dark:hover:bg-military-700 text-white py-2 rounded-lg text-sm font-medium transition-colors flex justify-center items-center gap-2 hover:scale-105"
                    >
                      <Eye className="w-4 h-4" />
                      Confirmar Ciência
                    </button>
                  ) : (
                    <div className="text-center pt-1">
                        <p className="text-gray-800 dark:text-military-100 font-semibold text-sm flex items-center justify-center gap-1 mb-1">
                            <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400" /> Ciente
                        </p>
                        <p className="text-xs text-gray-500 dark:text-military-400">
                            Pode retirar o documento na recepção.
                        </p>
                    </div>
                  )
                ) : guide.status === Status.DELIVERED ? (
                    <div className="text-center text-sm text-gray-400 dark:text-military-500 py-1">
                        Documento já retirado.
                    </div>
                ) : (
                   <button disabled className="w-full bg-gray-100 dark:bg-military-700 text-gray-400 dark:text-military-500 py-2 rounded-lg text-sm font-medium cursor-not-allowed border border-gray-200 dark:border-military-600">
                    Aguardando Confecção
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="bg-white dark:bg-military-900 border border-gray-200 dark:border-military-700 rounded-xl p-4 flex items-start gap-3 shadow-lg transition-colors">
         <div className="bg-gray-100 dark:bg-military-800 p-2 rounded-full">
            <CheckCircle className="w-5 h-5 text-gray-500 dark:text-military-400" />
         </div>
         <div>
            <h4 className="font-semibold text-gray-800 dark:text-military-100 text-sm">Instruções de Retirada</h4>
            <p className="text-xs text-gray-500 dark:text-military-400 mt-1">
               Ao confirmar ciência de que a guia está pronta, dirija-se à recepção central com um documento oficial com foto para realizar a retirada.
            </p>
         </div>
      </div>
    </div>
  );
};

export default GuideList;
