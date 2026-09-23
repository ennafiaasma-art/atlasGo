import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CalendarDays, XCircle, CheckCircle2, Clock, ArrowLeft, BedDouble } from 'lucide-react';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

export default function VoirReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900/40">
        <p className="text-sm font-medium text-white bg-emerald-800/80 px-6 py-3 rounded-2xl backdrop-blur-md shadow-lg">
          Chargement de vos réservations...
        </p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen py-10 px-4 sm:px-6 lg:px-8 flex flex-col justify-center overflow-hidden">
      
      <div 
        className="absolute inset-0 bg-cover bg-center z-0 filter blur-[2px] scale-105"
        style={{ backgroundImage: `url('/images/cambre.png')` }} 
      >
        <div className="absolute inset-0  from-emerald-950/80 via-slate-950/70 to-emerald-900/80 backdrop-blur-xs"></div>
      </div>

      {/* Contenu Principal */}
      <div className="relative z-10 space-y-6 max-w-5xl mx-auto w-full bg-white/95 backdrop-blur-xl p-6 sm:p-8 rounded-3xl shadow-2xl border border-white/20">
        
        <div className="flex flex-wrap justify-between items-center gap-4 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
             <button
              onClick={() => navigate('./user-dashboard')}
              className="flex items-center gap-2 text-xs font-semibold text-white bg-emerald-700 px-4 py-2.5 rounded-xl hover:bg-emerald-800 transition shadow-sm cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour au Dashboard
            </button>
            <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-2xl">
              <BedDouble className="w-6 h-6" />
            </div>
            <div>
              
              <h2 className="text-xl font-extrabold text-slate-900">Mes Réservations</h2>
              <p className="text-xs text-slate-500">Gérez vos séjours et auberges réservés</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1.5 rounded-xl shadow-xs">
              Total : {reservations.length}
            </span>

           
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
            {errorMsg}
          </div>
        )}

        {reservations.length === 0 ? (
          <div className="bg-slate-50/80 p-12 rounded-2xl border border-dashed border-slate-200 text-center text-xs text-slate-500 space-y-3">
            <CalendarDays className="w-10 h-10 mx-auto text-emerald-600/60" />
            <p className="text-sm font-semibold text-slate-700">Aucune réservation pour le moment.</p>
            <p className="text-slate-400">Explorez nos destinations et réservez votre prochaine auberge !</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reservations.map((res) => (
              <div key={res.id} className="p-5 bg-white rounded-2xl border border-emerald-100 shadow-sm hover:shadow-md transition space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-bold text-sm text-slate-900">
                      {res.auberge?.nom || res.destination?.nom_destination || 'Réservation Auberge'}
                    </h3>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shrink-0 ${
                      res.statut === 'annulee' 
                        ? 'bg-rose-50 text-rose-700' 
                        : 'bg-emerald-50 text-emerald-700'
                    }`}>
                      {res.statut === 'annulee' ? <XCircle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                      {res.statut || 'Confirmée'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-emerald-600" />
                    Date : <span className="font-medium text-slate-700">{res.date_debut || res.date_reservation || 'Non spécifiée'}</span>
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end">
                  {res.statut !== 'annulee' && (
                    <button
                      onClick={() => handleCancelReservation(res.id)}
                      className="px-3 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-bold rounded-xl transition flex items-center gap-1 cursor-pointer"
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
    </div>
  );
}