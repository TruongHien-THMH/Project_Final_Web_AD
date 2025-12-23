import React, { useState } from "react";
import { Link, useLocation} from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import UserProfileModal from "../../../ components/ui/UserProfileModal";

const Header = () => {
  // Lấy user, hàm logout và hàm mở modal từ Context
  const { user, logout, openAuthModal } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const location = useLocation();
  
  const getLinkClass = (path) => {
      return location.pathname === path 
        ? "text-rose-500 font-bold" 
        : "text-white hover:text-rose-500 transition font-medium";
  };

  const renderNavLinks = () => {
    if (user) {
      return (
        <>
          <Link to="/" className={getLinkClass("/")}>
            Home
          </Link>
          <Link
            to="/my-bookings"
            className={getLinkClass("/my-bookings")} // Xóa class cứng, dùng hàm dynamic
          >
            MyBooking
          </Link>
        </>
      );
    }
    return (
      <>
        <Link to="/" className={getLinkClass("/")}>
          Home
        </Link>
        <span className="text-white hover:text-rose-700 transition cursor-pointer">
          Movies
        </span>
        <span className="text-white hover:text-rose-700 transition cursor-pointer">
          Theatres
        </span>
      </>
    );
  };

  return (
    <>
      <header className="absolute top-0 left-0 w-full z-50 flex justify-between items-center px-8 py-4 bg-transparent">
        {/* */}
        <Link to="/" className="text-2xl font-bold cursor-pointer select-none">
          <span className="text-rose-600">VN</span>
          <span className="text-white">UKCinemas</span>
        </Link>

        {/* */}
        <nav className="hidden md:flex bg-black/40 backdrop-blur-md px-8 py-2 rounded-full space-x-6 text-white text-sm border border-white/10">
          {renderNavLinks()}
        </nav>

        {/* */}
        <div className="flex items-center space-x-4">
          <button className="text-white text-lg hover:text-rose-500 transition">
            <i className="ri-search-line"></i>
          </button>

          {/* LOGIC KIỂM TRA ĐĂNG NHẬP */}
          {user ? (
            <div className="flex items-center gap-3 animate-in fade-in duration-300">
              {/* CLICK VÀO ĐÂY ĐỂ MỞ MODAL PROFILE */}
              <div
                onClick={() => setIsProfileOpen(true)}
                className="hidden md:flex flex-col items-end mr-2 cursor-pointer group"
              >
                <span className="text-white text-sm font-bold leading-none group-hover:text-rose-500 transition">
                  {user.fullname}
                </span>
                <span className="text-[10px] text-gray-400 uppercase tracking-wider">
                  {user.role || "Member"}
                </span>
              </div>

              <div
                onClick={() => setIsProfileOpen(true)}
                className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-600 to-purple-600 p-[1px] cursor-pointer hover:scale-110 transition"
              >
                <img
                  src={
                    user.avatar ||
                    `https://ui-avatars.com/api/?name=${user.fullname}&background=random`
                  }
                  alt="User"
                  className="w-full h-full rounded-full object-cover bg-black"
                />
              </div>

              <button
                onClick={logout}
                className="bg-gray-800/80 hover:bg-gray-700 border border-gray-600 transition text-white text-sm px-4 py-2 rounded-full"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={openAuthModal}
              className="bg-rose-600 hover:bg-rose-700 hover:shadow-lg hover:shadow-rose-900/40 transition text-white px-6 py-2 rounded-full font-medium animate-in fade-in duration-300"
            >
              Log In
            </button>
          )}
        </div>
      </header>
      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </>
  );
};

export default Header;
