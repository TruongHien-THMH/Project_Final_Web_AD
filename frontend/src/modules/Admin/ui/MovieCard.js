import React from 'react';

const MovieCard = ({ movie, isSelected, onToggle }) => {

    const movieDetail = {
        tmdb_id: movie.id,
        mongoId: movie._id,
        title: movie.title || movie.original_title,
        img: `${process.env.REACT_APP_IMAGES}${movie.poster_path}`
    }

  return (
    <div 
      onClick={() => onToggle(movie._id)}
      className={`
        relative flex-shrink-0 w-48 cursor-pointer rounded-xl overflow-hidden transition-all duration-300 ease-in-out group
        ${isSelected ? 'ring-4 ring-pink-500 scale-95' : 'hover:scale-105 hover:shadow-2xl'}
      `}
    >
      {/* 1. Lớp phủ khi đã chọn (Overlay) */}
      {isSelected && (
        <div className="absolute inset-0 bg-pink-500/20 z-10 flex items-center justify-center">
          <div className="bg-pink-500 text-white rounded-full p-2 shadow-lg animate-bounce">
            {/* Icon Checkmark đơn giản bằng SVG */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
      )}

      {/* 2. Poster Phim */}
      <div className="relative aspect-[2/3] w-full">
        <img 
          src={movieDetail.img || "https://via.placeholder.com/200x300"} 
          alt={movieDetail.title} 
          className="w-full h-full object-cover"
        />
        {/* Hiệu ứng bóng đen mờ dần ở dưới để làm nổi text */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-80" />
      </div>

      {/* 3. Thông tin phim (Chỉ hiện tên như yêu cầu) */}
      <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
        <h3 className={`font-bold text-lg truncate ${isSelected ? 'text-pink-400' : 'text-white group-hover:text-pink-500'}`}>
          {movie.title}
        </h3>
      </div>
    </div>
  );
};

export default MovieCard;