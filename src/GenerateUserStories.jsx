import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import { apiService } from './services/apiService';
import { 
  FaFileAlt, 
  FaCheck, 
  FaEdit, 
  FaTrash, 
  FaPlus,
  FaCheckCircle,
  FaSave,
  FaTimes,
  FaClipboardList
} from 'react-icons/fa';

export default function GenerateUserStories() {
  const [activeMenu, setActiveMenu] = useState('Generate User Stories');
  const [userStories, setUserStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [editingValues, setEditingValues] = useState({});

  // Load user stories from external API service
  useEffect(() => {
    const loadUserStories = async () => {
      try {
        setLoading(true);
        setError('');
        console.log('Attempting to load user stories from API...');
        // Try to fetch from the API endpoint
        const response = await apiService.getUserStories('user@example.com');
        if (response && response.success && response.data && response.data.user_stories) {
          // Transform API data to match component structure
          const transformedStories = response.data.user_stories.map(story => ({
            id: story.id,
            user_story_id: story.user_story_id,
            checked: false,
            userStory: story.title,
            useCases: story.description,
            acceptanceCriteria: (() => {
              // Handle acceptance_criteria which comes as JSON string
              if (typeof story.acceptance_criteria === 'string') {
                try {
                  const parsed = JSON.parse(story.acceptance_criteria);
                  return Array.isArray(parsed) ? parsed.join('\n') : story.acceptance_criteria;
                } catch {
                  return story.acceptance_criteria;
                }
              }
              return Array.isArray(story.acceptance_criteria) 
                ? story.acceptance_criteria.join('\n') 
                : story.acceptance_criteria;
            })(),
            isEditing: false,
            // Store additional API fields
            tags: (() => {
              // Handle tags which comes as JSON string
              if (typeof story.tags === 'string') {
                try {
                  return JSON.parse(story.tags);
                } catch {
                  return story.tags;
                }
              }
              return story.tags;
            })(),
            created_at: story.created_at,
            updated_at: story.updated_at,
            user: story.user,
            media_file_id: story.media_file_id,
            ba_processed: story.ba_processed,
            void_ind: story.void_ind,
            jira_key: story.jira_key
          }));
          
          setUserStories(transformedStories);
          console.log('Successfully loaded user stories from API:', transformedStories.length, 'stories');
        } else {
          throw new Error('Invalid API response format');
        }
      } catch (err) {
        console.log('API service unavailable. Error:', err.message);
        setError('API service not available - no user stories to display');
        
        // No fallback data - show empty state
        setUserStories([]);
      } finally {
        setLoading(false);
      }
    };

    loadUserStories();
  }, []);

  const handleCheckboxChange = (id) => {
    setUserStories(stories => 
      stories.map(story => 
        story.id === id ? { ...story, checked: !story.checked } : story
      )
    );
  };

  const handleEdit = (story) => {
    setUserStories(stories => 
      stories.map(s => 
        s.id === story.id ? { ...s, isEditing: true } : s
      )
    );
    setEditingValues({
      userStory: story.userStory,
      useCases: story.useCases,
      acceptanceCriteria: story.acceptanceCriteria
    });
  };

  const handleSave = async (id) => {
    try {
      // Find the current user story to get all its fields
      const currentStory = userStories.find(story => story.id === id);
      
      // Prepare data for API call with all required fields
      const userStoryToUpdate = {
        id: id,
        title: editingValues.userStory,
        description: editingValues.useCases,
        acceptance_criteria: Array.isArray(editingValues.acceptanceCriteria) 
          ? JSON.stringify(editingValues.acceptanceCriteria)
          : typeof editingValues.acceptanceCriteria === 'string' && editingValues.acceptanceCriteria.startsWith('[')
            ? editingValues.acceptanceCriteria
            : JSON.stringify(editingValues.acceptanceCriteria ? editingValues.acceptanceCriteria.split('\n').filter(Boolean) : []),
        ba_processed: currentStory?.ba_processed || 0,
        media_file_id: currentStory?.media_file_id || "1",
        tags: Array.isArray(currentStory?.tags) 
          ? JSON.stringify(currentStory.tags)
          : typeof currentStory?.tags === 'string' && currentStory.tags.startsWith('[')
            ? currentStory.tags
            : JSON.stringify(currentStory?.tags || []),
        user: currentStory?.user || "user@example.com",
        user_story_id: currentStory?.user_story_id,
        void_ind: currentStory?.void_ind || 0,
        jira_key: currentStory?.jira_key || null,
        created_at: currentStory?.created_at,
        updated_at: new Date().toISOString()
      };

      // Call API to update user story
      await apiService.updateUserStory(userStoryToUpdate);

      // Update local state on success
      setUserStories(stories => 
        stories.map(story => 
          story.id === id 
            ? { 
                ...story, 
                userStory: editingValues.userStory,
                useCases: editingValues.useCases,
                acceptanceCriteria: editingValues.acceptanceCriteria,
                isEditing: false 
              } 
            : story
        )
      );
      setEditingValues({});
      
      // Show success message
      alert('User story updated successfully!');
    } catch (error) {
      console.error('Failed to update user story:', error);
      alert(`Failed to update user story: ${error.message}`);
    }
  };

  const handleCancel = (id) => {
    setUserStories(stories => 
      stories.map(story => 
        story.id === id ? { ...story, isEditing: false } : story
      )
    );
    setEditingValues({});
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user story?')) {
      try {
        console.log('Attempting to delete user story with ID:', id);
        
        // Call API to delete user story
        await apiService.deleteUserStory(id);
        
        // Update local state on success
        setUserStories(stories => stories.filter(story => story.id !== id));
        
        // Show success message
        alert('User story deleted successfully!');
      } catch (error) {
        console.error('Failed to delete user story:', error);
        console.error('Error details:', {
          message: error.message,
          stack: error.stack,
          name: error.name
        });
        
        // Show user-friendly error message
        let errorMessage = 'Failed to delete user story';
        if (error.message.includes('Network error')) {
          errorMessage = 'Network error: Please check if the server is running at http://localhost:5001';
        } else if (error.message.includes('404')) {
          errorMessage = 'User story not found on server';
        } else if (error.message.includes('500')) {
          errorMessage = 'Server error: Please try again later';
        } else {
          errorMessage = `Failed to delete user story: ${error.message}`;
        }
        
        alert(errorMessage);
      }
    }
  };

  const handleAddNew = () => {
    const newId = Math.max(...userStories.map(s => s.id)) + 1;
    const newStory = {
      id: newId,
      checked: false,
      userStory: "New user story...",
      useCases: "Define use cases...",
      acceptanceCriteria: "Define acceptance criteria...",
      isEditing: true
    };
    setUserStories([...userStories, newStory]);
    setEditingValues({
      userStory: newStory.userStory,
      useCases: newStory.useCases,
      acceptanceCriteria: newStory.acceptanceCriteria
    });
  };


  // Approve selected user stories
  const handleApproveSelected = async () => {
    const selected = userStories.filter(s => s.checked && !s.approved);
    if (selected.length === 0) return;
    try {
      for (const story of selected) {
        await apiService.updateUserStory({ ...story, approved: true });
      }
      setUserStories(stories =>
        stories.map(s =>
          s.checked ? { ...s, approved: true, checked: false } : s
        )
      );
      alert('Selected user stories approved!');
    } catch (error) {
      alert('Failed to approve selected user stories.');
    }
  };

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
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500/3 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-20">
      <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
      
      <main className="pt-8 flex flex-col min-h-screen transition-all duration-300 ease-in-out bg-transparent">
        <div className="flex-grow w-full px-4 md:px-8 py-8 md:py-12 lg:py-16 overflow-x-auto">
          {/* Header */}
          <header className="bg-slate-900/70 backdrop-blur-md border border-slate-600/50 rounded-xl p-6 mb-8 shadow-2xl hover:bg-slate-900/80 hover:shadow-purple-500/10 transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FaFileAlt className="text-purple-400 text-3xl group-hover:text-purple-300 group-hover:scale-110 transition-all duration-300" />
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent group-hover:from-purple-300 group-hover:to-blue-300 transition-all duration-300">
                    User Stories Review
                  </h1>
                  <p className="text-slate-300 group-hover:text-slate-200 transition-colors duration-300">
                    Review, edit, and approve generated user stories
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  className={`px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition-colors flex items-center gap-2 shadow-lg shadow-green-300/30 ${userStories.filter(s => s.checked && !s.approved).length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={handleApproveSelected}
                  disabled={userStories.filter(s => s.checked && !s.approved).length === 0}
                  title="Approve selected user stories"
                >
                  <FaCheckCircle className="text-white" />
                  Approve
                </button>
              </div>
            </div>
          </header>


          {/* User Stories Table */}
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border border-slate-600/50 rounded-xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-700/50 border-b border-slate-600/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Title</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Description</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Acceptance Criteria</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-slate-300 w-32">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-600/30">
                  {userStories.map((story) => (
                    <tr key={story.id} className={`hover:bg-slate-700/20 transition-colors ${story.approved ? 'bg-green-900/10 border-l-4 border-green-500' : ''}`}>
                      
                      <td className="px-6 py-4 text-center">
                        {story.isEditing ? (
                          <textarea
                            value={editingValues.userStory || ''}
                            onChange={(e) => handleInputChange('userStory', e.target.value)}
                            className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded text-white text-sm resize-vertical min-h-[80px] text-center"
                          />
                        ) : (
                          <p className="text-slate-200 text-sm leading-relaxed text-center">{story.userStory}</p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {story.isEditing ? (
                          <textarea
                            value={editingValues.useCases || ''}
                            onChange={(e) => handleInputChange('useCases', e.target.value)}
                            className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded text-white text-sm resize-vertical min-h-[80px]"
                          />
                        ) : (
                          <p className="text-slate-200 text-sm leading-relaxed">{story.useCases}</p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {story.isEditing ? (
                          <textarea
                            value={editingValues.acceptanceCriteria || ''}
                            onChange={(e) => handleInputChange('acceptanceCriteria', e.target.value)}
                            className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded text-white text-sm resize-vertical min-h-[80px]"
                          />
                        ) : (
                          <p className="text-slate-200 text-sm leading-relaxed">{story.acceptanceCriteria}</p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {story.isEditing ? (
                            <>
                              <button
                                onClick={() => handleSave(story.id)}
                                className="p-2 bg-green-600/20 hover:bg-green-600/30 text-green-400 rounded transition-colors"
                                title="Save"
                              >
                                <FaSave />
                              </button>
                              <button
                                onClick={() => handleCancel(story.id)}
                                className="p-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded transition-colors"
                                title="Cancel"
                              >
                                <FaTimes />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleEdit(story)}
                                className="p-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded transition-colors"
                                title="Edit"
                              >
                                <FaEdit />
                              </button>
                              <button
                                onClick={() => handleDelete(story.id)}
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
            
            {userStories.length === 0 && (
              <div className="text-center py-12">
                <FaClipboardList className="text-4xl text-slate-500 mx-auto mb-4" />
                <p className="text-slate-400">No user stories found.</p>
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="mt-6 bg-slate-700/20 border border-slate-600/30 rounded-lg p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-300">
                Total: {userStories.length} user stories | Selected: {userStories.filter(s => s.checked).length} | Approved: {userStories.filter(s => s.approved).length}
              </span>
              <span className="text-slate-400">
                Click checkboxes to select user stories for approval
              </span>
            </div>
          </div>

          {/* User Story Guidelines */}
          <div className="mt-6 bg-slate-700/20 border border-slate-600/30 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <FaClipboardList className="text-purple-400" />
              User Story Guidelines
            </h3>
            <div className="grid md:grid-cols-2 gap-6 text-sm text-slate-300">
              <div>
                <h4 className="font-medium text-white mb-2">Good User Stories Include:</h4>
                <ul className="space-y-1">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    Clear user persona and role
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    Specific functionality desired
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    Business value and benefit
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    Measurable acceptance criteria
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-white mb-2">Story Structure:</h4>
                <ul className="space-y-1">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    "As a [user type]..."
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    "I want [functionality]..."
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    "So that [benefit]..."
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    Clear acceptance criteria
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
