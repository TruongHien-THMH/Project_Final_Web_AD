// src/admin/components/MovieSelectionCard.js

import React from 'react';

  

const MovieSelectionCard = ({ movie, isSelected, onToggle }) => {

  

  console.log(movie);

  

  return (

    <div

      className={`relative w-full rounded-lg overflow-hidden shadow-xl cursor-pointer transition duration-300

                  ${isSelected ? 'ring-4 ring-rose-600 scale-[1.02]' : 'ring-2 ring-gray-700 hover:ring-rose-500'}`}

      onClick={onToggle}

    >

      {/* Poster và Overlay */}

      <div className="h-80 bg-cover bg-center"

           style={{ backgroundImage: `url(${process.env.REACT_APP_IMAGES/movie.poster_path || 'https://via.placeholder.com/300x450/1f2937/ffffff?text=Mission+Impossible'})` }}

      >

        {/* Lớp phủ tối hơn */}

        <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col justify-end p-4">

          {/* Checkbox ở góc trên bên phải */}

          <input

            type="checkbox"

            checked={isSelected}

            onChange={onToggle}

            className="absolute top-3 right-3 h-5 w-5 rounded border-gray-300 text-rose-600 focus:ring-rose-500 bg-white"

          />

  

          {/* Thông tin phim */}

          <div className="text-white">

            <h3 className="text-xl font-bold mt-2">{movie.title}</h3>

            <p className="text-xs text-gray-300">{movie.genres}</p>

            <div className="mt-1 text-sm flex items-center space-x-3">

               <span className="text-yellow-400">⭐ {movie.rating}</span>

               <span className="text-gray-400">| {movie.votes}</span>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

};

  

export default MovieSelectionCard;