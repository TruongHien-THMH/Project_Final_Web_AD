// src/admin/components/StatsCard.js
import React from 'react';

// Dùng Icon Component placeholder. Bạn có thể thay thế bằng react-icons
const StatsCard = ({ title, value, icon: IconComponent }) => {
  return (
    <div className="bg-gray-800 p-5 rounded-xl shadow-xl flex justify-between items-center transition duration-300 hover:bg-gray-700 hover:scale-[1.02]">
      <div>
        <div className="text-3xl font-bold text-white">{value}</div>
        <div className="text-sm text-gray-400 mt-1">{title}</div>
      </div>
      {/* Icon placeholder với gradient màu hồng */}
      <div className="p-3 rounded-full bg-rose-700 text-white opacity-70">
         {/* Giả định Icon Component */}
         <span className="text-2xl">
            {/* Đây là nơi Icon của bạn sẽ được đặt */}
            {IconComponent === 'receipt' ? '📦' : IconComponent === 'bag' ? '💰' : IconComponent === 'movie' ? '🎥' : '👤'}
         </span>
      </div>
    </div>
  );
};

export default StatsCard;