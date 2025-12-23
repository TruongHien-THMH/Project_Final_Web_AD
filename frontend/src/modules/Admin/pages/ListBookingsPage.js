// src/admin/pages/ListBookingsPage.js
import React, { useState } from 'react';
import AdminTable from '../components/AdminTable';
import MaintenancePage from '../components/MaintenancePage';
  
const ListBookingsPage = () => {
    const [isMaintenance, setIsMaintenance] = useState(true);

  const headers = ['User Name', 'Movie Name', 'Show Time', 'Seats', 'Amount'];
  const data = [
    { userName: 'Ankit Sharma', movieName: 'Avatar 2', showTime: '2025-05-12 7:00PM', seats: 'A1, A2', amount: '$30' },
    { userName: 'Ankit Sharma', movieName: 'Avatar 2', showTime: '2025-05-12 7:00PM', seats: 'A1, A2', amount: '$30' },
    { userName: 'Ankit Sharma', movieName: 'Avatar 2', showTime: '2025-05-12 7:00PM', seats: 'A1, A2', amount: '$30' },
    { userName: 'Ankit Sharma', movieName: 'Avatar 2', showTime: '2025-05-12 7:00PM', seats: 'A1, A2', amount: '$30' },
  ];

if (isMaintenance) {
      return <MaintenancePage pageName="List Bookings" />;
  }

  return (

    <div className="text-white">
      <h1 className="text-3xl font-bold mb-6 text-rose-500">List Bookings</h1>
      <AdminTable headers={headers} data={data} />
    </div>
  );
};
export default ListBookingsPage;