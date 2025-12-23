import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import API_USER from '../../../api/User/api.user'; // API bạn đã tạo ở bước trước
import BlurCircle from '../components/BlurCircle';

const MyBookingPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await API_USER.get('/bookings'); // Gọi API getMyBookings
        if (res.data.success) {
          setBookings(res.data.data);
        }
      } catch (error) {
        console.error("Lỗi tải lịch sử vé:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  // Hàm xử lý ảnh
  const getPoster = (path) => {
    if (!path) return "https://via.placeholder.com/150x225?text=No+Img";
    return path.startsWith('http') ? path : `https://image.tmdb.org/t/p/w300${path}`;
  };

  // Format tiền
  const formatMoney = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  
  // Format ngày giờ
  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return {
        date: date.toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' }),
        time: date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };
  };

  // Badge trạng thái
  const renderStatus = (status) => {
      const styles = {
          paid: "bg-green-500/20 text-green-400 border-green-500/50",
          pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/50",
          cancelled: "bg-red-500/20 text-red-400 border-red-500/50"
      };
      return (
        <span className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${styles[status] || styles.pending}`}>
            {status}
        </span>
      );
  };

  return (
    <div className="bg-black min-h-screen text-white font-sans relative overflow-hidden">
      <Header />
      
      {/* Background Decor */}
      <BlurCircle top="10%" left="-10%" />
      <BlurCircle bottom="10%" right="-10%" />

      <div className="container mx-auto px-4 pt-32 pb-20 relative z-10 max-w-5xl">
        <h1 className="text-3xl font-bold mb-8 text-rose-500 border-l-4 border-rose-500 pl-4">My Bookings</h1>

        {loading ? (
            <div className="text-center py-20 text-gray-500 animate-pulse">Loading your tickets...</div>
        ) : bookings.length === 0 ? (
            <div className="text-center py-20 bg-gray-900/50 rounded-2xl border border-gray-800">
                <p className="text-gray-400 text-lg">Bạn chưa đặt vé nào cả.</p>
                <a href="/" className="mt-4 inline-block text-rose-500 hover:underline">Đặt vé ngay →</a>
            </div>
        ) : (
            <div className="space-y-6">
                {bookings.map((ticket) => {
                    const movie = ticket.scheduleId?.movieId;
                    const schedule = ticket.scheduleId;
                    const theater = ticket.scheduleId?.roomId?.movie_theater_id;
                    const { date, time } = formatDateTime(schedule?.time_start);

                    return (
                        <div key={ticket._id} className="group relative bg-[#121212] border border-gray-800 rounded-2xl overflow-hidden hover:border-rose-500/50 transition-all duration-300 shadow-lg hover:shadow-rose-900/20">
                            {/* Hiệu ứng Gradient nền nhẹ */}
                            <div className="absolute inset-0 bg-gradient-to-r from-rose-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                            <div className="flex flex-col md:flex-row relative z-10">
                                {/* Cột 1: Ảnh Phim */}
                                <div className="w-full md:w-48 h-48 md:h-auto shrink-0 relative">
                                    <img 
                                        src={getPoster(movie?.backdrop_path || movie?.poster_path)} 
                                        alt={movie?.title} 
                                        className="w-full h-full object-cover filter brightness-75 group-hover:brightness-100 transition"
                                    />
                                    <div className="absolute top-2 left-2 md:hidden">
                                        {renderStatus(ticket.status)}
                                    </div>
                                </div>

                                {/* Cột 2: Thông tin chi tiết */}
                                <div className="flex-1 p-6 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start mb-2">
                                            <h2 className="text-2xl font-bold text-white group-hover:text-rose-500 transition line-clamp-1">
                                                {movie?.title || "Movie Title Unavailable"}
                                            </h2>
                                            <div className="hidden md:block">
                                                {renderStatus(ticket.status)}
                                            </div>
                                        </div>
                                        
                                        <p className="text-gray-400 text-sm mb-4 flex items-center gap-2">
                                            <span className="bg-gray-800 px-2 py-0.5 rounded text-white">{movie?.runtime} min</span>
                                            <span>•</span>
                                            <span>{theater?.name || "Theater Name"}</span>
                                        </p>

                                        <div className="flex flex-wrap gap-y-2 gap-x-8 text-sm text-gray-300">
                                            <div>
                                                <p className="text-gray-500 text-xs uppercase mb-1">Date & Time</p>
                                                <p className="font-semibold text-white">{date} - <span className="text-rose-400">{time}</span></p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500 text-xs uppercase mb-1">Seats</p>
                                                <p className="font-semibold text-white tracking-widest">{ticket.seatNames.join(', ')}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500 text-xs uppercase mb-1">Total Tickets</p>
                                                <p className="font-semibold text-white">{ticket.seatNames.length}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Footer của Card */}
                                    <div className="mt-6 pt-4 border-t border-gray-800 flex justify-between items-end">
                                        <div className="text-xs text-gray-500">
                                            Booking ID: <span className="font-mono text-gray-400">{ticket._id}</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-2xl font-bold text-rose-500">{formatMoney(ticket.totalPrice)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default MyBookingPage;