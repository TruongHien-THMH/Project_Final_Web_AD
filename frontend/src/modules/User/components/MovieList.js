// Demo lấy dữ liệu từ BE.

// viết hàm trả về 1 list phim
import { useState, useEffect } from "react";
import API from "../../../api"
import MovieCard from "./MovieCard";

export default function MovieList() {
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        const getBEData = async () => {
            try {
                const res = await API.get('/');
                console.log('Dữ liệu trả về, ', res);
                setMovies(res.data);
            } catch (error) {
                console.error(error);
            }
            
        }

        getBEData()
    }, [])

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

          <MovieCard data={movies} />

        </div>

        {/* <!-- Nút "Show more" --> */}
        <div className="flex justify-center mt-12">
          <button className="bg-rose-600 hover:bg-rose-700 transition text-white px-6 py-3 rounded-full text-sm font-medium">
            Show more
          </button>
        </div>
      </section>
    );
}