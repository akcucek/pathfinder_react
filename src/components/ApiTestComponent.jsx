/**
 * API Test Component
 * =================
 * 
 * This component demonstrates how to use the API service
 * with your Python web service endpoints
 */

import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';

const ApiTestComponent = () => {
  const [status, setStatus] = useState({
    connectivity: null,
    health: null,
    tools: null,
    userStories: null,
    testPlans: null
  });
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadResult, setUploadResult] = useState(null);

  // Test basic connectivity
  const testConnectivity = async () => {
    setLoading(true);
    try {
      const result = await apiService.testConnectivity();
      setStatus(prev => ({ ...prev, connectivity: result }));
    } catch (error) {
      setStatus(prev => ({ ...prev, connectivity: { 
        success: false, 
        error: error.message,
        baseURL: apiService.baseURL,
        timestamp: new Date().toISOString()
      }}));
    }
    setLoading(false);
  };

  // Test health endpoint
  const testHealth = async () => {
    setLoading(true);
    try {
      const isHealthy = await apiService.checkHealth();
      setStatus(prev => ({ ...prev, health: isHealthy ? 'OK' : 'Failed' }));
    } catch (error) {
      setStatus(prev => ({ ...prev, health: `Error: ${error.message}` }));
    }
    setLoading(false);
  };

  // Test agent tools endpoint
  const testAgentTools = async () => {
    setLoading(true);
    try {
      const tools = await apiService.getAgentTools();
      setStatus(prev => ({ ...prev, tools: `Success: ${JSON.stringify(tools, null, 2)}` }));
    } catch (error) {
      setStatus(prev => ({ ...prev, tools: `Error: ${error.message}` }));
    }
    setLoading(false);
  };

  // Test user stories endpoint
  const testUserStories = async () => {
    setLoading(true);
    try {
      const stories = await apiService.getUserStories('user@example.com');
      setStatus(prev => ({ ...prev, userStories: `Success: ${JSON.stringify(stories, null, 2)}` }));
    } catch (error) {
      setStatus(prev => ({ ...prev, userStories: `Error: ${error.message}` }));
    }
    setLoading(false);
  };

  // Test test plans endpoint
  const testTestPlans = async () => {
    setLoading(true);
    try {
      const plans = await apiService.getTestPlans();
      setStatus(prev => ({ ...prev, testPlans: `Success: ${JSON.stringify(plans, null, 2)}` }));
    } catch (error) {
      setStatus(prev => ({ ...prev, testPlans: `Error: ${error.message}` }));
    }
    setLoading(false);
  };

  // Test file upload
  const testFileUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file first');
      return;
    }

    setLoading(true);
    try {
      const result = await apiService.agentUploadFiles(selectedFile, {
        description: 'Test upload from React app',
        timestamp: new Date().toISOString()
      });
      setUploadResult(`Success: ${JSON.stringify(result, null, 2)}`);
    } catch (error) {
      setUploadResult(`Error: ${error.message}`);
    }
    setLoading(false);
  };

  // Run all tests on component mount
  useEffect(() => {
    const runAllTests = async () => {
      await testConnectivity();
      await new Promise(resolve => setTimeout(resolve, 500)); // Small delay between requests
      await testHealth();
      await new Promise(resolve => setTimeout(resolve, 500)); // Small delay between requests
      await testAgentTools();
      await new Promise(resolve => setTimeout(resolve, 500));
      await testUserStories();
      await new Promise(resolve => setTimeout(resolve, 500));
      await testTestPlans();
    };

    runAllTests();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">API Service Test Dashboard</h1>
      
      <div className="mb-6 p-4 bg-blue-50 rounded">
        <h2 className="text-lg font-semibold mb-2">Service Configuration</h2>
        <p><strong>Base URL:</strong> {apiService.baseURL}</p>
        <p className="text-sm text-gray-600 mt-2">
          To change the URL, update EXTERNAL_SERVICE_URL in src/services/serviceConfig.js
        </p>
      </div>

      {/* Quick Connectivity Test */}
      <div className="mb-6 p-4 border-2 border-blue-300 rounded-lg bg-blue-50">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-semibold text-blue-800">🔗 Connectivity Test</h2>
          <button 
            onClick={testConnectivity}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 font-medium"
          >
            Test Connection
          </button>
        </div>
        <p className="text-sm text-blue-700 mb-3">
          Quick test to check if the backend server is reachable
        </p>
        
        {status.connectivity && (
          <div className={`p-3 rounded ${status.connectivity.success ? 'bg-green-100 border border-green-300' : 'bg-red-100 border border-red-300'}`}>
            <div className="flex items-center mb-2">
              <span className={`text-lg mr-2 ${status.connectivity.success ? 'text-green-600' : 'text-red-600'}`}>
                {status.connectivity.success ? '✅' : '❌'}
              </span>
              <span className={`font-semibold ${status.connectivity.success ? 'text-green-800' : 'text-red-800'}`}>
                {status.connectivity.success ? 'Connected' : 'Connection Failed'}
              </span>
            </div>
            <div className="text-xs space-y-1">
              <p><strong>URL:</strong> {status.connectivity.baseURL}</p>
              <p><strong>Response Time:</strong> {status.connectivity.responseTime}</p>
              <p><strong>Timestamp:</strong> {new Date(status.connectivity.timestamp).toLocaleString()}</p>
              {status.connectivity.success ? (
                <p><strong>Status:</strong> {status.connectivity.status} {status.connectivity.statusText}</p>
              ) : (
                <p><strong>Error:</strong> {status.connectivity.error}</p>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Health Check */}
        <div className="border rounded p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">Health Check</h3>
            <button 
              onClick={testHealth}
              disabled={loading}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 disabled:opacity-50"
            >
              Test
            </button>
          </div>
          <p className="text-sm">GET /health</p>
          <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
            {status.health || 'Not tested'}
          </div>
        </div>

        {/* Agent Tools */}
        <div className="border rounded p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">Agent Tools</h3>
            <button 
              onClick={testAgentTools}
              disabled={loading}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 disabled:opacity-50"
            >
              Test
            </button>
          </div>
          <p className="text-sm">GET /agent/tools</p>
          <div className="mt-2 p-2 bg-gray-50 rounded text-xs max-h-20 overflow-y-auto">
            {status.tools || 'Not tested'}
          </div>
        </div>

        {/* User Stories */}
        <div className="border rounded p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">User Stories</h3>
            <button 
              onClick={testUserStories}
              disabled={loading}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 disabled:opacity-50"
            >
              Test
            </button>
          </div>
          <p className="text-sm">GET /user_stories?user=user@example.com</p>
          <div className="mt-2 p-2 bg-gray-50 rounded text-xs max-h-20 overflow-y-auto">
            {status.userStories || 'Not tested'}
          </div>
        </div>

        {/* Test Plans */}
        <div className="border rounded p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">Test Plans</h3>
            <button 
              onClick={testTestPlans}
              disabled={loading}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 disabled:opacity-50"
            >
              Test
            </button>
          </div>
          <p className="text-sm">GET /test_plans</p>
          <div className="mt-2 p-2 bg-gray-50 rounded text-xs max-h-20 overflow-y-auto">
            {status.testPlans || 'Not tested'}
          </div>
        </div>
      </div>

      {/* File Upload Test */}
      <div className="border rounded p-4">
        <h3 className="font-semibold mb-2">File Upload Test</h3>
        <p className="text-sm mb-3">POST /agent/upload_files</p>
        
        <div className="flex gap-2 mb-3">
          <input
            type="file"
            onChange={(e) => setSelectedFile(e.target.files[0])}
            className="text-sm"
          />
          <button 
            onClick={testFileUpload}
            disabled={loading || !selectedFile}
            className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 disabled:opacity-50"
          >
            Upload
          </button>
        </div>
        
        {uploadResult && (
          <div className="mt-2 p-2 bg-gray-50 rounded text-xs max-h-32 overflow-y-auto">
            {uploadResult}
          </div>
        )}
      </div>

      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded">
            <p>Testing API endpoint...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiTestComponent;
