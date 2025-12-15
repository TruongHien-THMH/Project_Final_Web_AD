import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header'; // Giữ lại Header của bạn
import BlurCircle from '../components/BlurCircle'; // Giữ lại hiệu ứng nền
import API_ADMIN_SCHEDULES from '../../../api/Admin/api.admin.schedule'; // Import API client của bạn
import API_BOOK from '../../../api/User/api.book';

const SEAT_STATUS = {
  AVAILABLE: 'available',
  SELECTED: 'selected',
  BOOKED: 'booked',
  PENDING: 'pending'
};

const SeatBookingPage = () => {
  const { scheduleId } = useParams(); // Lấy ID từ URL
  const location = useLocation();
  const navigate = useNavigate();
  
  // Lấy dữ liệu được truyền từ trang trước
  const { movieInfo, scheduleInfo } = location.state || {};

  const [loading, setLoading] = useState(true);
  const [roomLayout, setRoomLayout] = useState(null); // Lưu thông tin kích thước phòng
  const [bookedSeats, setBookedSeats] = useState([]); // Lưu danh sách ghế đã bị đặt
  const [pendingSeats, setPendingSeats] = useState([]); // State ghế đang chờ
  const [selectedSeats, setSelectedSeats] = useState([]); // Ghế người dùng đang chọn

  // --- STATE CHO MODAL & THANH TOÁN ---
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('transfer'); // 'transfer' | 'cash'
  const [createdTicket, setCreatedTicket] = useState(null); // Lưu vé vừa tạo
  const [countdown, setCountdown] = useState(0); // Đếm ngược (giây)

  // --- 1. FETCH DỮ LIỆU TỪ BACKEND ---
  useEffect(() => {
    if (!scheduleId) {
      console.log('Không nhận được dữ liệu!!!')
      return
    };
    
    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await API_ADMIN_SCHEDULES.get(`/seatbooking/${scheduleId}`); 
        
        const data = res.data.data; // Phải kiểm tra trước

        setBookedSeats(data.booked_seats || []);

        if(!data.seatCol || !data.seatRow){
          console.log('Không tồn tại room data');
        } else {
          setRoomLayout( 
            {
              totalRows: data.seatRow,
              totalCols: data.seatCol
            }
             || 
            { totalRows: 10, totalCols: 12 }
          ); 

        }

      } catch (error) {
        console.error("Lỗi tải dữ liệu ghế:", error);
        alert("Không thể tải thông tin phòng chiếu.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [scheduleId]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (countdown === 0 && createdTicket) {
       // Hết giờ mà chưa thanh toán xong
       alert("Hết thời gian giữ vé! Vui lòng đặt lại.");
       window.location.reload(); 
    }
  }, [countdown, createdTicket]);

  // Format giây thành MM:SS
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // --- 2. XỬ LÝ CHỌN GHẾ ---
  const handleSeatClick = (seatLabel) => {
    if (bookedSeats.includes(seatLabel) || pendingSeats.includes(seatLabel)) return;

    if (selectedSeats.includes(seatLabel)) {
      setSelectedSeats(prev => prev.filter(s => s !== seatLabel));
    } else {
      if (selectedSeats.length >= 8) return alert("Tối đa 8 ghế!");
      setSelectedSeats(prev => [...prev, seatLabel]);
    }
  };

  const handleCreateTicket = async () => {
    try {
        // Gọi API tạo vé Pending
        const res = await API_BOOK.post('/create', {
            scheduleId,
            seatNames: selectedSeats,
            totalPrice,
            paymentMethod
        });

        // Thành công -> Lưu vé, Bắt đầu đếm ngược, Hiện giao diện chờ
        setCreatedTicket(res.data.data.ticket);
        setCountdown(res.data.data.expireInSeconds); 
        alert(`Đã giữ vé thành công! Bạn có ${res.data.data.expireInSeconds / 60} phút để thanh toán.`);
        
    } catch (error) {
        alert("Lỗi đặt vé: " + (error.response?.data?.message || error.message));
        setShowPaymentModal(false); // Đóng modal để chọn lại ghế nếu bị trùng
        // Reload để cập nhật lại ghế bị người khác lấy
        window.location.reload();
    }
  }

  // --- 3. TÍNH TOÁN TIỀN (Memo) ---
  const totalPrice = useMemo(() => {
    const PRICE_PER_SEAT = 85000; // Giá vé cơ bản (VND)
    return selectedSeats.length * PRICE_PER_SEAT;
  }, [selectedSeats]);

  // --- 4. FORMAT GIÁ ---
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  // 5. API: Xác nhận Thanh Toán (Bước 2 - Chốt đơn)
  const handleConfirmPayment = async () => {
      if(!createdTicket) return;
      try {
          await API_BOOK.post('/confirm', { ticketId: createdTicket._id });
          alert("Thanh toán thành công! Vé đã được xuất.");
          navigate('/'); // Về trang chủ hoặc trang Lịch sử vé
      } catch (error) {
          alert("Lỗi xác nhận: " + error.message);
      }
  }


  // --- 5. HÀM TẠO LƯỚI GHẾ (Render Grid) ---
 // --- RENDER ---
  const renderSeatGrid = () => {
    if (!roomLayout) return null;
    const { totalRows, totalCols } = roomLayout;
    const grid = [];
    const rowLabels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

    for (let r = 0; r < totalRows; r++) {
      const rowLabel = rowLabels[r];
      const rowSeats = [];
      for (let c = 1; c <= totalCols; c++) {
        const seatLabel = `${rowLabel}${c}`;
        let status = SEAT_STATUS.AVAILABLE;
        
        if (bookedSeats.includes(seatLabel)) status = SEAT_STATUS.BOOKED;
        if (pendingSeats.includes(seatLabel)) status = SEAT_STATUS.BOOKED; // Hiển thị pending giống booked để người khác ko chọn
        if (selectedSeats.includes(seatLabel)) status = SEAT_STATUS.SELECTED;

        rowSeats.push(
          <div 
            key={seatLabel}
            onClick={() => handleSeatClick(seatLabel)}
            className={`
              w-8 h-8 m-1 rounded-t-lg cursor-pointer flex items-center justify-center text-xs font-bold transition-all
              ${status === SEAT_STATUS.BOOKED ? "bg-gray-700 text-gray-500 cursor-not-allowed" : ""}
              ${status === SEAT_STATUS.AVAILABLE ? "bg-gray-800 border border-gray-600 hover:bg-rose-600/50 hover:border-rose-500 text-gray-300" : ""}
              ${status === SEAT_STATUS.SELECTED ? "bg-rose-600 text-white shadow-lg scale-110" : ""}
            `}
          >
            {status === SEAT_STATUS.SELECTED ? c : ""}
          </div>
        );
      }
      grid.push(<div key={r} className="flex justify-center mb-2"><span className="w-6 text-right mr-4">{rowLabel}</span>{rowSeats}<span className="w-6 ml-4">{rowLabel}</span></div>);
    }
    return grid;
  };


  if (loading) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center"> Hi Loading Seat Map...</div>;
  }

  if (!scheduleInfo) return <div className="min-h-screen bg-black text-white p-10">Error: Missing Schedule Info</div>;

  return (
    <div className="min-h-screen bg-black text-white relative overflow-x-hidden">
      <Header />
      <BlurCircle top="10%" left="5%" />
      <BlurCircle bottom="10%" right="5%" />

      <main className="container mx-auto px-4 pt-24 pb-10 flex flex-col lg:flex-row gap-8">
        
        {/* --- CỘT TRÁI: SƠ ĐỒ GHẾ --- */}
        <div className="flex-1 flex flex-col items-center">
            
            {/* Màn hình chiếu */}
            <div className="w-3/4 h-2 bg-gradient-to-r from-transparent via-rose-500 to-transparent rounded-full shadow-[0_10px_30px_rgba(225,29,72,0.4)] mb-10 mt-5"></div>
            <p className="text-gray-500 text-sm mb-8 uppercase tracking-widest">Screen</p>

            {/* Lưới ghế */}
            <div className="w-full overflow-x-auto pb-10">{renderSeatGrid()}</div>

            {/* Chú thích */}
            <div className="flex gap-6 mt-4">
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-gray-800 border border-gray-600 rounded"></div>
                    <span className="text-sm text-gray-400">Available</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-rose-600 rounded"></div>
                    <span className="text-sm text-gray-400">Selected</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-gray-700 rounded"></div>
                    <span className="text-sm text-gray-400">Booked</span>
                </div>
            </div>
        </div>

        {/* --- CỘT PHẢI: THÔNG TIN VÉ --- */}
        <div className="w-full lg:w-[350px] bg-[#1a1a1a] p-6 rounded-2xl h-fit border border-gray-800 sticky top-24">
            <h3 className="text-xl font-bold text-white mb-4 border-b border-gray-700 pb-4">Booking Summary</h3>
            <h4 className="text-lg font-semibold text-rose-500">{movieInfo?.title}</h4>
            <p className="text-sm text-gray-400 mb-4">{scheduleInfo?.theaterName} - {scheduleInfo?.time}</p>
            
            <div className="flex justify-between text-sm mb-2">
                <span>Seats:</span>
                <span className="font-bold text-white">{selectedSeats.join(', ')}</span>
            </div>
            
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-700">
                <span className="text-lg font-bold">Total:</span>
                <span className="text-xl font-bold text-rose-500">{formatPrice(totalPrice)}</span>
            </div>

            {/* HIỂN THỊ TRẠNG THÁI THANH TOÁN */}
            {!createdTicket ? (
                // Chưa tạo vé -> Nút Checkout mở Modal
                <button 
                    disabled={selectedSeats.length === 0}
                    onClick={() => setShowPaymentModal(true)}
                    className="w-full mt-6 py-3 bg-gradient-to-r from-rose-600 to-rose-500 hover:shadow-lg rounded-xl font-bold text-white disabled:opacity-50"
                >
                    Checkout
                </button>
            ) : (
                // Đã tạo vé -> Hiển thị đếm ngược và nút Xác nhận
                <div className="mt-6 bg-rose-500/10 border border-rose-500/50 rounded-xl p-4 text-center animate-pulse">
                    <p className="text-sm text-rose-400 mb-1">Time remaining to pay:</p>
                    <p className="text-3xl font-bold text-white font-mono">{formatTime(countdown)}</p>
                    
                    {paymentMethod === 'transfer' && (
                        <div className="mt-4 text-xs text-left bg-black p-3 rounded border border-gray-700">
                            <p>Bank: Vietcombank</p>
                            <p>STK: 99998888</p>
                            <p>Amount: {formatPrice(totalPrice)}</p>
                            <p>Memo: {createdTicket._id}</p>
                        </div>
                    )}
                    
                    <button 
                        onClick={handleConfirmPayment}
                        className="w-full mt-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg font-bold text-white"
                    >
                        I have Paid / Confirm
                    </button>
                </div>
            )}
        </div>

      </main>

      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-[#222] p-6 rounded-2xl w-full max-w-md border border-gray-700 shadow-2xl">
                <h3 className="text-xl font-bold text-white mb-6">Select Payment Method</h3>
                
                <div className="space-y-3">
                    <label className={`flex items-center p-4 rounded-xl border cursor-pointer transition-all ${paymentMethod === 'transfer' ? 'border-rose-500 bg-rose-500/10' : 'border-gray-700 hover:border-gray-500'}`}>
                        <input type="radio" name="payment" className="w-5 h-5 text-rose-500" 
                            checked={paymentMethod === 'transfer'} onChange={() => setPaymentMethod('transfer')} 
                        />
                        <div className="ml-3">
                            <p className="font-bold text-white">Bank Transfer</p>
                            <p className="text-xs text-gray-400">Pay within 10 minutes</p>
                        </div>
                    </label>

                    <label className={`flex items-center p-4 rounded-xl border cursor-pointer transition-all ${paymentMethod === 'cash' ? 'border-rose-500 bg-rose-500/10' : 'border-gray-700 hover:border-gray-500'}`}>
                        <input type="radio" name="payment" className="w-5 h-5 text-rose-500" 
                            checked={paymentMethod === 'cash'} onChange={() => setPaymentMethod('cash')} 
                        />
                        <div className="ml-3">
                            <p className="font-bold text-white">Cash at Counter</p>
                            <p className="text-xs text-gray-400">Pay 1 hour before showtime</p>
                        </div>
                    </label>
                </div>

                <div className="flex gap-3 mt-8">
                    <button onClick={() => setShowPaymentModal(false)} className="flex-1 py-3 rounded-xl bg-gray-700 text-white font-bold hover:bg-gray-600">Cancel</button>
                    <button onClick={handleCreateTicket} className="flex-1 py-3 rounded-xl bg-rose-600 text-white font-bold hover:bg-rose-500 shadow-lg shadow-rose-900/40">Confirm</button>
                </div>
            </div>
        </div>
      )}

    </div>
  );
};

export default SeatBookingPage;