import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Bell, ChevronDown, MapPin, Bed, Compass, Heart, Menu, CalendarDays 
} from 'lucide-react';
import Sidebar from '../Sidebar.jsx';
import MesFavoris from './MesFavoris';
import VoirDestinations from './VoirDestinations';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

export default function UserDashboard() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const [userData, setUserData] = useState(null);
  const [stats, setStats] = useState({ destinations: 0, auberges: 0, reservations: 0, favoris: 0 });
  const [destinationsPopulaires, setDestinationsPopulaires] = useState([]);
  const [reservationsProchaines, setReservationsProchaines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDestForAuberges, setSelectedDestForAuberges] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [userRes, destRes, aubRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/user`, { headers }).catch(() => ({ data: null })),
        axios.get(`${API_BASE_URL}/destinations`, { headers }).catch(() => ({ data: [] })),
        axios.get(`${API_BASE_URL}/auberges`, { headers }).catch(() => ({ data: [] }))
      ]);

      if (userRes.data) {
        setUserData(userRes.data);
      }

      const destinationsList = destRes.data?.destinations || (Array.isArray(destRes.data) ? destRes.data : []);
      const aubergesList = aubRes.data?.auberges || aubRes.data?.data || (Array.isArray(aubRes.data) ? aubRes.data : []);

      setDestinationsPopulaires(destinationsList.slice(0, 4));
      setStats({
        destinations: destinationsList.length,
        auberges: aubergesList.length,
        reservations: 2,
        favoris: 15
      });

      setReservationsProchaines([
        { id: 1, nom: 'Auberge Cascades', lieu: 'Ouzoud', date: '24-26 Juin 2025', personnes: '2 personnes', statut: 'Confirmé', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80' },
        { id: 2, nom: 'Dar Atlas', lieu: 'Bin El Ouidane', date: '05-07 Juillet 2025', personnes: '2 personnes', statut: 'En attente', image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=400&q=80' }
      ]);

    } catch (err) {
      console.error("Erreur chargement dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDestination = (dest) => {
    setSelectedDestForAuberges(dest);
    setActiveSection('destinations');
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://images.unsplash.com/photo-1546484475-7f7bd55792da?auto=format&fit=crop&w=800&q=80';
    return imagePath.startsWith('http') ? imagePath : `http://127.0.0.1:8000/storage/${imagePath}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-emerald-50 text-emerald-800 text-xs font-bold">
        Chargement de votre tableau de bord...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-800 overflow-x-hidden">
      
      {/* Sidebar */}
      <Sidebar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection} 
        isOpen={isMobileOpen} 
        onClose={() => setIsMobileOpen(false)} 
      />

      {/* Main Layout Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        
        {/* TOPBAR */}
        <header className="h-20 bg-white border-b border-emerald-100 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          
          <button 
            onClick={() => setIsMobileOpen(true)}
            className="lg:hidden p-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden sm:block bg-emerald-700 text-white text-[11px] font-bold px-4 py-2 rounded-xl shadow-xs tracking-wider uppercase">
            {userData?.role === 'admin' ? 'PANNEAU D\'ADMINISTRATION' : 'ESPACE VOYAGEUR - ATLASGO'}
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-600 rounded-full"></span>
            </button>
            <div className="flex items-center gap-2 pl-3 border-l border-emerald-100">
              <div className="w-9 h-9 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                {userData?.name?.charAt(0) || 'A'}
              </div>
              <span className="text-xs font-bold text-slate-700 hidden sm:inline">
                {userData?.name || 'Asma Ennafia'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <main className="p-6 sm:p-8 space-y-8 flex-1">
          {activeSection === 'dashboard' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                  Bonjour, {userData?.name || 'Asma'} 👋
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Découvrez les merveilles de la région Béni Mellal-Khénifra</p>
              </div>

              {/* 4 STATS CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs flex items-center gap-4 hover:border-emerald-300 transition">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900">{stats.destinations}</h3>
                    <p className="text-[11px] text-slate-500 font-medium">Destinations</p>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs flex items-center gap-4 hover:border-emerald-300 transition">
                  <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center flex-shrink-0">
                    <Bed className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900">{stats.reservations}</h3>
                    <p className="text-[11px] text-slate-500 font-medium">Réservations</p>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs flex items-center gap-4 hover:border-emerald-300 transition">
                  <div className="w-12 h-12 rounded-xl bg-green-50 text-green-700 flex items-center justify-center flex-shrink-0">
                    <Compass className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900">8</h3>
                    <p className="text-[11px] text-slate-500 font-medium">Activités</p>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs flex items-center gap-4 hover:border-emerald-300 transition">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                    <Heart className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900">{stats.favoris}</h3>
                    <p className="text-[11px] text-slate-500 font-medium">Favoris</p>
                  </div>
                </div>
              </div>

              {/* GRID SECTION */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-bold text-slate-900">Destinations populaires</h3>
                    <button 
                      onClick={() => setActiveSection('destinations')}
                      className="text-xs font-semibold text-emerald-700 hover:underline flex items-center gap-1"
                    >
                      Voir tout →
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {destinationsPopulaires.map((dest) => (
                      <div 
                        key={dest.id}
                        onClick={() => handleSelectDestination(dest)}
                        className="bg-white rounded-2xl overflow-hidden border border-emerald-100 shadow-xs hover:border-emerald-500 transition cursor-pointer group"
                      >
                        <div className="relative h-36 bg-slate-100">
                          <img 
                            src={getImageUrl(dest.image)} 
                            alt={dest.nom_destination || dest.nom} 
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          />
                        </div>
                        <div className="p-3.5 space-y-1">
                          <h4 className="font-bold text-xs text-slate-900 truncate">
                            {dest.nom_destination || dest.nom}
                          </h4>
                          <div className="flex justify-between items-center text-[11px] text-slate-500">
                            <span>{dest.ville ? `${dest.ville}, ` : ''}{dest.province || 'Azilal'}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Réservations Prochaines */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-bold text-slate-900">Mes réservations</h3>
                    <button 
                      onClick={() => setActiveSection('mes-reservations')}
                      className="text-xs font-semibold text-emerald-700 hover:underline"
                    >
                      Voir tout →
                    </button>
                  </div>

                  <div className="space-y-3">
                    {reservationsProchaines.map((res) => (
                      <div key={res.id} className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-xs space-y-3">
                        <div className="flex items-center gap-3">
                          <img src={res.image} alt={res.nom} className="w-14 h-14 rounded-xl object-cover" />
                          <div className="space-y-0.5">
                            <h4 className="font-bold text-xs text-slate-900">{res.nom}</h4>
                            <p className="text-[11px] text-slate-500">{res.lieu}</p>
                            <div className="flex items-center gap-2 text-[10px] text-slate-500 pt-1">
                              <span className="text-emerald-700 font-semibold">{res.date}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'destinations' && (
            <VoirDestinations onSelectDestinationForAuberges={setSelectedDestForAuberges} />
          )}

          {activeSection === 'mes-reservations' && (
            <div className="bg-white p-8 rounded-3xl border border-emerald-100 shadow-xs space-y-4">
              <h3 className="text-lg font-bold text-slate-900">Mes réservations</h3>
              <p className="text-xs text-slate-500">Consultez l'historique et l'état de vos réservations.</p>
            </div>
          )}

          {/* هاد البلاصة ولات كتعرض مكون MesFavoris الحقيقي عوض النص العادي */}
          {activeSection === 'favoris' && (
            <MesFavoris />
          )}

          {activeSection === 'activites' && (
            <div className="bg-white p-8 rounded-3xl border border-emerald-100 shadow-xs space-y-4">
              <h3 className="text-lg font-bold text-slate-900">Activités touristiques</h3>
              <p className="text-xs text-slate-500">Découvrez les randonnées et activités proposées.</p>
            </div>
          )}

          {activeSection === 'settings' && (
            <div className="bg-white p-8 rounded-3xl border border-emerald-100 shadow-xs space-y-4">
              <h3 className="text-lg font-bold text-slate-900">Paramètres</h3>
              <p className="text-xs text-slate-500">Gérez vos préférences de compte.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}