import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NotFoundPage from './User/components/NotFoundPage';

// USER Components
import HomePage from './User/pages/HomePage';
import UserLayout from './User/pages/UserLayout'; 

// 1. IMPORT TRANG ĐẶT GHẾ MỚI CỦA BẠN
// (Giả sử bạn lưu file SeatBookingPage.js trong 'src/User/pages/')
import SeatBookingPage from './User/pages/SeatBookingPage';

// ADMIN Components
import AdminLayout from './Admin/pages/AdminLayout';
import AdminDashboardPage from './Admin/pages/AdminDashboardPage'; 
import AddShowsPage from './Admin/pages/AddShowsPage';
import ListShowsPage from './Admin/pages/ListShowsPage';
import ListBookingsPage from './Admin/pages/ListBookingsPage';


import MoviePage from './User/pages/MoviePage';

function App() {



  return (
    <BrowserRouter>
      <Routes>
        {/* === ADMIN ROUTES === */}
        <Route path="/Admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} /> 
          <Route path="add-shows" element={<AddShowsPage />} />
          <Route path="list-shows" element={<ListShowsPage />} />
          <Route path="list-bookings" element={<ListBookingsPage />} />
        </Route>

        {/* === USER ROUTES (SỬ DỤNG USERLAYOUT) === */}
        <Route 
          path="/" 
          element={<UserLayout />}
          >
          {/* Trang chủ */}
          <Route 
            index 
            element={<HomePage />} 
          />

          <Route 
             path="/movie/:id"
             element={<MoviePage />}
          />
          
          <Route 
            path="booking" 
            element={<SeatBookingPage />} 
          />

          <Route 
            path="*" 
            element={<NotFoundPage />} 
          />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;