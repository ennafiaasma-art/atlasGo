<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DestinationController;
use App\Http\Controllers\Api\CategorieController;
use App\Http\Controllers\Api\ActiviteController;
use App\Http\Controllers\Api\AubergeController;
use App\Http\Controllers\Api\ReservationController;
use Illuminate\Support\Facades\Route;


//  1. Routes Publiques  pour tout les user non connecte

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// recherche  et consulter

Route::get('/destinations', [DestinationController::class, 'index']);
Route::get('/destinations/recherch', [DestinationController::class, 'rechercheDestinationParVille']);
Route::get('/categories', [CategorieController::class, 'index']);
Route::get('/activites', [ActiviteController::class, 'index']);
Route::get('/auberges', [AubergeController::class, 'index']);
Route::get('/auberges/{id}', [AubergeController::class, 'show']);


/*
 2. Routes Protégées (user connecte  - Auth)
*/
Route::middleware('auth:sanctum')->group(function () {

    // Auth & Profile
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Reservations user connecte
    Route::get('/reservations', [ReservationController::class, 'index']);
    Route::post('/reservations', [ReservationController::class, 'store']);
    Route::get('/reservations/{id}', [ReservationController::class, 'show']);
    Route::put('/reservations/{id}', [ReservationController::class, 'update']);
    Route::put('/reservations/{id}/cancel', [ReservationController::class, 'cancel']);
    Route::delete('/reservations/{id}', [ReservationController::class, 'destroy']);


    /*
     3. Routes Admin
    */
    Route::middleware('admin')->group(function () {

        // CRUD Destinations (Store, Update, Destroy)
        Route::apiResource('destinations', DestinationController::class)->except(['index', 'show']);

        // CRUD Categories & Activites
        Route::apiResource('categories', CategorieController::class)->except(['index', 'show']);
        Route::apiResource('activites', ActiviteController::class)->except(['index', 'show']);

        // Auberges Admin
        Route::post('/auberges', [AubergeController::class, 'store']);
        Route::put('/auberges/{id}', [AubergeController::class, 'update']);
        Route::delete('/auberges/{id}', [AubergeController::class, 'destroy']);

        // Reservation Status Update
        Route::patch('/reservations/{id}/status', [ReservationController::class, 'updateStatus']);
    });
});
