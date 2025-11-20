import React from 'react';
import { useNavigate } from 'react-router-dom';
import BlurCircle from '../components/BlurCircle'; 

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
   
    <div className="bg-[#0b0b0b] text-white w-full py-32 px-6 md:px-16 relative flex flex-col items-center justify-center text-center overflow-hidden min-h-[50vh]">
      
      {/* Thêm hiệu ứng blur cho đẹp */}
      <BlurCircle top="0" left="0" />
      <BlurCircle bottom="-100px" right="0" />

      {/* Nội dung (phải có z-10 để nổi lên trên) */}
      <div className="relative z-10">
        <h1 className="text-8xl md:text-9xl font-bold text-rose-600 mb-4">404</h1>
        <h2 className="text-3xl md:text-4xl font-semibold text-white mb-6">Page Not Found</h2>
        <p className="text-gray-400 text-lg mb-10 max-w-lg mx-auto">
          Oops! Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di dời.
        </p>
        <button
          onClick={() => navigate('/')} // Quay về trang chủ
          className="bg-rose-600 hover:bg-rose-700 transition text-white px-8 py-3 rounded-full text-base font-medium flex items-center gap-2 mx-auto"
        >
          Go Back Home
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;