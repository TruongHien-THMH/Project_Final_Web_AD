// src/admin/components/HeaderAdmin.js (Giả định vị trí)
import React from 'react';

const HeaderAdmin = () => {
  return (
    <header className="w-full bg-gray-900 border-b border-gray-700 text-white p-4 flex justify-end items-center sticky top-0 z-10">
      <div className="flex items-center space-x-4">
        {/* Nút thông báo */}
        <button className="text-gray-400 hover:text-rose-500 transition relative">
          <i className="ri-notification-3-line text-xl"></i> 
          <span className="absolute top-0 right-0 h-2 w-2 bg-rose-500 rounded-full"></span>
        </button>

        {/* Nút Log Out/Tùy chọn */}
        <button className="bg-rose-600 hover:bg-rose-700 transition text-white px-3 py-1.5 text-sm rounded-md">
          Log Out
        </button>
      </div>
    </header>
  );
};

export default HeaderAdmin;