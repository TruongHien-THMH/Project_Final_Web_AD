// src/User/pages/UserLayout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../modules/User/components/Header';
import Footer from '../modules/User/components/Footer';

function UserLayout() {
  return (
    <>
      <Header/>
      <main>
        <Outlet/>
      </main>
      <Footer/>
    </>
  );
}

export default UserLayout;
