import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Mail, Shield, MapPin, Calendar } from 'lucide-react';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

export default function Profile({ setActiveSection }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`${API_BASE_URL}/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const user = response.data?.user || response.data;
        setUserData(user);
      } catch (err) {
        console.error("Erreur chargement profil", err);
        setErrorMsg("Impossible de charger vos informations.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) return <p className="text-xs text-slate-400 p-4">Chargement de votre profil...</p>;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-extrabold text-slate-900">Mon Profil</h2>
        
      </div>

      {errorMsg && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
          {errorMsg}
        </div>
      )}

      <div className="bg-white p-8 rounded-3xl border border-emerald-100 shadow-xs space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
          <div className="w-16 h-16 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xl shadow-xs">
            {userData?.name?.charAt(0) || 'A'}
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">{userData?.name || 'Asma'}</h3>
            <p className="text-xs text-slate-500">{userData?.email || 'asma@example.com'}</p>
            <span className="inline-block mt-1 px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-md uppercase">
              {userData?.role || 'Voyageur'}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Informations Personnelles</h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
              <span className="text-slate-400 font-medium flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-400" /> Nom complet
              </span>
              <p className="font-bold text-slate-800">{userData?.name || 'Asma'}</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
              <span className="text-slate-400 font-medium flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" /> Adresse Email
              </span>
              <p className="font-bold text-slate-800">{userData?.email || '-'}</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
              <span className="text-slate-400 font-medium flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-slate-400" /> Rôle
              </span>
              <p className="font-bold text-slate-800 capitalize">{userData?.role || 'Voyageur'}</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
              <span className="text-slate-400 font-medium flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" /> Région
              </span>
              <p className="font-bold text-slate-800">Béni Mellal-Khénifra (Azilal)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}