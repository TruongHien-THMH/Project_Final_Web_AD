import React from 'react';
import HeroSection from '../components/HeroSection';
// 1. Đổi import từ Display thành MovieList
import MovieList from '../components/MovieList'; 

function HomePage() {
  return (
    <>
        <HeroSection />
        {/* 2. Sử dụng MovieList (Component đã gộp đầy đủ chức năng) */}
        <MovieList />
    </>
  );
}

export default HomePage;