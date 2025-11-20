import React from 'react';

const SeatLegend = () => {
  return (
    <div className="flex justify-center flex-wrap gap-6 mt-8">
      <div className="flex items-center space-x-2">
        <div className="w-6 h-6 border-2 border-rose-600/50 rounded-md"></div>
        <span className="text-sm text-gray-400">Available</span>
      </div>
      <div className="flex items-center space-x-2">
        <div className="w-6 h-6 bg-rose-600 border-2 border-rose-600 rounded-md shadow-lg shadow-rose-500/50"></div>
        <span className="text-sm text-gray-400">Selected</span>
      </div>
      <div className="flex items-center space-x-2">
        <div className="w-6 h-6 bg-gray-600 border-2 border-gray-600 rounded-md"></div>
        <span className="text-sm text-gray-400">Booked</span>
      </div>
      <div className="flex items-center space-x-2">
        <div className="w-6 h-6 bg-amber-600 border-2 border-amber-600 rounded-md"></div>
        <span className="text-sm text-gray-400">VIP</span>
      </div>
    </div>
  );
};

export default SeatLegend;