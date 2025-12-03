import React, { useRef } from 'react';
import  MovieCard from '../ui/MovieCard';

const MovieCarousel = ({ children, title }) => {
  const scrollRef = useRef(null);

  // Hàm xử lý nút bấm cuộn trái/phải
  const scroll = (direction) => {
    const { current } = scrollRef;
    if (current) {
      const scrollAmount = direction === 'left' ? -300 : 300; // Khoảng cách cuộn
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full py-6">
      {/* Header của Carousel */}
      <div className="flex justify-between items-center mb-4 px-4">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        
        {/* Nút điều hướng nhỏ */}
        <div className="flex gap-2">
          <button onClick={() => scroll('left')} className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full text-white transition">
             &larr; {/* Mũi tên trái */}
          </button>
          <button onClick={() => scroll('right')} className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full text-white transition">
             &rarr; {/* Mũi tên phải */}
          </button>
        </div>
      </div>

      {/* Container chứa Card - Dùng CSS hide scrollbar nhưng vẫn scroll được */}
      <div 
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto px-4 pb-4 scroll-smooth snap-x scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} // Ẩn thanh cuộn mặc định
      >
        {children}
      </div>
    </div>
  );
};

export default MovieCarousel;