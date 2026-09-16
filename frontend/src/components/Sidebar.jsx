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
  CalendarDays
} from 'lucide-react';

export default function Sidebar({ activeSection, setActiveSection }) {
  const navigate = useNavigate();
  
  // 1. Kan-qraw l-role mn localStorage (wla kan-chikiw b "user" ila knti mkhzno objet fih role)
  // Matalan: const user = JSON.parse(localStorage.getItem('user')); const userRole = user?.role || 'client';
  const userRole = localStorage.getItem('role') || 'client'; 

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  // Qaimat d l-menu dyal l-admin
  const adminMenuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { id: 'destinations', label: 'Destinations', icon: Compass },
    { id: 'accommodations', label: 'Hébergements', icon: Building2 },
    { id: 'activites', label: 'Activités', icon: Activity },
    { id: 'favoris', label: 'Favoris', icon: Heart },
    { id: 'users', label: 'Utilisateurs', icon: Users },
    { id: 'settings', label: 'Paramètres', icon: Settings }
  ];

  // Qaimat d l-menu dyal l-client (User 3adi)
  const clientMenuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { id: 'destinations', label: 'Destinations', icon: Compass },
    { id: 'activites', label: 'Activités', icon: Activity },
    { id: 'mes-reservations', label: 'Mes réservations', icon: CalendarDays },
    { id: 'favoris', label: 'Favoris', icon: Heart },
    { id: 'settings', label: 'Paramètres', icon: Settings }
  ];

  // N-ختارo l-menu lli ghadi y-t-afficha 3la ḥsab l-role
  const currentMenuItems = userRole === 'admin' ? adminMenuItems : clientMenuItems;

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col justify-between p-6 border-r border-slate-800 flex-shrink-0 min-h-screen">
      <div className="space-y-8">
        {/* Logo / Title */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-800 flex items-center justify-center text-white font-black text-lg shadow-md">
            A
          </div>
          <div>
            <h2 className="font-bold text-white text-base tracking-wide">AtlasGo</h2>
            <p className="text-[10px] text-slate-400">
              {userRole === 'admin' ? "Panneau d'administration" : "Espace Voyageur"}
            </p>
          </div>
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
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-emerald-800 text-white shadow-lg shadow-emerald-900/30'
                    : 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bouton Déconnexion */}
      <button 
        onClick={handleLogout}
        className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:bg-red-600/10 hover:text-red-400 transition"
      >
        <LogOut className="w-4 h-4" />
        <span>Déconnexion</span>
      </button>
    </aside>
  );
}