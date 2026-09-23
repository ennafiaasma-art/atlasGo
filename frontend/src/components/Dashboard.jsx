import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, MapPin, ChevronDown, User, Star,
  Compass, Trees, Building2, Landmark, Utensils, Users, Sparkles,
  Loader, BedDouble
} from 'lucide-react';

// 1. Navbar
const Navbar = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <nav className="flex items-center justify-between px-8 py-3 bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        {/* Logo Officiel Région Béni Mellal-Khénifra SVG */}
        <div className="w-11 h-11 flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full text-emerald-800" fill="currentColor">
            <path d="M50 15 L85 80 L15 80 Z" fill="none" stroke="currentColor" strokeWidth="6" strokeLinejoin="round" />
            <path d="M50 35 L70 75 L30 75 Z" fill="none" stroke="currentColor" strokeWidth="3" opacity="0.4" />
            <path d="M15 80 Q 50 70 85 80" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
            <circle cx="35" cy="65" r="4" fill="#047857" />
            <circle cx="68" cy="68" r="3" fill="#047857" />
          </svg>
        </div>
        
        <div className="flex flex-col leading-tight">
          <span className="font-extrabold text-lg text-emerald-950 tracking-tight">Béni Mellal</span>
          <span className="font-semibold text-sm text-emerald-600">Khénifra</span>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
        <a href="#accueil" className="hover:text-emerald-700 transition">Accueil</a>
        <a href="#destinations" className="hover:text-emerald-700 transition">Destinations</a>
        <a href="#hebergements" className="hover:text-emerald-700 transition">Hébergements</a>
        <a href="#propos" className="hover:text-emerald-700 transition">À propos</a>
      </div>

      <div className="flex items-center gap-3">
        {token ? (
          <div className="flex items-center gap-3">
            <Link 
              to="/user/Profile" 
              className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-xs px-3 py-2 rounded-lg transition shadow-sm"
            >
              <User className="w-4 h-4" />
              <span>{user?.name || 'Mon Profil'}</span>
            </Link>
            <button 
              onClick={handleLogout}
              className="text-xs text-red-600 hover:text-red-800 font-medium px-2 py-1 transition cursor-pointer"
            >
              Déconnexion
            </button>
          </div>
        ) : (
          <Link to="/login" className="bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-sm px-3 py-2 rounded-lg transition shadow-sm">
            Se connecter
          </Link>
        )}
      </div>
    </nav>
  );
};

// 2. Hero Section
const HeroSection = ({ onSearch, selectedCategory, setSelectedCategory }) => {
  const slides = [
    { img: '/images/bm.jpg', info1: "Aïn Asserdoun", info1Sub: "Béni Mellal" },
    { img: '/images/bin.jpg', info1: "Lac Bin El Ouidane", info1Sub: "Province d'Azilal" },
    { img: '/images/oh.jpg', info1: "Cascades d'Ouzoud", info1Sub: "Province d'Azilal" }
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
    <div id="accueil" className="relative px-6 lg:px-12 pt-4">
      <div 
        className="relative rounded-3xl overflow-hidden shadow-lg bg-cover bg-center transition-all duration-700 ease-in-out flex items-center px-8 lg:px-16 text-white h-80"
        style={{ backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.65), rgba(0,0,0,0.25)), url('${slides[currentIndex].img}')` }}
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

      {/* Barre de recherche */}
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
                <option value="Bien-être">Bien-être</option>
                <option value="Gastronomie">Gastronomie</option>
                <option value="Famille">Famille</option>
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

      {/* Catégories filter buttons */}
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

// 3. Destinations Grid
const PopularDestinations = ({ destinations, loading }) => (
  <section id="destinations" className="px-6 lg:px-12 my-10 max-w-7xl mx-auto scroll-mt-20">
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
          <Link 
            to={`/destinations/${item.id}`} 
            key={item.id} 
            className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-gray-100 transition group cursor-pointer block relative"
          >
            <div className="relative h-40 overflow-hidden bg-gray-100">
              <img 
                src={item.image ? `http://127.0.0.1:8000/storage/${item.image}` : (item.img || "/images/bm.jpg")} 
                alt={item.title || item.nom} 
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300" 
              />
            </div>
            <div className="p-4">
              <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md">
                {item.category || item.categorie?.nom || 'Destination'}
              </span>
              <h3 className="font-bold text-gray-800 text-base mt-2 truncate">{item.title || item.nom || item.nom_destination}</h3>
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
          </Link>
        ))}
      </div>
    ) : (
      <div className="text-center py-12 text-gray-500 bg-white rounded-2xl border border-gray-100">
        Aucune destination trouvée.
      </div>
    )}
  </section>
);

// 4. Hébergements / Auberges Grid
const PopularAuberges = ({ auberges, loading }) => {
  const isConnected = !!localStorage.getItem('token');

  return (
    <section id="hebergements" className="px-6 lg:px-12 my-10 max-w-7xl mx-auto scroll-mt-20">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-extrabold text-emerald-950 flex items-center gap-2">
          <span className="text-emerald-600">|</span> Hébergements & Auberges recommandés
        </h2>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader className="w-8 h-8 text-emerald-700 animate-spin" />
        </div>
      ) : auberges.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {auberges.map((item) => (
            <div 
              key={item.id} 
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-gray-100 transition group cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="relative h-40 overflow-hidden bg-gray-100">
                  <img 
                    src={item.image ? `http://127.0.0.1:8000/storage/${item.image}` : (item.photo || "/images/bm.jpg")} 
                    alt={item.nom} 
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300" 
                  />
                  <span className="absolute top-2 left-2 px-2.5 py-1 bg-emerald-700/90 text-white text-[10px] font-bold rounded-lg flex items-center gap-1">
                    <BedDouble className="w-3 h-3" /> Auberge
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-800 text-base truncate">{item.nom}</h3>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-1">{item.description || "Séjour chaleureux au cœur de l'Atlas"}</p>
                  <div className="flex justify-between items-center mt-3 text-xs">
                    <span className="text-gray-500 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                      {item.ville || 'Atlas'}
                    </span>
                    <span className="font-extrabold text-emerald-700">
                      {item.prix ? `${item.prix} DH / nuit` : 'Prix sur demande'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="p-4 pt-0">
                {isConnected ? (
                  <Link 
                    to={`/auberges/${item.id}/reserver`} 
                    className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-2 rounded-xl text-xs transition duration-200 block text-center shadow-sm"
                  >
                    Réserver maintenant
                  </Link>
                ) : (
                  <Link 
                    to="/login" 
                    className="w-full bg-emerald-50 hover:bg-emerald-700 hover:text-white text-emerald-800 font-semibold py-2 rounded-xl text-xs transition duration-200 block text-center"
                  >
                    Se connecter pour réserver
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500 bg-white rounded-2xl border border-gray-100">
          Aucun hébergement ou auberge disponible pour le moment.
        </div>
      )}
    </section>
  );
};

// 5. Section À propos
const AboutSection = () => (
  <section id="propos" className="px-6 lg:px-12 my-16 max-w-7xl mx-auto scroll-mt-20">
    <div className="bg-emerald-700 rounded-3xl p-8 lg:p-12 shadow-sm border border-gray-100 text-center">
      <h2 className="text-2xl lg:text-3xl font-extrabold text-emerald-100 mb-4">À propos d'AtlasGo</h2>
      <p className="text-white leading-relaxed text-sm lg:text-base max-w-3xl mx-auto">
        AtlasGo est votre passerelle incontournable pour découvrir les trésors cachés de la région Béni Mellal-Khénifra. 
        Notre mission est de promouvoir le tourisme local, de valoriser le patrimoine culturel et naturel exceptionnel de l'Atlas, 
        et de faciliter vos réservations dans les meilleures auberges et hébergements de la région.
      </p>
    </div>
  </section>
);

// 6. Principal Dashboard Component
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

      let destUrl = `http://127.0.0.1:8000/api/destinations`;
      if (filters.ville || filters.category) {
        destUrl = `http://127.0.0.1:8000/api/destinations/recherch?${params.toString()}`;
      }

      const destResponse = await fetch(destUrl, {
        headers: { 'Accept': 'application/json' }
      });
      
      if (destResponse.ok) {
        const data = await destResponse.json();
        setDestinations(Array.isArray(data) ? data : data.data || data.destinations || []);
      }

      const aubResponse = await fetch(`http://127.0.0.1:8000/api/auberges`, {
        headers: { 'Accept': 'application/json' }
      });
      if (aubResponse.ok) {
        const aubData = await aubResponse.json();
        setAuberges(Array.isArray(aubData) ? aubData : aubData.data || aubData.auberges || []);
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
      
      {/* Destinations */}
      <PopularDestinations destinations={destinations} loading={loading} />

      {/* Hébergements */}
      <PopularAuberges auberges={auberges} loading={loading} />

      {/* À propos */}
      <AboutSection />
    </div>
  );
};

export default Dashboard;