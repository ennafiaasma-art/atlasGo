import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CalendarDays, XCircle, CheckCircle2, Clock, BedDouble, Building2, Tag, AlertCircle } from 'lucide-react';

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
    if (!window.confirm("Voulez-vous vraiment annuler cette réservation ?")) return;

    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${API_BASE_URL}/reservations/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setReservations(reservations.filter((res) => res.id !== id));
    } catch (err) {
      console.error("Erreur annulation reservation", err);
      setErrorMsg("Impossible d'annuler cette réservation pour le moment.");
    }
  };

  const getReservationPrice = (res) => {
    if (res.prix_total !== undefined && res.prix_total !== null && res.prix_total !== 0) return res.prix_total;
    if (res.prix !== undefined && res.prix !== null && res.prix !== 0) return res.prix;
    if (res.montant !== undefined && res.montant !== null && res.montant !== 0) return res.montant;

    const pricePerNight = res.chambre?.prix || res.chambre?.prix_nuit || 0;

    const startDate = res.date_debut || res.date_start || res.date_reservation;
    const endDate = res.date_fin || res.date_end;

    if (startDate && endDate && pricePerNight > 0) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      const days = diffDays > 0 ? diffDays : 1;
      return pricePerNight * days;
    }

    return pricePerNight > 0 ? pricePerNight : '0';
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
          <p>Pas de réservation pour le moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reservations.map((res) => {
            const statut = (res.statut || 'pending').toLowerCase();
            const price = getReservationPrice(res);

            return (
              <div key={res.id} className="p-5 bg-white rounded-2xl border border-emerald-100 shadow-xs space-y-4 flex flex-col justify-between">
                
                <div className="space-y-3">
                  {/* En-tête : Nom de l'auberge et Statut (Pending en Orange) */}
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <h3 className="font-bold text-xs text-slate-900">
                        {res.auberge?.nom || res.auberge_nom || 'Auberge Atlas'}
                      </h3>
                    </div>

                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 flex-shrink-0 ${
                      statut === 'annulee' 
                        ? 'bg-rose-50 text-rose-700' 
                        : statut === 'pending' || statut === 'en attente'
                        ? 'bg-orange-50 text-orange-600 border border-orange-200'
                        : 'bg-emerald-50 text-emerald-700'
                    }`}>
                      {statut === 'annulee' ? (
                        <XCircle className="w-3 h-3" />
                      ) : statut === 'pending' || statut === 'en attente' ? (
                        <AlertCircle className="w-3 h-3 text-orange-500" />
                      ) : (
                        <CheckCircle2 className="w-3 h-3" />
                      )}
                      {res.statut || 'pending'}
                    </span>
                  </div>

                  {/* Détails : Type de chambre, Prix total calculé et Date */}
                  <div className="bg-slate-50 p-3 rounded-xl space-y-2 text-xs">
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="flex items-center gap-1.5 font-medium">
                        <BedDouble className="w-3.5 h-3.5 text-emerald-700" />
                        Type de chambre :
                      </span>
                      <span className="font-bold text-slate-900">
                        {res.chambre?.type || res.type_chambre || res.chambre_nom || 'Simple'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-slate-600">
                      <span className="flex items-center gap-1.5 font-medium">
                        <Tag className="w-3.5 h-3.5 text-emerald-700" />
                        Prix total :
                      </span>
                      <span className="font-extrabold text-emerald-700">
                        {price} MAD
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-slate-600 pt-1 border-t border-slate-200/60">
                      <span className="flex items-center gap-1.5 font-medium">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        Date de réservation :
                      </span>
                      <span className="font-semibold text-slate-700">
                        {res.date_debut || res.date_reservation || 'Non spécifiée'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bouton d'annulation */}
                <div className="pt-2 border-t border-slate-50 flex justify-end">
                  {statut !== 'annulee' && (
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
            );
          })}
        </div>
      )}
    </div>
  );
}