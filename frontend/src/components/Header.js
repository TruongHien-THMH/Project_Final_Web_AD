const Header = () => {
  return (
    <header className="absolute top-0 left-0 w-full z-50 flex justify-between items-center px-8 py-4 bg-transparent">
      {/* <!-- Logo --> */}
      <div className="text-2xl font-bold">
        <span className="text-pink-500">VNUK</span>Final
      </div>

      {/* <!-- Navigation --> */}
      <nav className="hidden md:flex bg-black/40 backdrop-blur-none px-8 py-2 rounded-full space-x-6 text-white text-sm">
        <span className="hover:text-pink-400 transition">Home</span>
        <span className="hover:text-pink-400 transition">Movies</span>
        <span className="hover:text-pink-400 transition">Theatres</span>
        <span className="hover:text-pink-400 transition">Releases</span>
      </nav>

      {/* <!-- Search + Login --> */}
      <div className="flex items-center space-x-4">
        <button className="text-white text-lg">
          <i className="ri-search-line"></i>
        </button>
        <button className="bg-pink-500 hover:bg-pink-600 transition text-white px-5 py-2 rounded-full">
          Log In
        </button>
      </div>
    </header>
  );
};

export default Header;
