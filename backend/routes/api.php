<?php
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DestinationController;
use App\Http\Controllers\Api\CategorieController;
use App\Http\Controllers\Api\ActiviteController;
use App\Http\Controllers\Api\AubergeController;
use App\Http\Controllers\Api\ReservationController;
use Illuminate\Support\Facades\Route;
// 1. Routes publiques Auth
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);


// 2. Routes publiques Consultation
Route::get('destinations', [DestinationController::class, 'index']);
Route::get('categories', [CategorieController::class, 'index']);
Route::get('activites', [ActiviteController::class, 'index']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

// crud
    Route::apiResource('destinations', DestinationController::class)->except(['index']);
    Route::apiResource('categories', CategorieController::class)->except(['index']);
    Route::apiResource('activites', ActiviteController::class)->except(['index']);});
//destination
Route::get('/destinations', [DestinationController::class, 'index']);
Route::post('/destinations', [DestinationController::class, 'store']);

// Routes Publiques
Route::get('/auberges', [AubergeController::class, 'index']);
Route::get('/auberges/{id}', [AubergeController::class, 'show']);

// Routes Protégées (Admin)
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::post('/auberges', [AubergeController::class, 'store']);
    Route::put('/auberges/{id}', [AubergeController::class, 'update']);
    Route::delete('/auberges/{id}', [AubergeController::class, 'destroy']);
});



Route::middleware('auth:sanctum')->group(function () {

    // CRUD
    Route::get('/reservations', [ReservationController::class, 'index']);
    Route::post('/reservations', [ReservationController::class, 'store']);
    Route::get('/reservations/{id}', [ReservationController::class, 'show']);
    Route::put('/reservations/{id}', [ReservationController::class, 'update']);
    Route::put('/reservations/{id}/cancel', [ReservationController::class, 'cancel']);
    Route::delete('/reservations/{id}', [ReservationController::class, 'destroy']);


    Route::middleware('admin')->group(function () {
        Route::patch('/reservations/{id}/status', [ReservationController::class, 'updateStatus']);
    });
});

Route::get('/destination/recherch',[DestinationController::class , 'rechercheDestinationParVille']);
