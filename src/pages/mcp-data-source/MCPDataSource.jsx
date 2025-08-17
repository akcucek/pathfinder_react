import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';

const MCPDataSource = () => {
  const [activeMenu, setActiveMenu] = useState('MCP Data Source');
  const [dataSources, setDataSources] = useState([
    { id: 1, name: 'Travel API', config: '/api' },
    { id: 2, name: 'Hotel DB', config: 'https://hotel-db.com/api' },
    { id: 3, name: 'Flight Service', config: 'https://flights.com/service' }
  ]);
  const [selectedId, setSelectedId] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [editConfig, setEditConfig] = useState(dataSources[0].config);
  const [topK, setTopK] = useState({ 1: '', 2: '', 3: '', 4: '', 5: '', 6: '' });
  const [selectOption, setSelectOption] = useState({ 1: '', 2: '', 3: '', 4: '', 5: '', 6: '' });

  const handleTopKChange = (id, value) => {
    const sanitized = value.replace(/[^0-9]/g, '');
    setTopK(prev => ({ ...prev, [id]: sanitized }));
  };

  const handleSelectOptionChange = (id, value) => {
    setSelectOption(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (e) => {
    const id = Number(e.target.value);
    setSelectedId(id);
    const ds = dataSources.find(d => d.id === id);
    setEditConfig(ds.config);
    setIsEditing(false);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    setDataSources(sources => sources.map(ds => ds.id === selectedId ? { ...ds, config: editConfig } : ds));
    setIsEditing(false);
  };
  
  return (
    <div>
      <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
      <div className="min-h-screen relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/background.jpg"
            alt="Background"
            className="w-full h-full object-cover"
            style={{filter: 'blur(2px)'}}
            onLoad={e => { e.target.parentElement.style.background = 'linear-gradient(to bottom right, #0f172a, #1e293b, #334155)'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/85 via-blue-900/75 to-slate-800/90 backdrop-blur-[1px]"></div>
        </div>
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500/3 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>
        <div className="relative z-20">
          <main className="pt-8 flex flex-col min-h-screen transition-all duration-300 ease-in-out bg-transparent">
            <div className="w-full px-4 md:px-8 py-8 md:py-12 lg:py-16">
              {/* Data Source Gallery Header Container */}
              <header className="bg-slate-900/70 backdrop-blur-md border border-slate-600/50 rounded-xl p-6 mb-8 shadow-2xl hover:bg-slate-900/80 hover:shadow-blue-500/10 transition-all duration-300 group">
                <div className="flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="text-blue-400 text-3xl w-8 h-8 group-hover:text-blue-300 group-hover:scale-110 transition-all duration-300">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
                  </svg>
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent group-hover:from-blue-300 group-hover:to-cyan-300 transition-all duration-300">
                      Data Source Gallery
                    </h1>
                    <p className="text-slate-300 group-hover:text-slate-200 transition-colors duration-300">
                      Configure and manage your data source connections
                    </p>
                  </div>
                </div>
              </header>
            <div className="w-full bg-slate-900/80 backdrop-blur-md border border-slate-600/50 rounded-xl p-6 mb-8 shadow-2xl hover:bg-slate-900/85 hover:shadow-blue-500/20 transition-all duration-300">
              <table className="min-w-full divide-y divide-gray-200 rounded-xl overflow-hidden">
                <thead className="bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 rounded-xl">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent uppercase tracking-wider w-3/4">Data Source</th>
                    <th className="px-6 py-4 text-center text-sm font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent uppercase tracking-wider w-1/12">Select</th>
                    <th className="px-6 py-4 text-center text-sm font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent uppercase tracking-wider w-1/12">Threshold</th>
                    <th className="px-6 py-4 text-center text-sm font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent uppercase tracking-wider w-1/12">TOP K</th>
                  </tr>
                </thead>
                <tbody className="bg-slate-800/60 backdrop-blur-sm divide-y divide-slate-600/30">
                  <tr className="hover:bg-slate-700/40 transition-colors duration-200">
                    <td className="px-6 py-5 whitespace-nowrap text-base font-medium text-slate-100 w-3/4">Domain Knowledge Documents</td>
                      <td className="px-6 py-5 whitespace-nowrap text-center w-1/12">
                        <input type="checkbox" checked readOnly className="w-5 h-5 accent-blue-500 rounded focus:ring-2 focus:ring-blue-400" />
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-center w-1/12">
                        <input type="number" value="0.8" readOnly className="w-20 px-3 py-2 rounded-lg bg-slate-700/80 text-slate-100 border border-blue-400/50 font-medium" />
                      </td>
                      <td className="px-6 py-5 text-center w-1/12">
                        <input type="number" value="3" readOnly className="w-20 px-3 py-2 rounded-lg bg-slate-700/80 text-slate-100 border border-blue-400/50 font-medium" />
                      </td>
                  </tr>
                  <tr className="hover:bg-slate-700/40 transition-colors duration-200">
                    <td className="px-6 py-5 whitespace-nowrap text-base font-medium text-slate-100 w-3/4">Related User Stories</td>
                      <td className="px-6 py-5 whitespace-nowrap text-center w-1/12">
                        <input type="checkbox" checked readOnly className="w-5 h-5 accent-cyan-500 rounded focus:ring-2 focus:ring-cyan-400" />
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-center w-1/12">
                        <input type="number" value="0.8" readOnly className="w-20 px-3 py-2 rounded-lg bg-slate-700/80 text-slate-100 border border-cyan-400/50 font-medium" />
                      </td>
                      <td className="px-6 py-5 text-center w-1/12">
                        <input type="number" value="3" readOnly className="w-20 px-3 py-2 rounded-lg bg-slate-700/80 text-slate-100 border border-cyan-400/50 font-medium" />
                      </td>
                  </tr>
                  <tr className="hover:bg-slate-700/40 transition-colors duration-200">
                    <td className="px-6 py-5 whitespace-nowrap text-base font-medium text-slate-100 w-3/4">Related Test Plans</td>
                      <td className="px-6 py-5 whitespace-nowrap text-center w-1/12">
                        <input type="checkbox" checked readOnly className="w-5 h-5 accent-yellow-500 rounded focus:ring-2 focus:ring-yellow-400" />
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-center w-1/12">
                        <input type="number" value="0.8" readOnly className="w-20 px-3 py-2 rounded-lg bg-slate-700/80 text-slate-100 border border-yellow-400/50 font-medium" />
                      </td>
                      <td className="px-6 py-5 text-center w-1/12">
                        <input type="number" value="3" readOnly className="w-20 px-3 py-2 rounded-lg bg-slate-700/80 text-slate-100 border border-yellow-400/50 font-medium" />
                      </td>
                  </tr>
                  <tr className="hover:bg-slate-700/40 transition-colors duration-200">
                    <td className="px-6 py-5 whitespace-nowrap text-base font-medium text-slate-100 w-3/4">5 Why Analysis of Past Incidents</td>
                    <td className="px-6 py-5 whitespace-nowrap text-center w-1/12">
                      <input type="checkbox" checked={!!selectOption[5]} onChange={e => handleSelectOptionChange(5, e.target.checked ? 'Selected' : '')} className="w-5 h-5 accent-purple-500 rounded focus:ring-2 focus:ring-purple-400" />
                    </td>
                      <td className="px-6 py-5 whitespace-nowrap text-center w-1/12">
                        <input type="number" value="0.0" readOnly className="w-20 px-3 py-2 rounded-lg bg-slate-700/80 text-slate-100 border border-purple-400/50 font-medium" />
                      </td>
                      <td className="px-6 py-5 text-center w-1/12">
                        <input type="number" value="0" readOnly className="w-20 px-3 py-2 rounded-lg bg-slate-700/80 text-slate-100 border border-purple-400/50 font-medium" />
                      </td>
                  </tr>
                  <tr className="hover:bg-slate-700/40 transition-colors duration-200">
                    <td className="px-6 py-5 whitespace-nowrap text-base font-medium text-slate-100 w-3/4">Regression Test Scenarios</td>
                    <td className="px-6 py-5 whitespace-nowrap text-center w-1/12">
                      <input type="checkbox" checked={!!selectOption[6]} onChange={e => handleSelectOptionChange(6, e.target.checked ? 'Selected' : '')} className="w-5 h-5 accent-emerald-500 rounded focus:ring-2 focus:ring-emerald-400" />
                    </td>
                      <td className="px-6 py-5 whitespace-nowrap text-center w-1/12">
                        <input type="number" value="0.0" readOnly className="w-20 px-3 py-2 rounded-lg bg-slate-700/80 text-slate-100 border border-emerald-400/50 font-medium" />
                      </td>
                      <td className="px-6 py-5 text-center w-1/12">
                        <input type="number" value="0" readOnly className="w-20 px-3 py-2 rounded-lg bg-slate-700/80 text-slate-100 border border-emerald-400/50 font-medium" />
                      </td>
                  </tr>
                </tbody>
              </table>
            </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default MCPDataSource;
