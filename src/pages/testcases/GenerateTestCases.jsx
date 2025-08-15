import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
  import { apiService } from '../../services/apiService';
import { 
  FaTasks, 
  FaCheck, 
  FaEdit, 
  FaTrash, 
  FaCheckCircle,
  FaSave,
  FaTimes,
  FaClipboardList
} from 'react-icons/fa';
  // Approve selected test cases
  const handleApproveSelected = async () => {
    const selected = testCases.filter(tc => tc.checked && !tc.approved);
    if (selected.length === 0) return;
    try {
      for (const testCase of selected) {
        await apiService.updateTestCase({ ...testCase, approved: true });
      }
      setTestCases(cases =>
        cases.map(tc =>
          tc.checked ? { ...tc, approved: true, checked: false } : tc
        )
      );
      alert('Selected test cases approved!');
    } catch (error) {
      alert('Failed to approve selected test cases.');
    }
  };

export default function GenerateTestCases() {
  const [activeMenu, setActiveMenu] = useState('Generate Test Cases');
  const [testCases, setTestCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [editingValues, setEditingValues] = useState({});

  // Load test cases from external API service
  useEffect(() => {
    const loadTestCases = async () => {
      try {
        setLoading(true);
        const response = await apiService.getTestCases();
        console.log('API raw response:', response);
        const testPlans = (response && (response.success === true || response.code === 200) && response.data && Array.isArray(response.data.test_plans))
          ? response.data.test_plans
          : null;
        if (Array.isArray(testPlans)) {
          const normalizedData = testPlans.map((plan, idx) => {
            let preconditions = '';
            if (typeof plan.preconditions === 'string') {
              try {
                const arr = JSON.parse(plan.preconditions);
                if (Array.isArray(arr)) preconditions = arr.join('\n');
                else preconditions = plan.preconditions;
              } catch {
                preconditions = plan.preconditions;
              }
            } else if (Array.isArray(plan.preconditions)) {
              preconditions = plan.preconditions.join('\n');
            }
            let postconditions = '';
            if (Array.isArray(plan.postconditions)) {
              postconditions = plan.postconditions.join('\n');
            } else if (typeof plan.postconditions === 'string') {
              postconditions = plan.postconditions;
            }
            let testSteps = '';
            let expResult = plan.expected_result || '';
            if (Array.isArray(plan.test_steps)) {
              testSteps = plan.test_steps.map((step, index) => 
                `${step.step_number || (index + 1)}. ${step.action}`
              ).filter(Boolean).join('\n');
              if (!expResult) {
                expResult = plan.test_steps.map(step => step.expected_result).filter(Boolean).join('\n');
              }
            } else if (typeof plan.test_steps === 'string') {
              testSteps = plan.test_steps;
            }
            let userStory = plan.user_story?.title || plan.title || plan.description || '';
            return {
              id: plan.id,
              usid: plan.user_story_id || `USID-${plan.id}`,
              tpid: plan.test_plan_id || `TPID-${plan.id}`,
              userStory,
              preconditions,
              postconditions,
              expResult,
              testSteps,
              checked: false,
              // Store original API fields for reference
              title: plan.title,
              description: plan.description,
              test_plan_id: plan.test_plan_id,
              user_story_id: plan.user_story_id,
              qa_processed: plan.qa_processed,
              tags: plan.tags,
              void_ind: plan.void_ind,
              created_at: plan.created_at,
              user_story: plan.user_story
            };
          });
          setTestCases(normalizedData);
          setError('');
          console.log('Normalized test cases:', normalizedData);
        } else {
          // Fallback sample test case
          const sampleTestCases = [
            {
              id: 1,
              usid: 'USID-1',
              tpid: 'TPID-1',
              userStory: 'As a user, I want to log in so I can access my dashboard.',
              preconditions: 'User is registered.',
              postconditions: 'User is redirected to dashboard.',
              expResult: 'Dashboard loads successfully.',
              testSteps: '1. Enter username and password\n2. Click login',
              checked: false
            }
          ];
          setTestCases(sampleTestCases);
          setError('API service not available - showing sample test cases.');
        }
      } catch (err) {
        // Fallback sample test case
        const sampleTestCases = [
          {
            id: 1,
            usid: 'USID-1',
            tpid: 'TPID-1',
            userStory: 'As a user, I want to log in so I can access my dashboard.',
            preconditions: 'User is registered.',
            postconditions: 'User is redirected to dashboard.',
            expResult: 'Dashboard loads successfully.',
            testSteps: '1. Enter username and password\n2. Click login',
            checked: false
          }
        ];
        setTestCases(sampleTestCases);
        setError('API service not available - showing sample test cases.');
      } finally {
        setLoading(false);
      }
    };
    loadTestCases();
  }, []);

  const handleCancel = (id) => {
    setTestCases(cases => 
      cases.map(testCase => 
        testCase.id === id ? { ...testCase, isEditing: false } : testCase
      )
    );
    setEditingValues({});
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this test case?')) {
      try {
        console.log('Attempting to delete test case with ID:', id);
        
        // Call API to delete test case
        await apiService.deleteTestCase(id);
        
        // Update local state on success
        setTestCases(cases => cases.filter(testCase => testCase.id !== id));
        
        // Show success message
        alert('Test case deleted successfully!');
      } catch (error) {
        console.error('Failed to delete test case:', error);
        console.error('Error details:', {
          message: error.message,
          stack: error.stack,
          name: error.name
        });
        
        // Show user-friendly error message
        let errorMessage = 'Failed to delete test case';
        if (error.message.includes('Network error')) {
          errorMessage = 'Network error: Please check if the server is running.';
        } else if (error.message.includes('404')) {
          errorMessage = 'Test case not found on server';
        } else if (error.message.includes('500')) {
          errorMessage = 'Server error: Please try again later';
        } else {
          errorMessage = `Failed to delete test case: ${error.message}`;
        }
        
        alert(errorMessage);
      }
    }
  };

  // handleAddNew removed

  const handleInputChange = (field, value) => {
    setEditingValues(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Professional IT Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/background.jpg" 
          alt="IT Professional Background" 
          className="w-full h-full object-cover"
          onError={(e) => { 
            e.target.style.display = 'none';
            e.target.parentElement.style.background = 'linear-gradient(to bottom right, #0f172a, #1e293b, #334155)';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/85 via-blue-900/75 to-slate-800/90 backdrop-blur-[1px]"></div>
      </div>

      {/* Animated background particles */}
      {/* Removed all animated background ovals for a clean background */}

      <div className="relative z-20">
      <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
      
      <main className="pt-8 flex flex-col min-h-screen transition-all duration-300 ease-in-out bg-transparent">
        <div className="flex-grow w-full px-4 md:px-8 py-8 md:py-12 lg:py-16 overflow-x-auto">
          {/* Header */}
          <header className="bg-slate-900/70 backdrop-blur-md border border-slate-600/50 rounded-xl p-6 mb-8 shadow-2xl hover:bg-slate-900/80 hover:shadow-purple-500/10 transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FaTasks className="text-purple-400 text-3xl group-hover:text-purple-300 group-hover:scale-110 transition-all duration-300" />
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent group-hover:from-purple-300 group-hover:to-blue-300 transition-all duration-300">
                    Test Plan Review
                  </h1>
                  <p className="text-slate-300 group-hover:text-slate-200 transition-colors duration-300">
                    Review, edit, and approve generated test cases
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  className={`px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition-colors flex items-center gap-2 shadow-lg shadow-green-300/30 ${testCases.filter(tc => tc.checked && !tc.approved).length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={handleApproveSelected}
                  disabled={testCases.filter(tc => tc.checked && !tc.approved).length === 0}
                  title="Approve selected test cases"
                >
                  <FaCheckCircle className="text-white" />
                  Approve
                </button>
              </div>
            </div>
          </header>

          {/* Test Cases Table */}
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border border-slate-600/50 rounded-xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-700/50 border-b border-slate-600/50">
                  <tr>
                    {/* Checkbox column removed */}
                    <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Title</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Description</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Pre-Conditions</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Post-Conditions</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Test Steps</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-slate-300 w-24">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-600/30">
                  {testCases.map((testCase) => (
                    <tr key={testCase.id} className={`hover:bg-slate-700/20 transition-colors ${testCase.approved ? 'bg-green-900/10 border-l-4 border-green-500' : ''}`}>
                      <td className="px-4 py-4 text-center">
                        <input
                          type="checkbox"
                          checked={!!testCase.checked}
                          onChange={() => setTestCases(cases => cases.map(tc => tc.id === testCase.id ? { ...tc, checked: !tc.checked } : tc))}
                          disabled={!!testCase.approved}
                          className="form-checkbox h-5 w-5 text-green-500 rounded focus:ring-0 border-slate-500 bg-slate-800 cursor-pointer disabled:opacity-50"
                          title={testCase.approved ? 'Already approved' : 'Select for approval'}
                        />
                      </td>
                      <td className="px-6 py-4">
                        {testCase.isEditing ? (
                          <textarea
                            value={editingValues.userStory || ''}
                            onChange={(e) => handleInputChange('userStory', e.target.value)}
                            className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded text-white text-sm resize-vertical min-h-[80px]"
                          />
                        ) : (
                          <p className="text-slate-200 text-sm leading-relaxed">{testCase.userStory}</p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-slate-200 text-sm leading-relaxed">{testCase.description}</p>
                      </td>
                      <td className="px-6 py-4">
                        {testCase.isEditing ? (
                          <textarea
                            value={editingValues.preconditions || ''}
                            onChange={(e) => handleInputChange('preconditions', e.target.value)}
                            className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded text-white text-sm resize-vertical min-h-[60px]"
                          />
                        ) : (
                          <p className="text-slate-200 text-sm leading-relaxed">{testCase.preconditions}</p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                      {testCase.isEditing ? (
                        <textarea
                          value={editingValues.postconditions || ''}
                          onChange={(e) => handleInputChange('postconditions', e.target.value)}
                          className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded text-white text-sm resize-vertical min-h-[60px]"
                        />
                      ) : (
                        <p className="text-slate-200 text-sm leading-relaxed">{testCase.postconditions}</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="overflow-y-auto max-h-32">
                        {testCase.isEditing ? (
                          <textarea
                            value={editingValues.testSteps || ''}
                            onChange={(e) => handleInputChange('testSteps', e.target.value)}
                            className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded text-white text-sm resize-vertical min-h-[60px]"
                          />
                        ) : (
                          <p className="text-slate-200 text-sm leading-relaxed">{testCase.testSteps}</p>
                        )}
                      </div>
                    </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {testCase.isEditing ? (
                            <>
                              <button
                                onClick={() => handleSave(testCase.id)}
                                className="p-2 bg-green-600/20 hover:bg-green-600/30 text-green-400 rounded transition-colors"
                                title="Save"
                              >
                                <FaSave />
                              </button>
                              <button
                                onClick={() => handleCancel(testCase.id)}
                                className="p-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded transition-colors"
                                title="Cancel"
                              >
                                <FaTimes />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleEdit(testCase)}
                                className="p-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded transition-colors"
                                title="Edit"
                              >
                                <FaEdit />
                              </button>
                              <button
                                onClick={() => handleDelete(testCase.id)}
                                className="p-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded transition-colors"
                                title="Delete"
                              >
                                <FaTrash />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {testCases.length === 0 && (
              <div className="text-center py-12">
                <FaClipboardList className="text-4xl text-slate-500 mx-auto mb-4" />
                <p className="text-slate-400">No test cases found.</p>
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="mt-6 bg-slate-700/20 border border-slate-600/30 rounded-lg p-4">
            <div className="flex items-center text-sm text-slate-300">
              Total: {testCases.length} test cases
            </div>
          </div>

          {/* Test Guidelines */}
          <div className="mt-6 bg-slate-700/20 border border-slate-600/30 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <FaClipboardList className="text-purple-400" />
              Test Case Guidelines
            </h3>
            <div className="grid md:grid-cols-2 gap-6 text-sm text-slate-300">
              <div>
                <h4 className="font-medium text-white mb-2">Good Test Scenarios Include:</h4>
                <ul className="space-y-1">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    Positive and negative test cases
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    Boundary value testing
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    Error handling validation
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    User interface interactions
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-white mb-2">Test Structure:</h4>
                <ul className="space-y-1">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    Clear test objectives
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    Step-by-step procedures
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    Expected results
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    Pass/fail criteria
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
      </div>
    </div>
  );
}
