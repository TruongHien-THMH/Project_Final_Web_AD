import React, { useState, useEffect } from 'react';
import MovieSelectionCard from '../components/MovieSelectionCard';
import axios from 'axios';
import API from '../../../api/User/api.client';

const AddShowsPage = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('10:30');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [cinemaHall, setCinemaHall] = useState(1);
  const [movieBuffer, setMovieBuffer] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const selectedMovieInfo = selectedMovie 
    ? movieBuffer.find(m => m._id === selectedMovie) 
    : null;

  useEffect(() => {
    const getDataMovie = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5001/api/admin/movie");
        const data = res.data;
        console.log("Data movies from API: ", data);
        setMovieBuffer(data);
        
        if (data.length > 0) {
          setSelectedMovie(data[0]._id);
        }

        const today = new Date().toISOString().split('T')[0];
        setSelectedDate(today);
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
    // Validation chi tiết hơn
    if (!selectedMovie) {
      alert("Please select a movie!");
      return;
    }
    if (!selectedDate) {
      alert("Please select date!");
      return;
    }
    if (!selectedTime) {
      alert("Please select time!");
      return;
    }

    try {
      setSubmitting(true);

      // Định dạng lại date để đảm bảo đúng format YYYY-MM-DD
      const formattedDate = new Date(selectedDate).toISOString().split('T')[0];
      
      const showData = {
        movieId: selectedMovie,
        price: 0,
        showTime: selectedTime.replace(' AM', '').replace(' PM', ''), // Chỉ lấy "10:30"
        showDate: formattedDate,
        cinemaHall: parseInt(cinemaHall)
      };

      console.log("📤 Sending show data:", showData);
      console.log("🎬 Selected movie ID:", selectedMovie);
      console.log("📅 Date:", formattedDate);
      console.log("⏰ Time:", selectedTime);
      console.log("🎪 Hall:", cinemaHall);

      const response = await axios.post("http://localhost:5001/api/admin/shows", showData);
      console.log("✅ API Response:", response.data);

      if (response.data.success) {
        alert("Show added successfully!");
        console.log("Show created:", response.data);

        // Reset form
        setSelectedTime('10:30');
        setCinemaHall(1);
        
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        setSelectedDate(tomorrow.toISOString().split('T')[0]);
      } else {
        throw new Error(response.data.message || "Failed to add show");
      }

    } catch (error) {
      console.error("❌ Error adding show:", error);
      console.error("🔍 Error response:", error.response?.data);
      
      let errorMessage = "Failed to add show";
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert("Failed to add show: " + errorMessage);
    } finally {
      setSubmitting(false);
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

      <div className="bg-gray-800 p-6 rounded-xl shadow-2xl max-w-lg">
        <div className="mb-4">
          <span className="text-gray-300 font-medium">Selected Movie: </span>
          <span className="text-rose-400 ml-2">
            {selectedMovieInfo ? String(selectedMovieInfo.title || selectedMovieInfo.name || 'Unknown Movie') : 'None'}
          </span>
          <br />
          <span className="text-gray-400 text-sm">Movie ID: {selectedMovie}</span>
        </div>

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

        <label className="block mb-4">
          <span className="text-gray-300 font-medium">Select Date</span>
          <input
            type="text"
            placeholder="YYYY-MM-DD HH:MM"
           
            // onChange={(e) => setSelectedDateTime(e.target.value)}
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white placeholder-gray-400 focus:border-rose-500 focus:ring-rose-500"
          />
          <p className="text-sm text-gray-400 mt-1">Format: YYYY-MM-DD HH:MM (e.g., 2025-06-20 15:30)</p>
        </label>

        <div className="mb-4 p-3 bg-gray-700 rounded-lg">
          <p className="text-rose-400 text-sm">💺 <strong>Ticket pricing:</strong> VIP: $100,000 | Standard: $65,000</p>
          <p className="text-gray-400 text-xs mt-1">Price is automatically configured in the seat system</p>
        </div>

        <button
          onClick={handleAddShow}
          disabled={!selectedMovie || !selectedDate || !selectedTime || submitting}
          className={`w-full text-lg font-semibold py-2 rounded-lg shadow-lg transition ${
            selectedMovie && selectedDate && selectedTime && !submitting
              ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-900/50' 
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
        >
          {submitting ? 'Adding Show...' : 
           selectedMovie && selectedDate && selectedTime ? 'Add Show' : 'Select Movie, Date & Time'}
        </button>
      </div>
    </div>
  );
};

export default AddShowsPage;