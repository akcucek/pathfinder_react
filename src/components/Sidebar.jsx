import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  FaHome, 
  FaCloudUploadAlt, 
  FaFileAlt, 
  FaTasks, 
  FaBug, 
  FaSignOutAlt,
  FaRocket,
  FaServer,
  FaBars
} from 'react-icons/fa';
// Removed unused FaDatabase, FaServer, FaCircle, FaWifi, FaEye
import { useAuth } from '../contexts/AuthContext';

const sidebarSections = [
  {
    title: 'Dashboard',
    items: [
      { 
        label: 'Overview', 
        icon: FaHome, 
        path: '/welcome',
        description: 'System overview and metrics',
        badge: null
      }
    ]
  },
  {
    title: 'Operations',
    items: [
      { 
        label: 'Media Upload', 
        icon: FaCloudUploadAlt, 
        path: '/upload-media',
        description: 'Upload and process media files',
        badge: null
      }
    ]
  },
  {
    title: 'Analysis & Reports',
    items: [
      { 
        label: 'User Stories', 
        icon: FaFileAlt, 
        path: '/generate-user-stories',
        description: 'Generate and manage user stories',
        badge: null
      },
      { 
        label: 'Test Plan', 
        icon: FaTasks, 
        path: '/generate-test-cases',
        description: 'Create and manage test plans',
        badge: null
      },
      { 
        label: 'RCA Reports', 
        icon: FaBug, 
        path: '/generate-rca-report',
        description: 'Root cause analysis reports',
        badge: null
      },
      {
  label: 'Prompt Gallery',
        icon: FaRocket,
        path: '/mcp-prompt',
  description: 'Prompt Gallery interface',
        badge: null
      },
      {
        label: 'Data Source',
        icon: FaServer,
        path: '/mcp-data-source',
        description: 'Manage server data sources',
        badge: null
      }
    ]
  },
  {
    title: 'Account',
    items: [
      { 
        label: 'Logout', 
        icon: FaSignOutAlt, 
        path: '/logout',
        description: 'End session securely',
        badge: null,
        isLogout: true
      }
    ]
  }
];

export default function Sidebar({ activeMenu, setActiveMenu }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    setActiveMenu('Logout');
    logout();
    navigate('/', { replace: true });
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="w-full bg-gray-900/95 backdrop-blur-xl border-b border-gray-800/50 fixed top-0 left-0 z-50 shadow-xl shadow-black/20">
      <div className="max-w-screen-2xl mx-auto">
        <nav className="flex items-center justify-between h-20 px-12">
          {/* Left: Hamburger Icon */}
          <div className="flex-shrink-0 flex items-center">
            <button className="p-2 rounded-lg hover:bg-gray-800/60 transition-colors">
              <FaBars className="text-2xl text-gray-300" />
            </button>
          </div>
          
          {/* Center: Navigation */}
          <div className="flex-1 flex justify-center">
            <div className="flex items-center bg-gray-800/60 rounded-2xl p-2 shadow-inner border border-gray-700/50 backdrop-blur-sm">
              {sidebarSections.flatMap((section) =>
                section.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  return (
                    <button
                      key={item.label}
                      className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 ease-out min-w-[100px] group ${
                        active
                          ? 'bg-gray-700 text-blue-400 shadow-lg shadow-blue-500/20 scale-105 border border-blue-500/30'
                          : item.isLogout
                          ? 'text-red-400 hover:text-red-300 hover:bg-red-900/30'
                          : 'text-gray-300 hover:text-white hover:bg-gray-700/60'
                      }`}
                      onClick={() => {
                        if (item.isLogout) {
                          handleLogout();
                        } else {
                          setActiveMenu(item.label);
                          navigate(item.path);
                        }
                      }}
                      title={item.description}
                    >
                      {/* Active indicator */}
                      {active && (
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl"></div>
                      )}
                      <div className={`relative z-10 ${active ? 'text-blue-400' : item.isLogout ? 'text-red-400 group-hover:text-red-300' : 'text-gray-400 group-hover:text-gray-200'}`}>
                        <Icon className={`text-lg ${active ? 'drop-shadow-sm filter drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]' : ''}`} />
                        {item.badge && (
                          <span className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg animate-bounce">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <span className={`relative z-10 text-sm font-medium transition-colors ${
                        active ? 'text-blue-300' : item.isLogout ? 'text-red-400 group-hover:text-red-300' : 'text-gray-300 group-hover:text-white'
                      }`}>
                        {item.label}
                      </span>
                      {/* Hover effect */}
                      {!active && (
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-600/0 via-gray-600/30 to-gray-600/0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>
          
          {/* Right: User Actions */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="hidden md:flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-sm shadow-emerald-400/50"></div>
              <span className="text-sm text-gray-300 font-medium">Travel Domain Admin</span>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
