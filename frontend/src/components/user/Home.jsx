import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [user, setUser] = useState(null);
  const [destinations, setDestinations] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  // 1. Verifii wach l'user connecté mli toul l'page
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token) {
      // Jib les infos dyal l'user
      fetch('http://127.0.0.1:8000/api/user', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) {
          setUser(data);
          // Ila kan connecté, jib les données dyalu (Réservations & Favoris)
          fetchUserData(token);
        }
      });
    }

    // Jib la liste dyal destinations 3adya
    fetch('http://127.0.0.1:8000/api/destination/recerch')
      .then(res => res.json())
      .then(data => setDestinations(data))
      .catch(err => console.log(err));
  }, []);

  // Fonction bach tjib les données dyal l'user
  const fetchUserData = (token) => {
    fetch('http://127.0.0.1:8000/api/user/dashboard-data', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    })
    .then(res => res.ok ? res.json() : null)
    .then(data => {
      if (data) {
        setReservations(data.reservations || []);
        setFavorites(data.favorites || []);
      }
    });
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    window.location.reload();
  };

  return (
    <div className="font-sans p-5 max-w-7xl mx-auto">
      
      {/* --- NAVBAR --- */}
      <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-8">
        <h2 className="text-2xl font-bold text-gray-800">AtlasGo</h2>
        <div>
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-gray-700"><b>{user.name}</b></span>
              <button 
                onClick={handleLogout} 
                className="bg-red-600 hover:bg-red-700 text-white border-none px-3 py-1.5 cursor-pointer rounded text-sm transition-colors"
              >
                Déconnexion
              </button>
            </div>
          ) : (
            <button 
              onClick={() => navigate('/login')} 
              className="bg-green-600 hover:bg-green-700 text-white border-none px-4 py-2 cursor-pointer rounded text-sm transition-colors"
            >
              Se connecter
            </button>
          )}
        </div>
      </div>

      {/* --- HERO / SEARCH --- */}
      <div className="text-center my-10">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Bienvenue à Béni Mellal-Khénifra</h1>
        <p className="text-gray-600">Trouvez vos destinations et chambres préférées facilement.</p>
      </div>

      {/* --- Espace Personnel (Réservations & Favoris) --- */}
      {user && (
        <div className="bg-gray-50 p-6 rounded-lg mb-10 border border-slate-200 shadow-sm">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Espace Personnel</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Les Réservations */}
            <div className="bg-white p-5 rounded-md shadow-sm border border-gray-100">
              <h4 className="font-medium text-gray-700 mb-3">Mes Réservations</h4>
              {reservations.length > 0 ? (
                <ul className="pl-5 list-disc space-y-1 text-sm text-gray-600">
                  {reservations.map(res => (
                    <li key={res.id}>Chambre: {res.room_title} (Du {res.check_in} au {res.check_out})</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm">Aucune réservation pour le moment.</p>
              )}
            </div>

            {/* Les Favoris */}
            <div className="bg-white p-5 rounded-md shadow-sm border border-gray-100">
              <h4 className="font-medium text-gray-700 mb-3">Mes Favoris</h4>
              {favorites.length > 0 ? (
                <ul className="pl-5 list-disc space-y-1 text-sm text-gray-600">
                  {favorites.map(fav => (
                    <li key={fav.id}>{fav.title} - {fav.ville}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm">Aucun favori enregistré.</p>
              )}
            </div>

          </div>
        </div>
      )}

      {/* --- DESTINATIONS DISPONIBLES --- */}
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Destinations Disponibles</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {destinations.map(item => (
            <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="p-4">
                <h4 className="font-bold text-gray-800 text-lg mb-1">{item.title || item.nom}</h4>
                <p className="text-gray-500 text-sm">{item.ville}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}