import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, ShieldCheck, UserPlus, Trees } from 'lucide-react';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div 
      className="min-h-screen w-full bg-cover bg-center flex items-center justify-start p-4 lg:p-12 relative"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2000&auto=format&fit=crop')` // صورة الطبيعة والبحيرة
      }}
    >
      {/* Overlay خفيف يعطي ضبابة خفيفة خلف الكارت */}
      <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]"></div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[85vh]">
        
        {/* 1. Form Card (الجهة اليسرى) */}
        <div className="lg:col-span-6 bg-white/95 backdrop-blur-md rounded-3xl p-8 lg:p-10 shadow-2xl border border-white/40 max-w-lg w-full mx-auto">
          
          {/* Logo */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-emerald-800/10 flex items-center justify-center text-emerald-800">
              <Trees className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-extrabold text-lg text-emerald-950 tracking-tight">Béni Mellal</span>
              <span className="font-semibold text-sm text-emerald-700">Khénifra</span>
            </div>
          </div>

          {/* Header */}
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Créer un compte</h1>
          <p className="text-sm text-gray-500 mb-6 leading-relaxed">
            Rejoignez-nous et découvrez les merveilles de Béni Mellal-Khénifra.
          </p>

          {/* Form */}
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            
            {/* Nom complet & Nom d'utilisateur */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="relative">
                <User className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  placeholder="Nom complet" 
                  className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 transition"
                />
              </div>

              <div className="relative">
                <User className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  placeholder="Nom d'utilisateur" 
                  className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 transition"
                />
              </div>
            </div>

            {/* Email */}
            <div className="relative">
              <Mail className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                type="email" 
                placeholder="Email" 
                className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 transition"
              />
            </div>

            {/* Mot de passe */}
            <div className="relative">
              <Lock className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Mot de passe" 
                className="w-full pl-11 pr-11 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 transition"
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Confirmer le mot de passe */}
            <div className="relative">
              <Lock className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                type={showConfirmPassword ? "text" : "password"} 
                placeholder="Confirmer le mot de passe" 
                className="w-full pl-11 pr-11 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 transition"
              />
              <button 
                type="button" 
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Terms & Conditions Checkbox */}
            <div className="flex items-center gap-2 pt-1">
              <input 
                type="checkbox" 
                id="terms" 
                className="w-4 h-4 text-emerald-700 accent-emerald-700 rounded border-gray-300 cursor-pointer"
              />
              <label htmlFor="terms" className="text-xs text-gray-600 cursor-pointer">
                J'accepte les <a href="#" className="text-emerald-700 font-semibold hover:underline">Conditions d'utilisation</a> et la <a href="#" className="text-emerald-700 font-semibold hover:underline">Politique de confidentialité</a>
              </label>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-900/20 mt-2"
            >
              <UserPlus className="w-4 h-4" />
              Créer un compte
            </button>
          </form>

          {/* Footer Link */}
          <p className="text-center text-xs text-gray-600 mt-8 pt-4 border-t border-gray-100">
            Vous avez déjà un compte ?{' '}
            <Link to="/login" className="text-emerald-700 font-bold hover:underline">
              Se connecter
            </Link>
          </p>
        </div>

        {/* 2. Floating Info Card (الجهة اليمنى) */}
        <div className="hidden lg:flex lg:col-span-6 justify-center lg:justify-start items-start pt-12">
          <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/40 max-w-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-700/10 flex items-center justify-center shrink-0 text-emerald-700">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base mb-1">Explorez en toute confiance</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Créez votre compte pour accéder à des contenus exclusifs, sauvegarder vos favoris et bien plus encore.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Register;