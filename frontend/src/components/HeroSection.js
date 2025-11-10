const HeroSection = () => {
  return (
    <section
      className="relative h-screen flex items-center px-10 md:px-20 bg-black-500 bg-cover bg-center"
    >
      {/* <!-- Overlay --> */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* <!-- Nội dung phim --> */}
      <div className="relative z-10 max-w-2xl">
        <h1 className="text-5xl font-bold mb-4 leading-tight">
          Guardians of the Galaxy
        </h1>

        <div className="flex items-center text-sm text-gray-300 space-x-4 mb-4">
          <span>Action | Adventure | Sci-Fi</span>
          <span>•</span>
          <span>2018</span>
          <span>•</span>
          <span>2h 8m</span>
        </div>

        <p className="text-gray-300 mb-6">
          In a post-apocalyptic world where cities ride on wheels and consume
          each other to survive, two people meet in London and try to stop a
          conspiracy.
        </p>

        <button className="bg-pink-500 hover:bg-pink-600 transition px-6 py-3 rounded-full font-medium">
          Book Now
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
