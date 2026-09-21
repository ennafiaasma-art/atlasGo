import React from 'react';
import { 
  LayoutDashboard, 
  Compass, 
  Building2, 
  Users, 
  CalendarDays, 
  Heart, 
  User, 
  LogOut 
} from 'lucide-react';

export default function Sidebar({ role = 'user', activeSection, setActiveSection, isOpen, onClose }) {
  
  const adminMenuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { id: 'destinations', label: 'Destinations', icon: Compass },
    { id: 'accommodations', label: 'Hébergements', icon: Building2 },
    { id: 'favoris', label: 'Favoris', icon: Heart },
    { id: 'users', label: 'Utilisateurs', icon: Users },
    { id: 'profile', label: 'Mon Profil', icon: User },
  ];

  const userMenuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { id: 'destinations', label: 'Destinations', icon: Compass },
    { id: 'mes-reservations', label: 'Mes réservations', icon: CalendarDays },
    { id: 'favoris', label: 'Favoris', icon: Heart },
    { id: 'profile', label: 'Mon Profil', icon: User },
  ];

  const menuItems = role === 'admin' ? adminMenuItems : userMenuItems;

  return (
    <>
      {/* Overlay mobile */}
      {isOpen && (
        <div 
          onClick={onClose} 
          className="fixed inset-0 bg-emerald-950/40 z-40 lg:hidden backdrop-blur-xs"
        />
      )}

      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-emerald-950 text-emerald-100 flex flex-col justify-between
        transition-transform duration-300 ease-in-out shadow-xl border-r border-emerald-900/50
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* En-tête de la Sidebar */}
        <div className="p-6 space-y-6">
          <div>
            <h1 className="text-white font-extrabold text-lg tracking-wider flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.6)]"></span>
              AtlasGo {role === 'admin' ? 'Admin' : 'Voyageur'}
            </h1>
            <p className="text-[11px] text-emerald-400/80 mt-0.5">
              {role === 'admin' ? "Panneau d'administration" : "Espace Voyageur"}
            </p>
          </div>

          <nav className="space-y-1.5">
            <p className="text-[10px] font-bold text-emerald-500/70 uppercase tracking-wider px-3 pb-2">
              Menu Principal
            </p>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    if (onClose) onClose();
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                    isActive 
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/30' 
                      : 'text-emerald-300/80 hover:bg-emerald-900/60 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bouton de Déconnexion en bas */}
        <div className="p-6 border-t border-emerald-900/60">
          <button 
            onClick={() => {
              localStorage.removeItem('token');
              window.location.href = '/login';
            }}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-300 hover:bg-rose-500/15 transition"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>
    </>
  );
}