import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Heart, MapPin, ArrowLeft, Compass } from 'lucide-react';
import FavoriteButton from './FavoriteButton'; 

const API_BASE_URL = 'http://127.0.0.1:8000/api';

export default function MesFavoris() {
  const [favoris, setFavoris] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFavoris();
  }, []);

  const fetchFavoris = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/favorites`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const data = response.data.favorites || response.data.data || response.data;
      setFavoris(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erreur chargement favoris:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromList = (destinationId) => {
    setFavoris(favoris.filter(item => (item.destination?.id || item.id) !== destinationId));
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://images.unsplash.com/photo-1546484475-7f7bd55792da?auto=format&fit=crop&w=800&q=80';
    return imagePath.startsWith('http') ? imagePath : `http://127.0.0.1:8000/storage/${imagePath}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <p className="text-xs font-medium text-white bg-emerald-800 px-5 py-2.5 rounded-xl shadow-md">
          Chargement de vos favoris...
        </p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen py-10 px-4 sm:px-6 lg:px-8 flex flex-col justify-center overflow-hidden">
      
      {/* Background Room / Hotel Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0 filter blur-[3px] scale-105"
        style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1920&auto=format&fit=crop')` 
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/80 via-emerald-950/70 to-slate-950/85 backdrop-blur-[2px]"></div>
      </div>

      {/* Main Content Box */}
      <div className="relative z-10 space-y-6 max-w-6xl mx-auto w-full bg-white/95 backdrop-blur-xl p-6 sm:p-8 rounded-3xl shadow-2xl border border-white/20">
        
        {/* Header with Title and Return Button */}
        <div className="flex flex-wrap justify-between items-center gap-4 pb-4 border-b border-gray-100 px-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-2xl shadow-inner">
              <Heart className="w-6 h-6 fill-emerald-700" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">
                Mes Destinations Favorites
              </h3>
              <p className="text-xs text-slate-500">Retrouvez tous les endroits que vous avez enregistrés</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1.5 rounded-xl shadow-xs">
              Total : {favoris.length}
            </span>

            {/* Bouton Retour au Dashboard Khdama */}
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-xs font-semibold text-white bg-emerald-700 px-4 py-2.5 rounded-xl hover:bg-emerald-800 transition shadow-sm cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour au Dashboard
            </button>
          </div>
        </div>

        {favoris.length === 0 ? (
          <div className="bg-slate-50/80 p-12 rounded-2xl border border-dashed border-slate-200 text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <Heart className="w-6 h-6" />
            </div>
            <p className="text-xs text-slate-600 font-medium">Vous n'avez encore ajouté aucune destination à vos favoris.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoris.map((fav) => {
              const dest = fav.destination || fav;
              return (
                <div 
                  key={fav.id || dest.id}
                  className="bg-white rounded-2xl overflow-hidden border border-emerald-100 shadow-xs hover:border-emerald-300 hover:shadow-md transition group"
                >
                  <div className="relative h-44 bg-slate-100">
                    <img 
                      src={getImageUrl(dest.image)} 
                      alt={dest.nom_destination || dest.nom} 
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <FavoriteButton 
                      destinationId={dest.id} 
                      initialIsFavorite={true}
                      onFavoriteChange={() => handleRemoveFromList(dest.id)}
                    />
                  </div>
                  <div className="p-4 space-y-2">
                    <h4 className="font-bold text-xs text-slate-900 truncate">
                      {dest.nom_destination || dest.nom}
                    </h4>
                    <div className="flex items-center gap-1 text-[11px] text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      <span>{dest.ville ? `${dest.ville}, ` : ''}{dest.province || 'Azilal'}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}