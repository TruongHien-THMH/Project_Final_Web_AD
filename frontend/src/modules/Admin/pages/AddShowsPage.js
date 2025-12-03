import React, { useState, useEffect } from 'react';
import MovieSelectionCard from '../components/MovieSelectionCard';
import axios from 'axios';
import API from '../../../api/User/api.client';

const AddShowsPage = () => {
  const [selectedDateTime, setSelectedDateTime] = useState('2025-06-20 15:30');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [cinemaHall, setCinemaHall] = useState(1);
  const [movieBuffer, setMovieBuffer] = useState([]);
  const [loading, setLoading] = useState(false);

  // Tìm thông tin phim được chọn
  const selectedMovieInfo = selectedMovie 
    ? movieBuffer.find(m => m._id === selectedMovie) 
    : null;

  useEffect(() => {
    const getDataMovie = async () => {
      try {
        setLoading(true);
        const res = await API.get("/");
        const data = res.data;
        console.log("Data movies from API: ", data);
        setMovieBuffer(data);
        
        // Auto select first movie
        if (data.length > 0) {
          setSelectedMovie(data[0]._id);
        }
      } catch (error) {
        console.log('Error when use getDataMovie: ', error);
        alert('Failed to load movies');
      } finally {
        setLoading(false);
      }
    }

    getDataMovie();
  }, []);

  const handleAddShow = async () => {
    // Validation (đã bỏ kiểm tra giá tiền)
    if (!selectedMovie) {
      alert("Please select a movie!");
      return;
    }
    if (!selectedDateTime) {
      alert("Please select date and time!");
      return;
    }

    try {
      // Parse datetime thành showDate và showTime
      const [date, time] = selectedDateTime.split(' ');
      
      const response = await axios.post("http://localhost:5001/shows", {
        movieId: selectedMovie,
        price: 0, // Đặt giá mặc định là 0 vì đã có giá ghế
        showTime: time,
        showDate: date,
        cinemaHall: parseInt(cinemaHall)
      });

      alert("Show added successfully!");
      console.log("Show created:", response.data);

      // Reset form (giữ selected movie)
      setSelectedDateTime('2025-06-20 15:30');
      setCinemaHall(1);

    } catch (error) {
      console.error("Error adding show:", error);
      alert("Failed to add show: " + (error.response?.data?.message || error.message));
    }
  };

  if (loading) {
    return (
      <div className="text-white p-6">
        <h1 className="text-3xl font-bold mb-6 text-rose-500">Add Shows</h1>
        <div className="text-gray-300">Loading movies...</div>
      </div>
    );
  }

  return (
    <div className="text-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-rose-500">Add Shows</h1>

      {/* 1. Chọn Phim */}
      <h2 className="text-2xl font-semibold mb-4 text-gray-300">Now Playing Movies</h2>
      
      {movieBuffer.length === 0 ? (
        <div className="text-gray-400 mb-6">No movies available. Please add movies first.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mb-10">
          {movieBuffer.map((movie) => (
            <MovieSelectionCard
              key={movie._id}
              movie={movie}
              isSelected={movie._id === selectedMovie}
              onToggle={() => setSelectedMovie(movie._id)}
            />
          ))}
        </div>
      )}

      {/* 2. Chi tiết suất chiếu */}
      <div className="bg-gray-800 p-6 rounded-xl shadow-2xl max-w-lg">
        <div className="mb-4">
          <span className="text-gray-300 font-medium">Selected Movie: </span>
          <span className="text-rose-400 ml-2">
            {selectedMovieInfo ? String(selectedMovieInfo.title || selectedMovieInfo.name || 'Unknown Movie') : 'None'}
          </span>
        </div>

        {/* ĐÃ XÓA PHẦN NHẬP GIÁ TIỀN */}

        <label className="block mb-4">
          <span className="text-gray-300 font-medium">Cinema Hall</span>
          <select
            value={cinemaHall}
            onChange={(e) => setCinemaHall(e.target.value)}
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:border-rose-500 focus:ring-rose-500"
          >
            <option value={1}>Hall 1</option>
            <option value={2}>Hall 2</option>
            <option value={3}>Hall 3</option>
            <option value={4}>Hall 4</option>
          </select>
        </label>

        <label className="block mb-6">
          <span className="text-gray-300 font-medium">Select Date and Time</span>
          <input
            type="datetime-local"
            placeholder="YYYY-MM-DD HH:MM"
            value={selectedDateTime}
            onChange={(e) => setSelectedDateTime(e.target.value)}
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white placeholder-gray-400 focus:border-rose-500 focus:ring-rose-500"
          />
          <p className="text-sm text-gray-400 mt-1">Format: YYYY-MM-DD HH:MM (e.g., 2025-06-20 15:30)</p>
        </label>

        {/* Thêm thông báo về giá vé */}
        <div className="mb-4 p-3 bg-gray-700 rounded-lg">
          <p className="text-rose-400 text-sm">💺 <strong>Ticket pricing:</strong> Already configured in seat system</p>
        </div>

        <button
          onClick={handleAddShow}
          disabled={!selectedMovie}
          className={`w-full text-lg font-semibold py-2 rounded-lg shadow-lg transition ${
            selectedMovie 
              ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-900/50' 
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
        >
          {selectedMovie ? 'Add Show' : 'Select a Movie First'}
        </button>
      </div>
    </div>
  );
};

export default AddShowsPage;