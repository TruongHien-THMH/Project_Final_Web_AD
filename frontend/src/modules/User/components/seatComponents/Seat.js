import React from 'react';
import { SEAT_TYPES, SEAT_STATUS } from './constants';

// ===== SEAT COMPONENT =====
const Seat = ({ seat, seatType, onClick }) => {
  if (!seat) return <div className="w-6 h-6 md:w-8 md:h-8 m-1" />;

  const colorScheme = SEAT_TYPES[seatType].color;
  const baseStyle = "w-6 h-6 md:w-8 md:h-8 border-2 rounded-md m-1 transition duration-150";

  // Ánh xạ style tĩnh để Tailwind Purge CSS nhận diện
  const selectedStyles = {
    amber: 'bg-amber-600 border-amber-600 shadow-lg shadow-amber-500/50',
    rose: 'bg-rose-600 border-rose-600 shadow-lg shadow-rose-500/50'
  };
  
  const availableStyles = {
    amber: 'border-amber-600/50 hover:bg-amber-600/30',
    rose: 'border-rose-600/50 hover:bg-rose-600/30'
  };

  const statusStyles = {
    [SEAT_STATUS.BOOKED]: "bg-gray-600 border-gray-600 cursor-not-allowed",
    [SEAT_STATUS.SELECTED]: selectedStyles[colorScheme],
    [SEAT_STATUS.AVAILABLE]: availableStyles[colorScheme]
  };

  return (
    <div 
      className={`${baseStyle} ${statusStyles[seat.status]}`}
      onClick={onClick}
      title={`${seat.seatId} - ${SEAT_TYPES[seatType].label} - ${seat.status}`}
    />
  );
};

export default Seat;