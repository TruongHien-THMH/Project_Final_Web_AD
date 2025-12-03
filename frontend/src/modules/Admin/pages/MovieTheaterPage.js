import React, { useState, useEffect } from 'react';
import TheaterForm from '../ui/TheaterForm'
import TheaterListWidget from '../ui/TheaterListWidget'
import RoomStatus from '../ui/RoomStatus'
import API_ADMIN_MOVIE_THEATER from '../../../api/Admin/api.admin.movie.theater'


export default function MovieTheaterPage() {
  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTheaters = async () => {
    setLoading(true);
    try {
      const res = await API_ADMIN_MOVIE_THEATER.get('/');
      setTheaters(res.data);
    } catch (error) {
      console.error("Load failed", error);
      // Fallback data
      setTimeout(() => { // Giả lập delay mạng để test skeleton
         setTheaters([]); // Để test Empty State thì để mảng rỗng, test data thì điền vào
      }, 1000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTheaters();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-6 pb-20">
      
      {/* Header Responsive */}
      <header className="mb-8 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-rose-500 mb-2">Theater Manager</h1>
          <p className="text-gray-400 text-sm md:text-base">Manage infrastructure, rooms, and layouts.</p>
        </div>
        <div className="text-left md:text-right bg-gray-800 md:bg-transparent p-3 md:p-0 rounded-xl">
           <p className="text-xl md:text-2xl font-bold text-white">12:30 PM</p>
           <p className="text-gray-500 text-sm">Monday, 27 Nov 2025</p>
        </div>
      </header>

      {/* Grid Layout: Mobile 1 cột, Desktop 12 cột */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Mobile: Form nằm trên, Desktop: Form chiếm 7 phần trái */}
        <div className="lg:col-span-7 h-full">
          <TheaterForm onCreated={fetchTheaters} />
        </div>

        {/* Mobile: List nằm dưới Form, Desktop: List chiếm 5 phần phải */}
        <div className="lg:col-span-5 h-full">
          <TheaterListWidget theaters={theaters.data} loading={loading} />
        </div>

        {/* Live Status: Luôn chiếm full chiều ngang grid cha */}
        <div className="lg:col-span-12 mt-4">
          <RoomStatus theaters={theaters.data} loading={loading} />
        </div>

      </div>
    </div>
  );
}
