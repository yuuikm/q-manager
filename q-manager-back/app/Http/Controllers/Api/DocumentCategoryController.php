<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DocumentCategory;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class DocumentCategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $categories = DocumentCategory::orderBy('sort_order')->orderBy('name')->get();
        return response()->json($categories);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:document_categories,name',
            'description' => 'nullable|string',
            'color' => 'nullable|string|max:7',
            'icon' => 'nullable|string|max:255',
            'is_active' => 'boolean',
            'sort_order' => 'integer|min:0',
        ]);

        $category = DocumentCategory::create($request->all());
        return response()->json($category, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $category = DocumentCategory::findOrFail($id);
        return response()->json($category);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $category = DocumentCategory::findOrFail($id);
        
        $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique('document_categories')->ignore($category->id)],
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
        $category = DocumentCategory::findOrFail($id);
        
        // Check if category is used by any documents
        if ($category->documents()->count() > 0) {
            return response()->json([
                'message' => 'Cannot delete category that is being used by documents.'
            ], 422);
        }
        
        $category->delete();
        return response()->json(['message' => 'Category deleted successfully']);
    }
}
