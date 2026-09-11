import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit3, Trash2, Eye, MapPin, X, Upload } from 'lucide-react';
import Swal from 'sweetalert2';

const DestinationsAdmin = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentDestination, setCurrentDestination] = useState(null);

  // Initial Form State
  const initialFormState = {
    nom: '',
    ville: '',
    province: '',
    description: '',
    image: null
  };

  const [formData, setFormData] = useState(initialFormState);
  const [imagePreview, setImagePreview] = useState(null);

  const API_URL = 'http://127.0.0.1:8000/api/destinations';
  const token = localStorage.getItem('token');

  // Helper Function: Formatting Storage URLs from Laravel
  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/150';
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    const cleanPath = imagePath.replace(/^(public\/|storage\/|\/)/, '');
    return `http://127.0.0.1:8000/storage/${cleanPath}`;
  };

  // Helper Function: Safely extract property values from objects or nested relationships
  const getFieldValue = (field) => {
    if (!field) return '';
    if (typeof field === 'object') return field.nom || field.name || field.titre || '';
    return field;
  };

  // Helper Function: Safely extract image path
  const getDestinationImage = (dest) => {
    if (!dest) return null;
    return dest.image || dest.image_url || dest.photo || dest.cover || null;
  };

  // 1. CONSULTER (Fetch List)
  const fetchDestinations = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setDestinations(Array.isArray(data) ? data : data.data || []);
      }
    } catch (error) {
      console.error('Erreur de chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, []);

  // Open Modal for Add/Edit
  const handleOpenModal = (dest = null) => {
    if (dest) {
      setCurrentDestination(dest);
      setFormData({
        nom: dest.nom || '',
        ville: getFieldValue(dest.ville || dest.ville_name),
        province: getFieldValue(dest.province || dest.province_name),
        description: dest.description || '',
        image: null
      });
      const imgPath = getDestinationImage(dest);
      setImagePreview(imgPath ? getImageUrl(imgPath) : null);
    } else {
      setCurrentDestination(null);
      setFormData(initialFormState);
      setImagePreview(null);
    }
    setIsModalOpen(true);
  };

  // Open Modal for Consulter Details
  const handleOpenViewModal = (dest) => {
    setCurrentDestination(dest);
    setIsViewModalOpen(true);
  };

  // Handle Image Selection from PC
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // 2. AJOUTER & MODIFIER (Submit using FormData)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const isEdit = !!currentDestination;
    
    const url = isEdit ? `${API_URL}/${currentDestination.id}` : API_URL;

    const dataToSend = new FormData();
    dataToSend.append('nom', formData.nom);
    dataToSend.append('ville', formData.ville);
    dataToSend.append('province', formData.province);
    dataToSend.append('description', formData.description || '');

    if (formData.image instanceof File) {
      dataToSend.append('image', formData.image);
    }

    if (isEdit) {
      dataToSend.append('_method', 'PUT');
    }

    try {
      const response = await fetch(url, {
        method: 'POST', 
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: dataToSend
      });

      if (response.ok) {
        setIsModalOpen(false);
        setFormData(initialFormState);
        setImagePreview(null);
        fetchDestinations();
        Swal.fire({
          icon: 'success',
          title: isEdit ? 'Modifié avec succès !' : 'Ajouté avec succès !',
          timer: 1500,
          showConfirmButton: false
        });
      } else {
        const errData = await response.json().catch(() => ({}));
        if (errData.errors) {
          const errorMessages = Object.values(errData.errors).flat().join('<br/>');
          Swal.fire({
            icon: 'error',
            title: 'Erreur de validation',
            html: errorMessages
          });
        } else {
          Swal.fire('Erreur', errData.message || 'Une erreur est survenue lors de l\'enregistrement', 'error');
        }
      }
    } catch (error) {
      console.error('Erreur API:', error);
      Swal.fire('Erreur', 'Impossible de contacter le serveur', 'error');
    }
  };

  // 3. SUPPRIMER
  const handleDelete = (id) => {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Cette action est irréversible !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e11d48',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Oui, supprimer !',
      cancelButtonText: 'Annuler'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
            headers: {
              'Accept': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.ok) {
            fetchDestinations();
            Swal.fire('Supprimé !', 'La destination a été supprimée.', 'success');
          } else {
            Swal.fire('Erreur', 'Impossible de supprimer cette destination.', 'error');
          }
        } catch (error) {
          console.error('Erreur de suppression:', error);
        }
      }
    });
  };

  // Filter Search
  const filteredDestinations = destinations.filter(d => {
    const nom = d.nom?.toLowerCase() || '';
    const ville = getFieldValue(d.ville || d.ville_name).toLowerCase();
    const province = getFieldValue(d.province || d.province_name).toLowerCase();
    const term = searchTerm.toLowerCase();

    return nom.includes(term) || ville.includes(term) || province.includes(term);
  });

  return (
    <div className="p-8 space-y-6 bg-[#F8FAFC] min-h-screen">
      
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Gestion des Destinations</h1>
          <p className="text-xs text-slate-500 mt-1">Ajoutez, modifiez, consultez et supprimez les destinations.</p>
        </div>

        <button 
          onClick={() => handleOpenModal()}
          className="bg-[#062C21] hover:bg-[#0A3A2C] text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-sm transition"
        >
          <Plus className="w-4 h-4" /> Ajouter une destination
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400" />
        <input 
          type="text"
          placeholder="Rechercher par nom, ville ou province..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full text-xs outline-none bg-transparent text-slate-700"
        />
      </div>

      {/* Table List (Consulter) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-400 font-semibold border-b border-slate-100">
              <tr>
                <th className="p-4">Destination</th>
                <th className="p-4">Ville</th>
                <th className="p-4">Province</th>
                <th className="p-4">Description</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-slate-400">Chargement...</td>
                </tr>
              ) : filteredDestinations.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-slate-400">Aucune destination trouvée.</td>
                </tr>
              ) : (
                filteredDestinations.map((dest) => {
                  const imgPath = getDestinationImage(dest);
                  const cityName = getFieldValue(dest.ville || dest.ville_name) || '-';
                  const provinceName = getFieldValue(dest.province || dest.province_name) || '-';

                  return (
                    <tr key={dest.id} className="hover:bg-slate-50 transition">
                      <td className="p-4 font-bold text-slate-800 flex items-center gap-3">
                        <img 
                          src={getImageUrl(imgPath)} 
                          alt={dest.nom || 'Destination'} 
                          className="w-10 h-10 rounded-xl object-cover shrink-0 border border-slate-200"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/150';
                          }}
                        />
                        <span>{dest.nom}</span>
                      </td>
                      <td className="p-4 text-slate-600">{cityName}</td>
                      <td className="p-4 text-slate-600">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-emerald-600" /> {provinceName}
                        </span>
                      </td>
                      <td className="p-4 text-slate-500 max-w-xs truncate">{dest.description || '-'}</td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => handleOpenViewModal(dest)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="Consulter"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleOpenModal(dest)}
                            className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition"
                            title="Modifier"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(dest.id)}
                            className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Ajouter / Modifier */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-xl relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-bold text-slate-900 mb-4">
              {currentDestination ? 'Modifier la destination' : 'Ajouter une destination'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nom de la destination</label>
                <input 
                  type="text" 
                  required
                  placeholder="ex: Cascades d'Ouzoud"
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-600 transition"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Ville</label>
                <input 
                  type="text" 
                  required
                  placeholder="ex: Tanaghmeilt"
                  value={formData.ville}
                  onChange={(e) => setFormData({ ...formData, ville: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-600 transition"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Province</label>
                <input 
                  type="text" 
                  required
                  placeholder="ex: Azilal"
                  value={formData.province}
                  onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-600 transition"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Image de la destination</label>
                <div className="border-2 border-dashed border-slate-200 hover:border-emerald-500 rounded-2xl p-4 text-center cursor-pointer transition bg-slate-50 relative">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  {imagePreview ? (
                    <div className="flex flex-col items-center gap-2">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-full h-32 object-cover rounded-xl border border-slate-200"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/150';
                        }}
                      />
                      <span className="text-[10px] text-slate-500 underline">Cliquer pour changer l'image</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1 text-slate-400 py-2">
                      <Upload className="w-6 h-6 text-emerald-600 mb-1" />
                      <span className="font-semibold text-slate-600">Choisir une image depuis votre PC</span>
                      <span className="text-[10px] text-slate-400">PNG, JPG, WEBP jusqu'à 5MB</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea 
                  rows="4"
                  placeholder="Description détaillée..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-600 transition resize-none"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2.5 rounded-xl bg-[#062C21] text-white font-bold hover:bg-[#0A3A2C] transition"
                >
                  {currentDestination ? 'Enregistrer' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Consulter Details */}
      {isViewModalOpen && currentDestination && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-xl relative">
            <button 
              onClick={() => setIsViewModalOpen(false)}
              className="absolute top-3 right-3 p-1.5 bg-black/40 text-white rounded-full hover:bg-black/60 transition z-10"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="h-48 relative">
              <img 
                src={getImageUrl(getDestinationImage(currentDestination))} 
                alt={currentDestination.nom} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/400';
                }}
              />
            </div>

            <div className="p-6 space-y-3">
              <div className="flex gap-2">
                {getFieldValue(currentDestination.ville || currentDestination.ville_name) && (
                  <span className="px-2.5 py-1 bg-slate-100 text-slate-800 font-bold text-[10px] rounded-md inline-block">
                    {getFieldValue(currentDestination.ville || currentDestination.ville_name)}
                  </span>
                )}
                {getFieldValue(currentDestination.province || currentDestination.province_name) && (
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 font-bold text-[10px] rounded-md inline-block">
                    {getFieldValue(currentDestination.province || currentDestination.province_name)}
                  </span>
                )}
              </div>
              <h2 className="text-lg font-black text-slate-900">{currentDestination.nom}</h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                {currentDestination.description || 'Aucune description disponible.'}
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default DestinationsAdmin;