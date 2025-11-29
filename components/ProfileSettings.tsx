import React, { useState } from 'react';
import { Patient } from '../types';
import { User, Lock, Save, Shield, Hash, Calendar, Users, Eye, EyeOff } from 'lucide-react';
import { changePatientPassword } from '../services/mockData';

interface ProfileSettingsProps {
    patient: Patient;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ patient }) => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

    const handleChangePassword = (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        if (newPassword.length < 6) {
            setMessage({ text: 'A nova senha deve ter pelo menos 6 caracteres.', type: 'error' });
            return;
        }

        if (newPassword !== confirmPassword) {
            setMessage({ text: 'As senhas não coincidem.', type: 'error' });
            return;
        }

        const success = changePatientPassword(patient.cpf, newPassword);
        if (success) {
            setMessage({ text: 'Senha alterada com sucesso!', type: 'success' });
            setNewPassword('');
            setConfirmPassword('');
        } else {
            setMessage({ text: 'Erro ao alterar senha. Tente novamente.', type: 'error' });
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="bg-white dark:bg-military-900 text-gray-900 dark:text-military-100 p-6 rounded-2xl shadow-lg flex flex-col md:flex-row items-center gap-6 border border-gray-200 dark:border-military-700">
                 <div className="w-20 h-20 bg-gray-200 dark:bg-military-700 rounded-full flex items-center justify-center border-4 border-gray-100 dark:border-military-600 shadow-inner">
                      <span className="text-2xl font-bold">{patient.name.substring(0, 2).toUpperCase()}</span>
                 </div>
                 <div className="text-center md:text-left">
                     <h2 className="text-2xl font-bold">{patient.name}</h2>
                     <p className="text-gray-500 dark:text-military-300 font-mono text-sm mt-1">CPF: {patient.cpf}</p>
                     <span className="inline-block mt-2 px-3 py-1 bg-gray-100 dark:bg-military-700 rounded-full text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-military-200">
                         {patient.type}
                     </span>
                 </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Info Card */}
                <div className="bg-white dark:bg-military-900 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-military-700 transition-colors">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-military-100 mb-6 flex items-center gap-2 border-b border-gray-100 dark:border-military-700 pb-2">
                        <User className="w-5 h-5 text-red-600" />
                        Dados Pessoais
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                             <Shield className="w-5 h-5 text-gray-400 dark:text-military-400 mt-0.5" />
                             <div>
                                 <p className="text-xs text-gray-500 dark:text-military-400 uppercase font-bold">OM de Vinculação</p>
                                 <p className="text-gray-800 dark:text-military-200">{patient.om || 'Não informado'}</p>
                             </div>
                        </div>
                        <div className="flex items-start gap-3">
                             <Hash className="w-5 h-5 text-gray-400 dark:text-military-400 mt-0.5" />
                             <div>
                                 <p className="text-xs text-gray-500 dark:text-military-400 uppercase font-bold">PREC CP</p>
                                 <p className="text-gray-800 dark:text-military-200">{patient.precCp || 'Não informado'}</p>
                             </div>
                        </div>
                        <div className="flex items-start gap-3">
                             <Calendar className="w-5 h-5 text-gray-400 dark:text-military-400 mt-0.5" />
                             <div>
                                 <p className="text-xs text-gray-500 dark:text-military-400 uppercase font-bold">Data de Nascimento</p>
                                 <p className="text-gray-800 dark:text-military-200">{patient.birthDate ? new Date(patient.birthDate).toLocaleDateString('pt-BR') : 'Não informado'}</p>
                             </div>
                        </div>
                        {patient.type === 'DEPENDENTE' && (
                            <div className="flex items-start gap-3 bg-gray-50 dark:bg-military-800 p-3 rounded-lg">
                                <Users className="w-5 h-5 text-gray-400 dark:text-military-400 mt-0.5" />
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-military-400 uppercase font-bold">Titular Responsável</p>
                                    <p className="text-gray-800 dark:text-military-200 font-medium">{patient.holderName}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Change Password Card */}
                <div className="bg-white dark:bg-military-900 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-military-700 transition-colors">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-military-100 mb-6 flex items-center gap-2 border-b border-gray-100 dark:border-military-700 pb-2">
                        <Lock className="w-5 h-5 text-red-600" />
                        Alterar Senha
                    </h3>
                    
                    <form onSubmit={handleChangePassword} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-600 dark:text-military-400 mb-1">Nova Senha</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-military-600 bg-white dark:bg-military-950 rounded-lg focus:ring-2 focus:ring-red-500 outline-none text-gray-800 dark:text-military-100"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Digite a nova senha"
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowPassword(!showPassword)}
                                  className="absolute right-3 top-2.5 text-gray-400 dark:text-military-400 hover:text-gray-600 focus:outline-none"
                                >
                                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 dark:text-military-400 mb-1">Confirmar Nova Senha</label>
                            <input
                                type={showPassword ? "text" : "password"}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-military-600 bg-white dark:bg-military-950 rounded-lg focus:ring-2 focus:ring-red-500 outline-none text-gray-800 dark:text-military-100"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirme a nova senha"
                            />
                        </div>

                        {message && (
                            <div className={`p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-100 dark:bg-emerald-900/30 text-green-700 dark:text-emerald-400' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'}`}>
                                {message.text}
                            </div>
                        )}

                        <div className="pt-2">
                            <button 
                                type="submit" 
                                className="w-full bg-gray-900 dark:bg-military-950 hover:bg-gray-800 dark:hover:bg-military-800 text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                                <Save className="w-4 h-4" /> Salvar Nova Senha
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfileSettings;