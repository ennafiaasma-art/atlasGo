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
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 space-y-4 sm:space-y-6 animate-fadeIn">
      {/* Top Bar with Back Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={onBack}
            className="p-2 hover:bg-slate-100 text-slate-600 rounded-xl transition shrink-0"
            title="Retour aux auberges"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="min-w-0">
            <h2 className="text-sm sm:text-base font-bold text-slate-800 flex items-center gap-2 truncate">
              <BedDouble className="w-5 h-5 text-emerald-800 shrink-0" />
              <span className="truncate">Gestion des Chambres : <span className="text-emerald-900">{selectedAuberge.nom}</span></span>
            </h2>
            <p className="text-xs text-slate-500">Ajoutez, modifiez ou supprimez les chambres de cet établissement</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 sm:p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span className="break-words">{error}</span>
        </div>
      )}

      {/* Grid container: 1 col on mobile, 3 cols on large screens */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        
        {/* Formulaire d'ajout */}
        <div className="lg:col-span-1 bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4 h-fit">
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
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-emerald-600 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Type de chambre</label>
              <select
                value={chambreForm.type}
                onChange={(e) => setChambreForm({ ...chambreForm, type: e.target.value })}
                required
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-emerald-600 transition"
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
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-emerald-600 transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-600">Caractéristiques (Sélectionnez)</label>
              <div className="grid grid-cols-1 gap-2 max-h-44 overflow-y-auto p-2 border border-slate-200 rounded-xl bg-slate-50">
                {caracteristiques.length === 0 ? (
                  <p className="text-[11px] text-slate-400 italic">Aucune caractéristique disponible.</p>
                ) : (
                  caracteristiques.map(carac => (
                    <label key={carac.id} className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer bg-white p-2.5 rounded-lg border border-slate-100 hover:bg-emerald-50/50 transition">
                      <input
                        type="checkbox"
                        checked={chambreForm.caracteristique_ids.includes(carac.id)}
                        onChange={() => handleCheckboxChange(carac.id)}
                        className="rounded text-emerald-900 focus:ring-emerald-800 shrink-0"
                      />
                      <span className="break-words">Étage: {carac.etage || 'N/A'} {carac.wifi ? '• WiFi' : ''} {carac.climatisation ? '• Clim' : ''}</span>
                    </label>
                  ))
                )}
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-900 hover:bg-emerald-950 text-white font-semibold text-xs rounded-xl transition shadow-sm active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>Ajouter la chambre</span>
            </button>
          </form>
        </div>

        {/* Liste des chambres */}
        <div className="lg:col-span-2 bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Liste des chambres actuelles</h3>

          {loading ? (
            <p className="text-xs text-slate-400 py-6 text-center">Chargement des chambres...</p>
          ) : chambres.length === 0 ? (
            <div className="text-center py-10 border-2 border-dashed border-slate-100 rounded-xl">
              <BedDouble className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs text-slate-400">Aucune chambre trouvée.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {chambres.map((chambre) => (
                <div key={chambre.id} className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl flex justify-between items-start gap-2 shadow-xs">
                  <div className="space-y-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-800 truncate">
                      Chambre N° <span className="text-emerald-900 text-sm">{chambre.numero}</span>
                    </h4>
                    <p className="text-[11px] text-slate-600">Type: <span className="font-medium text-slate-800">{chambre.type}</span></p>
                    <p className="text-[11px] font-semibold text-emerald-800">Prix: {chambre.prix} DH</p>

                    {chambre.caracteristiques && chambre.caracteristiques.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {chambre.caracteristiques.map(carac => (
                          <span key={carac.id} className="text-[10px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md font-medium border border-emerald-100">
                            Étage: {carac.etage || 'N/A'} {carac.wifi ? '• WiFi' : ''} {carac.climatisation ? '• Clim' : ''}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleDeleteChambre(chambre.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition shrink-0"
                    title="Supprimer"
                  >
                    <NavIconCmp icon={<Trash2 className="w-4 h-4" />} />
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

function NavIconCmp({ icon }) {
  return icon;
}