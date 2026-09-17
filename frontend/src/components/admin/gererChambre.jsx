import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowLeft, BedDouble, Plus, Trash2, Edit3, X, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import GererCaracteristique from './GererCaracteristique';

export default function GererChambre({ selectedAuberge, token, onBack, onChambreUpdated }) {
  const [chambres, setChambres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingChambre, setEditingChambre] = useState(null);
  
  const [showCaracteristiquesView, setShowCaracteristiquesView] = useState(false);

  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    numero: '',
    type: 'Simple',
    prix: '',
    statut: 'disponible'
  });

  useEffect(() => {
    fetchChambres();
  }, [selectedAuberge]);

  const fetchChambres = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/auberges/${selectedAuberge.id}/chambres`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data && response.data.chambres) {
        setChambres(response.data.chambres);
      } else if (Array.isArray(response.data)) {
        setChambres(response.data);
      }
    } catch (err) {
      console.error("Erreur chargement chambres:", err);
      setError("Impossible de charger les chambres.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openModal = (chambre = null) => {
    if (chambre) {
      setEditingChambre(chambre);
      setFormData({
        numero: chambre.numero || '',
        type: chambre.type || 'Simple',
        prix: chambre.prix || '',
        statut: chambre.statut || 'disponible'
      });
    } else {
      setEditingChambre(null);
      setFormData({
        numero: '',
        type: 'Simple',
        prix: '',
        statut: 'disponible'
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingChambre(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    
    try {
      const payload = {
        ...formData,
        auberge_id: selectedAuberge.id
      };

      if (editingChambre) {
        // استخدام POST مع معرف الغرفة كما هو معرف في Laravel Routes
        await axios.post(`http://127.0.0.1:8000/api/chambres/${editingChambre.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessage("Chambre modifiée avec succès !");
      } else {
        await axios.post(`http://127.0.0.1:8000/api/chambres`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessage("Chambre ajoutée avec succès !");
      }

      fetchChambres();
      if (onChambreUpdated) onChambreUpdated();
      closeModal();
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error("Erreur lors de l'enregistrement de la chambre:", err);
      setError(err.response?.data?.error || "Erreur lors de l'enregistrement de la chambre.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette chambre ?")) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/chambres/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage("Chambre supprimée avec succès !");
      fetchChambres();
      if (onChambreUpdated) onChambreUpdated();
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error("Erreur suppression chambre:", err);
      setError("Impossible de supprimer cette chambre.");
    }
  };

  if (showCaracteristiquesView) {
    return (
      <GererCaracteristique
        selectedAuberge={selectedAuberge}
        token={token}
        onBack={() => setShowCaracteristiquesView(false)}
      />
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* رسائل التنبيه والنجاح */}
      {message && (
        <div className="flex items-center gap-2 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl shadow-sm">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl shadow-sm">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition flex items-center gap-2 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour</span>
          </button>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-800 flex items-center gap-2">
              <BedDouble className="w-5 h-5 text-emerald-800" />
              <span>Chambres de : {selectedAuberge.nom}</span>
            </h2>
            <p className="text-xs text-slate-500">Gérez les chambres et leurs disponibilités</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowCaracteristiquesView(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-semibold text-xs transition shadow-sm"
          >
            <Sparkles className="w-4 h-4" />
            <span>Gérer Caractéristiques</span>
          </button>

          <button
            onClick={() => openModal()}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-900 hover:bg-emerald-950 text-white rounded-xl font-semibold text-xs transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter une Chambre</span>
          </button>
        </div>
      </div>

      {/* Liste des Chambres */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        {loading ? (
          <p className="text-xs text-slate-400 text-center py-8">Chargement des chambres...</p>
        ) : chambres.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-8">Aucune chambre trouvée pour cette auberge.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {chambres.map((chambre) => (
              <div key={chambre.id} className="p-4 border border-slate-100 rounded-xl bg-slate-50/50 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <p className="font-bold text-xs text-slate-800">Chambre N° {chambre.numero}</p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      chambre.statut === 'disponible' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {chambre.statut}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">Type : {chambre.type}</p>
                  <p className="text-xs font-semibold text-emerald-800 mt-1">{chambre.prix} DH / nuit</p>
                </div>

                <div className="flex items-center justify-end gap-1 mt-4 pt-3 border-t border-slate-200/60">
                  <button
                    onClick={() => openModal(chambre)}
                    className="p-1.5 text-slate-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition"
                    title="Modifier"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(chambre.id)}
                    className="p-1.5 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Ajout / Modification Chambre */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl relative flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-800">
                {editingChambre ? 'Modifier la Chambre' : 'Ajouter une Chambre'}
              </h2>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Numéro de la chambre</label>
                <input
                  type="text"
                  name="numero"
                  value={formData.numero}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Type de chambre</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-800 bg-white"
                >
                  <option value="Simple">Simple</option>
                  <option value="Double">Double</option>
                  <option value="Suite">Suite</option>
                  <option value="Dortoir">Dortoir</option>
                </select>
              </div>

              {/* حقل السعر (Prix) المعدل */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Prix par nuit (DH)</label>
                <input
                  type="number"
                  step="any"
                  min="1"
                  name="prix"
                  value={formData.prix}
                  onChange={handleInputChange}
                  placeholder="Ex: 150"
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Statut</label>
                <select
                  name="statut"
                  value={formData.statut}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-800 bg-white"
                >
                  <option value="disponible">Disponible</option>
                  <option value="occupée">Occupée</option>
                </select>
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
                  {editingChambre ? 'Mettre à jour' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}