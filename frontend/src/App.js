// src/App.js

import { BrowserRouter, Routes, Route } from 'react-router-dom';

// USER Components (Đã có sẵn)
import HomePage from './User/pages/HomePage';
// *** Đã xóa import Header và Footer vì chúng đã được chuyển vào UserLayout.js ***
// import Footer from './User/components/Footer';
// import Header from './User/components/Header';

// 1. IMPORT UserLayout mới
import UserLayout from './User/pages/UserLayout'; 

// ADMIN Components
import AdminLayout from './Admin/pages/AdminLayout';
import AdminDashboardPage from './Admin/pages/AdminDashboardPage'; 
import AddShowsPage from './Admin/pages/AddShowsPage';
import ListShowsPage from './Admin/pages/ListShowsPage';
import ListBookingsPage from './Admin/pages/ListBookingsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/Admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} /> 
          <Route path="add-shows" element={<AddShowsPage />} />
          <Route path="list-shows" element={<ListShowsPage />} />
          <Route path="list-bookings" element={<ListBookingsPage />} />
        </Route>

        <Route path="/" element={<UserLayout />}>
          <Route index element={<HomePage />} />
          
        </Route>
        {/* -------------------- */}
        
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;