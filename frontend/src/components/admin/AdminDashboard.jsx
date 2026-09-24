import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Compass,
  Building2,
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  Heart,
  Activity,
  Menu,
  X,
  User,
  ArrowUpRight
} from 'lucide-react';

// Importation des composants
import DestinationsSection from './DestinationsAdmin.jsx';
import AccommodationsSection from './Aubergement.jsx';
import Sidebar from '../Sidebar.jsx';
import AdminFavoritesSection from './AdminFavoritesSection.jsx'; 
import AdminProfileSection from './AdminProfileSection.jsx';
import AdminClientsSection from './AdminClientsSection.jsx';
import AdminReservations from './AdminReservations.jsx'; 

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState('dashboard'); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Stats pour le tableau de bord
  const [stats, setStats] = useState({
    aubergesCount: 0,
    destinationsCount: 0,
    usersCount: 0
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const [aubergesRes, destinationsRes, usersRes] = await Promise.all([
        axios.get('http://127.0.0.1:8000/api/auberges', { headers: { Authorization: `Bearer ${token}` } }).catch(() => ({ data: [] })),
        axios.get('http://127.0.0.1:8000/api/destinations', { headers: { Authorization: `Bearer ${token}` } }).catch(() => ({ data: [] })),
        axios.get('http://127.0.0.1:8000/api/admin/clients', { headers: { Authorization: `Bearer ${token}` } }).catch(() => ({ data: [] })),
      ]);

      const aubergesList = aubergesRes.data.auberges || aubergesRes.data || [];
      const destinationsList = destinationsRes.data.destinations || destinationsRes.data || [];
      const usersList = Array.isArray(usersRes.data)
        ? usersRes.data
        : usersRes.data?.users || usersRes.data?.data || [];

      setStats({
        aubergesCount: Array.isArray(aubergesList) ? aubergesList.length : 0,
        destinationsCount: Array.isArray(destinationsList) ? destinationsList.length : 0,
        usersCount: Array.isArray(usersList) ? usersList.length : 0
      });
    } catch (err) {
      console.error("Erreur lors du chargement des statistiques:", err);
    }
  };

  const sectionTitles = {
    dashboard: 'Tableau de bord',
    destinations: 'Destinations',
    accommodations: 'Hébergements',
    favoris: 'Favoris',
    users: 'Utilisateurs',
    profile: 'Mon Profil'
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-800 relative">
      
      {/* 📱 Mobile Top Bar avec bouton Menu */}
      <div className="lg:hidden absolute top-0 left-0 right-0 h-16 bg-slate-900 text-white flex items-center justify-between px-4 z-30 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-800 flex items-center justify-center text-white font-black text-base">
            A
          </div>
          <h2 className="font-bold text-white text-sm">AtlasGo Admin</h2>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 text-slate-300 hover:text-white focus:outline-none"
        >
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <Sidebar 
        role="admin"
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Dynamic Page Content */}
      <main className="flex-1 overflow-x-hidden pt-16 lg:pt-0 w-full bg-slate-50 min-h-screen">
        
        {/* Affichage de la vue Dashboard (Tableau de bord principal) */}
        {activeSection === 'dashboard' && (
          <div className="p-4 sm:p-8 space-y-6 max-w-7xl mx-auto">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Tableau de bord</h1>
              <p className="text-xs text-slate-500 mt-1">Bienvenue dans votre espace d'administration AtlasGo.</p>
            </div>

            {/* Cartes statistiques */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div 
                onClick={() => setActiveSection('accommodations')}
                className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm cursor-pointer hover:border-emerald-800 transition group"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center group-hover:bg-emerald-800 group-hover:text-white transition">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-800 transition" />
                </div>
                <div className="mt-4">
                  <h3 className="text-2xl font-bold text-slate-800">{stats.aubergesCount}</h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">Hébergements / Auberges</p>
                </div>
              </div>

              <div 
                onClick={() => setActiveSection('destinations')}
                className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm cursor-pointer hover:border-emerald-800 transition group"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition">
                    <Compass className="w-5 h-5" />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition" />
                </div>
                <div className="mt-4">
                  <h3 className="text-2xl font-bold text-slate-800">{stats.destinationsCount}</h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">Destinations</p>
                </div>
              </div>

              <div 
                onClick={() => setActiveSection('users')}
                className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm cursor-pointer hover:border-emerald-800 transition group"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition">
                    <Users className="w-5 h-5" />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 transition" />
                </div>
                <div className="mt-4">
                  <h3 className="text-2xl font-bold text-slate-800">{stats.usersCount}</h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">Utilisateurs inscrits</p>
                </div>
              </div>
            </div>

            {/* Raccourcis rapides */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-slate-800">Accès rapide</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button 
                  onClick={() => setActiveSection('accommodations')}
                  className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-emerald-50 rounded-xl text-left transition border border-slate-100"
                >
                  <Building2 className="w-5 h-5 text-emerald-800" />
                  <div>
                    <p className="text-xs font-bold text-slate-800">Gérer les Auberges</p>
                    <p className="text-[11px] text-slate-500">Ajouter ou modifier les hébergements et chambres</p>
                  </div>
                </button>

                <button 
                  onClick={() => setActiveSection('destinations')}
                  className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-emerald-50 rounded-xl text-left transition border border-slate-100"
                >
                  <Compass className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-xs font-bold text-slate-800">Gérer les Destinations</p>
                    <p className="text-[11px] text-slate-500">Configurer les zones et régions touristiques</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Sections du Dashboard */}
        {activeSection === 'destinations' && <DestinationsSection />}
        {activeSection === 'accommodations' && <AccommodationsSection />}
        {activeSection === 'favoris' && <AdminFavoritesSection />}
        {activeSection === 'users' && <AdminClientsSection />}
        {activeSection === 'profile' && <AdminProfileSection />} 
        {activeSection === 'admin-reservations' && <AdminReservations />}        
        
        {/* Autres sections par défaut */}
        {!['dashboard', 'destinations', 'accommodations', 'favoris', 'profile', 'users' , 'admin-reservations'].includes(activeSection) && (
          <div className="p-4 sm:p-8">
            <h1 className="text-lg sm:text-xl font-bold text-slate-900">
              {sectionTitles[activeSection] || 'Section'}
            </h1>
            <p className="text-xs text-slate-400 mt-2">
              Cette section est en cours de développement.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}