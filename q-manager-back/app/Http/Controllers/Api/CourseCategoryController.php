<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CourseCategory;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class CourseCategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $categories = CourseCategory::orderBy('sort_order')->orderBy('name')->get();
        return response()->json($categories);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:course_categories,name',
            'description' => 'nullable|string',
            'color' => 'nullable|string|max:7',
            'icon' => 'nullable|string|max:255',
            'is_active' => 'boolean',
            'sort_order' => 'integer|min:0',
        ]);

        $category = CourseCategory::create($request->all());
        return response()->json($category, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $category = CourseCategory::findOrFail($id);
        return response()->json($category);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $category = CourseCategory::findOrFail($id);
        
        $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique('course_categories')->ignore($category->id)],
            'description' => 'nullable|string',
            'color' => 'nullable|string|max:7',
            'icon' => 'nullable|string|max:255',
            'is_active' => 'boolean',
            'sort_order' => 'integer|min:0',
        ]);

        $category->update($request->all());
        return response()->json($category);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $category = CourseCategory::findOrFail($id);
        
        // Check if category is used by any courses
        if ($category->courses()->count() > 0) {
            return response()->json([
                'message' => 'Cannot delete category that is being used by courses.'
            ], 422);
        }
        
        $category->delete();
        return response()->json(['message' => 'Category deleted successfully']);
    }
}
