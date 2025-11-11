import React, { useState } from 'react';
import Header from '../components/Header'; // Đảm bảo đường dẫn này đúng
import BlurCircle from '../components/BlurCircle'; // Đảm bảo đường dẫn này đúng

// Component Seat (Ghế ngồi)
// Một component nhỏ, có thể tái sử dụng để hiển thị từng ghế
const Seat = ({ status, onClick }) => {
    // status: 'available', 'selected', 'booked'
    
    let baseStyle = "w-6 h-6 md:w-8 md:h-8 border-2 rounded-md m-1 transition duration-150";
    let statusStyle = "";

    if (status === 'booked') {
        // Màu cho ghế đã được đặt
        statusStyle = "bg-gray-600 border-gray-600 cursor-not-allowed";
    } else if (status === 'selected') {
        // Màu cho ghế bạn đang chọn (giống trong hình)
        statusStyle = "bg-rose-600 border-rose-600 cursor-pointer shadow-lg shadow-rose-500/50";
    } else { 
        // 'available'
        // Màu cho ghế trống (giống trong hình)
        statusStyle = "border-rose-600/50 hover:bg-rose-600/30 cursor-pointer";
    }

    return (
        <div 
            className={`${baseStyle} ${statusStyle}`}
            onClick={onClick}
        />
    );
};

// Component chính của trang
const SeatBookingPage = () => {
    // ---- State Quản Lý ----
    
    // Quản lý giờ chiếu được chọn
    const [selectedTime, setSelectedTime] = useState('06:30');
    
    // Quản lý các ghế đang được chọn
    // Thêm 'C8' và 'D8' để khớp với hình ảnh demo của bạn
    const [selectedSeats, setSelectedSeats] = useState(['C8', 'D8']);
    
    // Dữ liệu giả lập các ghế đã bị đặt (màu xám)
    const [bookedSeats, setBookedSeats] = useState([
        'A3', 'A4', 'B1', 'C5', 'C6', 'D1', 'F9', 'F10', 'F11'
    ]);

    // ---- Dữ Liệu Demo ----
    
    // Danh sách giờ chiếu
    const timings = ['06:30', '09:30', '12:00', '04:30', '08:00'];
    
    // Cấu trúc sơ đồ ghế
    // Tôi đã cố gắng mô phỏng layout trong hình của bạn
    // 'null' sẽ được dùng để tạo khoảng trống (lối đi)
    const seatLayout = {
        'A': [1, 1, 1, 1, 1, 1, 1, 1, 1],
        'B': [1, 1, 1, 1, 1, 1, 1, 1, 1],
        'C': [null, null, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, null, null],
        'D': [null, null, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, null, null],
        'E': [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        'F': [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        'G': [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    };
    
    // Các nhãn cột (hiển thị 1-18 như trong hình)
    const colLabels = Array.from({ length: 18 }, (_, i) => i + 1);

    // ---- Hàm Xử Lý ----
    
    const handleSeatClick = (seatId) => {
        // Không cho click nếu ghế đã bị đặt
        if (bookedSeats.includes(seatId)) {
            return;
        }

        // Xử lý logic chọn/bỏ chọn ghế
        setSelectedSeats(prevSelected => {
            if (prevSelected.includes(seatId)) {
                // Nếu đã chọn -> Bỏ chọn (xóa khỏi mảng)
                return prevSelected.filter(seat => seat !== seatId);
            } else {
                // Nếu chưa chọn -> Chọn (thêm vào mảng)
                return [...prevSelected, seatId];
            }
        });
    };

    // ---- Render Component ----
    
    return (
        <div className="relative min-h-screen bg-black text-white overflow-x-hidden">
            {/* Header của bạn */}
            <Header />
            
            {/* Các vòng tròn Blur của bạn */}
            <BlurCircle top="10%" left="5%" />
            <BlurCircle bottom="10%" right="5%" />

            {/* Main Content */}
            <main className="container mx-auto px-4 pt-32 pb-16">
                <div className="flex flex-col lg:flex-row gap-12">
                    
                    {/* ===== CỘT BÊN TRÁI: GIỜ CHIẾU ===== */}
                    <div className="w-full lg:w-1/4">
                        {/* Sử dụng 'sticky' và 'top-28' (28*4px = 112px, 
                          cao hơn header 1 chút) để nó "dính" lại khi cuộn 
                        */}
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
                                        {/* Sử dụng icon 'ri-time-line' từ Remix Icon
                                          giống như 'ri-search-line' trong Header
                                        */}
                                        <i className="ri-time-line text-xl"></i>
                                        <span className="font-medium">{time}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ===== CỘT BÊN PHẢI: CHỌN GHẾ ===== */}
                    <div className="w-full lg:w-3/4 flex flex-col items-center">
                        {/* Tiêu đề */}
                        <h2 className="text-3xl font-bold mb-2 text-white">
                            Select Your Seat
                        </h2>
                        
                        {/* Màn hình (Mô phỏng như trong hình) */}
                        <div className="w-full max-w-3xl flex flex-col items-center mb-8">
                            {/* Đường cong */}
                            <div className="w-3/4 h-1 bg-rose-600/70 rounded-t-full shadow-[0_0px_20px_4px_rgba(225,29,72,0.4)] mb-2"></div>
                            {/* Chữ "SCREEN SIDE" */}
                            <span className="text-sm text-gray-400 tracking-widest uppercase">
                                Screen Side
                            </span>
                        </div>

                        {/* Sơ đồ ghế */}
                        <div className="w-full overflow-x-auto p-4">
                            <div className="flex flex-col items-center min-w-max">
                                {Object.entries(seatLayout).map(([rowLabel, seats]) => (
                                    <div key={rowLabel} className="flex items-center">
                                        {/* Nhãn hàng (A, B, C...) */}
                                        <span className="w-8 text-sm text-gray-400 font-medium text-right mr-2">
                                            {rowLabel}
                                        </span>
                                        
                                        {/* Render các ghế */}
                                        <div className="flex">
                                            {seats.map((seatType, index) => {
                                                if (seatType === null) {
                                                    // Đây là khoảng trống (lối đi)
                                                    return <div key={index} className="w-6 h-6 md:w-8 md:h-8 m-1" />;
                                                }
                                                
                                                // Nếu là ghế, tạo ID (vd: "A1", "C3")
                                                // +1 vì index bắt đầu từ 0
                                                const seatId = `${rowLabel}${index + 1}`;
                                                
                                                // Xác định trạng thái ghế
                                                let status = 'available';
                                                if (bookedSeats.includes(seatId)) {
                                                    status = 'booked';
                                                } else if (selectedSeats.includes(seatId)) {
                                                    status = 'selected';
                                                }

                                                return (
                                                    <Seat
                                                        key={seatId}
                                                        status={status}
                                                        onClick={() => handleSeatClick(seatId)}
                                                    />
                                                );
                                            })}
                                        </div>
                                        
                                        {/* Nhãn hàng (phía bên phải) */}
                                        <span className="w-8 text-sm text-gray-400 font-medium ml-2">
                                            {rowLabel}
                                        </span>
                                    </div>
                                ))}
                                
                                {/* Nhãn cột (1, 2, 3...) */}
                                <div className="flex mt-4">
                                    <div className="w-8 mr-2"></div> {/* Khoảng trống cho nhãn hàng */}
                                    {colLabels.map((col) => (
                                        <span key={col} className="w-6 h-6 md:w-8 md:h-8 m-1 flex items-center justify-center text-xs text-gray-500">
                                            {/* Chỉ hiển thị một vài nhãn cho đỡ rối */}
                                            {col % 2 !== 0 || col > 18 ? col : ''}
                                        </span>
                                    ))}
                                    <div className="w-8 ml-2"></div> {/* Khoảng trống cho nhãn hàng */}
                                </div>
                            </div>
                        </div>

                        {/* Chú thích (Legend) */}
                        <div className="flex justify-center space-x-6 mt-8">
                            <div className="flex items-center space-x-2">
                                <Seat status="available" />
                                <span className="text-sm text-gray-400">Available</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Seat status="selected" />
                                <span className="text-sm text-gray-400">Selected</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Seat status="booked" />
                                <span className="text-sm text-gray-400">Booked</span>
                            </div>
                        </div>
                        
                        {/* Nút Checkout */}
                        <button className="mt-10 bg-rose-600 hover:bg-rose-700 transition duration-200 text-white px-10 py-3 rounded-full text-lg font-semibold shadow-lg shadow-rose-600/30">
                            Proceed to checkout
                            <i className="ri-arrow-right-line align-middle ml-2"></i>
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SeatBookingPage;