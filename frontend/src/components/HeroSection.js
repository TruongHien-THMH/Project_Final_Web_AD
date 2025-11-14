// Import các icon cần thiết từ thư viện react-icons
import { FaCalendarAlt, FaClock, FaArrowRight } from 'react-icons/fa';

const HeroSection = () => {
  return (
    <section
      className="relative h-screen flex items-center px-10 md:px-20 bg-black bg-cover bg-center text-white"
      style={{ backgroundImage: "url('/herosection.jpg')" }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent"></div>

      <div className="relative z-10 max-w-2xl">
        {/* Thêm logo Marvel Studios */}
        

        <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
          Guardians of the Galaxy
        </h1>

        <div className="flex flex-wrap items-center text-sm text-gray-200 gap-x-4 gap-y-2 mb-4">
          <span>Action | Adventure | Sci-Fi</span>
          <span className="hidden sm:inline text-gray-500">|</span>
          <span className="flex items-center gap-1.5">
            <FaCalendarAlt /> 2018
          </span>
          <span className="text-gray-500">|</span>
          <span className="flex items-center gap-1.5">
            <FaClock /> 2h 8m
          </span>
        </div>

        <p className="text-gray-200 mb-6">
          In a post-apocalyptic world where cities ride on wheels and consume
          each other to survive, two people meet in London and try to stop a
          conspiracy.
        </p>

        <button className="bg-rose-600 hover:bg-rose-700 transition px-6 py-3 rounded font-medium flex items-center gap-2">         
          Explore Movies
          <FaArrowRight />
        </button>
      </div>
    </section>
  );
};

export default HeroSection;