import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BATableApproval from './BATableApproval';
import Sidebar from './components/Sidebar';

const BAApproval = () => {
  const [approved, setApproved] = useState(false);
  const [activeMenu, setActiveMenu] = useState('BA Approval');
  const navigate = useNavigate();

  const handleApprove = () => {
    setApproved(true);
    // Add logic to send approval to backend if needed
  };

  return (
    <div className="min-h-screen flex">
      <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
      <div className="flex flex-col flex-1 bg-gradient-to-br from-[#23272e] via-[#181818] to-[#252526] font-sans">
        {/* Top Navbar */}
        <nav className="flex items-center justify-between bg-[#23272e] text-gray-100 px-6 py-4 shadow-lg border-b border-[#252526]">
          <h2 className="text-2xl font-bold text-blue-400 tracking-wide font-mono">BA Analyst Approval</h2>
        </nav>
        <div className="flex items-center justify-center flex-1">
          <div className="p-10 max-w-2xl w-full bg-[#23272e] rounded-xl shadow-2xl border border-[#252526]">
            <BATableApproval />
            <div className="mt-10">
              <button
                className={`w-full bg-gradient-to-r from-blue-500 to-green-700 text-white px-6 py-3 rounded-xl font-bold text-lg shadow-lg hover:from-blue-600 hover:to-green-800 transition ${approved ? 'opacity-60 cursor-not-allowed' : ''}`}
                onClick={handleApprove}
                disabled={approved}
              >
                {approved ? 'Approved' : 'Approve'}
              </button>
              {approved && (
                <div className="mt-6 text-green-400 font-bold text-center text-xl drop-shadow">Approval submitted!</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BAApproval;
