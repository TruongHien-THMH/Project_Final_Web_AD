const NowDisplay = () => {
  return (
    <section class="bg-[#0b0b0b] text-white py-16 px-6 md:px-16">
      {/* <!-- Tiêu đề --> */}
      <div class="flex justify-between items-center mb-8">
        <h2 class="text-2xl font-semibold">Now Showing</h2>
        <a
          href="#"
          class="text-gray-300 text-sm hover:text-pink-400 transition flex items-center gap-1"
        >
          View All <i class="ri-arrow-right-line"></i>
        </a>
      </div>

      {/* <!-- Grid phim --> */}
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {/* <!-- Card 1 --> */}
        <div class="bg-[#141414] rounded-xl overflow-hidden shadow-lg hover:scale-[1.02] transition">
          <div class="h-56 bg-gray-700 flex items-center justify-center text-5xl font-bold">
            A
          </div>
          <div class="p-4">
            <h3 class="font-semibold mb-2">Tiêu đề phim 1</h3>
            <p class="text-sm text-gray-400 mb-4">
              2018 - Action, Adventure - 2h 8m
            </p>
            <div class="flex justify-between items-center">
              <button class="bg-pink-500 hover:bg-pink-600 transition text-white px-4 py-2 rounded-full text-sm">
                Buy Ticket
              </button>
              <div class="flex items-center gap-1 text-gray-300">
                <i class="ri-star-fill text-pink-500"></i>
                <span>4.5</span>
              </div>
            </div>
          </div>
        </div>

        {/* <!-- Card 2 --> */}
        <div class="bg-[#141414] rounded-xl overflow-hidden shadow-lg hover:scale-[1.02] transition">
          <div class="h-56 bg-gray-700 flex items-center justify-center text-5xl font-bold">
            B
          </div>
          <div class="p-4">
            <h3 class="font-semibold mb-2">Tiêu đề phim 2</h3>
            <p class="text-sm text-gray-400 mb-4">
              2018 - Action, Adventure - 2h 8m
            </p>
            <div class="flex justify-between items-center">
              <button class="bg-pink-500 hover:bg-pink-600 transition text-white px-4 py-2 rounded-full text-sm">
                Buy Ticket
              </button>
              <div class="flex items-center gap-1 text-gray-300">
                <i class="ri-star-fill text-pink-500"></i>
                <span>4.5</span>
              </div>
            </div>
          </div>
        </div>

        {/* <!-- Card 3 --> */}
        <div class="bg-[#141414] rounded-xl overflow-hidden shadow-lg hover:scale-[1.02] transition">
          <div class="h-56 bg-gray-700 flex items-center justify-center text-5xl font-bold">
            C
          </div>
          <div class="p-4">
            <h3 class="font-semibold mb-2">Tiêu đề phim 3</h3>
            <p class="text-sm text-gray-400 mb-4">
              2018 - Action, Adventure - 2h 8m
            </p>
            <div class="flex justify-between items-center">
              <button class="bg-pink-500 hover:bg-pink-600 transition text-white px-4 py-2 rounded-full text-sm">
                Buy Ticket
              </button>
              <div class="flex items-center gap-1 text-gray-300">
                <i class="ri-star-fill text-pink-500"></i>
                <span>4.5</span>
              </div>
            </div>
          </div>
        </div>

        {/* <!-- Card 4 --> */}
        <div class="bg-[#141414] rounded-xl overflow-hidden shadow-lg hover:scale-[1.02] transition">
          <div class="h-56 bg-gray-700 flex items-center justify-center text-5xl font-bold">
            D
          </div>
          <div class="p-4">
            <h3 class="font-semibold mb-2">Tiêu đề phim 4</h3>
            <p class="text-sm text-gray-400 mb-4">
              2018 - Action, Adventure - 2h 8m
            </p>
            <div class="flex justify-between items-center">
              <button class="bg-pink-500 hover:bg-pink-600 transition text-white px-4 py-2 rounded-full text-sm">
                Buy Ticket
              </button>
              <div class="flex items-center gap-1 text-gray-300">
                <i class="ri-star-fill text-pink-500"></i>
                <span>4.5</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <!-- Nút "Show more" --> */}
      <div class="flex justify-center mt-12">
        <button class="bg-pink-500 hover:bg-pink-600 transition text-white px-6 py-3 rounded-full text-sm font-medium">
          Show more
        </button>
      </div>
    </section>
  );
};

export default NowDisplay;