import React from 'react';
import { DentalAppointment, Status } from '../types';
import { Smile, Calendar, Clock, AlertCircle, User } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DentalListProps {
    appointments: DentalAppointment[];
}

const DentalList: React.FC<DentalListProps> = ({ appointments }) => {
    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-up">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg text-purple-700 dark:text-purple-300">
                        <Smile className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-military-100">Meus Agendamentos</h2>
                </div>
                <Link to="/dentista/agendar" className="text-purple-500 dark:text-purple-400 font-medium hover:underline text-sm hover:text-purple-600 dark:hover:text-purple-300">
                    + Novo Agendamento
                </Link>
            </div>

            <div className="space-y-4">
                {appointments.length === 0 ? (
                    <div className="text-center p-12 bg-white dark:bg-military-900 rounded-xl border border-gray-200 dark:border-military-700 shadow-lg transition-colors">
                        <Smile className="w-12 h-12 text-gray-300 dark:text-military-600 mx-auto mb-3" />
                        <p className="text-gray-500 dark:text-military-400">Nenhum agendamento encontrado.</p>
                        <Link to="/dentista/agendar" className="text-purple-600 dark:text-purple-400 font-semibold mt-2 inline-block">
                            Agendar agora
                        </Link>
                    </div>
                ) : (
                    appointments.map((appt, index) => (
                        <div 
                            key={appt.id} 
                            className="bg-white dark:bg-military-900 p-5 rounded-xl shadow-lg border border-gray-200 dark:border-military-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-scale-in transition-colors"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <div>
                                <h3 className="font-bold text-gray-800 dark:text-military-100 text-lg">{appt.procedure}</h3>
                                {appt.dentist && (
                                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-600 dark:text-military-300">
                                        <User className="w-3.5 h-3.5" />
                                        <span>{appt.dentist}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-military-400">
                                    <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {appt.date}</span>
                                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {appt.time}</span>
                                </div>
                            </div>
                            <div>
                                <span className={`px-4 py-2 rounded-lg text-sm font-bold border uppercase tracking-wide
                                    ${appt.status === Status.READY ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800' : 
                                      appt.status === Status.PENDING ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800' :
                                      appt.status === Status.DELIVERED ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800' :
                                      'bg-gray-100 dark:bg-military-800 text-gray-600 dark:text-military-400'}`}>
                                    {appt.status === Status.READY ? 'Confirmado' : 
                                     appt.status === Status.PENDING ? 'Pendente' : 
                                     appt.status === Status.DELIVERED ? 'Realizado' : appt.status}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-900/30 p-4 rounded-xl flex gap-3 text-sm text-purple-800 dark:text-purple-200 shadow-md">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p>
                    Chegue com 10 minutos de antecedência. Caso não possa comparecer, avise o setor de odontologia.
                </p>
            </div>
        </div>
    );
};

export default DentalList;