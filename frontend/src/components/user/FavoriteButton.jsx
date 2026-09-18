import React, { useState } from 'react';
import axios from 'axios';
import { Heart } from 'lucide-react';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

export default function FavoriteButton({ destinationId, initialIsFavorite = false, onFavoriteChange }) {
    const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
    const [loading, setLoading] = useState(false);

    const handleToggle = async (e) => {
        e.stopPropagation(); 
        if (loading) return;

        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            
            const response = await axios.post(`${API_BASE_URL}/favorites`, {
                destination_id: destinationId
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const newFavoriteState = !isFavorite;
            setIsFavorite(newFavoriteState);
            
            if (onFavoriteChange) {
                onFavoriteChange(destinationId, newFavoriteState);
            }

            console.log("Réponse favoris:", response.data);
        } catch (err) {
            console.error("Erreur favoris:", err);
            if (err.response?.status === 403) {
                alert("Accès refusé (403). Vérifiez votre connexion.");
            } else {
                alert("Erreur lors de la modification des favoris.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <button 
            onClick={handleToggle}
            disabled={loading}
            className="absolute top-3 right-3 p-2.5 bg-white/90 backdrop-blur-md rounded-full text-slate-600 hover:text-red-500 shadow-xs transition"
            title={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
        >
            <Heart className={`w-4 h-4 transition-all ${
                isFavorite 
                    ? 'text-red-500 fill-red-500 scale-110' 
                    : 'text-slate-400 hover:text-red-500'
            }`} />
        </button>
    );
}