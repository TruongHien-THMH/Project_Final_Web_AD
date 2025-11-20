// src/admin/components/AdminTable.js
import React from 'react';

const AdminTable = ({ headers, data }) => {
  return (
    <div className="overflow-x-auto bg-gray-800 rounded-xl shadow-2xl">
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-700">
          <tr>
            {headers.map((header) => (
              <th
                key={header}
                className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-rose-400"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="transition-colors duration-150 hover:bg-gray-700">
              {Object.values(row).map((value, cellIndex) => (
                <td
                  key={cellIndex}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-300"
                >
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminTable;