import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../modules/Admin/components/AdminSidebar';
import HeaderAdmin from '../modules/Admin/components/HeaderAdmin';
import Footer from '../modules/User/components/Footer';
import BlurCircle from '../modules/User/components/BlurCircle';

const AdminLayout = () => {
  // State quản lý việc mở Sidebar (Mặc định mở trên PC)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    // Container chính: Flex Row, full màn hình, không cuộn body
    <div className="flex h-screen bg-gray-950 text-white relative overflow-hidden font-sans">
      
      {/* Hiệu ứng nền */}
      <BlurCircle top="-100px" left="-100px" />
      <BlurCircle bottom="-150px" right="-100px" />
      <BlurCircle top="40%" left="30%" />

      {/* --- CỘT TRÁI: SIDEBAR --- */}
      {/* Sử dụng transition để tạo hiệu ứng trượt mượt mà */}
      <div 
        className={`
          relative z-20 h-full bg-gray-900/80 backdrop-blur-xl border-r border-gray-800 shadow-2xl transition-all duration-300 ease-in-out shrink-0
          ${isSidebarOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full md:w-20 md:translate-x-0'}
        `}
      >
        <AdminSidebar isOpen={isSidebarOpen} />
      </div>

      {/* --- CỘT PHẢI: HEADER + MAIN + FOOTER --- */}
      <div className="flex-1 flex flex-col h-full relative z-10 min-w-0 transition-all duration-300">
        
        {/* A. HEADER (Truyền hàm toggle xuống để nút menu hoạt động) */}
        <HeaderAdmin 
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
            isSidebarOpen={isSidebarOpen}
        />

        {/* B. MAIN CONTENT (Cuộn độc lập) */}
        <main className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-6 scroll-smooth bg-black/20">
          {/* Container giới hạn độ rộng để nội dung không bị bè ra quá rộng trên màn hình lớn */}
          <div className="max-w-7xl mx-auto min-h-full animate-in fade-in duration-500">
             <Outlet />
          </div>
        </main>

        {/* C. FOOTER (Phiên bản nhỏ gọn cho Admin) */}
        <div className="shrink-0 border-t border-gray-800 bg-gray-900/90 backdrop-blur">
             <Footer isAdminView={true} />
        </div>

      </div>
    </div>
  );
};

export default AdminLayout;