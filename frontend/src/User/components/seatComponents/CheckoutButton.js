import React from 'react';
import { formatPrice } from './utils';

const CheckoutButton = ({ bookingInfo }) => {
  return (
    <button 
      className={`mt-10 px-10 py-3 rounded-full text-lg font-semibold shadow-lg transition duration-200 ${
        bookingInfo.count > 0
          ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/30 text-white'
          : 'bg-gray-600 cursor-not-allowed text-gray-400'
      }`}
      disabled={bookingInfo.count === 0}
    >
      {bookingInfo.count > 0 
        ? `Proceed to checkout (${formatPrice(bookingInfo.totalPrice)})`
        : 'Select seats to continue'
      }
      <i className="ri-arrow-right-line align-middle ml-2"></i>
    </button>
  );
};

export default CheckoutButton;