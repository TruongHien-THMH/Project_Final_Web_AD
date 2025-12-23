// src/components/ui/MovieCard_user.js
import React from 'react';

const MovieCard = ({ movie }) => {
  // Logic lấy link ảnh: Nếu có link full (http) thì dùng, không thì ghép với link TMDB
  const posterUrl = movie.poster_path 
    ? (movie.poster_path.startsWith('http') ? movie.poster_path : `https://image.tmdb.org/t/p/w500${movie.poster_path}`)
    : 'https://via.placeholder.com/300x450?text=No+Image';

  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 0;

  return (
    <div className="w-full bg-gray-800 rounded-lg overflow-hidden shadow-xl transition hover:scale-105 hover:ring-2 hover:ring-rose-600 duration-300 group">
      
      {/* Poster */}
      <div className="relative h-72 overflow-hidden">
         <img 
            src={posterUrl} 
            alt={movie.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
         />
         {/* Overlay Runtime (Nếu có) */}
         {movie.runtime && (
            <div className="absolute top-2 right-2 bg-black/60 px-2 py-1 rounded text-xs font-bold text-white">
                {movie.runtime} min
            </div>
         )}
      </div>
      
      {/* Thông tin */}
      <div className="p-4">
        <h3 className="text-white text-md font-bold truncate mb-1" title={movie.title}>
          {movie.title}
        </h3>
        
        <div className="flex justify-between items-center text-sm">
          {/* Điểm số */}
          <div className="flex items-center text-yellow-400 gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
            </svg>
            <span>{rating}</span>
          </div>
          
          {/* Ngày phát hành (Năm) */}
          <span className="text-gray-400">
            {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;