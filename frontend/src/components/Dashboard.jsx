import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, MapPin, ChevronDown, Heart, User, Star,
  Compass, Trees, Building2, Landmark, Utensils, Users, Sparkles,
  Loader, Bed, Calendar
} from 'lucide-react';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

// 1. Navbar Visiteur
const Navbar = () => (
  <nav className="flex items-center justify-between px-8 py-3 bg-white border-b border-gray-100 sticky top-0 z-50 shadow-xs">
    <div className="flex items-center gap-3 cursor-pointer">
      <div className="w-10 h-10 rounded-lg bg-emerald-800 flex items-center justify-center text-white font-bold text-xl shadow-xs">
        🌲
      </div>
      <div className="flex flex-col leading-tight">
        <span className="font-extrabold text-lg text-emerald-950 tracking-tight">AtlasGo</span>
        <span className="font-semibold text-xs text-emerald-600">Béni Mellal-Khénifra</span>
      </div>
    </div>

    <div className="hidden md:flex items-center gap-6 text-xs font-semibold text-gray-600">
      <a href="#accueil" className="text-emerald-700 font-bold border-b-2 border-emerald-700 pb-1">Accueil</a>
      <a href="#destinations" className="hover:text-emerald-700 transition">Destinations</a>
      <a href="#auberges" className="hover:text-emerald-700 transition">Auberges</a>
    </div>

    <div className="flex items-center gap-3">
      <Link to="/login" className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-xs px-4 py-2 rounded-xl transition">
        Se connecter
      </Link>
      <Link to="/register" className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs px-4 py-2 rounded-xl transition shadow-xs">
        S'inscrire
      </Link>
    </div>
  </nav>
);

// 2. Hero Section & Filtres
const HeroSection = ({ onSearch, selectedCategory, setSelectedCategory }) => {
  const slides = [
    {
      img: 'https://images.unsplash.com/photo-1546484475-7f7bd55792da?auto=format&fit=crop&w=1200&q=80',
      title: "Découvrez la beauté de Béni Mellal-Khénifra"
    },
    {
      img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
      title: "Explorez les paysages d'Azilal et ses cascades"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [villeInput, setVilleInput] = useState('');
  const [categoryInput, setCategoryInput] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const categories = [
    { label: "Tous", icon: Compass, value: "" },
    { label: "Nature", icon: Trees, value: "Nature" },
    { label: "Aventure", icon: Compass, value: "Aventure" },
    { label: "Culture", icon: Landmark, value: "Culture" },
    { label: "Patrimoine", icon: Building2, value: "Patrimoine" },
    { label: "Gastronomie", icon: Utensils, value: "Gastronomie" },
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch({ ville: villeInput, category: categoryInput });
  };

  const handleCategoryClick = (catValue) => {
    setSelectedCategory(catValue);
    setCategoryInput(catValue);
    onSearch({ ville: villeInput, category: catValue });
  };

  return (
    <div className="relative px-6 lg:px-12 pt-4" id="accueil">
      <div 
        className="relative h-[380px] rounded-3xl overflow-hidden shadow-lg bg-cover bg-center transition-all duration-700 ease-in-out flex items-center px-8 lg:px-16 text-white"
        style={{ 
          backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.3)), url('${slides[currentIndex].img}')` 
        }}
      >
        <div className="max-w-xl z-10">
          <h1 className="text-3xl lg:text-4xl font-extrabold leading-tight mb-3">
            {slides[currentIndex].title}
          </h1>
          <p className="text-gray-200 text-xs lg:text-sm">
            Partez à l'aventure, réservez des auberges authentiques et vivez des expériences inoubliables.
          </p>
        </div>
      </div>

      {/* Formulaire de recherche */}
      <form onSubmit={handleSearchSubmit} className="relative -mt-8 max-w-4xl mx-auto bg-white p-4 rounded-2xl shadow-xl border border-emerald-50 z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
          <div>
            <label className="text-[11px] font-bold text-gray-700 block mb-1">Où ? (Ville / Province)</label>
            <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2 bg-gray-50 focus-within:bg-white focus-within:border-emerald-600 transition">
              <input 
                type="text" 
                placeholder="Ex: Béni Mellal, Azilal..." 
                value={villeInput}
                onChange={(e) => setVilleInput(e.target.value)}
                className="w-full text-xs bg-transparent outline-none text-gray-700" 
              />
              <MapPin className="w-4 h-4 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-gray-700 block mb-1">Catégorie</label>
            <div className="flex items-center justify-between border border-gray-200 rounded-xl px-3 py-2 bg-gray-50 focus-within:bg-white focus-within:border-emerald-600 transition">
              <select 
                value={categoryInput}
                onChange={(e) => setCategoryInput(e.target.value)}
                className="w-full text-xs bg-transparent outline-none text-gray-700 appearance-none cursor-pointer"
              >
                <option value="">Toutes les catégories</option>
                <option value="Nature">Nature</option>
                <option value="Aventure">Aventure</option>
                <option value="Culture">Culture</option>
                <option value="Patrimoine">Patrimoine</option>
              </select>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>
          </div>

          <button type="submit" className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-2 px-6 rounded-xl transition shadow-xs flex items-center justify-center gap-2 cursor-pointer text-xs">
            <Search className="w-4 h-4" />
            Rechercher
          </button>
        </div>
      </form>

      {/* Boutons Catégories rapides */}
      <div className="flex items-center justify-center gap-3 lg:gap-6 my-6 overflow-x-auto pb-2">
        {categories.map((cat, i) => {
          const IconComponent = cat.icon;
          const isActive = selectedCategory === cat.value;
          return (
            <button 
              key={i} 
              onClick={() => handleCategoryClick(cat.value)}
              className={`flex flex-col items-center gap-1.5 min-w-[65px] p-2.5 rounded-2xl transition cursor-pointer ${
                isActive ? 'bg-emerald-700 text-white shadow-xs' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100'
              }`}
            >
              <IconComponent className="w-4 h-4" />
              <span className="text-[11px] font-medium">{cat.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// 3. Section principale : Destinations & Auberges
const ContentSection = ({ destinations, auberges, loading }) => {
  const navigate = useNavigate();

  const handleReservationClick = () => {
    navigate('/login');
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://images.unsplash.com/photo-1546484475-7f7bd55792da?auto=format&fit=crop&w=800&q=80';
    return imagePath.startsWith('http') ? imagePath : `http://127.0.0.1:8000/storage/${imagePath}`;
  };

  return (
    <div className="px-6 lg:px-12 my-8 max-w-7xl mx-auto space-y-12">
      
      {/* DESTINATIONS */}
      <section id="destinations">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-extrabold text-emerald-950 flex items-center gap-2">
            <span className="text-emerald-600">|</span> Destinations à découvrir
          </h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <Loader className="w-7 h-7 text-emerald-700 animate-spin" />
          </div>
        ) : destinations.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {destinations.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-xs border border-emerald-100 transition group">
                <div className="relative h-40 bg-gray-100">
                  <img 
                    src={getImageUrl(item.image)} 
                    alt={item.nom_destination || item.nom} 
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300" 
                  />
                  {item.categorie?.nom && (
                    <span className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-xs text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                      {item.categorie.nom}
                    </span>
                  )}
                </div>
                <div className="p-4 space-y-2">
                  <h3 className="font-bold text-gray-900 text-xs truncate">{item.nom_destination || item.nom}</h3>
                  <p className="text-[11px] text-gray-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    {item.ville || 'Béni Mellal'}, {item.province || 'Azilal'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-xs text-gray-500 bg-white rounded-2xl border border-gray-100">
            Aucune destination trouvée.
          </div>
        )}
      </section>

      {/* AUBERGES */}
      <section id="auberges">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-extrabold text-emerald-950 flex items-center gap-2">
            <span className="text-emerald-600">|</span> Auberges & Hébergements partenaires
          </h2>
        </div>

        {auberges.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {auberges.map((auberge) => (
              <div key={auberge.id} className="bg-white rounded-2xl overflow-hidden shadow-xs border border-emerald-100 transition group flex flex-col justify-between">
                <div>
                  <div className="relative h-40 bg-gray-100">
                    <img 
                      src={getImageUrl(auberge.image)} 
                      alt={auberge.nom_auberge || auberge.nom} 
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300" 
                    />
                    <span className="absolute top-2.5 right-2.5 bg-emerald-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                      <Bed className="w-3 h-3" /> Auberge
                    </span>
                  </div>
                  <div className="p-4 space-y-1.5">
                    <h3 className="font-bold text-gray-900 text-xs truncate">{auberge.nom_auberge || auberge.nom}</h3>
                    <p className="text-[11px] text-gray-500 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                      {auberge.adresse || 'Région Béni Mellal-Khénifra'}
                    </p>
                    {auberge.prix_nuit && (
                      <p className="text-xs font-extrabold text-emerald-700 pt-1">
                        {auberge.prix_nuit} MAD <span className="text-[10px] font-normal text-gray-500">/ nuit</span>
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="p-4 pt-0">
                  <button 
                    onClick={handleReservationClick}
                    className="w-full bg-emerald-50 hover:bg-emerald-700 hover:text-white text-emerald-800 text-xs font-semibold py-2 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Calendar className="w-3.5 h-3.5" /> Réserver (Connexion requise)
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-xs text-gray-500 bg-white rounded-2xl border border-gray-100">
            Aucune auberge disponible pour le moment.
          </div>
        )}
      </section>

    </div>
  );
};

// 4. Page Principale (Dashboard Visiteur)
const Dashboard = () => {
  const [destinations, setDestinations] = useState([]);
  const [auberges, setAuberges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');

  const fetchData = async (filters = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.ville) params.append('ville', filters.ville);
      if (filters.category) params.append('category', filters.category);

      const responseDest = await fetch(`${API_BASE_URL}/destinations/recherch?${params.toString()}`, {
        headers: { 'Accept': 'application/json' }
      });
      
      if (responseDest.ok) {
        const dataDest = await responseDest.json();
        let list = [];
        if (Array.isArray(dataDest)) {
          list = dataDest;
        } else if (Array.isArray(dataDest.destinations)) {
          list = dataDest.destinations;
        } else if (Array.isArray(dataDest.data)) {
          list = dataDest.data;
        }
        setDestinations(list);
      }

      const responseAub = await fetch(`${API_BASE_URL}/auberges`, {
        headers: { 'Accept': 'application/json' }
      });
      if (responseAub.ok) {
        const dataAub = await responseAub.json();
        const aubList = dataAub.auberges || dataAub.data || dataAub;
        setAuberges(Array.isArray(aubList) ? aubList : []);
      }

    } catch (error) {
      console.error("Erreur de connexion API:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-gray-800">
      <Navbar />
      <HeroSection 
        onSearch={fetchData} 
        selectedCategory={selectedCategory} 
        setSelectedCategory={setSelectedCategory} 
      />
      <ContentSection destinations={destinations} auberges={auberges} loading={loading} />
    </div>
  );
};

export default Dashboard;