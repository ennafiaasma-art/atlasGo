import React, { useEffect, useState } from 'react';
import { Users, Trash2, Mail } from 'lucide-react';

export default function AdminClientsSection() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = () => {
    fetch('http://127.0.0.1:8000/api/admin/clients', {
      headers: { 
        'Authorization': `Bearer ${localStorage.getItem('token')}`, 
        'Accept': 'application/json' 
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log("Données reçues des clients:", data);
        
        let clientsList = [];
        if (Array.isArray(data)) {
          clientsList = data;
        } else if (data && Array.isArray(data.data)) {
          clientsList = data.data;
        } else if (data && Array.isArray(data.users)) {
          clientsList = data.users;
        } else if (data && Array.isArray(data.clients)) {
          clientsList = data.clients;
        }
        
        setClients(clientsList);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erreur fetch clients:", err);
        setLoading(false);
      });
  };

  const handleDelete = (clientId) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce client ?")) return;

    fetch(`http://127.0.0.1:8000/api/admin/users/${clientId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Accept': 'application/json'
      }
    })
      .then(res => {
        if (res.ok) {
          setClients(clients.filter(client => client.id !== clientId));
        } else {
          alert("Erreur lors de la suppression du client.");
        }
      })
      .catch(err => console.error("Erreur suppression client:", err));
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
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-emerald-100 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-600" /> Liste des Utilisateurs (Clients)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Gérer les clients inscrits sur l'application AtlasGo.</p>
          </div>
          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl border border-emerald-200">
            Total : {clients.length}
          </span>
        </div>

        {/* Tableau des clients */}
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
              {clients.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-6 text-center text-slate-400">Aucun client inscrit pour le moment.</td>
                </tr>
              ) : (
                clients.map((client) => (
                  <tr key={client.id} className="hover:bg-emerald-50/30 transition">
                    <td className="py-3 px-3 font-bold text-slate-800">{client.name}</td>
                    <td className="py-3 px-3 text-slate-500 flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-emerald-600" /> {client.email}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-1 bg-slate-100 text-slate-700 font-semibold rounded-lg text-[10px]">
                        {client.role || 'client'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button 
                        onClick={() => handleDelete(client.id)}
                        className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition"
                        title="Supprimer le client"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}