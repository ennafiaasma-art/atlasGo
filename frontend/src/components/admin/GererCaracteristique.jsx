import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, X, Sliders, CheckCircle, AlertCircle } from 'lucide-react';

export default function GererCaracteristique({ token, onBack }) {
  const [caracteristiques, setCaracteristiques] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  // Form State
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    vue: '',
    wifi: false,
    etage: '',
    climatisation: false,
    tv: false
  });

  useEffect(() => {
    fetchCaracteristiques();
  }, []);

  const fetchCaracteristiques = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/caracteristiques', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCaracteristiques(response.data);
    } catch (err) {
      console.error("Erreur chargement caractéristiques:", err);
      setError("Impossible de charger les caractéristiques.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await axios.post('http://127.0.0.1:8000/api/caracteristiques', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage("Caractéristique créée avec succès!");
      fetchCaracteristiques();
      setShowModal(false);
      setFormData({ vue: '', wifi: false, etage: '', climatisation: false, tv: false });
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error("Erreur création:", err.response?.data);
      setError("Erreur lors de la création de la caractéristique.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="text-xs text-emerald-800 font-semibold hover:underline">
            &larr; Retour aux chambres
          </button>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Sliders className="w-5 h-5 text-emerald-800" />
            <span>Gestion des Caractéristiques</span>
          </h2>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-900 hover:bg-emerald-950 text-white rounded-xl font-semibold text-xs transition"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter Caractéristique</span>
        </button>
      </div>

      {message && (
        <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <p className="text-xs text-slate-400 text-center py-8">Chargement...</p>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[11px] text-slate-500 uppercase">
                <th className="p-3">ID</th>
                <th className="p-3">Vue</th>
                <th className="p-3">Étage</th>
                <th className="p-3">Wifi</th>
                <th className="p-3">Climatisation</th>
                <th className="p-3">TV</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {caracteristiques.map((car) => (
                <tr key={car.id} className="hover:bg-slate-50/50">
                  <td className="p-3 font-medium">#{car.id}</td>
                  <td className="p-3">{car.vue || 'N/A'}</td>
                  <td className="p-3">{car.etage !== null ? car.etage : 'N/A'}</td>
                  <td className="p-3">{car.wifi ? '✅ Oui' : '❌ Non'}</td>
                  <td className="p-3">{car.climatisation ? '✅ Oui' : '❌ Non'}</td>
                  <td className="p-3">{car.tv ? '✅ Oui' : '❌ Non'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Ajout */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-sm">Ajouter une Caractéristique</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Vue (ex: Mer, Jardin)</label>
                <input
                  type="text"
                  name="vue"
                  value={formData.vue}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Étage</label>
                <input
                  type="number"
                  name="etage"
                  value={formData.etage}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-800"
                />
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2">
                <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    name="wifi"
                    checked={formData.wifi}
                    onChange={handleInputChange}
                    className="rounded text-emerald-800 focus:ring-emerald-800"
                  />
                  Wifi
                </label>

                <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    name="climatisation"
                    checked={formData.climatisation}
                    onChange={handleInputChange}
                    className="rounded text-emerald-800 focus:ring-emerald-800"
                  />
                  Clim
                </label>

                <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    name="tv"
                    checked={formData.tv}
                    onChange={handleInputChange}
                    className="rounded text-emerald-800 focus:ring-emerald-800"
                  />
                  TV
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-900 text-white rounded-xl text-xs font-semibold hover:bg-emerald-950"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}