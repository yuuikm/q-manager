<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\NewsController;
use App\Http\Controllers\Api\CourseController;
use App\Http\Controllers\Api\TestController;
use App\Http\Controllers\Api\CourseMaterialController;
use App\Http\Controllers\Api\NewsCategoryController;
use App\Http\Controllers\Api\DocumentCategoryController;
use App\Http\Controllers\Api\CourseCategoryController;

// Public routes
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

// Public document routes
Route::get('/documents', [AdminController::class, 'getPublicDocuments']);
Route::get('/documents/{id}', [AdminController::class, 'getPublicDocument']);
Route::get('/documents/{id}/download', [AdminController::class, 'downloadDocument']);
Route::get('/documents/{id}/preview', [AdminController::class, 'previewDocument']);
Route::get('/categories', [AdminController::class, 'getCategories']);

// Protected routes
Route::middleware(['token.auth'])->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/user', [AuthController::class, 'user']);
    Route::put('/auth/profile', [AuthController::class, 'updateProfile']);
    
    // User routes
    Route::get('/users', [UserController::class, 'index']);
    Route::post('/users', [UserController::class, 'store']);
    Route::put('/users/{id}', [UserController::class, 'update']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);
});

// Temporary test route without auth
Route::post('/test-news', function(Request $request) {
    \Log::info('Test news creation - Auth check:', [
        'user_id' => auth()->id(),
        'user' => auth()->user(),
        'token' => $request->bearerToken(),
    ]);
    
    $data = [
        'title' => $request->title ?? 'Test News',
        'slug' => \Illuminate\Support\Str::slug($request->title ?? 'Test News'),
        'description' => $request->description ?? 'Test Description',
        'content' => $request->content ?? 'Test Content',
        'is_published' => $request->is_published ?? false,
        'is_featured' => $request->is_featured ?? false,
        'created_by' => auth()->id() ?? 3,
    ];
    
    \Log::info('Test news data:', $data);
    
    try {
        $news = \App\Models\News::create($data);
        return response()->json(['success' => true, 'news' => $news]);
    } catch (\Exception $e) {
        \Log::error('Test news creation error:', ['error' => $e->getMessage()]);
        return response()->json(['error' => $e->getMessage()], 500);
    }
});

Route::middleware(['token.auth', 'admin.auth'])->prefix('admin')->group(function () {
    // Document management
    Route::post('/documents', [AdminController::class, 'uploadDocument']);
    Route::get('/documents', [AdminController::class, 'getDocuments']);
    Route::get('/documents/{id}', [AdminController::class, 'getDocument']);
    Route::put('/documents/{id}', [AdminController::class, 'updateDocument']);
    Route::patch('/documents/{id}/toggle-status', [AdminController::class, 'toggleDocumentStatus']);
    Route::delete('/documents/{id}', [AdminController::class, 'deleteDocument']);
    
    // Category management
    Route::apiResource('categories', CategoryController::class);
    
    // News management
    Route::apiResource('news', NewsController::class);
    Route::patch('/news/{id}/toggle-status', [NewsController::class, 'togglePublishStatus']);
    Route::post('/news/{id}/like', [NewsController::class, 'toggleLike']);
    Route::post('/news/{id}/comment', [NewsController::class, 'addComment']);
    
    // Course management
    Route::apiResource('courses', CourseController::class);
    Route::patch('/courses/{id}/toggle-status', [CourseController::class, 'togglePublishStatus']);
    Route::get('/courses/{id}/materials', [CourseController::class, 'materials']);
    Route::get('/courses/{id}/tests', [CourseController::class, 'tests']);
    Route::get('/courses/{id}/enrollments', [CourseController::class, 'enrollments']);
    
    // Course materials management
    Route::apiResource('course-materials', CourseMaterialController::class);
    
    // Test management
    Route::apiResource('tests', TestController::class);
    Route::get('/courses/{id}/tests', [TestController::class, 'getCourseTests']);
    Route::post('/tests/{id}/duplicate', [TestController::class, 'duplicate']);
    
    // Category management for each content type
    Route::apiResource('news-categories', NewsCategoryController::class);
    Route::apiResource('document-categories', DocumentCategoryController::class);
    Route::apiResource('course-categories', CourseCategoryController::class);
});

// Test route
Route::get('/ping', function () {
    return ['pong' => true];
});
