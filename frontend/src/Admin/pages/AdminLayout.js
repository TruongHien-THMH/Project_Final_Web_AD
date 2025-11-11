import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import HeaderAdmin from '../components/HeaderAdmin'; // Sử dụng component HeaderAdmin
import BlurCircle from '../../User/components/BlurCircle';
// (Bạn sẽ tự import BlurCircle ở đây)

const AdminLayout = () => {
  return (
    
    <div className="flex bg-gray-900 min-h-screen relative overflow-hidden">
    
      {/* 2. Thêm BlurCircle ngay tại đây, ở lớp dưới cùng (sau nền) */}
      {/* Bạn có thể thêm bao nhiêu tùy thích và đổi vị trí */}
      <BlurCircle top="-100px" left="-100px" />
      <BlurCircle bottom="-150px" right="-100px" />
      <BlurCircle top="40%" left="30%" />


      {/* 3. Bọc Sidebar trong một div có `relative z-10` để nâng nó lên trên */}
      <div className="relative z-10">
        <AdminSidebar />
      </div>
      
      {/* 4. Nâng toàn bộ khu vực nội dung chính lên trên (`relative z-10`) */}
      <div className="flex-1 flex flex-col relative z-10">
        <HeaderAdmin /> 
        
        {/* 5. Quan trọng: Xóa `bg-gray-900` khỏi <main>
              Nếu không, lớp nền của <main> sẽ che mất hiệu ứng blur
              Container ngoài cùng đã có `bg-gray-900` rồi.
        */}
        <main className="p-8 flex-1">
          <Outlet /> 
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;