<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DestinationController;
use App\Http\Controllers\Api\CategorieController;
use App\Http\Controllers\Api\ActiviteController;
use App\Http\Controllers\Api\AubergeController;
use App\Http\Controllers\Api\ChambreController;
use App\Http\Controllers\Api\CaracteristiqueController;
use App\Http\Controllers\Api\ReservationController;
use App\Http\Controllers\FavoriteController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| 1. Routes Publiques (Accessibles à tous les utilisateurs non connectés)
|--------------------------------------------------------------------------
*/

// Authentification
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login'])->name('login');

// Recherche et Consultation générale
Route::get('/destinations', [DestinationController::class, 'index']);
Route::get('/destinations/recherch', [DestinationController::class, 'rechercheDestinationParVille']);
Route::get('/categories', [CategorieController::class, 'index']);
Route::get('/activites', [ActiviteController::class, 'index']);

// Auberges & Chambres (Consultation publique)
Route::get('/auberges', [AubergeController::class, 'index']);
Route::get('/auberges/{id}', [AubergeController::class, 'show']);
Route::get('/auberges/{aubergeId}/chambres', [ChambreController::class, 'index']); // Lister les chambres d'une auberge spécifique

// Caractéristiques (Consultation publique pour l'affichage)
Route::get('/caracteristiques', [CaracteristiqueController::class, 'index']);


/*
|--------------------------------------------------------------------------
| 2. Routes Protégées (Réservées aux utilisateurs connectés - Auth Sanctum)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {

    // Gestion du Profil & Déconnexion
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Gestion des Réservations (Utilisateur connecté)
    Route::get('/reservations', [ReservationController::class, 'index']);
    Route::post('/reservations', [ReservationController::class, 'store']);
    Route::get('/reservations/{id}', [ReservationController::class, 'show']);
    Route::put('/reservations/{id}', [ReservationController::class, 'update']);
    Route::put('/reservations/{id}/cancel', [ReservationController::class, 'cancel']);
    Route::delete('/reservations/{id}', [ReservationController::class, 'destroy']);


    /*
    |--------------------------------------------------------------------------
    | 3. Routes Administrateur (Réservées aux admins uniquement)
    |--------------------------------------------------------------------------
    */
    Route::middleware('admin')->group(function () {

        // CRUD Destinations (Store, Update, Destroy)
        Route::apiResource('destinations', DestinationController::class)->except(['index', 'show']);

        // CRUD Catégories & Activités
        Route::apiResource('categories', CategorieController::class)->except(['index', 'show']);
        Route::apiResource('activites', ActiviteController::class)->except(['index', 'show']);

        // Gestion des Auberges (Admin) - Utilisation de POST pour l'update avec images (multipart/form-data)
        Route::post('/auberges', [AubergeController::class, 'store']);
        Route::post('/auberges/{id}', [AubergeController::class, 'update']);
        Route::delete('/auberges/{id}', [AubergeController::class, 'destroy']);
        Route::get('/auberges/{aubergeId}/caracteristiques', [CaracteristiqueController::class, 'getByAuberge']);
        // Gestion des Chambres (Admin) - Ajout et Suppression des chambres par auberge
        Route::post('/chambres', [ChambreController::class, 'store']);
        Route::post('/chambres/{id}', [ChambreController::class, 'update']);
        Route::delete('/chambres/{id}', [ChambreController::class, 'destroy']);

        // Gestion des Caractéristiques (Admin) - Ajout de nouvelles caractéristiques
        Route::post('/caracteristiques', [CaracteristiqueController::class, 'store']);
        Route::delete('/caracteristiques/{id}', [CaracteristiqueController::class, 'destroy']);
        Route::post('/caracteristiques', [CaracteristiqueController::class, 'store']);

        // Mise à jour du statut des réservations (Admin)
        Route::patch('/reservations/{id}/status', [ReservationController::class, 'updateStatus']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/favorites', [FavoriteController::class, 'index']); // لجلب قائمة المفضلة
    Route::post('/favorites', [FavoriteController::class, 'store']); // للإضافة أو الإزالة (Toggle)
});

    });
    });

