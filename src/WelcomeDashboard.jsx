import React, { useState, useEffect } from "react";
import { useAuth } from "./contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { 
  FaChartLine, FaServer, FaSearch, FaCloud, FaFileAlt, 
  FaRocket, FaSignOutAlt
} from 'react-icons/fa';

const WelcomeDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [showWhitePaper, setShowWhitePaper] = useState(false);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Quick actions based on user role
  const getQuickActions = () => {
    const baseActions = [
      { title: 'Upload Recordings', icon: FaCloud, path: '/upload-media', color: 'blue' },
      { title: 'User Stories', icon: FaFileAlt, path: '/generate-user-stories', color: 'green' }
    ];

    if (user?.role === 'admin') {
      return [
        ...baseActions,
        { title: 'Test Plan', icon: FaFileAlt, path: '/generate-test-cases', color: 'green' },
        { title: 'RCA Report', icon: FaChartLine, path: '/generate-rca-report', color: 'red' }
      ];
    }

    return baseActions;
  };

  const handleActionClick = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      // Search functionality - you can customize this based on your needs
      const searchRoutes = {
        'upload': '/upload-media',
        'media': '/upload-media',
        'stories': '/generate-user-stories',
        'user stories': '/generate-user-stories',
        'test': '/generate-test-cases',
        'test cases': '/generate-test-cases',
        'rca': '/generate-rca-report',
        'report': '/generate-rca-report',
        'admin': '/admin',
        'dashboard': '/dashboard'
      };
      
      const route = searchRoutes[searchTerm.toLowerCase()];
      if (route) {
        navigate(route);
      } else {
        // If no exact match, try partial matching
        for (const [key, value] of Object.entries(searchRoutes)) {
          if (key.includes(searchTerm.toLowerCase()) || searchTerm.toLowerCase().includes(key)) {
            navigate(value);
            return;
          }
        }
        alert(`No results found for "${searchTerm}"`);
      }
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen relative p-6 overflow-hidden">
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
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-blue-900/70 to-slate-800/85 backdrop-blur-[1px]"></div>
      </div>
      
      {/* Content Container */}
      <div className="relative z-10">
      {/* Header Section */}
      <header className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-xl p-6 shadow-2xl hover:bg-slate-900/70 transition-all duration-300">
          <div className="mb-4 lg:mb-0 flex items-center gap-4">
            {/* Sign-in Logo */}
            <div className="flex-shrink-0 transform hover:scale-110 transition-transform duration-300">
              <video
                src="/sigin-logo.mp4"
                autoPlay
                loop
                muted
                className="w-16 h-16 rounded-lg object-cover border-2 border-blue-500/30 shadow-lg hover:border-blue-400/60 transition-colors duration-300"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 hover:text-blue-300 transition-colors duration-300 cursor-default">
                Welcome, Administrator
              </h1>
              <p className="text-slate-300 text-lg hover:text-slate-200 transition-colors duration-300">
                {formatDate(currentTime)} • {formatTime(currentTime)}
              </p>
            </div>
          </div>
          
          {/* Search and Logout */}
          <div className="flex items-center gap-4">
            <div className="relative group">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 group-hover:text-blue-400 transition-colors duration-300" />
              <input
                type="text"
                placeholder="Search... (e.g., upload, stories, test cases)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleSearch}
                className="pl-10 pr-4 py-2 bg-slate-800/60 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[300px] hover:bg-slate-700/60 transition-all duration-300 shadow-lg"
              />
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/40 text-red-400 hover:text-red-300 border border-red-500/50 hover:border-red-400 rounded-lg transition-all duration-300 shadow-lg hover:shadow-red-500/20 transform hover:scale-105"
            >
              <FaSignOutAlt className="text-sm" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section with Dashboard Image */}
      <div className="mb-6 relative overflow-hidden rounded-2xl bg-slate-900/60 backdrop-blur-md border border-slate-600/50 shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 group">
        <div className="absolute inset-0">
          {/* Fallback gradient background */}
          <div className="w-full h-full bg-gradient-to-br from-blue-900/40 via-purple-900/30 to-slate-900/50" />
          {/* Dashboard image (when available) */}
          <img 
            src="/dash.webp" 
            alt="Dashboard Analytics" 
            className="w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-500"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 to-purple-900/50" />
        </div>
        <div className="relative p-6 lg:p-8">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Left side - Text content */}
            <div className="max-w-2xl">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 hover:text-blue-300 transition-colors duration-300 cursor-default">
                AI Powered SDLC
              </h2>
              <p className="text-slate-200 text-lg mb-6 whitespace-nowrap hover:text-slate-100 transition-colors duration-300">
                Turn your meeting recordings into actionable insights with AI-powered Agents — accelerating your agile workflow.
              </p>
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => setShowWhitePaper(true)}
                  className="px-6 py-3 bg-slate-800/60 hover:bg-slate-700/70 text-white font-semibold rounded-lg border border-slate-600 transition-all duration-300 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/20 transform hover:scale-105 active:scale-95"
                >
                  View Documentation
                </button>
              </div>
            </div>
            
            {/* Right side - Welcome image */}
            <div className="flex justify-center lg:justify-end">
              <img 
                src="/AI-logo.gif" 
                alt="Welcome to Business Analyst Platform" 
                className="w-full max-w-[130px] lg:max-w-[180px] rounded-xl shadow-2xl border-2 border-white/20 hover:scale-110 hover:border-blue-400/50 transition-all duration-500 cursor-pointer"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="w-full">
        {/* Quick Actions */}
        <div className="w-full">
          <div className="bg-slate-900/70 backdrop-blur-md border border-slate-600/50 rounded-xl p-6 shadow-2xl hover:bg-slate-900/80 transition-all duration-300">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2 hover:text-blue-300 transition-colors duration-300">
              <FaRocket className="text-blue-400 animate-pulse" />
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {getQuickActions().map((action, index) => (
                <button
                  key={index}
                  onClick={() => handleActionClick(action.path)}
                  className="w-full flex flex-col items-center gap-4 p-6 bg-slate-800/60 hover:bg-slate-700/70 rounded-lg border border-slate-600/50 hover:border-slate-500/80 transition-all duration-300 text-center group transform hover:scale-105 hover:shadow-lg active:scale-95"
                >
                  <div className={`p-3 rounded-lg bg-${action.color}-500/20 group-hover:bg-${action.color}-500/30 transition-all duration-300 group-hover:scale-110`}>
                    <action.icon className={`text-2xl text-${action.color}-400 group-hover:text-${action.color}-300 transition-colors duration-300`} />
                  </div>
                  <span className="text-white font-medium group-hover:text-slate-200 transition-colors duration-300">{action.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* White Paper Modal */}
      {showWhitePaper && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-slate-900/95 backdrop-blur-md border border-slate-600/70 rounded-2xl max-w-6xl max-h-[90vh] w-full overflow-hidden shadow-2xl transform animate-scale-in">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-900/60 to-purple-900/60 p-6 border-b border-slate-600/70 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white hover:text-blue-300 transition-colors duration-300">PathFinder-AI-AGENT Technical White Paper</h2>
                <button 
                  onClick={() => setShowWhitePaper(false)}
                  className="text-slate-400 hover:text-white transition-all duration-300 p-2 hover:bg-slate-700/60 rounded-lg transform hover:scale-110 active:scale-95"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)] text-slate-200 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
              <div className="prose prose-invert max-w-none">
                
                {/* Executive Summary */}
                <section className="mb-8">
                  <h3 className="text-xl font-semibold text-blue-400 mb-4">📋 Executive Summary</h3>
                  <p className="text-slate-300 leading-relaxed mb-4">
                    PathFinder-AI-AGENT is an enterprise-grade Business Analyst Platform that leverages artificial intelligence 
                    to transform meeting recordings and media files into actionable business insights. The platform provides 
                    role-based access control, secure file processing, and intelligent report generation capabilities designed 
                    for modern business environments.
                  </p>
                  <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-600">
                    <p className="text-blue-300 font-medium">🌐 Current Deployment: http://localhost:5175/welcome</p>
                    <p className="text-green-300 font-medium mt-2">📁 Project Structure: React + Vite Frontend with External Python API</p>
                    <p className="text-purple-300 font-medium mt-2">🔧 Development: Horizontal Sidebar, Full-width Containers, Professional Dark Theme</p>
                  </div>
                </section>

                {/* Technology Stack */}
                <section className="mb-8">
                  <h3 className="text-xl font-semibold text-green-400 mb-4">🚀 Technology Stack</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-slate-800/30 p-4 rounded-lg border border-slate-600">
                      <h4 className="font-semibold text-blue-300 mb-2">Frontend</h4>
                      <ul className="text-sm text-slate-400 space-y-1">
                        <li>• React 18.3.1 (Latest Stable)</li>
                        <li>• Vite 7.0.6 (Ultra-fast dev server)</li>
                        <li>• TailwindCSS 3.4.17</li>
                        <li>• React Router v7.7.0</li>
                        <li>• React Icons 5.5.0</li>
                        <li>• Horizontal Navigation Design</li>
                        <li>• Professional Dark Theme</li>
                        <li>• Responsive Full-width Containers</li>
                      </ul>
                    </div>
                    <div className="bg-slate-800/30 p-4 rounded-lg border border-slate-600">
                      <h4 className="font-semibold text-purple-300 mb-2">External Services</h4>
                      <ul className="text-sm text-slate-400 space-y-1">
                        <li>• Python API Service (External)</li>
                        <li>• File Upload Processing</li>
                        <li>• Multi-format Support (200MB)</li>
                        <li>• CORS-enabled APIs</li>
                        <li>• Agent Tools Integration</li>
                        <li>• Real-time Processing</li>
                      </ul>
                    </div>
                  </div>
                </section>

                {/* Architecture Overview */}
                <section className="mb-8">
                  <h3 className="text-xl font-semibold text-yellow-400 mb-4">🏗️ System Architecture</h3>
                  <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-600">
                    <div className="text-sm text-slate-300">
                      <p className="mb-2"><strong>Frontend:</strong> React + Vite (Port 5175)</p>
                      <p className="mb-2"><strong>Authentication:</strong> POC Mode (Bypassed for demo)</p>
                      <p className="mb-2"><strong>External API:</strong> Custom Python Service</p>
                      <p className="mb-2"><strong>Storage:</strong> External service managed</p>
                      <p className="mb-2"><strong>State Management:</strong> React Context + localStorage</p>
                      <p className="mb-2"><strong>UI Design:</strong> Horizontal Sidebar, Dark Theme, Glass Morphism</p>
                      <p><strong>Layout:</strong> Full-width Containers, Responsive Grid System</p>
                    </div>
                  </div>
                </section>

                {/* Key Features */}
                <section className="mb-8">
                  <h3 className="text-xl font-semibold text-cyan-400 mb-4">✨ Key Features</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="bg-blue-900/20 p-3 rounded-lg border border-blue-500/30">
                        <h4 className="font-semibold text-blue-300">🔐 Authentication System</h4>
                        <p className="text-sm text-slate-400">Role-based access with 4 user types: Admin, Manager, Analyst, User</p>
                      </div>
                      <div className="bg-green-900/20 p-3 rounded-lg border border-green-500/30">
                        <h4 className="font-semibold text-green-300">📁 File Processing</h4>
                        <p className="text-sm text-slate-400">Multi-format support: Videos, Audio, Documents (200MB limit)</p>
                      </div>
                      <div className="bg-purple-900/20 p-3 rounded-lg border border-purple-500/30">
                        <h4 className="font-semibold text-purple-300">🎨 Advanced UI/UX</h4>
                        <p className="text-sm text-slate-400">Horizontal sidebar, glass morphism, dark theme, full-width containers</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-yellow-900/20 p-3 rounded-lg border border-yellow-500/30">
                        <h4 className="font-semibold text-yellow-300">🔍 Smart Search</h4>
                        <p className="text-sm text-slate-400">Intelligent keyword navigation with route matching</p>
                      </div>
                      <div className="bg-red-900/20 p-3 rounded-lg border border-red-500/30">
                        <h4 className="font-semibold text-red-300">📊 Analytics Ready</h4>
                        <p className="text-sm text-slate-400">System monitoring, user tracking, performance metrics</p>
                      </div>
                      <div className="bg-indigo-900/20 p-3 rounded-lg border border-indigo-500/30">
                        <h4 className="font-semibold text-indigo-300">🚀 Performance</h4>
                        <p className="text-sm text-slate-400">Async operations, HMR, optimized builds, responsive design</p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* User Roles & Permissions */}
                {/* <section className="mb-8">
                  <h3 className="text-xl font-semibold text-orange-400 mb-4">👥 Role-Based Access Control</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-600">
                          <th className="text-left p-3 text-slate-300">Role</th>
                          <th className="text-center p-3 text-slate-300">Read</th>
                          <th className="text-center p-3 text-slate-300">Write</th>
                          <th className="text-center p-3 text-slate-300">Delete</th>
                          <th className="text-center p-3 text-slate-300">Reports</th>
                          <th className="text-center p-3 text-slate-300">Admin</th>
                        </tr>
                      </thead>
                      <tbody className="text-slate-400">
                        <tr className="border-b border-slate-700">
                          <td className="p-3 font-medium text-red-300">Admin</td>
                          <td className="text-center p-3">✅</td>
                          <td className="text-center p-3">✅</td>
                          <td className="text-center p-3">✅</td>
                          <td className="text-center p-3">✅</td>
                          <td className="text-center p-3">✅</td>
                        </tr>
                        <tr className="border-b border-slate-700">
                          <td className="p-3 font-medium text-blue-300">Manager</td>
                          <td className="text-center p-3">✅</td>
                          <td className="text-center p-3">✅</td>
                          <td className="text-center p-3">❌</td>
                          <td className="text-center p-3">✅</td>
                          <td className="text-center p-3">❌</td>
                        </tr>
                        <tr className="border-b border-slate-700">
                          <td className="p-3 font-medium text-green-300">Analyst</td>
                          <td className="text-center p-3">✅</td>
                          <td className="text-center p-3">✅</td>
                          <td className="text-center p-3">❌</td>
                          <td className="text-center p-3">✅</td>
                          <td className="text-center p-3">❌</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-medium text-yellow-300">User</td>
                          <td className="text-center p-3">✅</td>
                          <td className="text-center p-3">✅</td>
                          <td className="text-center p-3">❌</td>
                          <td className="text-center p-3">✅</td>
                          <td className="text-center p-3">❌</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </section> */}

                {/* API Overview */}
                <section className="mb-8">
                  <h3 className="text-xl font-semibold text-pink-400 mb-4">🔗 API Endpoints</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-slate-800/30 p-4 rounded-lg border border-slate-600">
                      <div className="text-green-400 font-semibold mb-2">Upload API</div>
                      <p className="text-slate-400 text-sm">POST /upload/ - File upload with metadata</p>
                    </div>
                    <div className="bg-slate-800/30 p-4 rounded-lg border border-slate-600">
                      <div className="text-blue-400 font-semibold mb-2">Files API</div>
                      <p className="text-slate-400 text-sm">GET /files/ - List and manage files</p>
                    </div>
                  </div>
                </section>

                {/* Development Setup */}
                <section className="mb-8">
                  <h3 className="text-xl font-semibold text-teal-400 mb-4">⚙️ Quick Start</h3>
                  <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-600">
                    <div className="text-sm text-slate-300 space-y-2">
                      <p><code className="bg-slate-900/50 px-2 py-1 rounded">npm run dev</code> - Start frontend (Port 5175)</p>
                      <p><code className="bg-slate-900/50 px-2 py-1 rounded">Configure external API URL</code> - Update apiService baseURL</p>
                      <p><code className="bg-slate-900/50 px-2 py-1 rounded">POC Mode</code> - Authentication bypassed for demo</p>
                      <p><code className="bg-slate-900/50 px-2 py-1 rounded">Assets</code> - circle.png, background.jpg, AI-logo.gif</p>
                    </div>
                  </div>
                </section>

                {/* Project Stats */}
                <section className="mb-8">
                  <h3 className="text-xl font-semibold text-indigo-400 mb-4">📊 Project Statistics</h3>
                  <div className="grid md:grid-cols-4 gap-4">
                    <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-500/30 text-center">
                      <div className="text-2xl font-bold text-blue-300">15+</div>
                      <div className="text-sm text-slate-400">Components</div>
                    </div>
                    <div className="bg-green-900/20 p-4 rounded-lg border border-green-500/30 text-center">
                      <div className="text-2xl font-bold text-green-300">3000+</div>
                      <div className="text-sm text-slate-400">Lines of Code</div>
                    </div>
                    <div className="bg-purple-900/20 p-4 rounded-lg border border-purple-500/30 text-center">
                      <div className="text-2xl font-bold text-purple-300">4</div>
                      <div className="text-sm text-slate-400">User Roles</div>
                    </div>
                    <div className="bg-yellow-900/20 p-4 rounded-lg border border-yellow-500/30 text-center">
                      <div className="text-2xl font-bold text-yellow-300">200MB</div>
                      <div className="text-sm text-slate-400">Max File Size</div>
                    </div>
                  </div>
                </section>

                {/* Footer */}
                <section className="text-center pt-6 border-t border-slate-600">
                  <p className="text-slate-400">
                    <strong>PathFinder-AI-AGENT</strong> - Enterprise Business Analyst Platform
                  </p>
                  <p className="text-slate-500 text-sm mt-2">
                    Document Version 1.0 | Last Updated: January 2025 | Status: Production Ready
                  </p>
                </section>

              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-12 text-center text-slate-400">
        <p>&copy; 2025 Business Analyst Platform. All rights reserved.</p>
      </footer>
      </div>
    </div>
  );
};

export default WelcomeDashboard;
