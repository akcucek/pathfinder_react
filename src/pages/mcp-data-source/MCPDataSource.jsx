import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';

const MCPDataSource = () => {
  const [activeMenu, setActiveMenu] = useState('MCP Data Source');
  const [dataSources, setDataSources] = useState([
    { id: 1, name: 'Travel API', config: 'https://api.travel.com/v1' },
    { id: 2, name: 'Hotel DB', config: 'https://hotel-db.com/api' },
    { id: 3, name: 'Flight Service', config: 'https://flights.com/service' }
  ]);
  const [selectedId, setSelectedId] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [editConfig, setEditConfig] = useState(dataSources[0].config);

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
    <>
      <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
        <img
          src="/background.jpg"
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover opacity-40 pointer-events-none z-0"
          style={{filter: 'blur(2px)'}}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 opacity-70 z-0"></div>
        <main className="relative z-10 w-full max-w-2xl mx-auto bg-slate-800/80 rounded-2xl shadow-2xl p-12 backdrop-blur-lg animate-fade-in-up">
          <h1 className="text-3xl font-bold text-white mb-8 text-center">Data Sources</h1>
          <div className="flex flex-col gap-8 items-center">
            <div className="w-full bg-slate-900/60 border border-indigo-500/30 rounded-xl p-8 text-white flex flex-col gap-6">
              <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
                <label htmlFor="dataSourceSelect" className="text-lg font-semibold">Select Data Source:</label>
                <select
                  id="dataSourceSelect"
                  value={selectedId}
                  onChange={handleSelectChange}
                  className="min-w-[200px] px-4 py-2 rounded-lg bg-slate-800 border border-indigo-500 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {dataSources.map(ds => (
                    <option key={ds.id} value={ds.id}>{ds.name}</option>
                  ))}
                </select>
                <button
                  className="px-6 py-2 bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 hover:from-indigo-700 hover:via-blue-700 hover:to-cyan-700 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-[1.04] focus:outline-none focus:ring-2 focus:ring-indigo-500/50 shadow-lg"
                  onClick={handleEditClick}
                  disabled={isEditing}
                >
                  Edit
                </button>
              </div>
              <div className="mt-6">
                <label className="block text-md font-medium mb-2">Configuration:</label>
                {isEditing ? (
                  <div className="flex gap-4 items-center">
                    <input
                      type="text"
                      value={editConfig}
                      onChange={e => setEditConfig(e.target.value)}
                      className="flex-1 px-4 py-2 rounded-lg bg-slate-900 border border-indigo-500 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      className="px-6 py-2 bg-gradient-to-r from-green-600 via-blue-600 to-cyan-600 hover:from-green-700 hover:via-blue-700 hover:to-cyan-700 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-[1.04] focus:outline-none focus:ring-2 focus:ring-green-500/50 shadow-lg"
                      onClick={handleSaveClick}
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-4 items-center">
                    <span className="flex-1 px-4 py-2 rounded-lg bg-slate-900 border border-indigo-500 text-indigo-300">{editConfig}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default MCPDataSource;
