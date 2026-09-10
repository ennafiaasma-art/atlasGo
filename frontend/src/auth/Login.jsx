import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn, Compass, Trees, Loader } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        const userToken = data.token || data.access_token || data.authorisation?.token;

        if (userToken) {
          localStorage.setItem('token', userToken);
          
          if (data.user) {
            localStorage.setItem('user', JSON.stringify(data.user));
          }

          navigate('/user-dashboard', { replace: true });
        } else {
          setError("Token non trouvé dans la réponse.");
        }
      } else {
        setError(data.message || 'Email ou mot de passe incorrect.');
      }
    } catch (err) {
      console.error('Erreur de connexion:', err);
      setError('Impossible de se connecter au serveur.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen w-full bg-cover bg-center flex items-center justify-start p-4 lg:p-12 relative"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2000&auto=format&fit=crop')`
      }}
    >
      <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]"></div>

      <div className="relative z-10 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[85vh]">
        <div className="lg:col-span-6 bg-white/95 backdrop-blur-md rounded-3xl p-8 lg:p-10 shadow-2xl border border-white/40 max-w-lg w-full mx-auto">
          
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-emerald-800/10 flex items-center justify-center text-emerald-800">
              <Trees className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-extrabold text-lg text-emerald-950 tracking-tight">Béni Mellal</span>
              <span className="font-semibold text-sm text-emerald-700">Khénifra</span>
            </div>
          </div>

          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Se connecter</h1>
          <p className="text-sm text-gray-500 mb-6 leading-relaxed">
            Bienvenue ! Connectez-vous pour accéder à votre espace personnel.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            
            {/* Email */}
            <div className="relative">
              <Mail className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Adresse email" 
                className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 transition"
              />
            </div>

            {/* Mot de passe */}
            <div className="relative">
              <Lock className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                type={showPassword ? "text" : "password"} 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mot de passe" 
                className="w-full pl-11 pr-11 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 transition"
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 text-emerald-700 accent-emerald-700 rounded border-gray-300 cursor-pointer"
                />
                Se souvenir de moi
              </label>
              <a href="#" className="text-emerald-700 font-semibold hover:underline">
                Mot de passe oublié ?
              </a>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-900/20 mt-2 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Se connecter
                </>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-gray-600 mt-8 pt-4 border-t border-gray-100">
            Vous n'avez pas de compte ?{' '}
            <Link to="/register" className="text-emerald-700 font-bold hover:underline">
              Créer un compte
            </Link>
          </p>
        </div>

        <div className="hidden lg:flex lg:col-span-6 justify-center lg:justify-start items-start pt-12">
          <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/40 max-w-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-700/10 flex items-center justify-center shrink-0 text-emerald-700">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base mb-1">Ravi de vous revoir !</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Retrouvez vos itinéraires sauvegardés, vos destinations favorites et planifiez votre prochaine aventure.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;