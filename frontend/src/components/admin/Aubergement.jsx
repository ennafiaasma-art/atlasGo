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

export default function Aubergement() {
  const [auberges, setAuberges] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [caracteristiques, setCaracteristiques] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal Auberge
  const [showModal, setShowModal] = useState(false);
  const [editingAuberge, setEditingAuberge] = useState(null);
  
  // Modal Chambres
  const [showChambreModal, setShowChambreModal] = useState(false);
  const [selectedAuberge, setSelectedAuberge] = useState(null);
  const [chambres, setChambres] = useState([]);
  
  const [chambreForm, setChambreForm] = useState({
    numero: '',
    type: '',
    prix: '',
    caracteristique_ids: []
  });

  // Notifications
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  // Form State Auberge
  const [formData, setFormData] = useState({
    nom: '',
    adresse: '',
    telephone: '',
    destination_id: '',
    nombre_chambres: '',
    prix: '',
    image: null
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchAuberges();
    fetchDestinations();
    fetchCaracteristiques();
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

  const fetchCaracteristiques = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/caracteristiques', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCaracteristiques(response.data);
    } catch (err) {
      console.error("Erreur lors du chargement des caractéristiques:", err);
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
        nombre_chambres: auberge.nombre_chambres || '',
        prix: auberge.prix || '',
        image: null
      });
    } else {
      setEditingAuberge(null);
      setFormData({
        nom: '',
        adresse: '',
        telephone: '',
        destination_id: '',
        nombre_chambres: '',
        prix: '',
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
    const data = new FormData();
    data.append('nom', formData.nom);
    data.append('adresse', formData.adresse);
    if (formData.telephone) data.append('telephone', formData.telephone);
    data.append('destination_id', formData.destination_id);
    if (formData.nombre_chambres) data.append('nombre_chambres', formData.nombre_chambres);
    if (formData.prix) data.append('prix', formData.prix);
    if (formData.image) data.append('image', formData.image);

    try {
      if (editingAuberge) {
        data.append('_method', 'PUT');
        await axios.post(`http://127.0.0.1:8000/api/auberges/${editingAuberge.id}`, data, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
        });
        setMessage('Auberge modifiée avec succès!');
      } else {
        await axios.post('http://127.0.0.1:8000/api/auberges', data, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
        });
        setMessage('Auberge créée avec succès!');
      }
      fetchAuberges();
      closeModal();
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error("Erreur d'enregistrement:", err);
      setError("Une erreur est survenue lors de l'enregistrement de l'auberge.");
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

  const openChambreModal = async (auberge) => {
    setSelectedAuberge(auberge);
    setShowChambreModal(true);
    fetchChambres(auberge.id);
  };

  const fetchChambres = async (aubergeId) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/auberges/${aubergeId}/chambres`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setChambres(response.data);
    } catch (err) {
      console.error("Erreur chargement chambres", err);
    }
  };

  const handleCheckboxChange = (id) => {
    setChambreForm(prev => {
      const exists = prev.caracteristique_ids.includes(id);
      if (exists) {
        return {
          ...prev,
          caracteristique_ids: prev.caracteristique_ids.filter(item => item !== id)
        };
      } else {
        return {
          ...prev,
          caracteristique_ids: [...prev.caracteristique_ids, id]
        };
      }
    });
  };

  const handleChambreSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await axios.post('http://127.0.0.1:8000/api/chambres', {
        ...chambreForm,
        auberge_id: selectedAuberge.id
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setChambreForm({ numero: '', type: '', prix: '', caracteristique_ids: [] });
      fetchChambres(selectedAuberge.id);
      fetchAuberges(); 
      setMessage('Chambre ajoutée avec succès!');
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error("Erreur détaillée du serveur:", err.response?.data);
      setError("Erreur : " + (err.response?.data?.error || err.response?.data?.message || err.message));
    }
  };

  const handleDeleteChambre = async (chambreId) => {
    if (!window.confirm("Supprimer cette chambre ?")) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/chambres/${chambreId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchChambres(selectedAuberge.id);
      fetchAuberges();
    } catch (err) {
      console.error("Erreur suppression chambre", err);
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
            Gestion des Auberges & Chambres
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Gérez les hébergements et configurez leurs chambres détaillées
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

      {/* Grid of Auberges */}
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
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-slate-800 text-base">{aub.nom}</h3>
                    {aub.prix && (
                      <span className="bg-emerald-50 text-emerald-800 font-bold text-xs px-2.5 py-1 rounded-lg">
                        A partir de {aub.prix} DH / nuit
                      </span>
                    )}
                  </div>

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

                  <p className="text-xs text-slate-600 flex items-center gap-1.5 pt-1 font-medium">
                    <BedDouble className="w-3.5 h-3.5 text-emerald-800" />
                    <span>
                      {aub.nombre_chambres 
                        ? `${aub.nombre_chambres} chambres total` 
                        : aub.chambres_count 
                        ? `${aub.chambres_count} chambres total` 
                        : 'Chambres non spécifiées'}
                    </span>
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 border-t border-slate-50 flex items-center justify-between bg-slate-50/50">
                <button
                  onClick={() => openChambreModal(aub)}
                  className="px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                >
                  <BedDouble className="w-3.5 h-3.5" />
                  <span>Gérer Chambres</span>
                </button>

                <div className="flex items-center gap-1">
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
            </div>
          ))}
        </div>
      )}

      {/* Modal Auberge Form */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-800">
                {editingAuberge ? 'Modifier l\'Auberge' : 'Ajouter une Auberge'}
              </h2>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Nom de l'auberge</label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
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
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Téléphone</label>
                  <input
                    type="text"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Prix par nuit (DH)</label>
                  <input
                    type="number"
                    name="prix"
                    value={formData.prix}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Destination</label>
                  <select
                    name="destination_id"
                    value={formData.destination_id}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
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
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Image de l'auberge</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-800"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-slate-200 text-slate-600 font-semibold text-xs rounded-xl"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-900 hover:bg-emerald-950 text-white font-semibold text-xs rounded-xl"
                >
                  {editingAuberge ? 'Mettre à jour' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Gestion des Chambres */}
      {showChambreModal && selectedAuberge && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <BedDouble className="w-5 h-5 text-emerald-800" />
                Chambres de : {selectedAuberge.nom}
              </h2>
              <button onClick={() => setShowChambreModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              <form onSubmit={handleChambreSubmit} className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 space-y-3">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Ajouter une nouvelle chambre</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Numéro (ex: 101)"
                    value={chambreForm.numero}
                    onChange={(e) => setChambreForm({ ...chambreForm, numero: e.target.value })}
                    required
                    className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Type (ex: Double / Suite)"
                    value={chambreForm.type}
                    onChange={(e) => setChambreForm({ ...chambreForm, type: e.target.value })}
                    required
                    className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                  />
                  <input
                    type="number"
                    placeholder="Prix (DH)"
                    value={chambreForm.prix}
                    onChange={(e) => setChambreForm({ ...chambreForm, prix: e.target.value })}
                    required
                    className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div className="space-y-2 col-span-2">
                  <label className="block text-xs font-semibold text-slate-600">Caractéristiques de la chambre</label>
                  <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto p-2 border border-slate-200 rounded-xl bg-white">
                    {caracteristiques.length === 0 ? (
                      <p className="text-[11px] text-slate-400 italic col-span-2">Aucune caractéristique disponible.</p>
                    ) : (
                      caracteristiques.map(carac => (
                        <label key={carac.id} className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={chambreForm.caracteristique_ids.includes(carac.id)}
                            onChange={() => handleCheckboxChange(carac.id)}
                            className="rounded text-emerald-900 focus:ring-emerald-800"
                          />
                          <span>Étage: {carac.etage || 'N/A'} {carac.wifi ? '• WiFi' : ''} {carac.climatisation ? '• Clim' : ''}</span>
                        </label>
                      ))
                    )}
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-900 hover:bg-emerald-950 text-white font-semibold text-xs rounded-xl"
                  >
                    + Ajouter la chambre
                  </button>
                </div>
              </form>

              <div>
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Liste des chambres actuelles</h3>
                {chambres.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">Aucune chambre enregistrée pour cette auberge.</p>
                ) : (
                  <div className="space-y-2">
                    {chambres.map((chambre) => (
                      <div key={chambre.id} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl shadow-xs">
                        <div className="space-y-0.5">
                          <p className="text-xs font-bold text-slate-800">
                            Chambre N° {chambre.numero} - <span className="text-emerald-800">{chambre.type}</span>
                          </p>
                          <p className="text-[11px] text-slate-500">
                            Prix: <span className="font-semibold text-slate-700">{chambre.prix} DH</span>
                          </p>
                        </div>
                        <button
                          onClick={() => handleDeleteChambre(chambre.id)}
                          className="p-2 text-red-500 hover:bg-red-50 root rounded-lg transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}