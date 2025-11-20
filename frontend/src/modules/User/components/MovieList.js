import { useState, useEffect } from "react";
import API from "../../../api"
import MovieCard from "./MovieCard";

export default function MovieList() {
    const [moviesbuffer, setMoviesBuffer] = useState([]);
    const [gernes, setGernes] = useState({});

    useEffect(() => {
        const getBEData = async () => {
            try {
                const res = await API.get('/');
                const data = res.data;

                console.log("Dữ liệu nhận được: ", data);

                const nowPlaying = data.nowPlayingMovie;           

                console.log('Dữ liệu trả về, ', nowPlaying);

                setMoviesBuffer(nowPlaying);

            } catch (error) {
                console.log("Lấy dữ liệu phim bị lỗi: ", error);
                // res.status(500).json({message: "Lỗi từ MovieList"});
            }
        }

        getBEData()
    }, [])

    return (
      <section className="bg-[#0b0b0b] text-white py-16 px-6 md:px-16">
        {/* <!-- Tiêu đề --> */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold">Now Showing</h2>
          <button 
          className="text-gray-300 text-sm hover:text-rose-600 transition flex items-center gap-1 bg-transparent border-none cursor-pointer">
            View All <i className="ri-arrow-right-line"></i>
          </button>
        </div>

        {/* <!-- Grid phim --> */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {
            moviesbuffer.map(movie => (
              <MovieCard data={movie}/>
            ))
          }
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