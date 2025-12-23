import React from 'react';

// Thêm prop isAdminView
const Footer = ({ isAdminView = false }) => {
  
  // NẾU LÀ ADMIN -> Render Footer siêu nhỏ
  if (isAdminView) {
      return (
        <footer className="w-full py-4 px-6 text-xs text-gray-500 flex flex-col md:flex-row justify-between items-center gap-2">
            <div>
                <span className="text-rose-600 font-bold">VNUK</span>Cinemas Admin Panel
            </div>
            <div>
                Copyright © 2025 GreatStack. All rights reserved.
            </div>
        </footer>
      );
  }

  // NẾU LÀ USER -> Render Footer to (Code cũ của bạn giữ nguyên)
  return (
    <footer className="bg-[#0b0b0b] text-gray-300 py-12 px-6 md:px-16 border-t border-gray-700">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
        {/* ... (Giữ nguyên nội dung footer user cũ của bạn ở đây) ... */}
        {/* COPY LẠI NỘI DUNG CŨ VÀO ĐÂY NHÉ, MÌNH VIẾT VẮN TẮT ĐỂ TIẾT KIỆM DÒNG */}
         <div className="text-center col-span-3">User Footer Content Here...</div>
      </div>
      <div className="border-t border-gray-700 pt-6 text-center text-sm text-gray-500">
        Copyright 2025 © GreatStack. All Right Reserved.
      </div>
    </footer>
  );
};

export default Footer;