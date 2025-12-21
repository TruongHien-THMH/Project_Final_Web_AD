import React from 'react';
import { Link } from 'react-router-dom';

const ForbiddenPage = () => {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white px-4">
      <h1 className="text-9xl font-black text-rose-600">403</h1>
      <h2 className="text-3xl font-bold mt-4">Access Denied</h2>
      <p className="text-gray-400 mt-2 text-center max-w-md">
        Xin lỗi, bạn không có quyền truy cập vào khu vực này. Trang này chỉ dành cho Quản trị viên (Admin).
      </p>
      
      <Link 
        to="/" 
        className="mt-8 px-8 py-3 bg-rose-600 hover:bg-rose-700 rounded-full font-bold transition-all"
      >
        Quay về Trang chủ
      </Link>
    </div>
  );
};

export default ForbiddenPage;