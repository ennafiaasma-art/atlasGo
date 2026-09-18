import React from 'react';
import { 
  LayoutDashboard, 
  MapPin, 
  CalendarDays, 
  Heart, 
  User, 
  LogOut 
} from 'lucide-react';

export default function Sidebar({ activeSection, setActiveSection, isOpen, onClose }) {
  
  const menuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { id: 'destinations', label: 'Destinations', icon: MapPin },
    { id: 'mes-reservations', label: 'Mes réservations', icon: CalendarDays },
    { id: 'favoris', label: 'Favoris', icon: Heart },
    { id: 'profile', label: 'Mon Profil', icon: User }, // ← هنا تزاد البروفيل
  ];

  return (
    <>
      {/* Overlay mobile */}
      {isOpen && (
        <div 
          onClick={onClose} 
          className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden backdrop-blur-xs"
        />
      )}

      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-slate-900 text-slate-300 flex flex-col justify-between
        transition-transform duration-300 ease-in-out shadow-lg
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* En-tête de la Sidebar */}
        <div className="p-6 space-y-6">
          <div>
            <h1 className="text-white font-extrabold text-lg tracking-wider flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              AtlasGo
            </h1>
            <p className="text-[11px] text-slate-400 mt-0.5">Espace Voyageur</p>
          </div>

          <nav className="space-y-1.5">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 pb-2">
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
                      ? 'bg-emerald-600 text-white shadow-sm' 
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bouton de Déconnexion en bas */}
        <div className="p-6 border-t border-slate-800">
          <button 
            onClick={() => {
              localStorage.removeItem('token');
              window.location.href = '/login'; // أو الصفحة اللي كتحول ليها عند الخروج
            }}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition"
          >
            <LogOut className="w-4 h-4" />
            Déconnexion
          </button>
        </div>
      </aside>
    </>
  );
}