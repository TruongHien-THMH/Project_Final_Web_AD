import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import BlurCircle from '../components/BlurCircle';

const SEAT_STATUS = {
  AVAILABLE: 'available',
  SELECTED: 'selected',
  BOOKED: 'booked'
};

// Seat Component with FIXED Tailwind classes
const Seat = ({ seat, seatType, onClick }) => {
  if (!seat) return <div className="w-6 h-6 md:w-8 md:h-8 m-1" />;

  const baseStyle = "w-6 h-6 md:w-8 md:h-8 border-2 rounded-md m-1 transition duration-150";
  
  let seatClasses = baseStyle;
  
  if (seat.status === SEAT_STATUS.BOOKED) {
    seatClasses += " bg-gray-600 border-gray-600 cursor-not-allowed";
  } else if (seat.status === SEAT_STATUS.SELECTED) {
    if (seatType === 'VIP') {
      seatClasses += " bg-amber-600 border-amber-600 cursor-pointer shadow-lg shadow-amber-500/50";
    } else {
      seatClasses += " bg-rose-600 border-rose-600 cursor-pointer shadow-lg shadow-rose-500/50";
    }
  } else {
    if (seatType === 'VIP') {
      seatClasses += " border-amber-600/50 hover:bg-amber-600/30 cursor-pointer";
    } else {
      seatClasses += " border-rose-600/50 hover:bg-rose-600/30 cursor-pointer";
    }
  }

  return (
    <div 
      className={seatClasses}
      onClick={onClick}
      title={`${seat.seatId} - ${seatType} - ${seat.status}`}
    />
  );
};

const SeatBookingPage = () => {
  const { id: movieId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const showId = searchParams.get('showId');
  
  const [seatConfig, setSeatConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [sessionId] = useState(() => 
    'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now()
  );

  useEffect(() => {
    if (!showId) {
      setError('Show ID is missing');
      setLoading(false);
      return;
    }

    const fetchSeats = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5001/api/shows/${showId}/seats`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch seats');
        }
        
        const data = await response.json();
        setSeatConfig(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching seats:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSeats();
  }, [showId]);

  const bookingInfo = useMemo(() => {
    if (!seatConfig) return { selected: [], totalPrice: 0, count: 0 };
    
    const selected = [];
    
    seatConfig.rows.forEach(row => {
      row.seats.forEach(seat => {
        if (seat && seat.status === SEAT_STATUS.SELECTED) {
          selected.push({
            seatId: seat.seatId,
            seatType: row.seatType,
            price: seatConfig.pricing[row.seatType.toLowerCase()]
          });
        }
      });
    });

    const totalPrice = selected.reduce((sum, s) => sum + s.price, 0);
    
    return { selected, totalPrice, count: selected.length };
  }, [seatConfig]);

  const handleSeatClick = async (rowId, seatId, currentStatus) => {
    if (currentStatus === SEAT_STATUS.BOOKED) return;
    
    try {
      setSeatConfig(prev => ({
        ...prev,
        rows: prev.rows.map(row => {
          if (row.rowId !== rowId) return row;
          
          return {
            ...row,
            seats: row.seats.map(seat => {
              if (!seat || seat.seatId !== seatId) return seat;
              
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

      const endpoint = currentStatus === SEAT_STATUS.SELECTED 
        ? `http://localhost:5001/api/shows/${showId}/seats/unselect`
        : `http://localhost:5001/api/shows/${showId}/seats/select`;
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          seatIds: [seatId],
          sessionId
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setSeatConfig(prev => ({
          ...prev,
          rows: prev.rows.map(row => {
            if (row.rowId !== rowId) return row;
            
            return {
              ...row,
              seats: row.seats.map(seat => {
                if (!seat || seat.seatId !== seatId) return seat;
                return { ...seat, status: currentStatus };
              })
            };
          })
        }));
        
        alert(data.message || 'Failed to select seat');
      }
      
    } catch (error) {
      console.error('Error selecting seat:', error);
      setSeatConfig(prev => ({
        ...prev,
        rows: prev.rows.map(row => {
          if (row.rowId !== rowId) return row;
          
          return {
            ...row,
            seats: row.seats.map(seat => {
              if (!seat || seat.seatId !== seatId) return seat;
              return { ...seat, status: currentStatus };
            })
          };
        })
      }));
      alert('Error selecting seat. Please try again.');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND' 
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading seats...</div>
      </div>
    );
  }

  if (error || !seatConfig) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
        <div className="text-white text-xl">Error: {error || 'Failed to load seats'}</div>
        <button 
          onClick={() => navigate(-1)}
          className="px-6 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-black text-white overflow-x-hidden">
      <Header />
      <BlurCircle top="10%" left="5%" />
      <BlurCircle bottom="10%" right="5%" />

      <main className="container mx-auto px-4 pt-32 pb-16">
        <div className="flex flex-col lg:flex-row gap-12">
          
          <div className="w-full lg:w-1/4 space-y-6">
            <div className="sticky top-28 bg-white/5 backdrop-blur-sm p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold mb-4 text-white">
                {seatConfig.movieTitle}
              </h3>
              <div className="text-sm text-gray-300 space-y-2">
                <div>📅 {seatConfig.showDate}</div>
                <div>🕐 {seatConfig.showtime}</div>
                <div>🎬 Hall {seatConfig.cinemaHall}</div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold mb-4 text-white">Pricing</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-amber-600 rounded"></div>
                    <span className="text-sm text-gray-300">VIP</span>
                  </div>
                  <span className="text-white font-semibold">
                    {formatPrice(seatConfig.pricing.vip)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-rose-600 rounded"></div>
                    <span className="text-sm text-gray-300">Standard</span>
                  </div>
                  <span className="text-white font-semibold">
                    {formatPrice(seatConfig.pricing.standard)}
                  </span>
                </div>
              </div>
            </div>

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

          <div className="w-full lg:w-3/4 flex flex-col items-center">
            <h2 className="text-3xl font-bold mb-2 text-white">Select Your Seat</h2>
            
            <div className="w-full max-w-3xl flex flex-col items-center mb-8">
              <div className="w-3/4 h-1 bg-rose-600/70 rounded-t-full shadow-[0_0px_20px_4px_rgba(225,29,72,0.4)] mb-2"></div>
              <span className="text-sm text-gray-400 tracking-widest uppercase">Screen Side</span>
            </div>

            <div className="w-full overflow-x-auto p-4">
              <div className="flex flex-col items-center min-w-max space-y-1">
                {seatConfig.rows.map((row, rowIndex) => (
                  <div key={row.rowId}>
                    {rowIndex === 0 && row.seatType === 'VIP' && (
                      <div className="text-center mb-3">
                        <span className="inline-block bg-amber-600/20 border border-amber-600/50 px-4 py-1 rounded-full text-xs text-amber-400 font-semibold uppercase tracking-wide">
                          VIP Section
                        </span>
                      </div>
                    )}
                    
                    {rowIndex > 0 && seatConfig.rows[rowIndex - 1].seatType === 'VIP' && row.seatType === 'STANDARD' && (
                      <div className="text-center mb-3 mt-4">
                        <span className="inline-block bg-rose-600/20 border border-rose-600/50 px-4 py-1 rounded-full text-xs text-rose-400 font-semibold uppercase tracking-wide">
                          Standard Section
                        </span>
                      </div>
                    )}

                    <div className="flex items-center">
                      <span className={`w-8 text-sm font-medium text-right mr-2 ${
                        row.seatType === 'VIP' ? 'text-amber-400' : 'text-gray-400'
                      }`}>
                        {row.rowLabel}
                      </span>
                      
                      <div className="flex">
                        {row.seats.map((seat, seatIndex) => (
                          <Seat
                            key={seat ? seat.seatId : `empty-${seatIndex}`}
                            seat={seat}
                            seatType={row.seatType}
                            onClick={() => seat && handleSeatClick(row.rowId, seat.seatId, seat.status)}
                          />
                        ))}
                      </div>
                      
                      <span className={`w-8 text-sm font-medium ml-2 ${
                        row.seatType === 'VIP' ? 'text-amber-400' : 'text-gray-400'
                      }`}>
                        {row.rowLabel}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

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
            
            <button 
              className={`mt-10 px-10 py-3 rounded-full text-lg font-semibold shadow-lg transition duration-200 ${
                bookingInfo.count > 0
                  ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/30 text-white'
                  : 'bg-gray-600 cursor-not-allowed text-gray-400'
              }`}
              disabled={bookingInfo.count === 0}
              onClick={() => {
                console.log('Proceed to checkout', { bookingInfo, sessionId });
                // TODO: Navigate to payment
              }}
            >
              {bookingInfo.count > 0 
                ? `Proceed to checkout (${formatPrice(bookingInfo.totalPrice)})`
                : 'Select seats to continue'
              }
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SeatBookingPage;