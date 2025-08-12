import React, { useState } from 'react';

const initialRows = [
  { ticket: '', storyPoints: 0, approve: false }
];

const BATableApproval = () => {
  const [rows, setRows] = useState(initialRows);

  // Add a new row
  const addRow = () => {
    setRows([...rows, { ticket: '', storyPoints: 0, approve: false }]);
  };

  // Remove a row by index
  const removeRow = (idx) => {
    setRows(rows.filter((_, i) => i !== idx));
  };

  // Edit a cell value
  const handleChange = (idx, field, value) => {
    const updatedRows = rows.map((row, i) =>
      i === idx ? { ...row, [field]: field === 'storyPoints' ? Number(value) : value } : row
    );
    setRows(updatedRows);
  };

  // Toggle approve checkbox
  const handleApprove = (idx) => {
    const updatedRows = rows.map((row, i) =>
      i === idx ? { ...row, approve: !row.approve } : row
    );
    setRows(updatedRows);
  };

  // Find row with highest story points
  const highestRow = rows.reduce((max, row) =>
    row.storyPoints > max.storyPoints ? row : max,
    { ticket: '', storyPoints: -Infinity, approve: false }
  );

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">BA Analyst Ticket Approval</h2>
      <table className="w-full border mb-4">
        <thead>
          <tr className="bg-blue-100">
            <th className="p-2 border">Ticket</th>
            <th className="p-2 border">Story Points</th>
            <th className="p-2 border">Approve</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx}>
              <td className="p-2 border">
                <input
                  type="text"
                  value={row.ticket}
                  onChange={e => handleChange(idx, 'ticket', e.target.value)}
                  className="w-full border rounded px-2 py-1"
                />
              </td>
              <td className="p-2 border">
                <input
                  type="number"
                  value={row.storyPoints}
                  onChange={e => handleChange(idx, 'storyPoints', e.target.value)}
                  className="w-full border rounded px-2 py-1"
                />
              </td>
              <td className="p-2 border text-center">
                <input
                  type="checkbox"
                  checked={row.approve}
                  onChange={() => handleApprove(idx)}
                />
              </td>
              <td className="p-2 border text-center">
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  onClick={() => removeRow(idx)}
                  disabled={rows.length === 1}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
        onClick={addRow}
      >
        Add Row
      </button>
      <div className="mt-4 text-lg">
        Your favorite ticket is <span className="font-bold text-blue-700">{highestRow.ticket || 'N/A'}</span>.
      </div>
    </div>
  );
};

export default BATableApproval;
