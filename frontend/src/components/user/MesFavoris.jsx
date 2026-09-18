import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Heart, MapPin, Compass } from 'lucide-react';
import FavoriteButton from './FavoriteButton'; 

const API_BASE_URL = 'http://127.0.0.1:8000/api';

export default function MesFavoris() {
  const [favoris, setFavoris] = useState([]);
  const [loading, setLoading] = useState(true);

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
      
      // على حسب الهيكلة لي كترجع من الـ API (واش array مباشرة ولا داخل data)
      const data = response.data.favorites || response.data.data || response.data;
      setFavoris(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erreur chargement favoris:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromList = (destinationId) => {
    // إزالة الوجهة من القائمة مباشرة في الواجهة ملي كيتعاود الضغط على الزر
    setFavoris(favoris.filter(item => (item.destination?.id || item.id) !== destinationId));
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://images.unsplash.com/photo-1546484475-7f7bd55792da?auto=format&fit=crop&w=800&q=80';
    return imagePath.startsWith('http') ? imagePath : `http://127.0.0.1:8000/storage/${imagePath}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-emerald-700 text-xs font-bold">
        Chargement de vos favoris...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
          Mes Destinations Favorites ❤️
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">Retrouvez tous les endroits que vous avez enregistrés</p>
      </div>

      {favoris.length === 0 ? (
        <div className="bg-white p-10 rounded-3xl border border-emerald-100 text-center space-y-3 shadow-xs">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <Heart className="w-6 h-6" />
          </div>
          <p className="text-xs text-slate-600 font-medium">Vous n'avez encore ajouté aucune destination à vos favoris.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoris.map((fav) => {
            // التعامل مع العلاقة واش كترجع Destination مباشرة ولا عبر object
            const dest = fav.destination || fav;
            return (
              <div 
                key={fav.id || dest.id}
                className="bg-white rounded-2xl overflow-hidden border border-emerald-100 shadow-xs hover:border-emerald-300 transition group"
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
  );
}