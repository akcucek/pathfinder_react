import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';

const MCPPrompt = () => {
  const [activeMenu, setActiveMenu] = useState('MCP Prompt');
  const [userStoryPrompt, setUserStoryPrompt] = useState('');
  const [testPlanPrompt, setTestPlanPrompt] = useState('');

  const handleUserStorySubmit = (e) => {
    e.preventDefault();
    // TODO: handle user story prompt submission
    alert('User Story Prompt submitted: ' + userStoryPrompt);
  };
  const handleTestPlanSubmit = (e) => {
    e.preventDefault();
    // TODO: handle test plan prompt submission
    alert('Test Plan Prompt submitted: ' + testPlanPrompt);
  };

  return (
    <>
      <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 relative overflow-hidden">
        <img
          src="/wallpaper.png"
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover opacity-40 pointer-events-none z-0"
          style={{filter: 'blur(2px)'}}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 opacity-70 z-0"></div>
  <main className="relative z-10 w-full max-w-7xl mx-auto flex flex-col md:flex-row gap-12 items-stretch justify-center animate-fade-in-up">
          {/* User Story Prompt Container */}
          <section className="flex-1 bg-slate-800/80 rounded-2xl shadow-2xl p-12 min-h-[400px] backdrop-blur-lg">
            <h2 className="text-2xl font-bold text-white mb-4 text-center">User Story Prompt (Travel)</h2>
            <form className="space-y-6" onSubmit={handleUserStorySubmit}>
              <textarea
                className="w-full h-56 p-4 bg-slate-900/60 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 backdrop-blur-sm text-base font-medium resize-none"
                placeholder="Type your User Story prompt for Travel..."
                value={userStoryPrompt}
                onChange={e => setUserStoryPrompt(e.target.value)}
              />
              <button
                type="submit"
                className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 hover:from-blue-700 hover:via-purple-700 hover:to-cyan-700 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-slate-800 shadow-2xl btn-3d btn-interactive animate-fade-in-up relative overflow-hidden text-base"
              >
                Submit User Story Prompt
              </button>
            </form>
          </section>
          {/* Test Plan Prompt Container */}
          <section className="flex-1 bg-slate-800/80 rounded-2xl shadow-2xl p-12 min-h-[400px] backdrop-blur-lg">
            <h2 className="text-2xl font-bold text-white mb-4 text-center">Test Plan Prompt (Travel)</h2>
            <form className="space-y-6" onSubmit={handleTestPlanSubmit}>
              <textarea
                className="w-full h-56 p-4 bg-slate-900/60 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200 backdrop-blur-sm text-base font-medium resize-none"
                placeholder="Type your Test Plan prompt for Travel..."
                value={testPlanPrompt}
                onChange={e => setTestPlanPrompt(e.target.value)}
              />
              <button
                type="submit"
                className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 hover:from-purple-700 hover:via-blue-700 hover:to-cyan-700 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:ring-offset-2 focus:ring-offset-slate-800 shadow-2xl btn-3d btn-interactive animate-fade-in-up relative overflow-hidden text-base"
              >
                Submit Test Plan Prompt
              </button>
            </form>
          </section>
        </main>
      </div>
    </>
  );
}

export default MCPPrompt;
