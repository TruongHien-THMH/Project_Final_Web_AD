import React from 'react';
import { SEAT_TYPES } from './constants';
import { formatPrice } from './utils';

const PricingLegend = () => {
  return (
    <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-4 text-white">Pricing</h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-amber-600 rounded"></div>
            <span className="text-sm text-gray-300">VIP</span>
          </div>
          <span className="text-white font-semibold">{formatPrice(SEAT_TYPES.VIP.price)}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-rose-600 rounded"></div>
            <span className="text-sm text-gray-300">Standard</span>
          </div>
          <span className="text-white font-semibold">{formatPrice(SEAT_TYPES.STANDARD.price)}</span>
        </div>
      </div>
    </div>
  );
};

export default PricingLegend;