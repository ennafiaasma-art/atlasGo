import React, { useEffect, useState } from 'react';
import { Heart, Compass, MapPin, User, ShieldCheck } from 'lucide-react';

export default function AdminFavoritesSection() {
  const [favoriteDestinations, setFavoriteDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8000/api/admin/destinations-favorites', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Accept': 'application/json'
      }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error("Erreur lors de la récupération des données.");
        }
        return res.json();
      })
      .then(data => {
        setFavoriteDestinations(data.data || data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erreur:", err);
        setError("Impossible de charger les favoris.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3 text-emerald-700 font-semibold text-sm">
          <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          Chargement des favoris en cours...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-rose-50 text-rose-600 p-4 rounded-2xl text-xs font-semibold border border-rose-100">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 space-y-6">
      {/* En-tête de la page */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-100 pb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
              <Heart className="w-5 h-5 fill-emerald-600 text-emerald-600" />
            </span>
            Gestion des Favoris (Par Destination)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Visualisez les destinations de l'Atlas enregistrées en favoris par les voyageurs inscrits.
          </p>
        </div>
        <div className="bg-emerald-50 text-emerald-800 px-4 py-2 rounded-2xl text-xs font-bold border border-emerald-200/60 flex items-center gap-2 w-fit">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Total Destinations: {favoriteDestinations.length}</span>
        </div>
      </div>

      {/* Liste des destinations favorites */}
      {favoriteDestinations.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-emerald-100 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <Heart className="w-6 h-6 text-emerald-400" />
          </div>
          <p className="text-sm font-semibold text-slate-700">Aucune destination en favoris</p>
          <p className="text-xs text-slate-400">Aucun voyageur n'a encore ajouté de destination à ses favoris.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {favoriteDestinations.map((dest) => (
            <div 
              key={dest.id} 
              className="bg-white rounded-3xl p-6 shadow-sm border border-emerald-100/80 hover:shadow-md transition space-y-5 flex flex-col justify-between"
            >
              {/* Infos Destination */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0 shadow-sm shadow-emerald-900/20">
                    <Compass className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-900 text-sm tracking-wide">{dest.nom}</h2>
                    <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {dest.ville} {dest.province ? `(${dest.province})` : ''}
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1.5 bg-rose-50 text-rose-600 text-xs font-bold rounded-xl flex items-center gap-1.5 shrink-0 border border-rose-100">
                  <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                  {dest.users?.length || 0} favoris
                </span>
              </div>

              {/* Description courte si disponible */}
              {dest.description && (
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {dest.description}
                </p>
              )}

              {/* Liste des utilisateurs intéressés */}
              <div className="space-y-2.5 pt-3 border-t border-slate-100">
                <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                  Voyageurs intéressés :
                </p>
                <div className="max-h-44 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                  {dest.users && dest.users.map((user) => (
                    <div 
                      key={user.id} 
                      className="flex items-center justify-between bg-emerald-50/50 hover:bg-emerald-50 px-3.5 py-2.5 rounded-2xl text-xs transition border border-emerald-100/40"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                          {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{user.name}</p>
                          <p className="text-[10px] text-slate-400">{user.email}</p>
                        </div>
                      </div>
                      <span className="text-[10px] bg-emerald-100/80 text-emerald-800 px-2 py-1 rounded-lg font-semibold">
                        {user.role || 'Voyageur'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}