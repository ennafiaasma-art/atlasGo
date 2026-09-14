import React, { useState } from 'react';
import {
  Compass,
  Building2,
  LayoutDashboard,
  Users,
  Settings,
  LogOut
} from 'lucide-react';

// Importation directe des composants depuis leurs propres fichiers
import DestinationsSection from './DestinationsAdmin.jsx';
import AccommodationsSection from './Aubergemt.jsx'; // ou le nom exact de ton fichier (ex: ./accommodation)

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState('accommodations');

  const sectionTitles = {
    dashboard: 'Tableau de bord',
    destinations: 'Destinations',
    accommodations: 'Hébergements',
    users: 'Utilisateurs',
    settings: 'Paramètres'
  };

  const menuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { id: 'destinations', label: 'Destinations', icon: Compass },
    { id: 'accommodations', label: 'Hébergements', icon: Building2 },
    { id: 'users', label: 'Utilisateurs', icon: Users },
    { id: 'settings', label: 'Paramètres', icon: Settings }
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col justify-between p-6 border-r border-slate-800 flex-shrink-0">
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-800 flex items-center justify-center text-white font-black text-lg">
              A
            </div>
            <div>
              <h2 className="font-bold text-white text-base">AtlasGo</h2>
              <p className="text-[10px] text-slate-400">Panneau d'administration</p>
            </div>
          </div>

          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? 'bg-emerald-800 text-white shadow-sm'
                      : 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <button className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:bg-slate-800 hover:text-red-400 transition">
          <LogOut className="w-4 h-4" />
          <span>Déconnexion</span>
        </button>
      </aside>

      {/* Dynamic Page Content */}
      <main className="flex-1 overflow-x-hidden">
        {activeSection === 'destinations' && <DestinationsSection />}
        {activeSection === 'accommodations' && <AccommodationsSection />}
        {!['destinations', 'accommodations'].includes(activeSection) && (
          <div className="p-8">
            <h1 className="text-xl font-bold text-slate-900">
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