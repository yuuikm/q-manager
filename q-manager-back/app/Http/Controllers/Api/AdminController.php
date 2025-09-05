<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Document;
use App\Models\DocumentCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use App\Models\User;

class AdminController extends Controller
{
    public function getPublicDocument($id)
    {
        $document = Document::with(['creator', 'category'])
            ->where('is_active', true)
            ->findOrFail($id);
        
        return response()->json($document);
    }

    public function getPublicDocuments(Request $request)
    {
        $documents = Document::with(['creator', 'category'])
            ->where('is_active', true)
            ->when($request->category, function ($query, $category) {
                return $query->whereHas('category', function($q) use ($category) {
                    $q->where('name', $category);
                });
            })
            ->when($request->search, function ($query, $search) {
                return $query->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            })
            ->orderBy('created_at', 'desc')
            ->paginate(12);

        return response()->json($documents);
    }

    public function getCategories()
    {
        $categories = DocumentCategory::orderBy('name')->get();
        return response()->json($categories);
    }

    public function uploadDocument(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'required|string|max:500',
            'category' => 'required|string|max:100',
            'price' => 'required|numeric|min:0',
            'file' => 'required|file|mimes:pdf,doc,docx,txt,rtf|max:10240',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $file = $request->file('file');
            $fileName = time() . '_' . $file->getClientOriginalName();
            $filePath = $file->storeAs('documents', $fileName, 'public');

            // Handle category - find existing or create new
            $categoryName = $request->category;
            $category = DocumentCategory::where('name', $categoryName)->first();
            
            if (!$category) {
                // Create new category
                $category = DocumentCategory::create([
                    'name' => $categoryName,
                    'slug' => \Str::slug($categoryName),
                ]);
            }

            $document = Document::create([
                'title' => $request->title,
                'description' => $request->description,
                'price' => $request->price,
                'file_path' => $filePath,
                'file_name' => $file->getClientOriginalName(),
                'file_type' => $file->getClientMimeType(),
                'file_size' => $file->getSize(),
                'created_by' => $request->user()->id,
                'buy_number' => 0,
                'category_id' => $category->id,
            ]);

            return response()->json([
                'message' => 'Document uploaded successfully',
                'document' => $document->load(['creator', 'category']),
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to upload document',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getDocuments(Request $request)
    {
        $documents = Document::with(['creator', 'category'])
            ->when($request->category, function ($query, $category) {
                return $query->whereHas('category', function($q) use ($category) {
                    $q->where('name', $category);
                });
            })
            ->when($request->search, function ($query, $search) {
                return $query->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            })
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json($documents);
    }

    public function updateDocument(Request $request, $id)
    {
        $document = Document::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'required|string|max:500',
            'category' => 'required|string|max:100',
            'price' => 'required|numeric|min:0',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $document->update([
            'title' => $request->title,
            'description' => $request->description,
            'price' => $request->price,
            'is_active' => $request->is_active ?? $document->is_active,
        ]);

        // Handle category - find existing or create new
        $categoryName = $request->category;
        $category = DocumentCategory::where('name', $categoryName)->first();
        
        if (!$category) {
            // Create new category
            $category = DocumentCategory::create([
                'name' => $categoryName,
                'slug' => \Str::slug($categoryName),
            ]);
        }

        // Update category relationship
        $document->update(['category_id' => $category->id]);

        return response()->json([
            'message' => 'Document updated successfully',
            'document' => $document->load(['creator', 'category']),
        ]);
    }

    public function deleteDocument($id)
    {
        $document = Document::findOrFail($id);

        // Delete the file
        if ($document->file_path) {
            Storage::disk('public')->delete($document->file_path);
        }

        // Delete the document (this will also delete pivot table entries due to cascade)
        $document->delete();

        return response()->json(['message' => 'Document deleted successfully']);
    }

    public function toggleDocumentStatus($id)
    {
        $document = Document::findOrFail($id);
        $document->update(['is_active' => !$document->is_active]);

        return response()->json([
            'message' => 'Document status updated successfully',
            'document' => $document->load(['creator', 'category']),
        ]);
    }

    public function getUsers(Request $request)
    {
        $users = User::when($request->search, function ($query, $search) {
            return $query->where('first_name', 'like', "%{$search}%")
                ->orWhere('last_name', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%");
        })
        ->orderBy('created_at', 'desc')
        ->paginate(10);

        return response()->json($users);
    }

    public function updateUser(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $id,
            'role' => 'required|in:user,admin',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user->update([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'role' => $request->role,
        ]);

        return response()->json([
            'message' => 'User updated successfully',
            'user' => $user,
        ]);
    }

    public function deleteUser($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json(['message' => 'User deleted successfully']);
    }

    public function previewDocument($id)
    {
        $document = Document::findOrFail($id);

        if (!$document->file_path) {
            return response()->json(['message' => 'File not found'], 404);
        }

        $filePath = storage_path('app/public/' . $document->file_path);

        if (!file_exists($filePath)) {
            return response()->json(['message' => 'File not found on disk'], 404);
        }

        // Check if it's a PDF file
        $fileExtension = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));
        
        if ($fileExtension !== 'pdf') {
            return response()->json(['message' => 'Preview is only available for PDF files'], 400);
        }

        // Return the PDF file for preview
        return response()->file($filePath, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline; filename="' . $document->file_name . '"',
        ]);
    }

    public function downloadDocument($id)
    {
        $document = Document::findOrFail($id);

        if (!$document->file_path) {
            return response()->json(['message' => 'File not found'], 404);
        }

        $filePath = storage_path('app/public/' . $document->file_path);

        if (!file_exists($filePath)) {
            return response()->json(['message' => 'File not found on disk'], 404);
        }

        // Return the file for download
        return response()->download($filePath, $document->file_name);
    }
}
