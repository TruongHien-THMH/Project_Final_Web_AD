// src/User/pages/UserLayout.js

import React from 'react';
import { Outlet } from 'react-router-dom';

// Import Header và Footer từ components
import Header from '../components/Header';
import Footer from '../components/Footer';

function UserLayout() {
  return (
    <>
      {/* Header sẽ hiển thị ở đây */}
      <Header />
      
      <main>
        {/* Outlet là nơi các Route con (ví dụ: HomePage) sẽ được render */}
        <Outlet />
      </main>

      {/* Footer sẽ hiển thị ở đây */}
      <Footer />
    </>
  );
}

export default UserLayout;