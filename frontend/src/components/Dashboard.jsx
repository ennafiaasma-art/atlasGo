import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, MapPin, ChevronDown, Heart, User, ArrowRight, Star,
  Compass, Trees, Building2, Landmark, Utensils, Users, Sparkles
} from 'lucide-react';

// 1. Navbar
const Navbar = () => (
  <nav className="flex items-center justify-between px-8 py-3 bg-white border-b border-gray-100 sticky top-0 z-50">
    {/* Logo */}
    <div className="flex items-center gap-3 cursor-pointer">
      <div className="w-10 h-10 rounded-lg bg-emerald-800 flex items-center justify-center text-white font-bold text-xl shadow-sm">
        🌲
      </div>
      <div className="flex flex-col leading-tight">
        <span className="font-extrabold text-lg text-emerald-950 tracking-tight">Béni Mellal</span>
        <span className="font-semibold text-sm text-emerald-600">Khénifra</span>
      </div>
    </div>

    {/* Menu */}
    <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
      <a href="#accueil" className="text-emerald-700 font-bold border-b-2 border-emerald-700 pb-1">Accueil</a>
      <a href="#decouvrir" className="hover:text-emerald-700 transition">Découvrir</a>
      <a href="#activites" className="hover:text-emerald-700 transition">Activités</a>
      <a href="#hebergements" className="hover:text-emerald-700 transition">Hébergements</a>
      <a href="#evenements" className="hover:text-emerald-700 transition">Événements</a>
      <a href="#blog" className="hover:text-emerald-700 transition">Blog</a>
      <a href="#propos" className="hover:text-emerald-700 transition">À propos</a>
    </div>

    {/* Actions */}
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

// 2. Hero + Search + Categories
const HeroSection = () => {
  const categories = [
    { label: "Tous", icon: Compass, active: true },
    { label: "Nature", icon: Trees },
    { label: "Aventure", icon: Compass },
    { label: "Culture", icon: Landmark },
    { label: "Patrimoine", icon: Building2 },
    { label: "Bien-être", icon: Sparkles },
    { label: "Gastronomie", icon: Utensils },
    { label: "Famille", icon: Users },
  ];

  return (
    <div className="relative px-6 lg:px-12 pt-4">
      {/* Hero Banner */}
      <div className="relative h-[420px] rounded-3xl overflow-hidden shadow-lg bg-cover bg-center flex items-center px-8 lg:px-16 text-white"
        style={{ backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.6), rgba(0,0,0,0.2)), url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200')` }}>
        <div className="max-w-xl z-10">
          <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight mb-4">
            Découvrez la beauté de <span className="text-emerald-400">Béni Mellal-Khénifra</span>
          </h1>
          <p className="text-gray-200 text-base mb-6">
            Explorez des paysages exceptionnels, un patrimoine riche et des expériences authentiques.
          </p>
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 py-3 rounded-xl flex items-center gap-2 transition shadow-md">
            Explorer maintenant <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Floating Info Cards */}
        <div className="hidden xl:flex flex-col gap-3 absolute right-12 top-12 z-10">
          <div className="bg-white/90 backdrop-blur-md text-gray-800 p-3 px-4 rounded-xl shadow-sm text-sm border border-white/20">
            <p className="font-bold">Cascades d'Ouzoud</p>
            <p className="text-xs text-gray-500">Province d'Azilal</p>
          </div>
          <div className="bg-white/90 backdrop-blur-md text-gray-800 p-3 px-4 rounded-xl shadow-sm text-sm border border-white/20">
            <p className="font-bold">Altitude</p>
            <p className="text-xs text-gray-500">1 060 m</p>
          </div>
          <div className="bg-white/90 backdrop-blur-md text-gray-800 p-3 px-4 rounded-xl shadow-sm text-sm border border-white/20">
            <p className="font-bold">Meilleure période</p>
            <p className="text-xs text-gray-500">Mars - Juin</p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative -mt-10 max-w-5xl mx-auto bg-white p-4 lg:p-6 rounded-2xl shadow-xl border border-gray-100 z-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">Que cherchez-vous ?</label>
            <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2.5 bg-gray-50 focus-within:bg-white focus-within:border-emerald-600 transition">
              <input type="text" placeholder="Ex : Cascades, lacs..." className="w-full text-sm bg-transparent outline-none text-gray-700" />
              <Search className="w-4 h-4 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">Où ?</label>
            <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2.5 bg-gray-50 focus-within:bg-white focus-within:border-emerald-600 transition">
              <input type="text" placeholder="Ville, province..." className="w-full text-sm bg-transparent outline-none text-gray-700" />
              <MapPin className="w-4 h-4 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">Catégorie</label>
            <div className="flex items-center justify-between border border-gray-200 rounded-xl px-3 py-2.5 bg-gray-50 focus-within:bg-white focus-within:border-emerald-600 transition">
              <select className="w-full text-sm bg-transparent outline-none text-gray-700 appearance-none cursor-pointer">
                <option>Toutes les catégories</option>
                <option>Nature</option>
                <option>Aventure</option>
              </select>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>
          </div>

          <button className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-2.5 px-6 rounded-xl transition shadow-md">
            Rechercher
          </button>
        </div>
      </div>

      {/* Filter Categories */}
      <div className="flex items-center justify-center gap-4 lg:gap-8 my-8 overflow-x-auto pb-2">
        {categories.map((cat, i) => {
          const IconComponent = cat.icon;
          return (
            <button key={i} className={`flex flex-col items-center gap-2 min-w-[70px] p-3 rounded-2xl transition ${
              cat.active ? 'bg-emerald-700 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-100'
            }`}>
              <IconComponent className="w-5 h-5" />
              <span className="text-xs font-medium">{cat.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// 3. Destinations
const PopularDestinations = () => {
  const list = [
    { title: "Cascades d'Ouzoud", prov: "Province d'Azilal", rating: "4.8", img: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400" },
    { title: "Lac Bin El Ouidane", prov: "Province d'Azilal", rating: "4.6", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400" },
    { title: "Aïn Asserdoun", prov: "Province de Khénifra", rating: "4.7", img: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400" },
    { title: "Géoparc M'Goun", prov: "Province d'Azilal", rating: "4.9", img: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400" },
    { title: "Grotte d'Ifri N'Ammar", prov: "Province de Khénifra", rating: "4.5", img: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400" },
  ];

  return (
    <section className="px-6 lg:px-12 my-10 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-extrabold text-emerald-950 flex items-center gap-2">
          <span className="text-emerald-600">|</span> Destinations populaires
        </h2>
        <a href="#all" className="text-sm font-semibold text-emerald-700 hover:underline flex items-center gap-1">
          Voir tout <ArrowRight className="w-4 h-4" />
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
        {list.map((item, index) => (
          <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-gray-100 transition group cursor-pointer">
            <div className="relative h-36 overflow-hidden">
              <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
              <button className="absolute top-2 right-2 p-1.5 bg-white/80 rounded-full text-gray-600 hover:text-red-500 transition">
                <Heart className="w-4 h-4" />
              </button>
            </div>
            <div className="p-3">
              <h3 className="font-bold text-gray-800 text-sm truncate">{item.title}</h3>
              <div className="flex justify-between items-center mt-2 text-xs">
                <span className="text-gray-500">{item.prov}</span>
                <span className="font-bold text-amber-500 flex items-center gap-0.5">
                  <Star className="w-3 h-3 fill-amber-400 border-none" /> {item.rating}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

// 4. Promo Banners
const PromoBanners = () => (
  <section className="px-6 lg:px-12 my-10 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
    <div className="bg-gradient-to-r from-emerald-800 to-emerald-600 rounded-3xl p-8 text-white flex flex-col justify-between relative overflow-hidden shadow-md">
      <div>
        <h3 className="text-2xl font-extrabold mb-2">Planifiez votre aventure</h3>
        <p className="text-emerald-100 text-sm mb-6 max-w-xs">Trouvez les meilleurs itinéraires et activités selon vos envies.</p>
      </div>
      <button className="bg-white text-emerald-800 font-bold px-5 py-2.5 rounded-xl text-sm w-max hover:bg-emerald-50 transition shadow">
        Créer mon itinéraire →
      </button>
    </div>

    <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-3xl p-8 text-white flex flex-col justify-between relative overflow-hidden shadow-md">
      <div>
        <h3 className="text-2xl font-extrabold mb-2">Vivez des expériences uniques</h3>
        <p className="text-amber-100 text-sm mb-6 max-w-xs">Activités, nature, culture et rencontres authentiques.</p>
      </div>
      <button className="bg-white text-amber-800 font-bold px-5 py-2.5 rounded-xl text-sm w-max hover:bg-amber-50 transition shadow">
        Découvrir les activités
      </button>
    </div>
  </section>
);

// 5. Footer
const Footer = () => (
  <footer className="bg-emerald-950 text-white mt-16 pt-12 pb-6 px-6 lg:px-12">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-emerald-900 text-sm">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center font-bold">🌲</div>
          <span className="font-extrabold text-lg">Béni Mellal Khénifra</span>
        </div>
        <p className="text-emerald-300 text-xs leading-relaxed">
          Votre guide pour découvrir les merveilles naturelles et culturelles de la région.
        </p>
      </div>

      <div>
        <h4 className="font-bold mb-3 text-emerald-400">Explorer</h4>
        <ul className="space-y-2 text-emerald-200 text-xs">
          <li><a href="#" className="hover:underline">Sites touristiques</a></li>
          <li><a href="#" className="hover:underline">Activités</a></li>
          <li><a href="#" className="hover:underline">Hébergements</a></li>
        </ul>
      </div>

      <div>
        <h4 className="font-bold mb-3 text-emerald-400">Aide</h4>
        <ul className="space-y-2 text-emerald-200 text-xs">
          <li><a href="#" className="hover:underline">FAQ</a></li>
          <li><a href="#" className="hover:underline">Contact</a></li>
          <li><a href="#" className="hover:underline">Politique de confidentialité</a></li>
        </ul>
      </div>

      <div>
        <h4 className="font-bold mb-3 text-emerald-400">Newsletter</h4>
        <div className="flex flex-col gap-2">
          <input type="email" placeholder="Votre email" className="bg-emerald-900 border border-emerald-800 rounded-lg px-3 py-2 text-xs text-white outline-none" />
          <button className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded-lg text-xs transition">S'abonner</button>
        </div>
      </div>
    </div>
    <p className="text-center text-xs text-emerald-500 mt-6">© 2026 Béni Mellal-Khénifra Tourisme. Tous droits réservés.</p>
  </footer>
);

// Component الرئيسي
const Dashboard = () => {
  return (
    <div className="bg-slate-50 min-h-screen font-sans text-gray-800">
      <Navbar />
      <HeroSection />
      <PopularDestinations />
      <PromoBanners />
      <Footer />
    </div>
  );
};

export default Dashboard;