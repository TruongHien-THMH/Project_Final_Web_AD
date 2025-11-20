// src/admin/pages/ListShowsPage.js
import React from 'react';
import AdminTable from '../components/AdminTable';

const ListShowsPage = () => {
  const headers = ['Movie Name', 'Show Time', 'Total Booking', 'Earning'];
  const data = [
    { movieName: 'Avatar 2', showTime: '2025-05-12 7:00PM', totalBooking: 221, earning: '$30' },
    { movieName: 'Avatar 2', showTime: '2025-05-12 7:00PM', totalBooking: 343, earning: '$30' },
    { movieName: 'Avatar 2', showTime: '2025-05-12 7:00PM', totalBooking: 542, earning: '$30' },
    { movieName: 'Avatar 2', showTime: '2025-05-12 7:00PM', totalBooking: 123, earning: '$30' },
  ];

  return (
    <div className="text-white">
      <h1 className="text-3xl font-bold mb-6 text-rose-500">List Shows</h1>
      <AdminTable headers={headers} data={data} />
    </div>
  );
};

export default ListShowsPage;