import React, { useState } from "react";

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

const ShowtimeList = () => {
  const [selectedDate, setSelectedDate] = useState(16);
  const [selectedTimes, setSelectedTimes] = useState({}); // { theaterId: "11:00 AM" }

  const handleSelectTime = (theaterId, time) => {
    setSelectedTimes((prev) => ({
      ...prev,
      [theaterId]: time,
    }));
  };

  return (
    <section className="bg-[#0d0d0d] text-white px-6 py-10 md:px-20 w-full">

      {/* Date selector */}
      <div className="bg-gradient-to-br from-[#4a0a15] to-[#2d0a10] p-6 rounded-xl mb-10 flex justify-between items-center">
        <h2 class="text-xl font-semibold">Choose Date</h2>
        <button class="text-sm text-gray-200 hover:text-white transition">Book Now</button>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-6">
        {dates.map((d) => (
          <button
            key={d.day}
            onClick={() => setSelectedDate(d.day)}
            className={`px-6 py-3 rounded-lg border transition 
              ${selectedDate === d.day
                ? "bg-[#ff5874] text-white border-transparent"
                : "border-[#ff587480] text-gray-300 hover:bg-[#ff587420]"
              }`}
          >
            <div className="text-sm">{d.label}</div>
            <div className="text-lg font-semibold">{d.day}</div>
          </button>
        ))}
      </div>

      {/* Theater list */}
      <div className="space-y-10 mt-5">
        {theaters.map((t) => (
          <div
            key={t.id}
            className="bg-gradient-to-b from-[#4a0a15] to-[#2a0a0f] rounded-2xl p-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-[#ff5874] rounded-xl p-4">
              <div className="flex items-center gap-4">
                <img
                  src={t.avatar}
                  alt="Avatar"
                  className="w-14 h-14 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-lg">{t.name}</h3>
                </div>
              </div>

              <button className="text-3xl text-white opacity-80">›</button>
            </div>

            {/* Address */}
            <p className="mt-4 text-gray-300">{t.address}</p>

            {/* Times */}
            <div className="flex gap-4 flex-wrap mt-5">
              {t.times.map((time) => (
                <button
                  key={time}
                  onClick={() => handleSelectTime(t.id, time)}
                  className={`px-6 py-3 rounded-lg border text-sm transition
                  ${
                    selectedTimes[t.id] === time
                      ? "bg-[#ff5874] text-white border-transparent"
                      : "border-[#ff587480] text-gray-300 hover:bg-[#ff587430]"
                  }`}
                >
                  {time}
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