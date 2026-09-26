import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Bell, ChevronDown, MapPin, Bed, Heart, Menu, Search, Layers 
} from 'lucide-react';
import Sidebar from '../Sidebar.jsx';
import MesFavoris from './MesFavoris';
import VoirDestinations from './VoirDestinations';
import VoirReservations from './VoirReservations'; 
import Profile from './Profile';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

export default function UserDashboard() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const [userData, setUserData] = useState(null);
  const [stats, setStats] = useState({ destinations: 0, auberges: 0, reservations: 0, favoris: 0 });
  
  const [destinations, setDestinations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [reservations, setReservations] = useState([]);

  // États pour la recherche et le filtrage par Catégorie
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const [loading, setLoading] = useState(true);
  const [selectedDestForAuberges, setSelectedDestForAuberges] = useState(null);

  useEffect(() => {
    fetchDashboardData();
    fetchUserReservations();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [userRes, destRes, catRes, aubRes, favRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/user`, { headers }).catch(() => ({ data: null })),
        axios.get(`${API_BASE_URL}/destinations`, { headers }).catch(() => ({ data: [] })),
        axios.get(`${API_BASE_URL}/categories`, { headers }).catch(() => ({ data: [] })),
        axios.get(`${API_BASE_URL}/auberges`, { headers }).catch(() => ({ data: [] })),
        axios.get(`${API_BASE_URL}/favorites`, { headers }).catch(() => ({ data: [] }))
      ]);

      if (userRes.data) {
        setUserData(userRes.data.user || userRes.data);
      }

      const destinationsList = destRes.data?.destinations || (Array.isArray(destRes.data) ? destRes.data : []);
      
      const categoriesData = catRes.data?.categories || catRes.data?.data || catRes.data;
      const categoriesList = Array.isArray(categoriesData) ? categoriesData : [];

      setDestinations(destinationsList);
      setCategories(categoriesList);

      const aubergesList = aubRes.data?.auberges || aubRes.data?.data || (Array.isArray(aubRes.data) ? aubRes.data : []);
      
      const favorisData = favRes.data?.favoris || favRes.data?.data || favRes.data;
      const favorisList = Array.isArray(favorisData) ? favorisData : [];

      setStats(prev => ({
        ...prev,
        destinations: destinationsList.length,
        auberges: aubergesList.length,
        favoris: favorisList.length
      }));

    } catch (err) {
      console.error("Erreur chargement dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserReservations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/reservations`, {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }
      });
      const data = response.data?.reservations || response.data?.data || response.data;
      setReservations(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erreur réservations:", err);
    }
  };

  // Filtrer les destinations selon la recherche et la Catégorie sélectionnée
  const filteredDestinations = destinations.filter((dest) => {
    const destName = (dest.nom_destination || dest.nom || '').toLowerCase();
    const matchesSearch = destName.includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || 
      dest.categorie_id === selectedCategory || 
      dest.categorie?.id === selectedCategory ||
      dest.categorie?.nom?.toLowerCase() === String(selectedCategory).toLowerCase();

    return matchesSearch && matchesCategory;
  });

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
      
      <Sidebar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection} 
        isOpen={isMobileOpen} 
        onClose={() => setIsMobileOpen(false)} 
      />

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
    ESPACE VOYAGEUR - ATLASGO
  </div>

  <div className="flex items-center gap-4">

    <div 
      onClick={() => setActiveSection('profile')}
      className="flex items-center gap-2 pl-3 border-l border-emerald-100 cursor-pointer group py-1 px-2 rounded-xl hover:bg-emerald-50 transition"
      title="Voir mon profil"
    >
      <div className="w-9 h-9 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shadow-xs group-hover:bg-emerald-800 transition">
        {userData?.name ? userData.name.charAt(0).toUpperCase() : 'A'}
      </div>
      <span className="text-xs font-bold text-slate-700 group-hover:text-emerald-700 transition hidden sm:inline">
        {userData?.name || ""}
      </span>
      <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-700 transition" />
    </div>
  </div>
</header>

        {/* CONTENU PRINCIPAL */}
        <main className="p-6 sm:p-8 space-y-8 flex-1">
          
          {activeSection === 'dashboard' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                  Bonjour, {userData?.name} 
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Explorez les destinations de la région par catégorie</p>
              </div>

              {/* STATS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900">{stats.destinations}</h3>
                    <p className="text-[11px] text-slate-500 font-medium">Destinations</p>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center flex-shrink-0">
                    <Bed className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900">{reservations.length}</h3>
                    <p className="text-[11px] text-slate-500 font-medium">Réservations</p>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                    <Heart className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900">{stats.favoris}</h3>
                    <p className="text-[11px] text-slate-500 font-medium">Favoris</p>
                  </div>
                </div>
              </div>

              {/* BARRE DE RECHERCHE ET FILTRES DYNAMIQUES */}
              <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-xs flex flex-col md:flex-row items-center gap-4 justify-between">
                <div className="relative w-full md:w-80">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text"
                    placeholder="Rechercher une destination..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-emerald-600 transition"
                  />
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                  <Layers className="w-4 h-4 text-emerald-700 hidden sm:block" />
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                      selectedCategory === 'all' 
                        ? 'bg-emerald-700 text-white shadow-xs' 
                        : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                    }`}
                  >
                    Toutes
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                        selectedCategory === cat.id 
                          ? 'bg-emerald-700 text-white shadow-xs' 
                          : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                      }`}
                    >
                      {cat.nom}
                    </button>
                  ))}
                </div>
              </div>

              {/* RÉSULTATS DES DESTINATIONS */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-slate-900">
                    Destinations filtrées ({filteredDestinations.length})
                  </h3>
                </div>

                {filteredDestinations.length === 0 ? (
                  <div className="bg-white p-10 rounded-2xl border border-emerald-100 text-center text-xs text-slate-400 shadow-xs">
                    Aucune destination ne correspond à votre recherche ou catégorie.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {filteredDestinations.map((dest) => (
                      <div 
                        key={dest.id}
                        onClick={() => handleSelectDestination(dest)}
                        className="bg-white rounded-2xl overflow-hidden border border-emerald-100 shadow-xs hover:border-emerald-500 transition cursor-pointer group"
                      >
                        <div className="relative h-40 bg-slate-100">
                          <img 
                            src={getImageUrl(dest.image)} 
                            alt={dest.nom_destination || dest.nom} 
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          />
                          {dest.categorie?.nom && (
                            <span className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-xs text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-xs">
                              {dest.categorie.nom}
                            </span>
                          )}
                        </div>
                        <div className="p-4 space-y-1">
                          <h4 className="font-bold text-xs text-slate-900 truncate">
                            {dest.nom_destination || dest.nom}
                          </h4>
                          <p className="text-[11px] text-slate-500">
                            {dest.ville ? `${dest.ville}, ` : ''}{dest.province || 'Azilal'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

          {activeSection === 'destinations' && (
            <VoirDestinations onSelectDestinationForAuberges={setSelectedDestForAuberges} />
          )}

          {activeSection === 'mes-reservations' && (
            <VoirReservations />
          )}

          {activeSection === 'favoris' && <MesFavoris />}

          {activeSection === 'profile' && <Profile />}
          
        </main>
      </div>
    </div>
  );
}