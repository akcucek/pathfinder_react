import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import { apiService } from './services/apiService';
import { 
  FaBug, 
  FaSearch, 
  FaSpinner, 
  FaFileAlt, 
  FaCheckCircle,
  FaExclamationTriangle,
  FaDownload
} from 'react-icons/fa';

export default function GenerateRCAReport() {
  const [activeMenu, setActiveMenu] = useState('Defects Analysis');
  const [jiraId, setJiraId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!jiraId.trim()) {
      setError('Please enter a valid Jira ID');
      return;
    }

    setIsLoading(true);
    setError('');
    setReport(null);

    try {
      // POC Mode: Try external service, fallback to mock data
      console.log('POC Mode: Attempting to generate RCA report from external service...');
      
      // Call external API service to generate RCA report
      const response = await apiService.generateRCAReport(jiraId);
      console.log('RCA API Response:', response);
      
      // Handle the new API response format
      if (response && response.success && response.data) {
        console.log('Successful response data:', response.data);
        setReport({
          jiraKey: response.data.jira_key,
          relatedJiraKeys: response.data.related_jira_keys || [],
          testPlanIds: response.data.test_plan_ids || [],
          userStoryIds: response.data.user_story_ids || [],
          status: 'Generated',
          timestamp: new Date().toLocaleString(),
          message: response.message || 'RCA Completed',
          rawResponse: response // Store the complete raw response
        });
      } else {
        console.log('Response format invalid:', response);
        throw new Error('Invalid response format');
      }
      console.log('POC Mode: Successfully generated RCA report from external service');
    } catch (err) {
      console.log('POC Mode: External service error:', err);
      console.log('POC Mode: External service unavailable, using mock data for RCA report');
      // Fallback to mock data: show only the fallback message
      setReport({
        message: 'No Root Cause Analysis Found'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setJiraId('');
    setReport(null);
    setError('');
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
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-500/3 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-20">
      <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
      
      <main className="pt-20 transition-all duration-300 ease-in-out">
        <div className="p-8">
          {/* Header */}
          <header className="bg-slate-900/70 backdrop-blur-md border border-slate-600/50 rounded-xl p-6 mb-8 shadow-2xl hover:bg-slate-900/80 hover:shadow-red-500/10 transition-all duration-300 group">
            <div className="flex items-center gap-3">
              <FaBug className="text-red-400 text-3xl group-hover:text-red-300 group-hover:scale-110 transition-all duration-300" />
              <div>
                <h1 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent group-hover:from-red-300 group-hover:to-orange-300 transition-all duration-300">
                  Defects Analysis
                </h1>
                <p className="text-slate-300 group-hover:text-slate-200 transition-colors duration-300">
                  Perform Root Cause Analysis with Defect Traceability
                </p>
              </div>
            </div>
          </header>

          {/* Main Container */}
          <div className="bg-slate-900/70 backdrop-blur-md border border-slate-600/50 rounded-xl p-8 shadow-2xl hover:bg-slate-900/80 hover:shadow-red-500/10 transition-all duration-300 relative overflow-hidden group">
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-orange-500/5 to-yellow-500/5 animate-pulse"></div>
            
            <div className="relative z-10">
              {/* Search Form */}
              <form onSubmit={handleSubmit} className="mb-8">
                <div className="text-center mb-6">
                  <FaSearch className="text-4xl text-red-400 mx-auto mb-4 group-hover:text-red-300 group-hover:scale-110 transition-all duration-300" />
                  <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-slate-100 transition-colors duration-300">Enter Jira Ticket ID</h2>
                  <p className="text-slate-300 group-hover:text-slate-200 transition-colors duration-300">
                    Provide the Jira ticket ID for defect analysis
                  </p>
                </div>

                <div className="max-w-md mx-auto">
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={jiraId}
                        onChange={(e) => setJiraId(e.target.value)}
                        placeholder="e.g., PROJ-1234"
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        disabled={isLoading}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isLoading || !jiraId.trim()}
                      className="px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <FaSpinner className="animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <FaFileAlt />
                          Generate
                        </>
                      )}
                    </button>
                  </div>
                  
                  {error && (
                    <div className="mt-3 p-3 bg-red-900/50 border border-red-500/50 rounded-lg text-red-300 text-sm flex items-center gap-2">
                      <FaExclamationTriangle />
                      {error}
                    </div>
                  )}
                </div>
              </form>

              {/* Show only the fallback message if no RCA found */}
              {report && report.message === 'No Root Cause Analysis Found' ? (
                <div className="bg-slate-700/30 border border-slate-600/50 rounded-lg p-8 flex items-center justify-center min-h-[200px]">
                  <span className="text-red-400 text-xl font-bold">No Root Cause Analysis Found</span>
                </div>
              ) : report && (
                // Show compliance info message after RCA details
                <>
                  <div className="bg-slate-700/30 border border-slate-600/50 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <FaCheckCircle className="text-green-400 text-2xl" />
                      <h3 className="text-xl font-bold text-white">RCA Completed</h3>
                    </div>
                    {/* RCA Data Table */}
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <FaFileAlt className="text-blue-400" />
                        Root Cause Analysis Details
                      </h4>
                      <div className="bg-slate-800/50 rounded-lg border border-slate-600/30 overflow-hidden">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-slate-700/50 border-b border-slate-600/30">
                              <th className="text-left p-4 text-slate-300 font-semibold">Field</th>
                              <th className="text-left p-4 text-slate-300 font-semibold">Value</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b border-slate-600/20 hover:bg-slate-700/30 transition-colors">
                              <td className="p-4 text-slate-400">Primary Jira Key</td>
                              <td className="p-4 text-white font-mono">{report.jiraKey}</td>
                            </tr>
                            <tr className="border-b border-slate-600/20 hover:bg-slate-700/30 transition-colors">
                              <td className="p-4 text-slate-400">Related Jira Keys</td>
                              <td className="p-4">
                                {report.relatedJiraKeys.length > 0 ? (
                                  <div className="flex flex-wrap gap-2">
                                    {report.relatedJiraKeys.map((key, index) => (
                                      <span key={index} className="px-2 py-1 bg-orange-500/20 text-orange-300 rounded text-sm font-mono">
                                        {key}
                                      </span>
                                    ))}
                                  </div>
                                ) : (
                                  <span className="text-slate-500 italic">No related keys found</span>
                                )}
                              </td>
                            </tr>
                            <tr className="border-b border-slate-600/20 hover:bg-slate-700/30 transition-colors">
                              <td className="p-4 text-slate-400">Test Plan IDs</td>
                              <td className="p-4">
                                {report.testPlanIds.length > 0 ? (
                                  <div className="flex flex-wrap gap-2">
                                    {report.testPlanIds.map((id, index) => (
                                      <span key={index} className="px-2 py-1 bg-green-500/20 text-green-300 rounded text-sm font-mono">
                                        {id}
                                      </span>
                                    ))}
                                  </div>
                                ) : (
                                  <span className="text-slate-500 italic">No test plans found</span>
                                )}
                              </td>
                            </tr>
                            <tr className="hover:bg-slate-700/30 transition-colors">
                              <td className="p-4 text-slate-400">User Story IDs</td>
                              <td className="p-4">
                                {report.userStoryIds.length > 0 ? (
                                  <div className="flex flex-wrap gap-2">
                                    {report.userStoryIds.map((id, index) => (
                                      <span key={index} className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-sm font-mono">
                                        {id}
                                      </span>
                                    ))}
                                  </div>
                                ) : (
                                  <span className="text-slate-500 italic">No user stories found</span>
                                )}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    {/* Message */}
                    <div className="mb-6 bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                      <p className="text-blue-300 text-sm font-medium">{report.message}</p>
                    </div>
                    {/* Compliance Summary */}
                    <div className="mt-6 bg-blue-800/20 border border-blue-400/30 rounded-lg p-4">
                      <p className="text-blue-100 text-sm whitespace-pre-line">
                        The root cause of the defect was an incomplete implementation during the development phase. The user story (UC_e7ae3ba8-915c-4826-83f0-031bf3e0365f) and its acceptance
                        criteria correctly specified that the BCBP 'Version Number' must be '8' for both initial check-in and subsequent reprints. The test plan (TC_4713c1ce-afc2-4c32-9a4a-789c800cben76)
                        was designed to validate this reprint scenario.

                        The failure occurred because the developer likely updated the logic for the initial barcode generation but overlooked the separate
                        code path for the reprint function. This resulted in reprinted boarding passes being generated with an older or default version number, causing the test case to fail. There was no gap
                        in the requirements or test coverage; the issue was a development oversight.

                        This defect was introduced during the **development phase**.

                        To prevent recurrence, the following actions are recommended:
                        1.  **Enforce Unit Testing:** Mandate that unit tests be written to cover every acceptance criterion in a user story, ensuring all distinct code
                        paths (like initial generation vs. reprint) are validated before QA handover.
                        2.  **Improve Code Review Process:** Enhance code review checklists to require reviewers to explicitly confirm that a change has been applied to all relevant functions and modules impacted by the user story requirements, not just the primary one.
                      </p>
                    </div>
                  </div>
                </>
              )}

              {/* Instructions */}
              {!report && !isLoading && (
                <div className="mt-8 bg-slate-700/20 border border-slate-600/30 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-3">How it works:</h3>
                  <ul className="text-slate-300 space-y-2">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                      Enter a valid Jira ticket ID (e.g., PROJ-1234)
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                      Click "Generate" to perform Root Cause Analysis
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                      Get monthly  Defect Traceability Report
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      </div>
    </div>
  );
}
