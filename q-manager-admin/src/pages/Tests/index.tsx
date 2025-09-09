import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import DataTable from '@/components/shared/DataTable';
import Button from '@/components/shared/Button';
import Actions from '@/components/shared/Actions';
import { type TableColumn, type TableAction } from '@/components/shared/DataTable';

interface Question {
  question: string;
  type: 'multiple_choice' | 'single_choice' | 'true_false' | 'text';
  options?: string[];
  correct_answer: string;
  points: number;
  explanation?: string;
}

interface Test {
  id: number;
  title: string;
  description?: string;
  course_id: number;
  time_limit_minutes: number;
  passing_score: number;
  max_attempts: number;
  is_active: boolean;
  questions: Question[];
  created_by: number;
  course: {
    id: number;
    title: string;
  };
  author: {
    id: number;
    first_name: string;
    last_name: string;
  };
  created_at: string;
  updated_at: string;
}

interface Course {
  id: number;
  title: string;
}

// Table columns configuration
const testColumns: TableColumn[] = [
  {
    key: "test",
    label: "Тест",
  },
  {
    key: "course",
    label: "Курс",
  },
  {
    key: "settings",
    label: "Настройки",
  },
  {
    key: "status",
    label: "Статус",
  },
];

// Table actions configuration
const testActions: TableAction[] = [
  {
    key: "actions",
    label: "Действия",
  },
];

const Tests = () => {
  const [tests, setTests] = useState<Test[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTest, setEditingTest] = useState<Test | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    course_id: '',
    time_limit_minutes: 60,
    passing_score: 70,
    max_attempts: 3,
    is_active: true,
    questions: [] as Question[],
  });

  const [searchParams] = useSearchParams();

  useEffect(() => {
    fetchTests();
    fetchCourses();
    
    // Check if we have a course filter from URL
    const courseParam = searchParams.get('course');
    if (courseParam) {
      setSelectedCourse(courseParam);
    }
    
    // Event listeners for actions
    const handleEditTest = (event: CustomEvent) => {
      handleEditTestAction(event.detail);
    };
    
    const handleToggleTestStatus = (event: CustomEvent) => {
      handleToggleTestStatusAction(event.detail.id, event.detail.currentStatus);
    };
    
    const handleDuplicateTest = (event: CustomEvent) => {
      handleDuplicateTestAction(event.detail);
    };
    
    const handleDeleteTest = (event: CustomEvent) => {
      handleDeleteTestAction(event.detail);
    };

    window.addEventListener('editTest', handleEditTest as EventListener);
    window.addEventListener('toggleTestStatus', handleToggleTestStatus as EventListener);
    window.addEventListener('duplicateTest', handleDuplicateTest as EventListener);
    window.addEventListener('deleteTest', handleDeleteTest as EventListener);

    return () => {
      window.removeEventListener('editTest', handleEditTest as EventListener);
      window.removeEventListener('toggleTestStatus', handleToggleTestStatus as EventListener);
      window.removeEventListener('duplicateTest', handleDuplicateTest as EventListener);
      window.removeEventListener('deleteTest', handleDeleteTest as EventListener);
    };
  }, [searchParams]);

  const fetchTests = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setLoading(false);
        return;
      }

      let url = 'http://localhost:8000/api/admin/tests';
      
      // Add course filter if selected
      if (selectedCourse) {
        url += `?course_id=${selectedCourse}`;
      }
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTests(data.data || data);
      } else if (response.status === 401) {
        // Handle unauthorized - token expired
        localStorage.removeItem('auth_token');
        navigate(LINKS.loginLink);
      }
    } catch (error) {
      console.error('Error fetching tests:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      const response = await fetch('http://localhost:8000/api/admin/courses', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCourses(data.data || data);
      } else if (response.status === 401) {
        // Handle unauthorized - token expired
        localStorage.removeItem('auth_token');
        navigate(LINKS.loginLink);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.questions.length === 0) {
      alert('Please add at least one question to the test.');
      return;
    }

    try {
      const token = localStorage.getItem('auth_token');
      const url = editingTest 
        ? `http://localhost:8000/api/admin/tests/${editingTest.id}`
        : 'http://localhost:8000/api/admin/tests';
      
      const method = editingTest ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchTests();
        setShowModal(false);
        setEditingTest(null);
        resetForm();
      }
    } catch (error) {
      console.error('Error saving test:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      course_id: '',
      time_limit_minutes: 60,
      passing_score: 70,
      max_attempts: 3,
      is_active: true,
      questions: [],
    });
  };

  const handleEditTestAction = (test: Test) => {
    setEditingTest(test);
    setFormData({
      title: test.title,
      description: test.description || '',
      course_id: test.course_id.toString(),
      time_limit_minutes: test.time_limit_minutes,
      passing_score: test.passing_score,
      max_attempts: test.max_attempts,
      is_active: test.is_active,
      questions: test.questions,
    });
    setShowModal(true);
  };

  const handleDeleteTestAction = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить этот тест?')) return;

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`http://localhost:8000/api/admin/tests/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Use functional update to avoid stale closure
        setTests(prevTests => prevTests.filter(test => test.id !== id));
        alert('Тест успешно удален');
      } else if (response.status === 401) {
        // Handle unauthorized - token expired
        localStorage.removeItem('auth_token');
        navigate(LINKS.loginLink);
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(errorData.message || 'Ошибка удаления теста');
      }
    } catch (error) {
      console.error('Ошибка удаления теста:', error);
      alert('Произошла ошибка при удалении теста');
    }
  };

  const handleToggleTestStatusAction = async (id: number, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`http://localhost:8000/api/admin/tests/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_active: !currentStatus }),
      });

      if (response.ok) {
        // Use functional update to avoid stale closure
        setTests(prevTests => 
          prevTests.map(test => 
            test.id === id ? { ...test, is_active: !currentStatus } : test
          )
        );
        alert(`Тест ${!currentStatus ? 'активирован' : 'деактивирован'} успешно`);
      } else if (response.status === 401) {
        // Handle unauthorized - token expired
        localStorage.removeItem('auth_token');
        navigate(LINKS.loginLink);
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(errorData.message || 'Ошибка обновления статуса теста');
      }
    } catch (error) {
      console.error('Ошибка обновления статуса теста:', error);
      alert('Произошла ошибка при обновлении статуса теста');
    }
  };

  const handleDuplicateTestAction = async (id: number) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`http://localhost:8000/api/admin/tests/${id}/duplicate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Refetch tests to get the new duplicated test
        await fetchTests();
        alert('Тест успешно дублирован');
      } else if (response.status === 401) {
        // Handle unauthorized - token expired
        localStorage.removeItem('auth_token');
        navigate(LINKS.loginLink);
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(errorData.message || 'Ошибка дублирования теста');
      }
    } catch (error) {
      console.error('Error duplicating test:', error);
      alert('Произошла ошибка при дублировании теста');
    }
  };

  const openModal = () => {
    setEditingTest(null);
    resetForm();
    setShowModal(true);
  };

  const addQuestion = () => {
    const newQuestion: Question = {
      question: '',
      type: 'single_choice',
      options: ['', ''],
      correct_answer: '',
      points: 1,
      explanation: '',
    };
    setFormData({
      ...formData,
      questions: [...formData.questions, newQuestion],
    });
  };

  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const removeQuestion = (index: number) => {
    const updatedQuestions = formData.questions.filter((_, i) => i !== index);
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const addOption = (questionIndex: number) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[questionIndex].options = [...(updatedQuestions[questionIndex].options || []), ''];
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const updatedQuestions = [...formData.questions];
    if (updatedQuestions[questionIndex].options) {
      updatedQuestions[questionIndex].options![optionIndex] = value;
    }
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const updatedQuestions = [...formData.questions];
    if (updatedQuestions[questionIndex].options) {
      updatedQuestions[questionIndex].options = updatedQuestions[questionIndex].options!.filter((_, i) => i !== optionIndex);
    }
    setFormData({ ...formData, questions: updatedQuestions });
  };

  if (loading) {
    return (
      <div className="admin-card">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="admin-card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Tests Management</h2>
          <Button onClick={openModal} variant="primary">
            Create New Test
          </Button>
        </div>

        {/* Course Filter */}
        <div className="mb-6">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">Filter by Course:</label>
            <select
              value={selectedCourse}
              onChange={(e) => {
                setSelectedCourse(e.target.value);
                // Refetch tests with new filter
                setTimeout(() => fetchTests(), 100);
              }}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Courses</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
            {selectedCourse && (
              <button
                onClick={() => {
                  setSelectedCourse('');
                  setTimeout(() => fetchTests(), 100);
                }}
                className="text-sm text-blue-600 hover:text-blue-900"
              >
                Clear Filter
              </button>
            )}
          </div>
        </div>

        {/* Custom render functions for columns */}
        {(() => {
          const renderTestColumn = (test: Test) => (
            <div>
              <div className="text-sm font-medium text-gray-900 mb-1">
                {test.title}
              </div>
              {test.description && (
                <div className="text-sm text-gray-500">{test.description}</div>
              )}
              <div className="text-xs text-gray-400 mt-1">
                {test.questions.length} вопросов • Создан{" "}
                {test.author.first_name} {test.author.last_name}
              </div>
            </div>
          );

          const renderCourseColumn = (test: Test) => (
            <div className="text-sm text-gray-900">{test.course.title}</div>
          );

          const renderSettingsColumn = (test: Test) => (
            <div className="space-y-1">
              <div>⏱️ {test.time_limit_minutes} мин</div>
              <div>🎯 {test.passing_score}% проходной</div>
              <div>🔄 {test.max_attempts} попыток</div>
            </div>
          );

          const renderStatusColumn = (test: Test) => (
            <span
              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                test.is_active
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {test.is_active ? "Активен" : "Неактивен"}
            </span>
          );

          const renderActionsColumn = (test: Test) => (
            <Actions
              onEdit={() => {
                window.dispatchEvent(
                  new CustomEvent("editTest", { detail: test }),
                );
              }}
              onToggleStatus={() => {
                window.dispatchEvent(
                  new CustomEvent("toggleTestStatus", {
                    detail: { id: test.id, currentStatus: test.is_active },
                  }),
                );
              }}
              onDuplicate={() => {
                window.dispatchEvent(
                  new CustomEvent("duplicateTest", { detail: test.id }),
                );
              }}
              onDelete={() => {
                window.dispatchEvent(
                  new CustomEvent("deleteTest", { detail: test.id }),
                );
              }}
              isActive={test.is_active}
              editLabel="Редактировать тест"
              deleteLabel="Удалить тест"
              duplicateLabel="Дублировать тест"
              showDuplicate={true}
            />
          );

          // Enhanced columns with render functions
          const enhancedColumns = testColumns.map(column => ({
            ...column,
            render: column.key === 'test' ? renderTestColumn :
                    column.key === 'course' ? renderCourseColumn :
                    column.key === 'settings' ? renderSettingsColumn :
                    column.key === 'status' ? renderStatusColumn :
                    undefined
          }));

          // Enhanced actions with render function
          const enhancedActions = testActions.map(action => ({
            ...action,
            render: action.key === 'actions' ? renderActionsColumn : undefined
          }));

          return (
            <DataTable
              title=""
              description=""
              data={tests}
              columns={enhancedColumns}
              actions={enhancedActions}
              loading={false}
              error={null}
              emptyMessage="Тесты не найдены"
              emptyDescription="Создайте первый тест для начала работы"
              totalCount={tests.length}
            />
          );
        })()}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-5 mx-auto p-5 border w-11/12 max-w-6xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingTest ? 'Edit Test' : 'Create New Test'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Test Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Test Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Course *
                    </label>
                    <select
                      required
                      value={formData.course_id}
                      onChange={(e) => setFormData({ ...formData, course_id: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Course</option>
                      {courses.map((course) => (
                        <option key={course.id} value={course.id}>
                          {course.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Test Settings */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Time Limit (minutes) *
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="300"
                      required
                      value={formData.time_limit_minutes}
                      onChange={(e) => setFormData({ ...formData, time_limit_minutes: parseInt(e.target.value) || 60 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Passing Score (%) *
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      required
                      value={formData.passing_score}
                      onChange={(e) => setFormData({ ...formData, passing_score: parseInt(e.target.value) || 70 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Attempts *
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      required
                      value={formData.max_attempts}
                      onChange={(e) => setFormData({ ...formData, max_attempts: parseInt(e.target.value) || 3 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Questions Section */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-medium text-gray-900">Questions ({formData.questions.length})</h4>
                    <button
                      type="button"
                      onClick={addQuestion}
                      className="admin-button admin-button-primary cursor-pointer"
                    >
                      Add Question
                    </button>
                  </div>

                  <div className="space-y-6 max-h-96 overflow-y-auto">
                    {formData.questions.map((question, questionIndex) => (
                      <div key={questionIndex} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-4">
                          <h5 className="font-medium text-gray-900">Question {questionIndex + 1}</h5>
                          <button
                            type="button"
                            onClick={() => removeQuestion(questionIndex)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Remove
                          </button>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Question Text *
                            </label>
                            <textarea
                              required
                              value={question.question}
                              onChange={(e) => updateQuestion(questionIndex, 'question', e.target.value)}
                              rows={2}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Question Type *
                              </label>
                              <select
                                required
                                value={question.type}
                                onChange={(e) => updateQuestion(questionIndex, 'type', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="single_choice">Single Choice</option>
                                <option value="multiple_choice">Multiple Choice</option>
                                <option value="true_false">True/False</option>
                                <option value="text">Text Answer</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Points *
                              </label>
                              <input
                                type="number"
                                min="1"
                                max="100"
                                required
                                value={question.points}
                                onChange={(e) => updateQuestion(questionIndex, 'points', parseInt(e.target.value) || 1)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                          </div>

                          {/* Options for multiple choice and single choice */}
                          {(question.type === 'single_choice' || question.type === 'multiple_choice') && (
                            <div>
                              <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-medium text-gray-700">
                                  Options *
                                </label>
                                <button
                                  type="button"
                                  onClick={() => addOption(questionIndex)}
                                  className="text-blue-600 hover:text-blue-900 text-sm"
                                >
                                  Add Option
                                </button>
                              </div>
                              <div className="space-y-2">
                                {question.options?.map((option, optionIndex) => (
                                  <div key={optionIndex} className="flex items-center space-x-2">
                                    <input
                                      type="text"
                                      required
                                      value={option}
                                      onChange={(e) => updateOption(questionIndex, optionIndex, e.target.value)}
                                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                      placeholder={`Option ${optionIndex + 1}`}
                                    />
                                    <button
                                      type="button"
                                      onClick={() => removeOption(questionIndex, optionIndex)}
                                      className="text-red-600 hover:text-red-900"
                                    >
                                      Remove
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* True/False options */}
                          {question.type === 'true_false' && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Correct Answer *
                              </label>
                              <select
                                required
                                value={question.correct_answer}
                                onChange={(e) => updateQuestion(questionIndex, 'correct_answer', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="">Select Answer</option>
                                <option value="true">True</option>
                                <option value="false">False</option>
                              </select>
                            </div>
                          )}

                          {/* Correct Answer for other types */}
                          {question.type !== 'true_false' && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Correct Answer *
                              </label>
                              <input
                                type="text"
                                required
                                value={question.correct_answer}
                                onChange={(e) => updateQuestion(questionIndex, 'correct_answer', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder={question.type === 'text' ? 'Expected answer' : 'Correct option'}
                              />
                            </div>
                          )}

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Explanation (Optional)
                            </label>
                            <textarea
                              value={question.explanation || ''}
                              onChange={(e) => updateQuestion(questionIndex, 'explanation', e.target.value)}
                              rows={2}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Explanation for the correct answer"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                    Active
                  </label>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="admin-button admin-button-secondary cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="admin-button admin-button-primary cursor-pointer"
                  >
                    {editingTest ? 'Update Test' : 'Create Test'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tests;
