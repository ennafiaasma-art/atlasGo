import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, MapPin, Star, Bed, ArrowLeft, Phone } from 'lucide-react';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

export default function VoirDestinations() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  
  // State bach n-stockiw la destination li tclikat w les auberges dyalha
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [aubergesDestination, setAubergesDestination] = useState([]);
  const [loadingAuberges, setLoadingAuberges] = useState(false);

  useEffect(() => {
    fetchDestinations('');
  }, []);

  const fetchDestinations = async (search) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const isSearching = search && search.trim() !== '';
      const url = isSearching ? `${API_BASE_URL}/destinations/recherch` : `${API_BASE_URL}/destinations`;
      const config = {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
        ...(isSearching && { params: { search } })
      };

      const response = await axios.get(url, config);
      const list = response.data?.destinations || response.data?.data || (Array.isArray(response.data) ? response.data : []);
      setDestinations(list);
      setError(null);
    } catch (err) {
      setError('Impossible de charger les destinations.');
    } finally {
      setLoading(false);
    }
  };

  // Fonction mkhssasa bach t-fetchi les auberges b destination_id mn l'API
  const fetchAubergesForDestination = async (dest) => {
    setSelectedDestination(dest);
    setLoadingAuberges(true);
    try {
      const token = localStorage.getItem('token');
      
      // Kay-imiti requete l-API b destination_id
      const response = await axios.get(`${API_BASE_URL}/auberges`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { destination_id: dest.id } 
      });

      // Gestion flexible dyal response format f Laravel (collection wla pagination wla array)
      const data = response.data?.auberges || response.data?.data || response.data;
      const list = Array.isArray(data) ? data : [];
      
      // Filtrage 7ta b l-yad ila kan l-API kay-raj3 kolchi bghina n-t2akdw belli homa dyal dik destination bdebt
      const filteredAuberges = list.filter(aub => 
        String(aub.destination_id) === String(dest.id) || 
        String(aub.destination?.id) === String(dest.id)
      );

      setAubergesDestination(filteredAuberges.length > 0 ? filteredAuberges : list);
    } catch (err) {
      console.error("Erreur lors du chargement des auberges:", err);
      setAubergesDestination([]);
    } finally {
      setLoadingAuberges(false);
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://images.unsplash.com/photo-1546484475-7f7bd55792da?auto=format&fit=crop&w=800&q=80';
    return imagePath.startsWith('http') ? imagePath : `http://127.0.0.1:8000/storage/${imagePath}`;
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    fetchDestinations(value);
  };

  // ILA KANET CHI DESTINATION SELECTIONNEE: Afici les details dyalha w les auberges li fiha
  if (selectedDestination) {
    return (
      <div className="space-y-8 animate-fadeIn">
        <button
          onClick={() => setSelectedDestination(null)}
          className="flex items-center gap-2 text-xs font-semibold text-[#215234] bg-emerald-50 px-4 py-2.5 rounded-xl hover:bg-emerald-100 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux destinations
        </button>

        {/* Details Card */}
        <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm">
          <div className="relative h-64 sm:h-80 bg-slate-100">
            <img
              src={getImageUrl(selectedDestination.image)}
              alt={selectedDestination.nom_destination || selectedDestination.nom}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-6 sm:p-8 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h1 className="text-2xl font-extrabold text-slate-900">
                {selectedDestination.nom_destination || selectedDestination.nom}
              </h1>
              <div className="flex items-center gap-1 text-xs font-bold text-slate-700 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-100">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>{selectedDestination.note ?? '4.8'}</span>
              </div>
            </div>

            <p className="text-xs text-emerald-800 font-semibold flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              {selectedDestination.ville ? `${selectedDestination.ville}, ` : ''}{selectedDestination.province || 'Azilal'}
            </p>

            <p className="text-sm text-slate-600 leading-relaxed">
              {selectedDestination.description || 'Aucune description détaillée disponible pour le moment.'}
            </p>
          </div>
        </div>

        {/* Section Auberges Dynamiques */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Bed className="w-5 h-5 text-[#215234]" />
            <h2 className="text-lg font-bold text-slate-900">
              Auberges disponibles à {selectedDestination.nom_destination || selectedDestination.nom}
            </h2>
          </div>

          {loadingAuberges ? (
            <div className="py-12 text-center text-xs text-slate-400">
              Chargement des auberges associées...
            </div>
          ) : aubergesDestination.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-slate-100 text-center text-slate-400 space-y-2">
              <Bed className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-xs font-medium">Aucune auberge n'est enregistrée pour cette destination pour le moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {aubergesDestination.map((aub) => (
                <div key={aub.id} className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition">
                  <div className="relative h-44 bg-slate-100">
                    <img 
                      src={getImageUrl(aub.image)} 
                      alt={aub.nom || aub.nom_auberge} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold text-sm text-slate-900">{aub.nom || aub.nom_auberge}</h3>
                      <div className="flex items-center gap-1 text-[11px] font-bold text-slate-700">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span>{aub.note ?? '4.8'}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-emerald-800" />
                      <span>{aub.ville || aub.emplacement || selectedDestination.nom_destination}</span>
                    </div>
                  </div>
                  <div className="p-4 pt-0 border-t border-slate-50 mt-2 flex items-center justify-between text-xs">
                    <span className="font-bold text-emerald-800">
                      {aub.prix || aub.prix_par_nuit ? `${aub.prix || aub.prix_par_nuit} DH / nuit` : 'Prix sur demande'}
                    </span>
                    {aub.telephone && (
                      <span className="text-slate-500 flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5" /> {aub.telephone}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // LISTE GENERALE DE TOUTES LES DESTINATIONS
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Destinations</h2>
          <p className="text-xs text-slate-400 mt-1">Explorez les meilleurs sites touristiques et découvrez leurs auberges</p>
        </div>

        {/* Barre de recherche instantanée */}
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Rechercher une destination..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-800/20"
          />
        </div>
      </div>

      {error && <p className="text-xs text-red-500 bg-red-50 p-3 rounded-xl">{error}</p>}

      {loading ? (
        <p className="text-xs text-slate-400">Chargement des destinations...</p>
      ) : destinations.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl text-center text-slate-400 border border-slate-100">
          <p className="text-xs font-medium">Aucune destination trouvée.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((dest) => (
            <div
              key={dest.id}
              onClick={() => fetchAubergesForDestination(dest)}
              className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="relative h-44 overflow-hidden bg-slate-100">
                  <img
                    src={getImageUrl(dest.image)}
                    alt={dest.nom_destination || 'Destination'}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-bold text-sm text-slate-800 truncate">
                      {dest.nom_destination || dest.nom || 'Destination'}
                    </h3>
                    <div className="flex items-center gap-1 text-[11px] font-bold text-slate-700 flex-shrink-0">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span>{dest.note ?? '4.8'}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-emerald-800" />
                    <span>{dest.ville ? `${dest.ville}, ` : ''}{dest.province || 'Azilal'}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0">
                <button 
                  onClick={(e) => {
                    e.stopPropagation(); // Bach may-t-declashach event dyal div b jouj marrat
                    fetchAubergesForDestination(dest);
                  }}
                  className="w-full py-2 bg-[#215234] hover:bg-[#1a4129] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition"
                >
                  <Bed className="w-4 h-4" />
                  Voir les détails & auberges
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}