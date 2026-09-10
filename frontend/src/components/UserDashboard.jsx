
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, MapPin, ChevronDown, Heart, User, ArrowRight, Star,
  Compass, Trees, Building2, Landmark, Utensils, Users, Sparkles,
  Loader, LogOut, Bookmark
} from 'lucide-react';

const Navbar = ({ user, onLogout }) => (
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
      <a href="#decouvrir" className="hover:text-emerald-700 transition">Mes Favoris</a>
      <a href="#activites" className="hover:text-emerald-700 transition">Mes Réservations</a>
    </div>

    {/* User Profile Section */}
    <div className="flex items-center gap-4">
      <button className="p-2 text-gray-600 hover:text-emerald-700 transition relative">
        <Heart className="w-5 h-5" />
      </button>

      {user ? (
        <div className="flex items-center gap-3 bg-emerald-50 pl-3 pr-2 py-1.5 rounded-xl border border-emerald-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs font-bold">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <span className="text-xs font-bold text-emerald-950 max-w-[100px] truncate">
              {user.name || user.email}
            </span>
          </div>
          
          {/* Déconnexion Button */}
          <button 
            onClick={onLogout}
            title="Se déconnecter"
            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-white rounded-lg transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <Link to="/login" className="bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-sm px-5 py-2.5 rounded-lg transition shadow-sm">
          Se connecter
        </Link>
      )}
    </div>
  </nav>
);

// 2. Dashboard Component 
const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  
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

///Backend API
  const fetchDestinations = async (filters = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.ville) params.append('ville', filters.ville);
      if (filters.category) params.append('category', filters.category);

      const token = localStorage.getItem('token');
      const response = await fetch(`http://127.0.0.1:8000/api/destination/recerch?${params.toString()}`, {
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
    <div className="bg-slate-50 min-h-screen font-sans text-gray-800">
      <Navbar user={user} onLogout={handleLogout} />

      {/* Welcome Banner User */}
      <div className="max-w-7xl mx-auto px-6 pt-6">
        <div className="bg-gradient-to-r from-emerald-900 to-emerald-700 text-white p-6 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              Bonjour, {user?.name || 'Voyageur'} ! 👋
            </h1>
            <p className="text-emerald-100 text-xs mt-1">
              Prêt pour votre prochaine destination dans la région Béni Mellal-Khénifra ?
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
      </div>
    </div>
  );
};

export default UserDashboard;