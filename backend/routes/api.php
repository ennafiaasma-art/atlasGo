<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DestinationController;
use App\Http\Controllers\Api\CategorieController;
use App\Http\Controllers\Api\AubergeController;
use App\Http\Controllers\Api\ChambreController;
use App\Http\Controllers\Api\CaracteristiqueController;
use App\Http\Controllers\Api\ReservationController;
use App\Http\Controllers\Api\AdminUserController;
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

// Auberges & Chambres (Consultation publique)
Route::get('/auberges', [AubergeController::class, 'index']);
Route::get('/auberges/{id}', [AubergeController::class, 'show']);
Route::get('/auberges/{aubergeId}/chambres', [ChambreController::class, 'index']);

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

Route::get('/auberges/{id}/chambres', [AubergeController::class, 'getAvailableChambres']);
    // Gestion des Favoris
    Route::get('/favorites', [FavoriteController::class, 'index']);
    Route::post('/favorites', [FavoriteController::class, 'store']);

    /*
    |--------------------------------------------------------------------------
    | 3. Routes Administrateur (Réservées aux admins uniquement)
    |--------------------------------------------------------------------------
    */
    Route::middleware('admin')->group(function () {

        // CRUD Destinations
        Route::apiResource('destinations', DestinationController::class)->except(['index', 'show']);

        // CRUD Catégories
        Route::apiResource('categories', CategorieController::class)->except(['index', 'show']);

        // Gestion des Auberges (Admin)
        Route::post('/auberges', [AubergeController::class, 'store']);
Route::match(['put', 'patch', 'post'], '/auberges/{id}', [AubergeController::class, 'update']);        Route::delete('/auberges/{id}', [AubergeController::class, 'destroy']);
        Route::get('/auberges/{aubergeId}/caracteristiques', [CaracteristiqueController::class, 'getByAuberge']);

        // Gestion des Chambres (Admin)
        Route::post('/chambres', [ChambreController::class, 'store']);
        Route::match(['put', 'patch', 'post'], '/chambres/{id}', [ChambreController::class, 'update']);
        Route::delete('/chambres/{id}', [ChambreController::class, 'destroy']);

        // Gestion des Caractéristiques (Admin)
        Route::post('/caracteristiques', [CaracteristiqueController::class, 'store']);
        Route::delete('/caracteristiques/{id}', [CaracteristiqueController::class, 'destroy']);

        // Mise à jour du statut des réservations (Admin)
        Route::patch('/reservations/{id}/status', [ReservationController::class, 'updateStatus']);
        Route::get('/admin/destinations-favorites', [FavoriteController::class, 'getAdminFavorites']);


        // routes gerer admin



        Route::get('/admin/users', [AdminUserController::class, 'index']);
        Route::post('/admin/users', [AdminUserController::class, 'store']);
        Route::delete('/admin/users/{id}', [AdminUserController::class, 'destroy']);

        Route::get('/admin/clients', [AdminUserController::class, 'indexClients']);

    });
});

