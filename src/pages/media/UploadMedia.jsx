import React, { useState, useRef } from 'react';
import { apiService } from '../../services/apiService';

// Notification function for visual feedback
const showNotification = (type, message) => {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm animate-slide-in-right ${
    type === 'success' 
      ? 'bg-green-600 text-white border border-green-500' 
      : 'bg-red-600 text-white border border-red-500'
  }`;
  
  notification.innerHTML = `
    <div class="flex items-center gap-3">
      <div class="flex-shrink-0">
        ${type === 'success' 
          ? '<svg class="w-6 h-6 animate-upload-success" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="currentColor" class="opacity-20"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M9 12l2 2 4-4" stroke="white" fill="none"/></svg>'
          : '<svg class="w-6 h-6 animate-upload-failure" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="currentColor" class="opacity-20"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M15 9l-6 6M9 9l6 6" stroke="white" fill="none"/></svg>'
        }
      </div>
      <div class="flex-1">
        <p class="font-semibold text-sm">${message}</p>
      </div>
      <button class="flex-shrink-0 ml-2 text-white hover:text-gray-200 transition-colors" onclick="this.parentElement.parentElement.remove()">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.style.animation = 'fadeOut 0.3s ease-out forwards';
      setTimeout(() => notification.remove(), 300);
    }
  }, 5000);
};

// Version 3.0 - External Service Integration
const UploadMedia = ({ 
  onUpload, 
  onSuccess, 
  onError,
  uploadType = 'standard', // 'standard' or 'agent'
  baseURL = 'http://localhost:5001', // Your service base URL (without endpoint)
  userEmail = 'user@example.com',
  additionalData = {}
}) => {
  const [files, setFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [processing, setProcessing] = useState({});
  const inputRef = useRef(null);

  const handleFileChange = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    const newFiles = selectedFiles.map(file => ({
      file,
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      status: 'pending'
    }));
    
    setFiles(prev => [...prev, ...newFiles]);
    
    // Upload each file
    for (const fileObj of newFiles) {
      await uploadFile(fileObj);
    }
    
    if (onUpload && selectedFiles.length > 0) onUpload(selectedFiles);
  };

  const uploadFile = async (fileObj) => {
    const fileId = fileObj.id;
    setProcessing(prev => ({ ...prev, [fileId]: true }));
    
    // Update base URL for API service
    apiService.updateBaseURL(baseURL);
    
    // Update file status
    setFiles(prev => prev.map(f => 
      f.id === fileId ? { ...f, status: 'uploading' } : f
    ));
    
    try {
      // Only validate file size on frontend - backend handles all type validation
      const maxSize = 200 * 1024 * 1024; // 200MB
      if (fileObj.file.size > maxSize) {
        throw new Error(`File too large. Maximum size: ${maxSize / (1024 * 1024)}MB`);
      }

      let result;
      
      // Choose upload endpoint based on type
      if (uploadType === 'agent') {
        console.log('🚀 Calling agentUploadFiles with:');
        console.log('  - fileObj:', fileObj);
        console.log('  - fileObj.file:', fileObj.file);
        console.log('  - userEmail:', userEmail);
        console.log('  - additionalData:', additionalData);
        
        result = await apiService.agentUploadFiles(
          fileObj.file, 
          userEmail, 
          additionalData
        );
      } else {
        result = await apiService.uploadFiles(fileObj.file, {
          user: userEmail,
          ...additionalData
        });
      }
      
      setProcessing(prev => ({ ...prev, [fileId]: false }));
      
      // Update file status to completed (no transcription needed)
      setFiles(prev => prev.map(f => 
        f.id === fileId ? { ...f, status: 'completed', result: result } : f
      ));
      
      // Show success notification
      showNotification('success', `✅ ${fileObj.name} uploaded successfully! Check your email for confirmation.`);
      
      // Add a small delay to show the completed state before calling success
      setTimeout(() => {
        if (onSuccess) onSuccess(result);
      }, 500);

    } catch (error) {
      // Upload error handling
      setProcessing(prev => ({ ...prev, [fileId]: false }));
      
      // Update file status to error
      let errorMessage = 'Upload failed. Please try again.';
      
      if (error.message.includes('Cannot connect to server')) {
        errorMessage = `Cannot connect to server at ${baseURL}. Please ensure the service is running.`;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setFiles(prev => prev.map(f => 
        f.id === fileId ? { ...f, status: 'error', error: errorMessage } : f
      ));
      
      // Show error notification
      showNotification('error', `❌ ${fileObj.name} upload failed: ${errorMessage}`);
      
      // Call onError callback if provided
      if (onError) {
        onError(errorMessage, fileObj.name);
      }
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      const newFiles = droppedFiles.map(file => ({
        file,
        id: Date.now() + Math.random(),
        name: file.name,
        size: file.size,
        status: 'pending'
      }));
      
      setFiles(prev => [...prev, ...newFiles]);
      
      // Upload each file
      for (const fileObj of newFiles) {
        await uploadFile(fileObj);
      }
      
      if (onUpload) onUpload(droppedFiles);
    }
  };

  const handleClick = () => {
    inputRef.current.click();
  };

  return (
    <div className="w-full">
      <div
        className={`flex flex-col items-center justify-center border-2 border-dashed rounded-[2rem] transition-all duration-300 cursor-pointer p-14 bg-gradient-to-br from-[#23272e] via-[#23272e]/90 to-[#10141a] shadow-[0_8px_32px_0_rgba(31,38,135,0.22)] hover:shadow-[0_16px_48px_0_rgba(30,64,175,0.22)] focus-within:shadow-[0_16px_48px_0_rgba(30,64,175,0.22)] hover:border-blue-500 focus-within:border-blue-500 active:scale-[0.98] ${dragActive ? 'border-blue-400 bg-gradient-to-br from-[#1e293b] via-[#23272e] to-[#10141a]' : 'border-[#3a3a3a]'}`}
        onClick={handleClick}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        style={{ minHeight: '220px', textAlign: 'center', gap: '1rem', transition: 'box-shadow 0.3s, border-color 0.3s, transform 0.15s' }}
        tabIndex={0}
      >
        <input
          ref={inputRef}
          type="file"
          accept="*/*"
          className="hidden"
          multiple
          onChange={handleFileChange}
        />
        <span className="text-2xl font-mono text-white select-none w-full text-center font-extrabold tracking-wide drop-shadow mb-3 transition-colors duration-200 group-hover:text-blue-200 group-focus:text-blue-200">
          Drag and Drop files here
        </span>
        <span className="text-sm text-blue-200 font-mono w-full text-center font-semibold transition-colors duration-200 mb-3 group-hover:text-blue-300 group-focus:text-blue-300">
          <span className="block">Media: <span className="text-blue-300">'.mp4', '.mp3', '.mkv', '.flac', '.webm', '.m4a'</span></span>
          <span className="block mt-1">Non-media: <span className="text-blue-300">'.pdf', '.docx', '.txt'</span></span>
        </span>
        {/* Divider */}
        {files.length > 0 && <div className="w-full border-t border-[#4b5563] my-7 transition-colors duration-200"></div>}
        
        {/* Multiple files display */}
        {files.length > 0 && (
          <div className="w-full space-y-3">
            {files.map((fileObj) => (
              <div key={fileObj.id} className="w-full">
                <div className="flex items-center justify-between bg-gradient-to-r from-[#23272e] via-[#23272e]/90 to-[#1e1e1e]/90 text-blue-100 font-mono text-sm py-3 px-4 rounded-xl border border-blue-500/50 shadow-[0_2px_12px_0_rgba(30,64,175,0.10)] transition-all duration-200">
                  <div className="flex items-center gap-3">
                    <svg className="text-blue-400 flex-shrink-0" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <rect x="3" y="7" width="18" height="13" rx="2" fill="#2d8cff"/>
                      <rect x="7" y="3" width="10" height="4" rx="1" fill="#60a5fa"/>
                    </svg>
                    <span className="font-bold tracking-tight truncate">{fileObj.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {fileObj.status === 'pending' && (
                      <span className="text-yellow-400 text-xs font-semibold">Pending</span>
                    )}
                    {fileObj.status === 'uploading' && processing[fileObj.id] && (
                      <div className="flex items-center gap-2">
                        <svg className="animate-spin text-blue-300" width="16" height="16" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="#60a5fa" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="#60a5fa" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                        </svg>
                        <span className="text-blue-300 text-xs font-semibold">Uploading to {uploadType === 'agent' ? 'Agent' : 'Server'}</span>
                      </div>
                    )}
                    {fileObj.status === 'completed' && (
                      <div className="flex items-center gap-2 animate-bounce-in">
                        <div className="relative">
                          <svg className="text-green-400 animate-pulse-3d" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10" fill="currentColor" className="opacity-20"/>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 12l2 2 4-4" stroke="white" fill="none"/>
                          </svg>
                          <div className="absolute inset-0 rounded-full bg-green-400/20 animate-ping"></div>
                        </div>
                        <span className="text-green-400 text-sm font-bold animate-fade-in">✓ SUCCESS</span>
                      </div>
                    )}
                    {fileObj.status === 'error' && (
                      <div className="flex items-center gap-2 animate-shake">
                        <div className="relative">
                          <svg className="text-red-400 animate-pulse" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10" fill="currentColor" className="opacity-20"/>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 9l-6 6M9 9l6 6" stroke="white" fill="none"/>
                          </svg>
                          <div className="absolute inset-0 rounded-full bg-red-400/20 animate-ping"></div>
                        </div>
                        <span className="text-red-400 text-sm font-bold animate-fade-in">✗ FAILED</span>
                      </div>
                    )}
                  </div>
                </div>
                {fileObj.status === 'error' && fileObj.error && (
                  <div className="mt-1 text-red-300 text-xs px-4 py-2 bg-red-900/20 rounded border border-red-500/30">
                    {fileObj.error}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadMedia;
