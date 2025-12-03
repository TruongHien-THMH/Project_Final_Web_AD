
import React, { useState, useEffect } from 'react';
import API_ADMIN_SCHEDULES from '../../../api/Admin/api.admin.schedule';
import API_ADMIN_MOVIE_THEATER from '../../../api/Admin/api.admin.movie.theater';
import API from '../../../api/User/api.client';

import CustomMultiSelect from '../ui/CustomMultiSelect';
import DateRangePicker from '../ui/DateRangePicker';
import ScheduleInforBox from '../ui/ScheduleInforBox';



const SchedulePage = () => {

  const [moviesData, setMoviesData] = useState([]);      
  const [theatersData, setTheatersData] = useState([]);        
  
  const [selectedMovies, setSelectedMovies] = useState([]); 
  const [selectedTheaters, setSelectedTheaters] = useState([]);   
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resMovies, resTheaters] = await Promise.all([
          API.get('/'),      
          API_ADMIN_MOVIE_THEATER.get('/') 
        ]);

        console.log("Dữ liệu của Movies: ", resMovies);
        console.log("Dữ liệu của Theaters: ", resTheaters)

        setMoviesData(resMovies.data.map(m => ({ value: m._id, label: m.title })));
        setTheatersData(resTheaters.data.data.map(h => ({ value: h._id, label: h.name })));

        // const movieList = await resMovies.data;
        // const theatersList = await resTheaters.data;

      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
        // Fallback data for testing UI
        setMoviesData([{ value: '1', label: 'Test Movie' }]);
        setTheatersData([{ value: '1', label: 'Test Hall' }]);
      }
    };
    fetchData();
  }, []);

  console.log("Demo dữ liệu: ", theatersData);

  // --- HANDLER ---
  const handleGenerate = async () => {
    // 1. Validation Logic
    if (selectedMovies.length === 0) return alert("Please select movies!");
    if (selectedTheaters.length === 0) return alert("Please select halls!");
    if (!fromDate || !toDate) return alert("Please select date range!");
    if (new Date(fromDate) > new Date(toDate)) return alert("Start Date > End Date!");

    try {
      setLoading(true);

      // 2. API Call Logic
      const payload = {
        movieIds: selectedMovies.map(item => item.value),
        theaterIds: selectedTheaters.map(item => item.value),
        fromDate,
        toDate
      };

      const response = await API_ADMIN_SCHEDULES.post("/auto-generate", payload);
      alert(`✅ Success! Generated ${response.data.data.length} showtimes.`);

    } catch (error) {
      if (error.response && error.response.status === 409) {
        alert(`⚠️ Conflict: ${error.response.data.message}`);
      } else {
        alert("❌ Failed: " + (error.response?.data?.message || error.message));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 pb-20">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-rose-500 mb-2">Auto Scheduler ✨</h1>
        <p className="text-gray-400">Generate showtimes based on runtime & rotation.</p>
      </header>

      <div className="max-w-4xl mx-auto bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700">
        
        {/* Component 1: Chọn Phim */}
        <CustomMultiSelect 
          label="Select Movies (Movies to rotate)"
          placeholder="Search and select movies..."
          options={moviesData}
          value={selectedMovies}
          onChange={setSelectedMovies}
        />

        {/* Component 2: Chọn Rạp */}
        <CustomMultiSelect 
          label="Select Halls (Where to show)"
          placeholder="Select cinema halls..."
          options={theatersData}
          value={selectedTheaters}
          onChange={setSelectedTheaters}
        />

        {/* Component 3: Chọn Ngày */}
        <DateRangePicker 
          fromDate={fromDate} setFromDate={setFromDate}
          toDate={toDate} setToDate={setToDate}
        />

        {/* Component 4: Hướng dẫn */}
        <ScheduleInforBox />

        {/* Button Submit (Có thể tách thành Component riêng nếu muốn dùng nhiều nơi) */}
        <button
          onClick={handleGenerate}
          disabled={loading}
          className={`w-full text-lg font-bold py-4 rounded-xl shadow-lg transition-all flex justify-center items-center gap-2 ${
            loading
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 shadow-rose-900/40'
          }`}
        >
          {loading ? 'Generating...' : '🚀 Generate Schedules'}
        </button>

      </div>
    </div>
  );
};

export default SchedulePage;