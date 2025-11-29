import React, { useState } from 'react';
import { ArrowRight, Lock, User, KeyRound } from 'lucide-react';

interface LoginProps {
  onLogin: (credential: string, password: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate network delay
    setTimeout(() => {
      onLogin(credential, password);
      setLoading(false);
    }, 800);
  };

  const toggleAdmin = () => {
      setIsAdminMode(!isAdminMode);
      setCredential('');
      setPassword('');
  }

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-500 ${isAdminMode ? 'bg-slate-800' : 'bg-gradient-to-br from-red-600 to-red-900'}`}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative flex flex-col">
        {isAdminMode && <div className="absolute top-0 left-0 w-full h-1 bg-amber-500"></div>}
        
        <div className="p-8 text-center flex-1">
          <div className="flex justify-center mb-4">
            <div className={`${isAdminMode ? 'bg-amber-100 text-amber-600' : 'bg-red-50 text-red-600 shadow-sm'} p-4 rounded-full transition-colors`}>
              {isAdminMode ? (
                <Lock className="w-10 h-10" />
              ) : (
                /* Divisa de Cabo (Double Chevron Up) - Rotated 180 from original */
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12">
                   <g transform="rotate(180 12 12)">
                      <path d="M19.5 5.5L12 13L4.5 5.5L6 4L12 10L18 4L19.5 5.5Z" />
                      <path d="M19.5 11.5L12 19L4.5 11.5L6 10L12 16L18 10L19.5 11.5Z" />
                   </g>
                </svg>
              )}
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">CONSULTE FS</h1>
          <p className="text-gray-500 mb-8">{isAdminMode ? 'Área Restrita (Gestores)' : 'Portal do Paciente'}</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="text-left">
              <label htmlFor="credential" className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" />
                  {isAdminMode ? 'Usuário Gestor' : 'CPF do Paciente'}
              </label>
              <input
                id="credential"
                type="text"
                placeholder={isAdminMode ? "ex: gestor.exames" : "000.000.000-00"}
                className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all outline-none ${isAdminMode ? 'focus:ring-amber-500' : 'focus:ring-red-500'}`}
                value={credential}
                onChange={(e) => setCredential(e.target.value)}
                required
              />
            </div>

            <div className="text-left">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-gray-400" />
                  Senha
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all outline-none ${isAdminMode ? 'focus:ring-amber-500' : 'focus:ring-red-500'}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            {!isAdminMode && (
                <div className="text-right">
                    <button type="button" className="text-xs text-red-600 hover:underline">Esqueci minha senha</button>
                </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 mt-4 ${isAdminMode ? 'bg-amber-600 hover:bg-amber-700' : 'bg-red-600 hover:bg-red-700'}`}
            >
              {loading ? 'Validando...' : (
                <>
                  Entrar no Sistema <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
          
          <div className="mt-8 pt-4 border-t border-gray-100">
             <button onClick={toggleAdmin} className="text-xs text-gray-400 hover:text-gray-600 underline">
                 {isAdminMode ? 'Voltar para Acesso Paciente' : 'Sou Gestor / Administrativo'}
             </button>
             {isAdminMode && (
                 <p className="text-xs text-gray-400 mt-2 italic">
                     Logins: <b>gestor.exames</b> ou <b>gestor.guias</b>
                 </p>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;