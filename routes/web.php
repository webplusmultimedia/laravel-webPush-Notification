<?php

    use Illuminate\Support\Facades\Route;

    /*
    |--------------------------------------------------------------------------
    | Web Routes
    |--------------------------------------------------------------------------
    |
    | Here is where you can register web routes for your application. These
    | routes are loaded by the RouteServiceProvider within a group which
    | contains the "web" middleware group. Now create something great!
    |
    */

    Route::get('/', function () {
        return view('welcome');
    });


    Route::get('/home', 'HomeController@index')->name('home');


    Route::prefix('push')->middleware('auth')->group(function () {
        Route::get('key','SubcriptionController@key')->name('subcription.key');
        Route::get('notify-all','SubcriptionController@push')->name('subcription.push');
        Route::post('subscribe','SubcriptionController@subscribe')->name('subcription.subscribe');
    });


    Auth::routes();
