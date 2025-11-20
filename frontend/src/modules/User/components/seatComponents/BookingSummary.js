import React from 'react';
import { formatPrice } from './utils';

const BookingSummary = ({ bookingInfo }) => {
  if (bookingInfo.count === 0) return null;

  return (
    <div className="bg-rose-600/10 border border-rose-600/30 backdrop-blur-sm p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-3 text-white">Your Selection</h3>
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-300">Seats:</span>
          <span className="text-white font-medium">
            {bookingInfo.selected.map(s => s.seatId).join(', ')}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-300">Quantity:</span>
          <span className="text-white font-medium">{bookingInfo.count} seat(s)</span>
        </div>
      </div>
      <div className="border-t border-rose-600/30 pt-3">
        <div className="flex justify-between">
          <span className="text-white font-semibold">Total:</span>
          <span className="text-rose-400 font-bold text-lg">
            {formatPrice(bookingInfo.totalPrice)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BookingSummary;