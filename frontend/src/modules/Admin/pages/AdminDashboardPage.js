// src/admin/pages/AdminDashboardPage.js
import React, {useEffect, useState, useMemo}from 'react';

import StatsCard from '../components/StatsCard';
import MovieCard from '../../../ components/ui/MovieCard_admin';

import API_ADMIN_MOVIE from '../../../api/Admin/api.admin.movie';
import API_ADMIN_STATS from '../../../api/Admin/api.admin.stats';

import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, AreaChart, Area
} from 'recharts';

const AdminDashboardPage = () => {

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  const [stats, setStats] = useState({
     totalUsers: 0,
     totalTickets: 0,
     totalRevenue: 0,
     chartData: { 
         months: [], 
         users: [], 
         tickets: [], 
         revenue: [] 
     }
  });

  // Dữ liệu DEMO giả lập 3 tháng gần nhất (Tháng 10, 11, 12)
  const demoDashboardData = {
      // 1. Thẻ tổng quan
      totalUsers: 156,       // Tổng User
      totalTickets: 342,     // Tổng Vé đã bán
      totalRevenue: 29500000, // Tổng tiền (29.5 triệu)

      // 2. Dữ liệu Biểu đồ (3 Mảng ảo bạn cần)
      chartData: {
          labels: ["October", "November", "December"],
          
          // Mảng 1: Số User đăng ký mới mỗi tháng
          newUsers: [12, 45, 30], 
          
          // Mảng 2: Số Vé bán ra (Paid)
          soldTickets: [80, 150, 112], 
          
          // Mảng 3: Doanh thu (VNĐ)
          revenue: [6800000, 12750000, 9950000] 
      }
  };

  // Hàm lấy danh sách phim từ DB
  const fetchMovieData = async () => {
    try {
      setLoading(true);
      const res = await API_ADMIN_MOVIE.get('/'); 
      setMovies(res.data || []);
    } catch (error) {
      console.error("Lỗi lấy danh sách phim:", error);
    } finally {
      setLoading(false);
    }
  };

  // Hàm cập nhật phim từ TMDB
  const handleUpdateFromTMDB = async () => {
    if(!window.confirm("Bạn có chắc muốn xóa dữ liệu cũ và cập nhật mới từ TMDB không?")) return;

    try {
      setUpdating(true);
      const res = await API_ADMIN_MOVIE.get('/fetchData');
      
      if (res.data.success) {
        alert(res.data.message);
        fetchMovieData();
      }
    } catch (error) {
      console.error("Lỗi cập nhật TMDB:", error);
      alert("Cập nhật thất bại! Kiểm tra console.");
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    fetchMovieData();
  }, []);

 // Gọi API lấy thống kê
  useEffect(() => {
    const fetchStats = async () => {
        try {
            const res = await API_ADMIN_STATS.get('/dashboard');
            if(res.data.success) {
                setStats(res.data.data);
            }
        } catch (error) {
            console.error("Lỗi fetch stats:", error);
        } finally {
            setLoading(false);
        }
    };
    fetchStats();
  }, []);

  const dataForChart = useMemo(() => {
      if(!stats.chartData.months || stats.chartData.months.length === 0) return [];
      
      return stats.chartData.months.map((month, index) => ({
          name: month,
          DoanhThu: stats.chartData.revenue[index],
          VeBanRa: stats.chartData.tickets[index],
          NguoiDung: stats.chartData.users[index]
      }));
  }, [stats]);

  // Format tiền tệ
  const formatMoney = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 p-3 border border-gray-700 rounded shadow-lg text-white">
          <p className="font-bold mb-2">{label}</p>
          {payload.map((entry, index) => (
             <p key={index} style={{ color: entry.color }} className="text-sm">
                {entry.name}: {entry.name === 'DoanhThu' ? formatMoney(entry.value) : entry.value}
             </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const statsCards = [
    { title: 'Tổng doanh thu', value: formatMoney(stats.totalRevenue), icon: 'bag' },
    { title: 'Số lượng vé', value: stats.totalTickets, icon: 'receipt' },
    { title: 'Người dùng mới', value: stats.totalUsers, icon: 'user' },
    { title: 'Avg Price', value: stats.totalTickets > 0 ? formatMoney(stats.totalRevenue/stats.totalTickets) : 0, icon: 'ticket' }, // Tính thêm trung bình giá vé
  ];

  if (loading) return <div className="text-white p-10 text-center">Đang tải dữ liệu thống kê...</div>;

  return (
    <div className="text-white p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-rose-500">Admin Dashboard</h1>
        
        {/* NÚT UPDATE */}
        <button 
          onClick={handleUpdateFromTMDB}
          disabled={updating}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold shadow-lg transition-all
            ${updating ? 'bg-gray-600 cursor-not-allowed' : 'bg-green-600 hover:bg-green-500 shadow-green-900/40'}
          `}
        >
          {updating ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Updating...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              Update from TMDB
            </>
          )}
        </button>
      </div>

      {/* 1. Thẻ thống kê */}
      <div className="flex justify-between items-center mb-8">
      
        <div className="text-sm text-gray-400">Overview of {new Date().getFullYear()}</div>
      </div>

      {/* 1. CARDS THỐNG KÊ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {statsCards.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* 2. BIỂU ĐỒ (CHARTS) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* BIỂU ĐỒ 1: DOANH THU (Area Chart) */}
          <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-800 shadow-xl">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <span className="w-3 h-8 bg-rose-500 rounded-full block"></span>
                  Biểu Đồ Doanh Thu
              </h3>
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dataForChart}>
                        <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#e11d48" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#e11d48" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                        <XAxis dataKey="name" stroke="#9ca3af" axisLine={false} tickLine={false} />
                        <YAxis stroke="#9ca3af" axisLine={false} tickLine={false} 
                            tickFormatter={(value) => `${value/1000000}M`} // Rút gọn số liệu trục Y (Ví dụ 10tr -> 10M)
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area 
                            type="monotone" 
                            dataKey="DoanhThu" 
                            stroke="#e11d48" 
                            fillOpacity={1} 
                            fill="url(#colorRevenue)" 
                        />
                    </AreaChart>
                </ResponsiveContainer>
              </div>
          </div>

          {/* BIỂU ĐỒ 2: VÉ BÁN & USER MỚI (Mixed Bar/Line Chart) */}
          <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-800 shadow-xl">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <span className="w-3 h-8 bg-blue-500 rounded-full block"></span>
                  Tăng Trưởng Vé & User
              </h3>
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dataForChart}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                        <XAxis dataKey="name" stroke="#9ca3af" axisLine={false} tickLine={false} />
                        <YAxis stroke="#9ca3af" axisLine={false} tickLine={false} />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff' }}
                            itemStyle={{ color: '#fff' }}
                        />
                        <Legend />
                        {/* Cột Vé bán ra */}
                        <Bar dataKey="VeBanRa" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Vé Bán Ra" />
                        {/* Cột User mới */}
                        <Bar dataKey="NguoiDung" fill="#10b981" radius={[4, 4, 0, 0]} name="User Mới" />
                    </BarChart>
                </ResponsiveContainer>
              </div>
          </div>

      </div>

      {/* 2. Danh sách phim */}
      <h2 className="text-2xl font-semibold mb-4 text-gray-300">Active Movies List</h2>
      
      {loading ? (
        <div className="text-center text-gray-500 mt-10">Loading movies...</div>
      ) : movies.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">Chưa có phim nào. Hãy bấm Update!</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {movies.map((movie) => (
            <MovieCard key={movie._id || movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;