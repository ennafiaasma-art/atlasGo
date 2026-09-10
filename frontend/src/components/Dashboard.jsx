import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, MapPin, ChevronDown, Heart, User, ArrowRight, Star,
  Compass, Trees, Building2, Landmark, Utensils, Users, Sparkles,
  ChevronLeft, Loader
} from 'lucide-react';

// 1. Navbar
const Navbar = () => (
  <nav className="flex items-center justify-between px-8 py-3 bg-white border-b border-gray-100 sticky top-0 z-50">
    <div className="flex items-center gap-3 cursor-pointer">
      <div className="w-10 h-10 rounded-lg bg-emerald-800 flex items-center justify-center text-white font-bold text-xl shadow-sm">
        🌲
      </div>
      <div className="flex flex-col leading-tight">
        <span className="font-extrabold text-lg text-emerald-950 tracking-tight">Béni Mellal</span>
        <span className="font-semibold text-sm text-emerald-600">Khénifra</span>
      </div>
    </div>

    <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
      <a href="#accueil" className="text-emerald-700 font-bold border-b-2 border-emerald-700 pb-1">Accueil</a>
      <a href="#decouvrir" className="hover:text-emerald-700 transition">Découvrir</a>
      <a href="#activites" className="hover:text-emerald-700 transition">Activités</a>
      <a href="#hebergements" className="hover:text-emerald-700 transition">Hébergements</a>
      <a href="#evenements" className="hover:text-emerald-700 transition">Événements</a>
      <a href="#blog" className="hover:text-emerald-700 transition">Blog</a>
      <a href="#propos" className="hover:text-emerald-700 transition">À propos</a>
    </div>

    <div className="flex items-center gap-4">
      <button className="p-2 text-gray-600 hover:text-emerald-700 transition">
        <Heart className="w-5 h-5" />
      </button>
      <button className="p-2 text-gray-600 hover:text-emerald-700 transition">
        <User className="w-5 h-5" />
      </button>
      <Link to="/login" className="bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-sm px-5 py-2.5 rounded-lg transition shadow-sm">
        Se connecter
      </Link>
    </div>
  </nav>
);

const HeroSection = ({ onSearch, selectedCategory, setSelectedCategory }) => {
  const slides = [
    {
      img: '/images/bm.jpg',
      info1: "Aïn Asserdoun",
      info1Sub: "Béni Mellal",
      info2: "Source d'eau",
      info2Sub: "Nature & Jardin",
      info3: "Meilleure période",
      info3Sub: "Toute l'année"
    },
    {
      img: '/images/bin.jpg',
      info1: "Lac Bin El Ouidane",
      info1Sub: "Province d'Azilal",
      info2: "Activités",
      info2Sub: "Kayak & Nautisme",
      info3: "Meilleure période",
      info3Sub: "Mai - Septembre"
    },
    {
      img: '/images/oh.jpg',
      info1: "Cascades d'Ouzoud",
      info1Sub: "Province d'Azilal",
      info2: "Hauteur",
      info2Sub: "110 mètres",
      info3: "Meilleure période",
      info3Sub: "Mars - Juin"
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
    { label: "Bien-être", icon: Sparkles, value: "Bien-être" },
    { label: "Gastronomie", icon: Utensils, value: "Gastronomie" },
    { label: "Famille", icon: Users, value: "Famille" },
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
    <div className="relative px-6 lg:px-12 pt-4">
      {/* Banner */}
      <div 
        className="relative h-[420px] rounded-3xl overflow-hidden shadow-lg bg-cover bg-center transition-all duration-700 ease-in-out flex items-center px-8 lg:px-16 text-white"
        style={{ 
          backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.65), rgba(0,0,0,0.25)), url('${slides[currentIndex].img}')` 
        }}
      >
        <div className="max-w-xl z-10">
          <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight mb-4">
            Découvrez la beauté de <span className="text-emerald-400">Béni Mellal-Khénifra</span>
          </h1>
          <p className="text-gray-200 text-base mb-6">
            Explorez des paysages exceptionnels, un patrimoine riche et des expériences authentiques.
          </p>
        </div>
      </div>

      {/* Search Bar Form */}
      <form onSubmit={handleSearchSubmit} className="relative -mt-10 max-w-5xl mx-auto bg-white p-4 lg:p-6 rounded-2xl shadow-xl border border-gray-100 z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">Où ? (Ville)</label>
            <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2.5 bg-gray-50 focus-within:bg-white focus-within:border-emerald-600 transition">
              <input 
                type="text" 
                placeholder="Ex: Béni Mellal, Azilal..." 
                value={villeInput}
                onChange={(e) => setVilleInput(e.target.value)}
                className="w-full text-sm bg-transparent outline-none text-gray-700" 
              />
              <MapPin className="w-4 h-4 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">Catégorie</label>
            <div className="flex items-center justify-between border border-gray-200 rounded-xl px-3 py-2.5 bg-gray-50 focus-within:bg-white focus-within:border-emerald-600 transition">
              <select 
                value={categoryInput}
                onChange={(e) => setCategoryInput(e.target.value)}
                className="w-full text-sm bg-transparent outline-none text-gray-700 appearance-none cursor-pointer"
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

          <button type="submit" className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-2.5 px-6 rounded-xl transition shadow-md flex items-center justify-center gap-2 cursor-pointer">
            <Search className="w-4 h-4" />
            Rechercher
          </button>
        </div>
      </form>

      {/* Filter Categories */}
      <div className="flex items-center justify-center gap-4 lg:gap-8 my-8 overflow-x-auto pb-2">
        {categories.map((cat, i) => {
          const IconComponent = cat.icon;
          const isActive = selectedCategory === cat.value;
          return (
            <button 
              key={i} 
              onClick={() => handleCategoryClick(cat.value)}
              className={`flex flex-col items-center gap-2 min-w-[70px] p-3 rounded-2xl transition cursor-pointer ${
                isActive ? 'bg-emerald-700 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-100'
              }`}
            >
              <IconComponent className="w-5 h-5" />
              <span className="text-xs font-medium">{cat.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// 3. Destinations Dynamic List
const PopularDestinations = ({ destinations, loading }) => {
  return (
    <section className="px-6 lg:px-12 my-10 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-extrabold text-emerald-950 flex items-center gap-2">
          <span className="text-emerald-600">|</span> Destinations disponibles
        </h2>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader className="w-8 h-8 text-emerald-700 animate-spin" />
        </div>
      ) : destinations.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {destinations.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-gray-100 transition group cursor-pointer">
              <div className="relative h-40 overflow-hidden bg-gray-100">
                <img 
                  src={item.image || item.img || "/images/bm.jpg"} 
                  alt={item.title || item.nom} 
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300" 
                />
                <button className="absolute top-2 right-2 p-1.5 bg-white/80 rounded-full text-gray-600 hover:text-red-500 transition">
                  <Heart className="w-4 h-4" />
                </button>
              </div>
              <div className="p-4">
                <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md">
                  {item.category || 'Destination'}
                </span>
                <h3 className="font-bold text-gray-800 text-base mt-2 truncate">{item.title || item.nom || item.ville}</h3>
                <div className="flex justify-between items-center mt-3 text-xs">
                  <span className="text-gray-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    {item.ville}
                  </span>
                  <span className="font-bold text-amber-500 flex items-center gap-0.5">
                    <Star className="w-3 h-3 fill-amber-400 border-none" /> {item.rating || '4.5'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500 bg-white rounded-2xl border border-gray-100">
          Aucune destination ne correspond à votre recherche.
        </div>
      )}
    </section>
  );
};

// 4. Component  orincipal Fetch
const Dashboard = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');

  const fetchDestinations = async (filters = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.ville) params.append('ville', filters.ville);
      if (filters.category) params.append('category', filters.category);

      const response = await fetch(`http://127.0.0.1:8000/api/destination/recerch?${params.toString()}`, {
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        const data = await response.json();
        setDestinations(data);
      }
    } catch (error) {
      console.error("Erreur de connexion API:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-gray-800">
      <Navbar />
      <HeroSection 
        onSearch={fetchDestinations} 
        selectedCategory={selectedCategory} 
        setSelectedCategory={setSelectedCategory} 
      />
      <PopularDestinations destinations={destinations} loading={loading} />
    </div>
  );
};

export default Dashboard;