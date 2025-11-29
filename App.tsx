import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { LayoutDashboard, FileText, Activity, LogOut, User, Menu, X, FilePlus, Bell, MessageSquare, UserCog } from 'lucide-react';
import { loginUser, acknowledgeItem, requestGuide, getGlobalAnnouncement } from './services/mockData';
import { Patient, Exam, Guide, Notification, User as UserType } from './types';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ExamList from './components/ExamList';
import GuideList from './components/GuideList';
import RequestGuide from './components/RequestGuide';
import AdminDashboard from './components/AdminDashboard';
import ProfileSettings from './components/ProfileSettings';

interface AppState {
  user: UserType;
  patientData?: {
    profile: Patient;
    exams: Exam[];
    guides: Guide[];
    notifications: Notification[];
  };
}

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [globalAnnouncement, setGlobalAnnouncement] = useState('');

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
    return <Login onLogin={handleLogin} />;
  }

  // Admin View
  if (appState.user.role === 'exam_manager' || appState.user.role === 'guide_manager') {
      return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
           <header className="bg-white border-b border-gray-200 h-16 px-6 flex justify-between items-center sticky top-0 z-20 shadow-sm">
               <div className="flex items-center gap-3">
                  <div className="bg-slate-800 p-1.5 rounded-lg text-white">
                    {/* Divisa de Cabo Logo (Rotated Up) */}
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                        <g transform="rotate(180 12 12)">
                          <path d="M19.5 5.5L12 13L4.5 5.5L6 4L12 10L18 4L19.5 5.5Z" />
                          <path d="M19.5 11.5L12 19L4.5 11.5L6 10L12 16L18 10L19.5 11.5Z" />
                        </g>
                    </svg>
                  </div>
                  <div className="flex flex-col">
                      <span className="font-bold text-slate-800 leading-tight">CONSULTE FS</span>
                      <span className="text-[10px] text-slate-500 font-medium tracking-wider uppercase">
                        {appState.user.role === 'exam_manager' ? 'Gestão de Exames' : 'Gestão de Guias'}
                      </span>
                  </div>
               </div>
               <div className="flex items-center gap-4">
                  <div className="hidden md:flex flex-col text-right">
                      <span className="text-sm font-semibold text-slate-700">{appState.user.name}</span>
                      <span className="text-xs text-slate-400">Administrador</span>
                  </div>
                  <button 
                    onClick={handleLogout} 
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
      <div className="flex min-h-screen bg-slate-50 font-sans">
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
          />
          
          <main className="flex-1 p-4 md:p-8 overflow-y-auto">
             <Routes>
                <Route path="/" element={<Dashboard patient={appState.patientData!.profile} exams={appState.patientData!.exams} guides={appState.patientData!.guides} globalAnnouncement={globalAnnouncement} />} />
                <Route path="/exames" element={<ExamList exams={appState.patientData!.exams} onAcknowledge={(id) => handleAcknowledge(id, 'exam')} />} />
                <Route path="/guias" element={<GuideList guides={appState.patientData!.guides} onAcknowledge={(id) => handleAcknowledge(id, 'guide')} />} />
                <Route path="/solicitar" element={<RequestGuide onSubmit={handleRequestGuide} />} />
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

const Header: React.FC<{ user: Patient, toggleSidebar: () => void, notifications: Notification[] }> = ({ user, toggleSidebar, notifications }) => {
  const [showNotifs, setShowNotifs] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length; // In this mock, we just count all as unread/read based on existence mostly

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 h-16 flex items-center justify-between px-4 md:px-8 sticky top-0 z-10 transition-all">
      <div className="flex items-center gap-3">
        <button onClick={toggleSidebar} className="md:hidden p-2 hover:bg-gray-100 rounded-lg text-slate-600 transition-colors">
          <Menu className="w-6 h-6" />
        </button>
        <span className="md:hidden font-bold text-slate-800 tracking-tight">CONSULTE FS</span>
      </div>

      <div className="flex items-center gap-4">
        
        {/* Notifications Bell */}
        <div className="relative">
            <button 
                onClick={() => setShowNotifs(!showNotifs)}
                className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors relative"
            >
                <Bell className="w-5 h-5" />
                {notifications.length > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-600 rounded-full border border-white"></span>
                )}
            </button>

            {/* Notification Dropdown */}
            {showNotifs && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 border-b border-gray-50 flex justify-between items-center">
                        <h4 className="font-bold text-slate-700 text-sm">Notificações</h4>
                        <span className="text-xs text-slate-400">{notifications.length} nova(s)</span>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-4 text-center text-slate-400 text-sm">
                                Nenhuma notificação.
                            </div>
                        ) : (
                            notifications.map(notif => (
                                <div key={notif.id} className="px-4 py-3 hover:bg-slate-50 border-b border-gray-50 last:border-0 transition-colors">
                                    <div className="flex items-start gap-3">
                                        <div className="bg-blue-100 p-1.5 rounded-full mt-0.5 text-blue-600">
                                            <MessageSquare className="w-3 h-3" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800 text-sm">{notif.title}</p>
                                            <p className="text-slate-500 text-xs mt-0.5">{notif.message}</p>
                                            <p className="text-slate-300 text-[10px] mt-1">{notif.date}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>

        <div className="flex items-center gap-3 pl-4 border-l border-gray-100">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-800">{user.name}</p>
            <p className="text-[10px] uppercase tracking-wide text-slate-500">Paciente</p>
          </div>
          <div className="w-10 h-10 bg-gradient-to-br from-red-700 to-red-900 rounded-full flex items-center justify-center text-white font-bold border-2 border-white shadow-md">
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
    { icon: FilePlus, label: 'Solicitar Guia', path: '/solicitar' },
    { icon: UserCog, label: 'Meu Perfil', path: '/perfil' },
  ];

  return (
    <>
      <div 
        className={`fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-20 md:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
      />

      <aside 
        className={`fixed inset-y-0 left-0 bg-slate-900 w-72 z-30 transform transition-transform duration-300 md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'} shadow-2xl flex flex-col`}
      >
        <div className="p-8 flex justify-between items-center border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="bg-red-700 p-2 rounded-lg shadow-lg shadow-red-900/50">
               {/* Divisa de Cabo Logo (Rotated Up) */}
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white">
                 <g transform="rotate(180 12 12)">
                   <path d="M19.5 5.5L12 13L4.5 5.5L6 4L12 10L18 4L19.5 5.5Z" />
                   <path d="M19.5 11.5L12 19L4.5 11.5L6 10L12 16L18 10L19.5 11.5Z" />
                 </g>
              </svg>
            </div>
            <div>
                <h1 className="text-xl font-bold text-white tracking-tight leading-none">CONSULTE FS</h1>
                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-1">Portal do Paciente</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="md:hidden text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-4 space-y-2 flex-1 mt-4">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-4 px-4 py-4 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive 
                    ? 'bg-red-700 text-white shadow-lg shadow-red-900/20' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-white transition-colors'}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-slate-800">
          <button 
            onClick={onLogout}
            className="flex items-center justify-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-all duration-200"
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