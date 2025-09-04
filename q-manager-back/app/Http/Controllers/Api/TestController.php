<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Test;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class TestController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Test::with(['course', 'author']);

        // Filter by course
        if ($request->has('course_id')) {
            $query->where('course_id', $request->get('course_id'));
        }

        // Filter by active status
        if ($request->has('active')) {
            $query->where('is_active', $request->boolean('active'));
        }

        $tests = $query->orderBy('created_at', 'desc')->paginate(15);
        return response()->json($tests);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'course_id' => 'required|exists:courses,id',
            'time_limit_minutes' => 'required|integer|min:1|max:300',
            'passing_score' => 'required|integer|min:1|max:100',
            'max_attempts' => 'required|integer|min:1|max:10',
            'is_active' => 'boolean',
            'questions' => 'required|array|min:1',
            'questions.*.question' => 'required|string|max:1000',
            'questions.*.type' => 'required|in:multiple_choice,single_choice,true_false,text',
            'questions.*.options' => 'required_if:questions.*.type,multiple_choice,single_choice|array|min:2',
            'questions.*.options.*' => 'required|string|max:500',
            'questions.*.correct_answer' => 'required|string|max:500',
            'questions.*.points' => 'required|integer|min:1|max:100',
            'questions.*.explanation' => 'nullable|string|max:1000',
        ]);

        $test = Test::create([
            'title' => $request->title,
            'description' => $request->description,
            'course_id' => $request->course_id,
            'time_limit_minutes' => $request->time_limit_minutes,
            'passing_score' => $request->passing_score,
            'max_attempts' => $request->max_attempts,
            'is_active' => $request->is_active ?? true,
            'questions' => $request->questions,
            'created_by' => auth()->id(),
        ]);

        $test->load(['course', 'author']);
        return response()->json($test, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $test = Test::with(['course', 'author'])->findOrFail($id);
        return response()->json($test);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $test = Test::findOrFail($id);

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'course_id' => 'required|exists:courses,id',
            'time_limit_minutes' => 'required|integer|min:1|max:300',
            'passing_score' => 'required|integer|min:1|max:100',
            'max_attempts' => 'required|integer|min:1|max:10',
            'is_active' => 'boolean',
            'questions' => 'required|array|min:1',
            'questions.*.question' => 'required|string|max:1000',
            'questions.*.type' => 'required|in:multiple_choice,single_choice,true_false,text',
            'questions.*.options' => 'required_if:questions.*.type,multiple_choice,single_choice|array|min:2',
            'questions.*.options.*' => 'required|string|max:500',
            'questions.*.correct_answer' => 'required|string|max:500',
            'questions.*.points' => 'required|integer|min:1|max:100',
            'questions.*.explanation' => 'nullable|string|max:1000',
        ]);

        $test->update([
            'title' => $request->title,
            'description' => $request->description,
            'course_id' => $request->course_id,
            'time_limit_minutes' => $request->time_limit_minutes,
            'passing_score' => $request->passing_score,
            'max_attempts' => $request->max_attempts,
            'is_active' => $request->is_active ?? $test->is_active,
            'questions' => $request->questions,
        ]);

        $test->load(['course', 'author']);
        return response()->json($test);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $test = Test::findOrFail($id);
        $test->delete();
        return response()->json(['message' => 'Test deleted successfully']);
    }

    /**
     * Get tests for a specific course
     */
    public function getCourseTests(string $courseId)
    {
        $course = Course::findOrFail($courseId);
        $tests = $course->tests()->with('author')->get();
        return response()->json($tests);
    }

    /**
     * Duplicate a test
     */
    public function duplicate(string $id)
    {
        $originalTest = Test::findOrFail($id);
        
        $newTest = Test::create([
            'title' => $originalTest->title . ' (Copy)',
            'description' => $originalTest->description,
            'course_id' => $originalTest->course_id,
            'time_limit_minutes' => $originalTest->time_limit_minutes,
            'passing_score' => $originalTest->passing_score,
            'max_attempts' => $originalTest->max_attempts,
            'is_active' => false, // Start as inactive
            'questions' => $originalTest->questions,
            'created_by' => auth()->id(),
        ]);

        $newTest->load(['course', 'author']);
        return response()->json($newTest, 201);
    }
}
