// src/admin/components/MovieCard.js
import React from 'react';

const MovieCard = ({ movie }) => {
  return (
    <div className="w-full bg-gray-800 rounded-lg overflow-hidden shadow-2xl transition duration-300 hover:ring-2 hover:ring-rose-600">
      
      {/* Poster */}
      <div className="relative h-64">
         {/*  */}
         <img src={movie.image || 'https://via.placeholder.com/300x450/1f2937/ffffff?text=Movie+Poster'} 
              alt={movie.title} 
              className="w-full h-full object-cover" 
         />
      </div>
      
      {/* Thông tin */}
      <div className="p-4">
        <h3 className="text-white text-md font-semibold truncate" title={movie.title}>
          {movie.title || 'Movie Title Placeholder'}
        </h3>
        
        <div className="flex justify-between items-center mt-2">
          {/* Xếp hạng */}
          <span className="text-sm text-yellow-400 flex items-center">
            ⭐ {movie.rating || 4.5}
          </span>
          
          {/* Giá tiền */}
          <span className="text-xl font-bold text-rose-500">
            ${movie.price || 29}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;