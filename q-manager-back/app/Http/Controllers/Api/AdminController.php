<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use App\Models\User;

class AdminController extends Controller
{
    public function getPublicDocument($id)
    {
        $document = Document::with('creator')
            ->where('is_active', true)
            ->findOrFail($id);
        
        return response()->json($document);
    }

    public function getPublicDocuments(Request $request)
    {
        $documents = Document::with('creator')
            ->where('is_active', true)
            ->when($request->category, function ($query, $category) {
                return $query->where('category', $category);
            })
            ->when($request->search, function ($query, $search) {
                return $query->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            })
            ->orderBy('created_at', 'desc')
            ->paginate(12);

        return response()->json($documents);
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

            $document = Document::create([
                'title' => $request->title,
                'description' => $request->description,
                'category' => $request->category,
                'price' => $request->price,
                'file_path' => $filePath,
                'file_name' => $file->getClientOriginalName(),
                'file_type' => $file->getClientMimeType(),
                'file_size' => $file->getSize(),
                'created_by' => $request->user()->id,
                'buy_number' => 0,
            ]);

            return response()->json([
                'message' => 'Document uploaded successfully',
                'document' => $document->load('creator'),
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
        $documents = Document::with('creator')
            ->when($request->category, function ($query, $category) {
                return $query->where('category', $category);
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
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'sometimes|required|string|max:100',
            'price' => 'sometimes|required|numeric|min:0',
            'is_active' => 'sometimes|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $document->update($request->only(['title', 'description', 'category', 'price', 'is_active']));

        return response()->json([
            'message' => 'Document updated successfully',
            'document' => $document->load('creator'),
        ]);
    }

    public function deleteDocument($id)
    {
        $document = Document::findOrFail($id);
        
        if (Storage::disk('public')->exists($document->file_path)) {
            Storage::disk('public')->delete($document->file_path);
        }
        
        $document->delete();

        return response()->json(['message' => 'Document deleted successfully']);
    }

    public function getDocument($id)
    {
        $document = Document::with('creator')->findOrFail($id);
        return response()->json($document);
    }

    public function downloadDocument($id)
    {
        $document = Document::findOrFail($id);
        
        // Check if user has purchased the document or if it's free
        if ($document->price > 0) {
            // TODO: Add purchase verification logic here
            // For now, we'll allow downloads (you can add purchase verification later)
        }
        
        $filePath = storage_path('app/public/' . $document->file_path);
        
        if (!file_exists($filePath)) {
            return response()->json(['message' => 'File not found'], 404);
        }
        
        // Increment buy_number when downloaded
        $document->increment('buy_number');
        
        return response()->download($filePath, $document->file_name);
    }

    public function previewDocument($id)
    {
        $document = Document::findOrFail($id);
        
        $filePath = storage_path('app/public/' . $document->file_path);
        
        if (!file_exists($filePath)) {
            return response()->json(['message' => 'File not found'], 404);
        }
        
        // For PDF files, return the full document for preview
        // TODO: Implement first page extraction using FPDI
        $fileExtension = strtolower(pathinfo($document->file_name, PATHINFO_EXTENSION));
        
        if ($fileExtension === 'pdf') {
            return response()->file($filePath, [
                'Content-Type' => 'application/pdf',
                'Content-Disposition' => 'inline; filename="preview_' . $document->file_name . '"',
                'X-Preview-Mode' => 'true',
                'X-Preview-Note' => 'Full document shown for preview. Purchase to download.'
            ]);
        } else {
            // For non-PDF files, return a preview message
            return response()->json([
                'message' => 'Preview not available for this file type',
                'file_type' => $document->file_type,
                'file_name' => $document->file_name,
                'preview_available' => false
            ]);
        }
    }

    public function getCategories()
    {
        $categories = Document::distinct()->pluck('category');
        return response()->json($categories);
    }
}
