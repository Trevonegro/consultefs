import React, { useState, useEffect } from 'react';
import { Smile, Calendar as CalendarIcon, Clock, Check, ChevronLeft, ChevronRight, AlertCircle, X, User } from 'lucide-react';
import { scheduleDentalAppointment, checkDateAvailability, getAvailableTimeSlots, getDentistsDatabase } from '../services/mockData';
import { useNavigate } from 'react-router-dom';

interface DentalSchedulerProps {
    cpf: string;
}

const DentalScheduler: React.FC<DentalSchedulerProps> = ({ cpf }) => {
    const navigate = useNavigate();
    const [currentDate, setCurrentDate] = useState(new Date()); // Tracks the month being viewed
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [procedure, setProcedure] = useState('Consulta de Rotina');
    const [dentistName, setDentistName] = useState('');
    const [loading, setLoading] = useState(false);

    const dentistsList = getDentistsDatabase();

    // Helpers for Calendar
    const daysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

    const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

    const handlePrevMonth = () => {
        // Prevent going back past today's month
        const today = new Date();
        const prevMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
        
        if (prevMonthDate.getMonth() < today.getMonth() && prevMonthDate.getFullYear() === today.getFullYear()) return;
        
        setCurrentDate(prevMonthDate);
        setSelectedDate(null);
        setSelectedTime(null);
    };

    const handleNextMonth = () => {
        const today = new Date();
        const currentMonthLastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
        
        // Logic: Agenda for next month only opens in the last week (approx last 7 days) of current month
        // Or if we are already viewing a future month (unlikely given the restriction, but good for safety)
        const isLastWeek = today.getDate() >= (currentMonthLastDay - 7);
        
        // If the user tries to go to next month, and we are currently in the actual current month
        if (currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear()) {
            if (!isLastWeek) {
                alert("A agenda do próximo mês só estará disponível na última semana deste mês.");
                return;
            }
        }

        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
        setSelectedDate(null);
        setSelectedTime(null);
    };

    const handleDateClick = (day: number) => {
        const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const availability = checkDateAvailability(dateStr);
        
        // Don't allow selecting past dates
        const today = new Date();
        const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        if (clickedDate < new Date(today.setHours(0,0,0,0))) return;

        if (availability === 'available') {
            setSelectedDate(dateStr);
            setSelectedTime(null); // Reset time when date changes
        }
    };

    const handleConfirm = async () => {
        if (!selectedDate || !selectedTime || !dentistName) {
            alert("Por favor, preencha todos os campos (Dentista, Data e Hora).");
            return;
        }
        setLoading(true);
        const result = await scheduleDentalAppointment(cpf, { procedure, date: selectedDate, time: selectedTime, dentist: dentistName });
        setLoading(false);
        if (result) {
            alert("Agendamento confirmado com sucesso!");
            navigate('/dentista/meus-agendamentos');
        } else {
            alert("Erro ao agendar.");
        }
    };

    const renderCalendarDays = () => {
        const totalDays = daysInMonth(currentDate);
        const startDay = firstDayOfMonth(currentDate);
        const blanks = Array.from({ length: startDay }, (_, i) => <div key={`blank-${i}`} className="h-10 md:h-14"></div>);
        
        const days = Array.from({ length: totalDays }, (_, i) => {
            const day = i + 1;
            const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const status = checkDateAvailability(dateStr);
            
            // Check if past
            const today = new Date();
            const thisDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            const isPast = thisDate < new Date(today.setHours(0,0,0,0));
            
            const isSelected = selectedDate === dateStr;
            
            let bgClass = "bg-gray-50 dark:bg-military-800 text-gray-400 dark:text-military-500 cursor-not-allowed"; // Default disabled/past
            if (!isPast) {
                if (status === 'available') bgClass = isSelected ? "bg-emerald-600 text-white shadow-md scale-105" : "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-800 cursor-pointer";
                else if (status === 'full') bgClass = "bg-red-100 dark:bg-red-900/30 text-red-400 cursor-not-allowed border border-red-200 dark:border-red-900";
                else if (status === 'unavailable') bgClass = "bg-gray-100 dark:bg-military-800 text-gray-400 dark:text-military-500 cursor-not-allowed"; // Weekends
            }

            return (
                <div 
                    key={day} 
                    onClick={() => !isPast && handleDateClick(day)}
                    className={`h-10 md:h-14 rounded-lg flex items-center justify-center text-sm font-bold transition-all duration-200 relative group ${bgClass}`}
                >
                    {day}
                    {!isPast && status === 'full' && (
                        <span className="absolute bottom-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                    )}
                </div>
            );
        });

        return [...blanks, ...days];
    };

    return (
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-6">
            
            {/* Calendar Section */}
            <div className="flex-1 bg-white dark:bg-military-900 rounded-2xl shadow-sm border border-gray-200 dark:border-military-700 overflow-hidden transition-colors">
                 <div className="bg-purple-600 p-4 text-white flex justify-between items-center">
                    <button onClick={handlePrevMonth} className="p-1 hover:bg-purple-700 rounded-full"><ChevronLeft className="w-5 h-5" /></button>
                    <h2 className="font-bold text-lg">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
                    <button onClick={handleNextMonth} className="p-1 hover:bg-purple-700 rounded-full"><ChevronRight className="w-5 h-5" /></button>
                </div>
                
                <div className="p-4">
                     <div className="grid grid-cols-7 gap-1 mb-2 text-center">
                        {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => (
                            <span key={i} className="text-xs font-bold text-gray-400 dark:text-military-400">{d}</span>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 gap-2">
                        {renderCalendarDays()}
                    </div>
                    
                    <div className="mt-4 flex gap-4 text-xs justify-center">
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded bg-emerald-100 dark:bg-emerald-900 border border-emerald-200 dark:border-emerald-800"></div>
                            <span className="text-gray-500 dark:text-military-300">Disponível</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded bg-red-100 dark:bg-red-900 border border-red-200 dark:border-red-800"></div>
                            <span className="text-gray-500 dark:text-military-300">Lotado/Indisp.</span>
                        </div>
                         <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded bg-gray-100 dark:bg-military-800"></div>
                            <span className="text-gray-500 dark:text-military-300">Passado</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Selection & Form Section */}
            <div className="w-full md:w-80 space-y-4">
                 {/* Procedure Select */}
                <div className="bg-white dark:bg-military-900 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-military-700 transition-colors">
                    <label className="block text-xs font-bold text-gray-500 dark:text-military-400 uppercase mb-2">Procedimento</label>
                    <select 
                        className="w-full p-2.5 border border-gray-300 dark:border-military-600 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none bg-white dark:bg-military-950 text-gray-800 dark:text-military-100"
                        value={procedure}
                        onChange={(e) => setProcedure(e.target.value)}
                    >
                        <option value="Consulta de Rotina">Consulta de Rotina</option>
                        <option value="Limpeza (Profilaxia)">Limpeza</option>
                        <option value="Restauração">Restauração</option>
                        <option value="Extração">Extração</option>
                        <option value="Urgência (Dor)">Urgência</option>
                    </select>
                </div>

                {/* Dentist Select */}
                <div className="bg-white dark:bg-military-900 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-military-700 transition-colors">
                    <label className="block text-xs font-bold text-gray-500 dark:text-military-400 uppercase mb-2">Dentista</label>
                    <div className="relative">
                        <User className="absolute left-3 top-2.5 w-4 h-4 text-gray-400 dark:text-military-300" />
                        <input
                            list="dentists-list"
                            className="w-full pl-9 p-2.5 border border-gray-300 dark:border-military-600 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none bg-white dark:bg-military-950 text-gray-800 dark:text-military-100"
                            value={dentistName}
                            onChange={(e) => setDentistName(e.target.value)}
                            placeholder="Nome do Dentista"
                        />
                        <datalist id="dentists-list">
                            {dentistsList.map((d, i) => <option key={i} value={d} />)}
                        </datalist>
                    </div>
                </div>

                {selectedDate ? (
                    <div className="bg-white dark:bg-military-900 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-military-700 animate-in slide-in-from-right-2 transition-colors">
                        <div className="flex items-center gap-2 mb-3 border-b border-gray-100 dark:border-military-700 pb-2">
                            <Clock className="w-4 h-4 text-purple-600" />
                            <h3 className="font-bold text-gray-800 dark:text-military-100">Horários - {new Date(selectedDate + 'T00:00:00').toLocaleDateString('pt-BR')}</h3>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            {getAvailableTimeSlots(selectedDate).map((time) => (
                                <button
                                    key={time}
                                    onClick={() => setSelectedTime(time)}
                                    className={`py-2 px-1 rounded-lg text-xs font-bold transition-all ${
                                        selectedTime === time 
                                        ? 'bg-purple-600 text-white shadow-md' 
                                        : 'bg-gray-50 dark:bg-military-800 text-gray-600 dark:text-military-300 hover:bg-purple-50 hover:text-purple-700 dark:hover:bg-military-700 dark:hover:text-military-100 border border-gray-100 dark:border-military-700'
                                    }`}
                                >
                                    {time}
                                </button>
                            ))}
                        </div>
                        
                        {selectedTime && (
                            <button
                                onClick={handleConfirm}
                                disabled={loading}
                                className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-bold shadow-lg shadow-emerald-200 dark:shadow-none transition-all flex items-center justify-center gap-2"
                            >
                                {loading ? 'Agendando...' : (
                                    <>
                                        Confirmar <Check className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-900/30 p-6 rounded-xl text-center">
                        <CalendarIcon className="w-10 h-10 text-purple-300 dark:text-purple-400 mx-auto mb-2" />
                        <p className="text-purple-800 dark:text-purple-200 font-medium text-sm">Selecione uma data verde no calendário para ver os horários.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DentalScheduler;