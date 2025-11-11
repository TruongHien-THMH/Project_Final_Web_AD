// src/admin/pages/AdminLayout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import HeaderAdmin from '../components/HeaderAdmin'; // Sử dụng component HeaderAdmin

const AdminLayout = () => {
  return (
    <div className="flex bg-gray-900 min-h-screen">
      {/* Sidebar */}
      <AdminSidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        <HeaderAdmin /> {/* Header Admin nằm trên cùng của nội dung chính */}
        
        <main className="p-8 flex-1 bg-gray-900">
          {/* Nội dung trang con sẽ được render ở đây */}
          <Outlet /> 
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;