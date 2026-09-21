import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CalendarDays, XCircle, CheckCircle2, Clock } from 'lucide-react';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

export default function VoirReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchReservations = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${API_BASE_URL}/reservations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = response.data?.reservations || response.data?.data || response.data;
      setReservations(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erreur de chargement des réservations", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleCancelReservation = async (id) => {
    if (!window.confirm("Wakha t-annuli had la réservation?")) return;

    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${API_BASE_URL}/reservations/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setReservations(reservations.filter((res) => res.id !== id));
    } catch (err) {
      console.error("Erreur annulation reservation", err);
      setErrorMsg("Imposible d'annuler cette réservation pour le moment.");
    }
  };

  if (loading) return <p className="text-xs text-slate-400 p-4">Chargement de vos réservations...</p>;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-extrabold text-slate-900">Mes Réservations</h2>
        <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-xl">
          Total : {reservations.length}
        </span>
      </div>

      {errorMsg && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
          {errorMsg}
        </div>
      )}

      {reservations.length === 0 ? (
        <div className="bg-white p-10 rounded-2xl border border-emerald-100 text-center text-xs text-slate-400 shadow-xs space-y-2">
          <CalendarDays className="w-8 h-8 mx-auto text-slate-300" />
          <p>pas de reservation pour le moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reservations.map((res) => (
            <div key={res.id} className="p-5 bg-white rounded-2xl border border-emerald-100 shadow-xs space-y-3 flex flex-col justify-between">
              <div className="space-y-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-xs text-slate-900">
                    {res.auberge?.nom || res.destination?.nom_destination || 'Réservation Auberge'}
                  </h3>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 ${
                    res.statut === 'annulee' 
                      ? 'bg-rose-50 text-rose-700' 
                      : 'bg-emerald-50 text-emerald-700'
                  }`}>
                    {res.statut === 'annulee' ? <XCircle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                    {res.statut || 'Confirmée'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  Date : {res.date_debut || res.date_reservation || 'Non spécifiée'}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-50 flex justify-end">
                {res.statut !== 'annulee' && (
                  <button
                    onClick={() => handleCancelReservation(res.id)}
                    className="px-3 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 text-[11px] font-bold rounded-xl transition flex items-center gap-1"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    Annuler
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}