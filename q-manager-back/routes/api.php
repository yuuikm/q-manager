<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\User;

Route::get('/users', function () {
return User::all();
});

Route::get('/ping', function () {
    return ['pong' => true];
});
