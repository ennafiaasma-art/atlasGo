import React, { useEffect, useState } from 'react';
import { User, Shield, Plus, Trash2, Mail } from 'lucide-react';

export default function AdminProfileSection() {
  const [profile, setProfile] = useState({});
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'admin' });

  useEffect(() => {
    fetchProfileAndAdmins();
  }, []);

  const fetchProfileAndAdmins = () => {
    // Récupérer les informations de l'administrateur connecté via /api/me
    fetch('http://localhost:8000/api/me', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Accept': 'application/json' }
    })
      .then(res => res.json())
      .then(data => setProfile(data.data || data));

    // Récupérer la liste des administrateurs
    fetch('http://localhost:8000/api/admin/users', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Accept': 'application/json' }
    })
      .then(res => res.json())
      .then(data => {
        setAdmins(data.data || data);
        setLoading(false);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:8000/api/admin/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(formData)
    })
    .then(res => res.json())
    .then(() => {
      setShowModal(false);
      setFormData({ name: '', email: '', password: '', role: 'admin' });
      fetchProfileAndAdmins();
    });
  };

  const handleDelete = (id) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet administrateur ?")) {
      fetch(`http://localhost:8000/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
      .then(() => fetchProfileAndAdmins());
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3 text-emerald-700 font-semibold text-sm">
          <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          Chargement en cours...
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 space-y-8">
      {/* Section Profil de l'administrateur */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-emerald-100 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-2xl shadow-md">
            {profile.name ? profile.name.charAt(0).toUpperCase() : 'A'}
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900">{profile.name}</h1>
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
              <Mail className="w-3.5 h-3.5 text-emerald-600" /> {profile.email}
            </p>
            <span className="inline-block mt-2 px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-lg border border-emerald-200">
              Rôle : {profile.role || 'Admin'}
            </span>
          </div>
        </div>
      </div>

      {/* Section Gestion des Administrateurs */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-emerald-100 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-600" /> Liste des Administrateurs
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Ajouter ou supprimer des accès administrateurs dans le système.</p>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-sm flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Nouvel Admin
          </button>
        </div>

        {/* Tableau d'affichage des administrateurs */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase">
                <th className="pb-3 px-3">Nom</th>
                <th className="pb-3 px-3">Email</th>
                <th className="pb-3 px-3">Rôle</th>
                <th className="pb-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-xs">
              {admins.map((admin) => (
                <tr key={admin.id} className="hover:bg-emerald-50/30 transition">
                  <td className="py-3 px-3 font-bold text-slate-800">{admin.name}</td>
                  <td className="py-3 px-3 text-slate-500">{admin.email}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-1 bg-emerald-100/60 text-emerald-800 font-semibold rounded-lg text-[10px]">
                      {admin.role}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button 
                      onClick={() => handleDelete(admin.id)}
                      className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Fenêtre modale pour ajouter un administrateur */}
      {showModal && (
        <div className="fixed inset-0 bg-emerald-950/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md space-y-4 shadow-xl border border-emerald-100">
            <h3 className="font-bold text-slate-900 text-sm">Ajouter un Nouvel Administrateur</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-600">Nom complet</label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-emerald-600"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">Adresse Email</label>
                <input 
                  type="email" 
                  value={formData.email} 
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-emerald-600"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">Mot de passe</label>
                <input 
                  type="password" 
                  value={formData.password} 
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-emerald-600"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-semibold"
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition"
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