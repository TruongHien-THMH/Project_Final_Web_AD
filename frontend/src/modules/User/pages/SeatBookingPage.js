import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import BlurCircle from '../components/BlurCircle';
import API_SCHEDULES from '../../../api/User/api.schedule';
import API_BOOK from '../../../api/User/api.book';

import { useAuth } from '../../../context/AuthContext';

// Định nghĩa trạng thái ghế rõ ràng
const SEAT_STATUS = {
  AVAILABLE: 'available',
  SELECTED: 'selected',
  BOOKED: 'booked',
  PENDING: 'pending' 
};

const SeatBookingPage = () => {
  const { scheduleId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { movieInfo, scheduleInfo } = location.state || {};

  const [loading, setLoading] = useState(true);
  const [roomLayout, setRoomLayout] = useState(null);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [pendingSeats, setPendingSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);

  // --- STATE MODAL & THANH TOÁN ---
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('transfer');
  const [createdTicket, setCreatedTicket] = useState(null);
  const [countdown, setCountdown] = useState(0);

  const [email, setEmail] = useState('');

  // Lấy User từ Context
  const { user, openAuthModal, showToast } = useAuth();

  // --- FIX LOGIC 1: TỰ ĐỘNG ĐIỀN EMAIL KHI CÓ USER ---
  useEffect(() => {
    if (user && user.email) {
        setEmail(user.email);
    }
  }, [user]);

  // 1. FETCH DỮ LIỆU
  useEffect(() => {
    if (!scheduleId) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await API_SCHEDULES.get(`/seatbooking/${scheduleId}`);
        const data = res.data.data;
        
        setBookedSeats(data.booked_seats || []);
        setPendingSeats(data.pending_seats || []); 
        
        if (data) {
            setRoomLayout({
                totalRows: data.seatRow || 10,
                totalCols: data.seatCol || 12
            });
        }
      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [scheduleId]);

  // 2. LOGIC ĐẾM NGƯỢC
  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (countdown === 0 && createdTicket) {
       alert("Hết thời gian giữ vé! Vui lòng đặt lại.");
       window.location.reload(); 
    }
  }, [countdown, createdTicket]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // 3. XỬ LÝ CHỌN GHẾ
  const handleSeatClick = (seatLabel) => {
    if (bookedSeats.includes(seatLabel) || pendingSeats.includes(seatLabel)) return;

    if (!user) {
        showToast("Vui lòng đăng nhập để chọn ghế!", "error");
        openAuthModal();
        return;
    }

    if (selectedSeats.includes(seatLabel)) {
      setSelectedSeats(prev => prev.filter(s => s !== seatLabel));
    } else {
      if (selectedSeats.length >= 8) return alert("Tối đa 8 ghế!");
      setSelectedSeats(prev => [...prev, seatLabel]);
    }
  };

  const totalPrice = useMemo(() => selectedSeats.length * 85000, [selectedSeats]);
  const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  // 4. API TẠO VÉ (SỬA LẠI ĐỂ TẮT MODAL)
  const handleCreateTicket = async () => {
    // Validate Email trước khi tạo vé
    if (!email) {
        alert("Vui lòng nhập email nhận vé!");
        return;
    }

    try {
        const res = await API_BOOK.post('/create', {
            scheduleId,
            seatNames: selectedSeats,
            totalPrice,
            paymentMethod
        });

        setCreatedTicket(res.data.data.ticket);
        setCountdown(res.data.data.expireInSeconds); 
        
        setShowPaymentModal(false); // Tắt modal chọn phương thức
        
        // Thông báo nhẹ nhàng hơn alert
        showToast(`Giữ vé thành công! Vui lòng thanh toán trong ${Math.floor(res.data.data.expireInSeconds/60)} phút.`, "success");
        
    } catch (error) {
        alert("Lỗi đặt vé: " + (error.response?.data?.message || error.message));
        setShowPaymentModal(false);
        window.location.reload();
    }
  }

  // 5. XÁC NHẬN THANH TOÁN & GỬI EMAIL
  const handleConfirmPayment = async () => {
    if(!createdTicket) return;
    try {
        // Gửi kèm email state (đã được auto-fill hoặc user sửa)
        await API_BOOK.post('/confirm', { 
            ticketId: createdTicket._id,
            email: email 
        });

        alert(`Thanh toán thành công! Vé đã được gửi về email: ${email}`);
        navigate('/'); 
    } catch (error) {
        alert("Lỗi xác nhận: " + (error.response?.data?.message || error.message));
    }
}

  // 6. RENDER LƯỚI GHẾ (ĐÃ CHỈNH SỬA MÀU SẮC TƯƠNG PHẢN CAO)
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
        
        // Xác định trạng thái
        let status = SEAT_STATUS.AVAILABLE;
        if (bookedSeats.includes(seatLabel)) status = SEAT_STATUS.BOOKED;
        else if (pendingSeats.includes(seatLabel)) status = SEAT_STATUS.PENDING;
        if (selectedSeats.includes(seatLabel)) status = SEAT_STATUS.SELECTED; 

        // Class CSS cho từng trạng thái
        let seatClasses = "w-8 h-8 m-1 rounded-t-lg cursor-pointer flex items-center justify-center text-xs font-bold transition-all duration-200 ";
        
        switch (status) {
            case SEAT_STATUS.BOOKED:
                seatClasses += "bg-gray-900 border border-gray-800 opacity-30 text-transparent cursor-not-allowed";                
                break;
            case SEAT_STATUS.PENDING:
                seatClasses += "bg-yellow-600 text-black border border-yellow-500 cursor-not-allowed shadow-[0_0_10px_rgba(234,179,8,0.4)]"; 
                break;
            case SEAT_STATUS.SELECTED:
                seatClasses += "bg-rose-600 text-white shadow-[0_0_15px_rgba(225,29,72,0.8)] scale-110 z-10 border border-rose-400"; 
                break;
            default: // AVAILABLE
                seatClasses += "bg-gray-700 border border-gray-500 text-gray-300 hover:bg-white hover:text-black hover:shadow-white/50";
        }

        rowSeats.push(
          <div 
            key={seatLabel}
            onClick={() => handleSeatClick(seatLabel)}
            className={seatClasses}
            title={status === SEAT_STATUS.PENDING ? "Ghế đang được giữ" : seatLabel}
          >
            {status !== SEAT_STATUS.BOOKED ? c : ""}
          </div>
        );
      }
      grid.push(
          <div key={r} className="flex justify-center mb-2">
              <span className="w-6 text-right mr-4 text-gray-400 font-mono font-bold pt-1">{rowLabel}</span>
              {rowSeats}
              <span className="w-6 ml-4 text-gray-400 font-mono font-bold pt-1">{rowLabel}</span>
          </div>
      );
    }
    return grid;
  };

  if (loading) return <div className="min-h-screen bg-black text-white flex justify-center items-center">Loading Seat Map...</div>;

  return (
    <div className="min-h-screen bg-black text-white relative">
      <Header />
      <BlurCircle top="10%" left="5%" />

      <main className="container mx-auto px-4 pt-24 pb-10 flex flex-col lg:flex-row gap-8">
        
        {/* --- CỘT TRÁI: SƠ ĐỒ GHẾ --- */}
        <div className="flex-1 flex flex-col items-center">
            <div className="w-3/4 h-2 bg-gradient-to-r from-transparent via-rose-500 to-transparent rounded-full shadow-[0_10px_30px_rgba(225,29,72,0.4)] mb-10 mt-5"></div>
            <p className="text-gray-500 text-sm mb-8 uppercase tracking-widest">Screen</p>

            <div className="w-full overflow-x-auto pb-10 custom-scrollbar">
                <div className="min-w-max mx-auto">
                    {renderSeatGrid()}
                </div>
            </div>

            {/* CHÚ THÍCH MÀU SẮC */}
            <div className="flex gap-6 mt-8 flex-wrap justify-center bg-gray-900/50 p-4 rounded-xl border border-gray-800">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gray-700 border border-gray-500 rounded-t-lg"></div>
                    <span className="text-sm text-gray-300">Trống</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-rose-600 border border-rose-400 rounded-t-lg shadow-[0_0_10px_rgba(225,29,72,0.8)]"></div>
                    <span className="text-sm text-white font-bold">Đang chọn</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gray-900 border border-gray-800 opacity-30 rounded-t-lg"></div>
                    <span className="text-sm text-gray-500">Đã bán</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-yellow-600 border border-yellow-500 rounded-t-lg"></div>
                    <span className="text-sm text-yellow-500">Đang giữ</span>
                </div>
            </div>
        </div>

        {/* --- CỘT PHẢI: BOOKING SUMMARY --- */}
        <div className="w-full lg:w-[350px] bg-[#1a1a1a] p-6 rounded-2xl h-fit border border-gray-800 sticky top-24 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-4 border-b border-gray-700 pb-4">Booking Summary</h3>
            <h4 className="text-lg font-semibold text-rose-500">{movieInfo?.title}</h4>
            <p className="text-sm text-gray-400 mb-4">{scheduleInfo?.theaterName} - {scheduleInfo?.time}</p>
            
            <div className="flex justify-between text-sm mb-2">
                <span>Seats:</span>
                <span className="font-bold text-white text-right break-words w-1/2">{selectedSeats.length > 0 ? selectedSeats.join(', ') : '-'}</span>
            </div>
            
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-700">
                <span className="text-lg font-bold">Total:</span>
                <span className="text-xl font-bold text-rose-500">{formatPrice(totalPrice)}</span>
            </div>

            {/* TRẠNG THÁI: CHƯA TẠO VÉ */}
            {!createdTicket ? (
                <button 
                    disabled={selectedSeats.length === 0}
                    onClick={() => setShowPaymentModal(true)}
                    className="w-full mt-6 py-3 bg-gradient-to-r from-rose-600 to-rose-500 hover:shadow-lg hover:shadow-rose-900/30 rounded-xl font-bold text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    Checkout
                </button>
            ) : (
                // TRẠNG THÁI: ĐANG CHỜ THANH TOÁN
                <div className="mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-rose-500/10 border border-rose-500/50 rounded-xl p-4 text-center">
                        <p className="text-sm text-rose-400 mb-2 font-semibold uppercase tracking-wider">Payment Countdown</p>
                        <p className="text-4xl font-black text-white font-mono tracking-widest">{formatTime(countdown)}</p>
                    </div>
                    
                    {paymentMethod === 'transfer' && (
                        <div className="mt-4 text-sm bg-black/50 p-4 rounded-xl border border-gray-700 space-y-2">
                            <div className="flex justify-between"><span className="text-gray-400">Bank:</span> <span className="font-bold text-white">Vietcombank</span></div>
                            <div className="flex justify-between"><span className="text-gray-400">Account:</span> <span className="font-bold text-white">99998888</span></div>
                            <div className="flex justify-between"><span className="text-gray-400">Amount:</span> <span className="font-bold text-rose-500">{formatPrice(totalPrice)}</span></div>
                            <div className="flex justify-between items-center pt-2 border-t border-gray-700 mt-2">
                                <span className="text-gray-400">Memo:</span> 
                                <span className="font-mono bg-gray-800 px-2 py-1 rounded text-xs select-all cursor-copy">{createdTicket._id}</span>
                            </div>
                        </div>
                    )}
                    
                    <button 
                        onClick={handleConfirmPayment}
                        className="w-full mt-4 py-3 bg-green-600 hover:bg-green-500 rounded-xl font-bold text-white shadow-lg shadow-green-900/30 transition-all"
                    >
                        I have Paid / Confirm
                    </button>
                </div>
            )}
        </div>

      </main>

      {/* --- MODAL --- */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-[#1a1a1a] p-6 rounded-3xl w-full max-w-md border border-gray-700 shadow-2xl relative">
                <h3 className="text-2xl font-bold text-white mb-6">Payment Method</h3>
                
                <div className="space-y-4">
                    <label className={`flex items-center p-4 rounded-2xl border cursor-pointer transition-all ${paymentMethod === 'transfer' ? 'border-rose-500 bg-rose-500/10' : 'border-gray-700 bg-gray-800 hover:border-gray-500'}`}>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'transfer' ? 'border-rose-500' : 'border-gray-500'}`}>
                            {paymentMethod === 'transfer' && <div className="w-2.5 h-2.5 bg-rose-500 rounded-full"></div>}
                        </div>
                        <input type="radio" name="payment" className="hidden" 
                            checked={paymentMethod === 'transfer'} onChange={() => setPaymentMethod('transfer')} 
                        />
                        <div className="ml-4">
                            <p className="font-bold text-white">Bank Transfer</p>
                            <p className="text-xs text-gray-400">QR Code / 247 Transfer (10 mins)</p>
                        </div>
                    </label>

                    <label className={`flex items-center p-4 rounded-2xl border cursor-pointer transition-all ${paymentMethod === 'cash' ? 'border-rose-500 bg-rose-500/10' : 'border-gray-700 bg-gray-800 hover:border-gray-500'}`}>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'cash' ? 'border-rose-500' : 'border-gray-500'}`}>
                             {paymentMethod === 'cash' && <div className="w-2.5 h-2.5 bg-rose-500 rounded-full"></div>}
                        </div>
                        <input type="radio" name="payment" className="hidden" 
                            checked={paymentMethod === 'cash'} onChange={() => setPaymentMethod('cash')} 
                        />
                        <div className="ml-4">
                            <p className="font-bold text-white">Cash at Counter</p>
                            <p className="text-xs text-gray-400">Pay 1 hour before showtime</p>
                        </div>
                    </label>

                    <div className="mt-4">
                        <label className="text-sm text-gray-400 mb-1 block">Email của bạn:</label>
                        <input 
                            type="email" 
                            className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-white focus:border-rose-500 outline-none"
                            value={email} // Tự động điền từ state
                            onChange={(e) => setEmail(e.target.value)}
                            disabled
                        />
                        <p className="text-xs text-gray-500 mt-1">*Email bạn sẽ nhận vé</p>
                    </div>
                </div>

                <div className="flex gap-4 mt-8">
                    <button onClick={() => setShowPaymentModal(false)} className="flex-1 py-3 rounded-xl bg-transparent border border-gray-600 text-gray-300 font-bold hover:bg-gray-800 transition-all">Cancel</button>
                    <button onClick={handleCreateTicket} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 text-white font-bold hover:shadow-lg hover:shadow-rose-900/40 transition-all">Confirm & Book</button>
                </div>
            </div>
        </div>
      )}

    </div>
  );
};

export default SeatBookingPage;