import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import UploadMedia from "./UploadMedia";

export default function Admin() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      navigate("/");
    }
  }, [navigate]);

  // Handler to show success icon overlay for 1s
  const handleUpload = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 1000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#1e1e1e] via-[#252526] to-[#2d2d2d] bg-fixed font-sans">
      {/* Top Navbar */}
      <nav className="flex items-center justify-between bg-[#1e1e1e] text-gray-100 px-6 py-4 shadow-lg border-b border-[#252526]">
        <div className="flex items-center gap-4">
          <img
            src="/Logo.png"
            alt="Company Logo"
            className="w-10 h-10 rounded shadow border border-[#252526] bg-white object-contain"
          />
          <span className="font-semibold text-2xl tracking-wide font-mono text-blue-300 whitespace-nowrap">
            IT Analyst Dashboard
          </span>
        </div>
      </nav>

      {/* Status Bar */}
      <div className="w-full bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 text-blue-100 py-2 px-8 flex items-center gap-3 shadow border-b border-blue-800 animate-fade-in-down">
        <span className="font-mono text-base font-semibold">Welcome, Admin!</span>
        <span className="ml-auto text-xs text-blue-200 italic">All systems operational</span>
      </div>

      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
        <main className="flex-1 flex flex-col items-center justify-start p-8 bg-gradient-to-br from-[#23272e] via-[#23272e]/80 to-[#1e1e1e]/90">
          <div className="rounded-xl shadow-2xl w-full max-w-2xl mx-auto mt-12 animate-fade-in border border-[#252526] bg-[#23272e]/80 hover:shadow-blue-900/40 transition-shadow duration-300 relative">
            <h2 className="text-4xl font-extrabold text-blue-300 mb-10 text-center font-mono whitespace-nowrap tracking-wide leading-tight flex items-center justify-center gap-2">
              Upload Backlog Grooming Meeting Recording
              <span className="group relative cursor-pointer ml-2">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-blue-400"><circle cx="12" cy="12" r="10" strokeWidth="2"/><text x="12" y="16" textAnchor="middle" fontSize="12" fill="#60a5fa">i</text></svg>
                <span className="absolute left-1/2 -translate-x-1/2 top-8 z-10 w-56 bg-[#23272e] text-xs text-blue-100 rounded shadow-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none font-mono border border-blue-700">
                  Upload a recording of your backlog grooming meeting. Only audio/video files up to 200MB are accepted. Supported: MP3, MP4, WAV, M4V, MPEG4.
                </span>
              </span>
            </h2>
            <div className="w-full">
              <UploadMedia onUpload={handleUpload} onSuccess={() => setShowSuccess(true)} />
              <span className="text-xs text-gray-400 mt-2 block text-left font-mono">
                Limit 200MB per file. MP3, MP4, WAV, M4V, MPEG4
              </span>
              {/* Progress Bar Placeholder */}
              <div className="w-full h-2 bg-[#23272e] rounded mt-4 overflow-hidden">
                <div className="h-full bg-blue-500 animate-pulse rounded" style={{ width: '0%' }}></div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Success Icon Overlay */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="flex flex-col items-center justify-center bg-gradient-to-br from-[#23272e] via-[#23272e]/90 to-[#10141a] p-10 rounded-2xl shadow-2xl border border-green-500 animate-fade-in">
            {/* Animated pulsing ring */}
            <span className="relative flex items-center justify-center mb-6">
              <span className="absolute inline-flex h-[110px] w-[110px] rounded-full bg-green-400 opacity-30 animate-ping"></span>
              <svg width="90" height="90" viewBox="0 0 24 24" fill="none" className="relative z-10">
                <circle cx="12" cy="12" r="10" fill="#22c55e" opacity="0.15" />
                <circle cx="12" cy="12" r="10" fill="#22c55e" />
                <path d="M8 12.5l2.5 2.5L16 9.5" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <animate attributeName="stroke-dasharray" from="0,24" to="24,0" dur="0.5s" fill="freeze" />
                </path>
              </svg>
            </span>
            <span className="text-green-200 font-mono text-2xl font-bold tracking-wide text-center drop-shadow animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              Upload Successful
            </span>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-blue-700 text-white text-center py-3 mt-auto shadow">
        &copy; {new Date().getFullYear()} Admin Dashboard. All rights reserved.
      </footer>
    </div>
  );
}
