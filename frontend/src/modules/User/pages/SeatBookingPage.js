import React, { useState, useMemo } from 'react';
import Header from '../components/Header';
import BlurCircle from '../components/BlurCircle';


// Mock components - replace with your actual imports
const Header = () => <header className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-md p-4"><h1 className="text-white text-xl">Cinema Booking</h1></header>;
const BlurCircle = ({ top, left, bottom, right }) => (
  <div className="fixed w-96 h-96 rounded-full bg-rose-600/20 blur-3xl pointer-events-none" style={{ top, left, bottom, right }} />
);

// ===== CONSTANTS - Dễ dàng thay đổi và sync với database =====
const SEAT_TYPES = {
  VIP: { id: 'VIP', label: 'VIP', price: 100000, color: 'amber' },
  STANDARD: { id: 'STANDARD', label: 'Standard', price: 65000, color: 'rose' }
};

const SEAT_STATUS = {
  AVAILABLE: 'available',
  SELECTED: 'selected',
  BOOKED: 'booked'
};

// ===== SEAT CONFIGURATION - Cấu trúc này dễ dàng map với MongoDB =====
// Trong thực tế, bạn sẽ fetch từ API: GET /api/screenings/:id/seats
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

// ===== SEAT COMPONENT =====
const Seat = ({ seat, seatType, onClick }) => {
  if (!seat) return <div className="w-6 h-6 md:w-8 md:h-8 m-1" />;

  const colorScheme = SEAT_TYPES[seatType].color;
  const baseStyle = "w-6 h-6 md:w-8 md:h-8 border-2 rounded-md m-1 transition duration-150";
  
  const statusStyles = {
    [SEAT_STATUS.BOOKED]: "bg-gray-600 border-gray-600 cursor-not-allowed",
    [SEAT_STATUS.SELECTED]: `bg-${colorScheme}-600 border-${colorScheme}-600 cursor-pointer shadow-lg shadow-${colorScheme}-500/50`,
    [SEAT_STATUS.AVAILABLE]: `border-${colorScheme}-600/50 hover:bg-${colorScheme}-600/30 cursor-pointer`
  };

  return (
    <div 
      className={`${baseStyle} ${statusStyles[seat.status]}`}
      onClick={onClick}
      title={`${seat.seatId} - ${SEAT_TYPES[seatType].label} - ${seat.status}`}
    />
  );
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

  // Format giá tiền
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND' 
    }).format(price);
  };

  return (
    <div className="relative min-h-screen bg-black text-white overflow-x-hidden">
      <Header />
      <BlurCircle top="10%" left="5%" />
      <BlurCircle bottom="10%" right="5%" />

      <main className="container mx-auto px-4 pt-32 pb-16">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* ===== SIDEBAR: GIỜ CHIẾU & THÔNG TIN ===== */}
          <div className="w-full lg:w-1/4 space-y-6">
            {/* Available Timings */}
            <div className="sticky top-28 bg-white/5 backdrop-blur-sm p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold mb-4 text-white">
                Available Timings
              </h3>
              <div className="flex flex-col space-y-3">
                {timings.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
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

            {/* Thông tin giá */}
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

            {/* Booking Summary */}
            {bookingInfo.count > 0 && (
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
            )}
          </div>

          {/* ===== CHỌN GHẾ ===== */}
          <div className="w-full lg:w-3/4 flex flex-col items-center">
            <h2 className="text-3xl font-bold mb-2 text-white">Select Your Seat</h2>
            
            {/* Screen */}
            <div className="w-full max-w-3xl flex flex-col items-center mb-8">
              <div className="w-3/4 h-1 bg-rose-600/70 rounded-t-full shadow-[0_0px_20px_4px_rgba(225,29,72,0.4)] mb-2"></div>
              <span className="text-sm text-gray-400 tracking-widest uppercase">Screen Side</span>
            </div>

            {/* Seat Map */}
            <div className="w-full overflow-x-auto p-4">
              <div className="flex flex-col items-center min-w-max space-y-1">
                {seatConfig.rows.map((row, rowIndex) => (
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
                            onClick={() => seat && handleSeatClick(row.rowId, seat.seatId)}
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

            {/* Legend */}
            <div className="flex justify-center flex-wrap gap-6 mt-8">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 border-2 border-rose-600/50 rounded-md"></div>
                <span className="text-sm text-gray-400">Available</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-rose-600 border-2 border-rose-600 rounded-md shadow-lg shadow-rose-500/50"></div>
                <span className="text-sm text-gray-400">Selected</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gray-600 border-2 border-gray-600 rounded-md"></div>
                <span className="text-sm text-gray-400">Booked</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-amber-600 border-2 border-amber-600 rounded-md"></div>
                <span className="text-sm text-gray-400">VIP</span>
              </div>
            </div>
            
            {/* Checkout Button */}
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
          </div>
        </div>
      </main>
    </div>
  );
};

export default SeatBookingPage;