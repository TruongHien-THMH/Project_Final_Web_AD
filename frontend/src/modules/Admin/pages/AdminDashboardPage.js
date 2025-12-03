// src/admin/pages/AdminDashboardPage.js
import React, {useEffect, useState }from 'react';
import StatsCard from '../components/StatsCard';
import MovieCard from '../../../ components/ui/MovieCard_user';
// import MovieCard from '../../Admin/components/MovieCard';
import API from '../../../api/User/api.client';

const AdminDashboardPage = () => {
  // Dữ liệu giả định cho Active Movies
  const activeMovies = [
    { title: 'Alita Battle Angel 4k 2019 Movies', rating: 4.5, price: 29 },
    { title: 'Alita Battle Angel 4k 2019 Movies', rating: 4.5, price: 29 },
    { title: 'Alita Battle Angel 4k 2019 Movies', rating: 4.5, price: 29 },
  ];

  const [dataBuffer, setDataBuffer] = useState([]);

  const fetchMovieData = async () => {
      try {
        const res = await API.get('/');
        console.log("Dữ liệu lấy từ API: ", res);

        const movie = res.data;
        console.log("Convert Dữ liệu: ", movie);

        setDataBuffer(movie);

      } catch (error) {
        console.log("Lỗi từ hàm lấy dữ liệu phim từ Admin_DashBoard: ", error);
      }
    }

  useEffect(() => {
    fetchMovieData();
  }, [])

  const statsData = [
    { title: 'Total Bookings', value: 73, icon: 'receipt' },
    { title: 'Total Revenue', value: '$1,060', icon: 'bag' },
    { title: 'Active Movies', value: dataBuffer.length, icon: 'movie' },
    { title: 'Total Users', value: 43, icon: 'user' },
  ];



  return (
    <div className="text-white">
      <h1 className="text-3xl font-bold mb-6 text-rose-500">Admin Dashboard</h1>

      {/* 1. Thẻ thống kê */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {statsData.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* 2. Phim đang hoạt động */}
      <h2 className="text-2xl font-semibold mb-4 text-gray-300">Active Movies</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {/* {activeMovies.map((movie, index) => (
          <MovieCard key={index} movie={movie} />
        ))} */}

        <MovieCard data={dataBuffer} />
      </div>
    </div>
  );
};

export default AdminDashboardPage;