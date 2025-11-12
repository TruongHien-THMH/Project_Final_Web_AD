import React from 'react';

const TimingSelector = ({ timings, selectedTime, onTimeSelect }) => {
  return (
    <div className="sticky top-28 bg-white/5 backdrop-blur-sm p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-4 text-white">
        Available Timings
      </h3>
      <div className="flex flex-col space-y-3">
        {timings.map((time) => (
          <button
            key={time}
            onClick={() => onTimeSelect(time)}
            className={`
              flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition duration-200
              ${selectedTime === time 
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30' 
                : 'bg-black/20 text-gray-300 hover:bg-black/40'
              }
            `}
          >
            <i className="ri-time-line text-xl"></i>
            <span className="font-medium">{time}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TimingSelector;