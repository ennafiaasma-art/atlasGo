import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, MapPin, Heart, Star, Bell, ChevronRight, LogOut, 
  LayoutDashboard, Compass, Activity, Hotel, Calendar, User, 
  Settings, Mountain, Tent, Sun, Users, ArrowUpRight
} from 'lucide-react';

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (!token) {
      navigate('/login');
    } else if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const fetchDestinations = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://127.0.0.1:8000/api/destination/recerch', {
        headers: { 
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}` 
        }
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
    <div className="flex min-h-screen bg-[#F4F7F6] font-sans text-gray-800">
      
      {/* 1. SIDEBAR */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between p-4 sticky top-0 h-screen shrink-0">
        <div>
          {/* Logo */}
          <div className="flex items-center gap-3 px-3 py-2 mb-8">
            <div className="w-9 h-9 rounded-xl bg-emerald-800 flex items-center justify-center text-white font-black text-lg shadow-md">
              🌲
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-extrabold text-xl text-emerald-950 tracking-tight">AtlasGo</span>
              <span className="text-[10px] text-gray-400 font-medium">Explorez • Découvrez • Vivez</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition ${activeTab === 'dashboard' ? 'bg-emerald-800 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Tableau de bord
            </button>

            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-100 transition">
              <Compass className="w-4 h-4" />
              Destinations
            </button>

            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-100 transition">
              <Activity className="w-4 h-4" />
              Activités
            </button>

            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-100 transition">
              <Hotel className="w-4 h-4" />
              Hébergements
            </button>

            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-100 transition">
              <Calendar className="w-4 h-4" />
              Mes réservations
            </button>

            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-100 transition">
              <Heart className="w-4 h-4" />
              Favoris
            </button>

            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-100 transition">
              <User className="w-4 h-4" />
              Mon profil
            </button>

            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-100 transition">
              <Settings className="w-4 h-4" />
              Paramètres
            </button>
          </nav>
        </div>

        {/* Déconnexion */}
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition"
        >
          <LogOut className="w-4 h-4" />
          Déconnexion
        </button>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* 2. TOPBAR HEADER */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="relative w-96">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Rechercher une destination, une activité, un hébergement..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-xs outline-none focus:border-emerald-700 transition"
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-500 hover:text-emerald-800 transition">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 bg-red-500 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full">3</span>
            </button>

            <div className="flex items-center gap-3 border-l border-gray-200 pl-4">
              <img 
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop" 
                alt="Profile" 
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-gray-900 leading-tight">
                  {user?.name || 'Asma Ennafia'}
                </span>
                <span className="text-[10px] text-gray-400">Client</span>
              </div>
            </div>
          </div>
        </header>

        {/* 3. DASHBOARD BODY */}
        <main className="p-8 space-y-8 overflow-y-auto">
          
          {/* Welcome Title */}
          <div>
            <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
              Bonjour, {user?.name || 'Asma Ennafia'} 👋
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Prête pour de nouvelles aventures au cœur de Béni Mellal-Khénifra ?
            </p>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-800 text-white flex items-center justify-center shrink-0">
                <Mountain className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-semibold uppercase">Destinations visitées</p>
                <p className="text-xl font-bold text-gray-900">3</p>
                <a href="#" className="text-[10px] font-semibold text-emerald-800 hover:underline flex items-center gap-0.5 mt-0.5">
                  Voir toutes <ChevronRight className="w-3 h-3" />
                </a>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500 text-white flex items-center justify-center shrink-0">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-semibold uppercase">Réservations</p>
                <p className="text-xl font-bold text-gray-900">2</p>
                <a href="#" className="text-[10px] font-semibold text-blue-600 hover:underline flex items-center gap-0.5 mt-0.5">
                  Voir mes réservations <ChevronRight className="w-3 h-3" />
                </a>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-semibold uppercase">Activités réalisées</p>
                <p className="text-xl font-bold text-gray-900">2</p>
                <a href="#" className="text-[10px] font-semibold text-amber-600 hover:underline flex items-center gap-0.5 mt-0.5">
                  Voir mes activités <ChevronRight className="w-3 h-3" />
                </a>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500 text-white flex items-center justify-center shrink-0">
                <Heart className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-semibold uppercase">Favoris</p>
                <p className="text-xl font-bold text-gray-900">5</p>
                <a href="#" className="text-[10px] font-semibold text-purple-600 hover:underline flex items-center gap-0.5 mt-0.5">
                  Voir mes favoris <ChevronRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Main Grid: Left (Cards) & Right (Sidebar Widgets) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* LEFT COLUMN (8 Cols) */}
            <div className="lg:col-span-8 space-y-8">
              
              {/* SECTION 1: Destinations populaires */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-bold text-gray-900">Destinations populaires</h2>
                  <a href="#" className="text-xs font-semibold text-emerald-800 hover:underline flex items-center gap-1">
                    Voir tout <ChevronRight className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[
                    { name: 'Cascade d\'Ouzoud', province: 'Province d\'Azilal', rating: '4.8', img: 'https://images.unsplash.com/photo-1546484475-7f7bd55792da?q=80&w=400&auto=format&fit=crop' },
                    { name: 'Lac Bin El Ouidane', province: 'Province d\'Azilal', rating: '4.6', img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=400&auto=format&fit=crop' },
                    { name: 'Aïn Asserdoun', province: 'Province de Khénifra', rating: '4.7', img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=400&auto=format&fit=crop' },
                    { name: 'Géoparc M\'Goun', province: 'Province d\'Azilal', rating: '4.9', img: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=400&auto=format&fit=crop' },
                  ].map((dest, index) => (
                    <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group">
                      <div className="relative h-28">
                        <img src={dest.img} alt={dest.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                        <button className="absolute top-2 right-2 p-1.5 bg-white/70 backdrop-blur-md rounded-full text-gray-700 hover:text-red-500 transition">
                          <Heart className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="p-3">
                        <h3 className="font-bold text-xs text-gray-900 truncate">{dest.name}</h3>
                        <p className="text-[10px] text-gray-400 mt-0.5">{dest.province}</p>
                        <div className="flex items-center gap-1 mt-2 text-[10px] font-bold text-gray-700">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span>{dest.rating}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 2: Activités incontournables */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-bold text-gray-900">Activités incontournables</h2>
                  <a href="#" className="text-xs font-semibold text-emerald-800 hover:underline flex items-center gap-1">
                    Voir tout <ChevronRight className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[
                    { title: 'Randonnée à Ouzoud', loc: 'Azilal', tag: 'Randonnée', price: '150 DH', rating: '4.8', img: 'https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=400&auto=format&fit=crop' },
                    { title: 'Kayak sur le Lac Bin El Ouidane', loc: 'Béni Mellal', tag: 'Baignade', price: '200 DH', rating: '4.6', img: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=400&auto=format&fit=crop' },
                    { title: 'Visite de la Kasbah d\'Azilal', loc: 'Azilal', tag: 'Culture', price: '100 DH', rating: '4.5', img: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=400&auto=format&fit=crop' },
                    { title: 'Trek Djebel M\'Goun', loc: 'Tazenakht', tag: 'Randonnée', price: '180 DH', rating: '4.9', img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=400&auto=format&fit=crop' },
                  ].map((act, index) => (
                    <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group">
                      <div className="relative h-28">
                        <img src={act.img} alt={act.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                        <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-emerald-800 text-white text-[9px] font-bold rounded-md">
                          {act.tag}
                        </span>
                      </div>
                      <div className="p-3">
                        <h3 className="font-bold text-xs text-gray-900 truncate">{act.title}</h3>
                        <p className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {act.loc}
                        </p>
                        <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
                          <div className="flex items-center gap-1 text-[10px] font-bold text-gray-700">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            <span>{act.rating}</span>
                          </div>
                          <span className="text-[10px] font-extrabold text-emerald-800">À partir de {act.price}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 3: Hébergements recommandés */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-bold text-gray-900">Hébergements recommandés</h2>
                  <a href="#" className="text-xs font-semibold text-emerald-800 hover:underline flex items-center gap-1">
                    Voir tout <ChevronRight className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[
                    { name: 'Auberge Cascades', loc: 'Ouzoud', tag: 'Auberge', price: '300 DH', rating: '4.7', img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=400&auto=format&fit=crop' },
                    { name: 'Dar Atlas', loc: 'Béni Mellal', tag: 'Auberge', price: '250 DH', rating: '4.5', img: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=400&auto=format&fit=crop' },
                    { name: 'Auberge Tissili', loc: 'M\'Goun', tag: 'Auberge', price: '280 DH', rating: '4.6', img: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=400&auto=format&fit=crop' },
                    { name: 'Kasbah Aguelmous', loc: 'Azilal', tag: 'Auberge', price: '350 DH', rating: '4.8', img: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=400&auto=format&fit=crop' },
                  ].map((heb, index) => (
                    <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group">
                      <div className="relative h-28">
                        <img src={heb.img} alt={heb.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                        <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-emerald-800 text-white text-[9px] font-bold rounded-md">
                          {heb.tag}
                        </span>
                      </div>
                      <div className="p-3">
                        <h3 className="font-bold text-xs text-gray-900 truncate">{heb.name}</h3>
                        <p className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {heb.loc}
                        </p>
                        <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
                          <div className="flex items-center gap-1 text-[10px] font-bold text-gray-700">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            <span>{heb.rating}</span>
                          </div>
                          <span className="text-[10px] font-extrabold text-emerald-800">À partir de {heb.price}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN (4 Cols) */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Mes prochaines réservations */}
              <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-bold text-gray-900">Mes prochaines réservations</h2>
                  <a href="#" className="text-xs font-semibold text-emerald-800 hover:underline">Voir tout</a>
                </div>

                <div className="space-y-3">
                  {[
                    { name: 'Auberge Cascades', loc: 'Ouzoud', date: '24 – 26 Juin 2025', status: 'Confirmée', statusBg: 'bg-emerald-50 text-emerald-700', img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=150&auto=format&fit=crop' },
                    { name: 'Kayak sur le Lac Bin El Ouidane', loc: 'Béni Mellal', date: '12 Juil. 2025', status: 'Confirmée', statusBg: 'bg-emerald-50 text-emerald-700', img: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=150&auto=format&fit=crop' },
                    { name: 'Dar Atlas', loc: 'Béni Mellal', date: '05 – 07 Juillet 2025', status: 'En attente', statusBg: 'bg-blue-50 text-blue-700', img: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=150&auto=format&fit=crop' },
                  ].map((res, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-2xl transition cursor-pointer border border-gray-50">
                      <img src={res.img} alt={res.name} className="w-14 h-14 rounded-xl object-cover shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-gray-900 truncate">{res.name}</h4>
                        <p className="text-[10px] text-gray-400">{res.loc}</p>
                        <p className="text-[10px] font-semibold text-gray-600 mt-0.5">{res.date}</p>
                      </div>
                      <span className={`text-[9px] font-bold px-2 py-1 rounded-full shrink-0 ${res.statusBg}`}>
                        {res.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Promo Banner Card */}
              <div className="relative rounded-3xl overflow-hidden shadow-md text-white p-6 h-52 flex flex-col justify-end bg-gradient-to-t from-black/80 to-transparent">
                <img 
                  src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800&auto=format&fit=crop" 
                  alt="Banner" 
                  className="absolute inset-0 w-full h-full object-cover -z-10"
                />
                <h3 className="text-lg font-black leading-tight">Béni Mellal-Khénifra</h3>
                <p className="text-xs text-gray-200 mt-1 mb-4">Une région, mille découvertes</p>
                <button className="bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold py-2.5 px-4 rounded-xl w-fit flex items-center gap-2 transition shadow-lg">
                  Explorer maintenant <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Quick Categories Icons */}
              <div className="grid grid-cols-4 gap-2 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-center">
                <div className="flex flex-col items-center gap-1 cursor-pointer hover:text-emerald-800 transition">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
                    <Tent className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-gray-600">Nature</span>
                </div>

                <div className="flex flex-col items-center gap-1 cursor-pointer hover:text-emerald-800 transition">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
                    <Mountain className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-gray-600">Culture</span>
                </div>

                <div className="flex flex-col items-center gap-1 cursor-pointer hover:text-emerald-800 transition">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
                    <Activity className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-gray-600">Aventure</span>
                </div>

                <div className="flex flex-col items-center gap-1 cursor-pointer hover:text-emerald-800 transition">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
                    <Sun className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-gray-600">Détente</span>
                </div>
              </div>

            </div>

          </div>

        </main>
      </div>

    </div>
  );
};

export default UserDashboard;