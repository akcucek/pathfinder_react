import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/user/LoginPage';
import MCPPrompt from './pages/mcp-prompt/MCPPrompt';
import MCPDataSource from './pages/mcp-data-source/MCPDataSource';
import User from './pages/user/User';
import WelcomeDashboard from './pages/user/WelcomeDashboard';
import UploadRecording from './pages/media/UploadRecording';
import BAApproval from './pages/admin/BAApproval';
import Admin from './pages/admin/Admin';
import GenerateUserStories from './pages/stories/GenerateUserStories';
import GenerateTestCases from './pages/testcases/GenerateTestCases';
import GenerateRCAReport from './pages/rca/GenerateRCAReport';
import ApiTestComponent from './components/ApiTestComponent';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route 
            path="/mcp-data-source" 
            element={
              <ProtectedRoute>
                <MCPDataSource />
              </ProtectedRoute>
            } 
          />
          <Route path="/" element={<LoginPage />} />
          <Route 
            path="/mcp-prompt" 
            element={
              <ProtectedRoute>
                <MCPPrompt />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/welcome" 
            element={
              <ProtectedRoute>
                <WelcomeDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/upload-media" 
            element={
              <ProtectedRoute>
                <UploadRecording />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requiredRole="admin">
                <Admin />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/user" 
            element={
              <ProtectedRoute>
                <User />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/ba-approval" 
            element={
              <ProtectedRoute requiredPermission="ba_approval">
                <BAApproval />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/generate-user-stories" 
            element={
              <ProtectedRoute>
                <GenerateUserStories />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/generate-test-cases" 
            element={
              <ProtectedRoute>
                <GenerateTestCases />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/generate-rca-report" 
            element={
              <ProtectedRoute>
                <GenerateRCAReport />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/api-test" 
            element={
              <ProtectedRoute requiredRole="admin">
                <ApiTestComponent />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
