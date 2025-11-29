import React, { useState } from 'react';
import { ArrowRight, Lock, User, KeyRound, Eye, EyeOff, UserPlus, Calendar, Hash, Shield, Users, ArrowLeft, CheckCircle, Sun, Moon } from 'lucide-react';
import { registerPatient } from '../services/mockData';
import { PatientType, MilitaryOrganization, Patient } from '../types';
import Logo from './Logo';

interface LoginProps {
  onLogin: (credential: string, password: string) => Promise<void>; // Updated to Promise
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, theme, toggleTheme }) => {
  // Login State
  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Registration State
  const [isRegistering, setIsRegistering] = useState(false);
  const [regSuccess, setRegSuccess] = useState(false);
  const [regData, setRegData] = useState<Partial<Patient>>({
    name: '',
    cpf: '',
    birthDate: '',
    precCp: '',
    type: 'TITULAR',
    holderName: '',
    om: 'CIA CMDO'
  });
  // Registration Password State
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);

  // --- LOGIN LOGIC ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onLogin(credential, password);
    setLoading(false);
  };

  const toggleAdmin = () => {
      setIsAdminMode(!isAdminMode);
      setCredential('');
      setPassword('');
  }

  // --- REGISTRATION LOGIC ---
  const handleRegister = async (e: React.FormEvent) => {
      e.preventDefault();
      
      // Validation
      if (!regData.name || !regData.cpf || !regData.precCp || !regData.birthDate || !regPassword) {
          alert("Preencha todos os campos obrigatórios.");
          return;
      }
      if (regPassword.length < 6) {
          alert("A senha deve ter pelo menos 6 caracteres.");
          return;
      }
      if (regPassword !== regConfirmPassword) {
          alert("As senhas não coincidem.");
          return;
      }
      if (regData.type === 'DEPENDENTE' && !regData.holderName) {
          alert("Para dependentes, o nome do titular é obrigatório.");
          return;
      }

      setLoading(true);
      
      // Async Registration
      const result = await registerPatient(regData as Patient, regPassword);
      setLoading(false);
      
      if (result.success) {
          setRegSuccess(true);
      } else {
          alert(result.message);
      }
  };

  const handlePrecCpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value.replace(/\D/g, ''); // Only numbers
      setRegData({ ...regData, precCp: val });
  };

  // --- RENDER REGISTRATION SUCCESS ---
  if (regSuccess) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100 dark:bg-military-950 transition-colors duration-300">
            <div className="bg-white dark:bg-military-900 rounded-2xl shadow-2xl w-full max-w-md p-8 text-center animate-scale-in border border-gray-200 dark:border-military-700">
                <div className="w-20 h-20 bg-emerald-100 dark:bg-military-800 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-military-100 mb-2">Cadastro Realizado!</h2>
                <p className="text-gray-500 dark:text-military-400 mb-6">
                    Seu cadastro foi criado com sucesso. <br/>
                    Utilize seu CPF e a senha criada para acessar o portal.
                </p>
                <button 
                    onClick={() => { 
                      setRegSuccess(false); 
                      setIsRegistering(false); 
                      setRegPassword(''); 
                      setRegConfirmPassword('');
                      setRegData({ name: '', cpf: '', birthDate: '', precCp: '', type: 'TITULAR', holderName: '', om: 'CIA CMDO' });
                    }}
                    className="w-full bg-gray-900 dark:bg-military-950 hover:bg-gray-800 dark:hover:bg-military-700 text-white font-semibold py-3 rounded-lg transition-colors border border-transparent dark:border-military-700 hover:scale-105"
                >
                    Voltar para Login
                </button>
            </div>
        </div>
      );
  }

  // --- RENDER REGISTRATION FORM ---
  if (isRegistering) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100 dark:bg-military-950 transition-colors duration-300">
            <div className="bg-white dark:bg-military-900 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col animate-scale-in border border-gray-200 dark:border-military-700">
                <div className="bg-gray-50 dark:bg-military-800 px-6 py-4 border-b border-gray-200 dark:border-military-700 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-military-100 flex items-center gap-2">
                        <UserPlus className="w-6 h-6 text-gray-400 dark:text-military-300" />
                        Novo Cadastro
                    </h2>
                    <button onClick={() => setIsRegistering(false)} className="text-gray-400 dark:text-military-300 hover:text-gray-600 dark:hover:text-military-100">
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                </div>
                
                <div className="p-6 md:p-8 overflow-y-auto max-h-[80vh]">
                    <form onSubmit={handleRegister} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* Nome */}
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-gray-500 dark:text-military-400 uppercase mb-1">Nome Completo</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 w-4 h-4 text-gray-400 dark:text-military-300" />
                                    <input
                                        required
                                        type="text"
                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-military-950 border border-gray-200 dark:border-military-700 rounded-lg focus:ring-2 focus:ring-gray-900 dark:focus:ring-military-500 outline-none text-gray-900 dark:text-military-100 placeholder-gray-400 dark:placeholder-military-600"
                                        placeholder="Digite seu nome completo"
                                        value={regData.name}
                                        onChange={e => setRegData({...regData, name: e.target.value})}
                                    />
                                </div>
                            </div>

                            {/* CPF */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 dark:text-military-400 uppercase mb-1">CPF</label>
                                <div className="relative">
                                    <Shield className="absolute left-3 top-3 w-4 h-4 text-gray-400 dark:text-military-300" />
                                    <input
                                        required
                                        type="text"
                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-military-950 border border-gray-200 dark:border-military-700 rounded-lg focus:ring-2 focus:ring-gray-900 dark:focus:ring-military-500 outline-none text-gray-900 dark:text-military-100 placeholder-gray-400 dark:placeholder-military-600"
                                        placeholder="000.000.000-00"
                                        value={regData.cpf}
                                        onChange={e => setRegData({...regData, cpf: e.target.value})}
                                    />
                                </div>
                            </div>

                            {/* Data Nascimento */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 dark:text-military-400 uppercase mb-1">Data de Nascimento</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-400 dark:text-military-300" />
                                    <input
                                        required
                                        type="date"
                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-military-950 border border-gray-200 dark:border-military-700 rounded-lg focus:ring-2 focus:ring-gray-900 dark:focus:ring-military-500 outline-none text-gray-900 dark:text-military-100 dark:[color-scheme:dark]"
                                        value={regData.birthDate}
                                        onChange={e => setRegData({...regData, birthDate: e.target.value})}
                                    />
                                </div>
                            </div>

                            {/* PREC CP */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 dark:text-military-400 uppercase mb-1">PREC CP (Apenas Números)</label>
                                <div className="relative">
                                    <Hash className="absolute left-3 top-3 w-4 h-4 text-gray-400 dark:text-military-300" />
                                    <input
                                        required
                                        type="text"
                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-military-950 border border-gray-200 dark:border-military-700 rounded-lg focus:ring-2 focus:ring-gray-900 dark:focus:ring-military-500 outline-none text-gray-900 dark:text-military-100 placeholder-gray-400 dark:placeholder-military-600"
                                        placeholder="Ex: 123456789"
                                        value={regData.precCp}
                                        onChange={handlePrecCpChange}
                                    />
                                </div>
                            </div>

                            {/* OM Vinculação */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 dark:text-military-400 uppercase mb-1">OM de Vinculação</label>
                                <select 
                                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-military-950 border border-gray-200 dark:border-military-700 rounded-lg focus:ring-2 focus:ring-gray-900 dark:focus:ring-military-500 outline-none text-gray-900 dark:text-military-100"
                                    value={regData.om}
                                    onChange={e => setRegData({...regData, om: e.target.value as MilitaryOrganization})}
                                >
                                    <option value="CIA CMDO">CIA CMDO</option>
                                    <option value="6ª CIA COM">6ª CIA COM</option>
                                    <option value="COMANDO DA BRIGADA">COMANDO DA BRIGADA</option>
                                    <option value="PEL PE">PEL PE</option>
                                </select>
                            </div>
                            
                            {/* Password Section */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 dark:text-military-400 uppercase mb-1">Senha</label>
                                <div className="relative">
                                    <KeyRound className="absolute left-3 top-3 w-4 h-4 text-gray-400 dark:text-military-300" />
                                    <input
                                        required
                                        type={showRegPassword ? "text" : "password"}
                                        className="w-full pl-10 pr-10 py-2.5 bg-gray-50 dark:bg-military-950 border border-gray-200 dark:border-military-700 rounded-lg focus:ring-2 focus:ring-gray-900 dark:focus:ring-military-500 outline-none text-gray-900 dark:text-military-100 placeholder-gray-400 dark:placeholder-military-600"
                                        placeholder="Crie uma senha"
                                        value={regPassword}
                                        onChange={e => setRegPassword(e.target.value)}
                                    />
                                    <button
                                      type="button"
                                      onClick={() => setShowRegPassword(!showRegPassword)}
                                      className="absolute right-3 top-3 text-gray-400 dark:text-military-300 hover:text-gray-600 dark:hover:text-military-100 focus:outline-none"
                                    >
                                      {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 dark:text-military-400 uppercase mb-1">Confirmar Senha</label>
                                <div className="relative">
                                    <KeyRound className="absolute left-3 top-3 w-4 h-4 text-gray-400 dark:text-military-300" />
                                    <input
                                        required
                                        type={showRegPassword ? "text" : "password"}
                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-military-950 border border-gray-200 dark:border-military-700 rounded-lg focus:ring-2 focus:ring-gray-900 dark:focus:ring-military-500 outline-none text-gray-900 dark:text-military-100 placeholder-gray-400 dark:placeholder-military-600"
                                        placeholder="Confirme a senha"
                                        value={regConfirmPassword}
                                        onChange={e => setRegConfirmPassword(e.target.value)}
                                    />
                                </div>
                            </div>


                            {/* Tipo */}
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-gray-500 dark:text-military-400 uppercase mb-1">Você é Titular ou Dependente?</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <label className={`border rounded-xl p-3 flex items-center justify-center gap-2 cursor-pointer transition-all ${regData.type === 'TITULAR' ? 'bg-gray-900 dark:bg-military-700 border-gray-800 dark:border-military-600 text-white font-bold' : 'border-gray-300 dark:border-military-600 text-gray-500 dark:text-military-300 hover:bg-gray-50 dark:hover:bg-military-800'}`}>
                                        <input 
                                            type="radio" 
                                            name="type" 
                                            value="TITULAR" 
                                            className="hidden"
                                            checked={regData.type === 'TITULAR'}
                                            onChange={() => setRegData({...regData, type: 'TITULAR'})}
                                        />
                                        <User className="w-5 h-5" /> Titular
                                    </label>
                                    <label className={`border rounded-xl p-3 flex items-center justify-center gap-2 cursor-pointer transition-all ${regData.type === 'DEPENDENTE' ? 'bg-gray-900 dark:bg-military-700 border-gray-800 dark:border-military-600 text-white font-bold' : 'border-gray-300 dark:border-military-600 text-gray-500 dark:text-military-300 hover:bg-gray-50 dark:hover:bg-military-800'}`}>
                                        <input 
                                            type="radio" 
                                            name="type" 
                                            value="DEPENDENTE" 
                                            className="hidden"
                                            checked={regData.type === 'DEPENDENTE'}
                                            onChange={() => setRegData({...regData, type: 'DEPENDENTE'})}
                                        />
                                        <Users className="w-5 h-5" /> Dependente
                                    </label>
                                </div>
                            </div>

                            {/* Nome do Titular (Condicional) */}
                            {regData.type === 'DEPENDENTE' && (
                                <div className="md:col-span-2 animate-fade-up bg-gray-50 dark:bg-military-800 p-4 rounded-xl border border-gray-200 dark:border-military-600">
                                    <label className="block text-xs font-bold text-gray-500 dark:text-military-400 uppercase mb-1">Nome Completo do Titular</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full px-4 py-2.5 bg-white dark:bg-military-950 border border-gray-300 dark:border-military-600 rounded-lg focus:ring-2 focus:ring-gray-900 dark:focus:ring-military-500 outline-none text-gray-900 dark:text-military-100"
                                        placeholder="Digite o nome do militar titular"
                                        value={regData.holderName}
                                        onChange={e => setRegData({...regData, holderName: e.target.value})}
                                    />
                                </div>
                            )}
                        </div>

                        <div className="pt-4 flex gap-3">
                            <button
                                type="button"
                                onClick={() => setIsRegistering(false)}
                                className="flex-1 bg-gray-100 dark:bg-military-800 border border-gray-300 dark:border-military-600 text-gray-500 dark:text-military-300 font-semibold py-3 rounded-lg hover:bg-gray-200 dark:hover:bg-military-700 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-[2] bg-gray-900 dark:bg-military-950 hover:bg-gray-800 dark:hover:bg-military-700 text-white font-semibold py-3 rounded-lg transition-colors shadow-lg flex items-center justify-center gap-2 hover:scale-105"
                            >
                                {loading ? 'Processando...' : (
                                    <>
                                        Confirmar Cadastro <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
      );
  }

  // --- RENDER LOGIN FORM ---
  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-500 bg-gray-100 dark:bg-military-950`}>
      <div className="bg-white dark:bg-military-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative flex flex-col border border-gray-200 dark:border-military-700 animate-scale-in transition-colors duration-300">
        {isAdminMode && <div className="absolute top-0 left-0 w-full h-1 bg-amber-600"></div>}
        
        {/* Theme Toggle in Login */}
        <div className="absolute top-4 right-4">
            <button 
                onClick={toggleTheme}
                className="p-2 rounded-full text-gray-400 dark:text-military-300 hover:bg-gray-100 dark:hover:bg-military-800 transition-colors"
            >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
        </div>

        <div className="p-8 text-center flex-1">
          <div className="flex justify-center mb-6">
             <Logo size="xl" showText={false} />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-military-100 mb-2">CONSULTE FS</h1>
          <p className="text-gray-500 dark:text-military-400 mb-8">{isAdminMode ? 'Área Restrita (Gestores)' : 'Portal do Paciente'}</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="text-left">
              <label htmlFor="credential" className="block text-sm font-medium text-gray-500 dark:text-military-400 mb-1 flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400 dark:text-military-300" />
                  {isAdminMode ? 'Usuário Gestor' : 'CPF do Paciente'}
              </label>
              <input
                id="credential"
                type="text"
                className={`w-full px-4 py-3 bg-gray-50 dark:bg-military-950 border border-gray-200 dark:border-military-700 rounded-lg focus:ring-2 focus:border-transparent transition-all outline-none text-gray-900 dark:text-military-100 placeholder-gray-400 dark:placeholder-military-600 ${isAdminMode ? 'focus:ring-amber-600' : 'focus:ring-gray-500 dark:focus:ring-military-500'}`}
                value={credential}
                onChange={(e) => setCredential(e.target.value)}
                required
              />
            </div>

            <div className="text-left">
              <label htmlFor="password" className="block text-sm font-medium text-gray-500 dark:text-military-400 mb-1 flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-gray-400 dark:text-military-300" />
                  Senha
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className={`w-full px-4 py-3 bg-gray-50 dark:bg-military-950 border border-gray-200 dark:border-military-700 rounded-lg focus:ring-2 focus:border-transparent transition-all outline-none text-gray-900 dark:text-military-100 placeholder-gray-400 dark:placeholder-military-600 ${isAdminMode ? 'focus:ring-amber-600' : 'focus:ring-gray-500 dark:focus:ring-military-500'}`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-military-300 hover:text-gray-600 dark:hover:text-military-100 focus:outline-none"
                  title={showPassword ? "Ocultar senha" : "Ver senha"}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            
            {!isAdminMode && (
                <div className="flex justify-between items-center text-xs mt-2">
                    <button type="button" onClick={() => setIsRegistering(true)} className="text-gray-600 dark:text-military-400 font-bold hover:underline hover:text-gray-900 dark:hover:text-military-100">
                        Primeiro Acesso? Cadastre-se
                    </button>
                    <button type="button" className="text-gray-400 dark:text-military-500 hover:text-gray-600 dark:hover:text-military-300">Esqueci minha senha</button>
                </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 mt-4 shadow-lg hover:scale-105 ${isAdminMode ? 'bg-amber-700 hover:bg-amber-600' : 'bg-gray-900 dark:bg-military-950 hover:bg-gray-800 dark:hover:bg-military-700'}`}
            >
              {loading ? 'Validando...' : (
                <>
                  Entrar no Sistema <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
          
          <div className="mt-8 pt-4 border-t border-gray-200 dark:border-military-700">
             <button onClick={toggleAdmin} className="text-xs text-gray-400 dark:text-military-500 hover:text-gray-600 dark:hover:text-military-300 underline">
                 {isAdminMode ? 'Voltar para Acesso Paciente' : 'Sou Gestor / Administrativo'}
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;