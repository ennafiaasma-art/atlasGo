import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Bell, ChevronRight, LogOut, LayoutDashboard, Compass, 
  FolderTree, Activity, Hotel, Calendar, Users, Newspaper, 
  Image as ImageIcon, BarChart3, Settings, TrendingUp, Clock, PlusCircle
} from 'lucide-react';

const AdminDashboard = () => {
  const [admin, setAdmin] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      setAdmin(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-800">
      
      {/* 1. SIDEBAR (Dark Emerald Theme) */}
      <aside className="w-64 bg-[#062C21] text-slate-300 flex flex-col justify-between p-4 sticky top-0 h-screen shrink-0">
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

          {/* Navigation Links */}
          <nav className="space-y-1 text-xs font-medium">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition ${activeTab === 'dashboard' ? 'bg-[#0E4D3A] text-white font-bold shadow-sm' : 'hover:bg-[#0A3A2C] hover:text-white'}`}
            >
              <LayoutDashboard className="w-4 h-4 text-emerald-400" />
              Tableau de bord
            </button>

            <button className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-[#0A3A2C] hover:text-white transition">
              <Compass className="w-4 h-4" />
              Destinations
            </button>

            <button className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-[#0A3A2C] hover:text-white transition">
              <FolderTree className="w-4 h-4" />
              Catégories
            </button>

            <button className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-[#0A3A2C] hover:text-white transition">
              <Activity className="w-4 h-4" />
              Activités
            </button>

            <button className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-[#0A3A2C] hover:text-white transition">
              <Hotel className="w-4 h-4" />
              Hébergements
            </button>

            <button className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-[#0A3A2C] hover:text-white transition">
              <Calendar className="w-4 h-4" />
              Réservations
            </button>

            <button className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-[#0A3A2C] hover:text-white transition">
              <Users className="w-4 h-4" />
              Utilisateurs
            </button>

            <button className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-[#0A3A2C] hover:text-white transition">
              <Newspaper className="w-4 h-4" />
              Actualités / Événements
            </button>

            <button className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-[#0A3A2C] hover:text-white transition">
              <ImageIcon className="w-4 h-4" />
              Images
            </button>

            <button className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-[#0A3A2C] hover:text-white transition">
              <BarChart3 className="w-4 h-4" />
              Statistiques
            </button>

            <button className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-[#0A3A2C] hover:text-white transition">
              <Settings className="w-4 h-4" />
              Paramètres
            </button>
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

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* 2. TOPBAR */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <span className="bg-[#062C21] text-white text-xs font-bold px-4 py-1.5 rounded-lg tracking-wide uppercase">
              DASHBOARD ADMINISTRATEUR
            </span>
          </div>

          <div className="flex items-center gap-5">
            <button className="relative p-2 text-slate-500 hover:text-emerald-800 transition">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 bg-red-500 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full">4</span>
            </button>

            <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
              <img 
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop" 
                alt="Admin" 
                className="w-8 h-8 rounded-full object-cover border border-emerald-600"
              />
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-slate-900 leading-tight">Admin</span>
              </div>
            </div>
          </div>
        </header>

        {/* 3. BODY CONTENT */}
        <main className="p-8 space-y-8 overflow-y-auto">
          
          {/* Welcome Title */}
          <div>
            <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              Bonjour, Administrateur 👋
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Gérez le contenu et suivez les performances de la plateforme.
            </p>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                <Compass className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-semibold uppercase">Destinations</p>
                <p className="text-2xl font-black text-slate-900">58</p>
                <p className="text-[10px] text-slate-400">Total des destinations</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                <Hotel className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-semibold uppercase">Hébergements</p>
                <p className="text-2xl font-black text-slate-900">36</p>
                <p className="text-[10px] text-slate-400">Auberges référencées</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-semibold uppercase">Activités</p>
                <p className="text-2xl font-black text-slate-900">24</p>
                <p className="text-[10px] text-slate-400">Activités disponibles</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-semibold uppercase">Réservations</p>
                <p className="text-2xl font-black text-slate-900">152</p>
                <p className="text-[10px] text-slate-400">Total des réservations</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-semibold uppercase">Utilisateurs</p>
                <p className="text-2xl font-black text-slate-900">1,248</p>
                <p className="text-[10px] text-slate-400">Utilisateurs inscrits</p>
              </div>
            </div>
          </div>

          {/* Grid Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* LEFT: Réservations récentes Table (7 Cols) */}
            <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-sm font-bold text-slate-900">Réservations récentes</h2>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="text-slate-400 border-b border-slate-100">
                        <th className="pb-3 font-semibold">ID</th>
                        <th className="pb-3 font-semibold">Utilisateur</th>
                        <th className="pb-3 font-semibold">Hébergement</th>
                        <th className="pb-3 font-semibold">Destination</th>
                        <th className="pb-3 font-semibold">Date d'arrivée</th>
                        <th className="pb-3 font-semibold">Statut</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {[
                        { id: '#152', user: 'Youssef A.', heb: 'Auberge Cascades', dest: 'Cascades d\'Ouzoud', date: '24/06/2025', status: 'Confirmée', bg: 'bg-emerald-100 text-emerald-800' },
                        { id: '#151', user: 'Fatima Zahra', heb: 'Dar Atlas', dest: 'Lac Bin El Ouidane', date: '05/07/2025', status: 'En attente', bg: 'bg-blue-100 text-blue-800' },
                        { id: '#150', user: 'Ayoub M.', heb: 'Auberge du Lac', dest: 'Lac Bin El Ouidane', date: '18/07/2025', status: 'Confirmée', bg: 'bg-emerald-100 text-emerald-800' },
                        { id: '#149', user: 'Sara El Amrani', heb: 'Auberge Atlas', dest: 'Géoparc M\'Goun', date: '30/06/2025', status: 'Annulée', bg: 'bg-rose-100 text-rose-800' },
                        { id: '#148', user: 'Khalid B.', heb: 'Auberge Cascades', dest: 'Cascades d\'Ouzoud', date: '22/06/2025', status: 'Confirmée', bg: 'bg-emerald-100 text-emerald-800' },
                      ].map((row, index) => (
                        <tr key={index} className="hover:bg-slate-50 transition">
                          <td className="py-3.5 font-bold text-slate-700">{row.id}</td>
                          <td className="py-3.5 text-slate-800 font-medium">{row.user}</td>
                          <td className="py-3.5 text-slate-600">{row.heb}</td>
                          <td className="py-3.5 text-slate-600">{row.dest}</td>
                          <td className="py-3.5 text-slate-500">{row.date}</td>
                          <td className="py-3.5">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${row.bg}`}>
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <a href="#" className="text-xs font-semibold text-emerald-700 hover:underline flex items-center gap-1">
                  Voir toutes les réservations <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* RIGHT: Stats & Charts Mockup (5 Cols) */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Line Chart Box */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
                  <h3 className="text-xs font-bold text-slate-900 mb-4">Réservations par mois</h3>
                  <div className="h-28 flex items-end justify-between gap-1 pt-4 px-2 border-b border-l border-slate-200">
                    <div className="w-full bg-emerald-100 rounded-t h-[35%]"></div>
                    <div className="w-full bg-emerald-200 rounded-t h-[55%]"></div>
                    <div className="w-full bg-emerald-100 rounded-t h-[30%]"></div>
                    <div className="w-full bg-emerald-300 rounded-t h-[75%]"></div>
                    <div className="w-full bg-emerald-200 rounded-t h-[50%]"></div>
                    <div className="w-full bg-emerald-600 rounded-t h-[95%]"></div>
                  </div>
                  <div className="flex justify-between text-[9px] text-slate-400 mt-2">
                    <span>Jan</span><span>Fév</span><span>Mar</span><span>Avr</span><span>Mai</span><span>Juin</span>
                  </div>
                </div>

                {/* Donut Chart Box */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
                  <h3 className="text-xs font-bold text-slate-900 mb-2">Réservations par statut</h3>
                  <div className="flex items-center justify-center my-3">
                    <div className="w-20 h-20 rounded-full border-8 border-emerald-500 border-t-blue-500 border-r-rose-400 flex items-center justify-center">
                      <span className="text-[10px] font-bold text-slate-600">152</span>
                    </div>
                  </div>
                  <div className="space-y-1 text-[10px]">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Confirmées</span>
                      <span className="font-bold">68% (104)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span> En attente</span>
                      <span className="font-bold">21% (32)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-400"></span> Annulées</span>
                      <span className="font-bold">11% (16)</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Dernières activités */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
                <h3 className="text-xs font-bold text-slate-900 mb-4">Dernières activités</h3>
                <div className="space-y-3.5 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></div>
                      <span className="text-slate-700 text-[11px]">Nouvelle destination ajoutée : <b>Aïn Asserdoun</b></span>
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0">Il y a 30 min</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0"></div>
                      <span className="text-slate-700 text-[11px]">Réservation <b>#152</b> confirmée par Youssef A.</span>
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0">Il y a 1 heure</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-2 h-2 rounded-full bg-amber-500 shrink-0"></div>
                      <span className="text-slate-700 text-[11px]">Nouvelle activité ajoutée : <b>Kayak</b></span>
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0">Il y a 2 heures</span>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </main>
      </div>

    </div>
  );
};

export default AdminDashboard;