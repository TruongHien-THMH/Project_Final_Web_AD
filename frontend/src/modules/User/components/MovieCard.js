// File: src/modules/User/components/MovieCard.js

import { Link } from "react-router";
import { Toaster, toast } from 'sonner';

// CHỈNH SỬA: Nhận prop 'data' thay vì 'movieList'
// Và đây không còn là mảng nữa, mà là MỘT đối tượng phim duy nhất.
const MovieCard = ({ data }) => { 
    
    // Kiểm tra an toàn: Nếu data không tồn tại, không render gì cả
    if (!data) {
        return null;
    }

    // Gán đối tượng phim đã nhận cho biến 'movie' để dễ dùng lại code cũ
    const movie = data;

    // LƯU Ý: Bạn cần kiểm tra xem movie.genres có phải mảng không trước khi map
    const genresList = movie.genres && Array.isArray(movie.genres) 
                       ? movie.genres.map(genre => genre.name).join(', ') 
                       : 'N/A';

    return (
        // LOẠI BỎ VÒNG LẶP .map và .length
        <div className="bg-[#141414] rounded-xl overflow-hidden shadow-lg hover:scale-[1.02] transition">
            <Link
                to={`/movie/${movie.id}`}
            >
                <div className="h-56 bg-gray-700 flex items-center justify-center text-5xl font-bold">
                    <img 
                        // Sửa lại movie.poster_path thành movie.backdrop_path hoặc tùy thuộc vào API của bạn
                        src={`${process.env.REACT_APP_IMAGES}${movie.poster_path}`} 
                        alt={movie.title || movie.original_title}
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="p-4">
                    <h3 className="font-semibold mb-2">{movie.title || movie.original_title}</h3>
                    <p className="text-sm text-gray-400 mb-4">
                        {/* Lưu ý: Bạn nên lấy năm từ release_date của movie */}
                        N/A - {genresList} - 2h 8m
                    </p>
                    <div className="flex justify-between items-center">
                        <Toaster/>
                        <button 
                            className="bg-rose-600 hover:bg-rose-700 transition text-white px-4 py-2 rounded-full text-sm"
                        >
                            Buy Ticket
                        </button>
                        <div className="flex items-center gap-1 text-gray-300">
                            <i className="ri-star-fill text-rose-600"></i>
                            <span>4.5</span>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default MovieCard;