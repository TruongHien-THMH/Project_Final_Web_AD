import React from 'react';

const CinemaScreen = () => {
  return (
    <div className="w-full max-w-3xl flex flex-col items-center mb-8">
      <div className="w-3/4 h-1 bg-rose-600/70 rounded-t-full shadow-[0_0px_20px_4px_rgba(225,29,72,0.4)] mb-2"></div>
      <span className="text-sm text-gray-400 tracking-widest uppercase">Screen Side</span>
    </div>
  );
};

export default CinemaScreen;