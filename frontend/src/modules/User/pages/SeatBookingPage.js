import React, { useState, useMemo } from 'react';
import Header from '../components/Header';
import BlurCircle from '../components/BlurCircle';

import { SEAT_TYPES, SEAT_STATUS } from '../components/seatComponents/constants';

import TimingSelector from '../components/seatComponents/TimingSelector';
import PricingLegend from '../components/seatComponents/PricingLegend';
import BookingSummary from '../components/seatComponents/BookingSummary';
import CinemaScreen from '../components/seatComponents/CinemaScreen';
import SeatMap from '../components/seatComponents/SeatMap';
import SeatLegend from '../components/seatComponents/SeatLegend';
import CheckoutButton from '../components/seatComponents/CheckoutButton';


// ===== SEAT CONFIGURATION - Cấu trúc này dễ dàng map với MongoDB =====
// (Giữ nguyên INITIAL_SEAT_CONFIG... của bạn ở đây)
// ... (Tôi sẽ rút gọn phần này để tiết kiệm không gian, 
//      nhưng bạn hãy giữ nguyên nó như trong file gốc)
const INITIAL_SEAT_CONFIG = {
  screeningId: 'screening_001',
  movieTitle: 'Avatar 3',
  showtime: '06:30',
  rows: [
    // VIP rows (2 hàng đầu)
    { 
      rowId: 'A', 
      rowLabel: 'A', 
      seatType: SEAT_TYPES.VIP.id,
      seats: Array(9).fill(null).map((_, i) => ({ 
        seatId: `A${i + 1}`, 
        number: i + 1, 
        status: SEAT_STATUS.AVAILABLE 
      }))
    },
    { 
      rowId: 'B', 
      rowLabel: 'B', 
      seatType: SEAT_TYPES.VIP.id,
      seats: Array(9).fill(null).map((_, i) => ({ 
        seatId: `B${i + 1}`, 
        number: i + 1, 
        status: i === 0 ? SEAT_STATUS.BOOKED : SEAT_STATUS.AVAILABLE 
      }))
    },
    // Standard rows với lối đi ở giữa
    { 
      rowId: 'C', 
      rowLabel: 'C', 
      seatType: SEAT_TYPES.STANDARD.id,
      seats: [
        null, null, // Lối đi bên trái
        ...Array(14).fill(null).map((_, i) => ({ 
          seatId: `C${i + 3}`, 
          number: i + 3, 
          status: (i + 3 === 5 || i + 3 === 6) ? SEAT_STATUS.BOOKED : SEAT_STATUS.AVAILABLE 
        })),
        null, null // Lối đi bên phải
      ]
    },
    { 
      rowId: 'D', 
      rowLabel: 'D', 
      seatType: SEAT_TYPES.STANDARD.id,
      seats: [
        null, null,
        ...Array(14).fill(null).map((_, i) => ({ 
          seatId: `D${i + 3}`, 
          number: i + 3, 
          status: (i + 3 === 1) ? SEAT_STATUS.BOOKED : SEAT_STATUS.AVAILABLE 
        })),
        null, null
      ]
    },
    // Standard rows đầy đủ
    ...['E', 'F', 'G'].map(letter => ({
      rowId: letter,
      rowLabel: letter,
      seatType: SEAT_TYPES.STANDARD.id,
      seats: Array(18).fill(null).map((_, i) => {
        const bookedSeats = letter === 'F' ? [9, 10, 11] : [];
        return { 
          seatId: `${letter}${i + 1}`, 
          number: i + 1, 
          status: bookedSeats.includes(i + 1) ? SEAT_STATUS.BOOKED : SEAT_STATUS.AVAILABLE 
        };
      })
    }))
  ]
};

// ===== MAIN COMPONENT =====
const SeatBookingPage = () => {
  const [seatConfig, setSeatConfig] = useState(INITIAL_SEAT_CONFIG);
  const [selectedTime, setSelectedTime] = useState('06:30');
  
  const timings = ['06:30', '09:30', '12:00', '04:30', '08:00'];

  // Tính toán thông tin đặt chỗ
  const bookingInfo = useMemo(() => {
    const selected = [];
    
    seatConfig.rows.forEach(row => {
      row.seats.forEach(seat => {
        if (seat && seat.status === SEAT_STATUS.SELECTED) {
          selected.push({
            seatId: seat.seatId,
            seatType: row.seatType,
            price: SEAT_TYPES[row.seatType].price
          });
        }
      });
    });

    const totalPrice = selected.reduce((sum, s) => sum + s.price, 0);
    
    return { selected, totalPrice, count: selected.length };
  }, [seatConfig]);

  // Handler cho việc chọn ghế
  const handleSeatClick = (rowId, seatId) => {
    setSeatConfig(prev => ({
      ...prev,
      rows: prev.rows.map(row => {
        if (row.rowId !== rowId) return row;
        
        return {
          ...row,
          seats: row.seats.map(seat => {
            if (!seat || seat.seatId !== seatId) return seat;
            if (seat.status === SEAT_STATUS.BOOKED) return seat;
            
            return {
              ...seat,
              status: seat.status === SEAT_STATUS.SELECTED 
                ? SEAT_STATUS.AVAILABLE 
                : SEAT_STATUS.SELECTED
            };
          })
        };
      })
    }));
  };

  // Hàm formatPrice đã được chuyển sang utils.js và 
  // được các component con (BookingSummary, PricingLegend, CheckoutButton)
  // tự import và sử dụng.

  return (
    <div className="relative min-h-screen bg-black text-white overflow-x-hidden">
      <Header />
      <BlurCircle top="10%" left="5%" />
      <BlurCircle bottom="10%" right="5%" />

      <main className="container mx-auto px-4 pt-32 pb-16">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* ===== SIDEBAR: GIỜ CHIẾU & THÔNG TIN ===== */}
          <div className="w-full lg:w-1/4 space-y-6">
            
            <TimingSelector 
              timings={timings}
              selectedTime={selectedTime}
              onTimeSelect={setSelectedTime}
            />

            <PricingLegend />

            <BookingSummary bookingInfo={bookingInfo} />
            
          </div>

          {/* ===== CHỌN GHẾ ===== */}
          <div className="w-full lg:w-3/4 flex flex-col items-center">
            <h2 className="text-3xl font-bold mb-2 text-white">Select Your Seat</h2>
            
            <CinemaScreen />

            <SeatMap 
              rows={seatConfig.rows}
              onSeatClick={handleSeatClick}
            />

            <SeatLegend />
            
            <CheckoutButton bookingInfo={bookingInfo} />
            
          </div>
        </div>
      </main>
    </div>
  );
};

export default SeatBookingPage;