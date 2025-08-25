<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\AdminController;

// Public routes
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware(['token.auth'])->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/user', [AuthController::class, 'user']);
    
    // User routes
    Route::get('/users', [UserController::class, 'index']);
    Route::post('/users', [UserController::class, 'store']);
    Route::put('/users/{id}', [UserController::class, 'update']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);
});

Route::middleware(['token.auth', 'admin.auth'])->prefix('admin')->group(function () {
    Route::post('/documents/upload', [AdminController::class, 'uploadDocument']);
    Route::get('/documents', [AdminController::class, 'getDocuments']);
    Route::get('/documents/{id}', [AdminController::class, 'getDocument']);
    Route::put('/documents/{id}', [AdminController::class, 'updateDocument']);
    Route::delete('/documents/{id}', [AdminController::class, 'deleteDocument']);
    Route::get('/categories', [AdminController::class, 'getCategories']);
});

// Test route
Route::get('/ping', function () {
    return ['pong' => true];
});
