import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User, Mail, Shield, MapPin, ArrowLeft, ShieldCheck } from 'lucide-react';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <p className="text-xs font-medium text-white bg-emerald-800 px-5 py-2.5 rounded-xl shadow-md">
          Chargement de votre profil...
        </p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen py-10 px-4 sm:px-6 lg:px-8 flex flex-col justify-center overflow-hidden">
      
      {/* Background Room / Hotel Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0 filter blur-[3px] scale-105"
        style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1920&auto=format&fit=crop')` 
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/80 via-emerald-950/70 to-slate-950/85 backdrop-blur-[2px]"></div>
      </div>

      {/* Main Content Box */}
      <div className="relative z-10 space-y-6 max-w-3xl mx-auto w-full bg-white/95 backdrop-blur-xl p-6 sm:p-8 rounded-3xl shadow-2xl border border-white/20">
        
        {/* Header with Title and Return Button */}
        <div className="flex flex-wrap justify-between items-center gap-4 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-2xl shadow-inner">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">Mon Profil</h2>
              <p className="text-xs text-slate-500">Consultez et gérez vos informations personnelles</p>
            </div>
          </div>

          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-xs font-semibold text-white bg-emerald-700 px-4 py-2.5 rounded-xl hover:bg-emerald-800 transition shadow-sm cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au Dashboard
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
            {errorMsg}
          </div>
        )}

        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-emerald-100 shadow-xs space-y-6">
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
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-slate-400 font-medium flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-emerald-600" /> Nom complet
                </span>
                <p className="font-bold text-slate-800">{userData?.name || 'Asma'}</p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-slate-400 font-medium flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-emerald-600" /> Adresse Email
                </span>
                <p className="font-bold text-slate-800">{userData?.email || '-'}</p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-slate-400 font-medium flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-emerald-600" /> Rôle
                </span>
                <p className="font-bold text-slate-800 capitalize">{userData?.role || 'Voyageur'}</p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-slate-400 font-medium flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" /> Région
                </span>
                <p className="font-bold text-slate-800">Béni Mellal-Khénifra (Azilal)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}