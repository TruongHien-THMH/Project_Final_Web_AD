import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import { FaCalendarAlt, FaClock, FaArrowRight, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const HeroSection = () => {
  const [movies, setMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original";

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        // SỬA DÒNG NÀY:
        const res = await axios.get("http://localhost:5001/api/cinema/slider");
        
        console.log("Dữ liệu nhận được:", res.data); // Log ra để kiểm tra
        setMovies(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi gọi API:", error);
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  // 2. Tự động chuyển slide
  useEffect(() => {
    if (movies.length === 0) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 6000); // 6 giây chuyển 1 lần
    return () => clearInterval(interval);
  }, [currentIndex, movies]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === movies.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? movies.length - 1 : prev - 1));
  };

  // Nếu đang loading hoặc không có phim
  if (loading) return <div className="h-screen bg-black flex items-center justify-center text-white">Loading...</div>;
  if (movies.length === 0) return <div className="h-screen bg-black text-white">No movies found.</div>;

  const currentMovie = movies[currentIndex];

  // Xử lý link ảnh (kiểm tra xem trong DB lưu full link hay chỉ path)
  const bgImage = currentMovie.poster_path?.startsWith('http') 
    ? currentMovie.poster_path 
    : `${IMAGE_BASE_URL}${currentMovie.poster_path}`;

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black text-white">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-in-out"
        style={{ backgroundImage: `url('${bgImage}')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
      </div>

      {/* Nội dung chính */}
      <div className="relative z-10 h-full flex items-center px-10 md:px-20">
        <div className="max-w-2xl animate-fade-in">
          
          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight drop-shadow-lg">
            {currentMovie.title || currentMovie.original_title}
          </h1>

          <div className="flex flex-wrap items-center text-sm text-gray-200 gap-x-4 gap-y-2 mb-6 font-medium">
            {/* Render Genres: Xử lý trường hợp populate object hoặc mảng string */}
            <span className="text-yellow-400">
                {currentMovie.genres?.map(g => g.name || g).slice(0, 3).join(" | ")}
            </span>
            
            <span className="hidden sm:inline text-gray-500">|</span>
            
            <span className="flex items-center gap-1.5">
              <FaCalendarAlt className="text-rose-500"/> {currentMovie.release_date?.substring(0, 4)}
            </span>
          </div>

          <p className="text-gray-300 mb-8 text-base md:text-lg line-clamp-3 md:line-clamp-4 max-w-xl">
            {currentMovie.overview}
          </p>

          <div className="flex gap-4">
            <button className="bg-rose-600 hover:bg-rose-700 transition-all px-8 py-3 rounded-full font-bold flex items-center gap-2 shadow-lg hover:scale-105">          
              Watch Now
              <FaArrowRight />
            </button>
            {/* Nút phụ nếu cần */}
             <button className="border border-white/30 hover:bg-white/10 transition-all px-8 py-3 rounded-full font-medium backdrop-blur-sm">          
              Details
            </button>
          </div>
        </div>
      </div>

      {/* Nút điều hướng Trái/Phải */}
      <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-black/20 hover:bg-rose-600 text-white rounded-full backdrop-blur-md transition-all group border border-white/10">
        <FaChevronLeft className="group-hover:scale-110" size={24} />
      </button>

      <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-black/20 hover:bg-rose-600 text-white rounded-full backdrop-blur-md transition-all group border border-white/10">
        <FaChevronRight className="group-hover:scale-110" size={24} />
      </button>

      {/* Indicators (Dấu chấm) */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {movies.map((_, index) => (
          <button 
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === currentIndex ? "bg-rose-500 w-8" : "bg-gray-600 w-4 hover:bg-gray-400"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;