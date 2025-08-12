/**
 * API Service for External Python Service Integration
 * =================================================
 * 
 * This service handles all API calls to your custom Python service
 * Replace baseURL with your actual server URL (e.g., /)
 * 
 * ENDPOINTS SUPPORTED:
 * - POST /agent/upload_files - Agent upload files
 * - GET /user_stories?user=user@example.com - Get user Stories
 * - PUT /user_stories - Update User Stories
 * - GET /test_plans - Get Test Plan URL
 * - PUT /test_plans - Update Test Plan URL
 * - GET /agent/tools - Get Agent Tools
 * - GET /health - Health Check
 */

class ApiService {
  constructor(baseURL = '') {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  /**
   * Set authentication headers for all requests
   * @param {string} token - Bearer token or API key
   * @param {string} type - 'Bearer' or 'ApiKey'
   */
  setAuth(token, type = 'Bearer') {
    this.defaultHeaders['Authorization'] = `${type} ${token}`;
  }

  /**
   * Set custom headers
   * @param {Object} headers - Custom headers object
   */
  setHeaders(headers) {
    this.defaultHeaders = { ...this.defaultHeaders, ...headers };
  }

  /**
   * Generic fetch wrapper with error handling
   * @param {string} url - API endpoint
   * @param {Object} options - Fetch options
   * @returns {Promise} Response data
   */
  async request(url, options = {}) {
    try {
      let headers = { ...this.defaultHeaders, ...options.headers };
      
      // For FormData, remove Content-Type header to let browser handle it
      if (options.body instanceof FormData) {
        const { 'Content-Type': contentType, ...headersWithoutContentType } = headers;
        headers = headersWithoutContentType;
        console.log('🔧 Removed Content-Type header for FormData upload');
      }

      const config = {
        ...options,
        headers
      };

      // Debug: log the final request configuration
      console.log('🌐 Final request config:');
      console.log('  - URL:', `${this.baseURL}${url}`);
      console.log('  - Method:', config.method || 'GET');
      console.log('  - Headers:', config.headers);
      console.log('  - Body type:', config.body?.constructor?.name || 'none');

      const response = await fetch(`${this.baseURL}${url}`, config);
      
      if (!response.ok) {
        let errorMessage;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.detail || errorData.error || `HTTP ${response.status}: ${response.statusText}`;
        } catch {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      // For DELETE requests, some servers might return empty response
      if (response.status === 204 || response.headers.get('content-length') === '0') {
        return { success: true, message: 'Operation completed successfully' };
      }

      return await response.json();
    } catch (error) {
      console.error(`API Request failed for ${url}:`, error);
      // Add more context to the error
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Network error: Unable to connect to the server. Please check if the server is running.');
      }
      throw error;
    }
  }

  // ==========================================
  // API ENDPOINTS IMPLEMENTATION
  // ==========================================

  /**
   * GET /agent/tools - Get available agent tools
   * @returns {Promise} List of available tools
   */
  async getAgentTools() {
    return this.request('/agent/tools', {
      method: 'GET'
    });
  }

  /**
   * POST /upload_files - Standard upload files
   * @param {File} file - File to upload
   * @param {Object} additionalData - Additional form data
   * @returns {Promise} Upload response
   */
  async uploadFiles(file, additionalData = {}) {
    const formData = new FormData();
    formData.append('files', file); // Changed from 'file' to 'files' to match server expectation
    
    // Add any additional form data
    Object.keys(additionalData).forEach(key => {
      formData.append(key, additionalData[key]);
    });

    return this.request('/agent/upload_files', {
      method: 'POST',
      body: formData
    });
  }

  /**
   * POST /agent/upload_files - Agent upload files
   * Matches curl command: curl --location --globoff '{{baseURL}}/agent/upload_files' \
   * --form 'user="user@example.com"' \
   * --form 'files=@"/path/to/file"'
   * @param {File|File[]} files - File(s) to upload
   * @param {string} userEmail - User's email address (default: user@example.com)
   * @param {Object} additionalData - Additional form data
   * @returns {Promise} Upload response
   */
  async agentUploadFiles(files, userEmail = 'user@example.com', additionalData = {}) {
    const formData = new FormData();
    
    // Debug logging
    console.log('🔍 Debug agentUploadFiles:');
    console.log('  - files:', files);
    console.log('  - userEmail:', userEmail);
    console.log('  - additionalData:', additionalData);
    console.log('  - files type:', typeof files);
    console.log('  - files instanceof File:', files instanceof File);
    
    // Validate files parameter
    if (!files) {
      throw new Error('No files provided to upload');
    }
    
    // Add user field as required by the curl command
    formData.append('user', userEmail);
    
    // Handle both single file and multiple files
    if (Array.isArray(files)) {
      console.log('  - Adding files as array, length:', files.length);
      if (files.length === 0) {
        throw new Error('Files array is empty');
      }
      files.forEach((file, index) => {
        if (!file || !(file instanceof File)) {
          throw new Error(`Invalid file object at index ${index}`);
        }
        console.log(`  - File ${index}:`, file.name, file.size, 'bytes');
        formData.append('files', file);
      });
    } else {
      if (!(files instanceof File)) {
        throw new Error('Invalid file object - not a File instance');
      }
      console.log('  - Adding single file:', files?.name, files?.size, 'bytes');
      formData.append('files', files);
    }
    
    // Add any additional form data
    Object.keys(additionalData).forEach(key => {
      formData.append(key, additionalData[key]);
    });

    // Debug FormData contents
    console.log('📋 FormData entries:');
    for (let [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`  - ${key}: File(${value.name}, ${value.size} bytes)`);
      } else {
        console.log(`  - ${key}: ${value}`);
      }
    }

    // Prepare headers for FormData upload
    const uploadHeaders = {};
    // Explicitly don't set Content-Type - let browser set it with boundary
    
    console.log('📤 Request details:');
    console.log('  - URL:', '/agent/upload_files (via Vite proxy)');
    console.log('  - Method: POST');
    console.log('  - Headers: {}');
    console.log('  - Body type:', formData.constructor.name);

    // Use relative URL to go through Vite proxy in development
    try {
      const response = await fetch('/agent/upload_files', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        let errorMessage;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.detail || errorData.error || `HTTP ${response.status}: ${response.statusText}`;
        } catch {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Request failed for /agent/upload_files:`, error);
      throw error;
    }
  }

  /**
   * GET /user_stories?user=email - Get user Stories
   * @param {string} userEmail - User's email address (default: user@example.com)
   * @returns {Promise} User's stories
   */
  async getUserStories(userEmail = 'user@example.com') {
    const url = `/user_stories?user=${encodeURIComponent(userEmail)}`;
    
    // Use relative URL to go through Vite proxy in development
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        let errorMessage;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.detail || errorData.error || `HTTP ${response.status}: ${response.statusText}`;
        } catch {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Request failed for ${url}:`, error);
      throw error;
    }
  }

  /**
   * PUT /user_stories - Update User Stories
   * @param {Object} userStoryData - User story data to update
   * @returns {Promise} Update response
   */
  async updateUserStories(userStoryData) {
    return this.request('/user_stories', {
      method: 'PUT',
      body: JSON.stringify(userStoryData)
    });
  }

  /**
   * GET /test_plans - Get Test Plan URL
   * @returns {Promise} Test plans
   */
  async getTestPlans() {
    // Use relative URL to go through Vite proxy in development
    try {
      const response = await fetch('/test_plans', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        let errorMessage;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.detail || errorData.error || `HTTP ${response.status}: ${response.statusText}`;
        } catch {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Request failed for /test_plans:`, error);
      throw error;
    }
  }

  /**
   * PUT /test_plans - Update Test Plan URL
   * @param {Object} testPlanData - Test plan data to update
   * @returns {Promise} Update response
   */
  async updateTestPlans(testPlanData) {
    return this.request('/test_plans', {
      method: 'PUT',
      body: JSON.stringify(testPlanData)
    });
  }

  /**
   * PUT /user_stories - Update individual user story (new format)
   * @param {Object} userStoryData - User story data to update
   * @returns {Promise} Update response
   */
  async updateUserStory(userStoryData) {
    return this.request('/user_stories', {
      method: 'PUT',
      body: JSON.stringify({
        user_stories: [userStoryData]
      })
    });
  }

  /**
   * PUT /user_stories - "Delete" individual user story (soft delete using void_ind flag)
   * @param {string|number} storyId - User story ID to delete
   * @returns {Promise} Delete response
   */
  async deleteUserStory(storyId) {
    // Backend expects an array under user_stories
    return this.request('/user_stories', {
      method: 'PUT',
      body: JSON.stringify({
        user_stories: [
          {
            id: storyId,
            void_ind: true,
            action: 'delete'
          }
        ]
      })
    });
  }

  /**
   * POST /user_stories/approve - Approve multiple user stories
   * @param {Array} userStories - Array of user stories to approve
   * @returns {Promise} Approval response
   */
  async approveUserStories(userStories) {
    return this.request('/user_stories/approve', {
      method: 'POST',
      body: JSON.stringify({ 
        user_stories: userStories,
        approved: true,
        approved_at: new Date().toISOString()
      })
    });
  }

  /**
   * PUT /user_stories - Bulk update user stories with approval status
   * @param {Array} userStories - Array of user stories to approve
   * @returns {Promise} Update response
   */
  async bulkUpdateUserStories(userStories) {
    return this.request('/user_stories', {
      method: 'PUT',
      body: JSON.stringify({ 
        user_stories: userStories.map(story => ({
          id: story.id,
          title: story.userStory,
          description: story.useCases,
          acceptance_criteria: Array.isArray(story.acceptanceCriteria) 
            ? JSON.stringify(story.acceptanceCriteria)
            : typeof story.acceptanceCriteria === 'string' && story.acceptanceCriteria.startsWith('[')
              ? story.acceptanceCriteria
              : JSON.stringify(story.acceptanceCriteria ? story.acceptanceCriteria.split('\n').filter(Boolean) : []),
          ba_processed: story.ba_processed || 0,
          media_file_id: story.media_file_id || "1",
          tags: Array.isArray(story.tags) 
            ? JSON.stringify(story.tags)
            : typeof story.tags === 'string' && story.tags.startsWith('[')
              ? story.tags
              : JSON.stringify(story.tags || []),
          user: story.user || "user@example.com",
          user_story_id: story.user_story_id,
          void_ind: story.void_ind || 0,
          jira_key: story.jira_key || null,
          created_at: story.created_at,
          updated_at: new Date().toISOString()
        }))
      })
    });
  }

  /**
   * PUT /test_plans - Update individual test case (new format)
   * @param {Object} testCaseData - Test case data to update
   * @returns {Promise} Update response
   */
  async updateTestCase(testCaseData) {
    return this.request('/test_plans', {
      method: 'PUT',
      body: JSON.stringify({
        test_plans: [{
          id: testCaseData.id,
          title: testCaseData.title,
          description: testCaseData.description,
          preconditions: Array.isArray(testCaseData.preconditions) 
            ? JSON.stringify(testCaseData.preconditions)
            : typeof testCaseData.preconditions === 'string' && testCaseData.preconditions.startsWith('[')
              ? testCaseData.preconditions
              : JSON.stringify(testCaseData.preconditions ? testCaseData.preconditions.split('\n').filter(Boolean) : []),
          postconditions: Array.isArray(testCaseData.postconditions)
            ? testCaseData.postconditions
            : typeof testCaseData.postconditions === 'string' 
              ? testCaseData.postconditions.split('\n').filter(Boolean)
              : [testCaseData.postconditions || ""],
          expected_result: testCaseData.expected_result,
          test_steps: Array.isArray(testCaseData.test_steps)
            ? testCaseData.test_steps
            : typeof testCaseData.test_steps === 'string'
              ? testCaseData.test_steps.split('\n').filter(Boolean).map((step, index) => ({
                  step_number: index + 1,
                  action: step,
                  expected_result: ""
                }))
              : [],
          qa_processed: testCaseData.qa_processed || 0,
          tags: Array.isArray(testCaseData.tags) ? testCaseData.tags : (testCaseData.tags ? [testCaseData.tags] : []),
          test_plan_id: testCaseData.test_plan_id,
          user_story_id: testCaseData.user_story_id,
          void_ind: testCaseData.void_ind || 0,
          created_at: testCaseData.created_at,
          updated_at: new Date().toISOString()
        }]
      })
    });
  }

  /**
   * DELETE /test_plans - Delete individual test case
   * @param {string|number} testCaseId - Test case ID to delete
   * @returns {Promise} Delete response
   */
  async deleteTestCase(testCaseId) {
    return this.request(`/test_plans/${testCaseId}`, {
      method: 'DELETE'
    });
  }

  /**
   * POST /test_plans/approve - Approve multiple test cases
   * @param {Array} testCases - Array of test cases to approve
   * @returns {Promise} Approval response
   */
  async approveTestCases(testCases) {
    return this.request('/test_plans/approve', {
      method: 'POST',
      body: JSON.stringify({ 
        test_cases: testCases,
        approved: true,
        approved_at: new Date().toISOString()
      })
    });
  }

  /**
   * PUT /test_plans - Bulk update test cases with approval status
   * @param {Array} testCases - Array of test cases to approve
   * @returns {Promise} Update response
   */
  async bulkUpdateTestCases(testCases) {
    return this.request('/test_plans', {
      method: 'PUT',
      body: JSON.stringify({ 
        test_plans: testCases.map(tc => ({
          id: tc.id,
          title: tc.title || tc.userStory,
          description: tc.description || tc.userStory,
          preconditions: Array.isArray(tc.preconditions) 
            ? JSON.stringify(tc.preconditions)
            : typeof tc.preconditions === 'string' && tc.preconditions.startsWith('[')
              ? tc.preconditions
              : JSON.stringify(tc.preconditions ? tc.preconditions.split('\n').filter(Boolean) : []),
          postconditions: Array.isArray(tc.postconditions)
            ? tc.postconditions
            : typeof tc.postconditions === 'string' 
              ? tc.postconditions.split('\n').filter(Boolean)
              : [tc.postconditions || ""],
          expected_result: tc.expResult || tc.expected_result,
          test_steps: Array.isArray(tc.testSteps)
            ? tc.testSteps
            : typeof tc.testSteps === 'string'
              ? tc.testSteps.split('\n').filter(Boolean).map((step, index) => ({
                  step_number: index + 1,
                  action: step,
                  expected_result: ""
                }))
              : [],
          qa_processed: tc.qa_processed || 0,
          tags: Array.isArray(tc.tags) ? tc.tags : (tc.tags ? [tc.tags] : []),
          test_plan_id: tc.test_plan_id,
          user_story_id: tc.user_story_id,
          void_ind: tc.void_ind || 0,
          created_at: tc.created_at,
          updated_at: new Date().toISOString()
        }))
      })
    });
  }

  // ==========================================
  // LEGACY/COMPATIBILITY METHODS
  // ==========================================

  /**
   * Legacy method - maps to getTestPlans()
   * @param {string} userEmail - User's email address
   * @returns {Promise} Test cases
   */
  async getTestCases(userEmail) {
    return this.getTestPlans();
  }

  /**
   * Legacy method - maps to getUserStories() 
   * @param {string} userEmail - User's email address
   * @returns {Promise} RCA reports
   */
  async getRCAReport(userEmail) {
    // This would map to a proper RCA endpoint when available
    // For now, return empty array as placeholder
    return [];
  }

  /**
   * Legacy method - placeholder for RCA report updates
   * @param {Object} reportData - RCA report data to update
   * @returns {Promise} Update response
   */
  async updateRCAReport(reportData) {
    // This would map to a proper RCA endpoint when available
    // For now, return success response as placeholder
    return { success: true, message: 'RCA report updated (placeholder)' };
  }

  // ==========================================
  // UTILITY METHODS
  // ==========================================

  /**
   * GET /health - Health Check
   * @returns {Promise<boolean>} Service health status
   */
  async checkHealth() {
    try {
      await this.request('/health', { method: 'GET' });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Test basic connectivity to the server
   * @returns {Promise<Object>} Connectivity status with details
   */
  async testConnectivity() {
    const startTime = Date.now();
    try {
      const response = await fetch(`${this.baseURL}/health`, {
        method: 'GET',
        headers: this.defaultHeaders,
        timeout: 5000 // 5 second timeout
      });
      
      const responseTime = Date.now() - startTime;
      
      return {
        success: true,
        status: response.status,
        statusText: response.statusText,
        responseTime: `${responseTime}ms`,
        baseURL: this.baseURL,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      return {
        success: false,
        error: error.message,
        responseTime: `${responseTime}ms`,
        baseURL: this.baseURL,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * GET /agent/rca_report - Generate RCA Report
   * @param {string} jiraKey - Jira ticket key (e.g., RCA-179)
   * @returns {Promise} RCA report data
   */
  async generateRCAReport(jiraKey) {
    const url = `/agent/rca_report?jira_key=${encodeURIComponent(jiraKey)}`;
    
    // Use relative URL to go through Vite proxy in development
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        let errorMessage;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.detail || errorData.error || `HTTP ${response.status}: ${response.statusText}`;
        } catch {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Request failed for ${url}:`, error);
      throw error;
    }
  }

  /**
   * Update base URL (useful for switching environments)
   * @param {string} newBaseURL - New base URL
   */
  updateBaseURL(newBaseURL) {
    this.baseURL = newBaseURL;
  }
}

// Create and export a default instance
import { POC_CONFIG } from '../config/pocConfig.js';
export const apiService = new ApiService(POC_CONFIG.EXTERNAL_SERVICE_URL);

// Export the class for custom instances
export default ApiService;
