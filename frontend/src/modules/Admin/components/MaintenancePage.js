import React from 'react';
import { Link } from 'react-router-dom';

const MaintenancePage = ({ pageName }) => {
  return (
    <div className="flex flex-col items-center justify-center h-[80vh] text-center p-6 animate-fade-in">
      {/* Icon Bảo Trì */}
      <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(251,191,36,0.3)]">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#fbbf24" className="w-12 h-12">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M16.338 3.086a6.666 6.666 0 00-3.374 3.374 48.026 48.026 0 0110.086 10.086 6.666 6.666 0 003.374-3.374m-9.928 2.304l-1.632 1.632a2.651 2.651 0 01-3.75 0 2.651 2.651 0 010-3.75l1.632-1.632m3.75 3.75l.615.615a2.652 2.652 0 11-3.75 3.75l-.615-.615m3.75-3.75l-3.75 3.75" />
        </svg>
      </div>

      <h2 className="text-3xl font-bold text-white mb-2">Feature Under Maintenance</h2>
      <p className="text-gray-400 max-w-md mb-8">
        Trang <span className="text-rose-500 font-semibold">"{pageName}"</span> đang được nâng cấp để phục vụ tốt hơn. Vui lòng quay lại sau!
      </p>

      <Link 
        to="/admin" 
        className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl border border-gray-600 transition-all font-medium"
      >
        ← Back to Dashboard
      </Link>
    </div>
  );
};

export default MaintenancePage;