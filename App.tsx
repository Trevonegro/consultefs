import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { LayoutDashboard, FileText, Activity, LogOut, User, Menu, X, FilePlus, Bell, MessageSquare, UserCog, Smile, Moon, Sun } from 'lucide-react';
import { loginUser, acknowledgeItem, requestGuide, getGlobalAnnouncement } from './services/mockData';
import { Patient, Exam, Guide, Notification, User as UserType } from './types';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ExamList from './components/ExamList';
import GuideList from './components/GuideList';
import RequestGuide from './components/RequestGuide';
import AdminDashboard from './components/AdminDashboard';
import ProfileSettings from './components/ProfileSettings';
import DentalScheduler from './components/DentalScheduler';
import DentalList from './components/DentalList';
import Logo from './components/Logo';

interface AppState {
  user: UserType;
  patientData?: {
    profile: Patient;
    exams: Exam[];
    guides: Guide[];
    notifications: Notification[];
    dentalAppointments: any[];
  };
}

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [globalAnnouncement, setGlobalAnnouncement] = useState('');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  // Theme Toggle Effect
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Fetch global announcement on mount/update
  useEffect(() => {
    setGlobalAnnouncement(getGlobalAnnouncement());
    const interval = setInterval(() => {
        setGlobalAnnouncement(getGlobalAnnouncement());
    }, 2000); // Poll for updates in this mock environment
    return () => clearInterval(interval);
  }, []);

  const handleLogin = (credential: string, password: string) => {
    const result = loginUser(credential, password);
    if (result) {
      setAppState({
        user: result.user,
        patientData: result.data
      });
    } else {
      alert("Credenciais inválidas. Verifique usuário e senha.");
    }
  };

  const handleLogout = () => {
    setAppState(null);
  };

  const handleAcknowledge = (id: string, type: 'exam' | 'guide') => {
    if (appState?.user.cpf) {
        const updatedData = acknowledgeItem(appState.user.cpf, id, type);
        if (updatedData) {
            setAppState(prev => prev ? { ...prev, patientData: updatedData } : null);
        }
    }
  };

  const handleRequestGuide = (data: { specialty: string; doctor: string; attachmentUrl: string }) => {
     if (appState?.user.cpf) {
         requestGuide(appState.user.cpf, data);
         // Simulate re-fetch
         setAppState(prev => prev ? { ...prev } : null);
     }
  };

  if (!appState) {
    return <Login onLogin={handleLogin} theme={theme} toggleTheme={toggleTheme} />;
  }

  // Admin View (Exams, Guides, or Dentist Manager)
  if (appState.user.role === 'exam_manager' || appState.user.role === 'guide_manager' || appState.user.role === 'dentist_manager') {
      return (
        <div className="min-h-screen bg-gray-100 dark:bg-military-950 flex flex-col font-sans transition-colors duration-300">
           <header className="bg-white dark:bg-military-900 border-b border-gray-200 dark:border-military-700 h-16 px-6 flex justify-between items-center sticky top-0 z-20 shadow-sm transition-colors duration-300">
               <div className="flex items-center gap-3">
                  <Logo size="sm" showText={false} />
                  <div className="flex flex-col">
                      <span className="font-bold text-gray-800 dark:text-military-100 leading-tight">CONSULTE FS</span>
                      <span className="text-[10px] text-gray-500 dark:text-military-300 font-medium tracking-wider uppercase">
                        {appState.user.role === 'exam_manager' ? 'Gestão de Exames' : 
                         appState.user.role === 'guide_manager' ? 'Gestão de Guias' : 'Gestão Odontológica'}
                      </span>
                  </div>
               </div>
               <div className="flex items-center gap-4">
                  <button 
                    onClick={toggleTheme}
                    className="p-2 rounded-lg text-gray-500 dark:text-military-300 hover:bg-gray-100 dark:hover:bg-military-700 transition-colors"
                  >
                    {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  </button>
                  <div className="hidden md:flex flex-col text-right">
                      <span className="text-sm font-semibold text-gray-700 dark:text-military-200">{appState.user.name}</span>
                      <span className="text-xs text-gray-500 dark:text-military-400">Administrador</span>
                  </div>
                  <button 
                    onClick={handleLogout} 
                    className="p-2 text-gray-500 dark:text-military-300 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-military-700 rounded-lg transition-colors"
                    title="Sair"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
               </div>
           </header>
           <AdminDashboard role={appState.user.role} />
        </div>
      );
  }

  // Patient View
  return (
    <HashRouter>
      <div className="flex min-h-screen bg-gray-100 dark:bg-military-950 font-sans text-gray-900 dark:text-military-100 transition-colors duration-300">
        <Sidebar 
          isOpen={isSidebarOpen} 
          setIsOpen={setIsSidebarOpen} 
          onLogout={handleLogout}
        />
        
        <div className="flex-1 flex flex-col md:ml-72 transition-all duration-300">
          <Header 
            user={appState.patientData!.profile} 
            toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
            notifications={appState.patientData!.notifications}
            theme={theme}
            toggleTheme={toggleTheme}
          />
          
          <main className="flex-1 p-4 md:p-8 overflow-y-auto">
             <Routes>
                <Route path="/" element={<Dashboard patient={appState.patientData!.profile} exams={appState.patientData!.exams} guides={appState.patientData!.guides} globalAnnouncement={globalAnnouncement} />} />
                <Route path="/exames" element={<ExamList exams={appState.patientData!.exams} onAcknowledge={(id) => handleAcknowledge(id, 'exam')} />} />
                <Route path="/guias" element={<GuideList guides={appState.patientData!.guides} onAcknowledge={(id) => handleAcknowledge(id, 'guide')} />} />
                <Route path="/solicitar" element={<RequestGuide onSubmit={handleRequestGuide} />} />
                <Route path="/dentista/agendar" element={<DentalScheduler cpf={appState.patientData!.profile.cpf} />} />
                <Route path="/dentista/meus-agendamentos" element={<DentalList appointments={appState.patientData!.dentalAppointments || []} />} />
                <Route path="/perfil" element={<ProfileSettings patient={appState.patientData!.profile} />} />
                <Route path="*" element={<Navigate to="/" />} />
             </Routes>
          </main>
        </div>
      </div>
    </HashRouter>
  );
};

// --- Helper Components for Layout ---

const Header: React.FC<{ user: Patient, toggleSidebar: () => void, notifications: Notification[], theme: 'light'|'dark', toggleTheme: () => void }> = ({ user, toggleSidebar, notifications, theme, toggleTheme }) => {
  const [showNotifs, setShowNotifs] = useState(false);
  
  return (
    <header className="bg-white/90 dark:bg-military-900/90 backdrop-blur-md border-b border-gray-200 dark:border-military-700 h-16 flex items-center justify-between px-4 md:px-8 sticky top-0 z-10 transition-colors duration-300">
      <div className="flex items-center gap-3">
        <button onClick={toggleSidebar} className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-military-700 rounded-lg text-gray-500 dark:text-military-300 transition-colors">
          <Menu className="w-6 h-6" />
        </button>
        <span className="md:hidden font-bold text-gray-800 dark:text-military-100 tracking-tight">CONSULTE FS</span>
      </div>

      <div className="flex items-center gap-4">
        
        {/* Theme Toggle */}
        <button 
            onClick={toggleTheme}
            className="p-2 rounded-lg text-gray-500 dark:text-military-300 hover:bg-gray-100 dark:hover:bg-military-700 transition-colors"
        >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Notifications Bell */}
        <div className="relative">
            <button 
                onClick={() => setShowNotifs(!showNotifs)}
                className="p-2 text-gray-500 dark:text-military-300 hover:bg-gray-100 dark:hover:bg-military-700 rounded-lg transition-colors relative"
            >
                <Bell className="w-5 h-5" />
                {notifications.length > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-600 rounded-full border border-white dark:border-military-900"></span>
                )}
            </button>

            {/* Notification Dropdown */}
            {showNotifs && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-military-900 rounded-xl shadow-lg border border-gray-200 dark:border-military-700 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 border-b border-gray-200 dark:border-military-700 flex justify-between items-center">
                        <h4 className="font-bold text-gray-700 dark:text-military-200 text-sm">Notificações</h4>
                        <span className="text-xs text-gray-500 dark:text-military-400">{notifications.length} nova(s)</span>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-4 text-center text-gray-500 dark:text-military-400 text-sm">
                                Nenhuma notificação.
                            </div>
                        ) : (
                            notifications.map(notif => (
                                <div key={notif.id} className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-military-700 border-b border-gray-100 dark:border-military-700 last:border-0 transition-colors">
                                    <div className="flex items-start gap-3">
                                        <div className="bg-blue-100 dark:bg-military-700 p-1.5 rounded-full mt-0.5 text-blue-600 dark:text-blue-400">
                                            <MessageSquare className="w-3 h-3" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-800 dark:text-military-100 text-sm">{notif.title}</p>
                                            <p className="text-gray-500 dark:text-military-300 text-xs mt-0.5">{notif.message}</p>
                                            <p className="text-gray-400 dark:text-military-400 text-[10px] mt-1">{notif.date}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>

        <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-military-700">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-gray-700 dark:text-military-100">{user.name}</p>
            <p className="text-[10px] uppercase tracking-wide text-gray-500 dark:text-military-400">Paciente</p>
          </div>
          <div className="w-10 h-10 bg-gray-200 dark:bg-military-700 rounded-full flex items-center justify-center text-gray-600 dark:text-military-100 font-bold border-2 border-white dark:border-military-600 shadow-md">
            {user.name.substring(0, 2).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
};

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen, onLogout }) => {
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Visão Geral', path: '/' },
    { icon: Activity, label: 'Meus Exames', path: '/exames' },
    { icon: FileText, label: 'Minhas Guias', path: '/guias' },
    { icon: Smile, label: 'Dentista', path: '/dentista/meus-agendamentos' },
    { icon: FilePlus, label: 'Solicitar Guia', path: '/solicitar' },
    { icon: UserCog, label: 'Meu Perfil', path: '/perfil' },
  ];

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-20 md:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
      />

      <aside 
        className={`fixed inset-y-0 left-0 bg-white dark:bg-military-900 w-72 z-30 transform transition-transform duration-300 md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'} shadow-2xl flex flex-col border-r border-gray-200 dark:border-military-700`}
      >
        <div className="p-8 flex justify-between items-center border-b border-gray-200 dark:border-military-700">
          <Logo size="md" className="dark:text-white text-gray-900" />
          <button onClick={() => setIsOpen(false)} className="md:hidden text-gray-500 dark:text-military-300 hover:text-gray-900 dark:hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-4 space-y-2 flex-1 mt-4">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path.includes('dentista') && location.pathname.includes('dentista'));
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-4 px-4 py-4 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive 
                    ? 'bg-gray-900 dark:bg-military-700 text-white shadow-lg border border-gray-800 dark:border-military-600' 
                    : 'text-gray-500 dark:text-military-300 hover:bg-gray-100 dark:hover:bg-military-700 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400 dark:text-military-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors'}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-gray-200 dark:border-military-700">
          <button 
            onClick={onLogout}
            className="flex items-center justify-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-semibold text-gray-500 dark:text-military-300 hover:bg-gray-100 dark:hover:bg-military-700 hover:text-gray-900 dark:hover:text-white transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            Sair do Sistema
          </button>
        </div>
      </aside>
    </>
  );
};

export default App;