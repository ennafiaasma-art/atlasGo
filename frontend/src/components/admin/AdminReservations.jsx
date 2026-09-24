import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AdminReservations() {
    const [reservations, setReservations] = useState([]);
    const [message, setMessage] = useState('');

    // Njibou les réservations lli 3nd l-admin (l-index f ReservationController kay-returni kolchi ila kan admin)
    useEffect(() => {
        axios.get('/api/reservations', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        .then(response => {
            setReservations(response.data);
        })
        .catch(error => {
            console.error("Erreur lors du chargement des réservations", error);
        });
    }, []);

    // Fonction bach n-baddlo l-statut (Accepter / Refuser)
    const handleStatusChange = (id, newStatus) => {
        axios.patch(`/api/reservations/${id}/status`, { statut: newStatus }, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        .then(response => {
            setMessage(response.data.message);
            // N-baddlou l-statut f l'affichage localement bla ma n-3awdou n-chargiw l-page
            setReservations(reservations.map(res => 
                res.id === id ? { ...res, statut: newStatus } : res
            ));
        })
        .catch(error => {
            console.error("Erreur lors de la mise à jour", error);
            setMessage("Erreur lors de la modification du statut.");
        });
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Gestion des Réservations (Admin)</h1>
            {message && <p className="mb-4 text-green-600 font-semibold">{message}</p>}

            <div className="space-y-4">
                {reservations.map(res => (
                    <div key={res.id} className="border p-4 rounded shadow flex justify-between items-center bg-white">
                        <div>
                            <p><strong>Client :</strong> {res.user?.name}</p>
                            <p><strong>Auberge / Chambre :</strong> {res.chambre?.auberge?.nom} (Chambre #{res.chambre_id})</p>
                            <p><strong>Période :</strong> Du {res.date_debut} au {res.date_fin}</p>
                            <p><strong>Statut :</strong> <span className="font-bold text-blue-600">{res.statut}</span></p>
                        </div>
                        
                        {/* Boutons d'action dyal l-admin */}
                        <div className="space-x-2">
                            <button 
                                onClick={() => handleStatusChange(res.id, 'confirmee')}
                                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                            >
                                Accepter
                            </button>
                            <button 
                                onClick={() => handleStatusChange(res.id, 'refusee')}
                                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                            >
                                Refuser
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}