import React from 'react';
import { Guide, Status } from '../types';
import { FileText, MapPin, QrCode, Clock, CheckCircle, Check, Eye } from 'lucide-react';

interface GuideListProps {
  guides: Guide[];
  onAcknowledge: (id: string) => void;
}

const GuideList: React.FC<GuideListProps> = ({ guides, onAcknowledge }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Guias de Encaminhamento</h2>
        <button className="text-red-600 font-medium text-sm hover:underline">Histórico completo</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {guides.length === 0 ? (
          <div className="col-span-full bg-white p-8 rounded-xl border border-gray-100 text-center">
            <div className="mx-auto bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-gray-800 font-medium">Nenhuma guia ativa</h3>
            <p className="text-gray-500 text-sm mt-1">Você não possui guias de encaminhamento pendentes ou prontas para retirada no momento.</p>
          </div>
        ) : (
          guides.map((guide) => (
            <div key={guide.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
              <div className="p-5 flex-grow">
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium border
                    ${guide.status === Status.READY || guide.status === Status.DELIVERED ? 'bg-green-100 text-green-800 border-green-200' : 
                      guide.status === Status.PROCESSING ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : 
                      'bg-red-100 text-red-800 border-red-200'}`}>
                    {guide.status === Status.READY ? 'Pronta p/ Retirada' : 
                     guide.status === Status.DELIVERED ? 'Retirada' :
                     guide.status === Status.PROCESSING ? 'Em Confecção' : 'Aguardando'}
                  </span>
                  {guide.status === Status.READY && <FileText className="w-5 h-5 text-gray-400" />}
                </div>

                <h3 className="text-lg font-bold text-gray-800 mb-1">{guide.specialty}</h3>
                <p className="text-sm text-gray-500 mb-4">{guide.doctor}</p>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>Solicitado em: {guide.dateRequested}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                     {guide.status === Status.READY ? (
                       <CheckCircle className="w-4 h-4 text-green-500" />
                     ) : (
                       <MapPin className="w-4 h-4 text-gray-400" />
                     )}
                    <span className={guide.status === Status.READY ? 'font-medium text-green-700' : ''}>
                      {guide.status === Status.READY 
                        ? 'Disponível na Recepção Central' 
                        : `Previsão: ${guide.deadline}`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="bg-gray-50 px-5 py-3 border-t border-gray-100">
                {guide.status === Status.READY ? (
                  !guide.acknowledged ? (
                    <button 
                      onClick={() => onAcknowledge(guide.id)}
                      className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg text-sm font-medium transition-colors flex justify-center items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Confirmar Ciência
                    </button>
                  ) : (
                    <div className="text-center">
                        <p className="text-red-700 font-semibold text-sm flex items-center justify-center gap-1 mb-1">
                            <Check className="w-4 h-4" /> Ciente
                        </p>
                        <p className="text-xs text-gray-500">
                            Pode retirar o documento na recepção.
                        </p>
                    </div>
                  )
                ) : guide.status === Status.DELIVERED ? (
                    <div className="text-center text-sm text-gray-500 py-2">
                        Documento já retirado.
                    </div>
                ) : (
                   <button disabled className="w-full bg-gray-200 text-gray-400 py-2 rounded-lg text-sm font-medium cursor-not-allowed">
                    Aguardando Confecção
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-start gap-3">
         <div className="bg-red-100 p-2 rounded-full">
            <CheckCircle className="w-5 h-5 text-red-600" />
         </div>
         <div>
            <h4 className="font-semibold text-red-900 text-sm">Instruções de Retirada</h4>
            <p className="text-xs text-red-800 mt-1">
               Ao confirmar ciência de que a guia está pronta, dirija-se à recepção central com um documento oficial com foto para realizar a retirada.
            </p>
         </div>
      </div>
    </div>
  );
};

export default GuideList;