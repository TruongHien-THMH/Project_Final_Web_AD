// src/admin/pages/AddShowsPage.js
import React, { useState } from 'react';
import MovieSelectionCard from '../components/MovieSelectionCard';
import axios from "axios";

const AddShowsPage = () => {
  const [showPrice, setShowPrice] = useState('');
  const [selectedDateTime, setSelectedDateTime] = useState('2025-06-20 15:23');
  const [selectedMovie, setSelectedMovie] = useState(1); // ID của phim được chọn

  const movies = [
    { id: 1, title: 'Mission Impossible', rating: 4.5, votes: '40.6K Votes', genres: 'Action, Adventure, Thriller' },
    { id: 2, title: 'Mission Impossible', rating: 4.5, votes: '40.6K Votes', genres: 'Action, Adventure, Thriller' },
    { id: 3, title: 'Mission Impossible', rating: 4.5, votes: '40.6K Votes', genres: 'Action, Adventure, Thriller' },
    { id: 4, title: 'Mission Impossible', rating: 4.5, votes: '40.6K Votes', genres: 'Action, Adventure, Thriller' },
  ];

  const handleAddShow = async () => {
    try {
      const response = await axios.post("http://localhost:3001/shows/add", {
        movieId: selectedMovie,
        price: showPrice,
        datetime: selectedDateTime,
      });

      alert("Show added successfully!");
      console.log(response.data);

    } catch (error) {
      console.error(error);
      alert("Failed to add show");
    }
  };

  return (
    <div className="text-white">
      <h1 className="text-3xl font-bold mb-6 text-rose-500">Add Shows</h1>

      {/* 1. Chọn Phim */}
      <h2 className="text-2xl font-semibold mb-4 text-gray-300">Now Playing Movies</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mb-10">
        {movies.map((movie) => (
          <MovieSelectionCard
            key={movie.id}
            movie={movie}
            isSelected={movie.id === selectedMovie}
            onToggle={() => setSelectedMovie(movie.id)}
          />
        ))}
      </div>

      {/* 2. Chi tiết suất chiếu */}
      <div className="bg-gray-800 p-6 rounded-xl shadow-2xl max-w-lg">
        <label className="block mb-4">
          <span className="text-gray-300 font-medium">Show Price</span>
          <div className="relative mt-1">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">$</span>
            <input
              type="number"
              placeholder="Enter show price"
              value={showPrice}
              onChange={(e) => setShowPrice(e.target.value)}
              className="mt-1 block w-full bg-gray-700 border-transparent rounded-lg py-2 pl-8 pr-3 text-white placeholder-gray-400 focus:border-rose-500 focus:ring-rose-500"
            />
          </div>
        </label>

        <label className="block mb-4">
          <span className="text-gray-300 font-medium">Select Date and Time</span>
          <div className="flex space-x-3 mt-1">
            <input
              type="text"
              placeholder="dd-mm-yyyy --:--"
              className="block w-full bg-gray-700 border-transparent rounded-lg py-2 px-3 text-white placeholder-gray-400 focus:border-rose-500 focus:ring-rose-500"
            />
            <button className="bg-rose-600 hover:bg-rose-700 transition text-white px-4 py-2 rounded-lg font-medium whitespace-nowrap">
              Add Time
            </button>
          </div>
        </label>

        {/* Thời gian đã chọn */}
        <div className="flex items-center space-x-2 mb-6">
          <span className="inline-flex items-center px-3 py-1 text-sm font-medium bg-rose-500 text-white rounded-full">
            {selectedDateTime}
            <button
              onClick={() => setSelectedDateTime('')}
              className="ml-2 text-white hover:text-gray-200 transition"
            >
              &times;
            </button>
          </span>
        </div>

        <button
          onClick={handleAddShow}
          className="w-full bg-rose-600 hover:bg-rose-700 transition text-white text-lg font-semibold py-2 rounded-lg shadow-lg shadow-rose-900/50"
        >
          Add Show
        </button>
      </div>
    </div>
  );
};

export default AddShowsPage;
