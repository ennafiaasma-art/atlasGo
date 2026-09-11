import React, { useState, useEffect } from 'react';
import { useNavigate, NavLink, Outlet } from 'react-router-dom';
import { 
  Bell, LogOut, LayoutDashboard, Compass, 
  FolderTree, Activity, Hotel, Calendar, Users 
} from 'lucide-react';

const AdminDashboard = () => {
  const [admin, setAdmin] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setAdmin(JSON.parse(storedUser));
      } catch (e) {
        console.error("Erreur de lecture du user", e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Dynamic style for NavLink
  const navLinkClass = ({ isActive }) =>
    `w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition text-xs font-medium ${
      isActive 
        ? 'bg-[#0E4D3A] text-white font-bold shadow-sm' 
        : 'hover:bg-[#0A3A2C] hover:text-white text-slate-300'
    }`;

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-800">
      
      {/* 1. SIDEBAR FIXED */}
      <aside className="w-64 bg-[#062C21] text-slate-300 flex flex-col justify-between p-4 sticky top-0 h-screen shrink-0 border-r border-emerald-950">
        <div>
          {/* Logo */}
          <div className="flex items-center gap-3 px-3 py-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
              🌲
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-extrabold text-lg text-white tracking-tight">Béni Mellal</span>
              <span className="text-xs text-emerald-400 font-semibold">Khénifra</span>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-1">
            <NavLink to="/admin/dashboard" end className={navLinkClass}>
              <LayoutDashboard className="w-4 h-4 text-emerald-400" />
              Tableau de bord
            </NavLink>

            <NavLink to="/admin/destinations" className={navLinkClass}>
              <Compass className="w-4 h-4 text-emerald-400" />
              Destinations
            </NavLink>

            <NavLink to="/admin/categories" className={navLinkClass}>
              <FolderTree className="w-4 h-4 text-emerald-400" />
              Catégories
            </NavLink>

            <NavLink to="/admin/activities" className={navLinkClass}>
              <Activity className="w-4 h-4 text-emerald-400" />
              Activités
            </NavLink>

            <NavLink to="/admin/accommodations" className={navLinkClass}>
              <Hotel className="w-4 h-4 text-emerald-400" />
              Hébergements
            </NavLink>

            <NavLink to="/admin/reservations" className={navLinkClass}>
              <Calendar className="w-4 h-4 text-emerald-400" />
              Réservations
            </NavLink>

            <NavLink to="/admin/users" className={navLinkClass}>
              <Users className="w-4 h-4 text-emerald-400" />
              Utilisateurs
            </NavLink>
          </nav>
        </div>

        {/* Déconnexion */}
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium hover:bg-red-900/30 hover:text-red-400 transition text-slate-400"
        >
          <LogOut className="w-4 h-4" />
          Déconnexion
        </button>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-40 shadow-sm">
          <span className="bg-[#062C21] text-white text-xs font-bold px-4 py-1.5 rounded-lg tracking-wide uppercase">
            DASHBOARD ADMINISTRATEUR
          </span>

          <div className="flex items-center gap-5">
            <button className="relative p-2 text-slate-500 hover:text-emerald-800 transition rounded-lg hover:bg-slate-50">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 bg-red-500 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                3
              </span>
            </button>

            <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
              <div className="w-8 h-8 rounded-full bg-emerald-800 text-white font-extrabold flex items-center justify-center text-xs shadow-sm">
                {admin?.name ? admin.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <span className="text-xs font-bold text-slate-900">{admin?.name || 'Administrateur'}</span>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>

    </div>
  );
};

export default AdminDashboard;