import React, { useState, useEffect } from 'react';
import UploadMedia from './UploadMedia';
import Sidebar from '../../components/Sidebar';
import { 
  FaCloudUploadAlt, 
  FaCheckCircle, 
  FaSpinner,
  FaBell,
  FaTimes as FaClose,
  FaFileAlt
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const UploadRecording = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [activeMenu, setActiveMenu] = useState('Media Upload');
  const [uploadStats, setUploadStats] = useState({
    totalUploads: 0,
    successfulUploads: 0,
    failedUploads: 0,
    totalSize: 0
  });
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notifications, setNotifications] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Auto-remove notifications after 5 seconds
  useEffect(() => {
    if (notifications.length > 0) {
      const timer = setTimeout(() => {
        setNotifications(prev => prev.slice(1));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notifications]);

  // Listen for storage events from other components
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'uploadSuccess' && e.newValue) {
        const data = JSON.parse(e.newValue);
        addNotification('success', `File uploaded successfully: ${data.fileName}`);
        setUploadStats(prev => ({
          ...prev,
          totalUploads: prev.totalUploads + 1,
          successfulUploads: prev.successfulUploads + 1,
          totalSize: prev.totalSize + (data.fileSize || 0)
        }));
        
        // Trigger test case generation
        if (data.fileName) {
          setTimeout(() => {
            localStorage.setItem('generateTestCases', JSON.stringify({
              fileName: data.fileName,
              timestamp: new Date().toISOString()
            }));
          }, 1000);
        }
        
        // Clear the storage item
        localStorage.removeItem('uploadSuccess');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const addNotification = (type, message, fileName = null) => {
    const notification = {
      id: Date.now(),
      type,
      message,
      fileName
    };
    setNotifications(prev => [...prev, notification]);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleUploadStart = () => {
    setIsUploading(true);
    addNotification('loading', 'Starting upload...', null);
  };

  const handleUploadComplete = (fileName) => {
    setIsUploading(false);
    addNotification('success', 'Upload completed successfully!', fileName);
    
    // Store success data for cross-component communication
    localStorage.setItem('uploadSuccess', JSON.stringify({
      fileName,
      timestamp: new Date().toISOString(),
      fileSize: 1024 * 1024 // Placeholder file size
    }));
  };

  const handleUploadError = (error) => {
    setIsUploading(false);
    addNotification('error', `Upload failed: ${error}`, null);
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

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500/3 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>
      
      <div className="relative z-20">
      <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
      
      <main className="pt-20 transition-all duration-300 ease-in-out">{/* Adjusted for horizontal navbar */}
        {/* Notifications */}
        {notifications.length > 0 && (
          <div className="fixed top-4 right-4 z-50 space-y-2">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`max-w-sm p-4 rounded-lg shadow-lg border backdrop-blur-sm animate-slide-in-right ${
                  notification.type === 'success' 
                    ? 'bg-green-900/90 border-green-500/50 text-green-100' 
                    : notification.type === 'error'
                    ? 'bg-red-900/90 border-red-500/50 text-red-100'
                    : notification.type === 'info'
                    ? 'bg-blue-900/90 border-blue-500/50 text-blue-100'
                    : 'bg-gray-900/90 border-gray-500/50 text-gray-100'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    {notification.type === 'success' && (
                      <FaCheckCircle className="text-green-400 text-lg mt-0.5 flex-shrink-0" />
                    )}
                    {notification.type === 'error' && (
                      <FaClose className="text-red-400 text-lg mt-0.5 flex-shrink-0" />
                    )}
                    {notification.type === 'info' && (
                      <FaBell className="text-blue-400 text-lg mt-0.5 flex-shrink-0" />
                    )}
                    {notification.type === 'loading' && (
                      <FaSpinner className="text-blue-400 text-lg mt-0.5 flex-shrink-0 animate-spin" />
                    )}
                    <div>
                      <p className="font-semibold text-sm">{notification.message}</p>
                      {notification.fileName && (
                        <p className="text-xs opacity-75 mt-1">{notification.fileName}</p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => removeNotification(notification.id)}
                    className="text-current opacity-50 hover:opacity-100 ml-2"
                  >
                    <FaClose className="text-sm" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Global Loading Overlay */}
        {isUploading && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center">
            <div className="bg-slate-900/95 border border-slate-600 rounded-2xl p-8 max-w-md mx-4 text-center">
              <div className="flex items-center justify-center mb-4">
                <FaSpinner className="text-blue-400 text-4xl animate-spin" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Processing Upload</h3>
              <p className="text-slate-300">
                Please wait while we upload and process your files...
              </p>
              <div className="mt-4 bg-slate-800 rounded-full h-2 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-full animate-pulse"></div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="p-8">
          {/* Top Header */}
          <header className="bg-slate-900/70 backdrop-blur-md border border-slate-600/50 rounded-xl p-6 mb-8 shadow-2xl hover:bg-slate-900/80 hover:shadow-blue-500/10 transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2 font-mono bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent group-hover:from-blue-300 group-hover:to-purple-300 transition-all duration-300">Upload Recordings and Documents</h1>
                <p className="text-slate-300 group-hover:text-slate-200 transition-colors duration-300">
                  {formatDate(currentTime)} • {formatTime(currentTime)}
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="bg-slate-700/50 rounded-lg px-4 py-2 hover:bg-slate-600/50 transition-all duration-200">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
                    <span className="text-sm text-slate-300">System Online</span>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Upload Section */}
          <div className="bg-slate-900/70 backdrop-blur-md border border-slate-600/50 rounded-xl p-8 shadow-2xl hover:bg-slate-900/80 hover:shadow-blue-500/10 transition-all duration-300 relative overflow-hidden group">
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-green-500/5 animate-pulse"></div>
            
            <div className="relative z-10">
              <div className="text-center mb-8">
                <div className="relative inline-block">
                  <FaCloudUploadAlt className="text-6xl text-blue-400 mx-auto mb-4 drop-shadow-2xl group-hover:text-blue-300 group-hover:scale-110 transition-all duration-300" />
                  <div className="absolute inset-0 text-6xl text-blue-300 mx-auto mb-4 blur-sm animate-pulse opacity-50"></div>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent group-hover:from-blue-300 group-hover:to-purple-300 transition-all duration-300">Upload Your Files</h2>
                <p className="text-slate-300 group-hover:text-slate-200 transition-colors duration-300">
                  Generate User Stories from Meeting Recordings, Requirement Documents, and More
                </p>
              </div>
              
              <UploadMedia 
                uploadType="agent"
                baseURL="http://localhost:5001"
                onUploadStart={handleUploadStart}
                onUploadComplete={handleUploadComplete}
                onUploadError={handleUploadError}
              />
              
              <div className="mt-6 p-4 bg-slate-800/50 rounded-lg border border-slate-600/50 hover:bg-slate-700/60 transition-all duration-300 group">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2 group-hover:text-green-300 transition-colors duration-300">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse group-hover:scale-125 transition-transform duration-300"></span>
                  Supported File Types
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm text-slate-300">
                  <div className="flex items-center gap-2 hover:text-green-300 transition-colors duration-200">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    MP3 Audio
                  </div>
                  <div className="flex items-center gap-2 hover:text-green-300 transition-colors duration-200">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse delay-100"></div>
                    MP4 Video
                  </div>
                  <div className="flex items-center gap-2 hover:text-green-300 transition-colors duration-200">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse delay-200"></div>
                    WAV Audio
                  </div>
                  <div className="flex items-center gap-2 hover:text-green-300 transition-colors duration-200">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse delay-300"></div>
                    M4V Video
                  </div>
                  <div className="flex items-center gap-2 hover:text-green-300 transition-colors duration-200">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse delay-400"></div>
                    MPEG4 Video
                  </div>
                  <div className="flex items-center gap-2 hover:text-blue-300 transition-colors duration-200">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-500"></div>
                    Max 200MB
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      </div>
    </div>
  );
};

export default UploadRecording;
