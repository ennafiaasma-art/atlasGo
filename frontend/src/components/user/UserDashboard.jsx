import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  LayoutDashboard, MapPin, Compass, Bed, Calendar, Heart, 
  User, Settings, LogOut, Bell, ChevronDown, Star, ArrowRight, CheckCircle2, Clock 
} from 'lucide-react';
import VoirDestinations from './VoirDestinations';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
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

      setDestinationsPopulaires(destinationsList.slice(0, 4)); // Ghi 4 lawlin l-popular
      setStats({
        destinations: destinationsList.length,
        auberges: aubergesList.length,
        reservations: 2, // Exemple d'API dynamique ou fixée
        favoris: 15
      });

      // Exemple de données pour les réservations (t9dri tbaddliha b API dyal l-reservations)
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
    setActiveTab('auberges');
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://images.unsplash.com/photo-1546484475-7f7bd55792da?auto=format&fit=crop&w=800&q=80';
    return imagePath.startsWith('http') ? imagePath : `http://127.0.0.1:8000/storage/${imagePath}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-50 text-emerald-900 text-xs font-bold">
        Chargement de votre tableau de bord...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans text-slate-800">
      
      {/* 1. SIDEBAR (Gaule) */}
      <aside className="w-64 bg-white border-r border-slate-100 flex flex-col justify-between hidden lg:flex fixed h-full z-20">
        <div className="p-6 space-y-8">
          {/* Logo / Brand */}
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-900 text-white flex items-center justify-center font-bold">
              🏔️
            </div>
            <div>
              <h1 className="text-xs font-bold text-slate-900 leading-tight">Béni Mellal</h1>
              <h2 className="text-xs font-bold text-[#215234]">Khénifra</h2>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-1.5 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition ${activeTab === 'overview' ? 'bg-[#215234] text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Tableau de bord
            </button>
            <button
              onClick={() => setActiveTab('destinations')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition ${activeTab === 'destinations' ? 'bg-[#215234] text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <MapPin className="w-4 h-4" />
              Destinations
            </button>
            <button
              onClick={() => setActiveTab('activites')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition ${activeTab === 'activites' ? 'bg-[#215234] text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <Compass className="w-4 h-4" />
              Activités
            </button>
          
            <button
              onClick={() => setActiveTab('reservations')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition ${activeTab === 'reservations' ? 'bg-[#215234] text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <Calendar className="w-4 h-4" />
              Mes réservations
            </button>
            <button
              onClick={() => setActiveTab('favoris')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition ${activeTab === 'favoris' ? 'bg-[#215234] text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <Heart className="w-4 h-4" />
              Favoris
            </button>
          </nav>
        </div>

        {/* Footer Sidebar */}
        <div className="p-6 border-t border-slate-50 space-y-1 text-xs font-semibold text-slate-500">
          <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-50 transition">
            <User className="w-4 h-4" /> Profil
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-50 transition">
            <Settings className="w-4 h-4" /> Paramètres
          </button>
          <button 
            onClick={() => { localStorage.clear(); window.location.reload(); }}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-red-600 hover:bg-red-50 transition"
          >
            <LogOut className="w-4 h-4" /> Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Layout Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        
        {/* TOPBAR */}
        <header className="h-20 bg-white border-b border-slate-100 px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="text-sm font-bold text-slate-700">
            {/* Burger mobile ila bghiti */}
          </div>

          {/* Titre central f topbar */}
          <div className="bg-[#215234] text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-sm tracking-wider uppercase">
            DASHBOARD UTILISATEUR
          </div>

          {/* User & Notifications */}
          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-full bg-slate-50 text-slate-600 hover:bg-slate-100 transition">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-2 pl-2 border-l border-slate-100">
              <div className="w-9 h-9 rounded-full bg-emerald-100 text-[#215234] flex items-center justify-center font-bold text-xs">
                {userData?.name?.charAt(0) || 'Y'}
              </div>
              <span className="text-xs font-bold text-slate-800 hidden sm:inline">
                {userData?.name || 'Youssef A.'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <main className="p-8 space-y-8 flex-1">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              
              {/* Bienvenue */}
              <div>
                <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  Bonjour, {userData?.name || 'Youssef'} 👋
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">Découvrez les merveilles de Béni Mellal-Khénifra</p>
              </div>

              {/* 4 STATS CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#215234] flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900">{stats.destinations}</h3>
                    <p className="text-[11px] text-slate-400">Destinations visitées</p>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                    <Bed className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900">{stats.reservations}</h3>
                    <p className="text-[11px] text-slate-400">Réservations effectuées</p>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
                    <Compass className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900">8</h3>
                    <p className="text-[11px] text-slate-400">Activités réalisées</p>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
                    <Heart className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900">{stats.favoris}</h3>
                    <p className="text-[11px] text-slate-400">Lieux enregistrés</p>
                  </div>
                </div>
              </div>

              {/* GRID LAYOUT (Destinations Populaires à gauche + Mes prochaines réservations à droite) */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Destinations Populaires (2 colonnes sur 3) */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-bold text-slate-900">Destinations populaires</h3>
                    <button 
                      onClick={() => setActiveTab('destinations')}
                      className="text-xs font-semibold text-[#215234] hover:underline flex items-center gap-1"
                    >
                      Voir tout →
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {destinationsPopulaires.map((dest) => (
                      <div 
                        key={dest.id}
                        onClick={() => handleSelectDestination(dest)}
                        className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition cursor-pointer group"
                      >
                        <div className="relative h-36 bg-slate-100">
                          <img 
                            src={getImageUrl(dest.image)} 
                            alt={dest.nom_destination || dest.nom} 
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          />
                          <button className="absolute top-3 right-3 p-1.5 bg-white/80 backdrop-blur-md rounded-full text-slate-600 hover:text-red-500">
                            <Heart className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="p-3.5 space-y-1">
                          <h4 className="font-bold text-xs text-slate-900 truncate">
                            {dest.nom_destination || dest.nom}
                          </h4>
                          <div className="flex justify-between items-center text-[11px] text-slate-400">
                            <span>{dest.ville ? `${dest.ville}, ` : ''}{dest.province || 'Azilal'}</span>
                            <div className="flex items-center gap-1 font-bold text-slate-700">
                              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                              <span>{dest.note ?? '4.8'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mes prochaines réservations (1 colonne sur 3) */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-bold text-slate-900">Mes prochaines réservations</h3>
                    <button 
                      onClick={() => setActiveTab('reservations')}
                      className="text-xs font-semibold text-[#215234] hover:underline"
                    >
                      Voir tout →
                    </button>
                  </div>

                  <div className="space-y-3">
                    {reservationsProchaines.map((res) => (
                      <div key={res.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3">
                        <div className="flex items-center gap-3">
                          <img src={res.image} alt={res.nom} className="w-14 h-14 rounded-xl object-cover" />
                          <div className="space-y-0.5">
                            <h4 className="font-bold text-xs text-slate-900">{res.nom}</h4>
                            <p className="text-[11px] text-slate-400">{res.lieu}</p>
                            <div className="flex items-center gap-2 text-[10px] text-slate-500 pt-1">
                              <Calendar className="w-3 h-3 text-[#215234]" />
                              <span>{res.date}</span>
                            </div>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-50 flex items-center justify-between text-[11px]">
                          <span className="text-slate-400">{res.personnes}</span>
                          <span className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 ${
                            res.statut === 'Confirmé' 
                              ? 'bg-emerald-50 text-emerald-700' 
                              : 'bg-amber-50 text-amber-700'
                          }`}>
                            {res.statut === 'Confirmé' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                            {res.statut}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* BANNER "Partez à l'aventure !" */}
              <div className="relative bg-gradient-to-r from-[#1c472c] to-[#2b6640] rounded-3xl p-8 text-white overflow-hidden flex flex-col sm:flex-row justify-between items-center gap-6 shadow-md">
                <div className="space-y-2 z-10">
                  <span className="bg-white/20 text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-full">AtlasGo Experience</span>
                  <h3 className="text-xl font-extrabold">Partez à l'aventure !</h3>
                  <p className="text-xs text-emerald-100 max-w-md leading-relaxed">
                    Explorez des paysages exceptionnels, des activités uniques et vivez des expériences inoubliables dans la région.
                  </p>
                  <button 
                    onClick={() => setActiveTab('destinations')}
                    className="px-5 py-2.5 bg-white text-[#215234] rounded-xl text-xs font-bold hover:bg-emerald-50 transition shadow-sm inline-flex items-center gap-2 mt-2"
                  >
                    Explorer maintenant <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="absolute right-0 bottom-0 opacity-20 sm:opacity-40 pointer-events-none">
                  {/* Decorative illustration or icon placeholder */}
                </div>
              </div>

            </div>
          )}

          {activeTab === 'destinations' && (
            <VoirDestinations onSelectDestinationForAuberges={handleSelectDestination} />
          )}

          {activeTab === 'auberges' && (
            <VoirAuberges 
              selectedDestination={selectedDestForAuberges} 
              onResetFilter={() => setSelectedDestForAuberges(null)} 
            />
          )}

          {activeTab === 'reservations' && (
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-slate-900">Mes réservations</h3>
              <p className="text-xs text-slate-500">Consultez l'historique et l'état de vos réservations d'auberges.</p>
              {/* Zid code dyal reservations hna ila bghiti */}
            </div>
          )}

          {activeTab === 'favoris' && (
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-slate-900">Mes favoris</h3>
              <p className="text-xs text-slate-500">Retrouvez ici tous les sites et auberges que vous avez enregistrés.</p>
            </div>
          )}

          {activeTab === 'activites' && (
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-slate-900">Activités touristiques</h3>
              <p className="text-xs text-slate-500">Découvrez les randonnées et activités proposées dans la région.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}