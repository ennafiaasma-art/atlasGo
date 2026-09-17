import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowLeft, Sparkles, Plus, Trash2, Edit3, X, CheckCircle, AlertCircle } from 'lucide-react';

export default function GererCaracteristique({ selectedAuberge, token, onBack }) {
  const [caracteristiques, setCaracteristiques] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCaracteristique, setEditingCaracteristique] = useState(null);

  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  // تم الاحتفاظ بـ nom فقط وإزالة description
  const [formData, setFormData] = useState({
    nom: ''
  });

  useEffect(() => {
    fetchCaracteristiques();
  }, [selectedAuberge]);

  const fetchCaracteristiques = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/auberges/${selectedAuberge.id}/caracteristiques`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data && response.data.caracteristiques) {
        setCaracteristiques(response.data.caracteristiques);
      } else if (Array.isArray(response.data)) {
        setCaracteristiques(response.data);
      }
    } catch (err) {
      console.error("Erreur chargement caractéristiques:", err);
      setError("Impossible de charger les caractéristiques.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openModal = (caracteristique = null) => {
    if (caracteristique) {
      setEditingCaracteristique(caracteristique);
      setFormData({
        nom: caracteristique.nom || ''
      });
    } else {
      setEditingCaracteristique(null);
      setFormData({
        nom: ''
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCaracteristique(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        auberge_id: selectedAuberge.id
      };

      if (editingCaracteristique) {
        await axios.put(`http://127.0.0.1:8000/api/caracteristiques/${editingCaracteristique.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessage("Caractéristique modifiée avec succès !");
      } else {
        await axios.post(`http://127.0.0.1:8000/api/caracteristiques`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessage("Caractéristique ajoutée avec succès !");
      }

      fetchCaracteristiques();
      closeModal();
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error("Erreur lors de l'enregistrement:", err);
      setError("Erreur lors de l'enregistrement de la caractéristique.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette caractéristique ?")) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/caracteristiques/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage("Caractéristique supprimée avec succès !");
      fetchCaracteristiques();
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error("Erreur suppression:", err);
      setError("Impossible de supprimer cette caractéristique.");
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition flex items-center gap-2 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour aux chambres</span>
          </button>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-800 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-600" />
              <span>Caractéristiques : {selectedAuberge.nom}</span>
            </h2>
            <p className="text-xs text-slate-500">Gérez les équipements et caractéristiques de l'auberge</p>
          </div>
        </div>

        <button
          onClick={() => openModal()}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-semibold text-xs transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter une Caractéristique</span>
        </button>
      </div>

      {/* Messages */}
      {message && (
        <div className="flex items-center gap-2 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Liste */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        {loading ? (
          <p className="text-xs text-slate-400 text-center py-8">Chargement des caractéristiques...</p>
        ) : caracteristiques.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-8">Aucune caractéristique trouvée.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {caracteristiques.map((item) => (
              <div key={item.id} className="p-4 border border-slate-100 rounded-xl bg-slate-50/50 flex items-center justify-between">
                <p className="font-bold text-xs text-slate-800">{item.nom}</p>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openModal(item)}
                    className="p-1.5 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition"
                    title="Modifier"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl relative flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-800">
                {editingCaracteristique ? 'Modifier la Caractéristique' : 'Ajouter une Caractéristique'}
              </h2>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Nom de la caractéristique</label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-amber-600"
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
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-xl"
                >
                  {editingCaracteristique ? 'Mettre à jour' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}