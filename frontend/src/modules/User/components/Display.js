import BlurCircle from "./BlurCircle";
import { useNavigate } from 'react-router-dom'; // 1. Import hook

const Display = () => {
  const navigate = useNavigate(); // 2. Khởi tạo hàm navigate

  return (
    <section className="bg-[#0b0b0b] text-white py-16 px-6 md:px-16 relative">
      {/* Background Blur Circles */}
      <BlurCircle top="-100px" right="-100px" />
      <BlurCircle top="50%" left="-100px" />
      <BlurCircle bottom="-100px" right="30%" />

      {/* Tiêu đề */}
      <div className="flex justify-between items-center mb-8 relative z-10">
        <h2 className="text-2xl font-semibold">Now Showing</h2>
        <button className="text-gray-300 text-sm hover:text-rose-600 transition flex items-center gap-1 bg-transparent border-none cursor-pointer">
          View All <i className="ri-arrow-right-line"></i>
        </button>
      </div>

      {/* Grid phim (giữ nguyên) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 relative z-10">
        {/* Card 1 */}
        <div className="bg-[#141414] rounded-xl overflow-hidden shadow-lg hover:scale-[1.02] transition duration-300">
          <div className="h-56 bg-gray-700 flex items-center justify-center text-5xl font-bold">
            A
          </div>
          <div className="p-4">
            <h3 className="font-semibold mb-2">Tiêu đề phim 1</h3>
            <p className="text-sm text-gray-400 mb-4">
              2018 - Action, Adventure - 2h 8m
            </p>
            <div className="flex justify-between items-center">
              <button className="bg-rose-600 hover:bg-rose-700 transition text-white px-4 py-2 rounded-full text-sm">
                Buy Ticket
              </button>
              <div className="flex items-center gap-1 text-gray-300">
                <i className="ri-star-fill text-rose-600"></i>
                <span>4.5</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-[#141414] rounded-xl overflow-hidden shadow-lg hover:scale-[1.02] transition duration-300">
          <div className="h-56 bg-gray-700 flex items-center justify-center text-5xl font-bold">
            B
          </div>
          <div className="p-4">
            <h3 className="font-semibold mb-2">Tiêu đề phim 2</h3>
            <p className="text-sm text-gray-400 mb-4">
              2018 - Action, Adventure - 2h 8m
            </p>
            <div className="flex justify-between items-center">
              <button className="bg-rose-600 hover:bg-rose-700 transition text-white px-4 py-2 rounded-full text-sm">
                Buy Ticket
              </button>
              <div className="flex items-center gap-1 text-gray-300">
                <i className="ri-star-fill text-rose-600"></i>
                <span>4.5</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-[#141414] rounded-xl overflow-hidden shadow-lg hover:scale-[1.02] transition duration-300">
          <div className="h-56 bg-gray-700 flex items-center justify-center text-5xl font-bold">
            C
          </div>
          <div className="p-4">
            <h3 className="font-semibold mb-2">Tiêu đề phim 3</h3>
            <p className="text-sm text-gray-400 mb-4">
              2018 - Action, Adventure - 2h 8m
            </p>
            <div className="flex justify-between items-center">
              <button className="bg-rose-600 hover:bg-rose-700 transition text-white px-4 py-2 rounded-full text-sm">
                Buy Ticket
              </button>
              <div className="flex items-center gap-1 text-gray-300">
                <i className="ri-star-fill text-rose-600"></i>
                <span>4.5</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-[#141414] rounded-xl overflow-hidden shadow-lg hover:scale-[1.02] transition duration-300">
          <div className="h-56 bg-gray-700 flex items-center justify-center text-5xl font-bold">
            D
          </div>
          <div className="p-4">
            <h3 className="font-semibold mb-2">Tiêu đề phim 4</h3>
            <p className="text-sm text-gray-400 mb-4">
              2018 - Action, Adventure - 2h 8m
            </p>
            <div className="flex justify-between items-center">
              <button className="bg-rose-600 hover:bg-rose-700 transition text-white px-4 py-2 rounded-full text-sm">
                Buy Ticket
              </button>
              <div className="flex items-center gap-1 text-gray-300">
                <i className="ri-star-fill text-rose-600"></i>
                <span>4.5</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Nút "Show more" */}
      <div className="flex justify-center mt-12 relative z-10">
        <button
          onClick={() => {
            navigate('/movies'); // Giờ hàm này đã được định nghĩa
            window.scrollTo(0, 0);
          }}
          className="bg-rose-600 hover:bg-rose-700 transition text-white px-6 py-3 rounded-full text-sm font-medium"
        >
          Show more
        </button>
      </div>

    </section>

    
  );
};

export default Display;