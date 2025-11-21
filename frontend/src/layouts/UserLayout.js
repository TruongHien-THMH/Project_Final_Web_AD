// src/User/pages/UserLayout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../modules/User/components/Header';
import Footer from '../modules/User/components/Footer';
import BlurCircle from '../modules/User/components/BlurCircle';

function UserLayout() {
  return (
    <div className="flex flex-col bg-gray-900 min-h-screen relative overflow-hidden"> 
      
      <BlurCircle top="-100px" left="-100px" />
      <BlurCircle bottom="-150px" right="-100px" />
      <BlurCircle top="40%" left="30%" />

      <Header />


      <main className="flex-grow w-full z-10"> 
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default UserLayout;