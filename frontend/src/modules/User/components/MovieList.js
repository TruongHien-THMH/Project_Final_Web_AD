import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Slider from "react-slick"; 
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css"; 

// Import các component con
import API from "../../../api/User/api.client";
import MovieCard from "./MovieCard";
import BlurCircle from "./BlurCircle"; 

export default function MovieList() {
    const navigate = useNavigate();
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        const getBEData = async () => {
            try {
                const res = await API.get('/'); 
                console.log("Kết nối BE thành công !!!");
                // console.log("Dữ liệu nhận được: ", res); JSON 
                setMovies(res.data); // res.data chứa dữ liệu chính
            } catch (error) {
                console.error(error);
            }
        }
        
        getBEData()
    }, [])

    const settings = {
        dots: true,
        infinite: movies.length > 4, 
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        responsive: [
            { breakpoint: 1024, settings: { slidesToShow: 3 } },
            { breakpoint: 768, settings: { slidesToShow: 2 } },
            { breakpoint: 640, settings: { slidesToShow: 1 } }
        ]
    };

    return (
        <section className="bg-[#0b0b0b] text-white py-16 px-6 md:px-16 relative">
            
            {/* CSS cho thanh ngang mờ */}
            <style>{`
                .slick-dots { position: absolute; bottom: 0px; padding: 0 16px; margin: 0; width: 100%; }
                .slick-dots li { width: 25px; height: 3px; margin: 0 4px; }
                .slick-dots li button { padding: 0; height: 100%; width: 100%; }
                .slick-dots li button:before { content: ""; height: 100%; width: 100%; background: rgba(255, 255, 255, 0.2); opacity: 1; position: absolute; top: 0; left: 0; transition: background 0.3s; }
                .slick-dots li.slick-active button:before { background: #e11d48; opacity: 1; }
            `}</style>

            {/* Hiệu ứng nền */}
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

            {/* SLIDER HIỂN THỊ DỮ LIỆU */}
            <div className="relative z-10 pb-12"> 
                {movies.length > 0 ? (
                    <Slider {...settings}>
                        
                        {/* Vòng lặp lấy dữ liệu từ biến 'movies' ở trên */}
                        {movies.map((movie) => (
                            <div key={movie._id || movie.id} className="px-3">
                                <MovieCard data={movie} /> 
                            </div>
                        ))}

                    </Slider>
                ) : (
                    <div className="text-gray-400 text-center">Đang tải phim...</div>
                )}
            </div>

            {/* Nút Show more */}
            <div className="flex justify-center mt-12 relative z-10">
                <button 
                    onClick={() => {
                        navigate('/movies');
                        window.scrollTo(0, 0);
                    }}
                    className="bg-rose-600 hover:bg-rose-700 transition text-white px-6 py-3 rounded-full text-sm font-medium">
                    Show more
                </button>
            </div>
        </section>
    );
}