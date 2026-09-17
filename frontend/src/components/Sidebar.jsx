import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Compass,
  Building2,
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  Heart,
  Activity,
  CalendarDays,
  X
} from 'lucide-react';

export default function Sidebar({ activeSection, setActiveSection, isOpen = true, onClose }) {
  const navigate = useNavigate();
  
  const userRole = localStorage.getItem('role') || 'client'; 

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const adminMenuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { id: 'destinations', label: 'Destinations', icon: Compass },
    { id: 'accommodations', label: 'Hébergements', icon: Building2 },
    { id: 'activites', label: 'Activités', icon: Activity },
    { id: 'favoris', label: 'Favoris', icon: Heart },
    { id: 'users', label: 'Utilisateurs', icon: Users },
    { id: 'settings', label: 'Paramètres', icon: Settings }
  ];

  const clientMenuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { id: 'destinations', label: 'Destinations', icon: Compass },
    { id: 'activites', label: 'Activités', icon: Activity },
    { id: 'mes-reservations', label: 'Mes réservations', icon: CalendarDays },
    { id: 'favoris', label: 'Favoris', icon: Heart },
    { id: 'settings', label: 'Paramètres', icon: Settings }
  ];

  const currentMenuItems = userRole === 'admin' ? adminMenuItems : clientMenuItems;

  return (
    <>
      {/* Overlay للموبايل فاش كتكون الـ Sidebar محلولة */}
      {isOpen && (
        <div 
          onClick={onClose} 
          className="fixed inset-0 bg-slate-950/50 z-40 lg:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-slate-900 text-slate-300 flex flex-col justify-between p-6 
        border-r border-slate-800 flex-shrink-0 min-h-screen
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="space-y-8">
          {/* Logo / Title + Close Button for Mobile */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-800 flex items-center justify-center text-white font-black text-lg shadow-md shrink-0">
                A
              </div>
              <div className="min-w-0">
                <h2 className="font-bold text-white text-base tracking-wide truncate">AtlasGo</h2>
                <p className="text-[10px] text-slate-400 truncate">
                  {userRole === 'admin' ? "Panneau d'administration" : "Espace Voyageur"}
                </p>
              </div>
            </div>

            {/* زر الإغلاق في الهاتف */}
            {onClose && (
              <button 
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg lg:hidden transition"
                title="Fermer"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Navigation Links Dynamic */}
          <nav className="space-y-1.5">
            <div className="pb-2 text-[10px] uppercase tracking-wider text-slate-500 px-3 font-semibold">
              {userRole === 'admin' ? 'Administration' : 'Menu Principal'}
            </div>

            {currentMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    if (onClose) onClose(); // تسد القائمة في الموبايل مللي يكليكي المستخدم
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-emerald-800 text-white shadow-lg shadow-emerald-900/30'
                      : 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bouton Déconnexion */}
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:bg-red-600/10 hover:text-red-400 transition w-full"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Déconnexion</span>
        </button>
      </aside>
    </>
  );
}