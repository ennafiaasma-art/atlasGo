import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, MapPin, Star, Bed, ArrowLeft, Phone, Calendar, Heart, CheckCircle2 } from 'lucide-react';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

export default function VoirDestinations() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [aubergesDestination, setAubergesDestination] = useState([]);
  const [loadingAuberges, setLoadingAuberges] = useState(false);

  const [selectedAubergeForDetails, setSelectedAubergeForDetails] = useState(null);
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [reservationData, setReservationData] = useState({ date_arrivee: '', date_depart: '', nombre_personnes: 1 });
  const [successMessage, setSuccessMessage] = useState('');

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

  const fetchAubergesForDestination = async (dest) => {
    setSelectedDestination(dest);
    setSelectedAubergeForDetails(null);
    setLoadingAuberges(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/auberges`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { destination_id: dest.id } 
      });

      const data = response.data?.auberges || response.data?.data || response.data;
      const list = Array.isArray(data) ? data : [];
      
      const filteredAuberges = list.filter(aub => 
        String(aub.destination_id) === String(dest.id) || 
        String(aub.destination?.id) === String(dest.id)
      );

      setAubergesDestination(filteredAuberges.length > 0 ? filteredAuberges : list);
    } catch (err) {
      console.error("Erreur chargement auberges:", err);
      setAubergesDestination([]);
    } finally {
      setLoadingAuberges(false);
    }
  };

  // Helper functions sécurisées pour récupérer les données de l'auberge indépendamment du nom de la colonne dans l'API
  const getAubergeName = (aub) => aub?.nom || aub?.nom_auberge || aub?.title || 'Auberge sans nom';
  const getAubergeVille = (aub) => aub?.ville || aub?.adresse || aub?.emplacement || aub?.localisation || selectedDestination?.ville || selectedDestination?.nom_destination || 'Azilal';
  const getAubergePrix = (aub) => aub?.prix || aub?.prix_par_nuit || aub?.tarif || null;
  const getAubergePhone = (aub) => aub?.telephone || aub?.phone || aub?.tel || 'Non disponible';
  const getAubergeDescription = (aub) => aub?.description || aub?.desc || aub?.details || 'Profitez d\'un séjour inoubliable dans cette auberge chaleureuse offrant tout le confort nécessaire.';

  const handleToggleFavoris = async (aubergeId, e) => {
    if (e) e.stopPropagation();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/favoris`, { auberge_id: aubergeId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Auberge ajoutée aux favoris avec succès !');
    } catch (err) {
      console.error(err);
      alert('Erreur lors de l\'ajout aux favoris.');
    }
  };

  const handleCreateReservation = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/reservations`, {
        auberge_id: selectedAubergeForDetails.id,
        ...reservationData
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccessMessage('Réservation effectuée avec succès !');
      setTimeout(() => {
        setShowReservationModal(false);
        setSuccessMessage('');
      }, 2000);
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la réservation.');
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://images.unsplash.com/photo-1546484475-7f7bd55792da?auto=format&fit=crop&w=800&q=80';
    return imagePath.startsWith('http') ? imagePath : `http://127.0.0.1:8000/storage/${imagePath}`;
  };

  // 1. DETAILS DE L'AUBERGE
  if (selectedAubergeForDetails) {
    const aub = selectedAubergeForDetails;
    const prix = getAubergePrix(aub);

    return (
      <div className="space-y-8 animate-fadeIn">
        <button
          onClick={() => setSelectedAubergeForDetails(null)}
          className="flex items-center gap-2 text-xs font-semibold text-[#215234] bg-emerald-50 px-4 py-2.5 rounded-xl hover:bg-emerald-100 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux auberges de {selectedDestination.nom_destination || selectedDestination.nom}
        </button>

        <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm">
          <div className="relative h-72 sm:h-96 bg-slate-100">
            <img
              src={getImageUrl(aub.image)}
              alt={getAubergeName(aub)}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 flex gap-2">
              <button 
                onClick={(e) => handleToggleFavoris(aub.id, e)}
                className="p-2.5 bg-white/90 backdrop-blur-md rounded-full text-slate-700 hover:text-red-500 shadow-md transition"
                title="Enregistrer / Favoris"
              >
                <Heart className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900">{getAubergeName(aub)}</h1>
                <p className="text-xs text-emerald-800 font-semibold flex items-center gap-1 mt-1">
                  <MapPin className="w-4 h-4" /> 
                  {getAubergeVille(aub)}
                </p>
              </div>
              <div className="text-right">
                <span className="text-xl font-extrabold text-[#215234]">
                  {prix ? `${prix} DH` : 'Prix non spécifié'}
                </span>
                <span className="block text-[11px] text-slate-400">par nuit</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-2xl text-xs">
              <div className="flex items-center gap-2 text-slate-700">
                <Phone className="w-4 h-4 text-[#215234]" />
                <span><strong>Téléphone:</strong> {getAubergePhone(aub)}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span><strong>Note:</strong> {aub.note ?? '4.8'} / 5</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <Bed className="w-4 h-4 text-[#215234]" />
                <span><strong>Emplacement:</strong> {getAubergeVille(aub)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-900">Description de l'hébergement</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {getAubergeDescription(aub)}
              </p>
            </div>

            {/* Boutons d'action clairs : Réserver et Enregistrer */}
            <div className="pt-4 border-t border-slate-100 flex items-center gap-4">
              <button
                onClick={() => setShowReservationModal(true)}
                className="flex-1 py-3 bg-[#215234] hover:bg-[#1a4129] text-white text-xs font-bold rounded-xl shadow-sm flex items-center justify-center gap-2 transition"
              >
                <Calendar className="w-4 h-4" />
                Réserver maintenant
              </button>
              <button
                onClick={(e) => handleToggleFavoris(aub.id, e)}
                className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-2 transition"
              >
                <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                Enregistrer
              </button>
            </div>
          </div>
        </div>

        {/* Modal de Réservation */}
        {showReservationModal && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-xl">
              <h3 className="text-base font-bold text-slate-900">Réserver : {getAubergeName(aub)}</h3>
              
              {successMessage ? (
                <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  {successMessage}
                </div>
              ) : (
                <form onSubmit={handleCreateReservation} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Date d'arrivée</label>
                    <input 
                      type="date" 
                      required
                      value={reservationData.date_arrivee}
                      onChange={(e) => setReservationData({ ...reservationData, date_arrivee: e.target.value })}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-800/20"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Date de départ</label>
                    <input 
                      type="date" 
                      required
                      value={reservationData.date_depart}
                      onChange={(e) => setReservationData({ ...reservationData, date_depart: e.target.value })}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-800/20"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Nombre de personnes</label>
                    <input 
                      type="number" 
                      min="1" 
                      required
                      value={reservationData.nombre_personnes}
                      onChange={(e) => setReservationData({ ...reservationData, nombre_personnes: e.target.value })}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-800/20"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button 
                      type="submit" 
                      className="flex-1 py-3 bg-[#215234] text-white font-bold rounded-xl hover:bg-[#1a4129] transition"
                    >
                      Confirmer la réservation
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setShowReservationModal(false)}
                      className="px-4 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition"
                    >
                      Annuler
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // 2. LISTE DES AUBERGES PAR DESTINATION
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

        <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm">
          <div className="relative h-64 sm:h-80 bg-slate-100">
            <img
              src={getImageUrl(selectedDestination.image)}
              alt={selectedDestination.nom_destination || selectedDestination.nom}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-6 sm:p-8 space-y-4">
            <h1 className="text-2xl font-extrabold text-slate-900">
              {selectedDestination.nom_destination || selectedDestination.nom}
            </h1>
            <p className="text-xs text-emerald-800 font-semibold flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              {selectedDestination.ville ? `${selectedDestination.ville}, ` : ''}{selectedDestination.province || 'Azilal'}
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              {selectedDestination.description || 'Aucune description disponible.'}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Bed className="w-5 h-5 text-[#215234]" />
            <h2 className="text-lg font-bold text-slate-900">
              Auberges disponibles à {selectedDestination.nom_destination || selectedDestination.nom}
            </h2>
          </div>

          {loadingAuberges ? (
            <div className="py-12 text-center text-xs text-slate-400">Chargement des auberges...</div>
          ) : aubergesDestination.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-slate-100 text-center text-slate-400 space-y-2">
              <Bed className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-xs font-medium">Aucune auberge n'est enregistrée pour cette destination.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {aubergesDestination.map((aub) => {
                const prix = getAubergePrix(aub);
                return (
                  <div 
                    key={aub.id} 
                    onClick={() => setSelectedAubergeForDetails(aub)}
                    className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition cursor-pointer group"
                  >
                    <div className="relative h-44 bg-slate-100">
                      <img 
                        src={getImageUrl(aub.image)} 
                        alt={getAubergeName(aub)} 
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                      <button 
                        onClick={(e) => handleToggleFavoris(aub.id, e)}
                        className="absolute top-3 right-3 p-1.5 bg-white/80 backdrop-blur-md rounded-full text-slate-600 hover:text-red-500 shadow-sm"
                        title="Enregistrer"
                      >
                        <Heart className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="p-4 space-y-2">
                      <div className="flex justify-between items-center">
                        <h3 className="font-bold text-sm text-slate-900">{getAubergeName(aub)}</h3>
                        <div className="flex items-center gap-1 text-[11px] font-bold text-slate-700">
                          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                          <span>{aub.note ?? '4.8'}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <MapPin className="w-3.5 h-3.5 text-emerald-800 flex-shrink-0" />
                        <span className="truncate">{getAubergeVille(aub)}</span>
                      </div>
                    </div>

                    <div className="p-4 pt-0 border-t border-slate-50 mt-2 flex items-center justify-between text-xs">
                      <span className="font-bold text-emerald-800">
                        {prix ? `${prix} DH / nuit` : 'Prix sur demande'}
                      </span>
                      <span className="text-[#215234] font-semibold group-hover:underline">
                        Voir détails →
                      </span>
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

  // 3. LISTE DES DESTINATIONS
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Destinations</h2>
          <p className="text-xs text-slate-400 mt-1">Explorez les meilleurs sites touristiques de la région</p>
        </div>

        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); fetchDestinations(e.target.value); }}
            placeholder="Rechercher une destination..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-800/20"
          />
        </div>
      </div>

      {error && <p className="text-xs text-red-500 bg-red-50 p-3 rounded-xl">{error}</p>}

      {loading ? (
        <div className="py-12 text-center text-xs text-slate-400">Chargement des destinations...</div>
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
                    <MapPin className="w-3.5 h-3.5 text-emerald-800 flex-shrink-0" />
                    <span>{dest.ville ? `${dest.ville}, ` : ''}{dest.province || 'Azilal'}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    fetchAubergesForDestination(dest);
                  }}
                  className="w-full py-2 bg-[#215234] hover:bg-[#1a4129] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition"
                >
                  <Bed className="w-4 h-4" />
                  Voir les auberges
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}