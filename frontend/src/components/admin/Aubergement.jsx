import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  MapPin, 
  Phone, 
  Image as ImageIcon, 
  X, 
  Building2,
  Search,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export default function Aubergement() {
  const [auberges, setAuberges] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingAuberge, setEditingAuberge] = useState(null);

  // Success / Error notification states
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    nom: '',
    adresse: '',
    telephone: '',
    destination_id: '',
    image: null
  });

  const token = localStorage.getItem('token');

  // Fetch initial data
  useEffect(() => {
    fetchAuberges();
    fetchDestinations();
  }, []);

  const fetchAuberges = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/auberges');
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
      const response = await axios.get('http://127.0.0.1:8000/api/destinations');
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
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFormData(prev => ({ ...prev, image: e.target.files[0] }));
    }
  };

  const openModal = (auberge = null) => {
    setError(null);
    if (auberge) {
      setEditingAuberge(auberge);
      setFormData({
        nom: auberge.nom || '',
        adresse: auberge.adresse || '',
        telephone: auberge.telephone || '',
        destination_id: auberge.destination_id || '',
        image: null
      });
    } else {
      setEditingAuberge(null);
      setFormData({
        nom: '',
        adresse: '',
        telephone: '',
        destination_id: '',
        image: null
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingAuberge(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const data = new FormData();
    data.append('nom', formData.nom);
    data.append('adresse', formData.adresse);
    if (formData.telephone) data.append('telephone', formData.telephone);
    data.append('destination_id', formData.destination_id);
    
    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      if (editingAuberge) {
        // Mode Modification (Utilisation de POST avec _method=PUT pour la gestion des fichiers)
        data.append('_method', 'PUT');
        await axios.post(`http://127.0.0.1:8000/api/auberges/${editingAuberge.id}`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        setMessage('Auberge modifiée avec succès!');
      } else {
        // Mode Création
        await axios.post('http://127.0.0.1:8000/api/auberges', data, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        setMessage('Auberge créée avec succès!');
      }

      fetchAuberges();
      closeModal();
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error("Erreur d'enregistrement:", err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Une erreur est survenue lors de l'enregistrement.");
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

  return (
    <div className="p-8 space-y-6 bg-slate-50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Building2 className="w-7 h-7 text-emerald-800" />
            Gestion des Auberges
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Gérez la liste des hébergements et leurs destinations associées
          </p>
        </div>

        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-900 hover:bg-emerald-950 text-white rounded-xl font-semibold text-xs transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter une Auberge</span>
        </button>
      </div>

      {/* Notifications */}
      {message && (
        <div className="flex items-center gap-2 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
          <AlertCircle className="w-4 h-4 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Rechercher une auberge..."
          className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-800/20 focus:border-emerald-800 transition shadow-sm"
        />
      </div>

      {/* Table / Grid */}
      {loading ? (
        <p className="text-xs text-slate-400">Chargement des auberges...</p>
      ) : filteredAuberges.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl border border-slate-100 text-center text-slate-400 text-xs">
          Aucune auberge trouvée.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAuberges.map((aub) => (
            <div key={aub.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col justify-between">
              <div>
                {/* Image */}
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

                {/* Content */}
                <div className="p-4 space-y-2">
                  <h3 className="font-bold text-slate-800 text-base">{aub.nom}</h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-800" />
                    <span>{aub.adresse}</span>
                  </p>
                  {aub.telephone && (
                    <p className="text-xs text-slate-500 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{aub.telephone}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 border-t border-slate-50 flex items-center justify-end gap-2 bg-slate-50/50">
                <button
                  onClick={() => openModal(aub)}
                  className="p-2 text-slate-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(aub.id)}
                  className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-800">
                {editingAuberge ? 'Modifier l\'Auberge' : 'Ajouter une Auberge'}
              </h2>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Nom de l'auberge</label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleInputChange}
                  required
                  placeholder="Ex: Auberge Bin El Ouidane"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-800/20 focus:border-emerald-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Adresse</label>
                <input
                  type="text"
                  name="adresse"
                  value={formData.adresse}
                  onChange={handleInputChange}
                  required
                  placeholder="Ex: Route du Lac, Ouaouizeght"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-800/20 focus:border-emerald-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Téléphone</label>
                <input
                  type="text"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleInputChange}
                  placeholder="Ex: +212 600 000 000"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-800/20 focus:border-emerald-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Destination associée</label>
                <select
                  name="destination_id"
                  value={formData.destination_id}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-800/20 focus:border-emerald-800"
                >
                  <option value="">Sélectionner une destination</option>
                  {destinations.map((dest) => (
                    <option key={dest.id} value={dest.id}>
                      {dest.nom_destination || dest.nom}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Image de l'auberge</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-800 hover:file:bg-emerald-100"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-slate-200 text-slate-600 font-semibold text-xs rounded-xl hover:bg-slate-50 transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-900 hover:bg-emerald-950 text-white font-semibold text-xs rounded-xl transition"
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