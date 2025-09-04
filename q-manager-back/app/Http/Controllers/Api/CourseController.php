<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\CourseMaterial;
use App\Models\Test;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class CourseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Course::with(['author', 'materials', 'tests', 'enrollments']);

        // Filter by type
        if ($request->has('type')) {
            $query->where('type', $request->get('type'));
        }

        // Filter by category
        if ($request->has('category')) {
            $query->where('category', $request->get('category'));
        }

        // Filter by published status
        if ($request->has('published')) {
            $query->where('is_published', $request->boolean('published'));
        }

        // Filter by featured status
        if ($request->has('featured')) {
            $query->where('is_featured', $request->boolean('featured'));
        }

        // Search by title or description
        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $courses = $query->orderBy('created_at', 'desc')->paginate(15);
        return response()->json($courses);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'content' => 'required|string',
            'price' => 'required|numeric|min:0',
            'type' => 'required|in:online,self_learning,offline',
            'category' => 'required|string|max:255',
            'featured_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'certificate_template' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'max_students' => 'nullable|integer|min:1',
            'duration_hours' => 'nullable|integer|min:1',
            'requirements' => 'nullable|string',
            'learning_outcomes' => 'nullable|string',
            'zoom_link' => 'nullable|url',
            'schedule' => 'nullable|array',
            'is_published' => 'boolean',
            'is_featured' => 'boolean',
        ]);

        $data = [
            'title' => $request->title,
            'slug' => Str::slug($request->title),
            'description' => $request->description,
            'content' => $request->content,
            'price' => $request->price,
            'type' => $request->type,
            'category' => $request->category,
            'max_students' => $request->max_students,
            'duration_hours' => $request->duration_hours,
            'requirements' => $request->requirements,
            'learning_outcomes' => $request->learning_outcomes,
            'zoom_link' => $request->zoom_link,
            'schedule' => $request->schedule,
            'is_published' => $request->is_published ?? false,
            'is_featured' => $request->is_featured ?? false,
            'created_by' => auth()->id(),
        ];

        // Handle image uploads
        if ($request->hasFile('featured_image')) {
            $data['featured_image'] = $request->file('featured_image')->store('courses/images', 'public');
        }

        if ($request->hasFile('certificate_template')) {
            $data['certificate_template'] = $request->file('certificate_template')->store('courses/certificates', 'public');
        }

        $course = Course::create($data);
        $course->load(['author', 'materials', 'tests', 'enrollments']);

        return response()->json($course, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $course = Course::with(['author', 'materials', 'tests', 'enrollments'])->findOrFail($id);
        
        // Increment view count
        $course->increment('views_count');
        
        return response()->json($course);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $course = Course::findOrFail($id);

        $request->validate([
            'title' => ['required', 'string', 'max:255', Rule::unique('courses', 'title')->ignore($course->id)],
            'description' => 'required|string',
            'content' => 'required|string',
            'price' => 'required|numeric|min:0',
            'type' => 'required|in:online,self_learning,offline',
            'category' => 'required|string|max:255',
            'featured_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'certificate_template' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'max_students' => 'nullable|integer|min:1',
            'duration_hours' => 'nullable|integer|min:1',
            'requirements' => 'nullable|string',
            'learning_outcomes' => 'nullable|string',
            'zoom_link' => 'nullable|url',
            'schedule' => 'nullable|array',
            'is_published' => 'boolean',
            'is_featured' => 'boolean',
        ]);

        $data = [
            'title' => $request->title,
            'slug' => Str::slug($request->title),
            'description' => $request->description,
            'content' => $request->content,
            'price' => $request->price,
            'type' => $request->type,
            'category' => $request->category,
            'max_students' => $request->max_students,
            'duration_hours' => $request->duration_hours,
            'requirements' => $request->requirements,
            'learning_outcomes' => $request->learning_outcomes,
            'zoom_link' => $request->zoom_link,
            'schedule' => $request->schedule,
            'is_published' => $request->is_published ?? $course->is_published,
            'is_featured' => $request->is_featured ?? $course->is_featured,
        ];

        // Handle image uploads
        if ($request->hasFile('featured_image')) {
            // Delete old image
            if ($course->featured_image) {
                Storage::disk('public')->delete($course->featured_image);
            }
            $data['featured_image'] = $request->file('featured_image')->store('courses/images', 'public');
        }

        if ($request->hasFile('certificate_template')) {
            // Delete old template
            if ($course->certificate_template) {
                Storage::disk('public')->delete($course->certificate_template);
            }
            $data['certificate_template'] = $request->file('certificate_template')->store('courses/certificates', 'public');
        }

        $course->update($data);
        $course->load(['author', 'materials', 'tests', 'enrollments']);

        return response()->json($course);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $course = Course::findOrFail($id);

        // Delete associated images
        if ($course->featured_image) {
            Storage::disk('public')->delete($course->featured_image);
        }
        if ($course->certificate_template) {
            Storage::disk('public')->delete($course->certificate_template);
        }

        $course->delete();
        return response()->json(['message' => 'Course deleted successfully']);
    }

    /**
     * Get course materials
     */
    public function materials(string $id)
    {
        $course = Course::findOrFail($id);
        $materials = $course->materials()->orderBy('sort_order')->get();
        return response()->json($materials);
    }

    /**
     * Get course tests
     */
    public function tests(string $id)
    {
        $course = Course::findOrFail($id);
        $tests = $course->tests()->get();
        return response()->json($tests);
    }

    /**
     * Get course enrollments
     */
    public function enrollments(string $id)
    {
        $course = Course::findOrFail($id);
        $enrollments = $course->enrollments()->with('user')->get();
        return response()->json($enrollments);
    }
}
