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
  X,
  User
} from 'lucide-react';


// Importation des composants
import DestinationsSection from './DestinationsAdmin.jsx';
import AccommodationsSection from './Aubergement.jsx';
import Sidebar from '../Sidebar.jsx'; 

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState('accommodations');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
      <main className="flex-1 overflow-x-hidden pt-16 lg:pt-0 w-full">
        {activeSection === 'destinations' && <DestinationsSection />}
        {activeSection === 'accommodations' && <AccommodationsSection />}
        
        {/* Sections en cours de développement ou Profile */}
        {!['destinations', 'accommodations'].includes(activeSection) && (
          <div className="p-4 sm:p-8">
            <h1 className="text-lg sm:text-xl font-bold text-slate-900">
              {sectionTitles[activeSection] || 'Section'}
            </h1>
            <p className="text-xs text-slate-400 mt-2">
              {activeSection === 'profile' 
                ? 'Gérez vos informations personnelles et paramètres de compte.' 
                : 'Cette section est en cours de développement.'}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}