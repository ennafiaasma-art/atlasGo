import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Plus, 
  Trash2, 
  X, 
  Tags,
  Search,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export default function GererCategorie({ token }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State (بلا editingCategorie حيت ما بقاش التعديل)
  const [showModal, setShowModal] = useState(false);
  
  // Messages & Errors
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  // Form State
  const [formData, setFormData] = useState({
    nom: '',
    description: ''
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/categories', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (Array.isArray(response.data)) {
        setCategories(response.data);
      } else if (response.data && response.data.categories) {
        setCategories(response.data.categories);
      }
    } catch (err) {
      console.error("Erreur lors du chargement des catégories:", err);
      setError("Impossible de charger la liste des catégories.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const openModal = () => {
    setError(null);
    setFieldErrors({});
    setFormData({
      nom: '',
      description: ''
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFieldErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    try {
      // Store (POST) - غير الإضافة بوحدها
      await axios.post('http://127.0.0.1:8000/api/categories', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Catégorie créée avec succès !');
      
      fetchCategories();
      closeModal();
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error("Erreur d'enregistrement:", err.response?.data);
      if (err.response && err.response.status === 422) {
        setFieldErrors(err.response.data.errors);
        setError("Veuillez corriger les erreurs dans le formulaire.");
      } else {
        setError(err.response?.data?.message || "Une erreur est survenue.");
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette catégorie ?")) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Catégorie supprimée avec succès !');
      fetchCategories();
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error("Erreur lors de la suppression:", err);
      setError("Impossible de supprimer cette catégorie.");
    }
  };

  const filteredCategories = categories.filter(cat => {
    const nomCat = cat.nom || cat.titre || '';
    return nomCat.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="p-3 sm:p-6 lg:p-8 space-y-6 bg-slate-50 min-h-screen w-full max-w-7xl mx-auto">
      
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Tags className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-800 shrink-0" />
            <span>Gestion des Catégories</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Gérez les catégories et organisez vos activités ou destinations
          </p>
        </div>

        <button
          onClick={openModal}
          className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-3 sm:py-2.5 bg-emerald-900 hover:bg-emerald-950 text-white rounded-xl font-semibold text-xs transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter une Catégorie</span>
        </button>
      </div>

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

      <div className="relative w-full max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Rechercher une catégorie..."
          className="w-full pl-10 pr-4 py-3 sm:py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-800/20 focus:border-emerald-800 transition shadow-sm"
        />
      </div>

      {loading ? (
        <p className="text-xs text-slate-400 text-center py-8">Chargement des catégories...</p>
      ) : filteredCategories.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl border border-slate-100 text-center text-slate-400 text-xs shadow-sm">
          Aucune catégorie trouvée.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredCategories.map((cat) => {
            const nomCat = cat.nom || cat.titre;
            return (
              <div key={cat.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-800 text-sm sm:text-base">{nomCat}</h3>
                    <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md">
                      {cat.activites ? `${cat.activites.length} activités` : ''}
                    </span>
                  </div>
                  {cat.description && (
                    <p className="text-xs text-slate-500 line-clamp-2">{cat.description}</p>
                  )}
                </div>

                {/* حيدنا الزر ديال التعديل وبقى غير زر الحذف */}
                <div className="flex items-center justify-end gap-1 pt-3 border-t border-slate-50">
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Ajout Uniquement */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl relative flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
              <h2 className="text-base font-bold text-slate-800">
                Ajouter une Catégorie
              </h2>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Nom de la catégorie</label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-3 py-2.5 sm:py-2 border rounded-xl text-xs outline-none transition ${
                    fieldErrors.nom ? 'border-red-500' : 'border-slate-200 focus:border-emerald-800'
                  }`}
                />
                {fieldErrors.nom && (
                  <p className="text-[11px] text-red-600 mt-1">{fieldErrors.nom[0]}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Description (optionnelle)</label>
                <textarea
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2.5 sm:py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-800"
                />
                {fieldErrors.description && (
                  <p className="text-[11px] text-red-600 mt-1">{fieldErrors.description[0]}</p>
                )}
              </div>

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