import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  MapPin, 
  Phone, 
  X, 
  Building2,
  Search,
  CheckCircle,
  AlertCircle,
  BedDouble
} from 'lucide-react';

import GererChambre from "./GererChambre.jsx"; 

export default function Aubergement() {
  const [auberges, setAuberges] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal Auberge
  const [showModal, setShowModal] = useState(false);
  const [editingAuberge, setEditingAuberge] = useState(null);
  
  // Gestion de la sous-vue des chambres
  const [selectedAubergeForChambres, setSelectedAubergeForChambres] = useState(null);

  // Notifications & Erreurs
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({}); 

  // Form State Auberge
  const [formData, setFormData] = useState({
    nom: '',
    adresse: '',
    ville: '',
    telephone: '',
    destination_id: '',
    nombre_chambres: '',
    prix: '',
    description: '',
    image: null
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchAuberges();
    fetchDestinations();
  }, []);

  const fetchAuberges = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/auberges', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data && response.data.auberges) {
        setAuberges(response.data.auberges);
      } else if (Array.isArray(response.data)) {
        setAuberges(response.data);
      }
    } catch (err) {
      console.error("Erreur lors du chargement des auberges:", err);
      setError("Impossible de charger la liste des auberges.");
    } finally {
      setLoading(false);
    }
  };

  const fetchDestinations = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/destinations', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data && response.data.destinations) {
        setDestinations(response.data.destinations);
      } else if (Array.isArray(response.data)) {
        setDestinations(response.data);
      }
    } catch (err) {
      console.error("Erreur lors du chargement des destinations:", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFormData(prev => ({ ...prev, image: e.target.files[0] }));
    }
  };

  const openModal = (auberge = null) => {
    setError(null);
    setFieldErrors({});
    if (auberge) {
      setEditingAuberge(auberge);
      setFormData({
        nom: auberge.nom || '',
        adresse: auberge.adresse || '',
        ville: auberge.ville || '',
        telephone: auberge.telephone || '',
        destination_id: auberge.destination_id || '',
        nombre_chambres: auberge.nombre_chambres || '',
        prix: auberge.prix || '',
        description: auberge.description || '',
        image: null
      });
    } else {
      setEditingAuberge(null);
      setFormData({
        nom: '',
        adresse: '',
        ville: '',
        telephone: '',
        destination_id: '',
        nombre_chambres: '',
        prix: '',
        description: '',
        image: null
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingAuberge(null);
    setFieldErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    if (formData.prix !== '' && Number(formData.prix) <= 0) {
      setFieldErrors({ prix: ["Le prix doit être supérieur à 0."] });
      setError("Veuillez corriger les erreurs dans le formulaire.");
      return;
    }

    const data = new FormData();
    data.append('nom', formData.nom);
    data.append('adresse', formData.adresse);
    if (formData.ville) data.append('ville', formData.ville);
    if (formData.telephone) data.append('telephone', formData.telephone);
    data.append('destination_id', formData.destination_id);
    if (formData.nombre_chambres) data.append('nombre_chambres', formData.nombre_chambres);
    if (formData.prix) data.append('prix', formData.prix);
    if (formData.description) data.append('description', formData.description);
    if (formData.image instanceof File) {
      data.append('image', formData.image);
    }

    try {
      if (editingAuberge) {
        await axios.post(`http://127.0.0.1:8000/api/auberges/${editingAuberge.id}`, data, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessage('Auberge modifiée avec succès!');
      } else {
        await axios.post('http://127.0.0.1:8000/api/auberges', data, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessage('Auberge créée avec succès!');
      }
      fetchAuberges();
      closeModal();
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error("Erreur d'enregistrement:", err.response?.data);
      
      if (err.response && err.response.status === 422) {
        const errors = err.response.data.errors;
        setFieldErrors(errors);
        setError("Veuillez corriger les erreurs dans le formulaire.");
      } else {
        const errorMsg = err.response?.data?.message || err.message;
        setError("Erreur : " + errorMsg);
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette auberge ?")) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/auberges/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Auberge supprimée avec succès!');
      fetchAuberges();
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error("Erreur lors de la suppression:", err);
      setError("Impossible de supprimer l'auberge.");
    }
  };

  const filteredAuberges = auberges.filter(aub => 
    aub.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    aub.adresse.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Si une auberge est sélectionnée pour gérer ses chambres, on affiche le composant GererChambre
  if (selectedAubergeForChambres) {
    return (
      <div className="p-3 sm:p-6 lg:p-8 bg-slate-50 min-h-screen">
        <GererChambre 
          selectedAuberge={selectedAubergeForChambres} 
          token={token} 
          onBack={() => setSelectedAubergeForChambres(null)} 
          onChambreUpdated={fetchAuberges} 
        />
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-6 lg:p-8 space-y-6 bg-slate-50 min-h-screen w-full max-w-7xl mx-auto">
      
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Building2 className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-800 shrink-0" />
            <span>Gestion des Auberges & Chambres</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Gérez les hébergements et configurez leurs chambres détaillées
          </p>
        </div>

        <button
          onClick={() => openModal()}
          className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-3 sm:py-2.5 bg-emerald-900 hover:bg-emerald-950 text-white rounded-xl font-semibold text-xs transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter une Auberge</span>
        </button>
      </div>

      {/* Messages de succès / erreur globaux */}
      {message && (
        <div className="flex items-center gap-2 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {error && !Object.keys(fieldErrors).length && (
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Barre de recherche */}
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Rechercher une auberge..."
          className="w-full pl-10 pr-4 py-3 sm:py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-800/20 focus:border-emerald-800 transition shadow-sm"
        />
      </div>

      {/* Grille des Auberges */}
      {loading ? (
        <p className="text-xs text-slate-400 text-center py-8">Chargement des auberges...</p>
      ) : filteredAuberges.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl border border-slate-100 text-center text-slate-400 text-xs shadow-sm">
          Aucune auberge trouvée.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredAuberges.map((aub) => (
            <div key={aub.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col justify-between">
              <div>
                <div className="relative h-40 bg-slate-100">
                  <img
                    src={
                      aub.image 
                        ? (aub.image.startsWith('http') ? aub.image : `http://127.0.0.1:8000/storage/${aub.image}`)
                        : 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'
                    }
                    alt={aub.nom}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold rounded-lg">
                    {aub.destination ? aub.destination.nom_destination || aub.destination.nom : 'Sans Destination'}
                  </span>
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                    <h3 className="font-bold text-slate-800 text-base">{aub.nom}</h3>
                    {aub.prix && (
                      <span className="bg-emerald-50 text-emerald-800 font-bold text-[11px] px-2.5 py-1 rounded-lg self-start">
                        A partir de {aub.prix} DH / nuit
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
                    <span className="truncate">{aub.adresse}</span>
                  </p>

                  {aub.telephone && (
                    <p className="text-xs text-slate-500 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{aub.telephone}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Actions de la carte */}
              <div className="p-4 border-t border-slate-50 flex items-center justify-between bg-slate-50/50">
                <button
                  onClick={() => setSelectedAubergeForChambres(aub)}
                  className="px-3 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                >
                  <BedDouble className="w-3.5 h-3.5" />
                  <span>Gérer Chambres</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openModal(aub)}
                    className="p-2 text-slate-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition"
                    title="Modifier"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(aub.id)}
                    className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Ajout / Modification Auberge */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
              <h2 className="text-base font-bold text-slate-800">
                {editingAuberge ? 'Modifier l\'Auberge' : 'Ajouter une Auberge'}
              </h2>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 overflow-y-auto">
              
              {/* Nom */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Nom de l'auberge</label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-3 py-2.5 sm:py-2 border rounded-xl text-xs outline-none transition ${
                    fieldErrors.nom ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-slate-200 focus:border-emerald-800'
                  }`}
                />
                {fieldErrors.nom && (
                  <p className="text-[11px] text-red-600 mt-1">{fieldErrors.nom[0]}</p>
                )}
              </div>

              {/* Adresse */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Adresse</label>
                <input
                  type="text"
                  name="adresse"
                  value={formData.adresse}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2.5 sm:py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-800"
                />
              </div>

              {/* Téléphone & Prix */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Téléphone</label>
                  <input
                    type="text"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2.5 sm:py-2 border rounded-xl text-xs outline-none transition ${
                      fieldErrors.telephone ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-slate-200 focus:border-emerald-800'
                    }`}
                  />
                  {fieldErrors.telephone && (
                    <p className="text-[11px] text-red-600 mt-1">{fieldErrors.telephone[0]}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Prix par nuit (DH)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    name="prix"
                    value={formData.prix}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2.5 sm:py-2 border rounded-xl text-xs outline-none transition ${
                      fieldErrors.prix ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-slate-200 focus:border-emerald-800'
                    }`}
                  />
                  {fieldErrors.prix && (
                    <p className="text-[11px] text-red-600 mt-1">{fieldErrors.prix[0]}</p>
                  )}
                </div>
              </div>

              {/* Destination & Nombre de chambres */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Destination</label>
                  <select
                    name="destination_id"
                    value={formData.destination_id}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2.5 sm:py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-800 bg-white"
                  >
                    <option value="">Sélectionner</option>
                    {destinations.map((dest) => (
                      <option key={dest.id} value={dest.id}>
                        {dest.nom_destination || dest.nom}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Nombre total de chambres</label>
                  <input
                    type="number"
                    name="nombre_chambres"
                    value={formData.nombre_chambres}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 sm:py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-800"
                  />
                </div>
              </div>

              {/* Image */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Image de l'auberge</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-800"
                />
              </div>

              {/* Boutons Modal */}
              <div className="pt-4 flex flex-col-reverse sm:flex-row items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={closeModal}
                  className="w-full sm:w-auto px-4 py-2.5 border border-slate-200 text-slate-600 font-semibold text-xs rounded-xl"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-4 py-2.5 bg-emerald-900 hover:bg-emerald-950 text-white font-semibold text-xs rounded-xl"
                >
                  {editingAuberge ? 'Mettre à jour' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}