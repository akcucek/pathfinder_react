import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';

const MCPPrompt = () => {
  const testPlanInstructions = `Based on the provided user-stories, generate all relevant and distinct Test-Plans in valid JSON format.\nInputs:\nuser-story: {user_story}\nOutput Requirements:\nReturn a JSON array containing only the list of test plans (no extra text).\nIf no test plans can be generated, return an empty array: [].\nEach test case must include the following fields in the specified order/format:\n\"id\": A unique identifier for the user story that starts with PF_TP_\n\"title\": A concise and meaningful title.\n\"description\": A clear and concise explanation of the test case.\n\"steps\": A list of steps to execute the test case.\n\"preconditions\": A list of preconditions that must be met before executing the test case.\n\"test_steps\": A list of test steps, each containing:\n  \"step_number\": An integer indicating the step number.\n  \"action\": A description of the action to be performed.\n  \"expected_result\": A clear and concise expected result of the action.\n\"postconditions\": A list of postconditions that should be true after executing the test case.\n\"expected_result\": A clear and concise expected result of the test case.\n\"tags\": A list of relevant keywords or categories.\nExample Test Case Format:\n{{\n    \"id\": \"PF_TP_001\",\n    \"title\": \"Verify BSM includes .e gate indicator\",\n    \"description\": \"Ensure that the BSM (Baggage Security Message) includes the .e gate indicator for gate bags.\",\n    \"preconditions\": \"The BSM system is operational and configured to handle gate bags.\",\n    \"test_steps\": [\n      {{\n        \"step_number\": 1,\n        \"action\": \"Check the BSM configuration for gate bags\",\n        \"expected_result\": \"BSM configuration includes .e gate indicator\"\n      }},\n      {{\n        \"step_number\": 2,\n        \"action\": \"Send a BSM with a gate bag\",\n        \"expected_result\": \"BSM is sent successfully with .e gate indicator\"\n      }},\n      {{\n        \"step_number\": 3,\n        \"action\": \"Verify the BSM received by the BRS system\",\n        \"expected_result\": \"BSM includes .e gate indicator in the payload\"\n      }}\n    ],\n    \"postconditions\": \"BSM is correctly processed with .e gate indicator.\",\n    \"expected_result\": \"BSM successfully includes .e gate indicator for gate bags.\",\n    \"user_story_id\": \"UC-001\",\n    \"tags\": [\"BSM\", \"Gate Bags\", \"BRS\"]\n}}\nEnsure each field is brief or assertive.\nOmit personas like 'As a check-in system Quality Assurance Engineer or System Analyst'. Use direct and concise imperative language."`;
  const rcaInstructions = `You are a software quality analyst. Your task is to generate a Root Cause Analysis (RCA) based on the following software development artifacts:\n\nUser Stories Description: {user_stories}\nTest Plan Description: {test_plans}\nJIRA Description: {jira_desc}\n\nReturn response in a valid JSON format.\n\nThe response should be a concise summary of the root cause analysis, including:\n- Problem Statement: A brief description of the issue.\n- Root Cause(s): A clear identification of the root cause(s) of the issue.\n- Impact: A description of the impact of the issue on the project or product.\n- Preventive Actions: Recommendations to prevent similar issues in the future.\nExample response format:\n{{\n    \"problem_statement\": \"The BSM system failed to include the .e gate indicator for gate bags.\",\n    \"root_causes\": [\n        \"Requirement gap in user story UC-001 where the .e gate indicator was not specified.\",\n        \"Test case TC_101 did not cover the .e gate indicator in BSM validation.\"\n    ],\n    \"impact\": \"This led to incorrect baggage reconciliation and potential delays in baggage handling.\",\n    \"preventive_actions\": [\n        \"Ensure all user stories include detailed requirements for BSM indicators.\",\n        \"Enhance test cases to cover all possible BSM scenarios, including .e gate indicators.\"\n    ]\n}}\nUse clear and concise language, avoiding unnecessary jargon.`;
  const userStoryInstructions = `Based on the provided domain knowledge and brief description, generate all relevant and distinct User-Stories in valid JSON format.\nInputs:\nDomain Knowledge: {domain_knowledge}\nDescription: {transcription}\nOutput Requirements:\nReturn a JSON array containing only the list of user-stories (no extra text).\nIf no user-stories can be generated, return an empty array: [].\nEach use-case must include the following fields in the specified order/format:\n\"id\": A unique identifier for the user story that starts with PF_US_\n\"title\": A concise and meaningful title.\n\"description\": A clear explanation of the use-case, including the user role, goal, and reason.\n\"acceptance_criteria\": A list of acceptance criteria written as \"Given-When-Then\" format strings.\n\"tags\": A list of relevant keywords or categories.\nExample Use-Case Format:\n{{\n  \"id\": \"PF_US_001\",\n  \"title\": \"Enhance BSM to Include .e Gate Indicator\",\n  \"description\": \"As a BRS agent, I want the BSM (Baggage Security Message) to include the .e gate indicator so that I can recognize gate bags and efficiently handle baggage reconciliation.\",\n  \"acceptance_criteria\": [\n    \"Given: A bag is checked in at the airport. When: The check-in system sends a BSM to the BRS system. Then: The BSM must include the .e gate indicator if the bag is a gate bag.\",\n    \"Given: The BSM is processed by the BRS system. When: The BRS system identifies the .e gate indicator in the BSM. Then: The BRS system must correctly classify the bag as a gate bag.\",\n    \"Given: A BRS agent is in the baggage market area. When: The agent receives information about the bag. Then: The agent must be able to exclude gate bags from loading onto the main baggage system.\"\n  ],\n  \"tags\": [\"Baggage, BSM, Gate Bags, Reconciliation\"]\n}}\nEnsure each field is brief or assertive.\nOmit personas like 'As a check-in system Quality Assurance Engineer or System Analyst'. Use direct and concise imperative language."`;
  // ...existing code...
  const [activeMenu, setActiveMenu] = useState('MCP Prompt');
  const [userStoryPrompt, setUserStoryPrompt] = useState('');
  const [testPlanPrompt, setTestPlanPrompt] = useState('');
  const [rcaPrompt, setRcaPrompt] = useState('');

  const [editUserStory, setEditUserStory] = useState(false);
  const [editTestPlan, setEditTestPlan] = useState(false);
  const [editRcaPrompt, setEditRcaPrompt] = useState(false);
  const [showUserStoryModal, setShowUserStoryModal] = useState(false);
  const [tempUserStoryValue, setTempUserStoryValue] = useState('');
  const [showTestPlanModal, setShowTestPlanModal] = useState(false);
  const [tempTestPlanValue, setTempTestPlanValue] = useState('');
  const [showRcaModal, setShowRcaModal] = useState(false);
  const [tempRcaValue, setTempRcaValue] = useState('');

  const handleEditSave = (type) => {
    if (type === 'userStory') setEditUserStory((prev) => !prev);
    if (type === 'testPlan') setEditTestPlan((prev) => !prev);
    if (type === 'rcaPrompt') setEditRcaPrompt((prev) => !prev);
  };

  const openUserStoryModal = () => {
    setTempUserStoryValue(userStoryPrompt || userStoryInstructions);
    setShowUserStoryModal(true);
  };

  const saveUserStoryModal = () => {
    setUserStoryPrompt(tempUserStoryValue);
    setShowUserStoryModal(false);
  };

  const cancelUserStoryModal = () => {
    setTempUserStoryValue('');
    setShowUserStoryModal(false);
  };

  const openTestPlanModal = () => {
    setTempTestPlanValue(testPlanPrompt || testPlanInstructions);
    setShowTestPlanModal(true);
  };

  const saveTestPlanModal = () => {
    setTestPlanPrompt(tempTestPlanValue);
    setShowTestPlanModal(false);
  };

  const cancelTestPlanModal = () => {
    setTempTestPlanValue('');
    setShowTestPlanModal(false);
  };

  const openRcaModal = () => {
    setTempRcaValue(rcaPrompt || rcaInstructions);
    setShowRcaModal(true);
  };

  const saveRcaModal = () => {
    setRcaPrompt(tempRcaValue);
    setShowRcaModal(false);
  };

  const cancelRcaModal = () => {
    setTempRcaValue('');
    setShowRcaModal(false);
  };

  return (
    <>
      <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 relative overflow-hidden">
        const fallbackUserStory = `[
        <img
          src="/wallpaper.png"
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover opacity-40 pointer-events-none z-0"
          style={{filter: 'blur(2px)'}}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 opacity-70 z-0"></div>
        <main className="relative z-10 w-full mx-auto flex flex-col gap-4 items-stretch justify-center animate-fade-in-up">
          {/* Prompt Gallery Header Container */}
          <section className="w-full mx-8 bg-slate-900/70 backdrop-blur-md border border-slate-600/50 rounded-xl p-6 mb-8 shadow-2xl hover:bg-slate-900/80 transition-all duration-300 flex flex-col items-start mt-8 glass-card">
            <div className="flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="text-purple-400 text-3xl w-8 h-8 group-hover:text-purple-300 group-hover:scale-110 transition-all duration-300">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0.621 0 1.125-.504 1.125-1.125V9.375c0-.621.504-1.125 1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
              </svg>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent group-hover:from-purple-300 group-hover:to-blue-300 transition-all duration-300">
                  Prompt Gallery
                </h1>
                <p className="text-slate-300 group-hover:text-slate-200 transition-colors duration-300">
                  Browse, edit, and manage your prompt templates for different modules.
                </p>
              </div>
            </div>
          </section>
          {/* User Story Prompt Container */}
            <section className="w-full mx-8 bg-slate-800/80 rounded-2xl shadow-2xl py-3 px-8 min-h-[48px] border border-slate-700/50 backdrop-blur-xl flex flex-col glass-card">
            <h2 className="text-2xl font-bold text-white mb-2 text-left tracking-wide drop-shadow-lg">User Story Prompt <span className="text-blue-300 font-semibold">(Travel)</span></h2>
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-6 items-center w-full">
                <textarea
                  className="w-full h-24 p-4 bg-white/10 border border-blue-400/30 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400/80 focus:border-blue-400/80 transition-all duration-200 backdrop-blur-lg text-base font-medium resize-none shadow-lg glass-input cursor-pointer"
                  placeholder="Click to edit User Story prompt..."
                  value={userStoryPrompt || userStoryInstructions}
                  readOnly
                  onClick={openUserStoryModal}
                />
                <div className="flex flex-col gap-3 min-w-[40px] justify-center items-center self-center">
                  <button
                    type="button"
                    className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-blue-500 via-blue-400 to-blue-600 text-white rounded-xl shadow-lg border-2 border-blue-400/40 transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:ring-4 hover:ring-blue-400/40 focus:outline-none focus:ring-4 focus:ring-blue-400/60 relative overflow-hidden animate-pulse-border"
                    onClick={openUserStoryModal}
                    disabled={editUserStory}
                    aria-label="Edit User Story"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 drop-shadow-lg">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 3.487a2.25 2.25 0 1 1 3.182 3.182l-9.193 9.193a2.25 2.25 0 0 1-1.009.57l-3.25.813a.375.375 0 0 1-.454-.454l.813-3.25a2.25 2.25 0 0 1 .57-1.009l9.193-9.193z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 19.5h-15" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-green-500 via-green-400 to-green-600 text-white rounded-xl shadow-lg border-2 border-green-400/40 transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:ring-4 hover:ring-green-400/40 focus:outline-none focus:ring-4 focus:ring-green-400/60 relative overflow-hidden animate-pulse-border"
                    onClick={saveUserStoryModal}
                    disabled={!editUserStory}
                    aria-label="Save User Story"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 drop-shadow-lg">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16v2a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-2m10-6V7a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v3m10 0a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2m10 0v6a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-6" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </section>
          {/* Test Plan Prompt Container */}
          <section className="w-full mx-8 bg-slate-800/80 rounded-2xl shadow-2xl py-3 px-8 min-h-[48px] border border-slate-700/50 backdrop-blur-xl flex flex-col glass-card">
            <h2 className="text-2xl font-bold text-white mb-2 text-left tracking-wide drop-shadow-lg">Test Plan Prompt <span className="text-purple-300 font-semibold">(Travel)</span></h2>
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-6 items-center w-full">
                <textarea
                  className="w-full h-24 p-4 bg-white/10 border border-purple-400/30 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400/80 focus:border-purple-400/80 transition-all duration-200 backdrop-blur-lg text-base font-medium resize-none shadow-lg glass-input cursor-pointer"
                  placeholder="Click to edit Test Plan prompt..."
                  value={testPlanPrompt || testPlanInstructions}
                  readOnly
                  onClick={openTestPlanModal}
                />
                <div className="flex flex-col gap-3 min-w-[40px] justify-center items-center self-center">
                  <button
                    type="button"
                    className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-blue-500 via-blue-400 to-blue-600 text-white rounded-xl shadow-lg border-2 border-blue-400/40 transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:ring-4 hover:ring-blue-400/40 focus:outline-none focus:ring-4 focus:ring-blue-400/60 relative overflow-hidden animate-pulse-border"
                    onClick={openTestPlanModal}
                    aria-label="Edit Test Plan"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 drop-shadow-lg">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 3.487a2.25 2.25 0 1 1 3.182 3.182l-9.193 9.193a2.25 2.25 0 0 1-1.009.57l-3.25.813a.375.375 0 0 1-.454-.454l.813-3.25a2.25 2.25 0 0 1 .57-1.009l9.193-9.193z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 19.5h-15" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-green-500 via-green-400 to-green-600 text-white rounded-xl shadow-lg border-2 border-green-400/40 transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:ring-4 hover:ring-green-400/40 focus:outline-none focus:ring-4 focus:ring-green-400/60 relative overflow-hidden animate-pulse-border"
                    onClick={saveTestPlanModal}
                    aria-label="Save Test Plan"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 drop-shadow-lg">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16v2a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-2m10-6V7a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v3m10 0a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2m10 0v6a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-6" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </section>
          {/* RCA Prompt Text Container */}
          <section className="w-full mx-8 bg-slate-800/80 rounded-2xl shadow-2xl py-3 px-8 min-h-[48px] border border-slate-700/50 backdrop-blur-xl flex flex-col glass-card">
            <h2 className="text-2xl font-bold text-white mb-2 text-left tracking-wide drop-shadow-lg">RCA Prompt <span className="text-cyan-300 font-semibold">(Travel)</span></h2>
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-6 items-center w-full">
                <textarea
                  className="w-full h-24 p-4 bg-white/10 border border-cyan-400/30 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/80 focus:border-cyan-400/80 transition-all duration-200 backdrop-blur-lg text-base font-medium resize-none shadow-lg glass-input cursor-pointer"
                  placeholder="Click to edit RCA prompt..."
                  value={rcaPrompt || rcaInstructions}
                  readOnly
                  onClick={openRcaModal}
                />
                <div className="flex flex-col gap-3 min-w-[40px] justify-center items-center self-center">
                  <button
                    type="button"
                    className="w-10 h-10 flex items-center justify-center bg-blue-500/80 hover:bg-blue-600/90 text-white rounded-lg shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl border border-blue-400/40"
                    onClick={openRcaModal}
                    aria-label="Edit RCA Prompt"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 3.487a2.25 2.25 0 1 1 3.182 3.182l-9.193 9.193a2.25 2.25 0 0 1-1.009.57l-3.25.813a.375.375 0 0 1-.454-.454l.813-3.25a2.25 2.25 0 0 1 .57-1.009l9.193-9.193z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 19.5h-15" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    className="w-10 h-10 flex items-center justify-center bg-green-500/80 hover:bg-green-600/90 text-white rounded-lg shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl border border-green-400/40"
                    onClick={saveRcaModal}
                    aria-label="Save RCA Prompt"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16v2a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-2m10-6V7a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v3m10 0a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2m10 0v6a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-6" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* User Story Modal */}
      {showUserStoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-blue-400/30">
            <div className="flex items-center justify-between p-6 border-b border-slate-600">
              <h3 className="text-xl font-bold text-white">Edit User Story Prompt</h3>
              <button
                onClick={cancelUserStoryModal}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <textarea
                className="w-full h-96 p-4 bg-slate-900/60 border border-blue-400/30 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400/80 focus:border-blue-400/80 transition-all duration-200 text-sm font-mono leading-relaxed resize-none"
                placeholder="Enter your User Story prompt..."
                value={tempUserStoryValue}
                onChange={e => setTempUserStoryValue(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-4 p-6 border-t border-slate-600">
              <button
                onClick={cancelUserStoryModal}
                className="px-6 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveUserStoryModal}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Test Plan Modal */}
      {showTestPlanModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-purple-400/30">
            <div className="flex items-center justify-between p-6 border-b border-slate-600">
              <h3 className="text-xl font-bold text-white">Edit Test Plan Prompt</h3>
              <button
                onClick={cancelTestPlanModal}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <textarea
                className="w-full h-96 p-4 bg-slate-900/60 border border-purple-400/30 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400/80 focus:border-purple-400/80 transition-all duration-200 text-sm font-mono leading-relaxed resize-none"
                placeholder="Enter your Test Plan prompt..."
                value={tempTestPlanValue}
                onChange={e => setTempTestPlanValue(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-4 p-6 border-t border-slate-600">
              <button
                onClick={cancelTestPlanModal}
                className="px-6 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveTestPlanModal}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RCA Prompt Modal */}
      {showRcaModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-cyan-400/30">
            <div className="flex items-center justify-between p-6 border-b border-slate-600">
              <h3 className="text-xl font-bold text-white">Edit RCA Prompt</h3>
              <button
                onClick={cancelRcaModal}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <textarea
                className="w-full h-96 p-4 bg-slate-900/60 border border-cyan-400/30 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/80 focus:border-cyan-400/80 transition-all duration-200 text-sm font-mono leading-relaxed resize-none"
                placeholder="Enter your RCA prompt..."
                value={tempRcaValue}
                onChange={e => setTempRcaValue(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-4 p-6 border-t border-slate-600">
              <button
                onClick={cancelRcaModal}
                className="px-6 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveRcaModal}
                className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default MCPPrompt;
