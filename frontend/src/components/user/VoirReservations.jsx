import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

export default function VoirReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReservations = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`${API_BASE_URL}/reservations`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setReservations(response.data?.reservations || response.data || []);
      } catch (err) {
        console.error("Erreur de chargement des réservations", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  if (loading) return <p className="text-xs text-slate-400">Chargement de vos réservations...</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-slate-800">Mes Réservations</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reservations.map((res) => (
          <div key={res.id} className="p-4 bg-white rounded-2xl border shadow-sm">
            <h3 className="font-bold text-sm text-slate-800">
              {res.auberge?.nom || res.destination?.nom_destination || 'Réservation'}
            </h3>
            <p className="text-xs text-slate-500">Date : {res.date_debut || res.date_reservation}</p>
            <span className="inline-block mt-2 text-[10px] px-2 py-1 bg-emerald-100 text-emerald-700 rounded-md">
              {res.statut || 'Confirmée'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}