import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Menu,
  Bell,
  Star,
  MapPin,
  Calendar,
  Users,
  Compass,
  Bed,
  Activity,
  Heart,
  User,
  Settings,
  LogOut,
  ChevronRight,
  Search,
  X
} from 'lucide-react';

export default function UserDashboard() {
  const [user, setUser] = useState(null);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLoading, setUserLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  // Stats affichées dans les 4 cartes du haut
  const [stats, setStats] = useState({
    destinations: 0,
    reservations: 0,
    activites: 0,
    favoris: 0
  });
  const [statsLoading, setStatsLoading] = useState(true);

  // Réservations à venir affichées dans la colonne de droite
  const [upcomingReservations, setUpcomingReservations] = useState([]);
  const [reservationsLoading, setReservationsLoading] = useState(true);

  // État pour gérer la destination sélectionnée pour le Modal
  const [selectedDestination, setSelectedDestination] = useState(null);

  // Garde en mémoire toutes les destinations chargées au départ,
  // utilisées comme filet de sécurité si la recherche serveur échoue
  const [allDestinations, setAllDestinations] = useState([]);
  // Compteur pour ignorer les réponses obsolètes (anti race condition)
  const searchRequestId = React.useRef(0);
  // Timer de debounce pour éviter un appel API à chaque frappe
  const debounceTimer = React.useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    fetchUserData(token);
    fetchDestinations(token, '');
    fetchReservationsData(token);
  }, [navigate]);

  // Récupérer les informations de l'utilisateur connecté depuis Laravel
  const fetchUserData = async (token) => {
    setUserLoading(true);
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
    } catch (err) {
      console.error("Erreur de récupération de l'utilisateur:", err);
      if (err.response && err.response.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      setUserLoading(false);
    }
  };

  const fetchDestinations = async (token, search) => {
    setLoading(true);
    // Chaque appel reçoit un id ; si une réponse plus récente est déjà arrivée,
    // on ignore ce résultat-ci (évite l'affichage de résultats obsolètes).
    const requestId = ++searchRequestId.current;

    try {
      const url = search && search.trim() !== ''
        ? 'http://127.0.0.1:8000/api/destinations/recherch'
        : 'http://127.0.0.1:8000/api/destinations';

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      if (search && search.trim() !== '') {
        config.params = { search: search };
      }

      const response = await axios.get(url, config);
      if (requestId !== searchRequestId.current) return; // réponse obsolète

      let list = [];
      if (response.data && response.data.destinations) {
        list = response.data.destinations;
      } else if (Array.isArray(response.data)) {
        list = response.data;
      }

      setDestinations(list);
      // On garde la liste complète (recherche vide) comme filet de sécurité
      if (!search || search.trim() === '') {
        setAllDestinations(list);
        setStats((prev) => ({ ...prev, destinations: list.length }));
      }
      setError(null);
    } catch (err) {
      if (requestId !== searchRequestId.current) return;
      console.error('Erreur de connexion API (recherche):', err.response?.status, err.response?.data || err.message);

      // Filet de sécurité : si l'endpoint de recherche échoue (404/500/route
      // inexistante), on filtre localement parmi les destinations déjà chargées
      // pour que la barre de recherche reste utilisable.
      if (search && search.trim() !== '' && allDestinations.length > 0) {
        const term = search.trim().toLowerCase();
        const filtered = allDestinations.filter((d) =>
          (d.nom_destination || d.nom || '').toLowerCase().includes(term) ||
          (d.ville || '').toLowerCase().includes(term) ||
          (d.province || '').toLowerCase().includes(term)
        );
        setDestinations(filtered);
        setError(null);
      } else {
        setError('Impossible de charger les données du serveur.');
      }
    } finally {
      if (requestId === searchRequestId.current) setLoading(false);
    }
  };

  // Statistiques + réservations à venir, calculées à partir de /api/reservations
  // (il n'existe pas de route dédiée /dashboard/stats ou /reservations/upcoming
  // dans ton backend, donc on dérive tout depuis la liste complète des réservations)
  const fetchReservationsData = async (token) => {
    setStatsLoading(true);
    setReservationsLoading(true);
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/reservations', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const raw = response.data.reservations || response.data.data || response.data || [];
      const reservations = Array.isArray(raw) ? raw : [];

      // Log une fois pour vérifier la vraie forme des champs et ajuster si besoin
      if (reservations.length > 0) {
        console.log('Exemple de réservation reçue de /api/reservations:', reservations[0]);
      }

      setStats((prev) => ({ ...prev, reservations: reservations.length }));

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const upcoming = reservations
        .map((r) => {
          const dateStr = r.date_debut || r.date_reservation || r.date || r.check_in;
          return { ...r, __date: dateStr ? new Date(dateStr) : null };
        })
        .filter((r) => r.__date && r.__date >= today)
        .sort((a, b) => a.__date - b.__date)
        .slice(0, 3)
        .map((r) => ({
          id: r.id,
          nom: r.auberge?.nom || r.destination?.nom_destination || r.nom || 'Réservation',
          lieu: r.auberge?.ville || r.destination?.ville || r.ville || '',
          date: r.__date ? r.__date.toLocaleDateString('fr-FR') : '',
          statut: r.statut,
          image: r.auberge?.image || r.destination?.image || r.image
        }));

      setUpcomingReservations(upcoming);
    } catch (err) {
      console.error('Erreur de récupération des réservations:', err.response?.status, err.response?.data || err.message);
      setStats((prev) => ({ ...prev, reservations: 0 }));
      setUpcomingReservations([]);
    } finally {
      setStatsLoading(false);
      setReservationsLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Debounce : on attend 350ms après la dernière frappe avant d'appeler l'API
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      const token = localStorage.getItem('token');
      fetchDestinations(token, value);
    }, 350);
  };

  // Nettoyage du timer au démontage du composant
  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

  const handleLogout = async () => {
    const token = localStorage.getItem('token');
    try {
      if (token) {
        await axios.post('http://127.0.0.1:8000/api/logout', {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    } catch (err) {
      console.error('Erreur lors de la déconnexion:', err);
    } finally {
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  const userName = user?.name || 'Utilisateur';

  const statCards = [
    {
      key: 'destinations',
      label: 'Destinations visitées',
      value: stats.destinations,
      sub: 'Sites découverts',
      icon: MapPin,
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-700'
    },
    {
      key: 'reservations',
      label: 'Réservations',
      value: stats.reservations,
      sub: 'Réservations effectuées',
      icon: Calendar,
      iconBg: 'bg-sky-100',
      iconColor: 'text-sky-700'
    },
    {
      key: 'activites',
      label: 'Activités',
      value: stats.activites,
      sub: 'Bientôt disponible',
      icon: Activity,
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-700',
      available: false
    },
    {
      key: 'favoris',
      label: 'Favoris',
      value: stats.favoris,
      sub: 'Bientôt disponible',
      icon: Heart,
      iconBg: 'bg-violet-100',
      iconColor: 'text-violet-700',
      available: false
    }
  ];

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-100 flex flex-col justify-between p-4 flex-shrink-0">
        <div>
          <div className="flex items-center gap-3 px-2 py-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-emerald-800 flex items-center justify-center text-white font-bold">
              <Compass className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm text-slate-800 leading-tight">Béni Mellal</span>
              <span className="font-bold text-sm text-emerald-800 leading-tight">Khénifra</span>
            </div>
          </div>

          <nav className="space-y-1">
            <a href="#" className="flex items-center gap-3 px-4 py-3 bg-emerald-900 text-white rounded-xl font-medium text-sm shadow-sm">
              <Compass className="w-4 h-4" />
              <span>Tableau de bord</span>
            </a>
            <button
              onClick={() => fetchDestinations(localStorage.getItem('token'), '')}
              className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 hover:text-slate-800 rounded-xl font-medium text-sm transition"
            >
              <MapPin className="w-4 h-4" />
              <span>Destinations</span>
            </button>
            <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 hover:text-slate-800 rounded-xl font-medium text-sm transition">
              <Activity className="w-4 h-4" />
              <span>Activités</span>
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 hover:text-slate-800 rounded-xl font-medium text-sm transition">
              <Bed className="w-4 h-4" />
              <span>Hébergements</span>
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 hover:text-slate-800 rounded-xl font-medium text-sm transition">
              <Calendar className="w-4 h-4" />
              <span>Mes réservations</span>
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 hover:text-slate-800 rounded-xl font-medium text-sm transition">
              <Heart className="w-4 h-4" />
              <span>Favoris</span>
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 hover:text-slate-800 rounded-xl font-medium text-sm transition">
              <User className="w-4 h-4" />
              <span>Profil</span>
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 hover:text-slate-800 rounded-xl font-medium text-sm transition">
              <Settings className="w-4 h-4" />
              <span>Paramètres</span>
            </a>
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-red-50 hover:text-red-600 rounded-xl font-medium text-sm transition w-full"
        >
          <LogOut className="w-4 h-4" />
          <span>Déconnexion</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto flex flex-col">
        {/* Topbar */}
        <header className="bg-white border-b border-slate-100 px-8 py-3 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <Menu className="w-5 h-5 text-slate-400 lg:hidden" />
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-slate-600 relative rounded-full hover:bg-slate-50">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <div className="flex items-center gap-3 pl-2 border-l border-slate-100">
              <div className="w-8 h-8 rounded-full bg-emerald-800 flex items-center justify-center text-white font-bold text-xs uppercase">
                {userLoading ? '...' : userName.charAt(0)}
              </div>
              <span className="text-sm font-semibold text-slate-700">
                {userLoading ? 'Chargement...' : userName}
              </span>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="p-8 space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                Bonjour, {userLoading ? '...' : userName} 👋
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Découvrez les merveilles de Béni Mellal-Khénifra
              </p>
            </div>

            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Rechercher une destination..."
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-800/20 focus:border-emerald-800 transition shadow-sm"
              />
            </div>
          </div>

          {/* Cartes statistiques */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.key}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center gap-3"
                >
                  <div className={`w-10 h-10 rounded-xl ${card.iconBg} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-5 h-5 ${card.iconColor}`} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-lg font-bold text-slate-900 leading-tight">
                      {card.available === false ? '—' : (statsLoading ? '—' : card.value)}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">{card.sub}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Grille principale : Destinations + Réservations à venir */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Colonne gauche : destinations populaires */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-slate-800 text-base">Destinations populaires</h2>
                <button className="text-xs font-semibold text-emerald-800 flex items-center gap-1 hover:underline">
                  Voir tout <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {error && (
                <p className="text-xs text-red-500 bg-red-50 p-3 rounded-xl">{error}</p>
              )}

              {loading ? (
                <p className="text-xs text-slate-400">Chargement des destinations...</p>
              ) : destinations.length === 0 ? (
                <p className="text-xs text-slate-400">Aucune destination trouvée.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {destinations.map((dest) => (
                    <div
                      key={dest.id}
                      onClick={() => setSelectedDestination(dest)}
                      className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition cursor-pointer group"
                    >
                      <div className="relative h-36 overflow-hidden bg-slate-100">
                        <img
                          src={
                            dest.image
                              ? (dest.image.startsWith('http') ? dest.image : `http://127.0.0.1:8000/storage/${dest.image}`)
                              : 'https://images.unsplash.com/photo-1546484475-7f7bd55792da?auto=format&fit=crop&w=800&q=80'
                          }
                          alt={dest.nom_destination || 'Destination'}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                        <button
                          onClick={(e) => { e.stopPropagation(); }}
                          className="absolute top-2.5 right-2.5 p-1.5 bg-white/80 backdrop-blur-md rounded-full text-slate-600 hover:text-red-500 transition"
                        >
                          <Heart className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="p-3.5 space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-bold text-sm text-slate-800 truncate">
                            {dest.nom_destination || dest.nom || 'Destination Sans Nom'}
                          </h3>
                          <div className="flex items-center gap-1 text-[11px] font-bold text-slate-700 flex-shrink-0">
                            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                            <span>{dest.note ?? '4.8'}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          <MapPin className="w-3 h-3 text-emerald-700" />
                          <span>{dest.ville ? `${dest.ville}, ` : ''}{dest.province || 'Azilal'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Bannière d'invitation à l'aventure */}
              <div className="relative rounded-2xl overflow-hidden mt-2 min-h-[140px] flex items-center bg-emerald-900">
                <img
                  src="https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=80"
                  alt="Aventure"
                  className="absolute inset-0 w-full h-full object-cover opacity-60"
                />
                <div className="relative z-10 p-6">
                  <h3 className="text-white font-bold text-lg">Partez à l'aventure !</h3>
                  <p className="text-white/80 text-xs mt-1 mb-4 max-w-xs">
                    Découvrez des paysages exceptionnels et des activités uniques au cœur de la région.
                  </p>
                  <button className="bg-white text-emerald-900 text-xs font-semibold px-4 py-2 rounded-lg hover:bg-slate-100 transition">
                    Explorer maintenant
                  </button>
                </div>
              </div>
            </div>

            {/* Colonne droite : prochaines réservations */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-slate-800 text-base">Mes prochaines réservations</h2>
                <button className="text-xs font-semibold text-emerald-800 flex items-center gap-1 hover:underline">
                  Voir tout <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-3">
                {reservationsLoading ? (
                  <p className="text-xs text-slate-400">Chargement...</p>
                ) : upcomingReservations.length === 0 ? (
                  <p className="text-xs text-slate-400">Aucune réservation à venir.</p>
                ) : (
                  upcomingReservations.map((res) => (
                    <div
                      key={res.id}
                      className="bg-white rounded-2xl border border-slate-100 shadow-sm p-3 flex gap-3"
                    >
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                        <img
                          src={
                            res.image
                              ? (res.image.startsWith('http') ? res.image : `http://127.0.0.1:8000/storage/${res.image}`)
                              : 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=400&q=80'
                          }
                          alt={res.nom || 'Réservation'}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-xs text-slate-800 truncate">{res.nom}</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">{res.lieu}</p>
                        <div className="flex items-center justify-between mt-1.5">
                          <span className="text-[11px] text-slate-500 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {res.date}
                          </span>
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                              res.statut === 'confirmee'
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-amber-100 text-amber-700'
                            }`}
                          >
                            {res.statut === 'confirmee' ? 'Confirmée' : 'En attente'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modal de Détails */}
      {selectedDestination && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="relative h-56 bg-slate-100">
              <img
                src={
                  selectedDestination.image
                    ? (selectedDestination.image.startsWith('http') ? selectedDestination.image : `http://127.0.0.1:8000/storage/${selectedDestination.image}`)
                    : 'https://images.unsplash.com/photo-1546484475-7f7bd55792da?auto=format&fit=crop&w=800&q=80'
                }
                alt={selectedDestination.nom_destination}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedDestination(null)}
                className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-md rounded-full text-slate-700 hover:bg-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {selectedDestination.nom_destination || selectedDestination.nom}
                  </h2>
                  <p className="text-xs text-emerald-800 font-semibold flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {selectedDestination.ville ? `${selectedDestination.ville}, ` : ''}{selectedDestination.province}
                  </p>
                </div>
                <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-lg text-amber-700 text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{selectedDestination.note ?? '4.8'}</span>
                </div>
              </div>

              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Description</h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {selectedDestination.description || 'Aucune description disponible pour cette destination.'}
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setSelectedDestination(null)}
                  className="w-full py-3 bg-emerald-900 hover:bg-emerald-950 text-white font-semibold text-xs rounded-xl transition"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
