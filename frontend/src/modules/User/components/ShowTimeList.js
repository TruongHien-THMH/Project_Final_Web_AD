import React, { useState, useEffect, useMemo } from "react";

const dates = [
  { label: "Tue", day: 15 },
  { label: "Wed", day: 16 },
  { label: "Thu", day: 17 },
  { label: "Fri", day: 18 },
  { label: "Sat", day: 19 },
  { label: "Sun", day: 20 },
];

const theaters = [
  {
    id: 1,
    name: "Thearter 1",
    address: "Thearter 1 Nguyễn Hữu Thọ",
    avatar: "https://i.pravatar.cc/150?img=12",
    times: ["9:30 AM", "11:00 AM", "15:20 PM", "21:40 PM", "22:00 PM"],
  },
  {
    id: 2,
    name: "Thearter 2",
    address: "Thearter 2 Nguyễn Văn Linh",
    avatar: "https://i.pravatar.cc/150?img=5",
    times: ["9:30 AM", "11:00 AM", "15:20 PM", "21:40 PM", "22:00 PM"],
  },
];


const ShowtimeList = ({ data = [] }) => {
  const [selectedDate, setSelectedDate] = useState('');

  const [selectedTimeId, setSelectedTimeId] = useState(null);

  const [selectedTimes, setSelectedTimes] = useState({}); // { theaterId: "11:00 AM" }

  const schedulesByDate = useMemo(() => {
    const grouped = {}; 

    data.forEach ( (schedule) => {
      if( !schedule.time_start) return;

      const dateKey = new Date(schedule.time_start).toISOString().split('T')[0]; // Str
      // Tạo 1 Mảng mới với Giá trị duy nhất sẽ là phần tử thứ 0 khi kí tự này bị thành 1 mảng bởi Hàm Split
      /**
       * ví dụ: 
       * const ArrStr = [
            "Hello world",
            "Xin chào",
            "Ni Hào"
        ];

        ArrStr.forEach((world) => (
            console.log(world.split(' ')[1])
        ))
          output là: world - chào - Hào.
       * 
       */
      // Kiểm tra key đã có giá trị chưa
      if (!grouped[dateKey]) { // Nếu chưa, gán trí mảng rỗng tại key đó !!!
        grouped[dateKey] = []; 
      }
      // Đẩy các giá trị vào mảng của Key.
      grouped[dateKey].push(schedule);
    } )

    return grouped;
  }, [data]) // Hàm này sẽ chạy khi data thay đổi.
  
  // Lấy Obj các ngày thành mảng.
  const availableDates = Object.keys(schedulesByDate).sort(); 

  useEffect(() => {
    if(availableDates.length > 0 && !selectedDate ){
      setSelectedDate(availableDates[0]);
    }
  }, [availableDates, selectedDate])

  const theatersForDate = useMemo ( () => {
    // Nếu ngày đó không có ngày hoặc chưa có lịch thì trả về rỗng.
    if (!selectedDate || !schedulesByDate[selectedDate]) return [];

    const currentSchedules = schedulesByDate[selectedDate];
    const theatersMap = new Map();

    currentSchedules.forEach((schedule) => {
      // Check trong BE đã Xử lý populate -- Link Model chưa
      const room = schedule.roomId || {};
      const theater = room.movie_theater_id || {};    
      
      const theaterId = theater._id || "unknown_id";
      const theaterName = theater.name || "Unknown Theater"; 
      const theaterAddress = theater.address || "Đang cập nhật địa chỉ";

      if (!theatersMap.has(theaterId)) {
        theatersMap.set(theaterId, {
          id: theaterId,
          name: theaterName,
          address: theaterAddress,
          avatar: "https://ui-avatars.com/api/?name=" + theaterName, // Tạo avatar chữ cái đầu
          showtimes: [] // Mảng chứa các giờ chiếu
        });
      }

      const timeDate = new Date(schedule.time_start);
      const timeString = timeDate.toLocaleTimeString('en-US', { 
          hour: '2-digit', minute: '2-digit', hour12: true 
      });

      theatersMap.get(theaterId).showtimes.push({
        id: schedule._id,
        time: timeString
      });
    })

    return Array.from(theatersMap.values());

  }, [selectedDate, schedulesByDate] );

  const formatDateLabel = (dateString) => {
    const date = new Date(dateString);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' }); // Tue, Wed
    const dayNum = date.getDate(); // 15, 16
    return { dayName, dayNum };
  };
  const handleSelectTime = (theaterId, time) => {
    setSelectedTimes((prev) => ({
      ...prev,
      [theaterId]: time,
    }));
  };

  return (
    <section className="bg-[#0d0d0d] text-white px-6 py-10 md:px-20 w-full">

      {/* TIÊU ĐỀ NGÀY */}
      <div className="bg-gradient-to-br from-[#4a0a15] to-[#2d0a10] p-6 rounded-xl mb-10 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Choose Date</h2>
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

            {/* Danh sách giờ chiếu */}
            <div className="flex gap-4 flex-wrap">
              {t.showtimes.map((show) => (
                <button
                  key={show.id}
                  onClick={() => setSelectedTimeId(show.id)}
                  className={`px-6 py-3 rounded-lg border text-sm transition font-medium
                  ${
                    selectedTimeId === show.id
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

        {theatersForDate.length === 0 && selectedDate && (
            <p className="text-center text-gray-500 mt-10">No showtimes for this date.</p>
        )}
      </div>
    </section>
  );
};

export default ShowtimeList;