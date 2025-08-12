import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './LoginPage';
import User from './User';
import WelcomeDashboard from './WelcomeDashboard';
import UploadRecording from './UploadRecording';
import BAApproval from './BAApproval';
import Admin from './Admin';
import GenerateUserStories from './GenerateUserStories';
import GenerateTestCases from './GenerateTestCases';
import GenerateRCAReport from './GenerateRCAReport';
import ApiTestComponent from './components/ApiTestComponent';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
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
