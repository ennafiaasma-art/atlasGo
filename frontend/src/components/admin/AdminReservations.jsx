import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AdminReservations() {
    const [reservations, setReservations] = useState([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem('token');

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/reservations', {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
            const dataList = Array.isArray(response.data) 
                ? response.data 
                : response.data.reservations || response.data.data || [];
            setReservations(dataList);
            setLoading(false);
        })
        .catch(error => {
            console.error("Erreur lors du chargement des réservations", error);
            setLoading(false);
        });
    }, [token]);

    const handleStatusChange = (id, newStatus) => {
        axios.patch(`http://127.0.0.1:8000/api/reservations/${id}/status`, { statut: newStatus }, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
            setMessage(response.data.message || "Statut mis à jour avec succès.");
            setReservations(reservations.map(res => 
                res.id === id ? { ...res, statut: newStatus } : res
            ));
        })
        .catch(error => {
            console.error("Erreur lors de la mise à jour", error);
            setMessage("Erreur lors de la modification du statut.");
        });
    };

    if (loading) {
        return <div className="p-6 text-slate-600">Chargement des réservations...</div>;
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold mb-4 text-slate-900">Gestion des Réservations</h1>
            {message && <p className="mb-4 text-emerald-600 font-semibold">{message}</p>}

            {reservations.length === 0 ? (
                <p className="text-slate-500">Aucune réservation trouvée.</p>
            ) : (
                <div className="space-y-4">
                    {reservations.map(res => (
                        <div key={res.id} className="border border-slate-200 p-4 rounded-xl shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white">
                            <div>
                                <p className="text-sm font-medium text-slate-900"><strong>Client :</strong> {res.user?.name || 'Client inconnu'}</p>
                                <p className="text-sm text-slate-600"><strong>Auberge / Chambre :</strong> {res.chambre?.auberge?.nom || 'N/A'} (Chambre #{res.chambre_id})</p>
                                <p className="text-sm text-slate-600"><strong>Période :</strong> Du {res.date_debut} au {res.date_fin}</p>
                                <p className="text-sm text-slate-600"><strong>Statut :</strong> <span className="font-bold text-blue-600 uppercase text-xs px-2 py-0.5 bg-blue-50 rounded-full">{res.statut}</span></p>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={() => handleStatusChange(res.id, 'confirmed')}
                                    className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-emerald-700 transition"
                                >
                                    Accepter
                                </button>
                                <button 
                                    onClick={() => handleStatusChange(res.id, 'cancelled')}
                                    className="bg-rose-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-rose-700 transition"
                                >
                                    Refuser
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}