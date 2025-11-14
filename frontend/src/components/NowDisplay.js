import { useState, useEffect } from "react";
import MovieCard from "./MovideCard";

const NowDisplay = () => {
  const [movies, setMovive] = useState([]);

  useEffect( () => {
    const accessAPIMovie = async () => {
      try {
          const url = process.env.REACT_APP_API_BASE_URL;
          const options = {
            method: 'GET',
            headers: {
              accept: 'application/json',
              Authorization: `Bearer ${process.env.REACT_APP_API_ACCESS_TOKEN}`
            }
          };

          const res = await fetch(url, options);
          const data = await res.json();
          console.log(data);
          console.log(process.env.REACT_APP_IMAGES);
          // console.log(data.results);
          setMovive(data.results);
      } catch (error) {
          console.error("Error fetching data:", error.response?.data || error.message);
          return null;
      } finally {
          console.log("Fetch is done")
      }
  };

    accessAPIMovie();
    }, [] );

  return (
    <section className="bg-[#0b0b0b] text-white py-16 px-6 md:px-16">
      {/* <!-- Tiêu đề --> */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold">Now Showing</h2>
        <button className="text-gray-300 text-sm hover:text-rose-600 transition flex items-center gap-1 bg-transparent border-none cursor-pointer">
          View All <i className="ri-arrow-right-line"></i>
        </button>
      </div>

      {/* <!-- Grid phim --> */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {/* <!-- Card 1 --> */}
        <div className="bg-[#141414] rounded-xl overflow-hidden shadow-lg hover:scale-[1.02] transition">
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

        {/* <!-- Card 2 --> */}
        <div className="bg-[#141414] rounded-xl overflow-hidden shadow-lg hover:scale-[1.02] transition">
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

        {/* <!-- Card 3 --> */}
        <div className="bg-[#141414] rounded-xl overflow-hidden shadow-lg hover:scale-[1.02] transition">
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

        {/* <!-- Card 4 --> */}
        <div className="bg-[#141414] rounded-xl overflow-hidden shadow-lg hover:scale-[1.02] transition">
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

      {/* <!-- Nút "Show more" --> */}
      <div className="flex justify-center mt-12">
        <button className="bg-rose-600 hover:bg-rose-700 transition text-white px-6 py-3 rounded-full text-sm font-medium">
          Show more
        </button>
      </div>
    </section>

    
  );
};

export default NowDisplay;