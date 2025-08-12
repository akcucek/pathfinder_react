import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import { useAuth } from './contexts/AuthContext';

export default function User() {
  const [activeMenu, setActiveMenu] = useState('User');
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#23272e] via-[#181818] to-[#252526] bg-fixed">
      <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
      <main className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="bg-[#23272e] rounded-xl shadow-2xl p-8 w-full max-w-2xl animate-fade-in border border-[#252526]">
          <h2 className="text-3xl font-bold text-blue-300 mb-8 text-center font-mono">User Dashboard</h2>
          
          {user && (
            <div className="mb-6 p-4 bg-[#1e1e1e] rounded-lg border border-[#252526]">
              <h3 className="text-xl font-semibold text-gray-200 mb-2">Welcome, {user.name}!</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Role:</span>
                  <span className="text-blue-300 ml-2 capitalize">{user.role}</span>
                </div>
                <div>
                  <span className="text-gray-400">Department:</span>
                  <span className="text-green-300 ml-2">{user.department}</span>
                </div>
                <div>
                  <span className="text-gray-400">Email:</span>
                  <span className="text-gray-300 ml-2">{user.email}</span>
                </div>
                <div>
                  <span className="text-gray-400">Status:</span>
                  <span className="text-green-400 ml-2">Active</span>
                </div>
              </div>
            </div>
          )}
          
          <div className="text-center">
            <p className="text-gray-300 mb-4">You have access to the following features:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-[#1e1e1e] rounded-lg border border-[#252526]">
                <h4 className="text-lg font-semibold text-blue-300 mb-2">📝 Generate Reports</h4>
                <p className="text-gray-400 text-sm">Create user stories, test cases, and RCA reports</p>
              </div>
              <div className="p-4 bg-[#1e1e1e] rounded-lg border border-[#252526]">
                <h4 className="text-lg font-semibold text-green-300 mb-2">✅ BA Approval</h4>
                <p className="text-gray-400 text-sm">Review and approve business analysis requests</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
            <p className="text-blue-200 text-sm text-center">
              💡 <strong>Tip:</strong> Use the sidebar to navigate between different features and tools available to your role.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
