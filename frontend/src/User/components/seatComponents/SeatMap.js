import React from 'react';
import Seat from './Seat';
import { SEAT_TYPES } from './constants';

const SeatMap = ({ rows, onSeatClick }) => {
  return (
    <div className="w-full overflow-x-auto p-4">
      <div className="flex flex-col items-center min-w-max space-y-1">
        {rows.map((row, rowIndex) => (
          <div key={row.rowId}>
            {/* Label cho VIP section */}
            {rowIndex === 0 && (
              <div className="text-center mb-3">
                <span className="inline-block bg-amber-600/20 border border-amber-600/50 px-4 py-1 rounded-full text-xs text-amber-400 font-semibold uppercase tracking-wide">
                  <i className="ri-vip-crown-line mr-1"></i>
                  VIP Section
                </span>
              </div>
            )}
            
            {/* Label cho Standard section */}
            {rowIndex === 2 && (
              <div className="text-center mb-3 mt-4">
                <span className="inline-block bg-rose-600/20 border border-rose-600/50 px-4 py-1 rounded-full text-xs text-rose-400 font-semibold uppercase tracking-wide">
                  Standard Section
                </span>
              </div>
            )}

            <div className="flex items-center">
              {/* Row label left */}
              <span className={`w-8 text-sm font-medium text-right mr-2 ${
                row.seatType === SEAT_TYPES.VIP.id ? 'text-amber-400' : 'text-gray-400'
              }`}>
                {row.rowLabel}
              </span>
              
              {/* Seats */}
              <div className="flex">
                {row.seats.map((seat, seatIndex) => (
                  <Seat
                    key={seat ? seat.seatId : `empty-${seatIndex}`}
                    seat={seat}
                    seatType={row.seatType}
                    onClick={() => seat && onSeatClick(row.rowId, seat.seatId)}
                  />
                ))}
              </div>
              
              {/* Row label right */}
              <span className={`w-8 text-sm font-medium ml-2 ${
                row.seatType === SEAT_TYPES.VIP.id ? 'text-amber-400' : 'text-gray-400'
              }`}>
                {row.rowLabel}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SeatMap;