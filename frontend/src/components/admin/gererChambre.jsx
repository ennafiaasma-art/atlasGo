import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowLeft, BedDouble, Trash2, Plus, AlertCircle } from 'lucide-react';

export default function GererChambre({ selectedAuberge, token, onBack, onChambreUpdated }) {
  const [chambres, setChambres] = useState([]);
  const [caracteristiques, setCaracteristiques] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [chambreForm, setChambreForm] = useState({
    numero: '',
    type: 'Double',
    prix: '',
    caracteristique_ids: []
  });

  useEffect(() => {
    if (selectedAuberge) {
      fetchChambres(selectedAuberge.id);
      fetchCaracteristiques();
    }
  }, [selectedAuberge]);

  const fetchChambres = async (aubergeId) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/auberges/${aubergeId}/chambres`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setChambres(response.data);
    } catch (err) {
      console.error("Erreur chargement chambres", err);
      setError("Impossible de charger les chambres.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCaracteristiques = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/caracteristiques', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCaracteristiques(response.data);
    } catch (err) {
      console.error("Erreur chargement caractéristiques", err);
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

    // التحقق بأن الثمن أكبر قطعا من 0
    if (Number(chambreForm.prix) <= 0) {
      setError("Le prix de la chambre doit être supérieur à 0 DH.");
      return;
    }
    const chambreExistante = chambres.some(
      (ch) => String(ch.numero).trim().toLowerCase() === String(chambreForm.numero).trim().toLowerCase()
    );
    if (chambreExistante) {
      setError(`La chambre N° ${chambreForm.numero} existe déjà dans cet établissement.`);
      return;
    }

    try {
      await axios.post('http://127.0.0.1:8000/api/chambres', {
        ...chambreForm,
        auberge_id: selectedAuberge.id
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setChambreForm({ numero: '', type: 'Double', prix: '', caracteristique_ids: [] });
      fetchChambres(selectedAuberge.id);
      if (onChambreUpdated) onChambreUpdated();
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
      if (onChambreUpdated) onChambreUpdated();
    } catch (err) {
      console.error("Erreur suppression chambre", err);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Bar with Back Button */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-slate-100 text-slate-600 rounded-xl transition"
            title="Retour aux auberges"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <BedDouble className="w-5 h-5 text-emerald-800" />
              Gestion des Chambres : <span className="text-emerald-900">{selectedAuberge.nom}</span>
            </h2>
            <p className="text-xs text-slate-500">Ajoutez, modifiez ou supprimez les chambres de cet établissement</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
          <AlertCircle className="w-4 h-4 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulaire d'ajout à gauche */}
        <div className="lg:col-span-1 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4 h-fit">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Ajouter une nouvelle chambre</h3>
          
          <form onSubmit={handleChambreSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Numéro de chambre</label>
              <input
                type="text"
                placeholder="Ex: 101"
                value={chambreForm.numero}
                onChange={(e) => setChambreForm({ ...chambreForm, numero: e.target.value })}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Type de chambre</label>
              <select
                value={chambreForm.type}
                onChange={(e) => setChambreForm({ ...chambreForm, type: e.target.value })}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white transition"
              >
                <option value="Single">Single (Individuelle)</option>
                <option value="Double">Double</option>
                <option value="Triple">Triple</option>
                <option value="Suite">Suite</option>
                <option value="Dortoir">Dortoir</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Prix (DH)</label>
              <input
                type="number"
                placeholder="Ex: 350"
                value={chambreForm.prix}
                onChange={(e) => setChambreForm({ ...chambreForm, prix: e.target.value })}
                required
                min="1"        
                step="any"     
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-600">Caractéristiques (Sélectionnez)</label>
              <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto p-2 border border-slate-200 rounded-xl bg-slate-50">
                {caracteristiques.length === 0 ? (
                  <p className="text-[11px] text-slate-400 italic">Aucune caractéristique disponible.</p>
                ) : (
                  caracteristiques.map(carac => (
                    <label key={carac.id} className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer bg-white p-2 rounded-lg border border-slate-100 hover:bg-emerald-50/50 transition">
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

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-900 hover:bg-emerald-950 text-white font-semibold text-xs rounded-xl transition shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Ajouter la chambre</span>
            </button>
          </form>
        </div>

        {/* Liste des chambres à droite */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Liste des chambres actuelles</h3>

          {loading ? (
            <p className="text-xs text-slate-400 py-6 text-center">Chargement des chambres...</p>
          ) : chambres.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">Aucune chambre trouvée.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {chambres.map((chambre) => (
                <div key={chambre.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex justify-between items-start">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Chambre N° {chambre.numero}</h4>
                    <p className="text-[11px] text-slate-600">Type: {chambre.type}</p>
                    <p className="text-[11px] font-semibold text-emerald-800">Prix: {chambre.prix} DH</p>
                  </div>
                  <button
                    onClick={() => handleDeleteChambre(chambre.id)}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition"
                    title="Supprimer"
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
  );
}