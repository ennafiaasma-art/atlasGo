import React, { useState } from 'react';
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
  X
} from 'lucide-react';

// Importation directe des composants depuis leurs propres fichiers
import DestinationsSection from './DestinationsAdmin.jsx';
import AccommodationsSection from './Aubergement.jsx';

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState('accommodations');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // 📱 Etat pour contrôler la sidebar sur mobile

  const sectionTitles = {
    dashboard: 'Tableau de bord',
    destinations: 'Destinations',
    accommodations: 'Hébergements',
    activites: 'Activités',
    favoris: 'Favoris',
    users: 'Utilisateurs',
    settings: 'Paramètres'
  };

  const menuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { id: 'destinations', label: 'Destinations', icon: Compass },
    { id: 'accommodations', label: 'Hébergements', icon: Building2 },
    { id: 'activites', label: 'Activités', icon: Activity },
    { id: 'favoris', label: 'Favoris', icon: Heart },
    { id: 'users', label: 'Utilisateurs', icon: Users },
    { id: 'settings', label: 'Paramètres', icon: Settings }
  ];

  const handleMenuClick = (id) => {
    setActiveSection(id);
    setIsSidebarOpen(false); // Fermer la sidebar sur mobile après sélection
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

      {/* Overlay pour mobile quand la sidebar est ouverte */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
        />
      )}

      {/* Sidebar Navigation (Responsive Drawer) */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-64 bg-slate-900 text-slate-300 flex flex-col justify-between p-6 border-r border-slate-800 flex-shrink-0
        transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="space-y-8">
          {/* Logo visible sur Desktop */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-800 flex items-center justify-center text-white font-black text-lg">
              A
            </div>
            <div>
              <h2 className="font-bold text-white text-base">AtlasGo</h2>
              <p className="text-[10px] text-slate-400">Panneau d'administration</p>
            </div>
          </div>

          {/* Espace vide en haut sur mobile pour compenser la top bar */}
          <div className="lg:hidden pt-8" />

          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleMenuClick(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? 'bg-emerald-800 text-white shadow-sm'
                      : 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <button className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:bg-slate-800 hover:text-red-400 transition">
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Déconnexion</span>
        </button>
      </aside>

      {/* Dynamic Page Content */}
      <main className="flex-1 overflow-x-hidden pt-16 lg:pt-0 w-full">
        {activeSection === 'destinations' && <DestinationsSection />}
        {activeSection === 'accommodations' && <AccommodationsSection />}
        
        {/* Sections en cours de développement */}
        {!['destinations', 'accommodations'].includes(activeSection) && (
          <div className="p-4 sm:p-8">
            <h1 className="text-lg sm:text-xl font-bold text-slate-900">
              {sectionTitles[activeSection]}
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