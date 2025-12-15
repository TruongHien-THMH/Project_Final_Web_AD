import React, { useState, useEffect, useMemo } from "react";

import { useNavigate } from "react-router-dom";

const ShowtimeList = ({ movieId, movie, data = [] }) => {
  const navigate = useNavigate()

  const [selectedDate, setSelectedDate] = useState('');

  const [selectedTimeId, setSelectedTimeId] = useState(null);

  const [selectedSchedule, setSelectedSchedule] = useState(null);

  const schedulesByDate = useMemo(() => {
    const grouped = {}; 
    data.forEach((schedule) => {
      if (!schedule.time_start) return;
      const dateKey = new Date(schedule.time_start).toISOString().split('T')[0];
      if (!grouped[dateKey]) { 
        grouped[dateKey] = []; 
      }
      grouped[dateKey].push(schedule);
    });
    return grouped;
  }, [data]); // Hàm này sẽ chạy khi data thay đổi.

  const availableDates = Object.keys(schedulesByDate).sort(); 

  useEffect(() => {
    if(availableDates.length > 0 && !selectedDate ){
      setSelectedDate(availableDates[0]);
    }
  }, [availableDates, selectedDate])

  const theatersForDate = useMemo(() => {
    if (!selectedDate || !schedulesByDate[selectedDate]) return [];

    const currentSchedules = schedulesByDate[selectedDate];
    const theatersMap = new Map();

    currentSchedules.forEach((schedule) => {
      // Check data structure from Backend
      const room = schedule.roomId || {};
      const theater = room.movie_theater_id || {};    
      
      const theaterId = theater._id || "unknown_id";
      const theaterName = theater.name || "Unknown Theater"; 
      const theaterAddress = theater.address || "Address updating...";

      if (!theatersMap.has(theaterId)) {
        theatersMap.set(theaterId, {
          id: theaterId,
          name: theaterName,
          address: theaterAddress,
          avatar: "https://ui-avatars.com/api/?name=" + theaterName,
          showtimes: [] 
        });
      }

      const timeDate = new Date(schedule.time_start);
      const timeString = timeDate.toLocaleTimeString('en-US', { 
          hour: '2-digit', minute: '2-digit', hour12: true 
      });
      
      theatersMap.get(theaterId).showtimes.push({
        id: schedule._id, 
        time: timeString,
        fullDate: schedule.time_start,
        roomId: room 
      });
    });

    return Array.from(theatersMap.values());
  }, [selectedDate, schedulesByDate]);

  const formatDateLabel = (dateString) => {
    const date = new Date(dateString);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' }); // Tue, Wed
    const dayNum = date.getDate(); // 15, 16
    return { dayName, dayNum };
  };

  const handleBookTicket = () => {
    if (!selectedSchedule) return;
    // Chuyển hướng sang trang chọn ghế (Giả sử đường dẫn là /booking/:scheduleId)
    // Đồng thời gửi kèm dữ liệu qua 'state' để trang kia không cần fetch lại
    navigate(`/booking/${selectedSchedule.id}`, { // Check lại có nhận đươc ID không nếu lỗi.
      state: {
        movieInfo: {
            id: movieId,
            title: movie?.title,
            poster: movie?.poster_path
        },
        scheduleInfo: {
            id: selectedSchedule.id,
            date: selectedDate,
            time: selectedSchedule.time,
            theaterName: selectedSchedule.theaterName,
            theaterAddress: selectedSchedule.theaterAddress,
            roomId: selectedSchedule.roomId 
        }
      }
    });
  };

  return (
    <section className="bg-[#0d0d0d] text-white px-6 py-10 md:px-20 w-full">

      {/* --- HEADER DATE SELECTOR --- */}
      <div className="bg-gradient-to-br from-[#4a0a15] to-[#2d0a10] p-6 rounded-xl mb-10 flex flex-col md:flex-row justify-between items-center gap-4 sticky top-0 z-10 shadow-xl">
        <h2 className="text-xl font-semibold">Choose Date</h2>
        
        {/* NÚT BOOK NOW (SÁNG LÊN KHI CHỌN GIỜ) */}
        <button 
          onClick={handleBookTicket}
          disabled={!selectedSchedule} // Disable nếu chưa chọn giờ
          className={`px-8 py-3 rounded-full font-bold transition-all duration-300 transform
            ${selectedSchedule 
              ? "bg-[#ff5874] text-white shadow-lg shadow-rose-600/50 scale-105 hover:scale-110 cursor-pointer" 
              : "bg-gray-700 text-gray-400 cursor-not-allowed opacity-50"
            }`}
        >
          {selectedSchedule ? "Book Now 🎟" : "Select a time"}
        </button>
      </div>

      {/* DANH SÁCH NGÀY (Thanh cuộn ngang) */}
      <div className="flex gap-3 overflow-x-auto pb-6 custom-scrollbar">
        {availableDates.length === 0 ? (
           <p className="text-gray-500 italic">No schedules available.</p>
        ) : (
          availableDates.map((dateStr) => {
            const { dayName, dayNum } = formatDateLabel(dateStr);
            const isSelected = selectedDate === dateStr;

            return (
              <button
                key={dateStr}
                onClick={() => setSelectedDate(dateStr)}
                className={`px-6 py-3 rounded-lg border transition min-w-[80px] flex flex-col items-center
                  ${isSelected
                    ? "bg-[#ff5874] text-white border-transparent"
                    : "border-[#ff587480] text-gray-300 hover:bg-[#ff587420]"
                  }`}
              >
                <div className="text-sm opacity-80">{dayName}</div>
                <div className="text-lg font-semibold">{dayNum}</div>
              </button>
            );
          })
        )}
      </div>

      {/* DANH SÁCH RẠP & GIỜ CHIẾU */}
      <div className="space-y-10 mt-5">
        {theatersForDate.map((t) => (
          <div
            key={t.id}
            className="bg-gradient-to-b from-[#4a0a15] to-[#2a0a0f] rounded-2xl p-6 border border-[#ff587420]"
          >
            {/* Header thông tin Rạp */}
            <div className="flex items-center gap-4 mb-4 bg-[#ff5874]/10 rounded-xl p-4 border border-[#ff5874]/30">
                <img
                  src={t.avatar}
                  alt="Avatar"
                  className="w-14 h-14 rounded-full object-cover border-2 border-[#ff5874]"
                />
                <div>
                  <h3 className="font-semibold text-lg text-white">{t.name}</h3>
                  <p className="text-sm text-gray-400">{t.address}</p>
                </div>
            </div>

            {/* DANH SÁCH GIỜ CHIẾU */}
            <div className="flex gap-4 flex-wrap mt-5">
              {t.showtimes.map((show) => (
                <button
                  key={show.id}
                  onClick={() => {
                    // Lưu lại thông tin suất chiếu đang chọn + Thông tin rạp kèm theo
                    setSelectedSchedule({
                        ...show, 
                        theaterName: t.name,
                        theaterAddress: t.address
                    });
                  }}
                  className={`px-6 py-3 rounded-lg border text-sm transition font-medium
                  ${
                    selectedSchedule?.id === show.id
                      ? "bg-[#ff5874] text-white border-transparent shadow-lg shadow-rose-900/50 scale-105"
                      : "border-[#ff587480] text-gray-300 hover:bg-[#ff587430]"
                  }`}
                >
                  {show.time}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ShowtimeList;